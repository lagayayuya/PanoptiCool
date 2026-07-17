# TikTok Data Export — Structural Contract (JSON format)

> **Source of truth for the PanoptiCool synthetic fixture generator (PANO-11).**
> Derived from a **real** TikTok JSON export with **all values stripped**. This file contains
> **zero real data**. The generator MUST produce output structurally identical to this contract,
> and **every value it emits MUST be synthetic** (no PII, ever — that is the whole point of the fixture).

---

## 0. Container

- Output is a `.zip` archive containing **exactly one file**: `user_data_tiktok.json`.
- The JSON root is an object with **10 top-level category keys**:
  `Comment`, `Direct Message`, `Income+ Wallet`, `Likes and Favorites`, `Location Review`,
  `Post`, `Profile And Settings`, `TikTok Live`, `TikTok Shop`, `Your Activity`.
- Note for whoever wrote PANO-11: there is **no** top-level `Ads and data` and **no** top-level `Video`.
  Ad data is scattered inside `Your Activity`; videos live under `Post → Posts → VideoList`.

---

## 1. Non-obvious fidelity rules — these ARE the value, get them exactly right

### 1.1 Two date formats coexist (per-section)
- Dominant: `YYYY-MM-DD HH:MM:SS` (e.g. `2026-05-14 21:03:11`).
- Variant with suffix: `YYYY-MM-DD HH:MM:SS UTC` — used in `Comment → CommentsList[].date`
  and in `Tako Chat History`. The generator must apply the right format **per field**, not globally.

### 1.2 Three encodings of "empty" (per-section, not interchangeable)
A section with no data is **present** and encoded as one of:
- `null`  (most sections — e.g. `Transaction History → TransactionsList: null`)
- `[]`    (e.g. `Favorite Comment → FavoriteCommentList: []`)
- `{}`    (e.g. `Direct Messages → ChatHistory: {}`)

Plus scalar sentinels for empty leaf fields: `""`, `"N/A"`, `"None"`, and on/off toggles `"Off"`/`"On"`.
The exact encoding per section is fixed by the tree in §4 — reproduce it verbatim. "Absence as signal"
must be able to emit each of these.

### 1.3 Per-section key casing (the trap)
Most list items use capitalized `Date` / `Link`. **Exceptions use lowercase**:
- `Like List → ItemFavoriteList` → `date`, `link`
- `Comment → CommentsList` → `date`, `comment`, `photo`, `video`, `sticker`, `originalPostUrl`, `original post link`

A parser keyed naively on `"Date"` silently misses the likes. Reproduce casing exactly as in §4.

### 1.4 Metadata siblings
Many list-bearing objects carry an `App: <int>` sibling next to the list
(`Comments`, `Favorite Videos`, `Like List`, `Follower`, `Following`, `Block List`, `Profile Info`, `Settings`).
`Follower` and `Following` additionally carry `IsFastLane: <bool>`.

### 1.5 Map keyed by opaque ID (not a list)
`TikTok Live → Watch Live History → WatchLiveMap` is an **object keyed by opaque numeric-string IDs**
(e.g. `"7643768707189771030"`), each mapping to `{ Comments: [...], Questions: null, WatchTime: <date>, Link: <string> }`.
Synthetic IDs must be 19-digit-ish opaque strings, unique per entry.

### 1.6 Duplicate section
`Off TikTok Activity` appears under **both** `Profile And Settings` **and** `Your Activity`.
Reproduce in both places; the parser must not assume section keys are unique across categories.

### 1.7 Malformed key (verbatim)
`Settings → SettingsMap` contains the literal key `"Who can see your following list::"` (double colon). Keep it.

