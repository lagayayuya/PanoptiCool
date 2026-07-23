// `politics` bench — the measurement of the four voices sealed in `politics-registers.fixture.ts`.
//
// ── WHAT THIS FILE DOES NOT COVER, and it must be read BEFORE the numbers ─────────────────────────
// - **The generic harness counters are ALL GREEN here, and this green means nothing.** Zero wrong,
//   zero missed recall, both lived voices tagged and named. A reader who stopped there would conclude
//   « political detection is measured and clean ». It is not: the three assertions added below show
//   an asymmetry the generic counting cannot see, because it counts CELLS and the asymmetry lives in
//   the EVIDENCE.
// - **The floor of English false positives is not measured by this bench.** The two EN voices return
//   zero, and this zero arrives because English has NO political self-declaration coverage — not
//   because the guards discriminate. The third assertion establishes it rather than supposing it. As
//   long as it returns `RIEN`, these two voices prove nothing about false positives.
// - **A single axis, the civic band, no organization, no English opposed pair.** The writing
//   boundaries are declared in the fixture's header and are not recopied here.
//
// ── THE MEASURED STATE ────────────────────────────────────────────────────────────────────────────
// Measurement made on the lexicon as it was at the seal commit (« seal four political voices — the
// opposed pair is the instrument », work history before the publication recomposition), whose parent
// brought no modification to `lexicon/`. The announced French repair had therefore NOT yet landed:
// these numbers described the state BEFORE repair, and it is what gives them their value as a point
// of comparison.
//
// ── WHAT THE REPAIR MOVED, AND WHAT IT DID NOT MOVE ──────────────────────────────────────────────
// The repair landed, and this bench measured it by going red on three assertions — which is exactly
// its office. The expecteds are updated; the BEFORE values are kept in each comment, without which
// the update would erase the finding instead of recording it.
//
//   · ablation of the coarse axis:  right `RIEN`  →  `politics[explicit]`   — REPAIRED
//   · the isolated lexeme (`liberal`):  `RIEN`     →  `politics[explicit]`   — REPAIRED
//   · evidence density:              3 / 2         →  5 / 4                  — gap UNCHANGED
//
// The third line is the one not to read crooked: the repair made two PROPERTIES symmetric (the
// over-determination, the current lexeme), not the DENSITIES. The gap of 1 remains, and this bench
// does not allow saying whether it is a residue of the lexicon or of the chance of writing — two
// voices are not a distribution.
//
// ── CONTAMINATION, declared here because it is here that this bench will be cited ─────────────────
// This bench was written blind to the lexicon, and it stayed so for almost all of the repair. THREE
// entries are the exception — `liberal`, `liberale`, `redistribution` — written after reading the
// fixture, two of them on the explicit request of the isolated-lexeme assertion. This bench
// therefore does not validate them: it provoked them. Detail at the head of `lexicon/politics.ts`.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { detectLabels } from './detect';
import { POLITICS_REGISTER_PERSONAS } from './politics-registers.fixture';
import { detectFor, expectBenchCounts } from './register-bench.harness';

const byId = (id: string) => {
  const persona = POLITICS_REGISTER_PERSONAS.find((p) => p.id === id);
  if (persona === undefined) throw new Error(`persona \`${id}\` absente de la fixture`);
  return persona;
};

/** Number of `politics` evidence pieces cited for a persona — the grain where the asymmetry lives. */
const politicsEvidence = (id: string) =>
  detectFor(byId(id)).find((d) => d.label === 'politics')?.items.length ?? 0;

/** The summary of a detection on an isolated text, or `RIEN`. */
const runOn = (texts: readonly string[]) => {
  const out = detectLabels([...texts], WIRED_LEXICONS);
  return out.map((d) => `${d.label}[${d.stage}]`).join(', ') || 'RIEN';
};

describe('politics bench — common counting', () => {
  expectBenchCounts(POLITICS_REGISTER_PERSONAS, {
    // No non-bearer tagged: the two EN voices trigger nothing, and the five other labels stay mute
    // on the two FR voices. See the header: this zero is weak on the EN side.
    torts: [],
    escalated: [],
    corrections: [],
    tortsAfterCorrection: [],
    missedRecall: [],
    missedSignal: [],
    // The two lived voices reach a NAMED finding. It is the result that makes the asymmetry invisible
    // to the generic counting: both cells are green, and yet they do not hold by the same means —
    // it is what the following `describe` measures.
    livedStages: {
      fr_state_collective: 'explicit',
      fr_state_individual: 'explicit',
    },
  });
});

