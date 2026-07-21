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
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// La rando anglophone parle par CULTURE (thru-hiking) autant que par matériel.
//   · SOLO — « thru hike », « thruhiker », « trail angel », « trail magic », « hiker trash »,
//     « cowboy camping », « base weight », « ultralight », « leave no trace », « trekking poles »,
//     « switchback », « trailhead », « backcountry », « fourteener », « alpine start »,
//     « bear canister », « gaiters », « resupply », « day hike », « backpacking », « hiketok ».
//   · ANCRÉ — « summit » (le SOMMET politique ou d'affaires, sens dominant), « elevation » (l'élévation
//     morale, le plan d'architecte), « scramble » (les ŒUFS BROUILLÉS), « pack » (un paquet, une meute),
//     « peak » (« peak hours »), « blaze » (le feu ; fumer), « shelter » (un refuge pour animaux),
//     « camp » (la colonie de vacances ; le camping du jeu), « zero day » (la FAILLE zero-day),
//     « range » (la gamme ; la cuisinière), « cairn » (mot français à l'identique) : compagnon requis.
//   · ÉCARTÉ — « pace » : appartient au `running`, pas à la rando.
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
    // Variantes EN (PANO-88) : SOLO univoques (culture thru-hiking / matériel).
    'thru hike',
    'thruhiker',
    'trail angel',
    'trail magic',
    'hiker trash',
    'cowboy camping',
    'base weight',
    'ultralight',
    'leave no trace',
    'trekking poles',
    'switchback',
    'trailhead',
    'backcountry',
    'fourteener',
    'alpine start',
    'bear canister',
    'gaiters',
    'resupply',
    'day hike',
    'backpacking',
    'hiketok',
    'hikingtok',
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
    // Variantes EN (PANO-88) : ANCRÉS.
    'summit', // le sommet politique ou d'affaires, sens dominant (EN)
    'elevation', // élévation morale / plan d'architecte (EN)
    'scramble', // = les œufs brouillés / se dépêcher (EN)
    'pack', // un paquet / une meute (EN)
    'peak', // « peak hours » / « peak performance » (EN)
    'blaze', // le feu / fumer (EN)
    'shelter', // refuge pour animaux / sans-abri (EN)
    'camp', // colonie de vacances / le camping du jeu (EN)
    'zero day', // = la faille zero-day (EN)
    'range', // la gamme / la cuisinière (EN)
    'cairn', // mot français à l'identique (EN)
  ],
  selfDeclared: ['randonneur', 'randonneuse', 'alpiniste'],
};
