// Hourly activity rhythm + watch counters + estimate (PANO-85) — → `RhythmCard`.
//
// Batch A1: returns `Rhythm | undefined` instead of an `aggregate` `Insight`. The aggregate was
// already nothing but a `value` carrier: since the v2 refonte, the night inset was removed from the
// render (`ActivitySection.tsx` — "the second orange inset created a spurious visual duplicate"), so
// its `claim`/`framing`/`confidence` no longer had any reader.
//
// WHAT LEAVES WITH IT, and must be stated rather than left to be discovered: the GRADUATED night
// framing of PANO-85 (`nightShare` + the 3 templates `night-moderate|balanced|high`, thresholds 0.20
// / 0.33) was yuya's PANO-85 decision — a nuanced qualifier rather than an "at-risk slot" verdict. It
// no longer has a producer HERE because it no longer has a stage: the card shows the graph, the
// counters and the estimate, never the sentence. Removing it does not judge the finding — it is the
// BATCH B2 doctrine (§11.4): no code that runs for no one; if it returns, it will return DESIGNED AND
// RENDERED. The night/day coloring of the graph, though, LIVES (`NIGHT_HOURS` is redeclared on the
// card side, the two conventions must stay aligned — unchanged since PANO-85).

import { readActivitySummary } from '../activity-summary';
import type { Rhythm } from '../analysis';
import type { NormalizedExport } from '../normalize';
import { parseRawDateUTC } from './shared';

export const ACTIVITY_RHYTHM_SECTION_PATH = 'Your Activity/Watch History' as const;

/** Gap beyond which two consecutive views are counted in TWO distinct sessions. */
const SESSION_GAP_MS = 5 * 60 * 1000;
/** Nominal duration attributed to the last video of a session (without it, a single-video session
 *  would count 0 minutes). */
const NOMINAL_LAST_VIDEO_MS = 30 * 1000;

function bucketByHour(rawDates: readonly string[]): number[] {
  const hours = new Array<number>(24).fill(0);
  for (const raw of rawDates) {
    const hour = Number(raw.slice(11, 13));
    if (Number.isInteger(hour) && hour >= 0 && hour <= 23) {
      hours[hour] = (hours[hour] ?? 0) + 1;
    }
  }
  return hours;
}

/** Watch counters (C, PANO-85). `total` is ALL-TIME (Activity Summary), the other two are SLIDING
 *  windows over Watch History — the mix is INTENDED (the honest total lives in Activity Summary, not
 *  in the short Watch History window). */
function watchCounts(
  rawDates: readonly string[],
  allTimeTotal: number,
  now: number,
): Rhythm['videosWatched'] {
  const cutoff12m = now - 365 * 86_400_000;
  const cutoff30d = now - 30 * 86_400_000;
  let last12Months = 0;
  let last30Days = 0;
  for (const raw of rawDates) {
    const t = parseRawDateUTC(raw);
    if (t === null) {
      continue;
    }
    if (t >= cutoff12m) {
      last12Months += 1;
    }
    if (t >= cutoff30d) {
      last30Days += 1;
    }
  }
  return { total: allTimeTotal, last12Months, last30Days };
}

/** ESTIMATED minutes (D, PANO-85) by sessionizing the dates: we sum the INTRA-session gaps and add a
 *  nominal duration per session for its last video. An assumed estimate, presented as such on screen
 *  (mirror, not oracle) — a figure, never a verdict. */
function estimatedMinutes(rawDates: readonly string[]): number {
  const epochs = rawDates
    .map(parseRawDateUTC)
    .filter((t): t is number => t !== null)
    .sort((a, b) => a - b);
  if (epochs.length === 0) {
    return 0;
  }
  let intraMs = 0;
  let sessions = 1; // at least one session as soon as there is a video
  for (let i = 1; i < epochs.length; i += 1) {
    const gap = (epochs[i] ?? 0) - (epochs[i - 1] ?? 0);
    if (gap < SESSION_GAP_MS) {
      intraMs += gap;
    } else {
      sessions += 1;
    }
  }
  const totalMs = intraMs + sessions * NOMINAL_LAST_VIDEO_MS;
  return Math.round(totalMs / 60_000);
}

/** `undefined` if the watch history is empty (nothing to plot). */
export function readRhythm(input: NormalizedExport, now: number = Date.now()): Rhythm | undefined {
  const videoList = input['Your Activity']['Watch History'].VideoList;
  if (videoList.length === 0) {
    return undefined;
  }
  const dates = videoList.map((item) => item.Date);
  return {
    hourlyActivity: bucketByHour(dates),
    videosWatched: watchCounts(dates, readActivitySummary(input).videosWatchedToEnd, now),
    estimatedMinutes: estimatedMinutes(dates),
  };
}
