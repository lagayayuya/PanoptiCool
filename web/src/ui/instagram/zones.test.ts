// THE ZONE GEOMETRY — the part of the map that can be checked without a GPU.
//
// Everything here fails SILENTLY on a map: zones that group too wide still look like zones, a
// tooltip that announces four places where the eye sees two still reads as a tooltip, and a radius
// frozen in pixels still draws blobs. None of it throws, and none of it is visible in a screenshot
// unless you already know what you are looking for.
//
// ─── ⚠ WHAT THIS NET DOES NOT COVER ─────────────────────────────────────────────────────────────
//   - ANY PIXEL. `radiusByZoom`/`coreRadiusByZoom` return MapLibre EXPRESSIONS; that they are
//     well-formed is asserted, that MapLibre renders what they mean is not;
//   - ⚠ THE RAMP'S CUT AND INTENSITY. `ZONE_CUT` and `ZONE_INTENSITY` mirror values written in the
//     map piece's LAYER, and only a rendered map shows the two disagreeing. The kernel constants
//     used to be in this list too — see the shader test at the bottom, which took them out of it;
//   - THE TWINNING BETWEEN `SPREAD` AND `spreadFor`, which is the module's own warning. They are two
//     expressions of one rule — one in the style language, one in JS — and only a rendered map
//     shows them disagreeing. What is asserted is that the JS half behaves as documented;
//   - WHETHER THE GROUPING MATCHES WHAT THE EYE SEES. That was tuned by looking, against a real
//     export. These tests hold the SHAPE of the rule, not the ratified feel of it.
//
// ─── VERIFIED BY MUTATION, and what each one DID ────────────────────────────────────────────────
//   1. hit-tested on the nominal radius instead of the visible one → red;
//   2. stopped the zoom interpolation at z=11, as it used to be → red on two, naming the missing
//      stops;
//   3. made the spread linear in `n` instead of by square root → ⚠ STAYED GREEN at first. The test
//      asserted the documented 5.5 ratio between 345 logins and 1, and BOTH curves saturate against
//      the same clamp at that scale: it was measuring the clamp. Rewritten to pin the shape where
//      nothing saturates — equal increments across n = 1, 4, 9 — it goes red;
//   4. grouped pairs only, dropping the transitive walk → red on the chain;
//   5. changed the kernel constant inside the INSTALLED MapLibre bundle, simulating an upgrade that
//      moves it → red. The bundle was restored and checked byte-identical afterwards.

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  buildZones,
  coreRadiusByZoom,
  radiusByZoom,
  radiusKm,
  spreadFor,
  type Traj,
  toZonesFC,
  visibleKm,
  ZONE_KM,
  zoneAt,
} from './zones';

const T = 1_700_000_000;

/** A login at a place, `n` times over. */
function logins(lon: number, lat: number, n: number, ts = T): Traj[] {
  return Array.from({ length: n }, (_, i) => ({ lon, lat, ts: ts + i }));
}

describe('grouping by coordinate', () => {
  it('⚠ merges logins that share a coordinate — hundreds from one box are ONE place', () => {
    // A geo-IP database returns a block's centroid, so a home connection lands on the same spot
    // every time. Left unmerged they draw nothing extra and crush the layer's scale.
    const fc = toZonesFC([...logins(2.35, 48.85, 300), ...logins(4.85, 45.75, 2)]);
    expect(fc.features).toHaveLength(2);
    expect(fc.features.map((f) => f.properties.n).sort((a, b) => b - a)).toEqual([300, 2]);
  });

  it('rounds to four decimals, so a jitter below ~10 m does not split a place in two', () => {
    const fc = toZonesFC([...logins(2.35001, 48.85, 1), ...logins(2.350014, 48.85, 1)]);
    expect(fc.features).toHaveLength(1);
  });

  it('keeps the span of what it merged', () => {
    const zones = buildZones([
      { lon: 2.35, lat: 48.85, ts: 100 },
      { lon: 2.35, lat: 48.85, ts: 900 },
    ]);
    expect(zones[0]?.from).toBe(100);
    expect(zones[0]?.to).toBe(900);
    expect(zones[0]?.count).toBe(2);
    expect(zones[0]?.places).toBe(1);
  });
});

