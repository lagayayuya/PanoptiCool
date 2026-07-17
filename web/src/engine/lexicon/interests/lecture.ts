// Lexique d'intérêt `lecture` (D2, PANO-78 lot 3) — lecture / livres.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la lecture FR : genres, PLATEFORMES, auteurs, jargon communauté BookTok.
// Entités = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « booktok », « romantasy », « dark romance », « colleen hoover », « goodreads »,
//     « babelio », « wattpad », « liseuse », « pile a lire », « bouquin », « roman ».
//   · ANCRÉ — « lecture » (action / interprétation), « tome », « chapitre » (partagé cinéma), « saga »,
//     « spicy », « slow burn », « one shot » (jeu/photo), « polar » (ours / laine) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de `manga_anime` (thème séparé).

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
    // Genres / auteurs / plateformes (enrichi)
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
    // Variantes EN (PANO-88) : SOLO univoque (jargon BookTok).
    'buddy read',
  ],
  anchored: [
    'lecture', // action de lire / interprétation
    'tome', // tome générique
    'chapitre', // partagé cinéma
    'saga', // saga générique
    'spicy', // épicé (anglais)
    'slow burn', // jargon
    'one shot', // jeu / photo
    'polar', // ours polaire / polaire (laine)
    'page turner',
    'poche', // poche générique vs livre de poche
    'broche', // broche (bijou) vs livre broché
    'fantasy', // fantasy générique vs genre
    'plot twist', // rebondissement vs générique (EN, ancré)
    'tbr', // « to be read » (pile à lire) vs sigle (EN)
  ],
  selfDeclared: ['lecteur', 'lectrice', 'grande lectrice'],
};
