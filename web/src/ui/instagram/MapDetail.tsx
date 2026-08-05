// « 02 · LA CARTE » — the EN DÉTAIL view.
//
// ————— The problem it has to avoid —————
//
// The export carries hundreds of IP logins. Listing them is technically the most « complete » view
// and humanly the worst: a thousand rows read as noise, and noise demonstrates nothing. A dossier
// nobody can read protects the platform, not the person.
//
// ————— Four tiers, from meaning towards matter —————
//
//  1. THE CITIES — the backbone. Hundreds of logins fall into a few dozen cities, each with its
//     PERIODS on the dossier's common axis;
//  2. THE PRECISE PLACES — the few dozen metre-accurate points the person handed over themselves,
//     grouped by year, each showing the REAL media from the export;
//  3. THE ADDRESSES — the recorded postal addresses, which are not points but text;
//  4. THE TECHNICAL TRACES — folded, counted, announced. They exist and nothing is hidden; they are
//     simply on the LAST tier, because they are the matter and not the point.
//
// ⚠ EVERY TIER STATES ITS OWN TRUNCATION, and both ceilings are taken BEFORE any grouping — which is
// what makes them actually cap. A counter announcing 219 while showing 40 in silence is an interface
// lie, and it is the defect these tiers exist not to commit.
//
// ─── ⚠ WHAT THIS VIEW DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT DOES NOT LIST UNNAMED CLUSTERS. The export does not always name an IP's city, and the
//     engine leaves the field empty rather than writing a false name. In a RANKED list that row
//     becomes « #4 · 50 logins » — a rank, a number, and nothing to name. Those logins do not
//     disappear from the dossier: they stay on the map, where a nameless point reads fine by its
//     position. The two figures in the introduction therefore describe THE LIST, not the export;
//   - IT DOES NOT MASK VALUES. An export handed to its owner, read on their machine: hiding their
//     own coordinates from them would be theatre;
//   - IT DOES NOT SHOW A MAP. That is the other view of the same piece, and the toggle keeps the map
//     alive rather than rebuilding it.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { DeclaredPoint, GeoReport } from '../../engine/instagram/geo';
import type { IdentityAnchor, IdentityReport } from '../../engine/instagram/identity';
import { UI_IG_MAP_DETAIL } from '../copy.instagram';
import { formatInt } from '../format';
import { dayMonthYear, fmtPeriod, isVideoPath, monthYear } from './dates';
import type { ViewerItem } from './MediaViewer';
import { loadImageThumb, loadVideoPoster } from './media-thumb';
import type { MediaUrls } from './media-url';
import './carte-detail.css';

const CITIES_SHOWN = 5;
/** Taken BEFORE the grouping by year: that is what makes it global, and so actually capping. */
const PRECISE_SHOWN = 20;

/** ⚠ `last-known` WITH A HYPHEN — the engine's own spelling (`DeclaredKind`). An underscore here
 *  silently fell through to the default glyph AND wrote a class the sheet does not carry. */
const KIND_GLYPH: Record<string, string> = { post: '▣', story: '◆', 'last-known': '◈' };

export function MapDetail({
  geo,
  identity,
  urls,
  onOpenMedia,
}: {
  geo: GeoReport;
  identity: IdentityReport | undefined;
  urls: MediaUrls;
  onOpenMedia: (v: ViewerItem) => void;
}) {
  const t = UI_IG_MAP_DETAIL;
  const nothing =
    geo.cities.length === 0 && geo.declared.length === 0 && geo.addresses.length === 0;
  if (nothing) return <p class="cd-empty">{t.empty}</p>;

  return (
    <div class="cd">
      <Cities geo={geo} />
      <Places geo={geo} urls={urls} onOpenMedia={onOpenMedia} />
      <Addresses geo={geo} />
      {identity !== undefined && <Technical identity={identity} />}
    </div>
  );
}

/* ========================= 1 · The cities ========================= */

