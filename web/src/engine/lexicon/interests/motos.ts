// Lexique d'intérêt `motos` (D2, PANO-78 lot 3) — motos / deux-roues.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la moto FR : types, MARQUES, jargon motard, permis. Entités = signal
// public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « moto », « motard », « roadster », « cafe racer », « wheeling », « permis a2 »,
//     « supermotard », « enduro », « becane » ; marques (« ducati », « ktm », « harley davidson »).
//   · ANCRÉ — « honda »/« bmw » (partagés voitures), « yamaha » (partagé guitare), « suzuki » (méthode
//     violon), « kawasaki » (maladie), « triumph » (victoire), « ninja », « trail » (partagé),
//     « custom », « cruiser » (navire), « guidon » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. « voitures » est un thème séparé ; ici les deux-roues motorisés.

import type { InterestLexicon } from '../types';

export const MOTOS_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'motos',
  themeLabel: 'theme.motos.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.motorcycle-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'moto',
    'motard',
    'roadster',
    'cafe racer',
    'wheeling',
    'permis a2',
    'supermotard',
    'enduro moto',
    'becane',
    'casque moto',
    'deux roues',
    'ducati',
    'ktm',
    'aprilia',
    'harley davidson',
    'panigale',
    'moto sportive',
    'moto custom',
    // Marques / modèles / jargon (enrichi)
    'mv agusta',
    'moto guzzi',
    'royal enfield',
    'husqvarna',
    'africa twin',
    'contre braquage',
    'top case',
    'combinaison cuir',
    'moto trail',
    'motocross',
    'stunt moto',
    'scooter',
    'carenage moto',
    'gomme moto',
    'permis moto',
  ],
  anchored: [
    'honda', // partagé voitures
    'bmw', // partagé voitures
    'yamaha', // partagé guitare
    'suzuki', // méthode de violon / prénom
    'kawasaki', // maladie de Kawasaki
    'triumph', // victoire (anglais)
    'ninja', // ninja générique
    'trail', // partagé running/randonnee
    'custom', // personnaliser
    'cruiser', // navire
    'guidon', // guidon générique
    'angle', // angle générique vs prise d'angle
    'fourche', // fourche (outil) vs fourche (moto)
    'gomme', // gomme (crayon) vs pneu
  ],
  selfDeclared: ['motard', 'motarde'],
};
