// Interest lexicon `photographie` (D2, PANO-77 batch 2 · entities enriched) — photography.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR photo: gear, techniques, SOFTWARE, BRANDS, ABBREVIATIONS/jargon.
// Blind; brands and acronyms = generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « photographie », « appareil photo », « reflex », « argentique », « bokeh »,
//     « dslr », « hybride », « lightroom »; brands (« nikon », « fujifilm », « leica », « gopro »).
//   · ANCHORED — 50/50: « photo » (generic), « objectif » (aim/goal), « canon » (weapon/norm), « sony »,
//     « sigma » (math / slang), « iso » (org norm), « expo » (exhibition), « macro », « pose »,
//     « raw », « filtre », « zoom », « capteur »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from « dessin/illustration » (separate theme).

import type { InterestLexicon } from '../types';

export const PHOTOGRAPHIE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'photographie',
  themeLabel: 'theme.photographie.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.photo-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Vocabulary / techniques
    'photographie',
    'appareil photo',
    'reflex',
    'photographe',
    'retouche photo',
    'lightroom',
    'argentique',
    'grand angle',
    'profondeur de champ',
    'prise de vue',
    'photo de rue',
    'tirage photo',
    'portrait photo',
    'bokeh',
    'dslr',
    'hybride photo',
    'longue exposition',
    'vitesse d obturation',
    'diaphragme',
    'teleobjectif',
    // Brands / software
    'nikon',
    'fujifilm',
    'leica',
    'gopro',
    'hasselblad',
    'capture one',
    'photoshop',
    'trepied',
    // EN variants (PANO-88): SOLO univocal.
    'golden hour',
  ],
  anchored: [
    'photo', // generic « photo de profil »
    'objectif', // aim/goal vs camera lens
    'canon', // weapon / norm / brand
    'sony', // broad brand
    'sigma', // math / « sigma » (slang) vs brand
    'iso', // norm / organisation vs sensitivity
    'expo', // exhibition (concert) / photo exhibition
    'macro', // macro (spreadsheet) vs macro photo
    'pose', // posture
    'cliche', // received idea
    'raw', // raw (English) vs raw format
    'filtre', // generic filter
    'zoom', // generic zoom / video call
    'capteur', // generic sensor
    'focale',
    'shooting', // photo shoot vs generic English (EN, anchored)
    'editing', // retouching vs generic editing (EN)
  ],
  selfDeclared: ['photographe', 'passionne de photo'],
};
