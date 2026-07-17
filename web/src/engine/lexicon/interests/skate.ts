// Lexique d'intérêt `skate` (D2, PANO-78 lot 3) — skateboard.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du skate FR : tricks, matériel, MARQUES, spots. Entités = signal public
// générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « skateboard », « ollie », « kickflip », « heelflip », « griptape », « skatepark »,
//     « half pipe », « thrasher ».
//   · ANCRÉ — « skate » (patin), « board » (planche générique), « deck » (jeu de cartes / pont),
//     « grind » (travail / jeu vidéo), « spot » (lieu / projecteur), « trucks » (camions), « element »
//     (chimie), « vans » (fourgons / marque) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const SKATE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'skate',
  themeLabel: 'theme.skate.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.skate-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'skateboard',
    'ollie',
    'kickflip',
    'heelflip',
    'nollie',
    'tre flip',
    'griptape',
    'skatepark',
    'half pipe',
    'plan incline',
    'roues de skate',
    'thrasher',
    'longboard',
    'shove it',
  ],
  anchored: [
    'skate', // patin (à glace) / roller
    'board', // planche générique
    'deck', // jeu de cartes / pont
    'grind', // travail / grind (jeu)
    'spot', // lieu / projecteur
    'trucks', // camions
    'element', // chimie / marque
    'vans', // fourgons / marque
    'wax', // cire générique
    'rampe', // rampe d'escalier
  ],
  selfDeclared: ['skateur', 'skateuse'],
};
