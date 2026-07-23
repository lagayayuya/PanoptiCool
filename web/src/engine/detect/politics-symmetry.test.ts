// SYMMETRY witness of the `politics` lexicon — the net that did not exist when the bias got through.
//
// ── WHY THIS FILE EXISTS ───────────────────────────────────────────────────────────────────
// The lexicon shipped, in French, an asymmetric encoding of the two camps: the left-wing identities
// in the IDENTITY tier (`selfDeclared`, NAMED finding), the right-wing ones in the ACCUSATIONS tier
// (`indirectCore`, below the threshold when isolated). Measured: « je suis anarchiste » placed
// a named finding, « je suis nationaliste » placed none.
//
// No one had written it: each term entered for a locally defensible reason, and the
// defect lived in the COMPOSITION, not in a term. No review could see it — a
// review checks that each PRESENT term is legitimate, never that the ABSENT ones are so
// symmetrically. And no test held it: before this file, the word « symmetry » appeared
// in no test of the engine.
//
// ── WHAT THIS WITNESS DOES NOT COVER — to read BEFORE citing it ────────────────────────────────────
// It does NOT measure « the political balance » of the product. No test can do it, and believing the
// contrary would be the exact over-citation this repo pays for seven times. Precisely:
//
//   · **It measures the axis I CHOSE** — a left / right / no-camp partition of the identity
//     labels, plus two thematic repertoires. This partition is a JUDGMENT, written by
//     hand below, and debatable term by term. A reader who contests it contests the witness.
//   · **It says nothing of the ABSENT ones.** A camp whose vocabulary is ENTIRELY missing from the lexicon
//     would pass this test green: one can only classify what is there. It is the half of the original
//     defect this net does not catch, and it is its hardest limit.
//   · **This side covers only FRENCH**, and the file carries TWO OTHERS that do not
//     measure the same thing. Citing « the symmetry witness » without saying which of the three means
//     nothing:
//       — FR IDENTITIES (here): do both camps produce a NAMED finding?
//       — EN IDENTITIES: do both camps reach the SAME STOREY, without either naming?
//         The property differs because in English nothing names, by construction of the tier.
//       — EN PATHS: how many independent ways lead to a finding from each side? This
//         last one does not conclude, and its header says why.
//   · **It covers only two tiers** — `selfDeclared` and the thematic repertoire. The register of
//     EPITHETS (`gaucho`, `droitard`, `facho`…) is not held: an epithet belongs to whoever
//     throws it, axing it would amount to classifying speakers, and it is not the same question.
//   · **The counts count ENTRIES, not distinct political positions.** The gendered
//     pairs (`conservateur`/`conservatrice`) weigh two; the 14/14 equality below is therefore an
//     equality of entries, and it must not be read as a balance of the field.
//
// What it holds, in contrast, it holds hard: it goes red if someone adds an identity to ONE
// SINGLE camp, and it goes red if a present identity stops producing a named finding.
//
// ── HOW IT GOES RED, in TWO steps — verified by mutation, in both directions ──────────────────
// Adding an identity does not make the count go red right away, and it is intended:
//   1. the added term is not classified → the EXHAUSTIVENESS goes red. The author must say which side
//      they file it on, which is the gesture that was missing;
//   2. once classified, the COUNT goes red by naming the camp (`{ right: 15 }` against `{ right: 14 }`).
// Two stops are better than one: the first forces the judgment, the second forces looking at the other
// camp. A removal, in turn, goes red in a single step (inverse exhaustiveness + count).
//
// Verified mutations: addition on the right · addition on the left · removal on the right · return of a right-wing
// identity to the accusations tier alone, that is, the original defect reproduced identically.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { POLITICS_LEXICON } from '../lexicon/politics';
import { detectLabels } from './detect';

/**
 * The PARTITION — the judgment this witness puts in writing, so it is contestable.
 *
 * A label is `neutral` when it does not designate a camp: the register of ENGAGEMENT
 * (`militant`), the center, the claimed absence of a camp. This third bucket exists so the
 * partition does not have to force a camp on terms that carry none — without it, one would
 * fabricate symmetry by filing arbitrarily.
 */
