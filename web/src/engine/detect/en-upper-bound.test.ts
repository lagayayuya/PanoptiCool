// EN upper-bound bench — the SENSOR of the pair. Personas and ground truth in
// `en-upper-bound.fixture.ts`, sealed by a commit PRIOR to this file: it is the history, and it
// alone, that proves the expecteds were not adjusted to the measurement. The counting is that of the
// other register benches (`register-bench.harness.ts`); this file carries only what is proper to the
// pair.
// ⚠ SEAL AND PUBLISHED HISTORY. The pre-publication recomposition (2026-07-21) flattened the work
// history: fixture and sensor are born there in the same commit. The proof of ORDER now lives only
// in the local tag `pre-squash-2026-07-21`, unpublished — in the published history, this seal reads
// as a declaration of method, not as a verifiable fact.
//
// ── What this bench does NOT cover, and the list is long ──────────────────────────────────────────
// TWO voices, TWELVE cells. It is not a rate, it is not a coverage, and no number from here is cited
// as a property of the detector.
//
//   • A single register — amplification. Nothing here says anything about the literal, the slang,
//     the 3rd person or professional vocabulary: those voices live in the other EN bench, and the
//     two do not add up into a score.
//   • A single label really exercised. `mental_health` is the only one to carry English lexicon
//     here; the five other cells per voice go green without anything having tested them. A green on
//     `sexuality` means NOTHING in this file.
//   • English alone, and an English from a single hand. Two voices written by the same author share
//     his blind spots — what neither one nor the other thought to write is not measured.
//   • `clinical_slang` is a BOUND, not a frequency. It does so on purpose. Its number overstates the
//     risk, it does not estimate it, and reading it as « here is what happens to people » would be a
//     misreading this paragraph exists to prevent.
//   • The two numbers NEVER average — the reason is in the header of the fixture.
//
// ── Outside the demo path, by design ──────────────────────────────────────────────────────────────
// This bench MEASURES, it is not delivered to users.

import { describe, expect, it } from 'vitest';
import { EN_UPPER_BOUND_PERSONAS } from './en-upper-bound.fixture';
import { detectFor, expectBenchCounts, fingerprint } from './register-bench.harness';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// THE FROZEN EXPECTED — recorded on 2026-07-18, at zero diff
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// These lines are NOT the ground truth (it is sealed in the fixture): it is what the detector
// produces TODAY, and it is their GAP with the seal that is the result.

const EXPECTED: Readonly<Record<string, readonly string[]>> = {
  // THE FIRST RESULT, AND IT ANSWERS THE QUESTION IT WAS ASKED. This voice was briefed on the
  // REGISTER alone — permanent hyperbole, no targeting, no vocabulary was pointed out to her.
  // She triggers nothing. It is the measurement that counts, because it bears on a voice no one
  // steered: the void was not obtained by keeping her clear of something.
  //
  // What this zero does NOT say: it does not say that hyperbole is safe. It says that ONE
  // hyperbolic voice, on HER subjects — an oven, a train, books, a cat — met nothing. Another life
  // amplified identically would cross other words.
  loud: [],

  // THE SECOND RESULT, AND IT IS THE WRONG THAT MOVED THE LEXICON. Voice briefed as worst case:
  // clinical vocabulary serves there as an ordinary intensifier, as millions of people use it.
  // Four items still cross; what changed is the AGGREGATED storey, gone from `explicit` to
  // `indirect` since the bare disorder nouns no longer name.
  //
  // THE WRONG IS NOT CLOSED, and this line does not read as a victory: a non-bearer stays tagged,
  // and it is still counted as such below. What fell is the AFFIRMATION — « this person has this
  // condition », posed on kerning and a heatwave. The broad tag says « mental health vocabulary is
  // present », which is true of him.
  //
  // BUT THE BOUND RESULT IS THE CONTRAST, NOT THE FOUR. This voice piles up FOURTEEN diverted
  // clinical terms — bipolar, ptsd, ocd, gaslighting, narcissist, manic, unhinged, depression,
  // addicted, psychopath, anxiety, obsessive, trauma, delusional. Four cross; ten stay mute. A
  // deliberate worst case, written to saturate, therefore gets less than a third.
  //
  // And one must stop at that finding WITHOUT explaining it. The temptation is to announce a motive
  // — « these are the disorder nouns everyday English has colonized » — but this description covers
  // just as well the ten that stay silent: « the weather is bipolar », « he's a psychopath », « that
  // brief was gaslighting me » are exactly the same misapplication. Nothing in THIS file
  // discriminates the four from the ten; what separates them is membership in the lexicon, which does
  // not read from here. Naming a motive would over-cite the net — the fault this repo describes under
  // *What a net proves*, and which is all the easier here as the explanation would sound right.
  //
  // Three of the four are at item storey `explicit`: the delivered storey rules (3rd person,
  // informational register) have no grip here, and it is coherent — he does speak of HIMSELF, in the
  // present, in the 1st person. What is false is not the person targeted, it is the MEANING of the
  // word.
  clinical_slang: [
    'mental_health[indirect] #2 indirect ptsd',
    'mental_health[indirect] #4 indirect im so ocd+ocd',
    'mental_health[indirect] #12 indirect depression',
    'mental_health[indirect] #18 indirect anxiety',
  ],
};

