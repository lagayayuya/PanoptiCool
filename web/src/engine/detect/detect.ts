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
//      + négation = AFFIRMATION : « je rate jamais la priere ») — et, sur les labels de SUJET
//      (`subjectNotState`), une négation DÉGRADE au lieu de supprimer : « je supporte pas les
//      fachos » reste de la politique. Doctrine : ADR-0003, *L'état et le sujet* ;
//   3. citation / discours rapporté → attribué à autrui → hit supprimé ;
//   4. 3ᵉ personne (« mon ado », « pour ma soeur ») → DÉGRADÉ en indirect, JAMAIS supprimé —
//      c'est le chemin signal-sans-vécu (B3 : taguer quand même EST la démonstration, C2) ;
//   5. registre INFORMATIONNEL (« signes de X », « prevalence of X ») → DÉGRADÉ de la même façon.
//      Ce n'est pas un filtre de plus : c'est une règle d'ÉTAGE, et elle échoue en sous-affirmant
//      là où un filtre échouerait en retirant du signal réel. Elle existe parce que la 3ᵉ personne
//      est item-locale et cherche un possessif — « signes de dépression chez l'adolescent », tapé
//      par un parent inquiet, n'en porte aucun et posait un constat NOMMÉ sur lui (mesuré, banc de
//      registres). Doctrine : ADR-0003, *Le registre informationnel*.
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
  COVERING_PHRASES,
  INFORMATIONAL,
  INFORMATIONAL_SUFFIXES,
  NEGATION_WINDOW,
  NEGATIONS,
  OMISSION_VERBS,
  REPORTED_QUESTION_VERBS_FR,
  SELF_DECLARATION_HEADS_EN,
  SELF_DECLARATION_HEADS_FR,
  THIRD_PERSON,
} from './filters';
import {
  canSelfDeclare,
  findMarker,
  findSelfDeclaration,
  normString,
  occursInsideQuotes,
  type Span,
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
  /**
   * Ce hit porte-t-il un marqueur SOLO (`TopicalLexicon.indirectSolo`), qui dispense du seuil ?
   *
   * Porté ICI plutôt que redéduit à l'agrégation, et ce n'est pas un raffinement : `surfaces` contient
   * les formes du texte ORIGINAL (cf. juste au-dessus), pas les entrées du lexique. Les recouper avec
   * la liste des marqueurs rate donc tout ce que la normalisation avait rapproché — « dépression »
   * accentué ne se retrouve pas dans une liste écrite sans accents. Mesuré : le tier solo ne s'armait
   * pas en français. Seul le classifieur sait quelle liste a matché ; il le dit.
   */
  solo?: boolean;
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

/** Fenêtre de négation APRÈS un marqueur d'adhésion — cf. `hasTrailingNegation` pour le pourquoi du
 *  sens et de la brièveté. Distincte de `NEGATION_WINDOW`, qu'elle ne remplace ni n'élargit. */
const ADHERENCE_NEGATION_WINDOW = 2;

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

/**
 * Registre INFORMATIONNEL : l'item interroge, définit ou quantifie une condition au lieu de la
 * décrire chez quelqu'un (« signes de X », « prevalence of X », « qu'est ce que X »).
 */
function isInformational(text: NormalizedText): boolean {
  return INFORMATIONAL.some((marker) => findMarker(text, marker) !== null);
}

/**
 * Registre informationnel en COMPOSÉ : un terme du lexique suivi d'une tête documentaire
 * (« diabetes symptoms », « burnout signs »). Même règle que `isInformational`, seconde forme.
 *
 * Elle existe parce que la liste par préposition manquait l'ordre de mots DOMINANT de l'anglais :
 * « symptoms of diabetes » dégradait, « diabetes symptoms » nommait. La tête n'est reconnue
 * qu'ACCOLÉE À UN TERME — c'est ce qui permet de ne pas admettre « symptoms » nu, dont l'exclusion
 * de la liste principale est délibérée (« my symptoms have been worse » décrit un vécu et ne doit
 * pas dégrader).
 *
 * L'ancre est le terme EXPLICITE seul : un terme indirect produit déjà un étage large, il n'y a
 * rien à abaisser.
 */
function hasInformationalCompound(text: NormalizedText, explicitTerms: readonly string[]): boolean {
  for (const term of explicitTerms) {
    const pos = findMarker(text, normString(term));
    if (pos === null) {
      continue;
    }
    // Fin du MOT, pas fin du marqueur : la tolérance de pluriel fait matcher « diabete » dans
    // « diabetes », et le span peut s'arrêter avant le « s ». Sans ce rattrapage, la tête suivante
    // ne serait jamais adjacente.
    let end = pos.end;
    while (end < text.norm.length && /[a-z0-9]/.test(text.norm[end] ?? '')) {
      end += 1;
    }
    const reste = text.norm.slice(end);
    for (const tete of INFORMATIONAL_SUFFIXES) {
      if (reste.startsWith(` ${tete}`)) {
        const apres = reste.charAt(tete.length + 1);
        if (apres === '' || !/[a-z0-9]/.test(apres)) {
          return true;
        }
      }
    }
  }
  return false;
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
/**
 * Le marqueur est-il AVALÉ par une locution couvrante ? « therapy » dans « occupational therapy ».
 *
 * La contenance est STRICTE, et c'est ce qui rend la règle utilisable : sans ça, un syntagme
 * couvrant se bloquerait lui-même, et `health_physical` perdrait le signal qu'on veut justement lui
 * laisser réclamer. Seul le marqueur plus COURT tombe.
 */
function isSwallowed(text: NormalizedText, pos: Span): boolean {
  const longueur = pos.end - pos.start;
  for (const phrase of COVERING_PHRASES) {
    const couvrante = findMarker(text, normString(phrase));
    if (
      couvrante !== null &&
      couvrante.start <= pos.start &&
      pos.end <= couvrante.end &&
      couvrante.end - couvrante.start > longueur
    ) {
      return true;
    }
  }
  return false;
}

function hitIn(text: NormalizedText, marker: string, requireElongation: boolean): string | null {
  const pos = findMarker(text, marker);
  if (
    pos === null ||
    isNegated(text.norm, pos.start) ||
    isCited(text, marker) ||
    isSwallowed(text, pos)
  ) {
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

/**
 * Surfaces des marqueurs PRÉSENTS MAIS NIÉS — le miroir exact de `hitSurfaces`, et il n'existe que
 * pour les labels de SUJET (`TopicalLexicon.subjectNotState`). Mêmes portes que `hitIn` (citation,
 * locution couvrante) : seule la négation change de sens, de suppression vers dégradation.
 *
 * Écrit à côté de `hitIn` plutôt que dedans, et c'est délibéré : le chemin des cinq autres labels
 * n'est pas touché d'une ligne. Une refonte de `hitIn` aurait déplacé le repli vers l'espace
 * squelettisé (aujourd'hui un hit nié y retombe), et un lot dont la doctrine porte sur `politics` et
 * `religion` n'a pas à bouger le comportement de `mental_health` par effet de bord.
 *
 * ESPACE DIRECT SEUL — pas de repli squelettisé : la négation est un fait de MOTS-FONCTION, que
 * l'allongement expressif ne déforme pas. Même raison que le plafonnement d'étage juste en dessous.
 */
function negatedHitSurfaces(spaces: TextSpaces, markers: readonly string[]): string[] {
  const text = spaces.full;
  const out: string[] = [];
  for (const rawMarker of markers) {
    const marker = normString(rawMarker);
    const pos = findMarker(text, marker);
    if (
      pos === null ||
      !isNegated(text.norm, pos.start) ||
      isCited(text, marker) ||
      isSwallowed(text, pos)
    ) {
      continue;
    }
    const surface = surfaceForm(text, pos.start, pos.end);
    if (!out.includes(surface)) {
      out.push(surface);
    }
  }
  return out;
}

/**
 * Un marqueur d'ADHÉSION est-il suivi d'une négation ? La moitié manquante de `isNegated`, et elle
 * n'existe que pour la contradiction d'auto-déclaration (`TopicalLexicon.adherence`).
 *
 * POURQUOI UNE FENÊTRE APRÈS, alors que tout le reste du fichier regarde AVANT. La négation
 * française est DISCONTINUE (« ne … pas »), et le premier élément n'est pas un marqueur de négation
 * utilisable : `ne` est trop fréquent hors négation pour entrer dans `NEGATIONS`, si bien que la
 * fenêtre avant ne voit RIEN sur « je ne crois pas » — le poids porte sur `pas`, qui SUIT le verbe.
 * Mesuré : sans cette fenêtre, la règle de contradiction ne se déclenchait jamais.
 *
 * FENÊTRE COURTE (2 tokens), et c'est ce qui la sépare d'un « il y a une négation quelque part ».
 * Mesuré aussi : une fenêtre large plafonnait « je pratique, je ne m'en cache pas » — une phrase
 * qui AFFIRME, dont le `pas` appartient à une tout autre proposition. Deux tokens couvrent la
 * négation attachée au verbe et rien de plus.
 *
 * Portée strictement locale : `isNegated` n'est pas touché, donc aucun autre label ne bouge.
 */
function hasTrailingNegation(text: NormalizedText, markers: readonly string[]): boolean {
  for (const rawMarker of markers) {
    const pos = findMarker(text, normString(rawMarker));
    if (pos === null || isCited(text, normString(rawMarker))) {
      continue;
    }
    const after = tokens(text.norm.slice(pos.end)).slice(0, ADHERENCE_NEGATION_WINDOW);
    if (after.some((t) => NEGATIONS.includes(t))) {
      return true;
    }
  }
  return false;
}

/**
 * L'auto-déclaration est-elle SUBORDONNÉE à une question rapportée ? (« on me demande si je suis X »)
 *
 * LE MÊME MÉCANISME QUE LA CONTRADICTION D'ADHÉSION, VU DE L'AUTRE CÔTÉ. Le pattern
 * d'auto-déclaration lit une COPULE et rien d'autre : il ne distingue pas « je suis X », qui
 * affirme, de « on me demande si je suis X », qui rapporte la question d'un tiers. Mesuré, et sur
 * les trois labels qui déclarent des termes auto-déclarés — pas seulement celui qui l'a trouvé.
 *
 * POURQUOI DÉGRADER ET NON FILTRER, et c'est la même raison qu'ailleurs dans ce fichier : effacer
 * serait faux. Quelqu'un à qui on pose la question EST en relation avec le sujet — c'est le sujet
 * même de sa phrase. Le tag reste, l'affirmation tombe.
 *
 * LA STRUCTURE VÉRIFIÉE, et pas seulement la présence des mots : le verbe de question doit précéder
 * la copule, et « si » doit se trouver ENTRE les deux. C'est « si » qui subordonne, et l'exiger au
 * bon endroit sépare « on me demande si je suis X » (rapporté) de « je suis X, et si on me le
 * demande je le dis » (affirmé) — deux phrases qui portent exactement les mêmes mots.
 *
 * CE QUE CETTE RÈGLE NE COUVRE PAS, et le dire évite qu'on la cite trop large : la question posée
 * SANS « si » (« tu es X ? — oui »), la question rapportée en anglais, et le DÉMENTI qui suit une
 * affirmation (« je suis X, je réponds non »). Ce dernier a été examiné et écarté, mesuré : le
 * français emploie « non mais » comme marqueur d'insistance AFFIRMATIVE (« je suis X, non mais
 * vraiment »), si bien qu'une négation traînante ne distingue pas le démenti de l'emphase. C'est le
 * mode d'échec qui avait déjà imposé une fenêtre courte à `hasTrailingNegation`.
 */
function hasReportedSelfQuestion(text: NormalizedText, heads: readonly string[]): boolean {
  const head = heads
    .map((h) => findMarker(text, normString(h)))
    .filter((p): p is Span => p !== null)
    .sort((a, b) => a.start - b.start)[0];
  if (head === undefined) {
    return false;
  }
  for (const verb of REPORTED_QUESTION_VERBS_FR) {
    const pos = findMarker(text, normString(verb));
    if (pos === null || pos.end > head.start) {
      continue;
    }
    if (tokens(text.norm.slice(pos.end, head.start)).includes('si')) {
      return true;
    }
  }
  return false;
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
 *
 * `heads` est un PARAMÈTRE, et c'est la porte de langue (PANO-35) : une liste de têtes ne lit que
 * les termes admis pour SA langue. Le couple (têtes, termes) est donc visible au site d'appel, là
 * où un lecteur peut vérifier qu'il est bien apparié — et non enfoui dans un import global qui
 * lisait tout ce qui traînait.
 */
function hitSelfDeclared(
  spaces: TextSpaces,
  terms: readonly string[],
  heads: readonly string[],
): string[] {
  if (!canSelfDeclare(spaces.full, heads)) {
    return []; // aucune copule de tête → le pattern ne peut pas matcher (court-circuit PANO-87)
  }
  const out: string[] = [];
  for (const rawTerm of terms) {
    const term = normString(rawTerm);
    const pos = findSelfDeclaration(spaces.full, term, heads);
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
  const selfDeclaredSurfaces = hitSelfDeclared(
    spaces,
    lexicon.selfDeclaredFr ?? [],
    SELF_DECLARATION_HEADS_FR,
  );
  // AUTO-DÉCLARATION ANGLAISE — même mécanisme, ÉTAGE OPPOSÉ. Elle n'entre PAS dans
  // `explicitSurfaces` : elle rejoint le bloc indirect plus bas, et elle n'y confère aucun
  // franchissement solo. Les deux propriétés sont la doctrine du tier, pas une prudence de plus —
  // `TopicalLexicon.selfDeclaredEn` les porte avec leurs mesures.
  //
  // Le couple (têtes, termes) est visible ICI pour les deux langues, et c'est la porte de langue :
  // chaque liste de termes ne se lit qu'avec les têtes de SA langue. Un lecteur vérifie
  // l'appariement d'un coup d'œil, sans remonter dans un import.
  const selfDeclaredEnSurfaces = hitSelfDeclared(
    spaces,
    lexicon.selfDeclaredEn ?? [],
    SELF_DECLARATION_HEADS_EN,
  );
  const explicitNudeSurfaces = hitSurfaces(spaces, lexicon.explicit);
  // Plafonnement d'étage (3ᵉ personne, registre informationnel) : espace direct seul — pas de
  // tolérance d'allongement sur les mots-fonction, le gain serait nul et la surface de FP
  // inutilement élargie.
  // PLAFONNEMENT D'ÉTAGE — ce n'est pas un filtre, et la distinction est la chose à ne pas perdre :
  // un filtre répond « ce constat existe-t-il », par oui ou par non, et se trompe en RETIRANT du
  // signal réel ; ceci répond « à quel étage », et se trompe au pire en sous-affirmant.
  //
  // Les DEUX raisons produisent le même étage et sont tenues SÉPARÉES, parce qu'elles ne disent pas
  // la même chose et n'ouvrent pas les mêmes droits :
  //   - la 3ᵉ personne dit POUR QUI vaut le signal (B3) ;
  //   - le registre informationnel dit SOUS QUELLE FORME il est écrit.
  // Seule la seconde confère le franchissement SOLO (voir plus bas).
  const third = hasThirdPerson(spaces.full);
  // Les DEUX formes du registre informationnel — par préposition (« symptoms of X ») et par
  // composé (« X symptoms ») — produisent le même plafonnement et ouvrent les mêmes droits. C'est
  // délibéré : ce sont deux ordres de mots pour un seul registre, pas deux règles. Les distinguer
  // en aval ferait dépendre l'étage d'un fait de syntaxe, ce qu'aucune doctrine ne demande.
  const informational =
    isInformational(spaces.full) || hasInformationalCompound(spaces.full, lexicon.explicit);
  const capped = third || informational;
  // Les termes nus explicites sont plafonnés (B3) ; l'auto-déclaration ne l'est JAMAIS — la copule
  // ancre la 1ʳᵉ personne, et « je suis en dépression, comme dans les signes de dépression que j'ai
  // lus » reste un vécu déclaré.
  // AUTO-DÉCLARATION CONTREDITE — labels de SUJET seulement (`TopicalLexicon.adherence`). Un item
  // qui déclare une appartenance ET nie l'adhésion dans la foulée (« je suis catholique mais je ne
  // crois pas ») ne peut pas NOMMER : la copule ancre bien la 1ʳᵉ personne, mais la phrase retire
  // l'affirmation que l'étage nommé porterait.
  //
  // C'est un PLAFONNEMENT, pas un filtre, et la distinction est tout le sujet : effacer serait faux
  // — cette personne a une relation à cette tradition, c'est le sujet même de sa phrase. Le tag
  // reste, l'affirmation tombe. Doctrine et raison d'être : `TopicalLexicon.adherence`.
  const contradicted =
    lexicon.subjectNotState === true &&
    selfDeclaredSurfaces.length > 0 &&
    hasTrailingNegation(spaces.full, lexicon.adherence ?? []);
  // QUESTION RAPPORTÉE — l'autre versant du même mécanisme, et il n'est PAS réservé aux labels de
  // sujet. La contradiction d'adhésion suppose qu'on puisse adhérer ou non à ce qu'on déclare, ce
  // qui n'a de sens que pour un SUJET ; une question rapportée, elle, retire l'affirmation quel que
  // soit le label — « on me demande si je suis dépressif » n'affirme pas plus une dépression qu'une
  // appartenance. D'où l'absence de garde `subjectNotState` ici, qui serait une recopie de forme
  // sans sa raison.
  const reported =
    selfDeclaredSurfaces.length > 0 &&
    hasReportedSelfQuestion(spaces.full, SELF_DECLARATION_HEADS_FR);
  const explicitSurfaces =
    contradicted || reported
      ? []
      : [
          ...selfDeclaredSurfaces,
          ...(capped ? [] : explicitNudeSurfaces.filter((s) => !selfDeclaredSurfaces.includes(s))),
        ];
  if (explicitSurfaces.length > 0) {
    return { stage: 'explicit', surfaces: explicitSurfaces };
  }
  // Les marqueurs SOLO sont des marqueurs indirects comme les autres AU NIVEAU DE L'ITEM : ce qui
  // les distingue est l'AGRÉGATION (ils dispensent du seuil). Ils sont matchés à part uniquement
  // pour pouvoir le SIGNALER — pas parce que leur classification différerait.
  const soloSurfaces = hitSurfaces(spaces, lexicon.indirectSolo ?? []);
  const indirectMarkers = lexicon.includeColloquial
    ? [...lexicon.indirectCore, ...lexicon.indirectColloquial]
    : lexicon.indirectCore;
  const indirectSurfaces = hitSurfaces(spaces, indirectMarkers);
  // POLARITÉ — labels de SUJET seulement (ADR-0003, *L'état et le sujet*). Un marqueur NIÉ n'est pas
  // supprimé, il est dégradé : « je supporte pas les fachos » et « je ne crois pas en dieu » sont
  // sur le sujet, et la négation en dit la polarité, pas l'absence. L'étage nommé leur reste fermé —
  // affirmer sur une phrase qui nie serait exactement l'erreur que le filtre évitait.
  const negatedSurfaces =
    lexicon.subjectNotState === true
      ? negatedHitSurfaces(spaces, [...lexicon.explicit, ...indirectMarkers])
      : [];
  // Terme nu explicite plafonné → DÉGRADÉ en indirect (jamais nommé, jamais supprimé — B3).
  const degraded = capped ? explicitNudeSurfaces : [];
  // L'auto-déclaration NON ASSERTÉE retombe ici — contredite par une négation d'adhésion, ou
  // subordonnée à une question rapportée. C'est le geste qui distingue ces deux règles d'un filtre :
  // la surface est conservée comme preuve indirecte. Sans cette ligne, le plafonnement effacerait le
  // hit au lieu de l'abaisser — exactement ce que la doctrine refuse. Les deux causes partagent ce
  // slot parce qu'elles produisent le MÊME résultat ; elles restent deux booléens distincts parce
  // qu'elles ne se déclenchent pas sur les mêmes labels.
  const unassertedSurfaces = contradicted || reported ? selfDeclaredSurfaces : [];
  const surfaces: string[] = [];
  for (const s of [
    // L'auto-déclaration ANGLAISE arrive ici et nulle part ailleurs — jamais dans `explicitSurfaces`.
    ...selfDeclaredEnSurfaces,
    ...unassertedSurfaces,
    ...degraded,
    ...soloSurfaces,
    ...indirectSurfaces,
    ...negatedSurfaces,
  ]) {
    if (!surfaces.includes(s)) {
      surfaces.push(s);
    }
  }
  // FRANCHISSEMENT SOLO — même règle, seconde voie.
  //
  // Un terme dégradé par le REGISTRE INFORMATIONNEL franchit SEUL, exactement comme un nom nu de
  // `indirectSolo`. Les deux cas ont la même forme : le terme précis EST écrit, et c'est le CADRAGE
  // qui interdit d'affirmer. Le tier des noms nus tenait déjà cette forme pour les noms nus ; il lui
  // manquait ce chemin-ci. C'est une règle qui rejoint un cas qu'elle avait manqué, pas une règle
  // neuve — et sans lui, les deux mécanismes se composaient en une DISPARITION : le cadrage retirait
  // l'étage nommé, puis le seuil retirait le constat, alors qu'aucune des deux règles ne demandait
  // qu'il n'y ait plus rien à montrer.
  //
  // La 3ᵉ personne, elle, ne confère RIEN. Sa raison est l'inverse : elle dit que le signal ne
  // concerne pas le locuteur, ce qui est précisément un motif de NE PAS laisser un item isolé poser
  // un constat sur lui. Les deux plafonnements produisent le même étage pour des raisons opposées,
  // et seule l'une des deux justifie de sauter le seuil.
  const degradedSolo = informational && degraded.length > 0;
  // MÊME FRANCHISSEMENT POUR L'AUTO-DÉCLARATION NON ASSERTÉE, et pour la raison déjà écrite juste
  // au-dessus : le terme précis EST écrit, et c'est le CADRAGE qui interdit d'affirmer. Sans cette
  // ligne, la dégradation se compose avec le seuil en une DISPARITION — le plafonnement retire
  // l'étage nommé, puis le seuil retire le constat, alors qu'aucune des deux règles ne demande
  // qu'il n'y ait plus rien à montrer. C'est de l'effacement par la porte de derrière, très
  // exactement ce que « dégrader, ne pas filtrer » refuse.
  //
  // Mesuré, et c'est ce qui a rendu la règle visible : « on me demande si je suis dépressif » rendait
  // RIEN sur un label à seuil 2, là où le même cadre rendait un constat large sur les labels à
  // seuil 1. Le plafonnement de la contradiction d'adhésion portait le même défaut latent, sans
  // qu'aucun banc puisse le voir — son seul label déclarant `adherence` est à seuil 1.
  const unassertedSolo = unassertedSurfaces.length > 0;
  // ET L'AUTO-DÉCLARATION ANGLAISE N'EN CONFÈRE AUCUN — absence DÉLIBÉRÉE, mesurée, à ne pas
  // « réparer » en la rangeant avec les deux cas ci-dessus.
  //
  // Ses voisins de ce bloc franchissent parce que le terme précis EST écrit et que seul le CADRAGE
  // interdit d'affirmer. La forme se ressemble, et c'est le piège : ici le cadrage n'établit rien
  // sur le locuteur, parce que le cadre anglais ne désambiguïse pas (`filters-en.ts`). Lui donner le
  // franchissement reviendrait à faire porter au cadre une charge qu'il ne porte pas.
  //
  // Mesuré, variante rejetée : la dispense faisait passer un jeu de 43 phrases d'idiome de 8 à 16
  // déclenchements et ajoutait un tort sur `en_idiomatic` (« i am so ocd about the label alignment
  // on the jars ») — sur un terme, `ocd`, qui était DÉJÀ au lexique. Le coût n'est pas le
  // vocabulaire, c'est le franchissement. Prix accepté en échange : sur les labels à seuil 2,
  // « i am diabetic » écrit une seule fois ne rend rien.
  if (surfaces.length > 0) {
    return {
      stage: 'indirect',
      surfaces,
      ...(soloSurfaces.length > 0 || degradedSolo || unassertedSolo ? { solo: true } : {}),
    };
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
  const selfDeclaredSurfaces = hitSelfDeclared(
    spaces,
    lexicon.selfDeclared ?? [],
    SELF_DECLARATION_HEADS_FR,
  );
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
 *   - `topical` (sensible) : ≥ 1 explicite → `explicit` ; sinon ≥ 1 marqueur SOLO **ou** ≥ seuil
 *     indirect → `indirect`.
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
  // Un marqueur SOLO dispense du seuil, et de lui SEUL : il ne peut jamais faire monter l'étage.
  // Le plafond est structurel — ce bloc est APRÈS le retour `explicit`, donc un solo n'ajoute
  // jamais rien à un constat nommé, et il ne peut pas en fabriquer un.
  const hasSolo = items.some((i) => i.stage === 'indirect' && i.solo === true);
  if (hasSolo || indirectCount >= lexicon.indirectThreshold) {
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
