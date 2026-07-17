// Mur sémantique (PANO-6) — l'asymétrie de lisibilité, en comptes (→ `AnalyzableShareCard`).
//
// Lot A1 : rend `Opacity | undefined` au lieu d'un `Insight[]` à un élément. Le `claim` n'est plus
// porté par le constat — son texte est CONSTANT (aucun param n'y entrait) : l'UI l'appelle
// directement (`opacitySemanticWallClaim()`), comme elle appelait déjà l'explainer en dur. Le
// `framing` part (jamais rendu depuis PANO-56) ; la confiance `factual` part avec l'union
// `Confidence` — le factuel n'est plus un constat, c'est une donnée nommée.

import type { Opacity } from '../analysis';
import type { NormalizedExport } from '../normalize';

/** Items auto-décrits hors-ligne (texte lisible sans réseau). */
export const OPACITY_READABLE_SECTION_PATHS = [
  'Your Activity/Searches',
  'Comment/Comments',
] as const;

/** Items opaques (liens muets, illisibles sans réseau). */
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
 * Compte lisible vs opaque. `undefined` quand il n'y a AUCUN item opaque : sans opacité, le mur
 * sémantique n'a rien à montrer (le donut serait plein, un constat vide). Même condition qu'avant
 * (`opaqueCount === 0` ⇒ `[]`), pour que le rendu ne bouge pas.
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
