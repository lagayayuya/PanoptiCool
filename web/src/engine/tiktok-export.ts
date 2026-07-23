// Engine input type — parsed TikTok data (PANO-24, ADR-0004).
//
// = parser output (unzip + JSON.parse, PANO-25) = engine input. Ingest boundary.
// The runtime validation of this boundary (valibot) is ANOTHER piece, PANO-26: this file ONLY types
// the shape. It validates nothing, normalizes nothing.
//
// STANCE: faithful mirror (option A, settled in the PANO-24 session). The type transcribes the
// structure contract `docs/tiktok-export-schema.md` as-is — 10 categories, real key casing, empty
// encodings (`""` / `null` / `{}` / `[]`) — and NOTHING else. Reasons:
//   - validation lives at ingest (PANO-26): a faithful type = valibot has a single job
//     ("does the real export match the contract?"), without validating AND transforming;
//   - a normalized type would leak output concepts (absence classification, ADR-0004) into the
//     input. The normalization the engine will want (parsed dates, etc.) is an explicit INTERNAL
//     step of the engine, never baked into this boundary type.
//   - the disorder left to the engine is covered by strict++ (`noUncheckedIndexedAccess`, defensive
//     access, ADR-0002) — no added burden.
//
// READONLY: it is not the engine's place to mutate the input — the whole type is `readonly` (deep).
//
// FIDELITY vs INVENTION (CLAUDE.md: "we invent no field outside the contract"). The contract does
// not verify everything: some sections are only observed EMPTY (shop, ads-on, `{}` maps), their
// populated shape is unverified (§3). We do NOT invent it — we type it via the `Unverified*`
// vocabulary below, never a presumed field name. Invariant: each unverified section carries its
// **precise empty encoding** from §4 (`null` / `[]` / `{}`), never a generic `unknown` — it is the
// per-section signal the ingest validation (PANO-26) will consume. When a real export reveals the
// populated shape, we extend contract + type; in the meantime valibot flags the divergence — its job.
//
// REQUIRED keys (non-optional): contract §1.2 posits that a section without data is *present*
// (empty-encoded), never omitted. Safety against a real deviation (a section absent from another
// export version) is the ingest validation's responsibility (PANO-26), not the type's.

// --- Primitives & encodings (contract §1.1–§1.2) ---------------------------------------------

/**
 * Raw date, dominant format `YYYY-MM-DD HH:MM:SS` (contract §1.1). Stays a `string` here: parsing
 * into a `Date` is an internal step of the engine, never at the boundary (guardrail A).
 */
export type RawDate = string;

/**
 * Raw date, `… UTC`-suffixed variant (contract §1.1) — `Comment → CommentsList[].date` and
 * `Tako Chat History`. Distinct from `RawDate` by documentation alone (both are `string`).
 */
export type RawDateUtc = string;

/**
 * Container observed `null` when empty (§1.2/§4); empty encoding = `null` (explicit member, PANO-26
 * signal). Populated shape unverified but admitted (§3), typed as a list (dominant case) — to be
 * refined per section if a real export reveals another container.
 */
export type UnverifiedNullableList = readonly unknown[] | null;

/** List container observed `[]` when empty (§1.2); empty encoding = `[]`. Item unverified. */
export type UnverifiedList = readonly unknown[];

/** Object container observed `{}` when empty (§1.2); empty encoding = `{}`. Keys unverified if populated. */
export type UnverifiedObject = Readonly<Record<string, unknown>>;

/**
 * List with KNOWN items whose empty encoding is `null` (PANO-11 registry; §1.2 "most sections →
 * null"). The contract `docs/tiktok-export-schema.md` §4 shows these sections **populated** and
 * stays **SILENT on their empty encoding** — PANO-24 had typed the populated state as total
 * (forgetting the empty), completed here (PANO-28, `--empty` golden that forces `null`). `T[]`
 * already includes `[]`; `| null` adds the real empty encoding of these sections. Parallel to the
 * known-items `UnverifiedNullableList`. **Do NOT apply it** to the sections that empty as `[]`/`{}`
 * (cf. `UnverifiedList`/`UnverifiedObject`): this §4 silence already made PANO-11/PANO-24 diverge —
 * a contract erratum to be filed (learning→contract).
 */
export type NullableList<T> = readonly T[] | null;

// --- Comment ---------------------------------------------------------------------------------

