// Interest lexicon `mathematiques` (D2, PANO-89 batch 4) — mathematics (knowledge field).
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR math: branches, objects, figures. SOBER usage (publishing/edtech).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « mathematiques », « algebre », « geometrie », « trigonometrie », « derivee »,
//     « integrale », « theoreme », « pythagore », « topologie », « logarithme », « nombre premier ».
//   · ANCHORED — « maths », « fonction » (role / ceremony), « suite » (hotel / continuation),
//     « matrice » (Matrix / womb), « limite », « ensemble » (« tous ensemble »), « produit »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
//   · SOLO — « mathematics », « algebra », « geometry », « trigonometry », « theorem », « calculus »,
//     « topology », « logarithm », « prime number », « pythagoras »: univocal.
//   · ANCHORED — the EN math vocabulary is massively recycled by everyday language and tech:
//     « math » (« DO THE MATH » = draw the conclusions), « integral » (« an INTEGRAL PART of » —
//     a common adjective), « derivative » (financial DERIVATIVE product), « matrix » (the FILM), « function »
//     (PROGRAMMING function), « sequence », « limit », « proof » (« proof of purchase »).
//   · EXCLUDED — « set »: « set », « DJ set », « set up », « TV set », « sunset »… → DISCARDED, even
//     anchored (it is the « bare ia » of the math lexicon).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

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
    // EN variants (PANO-88): SOLO univocal (branches / objects / figures).
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
    'maths', // abbreviation
    'fonction', // role / ceremony / function (math)
    'suite', // hotel / continuation
    'matrice', // Matrix / womb
    'limite', // generic limit
    'ensemble', // « tous ensemble » / set (math)
    'produit', // product (commerce) / product (math)
    'racine', // root (plant) / square root
    // EN variants (PANO-88): ANCHORED.
    'math', // « do the math » = draw the conclusions (EN)
    'integral', // « an integral part of » — a common adjective (EN)
    'derivative', // financial derivative product (EN)
    'matrix', // the film (EN)
    'function', // programming function (EN)
    'sequence', // generic sequence (EN)
    'limit', // generic limit (EN)
    'proof', // « proof of purchase » (EN)
  ],
  selfDeclared: ['etudiant en mathematiques', 'matheux'],
};
