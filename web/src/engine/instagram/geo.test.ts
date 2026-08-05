// THE GEO EXTRACTOR — and the four ways a map lies.
//
// Every fixture is a hand-written SHAPE from `docs/instagram-export-schema.md`, with invented
// coordinates. No fragment of a real export: the points below are in the middle of oceans and
// deserts on purpose, so that a leak would be visible rather than plausible.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - THE RESOLVER. `GeoResolver` is a stub here. Whether DB-IP actually answers for a given IP,
//     how big the database is and how it is loaded are the adapter's business, not the engine's —
//     which is the point of injecting it;
//   - WHETHER THE PATHS ARE RIGHT. A wrong path yields an empty section, which is exactly the
//     failure this connector cannot tell from an empty account. Paths are checked against the
//     contract by a human reading and by nothing else;
//   - THE MEDIA JOIN AT SCALE. The ±120 s join is linear over the media index; with 1 000 media
//     and 500 posts that is 500 000 comparisons, which nothing here measures;
//   - PRIVACY OF THE RENDER. That `sensitive` points are actually blurred is the interface's
//     business. This file only asserts that the flag is set on the right one.

import { describe, expect, it } from 'vitest';
import { citiesFromTrajectory, type GeoResolver, runGeo, type TrajectoryPoint } from './geo';
import { LabelCoverage } from './labels';

function fakeSource(files: Record<string, unknown>) {
  return {
    readJson: <T>(p: string): Promise<T> =>
      p in files ? Promise.resolve(files[p] as T) : Promise.reject(new Error('absent')),
  };
}

/** Resolves two invented IPs to two invented places; everything else is unknown. */
const RESOLVER: GeoResolver = {
  lookup: (ip) =>
    ip === '203.0.113.7'
      ? { lat: 12.5, lon: -30.25, city: 'Inferred-City', country: 'ZZ' }
      : ip === '203.0.113.8'
        ? { lat: 40.125, lon: -70.5, city: 'Other-City', country: 'ZZ' }
        : null,
};

const NEVER: GeoResolver = { lookup: () => null };

describe('the two layers stay apart', () => {
  it('a post GPS is DECLARED and a login IP is TRAJECTORY — never the reverse', async () => {
    const r = await runGeo(
      fakeSource({
        'your_instagram_activity/media/posts.json': [
          {
            timestamp: 1_700_000_000,
            label_values: [
              { label: 'Latitude', value: '48.85' },
              { label: 'Longitude', value: '2.35' },
            ],
          },
        ],
        'security_and_login_information/login_and_profile_creation/profile_activity.json': [
          {
            label_values: [
              { label: 'Adresse IP', value: '203.0.113.7' },
              { label: 'Dernière connexion', timestamp_value: 1_700_000_500 },
            ],
          },
        ],
      }),
      RESOLVER,
      'fr',
    );
    expect(r.declared).toHaveLength(1);
    expect(r.declared[0]?.kind).toBe('post');
    expect(r.trajectory).toHaveLength(1);
    // The trajectory point carries the RESOLVER's coordinates, not the post's — the two layers do
    // not feed each other.
    expect(r.trajectory[0]?.lat).toBe(12.5);
    expect(r.counts).toMatchObject({ posts: 1, ipEvents: 1, geolocated: 1, distinctIps: 1 });
  });

  it('the LAST KNOWN position is the one marked sensitive', async () => {
    const r = await runGeo(
      fakeSource({
        'security_and_login_information/login_and_profile_creation/last_known_location.json': [
          {
            string_map_data: {
              // Mojibake, as it arrives.
              'Latitude exacte': { value: '-8.5' },
              'Longitude exacte': { value: '110.25' },
            },
          },
        ],
      }),
      NEVER,
      'fr',
    );
    expect(r.declared).toHaveLength(1);
    // Both directions in one assertion: it IS the last-known point AND it IS the sensitive one.
    expect(r.declared[0]).toMatchObject({ kind: 'last-known', sensitive: true });
    expect(r.counts.lastKnown).toBe(1);
  });
});

