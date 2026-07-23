// Interest lexicon `mode` (D2, PANO-77 batch 2 · entities enriched PANO-77 resumed) — fashion / style.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR fashion: pieces, cuts, AESTHETICS, HOUSES and CHAINS, community
// JARGON. Blind from common usage; brands/jargon = generic public signal enriched
// by research (luxury houses, fast-fashion, fashion slang).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « haute couture », « streetwear », « ootd », « y2k », « gorpcore »; univocal
//     houses (« balenciaga », « jacquemus », « mugler », « prada », « vinted », « shein »).
//   · ANCHORED — 50/50 recovered by co-occurrence: « mode » (instruction manual), « look », « style »,
//     « fit », « drip » (drop), « dupe », common-word-brands (« coach », « guess », « mango »,
//     « gap », « celine », « kenzo »).
//   · EXCLUDED — « ss » / « aw » / « fw » (season abbreviations): too ambiguous, « ss » with a sensitive
//     historical connotation → discarded (we keep « fashion week » spelled out).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from « sneakers » and « coiffure ».

import type { InterestLexicon } from '../types';

export const MODE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'mode',
  themeLabel: 'theme.mode.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.fast-fashion', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Generic vocabulary
    'haute couture',
    'pret a porter',
    'garde robe',
    'dressing',
    'fashion week',
    'defile de mode',
    'streetwear',
    'friperie',
    'seconde main',
    'total look',
    'it bag',
    'fringues',
    'tendance mode',
    'look du jour',
    'lookbook',
    'capsule collection',
    'basique intemporel',
    'sappe',
    // Jargon / aesthetics (community slang)
    'ootd',
    'fit check',
    'y2k',
    'old money',
    'quiet luxury',
    'gorpcore',
    'blokecore',
    'thrift',
    'seconde peau',
    // Luxury houses (univocal)
    'balenciaga',
    'jacquemus',
    'mugler',
    'prada',
    'dior',
    'saint laurent',
    'bottega veneta',
    'loewe',
    'gucci',
    'chanel',
    'hermes',
    'louis vuitton',
    'givenchy',
    'versace',
    'miu miu',
    'ganni',
    'off white',
    'stone island',
    // Fast-fashion chains (univocal)
    'zara',
    'uniqlo',
    'shein',
    'bershka',
    'vinted',
    'kiabi',
    // EN variants (PANO-88): SOLO univocal (fashion community formats).
    'try on haul',
    'grwm',
  ],
  anchored: [
    'mode', // instruction manual / « en mode » / airplane mode
    'look', // gaze / generic English
    'style', // generic style
    'fit', // « fit » (shape) / English
    'drip', // dripping
    'dupe', // to dupe / copy
    'tenue', // behavior (« tenue de route »)
    'marque', // mark / verb to mark
    'collection', // collection (stamps)
    'vintage', // generic old
    'piece', // room / coin
    'coupe', // World Cup / hair
    'runway', // runway (airport)
    // Homograph brands (common words / first names)
    'coach', // sports coach
    'guess', // « guess » (to guess)
    'mango', // fruit
    'gap', // gap
    'celine', // first name
    'kenzo', // first name
    'outfit', // outfit vs generic English (EN, anchored)
    'haul', // fashion haul vs generic (EN)
  ],
  selfDeclared: ['passionnee de mode', 'fashionista', 'styliste'],
};
