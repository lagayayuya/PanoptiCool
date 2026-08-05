// THE BASE MAP — country outlines, 100 % OFFLINE.
//
// Natural Earth 110m via `world-atlas`, converted from TopoJSON to GeoJSON at load. ⚠ NO NETWORK
// TILES, and that is the invariant rather than a preference: a map that fetched tiles would tell a
// tile server, request by request, exactly where someone had been looking on their own export. The
// whole product's promise is that nothing leaves the device, and a base map is not an exception to
// it.
//
// 110m and NOT 50m: the 50m set contains polygons crossing the antimeridian which worsen the fill
// artefacts below.
//
// ANTARCTICA is excluded: its polygon touches the pole (−90°) and spans ±180° of longitude — the
// classic degenerate case that breaks MapLibre's fill tessellation at some zooms (dark blocks
// aligned to the tiles). Beside the point here in any case.
//
// ─── ⚠ WHAT THIS MODULE DOES NOT DO ─────────────────────────────────────────────────────────────
//   - IT DRAWS NO FILL. Only outlines — see `countryLinesGeoJson` on why, and the map piece's own
//     header on the seams that a covering layer produced on some GPUs;
//   - IT IS NOT A GEOCODER. It knows country shapes and nothing else: no name, no border status, no
//     claim about who a territory belongs to. Nothing in the dossier reads a country from it.

import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';

/** The two shapes needed from GeoJSON, declared rather than depended on — as in `zones.ts`. */
type Ring = number[][];
interface LineFeature {
  readonly type: 'Feature';
  readonly geometry: { readonly type: 'LineString'; readonly coordinates: Ring };
  readonly properties: Record<string, never>;
}
export interface LineCollection {
  readonly type: 'FeatureCollection';
  readonly features: readonly LineFeature[];
}

/** ISO 3166-1 numeric code of Antarctica in `world-atlas`. */
const ANTARCTICA_ID = '010';

interface TopoLike {
  objects: { countries: unknown };
}

interface PolygonalFeature {
  id?: string | number;
  geometry?:
    | { type: 'Polygon'; coordinates: Ring[] }
    | { type: 'MultiPolygon'; coordinates: Ring[][] }
    | { type: string; coordinates?: unknown };
}

function countries(): PolygonalFeature[] {
  const topo = world as unknown as TopoLike;
  // `topojson-client`'s typings are loose; the result is a FeatureCollection.
  const fc = feature(topo as never, topo.objects.countries as never) as unknown as {
    features: PolygonalFeature[];
  };
  return fc.features.filter((f) => String(f.id) !== ANTARCTICA_ID);
}

/**
 * Country outlines as LINES, cut at the antimeridian.
 *
 * ⚠ MapLibre's `line` layer literally joins two consecutive vertices. Six edges of the 110m set jump
 * from +180° to −180° (Russia ×4 in the north, Fiji ×2 in the south) → six horizontal strokes across
 * the whole map. Each ring is broken as soon as a longitude jump exceeds 180°: the line stops (an
 * invisible cut at the map's edge) instead of crossing.
 */
export function countryLinesGeoJson(): LineCollection {
  const lines: LineFeature[] = [];

  const pushRing = (ring: Ring) => {
    let seg: Ring = [];
    const flush = () => {
      if (seg.length > 1) {
        lines.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: seg },
          properties: {},
        });
      }
    };
    for (let i = 0; i < ring.length; i++) {
      const pt = ring[i];
      if (pt === undefined) continue;
      const prev = ring[i - 1];
      if (prev !== undefined && Math.abs((pt[0] as number) - (prev[0] as number)) > 180) {
        // Antimeridian jump → close the current segment and start a new one.
        flush();
        seg = [];
      }
      seg.push(pt);
    }
    flush();
  };

  for (const f of countries()) {
    const g = f.geometry;
    if (g === undefined) continue;
    if (g.type === 'Polygon') {
      for (const ring of g.coordinates as Ring[]) pushRing(ring);
    } else if (g.type === 'MultiPolygon') {
      for (const poly of g.coordinates as Ring[][]) {
        for (const ring of poly) pushRing(ring);
      }
    }
  }
  return { type: 'FeatureCollection', features: lines };
}
