// robots.txt — rendered, and not placed in `public/`, for ONE reason: the `Sitemap:` line requires an
// absolute URL. In static, it would have rewritten the domain by hand, alongside that of
// `astro.config.ts` — the duplication this batch precisely removed from `SiteHead`.
//
// NOTHING IS FORBIDDEN HERE, and it is not an oversight: English is not "hidden by robots.txt",
// it is NOT BUILT (cf. the two lists of `i18n/locales.ts`). A `Disallow: /en` would be at
// best useless, at worst a sign pointing to a door — robots.txt is public, and a forbidden
// path in it is an announced path.

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (site === undefined) {
    throw new Error('robots.txt : `site` doit être défini dans astro.config.ts.');
  }

  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', site).href}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
