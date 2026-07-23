// Interest lexicon `chiens` (D2, PANO-77 batch 2 · entities enriched) — dogs.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR dogs: care, training, widespread BREEDS. Blind; breeds = generic
// public entities enriched by research (top France breeds).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « chiot », « aboiement », « dressage canin », « toilettage chien »; breeds
//     (« berger australien », « golden retriever », « labrador », « husky », « beagle », « shiba inu »).
//   · ANCHORED — 50/50: « chien » (idioms), « laisse » (verb), « spa » (jacuzzi), « niche » (market),
//     « maitre », « croquettes », « veterinaire », « boxer » (boxing), « berger » (occupation): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Real EN usage verified by research (DogTok / owner vocabulary).
//   · SOLO — « puppy », « doggo », « pupper », « dogtok », « puppuccino », « kennel », « dog park »,
//     « crate training », « dog groomer »; EN breeds (« poodle », « dachshund », « german shepherd »,
//     « french bulldog », « pug »).
//   · ANCHORED — « barking » (« barking up the wrong tree », « barking mad »), « leash » (« on a short
//     leash », figurative), « fetch » (DATA fetch — massive in tech), « frenchie » (nickname for a
//     FRENCH PERSON before being a bulldog), « breeder », « zoomies » / « paw » (shared with cats).
//   · EXCLUDED — « good boy » (common phrase outside dogs) → DISCARDED.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. « veterinaire » / « croquettes » ANCHORED (shared with `chats`): species companion required.

import type { InterestLexicon } from '../types';

export const CHIENS_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'chiens',
  themeLabel: 'theme.chiens.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.pet-supplies', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Care / training
    'chiot',
    'aboiement',
    'dressage canin',
    'education canine',
    'promenade du chien',
    'refuge animalier',
    'panier pour chien',
    'toilettage chien',
    'pension canine',
    'museliere',
    'clicker training',
    // Breeds (univocal)
    'berger allemand',
    'berger australien',
    'golden retriever',
    'labrador',
    'bouledogue francais',
    'chihuahua',
    'husky',
    'border collie',
    'jack russell',
    'cane corso',
    'beagle',
    'teckel',
    'yorkshire',
    'cavalier king charles',
    'malinois',
    'shiba inu',
    'rottweiler',
    'chow chow',
    'carlin',
    'dalmatien',
    'caniche',
    // EN variants (PANO-88): SOLO univocal (care / training / community).
    'puppy',
    'doggo',
    'pupper',
    'dogtok',
    'puppuccino',
    'kennel',
    'dog park',
    'crate training',
    'dog groomer',
    // Breeds (univocal EN spellings)
    'poodle',
    'dachshund',
    'german shepherd',
    'french bulldog',
    'pug',
  ],
  anchored: [
    'chien', // « temps de chien », « vie de chien »
    'chiens',
    'laisse', // verb laisser
    'spa', // animal shelter vs jacuzzi
    'niche', // market niche
    'maitre', // teacher / master
    'gamelle', // generic / fall
    'croquettes', // shared with cats
    'veterinaire', // shared with cats
    'toutou',
    'boxer', // boxing / boxer vs boxer breed
    'berger', // occupation vs shepherd breed
    'setter', // generic vs setter breed
    // EN variants (PANO-88): ANCHORED.
    'barking', // « barking up the wrong tree » / « barking mad » (EN)
    'leash', // « on a short leash » (figurative, EN)
    'fetch', // DATA fetch (tech) / « make fetch happen » (EN)
    'frenchie', // nickname for a FRENCH PERSON vs french bulldog (EN)
    'breeder', // generic breeder (EN)
    'zoomies', // shared cats / rabbits (EN)
    'paw', // shared cats (EN)
  ],
  selfDeclared: ['proprietaire de chien', 'maitre chien'],
};
