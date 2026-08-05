// GEO — the map, in TWO LAYERS that must never be confused with each other.
//
//   `declared`   — PRECISE points the person gave, usually without knowing: a post's GPS, a story's
//                  EXIF, the last known position. These are facts.
//   `trajectory` — APPROXIMATE points Meta DEDUCED: login IPs resolved to a city. These are
//                  inferences, a VPN falsifies them, and the interface draws them with a halo of
//                  uncertainty for that reason.
//
// Keeping them apart is the module's whole doctrine. A map that mixes a GPS fix with an IP guess
// tells the reader that both are equally true, which is the opposite of what this product is for.
//
// ⚠ AND WHERE META DECLARES THE CITY ITSELF, THAT WINS. `profile_activity` sometimes carries the
// city nested under « Détails » → « Lieu ». When it is there, inferring a city from the IP would
// replace a FACT with an approximation — and the prototype did exactly that for 199 logins, because
// a flat read of `label_values` does not see one level down. The coordinates stay the IP's; only the
// LABEL is declared, and `cityDeclared` says which is which.
//
// ─── WHAT THIS EXTRACTOR DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT RESOLVES NO IP ITSELF. The `GeoResolver` is INJECTED (ADR-0002): the engine never knows
//     which database answers, and stays offline and portable. Without a resolver there is simply no
//     trajectory — not an error;
//   - IT DOES NOT SAY WHERE SOMEONE LIVES. It reports points and city visits. The step from « many
//     logins from this city » to « lives there » is one the product does not take;
//   - IT CANNOT SEE A VPN. A trajectory point from a proxy is indistinguishable from a real one, and
//     nothing here flags it — which is why the layer is named « trajectory » and drawn as a guess;
//   - IT DOES NOT GEOCODE AN ADDRESS. The declared postal addresses carry no coordinates and go to a
//     panel, never to the map: turning a street into a pin would be inventing a precision the export
//     does not contain.

import type { Locale } from '../../i18n/locales';
import { isLabel, type LabelCoverage, type LabelKey } from './labels';
import { fixMojibake } from './mojibake';
import { labelValues, nestedValueByLabel, stringMap, toList } from './shapes';

/** What resolves an IP to a place. Injected, so the engine never depends on a database. */
export interface GeoHit {
  readonly lat: number;
  readonly lon: number;
  readonly city?: string;
  /** ISO country code. */
  readonly country?: string;
}

export interface GeoResolver {
  /** Resolves an IP (v4 or v6) to a city-level position, or `null` when unknown. */
  lookup(ip: string): GeoHit | null;
  /**
   * Optional: let a resolver fetch what THESE addresses need, before the lookups start.
   *
   * ⚠ IT EXISTS TO KEEP 71 MB OFF THE WIRE. The MMDB resolver holds one database per address
   * family — 63 MB for v4, 71 MB for v6 — and used to download both whatever the export contained.
   * The engine still knows nothing about databases (ADR-0002): it hands over the addresses it is
   * about to ask about, and a resolver with nothing to prepare simply does not implement this.
   */
  prepare?(ips: readonly string[]): Promise<void>;
}

export type DeclaredKind = 'post' | 'story' | 'last-known';

export interface DeclaredPoint {
  readonly kind: DeclaredKind;
  readonly lat: number;
  readonly lon: number;
  /** Epoch seconds, when known. */
  readonly ts: number | null;
  /** The last known position is blurred by default: it is the one point that is current. */
  readonly sensitive: boolean;
  /** Path of the post's or story's media inside the export, when it could be matched. */
  readonly mediaPath?: string;
}

export interface TrajectoryPoint {
  readonly lat: number;
  readonly lon: number;
  readonly ts: number;
  readonly city?: string;
  readonly country?: string;
  /** `true` when the city NAME comes from Meta itself rather than from the IP lookup. */
  readonly cityDeclared?: boolean;
}

export interface DeclaredAddress {
  readonly line1?: string;
  readonly line2?: string;
  readonly city?: string;
  readonly region?: string;
  readonly postcode?: string;
  readonly country?: string;
  readonly updated?: number;
}

