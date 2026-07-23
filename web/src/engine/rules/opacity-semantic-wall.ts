// Semantic wall (PANO-6) — the readability asymmetry, in counts (→ `AnalyzableShareCard`).
//
// Batch A1: returns `Opacity | undefined` instead of a one-element `Insight[]`. The `claim` is no
// longer carried by the finding — its text is CONSTANT (no param entered it): the UI calls it
// directly (`opacitySemanticWallClaim()`), as it already called the explainer hardcoded. The
// `framing` leaves (never rendered since PANO-56); the `factual` confidence leaves with the
// `Confidence` union — the factual is no longer a finding, it is a named datum.

import type { Opacity } from '../analysis';
import type { NormalizedExport } from '../normalize';

/** Items self-described offline (text readable without the network). */
export const OPACITY_READABLE_SECTION_PATHS = [
  'Your Activity/Searches',
  'Comment/Comments',
] as const;

/** Opaque items (mute links, unreadable without the network). */
export const OPACITY_OPAQUE_SECTION_PATHS = [
  'Your Activity/Watch History',
  'Likes and Favorites/Like List',
  'Likes and Favorites/Favorite Videos',
  'Your Activity/Reposts',
] as const;

export const OPACITY_SECTION_PATHS = [
  ...OPACITY_READABLE_SECTION_PATHS,
  ...OPACITY_OPAQUE_SECTION_PATHS,
] as const;

/**
 * Readable vs opaque count. `undefined` when there is NO opaque item: without opacity, the semantic
 * wall has nothing to show (the donut would be full, a finding empty). Same condition as before
 * (`opaqueCount === 0` ⇒ `[]`), so the render does not move.
 */
export function readOpacity(input: NormalizedExport): Opacity | undefined {
  const readableCount =
    input['Your Activity'].Searches.SearchList.length + input.Comment.Comments.CommentsList.length;
  const opaqueCount =
    input['Your Activity']['Watch History'].VideoList.length +
    input['Likes and Favorites']['Like List'].ItemFavoriteList.length +
    input['Likes and Favorites']['Favorite Videos'].FavoriteVideoList.length +
    input['Your Activity'].Reposts.RepostList.length;
  if (opaqueCount === 0) {
    return undefined;
  }
  return { readableCount, opaqueCount };
}
