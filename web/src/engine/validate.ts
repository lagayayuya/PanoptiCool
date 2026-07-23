// Ingest validation — trust boundary (PANO-26, ADR-0004).
//
// The parsed TikTok JSON (`data: unknown` from PANO-25) is UNTRUSTED: it is HERE that we validate it
// against the contract, nowhere else. The validated output is a `TikTokExport` (PANO-24).
//
// SOURCE OF TRUTH = the hand-written `TikTokExport` type (PANO-24, readable contract). This
// `valibot` schema is its **runtime mirror**. The two are kept aligned by a **compile-time bridge**
// (cf. `validateTikTokExport`), not by convention.
//
// BRIDGE (forward), realized by `validateTikTokExport`'s return type: `v.safeParse` returns
// `output: v.InferOutput<typeof TikTokExportSchema>`, which we return as `data: TikTokExport`.
//   - GUARANTEES: `InferOutput<Schema>` ⊆ `TikTokExport` — the schema never produces out-of-contract
//     (a "wider schema" drift → typecheck error on the `return`).
//   - DOES NOT GUARANTEE: strict equivalence (a schema *stricter* than the contract = false
//     rejections, not flagged here → caught by the PANO-28 golden tests); `readonly` (mutable
//     assignable to readonly → not re-enforced at runtime); the absence of permissive `v.any()`.
//     Strict equivalence = a bidirectional bridge / `Equals<A, B>`. Not retained in v1, assumed.
//
// UNKNOWN KEYS = SIGNAL (not swallowing). `v.object` ignores out-of-contract keys (do NOT reject: a
// real export from another version would have them, false rejections). But an unknown key = the
// platform may have added a field the mirror does not show yet: we **count/log it in dev-only**
// (`collectUnknownKeyPaths`), never silently. Consistent with "absence as signal".
//
// PRIVACY. Validation runs on the REAL export. Everything that leaves here (issues, dev warn) carries
// only **key paths + expected types**, NEVER the received value (nor the default valibot message,
// which embeds it). PII-safe by construction.

import * as v from 'valibot';
import type { TikTokExport } from './tiktok-export';

// --- Encoding building blocks (mirror of the `Unverified*` vocabulary from `tiktok-export.ts`) --

/** `null` when empty (§1.2); list unverified if populated. */
const unverifiedNullableList = v.nullable(v.array(v.unknown()));
/** `[]` when empty (§1.2); item unverified. */
const unverifiedList = v.array(v.unknown());
/** `{}` when empty (§1.2); keys unverified if populated (or a deferred subtree, e.g. `SettingsMap`). */
const unverifiedObject = v.record(v.string(), v.unknown());

// Lists with KNOWN items whose empty encoding is `null` (PANO-11 registry; §1.2 "most → null"):
// `v.nullable(v.array(item))` inline, the runtime mirror of `NullableList<T>` (cf.
// tiktok-export.ts). §4 is silent on the empty of these populated sections → completed in PANO-28.

// --- Comment ---------------------------------------------------------------------------------

const commentItem = v.object({
  date: v.string(), // §1.3 lowercase, §1.1 format `… UTC`
  comment: v.string(),
  photo: v.string(),
  video: v.string(),
  sticker: v.string(),
  originalPostUrl: v.string(),
  'original post link': v.string(),
});

const commentCategory = v.object({
  Comments: v.object({ App: v.number(), CommentsList: v.nullable(v.array(commentItem)) }),
});

// --- Direct Message --------------------------------------------------------------------------

const takoMessage = v.object({ Date: v.string(), Content: unverifiedObject });
const takoChatHistoryItem = v.object({ 'Chat Title': v.string(), Messages: v.array(takoMessage) });

const directMessageCategory = v.object({
  'Direct Messages': v.object({ ChatHistory: unverifiedObject }),
  'Group Chat': v.object({ GroupChat: unverifiedObject }),
  'Tako Chat History': v.object({ TakoChatHistoryList: v.nullable(v.array(takoChatHistoryItem)) }),
});

// --- Income+ Wallet --------------------------------------------------------------------------

const coinPurchaseItem = v.object({ Date: v.string(), Type: v.string(), CoinAmount: v.number() });

const incomeWalletCategory = v.object({
  'Coin Purchase History': v.object({
    CoinPurchaseHistoryList: v.nullable(v.array(coinPurchaseItem)),
  }),
  'Transaction History': v.object({ TransactionsList: unverifiedNullableList }),
});

