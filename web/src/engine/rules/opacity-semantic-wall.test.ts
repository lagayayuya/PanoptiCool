// Test of the semantic wall (PANO-6) — the properties `readOpacity` must hold.
//
// Covers:
//   - no opaque item → `undefined` (no wall, nothing to reveal; absence is a dedicated rule);
//   - the value is a source-projection in COUNTS only (`readableCount`/`opaqueCount`),
//     no verbatim source value, no verdict.
//
// CARRIED OVER AT REWORK A. Three locks are not translated but DELETED — they bore on nothing that
// still exists, and inventing a replacement for them would bring the concept back through the side
// door:
//   - `kind`/`ruleId`: the `Insight` union and the registries are gone (A1). The producer has its
//     own name and its own return type — there is no discriminant left to check, the compiler holds
//     what `kind` used to keep;
//   - `confidence: { state: 'factual' }`: the factual is no longer a finding, it is a named value
//     (`Opacity`). There is no confidence left to grade over counts;
//   - `claim`/`framing` = a TemplateRef from the allowlist: opacity's claim is a CONSTANT TEXT (no
//     param ever went into it), called directly by the UI (`opacitySemanticWallClaim()`, A2). It is
//     no longer carried by the rule: there is nothing here to test about it. Its text is covered by
//     the render golden.
// What remains is what the rule actually does: count, and stay silent when there is nothing.

import { describe, expect, it } from 'vitest';
import { normalizeExport } from '../normalize';
import type {
  FavoriteVideoItem,
  LikeItem,
  RepostItem,
  SearchItem,
  TikTokExport,
  WatchHistoryItem,
} from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import { readOpacity } from './opacity-semantic-wall';

/** Typed overlay of the list containers the tests mutate (the fixture returns them empty). */
type MutableExport = TikTokExport & {
  'Your Activity': {
    Searches: { SearchList: SearchItem[] };
    'Watch History': { VideoList: WatchHistoryItem[] };
    Reposts: { RepostList: RepostItem[] };
  };
  Comment: { Comments: { CommentsList: { date: string; comment: string }[] } };
  'Likes and Favorites': {
    'Like List': { ItemFavoriteList: LikeItem[] };
    'Favorite Videos': { FavoriteVideoList: FavoriteVideoItem[] };
  };
};

/** Synthetic search item (typed text = readable offline). */
function search(term: string): SearchItem {
  return { Date: '2024-01-01 00:00:00', SearchTerm: term };
}

/** Synthetic comment item (typed text = readable offline; lowercase keys, §1.3). */
function comment(text: string): { date: string; comment: string } {
  return { date: '2024-01-01 00:00:00', comment: text };
}

/** Synthetic watch item (opaque link; empty `Title` = mute). */
function watch(link: string): WatchHistoryItem {
  return { Date: '2024-01-01 00:00:00', Link: link, Title: '' };
}

/** Synthetic like item (opaque link; lowercase keys, §1.3). */
function like(link: string): LikeItem {
  return { date: '2024-01-01 00:00:00', link };
}

/** Synthetic favorite-video item (opaque link). */
function favorite(link: string): FavoriteVideoItem {
  return { Date: '2024-01-01 00:00:00', Link: link };
}

/** Synthetic repost item (opaque link). */
function repost(link: string): RepostItem {
  return { Date: '2024-01-01 00:00:00', Link: link };
}

describe('readOpacity', () => {
  it('fully empty export (empty encodings everywhere) → undefined (no wall, opaqueCount = 0)', () => {
    expect(readOpacity(normalizeExport(validTikTokExport()))).toBeUndefined();
  });

  it('readable items only (no opaque one) → undefined (opaqueCount = 0, nothing to reveal)', () => {
    const base = validTikTokExport() as MutableExport;
    base['Your Activity'].Searches.SearchList.push(search('chats mignons'), search('recette'));
    base.Comment.Comments.CommentsList.push(comment('trop bien'));
    expect(readOpacity(normalizeExport(base))).toBeUndefined();
  });

  it('at least one opaque item → a value is emitted (ex-« a single opacity insight »)', () => {
    const base = validTikTokExport() as MutableExport;
    base['Your Activity']['Watch History'].VideoList.push(watch('https://x/1'));
    expect(readOpacity(normalizeExport(base))).toBeDefined();
  });

  it('counts: readable = searches + comments, opaque = watches + likes + favorites + reposts', () => {
    const base = validTikTokExport() as MutableExport;
    // Readable: 2 searches + 1 comment = 3.
    base['Your Activity'].Searches.SearchList.push(search('a'), search('b'));
    base.Comment.Comments.CommentsList.push(comment('c'));
    // Opaque: 2 watches + 1 like + 1 favorite + 3 reposts = 7.
    base['Your Activity']['Watch History'].VideoList.push(watch('w1'), watch('w2'));
    base['Likes and Favorites']['Like List'].ItemFavoriteList.push(like('l1'));
    base['Likes and Favorites']['Favorite Videos'].FavoriteVideoList.push(favorite('f1'));
    base['Your Activity'].Reposts.RepostList.push(repost('r1'), repost('r2'), repost('r3'));

    expect(readOpacity(normalizeExport(base))).toEqual({ readableCount: 3, opaqueCount: 7 });
  });

  it('opaque present even with nothing readable → readableCount = 0, a value is emitted', () => {
    const base = validTikTokExport() as MutableExport;
    base['Likes and Favorites']['Like List'].ItemFavoriteList.push(like('l1'), like('l2'));
    expect(readOpacity(normalizeExport(base))).toEqual({ readableCount: 0, opaqueCount: 2 });
  });
});
