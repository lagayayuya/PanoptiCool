// Volumes de l'export — les 4 compteurs + les 2 totaux all-time (→ `VolumesCard`).
//
// REMPLACE R1/R2/R3/R5 (Refonte A, lot A1). Ces 4 « règles » émettaient chacune un `Insight`
// `inferred` complet : `ruleId`, `claim`, `framing`, `confidence` scorée, `sampleSignals` verbatim.
// Mesuré sur l'écran (méthode ADR-0004) : la carte de volumes ne lit QUE `signalCount`
// — elle porte ses propres libellés (« recherches tapées »…) et son propre ordre d'affichage. Le
// claim, le framing, la confiance et l'échantillon verbatim n'avaient AUCUN lecteur. Ce qui restait
// de chaque règle, une fois retiré ce que personne ne lit, est un `.length`.
//
// C'est §2.3 rendu concret : `ACTIVITY_PANEL_RULE_IDS = {R1, R2, R3, R5}` — le `Set` par lequel l'UI
// re-devinait quelles règles alimentaient le panneau — disparaît, parce que le champ EST le nom.
// Quatre fichiers de règle + quatre registres + un dispatch, remplacés par quatre champs nommés.
//
// Le seuil de confiance par volume (`*_MEDIUM_VOLUME_THRESHOLD = 10`) part avec la confiance : il ne
// gradue plus rien qui s'affiche. Il n'est pas jugé sans valeur — il a perdu son lecteur ; s'il
// revient, il reviendra CONÇU ET RENDU (même doctrine que E8/E9/E10 au LOT B2).

import { readActivitySummary } from '../activity-summary';
import type { Volumes } from '../analysis';
import type { NormalizedExport } from '../normalize';

/** Sections sources des volumes (contrat §4) — conservées : elles documentent d'où vient chaque
 *  compteur, seule information de provenance que portaient les ex-`R*_SECTION_PATH`. */
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
 * Compte les volumes de l'export. Chaque champ est OMIS quand sa source est vide — même sémantique
 * que le `[]` des ex-règles (« rien à montrer » ≠ « zéro »), et c'est ce que la carte attend pour ne
 * pas afficher une tuile à 0.
 *
 * `endorsements` agrège likes + favoris + reposts en UN compteur (comme R5) : la carte n'affiche
 * qu'une tuile « likes, favoris et republications ». Fenêtre ≈ 1 an pour les 4 compteurs, ALL-TIME
 * pour `allTime` — JAMAIS mélangées (PANO-84).
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
    // Totaux FACTUELS ALL-TIME : lecteur à part, jamais une « règle » (aucune inférence).
    allTime: readActivitySummary(input),
  };
}
