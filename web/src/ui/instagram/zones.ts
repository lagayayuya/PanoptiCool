// « THE BLUE ZONES » — the territory of the login addresses, and the geometry that decides where one
// zone ends and the next begins.
//
// ————— Three approaches tried, two abandoned —————
//
// 1. NATIVE CLUSTERING (numbered pills). Dropped: it created a second grammar of counters competing
//    with the vermilion points'. The blue must not count, it must OCCUPY.
//
// 2. CONTOUR LINES over a density field (d3-contour). Abandoned for two reasons, one fatal:
//     · a contour line produces BANDS by construction. What was wanted is a continuous gradient in
//       which each address can be sensed inside the zone; seven bands stay seven bands;
//     · the grid was sized on the bounding box of ALL the data. One distant login was enough to blow
//       it up, the resolution ceiling then brought σ down to a cell and a half, and marching squares
//       returned DIAMONDS. Plus a northward shift: the grid was linear in degrees of latitude where
//       the map is in Mercator.
//
// 3. MAPLIBRE'S `heatmap` LAYER — kept. Its known flaw is that its radius is expressed in SCREEN
//    pixels: it therefore shrinks as one zooms until it disappears, which had ruled it out at first.
//    But that radius accepts an expression: making it DOUBLE at each zoom level turns it back into a
//    GROUND distance and the flaw evaporates. What remains are its qualities: continuous GPU
//    rendering with no banding, round shapes, and above all blobs laid exactly on the points — there
//    is no grid any more, so there is nothing left to offset.
//
// ————— ⚠ AND WHAT MUST NOT BE RETOUCHED —————
//
// This tuning is the one Yul ratified, recovered after four attempts at « improving » it that all
// degraded it. The three traps, for the record:
//
//  · RAISING THE CORES' INTENSITY. The shader caps at `GAUSS_COEF` ≈ 0.399; compensating for that
//    factor to bring every core to white looked rigorous and broke everything. A white core no
//    longer melts into the mass, it sticks to it. At intensity 1 a core peaks at 0.399, a PALE halo
//    — and white arrives only by stacking, where there really are many places. That is what is
//    wanted;
//  · RAISING THE EDGE THRESHOLD to « tighten the shapes »: it flattens the mass instead of hollowing
//    it, because past the threshold the density saturates and renders the same value everywhere;
//  · ENLARGING THE CORES in proportion to their zone: they join into a single white sheet and erase
//    the relief.
//
// ─── WHAT THIS MODULE DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT DRAWS NOTHING. It returns MapLibre style expressions and plain geometry; the layers that
//     consume them live in the map piece;
//   - IT DOES NOT KNOW WHAT A ZONE MEANS. An inferred city is an inference about an IP block, never
//     a place someone was — that framing belongs to the copy, and to `geo.ts` upstream.

/**
 * ⚠ DECLARED HERE RATHER THAN IMPORTED FROM `geojson`. Two type names are not worth a dependency,
 * and this module is pure geometry that no bundler needs to resolve. MapLibre accepts the shape.
 */
export interface ZonePoint {
  readonly type: 'Feature';
  readonly geometry: { readonly type: 'Point'; readonly coordinates: [number, number] };
  readonly properties: { readonly n: number };
}
export interface ZoneCollection {
  readonly type: 'FeatureCollection';
  readonly features: readonly ZonePoint[];
}

/** Ground radius of influence of one location. Two nearby places merge into one zone. */
export const ZONE_KM = 14;

/** Equatorial circumference, to turn kilometres into map pixels. */
const EARTH_KM = 40075;

/** A MapLibre tile's side. The world is `TILE * 2^zoom` pixels wide. */
const TILE_PX = 512;

const KM_PER_DEG_LAT = 110.574;

/**
 * ————— MAPLIBRE'S ACTUAL KERNEL —————
 *
 * Read in the shader, not assumed:
 *
 *     density = weight × intensity × GAUSS_COEF × exp(−4.5 · (r/R)²)
 *
 * Two consequences one cannot guess:
 *
 *  · a layer at unit weight and intensity CAPS at 0.399 density;
 *  · the radius `R` is not the visible edge. The edge is where the density crosses the ramp's
 *    threshold, a fraction of `R`. Announcing « 14 km radius » is misleading: about 40 % is seen.
 *
 * These constants serve the HOVER only — so that what the tooltip groups is exactly what the eye
 * sees joined.
 */
const GAUSS_COEF = 0.3989422804014327;
const KERNEL_K = 4.5;

/** The threshold at which the zone ramp becomes visible. To be kept in step with the layer. */
const ZONE_CUT = 0.12;

/** The zone layer's intensity. Likewise: a mirror of the layer, not an independent setting. */
const ZONE_INTENSITY = 0.8;