function Cities({ geo }: { geo: GeoReport }) {
  const t = UI_IG_MAP_DETAIL;
  const [all, setAll] = useState(false);
  const cities = useMemo(() => geo.cities.filter((c) => c.city.trim() !== ''), [geo]);
  const listed = useMemo(() => cities.reduce((n, c) => n + c.visits, 0), [cities]);
  if (cities.length === 0) return null;

  const shown = all ? cities : cities.slice(0, CITIES_SHOWN);
  const hidden = cities.length - shown.length;

  return (
    <section class="cd-block">
      <header class="cd-head">
        <h3 class="cd-h">{t.citiesH}</h3>
        <p class="cd-lede">{t.citiesLede(formatInt(listed), formatInt(cities.length))}</p>
      </header>

      <ol class="cd-cities">
        {shown.map((c, i) => {
          const has = c.periods.length > 0;
          const first = has ? Math.min(...c.periods.map((p) => p.from)) : 0;
          const last = has ? Math.max(...c.periods.map((p) => p.to)) : 0;
          return (
            <li key={`${c.city}-${c.lat}-${c.lon}`} class="cd-city">
              {/* The rank SAYS something: #1 is the most frequented city. */}
              <span class="cd-rank">#{i + 1}</span>
              <span class="cd-city-who">
                <span class="cd-city-name">{c.city}</span>
                {/* ⚠ THE COUNTRY AND THE LOGIN COUNT GO UNDER THE NAME, where they read as a gloss.
                    In columns they competed with the track for the eye. */}
                <span class="cd-city-country">
                  {c.country !== undefined && c.country !== '' ? `${c.country} · ` : ''}
                  {c.visits > 1
                    ? t.cityConn(formatInt(c.visits))
                    : t.cityConnOne(formatInt(c.visits))}
                </span>
              </span>
              {/* ⚠ THE TWO DATES FRAME THE TRACK rather than floating to the right. They stop being
                  one more column and become its BOUNDS: the track then reads without a legend,
                  which was exactly what was missing. */}
              <span class="cd-city-when">
                <span class="cd-when-b">{has ? monthYear(first) : '—'}</span>
                <PeriodTrack periods={c.periods} range={geo.timeRange} label={c.city} />
                <span class="cd-when-b r">{has ? monthYear(last) : t.cityDateUnknown}</span>
              </span>
            </li>
          );
        })}
      </ol>

      {hidden > 0 && (
        <button type="button" class="cd-more" onClick={() => setAll(true)}>
          {t.citiesMore(formatInt(hidden))}
        </button>
      )}
      {all && cities.length > CITIES_SHOWN && (
        <button type="button" class="cd-more" onClick={() => setAll(false)}>
          {t.citiesLess(String(CITIES_SHOWN))}
        </button>
      )}
    </section>
  );
}

/**
 * A city's periods on the axis of the WHOLE dossier — that common axis is what makes cities
 * comparable with one another. The visual summary does not replace the data: each segment carries
 * its native tooltip, and the track's label states the span.
 */
function PeriodTrack({
  periods,
  range,
  label,
}: {
  periods: ReadonlyArray<{ readonly from: number; readonly to: number }>;
  range: { readonly from: number; readonly to: number } | null;
  label: string;
}) {
  if (periods.length === 0) return <span class="cd-track empty" aria-hidden="true" />;
  const first = Math.min(...periods.map((p) => p.from));
  const last = Math.max(...periods.map((p) => p.to));
  const lo = range?.from ?? first;
  const hi = range?.to ?? last;
  const span = Math.max(1, hi - lo);

  return (
    <>
      <span class="cd-track" aria-hidden="true">
        {periods.map((p) => {
          const left = ((p.from - lo) / span) * 100;
          // A 0.8 % floor: one day of presence over twelve years measures 0.02 % of the track —
          // nothing at all on screen.
          const width = Math.max(0.8, ((p.to - p.from) / span) * 100);
          return (
            <i
              key={`${p.from}-${p.to}`}
              style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }}
              title={fmtPeriod(p.from, p.to)}
            />
          );
        })}
      </span>
      {/* The visual summary does not replace the data: the exact periods stay available to a screen
          reader, which meets only a stack of empty spans otherwise. */}
      <span class="sr-only">
        {label} — {periods.map((p) => fmtPeriod(p.from, p.to)).join(', ')}
      </span>
    </>
  );
}

/* ========================= 2 · The precise places ========================= */