const AXIS: Readonly<Record<string, 'left' | 'right' | 'neutral'>> = {
  // Left.
  'de gauche': 'left',
  "d'extreme gauche": 'left',
  ecolo: 'left',
  anarchiste: 'left',
  anar: 'left',
  communiste: 'left',
  socialiste: 'left',
  insoumis: 'left',
  insoumise: 'left',
  libertaire: 'left',
  marxiste: 'left',
  feministe: 'left',
  syndique: 'left',
  syndiquee: 'left',
  // Right.
  'de droite': 'right',
  "d'extreme droite": 'right',
  royaliste: 'right',
  monarchiste: 'right',
  gaulliste: 'right',
  souverainiste: 'right',
  nationaliste: 'right',
  patriote: 'right',
  reac: 'right',
  traditionaliste: 'right',
  conservateur: 'right',
  conservatrice: 'right',
  liberal: 'right',
  liberale: 'right',
  // No camp — engagement, center, refusal of a camp.
  militant: 'neutral',
  militante: 'neutral',
  centriste: 'neutral',
  apolitique: 'neutral',
  macroniste: 'neutral',
};

const SELF_DECLARED = POLITICS_LEXICON.selfDeclaredFr ?? [];
const sideOf = (side: 'left' | 'right' | 'neutral') =>
  SELF_DECLARED.filter((t) => AXIS[t] === side);

/** The storey returned by an isolated self-declaration — the gesture the original defect made mute. */
const stageOfSelfDeclaration = (term: string): string => {
  const out = detectLabels([`je suis ${term} depuis toujours`], WIRED_LEXICONS);
  const politics = out.find((d) => d.label === 'politics');
  return politics === undefined ? 'RIEN' : politics.stage;
};

describe('politics symmetry — the partition is exhaustive', () => {
  // EXHAUSTIVENESS PROPERTY, and it is what makes the witness alive rather than decorative: an
  // entry added to the lexicon without being classified goes red here. The author of the next term is
  // therefore OBLIGED to say which side they file it on — that is, to look at the other side.
  it('each lexicon label is classified (otherwise the witness would be blind to additions)', () => {
    const nonClassees = SELF_DECLARED.filter((t) => AXIS[t] === undefined);
    expect(nonClassees).toEqual([]);
  });

  // The INVERSE direction of the same coverage (CLAUDE.md: it is verified in both directions). Without
  // it, the partition would keep phantom terms after a lexicon removal, and its count
  // would measure a dead list.
  it('each classified label still exists in the lexicon', () => {
    const fantomes = Object.keys(AXIS).filter((t) => !SELF_DECLARED.includes(t));
    expect(fantomes).toEqual([]);
  });
});

describe('politics symmetry — both camps are populated at the SAME tier', () => {
  // THE FROZEN COUNT — the trigger we want: adding an identity to a single camp changes one of these
  // three numbers, and the test goes red by naming which. These are not targets, they are RECORDED
  // values then frozen; moving them is legitimate, moving them on one side only without saying so is
  // not.
  it('the per-camp count is the one that was recorded', () => {
    expect({
      left: sideOf('left').length,
      right: sideOf('right').length,
      neutral: sideOf('neutral').length,
    }).toEqual({ left: 14, right: 14, neutral: 5 });
  });

  // THE SUBSTANTIVE PROPERTY, and the only one that speaks of behavior rather than of a list: an
  // isolated identity, in the most ordinary frame, must produce a NAMED finding — on both sides.
  // It is exactly what was false before repair, and a balanced count would not have revealed it:
  // `nationaliste` was IN the lexicon, at the wrong tier.
  it('any classified identity produces a NAMED finding, whatever the camp', () => {
    const muettes = SELF_DECLARED.filter((t) => stageOfSelfDeclaration(t) !== 'explicit');
    expect(muettes).toEqual([]);
  });

  // The NEGATIVE control of the assertion above: without it, it would go green if everyone tagged,
  // including what should not. A word outside the lexicon must stay mute.
  it('negative control — a label outside the lexicon does not tag', () => {
    expect(stageOfSelfDeclaration('boulanger')).toBe('RIEN');
    expect(stageOfSelfDeclaration('identitaire')).toBe('RIEN'); // assumed exclusion, cf. the lexicon
  });
});

