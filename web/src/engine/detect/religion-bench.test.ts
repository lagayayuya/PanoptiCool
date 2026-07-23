// `religion` bench — the measurement of the four voices sealed in `religion-registers.fixture.ts`.
//
// ── WHAT THIS FILE DOES NOT COVER, and it must be read BEFORE the numbers ─────────────────────────
// - **One wrong remains and it is frozen as expected.** An expected is not a pardon: it is the
//   record of a state, written to blush the day it changes.
// - **Tradition coverage is NOT held here.** This bench FOUND the hole; it is
//   `religion-symmetry.test.ts` that holds it. Citing this bench on coverage would be the exact
//   over-citation CLAUDE.md describes.
// - **Recall is measured only for Islam and a Catholic heritage.** The writing boundaries are
//   declared in the fixture's header and are not recopied here.
// - **Nothing of this bench measures English.** The fourth assertion establishes why rather than
//   supposing it, and the conclusion is that `en_curious` proves nothing about EN false positives.
// - **Two out-of-corpus probes do the bulk of the work.** The four voices alone would have shown
//   NEITHER the tradition-coverage hole NOR the boundary of the negation filter: the two live in
//   traced-frame probes, not in the personas. A bench of four voices is not enough for this label,
//   and saying so is more useful than proving it twice.
//
// ── WHAT THIS BENCH FOUND, then WHAT THE REPAIR MOVED ────────────────────────────────────────────
// The five original results are kept with their BEFORE values: without them, the update would erase
// the finding instead of recording it.
//
// 1. THE PAIR COLLAPSED. `fr_practising` (practice) and `fr_cultural_lapsed` (culture without
//    belief) reached the SAME storey, `explicit`.
//      · practice `explicit` / culture `explicit`  →  `explicit` / `indirect`   — REPAIRED
// 2. THEY DID NOT HOLD BY THE SAME MEANS, and it is what made the repair possible:
//    the ablation showed that the over-classification of the culture voice hung on ONE sentence, not
//    on everything she writes. Evidence density 6 / 4 — UNCHANGED by the repair, and it must be said
//    that way: the storeys diverged, the densities did not.
// 3. THE NEGATION HAD A BOUNDARY falling on the most ordinary sentence of the subject.
//      · « catholique mais je ne crois pas »: `explicit`  →  `indirect`        — REPAIRED
// 4. THE FR COVERAGE OF TRADITIONS IS HOLED — not handled here. The by-tradition symmetry witness
//    (`religion-symmetry.test.ts`) is the net that holds it, and it is IT that must be cited on this
//    question, not this bench.
// 5. ENGLISH HAS NO ESTABLISHED RELIGIOUS COVERAGE — unchanged.
//
// ── THE RATIFIED REPAIR: DEMOTION, NOT FILTERING ─────────────────────────────────────────────────
// Two cases had to stop AFFIRMING without ceasing to be SEEN: the contradicted self-declaration and
// the dense vocabulary of a criticism. Both now produce a BROAD finding.
//
// The ratified reasoning bears on the STOREY and not on the subject: `religion` carries three
// readings (practice/membership · personal opinion · curiosity), and « personal opinion » covers
// exactly the atheist who argues. At the named tier the fan is CLASSIFIED and puts
// practice/membership first — an atheist therefore received a card privileging « she practices »
// when the correct reading already existed, in second rank. At the broad tier the fan is FLAT: the
// card becomes true without inventing anything. A `religion` card on a militant atheist is
// LEGITIMATE — she writes about religion constantly, a platform would read it — it simply must not
// affirm.
//
// Widening the negation filter was REJECTED, and the reason is kept: erasing would be false.
// Someone who writes « catholique mais je ne crois pas » HAS a relation to that tradition, it is the
// subject of their sentence.
//
// ── THE BOUNDARY OF THE REPAIR, measured and not supposed ─────────────────────────────────────────
// The demotion rests on a negation ATTACHED to the adhesion verb (« ne crois PAS »). The
// distancing turns that carry none keep NAMING — measured, not deduced:
// « je suis musulmane et je ne crois plus vraiment » still returns a named finding, `plus` not being
// a negation marker. It is exactly the « it would have no end » that made filtering rejected, and
// the demotion inherits it: it treats the most frequent form, not the class.
// The assertion that freezes it is below; a green on this bench says NOTHING of the other turns.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { detectLabels } from './detect';
import { detectFor, expectBenchCounts } from './register-bench.harness';
import { RELIGION_REGISTER_PERSONAS } from './religion-registers.fixture';

