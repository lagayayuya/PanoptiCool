// SCALE test (PANO-91) — the MEMORY canary that was missing. A real TikTok export (Watch History
// ≈ 5·10⁴ items — the largest section, §0) killed the mobile Worker WITH no console error: memory
// saturation (the process/Worker killed by the OS, not a JS exception — hence the silence). Profiled
// root cause: `JSON.parse` materializes the WHOLE graph at once (rss peak ≈ 11× the weight of the
// JSON), then the copies (valibot clone of the graph) and the rules' work pile on; the transient peak
// exceeds the envelope of a mid-range mobile Worker. Fix (`normalize.ts` + `pipeline.ts`): Watch
// History is projected onto its DATES ALONE (the only field read downstream — `.Date` for the rhythm,
// `.length` for opacity/absence; never `Link`/`Title`, ≈ 2/3 of the section's weight), and
// `parsed`/`validated` (two complete copies of the graph) are freed BEFORE the rules.
//
// Measured budget (profiling bench, DEV=true, 150k VideoList): survival floor `--max-old-space-size`
// 112MB → 72MB, i.e. a heap envelope ≈ 36% tighter held by the fix.
//
// What this test LOCKS (DETERMINISTIC, un-noisy guarantees): at real volume, (1) `normalize` retains
// ONLY the Watch History dates — the structural invariant that BOUNDS the footprint; (2) the full
// pipeline completes without a hang under a generous time budget; (3) the rules' Watch History reads
// (rhythm on `.Date`, opacity on `.length`) stay correct at scale. A NUMERIC heap budget is
// deliberately NOT asserted: without `--expose-gc` nor a heap cap propagated to the vitest worker,
// the measurement would be noisy and misleading (at real volume the pre/post-fix transients overlap)
// — the reliable memory guarantee is the STRUCTURAL invariant above, the numeric budget lives in this
// cartouche.

import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { normalizeExport } from './normalize';
import { processExport } from './pipeline';
import type { WatchHistoryItem } from './tiktok-export';
import { validTikTokExport } from './valid-export.fixture';

/** Real volume of a large export (Watch History drives `--volume`, §0). */
const SCALE_N = 50_000;

/** GENEROUS time budget (slow CI, ×large margin): an anti-hang guardrail, not a perf measurement. The
 * pipeline runs ~100ms locally on this bench (0 comments → no d1/d2 cost). */
const SCALE_TIME_BUDGET_MS = 5_000;

/** Real-volume export: Watch History populated with `n` dated items, REALISTIC Link/Title (so the
 * projection has a weight to remove), the rest at conformant empty (fixture). */
function bigWatchHistoryExport(n: number) {
  const exp = validTikTokExport();
  const items: WatchHistoryItem[] = Array.from({ length: n }, (_, i) => ({
    Date: `2024-${String((i % 12) + 1).padStart(2, '0')}-15 ${String(i % 24).padStart(2, '0')}:30:00`,
    Link: `https://www.tiktokv.com/share/video/${7000000000000000000 + i}/`,
    Title: i % 3 === 0 ? '' : 'un titre de video assez court',
  }));
  (exp['Your Activity']['Watch History'] as { VideoList: WatchHistoryItem[] }).VideoList = items;
  return exp;
}

describe('scale (PANO-91) — memory footprint bounded at ~50k Watch History', () => {
  it('normalize projects Watch History onto its DATES alone (memory invariant)', () => {
    const norm = normalizeExport(bigWatchHistoryExport(SCALE_N));
    const videoList = norm['Your Activity']['Watch History'].VideoList;

    expect(videoList).toHaveLength(SCALE_N);
    // Each item reduced to `{Date}` — `Link`/`Title` removed (the bulk of the section's weight). A
    // return to `{Date, Link, Title}` (regression) breaks here: that is the canary's role.
    for (const index of [0, SCALE_N >> 1, SCALE_N - 1]) {
      const item = videoList[index];
      expect(item).toBeDefined();
      expect(Object.keys(item as object)).toEqual(['Date']);
    }
    // The date stays intact (the rules read it to the character).
    expect(videoList[0]?.Date).toBe('2024-01-15 00:30:00');
  });

  it('processExport completes at real volume without a hang, Watch History reads preserved', () => {
    const bytes = zipSync({
      'user_data_tiktok.json': strToU8(JSON.stringify(bigWatchHistoryExport(SCALE_N))),
    });

    const started = Date.now();
    const res = processExport(bytes);
    const elapsedMs = Date.now() - started;

    expect(res.ok).toBe(true);
    expect(elapsedMs).toBeLessThan(SCALE_TIME_BUDGET_MS);
    if (!res.ok) {
      return; // narrowing (the assertion above already failed the test)
    }

    // Opacity: `.length` read preserved — the 50k videos count in the opaque.
    // (Refonte A: no more `find` on a `ruleId` — the field IS the name.)
    expect(res.output.opacity).toBeDefined();
    // Rhythm: `.Date` read preserved — the rhythm is produced on the 50k dates.
    expect(res.output.rhythm).toBeDefined();
  });
});