describe('politics symmetry — the THEMATIC repertoire, paired', () => {
  // The second locus of the defect: the thematic tier carried only the MOBILIZATION repertoire
  // (demo, strike, union, petition), which is that of one camp. These pairs are written SIDE BY
  // SIDE, at equal threshold (2 items), so that an imbalance reads on one line.
  const PAIRES: readonly (readonly [string, [string, string], [string, string]])[] = [
    [
      'mobilisation / ordre',
      ['on va a la manif samedi', 'la greve continue lundi'],
      ["le retour de l'ordre public", "l'insecurite au quotidien"],
    ],
    [
      'dépense / prélèvement',
      ['le budget des services publics fond', 'la redistribution recule'],
      ['la fiscalite etouffe les petits', 'un impot de plus chaque annee'],
    ],
    [
      'collectif / souveraineté',
      ['le syndicat appelle a debrayer', 'signez la petition'],
      ["l'identite nationale se dissout", 'la souverainete nationale d abord'],
    ],
  ];

  for (const [nom, gauche, droite] of PAIRES) {
    it(`« ${nom} » — both sides tag`, () => {
      expect(detectLabels([...gauche], WIRED_LEXICONS).map((d) => d.label)).toEqual(['politics']);
      expect(detectLabels([...droite], WIRED_LEXICONS).map((d) => d.label)).toEqual(['politics']);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// THE ENGLISH SIDE — and it is NOT measured on the same axis
// ═══════════════════════════════════════════════════════════════════════════════════════════════
//
// ── WHY NOT THE SAME AXIS, and it was the hardest question of the batch ──────────────────────────
// The FR side above partitions IDENTITIES into left / right. Transporting this partition into
// English would produce a net that measures the balance on a line the delivered English vocabulary
// never crosses. Three reasons, and each is enough:
//   · the English batch contains NO identity — `selfDeclared` stays empty, there is nothing to
//     partition;
//   · `liberal` inverts camp depending on the dialect (left in the United States, economic right in
//     the United Kingdom): an English partition would depend on the reader, not on the text;
//   · there exists NO sealed English opposed pair — `politics-registers.fixture.ts` declares it in
//     full, its two EN voices being GUARDS and not a pair.
//
// The axis retained is therefore that of PATHS: how many independent ways lead to a finding, from
// each edge. A table balanced in columns can stay asymmetric in paths, and it is exactly what the
// French side taught.
//
// ── WHAT THIS SECTION CANNOT CONCLUDE — to be read before citing it ──────────────────────────────
// The two voices below are of MY writing, and the vocabulary too. Counting one against the other is
// therefore CIRCULAR: it measures the internal coherence of the batch, never its real symmetry.
// The demonstration is direct, and it is the true result of this section: mid-batch, the addition of
// TWO terms chosen without looking at these voices moved the count from 1–0 in favor of one edge to
// 2–1 in favor of the other. **A pair of voices cannot settle a symmetry; it oscillates on one
// term.**
//
// The instrument that would settle it is named, and it does not exist: a SEALED ENGLISH OPPOSED PAIR
// sealed blind, two engaged voices of equal density, written by someone who has not seen this
// lexicon. As long as it is missing, the symmetry of the English side is an ASSUMED ACCEPTANCE,
// never measured.

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// THE ENGLISH IDENTITIES — the axis TRANSPORTS, but its property CHANGES SHAPE
// ═══════════════════════════════════════════════════════════════════════════════════════════════
//
// ── WHY THIS SECTION EXISTS, AND WHAT IT CORRECTS ───────────────────────────────────────────────
// The PATHS side below set aside the left / right partition for three reasons. Two EXPIRED with the
// `selfDeclaredEn` batch, and the third aimed at the wrong target:
//   · « the English batch contains NO identity » — expired: there are 25 of them;
//   · « no sealed English opposed pair exists » — STILL TRUE, and it bounds what one can CONCLUDE
//     (cf. the PATHS section), not what one can CLASSIFY;
//   · « `liberal` inverts camp depending on the dialect, so the partition would depend on the
//     reader » — true, and WITH NO EFFECT ON THE PRODUCT. See the boundary below.
//
// ── THE PROPERTY IS NOT THAT OF THE FRENCH SIDE, and copying it would be false ───────────────────
// The French defect was a TIER defect: the left at `selfDeclared` (NAMED finding), the right at
// `indirectCore` (accusation, below the threshold). Its repair property — *any classified identity
// produces a NAMED finding* — cannot transport: in English, NOTHING names, by construction of the
// tier.
//
// But the question does not die, it changes shape. What is verified here is:
//
//     any classified identity reaches EXACTLY `indirect`, at the SAME volume, on both sides
//     — and NONE reaches `explicit`.
//
// Two halves that hold SEPARATELY: the equality of REACH (no one is mute) and the equality of
// CEILING (no one names). It is the same question the French posed — *are both camps encoded in the
// same register?* — posed to the English machinery.
//
// ── WHAT THIS SECTION DOES NOT COVER — to be read BEFORE citing it ───────────────────────────────
//   · **It does not see the ABSENT ones**, and it is its hardest limit, inherited as is from the
//     French side: a camp whose vocabulary were ENTIRELY missing from the lexicon would go green.
//     One can only classify what is there. The half of the original defect stays outside the net.
//   · **`liberal` breaks the BOOKKEEPING of this file, not the product.** Its camp inverts depending
//     on the dialect (left in the United States, economic right in the United Kingdom). Since the
//     tier never names and the produced finding says `politics` — never « left », never « right » —
//     the inversion reaches NO output seen by a user: it exists only in the classifier below. Hence
//     the fourth bucket `ambiguous`, which is the same gesture as the `neutral` bucket of the French
//     side: not forcing a camp onto a term that carries not a single one.
//     A batch that would file `liberal` on the left or the right would inscribe a DIALECT in the repo.
//   · **It measures NO false positive.** The bench written for this batch disqualified itself (32/32,
//     cf. the header of the lexicon): it measured the constructibility of a collision, not the
//     dominant use. `conservative` and `liberal` are ASSUMED ACCEPTANCES — without an instrument,
//     and the word is *assumed*, never *measured*.
//   · **The partition is a JUDGMENT**, like that of the French side, and debatable term by term:
//     `feminist` and `environmentalist` on the left take up what French has already settled
//     (`feministe`, `ecolo`). A reader who contests it contests the witness, and it is intended.
//   · **It says nothing of the REAL symmetry of the English field.** The instrument that would
//     settle it is named and still does not exist: a sealed English opposed pair sealed blind.
//
// ── MUTATIONS ACTUALLY RUN, and their result RECORDED — not « it would go red » ─────────────────
// Count of the whole file, baseline 20 greens / 0 red.
//   1. `'ecosocialist'` added to the lexicon, not classified → 1 red: *each English identity of the
//      lexicon is classified*. The author of the next term is therefore OBLIGED to say which side
//      they file it on — that is, to look at the other side, the gesture that was missing in French
//   2. the same, once CLASSIFIED on the left                → 1 red: *the per-camp count*
//      (`{left: 11}` against `{left: 10}`). Two stops are better than one: the first forces the
//      judgment, the second forces looking at the other camp
//   3. `'conservative'` removed from the lexicon            → 2 reds: inverse exhaustiveness + count
//   4. `'conservative'` moved to `indirectCore` ONLY        → **3 reds, one MORE than predicted**
//   5. the partition emptied of its entries                 → **2 reds, one FEWER than predicted**
//
// N°4 JUSTIFIES THE WHOLE SECTION: it is THE FRENCH DEFECT REPRODUCED IDENTICALLY — the term stays
// IN the lexicon, at the accusations tier, exactly as `nationaliste` was. I expected 2 of them
// (inverse exhaustiveness + count); the third is *no English identity lives in `indirectCore`
// without being at the identity tier*, that is the property written FOR this case, which therefore
// does its office in addition to the two side effects. Recording it rather than predicting it is
// what distinguishes a guarantee from an intention.
//
// N°5 RETURNED FEWER THAN PREDICTED, and it is the most instructive result of the five. I announced
// 3 reds; there are **2** — *each identity of the lexicon is classified* and *the count*. The other
// three stay GREEN on an EMPTY partition, and one must know why: the inverse exhaustiveness iterates
// on the partition (empty → no phantom → green), the anti-recidivism too (empty → nothing to verify
// → green), and the two behavior properties iterate on the LEXICON, not on the partition — they
// therefore keep measuring something true.
// **Three of the six properties of this section are therefore vacuous if the partition empties**, and
// only the first two prevent it. They carry the anti-vacuity of the whole block: removing them would
// make the green of the other three indistinguishable from a dead classifier.

/**
 * THE ENGLISH PARTITION — four buckets, and the fourth is not a convenience.
 *
 * `ambiguous` exists for `liberal` alone, whose camp depends on the reader's dialect. Filing it
 * forcibly on one side would inscribe a dialect in the repo; excluding it from the lexicon would
 * exclude only one of the two ordinary words of both edges (cf. the header of the lexicon, the
 * proper rule that is biased).
 */
const AXIS_EN: Readonly<Record<string, 'left' | 'right' | 'neutral' | 'ambiguous'>> = {
  // Left.
  socialist: 'left',
  communist: 'left',
  marxist: 'left',
  anarchist: 'left',
  leftist: 'left',
  'left wing': 'left',
  'social democrat': 'left',
  'trade unionist': 'left',
  feminist: 'left',
  environmentalist: 'left',
  // Right.
  conservative: 'right',
  'right wing': 'right',
  traditionalist: 'right',
  nationalist: 'right',
  monarchist: 'right',
  royalist: 'right',
  libertarian: 'right',
  'fiscal conservative': 'right',
  'social conservative': 'right',
  'classical liberal': 'right',
  // No camp.
  centrist: 'neutral',
  apolitical: 'neutral',
  'politically homeless': 'neutral',
  'swing voter': 'neutral',
  // Ambiguous by dialect — a bucket of its own, cf. the section header.
  liberal: 'ambiguous',
};

const SELF_DECLARED_EN = POLITICS_LEXICON.selfDeclaredEn ?? [];
const sideOfEn = (side: 'left' | 'right' | 'neutral' | 'ambiguous') =>
  SELF_DECLARED_EN.filter((t) => AXIS_EN[t] === side);

/** The storey returned by a REPEATED English self-declaration — the threshold is 2 on this label. */
const stageOfEnSelfDeclaration = (term: string): string => {
  const out = detectLabels([`i am ${term}`, `i am ${term} and always have been`], WIRED_LEXICONS);
  const politics = out.find((d) => d.label === 'politics');
  return politics === undefined ? 'RIEN' : politics.stage;
};

describe('politics symmetry EN — the identity partition is exhaustive', () => {
  it('each English identity of the lexicon is classified', () => {
    expect(SELF_DECLARED_EN.filter((t) => AXIS_EN[t] === undefined)).toEqual([]);
  });

  // The INVERSE direction (CLAUDE.md: a coverage is verified in both directions). Without it, the
  // partition would keep phantoms after a removal and its count would measure a dead list.
  it('each classified identity still exists in the lexicon', () => {
    expect(Object.keys(AXIS_EN).filter((t) => !SELF_DECLARED_EN.includes(t))).toEqual([]);
  });
});

describe('politics symmetry EN — both edges reach the SAME storey', () => {
  // FROZEN COUNT — RECORDED values then frozen, never targets. The 10/10 equality is a FINDING: a
  // list made symmetric by FILLING would be a defect worse than the one being repaired, it would
  // look right. What the number catches is the addition on ONE side only.
  it('the per-camp count is the one that was recorded', () => {
    expect({
      left: sideOfEn('left').length,
      right: sideOfEn('right').length,
      neutral: sideOfEn('neutral').length,
      ambiguous: sideOfEn('ambiguous').length,
    }).toEqual({ left: 10, right: 10, neutral: 4, ambiguous: 1 });
  });

  // FIRST HALF — the equality of REACH. It is the transport of the French property: over there
  // « je suis nationaliste » was mute when « je suis anarchiste » named. Here, no identity can be
  // mute while the one facing it triggers.
  it('any classified identity reaches `indirect`, whatever the camp', () => {
    const muettes = SELF_DECLARED_EN.filter((t) => stageOfEnSelfDeclaration(t) !== 'indirect');
    expect(muettes).toEqual([]);
  });

  // SECOND HALF — the equality of CEILING, and it holds SEPARATELY. If this line goes red, the tier
  // changed storey: say WHICH before updating anything at all. An English `explicit` would mean the
  // product started to NAME a camp on a copula that anchors nothing.
  it('NO English identity reaches the NAMED finding, at any volume', () => {
    const nommées = SELF_DECLARED_EN.filter((t) => {
      const p = `i am ${t}`;
      return detectLabels([p, p, p], WIRED_LEXICONS).some(
        (d) => d.label === 'politics' && d.stage === 'explicit',
      );
    });
    expect(nommées).toEqual([]);
  });

  // ANTI-RECIDIVISM OF THE FRENCH DEFECT — the property nothing else holds. The original defect was
  // not an absence of term: `nationaliste` WAS in the lexicon, at the ACCUSATIONS tier. An English
  // identity that lived in `indirectCore` without being at the identity tier would reproduce exactly
  // that, and the count above would stay green.
  it('no English identity lives in `indirectCore` without being at the identity tier', () => {
    const auxAccusations = Object.keys(AXIS_EN).filter(
      (t) => POLITICS_LEXICON.indirectCore.includes(t) && !SELF_DECLARED_EN.includes(t),
    );
    expect(auxAccusations).toEqual([]);
  });

  // The NEGATIVE control: without it, the assertions above would go green if EVERYTHING tagged.
  it('negative control — a term outside the lexicon stays mute', () => {
    expect(stageOfEnSelfDeclaration('baker')).toBe('RIEN');
    expect(stageOfEnSelfDeclaration('progressive')).toBe('RIEN'); // assumed exclusion, cf. the lexicon
  });
});

/** The English THEMATIC pairs — rule 2 of the lexicon header, put into bookkeeping. */
const EN_PAIRS: readonly (readonly [string, string])[] = [
  ['minimum wage', 'tax burden'],
  ['trade union', 'red tape'],
  ['food bank', 'border control'],
  ['public services', 'law and order'],
];

/** The English entries WITHOUT a camp: acts, institutions, and cross-cutting procedures. */
const EN_UNSIDED: readonly string[] = [
  'i voted',
  'i registered to vote',
  'general election',
  'by election',
  'polling station',
  'postal vote',
  'ballot box',
  'parliament',
  'civil service',
  'public spending',
  'voter turnout',
  // Cross-cutting: used by both edges, like `laicite` on the FR side. `means test` is a procedure
  // one denounces and the other demands; « waste of public money » is a right-wing line as much as
  // « public money built that » is a left-wing line.
  'means test',
  'means tested',
  'public money',
  'cost of living',
];

const ALL_MARKERS: readonly string[] = [
  ...POLITICS_LEXICON.explicit,
  ...POLITICS_LEXICON.indirectCore,
  ...POLITICS_LEXICON.indirectColloquial,
];

describe('politics symmetry EN — the pairs are pairs', () => {
  // THE NON-CIRCULAR PROPERTY of this section, and the only one: a salient theme enters only with
  // its counterpart. Removing a single member of a pair goes red here — it is the gesture that, on
  // the French side, had no reader.
  it('both members of each pair are in the lexicon', () => {
    const orphelins = EN_PAIRS.flatMap(([g, d]) => [g, d].filter((t) => !ALL_MARKERS.includes(t)));
    expect(orphelins).toEqual([]);
  });

  it('the entries without a camp are all present', () => {
    expect(EN_UNSIDED.filter((t) => !ALL_MARKERS.includes(t))).toEqual([]);
  });

  // Each member triggers REALLY, in the barest frame. Without it, a pair could be « complete » in
  // the list and dead in the machinery — the exact defect of `nationaliste`, which was IN the
  // lexicon, at the wrong tier.
  it('each pair member triggers at equal threshold', () => {
    for (const [gauche, droite] of EN_PAIRS) {
      for (const terme of [gauche, droite]) {
        const out = detectLabels(
          [`the ${terme} question again`, `still thinking about the ${terme}`],
          WIRED_LEXICONS,
        );
        expect(out.map((d) => d.label)).toEqual(['politics']);
      }
    }
  });
});

describe('politics symmetry EN — the PATHS, and what two voices do not prove', () => {
  // Two engaged voices written in mirror, equal density (10 stake items each), written as people and
  // not as lists of triggers. They are of MY writing: the count below is an indicator, never a
  // measurement (see the section header).
  const EN_LEFT = [
    'landlords are hoarding empty flats while people sleep outside',
    'the union got us more in one week than five years of asking nicely',
    'billionaires should not exist, that is the whole post',
    'they will means test a food voucher but not a bank bailout',
    'every strike gets called selfish by people who inherited a house',
    'housing is a right not an asset class',
    'the hospital waiting list is a policy choice, not an accident',
    'they cut the budget then act surprised when the service fails',
    'wages have not moved in a decade and rent has doubled',
    'public money built that and a private firm now charges us for it',
  ];
  const EN_RIGHT = [
    'nobody voted for any of this',
    'the borders are a joke and everyone knows it',
    'taxed to death so someone else can sit at home',
    'they call you a bigot for saying what your gran said',
    'law and order used to mean something',
    'my council spends more on flags than on potholes',
    'every form takes an hour and three people to approve',
    'i employ four people and the paperwork costs me a week a month',
    'they raise the rate every year and the roads get worse',
    'the people who make the rules never have to live under them',
  ];

  const paths = (voix: readonly string[]) =>
    detectLabels([...voix], WIRED_LEXICONS).find((d) => d.label === 'politics')?.items.length ?? 0;

  // NUMBER RECORDED THEN FROZEN, and it must be read as it is rather than as one hoped it: **on this
  // pair, only the LEFT voice reaches a finding.** The right stays below the threshold.
  //
  // It is NOT the finding « the English lexicon leans left », and confusing the two would be redoing
  // the error this file exists to prevent. The cause is visible to the eye: both voices speak of the
  // same registers, but the left one wrote two locutions in their CANONICAL form (« means test »,
  // « public money ») when the right one wrote its own in a free form — « taxed to death » and not
  // `tax burden`, « every form takes an hour » and not `red tape`, « the borders are a joke » and
  // not `border control`. The lexicon carries the four terms; it is my PROSE that triggered only one
  // side.
  //
  // Hence the only statement these two voices authorize: the batch opens VERY FEW paths, and which
  // ones open depends on the exact form used, not on the camp. A pair does not settle that — it
  // takes a distribution.
  it('the paths opened by the batch on two engaged voices, in mirror', () => {
    expect({ gauche: paths(EN_LEFT), droite: paths(EN_RIGHT) }).toEqual({ gauche: 2, droite: 0 });
  });

  // THE ENGLISH EQUIVALENT OF THE ABLATION — in French, it had revealed that the right voice hung on
  // ONLY ONE term, its redundancy margin being nil. Here there is no coarse axis to remove (no
  // English identity is delivered), so we remove a single bearing item.
  //
  // Result: the REDUNDANCY MARGIN IS NIL ON BOTH SIDES. The left finding rests on exactly two items,
  // the minimum; removing one makes it disappear. The right one does not exist. It is a symmetry of
  // POVERTY, not of balance — and saying it that way is the only honest reading of a green.
  it('the redundancy margin is NIL on both sides', () => {
    expect(paths(EN_LEFT.filter((t) => !t.includes('means test')))).toBe(0);
    expect(paths(EN_RIGHT.filter((t) => !t.includes('law and order')))).toBe(0);
  });
});
