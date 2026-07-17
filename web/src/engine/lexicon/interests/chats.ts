// Lexique d'intérêt `chats` (D2, PANO-77 lot 2 · enrichi entités) — chats.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du chat FR : soin, RACES répandues, comportement. À l'aveugle ; races =
// entités publiques génériques enrichies par recherche (top races France).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « chaton », « miaou », « litiere », « griffoir », « ronronnement » ; races
//     (« maine coon », « sacre de birmanie », « bengal », « sphynx », « ragdoll », « scottish fold »).
//   · ANCRÉ — le 50/50 MAJEUR : « chat » (= messagerie en ligne) → co-occurrence ; aussi « matou »,
//     « griffe », « spa », « persan » (langue), « europeen », « savannah » (prénom) : compagnon requis.
//   · EXCLU — « minou » (affectif ambigu / vulgaire) → ÉCARTÉ par prudence.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Usage EN réel vérifié par recherche (CatTok / vocabulaire propriétaire).
//   · SOLO — « meow », « kitten », « catnip », « litter box », « scratching post », « cat tree »,
//     « purring », « catio », « cattok » : univoques.
//   · ANCRÉ — « kitty » (Hello Kitty / cagnotte / vulgaire), « feline » (« feline grace »), « tabby »
//     (prénom Tabitha), « calico » (TISSU calicot), « zoomies » (partagé chiens/lapins), « paw »
//     (partagé chiens) : compagnon requis.
//   · TRAP ASSUMÉ — « kitten » matche « kitten heels » (chaussure, → `mode`) : chevauchement D2×D2
//     toléré, le classement noie un hit isolé.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. « chat » nu n'est JAMAIS solo (messagerie) ; « chat »+`s?` ne matche pas « chatte ».

import type { InterestLexicon } from '../types';

export const CHATS_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'chats',
  themeLabel: 'theme.chats.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.pet-supplies', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Soin / comportement
    'chaton',
    'miaou',
    'miaulement',
    'litiere',
    'griffoir',
    'ronronnement',
    'arbre a chat',
    'chat de gouttiere',
    'herbe a chat',
    'caisse de transport',
    'chatiere',
    // Races (univoques)
    'maine coon',
    'sacre de birmanie',
    'siamois',
    'bengal',
    'sphynx',
    'chartreux',
    'british shorthair',
    'ragdoll',
    'scottish fold',
    'norvegien',
    'bleu russe',
    'mau egyptien',
    'felin domestique',
    // Variantes EN (PANO-88) : SOLO univoques (soin / comportement / communauté).
    'meow',
    'meowing',
    'kitten',
    'catnip',
    'litter box',
    'scratching post',
    'cat tree',
    'purring',
    'catio',
    'cattok',
  ],
  anchored: [
    'chat', // = messagerie en ligne (50/50 MAJEUR)
    'chats',
    'matou', // affectif générique
    'griffe', // signature / griffe de marque
    'spa', // refuge animalier vs jacuzzi
    'croquettes', // partagé avec chiens
    'veterinaire', // partagé avec chiens
    'persan', // langue / peuple vs race persan
    'europeen', // européen vs chat européen
    'savannah', // prénom / ville vs race savannah
    'abyssin', // peuple vs race abyssin
    'angora', // laine vs chat angora
    // Variantes EN (PANO-88) : ANCRÉS — le court EN est massivement polysémique.
    'kitty', // Hello Kitty / cagnotte / vulgaire (EN)
    'feline', // « feline grace » (adjectif figuré, EN)
    'tabby', // prénom (Tabitha) vs robe tabby (EN)
    'calico', // TISSU calicot vs robe calico (EN)
    'zoomies', // partagé chiens / lapins (EN)
    'paw', // partagé chiens (EN)
  ],
  selfDeclared: ['proprietaire de chat', 'cat mom'],
};
