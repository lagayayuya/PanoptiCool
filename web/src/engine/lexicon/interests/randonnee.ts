// Lexique d'intérêt `randonnee` (D2, PANO-78 lot 3) — randonnée / trek / outdoor.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la rando FR : sentiers, matériel, MARQUES outdoor. Entités = signal public
// générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « randonnee », « bivouac », « sentier », « gr20 », « alpinisme », « batons de marche »,
//     « chaussures de rando » ; marques (« quechua », « salomon », « scarpa »).
//   · ANCRÉ — « rando », « trek » (marque / Star Trek), « col », « sommet » (G20 / apogée),
//     « refuge » (asile), « topo », « millet » (graine), « decathlon », « boussole » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de `running`/`cyclisme` ; « bivouac »/« sac a dos » partagés avec `voyage`.

import type { InterestLexicon } from '../types';

export const RANDONNEE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'randonnee',
  themeLabel: 'theme.randonnee.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.outdoor-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'randonnee',
    'bivouac',
    'sentier',
    'gr20',
    'gr10',
    'alpinisme',
    'batons de marche',
    'chaussures de rando',
    'sac de couchage',
    'marche en montagne',
    'carte ign',
    'refuge de montagne',
    'quechua',
    'salomon',
    'scarpa',
    'la sportiva',
    'sentier balise',
  ],
  anchored: [
    'rando', // abréviation (assez spécifique mais gardée ancrée)
    'trek', // marque / Star Trek / trekking
    'col', // montagne / cou / colle
    'sommet', // apogée / sommet (G20)
    'refuge', // asile / abri
    'topo', // explication générique
    'millet', // graine vs marque
    'decathlon', // enseigne multi-sport
    'boussole', // au figuré
    'denivele', // partagé cyclisme/running
  ],
  selfDeclared: ['randonneur', 'randonneuse', 'alpiniste'],
};
