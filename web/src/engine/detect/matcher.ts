// Lexical matcher — the locating MECHANICS, extracted from `detect.ts` (PANO-87; fork 5 of the
// architecture audit). This module answers ONE single, positional question:
//
//     « where does this marker appear in this normalized text? »  →  a `Span`, or `null`.
//
// It carries NO doctrine: no negation, no citation, no 3rd person, no storey, no confidence.
// It does not know what a hit MEANS — that is the job of `detect.ts`, which composes this matcher
// with the care filters. The separation is the goal: the doctrine file must not read
// like a regex engine.
//
// WHY this code is hard (and why it is NOT over-engineering): the cost of
// matching came from ONE mask-tolerant regex COMPILED PER MARKER × PER TEXT (~thousands of
// markers × ~hundreds of items → ~1 s, the Worker freeze measured in PANO-87). This whole file is the
// removal of that compilation — a hand re-implementation of the operational semantics of the
// regex engine, identically. It is PERFORMANCE complexity, measured, and it is
// now confined here.
//
// Two VARIATION tolerances per pattern (PANO-36) live here, because they are locating:
//   - symbolic SELF-CENSORSHIP: a marker also matches its masked forms (first and last
//     letters of each word intact, inner letters replaceable by `* @ # .`) — « c*nne »
//     matches « conne ». Safe by construction: an innocent word contains no masking
//     symbol, and self-censorship is a confession. Applied uniformly, never per label;
//   - plural `s?` and word boundaries `[a-z0-9]`.
// (The hyphen↔space lives in `normalize-fr`; the ELONGATION guard is a doctrine choice and
// stays in `detect.ts`.)
//
// EQUIVALENCE: each path below returns the SAME `{start,end}` (leftmost) as the old regex
// `(?<![a-z0-9])${markerBody}s?(?![a-z0-9])` — hence same filters and same surface forms.

import { SELF_DECLARATION_MODIFIERS } from './filters';
import { type NormalizedText, normalizeFr } from './normalize-fr';

/** Position of a match in the normalized text: `[start, end)`, like `m.index` / `m.index + m[0].length`. */
export interface Span {
  start: number;
  end: number;
}

// --- Memoization of lexicon constants -----------------------------------------------------

