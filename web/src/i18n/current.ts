// THE CURRENT LANGUAGE, SEEN FROM AN ISLAND — and why it is read from the DOM.
//
// The components are `client:only` islands (ADR-0002): they render ONLY in the browser,
// and thus never receive `Astro.currentLocale`, which exists only at compile time. They had to
// be given the language another way.
//
// TWO POSSIBLE ROUTES, AND WHY THIS ONE. The other was to pass the language as a PROP from
// each page, then have it descend — `LandingPage` → `SiteHeader`, `ResultsView` → its
// sections, and so on. It works, and it forces each intermediate component to carry a
// piece of data it does nothing with: the kind of prop one forgets to wire onto the new component,
// six months later, with nothing to say so.
//
// The page ALREADY PUBLISHES its language: `<html lang>`. Reading it is a call, not plumbing.
//
// THE CONTRACT, AND WHAT HOLDS IT. If the document's `lang` attribute lies, ALL the islands' links
// lie — silently, since hreflang, canonical and sitemap are computed server-side and
// stay, for their part, correct. This contract therefore does not hold on its own: it holds because the pages
// DERIVE this attribute from `Astro.currentLocale`, that is from their folder, instead of writing it.
// A page that hard-rewrote it would break this file remotely; `i18n/locales.test.ts`
// refuses it for this precise reason.
//
// IN NODE (the render goldens), `document` is absent: we fall back to the default language,
// DETERMINISTICALLY. The goldens therefore freeze `/fr` links, which is exactly what they
// must freeze as long as French is the only published language.

import { DEFAULT_LOCALE, LOCALES, type Locale, localePath } from './locales';

/** The current page's language, read from `<html lang>`. Falls back to the default language outside the browser. */
export function currentLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const lang = document.documentElement.lang;
  // An unknown language (missing attribute, misspelled) must not fabricate dead URLs: better
  // links to the default language than links to `/undefined`.
  return (LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : DEFAULT_LOCALE;
}

/**
 * The link of a page in the current language: `localeHref('/tiktok')` → `/fr/tiktok`.
 *
 * DO NOT use it for an anchor (`#sec-activite`) nor for an asset (`/logo.png`): those two
 * have no language. A prefixed anchor would leave the page; a prefixed asset would not load.
 */
export function localeHref(path: string): string {
  return localePath(currentLocale(), path);
}

/**
 * The current page's path WITHOUT its language, query included: on `/fr/tiktok?demo`, returns
 * `/tiktok?demo`. This is what is needed to offer THE SAME page in another language.
 *
 * The query is kept, and it is not a detail: dropping it would tip the demonstration
 * journey toward the upload of a real export — switching language would put the person in front of an
 * screen asking for their data.
 *
 * Outside the browser, returns `/`: the goldens therefore render a selector pointing at the home page.
 */
export function currentPath(): string {
  if (typeof window === 'undefined') return '/';
  const { pathname, search } = window.location;
  const locale = currentLocale();
  const stripped = pathname.startsWith(`/${locale}`) ? pathname.slice(locale.length + 1) : pathname;
  // A bare `/fr` leaves an empty string; `/fr/tiktok/` leaves a trailing slash we do not re-emit.
  const path = stripped.replace(/\/$/, '');
  return (path === '' ? '/' : path) + search;
}
