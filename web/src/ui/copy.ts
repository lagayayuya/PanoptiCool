// Copy de l'INTERFACE — LE SÉLECTEUR. Aucune prose ne vit ici.
//
// TROIS FICHIERS, UN PÉRIMÈTRE (même forme que `engine/wording.*`, structure ratifiée yuya) :
//   - `copy.fr.ts` — la prose française. ORACLE DE FORME : `UiCopy` en est dérivé.
//   - `copy.en.ts` — la prose anglaise, annotée `UiCopy`.
//   - CE FICHIER — le choix de la langue, et rien d'autre.
//
// ─── POURQUOI LA LANGUE SE RÉSOUT ICI, ET UNE SEULE FOIS ────────────────────────────────────────
// Les composants sont des îlots `client:only` : la page publie déjà sa langue sur `<html lang>`, et
// `i18n/current.ts` la lit. Cette langue est CONSTANTE pour la vie de la page — elle se résout donc
// à l'évaluation du module, et chaque groupe est ré-exporté tel quel.
//
// CE QUE CE CHOIX ACHÈTE, et c'est la raison de le préférer à un `copy(locale).header.wordmark` :
// AUCUN SITE D'APPEL NE BOUGE. `UI_HEADER.wordmark` reste `UI_HEADER.wordmark`, dans les dix-sept
// composants qui lisent ce fichier. Le lot ne produit donc pas des centaines de lignes de diff
// mécanique dans lesquelles une vraie modification se cacherait — et le rendu français reste
// identique PAR CONSTRUCTION : hors navigateur (goldens, `pages/index.astro` au build),
// `currentLocale()` retombe sur `DEFAULT_LOCALE`.
//
// ⚠ CE QUE ÇA COÛTE, ET QUI SE PAIE DANS LES TESTS. Rendre de l'anglais en Node suppose de poser
// `document.documentElement.lang` AVANT l'import de ce module, donc `vi.resetModules()` + import
// dynamique (`ui/format.test.ts` montre la manœuvre). ⚠ ELLE DOIT COUVRIR `format.ts` AUSSI : les
// deux fichiers portent un état de langue au niveau du module, et en oublier un rendrait un arbre
// anglais avec des NOMBRES FRANÇAIS — fine insécable U+202F, « 0 comment » au singulier. Un défaut
// invisible à l'œil, qu'un golden figerait sans que personne le lise.
//
// L'ASYMÉTRIE AVEC LE MOTEUR EST DE PRINCIPE. `engine/wording.ts` prend la langue en PARAMÈTRE : il
// passe la 2ᵉ passe `tsc` sans DOM et n'a pas de `document` à lire. Ici le DOM est permis, et la
// plomberie qu'on s'épargne (une prop traversant chaque composant intermédiaire) est précisément
// celle qu'on oublie de brancher sur le composant suivant, six mois plus tard.

import { currentLocale } from '../i18n/current';
import { EN } from './copy.en';
import { FR } from './copy.fr';

/** La forme du catalogue d'interface — dérivée du français, qui est l'oracle. */
export type UiCopy = typeof FR;

const B: UiCopy = currentLocale() === 'en' ? EN : FR;

export const UI_UNITS = B.UI_UNITS;
export const UI_BRAND = B.UI_BRAND;
export const UI_ROOT = B.UI_ROOT;
export const UI_HEADER = B.UI_HEADER;
export const UI_FOOTER = B.UI_FOOTER;
export const UI_LEARN = B.UI_LEARN;
export const UI_ACTIVITY = B.UI_ACTIVITY;
export const UI_TIME_ESTIMATE = B.UI_TIME_ESTIMATE;
export const UI_LANDING = B.UI_LANDING;
export const UI_CONSENT = B.UI_CONSENT;
export const UI_ANALYSE = B.UI_ANALYSE;
export const UI_CARD = B.UI_CARD;
export const UI_RESULTS = B.UI_RESULTS;
export const UI_LEARN_PANELS = B.UI_LEARN_PANELS;
export const UI_AI = B.UI_AI;
export const UI_AI_LEARN = B.UI_AI_LEARN;
export const UI_AI_MOBILE = B.UI_AI_MOBILE;
export const UI_NO_DEDUCTION = B.UI_NO_DEDUCTION;