const byId = (id: string) => {
  const persona = RELIGION_REGISTER_PERSONAS.find((p) => p.id === id);
  if (persona === undefined) throw new Error(`persona \`${id}\` absente de la fixture`);
  return persona;
};

/** Number of `religion` evidence pieces cited for a persona — the grain where the asymmetry lives. */
const religionEvidence = (id: string) =>
  detectFor(byId(id)).find((d) => d.label === 'religion')?.items.length ?? 0;

/** The summary of a detection on an isolated text, or `RIEN`. */
const runOn = (texts: readonly string[]) => {
  const out = detectLabels([...texts], WIRED_LEXICONS);
  return out.map((d) => `${d.label}[${d.stage}]`).join(', ') || 'RIEN';
};

/** The voice stripped of a single one of its items — the ablation that tells what really CARRIES the storey. */
const without = (id: string, drop: number) =>
  runOn(
    byId(id)
      .items.filter((_, i) => i !== drop)
      .map((i) => i.text),
  );

describe('religion bench — common counting', () => {
  expectBenchCounts(RELIGION_REGISTER_PERSONAS, {
    // TWO RAW wrongs, and they do not read the same — that is why they do not sum.
    // `fr_critic` is the disagreement sealed in advance, now settled and therefore CORRECTED below.
    // `en_curious` is a wrong on ONE item, and the last assertion establishes that it does not
    // measure the detector's sorting.
    torts: ['fr_critic/religion', 'en_curious/religion'],
    // BEFORE REPAIR: `['fr_cultural_lapsed/religion']` — the culture voice was promoted to a NAMED
    // finding, the wrong proper to its state. The demotion brought it back to the broad finding, the
    // storey its seal expected. It is the line whose reversal reads as a repair.
    escalated: [],
    // The annotator correction, and it relaxes NOTHING: the harness verifies that the original seal
    // is intact, then publishes a second number alongside the first. The wrong of `fr_critic` stays
    // visible at the raw counter above; what it stops being is an UNEXPLAINED wrong.
    corrections: [
      {
        personaId: 'fr_critic',
        label: 'religion',
        sealed: 'nonCarrier',
        corrected: 'signalWithoutLived',
        why: "Le sceau lisait un constat `religion` comme un énoncé sur la religion DE la personne, et concluait au tort puisqu'elle n'en a aucune. Le mainteneur a tranché autrement, et la raison tient : `religion` porte la lecture « avis personnel », qui la décrit exactement. Le signal est donc RÉEL sans porter d'appartenance — c'est la définition de `signalWithoutLived`. Ce qui restait juste dans le sceau est conservé par le compteur de sur-classification : un constat NOMMÉ sur elle demeure un tort, et c'est lui que la démotion a retiré.",
      },
    ],
    tortsAfterCorrection: ['en_curious/religion'],
    missedRecall: [],
    missedSignal: [],
    // The lived voice does reach a named finding — it is the FIRST `religion` recall ever measured
    // in this repo, and the repair did NOT cost it: it was the condition set on the demotion, and it
    // is verified by ablation below rather than reasoned.
    livedStages: {
      fr_practising: 'explicit',
    },
  });
});