// --- Likes and Favorites ---------------------------------------------------------------------

const favoriteCollectionItem = v.object({ Date: v.string(), FavoriteCollection: v.string() });
const favoriteEffectItem = v.object({ Date: v.string(), EffectLink: v.string() });
const favoriteSoundItem = v.object({ Date: v.string(), Link: v.string() });
const favoriteVideoItem = v.object({ Date: v.string(), Link: v.string() });
const likeItem = v.object({ date: v.string(), link: v.string() }); // §1.3 lowercase

const likesAndFavoritesCategory = v.object({
  Collection: unverifiedObject,
  'Favorite Collection': v.object({
    FavoriteCollectionList: v.nullable(v.array(favoriteCollectionItem)),
  }),
  'Favorite Comment': v.object({ FavoriteCommentList: unverifiedList }),
  'Favorite Drama': unverifiedObject,
  'Favorite Effects': v.object({ FavoriteEffectsList: v.nullable(v.array(favoriteEffectItem)) }),
  'Favorite Hashtags': v.object({ FavoriteHashtagList: unverifiedList }),
  'Favorite Location': v.object({ FavoriteLocationList: unverifiedList }),
  'Favorite Movies and TV': v.object({ FavoriteMoviesAndTVList: unverifiedList }),
  'Favorite Playlists': v.object({ FavoritePlaylistList: unverifiedList }),
  'Favorite Sounds': v.object({ FavoriteSoundList: v.nullable(v.array(favoriteSoundItem)) }),
  'Favorite Videos': v.object({
    App: v.number(),
    FavoriteVideoList: v.nullable(v.array(favoriteVideoItem)),
  }),
  'Like List': v.object({ App: v.number(), ItemFavoriteList: v.nullable(v.array(likeItem)) }),
});

// --- Location Review -------------------------------------------------------------------------

const locationReviewCategory = v.object({
  'Location Reviews': v.object({ ReviewsList: unverifiedNullableList }),
});

// --- Post ------------------------------------------------------------------------------------

const postCategory = v.object({
  Posts: v.object({ VideoList: unverifiedNullableList }),
  'Recently Deleted Posts': v.object({ PostList: unverifiedList }),
  Story: unverifiedObject,
});

// --- Profile And Settings --------------------------------------------------------------------

const platformInfoItem = v.object({
  Description: v.string(),
  Name: v.string(),
  Platform: v.string(),
  'Profile Photo': v.string(),
});

const profileMap = v.object({
  PlatformInfo: v.array(platformInfoItem),
  accountRegion: v.string(),
  aiSelf: v.string(),
  bioDescription: v.string(),
  birthDate: v.string(),
  displayName: v.string(),
  emailAddress: v.string(),
  followerCount: v.number(),
  followingCount: v.number(),
  fundraiser: v.string(),
  inferredGender: v.string(),
  instagramLink: v.string(),
  lemon8Link: v.string(),
  likesReceived: v.string(),
  profilePhoto: v.string(),
  profileVideo: v.string(),
  telephoneNumber: v.string(),
  userName: v.string(),
  youtubeLink: v.string(),
});

const followingItem = v.object({ Date: v.string(), UserName: v.string() });

/** Duplicated §1.6 — single schema referenced under two parents. */
const offTikTokActivitySection = v.object({ OffTikTokActivityDataList: unverifiedNullableList });

const profileAndSettingsCategory = v.object({
  'AI-Moji': v.object({ CreateDate: v.string(), AIMojiList: unverifiedNullableList }),
  AISelfImage: unverifiedObject,
  Autofill: v.object({
    PhoneNumber: v.string(),
    Email: v.string(),
    FirstName: v.string(),
    LastName: v.string(),
    Address: v.string(),
    ZipCode: v.string(),
    Unit: v.string(),
    City: v.string(),
    State: v.string(),
    Country: v.string(),
  }),
  'Block List': v.object({ App: v.number(), BlockList: unverifiedNullableList }),
  Follower: v.object({ App: v.number(), IsFastLane: v.boolean(), FansList: unverifiedList }),
  Following: v.object({
    App: v.number(),
    IsFastLane: v.boolean(),
    Following: v.nullable(v.array(followingItem)),
  }),
  'Off TikTok Activity': offTikTokActivitySection,
  'Profile Info': v.object({ App: v.number(), ProfileMap: profileMap }),
  ProfileViews: v.object({ ProfileViewList: unverifiedNullableList }),
  Settings: v.object({ App: v.number(), SettingsMap: unverifiedObject }), // §1.7 deferred (cf. type)
});