describe('the extent of a place', () => {
  it('⚠ grows by SQUARE ROOT, so one busy place does not cover the country', () => {
    // ⚠ THE OBVIOUS TEST HERE DOES NOT WORK, and a mutation established that rather than reasoning:
    // asserting « spreadFor(345)/spreadFor(1) is about 5.5 » stays GREEN when the root is removed
    // and the spread made linear in `n`, because both saturate against the same clamp at that
    // scale. It measured the clamp and said « square root ».
    //
    // What distinguishes them is the SHAPE in the middle of the range, where nothing saturates. By
    // square root, n = 1, 4, 9 give r = 1, 2, 3 — evenly spaced, so the two increments are equal.
    const step1 = spreadFor(4) - spreadFor(1);
    const step2 = spreadFor(9) - spreadFor(4);
    expect(step2).toBeCloseTo(step1, 10);

    // And the top of the range is not reached early: at 100 logins there is still room to grow.
    expect(spreadFor(100)).toBeLessThan(spreadFor(1000));

    // The documented ratio, kept because it is the argument the tuning was chosen on — now stated
    // as what it is: a consequence, not the property that pins the curve.
    const ratio = spreadFor(345) / spreadFor(1);
    expect(ratio).toBeGreaterThan(4.5);
    expect(ratio).toBeLessThan(6);
  });

  it('is monotonic, and clamps at both ends', () => {
    let previous = -1;
    for (const n of [0, 1, 2, 10, 50, 200, 1000, 100_000]) {
      const r = spreadFor(n);
      expect(r, `at n=${n}`).toBeGreaterThanOrEqual(previous);
      previous = r;
    }
    // Past the top stop the spread holds rather than running away.
    expect(spreadFor(100_000)).toBe(spreadFor(1000));
    expect(spreadFor(0)).toBe(spreadFor(1));
  });

  it('⚠ is SMALLER seen than nominal — about 40 %, which is why the tooltip uses the visible one', () => {
    // « 14 km radius » is what the kernel is given; what is drawn is where the density crosses the
    // ramp. Announcing the nominal radius would group places the eye sees apart.
    expect(visibleKm(1)).toBeLessThan(radiusKm(1));
    expect(visibleKm(1) / radiusKm(1)).toBeGreaterThan(0.2);
    expect(visibleKm(1) / radiusKm(1)).toBeLessThan(0.6);
  });
});

describe('zones', () => {
  it('joins two places that are close, and leaves apart two that are not', () => {
    // ~9 km apart at this latitude: inside one zone's reach.
    const near = buildZones([...logins(2.35, 48.85, 5), ...logins(2.47, 48.85, 5)]);
    expect(near).toHaveLength(1);
    expect(near[0]?.places).toBe(2);
    expect(near[0]?.count).toBe(10);

    // Paris and Lyon: nothing joins them.
    const far = buildZones([...logins(2.35, 48.85, 5), ...logins(4.85, 45.75, 5)]);
    expect(far).toHaveLength(2);
  });

  it('⚠ joins TRANSITIVELY — a chain of places is one zone, as it is drawn', () => {
    // The layer is additive, so a chain of overlapping blobs renders as one mass. A grouping that
    // only compared pairs would announce three zones where the eye sees one.
    const chain = buildZones([
      ...logins(2.35, 48.85, 5),
      ...logins(2.47, 48.85, 5),
      ...logins(2.59, 48.85, 5),
    ]);
    expect(chain).toHaveLength(1);
    expect(chain[0]?.places).toBe(3);
  });

  it('finds the zone under the cursor, and nothing where there is nothing', () => {
    const zones = buildZones(logins(2.35, 48.85, 20));
    expect(zoneAt(zones, 2.35, 48.85)?.count).toBe(20);
    // Far outside the visible radius.
    expect(zoneAt(zones, 8.0, 48.85)).toBeNull();
  });

  it('⚠ hit-tests on the VISIBLE radius, not the nominal one', () => {
    // A cursor between the two is over a zone the eye does not see there — which is exactly the
    // tooltip that used to announce places nothing joined on screen.
    const zones = buildZones(logins(2.35, 48.85, 1));
    const visible = visibleKm(1);
    const nominal = radiusKm(1);
    expect(nominal).toBeGreaterThan(visible);
    // A point at 80 % of the NOMINAL radius, which is beyond the visible one.
    const degPerKm = 1 / 110.574;
    const outside = 48.85 + nominal * 0.8 * degPerKm;
    expect(visible * 0.8).toBeLessThan(nominal * 0.8);
    expect(zoneAt(zones, 2.35, outside)).toBeNull();
  });
});

