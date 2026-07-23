// EN BODY false-positive bench — the SENSOR. Voices and ground truth in
// `en-body-registers.fixture.ts`, sealed by a commit PRIOR to this file: it is
// the history, and it alone, that proves the expectations were not adjusted to the measurement. The
// counting is shared with the EN and FR `mental_health` benches (`register-bench.harness.ts`);
// this file carries only what is specific to the body.
// ⚠ SEAL AND PUBLISHED HISTORY. The pre-publication recomposition (2026-07-21) flattened
// the working history: fixture and sensor are born there in the same commit. The proof of ORDER
// lives now only in the local tag `pre-squash-2026-07-21`, unpublished — in the published
// history, this seal reads as a statement of method, not as a verifiable fact.
//
// ── ATTRIBUTION NOTE, because the history does not give it ───────────────────────────────────
// This file was NOT committed by the session that wrote it. It was swept up by a `git add -A`
// of a concurrent session, which was correcting the machinery at the same time, and it therefore landed in
// a commit whose message only talks about the informational register in compound form. The FIXTURE, in turn,
// does have its own commit, earlier: the seal that gives this bench its meaning is intact, and it is
// the only property that had to be.
//
// The history repair was SET ASIDE by the maintainer, and the reason deserves writing
// since it will come up again: a previous SHA rewrite had broken four cross-references between
// documents. The benefit here was purely archival. The gesture retained is therefore to declare
// the discrepancy where one reads it, rather than dress up the history to make it look clean.
//
// ── WHAT THIS SENSOR DOES NOT COVER ──────────────────────────────────────────────────────────────
// The fixture declares the boundaries of the VOICES (register not varied, five labels not tested, no
// vital distress). These are the boundaries of the SENSOR, and they are different:
//
// - It covers NO storey and no surface. `EXPECTED` is deliberately absent from this file,
//   unlike the `mental_health` bench: the detector's machinery was being
//   modified at the moment this sensor was mounted, and a fingerprint frozen on an unstable
//   working tree would have recorded a transient state while presenting it as a reference.
//   An expectation that rusts in an hour costs more than no expectation at all.
// - What it covers instead is narrower and more durable: the THREE DOCTRINE PROPERTIES
//   of the counting — the wrong (tagged non-carrier), the recall (the lived experience is tagged), the over-classification
//   (a signal without lived experience promoted to a named finding). These three do not depend on a term or a
//   threshold, only on the seal. They stay true while the machinery moves.
// - Laying the frozen fingerprint is therefore an explicit DEBT, to be taken up when the machinery is
//   stabilized. Without it, this sensor does not see a term that would move from one storey to another.
//
// ── HOW TO READ THE ZERO OF `worrier`, AND IT IS THE POINT OF THE BENCH ─────────────────────────────────
// `worrier` fires no wrong on `health_physical`. This zero PROVES NOTHING, and confusing it
// with safety would repeat exactly the error this bench was mounted to flush out.
//
// The reason is measured, it is not supposed: `living`, who LIVES her condition and writes it without
// detour, returns the same zero. The detector does not tag the body in English — neither wrongly, nor
// rightly. The two zeros therefore have the same cause, and the non-carrier's is not its own.
//
// That is why the true positive is in the bench: without it, this file would publish « no false
// positive on the body » in good faith, and the sentence would be empty. The day recall arrives,
// the zero of `worrier` will become information — not before.

import { describe } from 'vitest';
import { EN_BODY_REGISTER_PERSONAS } from './en-body-registers.fixture';
import { expectBenchCounts } from './register-bench.harness';

