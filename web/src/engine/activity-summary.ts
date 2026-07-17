// Lecteur factuel — Activity Summary (PANO-84). Distinct des règles `Rule` (`rules/*.ts`) : pas un
// producteur d'`Insight` (aucune inférence, aucun `claim`/`framing`), juste une projection-source de
// deux compteurs ALL-TIME (contrat §« Your Activity »/Activity Summary) vers `EngineOutput`.
//
// Fenêtre distincte de R1/R2/R3/R5 (≈ 1 an, bornée par l'export) : ces deux compteurs sont
// « depuis l'inscription au compte », jamais mélangés au wording des règles `inferred`. La
// distinction se voit à l'affichage — `ui/v2/ActivitySection.tsx` (`VolumesCard`) étiquette chaque
// fenêtre séparément (PANO-84), et c'est là que le mélange se verrait s'il revenait.
//
// `videosCommentedOnSinceAccountRegistration` n'est PAS repris ici : R2 (comment-topics) couvre déjà
// les commentaires, sur sa propre fenêtre (~1 an) — un doublon all-time entretiendrait la confusion
// de fenêtre que ce lecteur existe justement pour éviter.

import type { NormalizedExport } from './normalize';

export interface ActivitySummaryTotals {
  /** `videosSharedSinceAccountRegistration` — vidéos partagées, ALL-TIME. */
  videosShared: number;
  /** `videosWatchedToTheEndSinceAccountRegistration` — vidéos vues jusqu'au bout, ALL-TIME. */
  videosWatchedToEnd: number;
}

/** Projection-source pure des deux compteurs all-time d'Activity Summary. */
export function readActivitySummary(input: NormalizedExport): ActivitySummaryTotals {
  const map = input['Your Activity']['Activity Summary'].ActivitySummaryMap;
  return {
    videosShared: map.videosSharedSinceAccountRegistration,
    videosWatchedToEnd: map.videosWatchedToTheEndSinceAccountRegistration,
  };
}