describe('the zoom expressions', () => {
  it('⚠ run to z=14 — held frozen earlier, the zones shrank on the ground', () => {
    // Past the last stop `interpolate` holds the final value, so the radius stopped being a ground
    // distance and the zones drifted apart. An artefact, not a reading.
    const expr = radiusByZoom(48.85) as unknown[];
    expect(expr[0]).toBe('interpolate');
    expect(expr[2]).toEqual(['zoom']);
    const stops = expr.slice(3);
    // 15 levels, each a (zoom, value) pair.
    expect(stops).toHaveLength(30);
    expect(stops[0]).toBe(0);
    expect(stops[28]).toBe(14);
  });

  it('doubles with each zoom level, which is what makes the radius a ground distance', () => {
    expect((radiusByZoom(48.85) as unknown[])[1]).toEqual(['exponential', 2]);
  });

  it('keeps a floor, so a zone never becomes invisible at world scale', () => {
    const stops = (radiusByZoom(48.85) as unknown[]).slice(3);
    // Every value is a `max` against the floor — the one place the scale lies, and it lies towards
    // the visible.
    expect((stops[1] as unknown[])[0]).toBe('max');
    expect((stops[1] as unknown[])[1]).toBe(7);
  });

  it('gives the core a smaller radius than the zone at the same zoom', () => {
    const zone = (radiusByZoom(48.85) as unknown[]).slice(3);
    const core = (coreRadiusByZoom(48.85) as unknown[]).slice(3);
    // At a high zoom the floor no longer binds, so the ground factors are comparable.
    const groundOf = (stop: unknown) => ((stop as unknown[])[2] as unknown[])[1] as number;
    expect(groundOf(core[29])).toBeLessThan(groundOf(zone[29]));
  });
});

describe('the constants that mirror the layer', () => {
  it('holds the ratified ground radius', () => {
    // Changing it is a decision about how much territory one login claims, not a tuning.
    expect(ZONE_KM).toBe(14);
  });

  it('⚠ mirrors the kernel MAPLIBRE ACTUALLY SHIPS, read from its shader', () => {
    // ⚠ THIS WAS A DECLARED BLIND SPOT, and it stopped being one when the library landed. `zones.ts`
    // reproduces MapLibre's heat kernel in JS so the hover groups what the eye sees joined:
    //
    //     density = weight × intensity × GAUSS_COEF × exp(−4.5 · r²)
    //
    // Those two numbers were read in the shader source of the version the prototype was tuned
    // against. If an upgrade changes them, every zone boundary this module computes silently stops
    // matching what is drawn — a tooltip announcing places that are not joined, with nothing red.
    //
    // So they are read from the INSTALLED shader rather than trusted. The GLSL is minified into the
    // bundle; the two forms below are what it looks like there.
    // ⚠ THE BUNDLE IS FOUND, NOT NAMED. MapLibre 6 ships `maplibre-gl.mjs`, 5 ships `maplibre-gl.js`,
    // and pinning the filename made this go red on a version change for a reason that had nothing to
    // do with the kernel it watches — noise exactly where a real signal has to stay legible.
    const dist = join(
      dirname(fileURLToPath(import.meta.url)),
      '../../../node_modules/maplibre-gl/dist',
    );
    const bundle = readdirSync(dist).find(
      (f) =>
        /^maplibre-gl\.(js|mjs)$/.test(f) &&
        readFileSync(join(dist, f), 'utf8').includes('GAUSS_COEF'),
    );
    expect(bundle, 'no MapLibre bundle carrying the heatmap shader was found').toBeDefined();
    const shader = readFileSync(join(dist, bundle as string), 'utf8');
    expect(shader, 'the heatmap shader was not found — the bundle layout changed').toContain(
      '#define GAUSS_COEF 0.3989422804014327',
    );
    // `-0.5 * 3.0 * 3.0 · r²` is `-4.5 · r²`, which is `KERNEL_K`.
    expect(shader).toContain('float d=-0.5*3.0*3.0*dot(v_extrude,v_extrude)');
    expect(shader).toContain('weight*u_intensity*GAUSS_COEF*exp(d)');
  });
});
