// Interest lexicon `astronomie` (D2, PANO-89 batch 4) — astronomy / space.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR astronomy: celestial objects, missions/agencies, equipment. Entities =
// generic public signal enriched by research. SOBER usage (publishing/edtech).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « astronomie », « nasa », « spacex », « james webb », « exoplanete », « trou noir »,
//     « nebuleuse », « supernova », « voie lactee », « big bang », « matiere noire », « astronaute ».
//   · ANCHORED — « espace » (« espace vert » / « espace client »), « etoile » (celebrity / Michelin),
//     « mars » (month / Mars bar), « galaxie » (Samsung Galaxy), « lune », « soleil », « planete »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
//   · SOLO — « astronomy », « exoplanet », « black hole », « nebula », « dark matter »,
//     « astronaut », « space telescope », « solar system », « light year », « space station »,
//     « stargazing », « comet », « telescope »: univocal.
//   · ANCHORED — « space » (« give me space », « storage space », « espace client »), « star » (=
//     CELEBRITY — massive on TikTok), « moon » (« over the moon »; and « TO THE MOON » from the
//     `crypto` community), « galaxy » (Samsung Galaxy), « milky way » (the CHOCOLATE BAR — same
//     reason as « mars » in FR), « planet », « orbit », « constellation »: companion required.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

import type { InterestLexicon } from '../types';

export const ASTRONOMIE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'astronomie',
  themeLabel: 'theme.astronomie.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.edtech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'astronomie',
    'nasa',
    'spacex',
    'james webb',
    'exoplanete',
    'trou noir',
    'nebuleuse',
    'supernova',
    'voie lactee',
    'big bang',
    'matiere noire',
    'astronaute',
    'telescope spatial',
    'systeme solaire',
    'annee lumiere',
    'station spatiale',
    'hubble',
    'comete',
    // EN variants (PANO-88): SOLO univocal (celestial objects / equipment).
    'astronomy',
    'exoplanet',
    'black hole',
    'nebula',
    'dark matter',
    'astronaut',
    'space telescope',
    'solar system',
    'light year',
    'space station',
    'stargazing',
    'comet',
    'telescope',
  ],
  anchored: [
    'espace', // « espace vert » / « espace client »
    'etoile', // celebrity / Michelin star
    'mars', // month of March / Mars bar
    'galaxie', // Samsung Galaxy
    'lune', // « être dans la lune »
    'soleil', // generic sun
    'planete', // generic planet
    'cosmos', // generic cosmos
    'constellation', // constellation (figurative)
    'orbite', // generic orbit
    // EN variants (PANO-88): ANCHORED.
    'space', // « give me space » / « storage space » (EN)
    'star', // = celebrity — massive on TikTok (EN)
    'moon', // « over the moon » / « to the moon » (crypto) (EN)
    'galaxy', // Samsung Galaxy (EN)
    'milky way', // the chocolate bar — same reason as « mars » in FR
    'planet', // generic planet (EN)
    'orbit', // generic orbit (EN)
  ],
  selfDeclared: ['astronome amateur'],
};
