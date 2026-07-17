// Lexique d'intérêt `fitness` (D2, PANO-77 lot 2 · enrichi entités) — fitness / cross-training.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du fitness FR : formats, mouvements, ABRÉVIATIONS CrossFit, ENSEIGNES. À
// l'aveugle ; jargon et enseignes = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « fitness », « crossfit », « hiit », « amrap », « emom », « burpees »,
//     « tabata », « pilates », enseignes (« basic fit », « fitness park »).
//   · ANCRÉ — 50/50 : « cardio » (cardiologie), « box » (boîte), « forme » (« en forme »), « wod »,
//     « pr » (RP), « snatch », « clean », « fran » (prénom / WOD), « circuit » : co-occurrence.
//   · EXCLU — « bien etre » / « developpement personnel » ÉCARTÉS (frôlent `mental_health`, D1).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de `muscu` (fonte), chevauchement assumé. BIEN-ÊTRE et RAPPORT AU CORPS
// restent D1 : on reste sur le mouvement, pas le mieux-être.

import type { InterestLexicon } from '../types';

export const FITNESS_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'fitness',
  themeLabel: 'theme.fitness.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.supplements', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Formats / mouvements
    'fitness',
    'cross training',
    'crossfit',
    'hiit',
    'renforcement musculaire',
    'burpees',
    'box jump',
    'corde a sauter',
    'tabata',
    'circuit training',
    'coach sportif',
    'remise en forme',
    'pilates',
    'stretching',
    'gainage',
    'abdos fessiers',
    'entrainement fonctionnel',
    'jumping jack',
    // Jargon CrossFit
    'amrap',
    'emom',
    'metcon',
    'wall ball',
    'double under',
    'muscle up',
    'air squat',
    // Enseignes
    'basic fit',
    'fitness park',
    'neoness',
    // Variantes EN (PANO-88) : SOLO univoques.
    'workout',
    'full body workout',
    'no pain no gain',
  ],
  anchored: [
    'cardio', // cardiologie vs cardio (sport)
    'box', // boxe / boîte
    'forme', // « en forme » / forme générique
    'circuit', // électrique / circuit d'entraînement
    'seance', // séance générique
    'intensite', // générique
    'wod', // workout of the day
    'pr', // record perso vs relations publiques
    'snatch', // arraché (jargon) vs anglais
    'clean', // épaulé (jargon) vs « clean » (propre)
    'fran', // WOD nommé vs prénom
    'thruster', // mouvement vs propulseur
    'gym', // salle vs gymnastique (EN, ancré)
    'warm up', // échauffement vs générique (EN)
  ],
  selfDeclared: ['coach sportif', 'addict au fitness'],
};
