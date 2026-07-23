// SYMMETRY witness of the `religion` lexicon, BY TRADITION — the net that did not exist when the
// hole got through.
//
// ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────────────────────────────
// The lexicon delivered, in French, a HOLED coverage of traditions: five appellations
// (catholique, musulmane, juive, bouddhiste, protestante) posed a NAMED finding in the most
// ordinary frame, two others (hindoue, sikh) returned NOTHING — not a weaker finding, nothing at
// all. Measured by traced-frame probe, `religion-bench.test.ts`.
//
// No one had written it, and it is the same mechanism as on the political side: each term PRESENT
// was locally defensible, and the defect lived in the COMPOSITION. No re-reading could see it — a
// re-reading verifies that the present terms are legitimate, never that the ABSENT ones are so
// symmetrically. And none of the four sealed voices could see it either: none belongs to the
// missing traditions. It took an out-of-corpus probe.
//
// It is the property that makes this defect costly: a non-detection displays NOTHING. Someone whose
// tradition is missing produces no trace, no red counter — an absence, and an absence looks like a
// clean bench.
//
// ── WHAT THIS WITNESS DOES NOT COVER — to be read BEFORE citing it ────────────────────────────────
// It does NOT measure the product's « religious fairness ». No test can do it, and believing the
// contrary would be the exact over-citation this repo pays seven times over. Precisely:
//
//   · **IT SAYS NOTHING ABOUT THE ABSENT, and it is its hardest limit — the same as the political
//     witness's.** A tradition whose appellation is ENTIRELY missing from the lexicon passes this
//     test green: one can only classify what is there. It is HALF of the original defect, and this
//     net does not catch it. What catches it is elsewhere and stays human: the admission rule
//     written at the head of `lexicon/religion.ts`, and the list of traditions it declares NOT
//     admitted. A green here says nothing of what was never proposed.
//   · **The partition is a JUDGMENT**, written by hand below to be contestable term by term. A
//     reader who contests it contests the witness.
//   · **The counts count ENTRIES, never traditions nor people.** Christianity weighs 8 when Sikhism
//     weighs 2, because French has more common Christian appellations (catholique, catho,
//     protestant·e, évangélique, orthodoxe, chrétien·ne), not because the product favors anyone.
//     **This count is a CHANGE DETECTOR, not a balance measure** — reading it as a score would be
//     using it against its object.
//   · **The ENGLISH side does NOT hold the same properties as the French, and mixing them would be
//     the easiest over-citation of this file.** The French holds a COUNT of appellations; the
//     English has none (no `selfDeclaredEn`), so nothing to count. What it holds is a TRACED-FRAME
//     PROBE and a phaticity guard — two properties of behavior, not of composition. An English green
//     says nothing of the balance of the lists.
//
//     WHAT THIS HEADER SAID BEFORE, and why it was false: « English has no established religious
//     coverage […] there is nothing to partition ». The premise was false all along. Eight English
//     surfaces triggered by spelling coincidence, spread islam 5 / judaism 2 / christianity 2 /
//     buddhism 0 / hinduism 0 / sikhism 0. The bench this sentence was drawn from had asked WHETHER
//     THERE WAS a coverage, never WHICH — and six probes reach six words. There was something to
//     partition, and it leaned.
//   · **It covers only two tiers** — the self-declaration appellations and the domain names.
//     The places, texts, rites and figures (`mosquee`, `coran`, `imam`, `messe`…) are NOT paired
//     by tradition here: they have no term-to-term correspondence from one tradition to another, and
//     forcing a pairing would fabricate a symmetry the language does not carry.
//     The possible asymmetry of that tier is **not measured**.
//
// What it holds, on the other hand, it holds hard: it goes red if someone adds an appellation
// without saying which tradition it belongs to, if a tradition loses its domain name, and if a
// present appellation stops producing a named finding.
//
// ── HOW IT GOES RED, in TWO steps — verified by mutation, in both directions ──────────────────────
// Adding an appellation does not make the count go red right away, and it is intended:
//   1. the added term is not classified → EXHAUSTIVENESS goes red. The author must say which
//      tradition it belongs to, which is the gesture that was missing;
//   2. once classified, the COUNT goes red by naming the tradition.
// Two stops are better than one: the first forces the judgment, the second forces looking at the
// other traditions. A removal goes red in a single step (inverse exhaustiveness + count).
//
// SIX MUTATIONS RUN, and their result RECORDED — not « the witness would go red », but what it did.
// A mutation that does not go red is a hole in the net, and writing it is the only way a reader can
// verify that this file holds what its header promises:
//
//   1. appellation added WITHOUT classification    → exhaustiveness                     (1 red)
//   2. the same, once CLASSIFIED                   → count, naming the tradition         (1 red)
//   3. appellation REMOVED from the lexicon        → inverse exhaustiveness + count      (2 reds)
//   4. domain name REMOVED                         → pairing of the two tiers            (1 red)
//   5. ORIGINAL DEFECT reproduced — an appellation sent back to the broad tier only, very exactly
//      the shape `hindou` and `sikh` had before the review → inverse exhaustiveness + count +
//      pairing                                                                          (3 reds)
//   6. posture RAISED to self-declaration (`athee`), that is the ratified demotion undone →
//      exhaustiveness + posture guard                                                   (2 reds)
//
// N°5 is the one that matters: it is the defect this file exists to prevent from coming back, and it
// is stopped three times. N°6 is the one that protects the maintainer's decision from a competing
// batch.
//
// FIVE MORE MUTATIONS for the ENGLISH side, run the same way and recorded likewise:
//
//   7. `church` REMOVED from the lexicon            → traced frame of the places          (1 red)
//   8. `blessed` ADMITTED, that is the phaticity line undone → formula + path             (2 reds)
//   9. `sikhism` REMOVED                            → traced frame of the domain           (1 red)
//  10. `the temple` brought back to the BARE word   → FR collision (`lexicon-battery`)     (1 red)
//  11. EN copula head wired into `filters-fr.ts` → English self-declaration named          (1 red)
//
// N°8 is the one that matters for this side: it goes red TWICE, at the formula and at the path, and
// it is the intended doubling — the first says « it triggers », the second says « and here is by
// which word ». N°10 holds an implementation decision that no comment would make enforceable.
//
// THREE MORE MUTATIONS for the FR SYMMETRY batch, run and recorded the same way:
//
//  12. `incroyant` REMOVED from the lexicon          → posture guard + behavior            (2 reds)
//  13. `incroyant` PROMOTED to self-declaration, that is the demotion of the non-believer pole
//      undone on a new term → exhaustiveness + posture guard + behavior                    (3 reds)
//  14. `laique` ADMITTED, that is the civic exclusion line undone → set-aside line          (1 red)
//
// N°12 is the one that shows the intended DOUBLING: the first goes red on the LIST, the second on
// the BEHAVIOR. Without the second, an entry could stay in `indirectCore` while returning nothing
// in the ordinary frame — the exact defect of `nationaliste`, which was IN the political lexicon, at
// the wrong tier. N°13 is the one that matters: it protects the maintainer's storey decision against
// a batch that would « harmonize » the non-believer pole upward.
//
// N°11 IS A CONFESSION, and it is worth reading before trusting this file. The first version of the
// self-declaration assertion tested « i am muslim » and « im catholic ». But `catholic` is in no
// tier, and « i am » is not the head the mutation adds: it went GREEN under the very mutation it
// claimed to catch, because it reached nothing. The hole was invisible — the assertion looked like
// it covered the question. It is the CLAUDE.md motive (*a negative assertion verifies what it
// REACHES*) committed inside the net written to prevent it, and it was found only because the
// mutation was actually run.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { RELIGION_LEXICON } from '../lexicon/religion';
import { detectLabels } from './detect';

