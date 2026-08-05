// Downloads the DB-IP City Lite databases into `public/geo/`.
//
// ⚠ THEY ARE NOT COMMITTED, and that is deliberate: ~40 MB of binary that every clone would pay for
// forever, re-published every month. A checked-in copy is a stale copy with extra steps.
//
// ⚠ LICENCE: CC BY 4.0 — attribution required, and it lives in `NOTICE` at the repository root.
// This is the whole reason the project uses DB-IP rather than GeoLite2: MaxMind's licence adds an
// End User Licence Agreement on top of CC BY-SA, requiring an account to download and a tracking
// pixel on redistribution, under terms a project like this one cannot renegotiate.
//
// The files are optional. Without them the map still draws its DECLARED layer — the real GPS points
// — and reports the inferred layer as unavailable (`MmdbGeoResolver.load` returns `null`).
//
// Run with:  node scripts/fetch-geo-db.mjs

import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, rm, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, '..', 'public', 'geo');

/**
 * `@ip-location-db` republishes DB-IP City Lite as MMDB with a FLAT schema, which is what
 * `mmdb-geo-resolver.ts` reads. The upstream DB-IP download is a CSV; this mirror is the reason the
 * adapter is a few dozen lines rather than a converter.
 *
 * ⚠ THE NPM TARBALL, NOT A CDN FILE URL. This script used to fetch the two `.mmdb` straight from
 * jsdelivr, which answers 403 for them — a CDN is free to refuse a 40 MB binary, and this one does.
 * The failure was quiet in the worst way: the script exits non-zero saying « degraded mode », the
 * map then draws no inferred layer, and the page reports « 0 villes déduites » as though the export
 * contained none. The registry serves the package itself, so that is what is asked for.
 */
const PACKAGE = '@ip-location-db/dbip-city-mmdb';
const WANTED = ['dbip-city-ipv4.mmdb', 'dbip-city-ipv6.mmdb'];

/** Below this, what arrived is an error page rather than a database. */
const MIN_PLAUSIBLE_BYTES = 1_000_000;

/** The tarball URL the registry currently points `latest` at. */
async function latestTarball() {
  const res = await fetch(`https://registry.npmjs.org/${PACKAGE.replace('/', '%2F')}/latest`);
  if (!res.ok) throw new Error(`registry answered HTTP ${res.status} for ${PACKAGE}`);
  const meta = await res.json();
  if (typeof meta?.dist?.tarball !== 'string') {
    throw new Error(`no tarball in the registry's answer for ${PACKAGE}`);
  }
  return { url: meta.dist.tarball, version: meta.version };
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'ignore', 'inherit'] });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const { url, version } = await latestTarball();
  process.stdout.write(`↓ ${PACKAGE}@${version} … `);

  const tgz = join(OUT_DIR, '.package.tgz');
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok || res.body === null) throw new Error(`HTTP ${res.status} for ${url}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(tgz));
  process.stdout.write(`${((await stat(tgz)).size / 1024 / 1024).toFixed(1)} MB\n`);

  // `--strip-components=1` drops the tarball's `package/` prefix; the two names are given so nothing
  // else in the archive is written into a served directory.
  await run('tar', [
    '-xzf',
    tgz,
    '-C',
    OUT_DIR,
    '--strip-components=1',
    ...WANTED.map((n) => `package/${n}`),
  ]);
  await rm(tgz);

  for (const name of WANTED) {
    const { size } = await stat(join(OUT_DIR, name));
    // A registry that answered 200 with something other than a database would otherwise leave a file
    // that fails much later, inside a worker, as an unreadable one.
    if (size < MIN_PLAUSIBLE_BYTES) {
      throw new Error(`${name} is ${size} B — too small to be a database; the download failed`);
    }
    console.log(`  ${name} — ${(size / 1024 / 1024).toFixed(1)} MB`);
  }
  console.log('\nDB-IP City Lite — CC BY 4.0. Attribution is in NOTICE; keep it there.');
}

main().catch((err) => {
  console.error(`\n${err.message}`);
  console.error(
    'The map will run without its inferred layer — this is a degraded mode, not a failure.',
  );
  process.exit(1);
});
