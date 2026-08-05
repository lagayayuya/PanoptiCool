// « 02 · LA CARTE » — the two sources of place, drawn together.
//
// What the person handed over (a geotagged post, a story's EXIF) and what their internet address
// gave away (a city per login). The first is precise and sparse; the second is approximate and
// relentless. Put on one map, the second is what draws a life.
//
// ⚠ NO NETWORK, INCLUDING THE BASE MAP. Country outlines come from `world-atlas`, bundled. A tile
// server would learn, request by request, exactly where someone had been looking at their own
// export — which is the thing this product exists to make visible, not to do.
//
// ————— CONTRAST, and why there is no fill layer —————
//
// ⚠ THERE IS NO COVERING GL LAYER AT ALL — a vector fill produced tile seams on some GPUs (seven
// rounds of debugging). The outlines therefore carry the map on their own, and 0.22 opacity was not
// enough to make them exist on a near-black background. Two levers instead, without bringing a fill
// back: raise the stroke, and lay a wide blurred stroke UNDER it to suggest the landmass. Two `line`
// layers stay sparse geometry — the cause of the seams is not reintroduced.
//
// ─── ⚠ WHAT THIS PIECE DOES NOT DO ──────────────────────────────────────────────────────────────
//   - IT DOES NOT CLAIM AN IP IS A POSITION. A VPN, a tethered connection or a mobile network moves
//     a point by hundreds of kilometres, and the learn panel says so before the map is read;
//   - IT DOES NOT SEPARATE CITIES THAT SHARE AN ADDRESS. Measured on the reference export: 16 of 51
//     cities share another's exact coordinates, because the export gives a place's NAME but never
//     its coordinates — the position comes from the IP. They are GROUPED and the other names
//     announced, which also shows that the platform's label and the IP's geolocation do not say the
//     same thing;
//   - IT DOES NOT ANIMATE A TRAJECTORY. The line joins revealed points in order; it is not a route,
//     and nothing here interpolates between two logins.

// ⚠ NAMED IMPORTS, and `MapLibreMap` rather than `Map`. MapLibre 6 dropped the default export the
// prototype used; and its `Map` would shadow the built-in `Map`, which this file also uses. The
// library ships the alias for exactly that reason.
import {
  AttributionControl,
  type GeoJSONSource,
  LngLatBounds,
  MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
} from 'maplibre-gl';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { CityPresence, GeoReport } from '../../engine/instagram/geo';
import { UI_IG_MAP, UI_IG_SHELL } from '../copy.instagram';
import { formatInt } from '../format';
import { countryLinesGeoJson } from './basemap';
import { fmtPeriod, isVideoPath, monthYear } from './dates';
import { FullscreenToggle } from './FullscreenToggle';
import type { ModuleProps } from './InstagramPage';
import { MapDetail } from './MapDetail';
import { MediaViewer, type ViewerItem } from './MediaViewer';
import { createMediaUrls } from './media-url';
import { TimeWheel } from './TimeWheel';
import { DATA } from './tokens';
import { buildZones, coreRadiusByZoom, radiusByZoom, toZonesFC, type Zone, zoneAt } from './zones';
import 'maplibre-gl/dist/maplibre-gl.css';
import './carte.css';

/**
 * ⚠ ACCESSORS, NOT VALUES. `C` is a module object, so `DATA.orange()` written here would run at
 * IMPORT time — before the token sheet is necessarily applied — and would then return the fallback
 * grey. That is the rule `tokens.ts` states, and this object was the one place breaking it.
 */
const C = {
  landGlow: 'rgba(150,190,205,0.10)',
  landLine: 'rgba(233,231,225,0.52)',
  get stamp() {
    return DATA.orange();
  },
  get cool() {
    return DATA.cyan();
  },
  /**
   * The pills' rim. It used to be DARK, nearly the background's colour: on a black map it detached
   * nothing, it merely shaved 1.6 px off the disc — hence red dots one « could barely see ». A LIGHT
   * rim does the opposite: it lays the pill on top of the map and enlarges it to the eye.
   */
  rim: 'rgba(240,238,232,0.62)',
};

/** Past this zoom MapLibre stops clustering: a thumbnail is then ONE real point — see `fanOut`. */
const CLUSTER_MAX_ZOOM = 12;

/** Screen distance below which two thumbnails overlap enough to be unreadable. */
const FAN_HIT_PX = 46;
const FAN_STEP_PX = 62;
const FAN_LIFT_PX = 54;

/**
 * Half-dimensions of a thumbnail's frame, border included — a mirror of `.ms-thumb` in `carte.css`.
 * They make the tether START at the frame's edge rather than at its centre: from the centre it
 * crossed the photo.
 */
const THUMB_HALF_W = 28;
const THUMB_HALF_H = 37;

type GeoJson = Record<string, unknown>;

/**
 * ⚠ THE TIME CURSOR FILTERS THE DATA, NOT THE LAYER. Clustering is computed by the SOURCE, upstream
 * of any layer filter: hiding clusters afterwards would leave counters that include points not yet
 * revealed. The figure would lie, and a counter that lies is worse than no counter.
 */
function toDeclaredFC(report: GeoReport, cutoff: number): GeoJson {
  return {
    type: 'FeatureCollection',
    features: report.declared
      .filter((p) => (p.ts ?? 0) <= cutoff)
      .map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
        properties: {
          kind: p.kind,
          ts: p.ts ?? 0,
          sensitive: p.sensitive ? 1 : 0,
          mediaPath: p.mediaPath ?? '',
        },
      })),
  };
}

/** The addresses revealed at this point of the cursor — the density field's input. */
function pointsUpTo(report: GeoReport, cutoff: number) {
  return report.trajectory.filter((p) => p.ts <= cutoff);
}

function lineUpTo(report: GeoReport, cutoff: number): GeoJson {
  const coords = report.trajectory.filter((p) => p.ts <= cutoff).map((p) => [p.lon, p.lat]);
  return {
    type: 'FeatureCollection',
    features:
      coords.length > 1
        ? [
            {
              type: 'Feature',
              geometry: { type: 'LineString', coordinates: coords },
              properties: {},
            },
          ]
        : [],
  };
}