describe('religion bench — the PAIR, and the gap the generic counting does not see', () => {
  // Trap proper to THIS pair, and it differs from that of the political pair: both voices EXPECT a
  // tag. Two green cells at the recall counter are therefore the NORMAL result and prove nothing.
  // What reads is the distance between the two storeys — and it is nil.

  it('THE STOREYS DIVERGE — practice names, culture no longer names', () => {
    // THE BENCH'S CENTRAL RESULT, and the line whose reversal IS the repair.
    //
    // BEFORE: both voices returned `explicit`. A woman who practices and a woman who left belief
    // while keeping the meals and the funerals received the same NAMED finding, of the same
    // confidence. Doctrine announced this undecidability from writing; this bench had moved it from a
    // forecast to a measurement.
    //
    // AFTER: the culture voice is at a BROAD finding. What must be guarded against concluding — and
    // it is the tempting conclusion — is that the product NOW knows how to distinguish culture and
    // practice. It still does not: it knows how to recognize ONE FORM, the one that writes its
    // non-belief with a negation attached to the verb. She who keeps the rites without ever denying
    // anything of her belief stays indistinguishable from she who practices, and this bench does not
    // carry her.
    const stage = (id: string) => detectFor(byId(id)).find((d) => d.label === 'religion')?.stage;
    expect(stage('fr_practising')).toBe('explicit');
    expect(stage('fr_cultural_lapsed')).toBe('indirect');
  });

  it('EVIDENCE DENSITY — 6 for practice, 4 for culture', () => {
    // The two storeys are identical, the evidence is not. It is the grain where the gap remains, and
    // it is very exactly the place the political bench had pointed to: the generic counting counts
    // CELLS, the asymmetry lives in the EVIDENCE.
    //
    // This number alone does not conclude — two voices are not a distribution, and the two voices
    // are not traced item by item. It is the following ablation that gives the 6 against 4 its
    // meaning.
    expect(religionEvidence('fr_practising')).toBe(6);
    expect(religionEvidence('fr_cultural_lapsed')).toBe(4);
  });

  it('ABLATION OF THE COPULA — only practice survives the removal of its declaration', () => {
    // WHAT GIVES ITS MEANING TO ALL THE REST. We remove from each voice its only identity item
    // (« je suis musulmane… », « je suis catholique de famille mais je ne crois pas… »):
    //
    //   · the practising woman stays at a NAMED finding — she is OVER-DETERMINED, other explicit
    //     items carry her (the fast, the prayer);
    //   · the culture voice FALLS BACK to a broad finding — the correct storey, the one its seal
    //     expected.
    //
    // In other words: her over-classification does not come from everything she writes about her
    // family, her funerals and her catechism — all that produces correctly a BROAD finding. It comes
    // from ONE sentence, and that sentence says she does not believe. It is a precise repair point,
    // not a diffuse defect, and it is the difference between a bench and an impression.
    expect(without('fr_practising', 0)).toBe('religion[explicit]');
    expect(without('fr_cultural_lapsed', 0)).toBe('religion[indirect]');

    // THE CONDITION SET ON THE DEMOTION, verified by ablation rather than reasoned: a voice that
    // practices REALLY had to lose nothing. It loses nothing, and its margin is broad — removing its
    // membership declaration, that of the fast or that of the prayer leaves it each time at a named
    // finding. It is the over-determination measured one notch further than before: three
    // independent bearing items, not two.
    expect(without('fr_practising', 3)).toBe('religion[explicit]'); // without the fast
    expect(without('fr_practising', 4)).toBe('religion[explicit]'); // without the prayer

    // Same shape in the critic, and it deserves to be asserted alongside: her named finding too
    // rests ENTIRELY on her identity word. Removed, only a broad finding remains.
    expect(without('fr_critic', 1)).toBe('religion[indirect]');
  });
});

describe('religion bench — THE DEMOTION, and the boundary it does not cross', () => {
  it('the CONTRADICTED self-declaration no longer names, and the tag survives', () => {
    // Doctrinal obligation n°1 (CLAUDE.md): not to qualify someone on a sentence that says the
    // opposite. The first three probes say where the negation ALREADY held — on the copula — and
    // the fourth is the one that was repaired.
    expect(runOn(['je ne suis pas catholique'])).toBe('RIEN'); // negated on the copula → held
    expect(runOn(['je ne suis pas croyante'])).toBe('RIEN'); // idem
    expect(runOn(['je ne crois pas en dieu'])).toBe('RIEN'); // ← by which path, see below

    // BEFORE REPAIR: `religion[explicit]`. The product did not know how to represent « I belong to
    // this tradition and I do not believe in it » and made it a named finding, of high confidence.
    // Now: BROAD finding. The tag stays — she HAS a relation to this tradition, it is the subject of
    // her sentence — and the affirmation falls. Demotion, not filtering.
    expect(runOn(['je suis catholique mais je ne crois pas'])).toBe('religion[indirect]');
    expect(runOn(['je suis catholique et je ne pratique pas'])).toBe('religion[indirect]');
  });

  it('BY WHICH PATH the zero of « je ne crois pas en dieu » arrives — and it is NOT the negation', () => {
    // CLAUDE.md, *What a net proves*: a negative assertion verifies what it REACHES, not what it
    // affirms. This `RIEN` looks like a negation filter that works. It is not one: the lexicon
    // carries the ENTIRE locution « je crois en dieu », and « je ne crois pas en dieu » simply does
    // not contain it. Nothing matched, so nothing was filtered.
    //
    // The control that demonstrates it: the same sentence stripped of the locution returns nothing
    // either, whereas the affirmative form, it, names. Two possible causes, only one verified.
    expect(runOn(['je crois en dieu'])).toBe('religion[explicit]');
    expect(runOn(['je ne crois pas'])).toBe('RIEN');
  });

  it('THE BOUNDARY — a non-belief without an attached negation still NAMES', () => {
    // THE RESULT NOT TO FORGET when citing the repair, and it is measured, not deduced. The demotion
    // hooks onto a negation ATTACHED to the adhesion verb. The other distancing turns — « plus
    // vraiment », « sans vraiment y croire », « plus depuis longtemps » — carry none, and keep
    // producing a NAMED finding on someone who has just written that they do not believe.
    //
    // It is very exactly the « it would have no end » that made the widening of the filter rejected,
    // and the demotion inherits it: it treats the most frequent form, not the class.
    // Writing it here rather than leaving it to be guessed is what prevents this bench from being
    // over-cited.
    expect(runOn(['je suis musulmane et je ne crois plus vraiment'])).toBe('religion[explicit]');
  });
});

