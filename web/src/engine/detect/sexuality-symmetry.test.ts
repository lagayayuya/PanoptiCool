// SYMMETRY witness of the `sexuality` lexicon, BY AXIS SIDE — the net that did not exist when the
// asymmetry got through.
//
// ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────────────────────────────
// The lexicon delivered, in French, a near-nil MAJORITY coverage on two axes. Measured by a sweep
// of about 130 terms, the FR counterpart of the traced-frame probe:
//
//   · ORIENTATION — 16 minority terms returned a finding, 15 at the NAMED tier; the majority side
//     returned `hetero` ALONE, the formal register `heterosexuel` being mute.
//   · GENDER — `trans`, `transgenre`, `non binaire`, `enby` at a NAMED finding; `cis`, `cisgenre`
//     and `cisgender` mute ALL THREE. Zero against four.
//
// The symmetry was therefore not « one pair out of two »: it was ONE SPELLING against sixteen on one
// side, and NOTHING AT ALL on the other.
//
// No one had written it, and it is the same mechanism as on the political and religious side: each
// term PRESENT was locally defensible, and the defect lived in the COMPOSITION. A re-reading
// verifies that the present terms are legitimate, never that the ABSENT ones are so symmetrically.
//
// THE FOUNDATION, ratified, and it decides the shape of the net: a lexicon that catches only
// MINORITY identities is a minority detector, not an orientation detector — and its demonstration
// INVERTS, since it claims to show what a platform deduces about everyone while deducing only about
// some. It is the political defect (the left encoded as identity, the right as accusation) in its
// purest form.
//
// ── WHAT MUST BE KNOWN BEFORE READING A SINGLE GREEN ──────────────────────────────────────────────
// **THE MAJORITY TERMS ARE ADMITTED AND TRIGGER ON NO SEALED VOICE.** Measured: added to the five
// fixtures, the diff is EMPTY — zero new finding, zero lost, zero wrong. This witness therefore
// measures an ADMISSION property, never a realized recall, and **a witness that let one believe in a
// parity of EFFECT would lie**.
//
// Two independent causes, and the corpus already knew the first — it is written in the seal of
// `sexuality-registers.fixture.ts`: **no one declares their heterosexuality**. The second is that
// the only corpus item writing a majority self-declaration (« i am straight, for the fortieth
// time », `en_misread`) is ENGLISH, therefore out of reach of the language gate.
//
// What makes the repair right despite this void, and it is the maintainer's position: rarity of use
// is a reason to expect NO gain, never a reason not to repair. A francophone who writes « je suis
// cis » received NOTHING where « je suis trans » received a named finding. A non-detection displays
// nothing: the asymmetry is alive whether the bench exercises it or not.
//
// And the only place where the majority term REALLY triggers is the case of `en_misread` — someone
// who corrects a repeated assumption. It is the most costly wrong of the corpus, and the strongest
// argument in favor of the rule: the only identity the product knows how to see in her is the one
// that is not hers.
//
// ── WHAT THIS WITNESS DOES NOT COVER — to be read BEFORE citing it ────────────────────────────────
// It does NOT measure « the symmetry of the lexicon », and believing so would be the exact
// over-citation this repo pays seven times over. Precisely:
//
//   · **IT SAYS NOTHING ABOUT THE ABSENT**, and it is its hardest limit — the same as that of the
//     two neighboring witnesses. A side whose vocabulary is ENTIRELY missing passes this test green:
//     one can only classify what is there. It is HALF of the original defect, and this net does not
//     catch it. Still measured today, and not repaired: `transsexuel`, `nonbinaire`, `agenre`,
//     `intersexe`, `genre fluide`, `aromantique`, `demisexuel` are MUTE on the minority side, and
//     `cisgender` is on the majority side. A green here says nothing of what was never proposed.
//   · **IT COVERS ONLY THE SELF-DECLARATION PATH**, and it is a DELIBERATE restriction, not a
//     perimeter by convenience. `indirectCore` stays ASYMMETRIC BY DESIGN: bare `straight` was set
//     aside from it ON MEASUREMENT (1 → 4 wrongs — carpentry, saw, darts), and bare `cis` is a
//     learned prefix. The copula is the only frame that lifts the ambiguity. Citing this file to say
//     « the lexicon is symmetric » would therefore be false: what is symmetric is ONE PATH.
//   · **THE REDUNDANCY MARGIN STAYS VERY UNEQUAL, and the count below publishes it** rather than
//     masking it. A table balanced in COLUMNS can stay asymmetric in PATHS — lesson of the political
//     batch. Here the paths are not balanced and cannot be: the minority side keeps dozens of
//     indirect entries (bare mention, community vocabulary, threshold 1), the majority side has
//     NONE. The symmetry held is that of the STOREY REACHED BY A SELF-DECLARATION, not that of the
//     volume.
//   · **The partition is a JUDGMENT**, written by hand to be contestable term by term. A reader who
//     contests it contests the witness. `queer` is the most debatable case: it is an umbrella that
//     covers orientation AND gender, filed here in orientation for lack of a third bucket.
//   · **The counts count ENTRIES, never people nor distinct identities.** The morphological pairs
//     (`bisexuel`/`bisexuelle`) weigh two. 15 against 3 is a fact of lexicon and language, NOT a
//     balance score — reading it as a score would be using it against its object.
//   · **It measures no false positive.** That is the work of the register benches.
//
// What it holds, on the other hand, it holds hard: it goes red if someone adds an identity to ONE
// SIDE ONLY, and it goes red if a present identity stops producing a named finding.
//
// ── HOW IT GOES RED, in TWO steps — verified by mutation, in both directions ──────────────────────
// Adding an identity does not make the count go red right away, and it is intended:
//   1. the added term is not classified → EXHAUSTIVENESS goes red. The author must say which side it
//      belongs to, which is the gesture that was missing;
//   2. once classified, the COUNT goes red by naming the side.
// A removal goes red in a single step (inverse exhaustiveness + count).
//
// MUTATIONS RUN, and their REAL result — not what I had predicted. FOUR OF THE SIX RETURNED
// SOMETHING OTHER than expected, and it is the case CLAUDE.md declares the most useful: the real
// result is published, including when it undoes the description one had written in advance.
//
//   1. `heterosexuel` REMOVED — the ORIGINAL DEFECT reproduced, the exact shape the majority side
//      had before this batch → inverse exhaustiveness + count + parity                 (3 reds) ✓
//   2. `cis` and `cisgenre` REMOVED together — majority gender side brought back to ZERO, the
//      measured prior state → inverse exhaustiveness + count + empty side + parity      (4 reds) ✓
//   3. `demisexuel` added WITHOUT classification    → exhaustiveness + ABSENT   (2 reds, 1 predicted)
//   4. the same, once CLASSIFIED                    → count + ABSENT           (2 reds, 1 predicted)
//   5. `hetero` sent back to the `indirectCore` tier only → inverse exhaustiveness + count + parity +
//      indirect paths                                                          (4 reds, 1 predicted)
//   6. `straight` ADMITTED in `indirectCore`, the measured exclusion undone → set-aside line (1 red) ✓
//
// WHAT 3 AND 4 TAUGHT, and I had not seen it while writing: `demisexuel` figures in the list of
// measured ABSENT, so that wiring it goes red TWICE. It is not a defect of the witness, it is a
// property one does not obtain by aiming at it — the list of absent is not a dead note, it FORCES
// its own update the day the debt is paid. A batch that would admit `demisexuel` cannot do it
// without coming to strike out the line that declared it missing.
//
// WHAT 5 UNDID OF MY DESCRIPTION, and it is the confession that counts. I had written that it would
// distinguish this witness from a list counter, by catching a term PRESENT but at the wrong tier —
// the `nationaliste` defect. It does not prove that. The partition is indexed on `selfDeclaredFr`
// itself: moving a term removes it from it, so the LIST assertions go red first, and the behavior
// parity is never the one that decides. **This witness therefore does NOT know how to measure a term
// that stays classified but degraded** — there exists no mutation able to isolate it as long as the
// partition reads the same list as the detector. The behavior property is real, but it is REDUNDANT
// with the lists, never independent of them.
//
// N°2 stays the one that counts: it is the defect this file exists to prevent from coming back, and
// it is stopped four times.
//
// N°6 IS TO BE READ WITH ITS MEANING, and it is a useful confession: it protects an EXCLUSION, not
// an admission. The majority side is therefore held by two opposite lines — `heterosexuel` MUST be
// there, bare `straight` must NOT be there. Confusing them would « repair » the symmetry by
// reopening the four wrongs the measurement had closed.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { SEXUALITY_LEXICON } from '../lexicon/sexuality';
import { detectLabels } from './detect';

