// EN false-positive bench — the SENSOR (PANO-35). Personas and ground truth in
// `en-registers.fixture.ts`, sealed by a commit PRIOR to this file: it is the history, and
// it alone, that proves the expectations were not adjusted to the measurement. The counting is shared
// with the FR bench (`register-bench.harness.ts`); this file carries only what is specific to
// English.
// ⚠ SEAL AND PUBLISHED HISTORY. The pre-publication recomposition (2026-07-21) flattened
// the working history: fixture and sensor are born there in the same commit. The proof of ORDER
// lives now only in the local tag `pre-squash-2026-07-21`, unpublished — in the published
// history, this seal reads as a statement of method, not as a verifiable fact.
//
// ── What this file is, and what it is not ─────────────────────────────────────────────────
// It is not a report: the report of the time (ex-`docs/banc-fp-en-mental-health.md`, condensed
// into `docs/methode-portabilite-en.md`) dated its figures, and the current states read in
// the frozen expectations below — which are the source. This file is a SENSOR — it goes red
// when someone moves a threshold, touches a storey rule, or admits a term that over-fires.
//
// The precedent it corrects is explicit: the FR calibration is cited « measured PANO-33 » in four
// modules, but its 8 personas were never versioned — the measurement is unverifiable today.
// Here, the proof IS the artifact, and the figure is deduced from it.
//
// ── Why the EXACT expectation is the sensor, and not the rate ──────────────────────────────────────
// The aggregated counter is too coarse: a term that starts over-firing on one voice while
// another stops elsewhere leaves the total FLAT. The per-persona frozen expectation — label, aggregated storey,
// item storey, matched surface — moves in both cases.
//
// ── Off the demo path, by design ────────────────────────────────────────────────────────────
// This bench MEASURES, it is not delivered to users.
//
// ── WHAT THIS BENCH DOES NOT MEASURE: EN self-declaration (PANO-35 batch 2) ─────────────────────────
// Boundary declared here because it is here it is cited (CLAUDE.md, *Ce qu'un filet prouve*).
//
// This bench says NOTHING of the false-positive rate of the STATE LABELS admitted by copula
// (« i'm <label> ») — neither for good nor for ill. The reason is not an oversight, it is structural,
// and it was measured: by shipping the EN copula heads, the EN modifiers and the four
// candidate terms of the pilot (§2.1 of its note) in the MOST permissive configuration possible,
// the six voices below return a NULL delta. No expectation moves.
//
// This zero is not a safety result, it is a BLINDNESS, and one must know which:
//   - the voices DO reach the construction — seven items carry a copula (guard
//     below, which names them);
//   - but none ever pairs it with an ADMISSIBLE term. The copular slots of the
//     hyperbolic voice are occupied by terms already REMOVED (« falling apart », « spiraling »,
//     « overwhelmed ») or that were never candidates (« unwell », « obsessed », « cooked »).
//
// The cause is the very discipline that makes this bench reliable elsewhere: the fixture declares having avoided
// deliberately the exclusions already frozen by the adversarial battery — yet « depressed » IS on that
// exclusion list. Setting aside one real bias therefore installed a second, and the second is invisible
// because it produces a zero. It is the central result of batch 2, and it generalizes: a bench
// written by avoiding exclusions becomes unable to measure their future admission.
//
// What this bench PROVES on this terrain all the same, and it is real: the NON-REGRESSION. The
// copular machinery revives none of the five removed hyperbolic terms.
//
// The instrument called for here was finally NEVER built, and it is a result: the measurement
// showed that the copula anchors nothing in English, the safety moved to the STOREY
// (`SELF_DECLARATION_HEADS_EN`, a tier that never asserts), and the question the instrument was meant to
// settle disappeared rather than being settled (ex-`docs/criteres-mesure-copule-en.md`, condensed
// into `docs/methode-portabilite-en.md`).

import { describe, expect, it } from 'vitest';
import { EN_REGISTER_PERSONAS } from './en-registers.fixture';
import {
  type AnnotatorCorrection,
  detectFor,
  expectBenchCounts,
  fingerprint,
} from './register-bench.harness';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// THE FROZEN EXPECTATION — recorded 2026-07-18, at null diff
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// These lines are NOT the ground truth (it is sealed in the fixture): it is what the
// detector produces TODAY, and it is their GAP with the seal that is the bench's result. An
// expectation that moves is reread before being rewritten: a newly admitted term that appears on
// `plain`, `hyperbolic` or `slang` is a wrong, not a recall gain.