describe('religion bench — THE COVERAGE OF TRADITIONS, which the four voices could not show', () => {
  it('TRACED FRAME — the seven traditions now trigger (before: five of seven)', () => {
    // Same syntactic frame, only the tradition word changes: where we measure, we isolate (technique
    // of the political fixture). These probes exist first to NEUTRALIZE the confounder assumed by
    // the pair — `fr_practising` is Muslim, `fr_cultural_lapsed` of a Catholic family, and without
    // these probes we would not know whether the storey gap came from the state or from the
    // tradition.
    //
    // They neutralize it: the carried traditions are ALL at the same storey, in the same frame. The
    // collapse of the pair is therefore indeed a fact on the practice/culture axis, and not an
    // artifact of my two tradition choices.
    for (const t of ['catholique', 'musulmane', 'juive', 'bouddhiste', 'protestante']) {
      expect(runOn([`je suis ${t}`])).toBe('religion[explicit]');
    }

    // AND THEY FIND SOMETHING ELSE, which this bench was not designed to seek. Two traditions do not
    // trigger at all, in the exact frame where five others produce a named finding.
    //
    // It is the EXACT shape of the defect the political pair had made legible, transposed from a
    // cleavage to traditions: a non-detection displays NOTHING. Someone who writes this sentence
    // produces no trace, no red counter — an absence, and an absence looks like a clean bench. None
    // of my four voices could see it, because none belongs to these traditions; it took an
    // out-of-corpus probe.
    //
    // WHAT THIS ASSERTION DOES NOT SAY, and the restraint is necessary: it does NOT measure the
    // extent of the hole. Two missing terms found by two probes say nothing of the number of
    // uncovered traditions, nor of the spelling and masculine variants of the covered ones. A
    // coverage review is another work this bench does not do.
    // AFTER THE COVERAGE REVIEW: the two now return a named finding, like the five others. BEFORE,
    // they returned `RIEN` — and it was THE finding of this assertion.
    //
    // WHAT THIS REVERSAL DOES NOT PROVE, and it is the essential: it does not prove that the coverage
    // is complete. It proves that TWO measured holes are plugged. The question « which traditions
    // are still missing » is not settled by probes, which find only what one thought to give them —
    // it is settled by the admission rule written at the head of `lexicon/religion.ts` and by the
    // witness that holds it, `religion-symmetry.test.ts`. It is IT that must be cited on coverage,
    // never this bench.
    expect(runOn(['je suis hindoue'])).toBe('religion[explicit]');
    expect(runOn(['je suis sikh'])).toBe('religion[explicit]');
  });
});

