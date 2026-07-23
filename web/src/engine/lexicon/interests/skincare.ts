// Interest lexicon `skincare` (D2, PANO-76 batch 1, DEEP rewrite) — skin care.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR skin care: products, actives, routines. « skincare » LEXICALIZED
// (PANO-35 debt). Blind from common usage.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « skincare », « acide hyaluronique », « retinol », « niacinamide »,
//     « routine skincare » (phrase), « creme hydratante » (phrase), « soin du visage » (phrase).
//   · ANCHORED — 50/50: « serum » (medical), « masque » (sanitary/theatre), « soin » (generic),
//     « creme » (food cream), « peau » (generic), « pores », « hydratation », « gommage »:
//     co-occurrence required.
//   · EXCLUDED — nothing desperate here; the 50/50 are recovered by anchoring.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. A named dermatological pathology (eczema, psoriasis) would fall under
// `health_physical` (D1) — not captured: we stay on the cosmetic routine, not the diagnosis. The
// boundary guard verifies that no marker (including « acne ») fires D1.

import type { InterestLexicon } from '../types';

export const SKINCARE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'skincare',
  themeLabel: 'theme.skincare.label',
  usage: [
    {
      actor: 'advertiser',
      usage: { templateId: 'usage.advertiser.skincare-products', params: {} },
    },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'skincare',
    'soin du visage',
    'creme hydratante',
    'serum visage',
    'acide hyaluronique',
    'retinol',
    'niacinamide',
    'nettoyant visage',
    'routine skincare',
    'gommage visage',
    'masque visage',
    'contour des yeux',
    'points noirs',
    'creme solaire',
    'double nettoyage',
    'soin hydratant',
    'exfoliant visage',
    'vitamine c serum',
    'peau grasse',
    'peau seche visage',
    // Brands & jargon (retrofit PANO-90)
    'cerave',
    'the ordinary',
    'la roche posay',
    'bioderma',
    'glass skin',
    'slugging',
    'acide salicylique',
    'ceramides',
    // EN variants (PANO-88): SOLO univocal (skincare jargon).
    'skin barrier',
    'grwm',
  ],
  anchored: [
    'serum', // medical serum
    'masque', // sanitary mask / theatre
    'soin', // generic care
    'creme', // food cream
    'peau', // skin (generic)
    'pores', // pores vs generic
    'hydratation', // hydration (sport/health) vs cosmetic
    'gommage', // scrub (other) vs exfoliation
    'imperfections', // skin blemishes vs generic
    'aha', // acid (skincare) vs acronym / interjection
    'bha', // acid (skincare) vs acronym
    'avene', // brand vs generic
    'glow up', // beauty transformation vs generic (EN)
  ],
};
