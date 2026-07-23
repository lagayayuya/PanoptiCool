// TRACED-FRAME probe — a single frame walked over 46 identity terms, the six labels plus gender
// identity, in English AND in French.
//
// ── WHAT A PROBE DOES THAT A PERSONA CANNOT ──────────────────────────────────────────────────────
// A probe sweeps an AXIS; a persona samples a LIFE. A voice carries only one or two terms per label,
// and its silence NEVER distinguishes « that term is not wired » from « nothing of this label is ».
// It is the third time in this repo that an out-of-corpus probe finds what no persona had seen — and
// the reason is structural, not lucky: the two instruments do not look in the same direction.
//
// ── WHAT THIS PROBE ESTABLISHED, AND WHAT THE EN ADJECTIVES BATCH MADE OF IT ──────────────────────
// WHAT IT FOUND: the English coverage was not absent, it was of NOMINAL FORM. The lexicon carried
// the NOUNS of practice and condition (`islam`, `ramadan`, `mosque`, `depression`, `diabetes`) and
// the orientation band, but NOT the ADJECTIVES OF MEMBERSHIP by which people describe themselves:
// `muslim`, `catholic`, `depressed`, `diabetic`, `autistic` triggered NOTHING.
//
// WHAT HAS BEEN DELIVERED SINCE: the `selfDeclaredEn` tier, and the table below is updated line by
// line. Three things not to confuse when reading it:
//   · the admitted adjectives now trigger, at a BROAD finding — this tier NEVER names;
//   · the repair is FRAMED: only self-declaration is reached. The 3rd person and the bare phrase
//     stay mute (« my neighbour is diabetic » → RIEN), and it is a declared boundary, held by the
//     `chemin` block below;
//   · some zeros of the table are measured EXCLUSIONS, not holes — `orthodox`, `trans`, `deaf`,
//     `socialist`. Each has its reason written at its lexicon.
// The French, itself, carries both forms AND NAMES them: the storey gap between the languages
// remains, by decision.
//
// ── TWO HYPOTHESES PUBLISHED FALSE, AND THE SECOND IS MORE COSTLY THAN THE FIRST ──────────────────
// (1) The writing first concluded to a FRAME defect: « i am depressed » mute when « i have
//     depression » triggers looked like a gate on the copula. The `chemin` block REFUTED it — the
//     same terms were mute in the 3rd person and in the bare phrase. It was an ABSENCE OF TERM.
//
// (2) BUT THE REFUTATION LEFT STANDING A SECOND HYPOTHESIS, that no one had written because no one
//     saw it: that the frame, once the terms admitted, WOULD ANCHOR — as it does in French. MEASURED
//     SINCE, AND FALSE. The copula does not disambiguate in English: « im so ocd about my desk
//     drawers », « im autistic about train timetables » all carry the frame. That is why the
//     delivered tier never affirms — what protects is the STOREY, not the frame.
//     Detail and measurement surface: `filters-en.ts`, on `SELF_DECLARATION_HEADS_EN`.
//     A refuted hypothesis can therefore shelter another, and it is the method lesson to keep.
//
// ── BY WHICH PATH THE ZEROS ARRIVE ───────────────────────────────────────────────────────────────
// CLAUDE.md, *What a net proves*: a negative assertion verifies what it REACHES. Two documented
// traps were defused BY CONSTRUCTION, and not by trust:
//
//   · the REPETITION THRESHOLD — the repo's textbook case, where « no English coverage » actually
//     measured a single item below the threshold. Hence three VOLUMES per term. The trap presented
//     itself: `burnt out` is mute at one item and triggers at three. A one-item probe would have
//     declared it not wired, wrongly.
//   · the FRAME — hence the `chemin` block, which replays the mute terms in the 3rd person and in
//     the bare phrase.
//
// ── WHAT THIS PROBE DOES NOT COVER ───────────────────────────────────────────────────────────────
// - **It measures NO false positive.** Each utterance is a sincere self-declaration out of context.
//   It says nothing of what happens to hyperbole, homography or quotation: that is the work of the
//   register benches, and a green here says nothing of it.
// - **It does not measure a LIFE.** An isolated term is not a person: it says nothing of what
//   happens when the term is drowned in twenty ordinary items, nor of whoever never uses the
//   expected term. The personas alone see that.
// - **A single frame per language** (« i am X » / « je suis X »), plus the variants of the `chemin`
//   block on a subset. The long narrative forms are not swept.
// - **The French counterpart is a TRANSLATION, therefore a second variable.** An EN/FR gap on a term
//   can come from the term and not from the language. The gap is legible only in MASS, never on an
//   isolated line.
// - **`conflictual` is absent from this sweep**, and it is a property of the label, not an
//   omission: its gate is the insult EMITTED TARGETING someone, which is not an identity and has no
//   « je suis X » form. Its recall is not measured here.
// - **Silence is NOT the safe result.** Maintainer's position, carried here because it changes the
//   reading: the product shows what an algorithm would deduce. A term that triggers broadly is not
//   bad news, a silence is not good news — the silence is an asymmetry of treatment between two
//   users, and it displays NOTHING.
//
// ── WHAT WAS READ ────────────────────────────────────────────────────────────────────────────────
// READ: `CLAUDE.md`; `register-bench.ts`; `register-bench.harness.ts`; the headers of the political,
// religious and sexuality fixtures; the body of `en_lived_plain`; the lessons block of
// `sexuality-bench.test.ts`. NOT READ, deliberately: `lexicon/*`, `filters-*.ts`, the EN
// portability documents, `criteres-mesure-copule-en.md`.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { detectLabels } from './detect';

