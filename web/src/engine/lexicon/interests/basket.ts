// Interest lexicon `basket` (D2, PANO-78 batch 3) — basketball.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR basketball: NBA/Euroleague, moves, positions, PLAYERS. Entities = generic
// public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « basketball », « nba », « euroleague », « wembanyama », « alley oop », « streetball ».
//   · ANCHORED — « basket » (shoe/basket vs sport), « dunk » (shared sneakers), « jordan » (first name),
//     « crossover » (car), « panier » (groceries), « mvp », « draft », « curry » (spice): co-occurrence.
//   · EXCLUDED — sports betting (out of scope PANO-74).
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Anglophone basketball speaks by PHRASES; its simple nouns are all taken elsewhere.
//   · SOLO — « wnba », « free throw », « three pointer », « full court press », « box out »,
//     « sixth man », « starting five », « and1 », « posterized », « ncaa »: univocal.
//   · ANCHORED — « court » (= COURT in French, a banal adjective — FR trap, never solo), « assist »
//     (help; esport assist), « rebound » (emotional rebound), « foul », « steal », « guard »
//     (guard; and the ground guard of `sports_combat`), « bench », « paint » (paint): companion required.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. Cross-theme « dunk »/« jordan » with `sneakers`: assumed (per-theme co-occurrence).

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
    // Players / franchises / jargon (enriched)
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
    // EN variants (PANO-88): SOLO univocal (game phrases / competitions).
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
    'basket', // shoe / grocery basket vs the sport
    'dunk', // shared with sneakers
    'jordan', // first name / air jordan
    'crossover', // type of car
    'panier', // grocery basket
    'contre', // contre (preposition) vs contre (block)
    'mvp', // generic acronym
    'rebond', // generic rebound
    'draft', // draft / pressure
    'curry', // spice vs Stephen Curry
    'pivot', // generic pivot
    'zone', // generic zone vs zone defense
    'lakers', // franchise (fairly univocal but kept anchored)
    'celtics', // franchise
    // EN variants (PANO-88): ANCHORED.
    'court', // « court » = banal French adjective — FR trap, never solo (EN)
    'assist', // generic help / esport assist (EN)
    'rebound', // emotional rebound (EN)
    'foul', // generic foul / « foul mood » (EN)
    'steal', // theft / « what a steal » (EN)
    'guard', // guard; and the ground guard of combat sports (EN)
    'bench', // bench / weight bench (EN)
    'paint', // paint vs the key (EN)
  ],
  selfDeclared: ['basketteur', 'joueur de basket'],
};
