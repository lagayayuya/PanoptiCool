// The engine: ONE function, ONE named value (Refonte A, batch A1).
//
// REPLACES `rules/index.ts` (the `RULES`/`EVIDENCE_RULES` registries + `composeRules` + the merge of
// the evidence store). What disappeared, and why it is not an impoverishment:
//   - the TWO REGISTRIES existed to type a heterogeneous list of producers behind a common
//     signature (`(input) => Insight[]`). Each producer now having its OWN name and return type,
//     there is no more list to iterate over: this function calls them. The registry was the
//     indirection that let the UI re-route (`ruleId`) what the engine already knew;
//   - the STORE MERGE (dedup by `EvidenceId`) leaves with the store: evidence is now direct
//     references, a verbatim duplicate is ACCEPTED (yuya's arbitration), and reuse (C5) is
//     RECOMPUTED at render on the `channel:sourceIndex` pair — no longer stored.
//
// THE FIELD ORDER IS NOT THE PAGE ORDER. `Analysis` is a named value: it is the UI that decides to
// render `signals` before `themes` (it reproduces the order the old `insights[]` produced: D1
// emitted before D2). The engine no longer stages anything.

import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import type { Analysis } from './analysis';
import type { NormalizedExport } from './normalize';
import { readRhythm } from './rules/activity-rhythm';
import { d1SensitiveTopics } from './rules/d1-sensitive-topics';
import { d2Interests } from './rules/d2-interests';
import { readOpacity } from './rules/opacity-semantic-wall';
import { readVolumes } from './rules/volumes';

/**
 * Analyzes the **validated and normalized** export (`NormalizedExport`: list-sections coalesced to
 * `[]` at the seam, PANO-28/30). PURE function: no side effect, no I/O, no DOM.
 *
 * Each producer returns `undefined`/`[]` if its source is empty; a globally empty analysis is still
 * a VALID output (PANO-28) — a fresh account is not an error.
 *
 * `rhythm` and `opacity` are OMITTED (not set to `undefined`) when their producer has nothing: under
 * `exactOptionalPropertyTypes`, the distinction matters, and "absent" is the intended semantics.
 */
export function analyze(
  input: NormalizedExport,
  now: number = Date.now(),
  locale: Locale = DEFAULT_LOCALE,
): Analysis {
  const rhythm = readRhythm(input, now);
  const opacity = readOpacity(input);
  return {
    ...(rhythm !== undefined ? { rhythm } : {}),
    volumes: readVolumes(input),
    ...(opacity !== undefined ? { opacity } : {}),
    // `undefined` = default lexicons: `analyze` need not know `INTEREST_LEXICONS`, and importing it
    // here would undo the encapsulation that `d2Interests`'s signature installs.
    themes: d2Interests(input, undefined, locale),
    signals: d1SensitiveTopics(input, locale),
  };
}