/** §1.3: lowercase keys (`date`/`comment`/…) — a casing trap. `date` in the `… UTC` format (§1.1). */
export interface CommentItem {
  readonly date: RawDateUtc;
  readonly comment: string;
  readonly photo: string;
  readonly video: string;
  readonly sticker: string;
  readonly originalPostUrl: string;
  readonly 'original post link': string;
}

export interface CommentCategory {
  readonly Comments: {
    /** Metadata sibling (§1.4). */
    readonly App: number;
    readonly CommentsList: NullableList<CommentItem>;
  };
}

// --- Direct Message --------------------------------------------------------------------------

/** `Content`: object of a shape not documented in the contract → unverified. */
export interface TakoMessage {
  readonly Date: RawDateUtc;
  readonly Content: UnverifiedObject;
}

export interface TakoChatHistoryItem {
  readonly 'Chat Title': string;
  readonly Messages: readonly TakoMessage[];
}

export interface DirectMessageCategory {
  /** `ChatHistory: {}` in the source; a map (keyed by interlocutor) is likely if populated — unverified. */
  readonly 'Direct Messages': { readonly ChatHistory: UnverifiedObject };
  /** `GroupChat: {}` in the source — unverified if populated. */
  readonly 'Group Chat': { readonly GroupChat: UnverifiedObject };
  readonly 'Tako Chat History': { readonly TakoChatHistoryList: NullableList<TakoChatHistoryItem> };
}

// --- Income+ Wallet --------------------------------------------------------------------------

export interface CoinPurchaseItem {
  readonly Date: RawDate;
  readonly Type: string;
  readonly CoinAmount: number;
}

export interface IncomeWalletCategory {
  readonly 'Coin Purchase History': {
    readonly CoinPurchaseHistoryList: NullableList<CoinPurchaseItem>;
  };
  /** `TransactionsList: null` in the source — empty encoding `null`; item unverified. */
  readonly 'Transaction History': { readonly TransactionsList: UnverifiedNullableList };
}

// --- Likes and Favorites ---------------------------------------------------------------------

export interface FavoriteCollectionItem {
  readonly Date: RawDate;
  readonly FavoriteCollection: string;
}

export interface FavoriteEffectItem {
  readonly Date: RawDate;
  readonly EffectLink: string;
}

export interface FavoriteSoundItem {
  readonly Date: RawDate;
  readonly Link: string;
}

export interface FavoriteVideoItem {
  readonly Date: RawDate;
  readonly Link: string;
}

/** §1.3: lowercase keys (`date`/`link`) — a parser keyed on `Date` silently misses the likes. */
export interface LikeItem {
  readonly date: RawDate;
  readonly link: string;
}

export interface LikesAndFavoritesCategory {
  /** `{}` in the source — unverified if populated. */
  readonly Collection: UnverifiedObject;
  readonly 'Favorite Collection': {
    readonly FavoriteCollectionList: NullableList<FavoriteCollectionItem>;
  };
  /** `[]` in the source — empty encoding `[]`; item unverified. */
  readonly 'Favorite Comment': { readonly FavoriteCommentList: UnverifiedList };
  /** `{}` in the source — unverified if populated. */
  readonly 'Favorite Drama': UnverifiedObject;
  readonly 'Favorite Effects': { readonly FavoriteEffectsList: NullableList<FavoriteEffectItem> };
  /** `[]` in the source — empty encoding `[]`; item unverified. */
  readonly 'Favorite Hashtags': { readonly FavoriteHashtagList: UnverifiedList };
  /** `[]` in the source — empty encoding `[]`; item unverified. */
  readonly 'Favorite Location': { readonly FavoriteLocationList: UnverifiedList };
  /** `[]` in the source — empty encoding `[]`; item unverified. */
  readonly 'Favorite Movies and TV': { readonly FavoriteMoviesAndTVList: UnverifiedList };
  /** `[]` in the source — empty encoding `[]`; item unverified. */
  readonly 'Favorite Playlists': { readonly FavoritePlaylistList: UnverifiedList };
  readonly 'Favorite Sounds': { readonly FavoriteSoundList: NullableList<FavoriteSoundItem> };
  readonly 'Favorite Videos': {
    readonly App: number;
    readonly FavoriteVideoList: NullableList<FavoriteVideoItem>;
  };
  readonly 'Like List': {
    readonly App: number;
    readonly ItemFavoriteList: NullableList<LikeItem>;
  };
}

// --- Location Review -------------------------------------------------------------------------

export interface LocationReviewCategory {
  /** `ReviewsList: null` in the source — empty encoding `null`; item unverified. */
  readonly 'Location Reviews': { readonly ReviewsList: UnverifiedNullableList };
}

