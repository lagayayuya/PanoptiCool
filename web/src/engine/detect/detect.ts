// Cœur de détection lexicale (PANO-71) — GÉNÉRIQUE : `(textes + lexiques câblés) → détections
// par label`. Aucune donnée de label ici (elles vivent dans `engine/lexicon/`), aucun insight
// (la règle D1 est l'adaptateur Comments ; Searches sera un autre adaptateur, PANO-70 §1.6).
//
// C'EST LE FICHIER DE DOCTRINE. Il ne contient que les règles de SOIN — ce qui empêche de nommer
// quelqu'un à tort. La mécanique de repérage (« où ce marqueur est-il dans ce texte ? ») est
// extraite dans `matcher.ts` : elle est optimisée, mesurée (PANO-87), et sans opinion. Ici, on ne
// décide que d'une chose : ce qu'un hit VEUT DIRE.
//
// Les quatre comportements MESURÉS — c'est ici que vit la valeur (et le risque) du
// classifieur, pas dans les listes de mots :
//   1. frontières de mots (« malade » ⊄ « maladie », « psy » ⊄ « psychologie » inverse) ;
//   2. fenêtre de négation AVANT le marqueur, avec l'exception double-négation (verbe d'omission
//      + négation = AFFIRMATION : « je rate jamais la priere ») ;
//   3. citation / discours rapporté → attribué à autrui → hit supprimé ;
//   4. 3ᵉ personne (« mon ado », « pour ma soeur ») → DÉGRADÉ en indirect, JAMAIS supprimé —
//      c'est le chemin signal-sans-vécu (B3 : taguer quand même EST la démonstration, C2).
//
// L'ALLONGEMENT expressif (PANO-36) est traité ici parce que sa garde est un choix de doctrine : si
// le matching direct échoue, on re-tente dans l'espace SQUELETTISÉ, CONDITIONNÉ à un allongement
// ≥ 3 visible dans la surface matchée — « connnnard » matche « connard », mais « cône » (sans
// allongement) ne matchera jamais « conne ». C'est un problème de RAPPEL, pas un signal émotionnel :
// aucun effet sur la confiance (lire l'énervement serait classer l'intention, hors doctrine).
// Les autres tolérances de variation (tiret↔espace, auto-censure, pluriel) sont du repérage pur :
// `normalize-fr.ts` et `matcher.ts`.
//
// `conflictual` (item-level, B5) : insulte ÉMISE + cible 2ᵉ personne, hors citation ; juron de
// frustration sans cible exclu ; un seul étage, jamais d'indirect.

import type {
  DetectableLexicon,
  InterestLexicon,
  ItemLevelLexicon,
  TopicalLexicon,
} from '../lexicon/types';
import {
  CITATION_MARKERS,
  NEGATION_WINDOW,
  NEGATIONS,
  OMISSION_VERBS,
  THIRD_PERSON,
} from './filters';
import {
  canSelfDeclare,
  findMarker,
  findSelfDeclaration,
  normString,
  occursInsideQuotes,
} from './matcher';
import {
  collapseRuns,
  type NormalizedText,
  normalizeFr,
  skeletonize,
  surfaceForm,
} from './normalize-fr';

// --- Sortie ------------------------------------------------------------------------------------

export type DetectionStage = 'explicit' | 'indirect';

/** Contribution d'UN item (un commentaire) à UN label : son étage et ses formes de surface. */
export interface ItemHit {
  /** Index de l'item dans la liste d'entrée (clé de l'`EvidenceId` déterministe côté adaptateur). */
  itemIndex: number;
  /** Étage de CE hit d'item (un explicite en 3ᵉ personne arrive ici déjà dégradé en `indirect` ;
   * un hit d'intérêt est toujours `explicit`, D2 n'ayant qu'un étage). */
  stage: DetectionStage;
  /** Formes de surface matchées dans le texte ORIGINAL (→ `triggerTerms`, ⊂ texte au caractère près). */
  surfaces: string[];
  /** Ce hit vient-il d'une AUTO-DÉCLARATION (« je suis un vrai X ») ? Peuplé par les INTÉRÊTS (D2) où
   * il alimente le bonus de confiance ; laissé absent par les classifieurs sensibles (D1). */
  selfDeclared?: boolean;
}

/**
 * Détection agrégée d'un label : l'étage du tag et les items qui le portent (les preuves).
 * Générique sur le type de label (PANO-75, MÉCANIQUE UNIQUEMENT) : `SensitiveLabel` côté D1,
 * `string` (identité de thème) côté D2 — la machinerie ne fait que recopier `lexicon.label`, elle
 * n'interprète jamais sa valeur. Le défaut `string` couvre les usages qui ne lisent que `stage`/`items`.
 */
