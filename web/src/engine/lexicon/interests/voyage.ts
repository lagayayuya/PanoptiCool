// Interest lexicon `voyage` (D2, PANO-77 batch 2 · entities enriched) — travel / tourism.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR travel: formats, logistics, LIFESTYLES, PLATFORMS, backpacker jargon.
// Blind; platforms and jargon = generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « roadtrip », « backpacker », « routard », « vanlife », « slow travel »,
//     « digital nomad », « couchsurfing »; platforms (« airbnb », « ryanair », « skyscanner »).
//   · ANCHORED — 50/50: « voyage » (figurative), « vol » (theft), « visa » (card), « van » (van),
//     « guide », « circuit », « booking », « escale », « sejour », « destination »: co-occurrence.
//   · EXCLUDED — bare country names (too generic).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

import type { InterestLexicon } from '../types';

export const VOYAGE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'voyage',
  themeLabel: 'theme.voyage.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.travel-booking', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Generic vocabulary
    'roadtrip',
    'backpacker',
    'routard',
    'globe trotter',
    'auberge de jeunesse',
    'decalage horaire',
    'city trip',
    'depaysement',
    'vol pas cher',
    'guide du routard',
    'sac a dos voyage',
    'carnet de voyage',
    'tour du monde',
    'baroudeur',
    'escapade weekend',
    'bons plans voyage',
    // Lifestyles / jargon
    'vanlife',
    'slow travel',
    'digital nomad',
    'couchsurfing',
    'trekking',
    'workaway',
    'pvt',
    // Platforms
    'airbnb',
    'ryanair',
    'skyscanner',
    'easyjet',
    'blablacar',
    'booking com',
    'hostelworld',
    'flixbus',
    'lonely planet',
    // Formats / experiences
    'croisiere',
    'all inclusive',
    'bivouac',
    'camping car',
    'sac de couchage',
    'safari photo',
    'expatriation',
    // EN variants (PANO-88): univocal SOLO.
    'bucket list',
    'staycation',
  ],
  anchored: [
    'voyage', // figurative / « voyage de données »
    'vol', // theft vs air flight
    'visa', // bank card vs visa
    'van', // generic van
    'sejour', // generic
    'destination', // generic
    'depart', // generic
    'guide', // person / book
    'circuit', // electrical / tourist circuit
    'valise', // generic
    'hebergement', // generic
    'escale', // generic stopover
    'booking', // generic booking / platform
  ],
  selfDeclared: ['voyageur', 'grand voyageur', 'routard'],
};
