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
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Le vélo ne se sépare du `running` que par son MATÉRIEL : les mots d'effort sont communs aux deux.
//   · SOLO — « groupset », « bottom bracket », « bibshorts », « chamois cream », « dropper post »,
//     « singletrack », « tubeless », « gravel bike », « road bike », « bike fit », « zwift ».
//   · ANCRÉ — « strava » (l'appli est AUTANT celle des coureurs — `running` la porte en solo),
//     « bonk » (la fringale, mais aussi un argot sexuel britannique et le mème « bonk »), « hardtail »
//     (partagé avec les choppers de `motos`), « kom », « ftp » (= le PROTOCOLE de transfert de
//     fichiers, collision sévère hors sport), « saddle » : compagnon requis.
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
    // Variantes EN (PANO-88) : SOLO univoques — le matériel, seul discriminant face au `running`.
    'groupset',
    'bottom bracket',
    'bibshorts',
    'chamois cream',
    'dropper post',
    'singletrack',
    'tubeless',
    'gravel bike',
    'road bike',
    'bike fit',
    'drop bars',
    'zwift',
    'granfondo',
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
    // Variantes EN (PANO-88) : ANCRÉS.
    'strava', // partagé running (qui la porte en solo) (EN)
    'bonk', // fringale vs argot britannique / mème (EN)
    'hardtail', // VTT semi-rigide vs chopper (motos) (EN)
    'kom', // sigle court (EN)
    'ftp', // = protocole de transfert de fichiers (EN)
    'saddle', // selle vs « saddled with » (EN)
  ],
  selfDeclared: ['cycliste', 'passionne de velo'],
};