/**
 * ————— THE PERIOD TRACK —————
 *
 * It replaced a vertical list of date pills. That list had two flaws, the second worse than the
 * first: it took eighteen lines for a single city, and above all it allowed NO comparison — each
 * city carried its dates in its own corner, and you had to read them one by one to grasp a rhythm.
 *
 * The track leans on the dossier's COMMON axis. A city visited for twelve years and a city of one
 * month read one under the other, at the same scale: the second is a stroke, the first a sequence.
 * The rhythm becomes visible without being read.
 *
 * The exact text is not lost: it stays in a list hidden from the eye but given to screen readers,
 * and in each segment's native tooltip. The track is a visual summary, not a substitute for data.
 */
function buildPeriodTrack(
  city: CityPresence,
  range: { readonly from: number; readonly to: number } | null,
): HTMLElement {
  const t = UI_IG_MAP;
  const wrap = document.createElement('div');
  wrap.className = 'ca-track-wrap';
  const periods = city.periods;
  if (periods.length === 0) {
    const none = document.createElement('span');
    none.className = 'ca-sum';
    none.textContent = t.periodUnknown;
    wrap.appendChild(none);
    return wrap;
  }

  const first = Math.min(...periods.map((p) => p.from));
  const last = Math.max(...periods.map((p) => p.to));
  // The whole dossier's axis, not the city's: that is what makes cities comparable. Falls back to
  // the city's own bounds when the dossier has none.
  const lo = range?.from ?? first;
  const hi = range?.to ?? last;
  const span = Math.max(1, hi - lo);

  const sum = document.createElement('span');
  sum.className = 'ca-sum tnum';
  const n = String(periods.length);
  sum.textContent =
    periods.length > 1
      ? t.periodCountMany(n, fmtPeriod(first, last))
      : t.periodCount(n, fmtPeriod(first, last));
  wrap.appendChild(sum);

  const track = document.createElement('div');
  track.className = 'ca-track';
  // `role="img"` + a label: without them a screen reader meets only a stack of empty spans. The
  // full detail follows in the hidden list.
  track.setAttribute('role', 'img');
  track.setAttribute('aria-label', t.periodAria(n, fmtPeriod(first, first), fmtPeriod(last, last)));
  for (const p of periods) {
    const seg = document.createElement('span');
    seg.className = 'ca-seg';
    const left = ((p.from - lo) / span) * 100;
    // A width floor: a single day's reading is 0.02 % of twelve years, so nothing at all on screen.
    // Better a slightly too-wide stroke than an absence.
    const width = Math.max(1.4, ((p.to - p.from) / span) * 100);
    seg.style.left = `${Math.max(0, Math.min(100 - width, left))}%`;
    seg.style.width = `${width}%`;
    seg.title = fmtPeriod(p.from, p.to);
    track.appendChild(seg);
  }
  wrap.appendChild(track);

  const scale = document.createElement('div');
  scale.className = 'ca-scale tnum';
  scale.setAttribute('aria-hidden', 'true');
  const year = (sec: number) => String(new Date(sec * 1000).getFullYear());
  for (const sec of [lo, (lo + hi) / 2, hi]) {
    const s = document.createElement('span');
    s.textContent = year(sec);
    scale.appendChild(s);
  }
  wrap.appendChild(scale);

  const list = document.createElement('ul');
  list.className = 'sr-only';
  for (const p of periods) {
    const li = document.createElement('li');
    li.textContent = fmtPeriod(p.from, p.to);
    list.appendChild(li);
  }
  wrap.appendChild(list);
  return wrap;
}

function closeAllCityPanels() {
  for (const el of document.querySelectorAll('.city-marker.open')) {
    el.classList.remove('open');
    el.querySelector('.city-label')?.setAttribute('aria-expanded', 'false');
  }
}

