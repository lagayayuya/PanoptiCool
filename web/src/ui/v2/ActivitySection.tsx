// Section 01 « Ton activité en chiffres » (« parcours guidé » mockup, 2026-07-20 retouches) —
// three cards:
//   - Activity rhythm: hourly bars (aggregate `activity-rhythm`), legend in the HEADER
//     (mockup retouch) with « nuit · créneau à risque » — the qualifier returns INTO the
//     legend by decision of the mockup (ex-PANO-85: it had been removed from it; the
//     retouched mockup reintroduces it and prevails), 12-month / 30-day counters at the foot + the
//     « jours de ta vie » estimate in an orange callout beside;
//   - Volumes in your export: « vidéos visionnées » tile (the total, ex-counter of the rhythm) then
//     the R1/R2/R3/R5 tiles in the existing display order. The 2 all-time Activity
//     Summary totals are NO LONGER rendered (mockup retouch: the bottom text goes);
//   - What can really be analyzed: semantic-wall donut (insight `opacity` — readable vs
//     opaque). The mockup illustrated "visible in the export vs kept by TikTok" with a fake
//     26%; here the donut carries the engine's REAL counts, with the claim + the template's
//     explanation — the engine's semantics prevail over the mockup's illustration text.

import type { Opacity, Rhythm, Volumes } from '../../engine/analysis';
import { opacitySemanticWallClaim, opacitySemanticWallExplainer } from '../../engine/wording';
import { currentLocale } from '../../i18n/current';
import { UI_ACTIVITY } from '../copy';
import { formatInt, formatPercent } from '../format';
import { NAVY } from './palette';
import { timeEstimateSentence } from './time-estimate';

/** « nuit » hours — SAME convention as the rule `engine/rules/activity-rhythm.ts`: the two
 * must stay aligned, otherwise the graph colors a range the engine does not count. */
const NIGHT_HOURS = new Set([23, 0, 1, 2, 3, 4]);

// The engine's nocturnal callout (graduated qualifier `claim`) is NOT rendered (yuya's decision, 2026-07-15
// rework): juxtaposed with the « jours de ta vie » estimate below, the second orange callout
// created a parasitic visual duplicate. Only the estimate stays; the graph keeps its
// night/day coloring + legend. No view displays this verdict anymore — if it returns, it will return designed
// and rendered, not quietly reactivated.

