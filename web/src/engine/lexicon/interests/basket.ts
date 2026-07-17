// Lexique d'intérêt `basket` (D2, PANO-78 lot 3) — basketball.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du basket FR : NBA/Euroleague, gestes, postes, JOUEURS. Entités = signal
// public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « basketball », « nba », « euroleague », « wembanyama », « alley oop », « streetball ».
//   · ANCRÉ — « basket » (chaussure/panier vs sport), « dunk » (shared sneakers), « jordan » (prénom),
//     « crossover » (voiture), « panier » (courses), « mvp », « draft », « curry » (épice) : co-occurrence.
//   · EXCLU — paris sportifs (hors-champ PANO-74).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Cross-thème « dunk »/« jordan » avec `sneakers` : assumé (co-occurrence par thème).

import type { InterestLexicon } from '../types';

export const BASKET_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'basket',
  themeLabel: 'theme.basket.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.basketball-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'basketball',
    'nba',
    'euroleague',
    'wembanyama',
    'streetball',
    'alley oop',
    'slam dunk',
    'buzzer beater',
    'tir a trois points',
    'lancer franc',
    'meneur de jeu',
    'ailier fort',
    'playoffs nba',
    'all star game',
    'basketteur',
    'step back',
    'asvel',
    'salle de basket',
    // Joueurs / franchises / jargon (enrichi)
    'lebron james',
    'kevin durant',
    'giannis',
    'luka doncic',
    'rudy gobert',
    'triple double',
    'pick and roll',
    'dunk contest',
    'poster dunk',
    'fadeaway',
    'finales nba',
    'march madness',
    'match de basket',
    'pro a',
  ],
  anchored: [
    'basket', // chaussure / panier de courses vs le sport
    'dunk', // partagé sneakers
    'jordan', // prénom / air jordan
    'crossover', // type de voiture
    'panier', // panier de courses
    'contre', // contre (préposition) vs contre (block)
    'mvp', // sigle générique
    'rebond', // rebond générique
    'draft', // brouillon / pression
    'curry', // épice vs Stephen Curry
    'pivot', // pivot générique
    'zone', // zone générique vs défense de zone
    'lakers', // franchise (assez univoque mais gardé ancré)
    'celtics', // franchise
  ],
  selfDeclared: ['basketteur', 'joueur de basket'],
};