/**
 * THE PARTITION — the judgment this witness puts in writing, so that it can be contested.
 *
 * `posture` is NOT a tradition: it is the register of adhesion itself (croyant, pratiquant), which
 * designates no particular membership. This bucket exists so that the partition does not have to
 * force a tradition onto terms that carry none — without it, we would fabricate symmetry by filing
 * arbitrarily.
 */
type Family =
  | 'christianity'
  | 'islam'
  | 'judaism'
  | 'buddhism'
  | 'hinduism'
  | 'sikhism'
  | 'posture';

const TRADITION: Readonly<Record<string, Family>> = {
  // Christianity — French carries the most common appellations here. Cf. the header: it is a fact
  // of language, and the count does not make it a score.
  chretien: 'christianity',
  chretienne: 'christianity',
  catholique: 'christianity',
  catho: 'christianity',
  protestant: 'christianity',
  protestante: 'christianity',
  evangelique: 'christianity',
  orthodoxe: 'christianity',
  // Islam — `muslim` / `muslima` are lexicalized borrowings used by francophones.
  musulman: 'islam',
  musulmane: 'islam',
  muslim: 'islam',
  muslima: 'islam',
  // Judaism.
  juif: 'judaism',
  juive: 'judaism',
  // Buddhism.
  bouddhiste: 'buddhism',
  // Hinduism and Sikhism — admitted at the coverage review, the hole having been measured.
  hindou: 'hinduism',
  hindoue: 'hinduism',
  sikh: 'sikhism',
  sikhe: 'sikhism',
  // Without tradition — adhesion itself.
  croyant: 'posture',
  croyante: 'posture',
  pratiquant: 'posture',
  pratiquante: 'posture',
};

