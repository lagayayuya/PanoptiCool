// Interest lexicon `motos` (D2, PANO-78 batch 3) — motorcycles / two-wheelers.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR motorcycling: types, BRANDS, biker jargon, licenses. Entities = generic
// public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « moto », « motard », « roadster », « cafe racer », « wheeling », « permis a2 »,
//     « supermotard », « enduro », « becane »; brands (« ducati », « ktm », « harley davidson »).
//   · ANCHORED — « honda »/« bmw » (shared voitures), « yamaha » (shared guitare), « suzuki » (violin
//     method), « kawasaki » (disease), « triumph » (victory), « ninja », « trail » (shared),
//     « custom », « cruiser » (ship), « guidon »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Anglophone motorcycling has COINAGES that exist nowhere else — that is its strength.
//   · SOLO — « motovlog » (the safest word of the domain), « atgatt », « chicken strips »,
//     « countersteering », « knee dragger », « highside », « lowside », « stoppie », « bobber »,
//     « supermoto », « dual sport », « naked bike », « lane splitting », « lane filtering »,
//     « quickshifter », « slipper clutch », « swingarm », « clip ons », « rearsets », « twisties »,
//     « pillion », « motorcycle », « bikersoftiktok ».
//   · ANCHORED — « squid » (the SQUID/CALAMARI, despite first-rate biker slang), « wheelie » (bikes and
//     BMX do it too), « throttle » (network throttling), « rider » (a horse rider; the
//     clause of a contract), « clutch » (the handbag; the game clutch), « chain » (the store
//     chain, the blockchain, the `rap` jewelry), « bikelife » (BICYCLE/BMX culture, a distinct
//     community), « rev »: companion required.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. « voitures » is a separate theme; here motorized two-wheelers.

import type { InterestLexicon } from '../types';

export const MOTOS_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'motos',
  themeLabel: 'theme.motos.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.motorcycle-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'moto',
    'motard',
    'roadster',
    'cafe racer',
    'wheeling',
    'permis a2',
    'supermotard',
    'enduro moto',
    'becane',
    'casque moto',
    'deux roues',
    'ducati',
    'ktm',
    'aprilia',
    'harley davidson',
    'panigale',
    'moto sportive',
    'moto custom',
    // Brands / models / jargon (enriched)
    'mv agusta',
    'moto guzzi',
    'royal enfield',
    'husqvarna',
    'africa twin',
    'contre braquage',
    'top case',
    'combinaison cuir',
    'moto trail',
    'motocross',
    'stunt moto',
    'scooter',
    'carenage moto',
    'gomme moto',
    'permis moto',
    // EN variants (PANO-88): SOLO univocal (biker jargon / chassis — many coinages).
    'motovlog',
    'atgatt',
    'chicken strips',
    'countersteering',
    'knee dragger',
    'highside',
    'lowside',
    'stoppie',
    'bobber',
    'supermoto',
    'dual sport',
    'naked bike',
    'lane splitting',
    'lane filtering',
    'quickshifter',
    'slipper clutch',
    'swingarm',
    'clip ons',
    'rearsets',
    'twisties',
    'pillion',
    'motorcycle',
    'bikersoftiktok',
  ],
  anchored: [
    'honda', // shared voitures
    'bmw', // shared voitures
    'yamaha', // shared guitare
    'suzuki', // violin method / first name
    'kawasaki', // Kawasaki disease
    'triumph', // victory (English)
    'ninja', // generic ninja
    'trail', // shared running/randonnee
    'custom', // to customize
    'cruiser', // ship
    'guidon', // generic handlebar
    'angle', // generic angle vs leaning angle
    'fourche', // fork (tool) vs fork (motorcycle)
    'gomme', // eraser (pencil) vs tire
    // EN variants (PANO-88): ANCHORED.
    'squid', // = the squid/calamari, despite first-rate biker slang (EN)
    'wheelie', // bikes and BMX do it too (EN)
    'throttle', // network throttling (EN)
    'rider', // a horse rider / the clause of a contract (EN)
    'clutch', // the handbag / the game clutch (EN)
    'chain', // store chain / blockchain / the rap jewelry (EN)
    'bikelife', // bicycle/BMX culture — a distinct community (EN)
    'rev', // « rev up » figurative (EN)
  ],
  selfDeclared: ['motard', 'motarde'],
};
