// Lexique d'intérêt `cafe` (D2, PANO-78 lot 3) — café de spécialité / méthodes.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du café FR : méthodes d'extraction, variétés, boissons, jargon barista.
// Entités = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « espresso », « v60 », « chemex », « aeropress », « latte art », « cold brew »,
//     « arabica », « robusta », « torrefaction », « barista », « cafe de specialite ».
//   · ANCRÉ — « café » (boisson / bar / couleur / « café du commerce »), « filtre » (partagé photo),
//     « extraction » (dentaire), « dose », « mouture », « moka » (prénom), « crema » : co-occurrence.
//   · EXCLU — rien de désespéré ; « café » nu jamais solo (trop polysémique).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const CAFE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'cafe',
  themeLabel: 'theme.cafe.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.coffee-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'espresso',
    'ristretto',
    'cappuccino',
    'flat white',
    'latte art',
    'cold brew',
    'v60',
    'chemex',
    'aeropress',
    'arabica',
    'robusta',
    'torrefaction',
    'barista',
    'cafe de specialite',
    'cafetiere italienne',
    'grains de cafe',
    'single origin',
    'cortado',
    'macchiato',
  ],
  anchored: [
    'cafe', // boisson / bar / couleur / « café du commerce »
    'filtre', // partagé photographie
    'extraction', // dentaire / minière
    'dose', // dose générique
    'mouture', // générique
    'moka', // prénom / gâteau
    'crema', // générique
    'grain', // grain générique
    'percolateur',
  ],
  selfDeclared: ['barista', 'passionne de cafe'],
};
