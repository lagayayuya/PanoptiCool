// Shared vocabulary of the register benches (PANO-35) — the TYPES and the ground truth, without
// any persona data. The voices live in `en-registers.fixture.ts` and
// `fr-registers.fixture.ts`, each sealed by its own commit.
//
// This module was born from extracting the declarations of the EN bench, at the time of opening the FR bench:
// no ground-truth value moved, only the declarations changed house. The
// EN seal therefore keeps its meaning — what it froze are states, not interfaces.

/** The six sensitive labels (ADR-0003). Rewritten here, without depending on `lexicon/`: a bench that
 *  imported the module it measures would be a bench that has looked. */
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
 * The three ground-truth states of ADR-0003 (*L'incertitude*), and what they impose on the counter.
 *
 * - `lived` — the person is concerned. A tag is EXPECTED; its absence is a recall defect.
 * - `signalWithoutLived` — the signal is REAL but does not bear on the person (the relative, the
 *   professional). A tag is EXPECTED TOO, and **it is not a false positive**: it is
 *   exactly what a platform would do, and showing it is the product's purpose. The wrong here
 *   is not to be tagged, it is to be **over-classified** — a named, high-confidence finding, where
 *   only a broad finding is justified.
 * - `nonCarrier` — no real signal, only text that has the form of it (hyperbole, metaphor,
 *   homography). A tag is a **wrong**, and it is the only wrong to count.
 *
 * The two counters never add up together: the `signalWithoutLived` volume is meant HIGH, the
 * wrong is meant LOW.
 */
export type GroundTruth = 'lived' | 'signalWithoutLived' | 'nonCarrier';

export interface BenchItem {
  readonly kind: 'comment' | 'search';
  readonly text: string;
}

export interface RegisterPersona {
  /** Stable identifier — serves as key in the bench expectations. */
  readonly id: string;
  /** The register isolated by this voice, in one line: what the persona makes VARY. */
  readonly register: string;
  /** Who this person is. Prose, written at writing time — the part auditable by a third party. */
  readonly who: string;
  /** Ground truth per label, written BEFORE any measurement. */
  readonly truth: Readonly<Record<SensitiveLabel, GroundTruth>>;
  /** Why these states, including the contestable calls. Written at writing time, never after. */
  readonly truthNotes: string;
  readonly items: readonly BenchItem[];
}

/** Shortcut: all `nonCarrier`, then override the labels concerned. */
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