/**
 * The expected DOMAIN name for each tradition — rule (3) of the lexicon put into bookkeeping:
 * a tradition enters both tiers, never a single one. `posture` has none, and expects none.
 */
const DOMAIN_NOUN: Readonly<Record<Exclude<Family, 'posture'>, string>> = {
  christianity: 'christianisme',
  islam: 'islam',
  judaism: 'judaisme',
  buddhism: 'bouddhisme',
  hinduism: 'hindouisme',
  sikhism: 'sikhisme',
};

/**
 * The POSTURES held at the BROAD tier by the ratified demotion — never in self-declaration.
 *
 * The last six entered with the FR symmetry batch: `athee` was wired, its ordinary neighbors of the
 * same pole were not. They are held HERE rather than elsewhere because the decision that governs
 * them is the same — the non-believer pole keeps its signal and does not affirm.
 *
 * WHAT THIS LIST DOES NOT SETTLE, and writing it prevents a green from letting one believe it: it
 * says nothing of the LEGITIMACY of the storey asymmetry between `croyant` (named) and `athee`
 * (broad). The reasoning lives at the lexicon entry; this test holds only that the decision has not
 * moved.
 */
const BROAD_POSTURES: readonly string[] = [
  'athee',
  'atheisme',
  'agnostique',
  'agnosticisme',
  'incroyant',
  'incroyante',
  'non croyant',
  'non pratiquant',
  'anticlerical',
  'anticlericalisme',
];

const SELF_DECLARED = RELIGION_LEXICON.selfDeclaredFr ?? [];
const familyOf = (f: Family) => SELF_DECLARED.filter((t) => TRADITION[t] === f);

/** The storey returned by an isolated self-declaration — the gesture the original hole muted. */
const stageOfSelfDeclaration = (term: string): string => {
  const out = detectLabels([`je suis ${term} depuis toujours`], WIRED_LEXICONS);
  return out.find((d) => d.label === 'religion')?.stage ?? 'RIEN';
};

