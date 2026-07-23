// Interest lexicon `voitures` (D2, PANO-77 batch 2 · entities enriched) — cars / tuning.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR cars: mechanics, BRANDS, TUNING/mod jargon. Blind; brands
// and jargon = generic public signal enriched by research (manufacturers, performance divisions, slang).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « tuning », « bagnole », « jantes », « echappement », « jdm », « cartographie
//     moteur »; brands (« renault », « peugeot », « bmw », « audi », « ferrari », « tesla »).
//   · ANCHORED — 50/50: « moteur » (search), « chevaux » (animals), « break » (pause), « coupe »,
//     « golf » (sport), « m3 » (file), « stance », « swap », « alpine » (mountain), « seat »: co-occurrence.
//   · EXCLUDED — nothing hopeless.
//
// ── EN variants (PANO-88) — FP probe ───────────────────────────────────────────────────────────
// Anglophone cars are spoken through MODDING: named parts and operations, very univocal.
//   · SOLO — « coilovers », « catback », « downpipe », « intercooler », « blow off valve »,
//     « widebody », « ls swap », « vtec », « autocross », « daily driver », « project car », « dyno »,
//     « naturally aspirated », « rev limiter », « drivetrain », « camber », « ceramic coating »,
//     « limited slip », « ecu tune », « torque converter », « ricer », « cartok », « car meet ».
//   · ANCHORED — « donuts » (the pastry), « rice » (rice — only
//     « ricer » is safe), « build » (a game build; construction), « mods » (game mods,
//     moderators), « tune » (tuning a `guitar`, « a tune » = a track), « track » (a
//     music track, an athletics track), « headers » (HTTP headers), « cam » (webcam),
//     « boost », « lift », « slammed », « sleeper », « spec »: companion required.
//   · DISCARDED — models whose name is a common word (« focus », « golf » already anchored, « charger »,
//     « civic », « soul », « note », « fit »): they fire constantly on unrelated text.
//   · DISCARDED, and the reason is worth writing — « burnout » (the burn in a cloud of smoke). The word
//     is a `mental_health` term: the D1 boundary guard of `interests-battery` REFUSES an
//     interest marker coinciding with a sensitive term, even anchored. The rule is categorical,
//     not probabilistic — « a companion would do » is not enough, because what it protects
//     is not the FP rate but the absence of any path from a distress word to a theme.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. « motos » = separate theme in the catalog; here the 4-wheelers.

import type { InterestLexicon } from '../types';

export const VOITURES_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'voitures',
  themeLabel: 'theme.voitures.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.automotive', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Generic vocabulary
    'voiture',
    'bagnole',
    'tuning',
    'jantes',
    'carrosserie',
    'echappement',
    'cheval fiscal',
    'boite manuelle',
    'permis de conduire',
    'code de la route',
    'supercar',
    'berline',
    'cabriolet',
    'essai auto',
    'hot hatch',
    'cylindree',
    'bas de caisse',
    'becquet',
    'ligne inox',
    'cartographie moteur',
    'admission directe',
    'kit carrosserie',
    // Tuning / mod jargon
    'jdm',
    'restomod',
    'launch control',
    // Brands
    'renault',
    'peugeot',
    'citroen',
    'bmw',
    'audi',
    'mercedes',
    'volkswagen',
    'toyota',
    'ferrari',
    'porsche',
    'lamborghini',
    'tesla',
    'bugatti',
    'maserati',
    'dacia',
    'nissan',
    'subaru',
    'amg',
    // EN variants (PANO-88): univocal SOLO (modding / parts / community).
    'coilovers',
    'catback',
    'downpipe',
    'intercooler',
    'blow off valve',
    'widebody',
    'ls swap',
    'vtec',
    'autocross',
    'daily driver',
    'project car',
    'dyno',
    'naturally aspirated',
    'rev limiter',
    'drivetrain',
    'camber',
    'ceramic coating',
    'limited slip',
    'ecu tune',
    'torque converter',
    'ricer',
    'cartok',
    'carsoftiktok',
    'car meet',
  ],
  anchored: [
    'moteur', // search engine
    'chevaux', // animals vs tax horsepower
    'break', // pause vs break (car body)
    'coupe', // coupe (car body) / world cup
    'caisse', // crate / caisse (car slang)
    'bolide',
    'roue', // generic wheel
    'pneu', // fairly auto but kept anchored
    'turbo', // drink / forced induction
    'golf', // golf sport vs vw golf
    'm3', // file format vs bmw m3
    'stance', // posture vs stance style
    'swap', // exchange vs engine swap
    'alpine', // mountain vs alpine brand
    'seat', // seat (English) vs seat brand
    'drift', // drift (motion) vs drift
    // EN variants (PANO-88): ANCHORED.
    'donuts', // the pastry (EN)
    'rice', // rice — only « ricer » is safe (EN)
    'build', // a game build / construction (EN)
    'mods', // game mods / moderators (EN)
    'tune', // tuning a guitar / « a tune » = a track (EN)
    'track', // a music track / an athletics track (EN)
    'headers', // = HTTP headers (EN)
    'cam', // webcam vs camshaft (EN)
    'boost', // a boost / a game boost (EN)
    'lift', // elevator / to lift (EN)
    'slammed', // « slammed with work » / criticized (EN)
    'sleeper', // « a sleeper hit » / heavy sleeper (EN)
    'spec', // specification in general (EN)
  ],
  selfDeclared: ['passionne d auto', 'mecano'],
};
