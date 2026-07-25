// THE SITE'S LANGUAGES — and the switch that decides which ones are ON.
//
// TWO LISTS, AND THAT IS THE POINT OF THIS FILE. They do not say the same thing, and
// confusing them is the exact mistake this batch had to avoid:
//
//   - `LOCALES` — the DECLARED languages. This is SYMMETRY: routing, `Astro.currentLocale`,
//     the presence of the language selector. Nothing here is read on the web.
//   - `PUBLISHED_LOCALES` — the BUILT and OWNED languages. This is the SWITCH: hreflang,
//     canonical, alternates, sitemap, and the active state of the selector.
//
// The rule that follows, and that must hold without thinking about it: **everything indexable reads
// `PUBLISHED_LOCALES`, everything structural reads `LOCALES`**. An hreflang or a sitemap entry
// naming an unpublished language would invite the indexing of a shell — which is
// precisely what a `<link rel="alternate">` can trigger on its own.
//
// ENGLISH WAS TURNED OFF, THEN ON (off on 2026-07-18, on on 2026-07-20). It was off
// for a substantive reason and not out of unfinished work: the English analysis was DEGRADED, and an
// English site whose analysis returns almost nothing does not read as "work in progress" — it reads
// as "there is nothing to see here", the exact opposite of the product's thesis, demonstrated by the
// product itself.
//
// WHAT CHANGED: the six sensitive lexicons now carry English vocabulary, and the
// two ratifiable perimeters (`engine/wording.*`, `ui/copy.*`) have their complete EN side.
//
// ⚠ WHAT REMAINS TRUE, MEASURED AT SWITCH-ON and not assumed: output parity is NOT achieved.
// On the two demo personas, at equal volume (38 items each), French returns 2 sensitive
// findings + 2 themes, English 2 sensitive findings + 1 theme. The gap is due to the fixture and not
// to the English lexicon — one of the two "cats" items of the EN persona carries no cat word, so
// that the repetition floor (2) is not crossed; the term `kitten` of the second, for its part,
// does match. The distinction matters: the zero comes from the FLOOR, not from a vocabulary
// hole, and confusing the two would send the fix to the wrong place.
//
// THE ORDER OF THE TWO GESTURES, kept here because it holds for the NEXT language:
//   1. create `src/pages/<language>/` (the twin pages);
//   2. add the language to `PUBLISHED_LOCALES` below.
// The consistency net (`locales.test.ts`) refuses the reverse order: publishing a language without
// pages, or building unpublished pages, fails loudly. This is intended — the oversight we
// want to make impossible is a sitemap announcing a language nobody has written.

/** The DECLARED languages — routing and symmetry. The Astro configuration READS this list; it does
 * not recopy it, and that is why they cannot diverge. */
export const LOCALES = ['fr', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/** The language served at the root, and the one `/` redirects to. */
export const DEFAULT_LOCALE: Locale = 'fr';

/**
 * The BUILT and indexable languages — the switch.
 * Everything that addresses a bot (hreflang, canonical, sitemap) is read HERE, never in `LOCALES`.
 */
export const PUBLISHED_LOCALES: readonly Locale[] = ['fr', 'en'];

/** `true` if the language has built and owned pages. */
export function isPublished(locale: Locale): boolean {
  return PUBLISHED_LOCALES.includes(locale);
}

/**
 * The path of a page IN a language: `('fr', '/analyse')` → `/fr/analyse`.
 *
 * `path` is the path WITHOUT language, as it was written before this batch (« / », « /analyse »,
 * « /analyse?demo »). The root renders `/fr` and not `/fr/` — a single URL form, thus a single
 * possible canonical.
 *
 * DO NOT pass it an anchor (`#sec-activite`) nor an asset path (`/logo.png`): those two
 * have no language, and prefixing them would break, respectively, internal navigation and image
 * loading.
 */
export function localePath(locale: Locale, path: string): string {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/**
 * The site's pages, as paths WITHOUT language. The site's URL space is the product of this list
 * by `PUBLISHED_LOCALES` — it is what the sitemap declares, and what the consistency net
 * verifies against the files actually present in `src/pages/`.
 *
 * Only what is VISITED and indexed enters here: neither the root (which redirects and canonizes to
 * the default language), nor the redirects of the old URLs.
 */
export const PAGE_PATHS = ['/', '/analyse', '/feuille-de-route', '/mentions-legales'] as const;

/** The BCP 47 code expected by `<html lang>` and `hreflang`. */
export const HTML_LANG: Record<Locale, string> = { fr: 'fr', en: 'en' };

/** The code expected by `og:locale`, which requires the `language_COUNTRY` form. */
export const OG_LOCALE: Record<Locale, string> = { fr: 'fr_FR', en: 'en_US' };
