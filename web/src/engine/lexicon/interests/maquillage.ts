// Interest lexicon `maquillage` (D2, PANO-76 batch 1, DEEP rewrite) — make-up.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR make-up: products, techniques, gestures. Blind.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « maquillage », « mascara », « eyeliner », « contouring », « anticernes »,
//     « fond de teint » (phrase), « rouge a levres » (phrase).
//   · ANCHORED — 50/50: « teint » (complexion), « palette » (painter), « blush » (to blush), « fard »
//     (« sans fard »), « base » (generic base), « poudre » (generic powder): co-occurrence.
//   · EXCLUDED — bare « rouge » (color/politics), bare « pinceau » (painting).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from « skincare » (skin care).

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
    // Brands & jargon (retrofit PANO-90)
    'sephora',
    'fenty beauty',
    'rare beauty',
    'charlotte tilbury',
    'maybelline',
    'cut crease',
    'no makeup makeup',
    'douyin makeup',
    // EN variants (PANO-88): SOLO univocal.
    'grwm',
    'full glam',
  ],
  anchored: [
    'teint', // complexion / « avoir bonne mine »
    'palette', // painter's palette / range
    'blush', // English « blush » (to blush)
    'fard', // « sans fard » (candor)
    'base', // make-up base vs generic base
    'poudre', // loose powder vs generic powder
    'khol', // short (also kept in « crayon khol » solo)
    'mac', // MAC brand vs Mac computer
    'baking', // make-up technique vs English baking
    'nyx', // brand vs generic
    'haul', // beauty haul vs generic (EN, anchored)
    'swatch', // shade swatch vs watch brand (EN)
  ],
  selfDeclared: ['maquilleur', 'maquilleuse'],
};