export interface CityPresence {
  /** Empty when the export names no city — see `citiesFromTrajectory`. */
  readonly city: string;
  readonly country?: string;
  readonly lat: number;
  readonly lon: number;
  readonly visits: number;
  readonly periods: ReadonlyArray<{ readonly from: number; readonly to: number }>;
}

export interface GeoReport {
  readonly declared: readonly DeclaredPoint[];
  /** Ascending by timestamp. */
  readonly trajectory: readonly TrajectoryPoint[];
  readonly addresses: readonly DeclaredAddress[];
  /** Descending by visit count. */
  readonly cities: readonly CityPresence[];
  readonly counts: {
    readonly posts: number;
    readonly stories: number;
    readonly lastKnown: number;
    readonly addresses: number;
    readonly ipEvents: number;
    readonly distinctIps: number;
    readonly geolocated: number;
    readonly distinctCities: number;
    /** How many trajectory points got their city from Meta rather than from the IP. */
    readonly declaredPlaces: number;
  };
  readonly timeRange: { readonly from: number; readonly to: number } | null;
}

type JsonSource = { readJson: <T>(p: string) => Promise<T> };

async function read(src: JsonSource, path: string, root?: string): Promise<unknown[]> {
  try {
    const d = await src.readJson<unknown>(path);
    if (root !== undefined && d && typeof d === 'object') {
      const wrapped = (d as Record<string, unknown>)[root];
      if (Array.isArray(wrapped)) return wrapped;
    }
    return toList(d);
  } catch {
    return [];
  }
}

function numLabel(item: unknown, key: LabelKey, coverage?: LabelCoverage): number | undefined {
  for (const lv of labelValues(item)) {
    if (isLabel(lv.label, key) && lv.value != null) {
      coverage?.record(key);
      const n = Number(lv.value);
      if (Number.isFinite(n)) return n;
    }
  }
  return undefined;
}

/** A timestamp from a date-ish label: the dedicated field first, else a plausible epoch. */
function tsLabel(item: unknown, key: LabelKey, coverage?: LabelCoverage): number | undefined {
  for (const lv of labelValues(item)) {
    if (!isLabel(lv.label, key)) continue;
    coverage?.record(key);
    if (typeof lv.timestamp_value === 'number') return lv.timestamp_value;
    if (lv.value != null) {
      const n = Number(lv.value);
      // > 1e9 rather than > 0: an epoch in seconds passed a billion in 2001, so any smaller number
      // in a date field is something else — an index, a duration — and reading it as a date would
      // put the point in 1970.
      if (Number.isFinite(n) && n > 1e9) return n;
    }
  }
  return undefined;
}

/**
 * ⚠ (0, 0) IS REJECTED, and it is not a rounding concern. Null Island is what an absent GPS fix
 * serialises to, and it is a real point in the Gulf of Guinea — accepted, it puts a pin off the
 * African coast for a photo taken at home, on a map whose whole claim is that these points are
 * facts.
 */
function validCoord(lat?: number, lon?: number): boolean {
  return (
    lat != null &&
    lon != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    (Math.abs(lat) > 1e-3 || Math.abs(lon) > 1e-3) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180
  );
}

/**
 * Index of timestamp → media path, from the files that carry `uri`.
 *
 * ⚠ THE TWO DIALECTS SPLIT THIS ONE FACT IN HALF: the recent `posts.json` carries the GPS and no
 * media path; the legacy `posts_1.json` carries the path and no GPS. Nothing joins them but the
 * creation timestamp, hence the tolerance below — the two files do not always round it the same way.
 */
async function buildMediaIndex(src: JsonSource): Promise<Array<{ ts: number; uri: string }>> {
  const out: Array<{ ts: number; uri: string }> = [];
  const harvest = (items: unknown[]) => {
    for (const it of items) {
      const o = it as {
        creation_timestamp?: number;
        media?: Array<{ uri?: string; creation_timestamp?: number }>;
      };
      for (const m of o.media ?? []) {
        const ts = m.creation_timestamp ?? o.creation_timestamp;
        if (m.uri !== undefined && typeof ts === 'number') out.push({ ts, uri: m.uri });
      }
    }
  };
  harvest(await read(src, 'your_instagram_activity/media/posts_1.json'));
  harvest(
    await read(src, 'your_instagram_activity/media/archived_posts.json', 'ig_archived_post_media'),
  );
  return out;
}