describe('EN body FP bench — counting', () => {
  expectBenchCounts(EN_BODY_REGISTER_PERSONAS, {
    // ── WHAT THE FIRST PASS HAD FOUND, AND WHICH IS CLOSED ─────────────────────────────────
    // These four lines all had another value when the sensor was mounted, and they moved
    // TOGETHER, under the EN vocabulary batch. They are reread here rather than reset to green:
    // what the bench measured the first time is what motivated the batch.
    //
    // THE WRONG, EXTINGUISHED — and it was not the one the bench sought. `relative` is sealed
    // non-carrier on `mental_health`; two items tagged her anyway, on the same surface:
    // « occupational therapy home assessment » and « aphasia speech therapy waiting list ». PHYSICAL
    // rehabilitations after a stroke, read as the daughter's mental health — wrong
    // person AND wrong subject.
    //
    // It is extinguished without `therapy` having been removed from `mental_health` (a shipped term is not
    // removed by doctrine, and that one carries real recall): `health_physical` now
    // claims the rehabilitation phrases, and a COVERING PHRASE prevents the short marker
    // from reading them in passing. The ablation is done — the `therapy` true positives of the EN bench
    // hold, and « retail therapy » falls as a bonus.
    //
    // If this list repopulates, the covering phrase has given way or a neutral term has entered.
    // ── A WRONG ARRIVED FROM ELSEWHERE, AND IT IS THE ENGLISH `religion` BATCH THAT PLACED IT ───────────
    // BEFORE: `[]`. `living` is sealed non-carrier on the five labels other than the body, and
    // she was. A single one of her items now tags her: a choir rehearsal « in the
    // church hall », that is, the word `church` used for a PLACE and not for a practice.
    //
    // This bench measures the BODY; this wrong therefore says nothing of what it was mounted to measure,
    // and it is recorded here because a counter that moves must be read, never because it
    // would fall within its object. What it teaches belongs to the `religion` batch: the
    // religious fixture had already spotted this item and sealed it OUTSIDE `religion` « precisely because
    // it is not a practice ». It was right about the person, and the detector does
    // nonetheless what the product exists to show.
    //
    // WHY `church` IS NOT REMOVED for all that, and the bar is not that of admission:
    // removing it would make Christianity INVISIBLE again in English, that is,
    // would recreate very exactly the defect the batch repaired — a Muslim detectable by his
    // food, a Christian not at all. A term that fires on carriers AND
    // non-carriers stays (ADR-0003); the one that fires only on non-carriers goes,
    // and `church` is not that one.
    torts: ['living/religion'],
    escalated: [],
    corrections: [],
    tortsAfterCorrection: ['living/religion'],
    // ── THE TWO ZEROS WERE FILLED, AND IT IS THE RESULT OF THE BATCH ──────────────────────────────
    // `living` has lived with her condition for ten years and writes it without detour: the disease name,
    // the treatment name, the blood tests, the flares, the rheumatology, the biologics.
    // Nothing tagged her — the EN `health_physical` recall was not weak, it was NULL. It no
    // longer is: 14 items carry her, and her vocabulary revealed to the batch an entire category
    // it had missed (the disease-modifying treatments, and arthritis as a named condition).
    missedRecall: [],
    // And the same emptiness on the carer, filled by the same delivery.
    missedSignal: [],
    // ── THE ZERO THAT REMAINS, AND WHICH HAS ONLY JUST BECOME INFORMATION ─────────────────────
    // `worrier` still fires nothing, and this zero no longer reads at all like the first.
    // It could then prove nothing: `living` returned the same, for the same cause. Now
    // that `living` tags, `worrier`'s finally measures what the bench came to seek — a
    // voice that writes a DENSE, perfectly literal symptom vocabulary, without having anything,
    // and that the detector does not tag. It is the admission line of the shipped lexicon: the symptom
    // is not the condition.
    //
    // Boundary not to cross in citing it: it holds for ONE voice, in ONE register. It says
    // nothing of a worried person who would write in slang or hyperbole.
    //
    // The third storey, declared twice by design (cf. the harness): a missed recall must
    // cost two lines and be visible in two reviews.
    livedStages: { living: 'explicit' },
  });
});