describe('politics bench — the GAP of the pair, which the generic counting does not see', () => {
  // The two numbers of the pair NEVER sum nor average (fixture header): a total is precisely the
  // operation that masks an asymmetry, the silent camp letting itself be absorbed by the detected
  // camp. They are therefore asserted separately, and the gap is named.

  it('EVIDENCE DENSITY — 5 on the left, 4 on the right (before repair: 3 and 2)', () => {
    // The two voices carry 24 items, 15/9, and eight self-declarations in traced syntactic frames.
    // The evidence gap is therefore not attributable to the writing: it is attributable to the
    // lexicon. A single pair of self-declarations behaves differently, and it is the next one.
    //
    // AFTER FR REPAIR: both counters gain EXACTLY ONE, and the gap of 1 REMAINS. It must be said that
    // way rather than « both progressed »: the repair made symmetric the TWO properties the two
    // following assertions isolate, it did not equalize the density, and nothing says it should —
    // two voices are not a distribution, and a gap of 1 over 24 items is not a result, it is a
    // number.
    expect(politicsEvidence('fr_state_collective')).toBe(5);
    expect(politicsEvidence('fr_state_individual')).toBe(4);
  });

  it('THE ISOLATED LEXEME — « socialiste » AND « libéral » now pose a named finding', () => {
    // Same frame, same length, same grammatical person, same position in the voice. The only
    // variable is the current term. It is the cleanest form the asymmetry can take, and it was
    // reachable only with two voices written for each other.
    //
    // BEFORE REPAIR, this test asserted `RIEN` on the second line, and it was THE finding of the
    // bench. The repair made `liberal` enter the identity tier — a decision this bench provoked, the
    // portability note having proposed to exclude it. To be read with the contamination declared at
    // the head of `lexicon/politics.ts`: this bench does NOT validate `liberal` blind, it requested
    // it.
    expect(runOn(['je suis socialiste, et je ne trouve pas ca honteux a dire'])).toBe(
      'politics[explicit]',
    );
    expect(runOn(['je suis liberal, et je ne trouve pas ca honteux a dire'])).toBe(
      'politics[explicit]',
    );
  });

  it('ABLATION OF THE COARSE AXIS — both voices now survive the removal of « de gauche » / « de droite »', () => {
    // THE CENTRAL RESULT OF THIS BENCH, and the reason two green cells are not enough to conclude.
    // The named finding of the left voice is OVER-DETERMINED: two independent explicit paths carry
    // it, it survives the removal of the coarse axis. That of the right voice rested ENTIRELY on this
    // single term — removed, there was not a broad finding left, there was nothing at all left.
    //
    // It is exactly what made the asymmetry invisible: the coarse axis is symmetric, it catches the
    // right voice, and both camps reach the same storey. The redundancy margin, itself, was not —
    // and it is what decides what happens to someone who writes their engagement otherwise than with
    // the two most expected words.
    //
    // AFTER REPAIR: the right voice is over-determined too, at the SAME storey. It is the property
    // this bench existed to measure, and the only one whose reversal reads as a repair rather than as
    // a displacement of a number.
    const withoutCoarse = (id: string) =>
      runOn(
        byId(id)
          .items.filter((_, i) => i !== 0)
          .map((i) => i.text),
      );

    expect(withoutCoarse('fr_state_collective')).toBe('politics[explicit]');
    expect(withoutCoarse('fr_state_individual')).toBe('politics[explicit]');
  });

  it('THE SIX OTHER PAIRS are mute on BOTH sides — a silence, itself, symmetric', () => {
    // Membership, vote named otherwise than by the axis, stake framing, position, dues: none
    // triggers, in either camp. That silence does not weigh on the gap, and asserting it prevents
    // believing the asymmetry is broader than it really is.
    const a = byId('fr_state_collective').items;
    const b = byId('fr_state_individual').items;
    for (const i of [1, 2, 3, 5, 6, 7]) {
      expect(runOn([a[i]?.text ?? ''])).toBe('RIEN');
      expect(runOn([b[i]?.text ?? ''])).toBe('RIEN');
    }
  });
});

// ── WHAT THE ENGLISH VOCABULARY BATCH CHANGED HERE, AND WHAT IT DID NOT CHANGE ────────────────────
// The EN batch landed (23 entries: institutions, procedures, paired themes, two acts of voting).
// This `describe` was written anticipating going red at that moment. **It did not go red**, and it
// should not: the batch delivers NO English self-declaration — `selfDeclared` stays empty, for lack
// of an EN copula. The assertion below therefore stays true, and it stays useful: it guards the
// tier.
//
// What, on the other hand, IS NO LONGER TRUE is the sentence that surrounded it — « as long as this
// assertion holds, the two EN voices prove nothing about false positives, they are only a floor laid
// in advance ». English vocabulary now exists, at other tiers. But the floor still has not become a
// measurement, and for a reason that must be written in its place:
//
//   **none of the 23 entries of the batch appears in the text of one or the other guard** (verified
//   term by term, not supposed).
//
// The zero wrong of the two EN voices therefore still measures their CONTENT, never the lexicon's
// sorting. The false positives of the English vocabulary are **not measured**. What would be needed
// is named in `politics-symmetry.test.ts`: an English opposed pair, sealed blind.
describe('politics bench — the EN guards, and by which path their zero arrives', () => {
  it('BY WHICH PATH — English has no political self-declaration coverage', () => {
    // CLAUDE.md, *What a net proves*: a negative assertion verifies what it REACHES, not what it
    // affirms. The zero wrong of the two EN voices could mean « the guards discriminate well »; it
    // really means « there is nothing to trigger ». The five probes below are the most explicit
    // self-declarations one can write in English, and none returns anything.
    //
    // As long as this assertion holds, `en_exposed_apolitical` and `en_ironic` prove NOTHING about
    // false positives — they are only a floor laid in advance, ready to measure the day English
    // political vocabulary lands. That day, this test will go red: it is its office.
    //
    // UPDATE — the English vocabulary landed, and this test did NOT go red. The prediction above
    // aimed right but too broad: the batch delivers institutions and themes, no SELF-DECLARATION,
    // `selfDeclared` staying empty for lack of an EN copula. The assertion therefore guards exactly
    // the tier it guarded. What changed is said in the header of this `describe`, and it is not this
    // test that saw it — it is a term-by-term verification.
    for (const probe of [
      'i am a socialist and i have always been one',
      'i am a conservative and i have always been one',
      'i am left wing and i vote that way every time',
      'i am right wing and i vote that way every time',
      'i am a liberal, i am a communist, i am a capitalist',
    ]) {
      expect(runOn([probe])).toBe('RIEN');
    }
  });

  it('the two EN voices return nothing — a floor, not a guarantee', () => {
    expect(detectFor(byId('en_exposed_apolitical'))).toEqual([]);
    expect(detectFor(byId('en_ironic'))).toEqual([]);
  });
});
