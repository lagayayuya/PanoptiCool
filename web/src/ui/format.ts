// Formatage des NOMBRES — LE seul endroit qui décide d'un séparateur, dans la langue de la page.
//
// POURQUOI CE FICHIER EXISTE. Le groupement des milliers était écrit À LA MAIN, deux fois, avec la
// MÊME regex — et deux séparateurs DIFFÉRENTS : `ActivitySection` posait une espace ASCII,
// `time-estimate` une fine insécable (U+202F). Le golden le montrait sans que personne le lise :
// « 50 000 » y était rendu à l'espace ASCII, et pas un seul U+202F n'y figurait. La divergence était
// LATENTE — l'estimation de temps ne dépasse jamais 1 000 h dans la persona, donc son séparateur
// n'était jamais rendu. Une duplication ne se contente pas de se répéter : elle se met à mentir, et
// le témoin ne le voit pas.
//
// La typographie FR distingue DEUX espaces, et c'est plus fin que ce qu'on écrit de mémoire :
// FINE insécable (U+202F) pour les milliers, mais insécable ORDINAIRE (U+00A0) devant « % ».
// Le code à la main ne posait ni l'une ni l'autre. `Intl.NumberFormat` suit CLDR et pose les deux au
// bon endroit — raison principale de ne plus les écrire soi-même.
//
// ─── CE FICHIER ÉTAIT ÉPINGLÉ SUR `fr-FR`, ET LES NOMS LE DISAIENT (lot i18n-EN) ────────────────
// Les six formateurs construisaient `Intl.NumberFormat('fr-FR')` EN DUR. En anglais, cela aurait
// rendu — mesuré, pas supposé :
//   « 50 000 » avec un U+202F là où l'anglais écrit « 50,000» ;
//   « 42 % » avec un U+00A0 là où l'anglais écrit « 42% » ;
//   « 0 comment » AU SINGULIER, parce que le français met zéro au singulier et l'anglais au pluriel.
// Le préfixe `fr` des noms (`frInt`, `frPercent`…) serait alors devenu un mensonge — d'où le
// renommage, qui n'est pas cosmétique : un nom qui ment coûte plus cher qu'un renommage mécanique.
//
// LA LANGUE SE RÉSOUT UNE FOIS, AU CHARGEMENT DU MODULE, comme dans `ui/copy.ts` et pour la même
// raison : elle est constante pour la vie de la page (`<html lang>`, cf. `i18n/current.ts`), et la
// passer en paramètre aurait réécrit 57 sites d'appel sans rien apprendre à personne.
//
// ⚠ CONSÉQUENCE POUR LES TESTS, et elle vaut aussi pour `ui/copy.ts` : rendre de l'anglais en Node
// suppose de poser `document.documentElement.lang` AVANT l'import du module, donc `vi.resetModules()`
// + import dynamique. En oublier UN des deux fichiers rendrait un arbre anglais avec des nombres
// français — un défaut invisible à l'œil, qu'un golden figerait sans que personne le lise.
//
// ⚠ CE QUE LE COUPLAGE À `Intl` COÛTE, et qui doit rester visible : la sortie dépend de la version
// d'ICU embarquée par Node. fr-FR n'émet U+202F qu'à partir d'ICU 72 (Node ≥ 18.1) ; avant, c'était
// U+00A0. Le golden de rendu fige donc, indirectement, une version d'ICU. Si la CI vire au rouge sur
// un séparateur invisible, c'est ICI qu'il faut regarder — le repli est un helper écrit à la main
// qui pose U+202F sans passer par `Intl`, déterministe et sans couplage.
//
// PAS ICI : les valeurs CSS (`EyeLogo` écrit `${ang.toFixed(1)}deg`). Le CSS exige le point
// décimal — le formater « à la française » produirait une déclaration invalide.

import { currentLocale } from '../i18n/current';
import type { Locale } from '../i18n/locales';

/** Le tag BCP 47 complet qu'`Intl` attend. `<html lang>` porte « fr »/« en » ; CLDR veut la RÉGION
 *  pour trancher les séparateurs (`en-US` groupe à la virgule, `en-IN` par lakhs). Aligné sur
 *  `OG_LOCALE`, qui déclare déjà `en_US` pour ce site. */
const INTL_TAG: Record<Locale, string> = { fr: 'fr-FR', en: 'en-US' };

const TAG = INTL_TAG[currentLocale()];

const INT = new Intl.NumberFormat(TAG, { maximumFractionDigits: 0 });
const ONE_DECIMAL = new Intl.NumberFormat(TAG, { maximumFractionDigits: 1 });
const PERCENT = new Intl.NumberFormat(TAG, { style: 'percent', maximumFractionDigits: 0 });

/** Entier groupé par milliers (« 50 000 » / « 50,000 »). Arrondi, comme les compteurs l'étaient. */
export function formatInt(n: number): string {
  return INT.format(Math.round(n));
}

/**
 * Nombre à UNE décimale au plus — entier quand il tombe rond.
 * Le « au plus » est le point : il évite « 1,0 jour » là où le singulier attend « 1 jour »
 * (`Number.isInteger` + `toFixed(1)` faisaient ce travail à la main, au point décimal près).
 */
export function formatDecimal(n: number): string {
  return ONE_DECIMAL.format(n);
}

const FIXED_ONE_DECIMAL = new Intl.NumberFormat(TAG, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * Nombre à EXACTEMENT une décimale — « 2,0 » et non « 2 ».
 *
 * ⚠ NE PAS CONFONDRE AVEC `formatDecimal`, dont c'est l'exact opposé, et les deux sont voulus :
 *   - `formatDecimal` laisse tomber la décimale nulle, parce que « 1 jour » se lit et « 1,0 jour » non ;
 *   - celle-ci la GARDE, pour une COLONNE de valeurs comparables (les tailles de modèles) où « 2 Go »
 *     au milieu de « 2,2 / 1,9 / 1,5 » casse l'alignement et suggère une précision différente.
 * La règle n'est donc pas « une décimale » mais « une décimale À CÔTÉ DE QUOI ».
 */
export function formatFixedDecimal(n: number): string {
  return FIXED_ONE_DECIMAL.format(n);
}

/**
 * Pourcentage à partir d'un RATIO (0–1). Insécable ordinaire (U+00A0) devant « % » en français,
 * rien du tout en anglais — c'est CLDR qui tranche, pas ce fichier.
 * ⚠ Prend un ratio, pas une valeur 0–100 : c'est la convention d'`Intl`, et la respecter évite
 * l'erreur de facteur 100 qu'une signature « percent(n: number) » invite.
 */
export function formatPercent(ratio: number): string {
  return PERCENT.format(ratio);
}

const PLURAL = new Intl.PluralRules(TAG);

/**
 * Accord en nombre — ⚠ LE FRANÇAIS MET 0 AU SINGULIER (« 0 commentaire »), L'ANGLAIS AU PLURIEL
 * (« 0 comments »). C'est exactement la raison d'utiliser `Intl.PluralRules` plutôt qu'un `n > 1`
 * écrit à la main : la règle est portée par CLDR, pas par la mémoire de qui écrit la ligne — et
 * elle CHANGE d'une langue à l'autre, sur le cas que personne ne teste.
 *
 * Remplace les esquives « commentaire(s) » — une parenthèse n'est pas un accord, c'est l'aveu de
 * ne pas l'avoir fait, et elle se lit à voix haute aussi mal qu'elle s'écrit.
 */
export function plural(n: number, one: string, many: string): string {
  return PLURAL.select(n) === 'one' ? one : many;
}
