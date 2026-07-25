// INTERFACE copy — THE SELECTOR. No prose lives here.
//
// THREE FILES, ONE PERIMETER (same shape as `engine/wording.*`, structure ratified by yuya):
//   - `copy.fr.ts` — the French prose. FORM ORACLE: `UiCopy` is derived from it.
//   - `copy.en.ts` — the English prose, annotated `UiCopy`.
//   - THIS FILE — the language choice, and nothing else.
//
// ─── WHY THE LANGUAGE RESOLVES HERE, AND ONLY ONCE ──────────────────────────────────────────────
// The components are `client:only` islands: the page already publishes its language on `<html lang>`, and
// `i18n/current.ts` reads it. This language is CONSTANT for the life of the page — it therefore resolves
// at module evaluation, and each group is re-exported as is.
//
// WHAT THIS CHOICE BUYS, and it is the reason to prefer it to a `copy(locale).header.wordmark`:
// NO CALL SITE MOVES. `UI_HEADER.wordmark` stays `UI_HEADER.wordmark`, in the seventeen
// components that read this file. The batch therefore does not produce hundreds of lines of mechanical
// diff in which a real modification would hide — and the French rendering stays
// identical BY CONSTRUCTION: outside the browser (goldens, `pages/index.astro` at build),
// `currentLocale()` falls back to `DEFAULT_LOCALE`.
//
// ⚠ WHAT IT COSTS, AND WHAT IS PAID IN THE TESTS. Rendering English in Node requires setting
// `document.documentElement.lang` BEFORE the import of this module, so `vi.resetModules()` + a dynamic
// import (`ui/format.test.ts` shows the maneuver). ⚠ IT MUST COVER `format.ts` TOO: the
// two files carry a language state at the module level, and forgetting one would render an English
// tree with FRENCH NUMBERS — narrow no-break space U+202F, « 0 comment » in the singular. A defect
// invisible to the eye, that a golden would freeze without anyone reading it.
//
// THE ASYMMETRY WITH THE ENGINE IS A MATTER OF PRINCIPLE. `engine/wording.ts` takes the language as a PARAMETER: it
// passes the 2nd `tsc` pass without a DOM and has no `document` to read. Here the DOM is allowed, and the
// plumbing we spare ourselves (a prop crossing each intermediate component) is precisely
// the one we forget to wire onto the next component, six months later.

import { currentLocale } from '../i18n/current';
import { EN } from './copy.en';
import { FR } from './copy.fr';

/** The shape of the interface catalog — derived from the French, which is the oracle. */
export type UiCopy = typeof FR;

const B: UiCopy = currentLocale() === 'en' ? EN : FR;

export const UI_UNITS = B.UI_UNITS;
export const UI_BRAND = B.UI_BRAND;
export const UI_ROOT = B.UI_ROOT;
export const UI_HEADER = B.UI_HEADER;
export const UI_FOOTER = B.UI_FOOTER;
export const UI_LEARN = B.UI_LEARN;
export const UI_ACTIVITY = B.UI_ACTIVITY;
export const UI_TIME_ESTIMATE = B.UI_TIME_ESTIMATE;
export const UI_LANDING = B.UI_LANDING;
export const UI_CONSENT = B.UI_CONSENT;
export const UI_ROADMAP = B.UI_ROADMAP;
export const UI_ANALYSE = B.UI_ANALYSE;
export const UI_CARD = B.UI_CARD;
export const UI_RESULTS = B.UI_RESULTS;
export const UI_LEARN_PANELS = B.UI_LEARN_PANELS;
export const UI_AI = B.UI_AI;
export const UI_AI_LEARN = B.UI_AI_LEARN;
export const UI_AI_MOBILE = B.UI_AI_MOBILE;
export const UI_NO_DEDUCTION = B.UI_NO_DEDUCTION;
