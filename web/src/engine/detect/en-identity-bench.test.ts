// `en_identity` bench — the MEASUREMENT of the five voices sealed in `en-identity-registers.fixture.ts`.
//
// ── WHAT THIS BENCH DOES NOT COVER ───────────────────────────────────────────────────────────────
// The boundaries of the FIXTURE hold here without being recopied (a single voice per situation, no
// hostile register, `politics` carried by no one, the body kept clear of the life bands). What the
// present file adds as its own limit:
// - **The five numbers never sum.** Five voices, five distinct questions. A total or an average
//   destroys precisely what reads here.
// - **The harness counts CELLS, not reasons.** It is the limit that decides the reading of this
//   bench, and the block `THE GREEN COUNTER THAT PROVES NOTHING` below shows it bites for real on
//   `en_misread`.
// - **No measurement of the interface.** This bench says nothing of what the user READS; it measures
//   storeys and evidence.
//
// ── THE FIVE SEALED PREDICTIONS, AND THEIR FATE ──────────────────────────────────────────────────
// Written in advance in the `truthNotes`, drawn from the probe. Publishing them winning AND losing
// is what gives them value:
//
//   (1) `en_practising` — CONFIRMED, and to the letter. She triggered, but NONE of her five pieces
//       of evidence was her membership: `prayer`, `halal`, `mosque`, `ramadan`, `eid`. The product
//       saw her only by what she DOES. ⚑ REPAIRED since (EN adjectives batch): six pieces of
//       evidence, her « i am muslim » is one of them.
//   (2) `en_trans_lived` — CONFIRMED, and more narrowly than sealed. ONE single piece of evidence,
//       the only item where she writes the long form. Her self-declaration « i am trans » weighs
//       nothing.
//   (3) `en_idiomatic` — CONFIRMED, and WORSE than sealed. I predicted wrongs; I get a wrong at a
//       NAMED finding (`health_physical[explicit]`) on a joke about a cake.
//   (4) `en_left_evangelical` — CONFIRMED. She triggers, with SIX pieces of evidence against five
//       for the practising woman: the « having left » side was better covered than the « practicing »
//       side. ⚑ EQUALIZED since, FROM ABOVE — 6 against 6, no evidence removed from anyone.
//   (5) `en_misread` — CONFIRMED in both its parts, and it was the hardest result of the batch:
//       the only identity the product knew how to see in her was the one she DENIES.
//       ⚑ REPAIRED since. Her item #0 counts, and TWO independent paths carry her. The dedicated
//       block keeps the before state alongside the after — it was the deliverable of the adjectives
//       batch.
//
// ── TWO WRITING INFERENCES PUBLISHED FALSE ───────────────────────────────────────────────────────
// (1) Reading the evidence, I first concluded that the English negation filter worked, because
//     « i am not religious anymore » produced nothing on `en_left_evangelical`.
//     IT WAS FALSE: this zero came from the ABSENCE of the term `religious`, not from the filter.
//     (The term is admitted since, and the zero of the negated form changed cause — see the
//     `NÉGATION` block.)
// (2) And the CONCLUSION drawn from the `NÉGATION` block was false in turn, it traveled all the way
//     to the debt note, and it was corrected there: « the English negation filter is
//     LABEL-SPECIFIC » described as a defect what is a RATIFIED `subjectNotState`. On a SUBJECT
//     label the negation carries the POLARITY and degrades instead of suppressing. There was never a
//     filter to write. A false debt entry sends the next session hunting a defect that does not
//     exist — more costly than a missing entry.
//
// ── BY WHICH PATH THE ZEROS ARRIVE ───────────────────────────────────────────────────────────────
// CLAUDE.md, *What a net proves*. Three zeros of this bench look like filters that work: one is one,
// the two others are absences of vocabulary, and nothing in a counter distinguishes them. The
// assertions below demonstrate it instead of supposing it.
//
// ── THE MUTATIONS RUN, AND WHAT THEY DID ─────────────────────────────────────────────────────────
// Carried out in a separate worktree, never in the shared tree — a mutation from a previous session
// had been briefly visible there and reported as a real defect by a concurrent session. What follows
// is what the mutations REALLY did, not what one expected of them:
//
//   · M1 — remove the word `gay` from item #2 of `en_misread` (« people assume i am gay » becomes
//     « people assume things about me »). FOUR assertions go red, and the result exceeds the
//     witness: `en_misread` leaves the label ENTIRELY and joins `missedRecall`. The mutation
//     therefore does not only prove that the bench watches — it materially establishes that this
//     woman's whole presence in `sexuality` hangs on ONE word naming an identity that is not hers.
//   · M2 — replace `diabetes` with `sugar` in item #8 of `en_idiomatic`. The wrong at the NAMED
//     finding disappears, and with it item #14 (`allergic to`): the evidence goes from `[8, 14]` to
//     `[]`. UNPREDICTED RESULT, and it is worth publishing — `allergic to` alone was not enough, it
//     was retained only because `diabetes` had taken the label above the threshold. A weak term thus
//     becomes a cited piece of evidence thanks to a strong term, and the threshold does not protect
//     from that.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { detectLabels } from './detect';
import { EN_IDENTITY_REGISTER_PERSONAS } from './en-identity-registers.fixture';
import { detectFor, expectBenchCounts } from './register-bench.harness';

