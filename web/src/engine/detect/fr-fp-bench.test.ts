// FR false-positive bench — the SENSOR (PANO-35). Personas and ground truth in
// `fr-registers.fixture.ts`, sealed BEFORE the design of the informational-register rule:
// on the French side, the measurement is therefore PREDICTIVE, where the English one was confirmatory (I already
// knew the items I wanted to see degrade). The counting is shared with the EN bench.
//
// ── Why this bench exists ──────────────────────────────────────────────────────────────────────
// An anglophone measurement found a MACHINERY defect, hence language-independent. Correcting it
// changed the FR behavior in production — and running an unmeasured French modification
// on an English measurement would have been exactly the shortcut these benches exist to
// forbid.
//
// ── What this bench found, and which was not commissioned ─────────────────────────────────────────
// The FR colloquial tier carries the SAME hyperbole defect as the one that led to removing five EN terms
// — on a lexicon ratified long ago (PANO-33), this one. See `fr_hyperbolic` below: it is an
// open result, not a regression of this batch, and it is not settled here.

import { describe, expect, it } from 'vitest';
import { FR_REGISTER_PERSONAS } from './fr-registers.fixture';
import { detectFor, expectBenchCounts, fingerprint } from './register-bench.harness';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// THE FROZEN EXPECTATION — recorded 2026-07-18, at null diff
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const EXPECTED: Readonly<Record<string, readonly string[]>> = {
  // The witness fires nothing — including on « difference entre creme fraiche et creme liquide »,
  // which carries an informational-register marker without any sensitive term. It is the guard
  // written in the seal: a STOREY rule cannot CREATE a finding, it only lowers
  // the one that existed. If this list ever populates, the rule has changed nature.
  fr_plain: [],

  // UNCOMMISSIONED RESULT, AND THE HEAVIEST OF THIS BATCH. Six formulations of the FR colloquial tier
  // fire on a young woman talking about a comeback, macarons and a queue.
  // It is the exact defect that led to removing five EN terms — but here on a lexicon ratified
  // PANO-33, calibrated against POLYSEMY and never against hyperbole.
  //
  // Nothing is removed here: FR is the production language, these terms carry real recall
  // (« au bout de ma vie » is also real distress), and the arbitration belongs to the maintainer.
  // The bench FREEZES it so the question does not get lost again.
  fr_hyperbolic: [
    "mental_health[indirect] #2 indirect j'en peux plus",
    'mental_health[indirect] #4 indirect au bout de ma vie',
    'mental_health[indirect] #6 indirect je craque',
    'mental_health[indirect] #16 indirect a plat',
    'mental_health[indirect] #20 indirect je sature',
    'mental_health[indirect] #22 indirect cafard',
  ],

  // The true positive, and the GUARD of the storey rule. Its finding stays NAMED (#17, « groupe de
  // parole anxiete en ligne » — a request for help for oneself, neither interrogative nor possessive). The
  // stopping criterion was written in the seal before the measurement: if this persona lost its named
  // storey, the rule would be too broad. It did not lose it.
  fr_distress: [
    'mental_health[explicit] #1 indirect psychologue',
    'mental_health[explicit] #7 indirect sertraline',
    'mental_health[explicit] #11 indirect psychologue',
    'mental_health[explicit] #17 explicit anxiete',
    'mental_health[explicit] #20 indirect therapie',
    'mental_health[explicit] #22 indirect psychologue+psychiatre',
  ],

  // THE PRODUCTION BUG, CLOSED. Before this batch, #1 (« signes de depression chez l'adolescent ») and #3
  // (« symptomes depression ado que faire ») were EXPLICIT: a NAMED finding placed on a father
  // who is fine, because neither of these two searches carries a possessive. Both are
  // now degraded, and the aggregated finding is BROAD — the tag remains (signal without lived experience: tagging
  // those around IS the demonstration), the assertion falls.
  fr_caregiver: [
    'mental_health[indirect] #1 indirect depression',
    'mental_health[indirect] #3 indirect depression',
    'mental_health[indirect] #4 indirect psychologue',
    'mental_health[indirect] #11 indirect therapie',
    'mental_health[indirect] #17 indirect psychologue',
    'mental_health[indirect] #21 indirect antidepresseurs',
  ],

  // THE VOICE THAT DECIDES THE FATE OF THE SIX. Real distress, without care, without a named condition: five
  // hits, all from the colloquial register. Its storey is BROAD and must stay so — she writes no
  // clinical term, so a named finding on her would be fabricated without a term (ADR-0003: the fine-grained
  // exists only if it is written). Four of her five hits are among the six under examination; the
  // fifth, « au fond du trou », is colloquial but outside the six — and alone, it falls below the
  // threshold. It is what makes her DISAPPEAR on removal, measured in `fr-colloquial-ablation`.
  fr_distress_colloquial: [
    "mental_health[indirect] #0 indirect j'en peux plus",
    'mental_health[indirect] #4 indirect a plat',
    'mental_health[indirect] #10 indirect je craque',
    'mental_health[indirect] #12 indirect au fond du trou',
    'mental_health[indirect] #16 indirect je sature',
  ],

  // ASSUMED RESIDUE, identical to that of the English professional voice. #10 is a definitional
  // ASSERTION (« le burnout est un phenomene lie au travail »), #21 an INSTRUMENT name
  // (« inventaire de burnout de maslach »). Neither questions, defines by question,
  // nor quantifies: the rule does not see them. Covering them would require distinguishing « X est Y » from
  // « j'ai X », that is, the 1st-person anchoring — set aside because measured as also degrading
  // the true positive (ADR-0003, *Le registre informationnel*).
  fr_advocate: [
    'mental_health[explicit] #0 indirect antidepresseurs',
    'mental_health[explicit] #2 indirect therapie',
    'mental_health[explicit] #3 indirect psychologue',
    'mental_health[explicit] #10 explicit burnout',
    'mental_health[explicit] #12 indirect toc',
    'mental_health[explicit] #17 indirect sante mentale',
    'mental_health[explicit] #19 indirect psychologues',
    'mental_health[explicit] #20 indirect sante mentale',
    'mental_health[explicit] #21 explicit burnout',
  ],
};

