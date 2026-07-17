// Lexique d'intérêt `chiens` (D2, PANO-77 lot 2 · enrichi entités) — chiens.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du chien FR : soin, éducation, RACES répandues. À l'aveugle ; races = entités
// publiques génériques enrichies par recherche (top races France).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « chiot », « aboiement », « dressage canin », « toilettage chien » ; races
//     (« berger australien », « golden retriever », « labrador », « husky », « beagle », « shiba inu »).
//   · ANCRÉ — 50/50 : « chien » (idiomes), « laisse » (verbe), « spa » (jacuzzi), « niche » (marché),
//     « maitre », « croquettes », « veterinaire », « boxer » (boxe), « berger » (métier) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Usage EN réel vérifié par recherche (DogTok / vocabulaire propriétaire).
//   · SOLO — « puppy », « doggo », « pupper », « dogtok », « puppuccino », « kennel », « dog park »,
//     « crate training », « dog groomer » ; races EN (« poodle », « dachshund », « german shepherd »,
//     « french bulldog », « pug »).
//   · ANCRÉ — « barking » (« barking up the wrong tree », « barking mad »), « leash » (« on a short
//     leash », figuré), « fetch » (fetch de DONNÉES — massif en tech), « frenchie » (surnom d'un
//     FRANÇAIS avant d'être un bouledogue), « breeder », « zoomies » / « paw » (partagés chats).
//   · EXCLU — « good boy » (locution courante hors chien) → ÉCARTÉ.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. « veterinaire » / « croquettes » ANCRÉS (partagés avec `chats`) : compagnon d'espèce requis.

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
    // Soin / éducation
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
    // Races (univoques)
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
    // Variantes EN (PANO-88) : SOLO univoques (soin / éducation / communauté).
    'puppy',
    'doggo',
    'pupper',
    'dogtok',
    'puppuccino',
    'kennel',
    'dog park',
    'crate training',
    'dog groomer',
    // Races (graphies EN univoques)
    'poodle',
    'dachshund',
    'german shepherd',
    'french bulldog',
    'pug',
  ],
  anchored: [
    'chien', // « temps de chien », « vie de chien »
    'chiens',
    'laisse', // verbe laisser
    'spa', // refuge animalier vs jacuzzi
    'niche', // niche de marché
    'maitre', // enseignant / maître
    'gamelle', // générique / chute
    'croquettes', // partagé avec chats
    'veterinaire', // partagé avec chats
    'toutou',
    'boxer', // boxe / boxeur vs race boxer
    'berger', // métier vs race berger
    'setter', // générique vs race setter
    // Variantes EN (PANO-88) : ANCRÉS.
    'barking', // « barking up the wrong tree » / « barking mad » (EN)
    'leash', // « on a short leash » (figuré, EN)
    'fetch', // fetch de DONNÉES (tech) / « make fetch happen » (EN)
    'frenchie', // surnom d'un FRANÇAIS vs bouledogue français (EN)
    'breeder', // éleveur générique (EN)
    'zoomies', // partagé chats / lapins (EN)
    'paw', // partagé chats (EN)
  ],
  selfDeclared: ['proprietaire de chien', 'maitre chien'],
};