describe("⚠ Meta's own city beats the IP guess", () => {
  const withDeclaredPlace = {
    'security_and_login_information/login_and_profile_creation/profile_activity.json': [
      {
        label_values: [
          { label: 'Adresse IP', value: '203.0.113.7' },
          { label: 'Dernière connexion', timestamp_value: 1_700_000_500 },
          // ⚠ NESTED ONE LEVEL DOWN. A flat read of `label_values` does not see this, and that is
          // exactly how 199 declared cities became Geo-IP guesses in the prototype.
          { label: 'DÃ©tails', dict: [{ label: 'Lieu', value: 'Declared-City, ZZ' }] },
        ],
      },
    ],
  };

  it('takes the declared name, keeps the IP coordinates, and says which is which', async () => {
    const r = await runGeo(fakeSource(withDeclaredPlace), RESOLVER, 'fr');
    const p = r.trajectory[0];
    expect(p?.city).toBe('Declared-City');
    expect(p?.country).toBe('ZZ');
    expect(p?.cityDeclared).toBe(true);
    // The position is still the resolver's: Meta names a city, it does not give a fix. Upgrading
    // the label to a position would turn a guess into a claim.
    expect(p?.lat).toBe(12.5);
    expect(r.counts.declaredPlaces).toBe(1);
  });

  it('falls back to the inferred name, and does NOT claim it was declared', async () => {
    const r = await runGeo(
      fakeSource({
        'security_and_login_information/login_and_profile_creation/profile_activity.json': [
          {
            label_values: [
              { label: 'Adresse IP', value: '203.0.113.7' },
              { label: 'Dernière connexion', timestamp_value: 1_700_000_500 },
            ],
          },
        ],
      }),
      RESOLVER,
      'fr',
    );
    expect(r.trajectory[0]?.city).toBe('Inferred-City');
    // The bearing half: the flag must be ABSENT, not false-y by accident. Without this the
    // interface cannot draw the two differently, which is the whole doctrine of the module.
    expect(r.trajectory[0]?.cityDeclared).toBeUndefined();
    expect(r.counts.declaredPlaces).toBe(0);
  });
});

describe('⚠ what is refused', () => {
  it('rejects (0, 0) — Null Island is what an absent GPS fix serialises to', async () => {
    const r = await runGeo(
      fakeSource({
        'your_instagram_activity/media/posts.json': [
          {
            timestamp: 1,
            label_values: [
              { label: 'Latitude', value: '0' },
              { label: 'Longitude', value: '0' },
            ],
          },
          {
            timestamp: 2,
            label_values: [
              { label: 'Latitude', value: '-8.5' },
              { label: 'Longitude', value: '110.25' },
            ],
          },
        ],
      }),
      NEVER,
      'fr',
    );
    // Both directions: the real point survives AND Null Island does not. Asserting only the count
    // would pass if the wrong one had been kept.
    expect(r.declared).toHaveLength(1);
    expect(r.declared[0]?.lat).toBe(-8.5);
  });

  it('counts an UNDATED login as an IP event but places no point', async () => {
    const r = await runGeo(
      fakeSource({
        'security_and_login_information/login_and_profile_creation/profile_activity.json': [
          { label_values: [{ label: 'Adresse IP', value: '203.0.113.7' }] },
        ],
      }),
      RESOLVER,
      'fr',
    );
    expect(r.counts.ipEvents).toBe(1);
    expect(r.counts.distinctIps).toBe(1);
    // Dating it « now » or dropping the event would each be a different lie. It is counted and
    // unplaced.
    expect(r.trajectory).toEqual([]);
    expect(r.timeRange).toBeNull();
  });

  it('an IP the resolver does not know is counted, never guessed', async () => {
    const r = await runGeo(
      fakeSource({
        'security_and_login_information/login_and_profile_creation/profile_activity.json': [
          {
            label_values: [
              { label: 'Adresse IP', value: '198.51.100.1' },
              { label: 'Dernière connexion', timestamp_value: 1_700_000_500 },
            ],
          },
        ],
      }),
      RESOLVER,
      'fr',
    );
    expect(r.counts.ipEvents).toBe(1);
    expect(r.counts.geolocated).toBe(0);
    expect(r.trajectory).toEqual([]);
  });
});

