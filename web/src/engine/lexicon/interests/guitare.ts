// Interest lexicon `guitare` (D2, PANO-78 batch 3) — guitar & instruments.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR guitar/music: techniques, gear, BRANDS, other instruments.
// Entities = generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « guitare », « guitariste », « riff », « tablature », « mediator », « stratocaster »,
//     « telecaster », « capodastre », « solfege », « arpege », « ampli », « ibanez ».
//   · ANCHORED — « fender » (car fender), « gibson » (first name), « marshall » (first name), « martin »,
//     « taylor », « accord » (agreement), « corde » (rope/bond), « manche » (arm/handle), « basse » (low), « boss »,
//     « pedale », « yamaha » (shared motos): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// EN usage verified by research (lutherie / learning glossaries).
//   · SOLO — « fretboard », « barre chord », « power chord », « pentatonic », « humbucker »,
//     « single coil », « whammy bar », « floyd rose », « fingerpicking », « palm mute », « hammer on »,
//     « pull off », « alternate picking », « sweep picking », « truss rod », « plectrum »,
//     « stompbox », « pedalboard », « tube amp », « drop d », « open tuning », « guitartok ».
//   · ANCHORED — « fret » (= TO WORRY, a common verb), « pick » (to pick; the video-game pick),
//     « capo » (a mafia lieutenant), « tabs » (the browser TABS), « scale » (the
//     scale/balance, « scale up »), « strings » (character strings), « amp » (« amped up » = excited;
//     the ampere), « tone » (the tone of the voice), « rig » (the gamer's PC), « solo » (alone; the solo queue),
//     « shred » (skate; « shredded » = ripped), « bend », « lick », « nut », « overdrive »:
//     companion required.
//   · DISCARDED — « luthier », « intonation »: identical FRENCH words, not variants.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

import type { InterestLexicon } from '../types';

export const GUITARE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'guitare',
  themeLabel: 'theme.guitare.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.music-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'guitare',
    'guitariste',
    'riff',
    'tablature',
    'mediator',
    'capodastre',
    'stratocaster',
    'telecaster',
    'les paul',
    'ampli guitare',
    'arpege',
    'solfege',
    'partition',
    'tapping',
    'sweeping',
    'distorsion',
    'ibanez',
    'guitare electrique',
    'ukulele',
    // EN variants (PANO-88): SOLO univocal (techniques / lutherie / gear).
    'fretboard',
    'barre chord',
    'power chord',
    'pentatonic',
    'humbucker',
    'single coil',
    'whammy bar',
    'floyd rose',
    'fingerpicking',
    'palm mute',
    'hammer on',
    'pull off',
    'alternate picking',
    'sweep picking',
    'truss rod',
    'plectrum',
    'stompbox',
    'pedalboard',
    'tube amp',
    'drop d',
    'open tuning',
    'guitartok',
  ],
  anchored: [
    'fender', // car fender vs brand
    'gibson', // first name / brand
    'marshall', // first name / brand
    'martin', // first name / brand
    'taylor', // first name / brand
    'accord', // agreement vs chord (music)
    'corde', // bond/rope vs string (instrument)
    'manche', // arm vs neck (guitar)
    'basse', // low vs bass (instrument)
    'boss', // boss / pedal brand
    'pedale', // shared (voitures/cyclisme)
    'yamaha', // shared motos
    'ampli',
    // EN variants (PANO-88): ANCHORED.
    'fret', // « to fret » = to worry, a common verb (EN)
    'pick', // to pick / the video-game pick (EN)
    'capo', // a mafia lieutenant (EN)
    'tabs', // = the browser tabs (EN)
    'scale', // the scale/balance / « scale up » (EN)
    'strings', // character strings / « no strings attached » (EN)
    'amp', // « amped up » = excited / the ampere (EN)
    'tone', // the tone of the voice (EN)
    'rig', // the gamer's PC / oil rig (EN)
    'shred', // skate / « shredded » = ripped (EN)
    'bend', // to bend / a bend (turn) (EN)
    'lick', // to lick (EN)
    'nut', // the nut / « going nuts » vs the guitar nut (EN)
    'overdrive', // « into overdrive » = full throttle (EN)
  ],
  selfDeclared: ['guitariste', 'musicien', 'musicienne'],
};
