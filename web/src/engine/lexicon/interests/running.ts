// Interest lexicon `running` (D2, PANO-76 batch 1, DEEP rewrite) — running / trail.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR running: distances, pace, gear, races. Blind.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « running », « marathon », « footing », « trail running », « fractionne » (high value).
//   · ANCHORED — « course » (shopping/auto), « trail » (path), « allure » (elegance), « borne » (km
//     vs generic): count only with a domain companion.
//   · EXCLUDED — « chrono » (« en un chrono »), « pace » (too generic bare).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from « muscu » (weights) and « randonnée » (walking).

import type { InterestLexicon } from '../types';

export const RUNNING_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'running',
  themeLabel: 'theme.running.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.running-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'running',
    'course a pied',
    'marathon',
    'semi marathon',
    'ultra trail',
    'trail running',
    'footing',
    'jogging',
    'fractionne',
    'sortie longue',
    'dossard',
    'ravitaillement',
    'foulee',
    'chaussures de running',
    'prepa marathon',
    'seance de seuil',
    'vma',
    'runner',
    'dix kilometres',
    'coureur du dimanche',
    // Brands & jargon (retrofit PANO-90)
    'asics',
    'hoka',
    'garmin',
    'strava',
    'saucony',
    'marathon de paris',
    'utmb',
    'gel kayano',
    'fractionne court',
    // EN variants (PANO-88): SOLO univocal.
    'tempo run',
  ],
  anchored: [
    'course', // running vs courses (shopping) / car race
    'trail', // trail running vs path
    'allure', // running pace vs elegance
    'borne', // km marker vs generic
    'denivele', // elevation gain (trail) vs generic geo
    'nike', // running/sneakers brand (shared) vs generic
    'brooks', // brand vs surname
    'cadence', // running cadence vs generic rhythm
    'run', // running vs generic English (EN, anchored)
    'pace', // pace vs generic English (EN)
    'long run', // long run vs generic (EN)
  ],
  selfDeclared: ['coureur', 'coureuse', 'marathonien', 'traileur'],
};