// --- TikTok Live -----------------------------------------------------------------------------

const watchLiveComment = v.object({
  CommentTime: v.string(),
  CommentContent: v.string(),
  RawTime: v.number(),
});

const watchLiveEntry = v.object({
  Comments: v.array(watchLiveComment),
  Questions: unverifiedNullableList,
  WatchTime: v.string(),
  Link: v.string(),
});

const tikTokLiveCategory = v.object({
  'Go Live History': v.object({ GoLiveList: unverifiedNullableList }),
  'Go Live Settings': v.object({ SettingsMap: unverifiedObject }),
  'Watch Live History': v.object({ WatchLiveMap: v.record(v.string(), watchLiveEntry) }), // §1.5
  'Watch Live Settings': v.object({
    WatchLiveSettingsMap: v.object({ app: v.string(), web: v.string() }),
    MostRecentModificationTimeInApp: v.string(),
    MostRecentModificationTimeInWeb: v.string(),
  }),
});

// --- TikTok Shop -----------------------------------------------------------------------------

const tikTokShopCategory = v.object({
  'Communication With Shops': v.object({ CommunicationHistories: unverifiedNullableList }),
  'Current Payment Information': v.object({ PayCard: unverifiedNullableList }),
  'Customer Support History': v.object({ CustomerSupportHistories: unverifiedNullableList }),
  'Order Dispute History': v.object({ OrderDisputeHistories: unverifiedNullableList }),
  'Order History': v.object({ OrderHistories: unverifiedNullableList }),
  'Product Browsing History': v.object({ ProductBrowsingHistories: unverifiedNullableList }),
  'Product Reviews': v.object({ ProductReviewHistories: unverifiedNullableList }),
  'Returns and Refunds History': v.object({ ReturnAndRefundHistories: unverifiedNullableList }),
  'Saved Address Information': v.object({ SavedAddress: unverifiedNullableList }),
  'Shopping Cart List': v.object({ ShoppingCart: unverifiedNullableList }),
  TikTokFavoriteItem: v.object({
    TikTokFavoriteItemResult: v.object({ TikTokFavoriteItemList: unverifiedNullableList }),
  }),
  Vouchers: v.object({ Vouchers: unverifiedNullableList }),
});

// --- Your Activity ---------------------------------------------------------------------------

const activitySummaryMap = v.object({
  note: v.string(),
  videosCommentedOnSinceAccountRegistration: v.number(),
  videosSharedSinceAccountRegistration: v.number(),
  videosWatchedToTheEndSinceAccountRegistration: v.number(),
});

const adsVisitItem = v.object({ CreateTime: v.string(), AdTitle: v.string(), AdLink: v.string() });

const loginHistoryItem = v.object({
  Date: v.string(),
  IP: v.string(),
  DeviceModel: v.string(),
  DeviceSystem: v.string(),
  NetworkType: v.string(),
  Carrier: v.string(),
});

const repostItem = v.object({ Date: v.string(), Link: v.string() });
const searchItem = v.object({ Date: v.string(), SearchTerm: v.string() });

const statusItem = v.object({
  Resolution: v.string(),
  'App Version': v.string(),
  IDFA: v.string(),
  GAID: v.string(),
  'Android ID': v.string(),
  IDFV: v.string(),
  UID: v.number(), // §1.8 int, distinct from the `DID` string
  DID: v.string(),
  'Web ID': v.string(),
});

const watchHistoryItem = v.object({ Date: v.string(), Link: v.string(), Title: v.string() });

/**
 * Exported for streaming ingestion (`ingest/ingest-stream.ts`, PANO-91): it reuses these entries to
 * build a DRY "streamed" schema where only `Watch History → VideoList` is loosened to dates-only
 * (the array folded by the streaming parser). Everything else in the contract stays validated
 * identically.
 */
