// Interest lexicon `lapins` (D2, PANO-89 batch 4) — pet rabbits.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR pet rabbits: breeds, care, habitat. Entities = generic public
// signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « lapin nain », « clapier », « cuniculiculture », « lapereau », « lapin de compagnie ».
//   · ANCHORED — « lapin » (« poser un lapin »), « belier » (zodiac / ram), « angora » (wool /
//     cat), « foin » (« faire du foin »), « terrier » (terrier dog), « nac » (acronym): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Real EN usage verified by research (House Rabbit Society / BunnyTok).
//   · SOLO — « timothy hay », « rabbit hutch », « house rabbit », « bunnytok », « holland lop »,
//     « mini lop », « flemish giant »: univocal.
//   · ANCHORED — « rabbit » (« down the RABBIT HOLE » — massive idiom), « bunny » (Easter/Playboy/snow/gym
//     bunny), « binky » (= PACIFIER in common EN, before the rabbit's joy hop), « hay » (« hit the
//     hay », « make hay »), « hutch » (sideboard / Starsky & Hutch), « zoomies » (shared cats/dogs).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. « angora »/« belier » shared (cats / others): assumed (per-theme co-occurrence).

import type { InterestLexicon } from '../types';

export const LAPINS_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'lapins',
  themeLabel: 'theme.lapins.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.pet-supplies', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'lapin nain',
    'clapier',
    'cuniculiculture',
    'lapereau',
    'lapin de compagnie',
    'foin pour lapin',
    'lapin belier',
    'geant des flandres',
    'fauve de bourgogne',
    'enclos a lapin',
    'granules lapin',
    // EN variants (PANO-88): SOLO univocal (habitat / care / breeds).
    'timothy hay',
    'rabbit hutch',
    'house rabbit',
    'bunnytok',
    'holland lop',
    'mini lop',
    'flemish giant',
  ],
  anchored: [
    'lapin', // « poser un lapin » / « chaud lapin »
    'belier', // zodiac / ram (animal)
    'angora', // wool / angora cat
    'foin', // « faire du foin »
    'terrier', // terrier dog / burrow
    'nac', // acronym (exotic pets)
    'garenne', // place name / warren rabbit
    // EN variants (PANO-88): ANCHORED.
    'rabbit', // « down the rabbit hole » — massive idiom (EN)
    'bunny', // Easter / Playboy / snow / gym bunny (EN)
    'binky', // = pacifier in common EN vs the rabbit's joy hop
    'hay', // « hit the hay » / « make hay » (EN)
    'hutch', // sideboard / Starsky & Hutch (EN)
    'zoomies', // shared cats / dogs (EN)
  ],
  selfDeclared: ['proprietaire de lapin'],
};
