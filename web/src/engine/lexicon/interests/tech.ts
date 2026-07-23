// Interest lexicon `tech` (D2, PANO-77 batch 2 · entities enriched) — consumer tech / hardware.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR tech: devices, components, BRANDS, ABBREVIATIONS/jargon. Blind;
// brands and acronyms = generic public signal enriched by research (manufacturers,
// hardware glossary).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « smartphone », « processeur », « carte graphique », « overclocking »,
//     hardware acronyms (« cpu », « gpu », « ssd », « rtx », « pcie »), brands (« nvidia », « intel »,
//     « xiaomi », « macbook », « iphone »).
//   · ANCHORED — 50/50: « tech » (technique), « apple » (fruit), « ram » (ram / Dodge Ram), « puce »
//     (flea), « tablette » (chocolate), « souris » (mouse animal), « ecran », « cloud », « boot »: co-occurrence.
//   · EXCLUDED — « pomme » (never listed, too many FP even anchored).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from `ia` (narrower theme).

import type { InterestLexicon } from '../types';

export const TECH_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'tech',
  themeLabel: 'theme.tech.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.consumer-tech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Generic vocabulary
    'smartphone',
    'ordinateur portable',
    'processeur',
    'carte graphique',
    'disque dur',
    'objet connecte',
    'domotique',
    'clavier mecanique',
    'ecouteurs sans fil',
    'high tech',
    'benchmark',
    'overclocking',
    'watercooling',
    'carte mere',
    'montre connectee',
    'config pc',
    // Hardware acronyms
    'cpu',
    'gpu',
    'ssd',
    'rtx',
    'pcie',
    'nvme',
    'ddr5',
    // Brands
    'nvidia',
    'intel',
    'xiaomi',
    'asus',
    'logitech',
    'razer',
    'iphone',
    'macbook',
    'samsung galaxy',
    'raspberry pi',
    'steam deck',
    'google pixel',
    'oneplus',
    'ecran oled',
    'usb c',
    'wifi 6',
    'imprimante 3d',
    'casque vr',
    'realite virtuelle',
    'drone dji',
    'firmware',
    'nas synology',
    // EN variants (PANO-88): univocal SOLO.
    'unboxing',
    'teardown',
  ],
  anchored: [
    'tech', // abbreviation of « technique »
    'apple', // fruit
    'ram', // ram (animal) / Dodge Ram
    'puce', // flea / electronic chip
    'tablette', // chocolate / tablet
    'souris', // animal / computer mouse
    'ecran', // generic screen
    'cloud', // cloud
    'boot', // boot-up / English boot
    'gadget', // generic gadget
    'amd', // brand vs miscellaneous acronym
    'core', // core / Intel Core
    'geek',
    'setup', // config vs generic setup (EN)
    'flagship', // high-end vs « vaisseau amiral » (EN)
  ],
  selfDeclared: ['geek', 'passionne de tech'],
};
