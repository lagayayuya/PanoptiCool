// Tests of the detection machinery (PANO-71) — the four filters measured PANO-33 + the
// indexed normalization. Local DUMMY lexicons (generic FR terms invented to exercise
// each filter); the real seed lexicon lives in `engine/lexicon/` and has its own goldens.
// All sentences are SYNTHETIC (invented here, no real data).

import { describe, expect, it } from 'vitest';
import type { ItemLevelLexicon, TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';
import { normalizeFr, surfaceForm } from './normalize-fr';

/** Test topical lexicon (arbitrary label among the 6; the terms serve the filters). */
function topical(overrides: Partial<TopicalLexicon> = {}): TopicalLexicon {
  return {
    kind: 'topical',
    label: 'mental_health',
    readingTemplateIds: ['t.reading.a', 't.reading.b'],
    explicit: ['anxiete', 'idees noires'],
    indirectCore: ['psy', 'therapie', 'manif'],
    indirectColloquial: ['deprime'],
    includeColloquial: true,
    indirectThreshold: 2,
    ...overrides,
  };
}

const CONFLICTUAL: ItemLevelLexicon = {
  kind: 'item-level',
  label: 'conflictual',
  insults: ['bouffon', 'abruti'],
  targets: ["t'es", 'tu es', 'degage'],
};

describe('normalizeFr — indexed normalization', () => {
  it('lowercase + accents stripped + typographic apostrophe unified', () => {
    expect(normalizeFr('J’ai de l’Anxiété').norm).toBe("j'ai de l'anxiete");
  });

  it('surfaceForm re-projects a match of the normalized text onto the ORIGINAL text, down to the character', () => {
    const t = normalizeFr('Mon Anxiété chronique');
    const start = t.norm.indexOf('anxiete');
    const surface = surfaceForm(t, start, start + 'anxiete'.length);
    expect(surface).toBe('Anxiété');
    expect(t.original.includes(surface)).toBe(true);
  });
});

describe('detectLabels — word boundaries', () => {
  it('a marker does not match INSIDE a word (« psy » ⊄ « psychologie »)', () => {
    const out = detectLabels(
      ['la psychologie est un domaine', 'un cours de psychologie'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('the apostrophe is a boundary (« l’anxiete » matches « anxiete »)', () => {
    const out = detectLabels(["mon anxiété m'épuise en ce moment"], [topical()]);
    expect(out[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — negation window', () => {
  it('negation before the marker → hit suppressed', () => {
    const out = detectLabels(
      ['pas de psy pour moi', 'aucune therapie prévue'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('double negation (omission verb + negation) = AFFIRMATION → hit kept', () => {
    const out = detectLabels(
      ['je rate jamais la manif du samedi'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
  });
});

describe('detectLabels — citation / reported speech', () => {
  it('citation marker → attributed to someone else → hit suppressed', () => {
    const out = detectLabels(
      ['parait que la therapie marche bien'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('marker inside quotes → hit suppressed', () => {
    const out = detectLabels(['il a crié « anxiete » sur le plateau'], [topical()]);
    expect(out).toEqual([]);
  });
});

describe('detectLabels — 3rd person (B3: degraded, never suppressed)', () => {
  it('explicit term applied to a relative → DEGRADED to indirect (signal-without-lived-experience, tagged anyway)', () => {
    const out = detectLabels(
      ["l'anxiété de mon fils m'inquiète beaucoup", 'chercher un psy pour mon fils'],
      [topical()],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
    expect(out[0]?.items.every((i) => i.stage === 'indirect')).toBe(true);
    // The surface form stays that of the original text (accents included).
    expect(out[0]?.items[0]?.surfaces).toContain('anxiété');
  });
});

// --- EN filters (PANO-35 batch 1): MIRROR of the FR goldens above -------------------------------
// Each test below is the EXACT counterpart of an FR golden, on the same dummy lexicons. The
// markers stay FR (« anxiete », « psy », « therapie »): this is INTENDED — the real measured risk
// comes from FR/EN HOMOGRAPHS (« depression », « burnout », « diabetes »), hence from an FR marker
// reached by an EN SENTENCE. We exercise exactly this path, without adding anything to the D1 lexicons.

describe('detectLabels — EN negation window (mirror of FR)', () => {
  it('EN negation before the marker → hit suppressed', () => {
    const out = detectLabels(
      ['i am not in therapie right now', 'there is no psy involved here'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('EN contraction (« don’t » / « dont ») → hit suppressed', () => {
    const out = detectLabels(
      ["i don't need therapie", 'i dont need a psy'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('« never » → hit suppressed', () => {
    expect(
      detectLabels(['i never had anxiete in my life'], [topical({ indirectThreshold: 1 })]),
    ).toEqual([]);
  });

  it('EN double negation (omission verb + negation) = AFFIRMATION → hit kept', () => {
    const out = detectLabels(
      ['i never miss my manif on saturday'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
  });
});

describe('detectLabels — EN citation / reported speech (mirror of FR)', () => {
  it('EN citation marker → attributed to someone else → hit suppressed', () => {
    const out = detectLabels(
      ['she told me therapie works well', 'apparently the therapie helps a lot'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('EN MEDICAL PASSIVE is NOT a citation (same trap as in FR) → hit kept', () => {
    // « i was told i have… » reports a RECEIVED diagnosis, not a third party's words about a third party.
    const out = detectLabels(['i was told i have anxiete'], [topical()]);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — EN 3rd person (B3: degraded, never suppressed)', () => {
  it('explicit term applied to an EN relative → DEGRADED to indirect (signal-without-lived-experience, tagged anyway)', () => {
    const out = detectLabels(
      ['my sister has anxiete and it worries me', 'looking for a psy for my son'],
      [topical()],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
    expect(out[0]?.items.every((i) => i.stage === 'indirect')).toBe(true);
  });

  it('MEASURED REGRESSION (docs/portabilite-en-filtres.md): « my sister has X » no longer NAMES', () => {
    // Before this batch, the 3 protective filters failed OPEN in EN: this text produced an
    // `explicit` (= NAMED) tag on the speaker, violating SENS-B3. It must stay unnamed, forever.
    const out = detectLabels(['my sister has anxiete'], [topical({ indirectThreshold: 1 })]);
    expect(out[0]?.stage).not.toBe('explicit');
  });

  // ── EXTENDED KINSHIP — measured fill, and the reason for its blindness is worth more than the list ──────
  // Batch 1 had covered the American nuclear family. Missing were « my mum » (the British
  // form, hence the most common outside North America) and ALL extended kinship.
  //
  // WHY NO ONE SAW IT, and it is the point to remember: on `mental_health`, the only label
  // measured until now, the frequent disorder names (« depression », « anxiety », « ptsd ») live
  // in the `indirectSolo` tier and can STRUCTURALLY no longer name. « my nan has depression »
  // therefore already degraded — but thanks to the tier, not thanks to the 3rd-person list. A tier created
  // against HYPERBOLE masked a KINSHIP defect, and the mask fell only by opening a label
  // whose condition names stayed in `explicit`.
  //
  // This test therefore uses a lexicon whose term is `explicit` — WITHOUT which it would go green
  // for the adjacent reason, and would verify the tier instead of the list (CLAUDE.md: an assertion
  // verifies what it REACHES).
  it('extended kinship degrades — grandparents, « my mum », uncles, cousins', () => {
    for (const proche of [
      'my mum',
      'my nan',
      'my gran',
      'my granny',
      'my grandma',
      'my grandmother',
      'my grandad',
      'my grandpa',
      'my grandfather',
      'my grandparents',
      'my parents',
      'my uncle',
      'my aunt',
      'my cousin',
      'my niece',
      'my in-laws',
    ]) {
      const out = detectLabels([`${proche} has anxiete`], [topical({ indirectThreshold: 1 })]);
      expect(out[0]?.stage, `« ${proche} » devrait dégrader`).toBe('indirect');
    }
  });

  it('CONTROL — without a kinship marker, the same statement NAMES: it is indeed the list that acts', () => {
    // Without this control, the test above would go green even if the degradation came
    // from elsewhere (the threshold, a tier, a neighboring filter). It fixes the comparison point.
    const out = detectLabels(['my neighbour has anxiete'], [topical({ indirectThreshold: 1 })]);
    expect(out[0]?.stage).toBe('explicit');
  });
});

// ── EN INFORMATIONAL REGISTER IN COMPOUND FORM (« diabetes symptoms ») ───────────────────────────────────
// WHAT THESE TESTS DO NOT COVER, and it must be read before citing them:
//   · they are MECHANISM probes, not a rate measurement. No ground truth, no
//     denominator — the register benches remain the only rate instruments, and none of them
//     exercises physical health to date;
//   · they bear on ENGLISH alone. French does not have this defect (it carries bare « symptomes »), and
//     the last case below freezes it rather than supposing it;
//   · they say nothing of the NON-admitted heads (« treatment », « diet ») beyond the fact that they do not
//     degrade — which is the intended behavior, not a gap.
describe('detectLabels — EN informational register in COMPOUND form', () => {
  // Dummy lexicon at the `explicit` tier — it is this tier the rule caps. « diabete » also serves
  // as a witness of the plural tolerance: it matches « diabetes », and the compound must be
  // recognized AFTER the « s » that the marker span does not include.
  const HP = (terms: string[]) =>
    detectLabels(terms, [topical({ explicit: ['diabete', 'psoriasis'] })]);

  it('THE DEFECT CLOSED — « X symptoms » no longer NAMES, whereas « symptoms of X » already degraded', () => {
    // English composes its most frequent health query in preposed form, and the by-preposition
    // list missed it entirely. Both word orders must produce the same storey.
    expect(HP(['diabetes symptoms'])[0]?.stage).toBe('indirect');
    expect(HP(['symptoms of diabetes'])[0]?.stage).toBe('indirect');
  });

  it('the compound crosses ALONE, like the by-preposition form — otherwise the two rules compose into DISAPPEARANCE', () => {
    // The threshold is 2 and there is only one item: without the solo crossing, the framing would remove
    // the named storey then the threshold would remove the finding, whereas neither rule requires
    // that there be nothing left to show. Same reasoning as the by-preposition path.
    const out = HP(['diabetes symptoms']);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.solo).toBe(true);
  });

  it('THE COST, measured and assumed — « my diabetes symptoms » degrades TOO', () => {
    // It must be written, because it is the only place where this rule errs: a possessive
    // before the compound does not hold it back. Someone who describes THEIR symptoms by this turn of phrase
    // loses their named storey.
    //
    // Why it is accepted rather than caught: (1) a storey rule errs by
    // UNDER-asserting, which can be caught, where a filter would fabricate a blind false negative
    // (ADR-0003); (2) the obvious catch — requiring the absence of a possessive — is the
    // 1st-person anchoring, measured and set aside; (3) the bound is a fact of language already invoked by the
    // by-preposition path: whoever lives a condition names it ALSO in bare possessive elsewhere, and that
    // item suffices to hold the storey. The following line freezes it.
    expect(HP(['my diabetes symptoms have been worse'])[0]?.stage).toBe('indirect');
    expect(
      HP(['my diabetes symptoms have been worse', 'my diabetes is hard to manage'])[0]?.stage,
    ).toBe('explicit');
  });

  it('the head must be ADJACENT to the term — otherwise it would be bare « symptoms » by the back door', () => {
    expect(HP(['my diabetes and her symptoms are unrelated'])[0]?.stage).toBe('explicit');
    // And the word boundary holds: « symptomatic » is not « symptoms ».
    expect(HP(['psoriasis symptomatic relief'])[0]?.stage).toBe('explicit');
  });

  it('« treatment » and « diet » do NOT degrade — seeking care is a signal of lived experience', () => {
    // Assumed exclusion, not oversight: the admission criterion requires questioning, defining or
    // quantifying. « diabetes treatment » seeks CARE, and seeking care for oneself is a
    // signal of lived experience (ADR-0003, « Pour qui », pas « quel mot »). FR treats « traitement du
    // diabete » the same way, in both word orders.
    expect(HP(['diabetes treatment options'])[0]?.stage).toBe('explicit');
    expect(HP(['diabetes diet plan'])[0]?.stage).toBe('explicit');
  });

  it('FRENCH DOES NOT MOVE — it carries bare « symptomes » and never had this defect', () => {
    // Frozen rather than supposed: it is the check that showed this defect was EN-only, and
    // without it a reader could believe the compound list is missing for it too.
    expect(HP(['symptomes du diabete'])[0]?.stage).toBe('indirect');
    expect(HP(['mon diabete me fatigue'])[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — EN conflictual (B5): RECEIVED insult excluded', () => {
  it('« he called me… » (received/reported insult) → excluded, like « il m’a traité de… »', () => {
    expect(detectLabels(['he called me a bouffon in front of everyone'], [CONFLICTUAL])).toEqual(
      [],
    );
  });
});

describe('detectLabels — LANGUAGE GATE: an EN copula never reads `selfDeclaredFr`', () => {
  it('« i am X » on a `selfDeclaredFr` term does NOT tag — the zero comes from the gate, no longer from the absence of heads', () => {
    // This test was the lock of the « EN copula not shipped » debt (PANO-35 batch 2), to be inverted the
    // day of shipping. The EN copula IS shipped since (`SELF_DECLARATION_HEADS_EN`, tier
    // `selfDeclaredEn` which lands BROAD) — and the test was NOT inverted, because its zero
    // CHANGED CAUSE without changing value: the English heads read only `selfDeclaredEn`,
    // and `selfDeclaredFr` stays unreachable from an English copula (the language gate,
    // verified by mutations in `selfdeclared-language-gate.test.ts`). A zero has several possible
    // causes; this one now holds the gate, not the debt.
    const out = detectLabels(['i am depressif'], [topical({ selfDeclaredFr: ['depressif'] })]);
    expect(out).toEqual([]);
  });
});

describe('detectLabels — conflictual (B5, item-level)', () => {
  it('insult issued + 2nd-person target → explicit tag, surfaces = insults', () => {
    const out = detectLabels(["t'es vraiment qu'un bouffon"], [CONFLICTUAL]);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('explicit');
    expect(out[0]?.items[0]?.surfaces).toEqual(['bouffon']);
  });

  it('swear-word without a target (frustration) → excluded', () => {
    expect(detectLabels(['quel bouffon ce scénario de film'], [CONFLICTUAL])).toEqual([]);
  });

  it('CITED insult (received/reported) → excluded', () => {
    expect(detectLabels(["il m'a traite de bouffon devant tout le monde"], [CONFLICTUAL])).toEqual(
      [],
    );
  });
});

describe('detectLabels — variation tolerances (PANO-36 phase 0)', () => {
  it('hyphen ↔ space: a single entry covers both spellings', () => {
    const lex = topical({ explicit: ['burn out'], indirectThreshold: 1 });
    expect(detectLabels(['en plein burn-out cette semaine'], [lex])[0]?.stage).toBe('explicit');
    expect(detectLabels(['en plein burn out cette semaine'], [lex])[0]?.stage).toBe('explicit');
  });

  it('symbolic self-censorship: « c*nne » matches « conne », surface = masked form typed', () => {
    const lex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['conne'],
      targets: ["t'es"],
    };
    const out = detectLabels(["t'es vraiment une c*nne"], [lex]);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.surfaces).toEqual(['c*nne']);
  });

  it('self-censorship: an innocent word does not match (no symbol ≠ different letter)', () => {
    const lex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['conne'],
      targets: ["t'es"],
    };
    expect(detectLabels(["t'es venue avec ta canne"], [lex])).toEqual([]);
  });

  it('expressive elongation: « abruuuuuti » matches « abruti », surface = entire elongated form', () => {
    const out = detectLabels(["t'es un abruuuuuti fini"], [CONFLICTUAL]);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.surfaces).toEqual(['abruuuuuti']);
  });

  it('elongation: the skeleton is GUARDED — without a visible elongation, no skeleton match', () => {
    // « cône » → skeleton « cone » = skeleton of « conne », but no repetition ≥ 3 in the
    // surface → rejected. The fallback opens only to real elongations.
    const lex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['conne'],
      targets: ["t'es"],
    };
    expect(detectLabels(["t'es sous ce cône de chantier"], [lex])).toEqual([]);
  });

  it('elongation on a topical marker: « manifffff » counts as « manif »', () => {
    const out = detectLabels(['grosse manifffff demain'], [topical({ indirectThreshold: 1 })]);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.surfaces).toEqual(['manifffff']);
  });

  it('plural: a singular marker covers its plural form, without overreaching', () => {
    const lex = topical({
      explicit: ['idee noire'],
      indirectCore: ['manif'],
      indirectThreshold: 1,
    });
    // Plural captured…
    expect(detectLabels(['plein de manifs ce mois-ci'], [lex])[0]?.items[0]?.surfaces).toEqual([
      'manifs',
    ]);
    // …but the word boundary holds (« console » does not match « con »).
    const conLex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['con'],
      targets: ["t'es"],
    };
    expect(detectLabels(["t'es devant ta console de jeu"], [conLex])).toEqual([]);
  });
});

describe('detectLabels — self-declaration pattern (PANO-72)', () => {
  const lex = topical({
    explicit: [],
    selfDeclaredFr: ['depressif', 'depressive'],
    indirectCore: ['psy'],
    indirectThreshold: 1,
  });

  it('« je suis dépressif » → explicit; interposed modifiers tolerated', () => {
    expect(detectLabels(['je suis depressif'], [lex])[0]?.stage).toBe('explicit');
    expect(detectLabels(['jsuis une grosse depressive'], [lex])[0]?.stage).toBe('explicit');
    expect(detectLabels(['chui un vrai depressif'], [lex])[0]?.stage).toBe('explicit');
  });

  it('surface = the whole span (copula + modifiers + term)', () => {
    const out = detectLabels(['je suis un pauvre depressif'], [lex]);
    expect(out[0]?.items[0]?.surfaces).toEqual(['je suis un pauvre depressif']);
  });

  it('negation breaks the pattern (« je suis pas dépressif ») → not tagged', () => {
    expect(detectLabels(['je suis pas depressif du tout'], [lex])).toEqual([]);
  });

  it('BARE self-declaration term (without copula) does not match via this field', () => {
    // « depressif » is not in explicit/indirect here → a « film dépressif » tags nothing.
    expect(detectLabels(['ce film est vraiment depressif'], [lex])).toEqual([]);
  });

  it('self-declaration NEVER degraded by a 3rd person in the same comment', () => {
    // The copula anchors the 1st person: stays explicit despite « ma fille ».
    const out = detectLabels(['je suis depressif comme ma fille'], [lex]);
    expect(out[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — aggregation per label', () => {
  it('below the indirect threshold → NO detection (and the item will never be evidence)', () => {
    expect(detectLabels(['je vois un psy demain'], [topical({ indirectThreshold: 2 })])).toEqual(
      [],
    );
  });

  it('indirect threshold reached → indirect tag carrying ALL contributing items', () => {
    const out = detectLabels(
      ['je vois un psy demain', 'la therapie me fait du bien', 'sujet sans rapport'],
      [topical({ indirectThreshold: 2 })],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
    expect(out[0]?.items.map((i) => i.itemIndex)).toEqual([0, 1]);
  });

  it('≥ 1 explicit item → explicit tag, items = explicit AND indirect (all the evidence)', () => {
    const out = detectLabels(['mon anxiété au quotidien', 'je vois un psy demain'], [topical()]);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('explicit');
    expect(out[0]?.items).toHaveLength(2);
  });

  it('a single item can feed SEVERAL labels; another none', () => {
    const out = detectLabels(
      ["t'es un abruti et ta manif est ridicule", 'je rentre en manif à vélo'],
      [topical({ label: 'politics', indirectThreshold: 2 }), CONFLICTUAL],
    );
    const labels = out.map((d) => d.label).sort();
    expect(labels).toEqual(['conflictual', 'politics']);
    // Item 0 contributes to both labels; the surfaces differ per label.
    expect(out.find((d) => d.label === 'politics')?.items.map((i) => i.itemIndex)).toEqual([0, 1]);
    expect(out.find((d) => d.label === 'conflictual')?.items.map((i) => i.itemIndex)).toEqual([0]);
  });
});
