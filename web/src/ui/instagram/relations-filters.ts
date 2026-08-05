// THE FILTER GRAMMAR OF THE ACCOUNTS — shared by the 3D crowd and the sortable table.
//
// ⚠ THE SAME THING SEEN TWICE, never two things that resemble each other. Filters, colours and
// weights live here because duplicating them across the two renderings would guarantee they diverge —
// and a person who filters in one view and then switches would be shown a different population with
// nothing saying so.
//
// ————— Three axes, of three different natures —————
//
// That difference is what decides their behaviour and their encoding:
//
//  · `LinkStatus` — the follow relationship. An account has EXACTLY ONE: it is a partition. So a
//    single choice, and it is the one that carries the COLOUR (`REL_COLOR`);
//  · `ListStatus` — the memberships the person decided. An account can have zero, one or several.
//    Not a partition, so multi-select and NO colour;
//  · `ActionCat` — the person's own public actions. Same shape as the lists.
//
// ⚠ SIZE IS THE TOTAL of the person's public actions towards an account, stable and INDEPENDENT of
// the filters — without that, the sizes flatten as soon as one filters by link.
//
// ─── ⚠ WHAT THIS MODULE DOES NOT DO ─────────────────────────────────────────────────────────────
//   - IT HOLDS NO PROSE. Every label is in the copy perimeter; what is here is which axis a thing
//     belongs to and how it behaves;
//   - IT DOES NOT RANK ANYONE. `actionWeight` counts actions and nothing else — it is not a measure
//     of closeness, and the pieces that draw with it say so;
//   - IT KNOWS NOTHING ABOUT WHY someone blocked or muted an account. The export records the state,
//     never the reason, and no filter here implies one.

import type { AccountNode } from '../../engine/instagram/relations';
import { UI_IG_QUERY } from '../copy.instagram';
import { matchesTimeTs, type TimeBucket } from './filters';
import { DATA } from './tokens';

export const ACTION_CATS = ['story_like', 'poll', 'comment', 'comment_like'] as const;
export type ActionCat = (typeof ACTION_CATS)[number];

export type LinkStatus = 'all' | 'mutual' | 'following' | 'follower' | 'no_follow';
export type ListStatus = 'blocked' | 'pending_sent' | 'close_friend' | 'favorite' | 'hide_story';
export type Status = LinkStatus | ListStatus;

export type Rel = 'mutual' | 'following' | 'follower' | 'none';

export const LINK_STATUSES = [
  'all',
  'mutual',
  'following',
  'follower',
  'no_follow',
] as const satisfies readonly LinkStatus[];

export const LIST_STATUSES = [
  'blocked',
  'pending_sent',
  'close_friend',
  'favorite',
  'hide_story',
] as const satisfies readonly ListStatus[];

/**
 * ⚠ THE LINK'S COLOURS, chosen BY MEASUREMENT (ΔE CIE76) and not by eye — the four categories did
 * not tell each other apart. Two measured defects on the earlier palette: `following` against `none`
 * at ΔE 24.7, genuinely confusable; and `following` against an ACTION colour at ΔE 29.2 — two
 * different filter axes sharing hue families, which blurred reading them together.
 *
 * ⚠ AND THE COMMENT HERE ANNOUNCED FALSE FIGURES until 2026-08-02: « worst internal pair ΔE 55 »,
 * « worst collision ΔE 40 ». Re-measured on the values actually in place: 46.7 and **10.0**. Three
 * filter axes are shown together and each had only ever been measured AGAINST ITSELF — the exact
 * pattern CLAUDE.md describes, three nets none of which looks at what the eye sees.
 *
 * What holds today, measured across the product's colours, chrome included: any INTER-AXIS pair is
 * either identical or at ΔE ≥ 25; the filter bar's worst pair is 36.6 (against 8.4); the legend's is
 * 43.7; the weakest contrast on the background is 4.69:1 (AA = 4.5).
 *
 * `none` is the product's neutral grey: the absence of a link need not invent a hue. And these read
 * the TOKENS rather than copying them — one home, so a tint changed in the sheet changes here.
 */
