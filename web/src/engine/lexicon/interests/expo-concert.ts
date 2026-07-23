// Interest lexicon `expo_concert` (D2, PANO-78 batch 3) — cultural outings: concerts & exhibitions.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR cultural outings: concerts/festivals, exhibitions, jargon, venues
// and named festivals. Entities = generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « concert », « vernissage », « setlist », « backstage », « moshpit », festivals
//     (« hellfest », « coachella », « rock en seine », « vieilles charrues »), « billetterie ».
//   · ANCHORED — « live » (streaming), « scene » (shared cinema), « rappel » (encore / abseiling),
//     « fosse » (pit), « expo » (shared photo), « galerie » (shopping mall / tunnel), « festival »,
//     « artiste » (generic): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Two DISJOINT registers under one theme — the concert and the gallery share almost no
// word. Both are covered; their traps are not the same.
//   · SOLO (concert) — « headliner », « soundcheck », « crowd surfing », « general admission »,
//     « guest list », « merch table », « front of house », « circle pit », « support act »,
//     « meet and greet », « tour dates », « standing room ».
//   · SOLO (expo) — « private view », « gallerist », « solo show », « group show », « artist statement »,
//     « wall text », « permanent collection », « art fair », « open studios », « white cube », « docent ».
//   · ANCHORED — « gig » (= the GIG ECONOMY today, and the gigabyte), « lineup »
//     (police lineup), « venue » (wedding venue), « installation » (SOFTWARE installation),
//     « curated » (now marketing slang), « floor »: companion required.
//   · DISCARDED — « encore », « stage », « retrospective »: these are COMMON FRENCH WORDS
//     (« encore » = again, « stage » = internship) or exact homographs of FR.
//     Letting them in solo would drag the theme onto any French text.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

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
    // EN variants (PANO-88): SOLO univocal — CONCERT register.
    'headliner',
    'soundcheck',
    'crowd surfing',
    'general admission',
    'guest list',
    'merch table',
    'front of house',
    'circle pit',
    'support act',
    'meet and greet',
    'tour dates',
    'standing room',
    // EN variants (PANO-88): SOLO univocal — EXPO / gallery register.
    'private view',
    'gallerist',
    'solo show',
    'group show',
    'artist statement',
    'wall text',
    'permanent collection',
    'art fair',
    'open studios',
    'white cube',
    'docent',
  ],
  anchored: [
    'live', // live / streaming
    'scene', // shared cinema
    'rappel', // encore / abseiling / reminder (memory)
    'fosse', // pit / orchestra pit
    'pit', // pit (English)
    'expo', // shared photography
    'galerie', // shopping mall / tunnel
    'festival', // generic festival
    'artiste', // generic
    'oeuvre', // generic work
    // EN variants (PANO-88): ANCHORED.
    'gig', // = gig economy / gigabyte (EN)
    'lineup', // police lineup / product line (EN)
    'venue', // wedding / conference venue (EN)
    'installation', // software installation (EN)
    'curated', // now marketing slang (EN)
    'floor', // floor vs dancefloor (EN)
  ],
  selfDeclared: ['festivalier', 'amateur d art'],
};