/**
 * THE PARTITION — the judgment this witness puts in writing, so that it can be contested.
 *
 * TWO AXES, four sides. Separating them is necessary: orientation and gender were measured at VERY
 * different states (one majority spelling on one side, zero on the other), and merging them into
 * « minority / majority » would have let the gender side disappear into the total.
 *
 * There is NO neutral bucket here, unlike the political and religious witnesses, and the absence is
 * a result: on these two axes, every self-declaration label takes a side. The day an entry takes
 * none, it is exhaustiveness that will say it.
 */
type Versant = 'orientation-min' | 'orientation-maj' | 'genre-min' | 'genre-maj';

const AXE: Readonly<Record<string, Versant>> = {
  // Orientation, minority side.
  gay: 'orientation-min',
  lesbienne: 'orientation-min',
  bi: 'orientation-min',
  bisexuel: 'orientation-min',
  bisexuelle: 'orientation-min',
  homo: 'orientation-min',
  homosexuel: 'orientation-min',
  homosexuelle: 'orientation-min',
  pansexuel: 'orientation-min',
  pansexuelle: 'orientation-min',
  asexuel: 'orientation-min',
  asexuelle: 'orientation-min',
  ace: 'orientation-min',
  aro: 'orientation-min',
  // Umbrella, and it is the most debatable entry of the partition: `queer` covers orientation as
  // well as gender. Filed in orientation for lack of a bucket that would say « both » — forcing a
  // third bucket for one entry would fabricate a category more than it clarifies one.
  queer: 'orientation-min',
  // Orientation, majority side — the three entries of the repair, `hetero` included.
  hetero: 'orientation-maj',
  heterosexuel: 'orientation-maj',
  heterosexuelle: 'orientation-maj',
  // Gender, minority side.
  trans: 'genre-min',
  transgenre: 'genre-min',
  'non binaire': 'genre-min',
  enby: 'genre-min',
  // Gender, majority side — the side that was ENTIRELY empty before this batch.
  cis: 'genre-maj',
  cisgenre: 'genre-maj',
};

