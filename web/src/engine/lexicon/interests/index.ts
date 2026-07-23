// Registry of interest lexicons (D2, PANO-76) — same mechanics as `WIRED_LEXICONS` (D1): wiring
// an interest = adding a module + one line in `INTEREST_LEXICONS`. The base (PANO-75) does not change;
// the content batches only add data.
//
// `CANONICAL_THEME_IDS` is the COMPLETE ratified catalogue (~52 themes, `docs/detecteur-interets-
// taxonomie.md`); `INTEREST_LEXICONS` is the WIRED subset (batch 1 = 12 themes). A guard test
// (`interests-battery.test.ts`) verifies that every wired theme is declared in the catalogue — a
// wired slug outside the catalogue is an unratified extension to escalate, not a valid theme.

import type { InterestLexicon } from '../types';
import { ASTRONOMIE_LEXICON } from './astronomie';
import { BASKET_LEXICON } from './basket';
import { BIOLOGIE_LEXICON } from './biologie';
import { CAFE_LEXICON } from './cafe';
import { CHATS_LEXICON } from './chats';
import { CHIENS_LEXICON } from './chiens';
import { CINEMA_SERIES_LEXICON } from './cinema-series';
import { COIFFURE_LEXICON } from './coiffure';
import { CRYPTO_LEXICON } from './crypto';
import { CUISINE_LEXICON } from './cuisine';
import { CUISINE_VEGE_LEXICON } from './cuisine-vege';
import { CYCLISME_LEXICON } from './cyclisme';
import { DANSE_LEXICON } from './danse';
import { DESSIN_LEXICON } from './dessin';
import { DIY_LEXICON } from './diy';
import { ECONOMIE_LEXICON } from './economie';
import { ELECTRO_LEXICON } from './electro';
import { ESPORT_LEXICON } from './esport';
import { EXPO_CONCERT_LEXICON } from './expo-concert';
import { FITNESS_LEXICON } from './fitness';
import { FOOTBALL_LEXICON } from './football';
import { GAMING_LEXICON } from './gaming';
import { GUITARE_LEXICON } from './guitare';
import { HISTOIRE_LEXICON } from './histoire';
import { IA_LEXICON } from './ia';
import { JARDINAGE_LEXICON } from './jardinage';
import { KPOP_LEXICON } from './kpop';
import { LAPINS_LEXICON } from './lapins';
import { LECTURE_LEXICON } from './lecture';
import { MANGA_ANIME_LEXICON } from './manga-anime';
import { MAQUILLAGE_LEXICON } from './maquillage';
import { MATHEMATIQUES_LEXICON } from './mathematiques';
import { MODE_LEXICON } from './mode';
import { MOTOS_LEXICON } from './motos';
import { MUSCU_LEXICON } from './muscu';
import { PATISSERIE_LEXICON } from './patisserie';
import { PHILOSOPHIE_LEXICON } from './philosophie';
import { PHOTOGRAPHIE_LEXICON } from './photographie';
import { PHYSIQUE_LEXICON } from './physique';
import { PSYCHOLOGIE_LEXICON } from './psychologie';
import { RANDONNEE_LEXICON } from './randonnee';
import { RAP_LEXICON } from './rap';
import { RUNNING_LEXICON } from './running';
import { SKATE_LEXICON } from './skate';
import { SKINCARE_LEXICON } from './skincare';
import { SNEAKERS_LEXICON } from './sneakers';
import { SOCIOLOGIE_LEXICON } from './sociologie';
import { SPORTS_COMBAT_LEXICON } from './sports-combat';
import { TECH_LEXICON } from './tech';
import { TRICOT_LEXICON } from './tricot';
import { VOITURES_LEXICON } from './voitures';
import { VOYAGE_LEXICON } from './voyage';

/**
 * COMPLETE ratified catalogue (~52 themes, PANO-74). Source of truth for theme identities: the
 * batches 2–3 draw from it without re-ratifying. Stable slugs (identity `Theme.id`), the prose of the names lives
 * in presentation (`theme.<slug>.label`). See `docs/detecteur-interets-taxonomie.md`.
 */
