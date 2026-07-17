// Type d'entrée du moteur — donnée TikTok parsée (PANO-24, ADR-0004).
//
// = sortie du parser (unzip + JSON.parse, PANO-25) = entrée du moteur. Frontière d'ingest.
// La validation runtime de cette frontière (valibot) est une AUTRE pièce, PANO-26 : ce fichier
// ne fait QUE typer la forme. Il ne valide rien, ne normalise rien.
//
// POSTURE : miroir fidèle (option A, tranchée en session PANO-24). Le type transcrit le contrat
// de structure `docs/tiktok-export-schema.md` tel quel — 10 catégories, casse réelle des clés,
// encodages du vide (`""` / `null` / `{}` / `[]`) — et RIEN d'autre. Raisons :
//   - la validation vit à l'ingest (PANO-26) : un type fidèle = valibot a un seul job
//     (« l'export réel correspond-il au contrat ? »), sans valider ET transformer ;
//   - un type normalisé ferait fuiter des concepts de sortie (classification d'absence,
//     ADR-0004) dans l'entrée. La normalisation que le moteur voudra (dates parsées, etc.) est
//     une étape INTERNE explicite du moteur, jamais cuite dans ce type de frontière.
//   - le désordre laissé au moteur est couvert par strict++ (`noUncheckedIndexedAccess`,
//     accès défensif, ADR-0002) — pas de charge ajoutée.
//
// READONLY : l'entrée n'est pas au moteur de la muter — tout le type est `readonly` (profond).
//
// FIDÉLITÉ vs INVENTION (CLAUDE.md : « on n'invente aucun champ hors du contrat »). Le contrat
// ne vérifie pas tout : certaines sections ne sont observées que VIDES (boutique, ads-on, maps
// `{}`), leur forme peuplée est non vérifiée (§3). On NE l'invente pas — on la type via le
// vocabulaire `Unverified*` ci-dessous, jamais un nom de champ supposé. Invariant : chaque
// section non vérifiée porte son **encodage de vide précis** de §4 (`null` / `[]` / `{}`), jamais
// un `unknown` générique — c'est le signal par section que la validation d'ingest (PANO-26)
// consommera. Quand un vrai export révélera la forme peuplée, on étend contrat + type ; entre-temps
// valibot signale la divergence — son job.
//
// Clés REQUISES (non optionnelles) : le contrat §1.2 pose qu'une section sans donnée est
// *présente* (encodée vide), jamais omise. La sûreté face à une vraie déviation (section absente
// d'une autre version d'export) est du ressort de la validation d'ingest (PANO-26), pas du type.

// --- Primitives & encodages (contrat §1.1–§1.2) ----------------------------------------------

/**
 * Date brute, format dominant `YYYY-MM-DD HH:MM:SS` (contrat §1.1). Reste une `string` ici :
 * le parsing en `Date` est une étape interne du moteur, jamais à la frontière (garde-fou A).
 */
export type RawDate = string;

/**
 * Date brute, variante suffixée `… UTC` (contrat §1.1) — `Comment → CommentsList[].date` et
 * `Tako Chat History`. Distincte de `RawDate` par documentation seule (les deux sont `string`).
 */
export type RawDateUtc = string;

/**
 * Conteneur observé `null` à vide (§1.2/§4) ; encodage de vide = `null` (membre explicite, signal
 * PANO-26). Forme peuplée non vérifiée mais admise (§3), typée liste (cas dominant) — à raffiner
 * par section si un vrai export révèle un autre conteneur.
 */
export type UnverifiedNullableList = readonly unknown[] | null;

/** Conteneur de liste observé `[]` à vide (§1.2) ; encodage de vide = `[]`. Item non vérifié. */
export type UnverifiedList = readonly unknown[];

/** Conteneur objet observé `{}` à vide (§1.2) ; encodage de vide = `{}`. Clés non vérifiées si peuplé. */
export type UnverifiedObject = Readonly<Record<string, unknown>>;

