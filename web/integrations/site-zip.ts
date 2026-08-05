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
//   - IT DOES NOT VERIFY THE CONTENT of the zip. It packages what the build wrote; whether that
//     output is correct is the build's concern, not this file's. CI only verifies that the file EXISTS.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { zipSync } from 'fflate';
// The name lives in `install-help.ts`, which also composes it into route B's copyable command.
// Importing it here rather than recopying it: two names that drift apart are a dead link.
import { SITE_ZIP_NAME } from '../src/ai/install-help';

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
        const files: Record<string, Uint8Array> = {};
        for (const full of walk(outDir)) {
          // A zip entry's separators are `/` on every platform.
          const entry = relative(outDir, full).split(sep).join('/');
          // A build on top of a build does not embed itself.
          if (entry === SITE_ZIP_NAME) continue;
          files[entry] = new Uint8Array(readFileSync(full));
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
