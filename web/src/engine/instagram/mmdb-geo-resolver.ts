// `GeoResolver` over an MMDB database, read in the browser, offline.
//
// ⚠ THE DATABASE IS DB-IP CITY LITE, NOT GEOLITE2, and the swap is a LICENCE decision rather than a
// technical one. Both answer the same question with the same flat schema; what differs is what a
// public AGPL repository may ship:
//
//   GeoLite2 (MaxMind)  — CC BY-SA 4.0 PLUS an End User Licence Agreement: an account to download,
//                         a tracking pixel required on redistribution, and terms that can change
//                         under a project that has no way to renegotiate them.
//   DB-IP City Lite     — CC BY 4.0. Attribution, and nothing else. It is in `NOTICE`.
//
// Both are distributed with a FLAT schema by `@ip-location-db` — `latitude`, `longitude`,
// `country_code`, `city` at the top level — which is NOT `mmdb-lib`'s nested `CityResponse`. Hence
// the cast at the read: the type from the library describes a shape this file does not receive.
//
// ⚠ THE FILES ARE NOT IN THIS REPOSITORY. They are ~40 MB of binary that would be committed once
// and paid for by every clone forever, and they are re-published monthly — a checked-in copy is a
// stale copy with extra steps. `scripts/fetch-geo-db.mjs` downloads them into `public/geo/`, and
// their absence is a DEGRADED MODE rather than a crash (see `load`).
//
// ─── WHAT THIS RESOLVER DOES NOT DO ─────────────────────────────────────────────────────────────
//   - IT NEVER CALLS OUT. The `fetch` below reads the site's OWN asset — same origin, a static file
//     the build placed there. An IP is never sent anywhere: that would hand a third party the exact
//     data this product exists to keep at home (ADR-0002);
//   - IT IS NOT ACCURATE, and nothing here pretends otherwise. City-level IP geolocation is a guess
//     — a VPN, a carrier NAT or a corporate proxy each defeat it entirely. That is why its output
//     feeds the `trajectory` layer, which the map draws as an inference (`geo.ts`);
//   - IT RESOLVES NOTHING IT DOES NOT KNOW. An unlisted range returns `null`, and the caller counts
//     it as an unlocated IP event rather than placing a pin somewhere plausible.

import type { GeoHit, GeoResolver } from './geo';

/**
 * The FLAT record `@ip-location-db` writes — not `mmdb-lib`'s nested `CityResponse`. Declared here
 * because reading it through the library's type would type-check against a shape that never
 * arrives.
 */
interface FlatRecord {
  latitude?: number;
  longitude?: number;
  country_code?: string;
  city?: string;
}

/** The minimum this file needs of `mmdb-lib`, so the import stays lazy and the type stays local. */
interface MmdbReader {
  get(ip: string): unknown;
}

export const GEO_DB_PATHS = {
  v4: '/geo/dbip-city-ipv4.mmdb',
  v6: '/geo/dbip-city-ipv6.mmdb',
} as const;

async function fetchBuffer(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`geo database not found: ${url} (${res.status})`);
  return res.arrayBuffer();
}

export class MmdbGeoResolver implements GeoResolver {
  private constructor(
    private v4: MmdbReader | null,
    private v6: MmdbReader | null,
    private readonly paths: { v4: string; v6: string } = GEO_DB_PATHS,
  ) {}

  /**
   * Answers whether the databases are THERE, and downloads nothing.
   *
   * ⚠ IT USED TO DOWNLOAD BOTH, ALWAYS — 134 MB per reader who opened the map, whatever their
   * export contained. The two files are 63 MB (v4) and 71 MB (v6); an export whose logins are all
   * IPv4, which is the common case, paid the larger of the two for nothing. `prepare` below is what
   * fetches, and only what the addresses need.
   *
   * ⚠ SO `load` IS A `HEAD`, and the semantics shift with it: a non-null resolver now means « the
   * site serves both files », not « both parsed ». That is what the worker needs at the moment it
   * needs it — the notice on screen goes up before the analysis, long before any address is known.
   *
   * ⚠ RETURNS `null` WHEN THEY ARE ABSENT, rather than throwing. A checkout that has not run the
   * fetch script is the normal state of a fresh clone, and the map must then show its DECLARED
   * layer — real GPS points, the facts — while saying the inferred layer is unavailable. Failing
   * hard here would take the whole module down for want of an optional file.
   */
  static async load(
    paths: { v4: string; v6: string } = GEO_DB_PATHS,
  ): Promise<MmdbGeoResolver | null> {
    try {
      const [r4, r6] = await Promise.all([
        fetch(paths.v4, { method: 'HEAD' }),
        fetch(paths.v6, { method: 'HEAD' }),
      ]);
      if (!r4.ok || !r6.ok) return null;
      return new MmdbGeoResolver(null, null, paths);
    } catch {
      return null;
    }
  }

