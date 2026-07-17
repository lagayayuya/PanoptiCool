// Lexique d'intérêt `patisserie` (D2, PANO-77 lot 2 · enrichi entités) — pâtisserie / cake design.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la pâtisserie FR : préparations, TECHNIQUES, CLASSIQUES nommés, CHEFS,
// marques. À l'aveugle ; entités = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « patisserie », « macaron », « meringue », « chantilly », « genoise »,
//     « ganache », « temperage », « entremets », « fraisier », « cedric grolet », « pierre herme ».
//   · ANCRÉ — 50/50 : « financier » (finance), « madeleine » (prénom), « eclair » (foudre), « opera »
//     (musique), « joconde » (Mona Lisa), « fondant », « glace », « moule », « creme », « sable » : co-occurrence.
//   · EXCLU — « religieuse » (la pâtisserie) → frôle `religion` (D1), ÉCARTÉ par prudence.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Usage EN réel vérifié par recherche (glossaires baking / sourdough).
//   · SOLO — « baking », « pastry », « sourdough », « buttercream », « royal icing », « piping bag »,
//     « cake decorating », « banneton », « cheesecake », « frosting », « baketok ».
//   · ANCRÉ — le 50/50 EN : « icing » (« the ICING ON THE CAKE » — figuré ; icing au hockey),
//     « dough » (= ARGENT en argot), « proofing » (= relecture/vérification), « starter » (entrée /
//     débutant / starter pack), « batter » (batteur de baseball), « whisk » (« whisk away »),
//     « baker » (PATRONYME courant) : compagnon requis.
//   · TRAP ASSUMÉ — « baking » matche « it's baking hot » (= caniculaire). Gardé SOLO par symétrie
//     avec « patisserie » (solo en FR) : c'est LE mot-cœur du domaine, et un hit isolé reste noyé
//     par le plancher + le classement (recall assumé, PANO-76).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Chevauche `cuisine` (assumé). RÉGIME hors-champ : aucun marqueur de calories.

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
    // Préparations / classiques
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
    // Techniques / ustensiles
    'temperage',
    'poche a douille',
    'moule a gateau',
    'chocolatier',
    // Chefs (univoques)
    'cedric grolet',
    'pierre herme',
    'valrhona',
    // Variantes EN (PANO-88) : SOLO univoques (préparations / techniques / communauté).
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
    'financier', // finance vs financier (gâteau)
    'madeleine', // prénom / madeleine de Proust
    'eclair', // foudre vs éclair (gâteau)
    'opera', // musique / théâtre vs opéra (gâteau)
    'joconde', // Mona Lisa vs biscuit joconde
    'fondant', // adjectif (« regard fondant »)
    'glace', // froid / miroir vs glaçage
    'levure', // générique (bière)
    'moule', // mollusque vs moule à gâteau
    'creme', // chevauche cuisine/skincare
    'sable', // sable (plage) vs sablé
    'fouetter',
    // Variantes EN (PANO-88) : ANCRÉS.
    'icing', // « the icing on the cake » (figuré) / icing au hockey (EN)
    'dough', // = argent en argot (EN)
    'proofing', // = relecture / vérification (EN)
    'starter', // entrée / débutant / starter pack vs levain (EN)
    'batter', // batteur de baseball vs pâte à frire (EN)
    'whisk', // « whisk away » (EN)
    'baker', // patronyme courant (EN)
  ],
  selfDeclared: ['patissier', 'patissiere', 'cake designer'],
};
