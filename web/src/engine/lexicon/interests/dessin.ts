// Interest lexicon `dessin` (D2, PANO-89 batch 4) — drawing / illustration.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR drawing: techniques, TOOLS/software, community jargon. Entities =
// generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « procreate », « wacom », « posca », « fanart », « lineart », « character design »,
//     « croquis », « encrage », « aquarelle », « inktober », « tablette graphique ».
//   · ANCHORED — « dessin » (cartoon / plan), « illustration » (example), « perspective » (point of
//     view), « encre », « planche », « portrait » (shared with photo), « palette » (shared with maquillage): co-occurrence.
//   · EXCLUDED — bare « art » (too generic).
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Real EN usage verified by research (ArtTok / drawing-painting glossaries).
//   · SOLO — « sketchbook », « sketching », « digital art », « art style », « linework »,
//     « speedpaint », « arttok »: univocal.
//   · ANCHORED — « sketch » (COMEDY sketch / « sketchy »), « rendering » (3D RENDER — massive in tech),
//     « shading » (curve / graph shading), « canvas » (Canvas LMS / tent canvas), « brush »
//     (toothbrush / hairbrush — shared `coiffure`, `maquillage`), « wip » (shared `tricot`),
//     « reference photo » (shared `photographie`): companion required.
//   · EXCLUDED — « oc » (« original character », real but 2 letters) → DISCARDED, like bare « ia » in FR.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from `photographie` and `manga_anime`.

import type { InterestLexicon } from '../types';

export const DESSIN_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'dessin',
  themeLabel: 'theme.dessin.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.art-supplies', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'procreate',
    'wacom',
    'posca',
    'clip studio paint',
    'krita',
    'fanart',
    'lineart',
    'character design',
    'croquis',
    'esquisse',
    'encrage',
    'aquarelle',
    'tablette graphique',
    'inktober',
    'carnet de croquis',
    'storyboard',
    'colorisation',
    'fusain',
    // EN variants (PANO-88): SOLO univocal (techniques / community).
    'sketchbook',
    'sketching',
    'digital art',
    'art style',
    'linework',
    'speedpaint',
    'arttok',
  ],
  anchored: [
    'dessin', // cartoon / plan / technical drawing
    'illustration', // example / generic illustration
    'perspective', // point of view
    'encre', // generic ink
    'planche', // plank (wood) / comic page
    'portrait', // shared with photography
    'palette', // shared with maquillage
    'gouache', // fairly drawing but kept anchored
    // EN variants (PANO-88): ANCHORED.
    'sketch', // comedy sketch / « sketchy » (EN)
    'rendering', // 3D render — massive in tech (EN)
    'shading', // curve / graph shading (EN)
    'canvas', // Canvas LMS / tent canvas (EN)
    'brush', // toothbrush / hairbrush — shared coiffure, maquillage (EN)
    'wip', // shared tricot / writing / DIY (EN)
    'reference photo', // shared photography (EN)
  ],
  selfDeclared: ['dessinateur', 'dessinatrice', 'illustrateur'],
};