describe('religion symmetry — the partition is exhaustive', () => {
  // EXHAUSTIVENESS PROPERTY, and it is what makes the witness alive rather than decorative: an
  // appellation added to the lexicon without being classified goes red here. The author of the next
  // entry is therefore OBLIGED to say which tradition it belongs to — that is, to look at the other
  // traditions.
  it('every lexicon appellation is classified (otherwise the witness would be blind to additions)', () => {
    expect(SELF_DECLARED.filter((t) => TRADITION[t] === undefined)).toEqual([]);
  });

  // The INVERSE direction of the same coverage (CLAUDE.md: it is verified in both directions).
  // Without it, the partition would keep ghost terms after a lexicon removal, and its count would
  // measure a dead list.
  it('every classified appellation still exists in the lexicon', () => {
    expect(Object.keys(TRADITION).filter((t) => !SELF_DECLARED.includes(t))).toEqual([]);
  });
});

describe('religion symmetry — every tradition is present at BOTH tiers', () => {
  // THE FROZEN COUNT — the trigger we want: adding an appellation to a single tradition changes one
  // of these numbers, and the test goes red by naming which. These are not targets, they are
  // RECORDED values then frozen. Re-read the header before seeing a score in it: 8 against 2 is a
  // fact of the French language, not a preference of the product.
  it('the per-tradition count is the one that was recorded', () => {
    expect({
      christianity: familyOf('christianity').length,
      islam: familyOf('islam').length,
      judaism: familyOf('judaism').length,
      buddhism: familyOf('buddhism').length,
      hinduism: familyOf('hinduism').length,
      sikhism: familyOf('sikhism').length,
      posture: familyOf('posture').length,
    }).toEqual({
      christianity: 8,
      islam: 4,
      judaism: 2,
      buddhism: 1,
      hinduism: 2,
      sikhism: 2,
      posture: 4,
    });
  });

  // RULE (3) OF THE LEXICON, held rather than promised: an admitted tradition enters BOTH TIERS.
  // An appellation without a domain name (or the reverse) is an orphan entry — it is exactly the
  // shape `hindouisme` and `sikhisme` had before the review: absent from both sides, therefore
  // invisible to any re-reading that looked at only one tier.
  it('every tradition has its appellation AND its domain name', () => {
    const orphelines = Object.entries(DOMAIN_NOUN).filter(
      ([family, noun]) =>
        familyOf(family as Family).length === 0 || !RELIGION_LEXICON.indirectCore.includes(noun),
    );
    expect(orphelines).toEqual([]);
  });

  // THE SUBSTANTIVE PROPERTY, and the only one that speaks of BEHAVIOR rather than of a list: an
  // isolated appellation, in the most ordinary frame, must produce a NAMED finding — whatever the
  // tradition. It is exactly what was false before the review, and a balanced count would not have
  // revealed it: the term must be IN the lexicon AND at the right tier.
  it('any classified appellation produces a NAMED finding, whatever the tradition', () => {
    const muettes = SELF_DECLARED.filter((t) => stageOfSelfDeclaration(t) !== 'explicit');
    expect(muettes).toEqual([]);
  });

  // The NEGATIVE control of the assertion above: without it, it would go green if everyone tagged,
  // including what should not. A word outside the lexicon must stay mute — and the second control
  // additionally verifies the word boundary, `orthodontiste` almost containing `orthodoxe`.
  it('negative control — a word outside the lexicon does not tag', () => {
    expect(stageOfSelfDeclaration('boulanger')).toBe('RIEN');
    expect(stageOfSelfDeclaration('orthodontiste')).toBe('RIEN');
  });
});