export function MapModule({ report, resolveMedia }: ModuleProps) {
  const t = UI_IG_MAP;
  const geo = report.geo;

  const containerRef = useRef<HTMLDivElement>(null);
  /** The FRAME, not the canvas: it is what goes fullscreen, with its controls. */
  const frameRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const readyRef = useRef(false);
  const showTrajRef = useRef(true);
  const showDeclaredRef = useRef(true);
  /** The cursor has to reach the DOM labels too — see `syncLabels`. */
  const cutoffRef = useRef(0);
  const syncLabelsRef = useRef<() => void>(() => {});
  const syncStampsRef = useRef<() => void>(() => {});
  /** Cluster ids change with the data: the thumbnail cache has to follow. */
  const dropLeafCacheRef = useRef<() => void>(() => {});

  const range = geo?.timeRange ?? null;
  const [cutoff, setCutoff] = useState(range?.to ?? 0);
  const [showDeclared, setShowDeclared] = useState(true);
  const [showTraj, setShowTraj] = useState(true);
  const [learn, setLearn] = useState(false);
  const [viewer, setViewer] = useState<ViewerItem | null>(null);
  /**
   * ⚠ THE TOGGLE HIDES THE FRAME, IT DOES NOT UNMOUNT IT. Unmounting destroys the MapLibre map —
   * so the zoom, the framing and the time cursor the person has just set — and the base map's
   * geometry would be rebuilt on every round trip.
   */
  const [detail, setDetail] = useState(false);

  /** One cache for the whole piece, revoked when it unmounts. */
  const urls = useMemo(() => createMediaUrls(resolveMedia ?? (async () => null)), [resolveMedia]);
  useEffect(() => () => urls.revokeAll(), [urls]);

  const midLat = useMemo(() => {
    const ls = (geo?.trajectory ?? []).map((p) => p.lat).sort((a, b) => a - b);
    return ls[Math.floor(ls.length / 2)] ?? 46;
  }, [geo]);
  const trajTs = useMemo(() => (geo?.trajectory ?? []).map((p) => p.ts), [geo]);
  const zonesRef = useRef<Zone[]>([]);

  /**
   * The panel closes on any click elsewhere, and on Escape. Staying open by default was the real
   * flaw: it hid the map under itself with no obvious way out. The labels are DOM markers outside
   * the framework, hence the direct sweep.
   */
  useEffect(() => {
    const onDocClick = () => closeAllCityPanels();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAllCityPanels();
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // ⚠ BUILT ONCE, and never rebuilt on a data change: tearing the map down would destroy the zoom,
  // the framing and the cursor position the person has just set.
  // biome-ignore lint/correctness/useExhaustiveDependencies: mounts the map once, on purpose.
  useEffect(() => {
    if (containerRef.current === null || mapRef.current !== null || geo === undefined) return;
    const initial = geo.timeRange?.to ?? 0;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          countries: {
            type: 'geojson',
            data: countryLinesGeoJson() as never,
            tolerance: 0,
            buffer: 256,
          },
          /**
           * The precise points nearly all overlap in one region: you saw one where there were five.
           * NATIVE MapLibre clustering, with a counter — but the counter goes through a DOM marker,
           * because the style embeds NO font (`glyphs`): a `symbol` with `text-field` can write
           * nothing, and adding one would need a glyph server, so network.
           */
          declared: {
            type: 'geojson',
            data: toDeclaredFC(geo, initial) as never,
            cluster: true,
            clusterRadius: 38,
            clusterMaxZoom: CLUSTER_MAX_ZOOM,
            clusterProperties: { minTs: ['min', ['get', 'ts']] },
          },
          /**
           * ⚠ THE BLUE SOURCE CARRIES ZONES, NOT POINTS (`zones.ts`). No blue dot and no blue
           * counter: vermilion keeps the exclusivity of points and figures, blue merely occupies a
           * territory.
           */
          traj: {
            type: 'geojson',
            data: toZonesFC(pointsUpTo(geo, initial)) as never,
            /**
             * ⚠ TILE BUFFER AT MAXIMUM (512 of 4096, so 64 px instead of 16).
             *
             * MapLibre renders a heat layer tile by tile, into a tile-sized buffer: a point's kernel
             * is cut at its tile's edge, and only the points repeated in neighbouring tiles' buffers
             * mend the seam. At the default, a radius over 16 px was truncated — hence pieces of
             * zone appearing and disappearing as one panned, depending which tile carried them.
             *
             * A ceiling, not a complete fix: past 64 px of radius truncation is still possible. It
             * is pushed out of the useful range by erasing the zones at high zoom (`heatmap-opacity`).
             */
            buffer: 512,
          },
          trajline: { type: 'geojson', data: lineUpTo(geo, initial) as never },
        },
        layers: [
          // ⚠ NO COVERING GL LAYER (background/fill/raster): each is clipped per tile through the
          // stencil → hairline seams on some macOS/Metal GPUs. The background is CSS on `.carte-map`;
          // the map draws only sparse geometry.
          {
            id: 'land-glow',
            type: 'line',
            source: 'countries',
            paint: { 'line-color': C.landGlow, 'line-width': 7, 'line-blur': 5 },
          },
          {
            id: 'land-line',
            type: 'line',
            source: 'countries',
            paint: { 'line-color': C.landLine, 'line-width': 0.9 },
          },
          /**
           * ——— THE BLUE ZONES ———
           *
           * A heat layer, but anchored TO THE GROUND: `heatmap-radius` receives, zoom by zoom, the
           * number of pixels 14 km are worth. Without that expression it would shrink as one zoomed
           * until it vanished — the flaw that had ruled it out at first.
           *
           * The rendering is continuous by nature (a GPU texture): no banding, unlike the contour
           * lines tried before. And since each address lays its own kernel, places are distinguished
           * from one another INSIDE a zone rather than forming a uniform mass.
           */
          {
            id: 'traj-zone',
            type: 'heatmap',
            source: 'traj',
            paint: {
              'heatmap-radius': radiusByZoom(midLat) as never,
              // ⚠ A DELIBERATELY NARROW RANGE: the radius already carries the number of logins, and
              // letting it weigh on the kernel's height too would saturate the busy places. These
              // two values are mirrored in `zones.ts` (ZONE_CUT / ZONE_INTENSITY) so that the hover
              // groups what the eye sees.
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['sqrt', ['get', 'n']],
                1,
                0.8,
                19,
                1.35,
              ],
              'heatmap-intensity': 0.8,
              /**
               * ONE tint, only the opacity varies: a rainbow ramp would suggest categories where
               * there is only a quantity.
               *
               * ⚠ The step at 0.12 gives the CRISP EDGE — it is what makes one see a bounded zone
               * rather than a haze. Do not raise it to « tighten the shapes »: past the threshold
               * the density saturates, so a higher cut FLATTENS the mass instead of hollowing it.
               * Tried at 0.20, clearly worse.
               */
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(127,198,216,0)',
                0.11,
                'rgba(127,198,216,0)',
                0.12,
                'rgba(127,198,216,0.30)',
                0.45,
                'rgba(140,205,222,0.34)',
                1,
                'rgba(170,220,233,0.44)',
              ],
              /**
               * ERASED at high zoom. Past z≈12.5 the smallest zone already covers the whole screen:
               * it shows a flat wash and no information. It is also the range where per-tile
               * truncation becomes visible. So it stops being painted where it stops saying
               * anything — beyond, only the vermilion points still have real precision.
               */
              'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 12.4, 0.95, 13.6, 0],
            },
          },
          {
            /**
             * THE CORES — a second heat layer, at CONSTANT weight.
             *
             * Constant is the point: every place therefore reaches the top of the ramp, so the same
             * white at its centre, whether it carries one login or three hundred. The number reads
             * in the halo's size, never in its brightness.
             *
             * ⚠ Intensity 1, DELIBERATELY uncompensated. The kernel caps at GAUSS_COEF ≈ 0.399, so
             * an isolated core peaks at 0.399 of density and never reaches the ramp's white.
             * Compensating that factor (intensity 2.507) was tried and rejected — a white core no
             * longer melts into the mass, it sticks to it like a pill.
             */
            id: 'traj-core',
            type: 'heatmap',
            source: 'traj',
            paint: {
              'heatmap-radius': coreRadiusByZoom(midLat) as never,
              'heatmap-weight': 1,
              'heatmap-intensity': 1,
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(150,210,228,0)',
                0.3,
                'rgba(176,224,238,0.12)',
                0.6,
                'rgba(214,240,247,0.4)',
                0.85,
                'rgba(238,250,253,0.78)',
                1,
                'rgba(255,255,255,0.95)',
              ],
              'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 12.4, 1, 13.6, 0],
            },
          },
          {
            id: 'trajline',
            type: 'line',
            source: 'trajline',
            paint: {
              'line-color': C.cool,
              'line-width': 1,
              'line-opacity': 0.32,
              'line-dasharray': [2, 2],
            },
          },
          {
            /**
             * Only the points WITHOUT media stay pills: the others are DOM thumbnails showing the
             * photo or video itself (`syncStamps`). The layer survives regardless — it is what keeps
             * the source loaded, so `querySourceFeatures` answerable.
             */
            id: 'declared',
            type: 'circle',
            source: 'declared',
            filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'mediaPath'], '']],
            paint: {
              'circle-radius': 6.5,
              'circle-color': C.stamp,
              'circle-stroke-color': C.rim,
              'circle-stroke-width': 1.6,
              'circle-opacity': 0.96,
            },
          },
        ],
      },
      center: [4, 46],
      zoom: 3,
      attributionControl: false,
      renderWorldCopies: false,
    });
    mapRef.current = map;
    // TOP right: at the bottom the time wheel takes the full width and covered the +/− buttons.
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new AttributionControl({ customAttribution: t.attribution }));

    const popup = new Popup({
      closeButton: true,
      closeOnClick: false,
      className: 'dossier-popup',
      offset: 12,
      maxWidth: 'none',
    });

    const titleOf = (kind: string) =>
      kind === 'post' ? t.kindPost : kind === 'story' ? t.kindStory : t.kindLast;

    /** A point's media, loaded on demand into the popup. */
    const buildPointPopup = (title: string, when: string, mediaPath: string): HTMLElement => {
      const root = document.createElement('div');
      root.className = 'pt-popup';
      const head = document.createElement('div');
      head.className = 'pt-head';
      const b = document.createElement('b');
      b.textContent = title;
      const span = document.createElement('span');
      span.textContent = `${t.precise}${when}`;
      head.append(b, span);
      root.appendChild(head);
      if (mediaPath !== '') {
        const box = document.createElement('div');
        box.className = 'pt-thumb loading';
        root.appendChild(box);
        void urls.url(mediaPath).then((url) => {
          box.classList.remove('loading');
          if (url === null) {
            box.remove();
            return;
          }
          if (isVideoPath(mediaPath)) {
            const v = document.createElement('video');
            v.src = url;
            v.controls = true;
            v.muted = true;
            v.playsInline = true;
            v.addEventListener('error', () => box.remove());
            box.appendChild(v);
          } else {
            const img = document.createElement('img');
            img.src = url;
            img.alt = title;
            img.addEventListener('error', () => box.remove());
            img.addEventListener('click', () => box.classList.toggle('expanded'));
            box.appendChild(img);
          }
        });
      }
      return root;
    };

    map.on('load', () => {
      readyRef.current = true;
      const all = [...geo.declared, ...geo.trajectory];
      if (all.length > 0) {
        const b = new LngLatBounds();
        for (const p of all) b.extend([p.lon, p.lat]);
        map.fitBounds(b, { padding: 80, maxZoom: 6, duration: 0 });
      }

      /**
       * ⚠ MEASURED: 16 cities of 51 (31 %) share ANOTHER'S EXACT COORDINATES.
       *
       * Cause: the export gives a place's NAME but never its coordinates. The position comes from
       * the geo-IP lookup — and one IP often carries several declared places. They were on the map,
       * stacked on the same pixel, and de-collision kept only one: present in the list, invisible on
       * the map.
       *
       * They cannot be separated without inventing positions. So they are GROUPED by coordinate and
       * the other names announced — which also shows that the platform's label and the IP's
       * geolocation do not say the same thing.
       */
      const spots = new Map<string, CityPresence[]>();
      for (const city of geo.cities) {
        const key = `${city.lat.toFixed(3)},${city.lon.toFixed(3)}`;
        const arr = spots.get(key);
        if (arr !== undefined) arr.push(city);
        else spots.set(key, [city]);
      }

      const cityMeta: Array<{ el: HTMLDivElement; c: CityPresence; label: string }> = [];
      let rank = 0;
      for (const group of spots.values()) {
        group.sort((a, b) => b.visits - a.visits);
        // An empty name is not a name: no label at all.
        const named = group.filter((x) => x.city !== '');
        const head = named[0];
        if (head === undefined) continue;
        const rest = named.slice(1);
        const label = rest.length > 0 ? `${head.city} +${rest.length}` : head.city;

        /**
         * ————— THE CITY LABEL —————
         *
         *   .city-marker  — carries the rank, the position and the open/closed state
         *     button.city-label  — the clickable and FOCUSABLE target
         *     .city-also         — the panel
         *
         * ⚠ The panel is the button's SIBLING, never its child: buttons nested inside a button are
         * invalid HTML and a keyboard trap. That is what forced the earlier version to be a mere
         * clickable div, and therefore unreachable by tab.
         */
        const el = document.createElement('div');
        el.className = `city-marker ${rank < 8 ? 'major' : rank < 24 ? 'mid' : 'minor'}`;
        if (rest.length > 0) el.classList.add('shared');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'city-label';
        btn.textContent = label;
        btn.setAttribute('aria-expanded', 'false');

        const panel = document.createElement('div');
        panel.className = 'city-also';
        panel.setAttribute('role', 'group');
        panel.setAttribute('aria-label', t.cityDetail(head.city));

        const headline = document.createElement('span');
        headline.className = 'ca-head';
        headline.textContent =
          named.length > 1 ? t.citySamePlace(String(named.length)) : t.cityReadings;
        panel.appendChild(headline);

        named.forEach((other, index) => {
          const item = document.createElement('div');
          item.className = 'ca-city';

          const row = document.createElement('button');
          row.type = 'button';
          row.className = 'ca-row';
          row.setAttribute('aria-expanded', 'false');
          const bodyId = `ca-${rank}-${index}`;
          row.setAttribute('aria-controls', bodyId);
          const chev = document.createElement('span');
          chev.className = 'ca-chev';
          chev.setAttribute('aria-hidden', 'true');
          chev.textContent = '▸';
          const name = document.createElement('span');
          name.className = 'ca-name';
          name.textContent = other.city;
          const count = document.createElement('span');
          count.className = 'ca-n tnum';
          count.textContent = t.cityConn(formatInt(other.visits));
          row.append(chev, name, count);

          const body = document.createElement('div');
          body.className = 'ca-periods';
          body.id = bodyId;
          // `hidden`, not a CSS `display:none`: it is the attribute screen readers follow, and it
          // stays true if the stylesheet fails to load.
          body.hidden = true;
          body.appendChild(buildPeriodTrack(other, geo.timeRange));
          row.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const open = body.hidden;
            body.hidden = !open;
            row.setAttribute('aria-expanded', String(open));
          });
          item.append(row, body);
          panel.appendChild(item);
        });

        if (named.length > 1) {
          const note = document.createElement('p');
          note.className = 'ca-note';
          note.textContent = t.cityNote;
          panel.appendChild(note);
        }

        btn.addEventListener('click', (ev) => {
          // Propagation is stopped AFTER closing the others: otherwise the global outside-click
          // handler would close this one straight away too.
          ev.stopPropagation();
          const wasOpen = el.classList.contains('open');
          closeAllCityPanels();
          if (!wasOpen) {
            el.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
        // Escape closes and RETURNS FOCUS to the button: without it the keyboard lands on a hidden
        // element and tabbing restarts from the top of the document.
        panel.addEventListener('keydown', (ev) => {
          if ((ev as KeyboardEvent).key !== 'Escape') return;
          ev.stopPropagation();
          closeAllCityPanels();
          btn.focus();
        });

        el.append(btn, panel);
        new Marker({ element: el, anchor: 'top', offset: [0, 6] })
          .setLngLat([head.lon, head.lat])
          .addTo(map);
        cityMeta.push({ el, c: head, label });
        rank++;
      }

      /**
       * Declutter by collision in SCREEN space: cities sorted by importance, a label appears only if
       * its box does not overlap one already placed. More and more cities reveal themselves as one
       * zooms, because they move apart.
       */
      const syncLabels = () => {
        if (!showTrajRef.current) {
          for (const { el } of cityMeta) el.style.display = 'none';
          return;
        }
        const placed: Array<{ x: number; y: number; w: number; h: number }> = [];
        for (const { el, c: city, label } of cityMeta) {
          // ⚠ The labels are DOM markers: the cursor's GL filter does NOT touch them. That is what
          // stayed visible from the first frame after the first fix — the halos had been filtered,
          // the names had not.
          if ((city.periods[0]?.from ?? 0) > cutoffRef.current) {
            el.style.display = 'none';
            continue;
          }
          const p = map.project([city.lon, city.lat]);
          const w = Math.max(46, label.length * 6.5);
          const h = 15;
          const box = { x: p.x - w / 2, y: p.y, w, h };
          const hit = placed.some(
            (r) =>
              box.x < r.x + r.w && box.x + box.w > r.x && box.y < r.y + r.h && box.y + box.h > r.y,
          );
          if (hit) {
            el.style.display = 'none';
          } else {
            el.style.display = 'block';
            placed.push(box);
          }
        }
      };
      syncLabelsRef.current = syncLabels;
      syncLabels();

      /**
       * ————— THE THUMBNAILS —————
       *
       * A precise point is not an abstract coordinate: it is a photo or a video published from
       * there. So a cluster shows that image directly rather than a number in a disc, and the
       * counter becomes a « +N others » underneath.
       *
       * They are DOM markers and not GL `symbol`s, for the same reason as the city names: the style
       * embeds no font and no image, and loading one would need network.
       */
      const pool: HTMLDivElement[] = [];
      type Leaf = { path: string; ts: number; kind: string };
      const leafCache = new Map<string, Leaf>();
      const pendingLeaves = new Set<string>();
      dropLeafCacheRef.current = () => {
        leafCache.clear();
        pendingLeaves.clear();
      };

      /**
       * The media a cluster should show. MapLibre cannot aggregate a string through
       * `clusterProperties`, so we descend to the leaves and take the FIRST carrying a media — a
       * cluster whose third point alone has an image must still show it, or it would look empty.
       */
      const requestLeaf = (cid: number, key: string) => {
        if (pendingLeaves.has(key)) return;
        pendingLeaves.add(key);
        const src = map.getSource('declared') as GeoJSONSource | undefined;
        if (src === undefined) return;
        void src
          .getClusterLeaves(cid, 24, 0)
          .then((leaves: Array<{ properties?: Record<string, unknown> | null }>) => {
            pendingLeaves.delete(key);
            const props = (f: (typeof leaves)[number]) => (f.properties ?? {}) as GeoJson;
            const best = leaves.find((f) => String(props(f).mediaPath ?? '') !== '') ?? leaves[0];
            leafCache.set(key, {
              path: best !== undefined ? String(props(best).mediaPath ?? '') : '',
              ts: best !== undefined ? Number(props(best).ts ?? 0) : 0,
              kind: best !== undefined ? String(props(best).kind ?? '') : '',
            });
            syncStamps();
          })
          .catch(() => pendingLeaves.delete(key));
      };

      type Stamp = {
        x: number;
        y: number;
        n: number;
        lon: number;
        lat: number;
        cid?: number;
        /** Display offset when several media share the same point. */
        dx: number;
        dy: number;
      } & Leaf;

      /**
       * ————— THE FAN —————
       *
       * Two media can carry IDENTICAL coordinates. Past `CLUSTER_MAX_ZOOM` MapLibre stops
       * clustering: the cluster does split, but its two points stay on the same pixel. The
       * thumbnails then overlapped exactly, each counting as one and so carrying no mention — one
       * image looked like it had replaced another.
       *
       * ⚠ THE ZOOM CONDITION IS NOT COSMETIC. Below it a thumbnail can represent a CLUSTER, that is
       * several distinct places: moving it off its point would invent a position. Above it a
       * thumbnail is a single point, and two points under 46 px apart are tens of metres apart — the
       * same place. The tether says the offset is a display artifice, not a position.
       */
      const fanOut = (stamps: Stamp[]) => {
        if (map.getZoom() <= CLUSTER_MAX_ZOOM) return;
        const done = new Uint8Array(stamps.length);
        for (let i = 0; i < stamps.length; i++) {
          if (done[i] === 1) continue;
          const group = [i];
          done[i] = 1;
          const a = stamps[i] as Stamp;
          for (let j = i + 1; j < stamps.length; j++) {
            if (done[j] === 1) continue;
            const b = stamps[j] as Stamp;
            if (Math.hypot(a.x - b.x, a.y - b.y) <= FAN_HIT_PX) {
              done[j] = 1;
              group.push(j);
            }
          }
          if (group.length < 2) continue;
          group.forEach((k, idx) => {
            const st = stamps[k] as Stamp;
            st.dx = (idx - (group.length - 1) / 2) * FAN_STEP_PX;
            st.dy = -FAN_LIFT_PX;
          });
        }
      };

      const fillMedia = (box: HTMLElement, path: string) => {
        // Only reload when the media changed: `syncStamps` runs on every frame of a pan, and remaking
        // a URL each time would make the thumbnail flicker.
        if (box.dataset.path === path) return;
        box.dataset.path = path;
        box.textContent = '';
        box.classList.toggle('empty', path === '');
        if (path === '') return;
        void urls.url(path).then((url) => {
          if (box.dataset.path !== path || url === null) return;
          if (isVideoPath(path)) {
            const v = document.createElement('video');
            v.src = url;
            v.muted = true;
            v.playsInline = true;
            v.preload = 'metadata';
            // Without this most browsers leave the video black until it plays: nudge it a tenth of
            // a second to force a frame.
            v.addEventListener('loadedmetadata', () => {
              v.currentTime = 0.1;
            });
            v.addEventListener('error', () => box.classList.add('empty'));
            box.appendChild(v);
            box.classList.add('is-video');
          } else {
            const img = document.createElement('img');
            img.src = url;
            img.alt = '';
            img.addEventListener('error', () => box.classList.add('empty'));
            box.appendChild(img);
            box.classList.remove('is-video');
          }
        });
      };

      const syncStamps = () => {
        const wanted: Stamp[] = [];
        if (showDeclaredRef.current) {
          const seen = new Set<string>();
          for (const f of map.querySourceFeatures('declared')) {
            if (f.geometry.type !== 'Point') continue;
            const props = (f.properties ?? {}) as GeoJson;
            const [lon, lat] = f.geometry.coordinates as [number, number];
            const cid = props.cluster_id as number | undefined;
            // `querySourceFeatures` returns the same entity once per tile: without this dedup the
            // thumbnails stack on themselves.
            const key =
              cid === undefined ? `p${lon},${lat},${String(props.mediaPath ?? '')}` : `c${cid}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const p = map.project([lon, lat]);
            if (cid === undefined) {
              const path = String(props.mediaPath ?? '');
              // With no media, the vermilion pill is enough.
              if (path === '') continue;
              wanted.push({
                x: p.x,
                y: p.y,
                n: 1,
                lon,
                lat,
                dx: 0,
                dy: 0,
                path,
                ts: Number(props.ts ?? 0),
                kind: String(props.kind ?? ''),
              });
            } else {
              const leaf = leafCache.get(key);
              if (leaf === undefined) {
                requestLeaf(cid, key);
                continue;
              }
              wanted.push({
                x: p.x,
                y: p.y,
                n: Number(props.point_count),
                lon,
                lat,
                cid,
                dx: 0,
                dy: 0,
                ...leaf,
              });
            }
          }
        }

        fanOut(wanted);

        for (let i = 0; i < Math.max(wanted.length, pool.length); i++) {
          let el = pool[i];
          if (el === undefined && i < wanted.length) {
            el = document.createElement('div');
            el.className = 'mstamp';
            const thumb = document.createElement('button');
            thumb.type = 'button';
            thumb.className = 'ms-thumb';
            const more = document.createElement('button');
            more.type = 'button';
            more.className = 'ms-more';
            // The tether to the real point. Always present, hidden while the thumbnail is not
            // offset: recycling it avoids creating and destroying a node on every frame.
            const tether = document.createElement('span');
            tether.className = 'ms-tether';
            el.append(tether, thumb, more);

            /**
             * ⚠ A CLUSTER UNFOLDS, IT DOES NOT OPEN. Its image is only a preview of the first of a
             * pile: opening the viewer on it would show one media while claiming to show several.
             * The viewer is reserved for isolated points — for what is no longer hiding anything.
             */
            const node = el;
            const act = (ev: Event) => {
              ev.stopPropagation();
              const cid = Number(node.dataset.cid ?? '');
              if (node.dataset.cid !== undefined && Number.isFinite(cid)) {
                const src = map.getSource('declared') as GeoJSONSource;
                // The zoom at which THIS cluster splits: exactly « until the first other one
                // appears ». A fixed step would often leave it intact.
                void src.getClusterExpansionZoom(cid).then((z) => {
                  map.easeTo({
                    center: [Number(node.dataset.lon), Number(node.dataset.lat)],
                    zoom: z + 0.15,
                    duration: 700,
                  });
                });
                return;
              }
              const path = node.dataset.path ?? '';
              if (path === '') return;
              setViewer({
                path,
                kind: isVideoPath(path) ? 'video' : 'photo',
                title: node.dataset.title ?? '',
                subtitle: node.dataset.when ?? '',
              });
            };
            thumb.addEventListener('click', act);
            more.addEventListener('click', act);
            // INSIDE the canvas container, not the outer one: MapLibre listens for wheel and drag
            // there. Placed outside, a thumbnail absorbed those gestures and zooming while hovering
            // it did nothing.
            map.getCanvasContainer().appendChild(el);
            pool.push(el);
          }
          if (el === undefined) continue;
          const c = wanted[i];
          if (c === undefined) {
            el.style.display = 'none';
            continue;
          }
          el.style.display = 'block';
          el.style.transform = `translate(${c.x + c.dx}px, ${c.y + c.dy}px) translate(-50%, -50%)`;
          /**
           * The tether aims at the origin point, at (−dx, −dy) in the thumbnail's frame, but it only
           * STARTS where it leaves the frame. From the centre, its first third crossed the photo. So
           * we compute where the ray exits the frame's rectangle and offset it there: every tether of
           * one fan then converges on the shared point, under the thumbnails, touching none.
           */
          const tether = el.firstElementChild as HTMLElement;
          const len = Math.hypot(c.dx, c.dy);
          const ux = -c.dx / (len === 0 ? 1 : len);
          const uy = -c.dy / (len === 0 ? 1 : len);
          const exit = Math.min(
            Math.abs(ux) > 1e-6 ? THUMB_HALF_W / Math.abs(ux) : Number.POSITIVE_INFINITY,
            Math.abs(uy) > 1e-6 ? THUMB_HALF_H / Math.abs(uy) : Number.POSITIVE_INFINITY,
          );
          if (len - exit < 2) {
            tether.style.display = 'none';
          } else {
            tether.style.display = 'block';
            tether.style.width = `${len - exit}px`;
            // Offset THEN rotate: the rotation's origin is the stroke's start, which we have just
            // placed on the frame's edge.
            tether.style.transform = `translate(${ux * exit}px, ${uy * exit}px) rotate(${Math.atan2(uy, ux)}rad)`;
          }
          const thumb = el.children[1] as HTMLElement;
          const more = el.lastElementChild as HTMLElement;
          fillMedia(thumb, c.path);
          el.dataset.path = c.path;
          el.dataset.title = titleOf(c.kind);
          el.dataset.when = c.ts !== 0 ? monthYear(c.ts) : '';
          if (c.cid === undefined) delete el.dataset.cid;
          else el.dataset.cid = String(c.cid);
          el.dataset.lon = String(c.lon);
          el.dataset.lat = String(c.lat);
          more.style.display = c.n > 1 ? 'block' : 'none';
          more.textContent = c.n > 2 ? t.moreMany(String(c.n - 1)) : t.more(String(c.n - 1));
        }
      };
      syncStampsRef.current = syncStamps;

      const onView = () => {
        syncLabels();
        syncStamps();
      };
      map.on('zoom', onView);
      map.on('move', onView);
      map.on('sourcedata', (e) => {
        if (e.sourceId === 'declared' && e.isSourceLoaded) syncStamps();
      });
      map.on('idle', syncStamps);

      map.on('click', (e) => {
        if (map.queryRenderedFeatures(e.point, { layers: ['declared'] }).length === 0) {
          popup.remove();
        }
      });
    });

    map.on('click', 'declared', (e) => {
      const f = e.features?.[0];
      if (f === undefined || f.geometry.type !== 'Point') return;
      const [lon, lat] = f.geometry.coordinates as [number, number];
      const props = (f.properties ?? {}) as Record<string, string>;
      const when = props.ts !== undefined ? ` · ${monthYear(Number(props.ts))}` : '';
      map.flyTo({ center: [lon, lat], zoom: Math.max(map.getZoom(), 9), duration: 1200 });
      popup
        .setLngLat([lon, lat])
        .setDOMContent(buildPointPopup(titleOf(props.kind ?? ''), when, props.mediaPath ?? ''))
        .setMaxWidth('none')
        .addTo(map);
    });

    /**
     * The zones' tooltip. It FOLLOWS the cursor and dies on `mouseout`: no click and no state, so
     * not the city panel's flaw of staying open.
     *
     * ⚠ A heat layer cannot be queried — `queryRenderedFeatures` returns nothing on one, since it
     * exposes no features. So the hovered zone is found GEOGRAPHICALLY, on the grouping kept up to
     * date in `zonesRef` (`zones.ts`).
     *
     * The number alone would say little — « 157 » over one month and « 157 » over six years do not
     * describe the same life. The period always goes with it.
     */
    const zoneTip = document.createElement('div');
    zoneTip.className = 'zone-tip';
    zoneTip.style.display = 'none';
    containerRef.current.appendChild(zoneTip);
    map.on('mousemove', (e) => {
      if (!showTrajRef.current) {
        zoneTip.style.display = 'none';
        return;
      }
      const zone = zoneAt(zonesRef.current, e.lngLat.lng, e.lngLat.lat);
      if (zone === null) {
        zoneTip.style.display = 'none';
        return;
      }
      const n = zone.count;
      const b = document.createElement('b');
      b.className = 'tnum';
      b.textContent = formatInt(n);
      const when = document.createElement('span');
      when.className = 'zt-when';
      const places = String(zone.places);
      const span = fmtPeriod(zone.from, zone.to);
      when.textContent =
        zone.places > 1 ? t.zonePlacesMany(places, span) : t.zonePlaces(places, span);
      zoneTip.textContent = '';
      // « logins » and not « addresses »: a trajectory point is a timestamped login EVENT, and one
      // address often produces dozens.
      zoneTip.append(b, ` ${n > 1 ? t.zoneConnMany : t.zoneConn}`, when);
      zoneTip.style.display = 'block';
      zoneTip.style.transform = `translate(${e.point.x}px, ${e.point.y}px)`;
    });
    map.on('mouseout', () => {
      zoneTip.style.display = 'none';
    });

    map.on('mouseenter', 'declared', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'declared', () => {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      map.remove();
      mapRef.current = null;
      readyRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (geo === undefined) return;
    cutoffRef.current = cutoff;
    // The hover's grouping is rebuilt with the data: otherwise the tooltip would announce logins the
    // cursor has not yet revealed.
    zonesRef.current = buildZones(pointsUpTo(geo, cutoff));
    // Replacing the data reassigns cluster ids: a kept cache would show one cluster's thumbnail on
    // another.
    dropLeafCacheRef.current();
    const map = mapRef.current;
    if (map === null || !readyRef.current) return;
    const set = (id: string, data: GeoJson) => {
      const src = map.getSource(id) as GeoJSONSource | undefined;
      if (src !== undefined) src.setData(data as never);
    };
    set('declared', toDeclaredFC(geo, cutoff));
    // The density field is REBUILT at every notch: a zone must state the density of what is
    // revealed, not of the whole.
    set('traj', toZonesFC(pointsUpTo(geo, cutoff)) as unknown as GeoJson);
    set('trajline', lineUpTo(geo, cutoff));
    syncLabelsRef.current();
    syncStampsRef.current();
  }, [cutoff, geo]);

  /**
   * Back from the detail view, MapLibre has sized its canvas against a hidden container — so against
   * zero. Without this the map returns folded into a corner of the frame.
   */
  useEffect(() => {
    if (detail) return;
    if (readyRef.current) mapRef.current?.resize();
  }, [detail]);

  /**
   * ⚠ Fullscreen changes the container's size WITHOUT touching the window's: MapLibre, which listens
   * only to `window.resize`, would keep the small view's canvas and occupy one corner. An observer on
   * the container covers both of the toggle's mechanisms — native and CSS fallback — and does not
   * have to know which was used.
   *
   * ⚠ NOT VERIFIED BY EYE. The agent's preview pane does not run a hidden tab's render pipeline:
   * `ResizeObserver` does not even emit its initial notification there (measured — the effect runs,
   * the callback counter stays at zero). Fullscreen resizing is to be checked in a real browser.
   */
  useEffect(() => {
    const el = containerRef.current;
    if (el === null) return;
    const ro = new ResizeObserver(() => mapRef.current?.resize());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Layer toggles.
  useEffect(() => {
    const map = mapRef.current;
    if (map === null || !readyRef.current) return;
    const setVis = (id: string, visible: boolean) => {
      if (map.getLayer(id) !== undefined) {
        map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
      }
    };
    setVis('declared', showDeclared);
    showDeclaredRef.current = showDeclared;
    for (const id of ['traj-zone', 'traj-core', 'trajline']) setVis(id, showTraj);
    showTrajRef.current = showTraj;
    // Both syncs come AFTER the two refs: they read them.
    syncLabelsRef.current();
    syncStampsRef.current();
  }, [showDeclared, showTraj]);

  if (geo === undefined) return null;

  const c = geo.counts;
  const precise = c.posts + c.stories + c.lastKnown;
  // The year of the first trace, not a hard-coded date: the sentence has to stay true on an export
  // opened in 2021 as on one opened in 2014.
  const since = range === null ? null : new Date(range.from * 1000).getFullYear();

  return (
    <div class="carte">
      <section class="carte-hero">
        <h1 class="carte-h1">{since === null ? t.h1NoDate : t.h1(String(since))}</h1>
        <p class="carte-lede">{t.lede}</p>
        <button
          type="button"
          class="learn-btn"
          aria-expanded={learn}
          onClick={() => setLearn((v) => !v)}
        >
          {t.learnOpen} {learn ? UI_IG_SHELL.learnGlyphOpen : UI_IG_SHELL.learnGlyphClosed}
        </button>
      </section>

      {learn && (
        <div class="learn-panel">
          <span class="learn-h">{t.learnTitle}</span>
          <div class="learn-cols">
            <div>
              <span class="learn-k">{t.learnSourcesK}</span>
              <span class="learn-p">{t.learnSourcesP}</span>
            </div>
            <div>
              <span class="learn-k">{t.learnDrawK}</span>
              <span class="learn-p">{t.learnDrawP}</span>
            </div>
            <div>
              <span class="learn-k">{t.learnCareK}</span>
              <span class="learn-p">{t.learnCareP}</span>
            </div>
          </div>
        </div>
      )}

      <section class="card">
        <header class="kit-head">
          <span class="kit-count tnum">{t.count(formatInt(c.ipEvents + precise))}</span>
          <span class="kit-sub">{t.sub(formatInt(c.distinctCities), formatInt(precise))}</span>
          <span class="kit-spacer" />
          {/* biome-ignore lint/a11y/useSemanticElements: `<fieldset>` groups FORM controls; these are
              view switches, and `role="group"` with a label is the ARIA pattern for them. */}
          <div class="seg" role="group" aria-label={t.viewGroupLabel}>
            <button type="button" aria-pressed={!detail} onClick={() => setDetail(false)}>
              {t.viewMap}
            </button>
            <button type="button" aria-pressed={detail} onClick={() => setDetail(true)}>
              {t.viewDetail}
            </button>
          </div>
        </header>

        {/* `hidden` rather than a class: it takes the frame out of the flow AND out of the
            accessibility tree, and says so in the markup. */}
        <div ref={frameRef} class="carte-frame" hidden={detail}>
          <div ref={containerRef} class="carte-map" />

          {/* Fullscreen applies to the FRAME: the layer toggles and the wheel stay reachable once
              inside, where applying it to the canvas alone would have hidden what explains the map. */}
          <FullscreenToggle targetRef={frameRef} label={t.frameLabel} />

          <div class="carte-controls">
            <button
              type="button"
              class={`layer-toggle ${showDeclared ? 'on' : ''}`}
              aria-pressed={showDeclared}
              onClick={() => setShowDeclared((v) => !v)}
            >
              <span class="lt-mark declared-mark" /> {t.layerDeclared(formatInt(precise))}
            </button>
            <button
              type="button"
              class={`layer-toggle ${showTraj ? 'on' : ''}`}
              aria-pressed={showTraj}
              onClick={() => setShowTraj((v) => !v)}
            >
              <span class="lt-mark traj-mark" /> {t.layerInferred(formatInt(c.geolocated))}
            </button>
          </div>

          {range !== null && (
            <div class="carte-wheel">
              <TimeWheel
                from={range.from}
                to={range.to}
                value={cutoff}
                timestamps={trajTs}
                onChange={setCutoff}
              />
            </div>
          )}
        </div>

        {detail && (
          <MapDetail geo={geo} identity={report.identity} urls={urls} onOpenMedia={setViewer} />
        )}
      </section>

      {viewer !== null && (
        <MediaViewer
          item={viewer}
          media={resolveMedia ?? (async () => null)}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
}
