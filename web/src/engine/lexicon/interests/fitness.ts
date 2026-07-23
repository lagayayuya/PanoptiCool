// Interest lexicon `fitness` (D2, PANO-77 batch 2 · entities enriched) — fitness / cross-training.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR fitness: formats, moves, CrossFit ABBREVIATIONS, CHAINS. Blind;
// jargon and chains = generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « fitness », « crossfit », « hiit », « amrap », « emom », « burpees »,
//     « tabata », « pilates », chains (« basic fit », « fitness park »).
//   · ANCHORED — 50/50: « cardio » (cardiology), « box » (box), « forme » (« en forme »), « wod »,
//     « pr » (PR), « snatch », « clean », « fran » (first name / WOD), « circuit »: co-occurrence.
//   · EXCLUDED — « bien etre » / « developpement personnel » DISCARDED (brush `mental_health`, D1).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from `muscu` (weights), overlap assumed. WELLBEING and BODY IMAGE
// stay D1: we stay on movement, not on wellness.

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
    // Formats / moves
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
    // Chains
    'basic fit',
    'fitness park',
    'neoness',
    // EN variants (PANO-88): SOLO univocal.
    'workout',
    'full body workout',
    'no pain no gain',
  ],
  anchored: [
    'cardio', // cardiology vs cardio (sport)
    'box', // boxing / box
    'forme', // « en forme » / generic form
    'circuit', // electrical / training circuit
    'seance', // generic session
    'intensite', // generic
    'wod', // workout of the day
    'pr', // personal record vs public relations
    'snatch', // snatch (jargon) vs English
    'clean', // clean (jargon) vs « clean » (tidy)
    'fran', // named WOD vs first name
    'thruster', // move vs thruster/booster
    'gym', // gym vs gymnastics (EN, anchored)
    'warm up', // warm-up vs generic (EN)
  ],
  selfDeclared: ['coach sportif', 'addict au fitness'],
};
