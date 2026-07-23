// Adverse battery on the REAL ENRICHED LEXICON (PANO-36) — exercise of the contextual filters and
// of the variation tolerances with the real wired lexicons (`WIRED_LEXICONS`), not the fake ones.
// Each case verifies that a dense enrichment does NOT tag falsely. 100% SYNTHETIC sentences,
// invented here, never drawn from a real export (PANO-70 §3 discipline).

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon';
import { detectLabels } from './detect';

/** Detected labels (sorted) on a list of synthetic comments. */
function labels(...texts: string[]): string[] {
  return detectLabels(texts, WIRED_LEXICONS)
    .map((d) => d.label)
    .sort();
}

describe('adverse battery — negation', () => {
  it('« je fais pas de dépression » → mental_health NOT tagged (negation before the marker)', () => {
    expect(labels('je fais pas de depression en ce moment')).toEqual([]);
  });
});

// ── THE STATE AND THE SUBJECT — what negating means (ADR-0003) ───────────────────────────────────
// WHAT THIS SECTION DOES NOT COVER, and it must be read before citing it:
//   · it holds the MECHANISM on sentences I wrote knowing what I was looking for. It is not a bench:
//     it says nothing of the FREQUENCY of opposition, nor of the wrong the rule could create on a
//     real voice. The first instrument that will be able to say it is the political voices bench,
//     and it is not sealed to this day;
//   · it covers ONLY French. The machinery is bilingual (the EN negations are in the shared list)
//     and one EN case is held below, but no English corpus exercises it;
//   · it says nothing of criticism WITHOUT the subject's vocabulary — « tout ça c'est du vent » has
//     no marker, and no storey rule catches the wall.
describe('adverse battery — SUBJECT labels: negation degrades, it does not suppress', () => {
  it('political OPPOSITION → tagged as BROAD (former defect: it tagged nothing)', () => {
    expect(labels('je supporte pas les fachos', 'je peux pas blairer les fachos')).toEqual([
      'politics',
    ]);
    expect(labels('je supporte pas les gauchistes', 'je peux pas blairer les gauchistes')).toEqual([
      'politics',
    ]);
    expect(labels('jamais de manif pour moi', 'aucune manif ne sert a rien')).toEqual(['politics']);
  });

  // BOTH camps, by design and side by side: it is the property this batch exists to hold, and
  // testing it on one side only would reproduce in test the defect we repair in the lexicon.
  it('OPPOSITION in English too (the EN negations are in the shared list)', () => {
    expect(labels('i cannot stand the woke crowd', 'i cannot stand this fake news')).toEqual([
      'politics',
    ]);
  });

  it('the storey stays BROAD — negating never fabricates a NAMED finding', () => {
    const out = detectLabels(['jamais de messe pour moi'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['religion']);
    expect(out[0]?.stage).toBe('indirect'); // and above all not `explicit`
  });

  it('religion — the CRITICAL side of the ratified axis stops being mute', () => {
    expect(labels('jamais de messe pour moi')).toEqual(['religion']);
    expect(labels('je ne vais pas a la messe')).toEqual(['religion']);
  });

  // COUNTER-PROOF, and it is what gives their meaning to the four above: the STATE labels do not
  // move an inch. If the rule had leaked out of the subject labels, it would show here — and it
  // would show as an illness finding posed on someone who says they do not have it.
  it('the STATE labels are UNCHANGED — negating still removes the signal there', () => {
    expect(labels('je fais pas de depression en ce moment')).toEqual([]);
    expect(labels('je ne suis pas depressif', 'aucune depression chez moi')).toEqual([]);
    expect(labels('je n ai pas de diabete', 'aucun diabete dans la famille')).toEqual([]);
    expect(labels('je ne suis pas lesbienne')).toEqual([]);
  });

  // MECHANICAL BOUNDARY, measured and frozen — without it, a reader would conclude from the above
  // that « je ne vote pas » now tags. It does not tag, and the reason is NOT the negation: French
  // INFIXES its negation (« je NE vote PAS »), which breaks the multi-word marker in the matcher,
  // before any filter is consulted. The storey rule catches only what the matching found. It
  // therefore reaches ONE-word markers and non-infixed locutions.
  it('BOUNDARY — the INFIXED negation breaks the marker, and no storey rule catches it', () => {
    expect(labels('je ne vote pas', 'je ne vote jamais')).toEqual([]);
    expect(labels('je ne crois pas en dieu')).toEqual([]);
  });
});

describe('adverse battery — quotation / reported speech', () => {
  it('term in reported speech → not tagged (attributed to another)', () => {
    expect(labels('il parait que la therapie et le psy ca aide vraiment')).toEqual([]);
  });

  // ── The PLURAL between quotes — CROSS-CUTTING defect, found on `politics` ───────────────────────
  // `findMarker` tolerates the plural, `occursInsideQuotes` did not: a marker quoted in the plural
  // matched without being recognized as quoted, and the filter failed OPEN. The singular/plural pair
  // is here BECAUSE the singular already got through — without it, this test would not say by which
  // path its zero arrives, and one day when quotation stopped filtering at all, it would stay green
  // for the wrong reason.
  it('SINGULAR quotation → filtered (the path that already worked)', () => {
    expect(labels('il a dit "le gauchiste au pouvoir"', 'elle a dit "encore ce facho"')).toEqual(
      [],
    );
  });

  it('PLURAL quotation → filtered TOO (former defect: the quote regex ignored the `s?`)', () => {
    expect(
      labels('il a dit "les gauchistes au pouvoir"', 'elle a dit "encore ces fachos"'),
    ).toEqual([]);
  });

  // POSITIVE control: without it, the two zeros above would be held by a mute lexicon rather than by
  // the filter. Same words, same plurals, without quotes → the finding comes out.
  it('positive control — the same plurals OUTSIDE quotes do tag', () => {
    expect(labels('les gauchistes au pouvoir', 'encore ces fachos')).toEqual(['politics']);
  });

  // DECLARED BOUNDARY of these three cases: they hold the PLURAL tolerance, and it alone.
  // Symbolic self-censorship stays divergent between `findMarker` and `occursInsideQuotes` — an
  // insult masked between quotes still escapes the filter. This test FREEZES it rather than staying
  // silent: the day the path becomes positional, it goes red and turns into the inverse assertion.
  it('REMAINING DIVERGENCE — self-censorship between quotes still escapes the filter', () => {
    expect(
      labels('il a dit "les g@uchistes au pouvoir"', 'elle a dit "encore ces f@chos"'),
    ).toEqual(['politics']);
  });
});

describe('adverse battery — 3rd person (degradation, never suppression)', () => {
  it('distress of a relative, repeated → mental_health INDIRECT (signal-without-lived, tagged anyway)', () => {
    const out = detectLabels(
      ['la depression de mon fils m’inquiete', 'je cherche un psy pour mon fils'],
      WIRED_LEXICONS,
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('indirect'); // never named on another (B3)
  });

  // Gap filled (« ma mère »/« mon père » absent from THIRD_PERSON): without the filter, this
  // EXPLICIT term applied to a third party named the user in place of their mother — B3 was leaking.
  // Two degraded items (like the golden « mon fils » above): a single item degraded to indirect
  // stays below `indirectThreshold` (2) and produces NO insight — it is not the leak tested here
  // (it would be invisible, not wrongly named), hence two items, like the rest of the battery.
  it('« la dépression de ma mère » → mental_health INDIRECT, NEVER named (gap filled)', () => {
    const out = detectLabels(
      ['la depression de ma mere m’inquiete beaucoup', 'je cherche un psy pour ma mere'],
      WIRED_LEXICONS,
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('indirect');
  });

  // PROBE CHANGED, and the reason is the heart of this control. This `describe` proves a
  // DEGRADATION: a term that would name in the 1st person does not name in the 3rd. It therefore
  // needs a probe that STILL NAMES. Bare « dépression » stopped naming (bare-nouns tier): kept as a
  // probe, it would have left the three cases above green at `indirect` — no longer because the
  // degradation works, but because there was nothing left to degrade. A test that passes for a
  // reason other than its own is worse than a red test: it turns off the guard in silence.
  it('control: « j’ai fait une dépression nerveuse » (own lived) → EXPLICIT (recall intact)', () => {
    const out = detectLabels(['j’ai fait une depression nerveuse cet hiver'], WIRED_LEXICONS);
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('explicit');
  });

  it('the same, in the 3rd person → INDIRECT: the degradation is indeed what is measured', () => {
    // The counterpart of the control above, on the SAME probe. Without it, « explicit in the 1st »
    // and « indirect in the 3rd » stay two separate facts; together, they are a degradation.
    const out = detectLabels(['la depression nerveuse de mon fils m’inquiete'], WIRED_LEXICONS);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('the BARE NOUN, itself, no longer names — and does not disappear either (solo tier)', () => {
    // The floor installed by the bare-nouns tier, kept here because it is the battery that carries
    // the doctrine. A SINGLE utterance, in the 1st person, literal: it no longer produces a named
    // finding (the affirmation is not justified on a word everyday use has colonized), but it does
    // produce a broad finding — without the solo tier, the threshold of 2 would have erased it.
    const out = detectLabels(['j’ai une depression en ce moment'], WIRED_LEXICONS);
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('indirect');
  });

  it('same guarantees on the rest of the added family (father, parents, grandparents, uncle/aunt, cousin, partner/ex)', () => {
    const proches = [
      'mon pere',
      'mes parents',
      'ma grand mere',
      'mon grand pere',
      'ma mamie',
      'mon papy',
      'mon oncle',
      'ma tante',
      'mon cousin',
      'ma cousine',
      'mon mec',
      'ma meuf',
      'mon ex',
    ];
    for (const proche of proches) {
      const out = detectLabels(
        [`la depression de ${proche} m’inquiete`, `je cherche un psy pour ${proche}`],
        WIRED_LEXICONS,
      );
      expect(out, proche).toHaveLength(1);
      expect(out[0]?.stage, proche).toBe('indirect');
    }
  });
});

describe('adverse battery — self-censorship and elongation (machinery)', () => {
  it('self-censored targeted insult → conflictual, surface = masked form typed', () => {
    const out = detectLabels(["t'es qu'une grosse c*nne"], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
    expect(out[0]?.items[0]?.surfaces).toContain('c*nne');
  });

  it('elongated targeted insult → conflictual, surface = elongated form', () => {
    const out = detectLabels(["t'es vraiment un abruuuuti"], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
    expect(out[0]?.items[0]?.surfaces).toContain('abruuuuti');
  });

  it('plural: « fachos » / « gauchistes » count as their singulars (politics)', () => {
    // Two opinion-register items → indirect threshold 2 reached.
    expect(labels('encore ces fachos au pouvoir', 'et tous ces gauchistes')).toEqual(['politics']);
  });
});

describe('adverse battery — polysemy (the threshold protects)', () => {
  it('economic « déprime » isolated → mental_health NOT tagged (1 colloquial hit < threshold 2)', () => {
    expect(labels('le marche est en pleine deprime ces temps-ci')).toEqual([]);
  });

  it('polysemous « toc » isolated → mental_health NOT tagged (colloquial, 1 hit < threshold 2)', () => {
    // Anti-regression: « toc » was lowered from explicit to colloquial (PANO-36) — an isolated
    // « toc toc » or « du toc » must never again tag a named condition.
    expect(labels('toc toc qui est la derriere la porte')).toEqual([]);
    expect(labels("c'est du toc ce sac soi-disant en cuir")).toEqual([]);
  });
});

describe('adverse battery — conflictual = aggression of PERSONS', () => {
  it('swear word without a target → conflictual NOT tagged', () => {
    expect(labels('quel bouffon ce scenario de film')).toEqual([]);
  });

  it('criticism of a non-political idea (insult on a thing) → tagged NOWHERE', () => {
    expect(labels('cette blague est vraiment debile')).toEqual([]);
  });
});

describe('adverse battery — political opinion goes to POLITICS (not conflictual)', () => {
  it('repeated category judgment → politics indirect, never conflictual', () => {
    const out = detectLabels(
      ['ce parti est un ramassis de fascistes', 'quelle bande de corrompus au sommet'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['politics']);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('1st-person self-declaration → politics EXPLICIT (via the PANO-72 pattern)', () => {
    const out = detectLabels(['perso je suis de gauche et je milite'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['politics']);
    expect(out[0]?.stage).toBe('explicit');
  });
});

// ─── Pass 2: health_physical / sexuality / religion (PANO-72) ───────────────────────────────────

describe('adverse battery — health_physical (the fatigue-hyperbole trap)', () => {
  it('hyperboles « crevé / claqué / mort » → NOT tagged (excluded from the lexicon)', () => {
    expect(
      labels('je suis mort de fatigue', 'chui claque apres le taf', 'trop creve ce soir'),
    ).toEqual([]);
  });

  it('condition named of oneself → health_physical explicit', () => {
    const out = detectLabels(['je vis avec mon diabete au quotidien'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['health_physical']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('repeated care journey → health_physical indirect (threshold 2)', () => {
    expect(labels('rdv chez le cardiologue demain', 'encore une prise de sang ce matin')).toEqual([
      'health_physical',
    ]);
  });

  it('condition of a relative → indirect (signal-without-lived, never named) ', () => {
    const out = detectLabels(
      ['le diabete de mon fils me stresse', "j'accompagne mon fils a l'hopital"],
      WIRED_LEXICONS,
    );
    expect(out.find((d) => d.label === 'health_physical')?.stage).toBe('indirect');
  });

  // ── THE ILLNESS NAME TURNED INSULT (ADR-0003, *L'admission d'un terme*) ─────────────────────────
  // The lexicon carries `mon cancer`, `ma chimio`, `ma maladie` — and NEVER bare `cancer`. The rule
  // long lived without being written or re-read; it is in doctrine since a second language found it
  // on its own, English making « cancer »/« cancerous » a generic epithet.
  //
  // What this test holds, and why it is BEHAVIOURAL rather than an assertion on the list:
  // « `cancer` is not in the table » would go green even if another tier caught it.
  // So we verify what matters — that no finding is posed — and the positive control just below
  // proves that the CARRIED form does tag (without which this zero would say nothing).
  it('illness name used as an insult → NO finding, in both languages', () => {
    expect(labels('cette meta est le cancer du jeu')).toEqual([]);
    expect(labels('this meme is cancer', 'that take is cancerous')).toEqual([]);
  });

  it('CONTROL — the CARRIED form tags: the zero above is an exclusion, not a breakdown', () => {
    const out = detectLabels(['mon cancer et ma chimio rythment mes semaines'], WIRED_LEXICONS);
    expect(out.find((d) => d.label === 'health_physical')?.stage).toBe('explicit');
  });
});

describe('adverse battery — sexuality (threshold 1, outing cost)', () => {
  it('self-declaration → sexuality explicit (named)', () => {
    const out = detectLabels(['je suis lesbienne et fière de l’être'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['sexuality']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('BARE identity (3rd person) → indirect, never named (catalog rule)', () => {
    const out = detectLabels(['cette actrice est ouvertement lesbienne'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['sexuality']);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('« arc-en-ciel » weather → not tagged (assumed exclusion, outing cost)', () => {
    expect(labels('quel bel arc-en-ciel après l’orage')).toEqual([]);
  });

  it('out-of-domain collision « un pan de mur » → not tagged (FP probe PANO-72)', () => {
    expect(labels('je suis un pan de ce grand mur en ruine')).toEqual([]);
  });
});

describe('adverse battery — religion (SUBJECT label, decision D)', () => {
  it('declared membership → religion explicit', () => {
    const out = detectLabels(['je suis musulman et pratiquant'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['religion']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('cultural « église » → religion indirect (multi-interpretability, not a bug)', () => {
    const out = detectLabels(['magnifique église romane dans ce village'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['religion']);
    expect(out[0]?.stage).toBe('indirect'); // the §5 fan carries the « curiosity » reading
  });

  it('lexicalized interjection « wallah » → NOT tagged (excluded: sociolect, not religion)', () => {
    expect(labels('wallah je te jure c’est vrai')).toEqual([]);
  });

  it('out-of-domain collisions → NOT tagged (FP probe PANO-72, anti-regression)', () => {
    expect(labels('je fais de la voile ce week-end')).toEqual([]); // voile = boat
    expect(labels('jai mal aux temples ce matin')).toEqual([]); // temples = anatomy
    expect(labels("visite de l'institut pasteur demain")).toEqual([]); // pasteur = toponym
    expect(labels("mon bapteme de l'air était génial")).toEqual([]); // baptême = first time
  });

  // The probe said « t'es qu'un bigot arriéré ». `bigot` (masculine) was REMOVED from the lexicon at
  // the EN opening — it is a homograph of the common English word, and it tagged « you are being a
  // bigot about this policy ». The BOUNDARY this test guards has not moved an inch; only its probe
  // changes, for a surface the removal spares. This test is moreover what made the cost of the
  // removal visible: `bigot` carried a ratified decision, not only vocabulary.
  it('targeted anti-believer insult → conflictual, never religion', () => {
    const out = detectLabels(["t'es qu'une bigote arriérée"], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
  });
});

// ── EN pilot batch (PANO-35) — the ONLY thing that exercises the EN variants ─────────────────────
// The demo EN persona meets NONE of them (measured: the golden does not move a byte after the
// batch). Without this section, ~50 terms would be delivered without any test crossing them. The
// HYPERBOLE cases are the most important: they freeze EXCLUSIONS, that is the doctrine.
describe('adverse battery — EN, named condition and care', () => {
  // Same probe change as in French, same reason: bare « anxiety » no longer names. The diagnostic
  // phrase, itself, still names — and it is exactly the line the lexicon now traces.
  it('EN diagnostic PHRASE of oneself → mental_health explicit (named)', () => {
    const out = detectLabels(['i was diagnosed with an anxiety disorder'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['mental_health']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('EN BARE NOUN of oneself → broad, never named, and never absent', () => {
    // The English counterpart of the floor: a single utterance is enough to tag, no number is enough
    // to name. Both halves count — it is the hole the first demotion had fallen into (measured in
    // `en-demotion-ablation.test.ts`).
    const out = detectLabels(['i have been dealing with anxiety for years'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['mental_health']);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('repeated EN care journey → indirect (the threshold 2 holds in English too)', () => {
    const out = detectLabels(
      ['i started therapy in march', 'my therapist suggested a break'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['mental_health']);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('a single indirect EN marker poses NOTHING (threshold not bypassed)', () => {
    expect(labels('i started therapy in march')).toEqual([]);
  });

  it('EN distress of a relative → indirect, never named (B3, batch-1 filters + batch-2 terms)', () => {
    const out = detectLabels(
      ['my sister has been in therapy', 'helping my teen with school refusal'],
      WIRED_LEXICONS,
    );
    expect(out.find((d) => d.label === 'mental_health')?.stage).toBe('indirect');
  });

  it('EN negation on a batch term → not tagged', () => {
    expect(labels("i don't have anxiety, i was just tired")).toEqual([]);
  });
});

// ── health_physical EN — and the admission line is NOT that of the pilot ─────────────────────────
// The `mental_health` batch defended itself against HYPERBOLE. Here it hardly works: no one writes
// « i'm diabetic » for a laugh. The line that decides this label is
//
//     THE SYMPTOM IS NOT THE CONDITION,
//
// and it was measured on two sealed voices: the one who LIVES with polyarthritis names her illness,
// her treatment and her specialty; the one who has NOTHING wrote a dense and perfectly literal
// vocabulary of symptoms. The exclusions below are what separates them — and they carry the
// doctrine, because an inclusion gets re-read whereas an exclusion is lost if nothing holds it.
describe('adverse battery — EN, health_physical (the symptom is not the condition)', () => {
  it('named condition + treatment → health_physical, and the lived is NAMED', () => {
    const out = detectLabels(
      ['rheumatoid arthritis flare how long do they last', 'methotrexate day is a saturday'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['health_physical']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('THE HEART OF THE BATCH — a vocabulary of SYMPTOMS, dense and literal, tags NOTHING', () => {
    // Each of these searches is what someone who has nothing and worries writes. All describe a REAL
    // sensation: none is hyperbole, and it is what makes the case harder than the pilot's. The
    // threshold does not protect either — whoever worries searches a lot, so the repetition
    // accumulates (ADR-0003).
    expect(
      labels(
        'small red bump on arm not itchy',
        'is a headache behind one eye serious',
        'tingling in hand when i wake up',
        'how long should a bruise take to fade',
        'random muscle twitch eyelid',
        'why do i get pins and needles in my foot',
        'dry cough three days',
        'stomach ache after coffee',
      ),
    ).toEqual([]);
  });

  it('illness names turned insults or banalities → not tagged', () => {
    expect(labels('this meme is cancer', 'that take is cancerous')).toEqual([]);
    expect(labels('you are giving me a migraine', 'this queue is a migraine')).toEqual([]);
    expect(labels('that beat is sick', 'im so sick of this weather')).toEqual([]);
    expect(labels('a stroke of luck honestly', 'my backstroke is terrible')).toEqual([]);
  });

  it('CONTROL — the CARRIED forms of the same words do tag', () => {
    // Without this control, the zeros above would not distinguish an exclusion from an absence of
    // coverage. It is the phrase that names, not the bare word.
    const out = detectLabels(
      ['my cancer treatment starts on monday', 'my chemo schedule for next month'],
      WIRED_LEXICONS,
    );
    expect(out.find((d) => d.label === 'health_physical')?.stage).toBe('explicit');
  });

  it('PHYSICAL rehabilitation goes to health_physical, no longer to mental health', () => {
    // The wrong found by the body bench: « occupational therapy » read as mental health for the
    // carer of a person who had a stroke. Wrong person AND wrong subject.
    const out = detectLabels(
      ['occupational therapy home assessment', 'aphasia speech therapy waiting list'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['health_physical']);
  });

  it('ABLATION — `therapy` lost nothing: the true positives of mental health hold', () => {
    // The obligatory counterpart of the line above. `therapy` is a DELIVERED term that carries a
    // real recall; the batch leaves it intact and removes from it only what did not belong to it.
    const out = detectLabels(
      ['therapy cost per session average', 'how to find a therapist without a referral'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['mental_health']);
  });

  it('« retail therapy » falls too — the written reservation of the pilot batch, finally held', () => {
    expect(labels('retail therapy is my weakness', 'a bit of retail therapy today')).toEqual([]);
  });
});

describe('adverse battery — EN, hyperbole (the exclusions THAT CARRY the doctrine)', () => {
  // « je veux mourir » is IN the FR lexicon; « i want to die » is excluded from it, by design — in
  // English it is a conventional reaction to embarrassment (same family as « i'm dying » = laughing),
  // not distress. The textbook case of the judgment that does not survive translation
  // (cf. `docs/methode-portabilite-en.md`, the separation lines).
  it('vital EN hyperbole → NOT tagged, even accumulated', () => {
    expect(
      labels(
        'that photo i am dying',
        'i want to die this is so embarrassing',
        'kill me now, three hours of meetings',
        'i am dead, this is too funny',
      ),
    ).toEqual([]);
  });

  it('object adjective and false friend → NOT tagged', () => {
    expect(labels('this weather is so depressing')).toEqual([]); // state of a THING, not the speaker
    expect(labels('so anxious to see you tomorrow')).toEqual([]); // « anxious » EN = eager
  });

  it('colloquialized clinical vocabulary → never NAMED (same path as « toc »)', () => {
    expect(labels('i am so ocd about my desk')).toEqual([]); // isolated: below the threshold
    expect(labels('that movie traumatized me')).toEqual([]); // « trauma » excluded from the lexicon
    expect(labels('he keeps gaslighting everyone')).toEqual([]); // reproach to ANOTHER, not a state
  });
});

// ── `woke`, past of *wake* — the homograph that crosses over from FR ─────────────────────────────
// WHAT THIS SECTION DOES NOT COVER: it holds the eight verbal frames set aside by
// `COVERING_PHRASES_EN`, and nothing else. It measures NEITHER the relative frequency of the two
// uses, NOR the rest of the verbal tail — of which the last case below freezes precisely one piece.
describe('adverse battery — EN, verbal `woke` vs political `woke`', () => {
  it('the verbal frames → NOT tagged (particle and pronominal objects)', () => {
    expect(labels('i woke up at five again', 'woke up with a migraine')).toEqual([]);
    expect(labels('the dog woke me at three', 'she woke us all up shouting')).toEqual([]);
    expect(labels('that noise woke him instantly', 'i woke at five and could not sleep')).toEqual(
      [],
    );
  });

  // POSITIVE CONTROL, and it carries all the rest: without it, the zeros above would be held by a
  // `woke` gone mute — that is by a disguised eviction, which the doctrine forbids
  // (the term triggers on bearers, it STAYS).
  it('positive control — the POLITICAL use still tags', () => {
    expect(labels('the woke crowd again', 'everything is woke now')).toEqual(['politics']);
  });

  // RESIDUE FROZEN rather than kept silent. This test says « here is what still gets through », and
  // it will turn into the inverse assertion the day someone decides to cover the verbal tail.
  it('DECLARED RESIDUE — `woke` + conjunction / adverb still tags', () => {
    expect(labels('i woke and it was already dark', 'she woke suddenly in the night')).toEqual([
      'politics',
    ]);
  });
});

// ── EN batch of `conflictual` (PANO-35) — the ONLY thing that exercises its EN variants ──────────
// The demo EN persona meets EXACTLY ONE of them (« you’re just stupid »), frozen separately in
// `demo/synthetic-export.test.ts`; the nine other forms are crossed only by here. And on this
// label, the exclusions column does not only carry the doctrine — it carries ALL the safety:
// `conflictual` is the only label without a fan of readings (ADR-0003), so a false positive there
// has no net.
//
// ── WHAT THIS SECTION DOES NOT COVER, and it must be read before citing it ───────────────────────
// It is written BY the author of the lexicon, on TYPICAL cases he chose. It proves that the admitted
// forms behave as expected on those cases, and nothing more. It measures NO false-positive rate: no
// sealed voice of any bench writes aggression, in either language (measured: 17 voices, 476 items,
// zero `conflictual` finding). The central wrong of the batch — the joke between friends, tagged as
// an aggression because nothing in an export separates them — is ASSUMED, NOT MEASURED, and its
// instrument (sealed voices of aggression and of joking) did not exist at delivery.
describe('adverse battery — EN, conflictual: the gate is insult AND target', () => {
  it('targeted EN insult → conflictual, term pinned', () => {
    const out = detectLabels(
      ['you are a dumbass and everyone in the replies knows it'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
    expect(out[0]?.items[0]?.surfaces).toContain('dumbass');
  });

  it('abusive EN imperative → tagged (it addresses by construction, like « ta gueule »)', () => {
    expect(labels('shut up nobody asked')).toEqual(['conflictual']);
  });

  it('EN insult targeting an IDEA → tagged NOWHERE (decision D, carried by the target)', () => {
    expect(labels('this take is moronic')).toEqual([]);
    expect(labels('that stupid rule about parking near the school')).toEqual([]);
  });

  it('REPORTED EN insult → out of scope (the quotation filter is already bilingual)', () => {
    expect(labels('he called me stupid and i just logged off')).toEqual([]);
  });

  it('NEGATED EN insult → not tagged', () => {
    expect(labels('you are not stupid, dont let them tell you that')).toEqual([]);
  });
});

describe('adverse battery — EN, conflictual: the EXCLUSIONS, and they carry all the safety', () => {
  // The most important exclusion of the batch. Bare `you` is not an address in English: it is also
  // the impersonal. Measured at the writing of the batch, at identical terms: with bare `you` in
  // `targets`, 14 innocent English items out of 14 tagged; with the anchored constructions only, 0
  // out of 14.
  it('the bare pronoun `you` IS NOT a target — the advice sentence does not tag', () => {
    expect(labels('you should get your thyroid gland checked out')).toEqual([]);
    expect(labels('you can take the trash out on tuesdays')).toEqual([]);
    expect(labels('i cope with the heat by staying inside, you should too')).toEqual([]);
  });

  it('AFFILIATION vocatives → never targets (they mark the bond, not the attack)', () => {
    expect(labels('bro is washed and he knows it')).toEqual([]);
    expect(labels('yall are not beating the allegations')).toEqual([]);
  });

  it('EVALUATION slang (performance, object) → outside the lexicon', () => {
    expect(labels('that album is straight trash honestly')).toEqual([]);
    expect(labels('you are such a sad excuse for a chef')).toEqual([]); // « sad » excluded
  });

  it('PLAYFUL online sparring → outside the lexicon (and it is the gate political invective would take)', () => {
    expect(labels('cope harder')).toEqual([]);
    expect(labels('you are so triggered by this')).toEqual([]);
  });

  it('name of a disorder used as an insult → enters nowhere (ADR-0003, F7)', () => {
    expect(labels('every politician in that debate was a narcissist')).toEqual([]);
    expect(labels('you are being such a schizo about this')).toEqual([]);
  });

  it('reproach of BEHAVIOR → not an insult, therefore outside this label', () => {
    expect(labels('you are gaslighting me right now')).toEqual([]);
  });

  it('GROUP insult in the absolute → nowhere (future dedicated label, never settled alone)', () => {
    expect(labels('people like you are the problem with this country')).toEqual([]);
  });
});

// ── The six FR entries REMOVED at the EN opening (PANO-35) ────────────────────────────────────────
// An exclusion is lost if nothing holds it, and these would be lost particularly fast: they are
// perfectly legitimate French insults, that a hurried reader would re-add believing to fill a hole.
// What made them leave is NOT their French sense — it is that they are homographs of ordinary
// English words, and that the opening of the EN targets made them alive.
//
// WHAT THIS BLOCK DOES NOT PROVE: that the removal was costless. It has one, measured and inscribed
// in the header of the lexicon (« t'es vraiment con », « t'es qu'un clown », « t'es qu'un bigot »
// are no longer read). It is HELD for re-measurement as soon as sealed voices of aggression exist —
// none exists today, in either language.
describe('adverse battery — the removed FR/EN homographs no longer tag', () => {
  it('PURE collisions: no aggression at stake, and they tagged', () => {
    expect(labels('you are right that the pros and cons are worth weighing')).toEqual([]);
    expect(labels('youre going to want your thyroid gland checked')).toEqual([]);
    expect(labels('you are growing a tache i see')).toEqual([]);
    expect(labels('you are being a bigot about this policy')).toEqual([]);
  });

  it('real EN insults, but whose dominant use is the JOKE', () => {
    expect(labels('you are such a loser at mario kart lmao')).toEqual([]);
    expect(labels('you are the clown in that photo right')).toEqual([]);
  });

  it('the FR register stays covered by the neighborhood — what is lost is the SURFACE', () => {
    // The removal does not leave French without words: the register has its synonyms in the lexicon.
    expect(labels("t'es qu'un connard")).toEqual(['conflictual']);
    expect(labels("t'es qu'un guignol")).toEqual(['conflictual']);
    expect(labels("t'es qu'un looser")).toEqual(['conflictual']);
    // But those surfaces are no longer read, and it is the inscribed price — not an omission.
    expect(labels("t'es vraiment con")).toEqual([]);
    expect(labels("t'es qu'un clown")).toEqual([]);
  });
});

describe('adverse battery — `moron`, removed on measurement (`conflictual` bench)', () => {
  // An exclusion arising from a MEASUREMENT, and not from a doctrine: `moron` was delivered then
  // removed in the same week, because the first bench of this label found it at zero recall over 26
  // hostile items and at a NAMED wrong on the affectionate voice. It is frozen here so the next batch
  // does not re-add it taking it for an omission: it is the opposite.
  it('« moron » addressed no longer tags', () => {
    expect(labels('you are the official moron of this house')).toEqual([]);
  });

  it('control: `moronic` stays, and the target guard holds it on an idea', () => {
    expect(labels('you are being moronic about this')).toEqual(['conflictual']);
    expect(labels('this take is moronic')).toEqual([]);
  });
});