// --- Post ------------------------------------------------------------------------------------

export interface PostCategory {
  /**
   * `VideoList: null` in the source; the published videos live here (contract §0) but their item
   * shape is NOT documented in §4 → unverified. Not to be confused with
   * `Your Activity → Watch History → VideoList` (known, distinct shape).
   */
  readonly Posts: { readonly VideoList: UnverifiedNullableList };
  /** `PostList: []` in the source — empty encoding `[]`; item unverified. */
  readonly 'Recently Deleted Posts': { readonly PostList: UnverifiedList };
  /** `{}` in the source — unverified if populated. */
  readonly Story: UnverifiedObject;
}

// --- Profile And Settings --------------------------------------------------------------------

/** `PlatformInfo`: cross-platform link items. `"Profile Photo"` = a spaced key (§1.3). */
export interface PlatformInfoItem {
  readonly Description: string;
  readonly Name: string;
  readonly Platform: string;
  readonly 'Profile Photo': string;
}

/**
 * `ProfileMap`: high-signal profile fields (§1.8) — raw material of the satirical mirror.
 * All `string` at the type level; the sentinels `"N/A"`/`"None"`/`""` are *values* (the engine
 * interprets them), not type variants. `followerCount`/`followingCount` = int.
 */
export interface ProfileMap {
  readonly PlatformInfo: readonly PlatformInfoItem[];
  readonly accountRegion: string;
  readonly aiSelf: string;
  readonly bioDescription: string;
  readonly birthDate: string;
  readonly displayName: string;
  readonly emailAddress: string;
  readonly followerCount: number;
  readonly followingCount: number;
  readonly fundraiser: string;
  readonly inferredGender: string;
  readonly instagramLink: string;
  readonly lemon8Link: string;
  readonly likesReceived: string;
  readonly profilePhoto: string;
  readonly profileVideo: string;
  readonly telephoneNumber: string;
  readonly userName: string;
  readonly youtubeLink: string;
}

export interface FollowingItem {
  readonly Date: RawDate;
  readonly UserName: string;
}

/**
 * `Off TikTok Activity` is DUPLICATED (§1.6): present under `Profile And Settings` AND
 * `Your Activity`. Single type home, referenced in both places. `…DataList: null` when empty.
 */
export interface OffTikTokActivitySection {
  readonly OffTikTokActivityDataList: UnverifiedNullableList;
}

export interface ProfileAndSettingsCategory {
  /** `AIMojiList: null` when empty — encoding `null`; item unverified. `CreateDate` = `string` (can be `""`). */
  readonly 'AI-Moji': { readonly CreateDate: string; readonly AIMojiList: UnverifiedNullableList };
  /** `{}` in the source — unverified if populated. */
  readonly AISelfImage: UnverifiedObject;
  /** `string` fields (each `"N/A"` when empty). */
  readonly Autofill: {
    readonly PhoneNumber: string;
    readonly Email: string;
    readonly FirstName: string;
    readonly LastName: string;
    readonly Address: string;
    readonly ZipCode: string;
    readonly Unit: string;
    readonly City: string;
    readonly State: string;
    readonly Country: string;
  };
  /** `BlockList: null` when empty — encoding `null`; item unverified. */
  readonly 'Block List': { readonly App: number; readonly BlockList: UnverifiedNullableList };
  /** `FansList: []` when empty — encoding `[]`; item unverified. `IsFastLane` sibling (§1.4). */
  readonly Follower: {
    readonly App: number;
    readonly IsFastLane: boolean;
    readonly FansList: UnverifiedList;
  };
  readonly Following: {
    readonly App: number;
    readonly IsFastLane: boolean;
    readonly Following: NullableList<FollowingItem>;
  };
  readonly 'Off TikTok Activity': OffTikTokActivitySection;
  readonly 'Profile Info': { readonly App: number; readonly ProfileMap: ProfileMap };
  /** `ProfileViewList: null` when empty — encoding `null`; item unverified. */
  readonly ProfileViews: { readonly ProfileViewList: UnverifiedNullableList };
  /**
   * `SettingsMap` (25 keys): opaque `Record<string, unknown>` = **a conscious deferred scope
   * (YAGNI), NOT a lack of fidelity**. Contract §4 does specify this subtree (flat keys +
   * `Content Preferences`/`Push Notification`/`ScreenTime`/`FamilyPairing`, encodings, and the
   * malformed key `"Who can see your following list::"` §1.7). We do not type it because no setting
   * is read in v1: typing+validating the tree = bloat + valibot over-rejection (keys vary by
   * region/version). **§1.7 landmark to preserve**: the malformed key lives HERE; a `Record<string,
   * unknown>` normalizes no key (so the trap is respected). To be typed if a setting becomes read.
   */
  readonly Settings: {
    readonly App: number;
    readonly SettingsMap: Readonly<Record<string, unknown>>;
  };
}

