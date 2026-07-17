// Parseur JSON en FLUX, path-aware (PANO-91 — approche B, le chantier « SAX » annoncé par
// `parse.ts`). Il existe pour UNE raison mémoire : le
// `JSON.parse` natif (approche A) matérialise d'un coup TOUT le graphe (pic rss ≈ 11× le poids du
// JSON — cf. `scale.test.ts`), et la validation valibot en clone une 2ᵉ copie. Sur un export à 10⁴–10⁵
// items de visionnage, ce pic transitoire tue le Worker mobile.
//
// PRINCIPE. Descente récursive sur la chaîne décompressée, avec un HOOK DE REPLI (`fold`) : quand le
// parseur s'apprête à lire un TABLEAU dont le chemin de clés correspond à un replieur, il n'accumule
// PAS les éléments dans un `[]` — il parse chaque élément, le passe à `fold.onItem`, puis le laisse
// devenir collectable AVANT le suivant. Le transitoire retenu pour ce tableau tombe alors de N items
// à UN seul. Tout le reste (petites sections) est matérialisé normalement en JS plain-data.
//
// POURQUOI une chaîne, pas les octets. On décode la totalité en `string` une fois (`strFromU8`) —
// borné (~le poids du JSON), et de toute façon `JSON.parse` tient la même chaîne en interne : aucune
// régression. Le gain n'a JAMAIS été la chaîne, c'est le GRAPHE d'objets que ce parseur n'érige pas
// pour le tableau replié. Parcours par index + `charCodeAt` (pas de `slice` par caractère).
//
// FIDÉLITÉ. Sémantique alignée sur `JSON.parse` pour ce dont l'export a besoin : objets, tableaux,
// chaînes (avec échappements `\" \\ \/ \b \f \n \r \t \uXXXX` + paires de substitution), nombres
// (signe, décimales, exposant), `true`/`false`/`null`, blancs standards. Toute entrée malformée LÈVE
// `JsonStreamError` — le parseur ne devine jamais (l'appelant mappe vers un échec `invalid_json`).
// Limite assumée (héritée d'approche A, cf. `parse.ts`) : les clés dupliquées dans un même objet sont
// écrasées « dernière gagne », comme `JSON.parse`.

/** Erreur de parsing — position (offset caractère) incluse pour le diagnostic, jamais la valeur. */
export class JsonStreamError extends Error {
  constructor(
    message: string,
    readonly offset: number,
  ) {
    super(`${message} (offset ${offset})`);
    this.name = 'JsonStreamError';
  }
}

/**
 * Replieur d'un tableau à un chemin donné. `onItem` reçoit chaque élément parsé (puis oublié) ;
 * `finalize` rend la valeur qui REMPLACE le tableau dans le graphe (agrégat compact, ou liste
 * projetée — au choix du consommateur). Un tableau replié ne retient jamais ses N éléments.
 */
export interface ArrayFold {
  onItem(value: unknown): void;
  finalize(): unknown;
}

/**
 * Fournit un replieur pour le chemin de clés courant, ou `null` pour matérialiser normalement.
 * `path` est la pile des clés d'objet traversées (les index de tableau n'y figurent pas — le repli
 * est décidé sur la STRUCTURE, pas sur une position). Appelé à l'entrée de chaque tableau.
 */
export type FoldResolver = (path: readonly string[]) => ArrayFold | null;

// Codes de caractères chauds (évite les comparaisons de littéraux dans la boucle).
enum C {
  Tab = 9,
  LF = 10,
  CR = 13,
  Space = 32,
  Quote = 34, // "
  Plus = 43, // +
  Comma = 44, // ,
  Minus = 45, // -
  Dot = 46, // .
  Zero = 48,
  Nine = 57,
  Colon = 58, // :
  LBracket = 91, // [
  Backslash = 92, // \
  RBracket = 93, // ]
  LBrace = 123, // {
  RBrace = 125, // }
}

/**
 * Parse `text` (JSON complet) en une valeur plain-data, en REPLIANT les tableaux désignés par
 * `resolveFold`. Lève `JsonStreamError` sur toute malformation. Empreinte : le graphe des sections
 * NON repliées + un seul élément transitoire par tableau replié.
 */
