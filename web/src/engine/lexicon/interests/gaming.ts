// Interest lexicon `gaming` (D2, PANO-76 batch 1, DEEP rewrite) — video games.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR video games: platforms, mechanics, competitive and streaming jargon.
// Blind from common usage.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « jeu video », « gaming », « manette », « speedrun », « matchmaking », « gameplay ».
//   · ANCHORED — 50/50 whose common NON-gaming sense dominates: « console » (furniture / « je te
//     console »), « switch » (switch / verb), « boss » (hierarchy), « partie » (part),
//     « niveau », « manche », « farm »: co-occurrence required.
//   · EXCLUDED — bare « jouer » / « jeu » (too generic even anchored).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. GAMBLING out of scope (PANO-74). « esport » kept (a player who mentions it stays
// in the game theme) even though it is a separate catalogue theme.

import type { InterestLexicon } from '../types';

export const GAMING_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'gaming',
  themeLabel: 'theme.gaming.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.gaming-hardware', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'jeu video',
    'jeux video',
    'gaming',
    'manette',
    'playstation',
    'nintendo switch',
    'xbox',
    'pc gamer',
    'speedrun',
    'matchmaking',
    'gameplay',
    'mode multijoueur',
    'jeu de tir',
    'jeu de role',
    'monde ouvert',
    'boss final',
    'trophee platine',
    'succes deverrouille',
    'respawn',
    'game over',
    'esport',
    'stream twitch',
    'joueur competitif',
    'jeu de combat',
    'jeu de gestion',
    // Games & consoles (retrofit PANO-90)
    'fortnite',
    'minecraft',
    'elden ring',
    'call of duty',
    'mario kart',
    'final fantasy',
    'cyberpunk',
    'the witcher',
    'ps5',
    'steam',
    'battle royale',
    'jeu de plateforme',
    // EN variants (PANO-88): SOLO univocal (gaming jargon).
    'loadout',
    'battle pass',
    'open world',
    'noob',
    'lore',
  ],
  anchored: [
    'console', // furniture / « je te console »
    'switch', // switch / English verb
    'boss', // hierarchical superior
    'partie', // part / party
    'niveau', // generic level
    'manche', // garment sleeve
    'farm', // farming vs farm
    'loot', // loot vs noise
    'ranked', // ranked match vs English
    'quete', // game quest vs generic quest
    'gta', // Grand Theft Auto (acronym) vs generic
    'zelda', // franchise vs first name
    'fps', // frames per second / genre vs generic
    'rpg', // role-playing game vs rocket launcher
    'build', // character build vs construction / muscu (EN, anchored)
    'afk', // away from keyboard vs acronym (EN)
  ],
  selfDeclared: ['gamer', 'gameuse', 'joueur competitif'],
};