/**
 * Liste à items CONNUS dont l'encodage de vide est `null` (registre PANO-11 ; §1.2 « la plupart
 * des sections → null »). Le contrat `docs/tiktok-export-schema.md` §4 montre ces sections
 * **peuplées** et reste **MUET sur leur encodage de vide** — PANO-24 avait typé l'état peuplé comme
 * total (oubli du vide), complété ici (PANO-28, golden `--empty` qui force `null`). `T[]` inclut
 * déjà `[]` ; `| null` ajoute l'encodage de vide réel de ces sections. Parallèle à items connus de
 * `UnverifiedNullableList`. **Ne PAS l'appliquer** aux sections qui vident en `[]`/`{}`
 * (cf. `UnverifiedList`/`UnverifiedObject`) : ce silence du §4 a déjà fait diverger PANO-11/PANO-24
 * — erratum au contrat à classer (apprentissage→contrat).
 */
export type NullableList<T> = readonly T[] | null;

// --- Comment ---------------------------------------------------------------------------------

/** §1.3 : clés en minuscules (`date`/`comment`/…) — piège de casse. `date` au format `… UTC` (§1.1). */
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
    /** Sibling de métadonnée (§1.4). */
    readonly App: number;
    readonly CommentsList: NullableList<CommentItem>;
  };
}

// --- Direct Message --------------------------------------------------------------------------

/** `Content` : objet de forme non documentée au contrat → non vérifié. */
export interface TakoMessage {
  readonly Date: RawDateUtc;
  readonly Content: UnverifiedObject;
}

export interface TakoChatHistoryItem {
  readonly 'Chat Title': string;
  readonly Messages: readonly TakoMessage[];
}

