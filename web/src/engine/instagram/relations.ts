// RELATIONS — the ego-centred map of PUBLIC interactions, account by account.
//
// One node per account the export mentions, carrying, per category, how many interactions and when.
// Eleven categories, from « follows » to « story hidden from », because the shape of a relationship
// is what the sum of those categories draws — not any one of them.
//
// ⚠ THE TWO IDENTITY SPACES DO NOT MERGE. This module works in USERNAMES (public). Conversations
// work in DISPLAY NAMES (private), which are a different, overlapping and unjoinable set — the same
// person appears in both under two strings, and roughly 12 % of them can be matched at all. Joining
// them would fabricate a certainty the export does not contain, so nothing here tries.
//
// ⚠ AND NO CONTENT CROSSES, with two named exceptions. A comment's TEXT and a poll's QUESTION are
// kept, because both are the person's OWN writing and both are what makes the interaction legible
// (« you answered this question » says nothing; the question says something). Everything else —
// what was liked, what the other person wrote — stays counted and unquoted.
//
// ─── WHAT THIS EXTRACTOR DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT DOES NOT INFER RECIPROCITY BEYOND THE TWO LISTS. `follows` and `followed` come from the
//     follower and following files; an account in neither is simply absent, not « not following »;
//   - IT DOES NOT DATE WHAT THE EXPORT DOES NOT DATE. An undated interaction is COUNTED and carries
//     no timestamp — the count and the timeline are two numbers, and conflating them would invent
//     a date or lose an event;
//   - IT READS QUIZZES AND SLIDERS NOT AT ALL. Polls only (yuya's decision on the prototype: a
//     legible category beats an exhaustive one). Their files are simply not opened;
//   - IT DOES NOT RESOLVE A DELETED ACCOUNT. A username that no longer exists is a node like any
//     other; nothing here can know, and nothing pretends to.

import type { Locale } from '../../i18n/locales';
import { instagramWording } from '../wording.instagram';
import { isLabel, type LabelCoverage } from './labels';
import { fixMojibake } from './mojibake';
import { labelValues, stringMap, toList } from './shapes';

export type InteractionCategory =
  | 'following'
  | 'follower'
  | 'story_like'
  | 'poll'
  | 'comment'
  | 'comment_like'
  | 'blocked'
  | 'pending_sent'
  | 'close_friend'
  | 'favorite'
  | 'hide_story';

export interface CategoryInteractions {
  /** Every interaction, dated or not. */
  readonly count: number;
  /** Epoch seconds, ascending — only the DATED ones, so `timestamps.length <= count`. */
  readonly timestamps: readonly number[];
}

/** The person's own writing, kept because it is what makes the interaction legible. */
export interface InteractionDetail {
  readonly text: string;
  readonly ts: number | null;
}

export interface AccountNode {
  /** The username — join key, and the string the interface pseudonymises by default. */
  readonly id: string;
  readonly interactions: Partial<Record<InteractionCategory, CategoryInteractions>>;
  readonly content?: Partial<Record<InteractionCategory, readonly InteractionDetail[]>>;
  /** This account follows the export's owner. */
  readonly follows: boolean;
  /** The export's owner follows this account. */
  readonly followed: boolean;
  readonly firstTs: number | null;
  readonly lastTs: number | null;
}

export interface CategoryMeta {
  readonly key: InteractionCategory;
  readonly label: string;
  readonly kind: 'positive' | 'exclusion';
  /** Distinct accounts touched. */
  readonly accounts: number;
  /** Total interactions, dated or not. */
  readonly events: number;
}

export interface RelationsReport {
  readonly nodes: readonly AccountNode[];
  readonly categories: readonly CategoryMeta[];
  readonly self: { readonly following: number; readonly followers: number };
}

/** Whether a category reads as a bond or as a distance kept. Structure, not prose — the WORDS live
 *  in `wording.instagram.*`, this says which of the two a category is. */
const CATEGORY_KIND: Record<InteractionCategory, 'positive' | 'exclusion'> = {
  following: 'positive',
  follower: 'positive',
  story_like: 'positive',
  poll: 'positive',
  comment: 'positive',
  comment_like: 'positive',
  blocked: 'exclusion',
  pending_sent: 'exclusion',
  close_friend: 'exclusion',
  favorite: 'exclusion',
  hide_story: 'exclusion',
};

/**
 * A username from an Instagram href.
 *
 * ⚠ `/p/` AND `/reel/` ARE REJECTED, not parsed: those paths carry a POST id where a username sits
 * in a profile URL, so accepting them would create a node named after a piece of content and count
 * interactions against it. `/stories/USER` keeps its second segment, which is where the name is.
 */
