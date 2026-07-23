// WITNESS — a term present at BOTH storeys, and the named storey that wins in silence.
//
// THE MOTIVE, and it is structural rather than editorial. The adjectives batch built
// `selfDeclaredEn` with a reasoned admission bar: it EXCLUDES from it `manic`, `paranoid`,
// `schizophrenic` because they are « applied to a third party or to an object » (mental-health.ts).
// But the `explicit` entries of the SAME adjectives were never removed. A term at both tiers
// short-circuits the new tier: `explicit` wins, and the adjective NAMES from one item, in any frame
// — including the one the admission bar had set aside. The doctrine had been applied to one gate and
// not to the other.
//
// What this witness watches is therefore the INTERSECTION `explicit ∩ selfDeclaredEn`, term by term.
// It is a MECHANICAL property, and it is what makes it useful: it is verified without judging an
// idiom, where the hunt through comments had found only one term in three.
//
// ── WHAT THIS WITNESS DOES NOT COVER ────────────────────────────────────────────────────────────
// It must be read before citing it, because its scope is narrow:
//
//   · It measures NO object idiom. It does not know what « anemic » means; it counts list
//     memberships. An adjective with an object idiom admitted at the `explicit` tier ONLY — thus
//     outside the intersection — is perfectly invisible to it. It is the case of any term that no
//     self-declaration batch has doubled.
//   · It says nothing of the other forms of the same substantive defect — a justification that
//     affirms a property (predication, verbal tense, attachment) that no code evaluates. `i voted`,
//     `moronic` and `catholic` belong to it, are NOT tier doublons, and are therefore outside this
//     net. They are named as debts in the catalog (`docs/constats-sensibles.md` §4, entry of the
//     adjectives batch — former note `dette-appartenance-en.md`).
//   · It holds only for English: `selfDeclaredFr` NAMES by construction, so the intersection means
//     nothing there.
//
// ── MUTATIONS RUN, and what they DID ────────────────────────────────────────────────────────────
//   1. Put `anemic` back in `HEALTH_PHYSICAL_LEXICON.explicit` → 4 REDS / 6. The expected list AND
//      the behavior probe (« the sound mix on this album is anemic » goes back to `explicit`).
//      Both halves went red, which was the goal: the list alone could have gone green for a list
//      reason.
//   2. Remove `celiac` from `selfDeclaredEn` (instead of `explicit`) → 1 RED, on the lock alone.
//      Confirms that the witness watches the INTERSECTION and not the mere presence in `explicit`.
//   3. Remove `anemia` from `explicit` → GREEN on the intersection, 1 RED on the recall probe.
//      The result is the one predicted, and it is worth writing because it says the LIMIT of the
//      lock: the intersection does not protect the bearer's recall. It is the « the NOUN carries the
//      recall » probe that does it, and it is why it exists separately.
//
// A fourth mutation was attempted BEFORE these and proved nothing: the loop restored the lexicon by
// `git checkout` on an uncommitted file, so that mutations 2 and 3 were measured on the UNFIXED
// lexicon. The three results above are those of the redo, the fix committed. Recorded because a
// mutation that does not apply looks exactly like a mutation that passes.

