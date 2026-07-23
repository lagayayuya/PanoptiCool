// `conflictual` false-positive bench — the SENSOR. Voices and ground truth in
// `conflictual-registers.fixture.ts`, sealed by a commit PRIOR to this file: it is
// the history, and it alone, that proves the expectations were not adjusted to the measurement. The
// counting is shared with the EN, FR and body benches (`register-bench.harness.ts`).
// ⚠ SEAL AND PUBLISHED HISTORY. The pre-publication recomposition (2026-07-21) flattened
// the working history: fixture and sensor are born there in the same commit. The proof of ORDER
// lives now only in the local tag `pre-squash-2026-07-21`, unpublished — in the published
// history, this seal reads as a statement of method, not as a verifiable fact.
//
// ── WHAT THE FIRST MEASUREMENT FOUND ───────────────────────────────────────────────────────────
// ⚠ THIS RECORD IS DATED AND IS NO LONGER THE CURRENT STATE. It is kept as is — it is a report,
// and rewriting it would erase what motivated the arbitration. What has changed since, and where to read it:
// `moron` was REMOVED on this very figure, which dropped the `en_banter` wrong and made
// English silent on both sides; the detail is in the two blocks added at the end of the header, and
// the current state is the one asserted by `expectBenchCounts` and the guard of the English zero.
//
// Recorded 2026-07-18, 26 items per voice, four voices. The two figures of a pair answer
// opposed questions and do not merge; they are therefore read voice by voice.
//
//   fr_contempt (LIVED aggression) → 1 detection, on a single surface: `debile`.
//   fr_banter   (banter, NON-CARRIER) → 1 detection, on the SAME surface: `debile`.
//   en_contempt (LIVED aggression) → 0 detection.
//   en_banter   (banter, NON-CARRIER) → 1 detection, on `moron`.
//
// Three readings, and none is a regression of this batch — they are the first figures this
// label ever had.
//
// THE FACT THAT UNITES THEM, and it is worth more than the detail of each voice: over 104 items, TWO surfaces
// fired in all — `debile` and `moron`. None of `nul`, `pitoyable`, `incompetent`,
// `abruti`, `betise`; none of `idiot`, `useless`, `pathetic`, `clueless`, `rubbish`, `nonsense`,
// while `idiot` and `useless` recur several times in both English voices. Recall
// on real aggression is therefore near zero in BOTH languages, for want of the lexicon carrying
// the ordinary register — and the term(s) it does carry fire without regard for who is
// targeted. It is not an inverted reading of the relation: it is a sparse lexicalization,
// placed on a detector that has no access to the relation.
//
// 1. ON THE FR SIDE, THE DETECTOR DISTINGUISHES NOTHING. Twenty-six items of sustained contempt produce one
//    detection, and it is the same word that tags the affectionate friend. The restaurateur who writes
//    « pitoyable », « incompetent », « c'est de la merde », « je supporte pas la betise satisfaite »
//    is seen on NONE of these items. Recall and wrong rest on one and the same surface:
//    what the measurement shows is not an imprecise detector, it is a detector that has no
//    opinion on the relation — exactly what the pair was written to test.
//
// 2. ON THE EN SIDE, THE ONLY FIRING IS ON THE NON-CARRIER, and the path of the zero is not
//    traceable here. The hostile voice returns ZERO; the affectionate voice is the only one tagged. It is
//    tempting to conclude that English reads the relation backwards — that would be false, and it is the
//    kind of conclusion this repo pays dearly for: `detectFor` transmits only the item text,
//    the detector therefore has NO model of the relation and cannot invert it.
//
//    What the measurement shows is narrower and more useful. Two items carry the same root:
//    `en_contempt` #15, « i have no patience for morons who lecture », does not fire;
//    `en_banter` #23, « you are the official moron of this house », fires. The plural silent,
//    the singular seen. TWO PATHS would explain it — a plural tolerance absent on this
//    term, or a storey rule that degrades the general formulation (« morons who lecture ») where
//    direct address passes — AND THIS BENCH CANNOT DECIDE: its author read neither the
//    lexicon nor the filters, it is the seal's condition. The question is posed, not resolved.
//
//    If it is the second path, the result is that of the `health_physical` parable: the
//    machinery written to reduce false positives would be what shelters the aggressor and exposes
//    the friend. It is the first thing to check, and it requires an authorized reader.
//
// 3. THE TWO WRONGS ARE NAMED FINDINGS (`explicit`), not broad findings. This is not a
//    storey detail: a named finding carries high confidence and the quasi-factual (ADR-0003). The
//    product, as it stands, would say of a young woman who calls her friends idiots out of tenderness
//    that she warrants a NAMED conflictual finding.
//
// NOTHING IS REMOVED NOR CORRECTED HERE. A concurrent batch works the `conflictual` lexicon at the moment
// this sensor is mounted; the arbitration belongs to the maintainer, and the bench FREEZES the question so
// it does not get lost again — the same gesture as the six colloquial formulations of the FR bench.
//
// ── THE §2 QUESTION IS SETTLED — by an authorized reader, as it asked ──────────────
// Added afterward by the EN lexicon batch, which read the lexicon and the filters. The sensor named
// two possible paths for the `morons` / `moron` asymmetry and said it could not choose. It
// was right not to choose, and right about the conclusion. Measured:
//
//   · the PLURAL tolerance works (`moron` does match « morons ») → first path SET ASIDE;
//   · « i have no patience for morons who lecture »        → NOTHING;
//     « you are one of the morons who lecture » (the same, addressed) → TAGGED.
//
// What decides is therefore neither the plural nor a storey rule: it is the 2nd-person TARGET, which
// `conflictual` requires in the same item (ADR-0003, `conflictual` exception: « issued ≠ cited » AND
// « targeting another user »).
//
// AND THE §2 PARABLE IS EVEN MORE ACCURATE THAN ITS AUTHOR COULD WRITE IT. The guard is not
// only unable to distinguish aggression from banter: on these two voices, it is
// ANTI-CORRELATED. Contempt is expressed ABOUT a category (« morons who lecture », « les gens
// comme ça ») — without address, hence invisible. Tenderness, in contrast, ADDRESSES (« you are the official
// moron of this house ») — it is exactly what the guard requires. The mechanism written to avoid
// tagging a critique of an idea selects, on this couple, the voice that should have been spared.
//
// This finding exceeds the batch that writes it: it bears on the label's gate, not on its vocabulary.
// No correction is attempted here — the arbitration belongs to the maintainer, and the sensor stays the
// home of the question.
//
// ── WHAT THIS SENSOR DOES NOT COVER ──────────────────────────────────────────────────────────────
// The fixture declares the boundaries of the VOICES (no identity slur, no threat, register not
// varied, five labels not tested). These are the boundaries of the SENSOR, and they differ:
//
// - It covers NO frozen fingerprint. `EXPECTED` is deliberately absent, as in the body
//   bench and for a reason of the same nature: the `conflictual` lexicon is being modified
//   by a concurrent batch, and a fingerprint recorded on an unstable tree would record a
//   transient state while presenting it as a reference. An expectation that rusts in an hour costs more
//   than no expectation at all. The figures above are therefore a dated REPORT, not a guard.
// - Laying the fingerprint is an explicit DEBT, to be taken up when the lexicon is stabilized. Without
//   it, this sensor does not see a surface that would move from one storey to another.
// - What it covers instead is narrower and more durable: the DOCTRINE properties of the
//   counting — the wrong, the recall, the over-classification — plus the storey severity on the two
//   non-carriers. None depends on a term or a threshold, only on the seal.
// - It says nothing of the VOLUME of aggression: 26 items per voice, a single density tested.