describe('religion symmetry — the POSTURES stay at the BROAD tier', () => {
  // The ratified demotion, held by a test rather than by an intention. `athee` and `agnostique`
  // describe a position ON religion, not a membership: at the named tier, the classified fan would
  // put « practice / membership » at the head of an atheist's card. At the broad tier it is flat,
  // and « personal opinion » — already written — displays on equal footing.
  //
  // Both assertions are NECESSARY and say two different things: the first that the term is indeed at
  // the broad tier, the second that it has NOT come back into self-declaration. Without the second,
  // a reintroduction into `selfDeclared` would leave the first green — the term would then tag as
  // named, and the test would still say « broad » on the bare sentence.
  it('the postures tag as BROAD, and are not in self-declaration', () => {
    for (const posture of BROAD_POSTURES) {
      expect(RELIGION_LEXICON.indirectCore.includes(posture)).toBe(true);
      expect(SELF_DECLARED.includes(posture)).toBe(false);
    }
    expect(stageOfSelfDeclaration('athee')).toBe('indirect');
    expect(stageOfSelfDeclaration('agnostique')).toBe('indirect');
  });

  // THE BEHAVIOR HALF of the six entries of the symmetry batch. Without it, the block above verifies
  // only their MEMBERSHIP IN A LIST — and an entry can be in `indirectCore` without returning
  // anything in the ordinary frame (it is the exact defect of `nationaliste`, which was IN the
  // political lexicon, at the wrong tier). Only the ADJECTIVAL forms are tested: « je suis
  // anticléricalisme » is not a sentence, and probing a form no one writes would measure the grammar
  // instead of the lexicon.
  it('the non-believer pole triggers REALLY, and at the broad tier', () => {
    const rendus = ['incroyant', 'incroyante', 'non croyant', 'non pratiquant', 'anticlerical'].map(
      (t) => `${t}:${stageOfSelfDeclaration(t)}`,
    );
    expect(rendus).toEqual([
      'incroyant:indirect',
      'incroyante:indirect',
      'non croyant:indirect',
      'non pratiquant:indirect',
      'anticlerical:indirect',
    ]);
  });

  // THE SET-ASIDE LINE, held by a test rather than by a comment. `laique` is the CIVIC vocabulary of
  // institutions, not a personal position on belief: measured, « une école laïque » would trigger on
  // a sentence of school policy. Its probable home is `politics`. The two assertions say two things —
  // that it does not tag, AND by which path the zero arrives.
  it('SET ASIDE — `laique` does not tag, and it is not a frame accident', () => {
    expect(stageOfSelfDeclaration('laique')).toBe('RIEN');
    expect(detectLabels(['une ecole laique'], WIRED_LEXICONS)).toEqual([]);
    const tous = [
      ...RELIGION_LEXICON.indirectCore,
      ...RELIGION_LEXICON.indirectColloquial,
      ...RELIGION_LEXICON.explicit,
      ...SELF_DECLARED,
    ];
    expect(tous.filter((t) => t === 'laique' || t === 'laicite')).toEqual([]);
  });
});

// ── THE ENGLISH SIDE ──────────────────────────────────────────────────────────────────────────────
// It does NOT reproduce the count of the French side, and the refusal is the result: the count
// partitions self-declaration APPELLATIONS, and English has none (the language gate stays closed,
// `selfdeclared-language-gate.test.ts`). Transporting the count would have built a net measuring an
// empty list — the exact defect met by the `politics` batch, whose FR axis crossed nothing of what
// the EN batch delivered.
//
// The term-to-term pairing of places, texts and figures stays refused for the reason already
// written above — forcing a correspondence would fabricate a symmetry the language does not carry —
// and English makes it harder still: it has secularized (`karma`, `zen`, `guru`, `mantra`) very
// exactly the vocabulary of the traditions that were at zero.
//
// What transports is the TRACED-FRAME PROBE: same syntactic frame, only the word changes. It is not
// a pairing of lists, it is a property of behavior in a single frame — and it is the shape that had
// found the `hindou` / `sikh` hole the four sealed voices could not see.

/** The storey returned by an isolated English probe, or `RIEN`. */
const stageOfEn = (text: string): string =>
  detectLabels([text], WIRED_LEXICONS).find((d) => d.label === 'religion')?.stage ?? 'RIEN';

