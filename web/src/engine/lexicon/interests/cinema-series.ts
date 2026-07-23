// Interest lexicon `cinema_series` (D2, PANO-77 batch 2 · entities enriched) — film & series.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR film / series: crafts, formats, PLATFORMS, FRANCHISES,
// DIRECTORS, viewer JARGON. Blind; entities = generic public signal enriched by
// research (streaming services, franchises, studios, fandom jargon).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « realisateur », « box office », « blockbuster », « spoiler », « reboot »,
//     platforms (« netflix », « disney plus »), franchises (« marvel », « star wars »), studios
//     (« a24 », « pixar »), directors (« tarantino », « scorsese », « nolan »).
//   · ANCHORED — 50/50: « film » (plastic), « serie » (sport), « acteur », « scene », « role »,
//     « plan », « ecran », « sortie », « bond » (james bond / bond), « dc »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from « manga_anime ».

import type { InterestLexicon } from '../types';

export const CINEMA_SERIES_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'cinema_series',
  themeLabel: 'theme.cinema-series.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.streaming', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Generic vocabulary
    'cinema',
    'long metrage',
    'court metrage',
    'realisateur',
    'bande annonce',
    'box office',
    'serie tv',
    'saison finale',
    'blockbuster',
    'science fiction',
    'film d horreur',
    'comedie romantique',
    'seance de cine',
    'grand ecran',
    'binge watching',
    'biopic',
    'avant premiere',
    // Fandom jargon
    'spoiler',
    'reboot',
    'spin off',
    'prequel',
    'cliffhanger',
    'easter egg',
    'cinematic universe',
    'mcu',
    // Streaming platforms
    'netflix',
    'prime video',
    'disney plus',
    'hbo max',
    'apple tv',
    'canal plus',
    'paramount plus',
    // Franchises
    'marvel',
    'star wars',
    'harry potter',
    'fast and furious',
    'game of thrones',
    'stranger things',
    'breaking bad',
    // Studios & directors
    'a24',
    'pixar',
    'dreamworks',
    'tarantino',
    'scorsese',
    'spielberg',
    'nolan',
    'kubrick',
  ],
  anchored: [
    'film', // plastic film / photographic film
    'serie', // series (sport / sequence) — overlaps muscu
    'acteur', // acting
    'scene', // scene (theatre / crime)
    'role', // generic role
    'plan', // map / plan
    'ecran', // generic screen
    'sortie', // exit vs film release
    'episode', // generic episode
    'casting', // generic casting
    'bond', // james bond / bond (English)
    'dc', // abbreviation
    'villeneuve', // town vs Denis Villeneuve
    // EN variants (PANO-88): anchored (polysemous).
    'plot twist', // plot twist vs generic (EN)
    'cameo', // cameo appearance vs generic (EN)
    'recap', // episode recap vs generic (EN)
  ],
  selfDeclared: ['cinephile', 'serievore'],
};
