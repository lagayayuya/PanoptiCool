// Test du mur sémantique (PANO-6) — les propriétés que `readOpacity` doit tenir.
//
// Couvre :
//   - aucun item opaque → `undefined` (sans mur, rien à révéler ; l'absence est une règle dédiée) ;
//   - la valeur est une projection-source en COMPTES seulement (`readableCount`/`opaqueCount`),
//     aucune valeur source verbatim, aucun verdict.
//
// PORTÉ À LA REFONTE A. Trois verrous ne sont pas traduits mais SUPPRIMÉS — ils ne portaient sur
// rien qui existe encore, et leur inventer un remplaçant ferait revenir le concept par la bande :
//   - `kind`/`ruleId` : l'union `Insight` et les registres sont retirés (A1). Le producteur a un nom
//     et un type de retour propres — il n'y a plus de discriminant à vérifier, le compilateur tient
//     ce que le `kind` gardait ;
//   - `confidence: { state: 'factual' }` : le factuel n'est plus un constat, c'est une donnée nommée
//     (`Opacity`). Il n'y a plus de confiance à graduer sur des comptes ;
//   - `claim`/`framing` = TemplateRef de l'allowlist : le claim d'opacity est un TEXTE CONSTANT
//     (aucun param n'y entrait), appelé directement par l'UI (`opacitySemanticWallClaim()`, A2). Il
//     n'est plus porté par la règle : il n'y a rien ici à en tester. Son texte est couvert par le
//     golden de rendu.
// Ce qui reste est ce que la règle fait réellement : compter, et se taire quand il n'y a rien.

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

/** Surcouche typée des conteneurs de liste mutés par les tests (le fixture les renvoie vides). */
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

/** Item de recherche synthétique (texte tapé = lisible hors-ligne). */
function search(term: string): SearchItem {
  return { Date: '2024-01-01 00:00:00', SearchTerm: term };
}

/** Item de commentaire synthétique (texte tapé = lisible hors-ligne ; clés minuscules §1.3). */
function comment(text: string): { date: string; comment: string } {
  return { date: '2024-01-01 00:00:00', comment: text };
}

/** Item de visionnage synthétique (lien opaque ; `Title` vide = muet). */
function watch(link: string): WatchHistoryItem {
  return { Date: '2024-01-01 00:00:00', Link: link, Title: '' };
}

/** Item de like synthétique (lien opaque ; clés minuscules §1.3). */
function like(link: string): LikeItem {
  return { date: '2024-01-01 00:00:00', link };
}

/** Item de favori vidéo synthétique (lien opaque). */
function favorite(link: string): FavoriteVideoItem {
  return { Date: '2024-01-01 00:00:00', Link: link };
}

/** Item de repost synthétique (lien opaque). */
function repost(link: string): RepostItem {
  return { Date: '2024-01-01 00:00:00', Link: link };
}

describe('readOpacity', () => {
  it('export entièrement vide (encodages de vide partout) → undefined (pas de mur, opaqueCount = 0)', () => {
    expect(readOpacity(normalizeExport(validTikTokExport()))).toBeUndefined();
  });

  it('items lisibles seuls (aucun opaque) → undefined (opaqueCount = 0, rien à révéler)', () => {
    const base = validTikTokExport() as MutableExport;
    base['Your Activity'].Searches.SearchList.push(search('chats mignons'), search('recette'));
    base.Comment.Comments.CommentsList.push(comment('trop bien'));
    expect(readOpacity(normalizeExport(base))).toBeUndefined();
  });

  it('au moins un item opaque → une valeur émise (ex-« un unique insight opacity »)', () => {
    const base = validTikTokExport() as MutableExport;
    base['Your Activity']['Watch History'].VideoList.push(watch('https://x/1'));
    expect(readOpacity(normalizeExport(base))).toBeDefined();
  });

  it('comptes : readable = recherches + commentaires, opaque = visionnages + likes + favoris + reposts', () => {
    const base = validTikTokExport() as MutableExport;
    // Lisibles : 2 recherches + 1 commentaire = 3.
    base['Your Activity'].Searches.SearchList.push(search('a'), search('b'));
    base.Comment.Comments.CommentsList.push(comment('c'));
    // Opaques : 2 visionnages + 1 like + 1 favori + 3 reposts = 7.
    base['Your Activity']['Watch History'].VideoList.push(watch('w1'), watch('w2'));
    base['Likes and Favorites']['Like List'].ItemFavoriteList.push(like('l1'));
    base['Likes and Favorites']['Favorite Videos'].FavoriteVideoList.push(favorite('f1'));
    base['Your Activity'].Reposts.RepostList.push(repost('r1'), repost('r2'), repost('r3'));

    expect(readOpacity(normalizeExport(base))).toEqual({ readableCount: 3, opaqueCount: 7 });
  });

  it('opaque présent même sans aucun lisible → readableCount = 0, valeur émise', () => {
    const base = validTikTokExport() as MutableExport;
    base['Likes and Favorites']['Like List'].ItemFavoriteList.push(like('l1'), like('l2'));
    expect(readOpacity(normalizeExport(base))).toEqual({ readableCount: 0, opaqueCount: 2 });
  });
});
