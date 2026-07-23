// Interest lexicon `cuisine` (D2, PANO-76 batch 1, DEEP rewrite) — everyday cooking.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR cooking: techniques, utensils, dish families, sites/machines.
// Blind from common usage.
//
// ── Recall method — tiers (BROAD theme) ────────────────────────────────────────────────────────
//   · High-coverage SOLO: « recette » catches « recette de cinnamon roll » WITHOUT listing each
//     dish (PANO-76 decision); « cuisiner », « patisserie », « fait maison », univocal techniques and
//     utensils. We do NOT list the infinity of dishes — the head of the series suffices.
//   · ANCHORED — 50/50: « plat » (flat/adjective), « four » (flop), « chef » (boss), « cuisine »
//     (room / « cuisine interne »), « sauce », « pate »: co-occurrence required.
//   · EXCLUDED — « bon » / « miam » (too generic), bare « gateau » kept SOLO (the cake sense dominates).
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// EN usage verified by research. The community tag is « foodtok » (not « cooktok »).
//   · SOLO — « foodtok », « stir fry », « sheet pan », « dutch oven », « pan sauce », « wok hei »,
//     « deglaze », « umami », « doneness », « skillet », « gochujang », « chimichurri », « sofrito ».
//   · ANCHORED — « cook » (= « LET HIM COOK » / « he's cooked », game slang now DOMINANT
//     online: the biggest FP provider of the batch), « season » (anime / sport season), « stock »
//     (stock market), « raw » (photo RAW file), « dice » (dice), « roast » (to mock): companion required.
//   · DISCARDED — « mise en place », « sous vide »: these are borrowings from FRENCH, and « la mise en
//     place du projet » is a banal sentence in French — an « EN » marker that massively matches
//     FR is not a variant, it is a regression.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DIET / weight loss out of scope (brushes D1): no calorie/slimming marker.
// « veg/vegan cooking » and « patisserie » are separate themes; here everyday savory cooking.

import type { InterestLexicon } from '../types';

export const CUISINE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'cuisine',
  themeLabel: 'theme.cuisine.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.recipe-targeting', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'recette',
    'recettes',
    'recipe',
    'cuisiner',
    'patisserie',
    'boulangerie',
    'fait maison',
    'batch cooking',
    'meal prep',
    'plat mijote',
    'gateau',
    'tarte maison',
    'pate a tarte',
    'pate feuilletee',
    'levain',
    'marmiton',
    'cookeo',
    'thermomix',
    'mijoteuse',
    'robot patissier',
    'gratin',
    'mijote',
    'fait revenir',
    'a la poele',
    'au four maison',
    'cuisson vapeur',
    'epices maison',
    'marinade',
    'bouillon maison',
    'fournee',
    'cuisine du monde',
    'street food',
    'brunch maison',
    'assiette gourmande',
    // Appliances, chefs & dishes (retrofit PANO-90)
    'air fryer',
    'airfryer',
    'kitchenaid',
    'cyril lignac',
    'philippe etchebest',
    'ramen maison',
    'poke bowl',
    'tacos maison',
    // EN variants (PANO-88): SOLO univocal (techniques / equipment / community).
    'foodtok',
    'stir fry',
    'sheet pan',
    'dutch oven',
    'pan sauce',
    'wok hei',
    'deglaze',
    'umami',
    'doneness',
    'skillet',
    'gochujang',
    'chimichurri',
    'sofrito',
    'home cooking',
    'weeknight dinner',
  ],
  anchored: [
    'plat', // flat / plat (adjective)
    'four', // « un four » (flop)
    'chef', // boss / chief
    'cuisine', // room / « cuisine interne » (politics)
    'sauce', // sauce vs « ça envoie la sauce »
    'pate', // dough vs « les pattes » (close normalized homograph)
    'poele', // pan vs wood stove
    'dressage', // plate plating vs animal training
    'mijoter', // simmering a dish vs « mijoter un plan »
    'ninja', // Ninja machine vs shared (motos/gaming)
    'staub', // cocotte brand vs surname
    'curry', // dish/spice vs shared basket
    // EN variants (PANO-88): ANCHORED.
    'cook', // « let him cook » / « he's cooked » — game slang dominant online (EN)
    'season', // anime / sport season vs to season (EN)
    'stock', // stock market / generic stock vs broth (EN)
    'raw', // RAW file (photo) / raw (EN)
    'dice', // playing dice vs to dice (EN)
    'roast', // to mock vs roast (EN)
  ],
  selfDeclared: ['cuisinier', 'cuisiniere', 'patissier', 'patissiere'],
};
