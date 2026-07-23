// Interest lexicon `chats` (D2, PANO-77 batch 2 · entities enriched) — cats.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR cats: care, widespread BREEDS, behavior. Blind; breeds =
// generic public entities enriched by research (top France breeds).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « chaton », « miaou », « litiere », « griffoir », « ronronnement »; breeds
//     (« maine coon », « sacre de birmanie », « bengal », « sphynx », « ragdoll », « scottish fold »).
//   · ANCHORED — the MAJOR 50/50: « chat » (= online chat) → co-occurrence; also « matou »,
//     « griffe », « spa », « persan » (language), « europeen », « savannah » (first name): companion required.
//   · EXCLUDED — « minou » (ambiguous affectionate / vulgar) → DISCARDED out of caution.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Real EN usage verified by research (CatTok / owner vocabulary).
//   · SOLO — « meow », « kitten », « catnip », « litter box », « scratching post », « cat tree »,
//     « purring », « catio », « cattok »: univocal.
//   · ANCHORED — « kitty » (Hello Kitty / kitty / vulgar), « feline » (« feline grace »), « tabby »
//     (first name Tabitha), « calico » (calico FABRIC), « zoomies » (shared dogs/rabbits), « paw »
//     (shared dogs): companion required.
//   · ASSUMED TRAP — « kitten » matches « kitten heels » (shoe, → `mode`): D2×D2 overlap
//     tolerated, the ranking drowns an isolated hit.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. Bare « chat » is NEVER solo (chat messaging); « chat »+`s?` does not match « chatte ».

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
    // Care / behavior
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
    // Breeds (univocal)
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
    // EN variants (PANO-88): SOLO univocal (care / behavior / community).
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
    'chat', // = online chat (MAJOR 50/50)
    'chats',
    'matou', // generic affectionate
    'griffe', // signature / brand label
    'spa', // animal shelter vs jacuzzi
    'croquettes', // shared with dogs
    'veterinaire', // shared with dogs
    'persan', // language / people vs persian breed
    'europeen', // european vs european cat
    'savannah', // first name / city vs savannah breed
    'abyssin', // people vs abyssinian breed
    'angora', // wool vs angora cat
    // EN variants (PANO-88): ANCHORED — the short EN word is massively polysemous.
    'kitty', // Hello Kitty / kitty / vulgar (EN)
    'feline', // « feline grace » (figurative adjective, EN)
    'tabby', // first name (Tabitha) vs tabby coat (EN)
    'calico', // calico FABRIC vs calico coat (EN)
    'zoomies', // shared dogs / rabbits (EN)
    'paw', // shared dogs (EN)
  ],
  selfDeclared: ['proprietaire de chat', 'cat mom'],
};
