// Lexique d'intérêt `mathematiques` (D2, PANO-89 lot 4) — mathématiques (champ savoir).
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant des maths FR : branches, objets, figures. Usage SOBRE (édition/edtech).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « mathematiques », « algebre », « geometrie », « trigonometrie », « derivee »,
//     « integrale », « theoreme », « pythagore », « topologie », « logarithme », « nombre premier ».
//   · ANCRÉ — « maths », « fonction » (rôle / cérémonie), « suite » (hôtel / continuation),
//     « matrice » (Matrix / utérus), « limite », « ensemble » (« tous ensemble »), « produit » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
//   · SOLO — « mathematics », « algebra », « geometry », « trigonometry », « theorem », « calculus »,
//     « topology », « logarithm », « prime number », « pythagoras » : univoques.
//   · ANCRÉ — le vocabulaire math EN est massivement recyclé par la langue courante et la tech :
//     « math » (« DO THE MATH » = tire les conclusions), « integral » (« an INTEGRAL PART of » —
//     adjectif courant), « derivative » (produit DÉRIVÉ financier), « matrix » (le FILM), « function »
//     (fonction de PROGRAMMATION), « sequence », « limit », « proof » (« proof of purchase »).
//   · EXCLU — « set » : « set », « DJ set », « set up », « TV set », « sunset »… → ÉCARTÉ, même en
//     ancré (c'est le « ia nu » du lexique maths).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const MATHEMATIQUES_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'mathematiques',
  themeLabel: 'theme.mathematiques.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.edtech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'mathematiques',
    'algebre',
    'geometrie',
    'trigonometrie',
    'derivee',
    'integrale',
    'theoreme',
    'pythagore',
    'topologie',
    'logarithme',
    'nombre premier',
    'equation',
    'calcul differentiel',
    'thales',
    'suite arithmetique',
    // Variantes EN (PANO-88) : SOLO univoques (branches / objets / figures).
    'mathematics',
    'algebra',
    'geometry',
    'trigonometry',
    'theorem',
    'calculus',
    'topology',
    'logarithm',
    'prime number',
    'pythagoras',
  ],
  anchored: [
    'maths', // abréviation
    'fonction', // rôle / cérémonie / fonction (maths)
    'suite', // hôtel / continuation
    'matrice', // Matrix / utérus
    'limite', // limite générique
    'ensemble', // « tous ensemble » / ensemble (maths)
    'produit', // produit (commerce) / produit (maths)
    'racine', // racine (plante) / racine carrée
    // Variantes EN (PANO-88) : ANCRÉS.
    'math', // « do the math » = tire les conclusions (EN)
    'integral', // « an integral part of » — adjectif courant (EN)
    'derivative', // produit dérivé financier (EN)
    'matrix', // le film (EN)
    'function', // fonction de programmation (EN)
    'sequence', // séquence générique (EN)
    'limit', // limite générique (EN)
    'proof', // « proof of purchase » (EN)
  ],
  selfDeclared: ['etudiant en mathematiques', 'matheux'],
};
