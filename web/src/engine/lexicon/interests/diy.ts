// Interest lexicon `diy` (D2, PANO-89 batch 4) — DIY / home improvement.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR DIY: tools, materials, stores, renovation. Entities = generic
// public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « perceuse », « visseuse », « placo », « renovation », « leroy merlin », « castorama »,
//     « ponceuse », « scie sauteuse », « home staging ».
//   · ANCHORED — « bricolage » (« bricolage » = making do), « vis », « cheville » (anatomy), « niveau »,
//     « marteau », « clou », « scie », « chantier »: co-occurrence.
//   · EXCLUDED — bare « outil » (too generic).
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Clear lesson of the survey: in English DIY, SAFETY IS IN THE COMPOUND, never in the simple
// noun. None of « drill / sand / level / stain / finish / router / plane / square / nail / screw »
// is usable bare — each has a dominant sense elsewhere.
//   · SOLO — the materials and joinery, which exist only here: « drywall », « spackle », « joist »,
//     « plywood », « shiplap », « subfloor », « caulk », « grout », « chamfer », « kerf »,
//     « countersink », « mortise », « tenon », « dovetail », « sandpaper », « miter saw »,
//     « orbital sander », « pocket hole », « brad nailer », « impact driver », « woodworking ».
//   · ANCHORED — « drill » (the DRILL, but « UK drill » = a `rap` sub-genre, and the
//     military/sports exercise), « router » (the network ROUTER, overwhelming sense), « plane » (the PLANE/AIRCRAFT), « sand »
//     (sand), « level » (game « level up »), « stain » (a stain on a garment), « nail »
//     (the NAIL/fingernail — all of vertical beauty), « screw » (curse), « square » (the town square, « square up »):
//     companion required.
//   · TAG — « tiktokdiy », not « diytok »: the latter does not exist (verified).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

import type { InterestLexicon } from '../types';

export const DIY_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'diy',
  themeLabel: 'theme.diy.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.diy-tools', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'bricolage',
    'perceuse',
    'visseuse',
    'placo',
    'placoplatre',
    'renovation',
    'leroy merlin',
    'brico depot',
    'castorama',
    'ponceuse',
    'scie sauteuse',
    'tuto diy',
    'home staging',
    'palette bois',
    'tournevis electrique',
    'do it yourself',
    'perceuse visseuse',
    // EN variants (PANO-88): SOLO univocal — materials and joinery (safety is in the compound).
    'woodworking',
    'drywall',
    'spackle',
    'joist',
    'plywood',
    'shiplap',
    'subfloor',
    'caulk',
    'grout',
    'chamfer',
    'kerf',
    'countersink',
    'mortise',
    'tenon',
    'dovetail',
    'sandpaper',
    'miter saw',
    'table saw',
    'orbital sander',
    'pocket hole',
    'pilot hole',
    'brad nailer',
    'impact driver',
    'wood glue',
    'wood filler',
    'wood stain',
    'speed square',
    'tiktokdiy',
    'upcycle',
  ],
  anchored: [
    'bricolage', // making do / « c'est du bricolage »
    'vis', // generic screw
    'cheville', // anatomy / cheville (wall plug)
    'niveau', // generic level
    'marteau', // generic hammer
    'clou', // generic nail
    'scie', // « scie » / « si »
    'chantier', // generic worksite
    'bosch', // appliances / Hieronymus Bosch
    // EN variants (PANO-88): ANCHORED — the simple domain nouns, all taken elsewhere.
    'drill', // drill vs « uk drill » (rap) / military exercise (EN)
    'router', // = network router, overwhelming sense (EN)
    'plane', // = aircraft (EN)
    'sand', // sand (EN)
    'level', // game « level up » / generic level (EN)
    'stain', // stain on a garment vs wood stain (EN)
    'nail', // = fingernail (vertical beauty) / « nailed it » (EN)
    'screw', // curse (EN)
    'square', // the town square / « square up » (EN)
    'stud', // framing stud vs « a stud » (EN)
    'primer', // « a primer on X » = intro vs primer coat (EN)
  ],
  selfDeclared: ['bricoleur', 'bricoleuse'],
};
