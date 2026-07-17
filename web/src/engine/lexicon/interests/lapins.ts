// Lexique d'intérêt `lapins` (D2, PANO-89 lot 4) — lapins de compagnie.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du lapin de compagnie FR : races, soin, habitat. Entités = signal public
// générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « lapin nain », « clapier », « cuniculiculture », « lapereau », « lapin de compagnie ».
//   · ANCRÉ — « lapin » (« poser un lapin »), « belier » (zodiaque / bélier), « angora » (laine /
//     chat), « foin » (« faire du foin »), « terrier » (chien terrier), « nac » (sigle) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Usage EN réel vérifié par recherche (House Rabbit Society / BunnyTok).
//   · SOLO — « timothy hay », « rabbit hutch », « house rabbit », « bunnytok », « holland lop »,
//     « mini lop », « flemish giant » : univoques.
//   · ANCRÉ — « rabbit » (« down the RABBIT HOLE » — idiome massif), « bunny » (Easter/Playboy/snow/gym
//     bunny), « binky » (= TÉTINE en EN courant, avant le saut de joie du lapin), « hay » (« hit the
//     hay », « make hay »), « hutch » (buffet / Starsky & Hutch), « zoomies » (partagé chats/chiens).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. « angora »/« belier » partagés (chats / autres) : assumé (co-occurrence par thème).

import type { InterestLexicon } from '../types';

export const LAPINS_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'lapins',
  themeLabel: 'theme.lapins.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.pet-supplies', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'lapin nain',
    'clapier',
    'cuniculiculture',
    'lapereau',
    'lapin de compagnie',
    'foin pour lapin',
    'lapin belier',
    'geant des flandres',
    'fauve de bourgogne',
    'enclos a lapin',
    'granules lapin',
    // Variantes EN (PANO-88) : SOLO univoques (habitat / soin / races).
    'timothy hay',
    'rabbit hutch',
    'house rabbit',
    'bunnytok',
    'holland lop',
    'mini lop',
    'flemish giant',
  ],
  anchored: [
    'lapin', // « poser un lapin » / « chaud lapin »
    'belier', // zodiaque / bélier (animal)
    'angora', // laine / chat angora
    'foin', // « faire du foin »
    'terrier', // chien terrier / terrier (trou)
    'nac', // sigle (nouveaux animaux de compagnie)
    'garenne', // lieu-dit / lapin de garenne
    // Variantes EN (PANO-88) : ANCRÉS.
    'rabbit', // « down the rabbit hole » — idiome massif (EN)
    'bunny', // Easter / Playboy / snow / gym bunny (EN)
    'binky', // = tétine en EN courant vs saut de joie du lapin
    'hay', // « hit the hay » / « make hay » (EN)
    'hutch', // buffet / Starsky & Hutch (EN)
    'zoomies', // partagé chats / chiens (EN)
  ],
  selfDeclared: ['proprietaire de lapin'],
};
