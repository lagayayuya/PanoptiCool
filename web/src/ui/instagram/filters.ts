// AGE BUCKETS AND NAME SEARCH — shared by every piece that filters a list.
//
// ⚠ THE AXIS IS CALLED « ANCIENNETÉ » IN ALL OF THEM, and that is a correction rather than a
// preference. It was « Activité » in one piece and « Période » in another for exactly the same
// buckets, so changing page meant hunting for the same filter under a different name. Neither was
// true everywhere — a photo has no « activity », and « period » does not say of what. « Ancienneté »
// is true of an account, a thread and a file alike: it is the age of its last trace.
//
// ─── WHAT THIS MODULE DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT HOLDS NO PROSE. The bucket LABELS live in `copy.instagram.*`; what is here is the axis,
//     its thresholds and the predicates — facts about time, identical in both languages;
//   - IT DOES NOT KNOW WHAT « NOW » IS, and refuses to guess: see `matchesTimeTs`.

export type TimeBucket = 'any' | 'recent' | 'fading' | 'dormant';
export const TIME_BUCKETS = ['any', 'recent', 'fading', 'dormant'] as const;

export const YEAR_SEC = 365.25 * 86_400;
/** Past this, a thread — or an account — is dormant. */
export const DORMANT_YEARS = 5;

/**
 * Name search — BY PREFIX, not by substring.
 *
 * ⚠ « Je tape a, ça affiche tous les personnages commençant par a » (yuya). As a substring, typing
 * « a » would keep almost everyone: the search would be useless before the third letter.
 *
 * A SEGMENT prefix counts too. Space, dot, hyphen and underscore nearly always separate a first
 * name from a last one — in a handle (`jean.martin`) as in a thread title (`Marie Dupont`). Without
 * it, searching « dupont » would find nothing, which is a silent trap rather than a limitation.
 */
export function matchesPrefix(name: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === '') return true;
  const low = name.toLowerCase();
  if (low.startsWith(q)) return true;
  return low.split(/[\s._-]+/).some((part) => part.startsWith(q));
}

/**
 * ⚠ `nowSec` MUST BE THE LAST TRACE PRESENT IN THE EXPORT, never the machine's clock.
 *
 * An export re-read two years later would otherwise turn everything dormant — describing the WAIT
 * rather than the data. The parameter exists so that mistake has to be made deliberately.
 */
export function matchesTimeTs(lastTs: number | null, bucket: TimeBucket, nowSec: number): boolean {
  if (bucket === 'any') return true;
  // An undated thread is dormant: it has no recent trace, which is what the bucket means. Calling
  // it « recent » would be inventing one.
  if (lastTs === null) return bucket === 'dormant';
  const age = (nowSec - lastTs) / YEAR_SEC;
  if (bucket === 'recent') return age < 1;
  if (bucket === 'fading') return age >= 1 && age < DORMANT_YEARS;
  return age >= DORMANT_YEARS;
}

/** Rounded age of the last trace, in the units a reader thinks in. `null` = never. */
export function ageParts(
  lastTs: number | null,
  nowSec: number,
): { unit: 'never' | 'today' | 'days' | 'months' | 'years'; n: number } {
  // An absolute date would make a reader compute the gap in their head, on every row.
  if (lastTs === null) return { unit: 'never', n: 0 };
  const days = (nowSec - lastTs) / 86_400;
  if (days < 1) return { unit: 'today', n: 0 };
  if (days < 30) return { unit: 'days', n: Math.round(days) };
  if (days < 365) return { unit: 'months', n: Math.round(days / 30) };
  const years = (nowSec - lastTs) / YEAR_SEC;
  return { unit: 'years', n: years < 2 ? 1 : Math.floor(years) };
}
