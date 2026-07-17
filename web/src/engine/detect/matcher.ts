// Matcher lexical — la MÉCANIQUE de repérage, extraite de `detect.ts` (PANO-87 ; fork 5 de l'audit
// d'architecture). Ce module répond à UNE seule question, positionnelle :
//
//     « où ce marqueur apparaît-il dans ce texte normalisé ? »  →  un `Span`, ou `null`.
//
// Il ne porte AUCUNE doctrine : ni négation, ni citation, ni 3ᵉ personne, ni étage, ni confiance.
// Il ne sait pas ce qu'un hit VEUT DIRE — c'est le métier de `detect.ts`, qui compose ce matcher
// avec les filtres du soin. La séparation est le but : le fichier de doctrine ne doit pas se lire
// comme un moteur de regex.
//
// POURQUOI ce code est difficile (et pourquoi ce n'est PAS de la sur-ingénierie) : le coût du
// matching venait d'UNE regex mask-tolérante COMPILÉE PAR MARQUEUR × PAR TEXTE (~milliers de
// marqueurs × ~centaines d'items → ~1 s, le gel du Worker mesuré en PANO-87). Tout ce fichier est la
// suppression de cette compilation — une ré-implémentation à la main de la sémantique opératoire du
// moteur de regex, à l'identique. C'est de la complexité de PERFORMANCE, mesurée, et elle est
// désormais confinée ici.
//
// Deux tolérances de VARIATION par pattern (PANO-36) vivent ici, parce qu'elles sont du repérage :
//   - AUTO-CENSURE symbolique : un marqueur matche aussi ses formes masquées (première et dernière
//     lettres de chaque mot intactes, lettres intérieures remplaçables par `* @ # .`) — « c*nne »
//     matche « conne ». Sûr par construction : un mot innocent ne contient pas de symbole de
//     masquage, et l'auto-censure est un aveu. Appliqué uniformément, jamais par label ;
//   - pluriel `s?` et frontières de mot `[a-z0-9]`.
// (Le tiret↔espace vit dans `normalize-fr` ; la garde d'ALLONGEMENT est un choix de doctrine et
// reste dans `detect.ts`.)
//
// ÉQUIVALENCE : chaque chemin ci-dessous rend le MÊME `{start,end}` (leftmost) que l'ancienne regex
// `(?<![a-z0-9])${markerBody}s?(?![a-z0-9])` — donc mêmes filtres et mêmes formes de surface.

import { SELF_DECLARATION_HEADS, SELF_DECLARATION_MODIFIERS } from './filters';
import { type NormalizedText, normalizeFr } from './normalize-fr';

/** Position d'un match dans le normalisé : `[start, end)`, comme `m.index` / `m.index + m[0].length`. */
export interface Span {
  start: number;
  end: number;
}

// --- Mémoïsation des constantes de lexique -----------------------------------------------------

/**
 * `normalizeFr(s).norm` MÉMOÏSÉ (PANO-87). Les marqueurs/termes sont des CONSTANTES de lexique
 * re-normalisées défensivement à chaque hit — soit marqueurs × textes appels (~10⁵ sur le vrai
 * export), chacun allouant les cartes d'offsets de `normalizeFr` pour n'en garder que `.norm`. Le
 * résultat ne dépend que de la chaîne → cache global. (Les TEXTES, eux, ont besoin des cartes
 * d'offsets et gardent `normalizeFr` plein, hors de ce cache.)
 */
const normStringCache = new Map<string, string>();
export function normString(s: string): string {
  let cached = normStringCache.get(s);
  if (cached === undefined) {
    cached = normalizeFr(s).norm;
    normStringCache.set(s, cached);
  }
  return cached;
}

// --- Primitives de caractère -------------------------------------------------------------------

