// The <head> prose, resolved BY PARAMETER — the only accessor of `copy.*` that does not go through
// `copy.ts`.
//
// WHY IT EXISTS. `copy.ts` resolves the language once, at module evaluation, by reading
// `document.documentElement.lang`. That works for the islands, which run in a browser where the
// page has already published its language. It cannot work for a `<head>`: it is rendered by Astro
// in Node, at build, where there is no `document` — so `copy.ts` falls back to the default language
// and `/en` would emit a FRENCH title and description. That is exactly what the eight pages worked
// around, each by hard-coding its own two sentences outside the ratifiable perimeter.
//
// The fix is the one `engine/wording.ts` already applies for the same reason: take the locale as a
// PARAMETER and import both bundles directly. The prose keeps its single home in
// `copy.fr.ts`/`copy.en.ts`, and `copy-parity.test.ts` walks it like every other group — no new
// parity machinery, no third pair of files.
//
// ─── WHAT THIS MODULE DOES NOT DO ───────────────────────────────────────────────────────────────
// It does not check that a title is TRUE, well-sized, or distinct from its neighbour's. It resolves
// a key in a language, and nothing else. That the eight titles differ from one another, and that
// each describes its own page, is held by human re-reading of `copy.fr.ts` — the perimeter this
// module exists to bring them back into.

import type { Locale } from '../i18n/locales';
import { EN } from './copy.en';
import { FR } from './copy.fr';

/** The `<head>` catalog, in one language. Shape derived from the French, which is the oracle. */
export type HeadCopy = (typeof FR)['UI_HEAD'];

const BUNDLES: Record<Locale, HeadCopy> = { fr: FR.UI_HEAD, en: EN.UI_HEAD };

/**
 * The `<head>` prose of `locale`.
 *
 * ⚠ Unlike `copy.ts`, nothing here reads the DOM: the caller passes the language it already knows
 * from its own folder (`Astro.currentLocale`). An unknown locale falls back to French rather than
 * crash the build — the same choice, for the same reason, as `wording.ts`.
 */
export function headCopy(locale: Locale): HeadCopy {
  return BUNDLES[locale] ?? FR.UI_HEAD;
}
