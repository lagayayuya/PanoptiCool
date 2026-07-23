// Interest lexicon `danse` (D2, PANO-78 batch 3) — dance (styles, practice).
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR dance: styles, moves, formats. Entities = generic public signal
// enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « danse », « choregraphie », « breakdance », « krump », « twerk », « voguing »,
//     « kizomba », « bachata », « modern jazz », « danseur ».
//   · ANCHORED — « break » (break/pause), « battle » (fight / esport), « contemporain » (generic),
//     « classique » (generic), « house » (house/home / electro), « crew » (esport), « salsa » (sauce),
//     « popping », « locking », « impro »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

import type { InterestLexicon } from '../types';

export const DANSE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'danse',
  themeLabel: 'theme.danse.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.dance-classes', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'danse',
    'danseur',
    'danseuse',
    'choregraphie',
    'breakdance',
    'krump',
    'twerk',
    'waacking',
    'voguing',
    'kizomba',
    'bachata',
    'modern jazz',
    'danse classique',
    'danse contemporaine',
    'zumba',
    'cours de danse',
    'street dance',
    // EN variants (PANO-88): SOLO univocal.
    'dance cover',
    'dance challenge',
  ],
  anchored: [
    'break', // pause / break (cinema, muscu)
    'battle', // fight / esport
    'contemporain', // generic
    'classique', // generic
    'house', // house/home / house (electro)
    'crew', // team / esport
    'salsa', // salsa sauce
    'popping', // fairly dance but kept anchored
    'locking',
    'impro', // generic improvisation
    'chore', // short abbreviation
  ],
  selfDeclared: ['danseur', 'danseuse'],
};
