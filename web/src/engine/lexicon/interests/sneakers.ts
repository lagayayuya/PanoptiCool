// Lexique d'intérêt `sneakers` (D2, PANO-76 lot 1, réécriture PROFONDE) — baskets / culture sneakers.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la culture sneakers FR : modèles emblématiques, marques, jargon collection.
// Entités enrichies par recherche PUBLIQUE (modèles marquants). À l'aveugle.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — modèles/marques univoques : « air max », « air jordan », « air force », « yeezy »,
//     « new balance », « stan smith », « sneakers », « sneakerhead ».
//   · ANCRÉ — homographes RÉCUPÉRÉS par co-occurrence : « jordan » (prénom), « dunk » (basket),
//     « samba » (danse), « gazelle » (animal), « colorway », « drop » : comptent près d'un compagnon.
//   · EXCLU — « basket » singulier (le SPORT) ; « baskets » pluriel gardé SOLO (la machinerie n'ajoute
//     qu'un `s?` final, « baskets » ne matche pas « basket »).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de « mode » (thème plus large, séparé).

import type { InterestLexicon } from '../types';

export const SNEAKERS_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'sneakers',
  themeLabel: 'theme.sneakers.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.sneaker-drops', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'sneakers',
    'baskets',
    'air max',
    'air jordan',
    'air force',
    'yeezy',
    'new balance',
    'stan smith',
    'sneakerhead',
    'edition limitee sneakers',
    'nike',
    'adidas',
    'puma',
    'chaussures collector',
    'paire de sneakers',
    'jordan 1',
    'jordan 4',
    // Resell & modèles (rétrofit PANO-90)
    'stockx',
    'deadstock',
    'new balance 550',
    'dunk low',
    'edition limitee basket',
    'revente sneakers',
    'drop sneakers',
    // Variantes EN (PANO-88) : SOLO univoques (jargon sneakers).
    'on feet',
    'resell',
    'unboxing sneakers',
  ],
  anchored: [
    'jordan', // prénom
    'dunk', // geste de basket
    'samba', // danse
    'gazelle', // animal
    'colorway', // anglais niche
    'drop', // sortie vs « drop » générique
    'collector', // objet de collection générique
    'paire', // « une paire » générique
    'goat', // « greatest of all time » / chèvre / plateforme resell
    'restock', // réassort vs générique
    'cop', // acheter (jargon) vs « cop » (flic) (EN, ancré)
  ],
  selfDeclared: ['sneakerhead', 'collectionneur de sneakers'],
};
