// Export volumes — the 4 counters + the 2 all-time totals (→ `VolumesCard`).
//
// REPLACES R1/R2/R3/R5 (Refonte A, batch A1). These 4 "rules" each emitted a complete `inferred`
// `Insight`: `ruleId`, `claim`, `framing`, scored `confidence`, verbatim `sampleSignals`. Measured
// on the screen (ADR-0004 method): the volumes card reads ONLY `signalCount` — it carries its own
// labels ("typed searches"…) and its own display order. The claim, the framing, the confidence and
// the verbatim sample had NO reader. What remained of each rule, once what no one reads was removed,
// is a `.length`.
//
// This is §2.3 made concrete: `ACTIVITY_PANEL_RULE_IDS = {R1, R2, R3, R5}` — the `Set` by which the
// UI re-guessed which rules fed the panel — disappears, because the field IS the name. Four rule
// files + four registries + one dispatch, replaced by four named fields.
//
// The per-volume confidence threshold (`*_MEDIUM_VOLUME_THRESHOLD = 10`) leaves with the confidence:
// it no longer grades anything that displays. It is not judged worthless — it lost its reader; if it
// returns, it will return DESIGNED AND RENDERED (same doctrine as E8/E9/E10 in BATCH B2).

import { readActivitySummary } from '../activity-summary';
import type { Volumes } from '../analysis';
import type { NormalizedExport } from '../normalize';

/** Source sections of the volumes (contract §4) — kept: they document where each counter comes from,
 *  the only provenance information the ex-`R*_SECTION_PATH` carried. */
export const VOLUME_SECTION_PATHS = {
  searches: 'Your Activity/Searches',
  comments: 'Comment/Comments',
  follows: 'Profile And Settings/Following',
  endorsements: [
    'Likes and Favorites/Like List',
    'Likes and Favorites/Favorite Videos',
    'Your Activity/Reposts',
  ],
  allTime: 'Your Activity/Activity Summary',
} as const;

/**
 * Counts the export's volumes. Each field is OMITTED when its source is empty — same semantics as
 * the ex-rules' `[]` ("nothing to show" ≠ "zero"), and it is what the card expects so as not to
 * display a tile at 0.
 *
 * `endorsements` aggregates likes + favorites + reposts into ONE counter (like R5): the card shows
 * only a "likes, favorites and reposts" tile. Window ≈ 1 year for the 4 counters, ALL-TIME for
 * `allTime` — NEVER mixed (PANO-84).
 */
export function readVolumes(input: NormalizedExport): Volumes {
  const searches = input['Your Activity'].Searches.SearchList.length;
  const comments = input.Comment.Comments.CommentsList.length;
  const follows = input['Profile And Settings'].Following.Following.length;
  const endorsements =
    input['Likes and Favorites']['Like List'].ItemFavoriteList.length +
    input['Likes and Favorites']['Favorite Videos'].FavoriteVideoList.length +
    input['Your Activity'].Reposts.RepostList.length;

  return {
    ...(searches > 0 ? { searches } : {}),
    ...(comments > 0 ? { comments } : {}),
    ...(follows > 0 ? { follows } : {}),
    ...(endorsements > 0 ? { endorsements } : {}),
    // FACTUAL ALL-TIME totals: a reader apart, never a "rule" (no inference).
    allTime: readActivitySummary(input),
  };
}