/** The six traditions and their English domain name — the tier where the measured gap is closed. */
const EN_DOMAIN: readonly string[] = [
  'christianity',
  'islam',
  'judaism',
  'buddhism',
  'hinduism',
  'sikhism',
];

/**
 * One ordinary place of worship per tradition, when the language carries one. `temple` figures here
 * in its PHRASAL form (`the temple`) and not bare: the detector routes nothing by language, and the
 * bare word re-tagged the French anatomical turn. The full reason lives at the lexicon entry.
 */
const EN_PLACE: readonly string[] = ['church', 'mosque', 'synagogue', 'temple', 'gurdwara'];

describe('religion symmetry EN — the traced frame, all traditions at the same storey', () => {
  // THE PROPERTY THAT REPLACES THE COUNT. It does not say the traditions are covered equally — they
  // are not, and the lexicon declares why (English secularized the words of some and not others).
  // It says that NONE is MUTE in the most ordinary frame. It is very exactly what was false before
  // this batch, on three traditions.
  it('every domain name triggers, and at the SAME storey', () => {
    const rendus = EN_DOMAIN.map((t) => `${t}:${stageOfEn(`i have been reading about ${t}`)}`);
    expect(rendus).toEqual(EN_DOMAIN.map((t) => `${t}:indirect`));
  });

  it('every place of worship triggers, and at the SAME storey', () => {
    const rendus = EN_PLACE.map((p) => `${p}:${stageOfEn(`i go to the ${p} every week`)}`);
    expect(rendus).toEqual(EN_PLACE.map((p) => `${p}:indirect`));
  });

  // THE PRIOR STATE, frozen so the repair stays legible. Without it, the update would erase the
  // finding instead of recording it: in the exact frame above, `christianity`, `judaism`,
  // `buddhism`, `hinduism`, `sikhism`, `church`, `mosque`, `temple` and `gurdwara` all returned
  // `RIEN`, while `islam` and `synagogue` returned a broad finding. It is the asymmetry by spelling
  // accident, and it is what these two assertions exist to prevent from coming back.

  // THE NEGATIVE CONTROL, without which the two assertions would go green if EVERYTHING triggered —
  // including what must not. The second additionally tests the word boundary.
  it('negative control — a word outside the lexicon stays mute, and the word boundary holds', () => {
    expect(stageOfEn('i go to the bakery every week')).toBe('RIEN');
    expect(stageOfEn('i have been reading about templeton')).toBe('RIEN');
  });

  // ENGLISH NEVER NAMES on this label, and it is a property of the BATCH, not a side effect: the
  // broad tier is its ceiling, for lack of `selfDeclaredEn`. Two halves, and they do not hold by the
  // same mechanism — separating them is what prevents one from covering the other by deception.
  //
  // FIRST HALF — the vocabulary delivered by this batch. None of its entries can name, because none
  // is at the `explicit` tier. It is what this assertion REACHES, and nothing more.
  it('no term of the English batch poses a NAMED finding', () => {
    const nommes = [...EN_DOMAIN, ...EN_PLACE]
      .map((t) => `${t} → ${stageOfEn(t)}`)
      .filter((l) => l.endsWith('explicit'));
    expect(nommes).toEqual([]);
  });

  // SECOND HALF — the self-declaration, and it holds by the LANGUAGE GATE, not by the batch.
  //
  // THIS ASSERTION WAS WRITTEN FALSE A FIRST TIME, and correcting it was better than recording it
  // green. It tested « i am muslim » and « im catholic » — but `catholic` is in no tier (only
  // `catholique` is), and « i am » is not the head the mutation adds. It therefore went green under
  // the mutation it claimed to catch: it reached nothing. It is the CLAUDE.md motive committed in
  // the net meant to hold it, and it was seen only because the mutation was actually run.
  //
  // The version that follows crosses the THREE forms of English copula with the English spellings
  // ACTUALLY present at the `selfDeclaredFr` tier of this lexicon. It deliberately overlaps
  // `selfdeclared-language-gate.test.ts`, and the overlap is the point: the gate holds the property
  // for the three labels and would go red if `muslim` left the tier; this one holds it for
  // `religion` by interrogating the BEHAVIOR, and also goes red if the term is moved.
  it('no English self-declaration NAMES, under the three copula forms', () => {
    const graphiesEn = ['muslim', 'muslima', 'protestant', 'sikh'];
    const nommes = ['im', 'i am', "i'm"].flatMap((copule) =>
      graphiesEn
        .map((t) => `${copule} ${t} → ${stageOfEn(`${copule} ${t}`)}`)
        .filter((l) => l.endsWith('explicit')),
    );
    expect(nommes).toEqual([]);
  });
});

