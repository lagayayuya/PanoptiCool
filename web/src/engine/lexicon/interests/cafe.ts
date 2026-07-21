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
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Usage EN vérifié par recherche (glossaires barista / troisième vague).
//   · SOLO — « portafilter », « microfoam », « burr grinder », « channeling », « puck prep »,
//     « pour over », « third wave », « degassing », « moka pot », « coffeetok » : univoques, et
//     souvent COMPOSÉS — le domaine ne tient que par ses locutions.
//   · ANCRÉ — le 50/50 EN : « grind » (= LE TURBIN, « the daily grind » ; et le grind du `skate` et
//     du jeu), « brew » (la BIÈRE), « roast » (= SE MOQUER, sens dominant en ligne), « beans »
//     (haricots), « tamper » (« tamper with » = falsifier), « cupping » (thérapie par ventouses) :
//     compagnon requis. Aucun de ces mots ne porte le domaine seul.
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
    // Variantes EN (PANO-88) : SOLO univoques (matériel / méthodes / communauté).
    'portafilter',
    'microfoam',
    'burr grinder',
    'channeling',
    'puck prep',
    'pour over',
    'third wave',
    'degassing',
    'moka pot',
    'gooseneck kettle',
    'specialty coffee',
    'coffeetok',
    'lungo',
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
    // Variantes EN (PANO-88) : ANCRÉS.
    'grind', // « the daily grind » / grind du skate et du jeu (EN)
    'brew', // la bière / « brewing trouble » (EN)
    'roast', // = se moquer, sens dominant en ligne (EN)
    'beans', // haricots / « spill the beans » (EN)
    'tamper', // « tamper with » = falsifier (EN)
    'cupping', // thérapie par ventouses vs dégustation (EN)
  ],
  selfDeclared: ['barista', 'passionne de cafe'],
};