export function parseJsonStream(text: string, resolveFold: FoldResolver): unknown {
  let i = 0;
  const n = text.length;
  const path: string[] = [];

  function fail(message: string): never {
    throw new JsonStreamError(message, i);
  }

  function skipWs(): void {
    while (i < n) {
      const c = text.charCodeAt(i);
      if (c === C.Space || c === C.LF || c === C.Tab || c === C.CR) {
        i += 1;
      } else {
        break;
      }
    }
  }

  function parseString(): string {
    // Pré-condition : text[i] === '"'. Sortie : i juste après la quote fermante.
    i += 1; // consomme l'ouvrante
    let out = '';
    let runStart = i; // début du segment sans échappement (copié en bloc)
    while (i < n) {
      const c = text.charCodeAt(i);
      if (c === C.Quote) {
        out += text.slice(runStart, i);
        i += 1;
        return out;
      }
      if (c === C.Backslash) {
        out += text.slice(runStart, i);
        i += 1;
        out += parseEscape();
        runStart = i;
        continue;
      }
      if (c < 0x20) {
        fail('caractère de contrôle non échappé dans une chaîne');
      }
      i += 1;
    }
    return fail('chaîne non terminée');
  }

  function parseEscape(): string {
    // Pré-condition : i pointe le caractère APRÈS le backslash.
    const c = text.charCodeAt(i);
    i += 1;
    switch (c) {
      case C.Quote:
        return '"';
      case C.Backslash:
        return '\\';
      case 47: // /
        return '/';
      case 98: // b
        return '\b';
      case 102: // f
        return '\f';
      case 110: // n
        return '\n';
      case 114: // r
        return '\r';
      case 116: // t
        return '\t';
      case 117: // u
        return parseUnicodeEscape();
      default:
        return fail('séquence d’échappement invalide');
    }
  }

  function parseUnicodeEscape(): string {
    // Pré-condition : i pointe le 1er des 4 hex après `\u`.
    if (i + 4 > n) {
      fail('échappement unicode tronqué');
    }
    const hex = text.slice(i, i + 4);
    if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
      fail('échappement unicode invalide');
    }
    i += 4;
    return String.fromCharCode(Number.parseInt(hex, 16));
  }

  function parseNumber(): number {
    const start = i;
    if (text.charCodeAt(i) === C.Minus) {
      i += 1;
    }
    while (i < n) {
      const c = text.charCodeAt(i);
      if (
        (c >= C.Zero && c <= C.Nine) ||
        c === C.Dot ||
        c === C.Plus ||
        c === C.Minus ||
        c === 101 || // e
        c === 69 // E
      ) {
        i += 1;
      } else {
        break;
      }
    }
    const slice = text.slice(start, i);
    const value = Number(slice);
    if (Number.isNaN(value) || slice.length === 0) {
      i = start;
      fail('nombre invalide');
    }
    return value;
  }

  function expectLiteral(word: string, value: unknown): unknown {
    if (text.startsWith(word, i)) {
      i += word.length;
      return value;
    }
    return fail(`littéral attendu: ${word}`);
  }

  function parseArray(): unknown {
    // Pré-condition : text[i] === '['. Le repli est décidé ICI, sur `path` courant.
    const fold = resolveFold(path);
    i += 1; // consomme '['
    skipWs();
    if (fold === null) {
      const arr: unknown[] = [];
      if (text.charCodeAt(i) === C.RBracket) {
        i += 1;
        return arr;
      }
      for (;;) {
        arr.push(parseValue());
        skipWs();
        const c = text.charCodeAt(i);
        if (c === C.Comma) {
          i += 1;
          skipWs();
          continue;
        }
        if (c === C.RBracket) {
          i += 1;
          return arr;
        }
        return fail('virgule ou ] attendu dans un tableau');
      }
    }
    // Chemin REPLIÉ : chaque élément est parsé, poussé au replieur, puis oublié.
    if (text.charCodeAt(i) === C.RBracket) {
      i += 1;
      return fold.finalize();
    }
    for (;;) {
      fold.onItem(parseValue());
      skipWs();
      const c = text.charCodeAt(i);
      if (c === C.Comma) {
        i += 1;
        skipWs();
        continue;
      }
      if (c === C.RBracket) {
        i += 1;
        return fold.finalize();
      }
      return fail('virgule ou ] attendu dans un tableau');
    }
  }

  function parseObject(): Record<string, unknown> {
    // Pré-condition : text[i] === '{'.
    i += 1; // consomme '{'
    const obj: Record<string, unknown> = {};
    skipWs();
    if (text.charCodeAt(i) === C.RBrace) {
      i += 1;
      return obj;
    }
    for (;;) {
      skipWs();
      if (text.charCodeAt(i) !== C.Quote) {
        return fail('clé de chaîne attendue dans un objet');
      }
      const key = parseString();
      skipWs();
      if (text.charCodeAt(i) !== C.Colon) {
        return fail('deux-points attendu après une clé');
      }
      i += 1;
      skipWs();
      path.push(key);
      obj[key] = parseValue();
      path.pop();
      skipWs();
      const c = text.charCodeAt(i);
      if (c === C.Comma) {
        i += 1;
        continue;
      }
      if (c === C.RBrace) {
        i += 1;
        return obj;
      }
      return fail('virgule ou } attendu dans un objet');
    }
  }

  function parseValue(): unknown {
    skipWs();
    if (i >= n) {
      return fail('valeur attendue, fin d’entrée atteinte');
    }
    const c = text.charCodeAt(i);
    switch (c) {
      case C.LBrace:
        return parseObject();
      case C.LBracket:
        return parseArray();
      case C.Quote:
        return parseString();
      case 116: // t
        return expectLiteral('true', true);
      case 102: // f
        return expectLiteral('false', false);
      case 110: // n
        return expectLiteral('null', null);
      default:
        if (c === C.Minus || (c >= C.Zero && c <= C.Nine)) {
          return parseNumber();
        }
        return fail('valeur inattendue');
    }
  }

  const result = parseValue();
  skipWs();
  if (i < n) {
    fail('contenu superflu après la valeur racine');
  }
  return result;
}