export function RhythmCard({ rhythm }: { rhythm: Rhythm }) {
  const { hourlyActivity, videosWatched, estimatedMinutes } = rhythm;
  const max = Math.max(1, ...hourlyActivity);
  return (
    <div style={CARD}>
      {/* Header: title + note on the left, LEGEND on the right, pushed by a spacer rather than by
          `space-between` — v5 sets the title and its note on a shared baseline, which a
          two-element split would break as soon as the legend wraps. */}
      <div style={CARD_HEAD}>
        <span style={CARD_TITLE}>{UI_ACTIVITY.rhythmTitle}</span>
        <span style={CARD_NOTE}>{UI_ACTIVITY.rhythmNote}</span>
        <span style={SPACER} />
        <div style={LEGEND_ROW}>
          <div style={LEGEND_ITEM}>
            <div style={{ ...LEGEND_SQ, background: NAVY.risk }} />
            <span style={LEGEND_LABEL}>{UI_ACTIVITY.legendNight}</span>
          </div>
          <div style={LEGEND_ITEM}>
            <div style={{ ...LEGEND_SQ, background: NAVY.graphDay }} />
            <span style={LEGEND_LABEL}>{UI_ACTIVITY.legendDay}</span>
          </div>
        </div>
      </div>
      <div style={BARS}>
        {hourlyActivity.map((count, hour) => (
          <div key={hour} style={BAR_CELL}>
            <div
              style={{
                ...BAR,
                height: `${Math.max(5, Math.round((count / max) * 100))}%`,
                background: NIGHT_HOURS.has(hour) ? NAVY.risk : NAVY.graphDay,
              }}
            />
          </div>
        ))}
      </div>
      <div style={AXIS}>
        {UI_ACTIVITY.hourMarks.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {/* Foot: 12-month / 30-day counters on the left, estimate on the right. The TOTAL is not
          counted here — it is the « vidéos visionnées » tile of the volumes. v5 stacks each
          counter (figure over caption) and sets them side by side. */}
      <div style={RHYTHM_FOOT}>
        <div style={COUNTER_ROW}>
          <div style={COUNTER_COL}>
            <span style={COUNTER_N}>
              {UI_ACTIVITY.counterApprox(formatInt(videosWatched.last12Months))}
            </span>
            <span style={COUNTER_LABEL}>{UI_ACTIVITY.counter12MonthsLabel}</span>
          </div>
          <div style={COUNTER_COL}>
            <span style={COUNTER_N}>
              {UI_ACTIVITY.counterApprox(formatInt(videosWatched.last30Days))}
            </span>
            <span style={COUNTER_LABEL}>{UI_ACTIVITY.counter30DaysLabel}</span>
          </div>
        </div>
        <div style={ESTIMATE}>
          <span style={ESTIMATE_TAG}>{UI_ACTIVITY.estimateTag}</span>
          <span>{timeEstimateSentence(estimatedMinutes)}</span>
        </div>
      </div>
    </div>
  );
}

// --- Volumes in your export -----------------------------------------------------------------------

/** The 4 tiles, in the mockup's DISPLAY ORDER (never the engine's order).
 *
 * Batch A1: the card read `insight.ruleId` and re-guessed, via a `Set` shared with `grouping.ts`,
 * which of the 8 rules concerned it — to draw ONLY `value.signalCount` from it. The fields are
 * named (`volumes.searches`…): the table is now field → label, and the order is a list of
 * fields. No more `ruleId`, no more `Set`, no more `?? ruleId` fallback on an unrouted key — the
 * compiler holds the exhaustiveness (`keyof` over a closed union). */
const TILES_IN_DISPLAY_ORDER: readonly (keyof Omit<Volumes, 'allTime'>)[] = [
  'endorsements',
  'comments',
  'searches',
  'follows',
];

export function VolumesCard({
  volumes,
  videosWatchedTotal,
}: {
  volumes: Volumes;
  /** Total of watched videos (ex-counter « au total » of the rhythm, mockup retouch) — comes
   * from `rhythm.videosWatched.total`, thus absent when the rhythm is. */
  videosWatchedTotal?: number | undefined;
}) {
  const tiles = [
    ...(videosWatchedTotal === undefined
      ? []
      : [
          {
            key: 'videosWatched',
            label: UI_ACTIVITY.volumeTileVideosWatched,
            count: videosWatchedTotal,
          },
        ]),
    ...TILES_IN_DISPLAY_ORDER.flatMap((key) => {
      const count = volumes[key];
      return count === undefined ? [] : [{ key, label: UI_ACTIVITY.volumeTileLabels[key], count }];
    }),
  ];
  if (tiles.length === 0) {
    return null;
  }
  return (
    <div style={CARD}>
      <div style={CARD_HEAD}>
        <span style={CARD_TITLE}>{UI_ACTIVITY.volumesTitle}</span>
        <span style={SPACER} />
        <span style={CARD_NOTE_END}>{UI_ACTIVITY.volumesNote}</span>
      </div>
      <div style={TILES}>
        {tiles.map((t) => (
          <div key={t.key} style={TILE}>
            <span style={TILE_N}>{formatInt(t.count)}</span>
            <span style={TILE_LABEL}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- What can really be analyzed (semantic wall, donut) --------------------------------------------

export function AnalyzableShareCard({ opacity }: { opacity: Opacity }) {
  const { readableCount, opaqueCount } = opacity;
  const total = readableCount + opaqueCount;
  const ratio = total > 0 ? readableCount / total : 0;
  // Rounding to the integer would render « 0 % » for a non-null ratio (e.g. 0.44 %), displaying the INVERSE
  // of the finding (« rien de lisible » instead of « presque rien ») — never for a value > 0.
  // The « < 1 % » fallback is BUILT with the same formatter: its separator cannot diverge
  // from that of the other percentages, which was the case when it was hard-coded.
  const pctLabel =
    ratio > 0 && ratio < 0.01
      ? UI_ACTIVITY.opacityUnderOnePercent(formatPercent(0.01))
      : formatPercent(ratio);
  const pct = ratio * 100;
  return (
    <div style={CARD}>
      <span style={CARD_TITLE}>{UI_ACTIVITY.opacityTitle}</span>
      <div style={DONUT_ROW}>
        <div
          style={{
            ...DONUT,
            background: `conic-gradient(${NAVY.accent} 0 ${pct}%, ${NAVY.donutRest} ${pct}% 100%)`,
          }}
          role="img"
          aria-label={UI_ACTIVITY.opacityDonutAriaLabel(pctLabel)}
        >
          <div style={DONUT_HOLE}>
            <span style={DONUT_PCT}>{pctLabel}</span>
          </div>
        </div>
        <div style={DONUT_LEGEND}>
          <div style={LEGEND_ITEM}>
            <div style={{ ...LEGEND_SQ, background: NAVY.accent }} />
            <span style={LEGEND_LABEL_WRAP}>
              {UI_ACTIVITY.opacityReadableLegend(formatInt(readableCount), readableCount)}
            </span>
          </div>
          <div style={LEGEND_ITEM}>
            <div style={{ ...LEGEND_SQ, background: NAVY.donutRest }} />
            <span style={LEGEND_LABEL_WRAP}>
              {UI_ACTIVITY.opacityOpaqueLegend(formatInt(opaqueCount), opaqueCount)}
            </span>
          </div>
        </div>
      </div>
      {/* The claim is no longer carried by the finding: its text is CONSTANT, the card calls the
          function — as it already called the explainer directly (batch A2). */}
      <div style={CARD_FOOT2}>
        {opacitySemanticWallClaim(currentLocale())} {opacitySemanticWallExplainer(currentLocale())}
      </div>
    </div>
  );
}

// --- Styles (« PanoptiCool v5 Web » mockup, section 01) --------------------------------------------
// v5 IS A LEGIBILITY PASS, not a new layout: the cards, their order and their contents are v4's.
// What moves is the scale — 11 px labels become 14–15 px, the card titles leave uppercase tracking
// for 20 px sentence case, radii go 12 → 20 px. It is the accessibility objective applied to the
// densest surface of the product (CLAUDE.md: the tool aims at the greatest number).
const CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '28px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '20px',
  minWidth: 0,
} as const;
const CARD_HEAD = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '16px',
  flexWrap: 'wrap',
} as const;
const CARD_TITLE = {
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.2,
  color: '#ffffff',
} as const;
const CARD_NOTE = { fontSize: '15px', lineHeight: 1.4, color: NAVY.textBody } as const;
/** Note pushed to the RIGHT of its header (the volumes card's « 12 derniers mois »). */
const CARD_NOTE_END = { fontSize: '14px', lineHeight: 1.4, color: NAVY.textMuted } as const;
const SPACER = { flex: 1 } as const;
const BARS = { display: 'flex', alignItems: 'flex-end', gap: '5px', height: '150px' } as const;
const BAR_CELL = { flex: 1, display: 'flex', alignItems: 'flex-end', height: '100%' } as const;
const BAR = { width: '100%', minHeight: '5px', borderRadius: '5px 5px 0 0' } as const;
const AXIS = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  lineHeight: 1,
  color: NAVY.textMuted,
} as const;
const RHYTHM_FOOT = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '24px',
  flexWrap: 'wrap',
  borderTop: `1px solid ${NAVY.borderHeader}`,
  paddingTop: '20px',
} as const;
// v5 STACKS the counters — the number above its label, no longer on the same baseline. At 30 px
// the figure is the thing read first, and « ≈ 100 000 » beside its caption on one line would run
// past the card on a narrow column.
const COUNTER_ROW = { display: 'flex', gap: '36px', flexWrap: 'wrap' } as const;
const COUNTER_COL = { display: 'flex', flexDirection: 'column', gap: '7px' } as const;
const COUNTER_N = {
  fontSize: '30px',
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: '-0.03em',
  color: '#ffffff',
} as const;
const COUNTER_LABEL = { fontSize: '15px', lineHeight: 1.4, color: NAVY.textBody } as const;
const LEGEND_ROW = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '18px',
  alignItems: 'center',
} as const;
const LEGEND_ITEM = { display: 'flex', alignItems: 'center', gap: '9px' } as const;
const LEGEND_SQ = { width: '11px', height: '11px', borderRadius: '3px', flex: 'none' } as const;
const LEGEND_LABEL = { fontSize: '14px', lineHeight: 1, color: NAVY.textBody } as const;
const LEGEND_LABEL_WRAP = { fontSize: '15px', lineHeight: 1.4, color: NAVY.textBody } as const;
const ESTIMATE = {
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  fontSize: '15px',
  lineHeight: 1.6,
  color: NAVY.riskText,
  background: NAVY.riskBg,
  border: `1px solid ${NAVY.riskBorder}`,
  borderRadius: '16px',
  padding: '16px 20px',
  maxWidth: '420px',
} as const;
// The tag leaves uppercase micro-type for plain 14 px: at 9 px it was decoration, not a word.
const ESTIMATE_TAG = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1,
  color: '#e8a184',
} as const;
const TILES = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
  gap: '12px',
  flex: 1,
  alignContent: 'center',
} as const;
const TILE = {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '18px 20px',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '14px',
} as const;
// ⚠ THE FIGURES TURN CYAN in v5, where v4 set them in plain white. It is the one colour change of
// the section and it is deliberate: the tiles are the only place the page states a RAW COUNT — what
// is literally in the file, before any inference. The accent marks that, and the donut's « 26 % »
// uses the same cyan for the same reason.
const TILE_N = {
  fontSize: '26px',
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: '-0.03em',
  color: NAVY.accent,
} as const;
const TILE_LABEL = { fontSize: '15px', lineHeight: 1.45, color: NAVY.textBody } as const;
const CARD_FOOT2 = {
  fontSize: '15px',
  lineHeight: 1.65,
  color: NAVY.textBody,
  borderTop: `1px solid ${NAVY.borderHeader}`,
  paddingTop: '18px',
} as const;
const DONUT_ROW = { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' } as const;
const DONUT = {
  flex: 'none',
  width: '110px',
  height: '110px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;
const DONUT_HOLE = {
  width: '72px',
  height: '72px',
  borderRadius: '50%',
  background: NAVY.bgCard,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;
const DONUT_PCT = { fontSize: '20px', fontWeight: 700, lineHeight: 1, color: NAVY.accent } as const;
const DONUT_LEGEND = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  minWidth: 0,
} as const;
