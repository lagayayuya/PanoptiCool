import preact from '@astrojs/preact';
import { defineConfig } from 'astro/config';
import { siteZip } from './integrations/site-zip';
import { DEFAULT_LOCALE, LOCALES } from './src/i18n/locales';

// PanoptiCool — coquille Astro + îlots Preact (ADR-0002).
// `output` reste sur le défaut « static » : build statique servi par Caddy (ADR-0001),
// parsing/insights 100 % côté client. Aucun rendu serveur.
//
// EN `.ts` ET NON `.mjs` : pour importer `src/i18n/locales` plutôt que recopier la liste des
// langues ici. Deux listes de langues qui divergent, c'est un routage et un sitemap qui cessent de
// parler de la même chose — sans que rien ne le signale.
export default defineConfig({
  // `siteZip` empaquette la sortie du build en `panopticool-site.zip` (route B de la section IA).
  // C'est une INTÉGRATION et non un script `postbuild` parce qu'un hébergeur lance `astro build`
  // directement, sans passer par `npm run build` — le zip manquait alors sur le site déployé.
  integrations: [preact(), siteZip()],

  // Le domaine de production, en UN endroit. Les URLs absolues qu'exigent Open Graph, le canonical,
  // les hreflang et le sitemap se dérivent toutes de `Astro.site` — aucune ne le réécrit.
  site: 'https://panopti.cool',

  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: {
      // URLs SYMÉTRIQUES : `/fr` et `/en`, aucune langue servie nue à la racine. La raison est
      // positionnelle et non technique (décision yuya) — un arbre asymétrique encoderait que
      // PanoptiCool EST français d'abord, ce qu'il n'est pas.
      prefixDefaultLocale: true,
      // La racine est une page ÉCRITE (`src/pages/index.astro`) et non une redirection générée :
      // elle doit porter les balises d'aperçu de partage, que les robots d'unfurl lisent sur la
      // PREMIÈRE réponse sans suivre le `meta refresh`. Ce réglage (middleware SSR, sans effet sur
      // un build statique) est mis à `false` pour l'écrire noir sur blanc : personne d'autre
      // qu'elle ne décide de ce que rend `/`.
      redirectToDefaultLocale: false,
    },
  },

  // Les URLs d'avant la mise en langues, déjà partagées. Astro rend ici de petites pages de
  // redirection : suffisant pour un humain et pour un moteur, insuffisant pour un aperçu de
  // partage (pas de balises Open Graph). C'est assumé — ces deux chemins-là ne s'affichent pas en
  // carte dans une conversation. La racine, elle, si : d'où la page écrite.
  redirects: {
    '/analyse': '/fr/analyse',
    '/mentions-legales': '/fr/mentions-legales',
  },
});