/**
 * `normalizeFr(s).norm` MEMOIZED (PANO-87). Markers/terms are lexicon CONSTANTS
 * defensively re-normalized on each hit — i.e. markers × texts calls (~10⁵ on the real
 * export), each allocating the offset maps of `normalizeFr` only to keep `.norm`. The
 * result depends only on the string → global cache. (The TEXTS, in turn, need the offset
 * maps and keep the full `normalizeFr`, outside this cache.)
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

// --- Character primitives -------------------------------------------------------------------

/** Is `c` alphanumeric `[a-z0-9]` (the matcher's word-boundary class)? */
function isAlnum(code: number): boolean {
  return (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
}

/** Is `c` a self-censorship masking symbol `[*@#.]` (inner letter of `markerBody`)? */
function isMaskChar(ch: string): boolean {
  return ch === '*' || ch === '@' || ch === '#' || ch === '.';
}

/**
 * Masking SPEC of a marker (memoized): `maskable[k] = true` if character `k` of the marker is
 * an INNER letter of a word ≥ 3 (hence replaceable by `[*@#.]`); `false` for the
 * first/last letters, words < 3, and spaces (literal). Replicates the structure of
 * `markerBody` without compiling a regex. A multi-word marker is a sequence of words separated by a
 * single space (as `markerBody` joins them).
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
    offset += word.length + 1; // +1 for the separating space
  }
  markerSpecCache.set(marker, maskable);
  return maskable;
}

// --- Locating FAST-PATH (PANO-87) -----------------------------------------------------------
// In the COMMON case, the regex is useless: a single-word marker in `[a-z0-9]` matches, at a word
// boundary, EXACTLY a maximal `[a-z0-9]+` « run » of the text equal to the marker or to the marker + `s`
// (plural `s?`). Since `normalizeFr` strips accents, the runs coincide with the regex's
// `(?<![a-z0-9])` boundaries — the equivalence is EXACT (same `{start,end}`). We reserve the
// char-by-char scan for the cases that ALONE can diverge: multi-word or non-`[a-z0-9]` marker
// (apostrophe…), OR a text carrying an INTRA-word mask (`c*nne` — alnum·mask·alnum; a sentence-final
// period does not touch it).

/** O(1) locating index of a normalized text (built once, memoized by `NormalizedText`). */
interface TokenIndex {
  /** Run `[a-z0-9]+` → offset (in `norm`) of its FIRST occurrence (= 1st regex match = leftmost). */
  firstStart: Map<string, number>;
  /** Does `norm` carry an INTRA-word mask (`alnum·[*@#.]+·alnum`)? If so, only the scan is faithful. */
  hasIntraMask: boolean;
}

const WORD_RUN = /[a-z0-9]+/g;
/** Self-censorship mask in an INNER position (« c*nne », « co.ol ») — not a sentence-final period. */
const INTRA_MASK = /[a-z0-9][*@#.]+[a-z0-9]/;
const SIMPLE_MARKER = /^[a-z0-9]+$/;

const tokenIndexCache = new WeakMap<NormalizedText, TokenIndex>();
const simpleMarkerCache = new Map<string, boolean>();

/** Is the marker eligible for the fast-path (single-word, only `[a-z0-9]`)? Memoized. */
function isSimpleMarker(marker: string): boolean {
  let simple = simpleMarkerCache.get(marker);
  if (simple === undefined) {
    simple = SIMPLE_MARKER.test(marker);
    simpleMarkerCache.set(marker, simple);
  }
  return simple;
}

/** Locating index of a text (memoized): run offsets + presence of an intra-word mask. */
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
 * O(1) locating of a SIMPLE marker in a text WITHOUT an intra-word mask: the leftmost run equal to
 * `marker` (base) or `marker + s` (plural). Returns the SAME `{start,end}` as the mask-tolerant regex.
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
 * Locating a marker WITHOUT a regex: replicates EXACTLY
 * `(?<![a-z0-9])${markerBody}s?(?![a-z0-9])` (PANO-36) char by char — first/last letters of
 * EACH word literal, inner letters (word ≥ 3) maskable `[*@#.]`, literal spaces,
 * plural `s?`, word boundaries `[a-z0-9]`. Returns the SAME `{start,end}` (leftmost) as the regex.
 * This is what AVOIDS COMPILING a pattern per marker (the real cold cost, PANO-87) —
 * self-censorship and multi-word included, identically.
 */
function specFind(norm: string, marker: string): Span | null {
  const maskable = markerSpec(marker);
  const len = marker.length;
  const limit = norm.length - len;
  for (let pos = 0; pos <= limit; pos++) {
    if (pos > 0 && isAlnum(norm.charCodeAt(pos - 1))) {
      continue; // left boundary
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
    // `s?(?![a-z0-9])`: the plural is tried first (greedy), then the right boundary.
    if (norm[end] === 's') {
      if (end + 1 >= norm.length || !isAlnum(norm.charCodeAt(end + 1))) {
        return { start: pos, end: end + 1 };
      }
      continue; // « s » followed by alnum: neither plural nor base closes the boundary → no hit here
    }
    if (end >= norm.length || !isAlnum(norm.charCodeAt(end))) {
      return { start: pos, end };
    }
  }
  return null;
}

/**
 * First occurrence of the marker at a WORD BOUNDARY in the normalized text (all lowercase): no
 * alphanumeric character stuck on either side. The apostrophe counts as a boundary
 * (« l'anxiete » matches « anxiete »); hyphens are already spaces (normalize-fr). Locating
 * tolerates the self-censored forms (cf. `specFind`).
 *
 * FAST-PATH (PANO-87): simple marker + text without intra-word mask → O(1) lookup on the runs.
 * Otherwise (multi-word / apostrophe / mask) → `specFind` (char-by-char scan, no regex). Both
 * are bit-for-bit equivalent to the old regex. Takes a `NormalizedText` (and not just `norm`)
 * to carry the memoized index.
 */
export function findMarker(text: NormalizedText, marker: string): Span | null {
  if (isSimpleMarker(marker)) {
    const index = tokenIndex(text);
    // COMMON case (single-word marker, text without intra-word mask) → O(1) lookup.
    if (!index.hasIntraMask) {
      return tokenFind(index, marker);
    }
  }
  // Everything else (multi-word, apostrophe, or masked text) → char-by-char scan, NO regex:
  // this is what removes compiling a pattern per marker, the real cold cost (PANO-87).
  return specFind(text.norm, marker);
}

// --- Quotes ---------------------------------------------------------------------------------

const REGEX_SPECIALS = /[.*+?^${}()|[\]\\]/g;

function escapeRegex(s: string): string {
  return s.replace(REGEX_SPECIALS, '\\$&');
}

/**
 * Does the marker appear INSIDE a quoted segment? A purely
 * positional question — what one CONCLUDES from it (reported speech → attributed to someone else) is doctrine and
 * lives in `detect.ts`. The only matcher path where a regex stays compiled: it bears on the
 * TEXT (one per call), not on the marker catalog — that was never the PANO-87 cost.
 *
 * ── WHAT THIS PATH COVERS, AND WHAT IT STILL DOES NOT COVER ─────────────────────────────────
 * `findMarker` carries TWO variation tolerances; this regex carried NONE, and the
 * divergence makes the citation filter fail OPEN — the only dangerous direction. Measured:
 *
 *     il a dit "le gauchiste au pouvoir"   → filtered      (singular: the two paths agree)
 *     il a dit "les gauchistes au pouvoir" → TAGGED        (plural: `findMarker` matches, not the regex)
 *
 * The `s?` below closes the PLURAL tolerance, for the six labels at once. It was
 * found on `politics` because the political epithet is written in the plural (« les fachos », « les
 * gauchistes »), but nothing in the defect was specific to this label.
 *
 * **The OTHER tolerance stays divergent, and it must be said rather than letting one believe it is filled:**
 * symbolic SELF-CENSORSHIP (`c*nne` matches `conne`, cf. `specFind`) is not replicated here. A
 * masked insult IN QUOTES therefore still escapes the citation filter. The proper fill
 * is not a third pattern to write — it is to make this test POSITIONAL (locate the quoted
 * segments, then ask whether the span returned by `findMarker` falls inside), which would inherit all
 * present and future tolerances instead of copying them. This is not done here: it changes the
 * semantics on texts with MULTIPLE occurrences (today « one occurrence quoted somewhere
 * suffices », tomorrow « is THIS occurrence quoted »), and it is not a matter of plural.
 */
export function occursInsideQuotes(text: NormalizedText, marker: string): boolean {
  const quoted = new RegExp(
    `["«][^"»]*(?<![a-z0-9])${escapeRegex(marker)}s?(?![a-z0-9])[^"»]*["»]`,
  );
  return quoted.test(text.norm);
}

// --- Self-declaration WITHOUT regex (PANO-87) -----------------------------------------------------
// The old `selfDeclarationPattern` compiled, PER identity term, a HUGE regex (heads × modifiers,
// each mask-tolerant, quantifier `{0,3}`) — the dominant COLD cost (profile: this one pattern =
// ~90% of the 1st rule's time). We replace it with a recursive matcher that replicates EXACTLY the
// operational semantics of the regex engine: GREEDY quantifier (consumes a modifier before trying the
// term) + ORDERED alternation + BACKTRACKING (indispensable for « un peu »: if committing to « un »
// leads to failure, we retry « un peu »). Bit-for-bit identical, zero compilation.

/** `markerBody(phrase)` matched char by char at `pos` (no boundary or plural) → end index, or -1. */
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

/** Identity term at `pos`: `markerBody(term)` + plural `s?` + right boundary → end index, or -1. */
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
 * `(?:(?:mods) ){0,3} term` starting from `r`, GREEDY then backtrack (replicates the regex engine):
 * we first try to consume a modifier (each modifier in list order, with backtracking
 * via the recursion), and ONLY otherwise do we try the term at the current position. Returns the end index
 * of the term (plural included), or -1.
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
 * Can the text CARRY a self-declaration? The pattern REQUIRES a head copula (« je suis »…):
 * without an intra-word mask, each head matches only its exact form → if NONE appears as a
 * substring, the pattern cannot match. Short-circuit (PANO-87) evaluated ONCE per text,
 * ahead of the loop over terms: most texts have no copula → big cold-start gain.
 * On masked text (rare), we do not short-circuit (only the full scan is faithful).
 */
export function canSelfDeclare(text: NormalizedText, heads: readonly string[]): boolean {
  if (tokenIndex(text).hasIntraMask) {
    return true;
  }
  return heads.some((head) => text.norm.includes(head));
}

/**
 * First SELF-DECLARATION of a term: `(?<![a-z0-9]) head ␣ (modifier ␣){0,3} term s? (?![a-z0-9])`,
 * leftmost, each brick mask-tolerant. Same `{start,end}` as the old regex. The copula anchors the
 * 1st person. Without regex → no compilation.
 */
export function findSelfDeclaration(
  text: NormalizedText,
  term: string,
  heads: readonly string[],
): Span | null {
  const norm = text.norm;
  for (let pos = 0; pos < norm.length; pos++) {
    if (pos > 0 && isAlnum(norm.charCodeAt(pos - 1))) {
      continue; // left boundary
    }
    for (const head of heads) {
      const q = bodyMatchAt(norm, pos, head);
      if (q < 0 || norm[q] !== ' ') {
        continue; // head absent, or no space after the copula
      }
      const end = matchModsThenTerm(norm, q + 1, 3, term);
      if (end >= 0) {
        return { start: pos, end };
      }
    }
  }
  return null;
}