// ── THE PHATICITY GUARD ─────────────────────────────────────────────────────────────────────────
// It holds the SUBSTANTIVE DECISION of the English batch (ADR-0003, *le marqueur de sociolecte*):
// the word that NAMES enters, the word that DOES does not enter. Without it, nothing would hold it —
// the line would live in a comment, and the next vocabulary addition would have no reason to meet
// it.
//
// IT VERIFIES THE PATH, and that is its whole point. A `RIEN` on « oh my god » looks like a held
// line; it could just as well come from a word absent for an unrelated reason, from a word
// boundary, or from a filter. The second assertion dismantles the zero: it verifies that no
// constitutive word of these formulas is in the lexicon. The two together say « it does not trigger,
// AND it is indeed because the line refused it » (CLAUDE.md, *What a net proves*).
const FORMULES_PHATIQUES: readonly string[] = [
  'oh my god',
  'thank god',
  'bless you',
  'so blessed right now',
  'amen to that',
  'preaching to the choir',
  'godspeed',
  'hallelujah',
  'that is such bad karma',
  'he is a productivity guru',
  'my desk setup is very zen',
  'my mantra is ship it',
];

/** The words whose admission would undo the line — the anti-vacuity of the guard above. */
const MOTS_PHATIQUES: readonly string[] = [
  'god',
  'bless',
  'blessed',
  'amen',
  'preach',
  'preaching',
  'choir',
  'godspeed',
  'hallelujah',
  'karma',
  'guru',
  'zen',
  'mantra',
];

describe('religion EN — the phaticity guard, and by which path its zero arrives', () => {
  it('no phatic formula poses a finding', () => {
    const declenchent = FORMULES_PHATIQUES.filter((f) => stageOfEn(f) !== 'RIEN');
    expect(declenchent).toEqual([]);
  });

  it('BY WHICH PATH — no constitutive word is in the lexicon', () => {
    // It is the assertion that prevents the previous one from being vacuous. If someone admits
    // `blessed` tomorrow, the first goes red on a formula; this one goes red on the WORD, and names
    // which.
    const tous = [
      ...RELIGION_LEXICON.indirectCore,
      ...RELIGION_LEXICON.indirectColloquial,
      ...RELIGION_LEXICON.explicit,
      ...(RELIGION_LEXICON.selfDeclaredFr ?? []),
    ];
    expect(MOTS_PHATIQUES.filter((m) => tous.includes(m))).toEqual([]);
  });

  // THE BOUNDARY OF THE LINE, measured and not supposed — and it is the exact counterpart of the
  // bench's negation boundary. `prayer` is ADMITTED: it NAMES a thing, it is the counterpart of the
  // French `priere`, and its dominant use is not phatic. The consequence is that the most canonical
  // condolence formula of English triggers, although it is phatic through and through. The line
  // treats the TERMS whose dominant use is phatic, never the locutions built on a naming term — as
  // the demotion treats the most frequent form and not the class.
  // Writing it here rather than leaving it to be guessed is what prevents the guard from being
  // over-cited.
  it('BOUNDARY — « thoughts and prayers » triggers, and it is not a hole in the guard', () => {
    expect(stageOfEn('thoughts and prayers')).toBe('indirect');
  });
});