const MEDIA_JOIN_TOLERANCE_SEC = 120;

async function extractDeclared(
  src: JsonSource,
  coverage?: LabelCoverage,
): Promise<{ points: DeclaredPoint[]; posts: number; stories: number; lastKnown: number }> {
  const points: DeclaredPoint[] = [];
  let posts = 0;
  let stories = 0;
  let lastKnown = 0;

  const mediaIndex = await buildMediaIndex(src);
  const findMedia = (ts: number | null): string | undefined => {
    if (ts === null) return undefined;
    let best: { uri: string; d: number } | undefined;
    for (const m of mediaIndex) {
      const d = Math.abs(m.ts - ts);
      if (d <= MEDIA_JOIN_TOLERANCE_SEC && (best === undefined || d < best.d)) {
        best = { uri: m.uri, d };
      }
    }
    return best?.uri;
  };

  for (const item of await read(src, 'your_instagram_activity/media/posts.json')) {
    const lat = numLabel(item, 'latitude', coverage);
    const lon = numLabel(item, 'longitude', coverage);
    if (!validCoord(lat, lon)) continue;
    const ts =
      (item as { timestamp?: number }).timestamp ??
      (item as { creation_timestamp?: number }).creation_timestamp ??
      tsLabel(item, 'updateTime', coverage) ??
      null;
    const mediaPath = findMedia(ts);
    points.push({
      kind: 'post',
      lat: lat as number,
      lon: lon as number,
      ts,
      sensitive: false,
      ...(mediaPath !== undefined && { mediaPath }),
    });
    posts++;
  }

  // Stories carry their coordinates in EXIF, not in a label — so no label lookup, and no locale
  // dependency: `latitude`/`longitude` are EXIF field names, identical in every export.
  for (const s of await read(src, 'your_instagram_activity/media/stories.json', 'ig_stories')) {
    const story = s as {
      creation_timestamp?: number;
      uri?: string;
      media_metadata?: { photo_metadata?: { exif_data?: Array<Record<string, number>> } };
    };
    for (const e of story.media_metadata?.photo_metadata?.exif_data ?? []) {
      if (!validCoord(e.latitude, e.longitude)) continue;
      points.push({
        kind: 'story',
        lat: e.latitude as number,
        lon: e.longitude as number,
        ts: story.creation_timestamp ?? null,
        sensitive: false,
        ...(story.uri !== undefined && { mediaPath: story.uri }),
      });
      stories++;
      // One point per story: EXIF can hold several blocks, and they describe the same photograph.
      break;
    }
  }

  for (const item of await read(
    src,
    'security_and_login_information/login_and_profile_creation/last_known_location.json',
  )) {
    const map = stringMap(item);
    const entry = (key: LabelKey): string | undefined => {
      for (const [rawKey, v] of Object.entries(map)) {
        if (isLabel(rawKey, key)) {
          coverage?.record(key);
          return v.value;
        }
      }
      return undefined;
    };
    const lat = Number(entry('preciseLatitude'));
    const lon = Number(entry('preciseLongitude'));
    if (!validCoord(lat, lon)) continue;
    // `sensitive: true` — this is the one point that says where the person is NOW, not where they
    // were. The interface blurs it by default for that reason and no other.
    points.push({ kind: 'last-known', lat, lon, ts: null, sensitive: true });
    lastKnown++;
  }

  return { points, posts, stories, lastKnown };
}

