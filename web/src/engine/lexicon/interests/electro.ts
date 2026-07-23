// Interest lexicon `electro` (D2, PANO-78 batch 3) — electronic music / DJ.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR electro: genres, ARTISTS, festivals, gear, jargon. Entities =
// generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « techno », « dj set », « david guetta », « daft punk », « charlotte de witte »,
//     « tomorrowland », « french touch », « hardstyle », « boiler room », « platines ».
//   · ANCHORED — « house » (home), « trance » (trance), « set », « mix », « drop » (drop/fall), « kick »,
//     « bass », « acid », « justice » (justice / band), « garage » (parking / genre), « dj »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Anglophone electro speaks mostly by its WORKSHOP (production) and its sub-genres.
//   · SOLO — « sidechain », « mixdown », « ableton », « fl studio », « wavetable », « vst »,
//     « four on the floor », « amen break », « berghain », « warehouse party », « white label »,
//     sub-genres (« liquid dnb », « uk garage », « speed garage », « breakcore », « minimal techno »,
//     « acid house », « dnb »).
//   · ANCHORED — « loop » (the programming LOOP, dominant sense outside music; and the loop pedal of
//     `guitare`), « lfo » (short acronym), « afters » (generic), « bootleg » (pirate copy),
//     « residency » (= medical RESIDENCY): companion required.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. « french touch »/« daft punk » shared with broad music culture (assumed).

import type { InterestLexicon } from '../types';

export const ELECTRO_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'electro',
  themeLabel: 'theme.electro.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.music-streaming', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'techno',
    'dj set',
    'french touch',
    'hardstyle',
    'boiler room',
    'platines',
    'david guetta',
    'daft punk',
    'charlotte de witte',
    'dj snake',
    'martin garrix',
    'deep house',
    'tech house',
    'drum and bass',
    'tomorrowland',
    'table de mixage',
    'synthe modulaire',
    'edm',
    // Artists / genres / festivals / gear (enriched)
    'gesaffelstein',
    'amelie lens',
    'boris brejcha',
    'kavinsky',
    'bob sinclar',
    'psytrance',
    'dubstep',
    'gabber',
    'synthwave',
    'awakenings',
    'kappa futurfestival',
    'boiler set',
    'controleur midi',
    'vinyle mix',
    'basse ligne',
    // EN variants (PANO-88): SOLO univocal (production workshop / sub-genres / venues).
    'sidechain',
    'mixdown',
    'ableton',
    'fl studio',
    'wavetable',
    'vst',
    'four on the floor',
    'amen break',
    'berghain',
    'warehouse party',
    'white label',
    'liquid dnb',
    'uk garage',
    'speed garage',
    'breakcore',
    'minimal techno',
    'acid house',
    'dnb',
  ],
  anchored: [
    'house', // home / house music
    'trance', // trance / genre
    'set', // set/group / DJ set
    'mix', // mixture / mix
    'drop', // fall / drop
    'kick', // kick / kick (drums)
    'bass', // generic bass
    'acid', // acid / acid house
    'justice', // justice / the band
    'garage', // parking / garage genre
    'dj', // acronym (disc jockey)
    'cdj', // gear (short)
    'minimal', // generic minimal vs genre
    'hardcore', // generic intense vs genre
    'techhouse', // (kept anchored, short)
    'bpm', // acronym
    'rave', // to rave (English) vs rave party
    'ambient', // generic ambient vs genre
    'b2b', // back to back (DJ) vs acronym (EN)
    'warm up', // opening set vs generic warm-up (EN)
    // EN variants (PANO-88): ANCHORED.
    'loop', // programming loop / loop pedal (guitare) (EN)
    'lfo', // short acronym (EN)
    'afters', // generic (EN)
    'bootleg', // pirate copy / bootleg jeans (EN)
    'residency', // = medical residency vs DJ residency (EN)
  ],
  selfDeclared: ['dj', 'producteur de musique'],
};