export const yourActivityCategory = v.object({
  'Activity Summary': v.object({ ActivitySummaryMap: activitySummaryMap }),
  // §3: `""` when empty; populated UNVERIFIED (likely a list) → admitted without inventing the item.
  'Ad Interests': v.object({ AdInterestCategories: v.union([v.string(), v.array(v.unknown())]) }),
  'Ads Visit History': v.object({ AdsVisitHistoryList: v.nullable(v.array(adsVisitItem)) }),
  Donation: v.object({ DonationList: unverifiedNullableList }),
  Fundraiser: v.object({ FundraiserList: unverifiedNullableList }),
  Hashtag: v.object({ HashtagList: unverifiedNullableList }),
  'Instant Form Ads Responses': v.object({ ResponsesList: unverifiedNullableList }),
  'Login History': v.object({ LoginHistoryList: v.nullable(v.array(loginHistoryItem)) }),
  'Mini Drama Watch History': unverifiedObject,
  'Off TikTok Activity': offTikTokActivitySection,
  Purchases: v.object({
    SendGifts: v.object({ SendGifts: unverifiedNullableList }),
    BuyGifts: v.object({ BuyGifts: unverifiedNullableList }),
  }),
  Reposts: v.object({ RepostList: v.nullable(v.array(repostItem)) }),
  Searches: v.object({ SearchList: v.nullable(v.array(searchItem)) }),
  'Share History': v.object({ ShareHistoryList: unverifiedNullableList }),
  Status: v.object({ 'Status List': v.nullable(v.array(statusItem)) }),
  Stickers: v.object({ StickerList: unverifiedNullableList }),
  'Watch History': v.object({ VideoList: v.nullable(v.array(watchHistoryItem)) }),
});

// --- Root --------------------------------------------------------------------------------------

/** Runtime mirror of the `TikTokExport` contract (10 categories §0). Required keys → absent = failure. */
export const TikTokExportSchema = v.object({
  Comment: commentCategory,
  'Direct Message': directMessageCategory,
  'Income+ Wallet': incomeWalletCategory,
  'Likes and Favorites': likesAndFavoritesCategory,
  'Location Review': locationReviewCategory,
  Post: postCategory,
  'Profile And Settings': profileAndSettingsCategory,
  'TikTok Live': tikTokLiveCategory,
  'TikTok Shop': tikTokShopCategory,
  'Your Activity': yourActivityCategory,
});

// --- Output & validation -----------------------------------------------------------------------

/** Validation issue — **PII-safe**: key path + expected type, never the received value. */
export interface ValidationIssue {
  /** Dotted path of the offending key (keys only). */
  path: string;
  /** Type expected by the contract at this path. */
  expected: string;
}

/** Validation result — discriminated union, plain-data (PANO-25's `ParseResult` style). */
export type ValidationResult =
  | { ok: true; data: TikTokExport }
  | { ok: false; issues: ValidationIssue[] };

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/**
 * Paths of the keys present in `raw` but removed by `v.object` (hence out-of-contract).
 * Returns PATHS only (never a value → PII-safe). Exported for the tests; called in dev-only by
 * `validateTikTokExport`.
 */
export function collectUnknownKeyPaths(raw: unknown, validated: unknown, prefix = ''): string[] {
  if (Array.isArray(raw) && Array.isArray(validated)) {
    const out: string[] = [];
    const n = Math.min(raw.length, validated.length);
    for (let i = 0; i < n; i++) {
      out.push(...collectUnknownKeyPaths(raw[i], validated[i], `${prefix}[${i}]`));
    }
    return out;
  }
  if (!isPlainObject(raw) || !isPlainObject(validated)) return [];
  const out: string[] = [];
  for (const key of Object.keys(raw)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (key in validated) {
      out.push(...collectUnknownKeyPaths(raw[key], validated[key], path));
    } else {
      out.push(path);
    }
  }
  return out;
}

/**
 * Validates `data` (untrusted parsed JSON) against the contract. Never throws. In dev, reports the
 * out-of-contract keys (paths only). The `return { ok: true, data: result.output }` IS the forward
 * bridge: `result.output` (InferOutput) must be assignable to `TikTokExport` (cf. header).
 */
export function validateTikTokExport(data: unknown): ValidationResult {
  const result = v.safeParse(TikTokExportSchema, data);
  if (result.success) {
    if (import.meta.env.DEV) {
      const unknownKeys = collectUnknownKeyPaths(data, result.output);
      if (unknownKeys.length > 0) {
        console.warn(
          `[ingest] ${unknownKeys.length} clé(s) hors-contrat (forme peut-être étendue par la plateforme) :`,
          unknownKeys,
        );
      }
    }
    return { ok: true, data: result.output };
  }
  const issues: ValidationIssue[] = result.issues.map((issue) => ({
    path: v.getDotPath(issue) ?? '(racine)',
    expected: issue.expected ?? 'unknown',
  }));
  return { ok: false, issues };
}
