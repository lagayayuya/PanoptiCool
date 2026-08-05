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
    private readonly v4: MmdbReader,
    private readonly v6: MmdbReader,
  ) {}

  /**
   * Loads both databases.
   *
   * ⚠ RETURNS `null` WHEN THEY ARE ABSENT, rather than throwing. A checkout that has not run the
   * fetch script is the normal state of a fresh clone, and the map must then show its DECLARED
   * layer — real GPS points, the facts — while saying the inferred layer is unavailable. Failing
   * hard here would take the whole module down for want of an optional file.
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
   */
  static async load(
    paths: { v4: string; v6: string } = GEO_DB_PATHS,
  ): Promise<MmdbGeoResolver | null> {
    try {
      const { Buffer } = await import('buffer');
      const g = globalThis as unknown as { Buffer?: typeof Buffer };
      if (g.Buffer === undefined) g.Buffer = Buffer;

      const { Reader } = await import('mmdb-lib');
      const [b4, b6] = await Promise.all([fetchBuffer(paths.v4), fetchBuffer(paths.v6)]);
      return new MmdbGeoResolver(
        new Reader(Buffer.from(b4)) as MmdbReader,
        new Reader(Buffer.from(b6)) as MmdbReader,
      );
    } catch {
      return null;
    }
  }

  lookup(ip: string): GeoHit | null {
    let r: FlatRecord | null;
    try {
      // IPv6 addresses are the ones carrying a colon — the only distinction the two databases need.
      r = ((ip.includes(':') ? this.v6 : this.v4).get(ip) ?? null) as FlatRecord | null;
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
