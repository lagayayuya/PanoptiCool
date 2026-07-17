// Lexique d'intérêt `tech` (D2, PANO-77 lot 2 · enrichi entités) — tech grand public / hardware.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la tech FR : appareils, composants, MARQUES, ABRÉVIATIONS/jargon. À
// l'aveugle ; marques et sigles = signal public générique enrichi par recherche (constructeurs,
// glossaire hardware).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « smartphone », « processeur », « carte graphique », « overclocking »,
//     sigles hardware (« cpu », « gpu », « ssd », « rtx », « pcie »), marques (« nvidia », « intel »,
//     « xiaomi », « macbook », « iphone »).
//   · ANCRÉ — 50/50 : « tech » (technique), « apple » (fruit), « ram » (bélier / Dodge Ram), « puce »
//     (insecte), « tablette » (chocolat), « souris » (animal), « ecran », « cloud », « boot » : co-occurrence.
//   · EXCLU — « pomme » (jamais listé, trop de FP même ancré).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de `ia` (thème plus étroit).

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
    // Vocabulaire générique
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
    // Sigles hardware
    'cpu',
    'gpu',
    'ssd',
    'rtx',
    'pcie',
    'nvme',
    'ddr5',
    // Marques
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
    // Variantes EN (PANO-88) : SOLO univoques.
    'unboxing',
    'teardown',
  ],
  anchored: [
    'tech', // abréviation « technique »
    'apple', // fruit
    'ram', // bélier / Dodge Ram
    'puce', // insecte / puce électronique
    'tablette', // chocolat / tablette
    'souris', // animal / souris d'ordinateur
    'ecran', // écran générique
    'cloud', // nuage
    'boot', // démarrage / botte anglaise
    'gadget', // gadget générique
    'amd', // marque vs sigle divers
    'core', // cœur / Intel Core
    'geek',
    'setup', // config vs mise en place générique (EN)
    'flagship', // haut de gamme vs « vaisseau amiral » (EN)
  ],
  selfDeclared: ['geek', 'passionne de tech'],
};