export const CANONICAL_THEME_IDS: ReadonlySet<string> = new Set([
  // Sport & activity
  'muscu',
  'running',
  'football',
  'basket',
  'cyclisme',
  'fitness',
  'randonnee',
  'skate',
  'sports_combat',
  'danse',
  // Games & tech
  'gaming',
  'esport',
  'tech',
  'ia',
  'crypto',
  // Cuisine & food
  'cuisine',
  'patisserie',
  'cuisine_vege',
  'cafe',
  // Beauty & fashion
  'maquillage',
  'skincare',
  'mode',
  'sneakers',
  'coiffure',
  // Musique
  'kpop',
  'rap',
  'electro',
  'guitare',
  // Culture & media
  'manga_anime',
  'cinema_series',
  'lecture',
  'expo_concert',
  // Animals
  'chiens',
  'chats',
  'lapins',
  // Creative & home
  'dessin',
  'photographie',
  'jardinage',
  'diy',
  'tricot',
  // Auto/moto & travel
  'voitures',
  'motos',
  'voyage',
  // Knowledge & disciplines
  'philosophie',
  'sociologie',
  'psychologie',
  'histoire',
  'economie',
  'biologie',
  'physique',
  'mathematiques',
  'astronomie',
]);

/**
 * WIRED interest lexicons — BATCHES 1 to 4 (PANO-76/77/78/89): 52 themes = COMPLETE CATALOGUE (
 * batch 4 completes the coverage of the ~52 ratified themes). The order is a simple ranking tie-break
 * (at equal evidence volume, the first goes ahead); the real sort is by volume, in the D2 rule.
 */
export const INTEREST_LEXICONS: readonly InterestLexicon[] = [
  // Batch 1 (PANO-76)
  MUSCU_LEXICON,
  RUNNING_LEXICON,
  FOOTBALL_LEXICON,
  GAMING_LEXICON,
  IA_LEXICON,
  CRYPTO_LEXICON,
  CUISINE_LEXICON,
  MAQUILLAGE_LEXICON,
  SKINCARE_LEXICON,
  SNEAKERS_LEXICON,
  KPOP_LEXICON,
  MANGA_ANIME_LEXICON,
  // Batch 2 (PANO-77)
  MODE_LEXICON,
  CINEMA_SERIES_LEXICON,
  CHIENS_LEXICON,
  CHATS_LEXICON,
  VOYAGE_LEXICON,
  VOITURES_LEXICON,
  RAP_LEXICON,
  PHOTOGRAPHIE_LEXICON,
  PATISSERIE_LEXICON,
  FITNESS_LEXICON,
  COIFFURE_LEXICON,
  TECH_LEXICON,
  // Batch 3 (PANO-78)
  BASKET_LEXICON,
  CYCLISME_LEXICON,
  RANDONNEE_LEXICON,
  SKATE_LEXICON,
  SPORTS_COMBAT_LEXICON,
  DANSE_LEXICON,
  ESPORT_LEXICON,
  CAFE_LEXICON,
  CUISINE_VEGE_LEXICON,
  ELECTRO_LEXICON,
  GUITARE_LEXICON,
  LECTURE_LEXICON,
  EXPO_CONCERT_LEXICON,
  MOTOS_LEXICON,
  // Batch 4 (PANO-89) — completes the catalogue
  LAPINS_LEXICON,
  DESSIN_LEXICON,
  JARDINAGE_LEXICON,
  DIY_LEXICON,
  TRICOT_LEXICON,
  PHILOSOPHIE_LEXICON,
  SOCIOLOGIE_LEXICON,
  PSYCHOLOGIE_LEXICON,
  HISTOIRE_LEXICON,
  ECONOMIE_LEXICON,
  BIOLOGIE_LEXICON,
  PHYSIQUE_LEXICON,
  MATHEMATIQUES_LEXICON,
  ASTRONOMIE_LEXICON,
];