export interface Traj {
  readonly lon: number;
  readonly lat: number;
  readonly ts: number;
}

export interface ZoneHit {
  count: number;
  places: number;
  from: number;
  to: number;
}

/** One distinct location, and everything the platform recorded there. */
export interface Spot {
  lon: number;
  lat: number;
  n: number;
  from: number;
  to: number;
}

/**
 * Groups logins by COORDINATE. Necessary, not cosmetic: a geo-IP database returns the centroid of an
 * address block, so hundreds of logins from the same box land on the same spot to the pixel. Stacked
 * as they are they draw nothing more than a single point — but they crush the layer's scale. Once
 * merged, the SHAPE comes from the number of distinct places and the SIZE from the number of logins.
 */
function toSpots(points: readonly Traj[]): Spot[] {
  const by = new Map<string, Spot>();
  for (const p of points) {
    const key = `${p.lon.toFixed(4)},${p.lat.toFixed(4)}`;
    const s = by.get(key);
    if (s !== undefined) {
      s.n++;
      if (p.ts < s.from) s.from = p.ts;
      if (p.ts > s.to) s.to = p.ts;
    } else {
      by.set(key, { lon: p.lon, lat: p.lat, n: 1, from: p.ts, to: p.ts });
    }
  }
  return [...by.values()];
}

export function toZonesFC(points: readonly Traj[]): ZoneCollection {
  return {
    type: 'FeatureCollection',
    features: toSpots(points).map((s) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [s.lon, s.lat] as [number, number] },
      properties: { n: s.n },
    })),
  };
}

/**
 * A place's EXTENT, by its number of logins.
 *
 * By square root, not linearly: raw, 345 logins against 1 would give a ratio of 345 between the
 * radii and one zone would cover the country. Here the ratio is 5.5 in radius, so 30 in area.
 *
 * A logarithmic scale was tried, to separate the small numbers better. It does, but it crushes the
 * top: the busiest place stopped standing out, and Yul preferred going back to the root. The
 * trade-off is accepted — the bottom of the scale is less well separated than the middle.
 */
const SPREAD_LO = [1, 0.55] as const;
const SPREAD_HI = [19, 3.1] as const;

const SPREAD = [
  'interpolate',
  ['linear'],
  ['sqrt', ['get', 'n']],
  SPREAD_LO[0],
  SPREAD_LO[1],
  SPREAD_HI[0],
  SPREAD_HI[1],
];

/** The JS counterpart of `SPREAD`. ⚠ THE TWO MUST STAY TWINS: one draws, the other groups. */
export function spreadFor(n: number): number {
  const r = Math.sqrt(Math.max(1, n));
  const t = Math.max(0, Math.min(1, (r - SPREAD_LO[0]) / (SPREAD_HI[0] - SPREAD_LO[0])));
  return SPREAD_LO[1] + (SPREAD_HI[1] - SPREAD_LO[1]) * t;
}

/** The weight the zone layer gives a place. Mirror of the layer's expression. */
function weightFor(n: number): number {
  const r = Math.sqrt(Math.max(1, n));
  const t = Math.max(0, Math.min(1, (r - 1) / 18));
  return 0.8 + 0.55 * t;
}

/** A place's NOMINAL radius — the kernel's, not the one that is seen. */
export const radiusKm = (n: number) => ZONE_KM * spreadFor(n);

/** The density peak an isolated place reaches. */
const peakFor = (n: number) => weightFor(n) * ZONE_INTENSITY * GAUSS_COEF;

/**
 * A place's VISIBLE radius: where the density crosses the ramp's threshold. It is this one, not the
 * nominal, that decides whether the cursor is « on » a zone.
 */
export function visibleKm(n: number): number {
  const ratio = peakFor(n) / ZONE_CUT;
  if (ratio <= 1) return 0;
  return radiusKm(n) * Math.sqrt(Math.log(ratio) / KERNEL_K);
}

/**
 * The distance at which two places join — where the sum of their two kernels crosses the threshold,
 * halfway. Exact for two identical places, approximate otherwise.
 *
 * A plain sum of the nominal radii was used before: it grouped nearly twice too wide, so the tooltip
 * announced places that were not joined on screen.
 */
function reachKm(a: Spot, b: Spot): number {
  const r = (radiusKm(a.n) + radiusKm(b.n)) / 2;
  const p = peakFor(a.n) + peakFor(b.n);
  const ratio = p / ZONE_CUT;
  if (ratio <= 1) return 0;
  return 2 * r * Math.sqrt(Math.log(ratio) / KERNEL_K);
}

