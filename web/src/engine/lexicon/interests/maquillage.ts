// Lexique d'intérêt `maquillage` (D2, PANO-76 lot 1, réécriture PROFONDE) — make-up.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du maquillage FR : produits, techniques, gestes. À l'aveugle.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « maquillage », « mascara », « eyeliner », « contouring », « anticernes »,
//     « fond de teint » (phrase), « rouge a levres » (phrase).
//   · ANCRÉ — 50/50 : « teint » (complexion), « palette » (peintre), « blush » (rougir), « fard »
//     (« sans fard »), « base » (base générique), « poudre » (poudre générique) : co-occurrence.
//   · EXCLU — « rouge » nu (couleur/politique), « pinceau » nu (peinture).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de « skincare » (soin de la peau).

import type { InterestLexicon } from '../types';

export const MAQUILLAGE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'maquillage',
  themeLabel: 'theme.maquillage.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.cosmetics', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'maquillage',
    'mascara',
    'rouge a levres',
    'fond de teint',
    'eyeliner',
    'fard a paupieres',
    'contouring',
    'anticernes',
    'correcteur de teint',
    'palette de maquillage',
    'crayon khol',
    'rimmel',
    'highlighter',
    'enlumineur',
    'faux cils',
    'crayon a levres',
    'gloss levres',
    'illuminateur',
    'baume a levres',
    'maquillage yeux',
    'trousse de maquillage',
    // Marques & jargon (rétrofit PANO-90)
    'sephora',
    'fenty beauty',
    'rare beauty',
    'charlotte tilbury',
    'maybelline',
    'cut crease',
    'no makeup makeup',
    'douyin makeup',
    // Variantes EN (PANO-88) : SOLO univoques.
    'grwm',
    'full glam',
  ],
  anchored: [
    'teint', // complexion / « avoir bonne mine »
    'palette', // palette de peintre / gamme
    'blush', // « blush » (rougir) anglais
    'fard', // « sans fard » (franchise)
    'base', // base de maquillage vs base générique
    'poudre', // poudre libre vs poudre générique
    'khol', // court (gardé aussi dans « crayon khol » solo)
    'mac', // marque MAC vs ordinateur Mac
    'baking', // technique maquillage vs pâtisserie anglaise
    'nyx', // marque vs générique
    'haul', // shopping beauté vs générique (EN, ancré)
    'swatch', // test de teinte vs marque de montre (EN)
  ],
  selfDeclared: ['maquilleur', 'maquilleuse'],
};
