// Rythme d'activité horaire + compteurs de visionnage + estimation (PANO-85) — → `RhythmCard`.
//
// Lot A1 : rend `Rhythm | undefined` au lieu d'un `Insight` `aggregate`. L'agrégat n'était déjà plus
// qu'un porteur de `value` : depuis la refonte v2, l'encart nocturne a été retiré du rendu
// (`ActivitySection.tsx` — « le second encart orange créait un doublon visuel parasite »), donc son
// `claim`/`framing`/`confidence` n'avait plus aucun lecteur.
//
// CE QUI PART AVEC, et qu'il faut dire plutôt que laisser découvrir : le cadrage nocturne GRADUÉ de
// PANO-85 (`nightShare` + les 3 gabarits `night-moderate|balanced|high`, seuils 0.20 / 0.33) était la
// décision yuya de PANO-85 — un qualificatif nuancé plutôt qu'un verdict « créneau à risque ». Il n'a
// plus de producteur ICI parce qu'il n'a plus de scène : la carte affiche le graphe, les compteurs et
// l'estimation, jamais la phrase. Le retirer ne juge pas le constat — c'est la doctrine du LOT B2
// (§11.4) : pas de code qui tourne pour personne ; s'il revient, il reviendra CONÇU ET RENDU.
// La coloration nuit/journée du graphe, elle, VIT (`NIGHT_HOURS` est redéclaré côté carte, les deux
// conventions doivent rester alignées — inchangé depuis PANO-85).

import { readActivitySummary } from '../activity-summary';
import type { Rhythm } from '../analysis';
import type { NormalizedExport } from '../normalize';
import { parseRawDateUTC } from './shared';

export const ACTIVITY_RHYTHM_SECTION_PATH = 'Your Activity/Watch History' as const;

/** Écart au-delà duquel deux visionnages consécutifs sont comptés dans DEUX sessions distinctes. */
const SESSION_GAP_MS = 5 * 60 * 1000;
/** Durée nominale attribuée à la dernière vidéo d'une session (sans elle, une session d'une seule
 *  vidéo compterait 0 minute). */
const NOMINAL_LAST_VIDEO_MS = 30 * 1000;

function bucketByHour(rawDates: readonly string[]): number[] {
  const hours = new Array<number>(24).fill(0);
  for (const raw of rawDates) {
    const hour = Number(raw.slice(11, 13));
    if (Number.isInteger(hour) && hour >= 0 && hour <= 23) {
      hours[hour] = (hours[hour] ?? 0) + 1;
    }
  }
  return hours;
}

/** Compteurs de visionnage (C, PANO-85). `total` est ALL-TIME (Activity Summary), les deux autres
 *  sont des fenêtres GLISSANTES sur Watch History — le mélange est VOULU (le total honnête vit dans
 *  Activity Summary, pas dans la fenêtre courte de Watch History). */
function watchCounts(
  rawDates: readonly string[],
  allTimeTotal: number,
  now: number,
): Rhythm['videosWatched'] {
  const cutoff12m = now - 365 * 86_400_000;
  const cutoff30d = now - 30 * 86_400_000;
  let last12Months = 0;
  let last30Days = 0;
  for (const raw of rawDates) {
    const t = parseRawDateUTC(raw);
    if (t === null) {
      continue;
    }
    if (t >= cutoff12m) {
      last12Months += 1;
    }
    if (t >= cutoff30d) {
      last30Days += 1;
    }
  }
  return { total: allTimeTotal, last12Months, last30Days };
}

/** Minutes ESTIMÉES (D, PANO-85) par sessionisation des dates : on somme les écarts INTRA-session et
 *  on ajoute une durée nominale par session pour sa dernière vidéo. Une estimation assumée, présentée
 *  comme telle à l'écran (miroir, pas oracle) — un chiffre, jamais un verdict. */
function estimatedMinutes(rawDates: readonly string[]): number {
  const epochs = rawDates
    .map(parseRawDateUTC)
    .filter((t): t is number => t !== null)
    .sort((a, b) => a - b);
  if (epochs.length === 0) {
    return 0;
  }
  let intraMs = 0;
  let sessions = 1; // au moins une session dès qu'il y a une vidéo
  for (let i = 1; i < epochs.length; i += 1) {
    const gap = (epochs[i] ?? 0) - (epochs[i - 1] ?? 0);
    if (gap < SESSION_GAP_MS) {
      intraMs += gap;
    } else {
      sessions += 1;
    }
  }
  const totalMs = intraMs + sessions * NOMINAL_LAST_VIDEO_MS;
  return Math.round(totalMs / 60_000);
}

/** `undefined` si l'historique de visionnage est vide (rien à tracer). */
export function readRhythm(input: NormalizedExport, now: number = Date.now()): Rhythm | undefined {
  const videoList = input['Your Activity']['Watch History'].VideoList;
  if (videoList.length === 0) {
    return undefined;
  }
  const dates = videoList.map((item) => item.Date);
  return {
    hourlyActivity: bucketByHour(dates),
    videosWatched: watchCounts(dates, readActivitySummary(input).videosWatchedToEnd, now),
    estimatedMinutes: estimatedMinutes(dates),
  };
}
