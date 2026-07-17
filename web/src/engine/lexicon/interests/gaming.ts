// Lexique d'intérêt `gaming` (D2, PANO-76 lot 1, réécriture PROFONDE) — jeux vidéo.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du jeu vidéo FR : plateformes, mécaniques, jargon compétitif et streaming.
// À l'aveugle depuis l'usage commun.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « jeu video », « gaming », « manette », « speedrun », « matchmaking », « gameplay ».
//   · ANCRÉ — 50/50 dont le sens courant NON-gaming domine : « console » (meuble / « je te
//     console »), « switch » (interrupteur / verbe), « boss » (hiérarchie), « partie » (part),
//     « niveau », « manche », « farm » : co-occurrence requise.
//   · EXCLU — « jouer » / « jeu » nus (trop génériques même ancrés).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Jeux d'ARGENT HORS champ (PANO-74). « esport » gardé (un joueur qui en parle reste
// dans le thème jeu) même si c'est un thème séparé du catalogue.

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
    // Jeux & consoles (rétrofit PANO-90)
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
    // Variantes EN (PANO-88) : SOLO univoques (jargon gaming).
    'loadout',
    'battle pass',
    'open world',
    'noob',
    'lore',
  ],
  anchored: [
    'console', // meuble / « je te console »
    'switch', // interrupteur / verbe anglais
    'boss', // supérieur hiérarchique
    'partie', // part / soirée
    'niveau', // niveau générique
    'manche', // manche de vêtement
    'farm', // farming vs ferme
    'loot', // butin vs bruit
    'ranked', // partie classée vs anglais
    'quete', // quête de jeu vs quête générique
    'gta', // Grand Theft Auto (sigle) vs générique
    'zelda', // franchise vs prénom
    'fps', // frames per second / genre vs générique
    'rpg', // jeu de rôle vs lance-roquette
    'build', // build de perso vs construction / muscu (EN, ancré)
    'afk', // away from keyboard vs sigle (EN)
  ],
  selfDeclared: ['gamer', 'gameuse', 'joueur competitif'],
};
