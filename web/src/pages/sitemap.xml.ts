// SITEMAP — the list of URLs we own seeing indexed.
//
// WRITTEN BY HAND RATHER THAN `@astrojs/sitemap` (yuya's decision, 2026-07-18). The official
// integration declares what it FINDS in the build: it has no notion of a language built
// but not owned. The day `src/pages/en/` exists while English is not yet
// ready, it would publish it — that is, exactly the accident `PUBLISHED_LOCALES` exists to
// prevent. Thirty lines read here are worth more than a dependency that decides in our place.
//
// The `xhtml:link` alternates repeat, for each URL, the whole set of published languages: it is the
// form Google expects, and it must say the SAME thing as the `<link rel="alternate">` of the
// <head> — hence the single source.
//
// ─── WHAT THIS MECHANISM DOES NOT COVER ─────────────────────────────────────────────────────────
// CLAUDE.md obligation.
//   - IT DISCOVERS NOTHING. It renders the product of `PAGE_PATHS` by `PUBLISHED_LOCALES`. A page
//     added in `src/pages/` without being registered in `PAGE_PATHS` will not appear here — the
//     consistency net (`i18n/locales.test.ts`) is what catches this oversight, not this file;
//   - NO `lastmod`, NO `priority`. A last-modification date we cannot
//     keep up to date is false information; `priority` has been ignored by Google for years;
//   - IT DOES NOT PROVE THE URL RESPONDS. It declares URLs; that the build actually produces
//     them is a matter of the `dist/` verification.

import type { APIRoute } from 'astro';
import { HTML_LANG, localePath, PAGE_PATHS, PUBLISHED_LOCALES } from '../i18n/locales';

export const GET: APIRoute = ({ site }) => {
  if (site === undefined) {
    // A sitemap in relative URLs is not a degraded sitemap: it is invalid.
    throw new Error('sitemap : `site` doit être défini dans astro.config.ts.');
  }

  const urls = PAGE_PATHS.flatMap((path) =>
    PUBLISHED_LOCALES.map((locale) => {
      const alternates = PUBLISHED_LOCALES.map(
        (other) =>
          `    <xhtml:link rel="alternate" hreflang="${HTML_LANG[other]}" href="${new URL(localePath(other, path), site).href}"/>`,
      ).join('\n');
      return `  <url>\n    <loc>${new URL(localePath(locale, path), site).href}</loc>\n${alternates}\n  </url>`;
    }),
  ).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