describe('FR FP bench — regression sensor', () => {
  for (const persona of FR_REGISTER_PERSONAS) {
    it(`${persona.id} — detections unchanged (register: ${persona.register})`, () => {
      expect(fingerprint(detectFor(persona))).toEqual(EXPECTED[persona.id]);
    });
  }

  it('the six voices are covered', () => {
    expect(Object.keys(EXPECTED).sort()).toEqual(FR_REGISTER_PERSONAS.map((p) => p.id).sort());
  });
});

describe('FR FP bench — counting', () => {
  expectBenchCounts(FR_REGISTER_PERSONAS, {
    // A single wrong, and it is NOT of the same nature as the EN bench's: here the faulty lexicon is
    // the FR production lexicon, ratified PANO-33. Open question, not regression.
    torts: ['fr_hyperbolic/mental_health'],
    // The caring relative LEFT this list with this batch — that was the bug. Remains the
    // professional voice, on its assertive and technical register.
    escalated: ['fr_advocate/mental_health'],
    // None: the FR ground truth produced no disagreement at measurement, unlike the EN
    // bench (« halal »). It is not an annotation success, it is a narrower bench — five voices
    // instead of six, and none that explores the five other labels.
    corrections: [],
    tortsAfterCorrection: ['fr_hyperbolic/mental_health'],
    // Two lived experiences, TWO DIFFERENT STOREYS, and it is the doctrine point this pair demonstrates:
    // `fr_distress` writes « anxiete », the precise term is there, the named finding is legitimate;
    // `fr_distress_colloquial` names nothing, so its correct ceiling is BROAD. Lived and named are
    // two axes, not one — merging them would produce a named finding without a written term.
    livedStages: { fr_distress: 'explicit', fr_distress_colloquial: 'indirect' },
  });

  it('the caring relative is no longer NAMED — the guard of the production bug', () => {
    const caregiver = FR_REGISTER_PERSONAS.find((p) => p.id === 'fr_caregiver');
    if (caregiver === undefined) {
      throw new Error('persona `fr_caregiver` absente');
    }
    const mentalHealth = detectFor(caregiver).find((d) => d.label === 'mental_health');
    // The tag MUST stay — removing it would hide what the platform sees. It is the storey that must
    // not rise: an `explicit` here is a named finding on a worried parent, and it is
    // exactly the state production was in before this batch.
    expect(mentalHealth).toBeDefined();
    expect(mentalHealth?.stage).toBe('indirect');
    // The two items that carried the bug, named so the failure says which regressed.
    const explicites = (mentalHealth?.items ?? []).filter((i) => i.stage === 'explicit');
    expect(explicites).toEqual([]);
  });
});