const SELF_DECLARED = SEXUALITY_LEXICON.selfDeclaredFr ?? [];
const versantDe = (v: Versant) => SELF_DECLARED.filter((t) => AXE[t] === v);

/** The storey returned by an isolated self-declaration — the gesture the asymmetry muted. */
const stageOfSelfDeclaration = (term: string): string => {
  const out = detectLabels([`je suis ${term} depuis toujours`], WIRED_LEXICONS);
  return out.find((d) => d.label === 'sexuality')?.stage ?? 'RIEN';
};

describe('sexuality symmetry — the partition is exhaustive', () => {
  // EXHAUSTIVENESS PROPERTY, and it is what makes the witness alive rather than decorative: an entry
  // added to the lexicon without being classified goes red here. The author of the next term is
  // therefore OBLIGED to say which side it belongs to — that is, to look at the other side.
  it('every lexicon label is classified (otherwise the witness would be blind to additions)', () => {
    expect(SELF_DECLARED.filter((t) => AXE[t] === undefined)).toEqual([]);
  });

  // The INVERSE direction of the same coverage (CLAUDE.md: it is verified in both directions).
  // Without it, the partition would keep ghost terms after a lexicon removal, and its count would
  // measure a dead list.
  it('every classified label still exists in the lexicon', () => {
    expect(Object.keys(AXE).filter((t) => !SELF_DECLARED.includes(t))).toEqual([]);
  });
});

