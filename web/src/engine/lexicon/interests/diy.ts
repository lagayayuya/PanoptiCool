// Lexique d'intérêt `diy` (D2, PANO-89 lot 4) — DIY / bricolage.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du bricolage FR : outils, matériaux, enseignes, rénovation. Entités = signal
// public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « perceuse », « visseuse », « placo », « renovation », « leroy merlin », « castorama »,
//     « ponceuse », « scie sauteuse », « home staging ».
//   · ANCRÉ — « bricolage » (« bricolage » = système D), « vis », « cheville » (anatomie), « niveau »,
//     « marteau », « clou », « scie », « chantier » : co-occurrence.
//   · EXCLU — « outil » nu (trop générique).
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Leçon nette du sondage : en bricolage anglais, LA SÛRETÉ EST DANS LE COMPOSÉ, jamais dans le nom
// simple. Aucun de « drill / sand / level / stain / finish / router / plane / square / nail / screw »
// n'est utilisable nu — chacun a un sens dominant ailleurs.
//   · SOLO — les matériaux et assemblages, qui n'existent qu'ici : « drywall », « spackle », « joist »,
//     « plywood », « shiplap », « subfloor », « caulk », « grout », « chamfer », « kerf »,
//     « countersink », « mortise », « tenon », « dovetail », « sandpaper », « miter saw »,
//     « orbital sander », « pocket hole », « brad nailer », « impact driver », « woodworking ».
//   · ANCRÉ — « drill » (la PERCEUSE, mais « UK drill » = sous-genre de `rap`, et l'exercice
//     militaire/sportif), « router » (le ROUTEUR réseau, sens écrasant), « plane » (l'AVION), « sand »
//     (le sable), « level » (« level up » du jeu), « stain » (une tache sur un vêtement), « nail »
//     (l'ONGLE — toute la vertical beauté), « screw » (juron), « square » (la place, « square up ») :
//     compagnon requis.
//   · TAG — « tiktokdiy », et non « diytok » : le second n'existe pas (vérifié).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const DIY_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'diy',
  themeLabel: 'theme.diy.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.diy-tools', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'bricolage',
    'perceuse',
    'visseuse',
    'placo',
    'placoplatre',
    'renovation',
    'leroy merlin',
    'brico depot',
    'castorama',
    'ponceuse',
    'scie sauteuse',
    'tuto diy',
    'home staging',
    'palette bois',
    'tournevis electrique',
    'do it yourself',
    'perceuse visseuse',
    // Variantes EN (PANO-88) : SOLO univoques — matériaux et assemblages (la sûreté est dans le composé).
    'woodworking',
    'drywall',
    'spackle',
    'joist',
    'plywood',
    'shiplap',
    'subfloor',
    'caulk',
    'grout',
    'chamfer',
    'kerf',
    'countersink',
    'mortise',
    'tenon',
    'dovetail',
    'sandpaper',
    'miter saw',
    'table saw',
    'orbital sander',
    'pocket hole',
    'pilot hole',
    'brad nailer',
    'impact driver',
    'wood glue',
    'wood filler',
    'wood stain',
    'speed square',
    'tiktokdiy',
    'upcycle',
  ],
  anchored: [
    'bricolage', // système D / « c'est du bricolage »
    'vis', // vis générique
    'cheville', // anatomie / cheville (fixation)
    'niveau', // niveau générique
    'marteau', // marteau générique
    'clou', // clou générique
    'scie', // « scie » / « si »
    'chantier', // chantier générique
    'bosch', // électroménager / Hieronymus Bosch
    // Variantes EN (PANO-88) : ANCRÉS — les noms simples du domaine, tous pris ailleurs.
    'drill', // perceuse vs « uk drill » (rap) / exercice militaire (EN)
    'router', // = routeur réseau, sens écrasant (EN)
    'plane', // = avion (EN)
    'sand', // sable (EN)
    'level', // « level up » du jeu / niveau générique (EN)
    'stain', // tache sur un vêtement vs teinture bois (EN)
    'nail', // = ongle (vertical beauté) / « nailed it » (EN)
    'screw', // juron (EN)
    'square', // la place / « square up » (EN)
    'stud', // montant d'ossature vs « a stud » (EN)
    'primer', // « a primer on X » = intro vs sous-couche (EN)
  ],
  selfDeclared: ['bricoleur', 'bricoleuse'],
};
