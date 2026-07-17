// Lexique d'intérêt `voyage` (D2, PANO-77 lot 2 · enrichi entités) — voyage / tourisme.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du voyage FR : formats, logistique, MODES DE VIE, PLATEFORMES, jargon routard.
// À l'aveugle ; plateformes et jargon = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « roadtrip », « backpacker », « routard », « vanlife », « slow travel »,
//     « digital nomad », « couchsurfing » ; plateformes (« airbnb », « ryanair », « skyscanner »).
//   · ANCRÉ — 50/50 : « voyage » (figuré), « vol » (larcin), « visa » (carte), « van » (camionnette),
//     « guide », « circuit », « booking », « escale », « sejour », « destination » : co-occurrence.
//   · EXCLU — noms de pays nus (trop génériques).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

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
    // Vocabulaire générique
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
    // Modes de vie / jargon
    'vanlife',
    'slow travel',
    'digital nomad',
    'couchsurfing',
    'trekking',
    'workaway',
    'pvt',
    // Plateformes
    'airbnb',
    'ryanair',
    'skyscanner',
    'easyjet',
    'blablacar',
    'booking com',
    'hostelworld',
    'flixbus',
    'lonely planet',
    // Formats / expériences
    'croisiere',
    'all inclusive',
    'bivouac',
    'camping car',
    'sac de couchage',
    'safari photo',
    'expatriation',
    // Variantes EN (PANO-88) : SOLO univoques.
    'bucket list',
    'staycation',
  ],
  anchored: [
    'voyage', // figuré / « voyage de données »
    'vol', // larcin vs vol aérien
    'visa', // carte bancaire vs visa
    'van', // camionnette générique
    'sejour', // générique
    'destination', // générique
    'depart', // générique
    'guide', // personne / livre
    'circuit', // électrique / circuit touristique
    'valise', // générique
    'hebergement', // générique
    'escale', // escale générique
    'booking', // réservation générique / plateforme
  ],
  selfDeclared: ['voyageur', 'grand voyageur', 'routard'],
};