import { describe, expect, it } from 'vitest';
import { HEALTH_PHYSICAL_LEXICON } from '../lexicon/health-physical';
import { MENTAL_HEALTH_LEXICON } from '../lexicon/mental-health';
import { POLITICS_LEXICON } from '../lexicon/politics';
import { RELIGION_LEXICON } from '../lexicon/religion';
import { SEXUALITY_LEXICON } from '../lexicon/sexuality';
import type { TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';

// The FIVE topical lexicons. `conflictual` is absent, and not by omission: it is `ItemLevelLexicon`,
// a type that carries NEITHER `explicit` NOR `selfDeclaredEn` — the intersection is impossible to
// write there, not merely empty. Its gate is the emitted insult, not an identity (ADR-0003, *La
// symétrie d'un axe*: « sans objet »). It is the compiler that holds this exclusion, not this file.
const LEXIQUES: readonly TopicalLexicon[] = [
  HEALTH_PHYSICAL_LEXICON,
  MENTAL_HEALTH_LEXICON,
  SEXUALITY_LEXICON,
  RELIGION_LEXICON,
  POLITICS_LEXICON,
];

/**
 * The ONLY tier doublons tolerated, and each has its reason written. One more entry is an adjective
 * that NAMES in a frame `selfDeclaredEn` had nonetheless refused.
 *
 *   · `celiac` / `coeliac` — no English idiom applies them to an object. « celiac friendly » is
 *     DOMAIN vocabulary: it tags someone who documents themselves, which is a signal-without-lived —
 *     the demonstration, not a wrong (ADR-0003, *L'incertitude*).
 *   · `adhd` — it is a NOUN, not an adjective. « i have adhd » is the canonical formulation of the
 *     bearer; lowering it would replay exactly the error `en-demotion-ablation.test.ts` froze on
 *     `depression` / `anxiety`.
 *   · `bulimic` — object idiom NOT attested. It took inventing « a bulimic release cycle » to test
 *     it, and that is the answer: the term does not trigger on text anyone really writes.
 */
const DOUBLONS_ADMIS: Readonly<Record<string, readonly string[]>> = {
  health_physical: ['celiac', 'coeliac'],
  mental_health: ['adhd', 'bulimic'],
};

function intersection(l: TopicalLexicon): string[] {
  const sd = l.selfDeclaredEn ?? [];
  return l.explicit.filter((t) => sd.includes(t));
}

describe('intersection `explicit` ∩ `selfDeclaredEn` — the tier doublon', () => {
  it('THE LOCK — no doublon outside the admitted list, and each of them has its reason in the file', () => {
    for (const l of LEXIQUES) {
      expect(intersection(l).sort()).toEqual([...(DOUBLONS_ADMIS[l.label] ?? [])].sort());
    }
  });

  it('THE THREE REMOVED are no longer in `explicit`, and still live at the broad tier', () => {
    // Removed from `explicit` but NOT from the lexicon: it is a demotion, not an eviction. The
    // demonstration survives whole — the term still triggers, it no longer affirms.
    for (const t of ['anemic', 'epileptic']) {
      expect(HEALTH_PHYSICAL_LEXICON.explicit).not.toContain(t);
      expect(HEALTH_PHYSICAL_LEXICON.selfDeclaredEn ?? []).toContain(t);
    }
    expect(MENTAL_HEALTH_LEXICON.explicit).not.toContain('anorexic');
    expect(MENTAL_HEALTH_LEXICON.selfDeclaredEn ?? []).toContain('anorexic');
  });

  it('THE OBJECT IDIOM NO LONGER NAMES — the probe that opened the batch', () => {
    // These four sentences posed a NAMED finding of high confidence on someone who was describing
    // a record, an edit, a budget and a margin.
    const objets = [
      'the sound mix on this album is anemic',
      'an anemic performance from the whole squad',
      'the editing in that trailer is epileptic',
      'this budget is anorexic',
    ];
    for (const phrase of objets) {
      const d = detectLabels([phrase], LEXIQUES)[0];
      expect(d?.stage).not.toBe('explicit');
    }
  });

  it('THE NOUN CARRIES THE RECALL — what the demotion does not cost', () => {
    // The counterpart, and it is what makes the demotion tenable rather than a disguised eviction:
    // the adjective descends, the NOUN of the condition stays naming. Someone who lives the condition
    // writes it somewhere in this form.
    for (const phrase of [
      'my anemia has been bad this month',
      'i was diagnosed with epilepsy last year',
      'my anorexia relapsed in the spring',
    ]) {
      expect(detectLabels([phrase], LEXIQUES)[0]?.stage).toBe('explicit');
    }
  });

  it('THE PRICE, DECLARED — the isolated utterance of the adjective disappears below the threshold', () => {
    // Measured BEFORE the voices, as ADR-0003 (*La rétrogradation*) imposes: an ablation carried out
    // on personas returns false green lights, the neighborhood catching the fall of a term.
    //
    // This cost is not new, it is EXTENDED: `selfDeclaredEn` has no solo crossing, and the module
    // already declares that « i am diabetic » written ONCE returns NOTHING. Three more adjectives
    // join this regime. `anaemic` — the British spelling of the same word — was ALREADY there, alone,
    // and it is this spelling incoherence that made the decision easy.
    expect(detectLabels(['i am anemic'], LEXIQUES)[0]).toBeUndefined();
    expect(detectLabels(['the growth figures were anaemic'], LEXIQUES)[0]).toBeUndefined();
    // And the bearer who writes a SECOND domain thing keeps their finding, at the broad storey.
    expect(detectLabels(['i am anemic', 'iron deficiency'], LEXIQUES)[0]?.stage).toBe('indirect');
  });

  it('`had a stroke` — the doublon is NOT the only path, and this one went through kinship', () => {
    // Outside the intersection (no self-declaration tier carried it), therefore invisible to the lock
    // above: it is here because the same batch corrected it, not because the witness catches it.
    //
    // It was in `explicit` AGAINST the rule written just above it (« the possessive alone NAMES »).
    // What hid the defect is the 3rd-person filter, a CLOSED list of kinship terms: the sealed voice
    // `relative` writes « my nan », so it was mute, and the defect could not appear on any persona.
    expect(HEALTH_PHYSICAL_LEXICON.explicit).not.toContain('had a stroke');
    expect(HEALTH_PHYSICAL_LEXICON.indirectCore).toContain('had a stroke');
    for (const phrase of ['he had a stroke last winter', 'the driver had a stroke at the wheel']) {
      expect(detectLabels([phrase], LEXIQUES)[0]?.stage).not.toBe('explicit');
    }
    // The possessive, itself, still NAMES — the rule of the block is intact.
    expect(detectLabels(['my stroke was in march'], LEXIQUES)[0]?.stage).toBe('explicit');
  });
});
