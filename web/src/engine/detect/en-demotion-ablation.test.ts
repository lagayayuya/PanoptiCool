// ABLATION — the fate of three BARE NAMES of disorder: what was refused, and what was shipped.
//
// This file is not a sensor: it is an EXPERIMENT, frozen so its conclusion does not get lost
// again. Three states are compared here, and all three are needed — the refusal is only legible if one sees
// what was refused ALONGSIDE what was shipped.
//
//   BEFORE     — `anxiety`, `depression`, `ptsd` in `explicit`. They NAMED a condition.
//   COLLOQUIAL — the first proposed correction: lower them to the polysemous tier. REFUSED.
//   SHIPPED    — the bare-name tier (`indirectSolo`): they place the broad tag ON THEIR OWN, and
//                no number makes them name.
//
// ── Why the colloquial was refused, and why the personas did not see it ─────────────
// Measured on the VOICES — six EN, two upper-bound, six FR — the descent to colloquial cost
// NOTHING: not a storey on the wrong side, the three distresses kept their finding. A clean green light
// on three benches.
//
// It was false. A persona carries THIRTY items: when `depression` descends, `therapist` or
// `burnout` hold the finding in its place, and the cost stays invisible. The case that pays is not
// a voice, it is a SENTENCE — someone who writes once that they have depression, and nothing
// else. Below the threshold of 2, it did not fall to broad: it disappeared. Five pre-existing
// guards said so; none was a persona.
//
// It is the pattern CLAUDE.md describes under *Ce qu'un filet prouve* — a bench written on voices,
// cited as if it covered the domain — and it was committed by whoever wrote the bench.
//
// ── What this ablation does NOT cover ─────────────────────────────────────────────────────────
//   • It measures STOREYS, never the wrong: the wrong on the worst-case voice is not closed
//     by the shipping, only lowered. It stays counted as a wrong in its bench.
//   • It says nothing of the `selfDeclared` path (anchor by the copula), set aside upstream for a
//     reason of dependencies, not measurement: the EN copula is not shipped.
//   • Three lived voices out of fourteen. A recall verified on three people is not a
//     verified recall.

