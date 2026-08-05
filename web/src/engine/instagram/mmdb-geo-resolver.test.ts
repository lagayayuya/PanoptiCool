// THE GEO RESOLVER — mostly, that its ABSENCE is a degraded mode rather than a failure.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - ⚠ IT NEVER READS A REAL DATABASE. The DB-IP files are ~40 MB and are not in this repository
//     (`NOTICE`, `scripts/fetch-geo-db.mjs`), so `mmdb-lib`'s own parsing is exercised by nothing
//     here. What is asserted is the SHAPE MAPPING — the flat record `@ip-location-db` writes into
//     the `GeoHit` the engine reads — and the failure paths around it;
//   - ACCURACY, at all. Whether an address really is in that city is not a question code can
//     answer, and it is why the output feeds the map's INFERRED layer;
//   - THE FETCH SCRIPT. Nothing here downloads anything; a test that reaches a CDN is a test that
//     fails on a train.

import { describe, expect, it, vi } from 'vitest';
import { GEO_DB_PATHS, MmdbGeoResolver } from './mmdb-geo-resolver';

describe('⚠ an absent database is a degraded mode', () => {
  it('returns null rather than throwing when the files are not there', async () => {
    // The normal state of a fresh clone. Failing hard here would take the whole map down for want
    // of an OPTIONAL file — and the declared layer, which is the factual one, needs no database.
    const fetchSpy = vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 404 })),
    );
    try {
      await expect(MmdbGeoResolver.load()).resolves.toBeNull();
    } finally {
      vi.unstubAllGlobals();
      void fetchSpy;
    }
  });

  it('reads the site’s OWN asset paths — never a third-party endpoint', () => {
    // ⚠ THE ASSERTION THAT MATTERS MOST IN THIS FILE. Sending an IP to a geolocation API would hand
    // a third party the exact data this product exists to keep at home (ADR-0002). Both paths are
    // root-relative, so they can only resolve to the site's own origin.
    for (const p of Object.values(GEO_DB_PATHS)) {
      expect(p.startsWith('/')).toBe(true);
      expect(p).not.toMatch(/^https?:/);
    }
  });
});

describe('the flat record becomes a GeoHit', () => {
  /** Builds a resolver over a fake reader, bypassing the load path. */
  function resolverOver(record: unknown): MmdbGeoResolver {
    const reader = { get: () => record };
    // The constructor is private by design — the two readers are an implementation detail. Reaching
    // past it here is what lets the mapping be tested without a 40 MB fixture.
    return new (MmdbGeoResolver as unknown as new (a: unknown, b: unknown) => MmdbGeoResolver)(
      reader,
      reader,
    );
  }

  it('keeps the city and the country when the Lite database has them', () => {
    const hit = resolverOver({
      latitude: 12.5,
      longitude: -30.25,
      city: 'Ville-Fictive',
      country_code: 'ZZ',
    }).lookup('203.0.113.7');
    expect(hit).toEqual({ lat: 12.5, lon: -30.25, city: 'Ville-Fictive', country: 'ZZ' });
  });

  it('⚠ OMITS an absent city rather than setting it to undefined', () => {
    // The Lite databases often answer with a position and no name. Under
    // `exactOptionalPropertyTypes` an explicit `city: undefined` is NOT the same as an absent key,
    // and the difference reaches the interface: `citiesFromTrajectory` groups on the NAME when
    // there is one and on rounded coordinates otherwise.
    const hit = resolverOver({ latitude: 1, longitude: 2 }).lookup('203.0.113.7');
    expect(hit).toEqual({ lat: 1, lon: 2 });
    expect(Object.hasOwn(hit as object, 'city')).toBe(false);
  });

  it('returns null for an unknown range, a partial record, or a malformed address', () => {
    // Three different causes, one honest answer: the caller counts an unlocated IP event rather
    // than placing a pin somewhere plausible.
    expect(resolverOver(null).lookup('203.0.113.7')).toBeNull();
    expect(resolverOver({ latitude: 1 }).lookup('203.0.113.7')).toBeNull();
    const throwing = new (
      MmdbGeoResolver as unknown as new (
        a: unknown,
        b: unknown,
      ) => MmdbGeoResolver
    )(
      {
        get: () => {
          throw new Error('malformed');
        },
      },
      { get: () => null },
    );
    expect(throwing.lookup('not-an-ip')).toBeNull();
  });

  it('sends a colonned address to the v6 reader and everything else to v4', () => {
    const v4 = { get: () => ({ latitude: 4, longitude: 4 }) };
    const v6 = { get: () => ({ latitude: 6, longitude: 6 }) };
    const r = new (MmdbGeoResolver as unknown as new (a: unknown, b: unknown) => MmdbGeoResolver)(
      v4,
      v6,
    );
    expect(r.lookup('203.0.113.7')?.lat).toBe(4);
    expect(r.lookup('2001:db8::1')?.lat).toBe(6);
  });
});
