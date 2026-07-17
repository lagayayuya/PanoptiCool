// Registre des lexiques d'intérêt (D2, PANO-76) — même mécanique que `WIRED_LEXICONS` (D1) : câbler
// un intérêt = ajouter un module + une ligne dans `INTEREST_LEXICONS`. Le socle (PANO-75) ne change
// pas ; les lots de contenu n'ajoutent que des données.
//
// `CANONICAL_THEME_IDS` est le catalogue COMPLET ratifié (~52 thèmes, `docs/detecteur-interets-
// taxonomie.md`) ; `INTEREST_LEXICONS` est le sous-ensemble CÂBLÉ (lot 1 = 12 thèmes). Un test de
// garde (`interests-battery.test.ts`) vérifie que tout thème câblé est déclaré au catalogue — un
// slug câblé hors catalogue est une extension non ratifiée à remonter, pas un thème valide.

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
 * Catalogue COMPLET ratifié (~52 thèmes, PANO-74). Source de vérité des identités de thème : les
 * lots 2–3 y piochent sans re-ratifier. Slugs stables (identité `Theme.id`), la prose des noms vit
 * en présentation (`theme.<slug>.label`). Voir `docs/detecteur-interets-taxonomie.md`.
 */
export const CANONICAL_THEME_IDS: ReadonlySet<string> = new Set([
  // Sport & activité
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
  // Jeux & tech
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
  // Beauté & mode
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
  // Culture & médias
  'manga_anime',
  'cinema_series',
  'lecture',
  'expo_concert',
  // Animaux
  'chiens',
  'chats',
  'lapins',
  // Créatif & maison
  'dessin',
  'photographie',
  'jardinage',
  'diy',
  'tricot',
  // Auto/moto & voyage
  'voitures',
  'motos',
  'voyage',
  // Savoirs & disciplines
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
 * Lexiques d'intérêt CÂBLÉS — LOTS 1 à 4 (PANO-76/77/78/89) : 52 thèmes = CATALOGUE COMPLET (le
 * lot 4 achève la couverture des ~52 thèmes ratifiés). L'ordre est un simple tie-break de classement
 * (à volume de preuves égal, le premier passe devant) ; le vrai tri est par volume, dans la règle D2.
 */
export const INTEREST_LEXICONS: readonly InterestLexicon[] = [
  // Lot 1 (PANO-76)
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
  // Lot 2 (PANO-77)
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
  // Lot 3 (PANO-78)
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
  // Lot 4 (PANO-89) — achève le catalogue
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
