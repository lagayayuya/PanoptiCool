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
  COVERING_PHRASES_EN,
  INFORMATIONAL_EN,
  INFORMATIONAL_SUFFIXES_EN,
  NEGATIONS_EN,
  OMISSION_VERBS_EN,
  SELF_DECLARATION_MODIFIERS_EN,
  THIRD_PERSON_EN,
} from './filters-en';
import {
  CITATION_MARKERS as CITATION_MARKERS_FR,
  INFORMATIONAL as INFORMATIONAL_FR,
  NEGATIONS as NEGATIONS_FR,
  OMISSION_VERBS as OMISSION_VERBS_FR,
  SELF_DECLARATION_MODIFIERS as SELF_DECLARATION_MODIFIERS_FR,
  THIRD_PERSON as THIRD_PERSON_FR,
} from './filters-fr';

export { SELF_DECLARATION_HEADS_EN } from './filters-en';
export {
  NEGATION_WINDOW,
  // FR seulement, et le nom le dit : la construction subordonnée par « si » est française. L'anglais
  // rapporte ses questions autrement (« they ask if/whether »), et rien de ce lot ne le couvre —
  // l'auto-déclaration anglaise n'atteignant de toute façon jamais l'étage nommé, il n'y aurait rien
  // à y dégrader.
  REPORTED_QUESTION_VERBS as REPORTED_QUESTION_VERBS_FR,
  SELF_DECLARATION_HEADS_FR,
} from './filters-fr';

/**
 * Modificateurs d'auto-déclaration, toutes langues.
 *
 * COMPOSÉS, là où les TÊTES restent appariées par langue — et l'asymétrie est délibérée. Une tête
 * ouvre l'accès à une liste de TERMES : les mélanger défait la porte de langue (mesuré, PANO-35).
 * Un modificateur, lui, n'atteint aucun terme sans une tête de sa propre langue : « i am vrai gay »
 * et « je suis a gay » ne sont d'aucune des deux langues, et le couple (têtes, termes) reste
 * apparié au site d'appel dans `detect.ts`, là où un lecteur le vérifie.
 *
 * Les modificateurs ne portent AUCUNE charge de sûreté — arbitrage 2026-07-18, et désormais mesuré
 * plutôt que raisonné (`filters-en.ts`, *la copule ne désambiguïse pas*). Mesuré aussi : la
 * composition ne déplace aucun compteur des bancs français.
 */
export const SELF_DECLARATION_MODIFIERS: readonly string[] = [
  ...SELF_DECLARATION_MODIFIERS_FR,
  ...SELF_DECLARATION_MODIFIERS_EN,
];

/** Négations, toutes langues (fenêtre AVANT le marqueur). */
export const NEGATIONS: readonly string[] = [...NEGATIONS_FR, ...NEGATIONS_EN];

/** Verbes d'omission, toutes langues (double négation = affirmation). */
export const OMISSION_VERBS: readonly string[] = [...OMISSION_VERBS_FR, ...OMISSION_VERBS_EN];

/** Marqueurs de discours rapporté, toutes langues. */
export const CITATION_MARKERS: readonly string[] = [...CITATION_MARKERS_FR, ...CITATION_MARKERS_EN];

/** Marqueurs de 3ᵉ personne, toutes langues (dégradent en indirect, ne suppriment jamais). */
export const THIRD_PERSON: readonly string[] = [...THIRD_PERSON_FR, ...THIRD_PERSON_EN];

/**
 * Marqueurs de registre INFORMATIONNEL, toutes langues. Comme la 3ᵉ personne, ils dégradent en
 * indirect et ne suppriment jamais — mais pour une raison distincte, et les deux listes restent
 * séparées à ce titre : la 3ᵉ personne dit POUR QUI vaut le signal, le registre informationnel dit
 * SOUS QUELLE FORME il est écrit. Un item peut porter les deux, ou l'un sans l'autre.
 */
export const INFORMATIONAL: readonly string[] = [...INFORMATIONAL_FR, ...INFORMATIONAL_EN];

/**
 * Têtes de COMPOSÉ du registre informationnel, toutes langues — elles ne comptent qu'APRÈS un terme
 * du lexique (« diabetes symptoms »), jamais seules (« my symptoms » reste intact).
 *
 * EN seulement à ce jour, et ce n'est pas un oubli : le français n'a pas ce défaut (il porte
 * « symptomes » nu, et ses deux ordres de mots dégradent déjà). La composition reste écrite comme
 * les autres pour que l'ajout d'une langue reste une ligne — la justification par langue vit dans
 * `filters-en.ts`.
 */
export const INFORMATIONAL_SUFFIXES: readonly string[] = [...INFORMATIONAL_SUFFIXES_EN];

/**
 * Locutions COUVRANTES, toutes langues — un marqueur strictement contenu dans l'une d'elles ne
 * compte pas (« therapy » dans « occupational therapy »). EN seulement à ce jour ; la
 * justification par langue vit dans `filters-en.ts`.
 */
export const COVERING_PHRASES: readonly string[] = [...COVERING_PHRASES_EN];