describe('sexuality symmetry — both sides of EACH axis are populated', () => {
  // THE FROZEN COUNT. These are not targets, they are RECORDED values then frozen, and they must be
  // read as the header asks: 15 against 3 is NOT an imbalance to correct, it is a fact of lexicon.
  // The property that matters is the FOLLOWING one (no side at zero), not the equality of these
  // numbers — which would be fabricated if aimed at.
  it('the per-side count is the one that was recorded', () => {
    expect({
      'orientation-min': versantDe('orientation-min').length,
      'orientation-maj': versantDe('orientation-maj').length,
      'genre-min': versantDe('genre-min').length,
      'genre-maj': versantDe('genre-maj').length,
    }).toEqual({
      'orientation-min': 15,
      'orientation-maj': 3,
      'genre-min': 4,
      'genre-maj': 2,
    });
  });

  // THE SUBSTANTIVE PROPERTY N° 1 — no side is EMPTY. It is very exactly what was false:
  // `genre-maj` was ZERO. It is distinct from the count because it survives a refreeze of the
  // numbers: someone who updates the numbers after a removal cannot make a side pass to zero without
  // this line saying it.
  it('no side is empty — the exact shape of the original defect', () => {
    const vides = (
      ['orientation-min', 'orientation-maj', 'genre-min', 'genre-maj'] as const
    ).filter((v) => versantDe(v).length === 0);
    expect(vides).toEqual([]);
  });

  // THE SUBSTANTIVE PROPERTY N° 2, and the only one that speaks of BEHAVIOR rather than of a list: an
  // isolated identity, in the most ordinary frame, must produce a NAMED finding — whatever the side.
  // A balanced count would not have revealed it: the term must be IN the lexicon AND at the right
  // tier (the `nationaliste` defect, present at the wrong tier).
  it('any classified identity produces a NAMED finding, whatever the side', () => {
    const muettes = SELF_DECLARED.filter((t) => stageOfSelfDeclaration(t) !== 'explicit');
    expect(muettes).toEqual([]);
  });

  // THE PARITY, stated in the terms of the ratified rule rather than by a total: « je suis hétéro »
  // and « je suis cis » must return EXACTLY what « je suis gay » and « je suis trans » return.
  // Written pair by pair, so that a gap reads on one line.
  it('the ratified rule, pair by pair — as many, and the same storey', () => {
    const PAIRES: readonly (readonly [string, string])[] = [
      ['gay', 'hetero'],
      ['homosexuel', 'heterosexuel'],
      ['homosexuelle', 'heterosexuelle'],
      ['trans', 'cis'],
      ['transgenre', 'cisgenre'],
    ];
    // THE EXPECTED STOREY IS HARD-WRITTEN, and it is not redundancy with the equality — it is what
    // prevents the assertion from being VACUOUS. Comparing only the two sides would go green if BOTH
    // became mute, that is under the most destructive mutation possible. A symmetry of silence is a
    // symmetry; it is not the one that is ratified.
    for (const [min, maj] of PAIRES) {
      expect(`${min}:${stageOfSelfDeclaration(min)}`).toBe(`${min}:explicit`);
      expect(`${maj}:${stageOfSelfDeclaration(maj)}`).toBe(`${maj}:explicit`);
    }
  });

  // The NEGATIVE control of the assertions above: without it, they would go green if EVERYTHING
  // tagged, including what must not. The second and third test the word boundary of the learned
  // prefix `cis`, which is the obvious risk of this batch.
  it('negative control — a word outside the lexicon does not tag, and the word boundary holds', () => {
    expect(stageOfSelfDeclaration('boulanger')).toBe('RIEN');
    expect(stageOfSelfDeclaration('cisaille')).toBe('RIEN');
    expect(stageOfSelfDeclaration('cistercien')).toBe('RIEN');
    expect(stageOfSelfDeclaration('cisjordanien')).toBe('RIEN');
  });
});

