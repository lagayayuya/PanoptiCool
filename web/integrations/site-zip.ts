// Site archive for the "Everything on your device" path (route B of the AI section, ADR-0006:
// serving the site from `localhost` removes the origin/target gap in all three engines).
//
// WHY AN ASTRO INTEGRATION, AND NOT A `postbuild` SCRIPT. This zip was first produced by
// `astro build && node scripts/build-site-zip.mjs` in `npm run build`. The flaw is structural:
// **nothing guarantees the build goes through the npm script**. A host that detects Astro runs
// `astro build` directly, just like an `npx astro build` locally — and in those cases the zip
// was NEVER written. Route B's download link then fell to a 404 on the hosted site, with nothing
// to signal it: the build succeeded, the page was built, only the file was missing. An integration
// hooks into the build ITSELF (`astro:build:done`): it runs whatever command triggered it.
//
// The archive stays a BUILD ARTIFACT, regenerated from the build output: it cannot go stale
// against the online site, since it is the same build. This is what defeats the historical
// objection against a downloadable archive (a distribution channel to version, which would drift
// silently — cf. `src/ai/install-help.ts`).
//
// ─── WHAT THIS MECHANISM DOES NOT COVER ─────────────────────────────────────────────────────────
// CLAUDE.md obligation: a mechanism declares its boundary.
//   - IT DOES NOT RUN IN `astro dev`. `astro:build:done` is a BUILD hook: in development,
//     `/panopticool-site.zip` does not exist and route B's link is dead there. This is harmless
//     (in dev the page is served from localhost, so route B has no purpose anymore — that is the
//     "Everything is ready" mode), but it should be known;
//   - IT VERSIONS NOTHING. The zip does not enter git (`dist/` is ignored): it is a build output,
//     regenerated identically at each build. "Available on the repo" therefore means "produced by
//     any build from a clone", not "committed";
//   - IT VERIFIES ONE THING ABOUT THE CONTENT, AND ONE ONLY: that the two geo databases are in the
//     archive (see below). Everything else it packages is taken on trust — whether the build's other
//     output is correct is the build's concern, not this file's. CI asserts the same four entries
//     from OUTSIDE this file (`.github/workflows/ci.yml`), so unplugging the guard here is caught
//     there rather than by someone who has already downloaded the result. What neither of them
//     checks is that the databases are CURRENT: a year-old copy passes both.
//
// ─── WHY THE GEO CHECK LIVES HERE AND NOT IN A `prebuild` ───────────────────────────────────────
// `public/geo/` is gitignored (128 MB, republished monthly) and `scripts/fetch-geo-db.mjs` puts it
// back. Wiring that script to an npm `prebuild` would have had the SAME structural flaw this file
// was written to escape, in the same place: a host that runs `astro build` directly never runs it.
// The build would then succeed, this integration would zip a `dist/` with no `geo/` in it, and route
// B's archive would go out at 3 MB instead of 66 — no error, no warning, and a map that is silently
// dead for whoever downloaded it. Nobody can repair that after the download.
//
// So the guarantee is made where the artifact is: the check reads the FILE MAP THAT IS ABOUT TO BE
// ZIPPED, not `public/geo/`. `public/` → `dist/` is one more link that can break, and a check on the
// source would have proved the wrong thing.
//
// ⚠ AND ITS FAILURE MODE IS TO WRITE NOTHING (yuya's decision, 2026-08-05). An amputated archive is
// an invisible failure; an absent one is a visible failure the AI section explains in words — route B
// hides its download button and says why, rather than offering a link to a 404. The build itself
// stays GREEN: a site without the geo databases is a legitimate degraded mode online, where the map
// announces the absence on screen. It is only the ARCHIVE that cannot be shipped amputated.

import { copyFileSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { zipSync } from 'fflate';
// The name lives in `install-help.ts`, which also composes it into route B's copyable command.
// Importing it here rather than recopying it: two names that drift apart are a dead link.
import { SITE_ZIP_NAME } from '../src/ai/install-help';
// Same reason: the resolver owns the two paths it fetches at runtime. A recopy here would be a
// check that keeps passing while the thing it checks has moved.
import { GEO_DB_PATHS } from '../src/engine/instagram/mmdb-geo-resolver';

/** The resolver's URLs, as zip entries — an entry has no leading slash. */
const GEO_ENTRIES = Object.values(GEO_DB_PATHS).map((p) => p.replace(/^\//, ''));

/**
 * ⚠ THE LICENCE FILES ARE COPIED INTO THE BUILD OUTPUT, and it is the geo databases that make it
 * an obligation rather than a courtesy. DB-IP City Lite is **CC BY 4.0: attribution is required of
 * whoever redistributes it**, and this project redistributes it twice — the site serves the two
 * `.mmdb` to every browser that draws the inferred layer, and the archive ships them to be run
 * offline. The attribution lived only in `NOTICE` at the repository root, which reaches neither.
 * It was intermittent before (an amputated archive carried no databases to attribute); the guard
 * above makes the databases certain, so the gap became certain with them.
 *
 * They are COPIED, not duplicated in the repo: the root files stay the single home, and a second
 * pair under `public/` would be two copies drifting. And copying them into `dist/` covers both
 * distributions at once, since the archive is built by walking `dist/`.
 *
 * AGPL v3 (ADR-0005) rides along for the same reason and at no cost: a reader running the site
 * from the archive, with no network, can still read the terms it came under.
 */
const LICENCE_FILES = ['NOTICE', 'LICENSE'] as const;

/** ⚠ A SIZE AND NOT A PRESENCE. The real databases weigh 60–70 MB each; anything under this is a
 *  placeholder, a truncated download or an LFS pointer — all of which exist as files and would
 *  satisfy a check that only asked whether the name was there. */
const MIN_MMDB_BYTES = 1_000_000;

/** All files under `dir`, as ABSOLUTE paths (recursive walk). */
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

export function siteZip(): AstroIntegration {
  return {
    name: 'panopticool:site-zip',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);

        // Before the walk, so the copies are served by the site AND land in the archive.
        const repoRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
        for (const name of LICENCE_FILES) {
          copyFileSync(join(repoRoot, name), join(outDir, name));
        }

        const files: Record<string, Uint8Array> = {};
        for (const full of walk(outDir)) {
          // A zip entry's separators are `/` on every platform.
          const entry = relative(outDir, full).split(sep).join('/');
          // A build on top of a build does not embed itself.
          if (entry === SITE_ZIP_NAME) continue;
          files[entry] = new Uint8Array(readFileSync(full));
        }
        const missing = GEO_ENTRIES.filter((e) => (files[e]?.byteLength ?? 0) < MIN_MMDB_BYTES);
        if (missing.length > 0) {
          logger.error(
            `${SITE_ZIP_NAME} NOT written — missing from the build output: ${missing.join(', ')}. ` +
              `Run \`node scripts/fetch-geo-db.mjs\` and build again. The site itself is fine: ` +
              `without these, the map draws its declared layer and reports the inferred one as ` +
              `unavailable. The ARCHIVE is not, which is why none was written.`,
          );
          return;
        }

        const zipped = zipSync(files, { level: 6 });
        writeFileSync(join(outDir, SITE_ZIP_NAME), zipped);
        logger.info(
          `${SITE_ZIP_NAME} — ${Object.keys(files).length} files, ${(zipped.length / 1024 / 1024).toFixed(1)} MB`,
        );
      },
    },
  };
}
