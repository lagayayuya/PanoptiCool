// STREAMING JSON parser, path-aware (PANO-91 — approach B, the "SAX" job announced by `parse.ts`).
// It exists for ONE memory reason: native `JSON.parse` (approach A) materializes the WHOLE graph at
// once (rss peak ≈ 11× the weight of the JSON — cf. `scale.test.ts`), and valibot validation clones
// a 2nd copy. On an export with 10⁴–10⁵ watch items, this transient peak kills the mobile Worker.
//
// PRINCIPLE. Recursive descent over the decompressed string, with a FOLD HOOK (`fold`): when the
// parser is about to read an ARRAY whose key path matches a folder, it does NOT accumulate the
// elements into a `[]` — it parses each element, passes it to `fold.onItem`, then lets it become
// collectable BEFORE the next one. The transient retained for that array then drops from N items to
// ONE. Everything else (small sections) is materialized normally as plain-data JS.
//
// WHY a string, not the bytes. We decode the whole thing into a `string` once (`strFromU8`) —
// bounded (~the weight of the JSON), and anyway `JSON.parse` holds the same string internally: no
// regression. The gain was NEVER the string, it is the object GRAPH that this parser does not erect
// for the folded array. Traversal by index + `charCodeAt` (no per-character `slice`).
//
// FIDELITY. Semantics aligned with `JSON.parse` for what the export needs: objects, arrays, strings
// (with escapes `\" \\ \/ \b \f \n \r \t \uXXXX` + surrogate pairs), numbers (sign, decimals,
// exponent), `true`/`false`/`null`, standard whitespace. Any malformed input THROWS `JsonStreamError`
// — the parser never guesses (the caller maps it to an `invalid_json` failure). Assumed limitation
// (inherited from approach A, cf. `parse.ts`): duplicate keys within one object are overwritten
// "last wins", like `JSON.parse`.

/** Parsing error — position (character offset) included for diagnosis, never the value. */
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
 * Folder for an array at a given path. `onItem` receives each parsed element (then forgotten);
 * `finalize` returns the value that REPLACES the array in the graph (a compact aggregate, or a
 * projected list — the consumer's choice). A folded array never retains its N elements.
 */
export interface ArrayFold {
  onItem(value: unknown): void;
  finalize(): unknown;
}

/**
 * Provides a folder for the current key path, or `null` to materialize normally. `path` is the stack
 * of object keys traversed (array indices do not appear in it — folding is decided on the STRUCTURE,
 * not on a position). Called on entry to each array.
 */
export type FoldResolver = (path: readonly string[]) => ArrayFold | null;

// Hot character codes (avoids literal comparisons in the loop).
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
 * Parses `text` (complete JSON) into a plain-data value, FOLDING the arrays designated by
 * `resolveFold`. Throws `JsonStreamError` on any malformation. Footprint: the graph of the
 * NON-folded sections + a single transient element per folded array.
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
    // Precondition: text[i] === '"'. Exit: i just after the closing quote.
    i += 1; // consume the opening one
    let out = '';
    let runStart = i; // start of the escape-free segment (copied in bulk)
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
    // Precondition: i points at the character AFTER the backslash.
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
    // Precondition: i points at the 1st of the 4 hex digits after `\u`.
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
    // Precondition: text[i] === '['. Folding is decided HERE, on the current `path`.
    const fold = resolveFold(path);
    i += 1; // consume '['
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
    // FOLDED path: each element is parsed, pushed to the folder, then forgotten.
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
    // Precondition: text[i] === '{'.
    i += 1; // consume '{'
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