export interface DirectMessageCategory {
  /** `ChatHistory: {}` dans la source ; map (par interlocuteur) probable si peuplée — non vérifiée. */
  readonly 'Direct Messages': { readonly ChatHistory: UnverifiedObject };
  /** `GroupChat: {}` dans la source — non vérifié si peuplé. */
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
  /** `TransactionsList: null` dans la source — encodage de vide `null` ; item non vérifié. */
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

/** §1.3 : clés en minuscules (`date`/`link`) — un parser keyé sur `Date` rate silencieusement les likes. */
export interface LikeItem {
  readonly date: RawDate;
  readonly link: string;
}

export interface LikesAndFavoritesCategory {
  /** `{}` dans la source — non vérifié si peuplé. */
  readonly Collection: UnverifiedObject;
  readonly 'Favorite Collection': {
    readonly FavoriteCollectionList: NullableList<FavoriteCollectionItem>;
  };
  /** `[]` dans la source — encodage de vide `[]` ; item non vérifié. */
  readonly 'Favorite Comment': { readonly FavoriteCommentList: UnverifiedList };
  /** `{}` dans la source — non vérifié si peuplé. */
  readonly 'Favorite Drama': UnverifiedObject;
  readonly 'Favorite Effects': { readonly FavoriteEffectsList: NullableList<FavoriteEffectItem> };
  /** `[]` dans la source — encodage de vide `[]` ; item non vérifié. */
  readonly 'Favorite Hashtags': { readonly FavoriteHashtagList: UnverifiedList };
  /** `[]` dans la source — encodage de vide `[]` ; item non vérifié. */
  readonly 'Favorite Location': { readonly FavoriteLocationList: UnverifiedList };
  /** `[]` dans la source — encodage de vide `[]` ; item non vérifié. */
  readonly 'Favorite Movies and TV': { readonly FavoriteMoviesAndTVList: UnverifiedList };
  /** `[]` dans la source — encodage de vide `[]` ; item non vérifié. */
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
  /** `ReviewsList: null` dans la source — encodage de vide `null` ; item non vérifié. */
  readonly 'Location Reviews': { readonly ReviewsList: UnverifiedNullableList };
}

// --- Post ------------------------------------------------------------------------------------

export interface PostCategory {
  /**
   * `VideoList: null` dans la source ; les vidéos publiées vivent ici (contrat §0) mais leur
   * forme d'item n'est PAS documentée au §4 → non vérifiée. À ne pas confondre avec
   * `Your Activity → Watch History → VideoList` (forme connue, distincte).
   */
  readonly Posts: { readonly VideoList: UnverifiedNullableList };
  /** `PostList: []` dans la source — encodage de vide `[]` ; item non vérifié. */
  readonly 'Recently Deleted Posts': { readonly PostList: UnverifiedList };
  /** `{}` dans la source — non vérifié si peuplé. */
  readonly Story: UnverifiedObject;
}

// --- Profile And Settings --------------------------------------------------------------------

/** `PlatformInfo` : items de liens cross-plateforme. `"Profile Photo"` = clé à espace (§1.3). */
export interface PlatformInfoItem {
  readonly Description: string;
  readonly Name: string;
  readonly Platform: string;
  readonly 'Profile Photo': string;
}

/**
 * `ProfileMap` : champs de profil à fort signal (§1.8) — matière brute du miroir satirique.
 * Tout `string` au niveau type ; les sentinelles `"N/A"`/`"None"`/`""` sont des *valeurs*
 * (le moteur les interprète), pas des variantes de type. `followerCount`/`followingCount` = int.
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
 * `Off TikTok Activity` est DUPLIQUÉE (§1.6) : présente sous `Profile And Settings` ET
 * `Your Activity`. Foyer de type unique, référencé aux deux endroits. `…DataList: null` à vide.
 */
export interface OffTikTokActivitySection {
  readonly OffTikTokActivityDataList: UnverifiedNullableList;
}

export interface ProfileAndSettingsCategory {
  /** `AIMojiList: null` à vide — encodage `null` ; item non vérifié. `CreateDate` = `string` (peut être `""`). */
  readonly 'AI-Moji': { readonly CreateDate: string; readonly AIMojiList: UnverifiedNullableList };
  /** `{}` dans la source — non vérifié si peuplé. */
  readonly AISelfImage: UnverifiedObject;
  /** Champs `string` (chacun `"N/A"` à vide). */
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
  /** `BlockList: null` à vide — encodage `null` ; item non vérifié. */
  readonly 'Block List': { readonly App: number; readonly BlockList: UnverifiedNullableList };
  /** `FansList: []` à vide — encodage `[]` ; item non vérifié. `IsFastLane` sibling (§1.4). */
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
  /** `ProfileViewList: null` à vide — encodage `null` ; item non vérifié. */
  readonly ProfileViews: { readonly ProfileViewList: UnverifiedNullableList };
  /**
   * `SettingsMap` (25 clés) : opaque `Record<string, unknown>` = **périmètre différé conscient
   * (YAGNI), PAS un manque de fidélité**. Le contrat §4 spécifie bien ce sous-arbre (clés plates +
   * `Content Preferences`/`Push Notification`/`ScreenTime`/`FamilyPairing`, encodages, et la clé
   * malformée `"Who can see your following list::"` §1.7). On ne le type pas car aucun réglage
   * n'est lu en v1 : typer+valider l'arbre = bloat + sur-rejet valibot (clés variables par
   * région/version). **Repère §1.7 à préserver** : la clé malformée vit ICI ; un `Record<string,
   * unknown>` ne normalise aucune clé (le piège est donc respecté). À typer si un réglage devient lu.
   */
  readonly Settings: {
    readonly App: number;
    readonly SettingsMap: Readonly<Record<string, unknown>>;
  };
}

// --- TikTok Live -----------------------------------------------------------------------------

/** §1.5 : entrée de `WatchLiveMap`. `CommentTime` date, `RawTime` int. `Questions: null` à vide. */
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
  /** `GoLiveList: null` à vide — encodage `null` ; item non vérifié. */
  readonly 'Go Live History': { readonly GoLiveList: UnverifiedNullableList };
  /**
   * `SettingsMap` : 11 clés NON nommées au contrat (§4) → opaque `Record<string, unknown>` (on
   * n'invente pas de noms ; périmètre différé, réglages non lus en v1).
   */
  readonly 'Go Live Settings': { readonly SettingsMap: Readonly<Record<string, unknown>> };
  /**
   * §1.5 : MAP keyée par ID opaque numérique-string (19 chiffres), pas une liste.
   * `Record<string, …>` admet le `{}` vide.
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
 * Toutes les sections sont `null` dans la source (boutique inutilisée) et leur forme peuplée
 * n'est PAS vérifiée (§3-like). Clés conteneur transcrites verbatim ; valeur =
 * `UnverifiedNullableList` (encodage de vide `null` explicite, signal PANO-26 ; populée = liste,
 * à raffiner si un vrai export boutique apparaît).
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
  /** URL de tracking longue (§1.8). */
  readonly AdLink: string;
}

