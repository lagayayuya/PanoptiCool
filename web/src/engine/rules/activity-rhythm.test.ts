// Test de `readRhythm` (PANO-85). Couvre :
//   - VideoList vide → `undefined` (l'absence est une règle dédiée) ;
//   - forme : 24 compteurs horaires ;
//   - bucketage horaire par découpe de chaîne (heure LOCALE de la Date, pas de dérive de fuseau) ;
//   - compteurs : total ALL-TIME (Activity Summary) + 12 mois et 30 jours glissants (horloge injectée) ;
//   - estimation par sessionisation (écart < 5 min = même session ; nominale par session).
//
// `now` est TOUJOURS injecté : les fenêtres glissantes dépendent de l'horloge — un test sur des
// valeurs absolues sans `now` fixe pourrirait avec le temps.
//
// PORTÉ À LA REFONTE A. Deux blocs ne sont pas traduits mais SUPPRIMÉS :
//   - le `describe` du CADRAGE NOCTURNE GRADUÉ (« modérée / équilibrée / importante ») : la feature
//     n'a plus de producteur — son dernier lecteur avait disparu du rendu (cf. l'en-tête
//     d'`activity-rhythm.ts` et ADR-0004). Le tester testerait du code mort ; le garder en vie par
//     un test le ferait revenir sans décision. S'il revient, il reviendra CONÇU ET RENDU ;
//   - `ruleId`/`kind`/`confidence: factual`/`sensitivity`/`framing.templateId` : l'agrégat n'était
//     plus qu'un porteur de `value`. `Rhythm` EST cette value, nommée — il n'y a plus d'enveloppe
//     de constat autour d'elle, donc plus rien à y vérifier. Ce qui survit de ce bloc est la seule
//     assertion qui portait sur les données : 24 compteurs horaires.
// Au passage : le narrowing `if (insight?.kind !== 'aggregate')` disparaît de chaque test — il
// existait pour prouver au compilateur quel membre de l'union `Insight` on tenait.

import { describe, expect, it } from 'vitest';
import type { Rhythm } from '../analysis';
import { normalizeExport } from '../normalize';
import type { TikTokExport, WatchHistoryItem } from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import { readRhythm } from './activity-rhythm';

/** Horloge de test fixe (UTC) — toutes les fenêtres glissantes s'y réfèrent. */
const NOW = Date.parse('2026-07-05T12:00:00Z');

/** Construit un export valide dont `Watch History` porte les items donnés, et fixe le total all-time
 * d'Activity Summary (`videosWatchedToTheEndSinceAccountRegistration`) — source du `total` (PANO-85). */
function exportWithWatch(
  items: readonly WatchHistoryItem[],
  allTimeWatchedToEnd = 0,
): TikTokExport {
  const base = validTikTokExport() as TikTokExport & {
    'Your Activity': {
      'Watch History': { VideoList: readonly WatchHistoryItem[] };
      'Activity Summary': {
        ActivitySummaryMap: { videosWatchedToTheEndSinceAccountRegistration: number };
      };
    };
  };
  base['Your Activity']['Watch History'].VideoList = items;
  base['Your Activity'][
    'Activity Summary'
  ].ActivitySummaryMap.videosWatchedToTheEndSinceAccountRegistration = allTimeWatchedToEnd;
  return base;
}

/** Item Watch History synthétique : seule la `Date` compte ici (Link/Title opaques). */
function watch(date: string): WatchHistoryItem {
  return { Date: date, Link: 'https://www.tiktokv.com/share/video/0/', Title: '' };
}

/** Rythme émis pour ces items — échoue si la règle se tait (les tests ci-dessous fournissent tous
 *  au moins un visionnage : `undefined` y serait un bug, pas un cas à narrower). */
function runOn(items: readonly WatchHistoryItem[], allTimeWatchedToEnd = 0): Rhythm {
  const rhythm = readRhythm(normalizeExport(exportWithWatch(items, allTimeWatchedToEnd)), NOW);
  if (rhythm === undefined) {
    throw new Error('attendu un rythme émis');
  }
  return rhythm;
}

