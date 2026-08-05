// The screen between the drop and the result — one for both connectors.
//
// ⚠ WHY IT IS SHARED. The two journeys waited differently: TikTok showed a centred callout with a
// spinner, Instagram a left-aligned column with its own kicker, a progress bar and a counter. Same
// moment, same product, two screens — and the demo made the divergence obvious, since the two are
// one click apart from the home page. Yul's decision: keep TikTok's, use it for both.
//
// ⚠ WHAT INSTAGRAM KEEPS, AND WHY IT IS NOT A HALF-MEASURE. The progress BAR is gone with the rest,
// but the phase and the count are not: a TikTok export is a few megabytes and the spinner has
// stopped before it means anything, while an Instagram archive runs to gigabytes and takes minutes.
// A spinner alone, for minutes, is indistinguishable from a page that has hung — the very failure
// this session was tracking down. So the shape is TikTok's and the connector that has something to
// report passes it as `detail`, on one line, under the sub.
//
// ─── WHAT THIS SCREEN DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT CANNOT BE CANCELLED. Neither journey can interrupt a running worker today, and a button
//     that only pretended to would be worse than none;
//   - IT DOES NOT ESTIMATE A TIME. Nothing here can: the phases do not have comparable costs, and
//     a countdown that is wrong is read as a broken page rather than as an estimate.

import { UI_ANALYSE } from '../copy';
import { NAVY } from './palette';
import { useIsMobile } from './useIsMobile';

export function LoadingScreen({ detail }: { detail?: string | undefined }) {
  const isMobile = useIsMobile();
  return (
    <div style={isMobile ? M_SHELL : SHELL}>
      <div style={BOX}>
        <span style={SPINNER} aria-hidden="true" />
        <span style={MAIN}>{UI_ANALYSE.loadingMain}</span>
        <span style={SUB}>{UI_ANALYSE.loadingSub}</span>
        {detail !== undefined && detail !== '' && <span style={DETAIL}>{detail}</span>}
      </div>
    </div>
  );
}

// --- Styles ---------------------------------------------------------------------------------------
const SHELL = {
  flex: 1,
  width: '100%',
  boxSizing: 'border-box',
  maxWidth: '720px',
  margin: '0 auto',
  padding: '72px 40px 64px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
} as const;
const M_SHELL = { ...SHELL, maxWidth: '480px', padding: '36px 20px 48px' } as const;
const BOX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '14px',
  padding: '72px 24px',
  marginTop: '8px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '14px',
  textAlign: 'center',
} as const;
/** The `pano-spin` keyframes are global, declared by the page — an inline style cannot carry its
 *  own. Both journeys' pages declare it; a journey that forgets gets a still ring, not a crash. */
const SPINNER = {
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  border: `2px solid ${NAVY.borderChip}`,
  borderTopColor: NAVY.accent,
  animation: 'pano-spin 0.8s linear infinite',
} as const;
const MAIN = { fontSize: '14px', fontWeight: 500, color: NAVY.textBright } as const;
const SUB = { fontSize: '11px', color: NAVY.textMuted } as const;
/** Tabular figures: a counter whose digits shift while it climbs reads as instability. */
const DETAIL = {
  fontSize: '11px',
  color: NAVY.textDim,
  fontVariantNumeric: 'tabular-nums',
} as const;
