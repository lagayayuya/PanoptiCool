// Lexique d'intérêt `expo_concert` (D2, PANO-78 lot 3) — sorties culturelles : concerts & expos.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant des sorties culturelles FR : concerts/festivals, expositions, jargon, lieux
// et festivals nommés. Entités = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « concert », « vernissage », « setlist », « backstage », « moshpit », festivals
//     (« hellfest », « coachella », « rock en seine », « vieilles charrues »), « billetterie ».
//   · ANCRÉ — « live » (streaming), « scene » (partagé cinéma), « rappel » (encore / escalade),
//     « fosse » (trou), « expo » (partagé photo), « galerie » (marchande / tunnel), « festival »,
//     « artiste » (générique) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const EXPO_CONCERT_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'expo_concert',
  themeLabel: 'theme.expo-concert.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.event-tickets', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'concert',
    'vernissage',
    'setlist',
    'backstage',
    'moshpit',
    'billetterie',
    'tete d affiche',
    'premiere partie',
    'salle de concert',
    'hellfest',
    'coachella',
    'rock en seine',
    'vieilles charrues',
    'solidays',
    'biennale',
    'galerie d art',
    'open air',
    'tournee',
  ],
  anchored: [
    'live', // en direct / streaming
    'scene', // partagé cinéma
    'rappel', // encore / escalade / rappel (mémoire)
    'fosse', // trou / fosse d'orchestre
    'pit', // fosse (anglais)
    'expo', // partagé photographie
    'galerie', // galerie marchande / tunnel
    'festival', // festival générique
    'artiste', // générique
    'oeuvre', // travail générique
  ],
  selfDeclared: ['festivalier', 'amateur d art'],
};