function Places({
  geo,
  urls,
  onOpenMedia,
}: {
  geo: GeoReport;
  urls: MediaUrls;
  onOpenMedia: (v: ViewerItem) => void;
}) {
  const t = UI_IG_MAP_DETAIL;
  const [all, setAll] = useState(false);

  // Most recent first. The ceiling is taken BEFORE the grouping by year, which is what makes it
  // global rather than per-year.
  const sorted = useMemo(() => [...geo.declared].sort((x, y) => (y.ts ?? 0) - (x.ts ?? 0)), [geo]);
  const shown = all ? sorted : sorted.slice(0, PRECISE_SHOWN);
  const hidden = sorted.length - shown.length;

  const byYear = useMemo(() => {
    const groups = new Map<string, DeclaredPoint[]>();
    for (const p of shown) {
      const key = p.ts === null ? t.yearUnknown : String(new Date(p.ts * 1000).getFullYear());
      const list = groups.get(key);
      if (list === undefined) groups.set(key, [p]);
      else list.push(p);
    }
    return [...groups.entries()].map(([year, points]) => ({ year, points }));
  }, [shown, t]);

  if (sorted.length === 0) return null;

  return (
    <section class="cd-block">
      <header class="cd-head">
        <h3 class="cd-h">{t.placesH}</h3>
        <p class="cd-lede">{t.placesLede(formatInt(sorted.length))}</p>
      </header>

      {byYear.map((g) => (
        <div key={g.year} class="cd-year">
          <div class="cd-year-head">
            <span class="cd-year-n">{g.year}</span>
            <span class="cd-year-c">
              {g.points.length > 1
                ? t.yearPoints(formatInt(g.points.length))
                : t.yearPointsOne(formatInt(g.points.length))}
            </span>
            <span class="cd-rule" aria-hidden="true" />
          </div>
          <ul class="cd-points">
            {g.points.map((p, i) => (
              <PointCard
                key={`${p.lat}-${p.lon}-${p.ts ?? i}`}
                point={p}
                urls={urls}
                onOpenMedia={onOpenMedia}
              />
            ))}
          </ul>
        </div>
      ))}

      {hidden > 0 && (
        <button type="button" class="cd-more" onClick={() => setAll(true)}>
          {t.placesMore(formatInt(hidden))}
        </button>
      )}
      {all && sorted.length > PRECISE_SHOWN && (
        <button type="button" class="cd-more" onClick={() => setAll(false)}>
          {t.placesLess(String(PRECISE_SHOWN))}
        </button>
      )}
    </section>
  );
}

/**
 * One precise place, with its media's thumbnail.
 *
 * ⚠ THE CARD IS ONLY CLICKABLE IF IT HAS A MEDIA TO OPEN. A last known position has none: it stays
 * an inert `<li>` rather than a button that would do nothing — a control that answers nothing
 * teaches the reader that controls here are unreliable.
 */
function PointCard({
  point,
  urls,
  onOpenMedia,
}: {
  point: DeclaredPoint;
  urls: MediaUrls;
  onOpenMedia: (v: ViewerItem) => void;
}) {
  const t = UI_IG_MAP_DETAIL;
  const KIND: Record<string, string> = {
    post: t.kindPost,
    story: t.kindStory,
    'last-known': t.kindLast,
  };
  const path = point.mediaPath ?? '';
  const kindLabel = KIND[point.kind] ?? point.kind;
  const when = point.ts === null ? t.cityDateUnknown : dayMonthYear(point.ts);
  const coords = `${point.lat.toFixed(4)}, ${point.lon.toFixed(4)}`;

  const body = (
    <>
      {path !== '' ? (
        <Thumb path={path} alt={kindLabel} urls={urls} />
      ) : (
        <span class="cd-point-g" aria-hidden="true">
          {KIND_GLYPH[point.kind] ?? '◈'}
        </span>
      )}
      <span class="cd-point-k">{kindLabel}</span>
      <span class="cd-point-c">{coords}</span>
      <span class="cd-point-d">{when}</span>
    </>
  );

  if (path === '') return <li class={`cd-point ${point.kind} inert`}>{body}</li>;
  return (
    <li class={`cd-point ${point.kind}`}>
      <button
        type="button"
        class="cd-point-btn"
        aria-label={t.openMedia(kindLabel, when)}
        onClick={() =>
          onOpenMedia({
            path,
            kind: isVideoPath(path) ? 'video' : 'photo',
            title: kindLabel,
            subtitle: `${when} · ${coords}`,
          })
        }
      >
        {body}
      </button>
    </li>
  );
}

/**
 * The thumbnail, decoded on demand from the export.
 *
 * ⚠ IT DECODES TO A CANVAS and keeps only that. The bytes are needed once; the shared URL cache
 * holds the handle and releases every one of them when the piece unmounts.
 */
