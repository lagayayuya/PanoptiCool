// Wording du MOTEUR — LE SÉLECTEUR. Aucune prose ne vit ici.
//
// TROIS FICHIERS, UN PÉRIMÈTRE (structure ratifiée par yuya, lot i18n-EN) :
//   - `wording.fr.ts` — la prose française. ORACLE DE FORME : le type du bundle en est dérivé.
//   - `wording.en.ts` — la prose anglaise, annotée `WordingBundle`.
//   - CE FICHIER — la résolution `(locale, clé) → texte`, et rien d'autre.
//
// L'obligation de CLAUDE.md est qu'on puisse relire d'une traite TOUT ce que la machine ose déduire.
// Une table entrelacée `{fr, en}` par entrée se relirait deux fois à moitié — le relecteur anglais
// sauterait une ligne sur deux, et le français qu'il ne lit pas est précisément ce à quoi il devrait
// comparer. Un fichier par langue garde la propriété qui compte, et la double.
//
// ─── LA PARITÉ EST TENUE PAR LE COMPILATEUR, DANS LES DEUX SENS ─────────────────────────────────
// `WordingBundle = typeof FR` ; `wording.en.ts` s'en annote. Une entrée ajoutée en français et
// oubliée en anglais ne compile pas ; une clé anglaise qui n'existe pas en français non plus.
// C'est ce qui rend ce lot sûr à mener pendant que le lexique bouge ailleurs : une lecture ratifiée
// dans trois semaines NE PEUT PAS partir non traduite.
//
// ⚠ LA CONDITION QUI TIENT CETTE GARANTIE NE SE VOIT PAS À LA LECTURE. Elle tient au fait que les
// tables de `wording.fr.ts` sont des LITTÉRAUX NON ANNOTÉS. Les annoter
// `Readonly<Record<string, string>>` — le réflexe naturel, et ce que faisait l'ex-fichier
// monolingue — efface les clés du type : une table anglaise VIDE compilerait alors sans une erreur
// (mesuré). `wording-parity.test.ts` épingle la garantie pour qu'elle ne puisse pas tomber en
// silence ; c'est sa raison d'être unique.
//
// POURQUOI UN PARAMÈTRE `locale` ET NON UNE LANGUE AMBIANTE. `ui/copy.ts` lit la langue de la page
// une fois, au chargement du module (`<html lang>`, cf. `i18n/current.ts`). Le moteur NE PEUT PAS :
// il passe la 2ᵉ passe `tsc -p src/engine/tsconfig.json`, sans DOM, et n'a donc pas de `document` à
// lire. L'asymétrie entre les deux périmètres est de PRINCIPE, pas de commodité.

import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import type { SensitiveLabel } from './lexicon/types';
import { EN } from './wording.en';
import { FR } from './wording.fr';

/** La forme d'un bundle de wording — dérivée du français, qui est l'oracle. */
export type WordingBundle = typeof FR;

const BUNDLES: Record<Locale, WordingBundle> = { fr: FR, en: EN };

function bundle(locale: Locale): WordingBundle {
  // `?? BUNDLES[DEFAULT_LOCALE]` n'est pas de la paranoïa défensive : `Locale` est une union fermée,
  // mais la langue traverse la frontière du worker en `postMessage`, où le type ne survit pas. Une
  // langue inconnue rend du français plutôt qu'un plantage — même arbitrage qu'`i18n/current.ts`.
  return BUNDLES[locale] ?? BUNDLES[DEFAULT_LOCALE];
}

/** Repli VISIBLE d'une clé de lexique non routée — jamais une chaîne vide silencieuse, pour qu'une
 * dérive lexique/wording saute aux yeux plutôt que de rendre un blanc. */
export const MISSING_WORDING_PREFIX = '[gabarit manquant : ';

function resolve(table: Readonly<Record<string, string>>, key: string): string {
  return table[key] ?? `${MISSING_WORDING_PREFIX}${key}]`;
}