/**
 * The layer's radius, in pixels, zoom level by zoom level.
 *
 * ⚠ THIS IS THE PIECE THAT MAKES THE LAYER USABLE. `heatmap-radius` is a screen radius; it is
 * therefore given, at each zoom, the number of pixels `ZONE_KM` is worth on the ground. The blob
 * becomes a territory: one enters it by zooming instead of watching it melt.
 *
 * The interpolation runs to z=14. It used to stop at z=11: past that, `interpolate` holds the last
 * value, so the radius stayed FROZEN in pixels while the map went on growing. The zones then shrank
 * on the ground and separated from one another — an artefact, not a reading. The cost stays bounded:
 * MapLibre renders each layer into a tile-sized buffer, not a screen-sized one, so a large radius
 * does not blow up the fill.
 */
export function radiusByZoom(lat: number): unknown {
  return byZoom(lat, ZONE_KM, MIN_RADIUS_PX, SPREAD);
}

/**
 * A place's CORE — a radial gradient laid on each distinct coordinate.
 *
 * It is necessary because a heat layer is ADDITIVE: in the middle of an already dense mass, an
 * isolated address adds nothing perceptible and disappears. No setting of the main layer corrects
 * that — the problem is in its nature.
 *
 * It is a SECOND LAYER, not a pill. Tried before: a `circle` with `circle-blur`, which only widens
 * an edge — at three pixels of radius that produces not a gradient but a white dot.
 *
 * The weight is CONSTANT: every place therefore reaches the same peak, so the same halo, whether it
 * carries one login or three hundred. The number reads in the halo's SIZE, never in its brightness.
 */
export function coreRadiusByZoom(lat: number): unknown {
  return byZoom(lat, CORE_KM, MIN_CORE_PX, SPREAD);
}

/** The core takes a little under half its zone: the proportions hold at every size. */
const CORE_KM = ZONE_KM * 0.42;

const MIN_CORE_PX = 6;

/**
 * Below this, a zone cannot be seen at all. AN ACCEPTED FLOOR: at a whole-of-Europe view, 14 km are
 * worth two pixels — geographically honest and visually non-existent. Under this floor the blob is
 * wider than the ground; it is the one place where the scale lies, and it lies towards the visible
 * rather than towards nothing.
 */
const MIN_RADIUS_PX = 7;

/** Turns a ground distance into a screen radius, zoom by zoom, spread included. */
function byZoom(lat: number, km: number, floorPx: number, spread: unknown): unknown {
  const kmPerMapUnit = EARTH_KM * Math.cos((lat * Math.PI) / 180);
  const stops: unknown[] = [];
  for (let z = 0; z <= 14; z++) {
    const ground = (km * TILE_PX * 2 ** z) / kmPerMapUnit;
    stops.push(z, ['max', floorPx, ['*', ground, spread]]);
  }
  return ['interpolate', ['exponential', 2], ['zoom'], ...stops];
}

export type Zone = { spots: Spot[] } & ZoneHit;

/**
 * The zones, on the JS side, for hovering. A heat layer cannot be queried: it carries no features.
 * So the same grouping is redone in the clear, with the kernel's geometry.
 */
export function buildZones(points: readonly Traj[]): Zone[] {
  const spots = toSpots(points);
  const seen = new Uint8Array(spots.length);
  const out: Zone[] = [];

  for (let i = 0; i < spots.length; i++) {
    if (seen[i] === 1) continue;
    const group: Spot[] = [];
    const queue = [i];
    seen[i] = 1;
    while (queue.length > 0) {
      const k = queue.pop() as number;
      const a = spots[k] as Spot;
      group.push(a);
      for (let j = 0; j < spots.length; j++) {
        if (seen[j] === 1) continue;
        const b = spots[j] as Spot;
        if (kmBetween(a.lon, a.lat, b.lon, b.lat) <= reachKm(a, b)) {
          seen[j] = 1;
          queue.push(j);
        }
      }
    }
    let count = 0;
    let from = Number.POSITIVE_INFINITY;
    let to = Number.NEGATIVE_INFINITY;
    for (const s of group) {
      count += s.n;
      if (s.from < from) from = s.from;
      if (s.to > to) to = s.to;
    }
    out.push({ spots: group, count, places: group.length, from, to });
  }
  return out;
}

/** The zone under the cursor, if there is one — at the VISIBLE radius, not the nominal one. */
export function zoneAt(zones: readonly Zone[], lon: number, lat: number): ZoneHit | null {
  for (const z of zones) {
    for (const s of z.spots) {
      if (kmBetween(lon, lat, s.lon, s.lat) <= visibleKm(s.n)) return z;
    }
  }
  return null;
}

/** Approximate distance, good enough at the scale where zones merge (a few tens of km). */
function kmBetween(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const dy = (lat1 - lat2) * KM_PER_DEG_LAT;
  const dx = (lon1 - lon2) * KM_PER_DEG_LAT * Math.cos(((lat1 + lat2) / 2) * (Math.PI / 180));
  return Math.hypot(dx, dy);
}