const EXPECTED: Readonly<Record<string, readonly string[]>> = {
  // The witness fires nothing. « why is my lawn mower smoking » — the tobacco homography stretched
  // knowingly in the fixture — does not cross: `health_physical` does not carry the bare term.
  plain: [],

  // THE CENTRAL RESULT OF THE BENCH, AND ITS CORRECTION. This voice fired a broad
  // `mental_health` finding on five colloquial terms shipped by the pilot batch — « falling apart »,
  // « rock bottom », « spiraling », « running on empty », « overwhelmed » — while she talks
  // about a queue, a sourdough starter and a series finale. The threshold of 2 was crossed 2.5
  // times: what ADR-0003 deduced (on hyperbole, the threshold does not set aside, it ACCUMULATES) was
  // measured here, then the five terms were removed from the lexicon.
  //
  // The emptiness below is therefore a RESULT, not an absence of coverage — and it is the most
  // important guard of the bench: if this list repopulates, a hyperbolic term has returned.
  hyperbolic: [],

  // A single item, and it suffices: `religion` tags at threshold 1. See the annotation correction
  // below — it is not the same error as `hyperbolic`'s, and confusing them would erase the
  // only one of the two that is truly a wrong.
  slang: ['religion[indirect] #1 indirect halal'],

  // The true positive. Without it, none of the zeros above proves there is still a living detector
  // behind — a dead detector displays exactly the same flawlessness.
  distress: [
    'mental_health[explicit] #1 indirect therapist',
    'mental_health[explicit] #5 indirect sertraline',
    'mental_health[explicit] #7 indirect mental health',
    'mental_health[explicit] #9 explicit burnout',
    'mental_health[explicit] #10 indirect cant get out of bed',
    'mental_health[explicit] #13 indirect counselling',
    'mental_health[explicit] #15 indirect insomnia+low mood',
    'mental_health[explicit] #17 indirect mental health',
    'mental_health[explicit] #19 indirect therapy',
    'mental_health[explicit] #20 indirect antidepressants',
    'mental_health[explicit] #22 indirect anxiety',
    'mental_health[explicit] #25 indirect mental health',
    'mental_health[explicit] #26 indirect sertraline',
    'mental_health[explicit] #29 indirect psychiatrist+psychologist',
  ],

  // RESIDUE CLOSED — and not by the batch that had opened it. The tag stays EXPECTED (signal without lived experience:
  // tagging those around IS the demonstration); it was the STOREY that was at issue. The finding
  // stayed NAMED by #29 — « teenager missing school anxiety letter », an ADMINISTRATIVE
  // search that escaped both register rules. That path is dead: bare `anxiety`
  // no longer names, it lives in the bare-name tier (`indirectSolo`).
  //
  // The lesson is worth more than the line. This residue had resisted the STOREY rules, which sought to
  // recognize a REGISTER — a question, a possessive, a 3rd person. It fell by
  // a LEXICON decision, taken on a voice that is nothing like a caring relative. The wrong did not come
  // from the way this man wrote, it came from what a bare name dared to assert.
  caregiver: [
    'mental_health[indirect] #1 indirect anxiety',
    'mental_health[indirect] #2 indirect wont leave his room',
    'mental_health[indirect] #3 indirect school refusal',
    'mental_health[indirect] #4 indirect therapist',
    'mental_health[indirect] #7 indirect depression',
    'mental_health[indirect] #9 indirect therapy',
    'mental_health[indirect] #13 indirect mental health',
    'mental_health[indirect] #15 indirect therapy',
    'mental_health[indirect] #21 indirect antidepressants',
    'mental_health[indirect] #29 indirect anxiety',
  ],

  // Same over-classification, on a voice that talks about NO ONE. #19 (« prevalence of ») was
  // degraded; #10 and #26 hold — one is a definitional ASSERTION (« burnout is an
  // occupational phenomenon »), the other an INSTRUMENT name (« maslach burnout inventory »). Neither
  // questions: covering them would require distinguishing « X est Y » from « j'ai X »,
  // that is, a 1st-person anchoring — measured as also degrading the true positive, and set aside
  // for that reason. ASSUMED RESIDUE.
  advocate: [
    'mental_health[explicit] #0 indirect antidepressants',
    'mental_health[explicit] #2 indirect therapy',
    'mental_health[explicit] #4 indirect ssris',
    'mental_health[explicit] #5 indirect psychologist+counselling',
    'mental_health[explicit] #7 indirect mental health',
    'mental_health[explicit] #9 indirect ssri',
    'mental_health[explicit] #10 explicit burnout',
    'mental_health[explicit] #12 indirect ocd',
    'mental_health[explicit] #15 indirect psych ward',
    'mental_health[explicit] #17 indirect therapist',
    'mental_health[explicit] #19 indirect anxiety disorder+anxiety',
    'mental_health[explicit] #21 indirect mental health',
    'mental_health[explicit] #24 indirect mental health',
    'mental_health[explicit] #26 explicit burnout',
  ],
};
/**
 * The ASSUMED disagreements between the sealed ground truth and what the measurement showed — corrections
 * of the ANNOTATOR, never of the seal. They relax NOTHING: the main wrong stays computed on the
 * sealed truth, and this list serves only to publish a second figure alongside the first.
 */
const ANNOTATOR_CORRECTIONS: readonly AnnotatorCorrection[] = [
  {
    personaId: 'slang',
    label: 'religion',
    sealed: 'nonCarrier',
    corrected: 'signalWithoutLived',
    why: "« best halal spot near campus » a été scellé non-porteur, et c'est une erreur d'annotation, pas un tort du détecteur. Le non-porteur suppose du texte qui n'a QUE la forme d'un signal ; « halal » est employé au sens propre. Le signal est réel — beaucoup de gens qui mangent halal ne pratiquent pas, mais c'est un éventail de lectures, exactement le cas de « le calme d'une vieille église » d'ADR-0003, et pas une absence de signal. Un annonceur taguerait, et il n'aurait pas tort.",
  },
];

