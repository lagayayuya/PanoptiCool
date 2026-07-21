// Lexique d'intérêt `skate` (D2, PANO-78 lot 3) — skateboard.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du skate FR : tricks, matériel, MARQUES, spots. Entités = signal public
// générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « skateboard », « ollie », « kickflip », « heelflip », « griptape », « skatepark »,
//     « half pipe », « thrasher ».
//   · ANCRÉ — « skate » (patin), « board » (planche générique), « deck » (jeu de cartes / pont),
//     « grind » (travail / jeu vidéo), « spot » (lieu / projecteur), « trucks » (camions), « element »
//     (chimie), « vans » (fourgons / marque) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Sondage net : les NOMS du skate sont tous pris ailleurs (« deck », « trucks », « grind », « bail »,
// « session », « park », « board », « rail », « ledge », « flip »). Ce qui porte le domaine, ce sont
// les NOMS DE TRICKS — inventés ici, donc univoques.
//   · SOLO — « boardslide », « noseslide », « tailslide », « bluntslide », « smith grind »,
//     « crooked grind », « feeble grind », « hardflip », « darkslide », « slappy », « fakie »,
//     « shuvit », « treflip », « wheel bite », « bushings », « quarterpipe », « skatetok », « sk8 ».
//     Les composés sont sûrs LÀ OÙ leur tête ne l'est pas : « boardslide » vs « board », « wheel bite »
//     vs « wheel ».
//   · ANCRÉ — « coping » (le rebord du bowl — mais « coping mechanism » appartient au registre de la
//     SANTÉ MENTALE : ancré sans hésiter, c'est la collision la plus coûteuse du lot), « bowl » (le
//     saladier), « switch » (la Nintendo Switch), « gap » (la marque de vêtements ; un trou dans un
//     agenda), « session » (de studio, de thérapie), « ledge », « rail », « flip », « primo » : compagnon requis.
//   · ÉCARTÉ — « mongo » (terme de skate réel, mais insulte validiste en anglais britannique) et
//     « kingpin » (le parrain, le personnage Marvel) : gain nul, coût réel.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const SKATE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'skate',
  themeLabel: 'theme.skate.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.skate-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'skateboard',
    'ollie',
    'kickflip',
    'heelflip',
    'nollie',
    'tre flip',
    'griptape',
    'skatepark',
    'half pipe',
    'plan incline',
    'roues de skate',
    'thrasher',
    'longboard',
    'shove it',
    // Variantes EN (PANO-88) : SOLO univoques — les noms de tricks, seul vocabulaire propre au domaine.
    'boardslide',
    'noseslide',
    'tailslide',
    'bluntslide',
    'smith grind',
    'crooked grind',
    'feeble grind',
    'hardflip',
    'darkslide',
    'slappy',
    'fakie',
    'shuvit',
    'treflip',
    'wheel bite',
    'bushings',
    'quarterpipe',
    'skatetok',
    'skatelife',
    'sk8',
  ],
  anchored: [
    'skate', // patin (à glace) / roller
    'board', // planche générique
    'deck', // jeu de cartes / pont
    'grind', // travail / grind (jeu)
    'spot', // lieu / projecteur
    'trucks', // camions
    'element', // chimie / marque
    'vans', // fourgons / marque
    'wax', // cire générique
    'rampe', // rampe d'escalier
    // Variantes EN (PANO-88) : ANCRÉS.
    'coping', // rebord du bowl — mais « coping mechanism » = santé mentale : collision la plus coûteuse (EN)
    'bowl', // le saladier / le Super Bowl (EN)
    'switch', // la Nintendo Switch / un interrupteur (EN)
    'gap', // la marque de vêtements / un trou dans un agenda (EN)
    'session', // session de studio / de thérapie (EN)
    'ledge', // rebord de fenêtre / de falaise (EN)
    'rail', // rail de train / rampe d'escalier (EN)
    'flip', // « flip a coin » / retourner un bien immobilier (EN)
    'primo', // un prénom / « premier » en italien (EN)
  ],
  selfDeclared: ['skateur', 'skateuse'],
};
