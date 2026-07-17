// Lexique d'intérêt `dessin` (D2, PANO-89 lot 4) — dessin / illustration.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du dessin FR : techniques, OUTILS/logiciels, jargon communauté. Entités =
// signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « procreate », « wacom », « posca », « fanart », « lineart », « character design »,
//     « croquis », « encrage », « aquarelle », « inktober », « tablette graphique ».
//   · ANCRÉ — « dessin » (dessin animé / plan), « illustration » (exemple), « perspective » (point de
//     vue), « encre », « planche », « portrait » (partagé photo), « palette » (partagé maquillage) : co-occurrence.
//   · EXCLU — « art » nu (trop générique).
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Usage EN réel vérifié par recherche (ArtTok / glossaires dessin-peinture).
//   · SOLO — « sketchbook », « sketching », « digital art », « art style », « linework »,
//     « speedpaint », « arttok » : univoques.
//   · ANCRÉ — « sketch » (sketch COMIQUE / « sketchy »), « rendering » (RENDU 3D — massif en tech),
//     « shading » (ombrage de courbe / graphe), « canvas » (Canvas LMS / toile de tente), « brush »
//     (brosse à dents / à cheveux — partagé `coiffure`, `maquillage`), « wip » (partagé `tricot`),
//     « reference photo » (partagé `photographie`) : compagnon requis.
//   · EXCLU — « oc » (« original character », réel mais 2 lettres) → ÉCARTÉ, comme « ia » nu en FR.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de `photographie` et `manga_anime`.

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
    // Variantes EN (PANO-88) : SOLO univoques (techniques / communauté).
    'sketchbook',
    'sketching',
    'digital art',
    'art style',
    'linework',
    'speedpaint',
    'arttok',
  ],
  anchored: [
    'dessin', // dessin animé / plan / dessin technique
    'illustration', // exemple / illustration générique
    'perspective', // point de vue
    'encre', // encre générique
    'planche', // planche (bois) / planche de BD
    'portrait', // partagé photographie
    'palette', // partagé maquillage
    'gouache', // fairly dessin mais gardé ancré
    // Variantes EN (PANO-88) : ANCRÉS.
    'sketch', // sketch comique / « sketchy » (EN)
    'rendering', // rendu 3D — massif en tech (EN)
    'shading', // ombrage de courbe / graphe (EN)
    'canvas', // Canvas LMS / toile de tente (EN)
    'brush', // brosse à dents / à cheveux — partagé coiffure, maquillage (EN)
    'wip', // partagé tricot / écriture / DIY (EN)
    'reference photo', // partagé photographie (EN)
  ],
  selfDeclared: ['dessinateur', 'dessinatrice', 'illustrateur'],
};
