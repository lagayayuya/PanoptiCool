// Lexique d'intérêt `esport` (D2, PANO-78 lot 3) — sport électronique / compétition.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de l'esport FR : jeux compétitifs, ÉQUIPES, compétitions, jargon. Entités =
// signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « esport », « league of legends », « valorant », jeux, équipes (« karmine corp »,
//     « fnatic », « gentle mates »), « worlds », « scrim », « toplaner », « jungler ».
//   · ANCRÉ — « g2 », « vitality » (énergie), « meta », « patch », « draft », « frag », « carry »,
//     « gank », « support », « jungle », « clutch », « adc », « lec » (sigle) : co-occurrence.
//   · EXCLU — « gg » (trop court/ambigu).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. « esport » partagé avec `gaming` (assumé) ; ici la scène compétitive.

import type { InterestLexicon } from '../types';

export const ESPORT_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'esport',
  themeLabel: 'theme.esport.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.gaming-hardware', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'esport',
    'league of legends',
    'valorant',
    'counter strike',
    'rocket league',
    'overwatch',
    'apex legends',
    'worlds',
    'karmine corp',
    'gentle mates',
    'fnatic',
    'team liquid',
    'gaming house',
    'scrim',
    'toplaner',
    'jungler',
    'midlaner',
    'esports world cup',
    'tournoi esport',
    'faker',
    // Jeux & compétition (enrichi)
    'dota 2',
    'rainbow six',
    'mobile legends',
    'lan party',
    'cash prize',
    'bo3',
    'bo5',
    'gaming gear',
    'joueur pro',
    'equipe esport',
    'bracket tournoi',
    'coach esport',
    'phase de poules',
    'seed tournoi',
    'ligue francaise',
  ],
  anchored: [
    'g2', // sigle générique
    'vitality', // énergie / équipe
    'meta', // méta générique
    'patch', // correctif / patch
    'draft', // brouillon / draft
    'frag', // générique
    'carry', // porter (anglais)
    'gank', // jargon (gardé ancré par prudence courte)
    'support', // soutien générique
    'jungle', // jungle générique
    'clutch', // embrayage
    'adc', // sigle
    'lec', // sigle
    'roster', // liste générique
    'smurf', // compte secondaire vs schtroumpf
    'elo', // classement vs prénom
    'ladder', // échelle (anglais)
    'nerf', // pistolet jouet vs nerf (équilibrage)
    'buff', // polir vs buff (bonus)
    'ace', // as / réussite vs ace (esport)
    'spike', // pic vs spike (Valorant)
    'aim', // visée (EN) vs générique — ancré (PANO-88)
  ],
  selfDeclared: ['joueur esport', 'joueuse esport'],
};
