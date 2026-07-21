// LA LANGUE COURANTE, VUE D'UN ÎLOT — et pourquoi elle se lit dans le DOM.
//
// Les composants sont des îlots `client:only` (ADR-0002) : ils ne rendent QUE dans le navigateur,
// et ne reçoivent donc jamais `Astro.currentLocale`, qui n'existe qu'à la compilation. Il fallait
// leur donner la langue autrement.
//
// DEUX VOIES POSSIBLES, ET POURQUOI CELLE-CI. L'autre était de passer la langue en PROP depuis
// chaque page, puis de la faire descendre — `LandingPage` → `SiteHeader`, `ResultsView` → ses
// sections, et ainsi de suite. Ça marche, et ça oblige chaque composant intermédiaire à porter une
// donnée dont il ne fait rien : le genre de prop qu'on oublie de brancher sur le nouveau composant,
// six mois plus tard, sans que rien ne le dise.
//
// La page PUBLIE déjà sa langue : `<html lang>`. La lire est un appel, pas une plomberie.
//
// LE CONTRAT, ET CE QUI LE TIENT. Si l'attribut `lang` du document ment, TOUS les liens des îlots
// mentent — silencieusement, puisque hreflang, canonical et sitemap se calculent côté serveur et
// restent, eux, corrects. Ce contrat ne tient donc pas tout seul : il tient parce que les pages
// DÉRIVENT cet attribut de `Astro.currentLocale`, c'est-à-dire de leur dossier, au lieu de l'écrire.
// Une page qui le réécrirait en dur casserait ce fichier à distance ; `i18n/locales.test.ts` le
// refuse pour cette raison précise.
//
// EN NODE (les goldens de rendu), `document` est absent : on retombe sur la langue par défaut, de
// façon DÉTERMINISTE. Les goldens figent donc des liens `/fr`, ce qui est exactement ce qu'ils
// doivent figer tant que le français est la seule langue publiée.

import { DEFAULT_LOCALE, LOCALES, type Locale, localePath } from './locales';

/** La langue de la page courante, lue sur `<html lang>`. Retombe sur la langue par défaut hors navigateur. */
export function currentLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const lang = document.documentElement.lang;
  // Une langue inconnue (attribut absent, mal écrit) ne doit pas fabriquer des URLs mortes : mieux
  // vaut des liens vers la langue par défaut que des liens vers `/undefined`.
  return (LOCALES as readonly string[]).includes(lang) ? (lang as Locale) : DEFAULT_LOCALE;
}

/**
 * Le lien d'une page dans la langue courante : `localeHref('/analyse')` → `/fr/analyse`.
 *
 * NE PAS l'utiliser pour une ancre (`#sec-activite`) ni pour un asset (`/logo.png`) : ces deux-là
 * n'ont pas de langue. Une ancre préfixée quitterait la page ; un asset préfixé ne se chargerait pas.
 */
export function localeHref(path: string): string {
  return localePath(currentLocale(), path);
}

/**
 * Le chemin de la page courante SANS sa langue, query comprise : sur `/fr/analyse?demo`, rend
 * `/analyse?demo`. C'est ce qu'il faut pour proposer LA MÊME page dans une autre langue.
 *
 * La query est gardée, et ce n'est pas un détail : la laisser tomber ferait basculer le parcours de
 * démonstration vers le dépôt d'un vrai export — changer de langue mettrait la personne devant un
 * écran qui lui demande ses données.
 *
 * Hors navigateur, rend `/` : les goldens rendent donc un sélecteur pointant vers l'accueil.
 */
export function currentPath(): string {
  if (typeof window === 'undefined') return '/';
  const { pathname, search } = window.location;
  const locale = currentLocale();
  const stripped = pathname.startsWith(`/${locale}`) ? pathname.slice(locale.length + 1) : pathname;
  // `/fr` nu laisse une chaîne vide ; `/fr/analyse/` laisse une barre finale qu'on ne réémet pas.
  const path = stripped.replace(/\/$/, '');
  return (path === '' ? '/' : path) + search;
}
