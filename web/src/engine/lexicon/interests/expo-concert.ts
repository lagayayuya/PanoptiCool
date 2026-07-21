// Lexique d'intérêt `expo_concert` (D2, PANO-78 lot 3) — sorties culturelles : concerts & expos.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant des sorties culturelles FR : concerts/festivals, expositions, jargon, lieux
// et festivals nommés. Entités = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « concert », « vernissage », « setlist », « backstage », « moshpit », festivals
//     (« hellfest », « coachella », « rock en seine », « vieilles charrues »), « billetterie ».
//   · ANCRÉ — « live » (streaming), « scene » (partagé cinéma), « rappel » (encore / escalade),
//     « fosse » (trou), « expo » (partagé photo), « galerie » (marchande / tunnel), « festival »,
//     « artiste » (générique) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Deux registres DISJOINTS sous un même thème — le concert et la galerie ne partagent presque aucun
// mot. Les deux sont couverts ; leurs pièges ne sont pas les mêmes.
//   · SOLO (concert) — « headliner », « soundcheck », « crowd surfing », « general admission »,
//     « guest list », « merch table », « front of house », « circle pit », « support act »,
//     « meet and greet », « tour dates », « standing room ».
//   · SOLO (expo) — « private view », « gallerist », « solo show », « group show », « artist statement »,
//     « wall text », « permanent collection », « art fair », « open studios », « white cube », « docent ».
//   · ANCRÉ — « gig » (= l'ÉCONOMIE DES PETITS BOULOTS aujourd'hui, et le gigaoctet), « lineup »
//     (alignement policier), « venue » (lieu de mariage), « installation » (installation LOGICIELLE),
//     « curated » (devenu argot marketing), « floor » : compagnon requis.
//   · ÉCARTÉ — « encore », « stage », « retrospective » : ce sont des MOTS FRANÇAIS COURANTS
//     (« encore » = de nouveau, « stage » = période en entreprise) ou des homographes exacts du FR.
//     Les faire entrer en solo ferait tirer le thème sur du texte français quelconque.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const EXPO_CONCERT_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'expo_concert',
  themeLabel: 'theme.expo-concert.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.event-tickets', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'concert',
    'vernissage',
    'setlist',
    'backstage',
    'moshpit',
    'billetterie',
    'tete d affiche',
    'premiere partie',
    'salle de concert',
    'hellfest',
    'coachella',
    'rock en seine',
    'vieilles charrues',
    'solidays',
    'biennale',
    'galerie d art',
    'open air',
    'tournee',
    // Variantes EN (PANO-88) : SOLO univoques — registre CONCERT.
    'headliner',
    'soundcheck',
    'crowd surfing',
    'general admission',
    'guest list',
    'merch table',
    'front of house',
    'circle pit',
    'support act',
    'meet and greet',
    'tour dates',
    'standing room',
    // Variantes EN (PANO-88) : SOLO univoques — registre EXPO / galerie.
    'private view',
    'gallerist',
    'solo show',
    'group show',
    'artist statement',
    'wall text',
    'permanent collection',
    'art fair',
    'open studios',
    'white cube',
    'docent',
  ],
  anchored: [
    'live', // en direct / streaming
    'scene', // partagé cinéma
    'rappel', // encore / escalade / rappel (mémoire)
    'fosse', // trou / fosse d'orchestre
    'pit', // fosse (anglais)
    'expo', // partagé photographie
    'galerie', // galerie marchande / tunnel
    'festival', // festival générique
    'artiste', // générique
    'oeuvre', // travail générique
    // Variantes EN (PANO-88) : ANCRÉS.
    'gig', // = économie des petits boulots / gigaoctet (EN)
    'lineup', // alignement policier / gamme de produits (EN)
    'venue', // lieu de mariage / de conférence (EN)
    'installation', // installation logicielle (EN)
    'curated', // devenu argot marketing (EN)
    'floor', // étage vs dancefloor (EN)
  ],
  selfDeclared: ['festivalier', 'amateur d art'],
};