export const REL_COLOR: Record<Rel, () => string> = {
  mutual: DATA.orange,
  following: DATA.cyan,
  follower: DATA.green,
  none: DATA.muted,
};

/** An account's `Rel` towards the filter axis that names it — avoids a third vocabulary. */
export const LINK_OF_REL: Record<Rel, LinkStatus> = {
  mutual: 'mutual',
  following: 'following',
  follower: 'follower',
  none: 'no_follow',
};

export function relOf(n: AccountNode): Rel {
  if (n.follows && n.followed) return 'mutual';
  if (n.followed) return 'following';
  if (n.follows) return 'follower';
  return 'none';
}

/** Total of the person's public actions towards this account — stable; drives size and proximity. */
export function actionWeight(n: AccountNode): number {
  let w = 0;
  for (const cat of ACTION_CATS) w += n.interactions[cat]?.count ?? 0;
  return w;
}

export function matchesStatus(n: AccountNode, s: Status): boolean {
  switch (s) {
    case 'all':
      return true;
    case 'mutual':
      return n.follows && n.followed;
    case 'following':
      return n.followed;
    case 'follower':
      return n.follows;
    case 'no_follow':
      return !n.follows && !n.followed;
    default:
      return n.interactions[s] !== undefined;
  }
}

/**
 * ⚠ THE MULTI-SELECT FILTERS COMBINE WITH **AND**.
 *
 * With OR, « ticking every one of your actions came to the same thing as ticking none » — which is
 * the exact symptom: the more you tick, the wider it gets. With AND, ticking more always narrows.
 *
 * It is also the only reading that makes the combinations interesting: « close friends WHOSE posts I
 * commented on AND whose stories I liked » is a question; its OR version is not one.
 */
export function isVisible(
  n: AccountNode,
  link: LinkStatus,
  lists: ReadonlySet<ListStatus>,
  time: TimeBucket = 'any',
  nowSec = 0,
): boolean {
  if (!matchesStatus(n, link)) return false;
  if (!matchesTimeTs(n.lastTs, time, nowSec)) return false;
  for (const l of lists) if (n.interactions[l] === undefined) return false;
  return true;
}

/** The query the two renderings share. */
export interface RelationQuery {
  link: LinkStatus;
  lists: ReadonlySet<ListStatus>;
  actions: ReadonlySet<ActionCat>;
  time: TimeBucket;
  search: string;
}

export const EMPTY_RELATION_QUERY: RelationQuery = {
  link: 'all',
  lists: new Set(),
  actions: new Set(),
  time: 'any',
  search: '',
};

/** How many axes are actually constraining — what decides whether a reset control appears. */
export function activeRelationCount(q: RelationQuery): number {
  return (
    (q.link === 'all' ? 0 : 1) +
    (q.lists.size > 0 ? 1 : 0) +
    (q.actions.size > 0 ? 1 : 0) +
    (q.time === 'any' ? 0 : 1) +
    (q.search.trim() === '' ? 0 : 1)
  );
}

/**
 * The sentence the card's header shows beside the count.
 *
 * ⚠ IT LIVES IN THE HEADER, not above the menus. It describes the STATE, so it is read together with
 * the number it qualifies — « 987 comptes · aucun filtre actif » is one statement, and the same words
 * placed over the controls read as an instruction instead.
 */
export function queryPhrase(
  q: RelationQuery,
  labels: { link: Record<LinkStatus, string>; list: Record<ListStatus, string> },
): string {
  const t = UI_IG_QUERY;
  const parts: string[] = [];
  if (q.search.trim() !== '') parts.push(t.startingWith(q.search.trim()));
  if (q.link !== 'all') parts.push(labels.link[q.link].toLowerCase());
  for (const l of q.lists) parts.push(labels.list[l].toLowerCase());
  if (q.time !== 'any') parts.push(t.lastSeen(t.timePhrase[q.time]));
  return parts.length === 0 ? t.none : t.active(parts.join(' · '));
}
