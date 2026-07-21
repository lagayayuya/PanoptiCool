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
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Le basket anglophone parle par LOCUTIONS ; ses noms simples sont tous pris ailleurs.
//   · SOLO — « wnba », « free throw », « three pointer », « full court press », « box out »,
//     « sixth man », « starting five », « and1 », « posterized », « ncaa » : univoques.
//   · ANCRÉ — « court » (= COURT en français, adjectif banal — piège FR, jamais solo), « assist »
//     (aide ; assist esport), « rebound » (rebond sentimental), « foul », « steal », « guard »
//     (vigile ; et la garde au sol des `sports_combat`), « bench », « paint » (peinture) : compagnon requis.
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
    // Variantes EN (PANO-88) : SOLO univoques (locutions de jeu / compétitions).
    'wnba',
    'free throw',
    'three pointer',
    'full court press',
    'box out',
    'sixth man',
    'starting five',
    'and1',
    'posterized',
    'ncaa',
    'hoopers',
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
    // Variantes EN (PANO-88) : ANCRÉS.
    'court', // « court » = adjectif français banal — piège FR, jamais solo (EN)
    'assist', // aide générique / assist esport (EN)
    'rebound', // rebond sentimental (EN)
    'foul', // faute générique / « foul mood » (EN)
    'steal', // vol / « what a steal » (EN)
    'guard', // vigile ; et la garde au sol des sports de combat (EN)
    'bench', // banc / banc de muscu (EN)
    'paint', // peinture vs la raquette (EN)
  ],
  selfDeclared: ['basketteur', 'joueur de basket'],
};