function usernameFromHref(href?: string): string | undefined {
  if (!href) return undefined;
  const m = href.match(/instagram\.com\/([^/?#]+)(?:\/([^/?#]+))?/i);
  if (!m?.[1]) return undefined;
  const first = m[1].toLowerCase();
  if (first === 'stories') return m[2];
  if (['p', 'reel', 'reels', 'explore'].includes(first)) return undefined;
  return m[1];
}

/** A username from a `label_values` item: the profile-name label, else the first usable href. */
function usernameFromLabels(item: unknown, coverage?: LabelCoverage): string | undefined {
  for (const lv of labelValues(item)) {
    if (isLabel(lv.label, 'profileName') && lv.value) {
      coverage?.record('profileName');
      return lv.value;
    }
  }
  for (const lv of labelValues(item)) {
    const u = usernameFromHref(lv.href);
    if (u) return u;
  }
  return undefined;
}

function firstListTimestamp(item: unknown): number | undefined {
  return (item as { string_list_data?: Array<{ timestamp?: number }> }).string_list_data?.[0]
    ?.timestamp;
}

/** A username from `title` when it carries one (following, liked comments), else from the list. */
function usernameFromTitleOrList(item: unknown): string | undefined {
  const title = (item as { title?: string }).title;
  if (title?.trim()) return title.trim();
  const list = (item as { string_list_data?: Array<{ value?: string; href?: string }> })
    .string_list_data;
  if (list?.[0]?.value) return list[0].value;
  return usernameFromHref(list?.[0]?.href);
}

interface NodeAcc {
  id: string;
  /** Per category: how many interactions, and the dated ones' timestamps. */
  counts: Map<InteractionCategory, { count: number; timestamps: number[] }>;
  content: Map<InteractionCategory, InteractionDetail[]>;
}

class Graph {
  private readonly nodes = new Map<string, NodeAcc>();

  add(
    username: string | undefined,
    cat: InteractionCategory,
    ts: number | undefined | null,
    text?: string,
  ): void {
    const id = username?.trim();
    if (!id) return;
    let n = this.nodes.get(id);
    if (n === undefined) {
      n = { id, counts: new Map(), content: new Map() };
      this.nodes.set(id, n);
    }
    let bucket = n.counts.get(cat);
    if (bucket === undefined) {
      bucket = { count: 0, timestamps: [] };
      n.counts.set(cat, bucket);
    }
    // ⚠ COUNT AND TIMELINE ARE TWO NUMBERS. The prototype pushed `NaN` for an undated interaction
    // and filtered it out later — which worked, and put a NaN inside an array that gets sorted.
    // Counting separately is the same result with nothing to filter and nothing to trip over.
    bucket.count++;
    if (typeof ts === 'number' && Number.isFinite(ts)) bucket.timestamps.push(ts);
    if (text?.trim()) {
      const list = n.content.get(cat) ?? [];
      list.push({ text: text.trim(), ts: typeof ts === 'number' ? ts : null });
      n.content.set(cat, list);
    }
  }

  build(): AccountNode[] {
    const out: AccountNode[] = [];
    for (const n of this.nodes.values()) {
      const interactions: Partial<Record<InteractionCategory, CategoryInteractions>> = {};
      let firstTs: number | null = null;
      let lastTs: number | null = null;
      for (const [cat, bucket] of n.counts) {
        const timestamps = [...bucket.timestamps].sort((a, b) => a - b);
        interactions[cat] = { count: bucket.count, timestamps };
        for (const t of timestamps) {
          firstTs = firstTs === null ? t : Math.min(firstTs, t);
          lastTs = lastTs === null ? t : Math.max(lastTs, t);
        }
      }
      let content: Partial<Record<InteractionCategory, readonly InteractionDetail[]>> | undefined;
      if (n.content.size > 0) {
        content = {};
        for (const [cat, list] of n.content) {
          content[cat] = [...list].sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0));
        }
      }
      out.push({
        id: n.id,
        interactions,
        follows: n.counts.has('follower'),
        followed: n.counts.has('following'),
        firstTs,
        lastTs,
        ...(content !== undefined && { content }),
      });
    }
    return out;
  }
}

/** Reads a list, tolerating both dialects and an absent file. An absent section is not an error:
 *  half of an export is optional, and refusing on the first missing path refuses real accounts. */
async function readList(
  src: { readJson: <T>(p: string) => Promise<T> },
  path: string,
  root?: string,
): Promise<unknown[]> {
  try {
    const d = await src.readJson<unknown>(path);
    if (root !== undefined && d && typeof d === 'object') {
      const wrapped = (d as Record<string, unknown>)[root];
      if (Array.isArray(wrapped)) return wrapped;
    }
    return toList(d);
  } catch {
    return [];
  }
}

export async function runRelations(
  src: { readJson: <T>(p: string) => Promise<T> },
  locale: Locale,
  coverage?: LabelCoverage,
): Promise<RelationsReport> {
  const g = new Graph();
  const w = instagramWording(locale);

  // — username from title/string_list_data, timestamp from the list's first entry —
  for (const it of await readList(
    src,
    'connections/followers_and_following/following.json',
    'relationships_following',
  )) {
    g.add(usernameFromTitleOrList(it), 'following', firstListTimestamp(it));
  }
  for (const it of await readList(src, 'connections/followers_and_following/followers_1.json')) {
    g.add(usernameFromTitleOrList(it), 'follower', firstListTimestamp(it));
  }
  for (const it of await readList(
    src,
    'your_instagram_activity/likes/liked_comments.json',
    'likes_comment_likes',
  )) {
    g.add(usernameFromTitleOrList(it), 'comment_like', firstListTimestamp(it));
  }

  // — profile-name label + top-level timestamp (the exclusion and affinity lists) —
  const labelSources: ReadonlyArray<readonly [string, InteractionCategory]> = [
    ['connections/followers_and_following/blocked_profiles.json', 'blocked'],
    ['connections/followers_and_following/pending_follow_requests.json', 'pending_sent'],
    ['connections/followers_and_following/close_friends.json', 'close_friend'],
    ["connections/followers_and_following/profiles_you've_favorited.json", 'favorite'],
    ['connections/followers_and_following/hide_story_from.json', 'hide_story'],
  ];
  for (const [path, cat] of labelSources) {
    for (const it of await readList(src, path)) {
      g.add(usernameFromLabels(it, coverage), cat, (it as { timestamp?: number }).timestamp);
    }
  }

  // — href /stories/USER + top-level timestamp —
  for (const it of await readList(
    src,
    'your_instagram_activity/story_interactions/story_likes.json',
  )) {
    let u: string | undefined;
    for (const lv of labelValues(it)) {
      u = usernameFromHref(lv.href);
      if (u !== undefined) break;
    }
    g.add(u, 'story_like', (it as { timestamp?: number }).timestamp);
  }

  // Polls only. The QUESTION is kept — the export does not store which option was picked, so the
  // question is the whole of what the interaction says.
  for (const it of await readList(src, 'your_instagram_activity/story_interactions/polls.json')) {
    let u: string | undefined;
    let question: string | undefined;
    for (const lv of labelValues(it)) {
      if (u === undefined) u = usernameFromHref(lv.href);
      if (isLabel(lv.label, 'pollQuestion') && lv.value) {
        coverage?.record('pollQuestion');
        question = fixMojibake(lv.value);
      }
    }
    g.add(u, 'poll', (it as { timestamp?: number }).timestamp, question);
  }

  // — posted comments. Three files, three different root keys, one shape. —
  const commentSources: ReadonlyArray<readonly [string, string | undefined]> = [
    ['your_instagram_activity/comments/post_comments_1.json', undefined],
    ['your_instagram_activity/comments/reels_comments.json', 'comments_reels_comments'],
    ['your_instagram_activity/comments/hype.json', 'comments_story_comments'],
  ];
  for (const [path, root] of commentSources) {
    for (const it of await readList(src, path, root)) {
      const map = stringMap(it);
      let owner: string | undefined;
      let time: number | undefined;
      let text: string | undefined;
      for (const [rawKey, entry] of Object.entries(map)) {
        if (isLabel(rawKey, 'mediaOwner')) {
          coverage?.record('mediaOwner');
          owner = entry.value;
        } else if (isLabel(rawKey, 'time')) {
          coverage?.record('time');
          time = entry.timestamp;
        } else if (isLabel(rawKey, 'comment')) {
          coverage?.record('comment');
          // ⚠ The mojibake repair is applied HERE, to the person's own comment, and it is the one
          // place content passes through it. Safe because the repair returns the string untouched
          // whenever re-interpreting it fails — the guard `fixMojibake` has since it was fixed.
          text = entry.value === undefined ? undefined : fixMojibake(entry.value);
        }
      }
      g.add(owner, 'comment', time, text);
    }
  }

  const nodes = g.build();

  const categories: CategoryMeta[] = (Object.keys(CATEGORY_KIND) as InteractionCategory[]).map(
    (key) => {
      let accounts = 0;
      let events = 0;
      for (const n of nodes) {
        const ci = n.interactions[key];
        if (ci !== undefined) {
          accounts++;
          events += ci.count;
        }
      }
      return { key, label: w.categories[key], kind: CATEGORY_KIND[key], accounts, events };
    },
  );

  return {
    nodes,
    categories,
    self: {
      following: nodes.filter((n) => n.followed).length,
      followers: nodes.filter((n) => n.follows).length,
    },
  };
}
