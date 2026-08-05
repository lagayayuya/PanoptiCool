// HOW THE INSTAGRAM PIECES SAY A DATE, in one place.
//
// ⚠ IT EXISTS BECAUSE IT WAS ALREADY WRONG IN TWO PLACES. The identity and messages pieces each
// carried their own `monthYear`, and the map was about to make it four. Two formattings drift into
// « déc. » against « décembre » and the reader believes they are two different measurements — which
// is exactly the reason the prototype had already pulled this out for the map and its detail view.
//
// They also both passed the BARE locale to `toLocaleDateString` — « fr » where CLDR wants « fr-FR »
// — leaving the runtime to choose a region. `format.ts` had already worked that out for numbers and
// says so in its own comment; this module reads the tag from there rather than deciding again.
//
// ─── WHAT THIS MODULE DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT DOES NOT FORMAT A TIME OF DAY. Nothing in the dossier shows one: the export's timestamps
//     are precise to the second, and rendering that precision would invite reading a rhythm into a
//     figure that is a login, not a habit;
//   - IT IS NOT THE PROMPT'S FORMATTER. `ai/conv-prompt.ts` builds its own period headers, because
//     what goes to a model is a ratifiable string and not interface prose.

import { TAG } from '../format';

/** « déc. 2019 » / « Dec 2019 ». */
export const monthYear = (sec: number): string =>
  new Date(sec * 1000).toLocaleDateString(TAG, { year: 'numeric', month: 'short' });

/** « décembre 2019 » / « December 2019 » — for a headline, where the abbreviation reads as noise. */
export const monthYearLong = (sec: number): string =>
  new Date(sec * 1000).toLocaleDateString(TAG, { year: 'numeric', month: 'long' });

export const dayMonthYear = (sec: number): string =>
  new Date(sec * 1000).toLocaleDateString(TAG, { year: 'numeric', month: 'short', day: 'numeric' });

/** « mars 2019 » when the period fits in a month, « mars 2019 – juin 2020 » otherwise. */
export function fmtPeriod(from: number, to: number): string {
  const a = monthYear(from);
  const b = monthYear(to);
  return a === b ? a : `${a} – ${b}`;
}

/**
 * ⚠ AN EXPORT DOES NOT DECLARE A MEDIA'S TYPE — it gives a path and nothing else. The extension is
 * therefore the only source, and it decides BOTH the thumbnail (a video poster against an image) and
 * which player the viewer opens. Two separate rules would eventually show a video's thumbnail inside
 * a photo viewer.
 */
export const isVideoPath = (p: string): boolean => /\.(mp4|mov|webm|m4v)$/i.test(p);