describe('EN FP bench — regression sensor', () => {
  for (const persona of EN_REGISTER_PERSONAS) {
    it(`${persona.id} — detections unchanged (register: ${persona.register})`, () => {
      // STRICT equality in both directions: a term that appears is a potential over-firing,
      // a term that disappears is a loss of recall. Both are reread.
      expect(fingerprint(detectFor(persona))).toEqual(EXPECTED[persona.id]);
    });
  }

  it('the six voices are covered — an orphan expectation would signal a persona removed on the sly', () => {
    expect(Object.keys(EXPECTED).sort()).toEqual(EN_REGISTER_PERSONAS.map((p) => p.id).sort());
  });
});

describe('EN FP bench — counting', () => {
  expectBenchCounts(EN_REGISTER_PERSONAS, {
    // `hyperbolic/mental_health` — the wrong this bench existed to find — was EXTINGUISHED by the
    // removal of the five hyperbolic terms. Remains `slang/religion`, which is not a detector
    // wrong but an annotator error, published rather than corrected in silence.
    torts: ['slang/religion'],
    // The residue of the batch: the informational-register rule degraded the INTERROGATIVE items,
    // not the assertive (« burnout is an occupational phenomenon »), technical (« maslach
    // burnout inventory ») or administrative (« teenager missing school anxiety letter ») registers.
    escalated: ['advocate/mental_health'],
    corrections: ANNOTATOR_CORRECTIONS,
    // This zero reads with the note: it bears on 32 cells, 24 of which without an EN lexicon. It is not
    // a certificate of safety.
    tortsAfterCorrection: [],
    // `distress` writes « depression » and « burnout »: the precise term is present, the named finding
    // is therefore legitimate.
    livedStages: { distress: 'explicit' },
  });

  // ───────────────────────────────────────────────────────────────────────────────────────────────
  // BOUNDARY GUARD — makes VERIFIABLE the premise of the blindness declared at the top
  // ───────────────────────────────────────────────────────────────────────────────────────────────
  // The boundary at the top rests on a fact: the voices reach the copula, but never pair it
  // with an admissible term. Prose can expire in silence; this count, no. It freezes
  // the seven copula-carrying items, and it goes red if the fixture moves — in which case the boundary
  // must be REREAD before being rewritten.
  //
  // The heads below are the CANDIDATES measured by batch 2, not shipped data: the
  // EN copula is not in production, and this file is the only place in the repo where they live.
  // They cover the candidate set of THIS batch, not English: a head that a later batch
  // would propose must be added here, otherwise the guard ceases to cover what it claims to cover.
  // The lock that decides shipping remains `detect.test.ts`; this one is depth.
  it('the EN copula is REACHED by the sealed voices — without which the declared blindness would be false', () => {
    const heads = [
      'i am',
      'im',
      "i'm",
      'i feel',
      'ive been',
      'i have been',
      'i was diagnosed with',
      'i got diagnosed with',
    ];
    const porteurs = EN_REGISTER_PERSONAS.flatMap((p) =>
      p.items
        .filter((item) =>
          heads.some((h) => new RegExp(`(^|[^a-z0-9])${h}[^a-z0-9]`).test(item.text)),
        )
        .map((item) => `${p.id}: ${item.text}`),
    );
    // The seven. None pairs its copula with an admissible term: four carry REMOVED terms
    // or never candidates, two are laughter (« cooked », « weak »), and the seventh is not a
    // state label at all. It is the blindness, item by item.
    expect(porteurs).toEqual([
      'hyperbolic: i am literally falling apart over this ticket queue',
      'hyperbolic: im spiraling and its not even 9am',
      'hyperbolic: im so overwhelmed there are 40 flavours and i have one life',
      'hyperbolic: im obsessed im unwell im completely normal about it i promise',
      'slang: im cooked for this exam ngl',
      'slang: im weak, not the caption',
      'distress: i dont really have anyone to tell so im telling strangers',
    ]);
  });

  it('the hyperbolic wrong is EXTINGUISHED, and the guard carries the removed terms', () => {
    const hyperbolic = EN_REGISTER_PERSONAS.find((p) => p.id === 'hyperbolic');
    if (hyperbolic === undefined) {
      throw new Error('persona `hyperbolic` absente');
    }
    const surfaces = detectFor(hyperbolic)
      .filter((d) => d.label === 'mental_health')
      .flatMap((d) => d.items.flatMap((i) => i.surfaces));
    expect(surfaces).toEqual([]);
    // Naming the five removed terms rather than settling for the emptiness: the day one returns, the
    // failure message says WHICH. A bare `toEqual([])` would say only « something moved », and
    // the reason for the removal — measured, not supposed — would have been lost.
    for (const terme of [
      'falling apart',
      'overwhelmed',
      'rock bottom',
      'running on empty',
      'spiraling',
    ]) {
      expect(surfaces).not.toContain(terme);
    }
  });
});