### 1.8 High-signal tracking fields — synthesize plausibly (this is the satirical mirror's raw material)
- `Your Activity → Login History → LoginHistoryList[]`: `IP`, `DeviceModel`, `DeviceSystem`, `NetworkType`, `Carrier`.
- `Your Activity → Status → Status List[]`: `IDFA`, `GAID`, `Android ID`, `IDFV`, `UID` (int), `DID`, `Web ID` — device/advertising identifiers.
- `Profile And Settings → Profile Info → ProfileMap`: `accountRegion`, `birthDate`, `emailAddress`, `telephoneNumber`, `inferredGender`, `userName`, `displayName`, `followerCount`, `followingCount`, etc.
- `Your Activity → Ads Visit History → AdsVisitHistoryList[]`: `CreateTime`, `AdTitle`, `AdLink` (long tracking URL).

All synthetic. IDFA/IDFV are UUID-shaped; GAID/Android ID may be empty (`""`) as in the source; IP is an IPv4/IPv6 string; links are tiktok-shaped URLs with synthetic IDs.

---

## 2. Realistic volume weights (one real account → scale by `--volume`)

| Section (path → list key)                                   | Real count |
|-------------------------------------------------------------|-----------:|
| Your Activity → Watch History → VideoList                   |      9 339 |
| Likes and Favorites → Like List → ItemFavoriteList          |      3 491 |
| Likes and Favorites → Favorite Videos → FavoriteVideoList   |      1 843 |
| Your Activity → Login History → LoginHistoryList            |        345 |
| Profile And Settings → Following → Following                |        147 |
| Your Activity → Searches → SearchList                       |        134 |
| Comment → Comments → CommentsList                           |         95 |
| Your Activity → Status → Status List                        |         37 |
| TikTok Live → Watch Live History → WatchLiveMap             |         15 |
| Your Activity → Reposts → RepostList                        |         12 |
| Favorite Sounds / Favorite Collection / Coin Purchase / …   |      1–4   |

The `--volume N` parameter should set the dominant `Watch History` to ≈ N and scale the others by
these ratios, so the fixture keeps a realistic shape at any size (target ceiling: tens of thousands).

---

## 3. Ads policy (resolved decision)

Ads were **disabled** in the source account, so these sections are empty/null and their **populated**
shape is **NOT verified** by this contract:
- `Your Activity → Ad Interests → AdInterestCategories` — `""` when empty; populated form **TO VERIFY** (likely a list of category strings).
- `Off TikTok Activity → OffTikTokActivityDataList` — `null` (appears under both parents, see §1.6).
- `Your Activity → Instant Form Ads Responses → ResponsesList` — `null`.

Generator behavior:
- **`--ads off` (default):** keep these empty/null — strictly faithful to the verified oracle.
- **`--ads on`:** populate them from an **isolated module explicitly marked `UNVERIFIED`**, so the
  reconstructed shapes are quarantined and trivially correctable once a real ads-on export is provided.

`Your Activity → Ads Visit History` **is populated** in the source (`CreateTime`, `AdTitle`, `AdLink`) —
that shape **is** verified and is not part of the ads-reconstruction module.

---

## 4. Full structure (values stripped; casing & encodings are authoritative)

