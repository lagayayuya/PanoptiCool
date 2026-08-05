// THE BASE MAP — that it is offline, complete, and does not draw six lines across the world.
//
// The antimeridian defect is the one worth a net: it is invisible in the data, obvious on screen,
// and comes back on any change to how rings are walked. Six horizontal strokes across the whole map
// is not a subtle failure — but nothing in the pipeline notices, because the GeoJSON is perfectly
// well-formed either way.
//
// ─── ⚠ WHAT THIS NET DOES NOT COVER ─────────────────────────────────────────────────────────────
//   - ANY PIXEL. That MapLibre draws these lines where they belong is not asserted anywhere;
//   - WHETHER THE OUTLINES ARE CORRECT. It is Natural Earth's 110m set, taken as given. Nothing here
//     checks a border against anything, and the module makes no claim about who a territory belongs
//     to;
//   - THE FILL ARTEFACTS. The reason there is no fill layer at all lives in the map piece, and is a
//     GPU-dependent rendering fault no unit test can reach.

import { describe, expect, it } from 'vitest';
import { countryLinesGeoJson } from './basemap';

const fc = countryLinesGeoJson();

describe('the country outlines', () => {
  it('are there, and are all line strings', () => {
    expect(fc.type).toBe('FeatureCollection');
    expect(fc.features.length).toBeGreaterThan(150);
    expect(fc.features.every((f) => f.geometry.type === 'LineString')).toBe(true);
  });

  it('⚠ never join two points across the antimeridian', () => {
    // Six edges of the 110m set jump from +180° to −180° (Russia ×4, Fiji ×2). MapLibre's `line`
    // layer joins consecutive vertices literally, so each one drew a stroke across the whole map.
    const crossings: string[] = [];
    for (const f of fc.features) {
      const c = f.geometry.coordinates;
      for (let i = 1; i < c.length; i++) {
        const lon = c[i]?.[0];
        const prev = c[i - 1]?.[0];
        if (lon !== undefined && prev !== undefined && Math.abs(lon - prev) > 180) {
          crossings.push(`${prev} → ${lon}`);
        }
      }
    }
    expect(crossings, 'edges spanning the antimeridian').toEqual([]);
  });

  it('leaves out Antarctica, whose polygon breaks the tessellation', () => {
    // It touches the pole and spans ±180°: the degenerate case that produced dark blocks aligned to
    // the tiles. Checked by latitude, since the outlines carry no identity once cut into lines.
    const below80 = fc.features.filter((f) =>
      f.geometry.coordinates.some((p) => (p[1] as number) < -80),
    );
    expect(below80).toEqual([]);
  });

  it('keeps segments long enough to draw — a cut must not shatter a ring', () => {
    // A cut that fired on every vertex would leave a collection of two-point stubs: still valid
    // GeoJSON, still « no crossings », and an empty-looking map.
    const longest = Math.max(...fc.features.map((f) => f.geometry.coordinates.length));
    expect(longest).toBeGreaterThan(50);
  });

  it('spans both hemispheres, so nothing was dropped wholesale', () => {
    const lons = fc.features.flatMap((f) => f.geometry.coordinates.map((p) => p[0] as number));
    expect(Math.min(...lons)).toBeLessThan(-150);
    expect(Math.max(...lons)).toBeGreaterThan(150);
  });
});
