// Validation d'ingest — frontière de confiance (PANO-26, ADR-0004).
//
// Le JSON TikTok parsé (`data: unknown` de PANO-25) est NON FIABLE : c'est ICI qu'on le valide
// contre le contrat, pas ailleurs. La sortie validée est un `TikTokExport` (PANO-24).
//
// SOURCE DE VÉRITÉ = le type `TikTokExport` écrit à la main (PANO-24, contrat lisible). Ce schéma
// `valibot` en est le **miroir runtime**. Les deux sont tenus alignés par un **pont compile-time**
// (cf. `validateTikTokExport`), pas par convention.
//
// PONT (forward), réalisé par le type de retour de `validateTikTokExport` : `v.safeParse` rend
// `output: v.InferOutput<typeof TikTokExportSchema>`, qu'on retourne comme `data: TikTokExport`.
//   - GARANTIT : `InferOutput<Schema>` ⊆ `TikTokExport` — le schéma ne produit jamais hors-contrat
//     (drift « schéma plus large » → erreur de typecheck sur le `return`).
//   - NE GARANTIT PAS : l'équivalence stricte (un schéma plus *strict* que le contrat = faux rejets,
//     non signalé ici → attrapé par les golden tests PANO-28) ; le `readonly` (mutable assignable à
//     readonly → non re-enforcé au runtime) ; l'absence de `v.any()` permissif. Équivalence stricte =
//     pont bidirectionnel / `Equals<A, B>`. Non retenu en v1, assumé.
//
// CLÉS INCONNUES = SIGNAL (pas avalement). `v.object` ignore les clés hors-contrat (ne PAS rejeter :
// un vrai export d'une autre version en aurait, faux rejets). Mais une clé inconnue = la plateforme
// a peut-être ajouté un champ que le miroir ne montre pas encore : on la **compte/loggue en dev-only**
// (`collectUnknownKeyPaths`), jamais en silence. Cohérent avec « l'absence comme signal ».
//
// PRIVACY. La validation tourne sur l'export RÉEL. Tout ce qui sort d'ici (issues, warn dev) ne porte
// que des **chemins de clés + types attendus**, JAMAIS la valeur reçue (ni le message valibot par
// défaut, qui l'embarque). PII-safe par construction.

import * as v from 'valibot';
import type { TikTokExport } from './tiktok-export';

// --- Briques d'encodage (miroir du vocabulaire `Unverified*` de `tiktok-export.ts`) ----------

/** `null` à vide (§1.2) ; liste non vérifiée si peuplée. */
const unverifiedNullableList = v.nullable(v.array(v.unknown()));
/** `[]` à vide (§1.2) ; item non vérifié. */
const unverifiedList = v.array(v.unknown());
/** `{}` à vide (§1.2) ; clés non vérifiées si peuplé (ou sous-arbre différé, ex. `SettingsMap`). */
const unverifiedObject = v.record(v.string(), v.unknown());

// Listes à items CONNUS dont l'encodage de vide est `null` (registre PANO-11 ; §1.2 « la plupart
// → null ») : `v.nullable(v.array(item))` inline, miroir runtime de `NullableList<T>` (cf.
// tiktok-export.ts). Le §4 est muet sur le vide de ces sections peuplées → complété en PANO-28.

// --- Comment ---------------------------------------------------------------------------------

const commentItem = v.object({
  date: v.string(), // §1.3 minuscule, §1.1 format `… UTC`
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
const likeItem = v.object({ date: v.string(), link: v.string() }); // §1.3 minuscules

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

/** Dupliquée §1.6 — schéma unique référencé sous deux parents. */
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
  Settings: v.object({ App: v.number(), SettingsMap: unverifiedObject }), // §1.7 différé (cf. type)
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
  UID: v.number(), // §1.8 int, distinct du `DID` string
  DID: v.string(),
  'Web ID': v.string(),
});

const watchHistoryItem = v.object({ Date: v.string(), Link: v.string(), Title: v.string() });

/**
 * Exporté pour l'ingestion en flux (`ingest/ingest-stream.ts`, PANO-91) : elle réutilise ces entrées
 * pour bâtir un schéma « streamed » DRY où seul `Watch History → VideoList` est relâché en dates-only
 * (le tableau replié par le parseur en flux). Tout le reste du contrat reste validé à l'identique.
 */
export const yourActivityCategory = v.object({
  'Activity Summary': v.object({ ActivitySummaryMap: activitySummaryMap }),
  // §3 : `""` à vide ; peuplé UNVERIFIED (liste probable) → admis sans inventer l'item.
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

// --- Racine ----------------------------------------------------------------------------------

/** Miroir runtime du contrat `TikTokExport` (10 catégories §0). Clés requises → absente = échec. */
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

// --- Sortie & validation ---------------------------------------------------------------------

/** Issue de validation — **PII-safe** : chemin de clé + type attendu, jamais la valeur reçue. */
export interface ValidationIssue {
  /** Chemin pointé de la clé en faute (clés seulement). */
  path: string;
  /** Type attendu par le contrat à ce chemin. */
  expected: string;
}

/** Résultat de validation — union discriminée, plain-data (style `ParseResult` de PANO-25). */
export type ValidationResult =
  | { ok: true; data: TikTokExport }
  | { ok: false; issues: ValidationIssue[] };

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/**
 * Chemins des clés présentes dans `raw` mais retirées par `v.object` (donc hors-contrat).
 * Retourne des CHEMINS uniquement (jamais de valeur → PII-safe). Exporté pour les tests ;
 * appelé en dev-only par `validateTikTokExport`.
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
 * Valide `data` (JSON parsé non fiable) contre le contrat. Ne lève jamais. En dev, signale les
 * clés hors-contrat (chemins seulement). Le `return { ok: true, data: result.output }` EST le pont
 * forward : `result.output` (InferOutput) doit être assignable à `TikTokExport` (cf. en-tête).
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