describe('sexuality symmetry — the PATH held, and the paths that stay unequal', () => {
  const TOUS_INDIRECTS: readonly string[] = [
    ...SEXUALITY_LEXICON.indirectCore,
    ...SEXUALITY_LEXICON.indirectColloquial,
  ];

  // THE SET-ASIDE LINE, held by a test rather than by a comment — and it is the assertion easiest to
  // undo by good intention. Someone wanting to « finish » the symmetry would add bare `straight`
  // here, reopening the 4 wrongs the measurement had closed (carpentry, saw, darts).
  // The majority side is held by TWO opposite lines: `heterosexuel` must be present in
  // self-declaration, bare `straight` must stay absent from the indirect.
  it('SET ASIDE from the indirect — bare `straight` and `cis`, on measurement', () => {
    expect(TOUS_INDIRECTS.filter((t) => t === 'straight' || t === 'cis')).toEqual([]);
  });

  // THE REDUNDANCY MARGIN, PUBLISHED RATHER THAN MASKED. The political batch established that the
  // real property is not the count but the number of independent PATHS leading to a finding from
  // each edge — and that a table balanced in columns can stay asymmetric in paths.
  //
  // Here the number says the opposite of a balance, and it is intended: the minority side has dozens
  // of indirect entries (bare mention, community vocabulary, threshold 1), the majority side has
  // NONE. A majority self-declaration therefore has only ONE path — the copula — where a minority
  // self-declaration has several and can be detected without ever declaring itself.
  //
  // IT IS AN ASYMMETRY THAT REMAINS, and writing it is the only honest reading of the green above. It
  // is not repairable by addition: bare `straight` and `cis` were measured and set aside. The
  // symmetry this file holds is that of ONE PATH, and this number is what prevents over-reading it.
  it('the indirect paths stay NIL on the majority side — the asymmetry that remains', () => {
    const majoritaires = ['hetero', 'heterosexuel', 'heterosexuelle', 'cis', 'cisgenre'];
    expect(TOUS_INDIRECTS.filter((t) => majoritaires.includes(t))).toEqual([]);

    // The minority counterpart, measured in the same gesture — without it, the zero above would look
    // like a property of the whole lexicon rather than an imbalance between two sides.
    const minoritaires = [
      'gay',
      'lesbienne',
      'bisexuel',
      'homosexuel',
      'transgenre',
      'non binaire',
    ];
    expect(TOUS_INDIRECTS.filter((t) => minoritaires.includes(t)).length).toBeGreaterThan(4);
  });

  // WHAT THE BATCH DOES NOT REPAIR, frozen so the debt stays legible and does not get rediscovered
  // as a surprise. These terms are MUTE, on both sides of the axis, and their absence is not a
  // decision: it is what the sweep found and this batch did not handle.
  it('the measured ABSENT — the half of the defect this net does not catch', () => {
    const absents = [
      'transsexuel',
      'nonbinaire',
      'agenre',
      'intersexe',
      'genre fluide',
      'aromantique',
      'demisexuel',
      'cisgender',
    ];
    const rendus = absents.map((t) => `${t}:${stageOfSelfDeclaration(t)}`);
    expect(rendus).toEqual(absents.map((t) => `${t}:RIEN`));
  });
});
