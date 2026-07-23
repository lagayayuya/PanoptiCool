// Interest lexicon `cyclisme` (D2, PANO-78 batch 3) — cycling (road, MTB, gravel).
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR cycling: disciplines, race/mechanics jargon, BRANDS. Entities = generic
// public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « cyclisme », « vtt », « velo de route », « peloton », « derailleur », « tour de france »,
//     « braquet », « wattmetre »; brands (« shimano », « btwin », « lapierre »).
//   · ANCHORED — « velo », « col » (mountain pass / neck / glue), « cassette » (audio), « cintre » (coat rack),
//     « watts » (electric), « gravel » (gravel), « trek » (brand / Star Trek), « decathlon » (multi-sport),
//     « pedale » (shared): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Cycling separates from `running` only by its GEAR: the effort words are common to both.
//   · SOLO — « groupset », « bottom bracket », « bibshorts », « chamois cream », « dropper post »,
//     « singletrack », « tubeless », « gravel bike », « road bike », « bike fit », « zwift ».
//   · ANCHORED — « strava » (the app is AS MUCH the runners' — `running` carries it solo),
//     « bonk » (bonking/the hunger flat, but also British sexual slang and the « bonk » meme), « hardtail »
//     (shared with the choppers of `motos`), « kom », « ftp » (= the file transfer PROTOCOL,
//     severe collision outside sport), « saddle »: companion required.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. « denivele » shared with `running`/`randonnee` (assumed).

import type { InterestLexicon } from '../types';

export const CYCLISME_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'cyclisme',
  themeLabel: 'theme.cyclisme.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.cycling-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'cyclisme',
    'vtt',
    'velo de route',
    'peloton',
    'echappee',
    'derailleur',
    'braquet',
    'wattmetre',
    'tour de france',
    'grimpeur',
    'sprinteur',
    'rouleur',
    'pedalier',
    'maillot jaune',
    'cyclosportive',
    'bikepacking',
    'sortie velo',
    'shimano',
    'btwin',
    // EN variants (PANO-88): SOLO univocal — the gear, the only discriminant against `running`.
    'groupset',
    'bottom bracket',
    'bibshorts',
    'chamois cream',
    'dropper post',
    'singletrack',
    'tubeless',
    'gravel bike',
    'road bike',
    'bike fit',
    'drop bars',
    'zwift',
    'granfondo',
  ],
  anchored: [
    'velo', // bike (fairly specific but kept anchored)
    'col', // mountain pass / neck / glue
    'cassette', // audio cassette vs cassette (bike)
    'cintre', // coat rack vs handlebar
    'watts', // electric
    'gravel', // gravel
    'trek', // brand / Star Trek / trekking
    'decathlon', // multi-sport store
    'pedale', // shared (voitures/guitare)
    'denivele', // shared running/randonnee
    'cadence', // generic rhythm
    // EN variants (PANO-88): ANCHORED.
    'strava', // shared with running (which carries it solo) (EN)
    'bonk', // bonking vs British slang / meme (EN)
    'hardtail', // hardtail MTB vs chopper (motos) (EN)
    'kom', // short acronym (EN)
    'ftp', // = file transfer protocol (EN)
    'saddle', // saddle vs « saddled with » (EN)
  ],
  selfDeclared: ['cycliste', 'passionne de velo'],
};