/** §1.8 : champs à fort signal (réseau / appareil). `Carrier` peut être `""`. */
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
 * §1.8 : identifiants appareil/publicité. `UID` = int distinct du `DID` (string « 19-digit-ish »).
 * `GAID`/`Android ID`/`Web ID` souvent `""`. `IDFA`/`IDFV` en forme UUID (mais `string` au type).
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
  /** Souvent `""` (lien opaque sans titre) — cf. le mur sémantique, README.md. */
  readonly Title: string;
}

export interface YourActivityCategory {
  readonly 'Activity Summary': { readonly ActivitySummaryMap: ActivitySummaryMap };
  /**
   * `AdInterestCategories` : `""` à vide (encodage de vide = sentinelle scalaire `""`, §1.8) ;
   * forme peuplée UNVERIFIED (§3, vraisemblablement une liste de catégories) — admise via
   * `readonly unknown[]`, sans inventer la forme d'item.
   */
  readonly 'Ad Interests': { readonly AdInterestCategories: string | readonly unknown[] };
  readonly 'Ads Visit History': { readonly AdsVisitHistoryList: NullableList<AdsVisitItem> };
  /** `DonationList: null` à vide — encodage `null` ; item non vérifié. */
  readonly Donation: { readonly DonationList: UnverifiedNullableList };
  /** `FundraiserList: null` à vide — encodage `null` ; item non vérifié. */
  readonly Fundraiser: { readonly FundraiserList: UnverifiedNullableList };
  /** `HashtagList: null` à vide — encodage `null` ; item non vérifié. */
  readonly Hashtag: { readonly HashtagList: UnverifiedNullableList };
  /** `ResponsesList: null` à vide — encodage `null` ; UNVERIFIED si peuplé (§3). */
  readonly 'Instant Form Ads Responses': { readonly ResponsesList: UnverifiedNullableList };
  readonly 'Login History': { readonly LoginHistoryList: NullableList<LoginHistoryItem> };
  /** `{}` dans la source — non vérifié si peuplé. */
  readonly 'Mini Drama Watch History': UnverifiedObject;
  /** Dupliquée (§1.6) — même type que sous `Profile And Settings`. */
  readonly 'Off TikTok Activity': OffTikTokActivitySection;
  /** `{ SendGifts: null }` / `{ BuyGifts: null }` — encodage `null` ; formes peuplées non vérifiées. */
  readonly Purchases: {
    readonly SendGifts: { readonly SendGifts: UnverifiedNullableList };
    readonly BuyGifts: { readonly BuyGifts: UnverifiedNullableList };
  };
  readonly Reposts: { readonly RepostList: NullableList<RepostItem> };
  readonly Searches: { readonly SearchList: NullableList<SearchItem> };
  /** `ShareHistoryList: null` à vide — encodage `null` ; item non vérifié. */
  readonly 'Share History': { readonly ShareHistoryList: UnverifiedNullableList };
  readonly Status: { readonly 'Status List': NullableList<StatusItem> };
  /** `StickerList: null` à vide — encodage `null` ; item non vérifié. */
  readonly Stickers: { readonly StickerList: UnverifiedNullableList };
  /** La plus grosse section (pilote `--volume`). `Title` souvent `""`. */
  readonly 'Watch History': { readonly VideoList: NullableList<WatchHistoryItem> };
}

// --- Racine ----------------------------------------------------------------------------------

/**
 * Export TikTok parsé — racine du JSON (`user_data_tiktok.json`). 10 catégories top-level
 * exactes (§0). Pas de `Ads and data` ni de `Video` au top-level (§0) : les pubs sont éparpillées
 * dans `Your Activity`, les vidéos sous `Post → Posts → VideoList`.
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