const byId = (id: string) => {
  const persona = EN_IDENTITY_REGISTER_PERSONAS.find((p) => p.id === id);
  if (persona === undefined) throw new Error(`persona \`${id}\` absente de la fixture`);
  return persona;
};

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

/** The item indices cited as evidence for a label — the grain where the defect lives. */
const evidenceOf = (id: string, label: string) =>
  (detectFor(byId(id)).find((d) => d.label === label)?.items ?? []).map((i) => i.itemIndex);

const x3 = (t: string) => runOn([t, t, t]);

describe('en_identity bench — common counting', () => {
  expectBenchCounts(EN_IDENTITY_REGISTER_PERSONAS, {
    // THREE wrongs, and they do not read the same way — hence the ban on summing them.
    // `en_trans_lived/religion` is a concert HALL (« church hall »): it is the third time in this
    // repo that a place produces a religious finding, after a catering search and a rehearsal place
    // with good acoustics.
    // The two wrongs of `en_idiomatic` are the true floor of English false positives, and the first
    // is at a NAMED finding.
    torts: ['en_trans_lived/religion', 'en_idiomatic/health_physical', 'en_idiomatic/religion'],
    // No over-classification: `en_left_evangelical` stays at the BROAD finding, the storey its seal
    // expected. It is the only good news of the batch, and it is real.
    escalated: [],
    // No annotator correction: I contest none of the five seals after measurement.
    corrections: [],
    tortsAfterCorrection: [
      'en_trans_lived/religion',
      'en_idiomatic/health_physical',
      'en_idiomatic/religion',
    ],
    // MIND THE READING — this `[]` is the most deceptive counter of the file. It says the three
    // lived voices carry a tag. It says NOTHING of the reason they carry it, and on `en_misread` the
    // reason is the worst possible. See the dedicated block.
    missedRecall: [],
    missedSignal: [],
    livedStages: {
      // The three lived voices ceiling at the BROAD finding. None reaches the named finding, where
      // the equivalent French voices of the previous batches reach it for the same life.
      en_practising: 'indirect',
      en_trans_lived: 'indirect',
      en_misread: 'indirect',
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// THE GREEN COUNTER THAT PROVES NOTHING — `en_misread`
// ─────────────────────────────────────────────────────────────────────────────────────────────────

describe('en_misread — the defect is REPAIRED, and here is by which path', () => {
  // THIS BLOCK CHANGED MEANING, AND IT IS THE DELIVERABLE OF THE ADJECTIVES BATCH. It recorded the
  // defect the symmetry rule exists to forbid: all the harness counters were green while the only
  // identity visible in her was the one she DENIES. The assertions are not removed, they are TURNED
  // — the before state stays written alongside the after state, without which the update would erase
  // the finding instead of recording it.

  it('her evidence is no longer ONLY the identity she DOES NOT HAVE — her item #0 counts', () => {
    // BEFORE: `[2]` — item #2 alone (« people assume i am gay because of the hair and the rugby »),
    // that is a report of assignment by others, and nothing else.
    // AFTER: `[0, 2]` — item #0 (« i am straight, for the fortieth time ») finally enters.
    expect(evidenceOf('en_misread', 'sexuality')).toEqual([0, 2]);
  });

  it('her TRUE self-declaration finally weighs — the symmetry rule is HELD on her', () => {
    // BEFORE: the first two lines returned `RIEN` when the third already returned
    // `sexuality[indirect]`. A majority self-declaration mute in front of an audible minority one:
    // it is the very definition of a minority detector.
    // AFTER: the three return the SAME storey. It is what the rule asks — « exactly as much », not
    // « in its turn ».
    expect(x3('i am straight, for the fortieth time, she is my flatmate')).toBe(
      'sexuality[indirect]',
    );
    expect(x3('i am straight')).toBe('sexuality[indirect]');
    expect(x3('i am gay')).toBe('sexuality[indirect]');
  });

  it('TWO INDEPENDENT PATHS now carry her — the redundancy margin, per path', () => {
    // ADR-0003 (*La symétrie d'un axe*): what is verified is not the count but the REDUNDANCY MARGIN
    // — how many independent paths lead to a finding from each side. A per-item ablation measures it
    // directly, and it is the only instrument that sees it.
    //
    // BEFORE, the ablation said the defect in two lines:
    //   · removing item #0 (her declaration) → `sexuality[indirect]`, UNCHANGED: she weighed nothing;
    //   · removing item #2 (the assignment)  → `RIEN`: all her detectability hung on others.
    // AFTER, both ablations leave a finding, each by the other path. Neither of the two items is
    // load-bearing on its own anymore.
    expect(without('en_misread', 0)).toBe('sexuality[indirect]');
    expect(without('en_misread', 2)).toBe('sexuality[indirect]');
  });

  it('WHAT IS NOT REPAIRED — third-party attribution still tags her', () => {
    // Not to be read into the green above. Her item #2 keeps producing a piece of evidence: the batch
    // adds the missing path, it removes none. Third-party attribution is filtered on no label, it is
    // an ORTHOGONAL and whole debt, and any vocabulary extension mechanically increases its surface —
    // now on both sides of the axis, which is the least bad form of growth of a defect, not its
    // absence.
    expect(x3('people assume i am gay because of the hair and the rugby')).toBe(
      'sexuality[indirect]',
    );
    expect(x3('people assume i am straight')).toBe('sexuality[indirect]');
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// NEGATION — what the filter does, and where it does not go
// ─────────────────────────────────────────────────────────────────────────────────────────────────

describe('English negation differs by label — and it is the doctrine, not a hole', () => {
  it('`sexuality` — the negation is filtered, and it is a real filter', () => {
    // The zero does arrive by the filter and not by an absence: the affirmative form triggers.
    expect(x3('i am gay')).toBe('sexuality[indirect]');
    expect(x3('i am not gay')).toBe('RIEN');
    expect(x3('i am not gay, i just have not fancied anyone i have met lately')).toBe('RIEN');
  });

  it('`religion` — the negation does not SUPPRESS, and it is not a filter defect', () => {
    // CORRECTION OF A READING, carried by this file and by the debt note: the gap between the two
    // labels was read as « the English negation filter is label-specific », therefore as a gap to
    // fill. It is not one — it is `subjectNotState` doing exactly what was RATIFIED (ADR-0003,
    // *L'état et le sujet*).
    //
    // On a SUBJECT label, negating the predicate does not remove the subject: « je ne vais pas à la
    // messe » is about religion, and the negation says its POLARITY. The rule DEGRADES explicit →
    // indirect; a marker already indirect has nowhere to descend, hence the equality below. A batch
    // that would « repair » that would make the product deaf to opposition, which is the dominant
    // register of religious discourse — very exactly the selective silence ADR-0003 condemns.
    //
    // The contrast with `sexuality` just above therefore does not oppose a filter to an absent
    // filter: it opposes a STATE label to a SUBJECT label, and both behave as expected.
    expect(x3('i am evangelical')).toBe('religion[indirect]');
    expect(x3('i am not evangelical')).toBe('religion[indirect]');
    expect(x3('i am agnostic')).toBe('religion[indirect]');
    expect(x3('i am not agnostic')).toBe('religion[indirect]');
  });

  it('« i am religious » — the term was ABSENT; it is there, and its negated zero changed cause', () => {
    // BEFORE: BOTH lines returned `RIEN`, and it was the inference published false at the head of the
    // file — the zero of the negated form did not measure the filter, it measured an absent term.
    //
    // AFTER, the term is admitted, and the two zeros separate. The new zero of the negated form has a
    // NAMED and verifiable cause: the negation BREAKS THE self-declaration PATTERN (« not » is not a
    // modifier, so the term is no longer glued to the copula). It is neither the negation filter nor
    // `subjectNotState` — it is the structure of the pattern.
    expect(x3('i am religious')).toBe('religion[indirect]');
    expect(x3('i am not religious')).toBe('RIEN');
  });

  it('third-party ATTRIBUTION is filtered on neither of the two labels', () => {
    // Neither negation nor quotation: someone reports what is attributed to them. The filter does not
    // cover this form, and it is exactly there that `en_misread` is tagged.
    expect(x3('people assume i am gay because of the hair and the rugby')).toBe(
      'sexuality[indirect]',
    );
    expect(x3('my friend thinks i am gay')).toBe('sexuality[indirect]');
    expect(x3('they keep saying i am gay')).toBe('sexuality[indirect]');
    expect(x3('she assumes i am agnostic')).toBe('religion[indirect]');
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// MEMBERSHIP WEIGHS NOTHING — the two lived voices, and what really carries them
// ─────────────────────────────────────────────────────────────────────────────────────────────────

describe('what carries the finding is never the identity', () => {
  it('`en_practising` — SIX pieces of evidence, and her membership is finally one of them', () => {
    // BEFORE: `[1, 3, 4, 5, 6]` — prayer, halal, mosque, ramadan, eid. Five pieces of PRACTICE
    // evidence, and item #0 (« i am muslim ») absent: the product saw what she DOES, never what she
    // SAYS she is. AFTER: `[0, 1, 3, 4, 5, 6]`.
    expect(evidenceOf('en_practising', 'religion')).toEqual([0, 1, 3, 4, 5, 6]);
    expect(without('en_practising', 0)).toBe('religion[indirect]');
    // BEFORE this witness returned `RIEN`, and it served to prove that the zero came from the absent
    // TERM and not from the construction. The term is there; the witness becomes the counter-proof of
    // its presence.
    expect(x3('i am muslim, i have never made a secret of it')).toBe('religion[indirect]');
  });

  it('`en_trans_lived` — all her visibility hangs on ONE item, the one of the long form', () => {
    expect(evidenceOf('en_trans_lived', 'sexuality')).toEqual([4]);
    // The word she says she really uses produces nothing.
    expect(x3('i am trans, i have been out three years')).toBe('RIEN');
    // And without the item where she writes the form-filling form, she disappears from the label.
    expect(without('en_trans_lived', 4)).toBe('religion[indirect]');
  });

  it('`en_left_evangelical` — SIX pieces of evidence, now ON PAR with the practising woman', () => {
    // BEFORE: six pieces of evidence against FIVE for the practising woman — the woman who had LEFT
    // evangelism was better detected than the one who practices, on a lexicon that carried practice
    // and not membership. The assertion was a `toBeGreaterThan`, and its green recorded this defect.
    //
    // AFTER: 6 against 6. The gap closes FROM ABOVE — no evidence is removed from this one, it is the
    // other that gains hers. It is the form of repair the doctrine asks (« admitting is not
    // evicting »): one does not correct an asymmetry by silencing a side.
    expect(evidenceOf('en_left_evangelical', 'religion')).toEqual([1, 2, 3, 6, 9, 12]);
    expect(evidenceOf('en_left_evangelical', 'religion').length).toBe(
      evidenceOf('en_practising', 'religion').length,
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// THE FALSE-POSITIVE FLOOR — `en_idiomatic`
// ─────────────────────────────────────────────────────────────────────────────────────────────────

// FACTUAL CORRECTION: this block was titled « three wrongs ». `en_idiomatic` carries TWO
// (`health_physical`, `religion`); the third of the `torts` list belongs to `en_trans_lived`.
// The title confused the count of the VOICE with that of the BENCH.
describe('en_idiomatic — TWO wrongs, one of them at a NAMED finding', () => {
  it('a joke about a cake produces a NAMED health finding', () => {
    // The most costly wrong of the batch: high confidence and quasi-factual (« you wrote this
    // term »), on a woman who has no condition, about a slice of cake.
    expect(x3('this cake is basically diabetes on a plate')).toBe('health_physical[explicit]');
    expect(evidenceOf('en_idiomatic', 'health_physical')).toEqual([8, 14]);
  });

  it('the adjective is wired now, and the STOREY gap is what protects this voice', () => {
    // BEFORE: « i am diabetic » → `RIEN`. The probe had established that English wired the NOUNS of
    // condition and not the adjectives of membership, and that a metaphor borrows a NOUN — hence the
    // two wrongs of this voice, both on nouns.
    //
    // AFTER, and it is the wager of the batch made verifiable: the adjective enters, but one storey
    // BELOW. The shape of the hole and the shape of the idiom still coincide — filling the hole
    // therefore necessarily adds idiom — and what prevents this addition from costing dear is not a
    // filter, it is that the tier never affirms. Its two sealed wrongs stay in the same place, at the
    // same storey.
    expect(x3('i am diabetic')).toBe('health_physical[indirect]');
    expect(x3('i have diabetes')).toBe('health_physical[explicit]');
  });

  it('and the idiom that targets her most is STILL a noun — the batch added nothing here', () => {
    // The control that prevents reading the green above as « the batch made this voice safe ». Her
    // NAMED wrong comes from a noun, it predates the batch, and it is intact.
    expect(x3('this cake is basically diabetes on a plate')).toBe('health_physical[explicit]');
  });

  it('`gospel` used for cooking produces a religious finding', () => {
    expect(x3('the gospel of low and slow')).toBe('religion[indirect]');
    expect(evidenceOf('en_idiomatic', 'religion')).toEqual([12]);
  });
});
