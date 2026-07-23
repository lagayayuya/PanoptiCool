// Normalization at the head of the pipeline — between `validate` and `computeInsights` (PANO-28 →
// PANO-30).
//
// WHY. PANO-28 completed the input type: populated list-sections carry their `null` empty encoding
// (`NullableList<T>` = `readonly T[] | null`, PANO-11 registry). The PANO-30 rules, written when
// these lists were non-null, read `.length`/`.map` without handling `null`. Rather than scatter
// `?? []` across 10 rules, we coalesce `null → []` in ONE SINGLE place, BEFORE the rules: they now
// ALWAYS receive lists (`NormalizedExport`), their bodies unchanged.
//
// LOSSLESS (verified at integration). No rule distinguishes `null` from `[]`: the shared intent is
// `null == [] == empty`. Whenever an absence read existed, it tested
// `list === null || list.length === 0` — both cases in the same branch. Coalescing therefore loses
// no signal; what distinguishes an absence is (section path × is-empty), never the `null`/`[]`
// encoding the contract allows (§1.2).
//
// SCOPE. We coalesce the 15 `NullableList` sections (known items). The `UnverifiedNullableList`
// (shop, etc.) stay as they are: the few rules that read them already keep their `=== null` guard
// (absence l.99). "A single helper" = `list()` below, applied here and nowhere else.

import type { TikTokExport, WatchHistoryItem, YourActivityCategory } from './tiktok-export';

/** Typed `x ?? []`: list-section empty at `null` → list (non-null). The sole coalescing helper. */
function list<T>(x: readonly T[] | null): readonly T[] {
  return x ?? [];
}

/** Watch item reduced to its DATE — the only projection `normalizeExport` reads (`.Date`), and
 * exactly what the streaming parser (PANO-91, `ingest/`) produces without ever holding `Link`/`Title`. */
type WatchDateItem = Pick<WatchHistoryItem, 'Date'>;

/**
 * Input of `normalizeExport`: the `TikTokExport` contract, but `Watch History → VideoList` WIDENED to
 * also admit the dates-only list from the streaming parser. `WatchDateItem` is a SUPER-type of
 * `WatchHistoryItem` → `TikTokExport` stays assignable to `NormalizableExport` (the classic
 * `JSON.parse` → valibot → normalize pipeline is untouched), and the streaming output (dates-only)
 * is too.
 */
export type NormalizableExport = Omit<TikTokExport, 'Your Activity'> & {
  readonly 'Your Activity': Omit<YourActivityCategory, 'Watch History'> & {
    readonly 'Watch History': { readonly VideoList: readonly WatchDateItem[] | null };
  };
};

/**
 * Projects Watch History onto its DATES alone (PANO-91, mobile memory footprint). Watch History is
 * the largest section (§0, drives `--volume` — 10⁴–10⁵ items); yet the only downstream reads are
 * `.Date` (hourly rhythm, counters, estimated time — `activity-rhythm`) and `.length` (opacity wall,
 * absence). `Link`/`Title` are NEVER read. So we reduce each item `{Date,Link,Title}` to `{Date}`:
 * the URLs/titles (≈ 2/3 of the section's weight) become collectable BEFORE the rules, which bounds
 * the retained footprint to the export's real volume. The transient peak of the initial `JSON.parse`
 * remains incompressible — but it no longer adds to the rules' retention. `null → []` like `list()`.
 */
function watchDates(x: readonly WatchDateItem[] | null): readonly WatchDateItem[] {
  return x === null ? [] : x.map((item) => ({ Date: item.Date }));
}

/**
 * Coalesces the 15 `NullableList` list-sections (`null → []`) of a validated export, at the engine's
 * entry. The result (`NormalizedExport`) guarantees the rules non-null lists. Idempotent.
 */
export function normalizeExport(input: NormalizableExport) {
  return {
    ...input,
    Comment: {
      ...input.Comment,
      Comments: {
        ...input.Comment.Comments,
        CommentsList: list(input.Comment.Comments.CommentsList),
      },
    },
    'Direct Message': {
      ...input['Direct Message'],
      'Tako Chat History': {
        ...input['Direct Message']['Tako Chat History'],
        TakoChatHistoryList: list(input['Direct Message']['Tako Chat History'].TakoChatHistoryList),
      },
    },
    'Income+ Wallet': {
      ...input['Income+ Wallet'],
      'Coin Purchase History': {
        ...input['Income+ Wallet']['Coin Purchase History'],
        CoinPurchaseHistoryList: list(
          input['Income+ Wallet']['Coin Purchase History'].CoinPurchaseHistoryList,
        ),
      },
    },
    'Likes and Favorites': {
      ...input['Likes and Favorites'],
      'Favorite Collection': {
        ...input['Likes and Favorites']['Favorite Collection'],
        FavoriteCollectionList: list(
          input['Likes and Favorites']['Favorite Collection'].FavoriteCollectionList,
        ),
      },
      'Favorite Effects': {
        ...input['Likes and Favorites']['Favorite Effects'],
        FavoriteEffectsList: list(
          input['Likes and Favorites']['Favorite Effects'].FavoriteEffectsList,
        ),
      },
      'Favorite Sounds': {
        ...input['Likes and Favorites']['Favorite Sounds'],
        FavoriteSoundList: list(input['Likes and Favorites']['Favorite Sounds'].FavoriteSoundList),
      },
      'Favorite Videos': {
        ...input['Likes and Favorites']['Favorite Videos'],
        FavoriteVideoList: list(input['Likes and Favorites']['Favorite Videos'].FavoriteVideoList),
      },
      'Like List': {
        ...input['Likes and Favorites']['Like List'],
        ItemFavoriteList: list(input['Likes and Favorites']['Like List'].ItemFavoriteList),
      },
    },
    'Profile And Settings': {
      ...input['Profile And Settings'],
      Following: {
        ...input['Profile And Settings'].Following,
        Following: list(input['Profile And Settings'].Following.Following),
      },
    },
    'Your Activity': {
      ...input['Your Activity'],
      'Ads Visit History': {
        ...input['Your Activity']['Ads Visit History'],
        AdsVisitHistoryList: list(input['Your Activity']['Ads Visit History'].AdsVisitHistoryList),
      },
      'Login History': {
        ...input['Your Activity']['Login History'],
        LoginHistoryList: list(input['Your Activity']['Login History'].LoginHistoryList),
      },
      Reposts: {
        ...input['Your Activity'].Reposts,
        RepostList: list(input['Your Activity'].Reposts.RepostList),
      },
      Searches: {
        ...input['Your Activity'].Searches,
        SearchList: list(input['Your Activity'].Searches.SearchList),
      },
      Status: {
        ...input['Your Activity'].Status,
        'Status List': list(input['Your Activity'].Status['Status List']),
      },
      'Watch History': {
        ...input['Your Activity']['Watch History'],
        VideoList: watchDates(input['Your Activity']['Watch History'].VideoList),
      },
    },
  };
}

/** Export after normalization: the 15 `NullableList` list-sections are non-null. The rules' input type. */
export type NormalizedExport = ReturnType<typeof normalizeExport>;