```
## Comment
  Comments: object
    App: int
    CommentsList: list  [count≈95]
      - date: date[YYYY-MM-DD HH:MM:SS UTC]
      - comment: string
      - photo: string
      - video: string
      - sticker: string
      - originalPostUrl: string
      - original post link: string

## Direct Message
  Direct Messages: object
    ChatHistory: {}            (empty-object encoding)
  Group Chat: object
    GroupChat: {}              (empty-object encoding)
  Tako Chat History: object
    TakoChatHistoryList: list  [count≈1]
      - Chat Title: string
      - Messages: list of { Date: date[... UTC], Content: object }

## Income+ Wallet
  Coin Purchase History: object
    CoinPurchaseHistoryList: list  [count≈2]
      - Date: date[YYYY-MM-DD HH:MM:SS]
      - Type: string
      - CoinAmount: int
  Transaction History: object
    TransactionsList: null     (null encoding)

## Likes and Favorites
  Collection: {}               (empty-object encoding)
  Favorite Collection: object
    FavoriteCollectionList: list  [count≈4]
      - Date: date[YYYY-MM-DD HH:MM:SS]
      - FavoriteCollection: string
  Favorite Comment: object
    FavoriteCommentList: []    (empty-list encoding)
  Favorite Drama: {}           (empty-object encoding)
  Favorite Effects: object
    FavoriteEffectsList: list  [count≈1]
      - Date: date[YYYY-MM-DD HH:MM:SS]
      - EffectLink: string
  Favorite Hashtags: object
    FavoriteHashtagList: []     (empty-list encoding)
  Favorite Location: object
    FavoriteLocationList: []    (empty-list encoding)
  Favorite Movies and TV: object
    FavoriteMoviesAndTVList: [] (empty-list encoding)
  Favorite Playlists: object
    FavoritePlaylistList: []    (empty-list encoding)
  Favorite Sounds: object
    FavoriteSoundList: list  [count≈4]
      - Date: date[YYYY-MM-DD HH:MM:SS]
      - Link: string
  Favorite Videos: object
    App: int
    FavoriteVideoList: list  [count≈1843]
      - Date: date[YYYY-MM-DD HH:MM:SS]
      - Link: string
  Like List: object
    App: int
    ItemFavoriteList: list  [count≈3491]   # lowercase keys!
      - date: date[YYYY-MM-DD HH:MM:SS]
      - link: string

## Location Review
  Location Reviews: object
    ReviewsList: null          (null encoding)

## Post
  Posts: object
    VideoList: null            (null encoding)
  Recently Deleted Posts: object
    PostList: []               (empty-list encoding)
  Story: {}                    (empty-object encoding)

## Profile And Settings
  AI-Moji: object
    CreateDate: string
    AIMojiList: null           (null encoding)
  AISelfImage: {}              (empty-object encoding)
  Autofill: object
    PhoneNumber, Email, FirstName, LastName, Address, ZipCode, Unit, City, State, Country : string  (each "N/A" when empty)
  Block List: object
    App: int
    BlockList: null            (null encoding)
  Follower: object
    App: int
    IsFastLane: bool
    FansList: []               (empty-list encoding)
  Following: object
    App: int
    IsFastLane: bool
    Following: list  [count≈147]
      - Date: date[YYYY-MM-DD HH:MM:SS]
      - UserName: string
  Off TikTok Activity: object            # DUPLICATED (see §1.6)
    OffTikTokActivityDataList: null      (null encoding)
  Profile Info: object
    App: int
    ProfileMap: object
      PlatformInfo: list of { Description, Name, Platform, "Profile Photo" : string }
      accountRegion: string (2-letter)
      aiSelf: string (long)
      bioDescription: string
      birthDate: string
      displayName: string
      emailAddress: string
      followerCount: int
      followingCount: int
      fundraiser: string ("N/A")
      inferredGender: string ("None")
      instagramLink: string
      lemon8Link: string
      likesReceived: string ("None")
      profilePhoto: string (URL)
      profileVideo: string ("None")
      telephoneNumber: string ("None")
      userName: string
      youtubeLink: string
  ProfileViews: object
    ProfileViewList: null      (null encoding)
  Settings: object
    App: int
    SettingsMap: object  (25 keys)
      Allow DownLoad, Allow Others to Find Me, Allow Reuse of Content, App Language,
      Autofill contact information, Autofill payment information : string
      Content Preferences: object
        Keyword filters for videos in Following feed: []   (empty-list encoding)
        Keyword filters for videos in For You feed: []     (empty-list encoding)
        Video Languages Preferences: []                    (empty-list encoding)
      Family Content Preferences: {}                       (empty-object encoding)
      FamilyPairing: list of { FPAccountType, LinkedAccountUsername : string ("N/A") }
      Filter Comments, Interests, Personalized Ads, Private Account : string
      Push Notification: object
        Desktop notification, New Comments on My Video, New Fans, New Likes on My Video : string
      ScreenTime: list of { DailyScreenTimeLimit, DailyScreenTimeToggleStatus,
                            SleepHoursDuration, SleepHoursToggleStatus,
                            WeeklyScreenTimeUpdatesToggleStatus : string }
      Suggest your account to Facebook friends / to contacts / to people who open or send links to you : string
      Web Language : string ("N/A")
      Who Can Duet With Me, Who Can Post Comments, Who Can Send Me Message,
      Who Can Stitch with your videos, Who Can View Videos I Liked : string
      "Who can see your following list::" : string          # malformed key, keep verbatim (§1.7)

## TikTok Live
  Go Live History: object
    GoLiveList: null           (null encoding)
  Go Live Settings: object
    SettingsMap: object  (11 keys, mostly "N/A"/"On"; one empty-list; one null)
  Watch Live History: object
    WatchLiveMap: <MAP keyed by opaque numeric ID>  [count≈15]   # §1.5
      "<19-digit id>": object
        Comments: list of { CommentTime: date, CommentContent: string, RawTime: int }
        Questions: null        (null encoding)
        WatchTime: date[YYYY-MM-DD HH:MM:SS]
        Link: string
  Watch Live Settings: object
    WatchLiveSettingsMap: { app: string, web: string }
    MostRecentModificationTimeInApp: string
    MostRecentModificationTimeInWeb: string

## TikTok Shop                  # every section null in source (shop unused)
  Communication With Shops      → CommunicationHistories: null
  Current Payment Information    → PayCard: null
  Customer Support History       → CustomerSupportHistories: null
  Order Dispute History          → OrderDisputeHistories: null
  Order History                  → OrderHistories: null
  Product Browsing History       → ProductBrowsingHistories: null
  Product Reviews                → ProductReviewHistories: null
  Returns and Refunds History    → ReturnAndRefundHistories: null
  Saved Address Information       → SavedAddress: null
  Shopping Cart List             → ShoppingCart: null
  TikTokFavoriteItem             → TikTokFavoriteItemResult → TikTokFavoriteItemList: null
  Vouchers                       → Vouchers: null

## Your Activity
  Activity Summary: object
    ActivitySummaryMap: { note: string,
                          videosCommentedOnSinceAccountRegistration: int,
                          videosSharedSinceAccountRegistration: int,
                          videosWatchedToTheEndSinceAccountRegistration: int }
  Ad Interests: object
    AdInterestCategories: string ("" when empty; populated shape UNVERIFIED — §3)
  Ads Visit History: object
    AdsVisitHistoryList: list  [count≈2]
      - CreateTime: date[YYYY-MM-DD HH:MM:SS]
      - AdTitle: string
      - AdLink: string (long tracking URL)
  Donation: object       → DonationList: null
  Fundraiser: object     → FundraiserList: null
  Hashtag: object        → HashtagList: null
  Instant Form Ads Responses: object → ResponsesList: null   (UNVERIFIED if populated — §3)
  Login History: object
    LoginHistoryList: list  [count≈345]
      - Date: date[YYYY-MM-DD HH:MM:SS]
      - IP: string
      - DeviceModel: string
      - DeviceSystem: string
      - NetworkType: string
      - Carrier: string ("" when empty)
  Mini Drama Watch History: {}   (empty-object encoding)
  Off TikTok Activity: object    → OffTikTokActivityDataList: null   # DUPLICATED (§1.6)
  Purchases: object
    SendGifts: { SendGifts: null }
    BuyGifts:  { BuyGifts: null }
  Reposts: object
    RepostList: list  [count≈12]
      - Date: date[YYYY-MM-DD HH:MM:SS]
      - Link: string
  Searches: object
    SearchList: list  [count≈134]
      - Date: date[YYYY-MM-DD HH:MM:SS]
      - SearchTerm: string
  Share History: object  → ShareHistoryList: null
  Status: object
    Status List: list  [count≈37]
      - Resolution: string
      - App Version: string
      - IDFA: string (UUID-shaped)
      - GAID: string ("" common)
      - Android ID: string ("" common)
      - IDFV: string (UUID-shaped)
      - UID: int
      - DID: string (19-digit-ish)
      - Web ID: string ("" common)
  Stickers: object       → StickerList: null
  Watch History: object
    VideoList: list  [count≈9339]   # the largest section; drives --volume
      - Date: date[YYYY-MM-DD HH:MM:SS]
      - Link: string
      - Title: string ("" common)
```
