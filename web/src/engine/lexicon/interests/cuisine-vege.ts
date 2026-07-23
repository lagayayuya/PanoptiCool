// Interest lexicon `cuisine_vege` (D2, PANO-78 batch 3) — veg / vegan cooking.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR veg cooking: substitutes, dishes, CULINARY lifestyle. Entities =
// generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « vegan », « vegetarien », « tofu », « tempeh », « seitan », « falafel », « houmous »,
//     « buddha bowl », « lait vegetal », « steak vegetal », « happycow ».
//   · ANCHORED — « veggie », « vegetal » (bare), « soja » (generic), « bowl » (container): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Real EN usage: substitutes and dishes. The boundary below is held identically in EN.
//   · SOLO — « vegetarian », « plant based », « veganuary », « oat milk », « almond milk »,
//     « soy milk », « plant milk », « meat free », « dairy free », « vegan cheese », « hummus »,
//     « nutritional yeast », « aquafaba », « jackfruit »: univocal.
//   · ANCHORED — « chickpea » (generic ingredient, neither veg nor vegan in itself): companion required.
//   · EN EXCLUDED — « plant based DIET », « meat free MONDAY » discarded as a DIET; « cruelty free »,
//     « go vegan », « animal rights » discarded as CONVICTION. Strict symmetry with FR.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. CULINARY only (dishes, substitutes) — NOT the DIET/health-nutrition (weight
// loss, calories: out of scope, brushes D1) nor the militant CONVICTION (antispeciesism, animal cause:
// out of scope). No ethics or slimming marker. Overlaps `cuisine`/`patisserie` (assumed).

import type { InterestLexicon } from '../types';

export const CUISINE_VEGE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'cuisine_vege',
  themeLabel: 'theme.cuisine-vege.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.plant-based', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'vegan',
    'vegane',
    'vegetarien',
    'vegetarienne',
    'tofu',
    'tempeh',
    'seitan',
    'falafel',
    'houmous',
    'buddha bowl',
    'lait vegetal',
    'lait d amande',
    'lait d avoine',
    'steak vegetal',
    'galette vegetale',
    'proteines vegetales',
    'fromage vegan',
    'cuisine vegetale',
    // EN variants (PANO-88): SOLO univocal — substitutes and dishes ONLY (neither diet, nor cause).
    'vegetarian',
    'plant based',
    'veganuary',
    'oat milk',
    'almond milk',
    'soy milk',
    'plant milk',
    'meat free',
    'dairy free',
    'vegan cheese',
    'hummus',
    'nutritional yeast',
    'aquafaba',
    'jackfruit',
  ],
  anchored: [
    'veggie', // generic abbreviation
    'vegetal', // bare « vegetal » (generic)
    'soja', // generic soy
    'bowl', // container / buddha bowl
    'levure', // shared with patisserie
    // EN variants (PANO-88): ANCHORED.
    'chickpea', // generic ingredient, neither veg nor vegan in itself (EN)
  ],
  selfDeclared: ['vegan', 'vegetarien', 'flexitarien'],
};
