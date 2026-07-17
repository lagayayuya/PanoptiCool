// Lexique d'intérêt `cuisine_vege` (D2, PANO-78 lot 3) — cuisine végé / vegan.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la cuisine végé FR : substituts, plats, mode de vie CULINAIRE. Entités =
// signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « vegan », « vegetarien », « tofu », « tempeh », « seitan », « falafel », « houmous »,
//     « buddha bowl », « lait vegetal », « steak vegetal », « happycow ».
//   · ANCRÉ — « veggie », « vegetal » (nu), « soja » (générique), « bowl » (récipient) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Usage EN réel : substituts et plats. La frontière ci-dessous est tenue à l'identique en EN.
//   · SOLO — « vegetarian », « plant based », « veganuary », « oat milk », « almond milk »,
//     « soy milk », « plant milk », « meat free », « dairy free », « vegan cheese », « hummus »,
//     « nutritional yeast », « aquafaba », « jackfruit » : univoques.
//   · ANCRÉ — « chickpea » (ingrédient générique, ni végé ni vegan en soi) : compagnon requis.
//   · EXCLU EN — « plant based DIET », « meat free MONDAY » écartés comme RÉGIME ; « cruelty free »,
//     « go vegan », « animal rights » écartés comme CONVICTION. Symétrie stricte avec le FR.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. CULINAIRE seulement (plats, substituts) — PAS le RÉGIME/nutrition-santé (perte de
// poids, calories : hors-champ, frôle D1) ni la CONVICTION militante (antispécisme, cause animale :
// hors-champ). Aucun marqueur d'éthique ni de minceur. Chevauche `cuisine`/`patisserie` (assumé).

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
    // Variantes EN (PANO-88) : SOLO univoques — substituts et plats SEULEMENT (ni régime, ni cause).
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
    'veggie', // abréviation générique
    'vegetal', // végétal nu (générique)
    'soja', // soja générique
    'bowl', // récipient / buddha bowl
    'levure', // partagé pâtisserie
    // Variantes EN (PANO-88) : ANCRÉS.
    'chickpea', // ingrédient générique, ni végé ni vegan en soi (EN)
  ],
  selfDeclared: ['vegan', 'vegetarien', 'flexitarien'],
};
