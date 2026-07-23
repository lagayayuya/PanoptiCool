// INDEXED FR normalization for lexical matching (PANO-71, PANO-70 §2.3 machinery).
//
// Lowercase + accents stripped + typographic apostrophes unified + hyphens→spaces (PANO-36:
// « burn-out » / « burn out » = a single lexicon entry).
// Key point: the normalization is INDEXED. Each character of the normalized text
// keeps the offset of its original character, so that a match in the normalized text re-projects
// EXACTLY onto the original text. This is what lets `triggerTerms` carry the SURFACE
// FORM (« Dépréssion » as typed, not normalized « depression »): the invariant
// `triggerTerms ⊂ text` (PANO-70 §2.4) is true down to the character, highlightable without re-matching.
//
// PANO-36 adds INDEXED SKELETONIZATION (repetitions of the same character reduced to a single
// occurrence): the second matching space for expressive elongations (« ftgggg »,
// « connnnard ») — see detect.ts, fallback CONDITIONED on an elongation visible in the surface.
//
// Pure TS, no DOM, zero dependency (ADR-0002).

/** Unicode combining marks (accents decomposed by NFD) — stripped from the normalized text. */
const COMBINING_MARK = /\p{M}/gu;

/** Normalized text + re-projection map to the original. */
export interface NormalizedText {
  /** Original text, intact (source of the surface forms). */
  readonly original: string;
  /** Normalized text: lowercase, no accents, `'` apostrophes. */
  readonly norm: string;
  /** `starts[i]` = offset (code units) of the original character `norm[i]` comes from. */
  readonly starts: readonly number[];
  /** `ends[i]` = offset AFTER that original character (exclusive bound). */
  readonly ends: readonly number[];
}

/**
 * Normalizes while keeping the offset map. Iteration by CODE POINT (not by code unit):
 * an original character can produce 0 (mark alone), 1 or several normalized characters —
 * all pointing to the same original character.
 */
export function normalizeFr(text: string): NormalizedText {
  let norm = '';
  const starts: number[] = [];
  const ends: number[] = [];
  let offset = 0;
  for (const char of text) {
    const next = offset + char.length;
    // Typographic apostrophe → straight; hyphen → space (PANO-36: « burn-out » ≡ « burn out »,
    // a single lexicon entry covers both spellings).
    const replaced = char === '’' ? "'" : char === '-' ? ' ' : char;
    const stripped = replaced.normalize('NFD').replace(COMBINING_MARK, '').toLowerCase();
    for (const out of stripped) {
      norm += out;
      starts.push(offset);
      ends.push(next);
    }
    offset = next;
  }
  return { original: text, norm, starts, ends };
}

/**
 * INDEXED SKELETONIZATION (PANO-36): any repetition of the same character is reduced to ONE
 * occurrence, the offset map absorbing the entire run (the surface form of a
 * skeletonized match stays the complete original segment, elongation included — `triggerTerms ⊂ text`
 * holds). Second matching space for expressive elongations; the triggering is
 * guarded on the detect.ts side (elongation ≥ 3 visible in the surface), so that « cône » (→ « cone »)
 * can never match « conne » (→ « cone ») on non-elongated text.
 */
export function skeletonize(text: NormalizedText): NormalizedText {
  let norm = '';
  const starts: number[] = [];
  const ends: number[] = [];
  for (let i = 0; i < text.norm.length; i++) {
    const char = text.norm.charAt(i);
    if (norm.length > 0 && norm.charAt(norm.length - 1) === char) {
      ends[ends.length - 1] = text.ends[i] ?? 0; // extends the run: the surface covers the elongation
      continue;
    }
    norm += char;
    starts.push(text.starts[i] ?? 0);
    ends.push(text.ends[i] ?? 0);
  }
  return { original: text.original, norm, starts, ends };
}

/** Skeleton of an already-normalized string (for MARKERS: « connard » → « conard »). */
export function collapseRuns(normalized: string): string {
  return normalized.replace(/(.)\1+/g, '$1');
}

/**
 * Surface form of the segment `[start, end)` OF THE NORMALIZED TEXT, sliced from the ORIGINAL via the map.
 * Contract: `start < end`, bounds within the normalized text (guaranteed by the matching, not rechecked).
 */
export function surfaceForm(text: NormalizedText, start: number, end: number): string {
  const from = text.starts[start];
  const to = text.ends[end - 1];
  if (from === undefined || to === undefined) {
    return ''; // bounds off-map: empty segment rather than an exception (defensive, never expected)
  }
  return text.original.slice(from, to);
}
