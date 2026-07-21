// LES LANGUES DU SITE — et l'interrupteur qui décide lesquelles sont ALLUMÉES.
//
// DEUX LISTES, ET C'EST LE POINT DE CE FICHIER. Elles ne disent pas la même chose, et les
// confondre est l'erreur exacte que ce lot devait éviter :
//
//   - `LOCALES` — les langues DÉCLARÉES. C'est la SYMÉTRIE : le routage, `Astro.currentLocale`,
//     la présence du sélecteur de langue. Rien ici ne se lit sur le web.
//   - `PUBLISHED_LOCALES` — les langues CONSTRUITES et ASSUMÉES. C'est l'INTERRUPTEUR : hreflang,
//     canonical, alternates, sitemap, et l'état actif du sélecteur.
//
// La règle qui en découle, et qui doit tenir sans qu'on y pense : **tout ce qui est indexable lit
// `PUBLISHED_LOCALES`, tout ce qui est structurel lit `LOCALES`**. Un hreflang ou une entrée de
// sitemap qui nommerait une langue non publiée inviterait l'indexation d'une coquille — c'est
// précisément ce qu'un `<link rel="alternate">` sait provoquer tout seul.
//
// L'ANGLAIS A ÉTÉ ÉTEINT, PUIS ALLUMÉ (éteint le 2026-07-18, allumé le 2026-07-20). Il l'était
// pour une raison de fond et non par travail inachevé : l'analyse anglaise était DÉGRADÉE, et un
// site anglais dont l'analyse ne rend presque rien ne se lit pas « version en cours » — il se lit
// « il n'y a rien à voir ici », soit l'inverse exact de la thèse du produit, démontrée par le
// produit lui-même.
//
// CE QUI A CHANGÉ : les six lexiques sensibles portent désormais du vocabulaire anglais, et les
// deux périmètres ratifiables (`engine/wording.*`, `ui/copy.*`) ont leur versant EN complet.
//
// ⚠ CE QUI RESTE VRAI, MESURÉ À L'ALLUMAGE et non supposé : la parité de sortie n'est PAS acquise.
// Sur les deux personas de démo, à volume égal (38 items chacune), le français rend 2 constats
// sensibles + 2 thèmes, l'anglais 2 constats sensibles + 1 thème. L'écart tient à la fixture et non
// au lexique anglais — un des deux items « chats » de la persona EN ne porte aucun mot de chat, si
// bien que le plancher de répétition (2) n'est pas franchi ; le terme `kitten` du second, lui,
// matche bel et bien. La distinction compte : le zéro vient du PLANCHER, pas d'un trou de
// vocabulaire, et confondre les deux ferait chercher la correction au mauvais endroit.
//
// L'ORDRE DES DEUX GESTES, gardé ici parce qu'il vaut pour la PROCHAINE langue :
//   1. créer `src/pages/<langue>/` (les pages jumelles) ;
//   2. ajouter la langue à `PUBLISHED_LOCALES` ci-dessous.
// Le filet de cohérence (`locales.test.ts`) refuse l'ordre inverse : publier une langue sans
// pages, ou construire des pages non publiées, échoue bruyamment. C'est voulu — l'oubli qu'on
// veut rendre impossible, c'est un sitemap qui annonce une langue que personne n'a écrite.

/** Les langues DÉCLARÉES — routage et symétrie. La configuration Astro LIT cette liste ; elle ne la
 * recopie pas, et c'est pour ça qu'elles ne peuvent pas diverger. */
export const LOCALES = ['fr', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/** La langue servie à la racine, et celle vers laquelle `/` redirige. */
export const DEFAULT_LOCALE: Locale = 'fr';

/**
 * Les langues CONSTRUITES et indexables — l'interrupteur.
 * Tout ce qui s'adresse à un robot (hreflang, canonical, sitemap) se lit ICI, jamais dans `LOCALES`.
 */
export const PUBLISHED_LOCALES: readonly Locale[] = ['fr', 'en'];

/** `true` si la langue a des pages construites et assumées. */
export function isPublished(locale: Locale): boolean {
  return PUBLISHED_LOCALES.includes(locale);
}

/**
 * Le chemin d'une page DANS une langue : `('fr', '/analyse')` → `/fr/analyse`.
 *
 * `path` est le chemin SANS langue, tel qu'il s'écrivait avant ce lot (« / », « /analyse »,
 * « /analyse?demo »). La racine rend `/fr` et non `/fr/` — une seule forme d'URL, donc un seul
 * canonical possible.
 *
 * NE PAS lui passer une ancre (`#sec-activite`) ni un chemin d'asset (`/logo.png`) : ces deux-là
 * n'ont pas de langue, et les préfixer casserait respectivement la navigation interne et le
 * chargement des images.
 */
export function localePath(locale: Locale, path: string): string {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Les pages du site, en chemins SANS langue. L'espace d'URL du site est le produit de cette liste
 * par `PUBLISHED_LOCALES` — c'est ce que le sitemap déclare, et ce que le filet de cohérence
 * vérifie contre les fichiers réellement présents dans `src/pages/`.
 *
 * N'y entre que ce qui se VISITE et s'indexe : ni la racine (qui redirige et se canonise vers la
 * langue par défaut), ni les redirections des anciennes URLs.
 */
export const PAGE_PATHS = ['/', '/analyse', '/mentions-legales'] as const;

/** Le code BCP 47 attendu par `<html lang>` et `hreflang`. */
export const HTML_LANG: Record<Locale, string> = { fr: 'fr', en: 'en' };

/** Le code attendu par `og:locale`, qui exige la forme `langue_PAYS`. */
export const OG_LOCALE: Record<Locale, string> = { fr: 'fr_FR', en: 'en_US' };
