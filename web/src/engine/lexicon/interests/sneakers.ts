// Interest lexicon `sneakers` (D2, PANO-76 batch 1, DEEP rewrite) — sneakers / sneaker culture.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR sneaker culture: emblematic models, brands, collection jargon.
// Entities enriched by PUBLIC research (notable models). Blind.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal models/brands: « air max », « air jordan », « air force », « yeezy »,
//     « new balance », « stan smith », « sneakers », « sneakerhead ».
//   · ANCHORED — homographs RECOVERED by co-occurrence: « jordan » (first name), « dunk » (basketball),
//     « samba » (dance), « gazelle » (animal), « colorway », « drop »: count near a companion.
//   · EXCLUDED — « basket » singular (the SPORT); « baskets » plural kept SOLO (the machinery only adds
//     a trailing `s?`, « baskets » does not match « basket »).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from « mode » (broader, separate theme).

import type { InterestLexicon } from '../types';

export const SNEAKERS_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'sneakers',
  themeLabel: 'theme.sneakers.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.sneaker-drops', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'sneakers',
    'baskets',
    'air max',
    'air jordan',
    'air force',
    'yeezy',
    'new balance',
    'stan smith',
    'sneakerhead',
    'edition limitee sneakers',
    'nike',
    'adidas',
    'puma',
    'chaussures collector',
    'paire de sneakers',
    'jordan 1',
    'jordan 4',
    // Resell & models (retrofit PANO-90)
    'stockx',
    'deadstock',
    'new balance 550',
    'dunk low',
    'edition limitee basket',
    'revente sneakers',
    'drop sneakers',
    // EN variants (PANO-88): SOLO univocal (sneaker jargon).
    'on feet',
    'resell',
    'unboxing sneakers',
  ],
  anchored: [
    'jordan', // first name
    'dunk', // basketball move
    'samba', // dance
    'gazelle', // animal
    'colorway', // niche English
    'drop', // release vs generic « drop »
    'collector', // generic collectible
    'paire', // generic « une paire »
    'goat', // « greatest of all time » / goat / resell platform
    'restock', // restock vs generic
    'cop', // to buy (jargon) vs « cop » (police) (EN, anchored)
  ],
  selfDeclared: ['sneakerhead', 'collectionneur de sneakers'],
};
