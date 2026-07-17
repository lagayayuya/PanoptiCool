// Lexique d'intérêt `cyclisme` (D2, PANO-78 lot 3) — cyclisme (route, VTT, gravel).
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du vélo FR : disciplines, jargon course/mécanique, MARQUES. Entités = signal
// public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « cyclisme », « vtt », « velo de route », « peloton », « derailleur », « tour de france »,
//     « braquet », « wattmetre » ; marques (« shimano », « btwin », « lapierre »).
//   · ANCRÉ — « velo », « col » (montagne / cou / colle), « cassette » (audio), « cintre » (portemanteau),
//     « watts » (électrique), « gravel » (gravier), « trek » (marque / Star Trek), « decathlon » (multi-sport),
//     « pedale » (partagé) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. « denivele » partagé avec `running`/`randonnee` (assumé).

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
  ],
  anchored: [
    'velo', // vélo (assez spécifique mais gardé ancré)
    'col', // montagne / cou / colle
    'cassette', // cassette audio vs cassette (vélo)
    'cintre', // portemanteau vs cintre (guidon)
    'watts', // électrique
    'gravel', // gravier
    'trek', // marque / Star Trek / trekking
    'decathlon', // enseigne multi-sport
    'pedale', // partagé (voitures/guitare)
    'denivele', // partagé running/randonnee
    'cadence', // rythme générique
  ],
  selfDeclared: ['cycliste', 'passionne de velo'],
};
