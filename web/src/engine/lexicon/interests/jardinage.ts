// Interest lexicon `jardinage` (D2, PANO-89 batch 4) — gardening / vegetable garden.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR gardening: vegetable garden, techniques, stores. Entities = generic public
// signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « potager », « permaculture », « semis », « bouture », « compost », « paillage »,
//     « repiquage », « terreau », « gamm vert », « succulente ».
//   · ANCHORED — « jardin » (« jardin secret »), « planter » (to stand someone up / a crash), « taille »
//     (size), « semer » (« semer quelqu'un »), « plante » (sole of the foot), « pousse » (thumb): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Real EN usage verified by research (PlantTok / gardening vocabulary).
//   · SOLO — « gardening », « planttok », « houseplant », « monstera », « aroid », « seedling »,
//     « repotting », « potting soil », « raised bed », « composting », « allotment »,
//     « propagation station », « plant parent »: univocal.
//   · ANCHORED — « propagation » (WAVE / ERROR propagation — massive in tech), « succulent »
//     (= TASTY, a common adjective), « greenhouse » (« greenhouse GAS » — climate), « perennial »
//     (« a perennial problem »), « garden » (« garden variety », « beer garden »), « pruning »
//     (DECISION-TREE pruning, tech): companion required.
//   · EXCLUDED — « prop » (a REAL PlantTok abbreviation but « props to you » / film prop
//     dominate very widely) → DISCARDED, even as anchored.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

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
    // EN variants (PANO-88): SOLO univocal (vegetable garden / houseplants / community).
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
    'planter', // to stand someone up / a software crash
    'taille', // size / to prune
    'semer', // « semer quelqu'un »
    'plante', // sole of the foot / verb
    'pousse', // thumb / to grow
    'arroser', // to water (figurative)
    'engrais', // fairly gardening but kept anchored
    // EN variants (PANO-88): ANCHORED.
    'propagation', // wave / error propagation — massive in tech (EN)
    'succulent', // = tasty (common adjective, EN)
    'greenhouse', // « greenhouse gas » — climate (EN)
    'perennial', // « a perennial problem » (EN)
    'garden', // « garden variety » / « beer garden » (EN)
    'pruning', // decision-tree pruning — tech (EN)
  ],
  selfDeclared: ['jardinier', 'jardiniere'],
};