// --- TikTok Live -----------------------------------------------------------------------------

/** §1.5: `WatchLiveMap` entry. `CommentTime` a date, `RawTime` int. `Questions: null` when empty. */
export interface WatchLiveComment {
  readonly CommentTime: RawDate;
  readonly CommentContent: string;
  readonly RawTime: number;
}

export interface WatchLiveEntry {
  readonly Comments: readonly WatchLiveComment[];
  readonly Questions: UnverifiedNullableList;
  readonly WatchTime: RawDate;
  readonly Link: string;
}

export interface TikTokLiveCategory {
  /** `GoLiveList: null` when empty — encoding `null`; item unverified. */
  readonly 'Go Live History': { readonly GoLiveList: UnverifiedNullableList };
  /**
   * `SettingsMap`: 11 keys NOT named in the contract (§4) → opaque `Record<string, unknown>` (we
   * do not invent names; deferred scope, settings not read in v1).
   */
  readonly 'Go Live Settings': { readonly SettingsMap: Readonly<Record<string, unknown>> };
  /**
   * §1.5: a MAP keyed by an opaque numeric-string ID (19 digits), not a list.
   * `Record<string, …>` admits the empty `{}`.
   */
  readonly 'Watch Live History': {
    readonly WatchLiveMap: Readonly<Record<string, WatchLiveEntry>>;
  };
  readonly 'Watch Live Settings': {
    readonly WatchLiveSettingsMap: { readonly app: string; readonly web: string };
    readonly MostRecentModificationTimeInApp: string;
    readonly MostRecentModificationTimeInWeb: string;
  };
}

// --- TikTok Shop -----------------------------------------------------------------------------

/**
 * All sections are `null` in the source (shop unused) and their populated shape is NOT verified
 * (§3-like). Container keys transcribed verbatim; value = `UnverifiedNullableList` (explicit `null`
 * empty encoding, PANO-26 signal; populated = a list, to be refined if a real shop export appears).
 */
export interface TikTokShopCategory {
  readonly 'Communication With Shops': { readonly CommunicationHistories: UnverifiedNullableList };
  readonly 'Current Payment Information': { readonly PayCard: UnverifiedNullableList };
  readonly 'Customer Support History': {
    readonly CustomerSupportHistories: UnverifiedNullableList;
  };
  readonly 'Order Dispute History': { readonly OrderDisputeHistories: UnverifiedNullableList };
  readonly 'Order History': { readonly OrderHistories: UnverifiedNullableList };
  readonly 'Product Browsing History': {
    readonly ProductBrowsingHistories: UnverifiedNullableList;
  };
  readonly 'Product Reviews': { readonly ProductReviewHistories: UnverifiedNullableList };
  readonly 'Returns and Refunds History': {
    readonly ReturnAndRefundHistories: UnverifiedNullableList;
  };
  readonly 'Saved Address Information': { readonly SavedAddress: UnverifiedNullableList };
  readonly 'Shopping Cart List': { readonly ShoppingCart: UnverifiedNullableList };
  readonly TikTokFavoriteItem: {
    readonly TikTokFavoriteItemResult: { readonly TikTokFavoriteItemList: UnverifiedNullableList };
  };
  readonly Vouchers: { readonly Vouchers: UnverifiedNullableList };
}

// --- Your Activity ---------------------------------------------------------------------------

export interface ActivitySummaryMap {
  readonly note: string;
  readonly videosCommentedOnSinceAccountRegistration: number;
  readonly videosSharedSinceAccountRegistration: number;
  readonly videosWatchedToTheEndSinceAccountRegistration: number;
}

export interface AdsVisitItem {
  readonly CreateTime: RawDate;
  readonly AdTitle: string;
  /** Long tracking URL (§1.8). */
  readonly AdLink: string;
}

/** §1.8: high-signal fields (network / device). `Carrier` can be `""`. */
export interface LoginHistoryItem {
  readonly Date: RawDate;
  readonly IP: string;
  readonly DeviceModel: string;
  readonly DeviceSystem: string;
  readonly NetworkType: string;
  readonly Carrier: string;
}

export interface RepostItem {
  readonly Date: RawDate;
  readonly Link: string;
}

