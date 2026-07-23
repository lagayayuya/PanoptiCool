// Interest lexicon `coiffure` (D2, PANO-77 batch 2 · entities enriched) — hairdressing / hair care.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR hairdressing: cuts, color TECHNIQUES, care, BRANDS and tools.
// Blind; techniques/brands = generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « coiffure », « brushing », « balayage », « babylights », « ombre hair »,
//     « lissage bresilien », « wolf cut », brands (« kerastase », « olaplex », « steampod »).
//   · ANCHORED — 50/50: « coupe » (World Cup), « boucles » (buckles), « racines » (roots/origins), « volume »
//     (overlaps muscu/photo), « frange », « coloration », « mulet » (fish), « ghd », « loreal »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from `maquillage` and `skincare`.

import type { InterestLexicon } from '../types';

export const COIFFURE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'coiffure',
  themeLabel: 'theme.coiffure.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.haircare', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Cuts / techniques
    'coiffure',
    'coiffeur',
    'coiffeuse',
    'brushing',
    'balayage',
    'meches',
    'babylights',
    'tie and dye',
    'lissage bresilien',
    'chignon',
    'tresse',
    'extensions cheveux',
    'apres shampoing',
    'cheveux boucles',
    'carre plongeant',
    'ombre hair',
    'soin capillaire',
    'coupe de cheveux',
    'degrade cheveux',
    'fer a lisser',
    'wolf cut',
    'frange rideau',
    'keratine',
    // Brands / tools
    'kerastase',
    'olaplex',
    'steampod',
    'franck provost',
    'schwarzkopf',
    // EN variants (PANO-88): SOLO univocal.
    'curly girl method',
    'hair routine',
  ],
  anchored: [
    'coupe', // World Cup / car body
    'boucles', // buckles / curls
    'racines', // origins / roots (hair)
    'volume', // overlaps muscu (hair volume)
    'frange', // generic fringe
    'pointe', // generic tip
    'coloration', // generic coloring
    'raie', // fish (ray) vs parting (hair)
    'mulet', // fish (mullet) vs mullet cut
    'ghd', // brand acronym (short)
    'loreal', // broad / generic brand
    'patine', // patina (object) vs toning (hair)
    'blowout', // blowout (EN) vs generic « blow out »
  ],
  selfDeclared: ['coiffeur', 'coiffeuse'],
};
