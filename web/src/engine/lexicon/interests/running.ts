// Lexique d'intérêt `running` (D2, PANO-76 lot 1, réécriture PROFONDE) — course à pied / trail.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la course à pied FR : distances, allure, matériel, épreuves. À l'aveugle.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « running », « marathon », « footing », « trail running », « fractionne » (haute valeur).
//   · ANCRÉ — « course » (shopping/auto), « trail » (sentier), « allure » (élégance), « borne » (km
//     vs générique) : ne comptent qu'avec un compagnon du domaine.
//   · EXCLU — « chrono » (« en un chrono »), « pace » (trop générique nu).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de « muscu » (fonte) et « randonnée » (marche).

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
    // Marques & jargon (rétrofit PANO-90)
    'asics',
    'hoka',
    'garmin',
    'strava',
    'saucony',
    'marathon de paris',
    'utmb',
    'gel kayano',
    'fractionne court',
    // Variantes EN (PANO-88) : SOLO univoque.
    'tempo run',
  ],
  anchored: [
    'course', // course à pied vs courses (shopping) / course auto
    'trail', // trail running vs sentier
    'allure', // allure de course vs élégance
    'borne', // borne kilométrique vs générique
    'denivele', // dénivelé (trail) vs générique géo
    'nike', // marque running/sneakers (partagé) vs générique
    'brooks', // marque vs patronyme
    'cadence', // cadence de course vs rythme générique
    'run', // course vs anglais générique (EN, ancré)
    'pace', // allure vs anglais générique (EN)
    'long run', // sortie longue vs générique (EN)
  ],
  selfDeclared: ['coureur', 'coureuse', 'marathonien', 'traileur'],
};
