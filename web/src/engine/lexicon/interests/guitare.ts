// Lexique d'intérêt `guitare` (D2, PANO-78 lot 3) — guitare & instruments.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la guitare/musique FR : techniques, matériel, MARQUES, autres instruments.
// Entités = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « guitare », « guitariste », « riff », « tablature », « mediator », « stratocaster »,
//     « telecaster », « capodastre », « solfege », « arpege », « ampli », « ibanez ».
//   · ANCRÉ — « fender » (aile de voiture), « gibson » (prénom), « marshall » (prénom), « martin »,
//     « taylor », « accord » (entente), « corde » (lien), « manche » (bras), « basse » (bas), « boss »,
//     « pedale », « yamaha » (partagé motos) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const GUITARE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'guitare',
  themeLabel: 'theme.guitare.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.music-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'guitare',
    'guitariste',
    'riff',
    'tablature',
    'mediator',
    'capodastre',
    'stratocaster',
    'telecaster',
    'les paul',
    'ampli guitare',
    'arpege',
    'solfege',
    'partition',
    'tapping',
    'sweeping',
    'distorsion',
    'ibanez',
    'guitare electrique',
    'ukulele',
  ],
  anchored: [
    'fender', // aile de voiture vs marque
    'gibson', // prénom / marque
    'marshall', // prénom / marque
    'martin', // prénom / marque
    'taylor', // prénom / marque
    'accord', // entente vs accord (musique)
    'corde', // lien vs corde (instrument)
    'manche', // bras vs manche (guitare)
    'basse', // bas vs basse (instrument)
    'boss', // patron / marque de pédales
    'pedale', // partagé (voitures/cyclisme)
    'yamaha', // partagé motos
    'ampli',
  ],
  selfDeclared: ['guitariste', 'musicien', 'musicienne'],
};