import { describe, expect, it } from 'vitest';
import { CONFLICTUAL_REGISTER_PERSONAS } from './conflictual-registers.fixture';
import { detectFor, expectBenchCounts } from './register-bench.harness';

describe('conflictual FP bench — counting', () => {
  expectBenchCounts(CONFLICTUAL_REGISTER_PERSONAS, {
    // BOTH BANTER VOICES ARE TAGGED, and it is the result this bench was mounted to
    // produce. Neither has anything truly hostile; both carry the vocabulary of their
    // hostile twin, and it is the only gap between them the export does not record.
    // UPDATE AFTER ARBITRATION (2026-07-18) — `en_banter` is no longer tagged. The only surface that
    // tagged it was `moron`, and the maintainer REMOVED it on this very figure: zero recall on the
    // 26 hostile items, a named wrong on the friendly one. The English wrong therefore disappeared by removing
    // the term that produced it — not by an improvement of the detector, and the distinction is the whole
    // point of the guard below.
    torts: ['fr_banter/conflictual'],
    // No `signalWithoutLived` in this bench: the pair opposes a lived experience to a non-carrier, without
    // a third party. A voice that REPORTS a conflict without producing one (the moderator, the witness of a
    // dispute) remains to be written — it is the third state of ADR-0003, and this bench does not test it.
    escalated: [],
    // None. The ground truth held at measurement: nothing the detector returned suggests
    // that one of the four voices was mis-annotated. It is not an annotation success,
    // it is a two-state bench on a single label.
    corrections: [],
    tortsAfterCorrection: ['fr_banter/conflictual'],
    // THE RECALL DEFECT, PUBLISHED RATHER THAN HIDDEN. Twenty-six items of explicit English contempt
    // produce no finding. It is declared HERE and in `livedStages` — twice, by design.
    missedRecall: ['en_contempt/conflictual'],
    // `fr_contempt` is tagged and NAMED: she writes the term, the named finding is legitimate, and
    // it is the only recall this label has in the whole sealed corpus. `en_contempt` is at `AUCUN`,
    // which is not a convenience but a lived experience that nothing saw.
    livedStages: { fr_contempt: 'explicit', en_contempt: 'AUCUN' },
  });

  it('the two wrongs are NAMED findings, and not broad findings', () => {
    // Written as a separate assertion, and not as a corollary of the wrong: the storey is half
    // the severity. A BROAD finding on a non-carrier is already a wrong; a NAMED finding
    // adds high confidence and the quasi-factual. If a future batch drops these two voices to
    // `indirect` without making them disappear, the wrong remains — but it will have changed order of
    // magnitude, and this line is the only place where that would show.
    // `en_banter` left this list with the removal of `moron` (cf. `torts`). The property
    // it keeps is unchanged and still holds for French: a NAMED wrong is not a
    // broad wrong, and if a future batch drops `fr_banter` to `indirect`, it is here that it shows.
    for (const id of ['fr_banter']) {
      const persona = CONFLICTUAL_REGISTER_PERSONAS.find((p) => p.id === id);
      if (persona === undefined) {
        throw new Error(`persona \`${id}\` absente`);
      }
      const detection = detectFor(persona).find((d) => d.label === 'conflictual');
      expect(detection?.stage).toBe('explicit');
    }
  });

  it('the zero of `en_contempt` reads by its path, and it is nothing reassuring', () => {
    // The guard that prevents the over-citation of this bench. `en_banter` produces a wrong; if a
    // future batch extinguishes it WITHOUT giving recall to `en_contempt`, the bench would go all green in
    // English — and that green would say « no false positive » while it would only say « the detector
    // sees nothing at all ». The two zeros would have the same cause, and the non-carrier's would
    // not be its own.
    //
    // This line therefore fails the day English becomes silent on both voices, to force the
    // review rather than let the silence pass for safety.
    const contempt = CONFLICTUAL_REGISTER_PERSONAS.find((p) => p.id === 'en_contempt');
    const banter = CONFLICTUAL_REGISTER_PERSONAS.find((p) => p.id === 'en_banter');
    if (contempt === undefined || banter === undefined) {
      throw new Error('paire anglaise incomplète');
    }
    const vuChezLHostile = detectFor(contempt).some((d) => d.label === 'conflictual');
    const vuChezLAmicale = detectFor(banter).some((d) => d.label === 'conflictual');

    // ── THIS GUARD RANG, AND IT IS RE-AIMED RATHER THAN EXTINGUISHED (2026-07-18) ────────────────
    // It did exactly its job. The removal of `moron` — arbitrated on the figure this bench
    // produced — made English SILENT ON BOTH VOICES, that is, the precise state its
    // author refused to let pass for safety. The right response to a guard that rings
    // is not to invert it to `false`: it is to reread, then write what the review
    // found, so the silence stays NAMED.
    //
    // What the review found: the English of this label does NOT read aggression. `en_contempt`
    // was never seen (26 items, before as after), and `en_banter` was only by a term
    // whose measured recall was nil. The two zeros do have the same cause, and that cause is an
    // EN lexicon that does not reach the ordinary register of contempt — not a cautious detector.
    //
    // The guard is therefore RE-AIMED on what remains to protect: this silence must be DECLARED. It
    // will ring again the day English starts tagging again, to force the question that
    // will matter then — which of the two voices was seen.
    expect(
      { hostile: vuChezLHostile, amicale: vuChezLAmicale },
      "l'anglais de `conflictual` est MUET des deux côtés, et c'est un défaut de rappel déclaré — " +
        'pas une absence de faux positif. Si cette ligne rougit, une des deux voix est redevenue ' +
        'visible : dire LAQUELLE avant de mettre à jour quoi que ce soit.',
    ).toEqual({ hostile: false, amicale: false });

    // French, in turn, keeps the original property: at least one of the two voices is seen, so the
    // bench's green is not a green of blindness there.
    const frContempt = CONFLICTUAL_REGISTER_PERSONAS.find((p) => p.id === 'fr_contempt');
    const frBanter = CONFLICTUAL_REGISTER_PERSONAS.find((p) => p.id === 'fr_banter');
    if (frContempt === undefined || frBanter === undefined) {
      throw new Error('paire française incomplète');
    }
    expect(
      detectFor(frContempt).some((d) => d.label === 'conflictual') ||
        detectFor(frBanter).some((d) => d.label === 'conflictual'),
    ).toBe(true);
  });
});
