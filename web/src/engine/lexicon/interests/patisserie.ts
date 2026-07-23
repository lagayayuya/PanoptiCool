// Interest lexicon `patisserie` (D2, PANO-77 batch 2 · entities enriched) — pastry / cake design.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR pastry: preparations, TECHNIQUES, named CLASSICS, CHEFS,
// brands. Blind; entities = generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « patisserie », « macaron », « meringue », « chantilly », « genoise »,
//     « ganache », « temperage », « entremets », « fraisier », « cedric grolet », « pierre herme ».
//   · ANCHORED — 50/50: « financier » (finance), « madeleine » (first name), « eclair » (lightning), « opera »
//     (music), « joconde » (Mona Lisa), « fondant », « glace », « moule », « creme », « sable »: co-occurrence.
//   · EXCLUDED — « religieuse » (the pastry) → brushes `religion` (D1), DISCARDED out of caution.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Real EN usage verified by research (baking / sourdough glossaries).
//   · SOLO — « baking », « pastry », « sourdough », « buttercream », « royal icing », « piping bag »,
//     « cake decorating », « banneton », « cheesecake », « frosting », « baketok ».
//   · ANCHORED — the EN 50/50: « icing » (« the ICING ON THE CAKE » — figurative; icing in hockey),
//     « dough » (= MONEY in slang), « proofing » (= proofreading/checking), « starter » (appetizer /
//     beginner / starter pack), « batter » (baseball batter), « whisk » (« whisk away »),
//     « baker » (common SURNAME): companion required.
//   · ASSUMED TRAP — « baking » matches « it's baking hot » (= scorching). Kept SOLO by symmetry
//     with « patisserie » (solo in FR): it is THE core word of the domain, and an isolated hit stays drowned
//     by the floor + the ranking (assumed recall, PANO-76).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. Overlaps `cuisine` (assumed). DIET out of scope: no calorie marker.

import type { InterestLexicon } from '../types';

export const PATISSERIE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'patisserie',
  themeLabel: 'theme.patisserie.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.recipe-targeting', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Preparations / classics
    'patisserie',
    'patisser',
    'macaron',
    'meringue',
    'chantilly',
    'genoise',
    'creme patissiere',
    'creme mousseline',
    'creme diplomate',
    'pate a choux',
    'ganache',
    'glacage miroir',
    'mille feuille',
    'tarte au citron',
    'entremets',
    'fraisier',
    'paris brest',
    'cake design',
    'pate sablee',
    'praline',
    // Techniques / utensils
    'temperage',
    'poche a douille',
    'moule a gateau',
    'chocolatier',
    // Chefs (univocal)
    'cedric grolet',
    'pierre herme',
    'valrhona',
    // EN variants (PANO-88): SOLO univocal (preparations / techniques / community).
    'baking',
    'pastry',
    'sourdough',
    'buttercream',
    'royal icing',
    'piping bag',
    'cake decorating',
    'banneton',
    'cheesecake',
    'frosting',
    'baketok',
  ],
  anchored: [
    'financier', // finance vs financier (cake)
    'madeleine', // first name / madeleine de Proust
    'eclair', // lightning vs éclair (pastry)
    'opera', // music / theatre vs opéra (cake)
    'joconde', // Mona Lisa vs joconde sponge
    'fondant', // adjective (« regard fondant »)
    'glace', // cold / mirror vs icing
    'levure', // generic (beer)
    'moule', // mussel vs cake mold
    'creme', // overlaps cuisine/skincare
    'sable', // sand (beach) vs shortbread
    'fouetter',
    // EN variants (PANO-88): ANCHORED.
    'icing', // « the icing on the cake » (figurative) / icing in hockey (EN)
    'dough', // = money in slang (EN)
    'proofing', // = proofreading / checking (EN)
    'starter', // appetizer / beginner / starter pack vs starter culture (EN)
    'batter', // baseball batter vs batter (EN)
    'whisk', // « whisk away » (EN)
    'baker', // common surname (EN)
  ],
  selfDeclared: ['patissier', 'patissiere', 'cake designer'],
};
