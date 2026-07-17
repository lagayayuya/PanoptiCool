// Lexique `conflictual` (PANO-71 graine → PANO-36 enrichi) — item-level (B5) : l'insulte ÉMISE
// visant un autre utilisateur EST le signal ; pas d'étage indirect, pas d'éventail (PANO-70 §1.4).
// Critique d'idée JAMAIS taguée conflictual (décision D) ; opinion politique → politics, pas ici.
// La frontière est portée par la MACHINERIE (cible 2ᵉ personne exigée + filtre citation), pas par
// les mots : c'est pourquoi un terme d'agression n'entre QUE s'il vise une personne.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Insultes interpersonnelles du FR courant EN LIGNE, tous registres, écrites à l'aveugle depuis
// l'usage commun, jamais depuis un export :
//   · familier : abruti, crétin, imbécile, blaireau, guignol ;
//   · vulgaire : ordure, enfoiré, raclure, salopard ;
//   · slurs genrés et validistes (salope, enculé, attardé, mongol…) : RÉELS et massifs en ligne —
//     les détecter, c'est montrer ce qu'une plateforme lit ; la sécurité vit dans le GRILLAGE
//     d'affichage — le constat démarre replié, derrière un badge « sensible » (ADR-0003) — pas dans
//     un lexique amputé ;
//   · insultes homophobes et anti-croyant INTERPERSONNELLES (PANO-72) : elles visent une PERSONNE
//     dans l'échange (frontière sexuality/religion → conflictual). Le slur de GROUPE dans l'absolu
//     n'entre nulle part (futur label dédié, signalé, jamais tranché seul) ;
//   · abréviations SMS d'agression (tg, ftg, ntm, fdp).
// Toutes visent une PERSONNE (jamais une idée, jamais un groupe) et n'entrent que couplées à une
// cible 2ᵉ personne.
// Chaque terme aurait été écrit à l'identique sans avoir vu aucun export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées NORMALISÉES (minuscules, sans accents). Auto-censure (« c*nne »), allongements
// (« abruuuti ») et pluriels sont couverts par la machinerie — jamais listés ici.

import type { ItemLevelLexicon } from './types';

export const CONFLICTUAL_LEXICON: ItemLevelLexicon = {
  kind: 'item-level',
  label: 'conflictual',
  insults: [
    // Familier / courant.
    'abruti',
    'debile',
    'connard',
    'bouffon',
    'conne',
    'con',
    'connasse',
    'cretin',
    'cretine',
    'idiot',
    'idiote',
    'imbecile',
    'blaireau',
    'tocard',
    'tocarde',
    'clown',
    'guignol',
    'minable',
    'pauvre type',
    'pauvre fille',
    'bon a rien',
    'moins que rien',
    'rate',
    'ratee',
    'naze',
    'nul a chier',
    'nullos',
    'rigolo',
    'mythos',
    'gland',
    'tache',
    'loser',
    'looser',
    'boloss',
    'stupide',
    'teube',
    // Vulgaire.
    'grosse merde',
    'sale merde',
    'pauvre merde',
    'sale con',
    'sale conne',
    'ordure',
    'raclure',
    'pourriture',
    'salopard',
    'enfoire',
    'batard',
    // Impératifs injurieux (adressent par construction — aussi listés dans `targets`).
    'ta gueule',
    'ferme la',
    'va crever',
    'mange tes morts',
    // Slurs genrés (décision yuya : gardés).
    'salope',
    'petasse',
    'pouffiasse',
    'encule',
    'fils de pute',
    'nique ta mere',
    // Slurs validistes (décision yuya : gardés).
    'attarde',
    'attardee',
    'gogol',
    'mongol',
    // Insultes homophobes INTERPERSONNELLES (PANO-72, arbitrage yuya : visant une PERSONNE dans
    // l'échange, gated par la cible 2ᵉ pers.). Le slur de GROUPE dans l'absolu n'entre nulle part
    // (futur label dédié, signalé) — ces termes ne comptent QUE couplés à une adresse.
    'pede',
    'tapette',
    'tarlouze',
    'gouine',
    'fiotte',
    // Insultes anti-croyant INTERPERSONNELLES (même règle : personne, pas groupe ni idée).
    'bigot',
    'bigote',
    'grenouille de benitier',
    // Abréviations SMS d'agression.
    'tg',
    'ftg',
    'vtff',
    'fdp',
    'ntm',
  ],
  // Cible 2ᵉ personne. Les impératifs injurieux y figurent AUSSI (l'impératif adresse par
  // construction, décision yuya) — sans quoi « ta gueule » nu ne serait jamais tagué.
  targets: [
    "t'es",
    'tu es',
    'espece de',
    'degage',
    "t'as",
    'tu as',
    'toi',
    'casse toi',
    'va te faire',
    'va crever',
    'tu connais rien',
    "personne t'a sonne",
    'ta gueule',
    'ferme la',
    'mange tes morts',
    'nique ta mere',
    'tg',
    'ftg',
    'vtff',
    'ntm',
  ],
};
