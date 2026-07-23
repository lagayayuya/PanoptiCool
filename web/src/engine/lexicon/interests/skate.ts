// Interest lexicon `skate` (D2, PANO-78 batch 3) — skateboard.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR skate: tricks, gear, BRANDS, spots. Entities = generic public
// signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « skateboard », « ollie », « kickflip », « heelflip », « griptape », « skatepark »,
//     « half pipe », « thrasher ».
//   · ANCHORED — « skate » (ice skate), « board » (generic board), « deck » (card deck / bridge),
//     « grind » (work / video game), « spot » (place / spotlight), « trucks » (trucks), « element »
//     (chemistry), « vans » (vans / brand): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Clear survey: the skate NOUNS are all taken elsewhere (« deck », « trucks », « grind », « bail »,
// « session », « park », « board », « rail », « ledge », « flip »). What carries the domain is the
// TRICK NAMES — invented here, hence univocal.
//   · SOLO — « boardslide », « noseslide », « tailslide », « bluntslide », « smith grind »,
//     « crooked grind », « feeble grind », « hardflip », « darkslide », « slappy », « fakie »,
//     « shuvit », « treflip », « wheel bite », « bushings », « quarterpipe », « skatetok », « sk8 ».
//     The compounds are safe WHERE their head is not: « boardslide » vs « board », « wheel bite »
//     vs « wheel ».
//   · ANCHORED — « coping » (the bowl coping — but « coping mechanism » belongs to the MENTAL
//     HEALTH register: anchored without hesitation, it is the costliest collision of the batch), « bowl » (the
//     salad bowl), « switch » (the Nintendo Switch), « gap » (the clothing brand; a gap in a
//     schedule), « session » (studio, therapy), « ledge », « rail », « flip », « primo »: companion required.
//   · DISCARDED — « mongo » (a real skate term, but an ableist slur in British English) and
//     « kingpin » (the godfather, the Marvel character): no gain, real cost.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

import type { InterestLexicon } from '../types';

export const SKATE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'skate',
  themeLabel: 'theme.skate.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.skate-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'skateboard',
    'ollie',
    'kickflip',
    'heelflip',
    'nollie',
    'tre flip',
    'griptape',
    'skatepark',
    'half pipe',
    'plan incline',
    'roues de skate',
    'thrasher',
    'longboard',
    'shove it',
    // EN variants (PANO-88): SOLO univocal — the trick names, the only vocabulary proper to the domain.
    'boardslide',
    'noseslide',
    'tailslide',
    'bluntslide',
    'smith grind',
    'crooked grind',
    'feeble grind',
    'hardflip',
    'darkslide',
    'slappy',
    'fakie',
    'shuvit',
    'treflip',
    'wheel bite',
    'bushings',
    'quarterpipe',
    'skatetok',
    'skatelife',
    'sk8',
  ],
  anchored: [
    'skate', // ice skate / roller skate
    'board', // generic board
    'deck', // card deck / bridge
    'grind', // work / grind (game)
    'spot', // place / spotlight
    'trucks', // trucks
    'element', // chemistry / brand
    'vans', // vans / brand
    'wax', // generic wax
    'rampe', // staircase railing
    // EN variants (PANO-88): ANCHORED.
    'coping', // bowl coping — but « coping mechanism » = mental health: costliest collision (EN)
    'bowl', // the salad bowl / the Super Bowl (EN)
    'switch', // the Nintendo Switch / a switch (EN)
    'gap', // the clothing brand / a gap in a schedule (EN)
    'session', // studio / therapy session (EN)
    'ledge', // window / cliff ledge (EN)
    'rail', // train rail / staircase railing (EN)
    'flip', // « flip a coin » / to flip a property (EN)
    'primo', // a first name / « first » in Italian (EN)
  ],
  selfDeclared: ['skateur', 'skateuse'],
};
