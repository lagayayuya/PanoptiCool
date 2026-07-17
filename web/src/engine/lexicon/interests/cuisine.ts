// Lexique d'intérêt `cuisine` (D2, PANO-76 lot 1, réécriture PROFONDE) — cuisine du quotidien.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la cuisine FR : techniques, ustensiles, familles de plats, sites/robots.
// À l'aveugle depuis l'usage commun.
//
// ── Méthode recall — tiers (thème LARGE) ───────────────────────────────────────────────────────
//   · SOLO à haute couverture : « recette » attrape « recette de cinnamon roll » SANS lister chaque
//     plat (décision PANO-76) ; « cuisiner », « patisserie », « fait maison », techniques et
//     ustensiles univoques. On ne liste PAS l'infini des plats — la tête de série suffit.
//   · ANCRÉ — 50/50 : « plat » (à plat/adjectif), « four » (échec), « chef » (patron), « cuisine »
//     (pièce / « cuisine interne »), « sauce », « pate » : co-occurrence requise.
//   · EXCLU — « bon » / « miam » (trop génériques), « gateau » nu gardé SOLO (le sens gâteau domine).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. RÉGIME / perte de poids hors-champ (frôle D1) : aucun marqueur de calories/minceur.
// « cuisine végé/vegan » et « pâtisserie » sont des thèmes séparés ; ici la cuisine salée du quotidien.

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
    // Appareils, chefs & plats (rétrofit PANO-90)
    'air fryer',
    'airfryer',
    'kitchenaid',
    'cyril lignac',
    'philippe etchebest',
    'ramen maison',
    'poke bowl',
    'tacos maison',
  ],
  anchored: [
    'plat', // à plat / plat (adjectif)
    'four', // « un four » (échec)
    'chef', // patron / boss
    'cuisine', // pièce / « cuisine interne » (politique)
    'sauce', // sauce vs « ça envoie la sauce »
    'pate', // pâte vs « les pattes » (homographe normalisé proche)
    'poele', // poêle vs poêle à bois
    'dressage', // dressage assiette vs dressage animal
    'mijoter', // mijoter un plat vs « mijoter un plan »
    'ninja', // robot Ninja vs partagé (motos/gaming)
    'staub', // marque de cocotte vs patronyme
    'curry', // plat/épice vs partagé basket
  ],
  selfDeclared: ['cuisinier', 'cuisiniere', 'patissier', 'patissiere'],
};
