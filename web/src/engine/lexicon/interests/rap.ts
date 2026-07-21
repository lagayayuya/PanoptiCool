// Lexique d'intérêt `rap` (D2, PANO-77 lot 2 · enrichi entités) — rap / hip-hop.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du rap FR : genre, jargon studio/scène, ARTISTES emblématiques. À l'aveugle ;
// artistes et jargon = signal public générique enrichi par recherche (scène FR, argot).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — genre/culture + artistes univoques : « rap », « freestyle », « punchline », « mixtape »,
//     « egotrip », « ninho », « damso », « nekfeu », « gazo », « tiakola », « soolking ».
//   · ANCRÉ — 50/50 : « flow » (rivière), « prod », « feat », « trap » (piège), « drill » (perceuse),
//     « sample », « jul » (prénom/mois), « sch », « zola » (Émile Zola), « leto », « dinos » : co-occurrence.
//   · EXCLU — « clash » (= conflit, frôle le sens agressif) écarté par prudence.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Couche EN-only du rap anglophone, par-dessus la scène FR déjà couverte.
//   · SOLO — « cypher », « diss track », « type beat », « battle rap », « crate digging », « emcee »,
//     « ghostwriter », « uk drill », « drill music », « trap beat », « g funk », « sixteen bars »,
//     « ad libs », « double time flow », « lyricism », « hiphopheads ».
//   · ANCRÉ — « bars » (les BARS où l'on boit, les barres chocolatées, les barres de réseau : mot
//     très fréquent, gros pourvoyeur de FP), « mc » (sigle), « hook » (le crochet de porte, le crochet
//     de BOXE), « verse » (le verset biblique), « label » (l'étiquette) : compagnon requis.
//   · NOTE — « drill » et « trap » restent ancrés (déjà là) : ce sont la PERCEUSE et le PIÈGE. Seules
//     leurs formes composées (« uk drill », « drill music », « trap beat ») entrent en solo.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Marqueurs = VOCABULAIRE de genre/culture, jamais CONTENU de paroles (violence,
// politique) — la frontière D1 est tenue par le lexique, pas par le sujet des morceaux.

import type { InterestLexicon } from '../types';

export const RAP_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'rap',
  themeLabel: 'theme.rap.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.music-streaming', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Genre / culture
    'rap',
    'rappeur',
    'rappeuse',
    'hip hop',
    'freestyle',
    'punchline',
    'beatmaker',
    'clip rap',
    'rap francais',
    'mixtape',
    'egotrip',
    'boom bap',
    'rap game',
    'instru rap',
    // Artistes (univoques)
    'ninho',
    'werenoi',
    'tiakola',
    'gazo',
    'damso',
    'nekfeu',
    'orelsan',
    'booba',
    'kaaris',
    'niska',
    'laylow',
    'soolking',
    'sofiane',
    'alonzo',
    'sdm',
    'koba lad',
    'freeze corleone',
    'lomepal',
    'josman',
    // Jargon / industrie
    'adlib',
    'sacem',
    'disque d or',
    // Variantes EN (PANO-88) : SOLO univoques (jargon scène / studio anglophone).
    'cypher',
    'diss track',
    'type beat',
    'battle rap',
    'crate digging',
    'emcee',
    'ghostwriter',
    'uk drill',
    'drill music',
    'trap beat',
    'g funk',
    'sixteen bars',
    'ad libs',
    'double time flow',
    'lyricism',
    'hiphopheads',
  ],
  anchored: [
    'rime', // rime générique
    'flow', // rivière / anglais générique
    'prod', // production générique
    'feat', // featuring / anglais
    'trap', // piège
    'drill', // perceuse
    'sample', // échantillon
    'couplet', // couplet générique
    'jul', // prénom / juillet
    'sch', // sigle ambigu
    'zola', // Émile Zola vs le rappeur
    'leto', // Jared Leto / prénom
    'dinos', // dinosaures vs le rappeur
    'maes', // patronyme courant vs le rappeur
    'hamza', // prénom courant vs le rappeur
    'plug', // prise (anglais) vs plug (rap)
    // Variantes EN (PANO-88) : ANCRÉS.
    'bars', // les bars où l'on boit / barres chocolatées / barres de réseau (EN)
    'mc', // sigle — aussi « maître de cérémonie » générique (EN)
    'hook', // crochet de porte / crochet de boxe (EN)
    'verse', // le verset biblique (EN)
    'label', // l'étiquette / étiqueter un fichier (EN)
  ],
  selfDeclared: ['rappeur', 'rappeuse'],
};
