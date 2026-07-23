// Common harness of the register benches (PANO-35) — the measurement mechanics, without any data.
//
// The TWO benches (EN, FR) share their counting because the doctrine it applies is one:
// three ground-truth states, two counters that never add up together, and the wrong defined
// as « tagged non-carrier » (ADR-0003, *L'incertitude*). Copying this counting per language is
// manufacturing a delayed divergence — the day one of the two counted
// over-classification as a wrong, nothing would be comparable anymore.
//
// What stays SPECIFIC to each language lives in its test file: the frozen expectations, the
// comments that say what the measurement found, and the specific guards (the five terms
// removed on the EN side, the colloquial tier on the FR side). The harness has no opinion, it counts.

import { expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { detectLabels, type LabelDetection } from './detect';
import {
  type GroundTruth,
  type RegisterPersona,
  SENSITIVE_LABELS,
  type SensitiveLabel,
} from './register-bench';

/**
 * A detection reduced to stable, diff-readable lines:
 * `label[AGGREGATED storey] #item ITEM-storey surfaces`.
 *
 * BOTH storeys are carried, and this is not redundancy: the aggregated one decides the finding (named
 * or broad), the item one is where the degradation reads — 3rd person or informational
 * register. Keeping only one made the sensor blind to the storey rules, which are
 * nonetheless half of what these benches watch. Measured: without the item storey, removing a
 * `THIRD_PERSON_EN` marker did not make the bench go red.
 */
export function fingerprint(detections: readonly LabelDetection<SensitiveLabel>[]): string[] {
  return detections.flatMap((d) =>
    d.items.map(
      (it) => `${d.label}[${d.stage}] #${it.itemIndex} ${it.stage} ${it.surfaces.join('+')}`,
    ),
  );
}

export function detectFor(persona: RegisterPersona): LabelDetection<SensitiveLabel>[] {
  return detectLabels(
    persona.items.map((i) => i.text),
    WIRED_LEXICONS,
  ) as LabelDetection<SensitiveLabel>[];
}

export interface Cell {
  persona: RegisterPersona;
  label: SensitiveLabel;
  truth: GroundTruth;
  detection: LabelDetection<SensitiveLabel> | undefined;
}

export function allCells(personas: readonly RegisterPersona[]): Cell[] {
  const cells: Cell[] = [];
  for (const persona of personas) {
    const detections = detectFor(persona);
    for (const label of SENSITIVE_LABELS) {
      cells.push({
        persona,
        label,
        truth: persona.truth[label],
        detection: detections.find((d) => d.label === label),
      });
    }
  }
  return cells;
}

const key = (c: Cell) => `${c.persona.id}/${c.label}`;

/** An ASSUMED disagreement between the sealed ground truth and what the measurement showed. */
export interface AnnotatorCorrection {
  personaId: string;
  label: SensitiveLabel;
  sealed: GroundTruth;
  corrected: GroundTruth;
  why: string;
}

export interface BenchExpectations {
  /** Tagged non-carriers — the ONLY wrong counted. */
  torts: readonly string[];
  /** Signals without lived experience promoted to a NAMED finding: the tag is legitimate, the storey is not. */
  escalated: readonly string[];
  /** Declared annotator corrections — they relax no expectation, they publish a
   *  second figure alongside the first. */
  corrections: readonly AnnotatorCorrection[];
  /** Wrongs remaining once the declared corrections are applied. */
  tortsAfterCorrection: readonly string[];
  /**
   * The lived experiences NOT tagged, declared one by one — a recall defect we publish rather than
   * hide behind a rewritten ground truth.
   *
   * Optional, and the default is the strictest (`[]`, i.e. « no missed recall »): a bench that
   * omits the field therefore keeps exactly the assertion it had before this field existed. Added
   * because a hardcoded `[]` forbade sealing a lived experience on a label that English has nothing to
   * detect — the only way out would have been to degrade the seal to arrange the green, that is,
   * the exact reverse of what these benches protect.
   */
  missedRecall?: readonly string[];
  /**
   * The signals WITHOUT lived experience not tagged, declared one by one — the exact counterpart of `missedRecall` on
   * the other counter, and the same strictest default (`[]`).
   *
   * Added for the same reason, and it arose twice: a hardcoded `[]` forbade
   * sealing a caring relative on a label that English has nothing to detect. The only way out would
   * have been to degrade the seal to arrange the green — the exact reverse of what these benches protect.
   */
  missedSignal?: readonly string[];
  /**
   * The EXPECTED storey for each `lived` persona, by identifier.
   *
   * Parameterized, and not fixed to `explicit`, because **lived and named are two distinct axes**.
   * ADR-0003 (*Le mécanisme*) lays down the hard rule: a precise finding appears ONLY if the precise
   * term is present. A genuinely distressed person who writes no clinical term must
   * therefore produce a **broad** finding — naming them would be the violation, not the service. Writing
   * `lived ⇒ explicit` in the harness merged the two axes and would have forbidden adding the
   * voice that does not name itself.
   *
   * `AUCUN` is the third possible storey, and it is not a convenience: it is a lived experience that nothing
   * tagged. It is declared HERE **and** in `missedRecall` — twice, by design, because a
   * missed recall must cost two lines to write and be visible in both reviews.
   */
  livedStages: Readonly<Record<string, 'explicit' | 'indirect' | 'AUCUN'>>;
}

/**
 * Emits the common counting. Called INSIDE a language-specific `describe`.
 *
 * The expectations are passed as a parameter rather than computed: a bench that derived its own
 * expectation from the current output would measure nothing. These are recorded values, then frozen.
 */
export function expectBenchCounts(
  personas: readonly RegisterPersona[],
  expectations: BenchExpectations,
): void {
  const cells = allCells(personas);

  it('WRONG — a tagged non-carrier, and nothing else is counted here', () => {
    const torts = cells.filter((c) => c.truth === 'nonCarrier' && c.detection !== undefined);
    expect(torts.map(key)).toEqual(expectations.torts);
  });

  it('RECALL — the lived experience is indeed tagged (without which the zeros would prove nothing)', () => {
    const missed = cells.filter((c) => c.truth === 'lived' && c.detection === undefined);
    expect(missed.map(key)).toEqual(expectations.missedRecall ?? []);
  });

  it('SIGNAL WITHOUT LIVED EXPERIENCE — tagged as expected: it is the demonstration, not a wrong', () => {
    const untagged = cells.filter(
      (c) => c.truth === 'signalWithoutLived' && c.detection === undefined,
    );
    expect(untagged.map(key)).toEqual(expectations.missedSignal ?? []);
  });

  it('OVER-CLASSIFICATION — a signal without lived experience promoted to a NAMED finding', () => {
    // The wrong specific to this state: the tag is legitimate, the STOREY is not. A named finding carries
    // high confidence and the quasi-factual (« tu as écrit ce terme »).
    const escalated = cells.filter(
      (c) => c.truth === 'signalWithoutLived' && c.detection?.stage === 'explicit',
    );
    expect(escalated.map(key)).toEqual(expectations.escalated);
  });

  it('LIVED — the true-positive storey holds, and it is the stopping criterion of the storey rules', () => {
    // Written as a separate assertion, and not as a corollary of recall: a storey rule
    // too broad does not make the finding disappear, it lowers it — so the recall counter
    // would stay green while the true positive lost its storey. This is precisely the failure
    // mode that led to setting aside the 1st-person anchoring (ADR-0003, *Le registre informationnel*).
    //
    // The expected storey comes from the table, never from a presumed `explicit`: the one who lives the thing without
    // ever naming it must stay BROAD, and an `explicit` on her would be a named finding
    // fabricated without a term — the exact reverse of what we watch.
    const observed: Record<string, string> = {};
    for (const c of cells.filter((x) => x.truth === 'lived')) {
      observed[key(c)] = c.detection?.stage ?? 'AUCUN';
    }
    // The expected key is built from the persona's actually `lived` LABEL, never from
    // hardcoded `mental_health`: the two benches for now have only mental-health lived experiences,
    // and a constant would suffice — until the first lived persona on another label, where the
    // comparison would bear on a key that does not exist and where the guard would go green without
    // checking anything. A guard that can go silent is not one.
    const attendu: Record<string, string> = {};
    for (const [id, stage] of Object.entries(expectations.livedStages)) {
      const cell = cells.find((c) => c.persona.id === id && c.truth === 'lived');
      if (cell === undefined) {
        throw new Error(`\`livedStages\` cite \`${id}\`, qui n'a aucun label \`lived\``);
      }
      attendu[key(cell)] = stage;
    }
    expect(observed).toEqual(attendu);
  });

  it('the annotation correction is declared, and it relaxes no expectation', () => {
    for (const correction of expectations.corrections) {
      const persona = personas.find((p) => p.id === correction.personaId);
      // The seal must be INTACT: if the ground truth had been rewritten to arrange the
      // figure, this is where it would show.
      expect(persona?.truth[correction.label]).toBe(correction.sealed);
      expect(correction.corrected).not.toBe(correction.sealed);
    }
    const remaining = cells.filter(
      (c) =>
        c.truth === 'nonCarrier' &&
        c.detection !== undefined &&
        !expectations.corrections.some((k) => k.personaId === c.persona.id && k.label === c.label),
    );
    expect(remaining.map(key)).toEqual(expectations.tortsAfterCorrection);
  });
}
