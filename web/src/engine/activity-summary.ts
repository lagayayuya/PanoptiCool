// Factual reader — Activity Summary (PANO-84). Distinct from the `Rule` rules (`rules/*.ts`): not an
// `Insight` producer (no inference, no `claim`/`framing`), just a source-projection of two ALL-TIME
// counters (contract §"Your Activity"/Activity Summary) into the engine's `Analysis`.
//
// Window distinct from R1/R2/R3/R5 (≈ 1 year, bounded by the export): these two counters are "since
// account registration", never mixed with the wording of the `inferred` rules. The distinction is
// visible at display — `ui/v2/ActivitySection.tsx` (`VolumesCard`) labels each window separately
// (PANO-84), and that is where the mix would show if it came back.
//
// `videosCommentedOnSinceAccountRegistration` is NOT picked up here: R2 (comment-topics) already
// covers comments, on its own window (~1 year) — an all-time duplicate would sustain the very window
// confusion this reader exists to avoid.

import type { NormalizedExport } from './normalize';

export interface ActivitySummaryTotals {
  /** `videosSharedSinceAccountRegistration` — videos shared, ALL-TIME. */
  videosShared: number;
  /** `videosWatchedToTheEndSinceAccountRegistration` — videos watched to the end, ALL-TIME. */
  videosWatchedToEnd: number;
}

/** Pure source-projection of the two all-time counters of Activity Summary. */
export function readActivitySummary(input: NormalizedExport): ActivitySummaryTotals {
  const map = input['Your Activity']['Activity Summary'].ActivitySummaryMap;
  return {
    videosShared: map.videosSharedSinceAccountRegistration,
    videosWatchedToEnd: map.videosWatchedToTheEndSinceAccountRegistration,
  };
}
