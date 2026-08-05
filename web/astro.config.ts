import preact from '@astrojs/preact';
import { defineConfig } from 'astro/config';
import { siteZip } from './integrations/site-zip';
import { DEFAULT_LOCALE, LOCALES, SITE_ORIGIN } from './src/i18n/locales';

// PanoptiCool — Astro shell + Preact islands (ADR-0002).
// `output` stays on the "static" default: static build served by Caddy (ADR-0001),
// parsing/insights 100% client-side. No server rendering.
//
// `.ts` AND NOT `.mjs`: so we can import `src/i18n/locales` rather than recopy the list of
// languages here. Two language lists that drift apart mean a routing and a sitemap that stop
// speaking about the same thing — with nothing to signal it.
export default defineConfig({
  // `siteZip` packages the build output into `panopticool-site.zip` (route B of the AI section).
  // It is an INTEGRATION and not a `postbuild` script because a host runs `astro build`
  // directly, without going through `npm run build` — the zip was then missing on the deployed site.
  integrations: [preact(), siteZip()],

  // The production domain, in ONE place — `SITE_ORIGIN`, next to the language lists and imported
  // here for the same reason. The absolute URLs required by Open Graph, the canonical, the hreflang
  // tags and the sitemap all derive from `Astro.site`; the ISLANDS, which have no `Astro`, read the
  // constant directly rather than guess from `location.origin`.
  site: SITE_ORIGIN,

  i18n: {
    locales: [...LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: {
      // SYMMETRIC URLs: `/fr` and `/en`, no language served bare at the root. The reason is
      // positional and not technical (yuya's decision) — an asymmetric tree would encode that
      // PanoptiCool IS French first, which it is not.
      prefixDefaultLocale: true,
      // The root is a WRITTEN page (`src/pages/index.astro`) and not a generated redirect:
      // it must carry the share-preview tags that unfurl bots read on the FIRST response without
      // following the `meta refresh`. This setting (SSR middleware, no effect on a static build)
      // is set to `false` to spell it out in black and white: nobody other than the page itself
      // decides what `/` renders.
      redirectToDefaultLocale: false,
    },
  },

  // The URLs from before the multi-language rollout, already shared. Astro renders small redirect
  // pages here: enough for a human and for a search engine, not enough for a share preview
  // (no Open Graph tags). This is deliberate — those two paths don't display as a card in a
  // conversation. The root, however, does: hence the written page.
  redirects: {
    '/analyse': '/fr/analyse',
    '/mentions-legales': '/fr/mentions-legales',
  },

  vite: {
    worker: {
      // ⚠ `es` AND NOT VITE'S DEFAULT `iife`. The Instagram worker imports `mmdb-lib` and the
      // `buffer` polyfill DYNAMICALLY — so that a page which never draws a map never downloads
      // 36 KB of geo reader — and a dynamic import makes it a code-splitting build, which the IIFE
      // format cannot express. The build fails outright rather than silently inlining, which is the
      // good failure mode; this is the fix it asks for.
      //
      // Both workers are already instantiated with `{ type: 'module' }`, so nothing else changes:
      // the format now matches how they were always being loaded.
      format: 'es',
    },
  },
});
