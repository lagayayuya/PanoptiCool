// Interest lexicon `football` (D2, PANO-76 batch 1, DEEP rewrite) — football (soccer).
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR football: rules, competitions, positions, transfers, supporter jargon.
// Blind from common usage.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « football », « penalty », « mercato », « ligue des champions » (near-univocal).
//   · ANCHORED — the heart of the 50/50: « but » (aim/goal), « match » (matchstick), « foot » (anatomy),
//     « corner » (corner), « cage » (cage/prison), « arbitre », « tacle »: count only with a
//     foot companion. It is the canonical example of co-occurrence (PANO-76).
//   · EXCLUDED — « ballon » (balloon, too common even anchored here with no added value).
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// EN-only layer: what an anglophone types and that no FR marker catches.
//   · SOLO — « offside », « clean sheet », « nutmeg », « own goal », « stoppage time », « false nine »,
//     « tiki taka », « parked the bus », « transfer window », « counter attack », « free kick »,
//     « penalty shootout », « soccer », « xg »; competitions (« champions league », « bundesliga »,
//     « serie a », « fa cup », « mls »).
//   · ANCHORED — « pitch » (the sales pitch, the pitch of a sound: even WEAKER in EN than in
//     FR), « boots » (shoes in general), « kit » (first-aid kit, drum kit — and the `cyclisme`
//     kit), « derby » (the CITY of Derby, roller derby), « fixture » (a light FIXTURE),
//     « header » (the HTTP header), « striker » (a STRIKER/worker on strike), « keeper », « var » (the Var
//     department, a variable), « gaffer » (the CHIEF ELECTRICIAN of a film set): companion required.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. GAMBLING / betting EXCLUDED (PANO-74): no odds or bookmaker marker.

import type { InterestLexicon } from '../types';

export const FOOTBALL_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'football',
  themeLabel: 'theme.football.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.football-merch', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'football',
    'match de foot',
    'ligue des champions',
    'coupe du monde',
    'ligue 1',
    'premier league',
    'liga',
    'penalty',
    'hors jeu',
    'carton rouge',
    'carton jaune',
    'coup franc',
    'gardien de but',
    'milieu de terrain',
    'mercato',
    'match de championnat',
    'attaquant',
    'defenseur',
    "ballon d'or",
    'supporter de foot',
    // Clubs & players (retrofit PANO-90)
    'psg',
    'real madrid',
    'barcelone',
    'olympique de marseille',
    'manchester city',
    'liverpool',
    'bayern munich',
    'mbappe',
    'haaland',
    'vinicius',
    'bellingham',
    'lamine yamal',
    // EN variants (PANO-88): SOLO univocal (rules, tactics, competitions).
    'soccer',
    'offside',
    'clean sheet',
    'nutmeg',
    'own goal',
    'stoppage time',
    'injury time',
    'false nine',
    'tiki taka',
    'parked the bus',
    'transfer window',
    'counter attack',
    'high press',
    'free kick',
    'corner kick',
    'penalty shootout',
    'champions league',
    'bundesliga',
    'serie a',
    'fa cup',
    'xg',
  ],
  anchored: [
    'but', // dans le but de… (aim/purpose)
    'match', // matchstick / « faire un match »
    'foot', // foot (anatomy)
    'corner', // corner (English)
    'cage', // the goal (cage) vs generic cage
    'arbitre', // foot referee vs generic arbitration
    'tacle', // tackle vs metaphor
    'transfert', // player transfer vs generic transfer/wire
    'real', // Real Madrid vs « réel »
    'barca', // FC Barcelona vs generic
    'messi', // player vs surname
    // EN variants (PANO-88): ANCHORED.
    'pitch', // sales pitch / pitch of a sound — even weaker than in FR (EN)
    'boots', // shoes in general / booting a computer (EN)
    'kit', // first-aid kit / drum kit — shared cyclisme (EN)
    'derby', // the city of Derby / roller derby (EN)
    'fixture', // = a light fixture (EN)
    'header', // = HTTP header (EN)
    'striker', // = a worker on strike (EN)
    'keeper', // « a keeper » = something worth keeping (EN)
    'var', // the Var department / a variable (EN)
    'gaffer', // = chief electrician of a film set (EN)
  ],
  selfDeclared: ['footballeur', 'supporter de foot'],
};
