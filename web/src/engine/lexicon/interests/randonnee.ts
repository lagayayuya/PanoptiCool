// Interest lexicon `randonnee` (D2, PANO-78 batch 3) — hiking / trekking / outdoor.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR hiking: trails, gear, outdoor BRANDS. Entities = generic public
// signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « randonnee », « bivouac », « sentier », « gr20 », « alpinisme », « batons de marche »,
//     « chaussures de rando »; brands (« quechua », « salomon », « scarpa »).
//   · ANCHORED — « rando », « trek » (brand / Star Trek), « col », « sommet » (G20 / peak),
//     « refuge » (asylum), « topo », « millet » (grain), « decathlon », « boussole »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Anglophone hiking speaks by CULTURE (thru-hiking) as much as by gear.
//   · SOLO — « thru hike », « thruhiker », « trail angel », « trail magic », « hiker trash »,
//     « cowboy camping », « base weight », « ultralight », « leave no trace », « trekking poles »,
//     « switchback », « trailhead », « backcountry », « fourteener », « alpine start »,
//     « bear canister », « gaiters », « resupply », « day hike », « backpacking », « hiketok ».
//   · ANCHORED — « summit » (the political or business SUMMIT, dominant sense), « elevation » (moral
//     elevation, the architect's plan), « scramble » (SCRAMBLED EGGS), « pack » (a pack, a wolf pack),
//     « peak » (« peak hours »), « blaze » (fire; to smoke), « shelter » (an animal shelter),
//     « camp » (summer camp; the game camping), « zero day » (the zero-day EXPLOIT),
//     « range » (the range; the stove), « cairn » (identical French word): companion required.
//   · DISCARDED — « pace »: belongs to `running`, not hiking.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from `running`/`cyclisme`; « bivouac »/« sac a dos » shared with `voyage`.

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
    // EN variants (PANO-88): SOLO univocal (thru-hiking culture / gear).
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
    'rando', // abbreviation (fairly specific but kept anchored)
    'trek', // brand / Star Trek / trekking
    'col', // mountain pass / neck / glue
    'sommet', // peak / summit (G20)
    'refuge', // asylum / shelter
    'topo', // generic explanation
    'millet', // grain vs brand
    'decathlon', // multi-sport store
    'boussole', // figurative
    'denivele', // shared cyclisme/running
    // EN variants (PANO-88): ANCHORED.
    'summit', // the political or business summit, dominant sense (EN)
    'elevation', // moral elevation / architect's plan (EN)
    'scramble', // = scrambled eggs / to hurry (EN)
    'pack', // a pack / a wolf pack (EN)
    'peak', // « peak hours » / « peak performance » (EN)
    'blaze', // fire / to smoke (EN)
    'shelter', // animal shelter / homeless (EN)
    'camp', // summer camp / the game camping (EN)
    'zero day', // = the zero-day exploit (EN)
    'range', // the range / the stove (EN)
    'cairn', // identical French word (EN)
  ],
  selfDeclared: ['randonneur', 'randonneuse', 'alpiniste'],
};
