// Interest lexicon `muscu` (D2, PANO-76 batch 1, DEEP rewrite) — bodybuilding / strength training.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR bodybuilding: exercises, gear, sports nutrition, gym jargon.
// Written blind from common usage, never from an export.
//
// ── Recall method (PANO-76 resumed) ────────────────────────────────────────────────────────────
// We INCLUDE richly; the floor + the base ranking drown the residual noise. Two tiers:
//   · SOLO — near-univocal, enter on their own (« musculation », « squat », « deadlift »).
//   · ANCHORED — 50/50 whose NON-sports sense is common: count only with a domain
//     companion (« seche » near « muscu », not « la terre est seche »).
//   · EXCLUDED — the truly hopeless: « masse » (crowd), « serie » (TV), « pompe » (shoe/water pump).
//
// ── Entities (standard retrofit, PANO-90) ──────────────────────────────────────────────────────
// Nutrition/apparel brands and gym jargon added: « myprotein », « gymshark », « drop set »,
// « rm » (rep max, anchored). Public research.
//
// ── English variants (PANO-88) ──────────────────────────────────────────────────────────────────
// EN common in FR: SOLO univocal (« workout », « push day », « pull day », « leg day »); ANCHORED
// polysemous (« gym » = gymnastics/first name, « bulk » = bulk, « shredded » = shredded).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from « fitness/cross-training » (separate theme). BODY IMAGE / eating disorders
// stay D1: no weight, calorie or restriction marker (« sèche » = sports cut, anchored).

import type { InterestLexicon } from '../types';

export const MUSCU_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'muscu',
  themeLabel: 'theme.muscu.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.supplements', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'musculation',
    'muscu',
    'salle de sport',
    'salle de muscu',
    'prise de masse',
    'developpe couche',
    'souleve de terre',
    'deadlift',
    'squat',
    'soulever de la fonte',
    'gainage',
    'hypertrophie',
    'street workout',
    'programme full body',
    'push pull legs',
    'halteres',
    'barre de traction',
    'kettlebell',
    'biceps',
    'triceps',
    'pectoraux',
    'quadriceps',
    'ischios',
    'abdos',
    'proteine en poudre',
    'whey',
    'creatine',
    'shaker proteine',
    'temps sous tension',
    'a la salle',
    'jour de bras',
    'seance jambes',
    'seance pecs',
    'seance dos',
    // Brands & jargon (retrofit PANO-90)
    'myprotein',
    'gymshark',
    'optimum nutrition',
    'nutrimuscle',
    'drop set',
    'superset',
    'prise de force',
    'bcaa',
    'shaker whey',
    // EN variants (PANO-88)
    'workout',
    'push day',
    'pull day',
    'leg day',
  ],
  anchored: [
    'seche', // sports cut vs « sec / la terre sèche »
    'volume', // bulking phase vs « le volume sonore »
    'serie', // set of reps vs TV series → anchored (the TV sense dominates out of context)
    'reps', // reps vs any abbreviation
    'fonte', // lifting weights vs « la fonte des neiges »
    'charge', // workload vs « charge mentale / à charge »
    'bras', // arm day vs generic arm
    'rm', // rep max vs generic acronym
    'congestion', // muscle pump vs traffic / medical
    'gym', // gym vs gymnastics / first name (EN)
    'bulk', // bulking phase vs « in bulk » (EN)
    'shredded', // lean/defined vs « shredded » (EN)
  ],
  selfDeclared: ['bodybuilder', 'pratiquant de muscu', 'powerlifter'],
};