describe('addresses', () => {
  it('reads both French spellings of the region, and deduplicates identical cards', async () => {
    const card = (region: string) => ({
      label_values: [
        { label: 'Ligne d’adresse 1', value: '1 rue Inventée' },
        { label: 'Ville', value: 'Ville-Fictive' },
        { label: region, value: 'Région-Fictive' },
        { label: 'Code postal', value: '00000' },
      ],
    });
    const r = await runGeo(
      fakeSource({
        // ⚠ « Région » in one file, « État » in another — both real, and listing one would have
        // silently emptied the other's field.
        'personal_information/autofill_information/autofill_information.json': [
          card('Région'),
          card('État'),
        ],
      }),
      NEVER,
      'fr',
    );
    expect(r.addresses).toHaveLength(1);
    expect(r.addresses[0]?.region).toBe('Région-Fictive');
  });

  it('an address carries no coordinates — it is a panel, never a pin', async () => {
    const r = await runGeo(
      fakeSource({
        'personal_information/autofill_information/autofill_information.json': [
          { label_values: [{ label: 'Ville', value: 'Ville-Fictive' }] },
        ],
      }),
      NEVER,
      'fr',
    );
    expect(r.addresses).toHaveLength(1);
    // Geocoding a street would invent a precision the export does not contain.
    expect(r.declared).toEqual([]);
    expect(r.trajectory).toEqual([]);
  });
});

describe('cities and periods', () => {
  const at = (ts: number, city?: string): TrajectoryPoint => ({
    lat: 12.5,
    lon: -30.25,
    ts,
    ...(city !== undefined && { city }),
  });
  const DAY = 86_400;

  it('splits two stays separated by more than the gap, and joins what is closer', () => {
    const cities = citiesFromTrajectory([
      at(0, 'A'),
      at(10 * DAY, 'A'),
      // 200 days later: a second stay, not one very long one.
      at(210 * DAY, 'A'),
    ]);
    expect(cities).toHaveLength(1);
    expect(cities[0]?.visits).toBe(3);
    expect(cities[0]?.periods).toEqual([
      { from: 0, to: 10 * DAY },
      { from: 210 * DAY, to: 210 * DAY },
    ]);
  });

  it('⚠ an unnamed city stays EMPTY rather than being called « unknown »', () => {
    const cities = citiesFromTrajectory([at(0), at(DAY)]);
    // « Lieu inconnu » was a false name: it took a line in the list and a label on the map as
    // though it designated somewhere.
    expect(cities[0]?.city).toBe('');
    expect(cities[0]?.visits).toBe(2);
  });

  it('sorts by visits, descending', () => {
    const cities = citiesFromTrajectory([at(0, 'A'), at(DAY, 'B'), at(2 * DAY, 'B')]);
    expect(cities.map((c) => c.city)).toEqual(['B', 'A']);
  });
});

describe('absence and coverage', () => {
  it('an empty export yields an empty report, not an error', async () => {
    const r = await runGeo(fakeSource({}), NEVER, 'fr');
    expect(r.declared).toEqual([]);
    expect(r.trajectory).toEqual([]);
    expect(r.addresses).toEqual([]);
    expect(r.timeRange).toBeNull();
  });

  it('records which labels it matched — the connector’s only symptom', async () => {
    const coverage = new LabelCoverage();
    await runGeo(
      fakeSource({
        'security_and_login_information/login_and_profile_creation/profile_activity.json': [
          {
            label_values: [
              { label: 'Adresse IP', value: '203.0.113.7' },
              { label: 'Dernière connexion', timestamp_value: 1_700_000_500 },
            ],
          },
        ],
      }),
      RESOLVER,
      'fr',
      coverage,
    );
    const { missed } = coverage.summary();
    expect(missed).not.toContain('ipAddress');
    expect(missed).not.toContain('lastLogin');
    // And a label the fixture does not carry stays missed — otherwise the counter would report
    // coverage it does not have, which is worse than no counter.
    expect(missed).toContain('preciseLatitude');
  });
});
