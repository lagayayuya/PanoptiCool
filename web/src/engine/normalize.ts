// Normalisation en tête de pipeline — entre `validate` et `computeInsights` (PANO-28 → PANO-30).
//
// POURQUOI. PANO-28 a complété le type d'entrée : les sections-listes peuplées portent leur
// encodage de vide `null` (`NullableList<T>` = `readonly T[] | null`, registre PANO-11). Les règles
// PANO-30, écrites quand ces listes étaient non-null, lisent `.length`/`.map` sans gérer `null`.
// Plutôt que disperser `?? []` dans 10 règles, on coalesce `null → []` à UN SEUL endroit, AVANT les
// règles : elles reçoivent désormais TOUJOURS des listes (`NormalizedExport`), leurs corps inchangés.
//
// SANS PERTE (vérifié à l'intégration). Aucune règle ne distingue `null` de `[]` : l'intention
// partagée est `null == [] == vide`. Quand une lecture d'absence a existé, elle testait
// `list === null || list.length === 0` — les deux cas dans la même branche. Coalescer ne perd donc
// aucun signal ; ce qui distingue une absence, c'est (chemin de section × est-vide), jamais l'encodage
// `null`/`[]` que le contrat autorise (§1.2).
//
// PORTÉE. On coalesce les 15 sections `NullableList` (items connus). Les `UnverifiedNullableList`
// (boutique, etc.) restent telles quelles : les rares règles qui les lisent gardent déjà leur garde
// `=== null` (absence l.99). « Un seul helper » = `list()` ci-dessous, appliqué ici et nulle part ailleurs.

import type { TikTokExport, WatchHistoryItem, YourActivityCategory } from './tiktok-export';

/** `x ?? []` typé : section-liste à vide `null` → liste (non-null). Helper unique de coalescence. */
function list<T>(x: readonly T[] | null): readonly T[] {
  return x ?? [];
}

/** Item de visionnage réduit à sa DATE — la seule projection que `normalizeExport` lit (`.Date`),
 * et exactement ce que le parseur en flux (PANO-91, `ingest/`) produit sans jamais tenir `Link`/`Title`. */
type WatchDateItem = Pick<WatchHistoryItem, 'Date'>;

/**
 * Entrée de `normalizeExport` : le contrat `TikTokExport`, mais `Watch History → VideoList` ÉLARGI pour
 * admettre aussi la liste dates-only du parseur en flux. `WatchDateItem` est un SUPER-type de
 * `WatchHistoryItem` → `TikTokExport` reste assignable à `NormalizableExport` (le pipeline classique
 * `JSON.parse` → valibot → normalize n'est pas touché), et la sortie streaming (dates-only) l'est aussi.
 */
export type NormalizableExport = Omit<TikTokExport, 'Your Activity'> & {
  readonly 'Your Activity': Omit<YourActivityCategory, 'Watch History'> & {
    readonly 'Watch History': { readonly VideoList: readonly WatchDateItem[] | null };
  };
};

/**
 * Projette Watch History sur ses seules DATES (PANO-91, empreinte mémoire mobile). Watch History est
 * la plus grosse section (§0, pilote `--volume` — 10⁴–10⁵ items) ; or les seules lectures en aval
 * sont `.Date` (rythme horaire, compteurs, temps estimé — `activity-rhythm`) et `.length` (mur
 * d'opacité, absence). `Link`/`Title` ne sont JAMAIS lus. On réduit donc chaque item `{Date,Link,
 * Title}` à `{Date}` : les URL/titres (≈ 2/3 du poids de la section) deviennent collectables AVANT
 * les règles, ce qui borne l'empreinte retenue au volume réel de l'export. Le pic transitoire du
 * `JSON.parse` initial reste, lui, incompressible — mais il ne s'ajoute plus à la rétention des règles.
 * `null → []` comme `list()`.
 */
function watchDates(x: readonly WatchDateItem[] | null): readonly WatchDateItem[] {
  return x === null ? [] : x.map((item) => ({ Date: item.Date }));
}

/**
 * Coalesce les 15 sections-listes `NullableList` (`null → []`) d'un export validé, à l'entrée du
 * moteur. Le résultat (`NormalizedExport`) garantit aux règles des listes non-null. Idempotent.
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

/** Export après normalisation : les 15 sections-listes `NullableList` y sont non-null. Type d'entrée des règles. */
export type NormalizedExport = ReturnType<typeof normalizeExport>;
