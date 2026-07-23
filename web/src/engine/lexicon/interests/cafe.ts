// Interest lexicon `cafe` (D2, PANO-78 batch 3) — specialty coffee / methods.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR coffee: extraction methods, varieties, drinks, barista jargon.
// Entities = generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « espresso », « v60 », « chemex », « aeropress », « latte art », « cold brew »,
//     « arabica », « robusta », « torrefaction », « barista », « cafe de specialite ».
//   · ANCHORED — « café » (drink / bar / color / « café du commerce »), « filtre » (shared with photo),
//     « extraction » (dental), « dose », « mouture », « moka » (first name), « crema »: co-occurrence.
//   · EXCLUDED — nothing desperate; bare « café » never solo (too polysemous).
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// EN usage verified by research (barista / third-wave glossaries).
//   · SOLO — « portafilter », « microfoam », « burr grinder », « channeling », « puck prep »,
//     « pour over », « third wave », « degassing », « moka pot », « coffeetok »: univocal, and
//     often COMPOUND — the domain holds only by its phrases.
//   · ANCHORED — the EN 50/50: « grind » (= THE DAILY SLOG, « the daily grind »; and the grind of `skate` and
//     of games), « brew » (BEER), « roast » (= TO MOCK, dominant sense online), « beans »
//     (beans), « tamper » (« tamper with »), « cupping » (cupping therapy):
//     companion required. None of these words carries the domain alone.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

import type { InterestLexicon } from '../types';

export const CAFE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'cafe',
  themeLabel: 'theme.cafe.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.coffee-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'espresso',
    'ristretto',
    'cappuccino',
    'flat white',
    'latte art',
    'cold brew',
    'v60',
    'chemex',
    'aeropress',
    'arabica',
    'robusta',
    'torrefaction',
    'barista',
    'cafe de specialite',
    'cafetiere italienne',
    'grains de cafe',
    'single origin',
    'cortado',
    'macchiato',
    // EN variants (PANO-88): SOLO univocal (equipment / methods / community).
    'portafilter',
    'microfoam',
    'burr grinder',
    'channeling',
    'puck prep',
    'pour over',
    'third wave',
    'degassing',
    'moka pot',
    'gooseneck kettle',
    'specialty coffee',
    'coffeetok',
    'lungo',
  ],
  anchored: [
    'cafe', // drink / bar / color / « café du commerce »
    'filtre', // shared with photography
    'extraction', // dental / mining
    'dose', // generic dose
    'mouture', // generic
    'moka', // first name / cake
    'crema', // generic
    'grain', // generic grain
    'percolateur',
    // EN variants (PANO-88): ANCHORED.
    'grind', // « the daily grind » / grind of skate and games (EN)
    'brew', // beer / « brewing trouble » (EN)
    'roast', // = to mock, dominant sense online (EN)
    'beans', // beans / « spill the beans » (EN)
    'tamper', // « tamper with » (EN)
    'cupping', // cupping therapy vs tasting (EN)
  ],
  selfDeclared: ['barista', 'passionne de cafe'],
};