describe('readRhythm — forme et absence', () => {
  it('VideoList vide → undefined (absence déléguée à la règle dédiée)', () => {
    expect(readRhythm(normalizeExport(validTikTokExport()), NOW)).toBeUndefined();
  });

  it('un visionnage → 24 compteurs horaires', () => {
    expect(runOn([watch('2026-06-01 14:30:00')]).hourlyActivity).toHaveLength(24);
  });
});

describe('readRhythm — bucketage horaire', () => {
  it('compte par heure LOCALE de la Date (découpe de chaîne, pas de dérive de fuseau)', () => {
    const rhythm = runOn([
      watch('2026-06-01 03:00:00'),
      watch('2026-06-02 03:12:00'),
      watch('2026-06-03 14:45:00'),
    ]);
    expect(rhythm.hourlyActivity[3]).toBe(2);
    expect(rhythm.hourlyActivity[14]).toBe(1);
    // Somme = nombre de vidéos datées (chaque vidéo bucketée une fois).
    expect(rhythm.hourlyActivity.reduce((a, b) => a + b, 0)).toBe(3);
  });
});

describe('readRhythm — compteurs de visionnage (horloge injectée)', () => {
  it('total = all-time (Activity Summary) ; 12 mois et 30 jours glissants = Watch History', () => {
    // NOW = 2026-07-05 → fenêtre 30 j depuis 2026-06-05 ; fenêtre 12 mois depuis 2025-07-05.
    const rhythm = runOn(
      [
        watch('2026-07-02 10:00:00'), // 30 j ET 12 mois
        watch('2026-06-20 11:00:00'), // 30 j ET 12 mois
        watch('2026-05-01 09:00:00'), // 12 mois, HORS 30 j
        watch('2025-02-10 09:00:00'), // > 12 mois (avant 2025-07-05), hors tout
      ],
      99999, // total all-time depuis Activity Summary — DÉCORRÉLÉ du nombre de vidéos Watch History
    );
    // `total` vient d'Activity Summary (99999), PAS de la longueur de VideoList (4).
    expect(rhythm.videosWatched).toEqual({ total: 99999, last12Months: 3, last30Days: 2 });
  });
});

describe('readRhythm — estimation du temps (sessionisation)', () => {
  it('une seule vidéo → exactement la durée nominale (30 s → 1 min arrondi)', () => {
    // 30 s = 0,5 min → arrondi à 1.
    expect(runOn([watch('2026-06-01 10:00:00')]).estimatedMinutes).toBe(1);
  });

  it('deux vidéos < 5 min d’écart → même session : écart interne + une nominale', () => {
    // 03:00:00 → 03:02:00 = 120 s intra + 30 s nominale = 150 s = 2,5 min → arrondi 3 (Math.round).
    expect(
      runOn([watch('2026-06-01 03:00:00'), watch('2026-06-01 03:02:00')]).estimatedMinutes,
    ).toBe(3);
  });

  it('deux vidéos > 5 min d’écart → deux sessions : deux nominales (pas l’écart)', () => {
    // 10:00:00 puis 10:30:00 (30 min > 5 min) → 2 sessions × 30 s = 60 s = 1 min.
    expect(
      runOn([watch('2026-06-01 10:00:00'), watch('2026-06-01 10:30:00')]).estimatedMinutes,
    ).toBe(1);
  });

  it('ordre d’entrée quelconque → le tri interne rend le résultat stable', () => {
    const asc = runOn([watch('2026-06-01 03:00:00'), watch('2026-06-01 03:02:00')]);
    const desc = runOn([watch('2026-06-01 03:02:00'), watch('2026-06-01 03:00:00')]);
    expect(asc.estimatedMinutes).toBe(desc.estimatedMinutes);
  });
});