  /**
   * Fetches the database each family of `ips` actually needs, and nothing else.
   *
   * ⚠ THIS IS WHERE THE 134 MB ARE DECIDED. An export with no IPv6 login never touches the 71 MB
   * file; one with no IPv4 never touches the 63 MB one; an empty list downloads nothing at all and
   * leaves the map its declared layer. Called once, before the lookups, by `geo.ts`.
   *
   * ⚠ AND `mmdb-lib` IS IMPORTED DYNAMICALLY, for two reasons that both matter: it must not enter
   * the TikTok bundle, and it references the Node global `Buffer` AT MODULE EVALUATION — so the
   * shim below has to be installed before the import expression runs, which a static import cannot
   * guarantee.
   *
   * ⚠ THE `buffer` PACKAGE IS AN EXPLICIT DEPENDENCY, not Node's builtin. The engine typechecks in
   * a SECOND PASS without DOM and without Node types (`src/engine/tsconfig.json`), where
   * `import('buffer')` resolves to nothing — and in a browser worker there is no builtin to resolve
   * to either. The npm package carries its own types and its own implementation, which is what
   * makes this line mean the same thing to the compiler and to the browser.
   *
   * ⚠ A FAILURE HERE IS SILENT, BY THE SAME LOGIC AS `load`. The files answered `HEAD` a moment
   * ago, so the interface has already said the layer is available; if the body then fails to arrive
   * or to parse, the readers stay `null`, every lookup returns `null`, and the map draws its
   * declared layer with a notice that is now optimistic. That window is the price of announcing the
   * layer before the analysis instead of after it.
   */
  async prepare(ips: readonly string[]): Promise<void> {
    // IPv6 addresses are the ones carrying a colon — the only distinction the two databases need.
    const needV6 = ips.some((ip) => ip.includes(':'));
    const needV4 = ips.some((ip) => !ip.includes(':'));
    if ((!needV4 || this.v4 !== null) && (!needV6 || this.v6 !== null)) return;

    try {
      const { Buffer } = await import('buffer');
      const g = globalThis as unknown as { Buffer?: typeof Buffer };
      if (g.Buffer === undefined) g.Buffer = Buffer;
      const { Reader } = await import('mmdb-lib');

      const load = async (url: string): Promise<MmdbReader> =>
        new Reader(Buffer.from(await fetchBuffer(url))) as unknown as MmdbReader;

      const [n4, n6] = await Promise.all([
        needV4 && this.v4 === null ? load(this.paths.v4) : Promise.resolve(this.v4),
        needV6 && this.v6 === null ? load(this.paths.v6) : Promise.resolve(this.v6),
      ]);
      this.v4 = n4;
      this.v6 = n6;
    } catch {
      // Left as they were: an unprepared family answers `null`, which `lookup` already handles.
    }
  }

  lookup(ip: string): GeoHit | null {
    let r: FlatRecord | null;
    try {
      // IPv6 addresses are the ones carrying a colon — the only distinction the two databases need.
      // A family `prepare` never fetched has no reader, and that is not an error: it is an address
      // whose database was not needed, or one whose download failed after `load` said it was there.
      const reader = ip.includes(':') ? this.v6 : this.v4;
      if (reader === null) return null;
      r = (reader.get(ip) ?? null) as FlatRecord | null;
    } catch {
      // A malformed address is not an error worth surfacing: it is one unlocated login among many.
      return null;
    }
    if (r === null || r.latitude == null || r.longitude == null) return null;
    // The city name is optional in the Lite databases, and a hit without one is still a position.
    // Building the object conditionally keeps `exactOptionalPropertyTypes` honest — an explicit
    // `city: undefined` is not the same thing as an absent key.
    return {
      lat: r.latitude,
      lon: r.longitude,
      ...(r.city !== undefined && r.city !== '' && { city: r.city }),
      ...(r.country_code !== undefined && r.country_code !== '' && { country: r.country_code }),
    };
  }
}
