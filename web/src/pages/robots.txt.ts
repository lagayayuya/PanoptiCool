// robots.txt — rendu, et non posé dans `public/`, pour UNE raison : la ligne `Sitemap:` exige une
// URL absolue. En statique, elle aurait réécrit le domaine à la main, à côté de celui de
// `astro.config.ts` — la duplication que ce lot a précisément retirée de `SiteHead`.
//
// RIEN N'EST INTERDIT ICI, et ce n'est pas un oubli : l'anglais n'est pas « caché par robots.txt »,
// il n'est PAS CONSTRUIT (cf. les deux listes de `i18n/locales.ts`). Un `Disallow: /en` serait au
// mieux inutile, au pire un panneau indiquant une porte — robots.txt est public, et un chemin
// interdit y est un chemin annoncé.

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