// --- CLAIMS ------------------------------------------------------------------------------------
// Le claim est la SEULE ligne rendue (PANO-56) : c'est sur lui que porte le garde-fou de doctrine
// « jamais de verdict sur la personne » (propriété (c) de `wording.test.ts`). Style ÉPURÉ
// (décision yuya) : un SYNTAGME COURT sans sujet explicite — les comptes vivent dans les tuiles.

export function opacitySemanticWallClaim(locale: Locale): string {
  return bundle(locale).opacitySemanticWallClaim();
}

export function opacitySemanticWallExplainer(locale: Locale): string {
  return bundle(locale).opacitySemanticWallExplainer();
}

export function d1ConflictualNamedClaim(locale: Locale): string {
  return bundle(locale).d1ConflictualNamedClaim();
}

export function d2InterestClaim(locale: Locale, signalCount: number): string {
  return bundle(locale).d2InterestClaim(signalCount);
}

// --- RÉSOLVEURS --------------------------------------------------------------------------------

/** Nom court du sujet d'un signal sensible. */
export function sensitiveTopicName(locale: Locale, label: SensitiveLabel): string {
  return bundle(locale).sensitiveTopicName[label];
}

/** Texte d'une lecture, depuis la clé portée par le lexique sensible. */
export function readingText(locale: Locale, key: string): string {
  return resolve(bundle(locale).readings, key);
}

/**
 * Les clés de lecture DÉCLARÉES — pour que le filet puisse vérifier l'AUTRE sens de la couverture :
 * qu'aucun texte ratifié ne reste câblé à rien. Expose les clés, jamais les textes.
 *
 * Rendues depuis le FRANÇAIS, et c'est correct PARCE QUE la parité est tenue par le compilateur :
 * les deux bundles portent le même jeu de clés par construction, donc couvrir l'un couvre l'autre.
 * Ce raisonnement a un maillon invisible — si la parité tombait, ceci deviendrait faux en silence.
 * C'est exactement ce que `wording-parity.test.ts` épingle.
 */
export function readingKeys(): readonly string[] {
  return Object.keys(FR.readings);
}

export function hasReading(key: string): boolean {
  return key in FR.readings;
}

/** Texte du nom d'un thème, depuis la clé portée par le lexique d'intérêt. */
export function themeLabelText(locale: Locale, key: string): string {
  return resolve(bundle(locale).themeLabels, key);
}

/** Clés de libellé routées — pour le test de couverture D2. Voir `readingKeys` sur le FR. */
export function hasThemeLabel(key: string): boolean {
  return key in FR.themeLabels;
}

/** Texte d'un usage, depuis la clé portée par le lexique d'intérêt. */
export function usageText(locale: Locale, key: string): string {
  return resolve(bundle(locale).usages, key);
}

/** Clés d'usage routées — pour le test de couverture D2. Voir `readingKeys` sur le FR. */
export function hasUsage(key: string): boolean {
  return key in FR.usages;
}

/** Clés d'acteur routées — pour le test de couverture D2. Voir `readingKeys` sur le FR.
 *
 * ⚠ EXISTE PARCE QU'UNE ASSERTION MENTAIT. Le filet D2 vérifiait le routage d'un acteur en exigeant
 * `actorLabel(k) !== k` — « un vrai libellé, pas la clé ». En français les deux coïncidaient ; en
 * anglais, `advertiser` se traduit par `advertiser`, et l'assertion tombait sur une table pourtant
 * parfaitement routée. Elle vérifiait donc ce qu'elle ATTEIGNAIT (le texte diffère de la clé), pas
 * ce qu'elle AFFIRMAIT (la clé est routée) — les deux n'ont divergé qu'à la première langue où un
 * mot se traduit par lui-même. */
export function hasActorLabel(actor: string): boolean {
  return actor in FR.actorLabels;
}

/** Libellé d'un acteur ; repli sur la clé brute si inconnue (comportement conservé de `actorLabel`). */
export function actorLabel(locale: Locale, actor: string): string {
  const labels: Readonly<Record<string, string>> = bundle(locale).actorLabels;
  return labels[actor] ?? actor;
}
