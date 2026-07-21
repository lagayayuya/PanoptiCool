// Vocabulaire partagé des bancs de registres (PANO-35) — les TYPES et la vérité-terrain, sans
// aucune donnée de persona. Les voix vivent dans `en-registers.fixture.ts` et
// `fr-registers.fixture.ts`, chacune scellée par son propre commit.
//
// Ce module est né de l'extraction des déclarations du banc EN, au moment d'ouvrir le banc FR :
// aucune valeur de vérité-terrain n'a bougé, seules les déclarations ont changé de maison. Le
// sceau EN garde donc son sens — ce qu'il figeait, ce sont des états, pas des interfaces.

/** Les six labels sensibles (ADR-0003). Réécrits ici, sans dépendre de `lexicon/` : un banc qui
 *  importerait le module qu'il mesure serait un banc qui a regardé. */
export type SensitiveLabel =
  | 'health_physical'
  | 'mental_health'
  | 'sexuality'
  | 'politics'
  | 'religion'
  | 'conflictual';

export const SENSITIVE_LABELS: readonly SensitiveLabel[] = [
  'health_physical',
  'mental_health',
  'sexuality',
  'politics',
  'religion',
  'conflictual',
];

/**
 * Les trois états de vérité-terrain d'ADR-0003 (*L'incertitude*), et ce qu'ils imposent au compteur.
 *
 * - `lived` — la personne est concernée. Un tag est ATTENDU ; son absence est un défaut de rappel.
 * - `signalWithoutLived` — le signal est RÉEL mais ne porte pas sur la personne (le proche, le
 *   professionnel). Un tag est ATTENDU AUSSI, et **ce n'est pas un faux positif** : c'est
 *   exactement ce qu'une plateforme ferait, et le montrer est le propos du produit. Le tort ici
 *   n'est pas d'être tagué, c'est d'être **sur-classé** — un constat nommé, de haute confiance, là
 *   où seul un constat large est justifié.
 * - `nonCarrier` — aucun signal réel, seulement du texte qui en a la forme (hyperbole, métaphore,
 *   homographie). Un tag est un **tort**, et c'est le seul tort à compter.
 *
 * Les deux compteurs ne s'additionnent jamais : le volume `signalWithoutLived` est voulu HAUT, le
 * tort est voulu BAS.
 */
export type GroundTruth = 'lived' | 'signalWithoutLived' | 'nonCarrier';

export interface BenchItem {
  readonly kind: 'comment' | 'search';
  readonly text: string;
}

export interface RegisterPersona {
  /** Identifiant stable — sert de clé dans les attendus du banc. */
  readonly id: string;
  /** Le registre isolé par cette voix, en une ligne : ce que la persona fait VARIER. */
  readonly register: string;
  /** Qui est cette personne. Prose, écrite à l'écriture — la part auditable par un tiers. */
  readonly who: string;
  /** Vérité-terrain par label, écrite AVANT toute mesure. */
  readonly truth: Readonly<Record<SensitiveLabel, GroundTruth>>;
  /** Pourquoi ces états, y compris les appels contestables. Écrit à l'écriture, jamais après. */
  readonly truthNotes: string;
  readonly items: readonly BenchItem[];
}

/** Raccourci : tout `nonCarrier`, puis surcharge des labels concernés. */
export function allNonCarrier(
  overrides: Partial<Record<SensitiveLabel, GroundTruth>> = {},
): Record<SensitiveLabel, GroundTruth> {
  return {
    health_physical: 'nonCarrier',
    mental_health: 'nonCarrier',
    sexuality: 'nonCarrier',
    politics: 'nonCarrier',
    religion: 'nonCarrier',
    conflictual: 'nonCarrier',
    ...overrides,
  };
}
