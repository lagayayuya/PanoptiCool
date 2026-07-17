// Filtres contextuels de la machinerie — composition FR + EN (PANO-35, lot 1).
//
// `detect.ts` consomme CE module, jamais `filters-fr` / `filters-en` directement : la machinerie ne
// doit pas savoir combien de langues existent, et une langue de plus = un module de données de plus
// + une ligne ici. Les listes par langue restent lisibles et révisables SÉPARÉMENT (chacune porte sa
// justification de généricité) ; seule la composition vit ici.
//
// ── PAS de détection de langue — et c'est un choix, pas un raccourci ───────────────────────────
// Les listes des deux langues sont appliquées à TOUS les items. Raison : les trois filtres
// PROTECTEURS (négation, citation, 3ᵉ personne) échouent CLOSED — au pire, un mot d'une langue
// présent dans l'autre coûte du RAPPEL, jamais de la précision sur le sensible. Un détecteur de
// langue, lui, introduirait une nouvelle source de faux positifs (les items sont courts : une
// recherche de trois mots n'a pas de langue fiable) pour un gain nul dans la direction sûre.
// Le comportement FR est verrouillé par ses goldens (`detect.test.ts`), inchangés par cette
// composition.
//
// `NEGATION_WINDOW` reste PARTAGÉE (3 tokens, mesurée PANO-33 sur le FR) : la négation EN se place
// devant le marqueur comme en FR (« not in depression » ≡ « pas de dépression »), la fenêtre se
// transporte. À re-mesurer si un jour un corpus EN le contredit.

import {
  CITATION_MARKERS_EN,
  NEGATIONS_EN,
  OMISSION_VERBS_EN,
  THIRD_PERSON_EN,
} from './filters-en';
import {
  CITATION_MARKERS as CITATION_MARKERS_FR,
  NEGATIONS as NEGATIONS_FR,
  OMISSION_VERBS as OMISSION_VERBS_FR,
  THIRD_PERSON as THIRD_PERSON_FR,
} from './filters-fr';

export { NEGATION_WINDOW, SELF_DECLARATION_HEADS, SELF_DECLARATION_MODIFIERS } from './filters-fr';

/** Négations, toutes langues (fenêtre AVANT le marqueur). */
export const NEGATIONS: readonly string[] = [...NEGATIONS_FR, ...NEGATIONS_EN];

/** Verbes d'omission, toutes langues (double négation = affirmation). */
export const OMISSION_VERBS: readonly string[] = [...OMISSION_VERBS_FR, ...OMISSION_VERBS_EN];

/** Marqueurs de discours rapporté, toutes langues. */
export const CITATION_MARKERS: readonly string[] = [...CITATION_MARKERS_FR, ...CITATION_MARKERS_EN];

/** Marqueurs de 3ᵉ personne, toutes langues (dégradent en indirect, ne suppriment jamais). */
export const THIRD_PERSON: readonly string[] = [...THIRD_PERSON_FR, ...THIRD_PERSON_EN];
