// THE CONVERSATIONS QUERY — four axes, and the one rule that decides how each behaves.
//
// ⚠ WHAT PARTITIONS IS CHOSEN SINGLY; THE REST COMBINES WITH AND. Age is a partition — a thread is
// recent or dormant, never both — so it is one choice. Content types are not: ticking « photos » and
// « vocaux » keeps the threads that have BOTH, because a filter that widened as you added to it
// would be doing the opposite of what selecting more things means.
//
// ⚠ AND DIRECTION IS NOT AN AXIS, it is a modifier of « contents ». « Received » on its own filters
// nothing — received WHAT? — so it lives under the content menu, after a separator, which states
// its dependency instead of describing it in a legend.
//
// ─── WHAT THIS MODULE DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT HOLDS NO PROSE AND NO COLOUR. Labels are in `copy.instagram.*`, the five content tints in
//     the stylesheet. What is here is the model and the predicates;
//   - IT DOES NOT COUNT WHAT IT MATCHES. `convPhrase` states the FILTERS and never the total: the
//     count belongs to the card's title (« 349 conversations »), and two places saying the same
//     number is how one of them comes to lie;
//   - IT DOES NOT SORT. Order is the view's business.

import type { ConversationSummary } from '../../engine/instagram/conversations';
import { matchesPrefix, matchesTimeTs, type TimeBucket } from './filters';

export type ContentType = 'photos' | 'videos' | 'audio' | 'shares' | 'calls';
export const CONTENT_TYPES = ['photos', 'videos', 'audio', 'shares', 'calls'] as const;

/** Who sent it. A modifier of `contents`, never a standalone axis — see the header. */
export type Direction = 'any' | 'self' | 'others';
export const DIRECTIONS = ['any', 'self', 'others'] as const;

/** Who wrote more, over the whole thread. */
export type Balance = 'any' | 'self' | 'others';
export const BALANCES = ['any', 'self', 'others'] as const;

export interface ConvQuery {
  readonly search: string;
  readonly contents: ReadonlySet<ContentType>;
  readonly direction: Direction;
  readonly balance: Balance;
  readonly time: TimeBucket;
}

export const EMPTY_QUERY: ConvQuery = {
  search: '',
  contents: new Set(),
  direction: 'any',
  balance: 'any',
  time: 'any',
};

/**
 * How many of one content type a thread holds, seen from the requested direction.
 *
 * ⚠ `calls` IGNORES THE DIRECTION, and that is not an oversight: the export records a call's
 * duration on one message, with no notion of who placed it. Filtering « calls sent by you » would
 * return a number the data cannot support, so the direction is dropped rather than guessed.
 */
export function contentCount(c: ConversationSummary, t: ContentType, dir: Direction): number {
  if (t === 'calls') return c.types.calls;
  if (dir === 'self') return c.typesSelf[t];
  if (dir === 'others') return c.typesOthers[t];
  return c.types[t];
}

export function matchesConv(c: ConversationSummary, q: ConvQuery, nowSec: number): boolean {
  if (!matchesPrefix(c.title, q.search)) return false;
  if (!matchesTimeTs(c.lastTs, q.time, nowSec)) return false;
  // Strict comparisons on both sides: a thread with an exact 50/50 split belongs to neither
  // « mostly you » nor « mostly them », and putting it in one would be a coin toss shown as a fact.
  if (q.balance === 'self' && c.sentBySelf <= c.received) return false;
  if (q.balance === 'others' && c.received <= c.sentBySelf) return false;
  // AND: ticking two contents keeps only the threads that have BOTH.
  for (const t of q.contents) {
    if (contentCount(c, t, q.direction) === 0) return false;
  }
  return true;
}

/** How many axes are engaged — the badge on the filter bar. */
export function activeCount(q: ConvQuery): number {
  return (
    (q.search.trim() !== '' ? 1 : 0) +
    q.contents.size +
    (q.direction !== 'any' ? 1 : 0) +
    (q.balance !== 'any' ? 1 : 0) +
    (q.time !== 'any' ? 1 : 0)
  );
}

/** The parts a sentence describing the query is assembled from. The WORDS are the interface's. */
export interface QueryPhraseParts {
  readonly search: string | null;
  readonly contents: readonly ContentType[];
  /** Only meaningful when `contents` is non-empty — see the header. */
  readonly direction: Direction;
  /** `true` when direction stands alone, which the interface phrases differently. */
  readonly directionAlone: boolean;
  readonly balance: Balance;
  readonly time: TimeBucket;
  readonly empty: boolean;
}

/**
 * Decomposes a query into what a sentence needs.
 *
 * ⚠ IT RETURNS PARTS, NOT A SENTENCE. The prototype built the French string here — « avec photos et
 * vocaux envoyés par toi » — which is prose, assembled inside a module, in one language, with
 * French word order baked into the concatenation. English orders those clauses differently, so a
 * translated version could not have been a translation of this function's output; it would have had
 * to be a second function.
 */
export function queryPhraseParts(q: ConvQuery): QueryPhraseParts {
  const search = q.search.trim();
  const contents = [...q.contents];
  return {
    search: search === '' ? null : search,
    contents,
    direction: q.direction,
    directionAlone: contents.length === 0 && q.direction !== 'any',
    balance: q.balance,
    time: q.time,
    empty: activeCount(q) === 0,
  };
}
