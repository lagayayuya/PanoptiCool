// Lexique d'intérêt `diy` (D2, PANO-89 lot 4) — DIY / bricolage.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du bricolage FR : outils, matériaux, enseignes, rénovation. Entités = signal
// public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « perceuse », « visseuse », « placo », « renovation », « leroy merlin », « castorama »,
//     « ponceuse », « scie sauteuse », « home staging ».
//   · ANCRÉ — « bricolage » (« bricolage » = système D), « vis », « cheville » (anatomie), « niveau »,
//     « marteau », « clou », « scie », « chantier » : co-occurrence.
//   · EXCLU — « outil » nu (trop générique).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const DIY_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'diy',
  themeLabel: 'theme.diy.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.diy-tools', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'bricolage',
    'perceuse',
    'visseuse',
    'placo',
    'placoplatre',
    'renovation',
    'leroy merlin',
    'brico depot',
    'castorama',
    'ponceuse',
    'scie sauteuse',
    'tuto diy',
    'home staging',
    'palette bois',
    'tournevis electrique',
    'do it yourself',
    'perceuse visseuse',
  ],
  anchored: [
    'bricolage', // système D / « c'est du bricolage »
    'vis', // vis générique
    'cheville', // anatomie / cheville (fixation)
    'niveau', // niveau générique
    'marteau', // marteau générique
    'clou', // clou générique
    'scie', // « scie » / « si »
    'chantier', // chantier générique
    'bosch', // électroménager / Hieronymus Bosch
  ],
  selfDeclared: ['bricoleur', 'bricoleuse'],
};
