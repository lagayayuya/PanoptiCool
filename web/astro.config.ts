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
  // ⚠ `/analyse` POINTED AT A PAGE THE RENAME HAD DELETED. It sent to `/fr/analyse`, which stopped
  // existing when the TikTok journey took its own name — a redirect to a 404, carrying a `canonical`
  // toward a dead URL. The two localized forms are added for the same reason: they were the site's
  // published addresses until this batch, so they are indexed, shared and quoted in the README.
  // A rename is only finished when the URLs it replaced still lead somewhere.
  redirects: {
    '/analyse': '/fr/tiktok',
    '/fr/analyse': '/fr/tiktok',
    '/en/analyse': '/en/tiktok',
    '/mentions-legales': '/fr/mentions-legales',
  },

  // ⚠ 8080 AND NOT ASTRO'S 4321 (Yul's decision). It is the port route B serves the site on — the
  // `llama-server --path` command the AI page hands out — so working from source and reading the
  // site the way that route delivers it happen at the same address, and the documentation has one
  // number to state instead of two.
  //
  // ⚠ THE COST, NAMED: `SERVER_PORT` in `src/ai/install-help.ts` is 8080 TOO, because that is
  // llama.cpp's own default and the address the AI page probes. Running `npm run dev` and a
  // `llama-server` at once therefore collides, and route A cannot be exercised against the dev
  // server without moving one of the two by hand (`npm run dev -- --port …`). Route B is unaffected:
  // there the site IS the llama-server, which is the case this port was chosen for.
  server: { port: 8080 },

  vite: {
    // ⚠ THE DEV SERVER RELOADED THE PAGE IN THE MIDDLE OF EVERY FIRST ANALYSIS, and that is the
    // « one drop in four does nothing and puts me back on the drop screen » reported across several
    // sessions. It was never in our code, and no console message survived it — the reload wipes the
    // console, which is why it looked like nothing at all had happened.
    //
    // The chain, read off a performance trace (2026-08-04, `Trace-20260804T082212`):
    //   1. the Instagram worker starts and its graph reaches `mmdb-lib` + `buffer` — imported
    //      DYNAMICALLY (see `worker.format` below), so Vite's static scan never saw them and they
    //      were absent from the pre-bundle;
    //   2. Vite discovers them at request time, re-runs `optimizeDeps`, and the browser hash of
    //      every optimised dependency changes (`?v=d7662f97` → `?v=cc693c32` in the trace);
    //   3. every module the page already loaded is now stale — one request came back
    //      `504 (Outdated Optimize Dep)` — so Vite broadcasts `{"type":"full-reload"}` on the HMR
    //      socket. The trace shows a 33-byte frame, then `FrameLoader::StartNavigation load_type: 2`
    //      twenty milliseconds later;
    //   4. the page reloads, the island remounts in its initial state, and the drop screen is back.
    //
    // Naming the two dependencies here pre-bundles them AT SERVER START, so nothing is discovered
    // mid-analysis and nothing reloads. It costs a few milliseconds of boot and changes NOTHING in
    // the build — `optimizeDeps` is a dev-server mechanism, which is also why a deployed site never
    // had this bug. It is `astro dev` that had it, and every test run against it.
    //
    // ⚠ THE TWO NAMES MUST FOLLOW `mmdb-geo-resolver.ts`. They are listed here because that file
    // imports them behind an `await import()`, and a dependency that stops being dynamic — or a
    // third one that becomes so — belongs in this list on the same day.
    optimizeDeps: { include: ['mmdb-lib', 'buffer'] },

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