async function extractTrajectory(
  src: JsonSource,
  geo: GeoResolver,
  coverage?: LabelCoverage,
): Promise<{
  points: TrajectoryPoint[];
  ipEvents: number;
  distinctIps: number;
  geolocated: number;
  declaredPlaces: number;
}> {
  const points: TrajectoryPoint[] = [];
  const ips = new Set<string>();
  let ipEvents = 0;
  let geolocated = 0;
  let declaredPlaces = 0;

  const items = await read(
    src,
    'security_and_login_information/login_and_profile_creation/profile_activity.json',
  );

  /** The address of one login item, without touching coverage — see the two passes below. */
  const ipOf = (item: Parameters<typeof labelValues>[0]): string | undefined => {
    for (const lv of labelValues(item)) {
      if (isLabel(lv.label, 'ipAddress') && lv.value) return lv.value;
    }
    return undefined;
  };

  /**
   * ⚠ FIRST PASS — THE ADDRESSES, AND NOTHING ELSE, so the resolver can fetch only the databases
   * they need (`GeoResolver.prepare`). It walks the SAME array the second pass walks: nothing is
   * re-read from the archive, and the only thing it builds is the `Set` the second pass needed
   * anyway.
   *
   * It records NO coverage. `coverage.record('ipAddress')` counts items, and calling it here as
   * well would double every count in the label-coverage report — the kind of drift that shows up
   * as a suspiciously round number weeks later.
   */
  for (const item of items) {
    const ip = ipOf(item);
    if (ip !== undefined) ips.add(ip);
  }
  await geo.prepare?.([...ips]);

  // Second pass — unchanged: it is the one that counts, dates and places.
  for (const item of items) {
    const ip = ipOf(item);
    if (ip !== undefined) coverage?.record('ipAddress');
    if (ip === undefined) continue;
    ipEvents++;

    const ts = tsLabel(item, 'lastLogin', coverage);
    // An undated login still counts as an IP event — it is one — but cannot be placed on a
    // timeline. Dropping the point rather than dating it now is the only honest option.
    if (ts === undefined) continue;

    // ⚠ META'S OWN CITY WINS. Nested one level under « Détails »; a flat read misses it, which is
    // how 199 declared cities became Geo-IP guesses in the prototype.
    const declared = nestedValueByLabel(item, 'Lieu') ?? nestedValueByLabel(item, 'Place');
    const declaredCity = declared?.split(',')[0]?.trim();
    const declaredCountry = declared?.split(',')[1]?.trim();
    if (declaredCity) declaredPlaces++;

    const hit = geo.lookup(ip);
    if (hit === null) continue;
    geolocated++;
    const city = declaredCity || hit.city;
    const country = declaredCountry || hit.country;
    points.push({
      // The COORDINATES are always the IP's. Only the label can be declared — Meta names the city,
      // it does not give a position, and pretending otherwise would upgrade a guess to a fact.
      lat: hit.lat,
      lon: hit.lon,
      ts,
      ...(city !== undefined && city !== '' && { city }),
      ...(country !== undefined && country !== '' && { country }),
      ...(declaredCity !== undefined && declaredCity !== '' && { cityDeclared: true }),
    });
  }

  points.sort((a, b) => a.ts - b.ts);
  return { points, ipEvents, distinctIps: ips.size, geolocated, declaredPlaces };
}