import { describe, expect, it } from 'vitest';
import { MENTAL_HEALTH_LEXICON } from '../lexicon/mental-health';
import type { TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';
import { EN_REGISTER_PERSONAS } from './en-registers.fixture';
import { EN_UPPER_BOUND_PERSONAS } from './en-upper-bound.fixture';
import { FR_REGISTER_PERSONAS } from './fr-registers.fixture';
import type { RegisterPersona } from './register-bench';

/** The three BARE names. Their PHRASES (`anxiety disorder`, `depression nerveuse`, `post traumatic
 *  stress`…) never moved: it is there that the line reads — what names a disorder still
 *  names. */
const LES_TROIS = ['anxiety', 'depression', 'ptsd'] as const;

/** Without the three, wherever they are — the common base of the two reconstructions. */
function sansLesTrois(termes: readonly string[]): TopicalLexicon {
  return {
    ...MENTAL_HEALTH_LEXICON,
    explicit: MENTAL_HEALTH_LEXICON.explicit.filter((t) => !termes.includes(t)),
    indirectSolo: (MENTAL_HEALTH_LEXICON.indirectSolo ?? []).filter((t) => !termes.includes(t)),
    indirectColloquial: MENTAL_HEALTH_LEXICON.indirectColloquial.filter((t) => !termes.includes(t)),
  };
}

/** The BEFORE state: the terms name. */
function lexiconAvant(termes: readonly string[]): TopicalLexicon {
  const base = sansLesTrois(termes);
  return { ...base, explicit: [...base.explicit, ...termes] };
}

/** The REFUSED variant: the terms descend to the polysemous tier, hence below the threshold. */
function lexiconColloquial(termes: readonly string[]): TopicalLexicon {
  const base = sansLesTrois(termes);
  return { ...base, indirectColloquial: [...base.indirectColloquial, ...termes] };
}

function persona(id: string): RegisterPersona {
  const p = [...EN_REGISTER_PERSONAS, ...EN_UPPER_BOUND_PERSONAS, ...FR_REGISTER_PERSONAS].find(
    (x) => x.id === id,
  );
  if (p === undefined) {
    throw new Error(`persona \`${id}\` absente`);
  }
  return p;
}

function etageDe(
  texts: readonly string[],
  lexicon: TopicalLexicon,
): 'explicit' | 'indirect' | null {
  return detectLabels(texts, [lexicon])[0]?.stage ?? null;
}

const etage = (p: RegisterPersona, lexicon: TopicalLexicon) =>
  etageDe(
    p.items.map((i) => i.text),
    lexicon,
  );

describe('ablation of the three bare names — the colloquial refused, the solo tier shipped', () => {
  const avant = lexiconAvant(LES_TROIS);
  const colloquial = lexiconColloquial(LES_TROIS);

  it('WHAT THE SHIPPING BUYS (1) — the worst-case voice loses its NAMED finding', () => {
    const p = persona('clinical_slang');
    expect(etage(p, avant)).toBe('explicit');
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('indirect');
  });

  it('WHAT THE SHIPPING BUYS (2) — the caring-relative residue closes', () => {
    // The UNFORESEEN gain, and the most interesting: this residue had resisted the STOREY rules, which
    // sought to recognize a register. It falls by a LEXICON decision, obtained on a
    // voice that is nothing like a caring relative.
    const p = persona('caregiver');
    expect(etage(p, avant)).toBe('explicit');
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('indirect');
  });

  it('WHAT THE SHIPPING DOES NOT COST — the three lived voices keep their finding', () => {
    expect(etage(persona('distress'), MENTAL_HEALTH_LEXICON)).toBe('explicit');
    expect(etage(persona('fr_distress'), MENTAL_HEALTH_LEXICON)).toBe('explicit');
    expect(etage(persona('fr_distress_colloquial'), MENTAL_HEALTH_LEXICON)).toBe('indirect');
  });

  it('WHAT THE COLLOQUIAL WOULD HAVE COST — the lone sentence DISAPPEARS, in both languages', () => {
    // The result that led to refusing the first correction, and the stopping criterion of the batch. A
    // person who writes once, literally, what they live — without care vocabulary around
    // to catch them. Under the polysemous tier she no longer exists; under the solo tier she is
    // tagged broad.
    const fr = ['je fais une depression depuis le mois de novembre'];
    const en = ['i was diagnosed with depression last year'];
    for (const phrase of [fr, en]) {
      expect(etageDe(phrase, avant)).toBe('explicit');
      expect(etageDe(phrase, colloquial)).toBeNull();
      expect(etageDe(phrase, MENTAL_HEALTH_LEXICON)).toBe('indirect');
    }
  });

  it('THE FALSE GREEN — over the fourteen voices, the colloquial seemed free', () => {
    // This test does not keep an acquired result: it keeps an ILLUSION, so no one rediscovers it alone
    // and draws the same conclusion. No voice reveals the cost, because a voice has thirty
    // items and the neighborhood always catches the term that falls.
    expect(etage(persona('distress'), colloquial)).toBe('explicit');
    expect(etage(persona('fr_distress'), colloquial)).toBe('explicit');
    for (const p of FR_REGISTER_PERSONAS) {
      expect(etage(p, colloquial)).toBe(etage(p, MENTAL_HEALTH_LEXICON));
    }
  });

  it('THE THREE ARE JOINTLY NECESSARY — no proper subset suffices', () => {
    // The worst-case voice carried EXACTLY three named hits: leaving one is enough to name. A
    // partial correction would not have been a half-measure, but a non-measure.
    for (const terme of LES_TROIS) {
      const unSeulRemonte = lexiconAvant([terme]);
      expect(etage(persona('clinical_slang'), unSeulRemonte)).toBe('explicit');
    }
    // `anxiety` is an exception in the other direction: it alone carried the caring relative's residue.
    expect(etage(persona('caregiver'), lexiconAvant(['anxiety']))).toBe('explicit');
    expect(etage(persona('caregiver'), lexiconAvant(['depression']))).toBe('indirect');
    expect(etage(persona('caregiver'), lexiconAvant(['ptsd']))).toBe('indirect');
  });

  it('THE MARGIN — the only EN true positive now holds its NAMED finding by `burnout` alone', () => {
    // Kept because it is the kind of dependency that is paid for late. Before the shipping, `distress`
    // carried three naming terms (`depression`, `anxiety`, `burnout`): the margin was three.
    // It is now ONE.
    //
    // Yet `burnout` is a bare name, and the rule that just descended the three others invites it there
    // in exactly the same way. Whoever wants to descend it must see first that the only true
    // English positive of the repo would lose its named finding — not that it would disappear (the solo tier
    // would catch it), but the demonstration would no longer have any NAMED finding in the whole EN bench.
    const p = persona('distress');
    const sansBurnout: TopicalLexicon = {
      ...MENTAL_HEALTH_LEXICON,
      explicit: MENTAL_HEALTH_LEXICON.explicit.filter((t) => t !== 'burnout'),
    };
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('explicit');
    expect(etage(p, sansBurnout)).toBe('indirect');
    // The BEFORE margin, so the comparison is legible and not merely asserted.
    expect(etage(p, { ...avant, explicit: avant.explicit.filter((t) => t !== 'burnout') })).toBe(
      'explicit',
    );
  });

  it('THE DECISION — the three live in the bare-name tier, neither elsewhere nor nowhere', () => {
    // The lock. Raising them back to `explicit` returns the assertion; lowering them to colloquial
    // reopens the lone-sentence hole. Both errors are red here.
    for (const terme of LES_TROIS) {
      expect(MENTAL_HEALTH_LEXICON.indirectSolo ?? []).toContain(terme);
      expect(MENTAL_HEALTH_LEXICON.explicit).not.toContain(terme);
      expect(MENTAL_HEALTH_LEXICON.indirectColloquial).not.toContain(terme);
    }
    // The phrases still name — without them, the shipping would be a disguised eviction.
    for (const syntagme of ['anxiety disorder', 'post traumatic stress', 'depression nerveuse']) {
      expect(MENTAL_HEALTH_LEXICON.explicit).toContain(syntagme);
    }
  });
});
