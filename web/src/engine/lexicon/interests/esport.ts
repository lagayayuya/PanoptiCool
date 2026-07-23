// Interest lexicon `esport` (D2, PANO-78 batch 3) — esports / competition.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR esports: competitive games, TEAMS, competitions, jargon. Entities =
// generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « esport », « league of legends », « valorant », games, teams (« karmine corp »,
//     « fnatic », « gentle mates »), « worlds », « scrim », « toplaner », « jungler ».
//   · ANCHORED — « g2 », « vitality » (energy), « meta », « patch », « draft », « frag », « carry »,
//     « gank », « support », « jungle », « clutch », « adc », « lec » (acronym): co-occurrence.
//   · EXCLUDED — « gg » (too short/ambiguous).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. « esport » shared with `gaming` (assumed); here the competitive scene.

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
    // Games & competition (enriched)
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
    'g2', // generic acronym
    'vitality', // energy / team
    'meta', // generic meta
    'patch', // fix / patch
    'draft', // draft
    'frag', // generic
    'carry', // to carry (English)
    'gank', // jargon (kept anchored out of short caution)
    'support', // generic support
    'jungle', // generic jungle
    'clutch', // clutch (car)
    'adc', // acronym
    'lec', // acronym
    'roster', // generic list
    'smurf', // secondary account vs smurf (character)
    'elo', // ranking vs first name
    'ladder', // ladder (English)
    'nerf', // toy gun vs nerf (balancing)
    'buff', // to polish vs buff (bonus)
    'ace', // ace / success vs ace (esport)
    'spike', // spike vs spike (Valorant)
    'aim', // aim (EN) vs generic — anchored (PANO-88)
  ],
  selfDeclared: ['joueur esport', 'joueuse esport'],
};
