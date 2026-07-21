// SITEMAP — la liste des URLs qu'on assume voir indexées.
//
// ÉCRIT À LA MAIN PLUTÔT QUE `@astrojs/sitemap` (décision yuya, 2026-07-18). L'intégration
// officielle déclare ce qu'elle TROUVE dans le build : elle n'a aucune notion de langue construite
// mais non assumée. Le jour où `src/pages/en/` existera pendant que l'anglais n'est pas encore
// prêt, elle le publierait — c'est-à-dire exactement l'accident que `PUBLISHED_LOCALES` existe pour
// empêcher. Trente lignes lues ici valent mieux qu'une dépendance qui décide à notre place.
//
// Les alternates `xhtml:link` répètent, pour chaque URL, l'ensemble des langues publiées : c'est la
// forme que Google attend, et elle doit dire la MÊME chose que les `<link rel="alternate">` du
// <head> — d'où la source unique.
//
// ─── CE QUE CE MÉCANISME NE COUVRE PAS ──────────────────────────────────────────────────────────
// Obligation de CLAUDE.md.
//   - IL NE DÉCOUVRE RIEN. Il rend le produit de `PAGE_PATHS` par `PUBLISHED_LOCALES`. Une page
//     ajoutée dans `src/pages/` sans être inscrite dans `PAGE_PATHS` n'apparaîtra pas ici — le
//     filet de cohérence (`i18n/locales.test.ts`) est ce qui rattrape cet oubli, pas ce fichier ;
//   - PAS DE `lastmod`, PAS DE `priority`. Une date de dernière modification qu'on ne sait pas
//     tenir à jour est une information fausse ; `priority` est ignoré par Google depuis des années ;
//   - IL NE PROUVE PAS QUE L'URL RÉPOND. Il déclare des URLs ; que le build les produise
//     réellement relève de la vérification du `dist/`.

import type { APIRoute } from 'astro';
import { HTML_LANG, localePath, PAGE_PATHS, PUBLISHED_LOCALES } from '../i18n/locales';

export const GET: APIRoute = ({ site }) => {
  if (site === undefined) {
    // Un sitemap en URLs relatives n'est pas un sitemap dégradé : il est invalide.
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