describe('religion bench — the EN guard, and by which path its number arrives', () => {
  it('BY WHICH PATH — no English coverage is established by this bench', () => {
    // CLAUDE.md, *What a net proves*: a negative assertion verifies what it REACHES, not what it
    // affirms. `en_curious` carries four traditions and returns only ONE wrong — one could conclude
    // that the guard discriminates well. It discriminates nothing: there is almost nothing to
    // trigger. No English self-declaration returns anything, and English places of worship neither.
    // AFTER THE ENGLISH VOCABULARY BATCH, and these six lines all held `RIEN` before it. They are
    // re-read rather than reset to green: their zero of the time WAS the finding, and erasing it
    // would remove the only trace of what the batch repaired.
    //
    // What changed is NOT the storey: none NAMES, and none will as long as the language gate stays
    // closed (dedicated assertion in `religion-symmetry.test.ts`). What changed is that they stop
    // being MUTE — and it is the motive of the batch, because the prior asymmetry did not read in
    // these six lines but between them: « i go to the mosque on fridays » and « i go to church on
    // sundays » both returned `RIEN`, whereas a simple « halal » returned a finding. The Muslim was
    // detectable by his food and the Christian was not at all.
    for (const probe of [
      'i am a muslim and i pray every day',
      'i am a catholic and i go to church every sunday',
      'i am jewish and i keep the sabbath',
      'i am an atheist',
      'i go to the mosque on fridays',
      'i go to church on sundays',
    ]) {
      expect(runOn([probe])).toBe('religion[indirect]');
    }

    // THE ONLY TWO ENGLISH TRIGGERS, and the explanation to prefer. `synagogue` and `ramadan` return
    // a broad finding — and they are two words whose spelling is IDENTICAL in French. No specific
    // English word triggers: neither `mosque`, nor `church`, nor `cathedral`. The economical
    // hypothesis is therefore that these two are FRENCH entries meeting an English text, and not the
    // onset of EN coverage.
    //
    // Stated honestly: these results are COMPATIBLE with the total absence of English coverage, and
    // this bench cannot settle it further — it was written blind to the lexicon, and staying so was
    // better than lifting this doubt. It would be false to conclude that « English carries Judaism
    // better than Islam »: that would be reading a spelling coincidence as a bias.
    expect(runOn(['synagogue'])).toBe('religion[indirect]');
    expect(runOn(['ramadan'])).toBe('religion[indirect]');
    // BEFORE THE BATCH: `mosque` and `church` returned `RIEN`. It was THE demonstration of this
    // assertion — no SPECIFIC English word triggered, only the words whose spelling is common to
    // both languages triggered. The sentence stays true of the BEFORE state; it is no longer so of
    // the current state, and it is what the batch did.
    expect(runOn(['mosque'])).toBe('religion[indirect]');
    expect(runOn(['church'])).toBe('religion[indirect]');
    // `cathedral` stays outside, and it is a DECISION and not a leftover: register of the MONUMENT
    // and not of worship, written mostly by whoever visits. It therefore holds the negative control
    // of this block — without it, the two lines above would go green if the batch had admitted
    // everything without sorting.
    expect(runOn(['cathedral'])).toBe('RIEN');

    // CONCLUSION TO CITE INSTEAD OF THE NUMBER: the unique wrong of `en_curious` measures ITS
    // CONTENT — the fact that she wrote a common-spelling word — never the detector's sorting.
    // English religious false positives are **not measured**, and this voice will not measure them
    // as long as this assertion holds. The day English religious vocabulary lands, this test will go
    // red: it is its office.
  });

  it('the unique wrong of `en_curious` is indeed that one, and not another', () => {
    // Naming the item prevents a DIFFERENT wrong from slipping one day under the same counter at 1.
    const detections = detectFor(byId('en_curious'));
    expect(detections.map((d) => `${d.label}[${d.stage}]`)).toEqual(['religion[indirect]']);
    // BEFORE THE BATCH: `[8]`, a single item, and it was `synagogue` — a common-spelling word.
    // AFTER: four items, and this voice's wrong stops being a coincidence to become what the product
    // really does. She visits monuments of several traditions without believing in anything, and the
    // detector reads the presence of the SUBJECT.
    //
    // WHAT TO DO WITH IT, and it is not a motive for removal. By the demonstration principle
    // (ADR-0003), `church`, `mosque` and `the temple` trigger ALSO on practitioners: they
    // discriminate badly, they do not discriminate zero, and their error is the subject of the
    // product. The French lexicon has already ratified exactly this case by admitting `eglise` with
    // the « curiosity / interest » reading, which describes this voice word for word. The finding is
    // BROAD and the fan is flat: the card does not affirm her a believer.
    //
    // WHAT NOT TO DO WITH IT, and it is the true result of this counter: reading it as a floor of
    // English false positives. `en_curious` is the ONLY English voice of the batch, she was written
    // saturated with the vocabulary this batch admits, and her red was predictable before being
    // measured. A known adverse voice red in advance is a WITNESS, not a floor. The English safety of
    // this label stays not measured, and no number from here measures it.
    expect(detections[0]?.items.map((i) => i.itemIndex)).toEqual([4, 8, 10, 12]);
  });
});