async function extractAddresses(
  src: JsonSource,
  coverage?: LabelCoverage,
): Promise<DeclaredAddress[]> {
  const out: DeclaredAddress[] = [];
  for (const item of await read(
    src,
    'personal_information/autofill_information/autofill_information.json',
  )) {
    const g = (key: LabelKey): string | undefined => {
      for (const lv of labelValues(item)) {
        if (isLabel(lv.label, key) && lv.value) {
          coverage?.record(key);
          return fixMojibake(lv.value);
        }
      }
      return undefined;
    };
    const line1 = g('addressLine1');
    const line2 = g('addressLine2');
    const city = g('city');
    const region = g('region');
    const postcode = g('postcode');
    const country = g('countryName') ?? g('country');
    const updatedStr = g('lastUpdated');
    const updated =
      updatedStr !== undefined && Number.isFinite(Number(updatedStr)) && Number(updatedStr) > 1e9
        ? Number(updatedStr)
        : undefined;
    if (
      line1 === undefined &&
      city === undefined &&
      region === undefined &&
      country === undefined &&
      postcode === undefined
    ) {
      continue;
    }
    out.push({
      ...(line1 !== undefined && { line1 }),
      ...(line2 !== undefined && { line2 }),
      ...(city !== undefined && { city }),
      ...(region !== undefined && { region }),
      ...(postcode !== undefined && { postcode }),
      ...(country !== undefined && { country }),
      ...(updated !== undefined && { updated }),
    });
  }

  // Autofill cards repeat the same address across forms. Deduplicated on the meaningful fields,
  // case- and whitespace-insensitive, so one real address appears once.
  const seen = new Set<string>();
  return out.filter((a) => {
    const key = [a.line1, a.line2, a.city, a.region, a.postcode, a.country]
      .map((s) => (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim())
      .join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Two logins more than this far apart are two separate stays, not one long one. */
const CITY_GAP_SEC = 90 * 86400;

/** Groups the trajectory into distinct cities with estimated periods of presence. */
export function citiesFromTrajectory(traj: readonly TrajectoryPoint[]): CityPresence[] {
  const groups = new Map<
    string,
    { city?: string; country?: string; lat: number; lon: number; ts: number[] }
  >();
  for (const p of traj) {
    // Grouped by NAME when there is one, else by rounded coordinates — 0.1° is roughly 11 km, so
    // two logins from the same metropolitan area land together without merging two cities.
    const key = p.city
      ? `c:${p.city}|${p.country ?? ''}`
      : `g:${p.lat.toFixed(1)},${p.lon.toFixed(1)}`;
    const g = groups.get(key);
    if (g !== undefined) {
      g.ts.push(p.ts);
      continue;
    }
    groups.set(key, {
      lat: p.lat,
      lon: p.lon,
      ts: [p.ts],
      ...(p.city !== undefined && { city: p.city }),
      ...(p.country !== undefined && { country: p.country }),
    });
  }

  const out: CityPresence[] = [];
  for (const g of groups.values()) {
    const ts = [...g.ts].sort((a, b) => a - b);
    const first = ts[0];
    if (first === undefined) continue;
    const periods: Array<{ from: number; to: number }> = [];
    let start = first;
    let prev = first;
    for (const t of ts.slice(1)) {
      if (t - prev > CITY_GAP_SEC) {
        periods.push({ from: start, to: prev });
        start = t;
      }
      prev = t;
    }
    periods.push({ from: start, to: prev });
    out.push({
      // ⚠ EMPTY WHEN THE EXPORT NAMES NO CITY. « Lieu inconnu » was a false name: it took a line in
      // the list and a label on the map as though it designated somewhere. An absence reads better
      // empty than named.
      city: g.city ?? '',
      ...(g.country !== undefined && { country: g.country }),
      lat: g.lat,
      lon: g.lon,
      visits: ts.length,
      periods,
    });
  }
  return out.sort((a, b) => b.visits - a.visits);
}

export async function runGeo(
  src: JsonSource,
  geo: GeoResolver,
  _locale: Locale,
  coverage?: LabelCoverage,
): Promise<GeoReport> {
  const declared = await extractDeclared(src, coverage);
  const traj = await extractTrajectory(src, geo, coverage);
  const addresses = await extractAddresses(src, coverage);
  const cities = citiesFromTrajectory(traj.points);

  /**
   * ⚠ THE RANGE COVERS BOTH LAYERS, and reading it from the trajectory alone WAS a bug that emptied
   * the map. The time cursor starts at `timeRange.to` and the declared layer is filtered by it, so
   * an export with GPS-tagged posts but no resolvable login trail — anyone without the geo database,
   * and the demo — got `null`, a cursor at 0, and a map showing nothing at all while its own legend
   * announced « 70 pts précis ». A layer that has points must be able to date them.
   *
   * The trajectory is already sorted, so its bounds are its ends; the declared points are not, hence
   * the fold. No `Math.min(...ts)` spread either: it blows the stack past ~100 k arguments, and the
   * reference export is at 166 today with no ceiling on tomorrow's.
   */
  let from = traj.points[0]?.ts ?? Number.POSITIVE_INFINITY;
  let to = traj.points[traj.points.length - 1]?.ts ?? Number.NEGATIVE_INFINITY;
  for (const p of declared.points) {
    if (p.ts === null) continue;
    if (p.ts < from) from = p.ts;
    if (p.ts > to) to = p.ts;
  }
  const timeRange = Number.isFinite(from) && to >= from ? { from, to } : null;

  return {
    declared: declared.points,
    trajectory: traj.points,
    addresses,
    cities,
    counts: {
      posts: declared.posts,
      stories: declared.stories,
      lastKnown: declared.lastKnown,
      addresses: addresses.length,
      ipEvents: traj.ipEvents,
      distinctIps: traj.distinctIps,
      geolocated: traj.geolocated,
      distinctCities: cities.length,
      declaredPlaces: traj.declaredPlaces,
    },
    timeRange,
  };
}
