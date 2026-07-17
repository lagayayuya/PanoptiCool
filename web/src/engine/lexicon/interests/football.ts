// Lexique d'intérêt `football` (D2, PANO-76 lot 1, réécriture PROFONDE) — football (soccer).
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du football FR : règles, compétitions, postes, transferts, jargon supporter.
// À l'aveugle depuis l'usage commun.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « football », « penalty », « mercato », « ligue des champions » (quasi-univoques).
//   · ANCRÉ — le cœur du 50/50 : « but » (finalité), « match » (allumette), « foot » (anatomie),
//     « corner » (coin), « cage » (prison), « arbitre », « tacle » : ne comptent qu'avec un
//     compagnon foot. C'est l'exemple canonique de la co-occurrence (PANO-76).
//   · EXCLU — « ballon » (baudruche, trop courant même ancré ici sans plus-value).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Jeux d'ARGENT / paris EXCLUS (PANO-74) : aucun marqueur de cote ou bookmaker.

import type { InterestLexicon } from '../types';

export const FOOTBALL_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'football',
  themeLabel: 'theme.football.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.football-merch', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'football',
    'match de foot',
    'ligue des champions',
    'coupe du monde',
    'ligue 1',
    'premier league',
    'liga',
    'penalty',
    'hors jeu',
    'carton rouge',
    'carton jaune',
    'coup franc',
    'gardien de but',
    'milieu de terrain',
    'mercato',
    'match de championnat',
    'attaquant',
    'defenseur',
    "ballon d'or",
    'supporter de foot',
    // Clubs & joueurs (rétrofit PANO-90)
    'psg',
    'real madrid',
    'barcelone',
    'olympique de marseille',
    'manchester city',
    'liverpool',
    'bayern munich',
    'mbappe',
    'haaland',
    'vinicius',
    'bellingham',
    'lamine yamal',
  ],
  anchored: [
    'but', // dans le but de… (finalité)
    'match', // allumette / « faire un match »
    'foot', // pied (anatomie)
    'corner', // coin (anglais)
    'cage', // les cages (buts) vs cage générique
    'arbitre', // arbitre de foot vs arbitrage générique
    'tacle', // tacle vs métaphore
    'transfert', // transfert de joueur vs virement/transfert générique
    'real', // Real Madrid vs « réel »
    'barca', // FC Barcelone vs générique
    'messi', // joueur vs patronyme
  ],
  selfDeclared: ['footballeur', 'supporter de foot'],
};
