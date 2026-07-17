// Lexique d'intérêt `jardinage` (D2, PANO-89 lot 4) — jardinage / potager.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du jardinage FR : potager, techniques, enseignes. Entités = signal public
// générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « potager », « permaculture », « semis », « bouture », « compost », « paillage »,
//     « repiquage », « terreau », « gamm vert », « succulente ».
//   · ANCRÉ — « jardin » (« jardin secret »), « planter » (planter quelqu'un / bug), « taille »
//     (dimension), « semer » (« semer quelqu'un »), « plante » (plante du pied), « pousse » (pouce) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Usage EN réel vérifié par recherche (PlantTok / vocabulaire jardinage).
//   · SOLO — « gardening », « planttok », « houseplant », « monstera », « aroid », « seedling »,
//     « repotting », « potting soil », « raised bed », « composting », « allotment »,
//     « propagation station », « plant parent » : univoques.
//   · ANCRÉ — « propagation » (propagation d'ONDE / d'ERREUR — massif en tech), « succulent »
//     (= SAVOUREUX, adjectif courant), « greenhouse » (« greenhouse GAS » — climat), « perennial »
//     (« a perennial problem »), « garden » (« garden variety », « beer garden »), « pruning »
//     (élagage d'ARBRE DE DÉCISION, tech) : compagnon requis.
//   · EXCLU — « prop » (abréviation PlantTok RÉELLE mais « props to you » / accessoire de tournage
//     dominent très largement) → ÉCARTÉ, même en ancré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const JARDINAGE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'jardinage',
  themeLabel: 'theme.jardinage.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.gardening', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'jardinage',
    'potager',
    'permaculture',
    'semis',
    'bouture',
    'compost',
    'paillage',
    'repiquage',
    'terreau',
    'jardin bio',
    'gamm vert',
    'plante d interieur',
    'plante grasse',
    'succulente',
    'jardinerie',
    'arrosoir',
    'humus',
    'lombricompost',
    // Variantes EN (PANO-88) : SOLO univoques (potager / plantes d'intérieur / communauté).
    'gardening',
    'planttok',
    'houseplant',
    'monstera',
    'aroid',
    'seedling',
    'repotting',
    'potting soil',
    'raised bed',
    'composting',
    'allotment',
    'propagation station',
    'plant parent',
  ],
  anchored: [
    'jardin', // « jardin secret » / « jardin d'enfants »
    'planter', // planter quelqu'un / bug informatique
    'taille', // dimension / tailler
    'semer', // « semer quelqu'un »
    'plante', // plante du pied / verbe
    'pousse', // pouce / pousser
    'arroser', // arroser (au figuré)
    'engrais', // fairly jardin mais gardé ancré
    // Variantes EN (PANO-88) : ANCRÉS.
    'propagation', // propagation d'onde / d'erreur — massif en tech (EN)
    'succulent', // = savoureux (adjectif courant, EN)
    'greenhouse', // « greenhouse gas » — climat (EN)
    'perennial', // « a perennial problem » (EN)
    'garden', // « garden variety » / « beer garden » (EN)
    'pruning', // élagage d'arbre de décision — tech (EN)
  ],
  selfDeclared: ['jardinier', 'jardiniere'],
};