export interface LabelDetection<L extends string = string> {
  label: L;
  /** Étage AGRÉGÉ : `explicit` (≥ 1 item explicite) ou `indirect` (seuil d'items indirects atteint). */
  stage: DetectionStage;
  items: ItemHit[];
}

// --- Les filtres du soin -------------------------------------------------------------------------

function tokens(norm: string): string[] {
  return norm.match(/[\w'-]+/g) ?? [];
}

/**
 * Négation dans la fenêtre AVANT le marqueur — SAUF double négation « rate/manque jamais X »
 * (verbe d'omission + négation = AFFIRME X, mesuré PANO-33).
 */
function isNegated(norm: string, start: number): boolean {
  const before = tokens(norm.slice(0, start));
  const window = before.slice(-NEGATION_WINDOW);
  if (!window.some((t) => NEGATIONS.includes(t))) {
    return false;
  }
  const widened = before.slice(-(NEGATION_WINDOW + 2));
  return !widened.some((t) => OMISSION_VERBS.includes(t));
}

/** Discours rapporté (marqueur de citation présent) OU marqueur entre guillemets → attribué à autrui. */
function isCited(text: NormalizedText, marker: string): boolean {
  if (CITATION_MARKERS.some((c) => findMarker(text, c) !== null)) {
    return true;
  }
  return occursInsideQuotes(text, marker);
}

function hasThirdPerson(text: NormalizedText): boolean {
  return THIRD_PERSON.some((tp) => findMarker(text, tp) !== null);
}

// --- Espaces de matching --------------------------------------------------------------------------

/** Les deux espaces de matching d'un item : direct, et squelettisé (allongements, PANO-36). */
interface TextSpaces {
  full: NormalizedText;
  skeleton: NormalizedText;
}

/** Construit les espaces de matching d'un texte (une fois par item). */
function buildSpaces(text: string): TextSpaces {
  const full = normalizeFr(text);
  return { full, skeleton: skeletonize(full) };
}

/** Allongement expressif visible : ≥ 3 fois le même caractère d'affilée. */
const ELONGATION = /(.)\1\1/;

/**
 * Hit d'un marqueur DANS UN ESPACE : présent (frontière de mot), ni nié, ni cité. Retourne la
 * FORME DE SURFACE (découpée dans l'original via la carte d'offsets), ou `null`.
 * `requireElongation` = la garde du fallback squelette : la surface matchée doit porter un
 * allongement visible, sinon le squelette pourrait faire matcher « cône » sur « conne ».
 */
function hitIn(text: NormalizedText, marker: string, requireElongation: boolean): string | null {
  const pos = findMarker(text, marker);
  if (pos === null || isNegated(text.norm, pos.start) || isCited(text, marker)) {
    return null;
  }
  const surface = surfaceForm(text, pos.start, pos.end);
  if (requireElongation && !ELONGATION.test(surface)) {
    return null;
  }
  return surface;
}

/** Hit d'un marqueur : espace direct d'abord, fallback squelettisé (gardé) ensuite. */
function hitSurface(spaces: TextSpaces, rawMarker: string): string | null {
  const marker = normString(rawMarker); // défensif : les données sont déjà normalisées (mémoïsé)
  const direct = hitIn(spaces.full, marker, false);
  if (direct !== null) {
    return direct;
  }
  return hitIn(spaces.skeleton, collapseRuns(marker), true);
}

/** Surfaces des marqueurs qui hittent, dédupliquées, ordre des marqueurs préservé. */
function hitSurfaces(spaces: TextSpaces, markers: readonly string[]): string[] {
  const out: string[] = [];
  for (const marker of markers) {
    const surface = hitSurface(spaces, marker);
    if (surface !== null && !out.includes(surface)) {
      out.push(surface);
    }
  }
  return out;
}

/**
 * Surfaces des termes d'identité AUTO-DÉCLARÉS (PANO-72) : « je suis (un vrai) X ». Le span entier
 * (copule + modificateurs + terme) est la forme de surface, surlignable tel quel. Ni nié (la
 * négation brise le pattern), ni cité. Toujours explicite (la copule ancre la 1ʳᵉ personne).
 */
function hitSelfDeclared(spaces: TextSpaces, terms: readonly string[]): string[] {
  if (!canSelfDeclare(spaces.full)) {
    return []; // aucune copule de tête → le pattern ne peut pas matcher (court-circuit PANO-87)
  }
  const out: string[] = [];
  for (const rawTerm of terms) {
    const term = normString(rawTerm);
    const pos = findSelfDeclaration(spaces.full, term);
    if (pos === null || isCited(spaces.full, term)) {
      continue;
    }
    const surface = surfaceForm(spaces.full, pos.start, pos.end);
    if (!out.includes(surface)) {
      out.push(surface);
    }
  }
  return out;
}

// --- Classification par item ---------------------------------------------------------------------

/** Item → hit topical (B1/B3) : explicite à soi, sinon dégradé/indirect, sinon rien. */
function classifyTopicalItem(
  spaces: TextSpaces,
  lexicon: TopicalLexicon,
): Omit<ItemHit, 'itemIndex'> | null {
  // Auto-déclaration (« je suis X ») : toujours explicite, JAMAIS dégradée par la 3ᵉ personne —
  // la copule ancre la 1ʳᵉ personne (PANO-72). Un « je suis dépressif, comme ma fille » reste un
  // vécu explicite du locuteur.
  const selfDeclaredSurfaces = hitSelfDeclared(spaces, lexicon.selfDeclared ?? []);
  const explicitNudeSurfaces = hitSurfaces(spaces, lexicon.explicit);
  // Filtres contextuels (3ᵉ personne) : espace direct seul — pas de tolérance d'allongement sur
  // les mots-fonction, le gain serait nul et la surface de FP inutilement élargie.
  const third = hasThirdPerson(spaces.full);
  // Les termes nus explicites sont dégradés par la 3ᵉ personne (B3) ; l'auto-déclaration non.
  const explicitSurfaces = [
    ...selfDeclaredSurfaces,
    ...(third ? [] : explicitNudeSurfaces.filter((s) => !selfDeclaredSurfaces.includes(s))),
  ];
  if (explicitSurfaces.length > 0) {
    return { stage: 'explicit', surfaces: explicitSurfaces };
  }
  const indirectMarkers = lexicon.includeColloquial
    ? [...lexicon.indirectCore, ...lexicon.indirectColloquial]
    : lexicon.indirectCore;
  const indirectSurfaces = hitSurfaces(spaces, indirectMarkers);
  // Terme nu explicite en 3ᵉ personne → DÉGRADÉ en indirect (jamais nommé, jamais supprimé — B3).
  const degraded = third ? explicitNudeSurfaces : [];
  const surfaces = [...degraded, ...indirectSurfaces.filter((s) => !degraded.includes(s))];
  if (surfaces.length > 0) {
    return { stage: 'indirect', surfaces };
  }
  return null;
}

/** Item → hit conflictual (B5) : insulte émise + cible 2ᵉ personne, hors citation. */
function classifyConflictualItem(
  spaces: TextSpaces,
  lexicon: ItemLevelLexicon,
): Omit<ItemHit, 'itemIndex'> | null {
  if (CITATION_MARKERS.some((c) => findMarker(spaces.full, c) !== null)) {
    return null; // insulte RAPPORTÉE / reçue (« il m'a traite de… ») — hors-champ
  }
  const insultSurfaces = hitSurfaces(spaces, lexicon.insults);
  if (insultSurfaces.length === 0) {
    return null;
  }
  // Cible 2ᵉ personne : espace direct seul (mots-fonction, cf. classifyTopicalItem).
  const targeted = lexicon.targets.some((t) => findMarker(spaces.full, normString(t)) !== null);
  // Sans cible 2ᵉ personne = juron de frustration (« putain ce bug ») → exclu.
  return targeted ? { stage: 'explicit', surfaces: insultSurfaces } : null;
}

/**
 * Item → hit d'INTÉRÊT (D2, PANO-75 ; co-occurrence PANO-76) : un marqueur présent (frontière de
 * mot), ni nié, ni cité. Forme SIMPLIFIÉE de `classifyTopicalItem` — AUCUN appel à `hasThirdPerson` :
 * l'absence de dégradation 3ᵉ personne EST la règle « un intérêt reste un intérêt » (parler d'autrui
 * signale le même thème). Toujours `explicit` (un seul étage). `selfDeclared` remonté pour le bonus.
 *
 * DÉSAMBIGUÏSATION PAR CO-OCCURRENCE (collecte-puis-filtre, compatible passe unique PANO-87) : on
 * récupère TOUS les hits bruts de l'item (solo, ancrés, auto-déclarés), puis on garde les marqueurs
 * ANCRÉS (ambigus) SEULEMENT si un compagnon du domaine co-occurre — un solo/selfDeclared (signal
 * fort), ou un AUTRE ancré (deux 50/50 ensemble valent le domaine). Les ancrés isolés sont écartés.
 */
function classifyInterestItem(
  spaces: TextSpaces,
  lexicon: InterestLexicon,
): Omit<ItemHit, 'itemIndex'> | null {
  const selfDeclaredSurfaces = hitSelfDeclared(spaces, lexicon.selfDeclared ?? []);
  const soloSurfaces = hitSurfaces(spaces, lexicon.markers);
  const anchoredSurfaces = hitSurfaces(spaces, lexicon.anchored ?? []);
  // Un compagnon FORT (solo ou auto-déclaré) suffit à ancrer ; sinon, deux ancrés distincts
  // s'ancrent mutuellement. Isolé, un ancré ne compte pas.
  const strongCompanion = soloSurfaces.length > 0 || selfDeclaredSurfaces.length > 0;
  const keptAnchored = strongCompanion || anchoredSurfaces.length >= 2 ? anchoredSurfaces : [];
  const surfaces: string[] = [];
  for (const surface of [...selfDeclaredSurfaces, ...soloSurfaces, ...keptAnchored]) {
    if (!surfaces.includes(surface)) {
      surfaces.push(surface);
    }
  }
  if (surfaces.length === 0) {
    return null;
  }
  return { stage: 'explicit', surfaces, selfDeclared: selfDeclaredSurfaces.length > 0 };
}

// --- Agrégation ------------------------------------------------------------------------------------

/**
 * Détecte UN lexique sur les textes déjà normalisés → l'étage agrégé + ses items contributeurs, ou
 * `null` si le lexique ne tague pas. Typé sur l'union CONCRÈTE `DetectableLexicon` (et non le
 * générique de `detectLabels`) parce que le narrowing par `kind` ne fonctionne pas sur un paramètre
 * de type : ici la valeur est concrète, la discrimination narrow correctement vers chaque classifieur.
 *   - `interest` (D2) : un seul étage ; pas de seuil — le CLASSEMENT (top-N, plancher) vit dans la
 *     règle D2 ; on émet tout intérêt ayant ≥ 1 hit ;
 *   - `item-level` (conflictual) : ≥ 1 item émis → `explicit` ;
 *   - `topical` (sensible) : ≥ 1 explicite → `explicit` ; sinon ≥ seuil indirect → `indirect`.
 */
function detectOne(
  normalized: readonly TextSpaces[],
  lexicon: DetectableLexicon,
): Omit<LabelDetection, 'label'> | null {
  const items: ItemHit[] = [];
  normalized.forEach((spaces, itemIndex) => {
    const hit =
      lexicon.kind === 'topical'
        ? classifyTopicalItem(spaces, lexicon)
        : lexicon.kind === 'item-level'
          ? classifyConflictualItem(spaces, lexicon)
          : classifyInterestItem(spaces, lexicon);
    if (hit !== null) {
      items.push({ itemIndex, ...hit });
    }
  });

  if (lexicon.kind === 'interest') {
    return items.length > 0 ? { stage: 'explicit', items } : null;
  }
  if (lexicon.kind === 'item-level') {
    return items.length >= 1 ? { stage: 'explicit', items } : null;
  }
  const explicitCount = items.filter((i) => i.stage === 'explicit').length;
  const indirectCount = items.length - explicitCount;
  if (explicitCount >= 1) {
    return { stage: 'explicit', items };
  }
  if (indirectCount >= lexicon.indirectThreshold) {
    return { stage: 'indirect', items };
  }
  return null;
}

/**
 * Détecte les labels sur une liste de textes (les items d'UNE section, dans l'ordre source).
 * Générique sur le type de label (PANO-75, MÉCANIQUE UNIQUEMENT) : le type de `lexicon.label` est
 * propagé tel quel vers `LabelDetection.label` — D1 (`LabelLexicon[]`) reçoit `SensitiveLabel`, D2
 * (`InterestLexicon[]`) reçoit `string`, sans que la machinerie n'interprète jamais la valeur. Le
 * comportement de détection est INCHANGÉ pour D1 (goldens de non-régression : `detect.test.ts`,
 * `lexicon-battery.test.ts`, `d1-sensitive-topics.test.ts`).
 *
 * `items` porte TOUS les items contributeurs du label retenu (les preuves à référencer) ; les items
 * non retenus n'entrent jamais au magasin (borne §5.1). Le CLASSEMENT des intérêts (top-N, plancher)
 * ne vit PAS ici : c'est la règle D2 qui l'applique sur ces détections brutes.
 */
export function detectLabels<T extends DetectableLexicon>(
  texts: readonly string[],
  lexicons: readonly T[],
): LabelDetection<T['label']>[] {
  const normalized = texts.map(buildSpaces);
  const detections: LabelDetection<T['label']>[] = [];
  for (const lexicon of lexicons) {
    const detected = detectOne(normalized, lexicon);
    if (detected !== null) {
      detections.push({ label: lexicon.label, ...detected });
    }
  }
  return detections;
}