function Thumb({ path, alt, urls }: { path: string; alt: string; urls: MediaUrls }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'none'>('loading');

  useEffect(() => {
    let alive = true;
    void urls
      .url(path)
      .then(async (u) => {
        if (u === null) {
          if (alive) setState('none');
          return;
        }
        const canvas = isVideoPath(path)
          ? await loadVideoPoster(u, 160)
          : await loadImageThumb(u, 160);
        if (!alive) return;
        ref.current?.replaceChildren(canvas);
        setState('ok');
      })
      .catch(() => {
        if (alive) setState('none');
      });
    return () => {
      alive = false;
    };
  }, [path, urls]);

  return (
    <span class={`cd-thumb ${state}`}>
      <span ref={ref} class="cd-thumb-img" aria-hidden="true" />
      {state !== 'ok' && (
        <span class="cd-thumb-glyph" aria-hidden="true">
          {isVideoPath(path) ? '▶' : '▣'}
        </span>
      )}
      {state === 'ok' && isVideoPath(path) && (
        <span class="cd-thumb-play" aria-hidden="true">
          ▶
        </span>
      )}
      <span class="sr-only">{alt}</span>
    </span>
  );
}

/* ========================= 3 · The addresses ========================= */

function Addresses({ geo }: { geo: GeoReport }) {
  const t = UI_IG_MAP_DETAIL;
  if (geo.addresses.length === 0) return null;
  return (
    <section class="cd-block">
      <header class="cd-head">
        <h3 class="cd-h">{t.addressesH}</h3>
        <p class="cd-lede">{t.addressesLede}</p>
      </header>
      <ul class="cd-addresses">
        {geo.addresses.map((a, i) => (
          <li key={`${a.line1 ?? ''}-${a.postcode ?? ''}-${i}`}>
            <span class="cd-addr-line">
              {[
                a.line1,
                a.line2,
                [a.postcode, a.city].filter(Boolean).join(' '),
                a.region,
                a.country,
              ]
                .filter((x) => x !== undefined && x !== '')
                .join(', ')}
            </span>
            {a.updated !== undefined && a.updated !== null && (
              <span class="cd-addr-when">{t.addressUpdated(monthYear(a.updated))}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ========================= 4 · The technical traces ========================= */

/**
 * The identity report's anchors that SITUATE. Here is where they mean something, and not on the
 * identity card: an address is not a trait of the person, it is a place.
 *
 * `device` belongs here although it is not a position: it is what attaches a trajectory to a
 * machine, so to someone. `privacy` does NOT — a visibility setting situates nothing.
 */
const TECHNICAL = ['ip', 'gps', 'device'] as const;

function Technical({ identity }: { identity: IdentityReport }) {
  const t = UI_IG_MAP_DETAIL;
  const anchors = TECHNICAL.map((key) => identity.anchors.find((a) => a.key === key)).filter(
    // `a?.present` rend `undefined` sur une ancre absente, et un prédicat de type exige un
    // booléen : `=== true` referme l'écart sans réintroduire la chaîne optionnelle.
    (a): a is IdentityAnchor => a?.present === true && a.values.length > 0,
  );
  if (anchors.length === 0) return null;

  return (
    <section class="cd-block">
      <header class="cd-head">
        <h3 class="cd-h">{t.rawH}</h3>
        <p class="cd-lede">{t.rawLede}</p>
      </header>
      {anchors.map((a) => (
        <RawFold key={a.key} anchor={a} />
      ))}
    </section>
  );
}

function RawFold({ anchor }: { anchor: IdentityAnchor }) {
  const t = UI_IG_MAP_DETAIL;
  // ⚠ The engine caps long lists. Announcing 219 while showing 40 without saying so would be exactly
  // the lie this view exists not to tell.
  const total = anchor.valuesTotal ?? anchor.values.length;
  const hidden = total - anchor.values.length;

  return (
    <details class="cd-fold">
      <summary>
        <span class="cd-fold-c" aria-hidden="true">
          ▸
        </span>
        <span class="cd-fold-t">{anchor.label}</span>
        <span class="cd-fold-e">{anchor.evidence}</span>
        <span class="cd-fold-n tnum">{formatInt(total)}</span>
      </summary>
      <div class="cd-fold-body">
        <p class="cd-enables">{t.rawEnables(anchor.enables)}</p>
        <ul class="cd-raw">
          {anchor.values.map((v, i) => (
            <li key={`${v}-${i}`}>{v}</li>
          ))}
        </ul>
        {hidden > 0 && (
          <p class="cd-rest">{t.rawRest(formatInt(hidden), formatInt(anchor.values.length))}</p>
        )}
      </div>
    </details>
  );
}