/** `c` est-il alphanumérique `[a-z0-9]` (la classe des frontières de mot du matcher) ? */
function isAlnum(code: number): boolean {
  return (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
}

/** `c` est-il un symbole de masquage d'auto-censure `[*@#.]` (lettre intérieure de `markerBody`) ? */
function isMaskChar(ch: string): boolean {
  return ch === '*' || ch === '@' || ch === '#' || ch === '.';
}

/**
 * SPEC de masquage d'un marqueur (mémoïsé) : `maskable[k] = true` si le caractère `k` du marqueur est
 * une lettre INTÉRIEURE d'un mot ≥ 3 (donc remplaçable par `[*@#.]`) ; `false` pour les
 * premières/dernières lettres, les mots < 3, et les espaces (littéraux). Réplique la structure de
 * `markerBody` sans compiler de regex. Un marqueur multi-mots est une suite de mots séparés par un
 * espace unique (comme `markerBody` les joint).
 */
const markerSpecCache = new Map<string, readonly boolean[]>();
function markerSpec(marker: string): readonly boolean[] {
  const cached = markerSpecCache.get(marker);
  if (cached !== undefined) {
    return cached;
  }
  const maskable = new Array<boolean>(marker.length).fill(false);
  let offset = 0;
  for (const word of marker.split(' ')) {
    if (word.length >= 3) {
      for (let k = 1; k < word.length - 1; k++) {
        maskable[offset + k] = true;
      }
    }
    offset += word.length + 1; // +1 pour l'espace séparateur
  }
  markerSpecCache.set(marker, maskable);
  return maskable;
}

// --- FAST-PATH de repérage (PANO-87) -----------------------------------------------------------
// Dans le cas COURANT, la regex est inutile : un marqueur mono-mot en `[a-z0-9]` matche, en frontière
// de mot, EXACTEMENT un « run » maximal `[a-z0-9]+` du texte égal au marqueur ou au marqueur + `s`
// (pluriel `s?`). Comme `normalizeFr` retire les accents, les runs coïncident avec les frontières
// `(?<![a-z0-9])` de la regex — l'équivalence est EXACTE (même `{start,end}`). On réserve le scan
// char-par-char aux cas qui SEULS peuvent diverger : marqueur multi-mot ou non `[a-z0-9]`
// (apostrophe…), OU texte portant un masque INTRA-mot (`c*nne` — alnum·masque·alnum ; un point de fin
// de phrase n'y touche pas).

/** Index de repérage O(1) d'un texte normalisé (construit une fois, mémoïsé par `NormalizedText`). */
interface TokenIndex {
  /** Run `[a-z0-9]+` → offset (dans `norm`) de sa PREMIÈRE occurrence (= 1er match regex = leftmost). */
  firstStart: Map<string, number>;
  /** `norm` porte-t-il un masque INTRA-mot (`alnum·[*@#.]+·alnum`) ? Si oui, seul le scan est fidèle. */
  hasIntraMask: boolean;
}

const WORD_RUN = /[a-z0-9]+/g;
/** Masque d'auto-censure en position INTÉRIEURE (« c*nne », « co.ol ») — pas un point de fin de phrase. */
const INTRA_MASK = /[a-z0-9][*@#.]+[a-z0-9]/;
const SIMPLE_MARKER = /^[a-z0-9]+$/;

const tokenIndexCache = new WeakMap<NormalizedText, TokenIndex>();
const simpleMarkerCache = new Map<string, boolean>();

/** Le marqueur est-il éligible au fast-path (mono-mot, uniquement `[a-z0-9]`) ? Mémoïsé. */
function isSimpleMarker(marker: string): boolean {
  let simple = simpleMarkerCache.get(marker);
  if (simple === undefined) {
    simple = SIMPLE_MARKER.test(marker);
    simpleMarkerCache.set(marker, simple);
  }
  return simple;
}

/** Index de repérage d'un texte (mémoïsé) : offsets des runs + présence d'un masque intra-mot. */
function tokenIndex(text: NormalizedText): TokenIndex {
  const cached = tokenIndexCache.get(text);
  if (cached !== undefined) {
    return cached;
  }
  const firstStart = new Map<string, number>();
  for (const match of text.norm.matchAll(WORD_RUN)) {
    if (!firstStart.has(match[0])) {
      firstStart.set(match[0], match.index);
    }
  }
  const index: TokenIndex = { firstStart, hasIntraMask: INTRA_MASK.test(text.norm) };
  tokenIndexCache.set(text, index);
  return index;
}

/**
 * Repérage O(1) d'un marqueur SIMPLE dans un texte SANS masque intra-mot : le run leftmost égal à
 * `marker` (base) ou `marker + s` (pluriel). Rend le MÊME `{start,end}` que la regex mask-tolérante.
 */
function tokenFind(index: TokenIndex, marker: string): Span | null {
  const base = index.firstStart.get(marker);
  const plural = index.firstStart.get(`${marker}s`);
  if (base === undefined) {
    return plural === undefined ? null : { start: plural, end: plural + marker.length + 1 };
  }
  if (plural === undefined || base <= plural) {
    return { start: base, end: base + marker.length };
  }
  return { start: plural, end: plural + marker.length + 1 };
}

/**
 * Repérage d'un marqueur SANS regex : réplique EXACTEMENT
 * `(?<![a-z0-9])${markerBody}s?(?![a-z0-9])` (PANO-36) char par char — première/dernière lettres de
 * CHAQUE mot littérales, lettres intérieures (mot ≥ 3) masquables `[*@#.]`, espaces littéraux,
 * pluriel `s?`, frontières de mot `[a-z0-9]`. Rend le MÊME `{start,end}` (leftmost) que la regex.
 * C'est ce qui ÉVITE la COMPILATION d'un motif par marqueur (le vrai coût à froid, PANO-87) —
 * auto-censure et multi-mots inclus, à l'identique.
 */
function specFind(norm: string, marker: string): Span | null {
  const maskable = markerSpec(marker);
  const len = marker.length;
  const limit = norm.length - len;
  for (let pos = 0; pos <= limit; pos++) {
    if (pos > 0 && isAlnum(norm.charCodeAt(pos - 1))) {
      continue; // frontière gauche
    }
    let ok = true;
    for (let k = 0; k < len; k++) {
      const ch = norm[pos + k] as string;
      if (ch !== marker[k] && !(maskable[k] && isMaskChar(ch))) {
        ok = false;
        break;
      }
    }
    if (!ok) {
      continue;
    }
    const end = pos + len;
    // `s?(?![a-z0-9])` : le pluriel est tenté d'abord (gourmand), puis la frontière droite.
    if (norm[end] === 's') {
      if (end + 1 >= norm.length || !isAlnum(norm.charCodeAt(end + 1))) {
        return { start: pos, end: end + 1 };
      }
      continue; // « s » suivi d'alnum : ni pluriel ni base ne ferment la frontière → pas de hit ici
    }
    if (end >= norm.length || !isAlnum(norm.charCodeAt(end))) {
      return { start: pos, end };
    }
  }
  return null;
}

/**
 * Première occurrence du marqueur en FRONTIÈRE DE MOT dans le normalisé (tout minuscules) : pas de
 * caractère alphanumérique collé de part et d'autre. L'apostrophe compte comme frontière
 * (« l'anxiete » matche « anxiete ») ; les tirets sont déjà des espaces (normalize-fr). Le repérage
 * tolère les formes auto-censurées (cf. `specFind`).
 *
 * FAST-PATH (PANO-87) : marqueur simple + texte sans masque intra-mot → lookup O(1) sur les runs.
 * Sinon (multi-mot / apostrophe / masque) → `specFind` (scan char-par-char, sans regex). Les deux
 * sont bit-pour-bit équivalents à l'ancienne regex. Prend un `NormalizedText` (et non le seul `norm`)
 * pour porter l'index mémoïsé.
 */
export function findMarker(text: NormalizedText, marker: string): Span | null {
  if (isSimpleMarker(marker)) {
    const index = tokenIndex(text);
    // Cas COURANT (marqueur mono-mot, texte sans masque intra-mot) → lookup O(1).
    if (!index.hasIntraMask) {
      return tokenFind(index, marker);
    }
  }
  // Tout le reste (multi-mots, apostrophe, ou texte masqué) → scan char-par-char, SANS regex :
  // c'est ce qui supprime la compilation d'un motif par marqueur, le vrai coût à froid (PANO-87).
  return specFind(text.norm, marker);
}

// --- Guillemets ---------------------------------------------------------------------------------

const REGEX_SPECIALS = /[.*+?^${}()|[\]\\]/g;

function escapeRegex(s: string): string {
  return s.replace(REGEX_SPECIALS, '\\$&');
}

/**
 * Le marqueur apparaît-il À L'INTÉRIEUR d'un segment entre guillemets ? Question purement
 * positionnelle — ce qu'on en CONCLUT (discours rapporté → attribué à autrui) est de la doctrine et
 * vit dans `detect.ts`. Seul chemin du matcher où une regex reste compilée : elle porte sur le
 * TEXTE (une par appel), pas sur le catalogue de marqueurs — ce n'était jamais le coût de PANO-87.
 */
export function occursInsideQuotes(text: NormalizedText, marker: string): boolean {
  const quoted = new RegExp(`["«][^"»]*(?<![a-z0-9])${escapeRegex(marker)}(?![a-z0-9])[^"»]*["»]`);
  return quoted.test(text.norm);
}

// --- Auto-déclaration SANS regex (PANO-87) -----------------------------------------------------
// L'ancien `selfDeclarationPattern` compilait, PAR terme d'identité, une regex ÉNORME (têtes × modifs,
// chacune mask-tolérante, quantifieur `{0,3}`) — le coût dominant À FROID (profil : ce seul motif =
// ~90 % du temps de la 1ʳᵉ règle). On le remplace par un matcher récursif qui réplique EXACTEMENT la
// sémantique opératoire du moteur regex : quantifieur GOURMAND (consomme un modif avant d'essayer le
// terme) + alternation ORDONNÉE + BACKTRACKING (indispensable pour « un peu » : si s'engager sur « un »
// mène à l'échec, on ré-essaie « un peu »). Bit-pour-bit identique, zéro compilation.

/** `markerBody(phrase)` matché char par char à `pos` (sans frontière ni pluriel) → index de fin, ou -1. */
function bodyMatchAt(norm: string, pos: number, phrase: string): number {
  const spec = markerSpec(phrase);
  const len = phrase.length;
  if (pos + len > norm.length) {
    return -1;
  }
  for (let k = 0; k < len; k++) {
    const ch = norm[pos + k] as string;
    if (ch !== phrase[k] && !(spec[k] && isMaskChar(ch))) {
      return -1;
    }
  }
  return pos + len;
}

/** Terme d'identité à `pos` : `markerBody(term)` + pluriel `s?` + frontière droite → index de fin, ou -1. */
function termMatchEnd(norm: string, pos: number, term: string): number {
  const e = bodyMatchAt(norm, pos, term);
  if (e < 0) {
    return -1;
  }
  if (norm[e] === 's') {
    return e + 1 >= norm.length || !isAlnum(norm.charCodeAt(e + 1)) ? e + 1 : -1;
  }
  return e >= norm.length || !isAlnum(norm.charCodeAt(e)) ? e : -1;
}

/**
 * `(?:(?:mods) ){0,3} term` à partir de `r`, GOURMAND puis backtrack (réplique le moteur regex) :
 * on tente d'abord de consommer un modif (chaque modif dans l'ordre de la liste, avec backtracking
 * par la récursion), et SEULEMENT sinon on tente le terme à la position courante. Rend l'index de fin
 * du terme (pluriel inclus), ou -1.
 */
function matchModsThenTerm(norm: string, r: number, budget: number, term: string): number {
  if (budget > 0) {
    for (const mod of SELF_DECLARATION_MODIFIERS) {
      const mq = bodyMatchAt(norm, r, mod);
      if (mq >= 0 && norm[mq] === ' ') {
        const res = matchModsThenTerm(norm, mq + 1, budget - 1, term);
        if (res >= 0) {
          return res;
        }
      }
    }
  }
  return termMatchEnd(norm, r, term);
}

/**
 * Le texte peut-il PORTER une auto-déclaration ? Le pattern EXIGE une copule de tête (« je suis »…) :
 * sans masque intra-mot, chaque tête ne matche que sa forme exacte → si AUCUNE n'apparaît en
 * sous-chaîne, le pattern ne peut pas matcher. Court-circuit (PANO-87) évalué UNE fois par texte, en
 * amont de la boucle sur les termes : la plupart des textes n'ont pas de copule → gros gain à froid.
 * Sur texte masqué (rare), on ne court-circuite pas (seul le scan complet est fidèle).
 */
export function canSelfDeclare(text: NormalizedText): boolean {
  if (tokenIndex(text).hasIntraMask) {
    return true;
  }
  return SELF_DECLARATION_HEADS.some((head) => text.norm.includes(head));
}

/**
 * Première AUTO-DÉCLARATION d'un terme : `(?<![a-z0-9]) tête ␣ (modif ␣){0,3} terme s? (?![a-z0-9])`,
 * leftmost, chaque brique mask-tolérante. Même `{start,end}` que l'ancienne regex. La copule ancre la
 * 1ʳᵉ personne. Sans regex → aucune compilation.
 */
export function findSelfDeclaration(text: NormalizedText, term: string): Span | null {
  const norm = text.norm;
  for (let pos = 0; pos < norm.length; pos++) {
    if (pos > 0 && isAlnum(norm.charCodeAt(pos - 1))) {
      continue; // frontière gauche
    }
    for (const head of SELF_DECLARATION_HEADS) {
      const q = bodyMatchAt(norm, pos, head);
      if (q < 0 || norm[q] !== ' ') {
        continue; // tête absente, ou pas d'espace après la copule
      }
      const end = matchModsThenTerm(norm, q + 1, 3, term);
      if (end >= 0) {
        return { start: pos, end };
      }
    }
  }
  return null;
}
