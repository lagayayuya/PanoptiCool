// Interest lexicon `lecture` (D2, PANO-78 batch 3) — reading / books.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR reading: genres, PLATFORMS, authors, BookTok community jargon.
// Entities = generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « booktok », « romantasy », « dark romance », « colleen hoover », « goodreads »,
//     « babelio », « wattpad », « liseuse », « pile a lire », « bouquin », « roman ».
//   · ANCHORED — « lecture » (reading action / interpretation), « tome », « chapitre » (shared cinema), « saga »,
//     « spicy », « slow burn », « one shot » (game/photo), « polar » (polar bear / fleece): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from `manga_anime` (separate theme).

import type { InterestLexicon } from '../types';

export const LECTURE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'lecture',
  themeLabel: 'theme.lecture.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.books', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'booktok',
    'romantasy',
    'dark romance',
    'colleen hoover',
    'goodreads',
    'babelio',
    'wattpad',
    'bookstagram',
    'liseuse',
    'pile a lire',
    'bouquin',
    'roman',
    'science fiction',
    'thriller',
    'feel good',
    'sarah j maas',
    'fourth wing',
    'kindle',
    'club de lecture',
    // Genres / authors / platforms (enriched)
    'young adult',
    'dystopie',
    'cosy mystery',
    'autobiographie',
    'essai litteraire',
    'rebecca yarros',
    'guillaume musso',
    'franck thilliez',
    'stephen king',
    'kobo',
    'salon du livre',
    'dedicace',
    'prix goncourt',
    'roman graphique',
    'livre audio',
    'best seller',
    // EN variants (PANO-88): SOLO univocal (BookTok jargon).
    'buddy read',
  ],
  anchored: [
    'lecture', // reading action / interpretation
    'tome', // generic tome
    'chapitre', // shared cinema
    'saga', // generic saga
    'spicy', // spicy (English)
    'slow burn', // jargon
    'one shot', // game / photo
    'polar', // polar bear / fleece (wool)
    'page turner',
    'poche', // generic pocket vs paperback
    'broche', // brooch (jewelry) vs bound book
    'fantasy', // generic fantasy vs genre
    'plot twist', // plot twist vs generic (EN, anchored)
    'tbr', // « to be read » (to-be-read pile) vs acronym (EN)
  ],
  selfDeclared: ['lecteur', 'lectrice', 'grande lectrice'],
};