describe('EN upper-bound bench — regression sensor', () => {
  for (const persona of EN_UPPER_BOUND_PERSONAS) {
    it(`${persona.id} — detections unchanged (register: ${persona.register})`, () => {
      // STRICT equality in both directions: a term that appears is a potential over-trigger, a term
      // that disappears is a loss of recall. Both get re-read.
      expect(fingerprint(detectFor(persona))).toEqual(EXPECTED[persona.id]);
    });
  }

  it('both voices are covered — an orphan expected would signal a persona removed on the sly', () => {
    expect(Object.keys(EXPECTED).sort()).toEqual(EN_UPPER_BOUND_PERSONAS.map((p) => p.id).sort());
  });
});

describe('EN upper-bound bench — counting', () => {
  expectBenchCounts(EN_UPPER_BOUND_PERSONAS, {
    // The wrong is WHOLE and it is on the side expected: `loud` carries nothing, `clinical_slang`
    // carries the only wrong of the pair. It is exactly the gap the two briefs had to make visible —
    // the same language amplitude, two vocabularies, a single wrong.
    torts: ['clinical_slang/mental_health'],
    // No `signalWithoutLived` cell in this pair: neither a carer relative, nor a professional.
    // Over-classification therefore has nothing to measure here, and this void is structural, not a
    // result.
    escalated: [],
    // No disagreement with the seal. The two contestable calls declared at the writing
    // (`conflictual` on the figures of speech of `loud`, on the insult targeting an absent class in
    // `clinical_slang`) stayed mute: the detector and the annotator agree, and there is nothing to
    // publish.
    corrections: [],
    tortsAfterCorrection: ['clinical_slang/mental_health'],
    // `politics` is sealed LIVED on `clinical_slang` — he does have an orientation, it is his — and
    // nothing tags it. The storey is therefore `AUCUN`, declared here and in `missedRecall`.
    //
    // It is NOT a counter-example to the doctrine, and it must be read the right way: he never names
    // his camp, no item carries a label or a party. The hard rule of ADR-0003 wants a NAMED finding
    // to require the precise term — an `explicit` here would have been fabricated without a term.
    // What stays open is the BROAD finding, which nothing produced.
    livedStages: { clinical_slang: 'AUCUN' },
    missedRecall: ['clinical_slang/politics'],
  });

  it('the bound: FIVE surfaces cross, over fourteen piled-up clinical terms', () => {
    const clinical = EN_UPPER_BOUND_PERSONAS.find((p) => p.id === 'clinical_slang');
    if (clinical === undefined) {
      throw new Error('persona `clinical_slang` absente');
    }
    const surfaces = detectFor(clinical)
      .filter((d) => d.label === 'mental_health')
      .flatMap((d) => d.items.flatMap((i) => i.surfaces));
    // Naming the four rather than counting: the day one falls or a fifth arrives, the failure message
    // says WHICH. A `toHaveLength(4)` would only say « something moved », and it is the identity of
    // the surface — not the number — that says whether to re-read a term or to rejoice. The ten mute
    // terms are NOT held here, by design: freezing them would make their silence a promise, whereas
    // it is only a measurement of the day.
    //
    // EN ADJECTIVES BATCH — the fifth surface is NOT one more detection. `im so ocd` and `ocd` are
    // the SAME term on the SAME item (#4), reached by two paths: the colloquial tier (the bare word)
    // and the `selfDeclaredEn` tier (the whole frame, which is the highlightable surface form). The
    // item's storey does not move, the number of detected items does not move, the measured bound
    // does not move — it is the fingerprint that gains one entry. Precisely the kind of churn this
    // test must make LEGIBLE rather than silent, hence the choice to name the surfaces instead of
    // counting them.
    expect(surfaces.slice().sort()).toEqual(['anxiety', 'depression', 'im so ocd', 'ocd', 'ptsd']);
  });
});
