// Lexique d'intérêt `danse` (D2, PANO-78 lot 3) — danse (styles, pratique).
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la danse FR : styles, gestes, formats. Entités = signal public générique
// enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « danse », « choregraphie », « breakdance », « krump », « twerk », « voguing »,
//     « kizomba », « bachata », « modern jazz », « danseur ».
//   · ANCRÉ — « break » (pause), « battle » (combat / esport), « contemporain » (générique),
//     « classique » (générique), « house » (maison / electro), « crew » (esport), « salsa » (sauce),
//     « popping », « locking », « impro » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

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
    // Variantes EN (PANO-88) : SOLO univoques.
    'dance cover',
    'dance challenge',
  ],
  anchored: [
    'break', // pause / break (cinéma, muscu)
    'battle', // combat / esport
    'contemporain', // générique
    'classique', // générique
    'house', // maison / house (electro)
    'crew', // équipe / esport
    'salsa', // sauce salsa
    'popping', // fairly danse mais gardé ancré
    'locking',
    'impro', // improvisation générique
    'chore', // abréviation courte
  ],
  selfDeclared: ['danseur', 'danseuse'],
};