/** The summary of a detection, or `RIEN`. Three identical items: the volume that passes the threshold. */
const run = (texts: readonly string[]) => {
  const out = detectLabels([...texts], WIRED_LEXICONS);
  return out.map((d) => `${d.label}[${d.stage}]`).join(', ') || 'RIEN';
};

const x3 = (t: string) => run([t, t, t]);

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. THE PAIRED SWEEP — the frozen table
// ─────────────────────────────────────────────────────────────────────────────────────────────────

/** `label | EN term | FR term | expected EN | expected FR`. Values RECORDED then frozen, never
 *  deduced from the current output — a table that recomputes itself measures nothing. */
const SWEEP: readonly (readonly [string, string, string, string, string])[] = [
  ['religion', 'muslim', 'musulman', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'christian', 'chretien', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'catholic', 'catholique', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'jewish', 'juif', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'hindu', 'hindou', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'buddhist', 'bouddhiste', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'sikh', 'sikh', 'religion[indirect]', 'religion[explicit]'],
  // `orthodox` STAYS MUTE, and it is an EXCLUSION, not an omission: its dominant English use is
  // « compliant, canonical » (« an orthodox approach », « orthodox economics »). The French carries
  // `orthodoxe` in self-declaration and can afford it; the English cannot. The line below is
  // therefore the only tradition deliberately left at `RIEN`.
  ['religion', 'orthodox', 'orthodoxe', 'RIEN', 'religion[explicit]'],
  // BEFORE THE ADJECTIVES BATCH: these three were the ONLY English religious terms to trigger, and
  // they all said NON-BELIEF or distance — never membership in a tradition. It was the sharpest
  // result of the sweep, and it is the one the batch repaired: the seven lines above went from
  // `RIEN` to the broad finding. The prior value is kept in the comment rather than replaced in
  // silence.
  ['religion', 'atheist', 'athee', 'religion[indirect]', 'religion[indirect]'],
  ['religion', 'agnostic', 'agnostique', 'religion[indirect]', 'religion[indirect]'],
  ['religion', 'evangelical', 'evangelique', 'religion[indirect]', 'religion[explicit]'],

  ['sexuality', 'gay', 'gay', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'lesbian', 'lesbienne', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'bisexual', 'bisexuel', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'asexual', 'asexuel', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'pansexual', 'pansexuel', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'queer', 'queer', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'straight', 'hetero', 'sexuality[indirect]', 'sexuality[explicit]'],

  // Gender identity has NO label of its own: everything that triggers here is filed under
  // `sexuality`. It is not a wiring defect, it is the six-label doctrine (ADR-0003) — the probe
  // makes it visible, it does not settle it.
  ['gender', 'trans', 'trans', 'RIEN', 'sexuality[explicit]'],
  ['gender', 'transgender', 'transgenre', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['gender', 'nonbinary', 'non binaire', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['gender', 'genderfluid', 'genre fluide', 'sexuality[indirect]', 'RIEN'],
  ['gender', 'intersex', 'intersexe', 'sexuality[indirect]', 'RIEN'],

  // `politics` was MUTE in English on the nine terms, all volumes together — the last known coverage
  // hole, and the only anglophone label without a self-declaration tier. The `selfDeclaredEn` batch
  // filled it: eight of the nine now trigger, at a BROAD finding.
  // The BEFORE value stays written here, without which the update would erase the finding instead of
  // recording it — same discipline as the `religion` line above.
  //     BEFORE: the nine at `RIEN`.  AFTER: eight at `politics[indirect]`, `ecologist` unchanged.
  ['politics', 'socialist', 'socialiste', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'communist', 'communiste', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'conservative', 'conservateur', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'liberal', 'liberal', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'anarchist', 'anarchiste', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'feminist', 'feministe', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'marxist', 'marxiste', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'libertarian', 'libertarien', 'politics[indirect]', 'RIEN'],
  // `ecologist` stays at RIEN in BOTH languages, and the zero does not say the same thing on both
  // sides: in English the lexicon carries `environmentalist` and NOT `ecologist` (form choice, not
  // doctrinal exclusion); in French `ecologiste` is not at the tier, `ecolo` is.
  ['politics', 'ecologist', 'ecologiste', 'RIEN', 'RIEN'],

  ['mental_health', 'depressed', 'depressif', 'mental_health[indirect]', 'mental_health[explicit]'],
  ['mental_health', 'bipolar', 'bipolaire', 'mental_health[indirect]', 'mental_health[explicit]'],
  ['mental_health', 'anxious', 'anxieux', 'mental_health[indirect]', 'mental_health[explicit]'],
  ['mental_health', 'schizophrenic', 'schizophrene', 'RIEN', 'mental_health[explicit]'],
  ['mental_health', 'autistic', 'autiste', 'mental_health[indirect]', 'RIEN'],
  // Mute at ONE item, triggers at THREE — the repetition threshold caught in the act. The `volume`
  // block below is what prevents this line from being read as « not wired ».
  [
    'mental_health',
    'burnt out',
    'en burnout',
    'mental_health[indirect]',
    'mental_health[explicit]',
  ],

  [
    'health_physical',
    'diabetic',
    'diabetique',
    'health_physical[indirect]',
    'health_physical[explicit]',
  ],
  [
    'health_physical',
    'asthmatic',
    'asthmatique',
    'health_physical[indirect]',
    'health_physical[explicit]',
  ],
  ['health_physical', 'disabled', 'handicape', 'RIEN', 'health_physical[explicit]'],
  ['health_physical', 'deaf', 'sourd', 'RIEN', 'RIEN'],
  ['health_physical', 'blind', 'aveugle', 'RIEN', 'RIEN'],
  ['health_physical', 'immunocompromised', 'immunodeprime', 'health_physical[indirect]', 'RIEN'],
  // THIS LINE SAID « the ONLY English self-declaration of the sweep that reaches the NAMED finding,
  // and it is isolated: its immediate label neighbors are mute ». The observation was RIGHT and its
  // reading was false: it was not a singularity of the term, it was a DEFECT.
  // `epileptic` was in `explicit` AND in `selfDeclaredEn`; a term at both tiers short-circuits the
  // second, so it NAMED from one item — in any frame, including « the editing in that trailer is
  // epileptic ». The probe had therefore seen the wrong, and had filed it as a curiosity.
  //
  // It is the CLAUDE.md motive by one more path: what was missing was not the measurement, it is
  // that an isolated gap reads spontaneously as a property of the term rather than as a bug. The
  // term fell back to BROAD with its neighbors, and the intersection that produced it is now held by
  // `detect/storey-intersection.test.ts`.
  [
    'health_physical',
    'epileptic',
    'epileptique',
    'health_physical[indirect]',
    'health_physical[explicit]',
  ],
];

describe('traced-frame probe — EN/FR sweep', () => {
  it('the whole table holds, line by line', () => {
    const observed = SWEEP.map(([label, en, fr]) => [
      label,
      en,
      fr,
      x3(`i am ${en}`),
      x3(`je suis ${fr}`),
    ]);
    expect(observed).toEqual(SWEEP.map((row) => [...row]));
  });

  it('ENGLISH — political membership now triggers, and on BOTH edges', () => {
    // BEFORE THE `selfDeclaredEn` BATCH: the NINE returned `RIEN`, all volumes together, and the
    // assertion was written « no political membership term triggers ». It was the last known
    // coverage hole, and it held for both edges at once.
    //
    // AFTER: eight of nine trigger, at a BROAD finding. The assertion is TURNED, never removed — the
    // prior value stays written above and at the table.
    //
    // AND THE MEANING OF THIS LINE CHANGED, which is the point: it no longer measures an absence, it
    // measures that the recall did not settle on ONE SIDE ONLY. The eight cover both edges
    // (`socialist`, `communist`, `marxist`, `anarchist`, `feminist` / `conservative`, `liberal`,
    // `libertarian`): a batch that would repair only one would go red here without having to touch
    // the symmetry witness.
    const muets = SWEEP.filter(([label]) => label === 'politics').filter(
      ([, en]) => x3(`i am ${en}`) === 'RIEN',
    );
    expect(muets.map(([, en]) => en)).toEqual(['ecologist']);
  });

  it('ENGLISH — religious membership now triggers, and the non-believer pole TOO', () => {
    // BEFORE THE ADJECTIVES BATCH: `['atheist', 'agnostic', 'evangelical']` — the only three, and
    // all on the side of non-belief or distance. It was the sharpest result of the sweep, and it
    // described a non-believer detector.
    //
    // AFTER: the seven traditions join the three. The prior value stays written above, without which
    // the update would erase the finding instead of recording it.
    const fired = SWEEP.filter(([label]) => label === 'religion')
      .filter(([, en]) => x3(`i am ${en}`) !== 'RIEN')
      .map(([, en]) => en);
    expect(fired).toEqual([
      'muslim',
      'christian',
      'catholic',
      'jewish',
      'hindu',
      'buddhist',
      'sikh',
      'atheist',
      'agnostic',
      'evangelical',
    ]);
  });

  it('and the ONLY religious zero that remains is an EXCLUSION, not a hole — it is `orthodox`', () => {
    // Without this line, the zero of `orthodox` in the table would not distinguish itself from an
    // omission. Its cause is named at the lexicon: dominant English use « compliant, canonical ».
    const muets = SWEEP.filter(([label]) => label === 'religion')
      .filter(([, en]) => x3(`i am ${en}`) === 'RIEN')
      .map(([, en]) => en);
    expect(muets).toEqual(['orthodox']);
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. THE VOLUME — the threshold trap, defused rather than supposed
// ─────────────────────────────────────────────────────────────────────────────────────────────────

describe('probe — volume', () => {
  it('`burnt out` is MUTE at one item and triggers at three', () => {
    // The line that justifies the whole three-volume apparatus: the zero at one item and the zero of
    // an absent term have exactly the same appearance.
    expect(run(['i am burnt out'])).toBe('RIEN');
    expect(x3('i am burnt out')).toBe('mental_health[indirect]');
  });

  it('an ABSENT term stays mute at all volumes — the other path of the zero', () => {
    // BEFORE THE ADJECTIVES BATCH, this property was carried by `muslim`, which was wired nowhere. It
    // now is (`selfDeclaredEn` tier), and can therefore no longer hold this role: keeping it would
    // have turned the demonstration into its opposite.
    //
    // `orthodox` replaces it, and the replacement is FAITHFUL — it is the only religious term of the
    // sweep deliberately left outside the lexicon (measured exclusion, cf. the table). The property
    // tested is unchanged: distinguishing the zero of an ABSENT term from the zero of a term below
    // THRESHOLD.
    expect(run(['i am orthodox'])).toBe('RIEN');
    expect(x3('i am orthodox')).toBe('RIEN');
    expect(
      run(['i am orthodox', 'i have been orthodox my whole life', 'everyone knows i am orthodox']),
    ).toBe('RIEN');
  });

  it('and the repaired term, itself, triggers at the SAME volumes — the witness of the replacement', () => {
    // Without it, the substitution above would look like a comfort choice. It records a repair:
    // `muslim` changed sides, and it is verified rather than affirmed.
    expect(x3('i am muslim')).toBe('religion[indirect]');
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 3. THE PATH — what refuted the copula hypothesis
// ─────────────────────────────────────────────────────────────────────────────────────────────────

describe('probe — path of the zero', () => {
  it('THE REPAIR IS FRAMED: self-declaration triggers, the 3rd person stays mute', () => {
    // BEFORE THE BATCH: both columns returned `RIEN`, and it is what REFUTED the grammatical-gate
    // hypothesis — if the copula had been filtered, the 3rd person would have triggered. It did not
    // trigger: the terms were simply absent.
    //
    // AFTER, and it is the BOUNDARY OF THE BATCH, to be read before citing it: the terms are admitted
    // to the SOLE `selfDeclaredEn` tier, which matches only by the copula. The left column is
    // repaired, the right one is NOT — « my neighbour is diabetic » still returns `RIEN`. The batch
    // repairs self-declaration, it repairs neither the 3rd person nor the bare phrase.
    //
    // It is not an omission: admitting these BARE adjectives in `indirectCore` is a distinct
    // decision, to be measured separately — it is the gate where « straight » was measured at 1 → 4
    // wrongs.
    for (const term of ['muslim', 'catholic', 'depressed', 'diabetic']) {
      expect(x3(`i am ${term}`)).not.toBe('RIEN');
      expect(x3(`my neighbour is ${term}`)).toBe('RIEN');
    }
  });

  it('and the NON-ADMITTED terms stay mute in BOTH frames — the zero that measures a gate', () => {
    // The control that prevents reading the block above as « every adjective now goes through the
    // copula ». These four are excluded at the admission gate, each for a reason written at its
    // lexicon: `progressive` (politics — general-use adjective, lenses and muscle-building overload),
    // `trans` (unmanageable prefix), `deaf` and `disabled` (territory out of perimeter).
    //
    // `socialist` HELD THIS ROLE and can no longer: the `selfDeclaredEn` batch admitted it, and
    // keeping it here would have turned the demonstration into its opposite. `progressive` replaces
    // it, and the replacement is FAITHFUL — it is a political term of the same sweep, excluded by
    // DECISION (admission rule, ADR-0003) and not by omission. The property tested is unchanged:
    // distinguishing the zero of an ABSENT term from the zero of a term below threshold. Same
    // substitution, same reason and same writing as `muslim` → `orthodox` at the `volume` block.
    for (const term of ['progressive', 'trans', 'deaf', 'disabled']) {
      expect(x3(`i am ${term}`)).toBe('RIEN');
      expect(x3(`my neighbour is ${term}`)).toBe('RIEN');
    }
  });

  it('the inverse witness — `gay` triggers in the same three frames', () => {
    // Without this witness, the block above would go green even if the detector were off: it is the
    // least costly mutation that distinguishes an empty net from a net that holds.
    expect(x3('i am gay')).toBe('sexuality[indirect]');
    expect(x3('my brother is gay')).toBe('sexuality[indirect]');
    expect(x3('gay bar')).toBe('sexuality[indirect]');
  });

  it('the ADJECTIVE now triggers — but one STOREY BELOW the noun, and it is the doctrine', () => {
    // THE EXACT SHAPE OF THE HOLE, as this block measured it BEFORE the batch:
    //     « i am depressed » → RIEN        « i have depression »  → mental_health[indirect]
    //     « i am diabetic »  → RIEN        « i have diabetes »    → health_physical[explicit]
    //     « i am muslim »    → RIEN        « i go to the mosque » → religion[indirect]
    //
    // AFTER: the left column triggers. It does NOT join the right for all that, and the gap that
    // remains is not a leftover of the hole — it is the decision of the batch. `selfDeclaredEn`
    // never affirms: « i have diabetes » NAMES, « i am diabetic » poses a BROAD finding.
    //
    // That the adjective stays below the noun is the result one must know how to read. It is not
    // that the adjective would be worth less; it is that the English frame does not anchor it
    // (`filters-en.ts`), and one does not make a frame that discriminates nothing carry an
    // affirmation.
    expect(x3('i am depressed')).toBe('mental_health[indirect]');
    expect(x3('i have depression')).toBe('mental_health[indirect]');
    expect(x3('i am diabetic')).toBe('health_physical[indirect]');
    expect(x3('i have diabetes')).toBe('health_physical[explicit]');
    expect(x3('i am muslim')).toBe('religion[indirect]');
    expect(x3('i go to the mosque every friday')).toBe('religion[indirect]');
  });

  it('NONE of these adjectives reaches the NAMED finding — the property that bounds the batch', () => {
    // The counter-proof of the block above, and it is indifferent to the term: no matter which is
    // admitted tomorrow to `selfDeclaredEn`, none can name. If this line goes red, the tier changed
    // storey — say WHICH before updating anything at all.
    for (const p of [
      'i am depressed',
      'i am diabetic',
      'i am muslim',
      'i am gay',
      'i am straight',
      'i am transgender',
      'i am autistic',
    ]) {
      expect(detectLabels([p, p, p], WIRED_LEXICONS).filter((d) => d.stage === 'explicit')).toEqual(
        [],
      );
    }
  });
});