export interface SearchItem {
  readonly Date: RawDate;
  readonly SearchTerm: string;
}

/**
 * §1.8: device/advertising identifiers. `UID` = an int distinct from `DID` (a "19-digit-ish"
 * string). `GAID`/`Android ID`/`Web ID` often `""`. `IDFA`/`IDFV` in UUID form (but `string` at the
 * type level).
 */
export interface StatusItem {
  readonly Resolution: string;
  readonly 'App Version': string;
  readonly IDFA: string;
  readonly GAID: string;
  readonly 'Android ID': string;
  readonly IDFV: string;
  readonly UID: number;
  readonly DID: string;
  readonly 'Web ID': string;
}

export interface WatchHistoryItem {
  readonly Date: RawDate;
  readonly Link: string;
  /** Often `""` (opaque link with no title) — cf. the semantic wall, README.md. */
  readonly Title: string;
}

export interface YourActivityCategory {
  readonly 'Activity Summary': { readonly ActivitySummaryMap: ActivitySummaryMap };
  /**
   * `AdInterestCategories`: `""` when empty (empty encoding = the scalar sentinel `""`, §1.8);
   * populated shape UNVERIFIED (§3, presumably a list of categories) — admitted via
   * `readonly unknown[]`, without inventing the item shape.
   */
  readonly 'Ad Interests': { readonly AdInterestCategories: string | readonly unknown[] };
  readonly 'Ads Visit History': { readonly AdsVisitHistoryList: NullableList<AdsVisitItem> };
  /** `DonationList: null` when empty — encoding `null`; item unverified. */
  readonly Donation: { readonly DonationList: UnverifiedNullableList };
  /** `FundraiserList: null` when empty — encoding `null`; item unverified. */
  readonly Fundraiser: { readonly FundraiserList: UnverifiedNullableList };
  /** `HashtagList: null` when empty — encoding `null`; item unverified. */
  readonly Hashtag: { readonly HashtagList: UnverifiedNullableList };
  /** `ResponsesList: null` when empty — encoding `null`; UNVERIFIED if populated (§3). */
  readonly 'Instant Form Ads Responses': { readonly ResponsesList: UnverifiedNullableList };
  readonly 'Login History': { readonly LoginHistoryList: NullableList<LoginHistoryItem> };
  /** `{}` in the source — unverified if populated. */
  readonly 'Mini Drama Watch History': UnverifiedObject;
  /** Duplicated (§1.6) — same type as under `Profile And Settings`. */
  readonly 'Off TikTok Activity': OffTikTokActivitySection;
  /** `{ SendGifts: null }` / `{ BuyGifts: null }` — encoding `null`; populated shapes unverified. */
  readonly Purchases: {
    readonly SendGifts: { readonly SendGifts: UnverifiedNullableList };
    readonly BuyGifts: { readonly BuyGifts: UnverifiedNullableList };
  };
  readonly Reposts: { readonly RepostList: NullableList<RepostItem> };
  readonly Searches: { readonly SearchList: NullableList<SearchItem> };
  /** `ShareHistoryList: null` when empty — encoding `null`; item unverified. */
  readonly 'Share History': { readonly ShareHistoryList: UnverifiedNullableList };
  readonly Status: { readonly 'Status List': NullableList<StatusItem> };
  /** `StickerList: null` when empty — encoding `null`; item unverified. */
  readonly Stickers: { readonly StickerList: UnverifiedNullableList };
  /** The largest section (drives `--volume`). `Title` often `""`. */
  readonly 'Watch History': { readonly VideoList: NullableList<WatchHistoryItem> };
}

// --- Root ------------------------------------------------------------------------------------

/**
 * Parsed TikTok export — the JSON root (`user_data_tiktok.json`). Exactly 10 top-level categories
 * (§0). No `Ads and data` nor `Video` at the top level (§0): the ads are scattered across
 * `Your Activity`, the videos under `Post → Posts → VideoList`.
 */
export interface TikTokExport {
  readonly Comment: CommentCategory;
  readonly 'Direct Message': DirectMessageCategory;
  readonly 'Income+ Wallet': IncomeWalletCategory;
  readonly 'Likes and Favorites': LikesAndFavoritesCategory;
  readonly 'Location Review': LocationReviewCategory;
  readonly Post: PostCategory;
  readonly 'Profile And Settings': ProfileAndSettingsCategory;
  readonly 'TikTok Live': TikTokLiveCategory;
  readonly 'TikTok Shop': TikTokShopCategory;
  readonly 'Your Activity': YourActivityCategory;
}
