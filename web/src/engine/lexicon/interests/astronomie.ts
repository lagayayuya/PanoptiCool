// Lexique d'intérêt `astronomie` (D2, PANO-89 lot 4) — astronomie / espace.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de l'astronomie FR : objets célestes, missions/agences, matériel. Entités =
// signal public générique enrichi par recherche. Usage SOBRE (édition/edtech).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « astronomie », « nasa », « spacex », « james webb », « exoplanete », « trou noir »,
//     « nebuleuse », « supernova », « voie lactee », « big bang », « matiere noire », « astronaute ».
//   · ANCRÉ — « espace » (« espace vert » / « espace client »), « etoile » (célébrité / Michelin),
//     « mars » (mois / barre Mars), « galaxie » (Samsung Galaxy), « lune », « soleil », « planete » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
//   · SOLO — « astronomy », « exoplanet », « black hole », « nebula », « dark matter »,
//     « astronaut », « space telescope », « solar system », « light year », « space station »,
//     « stargazing », « comet », « telescope » : univoques.
//   · ANCRÉ — « space » (« give me space », « storage space », « espace client »), « star » (=
//     CÉLÉBRITÉ — massif sur TikTok), « moon » (« over the moon » ; et « TO THE MOON » de la
//     communauté `crypto`), « galaxy » (Samsung Galaxy), « milky way » (la BARRE CHOCOLATÉE — même
//     raison que « mars » en FR), « planet », « orbit », « constellation » : compagnon requis.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const ASTRONOMIE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'astronomie',
  themeLabel: 'theme.astronomie.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.edtech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'astronomie',
    'nasa',
    'spacex',
    'james webb',
    'exoplanete',
    'trou noir',
    'nebuleuse',
    'supernova',
    'voie lactee',
    'big bang',
    'matiere noire',
    'astronaute',
    'telescope spatial',
    'systeme solaire',
    'annee lumiere',
    'station spatiale',
    'hubble',
    'comete',
    // Variantes EN (PANO-88) : SOLO univoques (objets célestes / matériel).
    'astronomy',
    'exoplanet',
    'black hole',
    'nebula',
    'dark matter',
    'astronaut',
    'space telescope',
    'solar system',
    'light year',
    'space station',
    'stargazing',
    'comet',
    'telescope',
  ],
  anchored: [
    'espace', // « espace vert » / « espace client »
    'etoile', // célébrité / étoile Michelin
    'mars', // mois de mars / barre Mars
    'galaxie', // Samsung Galaxy
    'lune', // « être dans la lune »
    'soleil', // soleil générique
    'planete', // planète générique
    'cosmos', // cosmos générique
    'constellation', // constellation (au figuré)
    'orbite', // orbite générique
    // Variantes EN (PANO-88) : ANCRÉS.
    'space', // « give me space » / « storage space » (EN)
    'star', // = célébrité — massif sur TikTok (EN)
    'moon', // « over the moon » / « to the moon » (crypto) (EN)
    'galaxy', // Samsung Galaxy (EN)
    'milky way', // la barre chocolatée — même raison que « mars » en FR
    'planet', // planète générique (EN)
    'orbit', // orbite générique (EN)
  ],
  selfDeclared: ['astronome amateur'],
};
