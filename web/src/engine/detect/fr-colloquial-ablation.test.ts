// ABLATION — the fate of the six French colloquial formulations (PANO-35).
//
// This file is not one more sensor: it is an EXPERIMENT, frozen so its conclusion does not get
// lost again. It records a **measured acceptance of a known false positive**, which is the kind
// of decision that disappears in silence if nothing holds it.
//
// ── The question, and why the obvious formulation is biased ─────────────────────────────────
// « Do these turns of phrase appear in real distress? » obviously finds yes: the question
// is built for it. The one that decides, and that had dropped five English terms, is:
// **do they carry a recall nothing else carries?** The five English ones fell because
// `therapist`, `sertraline` and `antidepressants` already detected the person — their removal cost
// zero. The instrument is therefore an ablation: remove the terms and watch who disappears.
//
// ── Admission ≠ eviction ─────────────────────────────────────────────────────────────────────────
// The ADR-0003 rule (*L'admission d'un terme*) is a GATE rule, not an expulsion. Not
// admitting a term costs no recall — we never had its own. Evicting a ratified term costs
// a recall that EXISTS. A high bar at the entrance and a high bar at the exit are not the
// same requirement, and it is why these six are not settled by doctrine.

import { describe, expect, it } from 'vitest';
import { MENTAL_HEALTH_LEXICON } from '../lexicon/mental-health';
import type { TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';
import { FR_REGISTER_PERSONAS } from './fr-registers.fixture';
import type { RegisterPersona } from './register-bench';

/**
 * The six formulations under examination. Five live in `indirectColloquial`; **`j'en peux plus` lives
 * in `indirectCore`** — the « low-ambiguity » tier, which makes its eviction heavier still than
 * that of the five others.
 */
const LES_SIX = [
  "j'en peux plus",
  'au bout de ma vie',
  'je craque',
  'a plat',
  'je sature',
  'cafard',
] as const;

/** The `mental_health` lexicon deprived of certain terms — test variant, never shipped. */
function lexiconSans(termes: readonly string[]): TopicalLexicon {
  return {
    ...MENTAL_HEALTH_LEXICON,
    indirectCore: MENTAL_HEALTH_LEXICON.indirectCore.filter((t) => !termes.includes(t)),
    indirectColloquial: MENTAL_HEALTH_LEXICON.indirectColloquial.filter((t) => !termes.includes(t)),
  };
}

function persona(id: string): RegisterPersona {
  const p = FR_REGISTER_PERSONAS.find((x) => x.id === id);
  if (p === undefined) {
    throw new Error(`persona \`${id}\` absente`);
  }
  return p;
}

/** The storey produced for a persona under a given lexicon, or `null` if no finding. */
function etage(p: RegisterPersona, lexicon: TopicalLexicon): 'explicit' | 'indirect' | null {
  const texts = p.items.map((i) => i.text);
  return detectLabels(texts, [lexicon])[0]?.stage ?? null;
}

describe('ablation of the six FR formulations — what the removal buys and what it costs', () => {
  const sansLesSix = lexiconSans(LES_SIX);

  it('WHAT THE REMOVAL BUYS — the hyperbolic false positive disappears entirely', () => {
    const p = persona('fr_hyperbolic');
    // A young woman talking about a comeback and macarons, tagged « mental health » today.
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('indirect');
    expect(etage(p, sansLesSix)).toBeNull();
  });

  it('WHAT THE REMOVAL DOES NOT COST — CARED-FOR distress is indifferent', () => {
    const p = persona('fr_distress');
    // Exactly the pattern that had condemned the five English terms: the care vocabulary
    // (psychologist, sertraline, therapy) already detects, so the colloquial ones carry nothing here.
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('explicit');
    expect(etage(p, sansLesSix)).toBe('explicit');
  });

  it('WHAT THE REMOVAL COSTS — distress WITHOUT CARE disappears completely', () => {
    const p = persona('fr_distress_colloquial');
    // It is the result that decides. A woman genuinely in distress, without diagnosis or follow-up,
    // detected today — and no longer detected at all after removal. Not degraded: DISAPPEARED.
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('indirect');
    expect(etage(p, sansLesSix)).toBeNull();
  });

  it('NO term is individually load-bearing — it is the threshold crossing that is', () => {
    // Removing ONE SINGLE of the six changes the storey of none of the three voices. The mechanism is therefore not
    // « this term detects this woman », it is « the accumulation crosses the threshold of 2 ». The voice without
    // care carries 5 hits, 4 of which among the six; the fifth (« au fond du trou », colloquial but
    // outside the six) remains ALONE after removal, hence below the threshold. She falls by the threshold, not by
    // the vocabulary.
    for (const terme of LES_SIX) {
      const lex = lexiconSans([terme]);
      expect(etage(persona('fr_hyperbolic'), lex)).toBe('indirect');
      expect(etage(persona('fr_distress_colloquial'), lex)).toBe('indirect');
      expect(etage(persona('fr_distress'), lex)).toBe('explicit');
    }
  });

  it('THE DECISION — the six stay, and the false positive is accepted knowingly', () => {
    // Criterion posed BEFORE the measurement: if the voice without care survives the removal, the six go; if
    // it disappears, they stay and the false positive is the price. It disappears.
    //
    // This test is the trace of that decision. It does not assert one more behavior — the three
    // first ones do — it states that the finding on `fr_hyperbolic` is a KNOWN,
    // MEASURED and ACCEPTED false positive, and not a defect one would not have seen. The day someone removes the six
    // to « clean up the FPs », the tests above go red and send them back here.
    const fpAccepte = etage(persona('fr_hyperbolic'), MENTAL_HEALTH_LEXICON);
    const rappelPreserve = etage(persona('fr_distress_colloquial'), MENTAL_HEALTH_LEXICON);
    expect(fpAccepte).toBe('indirect');
    expect(rappelPreserve).toBe('indirect');
    // The six are STILL in the shipped lexicon. This assertion is the lock of the decision.
    const tousPresents = [
      ...MENTAL_HEALTH_LEXICON.indirectCore,
      ...MENTAL_HEALTH_LEXICON.indirectColloquial,
    ];
    for (const terme of LES_SIX) {
      expect(tousPresents).toContain(terme);
    }
  });
});
