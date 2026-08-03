// Test of `readRhythm` (PANO-85). Covers:
//   - empty VideoList → `undefined` (absence is a dedicated rule);
//   - shape: 24 hourly counters;
//   - hourly bucketing by string slicing (the Date's LOCAL hour, no timezone drift);
//   - counters: ALL-TIME total (Activity Summary) + rolling 12 months and 30 days (injected clock);
//   - estimation by sessionization (gap < 5 min = same session; one nominal per session).
//
// `now` is ALWAYS injected: the rolling windows depend on the clock — a test on absolute values
// without a fixed `now` would rot with time.
//
// CARRIED OVER AT REWORK A. Two blocks are not translated but DELETED:
//   - the `describe` of the GRADED NIGHT FRAMING (« moderate / balanced / heavy »): the feature has
//     no producer left — its last reader had disappeared from the render (cf. the header of
//     `activity-rhythm.ts` and ADR-0004). Testing it would test dead code; keeping it alive through
//     a test would bring it back without a decision. If it comes back, it will come back DESIGNED
//     AND RENDERED;
//   - `ruleId`/`kind`/`confidence: factual`/`sensitivity`/`framing.templateId`: the aggregate was no
//     more than a carrier for `value`. `Rhythm` IS that value, named — there is no finding envelope
//     around it any more, hence nothing left to check on it. What survives of that block is the one
//     assertion that bore on the data: 24 hourly counters.
// In passing: the narrowing `if (insight?.kind !== 'aggregate')` disappears from every test — it
// existed to prove to the compiler which member of the `Insight` union we were holding.

import { describe, expect, it } from 'vitest';
import type { Rhythm } from '../analysis';
import { normalizeExport } from '../normalize';
import type { TikTokExport, WatchHistoryItem } from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import { readRhythm } from './activity-rhythm';

/** Fixed test clock (UTC) — every rolling window refers to it. */
const NOW = Date.parse('2026-07-05T12:00:00Z');

/** Builds a valid export whose `Watch History` carries the given items, and sets the Activity
 * Summary all-time total (`videosWatchedToTheEndSinceAccountRegistration`) — source of `total`
 * (PANO-85). */
function exportWithWatch(
  items: readonly WatchHistoryItem[],
  allTimeWatchedToEnd = 0,
): TikTokExport {
  const base = validTikTokExport() as TikTokExport & {
    'Your Activity': {
      'Watch History': { VideoList: readonly WatchHistoryItem[] };
      'Activity Summary': {
        ActivitySummaryMap: { videosWatchedToTheEndSinceAccountRegistration: number };
      };
    };
  };
  base['Your Activity']['Watch History'].VideoList = items;
  base['Your Activity'][
    'Activity Summary'
  ].ActivitySummaryMap.videosWatchedToTheEndSinceAccountRegistration = allTimeWatchedToEnd;
  return base;
}

/** Synthetic Watch History item: only the `Date` matters here (Link/Title opaque). */
function watch(date: string): WatchHistoryItem {
  return { Date: date, Link: 'https://www.tiktokv.com/share/video/0/', Title: '' };
}

/** Rhythm emitted for these items — fails if the rule stays silent (every test below supplies at
 *  least one watch: `undefined` would be a bug there, not a case to narrow). */
function runOn(items: readonly WatchHistoryItem[], allTimeWatchedToEnd = 0): Rhythm {
  const rhythm = readRhythm(normalizeExport(exportWithWatch(items, allTimeWatchedToEnd)), NOW);
  if (rhythm === undefined) {
    throw new Error('expected an emitted rhythm');
  }
  return rhythm;
}

describe('readRhythm — shape and absence', () => {
  it('empty VideoList → undefined (absence delegated to the dedicated rule)', () => {
    expect(readRhythm(normalizeExport(validTikTokExport()), NOW)).toBeUndefined();
  });

  it('one watch → 24 hourly counters', () => {
    expect(runOn([watch('2026-06-01 14:30:00')]).hourlyActivity).toHaveLength(24);
  });
});

describe('readRhythm — hourly bucketing', () => {
  it('counts by the LOCAL hour of the Date (string slicing, no timezone drift)', () => {
    const rhythm = runOn([
      watch('2026-06-01 03:00:00'),
      watch('2026-06-02 03:12:00'),
      watch('2026-06-03 14:45:00'),
    ]);
    expect(rhythm.hourlyActivity[3]).toBe(2);
    expect(rhythm.hourlyActivity[14]).toBe(1);
    // Sum = number of dated videos (each video bucketed once).
    expect(rhythm.hourlyActivity.reduce((a, b) => a + b, 0)).toBe(3);
  });
});

describe('readRhythm — watch counters (injected clock)', () => {
  it('total = all-time (Activity Summary); rolling 12 months and 30 days = Watch History', () => {
    // NOW = 2026-07-05 → 30-day window since 2026-06-05; 12-month window since 2025-07-05.
    const rhythm = runOn(
      [
        watch('2026-07-02 10:00:00'), // 30 d AND 12 months
        watch('2026-06-20 11:00:00'), // 30 d AND 12 months
        watch('2026-05-01 09:00:00'), // 12 months, OUTSIDE 30 d
        watch('2025-02-10 09:00:00'), // > 12 months (before 2025-07-05), outside everything
      ],
      99999, // all-time total from Activity Summary — DECORRELATED from the Watch History length
    );
    // `total` comes from Activity Summary (99999), NOT from the length of VideoList (4).
    expect(rhythm.videosWatched).toEqual({ total: 99999, last12Months: 3, last30Days: 2 });
  });
});

describe('readRhythm — time estimation (sessionization)', () => {
  it('a single video → exactly the nominal duration (30 s → 1 min rounded)', () => {
    // 30 s = 0.5 min → rounded to 1.
    expect(runOn([watch('2026-06-01 10:00:00')]).estimatedMinutes).toBe(1);
  });

  it('two videos < 5 min apart → same session: internal gap + one nominal', () => {
    // 03:00:00 → 03:02:00 = 120 s intra + 30 s nominal = 150 s = 2.5 min → rounded 3 (Math.round).
    expect(
      runOn([watch('2026-06-01 03:00:00'), watch('2026-06-01 03:02:00')]).estimatedMinutes,
    ).toBe(3);
  });

  it('two videos > 5 min apart → two sessions: two nominals (not the gap)', () => {
    // 10:00:00 then 10:30:00 (30 min > 5 min) → 2 sessions × 30 s = 60 s = 1 min.
    expect(
      runOn([watch('2026-06-01 10:00:00'), watch('2026-06-01 10:30:00')]).estimatedMinutes,
    ).toBe(1);
  });

  it('any input order → the internal sort makes the result stable', () => {
    const asc = runOn([watch('2026-06-01 03:00:00'), watch('2026-06-01 03:02:00')]);
    const desc = runOn([watch('2026-06-01 03:02:00'), watch('2026-06-01 03:00:00')]);
    expect(asc.estimatedMinutes).toBe(desc.estimatedMinutes);
  });
});
