// Types du lexique par label (PANO-70 §2.2) — la STRUCTURE, séparée strictement de la mécanique
// (`engine/detect/`) et des données (un module par label, `engine/lexicon/<label>.ts`).
//
// Union discriminée `kind` :
//   - `topical` — labels sensibles à deux étages (B1) : explicite → tag nommé ; topical répété →
//     tag large.
//   - `item-level` — `conflictual` uniquement (B5) : l'insulte ÉMISE visant un autre utilisateur
//     EST le signal explicite ; pas d'étage indirect, jamais de tag vague par accumulation.
//   - `interest` — INTÉRÊT non sensible (D2, PANO-75) : forme SIMPLIFIÉE du topical (cf. plus bas).
//
// Les entrées de marqueurs sont écrites en forme NORMALISÉE (minuscules, sans accents — le format
// que matche `detect.ts`). Termes simples et locutions acceptés. Chaque module de données porte en
// tête sa JUSTIFICATION DE GÉNÉRICITÉ (discipline PANO-70 §2.5/§3) : un terme sans justification
// générique ne passe pas la revue.

/**
 * Une ligne d'usage telle que le LEXIQUE la porte (ADR-0003). Définie ici depuis la Refonte A
 * (lot A2) : `schema.ts` d'où elle venait est retiré, et `Analysis` porte désormais des TEXTES
 * (`ThemeUsageLine`), pas des clés — le lexique, lui, garde ses clés (il est INTOUCHABLE, et
 * l'obligation « wording ratifiable en UN fichier » veut que les textes vivent dans `wording.ts`,
 * pas dans les 57 modules de lexique). C'est donc D2 qui résout ces clés en texte.
 * Seul le PLOMBAGE de type change ici ; ni la doctrine ni les données du lexique ne bougent.
 */
export interface ThemeUsage {
  /** Clé de catégorie d'acteur (`advertiser`, `insurer_employer`…), résolue par `wording.ts`. */
  actor: string;
  /**
   * Clé de gabarit d'usage, résolue par `wording.ts`. `params` est conservé OPTIONNEL et inutilisé :
   * les 57 modules de lexique l'écrivent (`params: {}`) et sont intouchables — sans lui, le contrôle
   * de propriété excédentaire de TS rejetterait leurs littéraux. Aucun usage n'a jamais pris de
   * paramètre ; le champ ne sert donc qu'à ne pas toucher aux données.
   */
  usage: { templateId: string; params?: Record<string, string | number> };
}

/** Les 6 labels sensibles bénis par ADR-0003 (catalogue : `docs/constats-sensibles.md`). Passe 1 :
 *  3 câblés. */
export type SensitiveLabel =
  | 'health_physical'
  | 'mental_health'
  | 'sexuality'
  | 'politics'
  | 'religion'
  | 'conflictual';

/** Lexique d'un label à deux étages (B1). */
export interface TopicalLexicon {
  kind: 'topical';
  label: Exclude<SensitiveLabel, 'conflictual'>;
  /**
   * Lectures de l'éventail (`Evidence.readings`) du constat INDIRECT — clés reprises du registre
   * des lectures de `docs/constats-sensibles.md`, JAMAIS inventées ici : ajouter une lecture, c'est
   * amender le registre d'abord (porte de yuya). Mode toujours `equal` — les lectures s'affichent à
   * plat ; la confiance vit sur le constat, jamais sur une lecture (ADR-0003).
   */
  readingTemplateIds: readonly string[];
  /** Termes précis qui, appliqués à soi, justifient un tag NOMMÉ (B2 : le fin n'existe que s'il est écrit). */
  explicit: readonly string[];
  /**
   * Termes d'identité NUS matchés UNIQUEMENT via le pattern d'auto-déclaration (« je suis X »,
   * PANO-72) — jamais en frontière de mot seule. Différence avec `explicit` : ces termes sont trop
   * ambigus nus (« lesbienne », « de gauche », « dépressif ») pour un tag nommé sans copule ; la
   * copule les ancre à la 1ʳᵉ personne. Un match d'auto-déclaration est toujours explicite (jamais
   * dégradé en 3ᵉ personne). Le même terme peut vivre AUSSI dans `indirectCore` (nu → tag large,
   * B1 : « cette actrice est lesbienne » reste indirect, jamais nommé). Optionnel.
   */
  selfDeclared?: readonly string[];
  /** Marqueurs topicaux peu ambigus → étage indirect. */
  indirectCore: readonly string[];
  /** Marqueurs colloquiaux/polysémiques — le foyer du couple recall/FP (calibrage identifiable). */
  indirectColloquial: readonly string[];
  /** Inclure les colloquiaux dans l'indirect ? (calibrage ratifié PANO-33 : ON — on ne masque pas.) */
  includeColloquial: boolean;
  /** Nb de hits indirects requis pour POSER le tag large (calibrage ratifié PANO-33). */
  indirectThreshold: number;
}

/** Lexique item-level de `conflictual` (B5) : insulte émise + cible 2ᵉ personne, un seul étage. */
export interface ItemLevelLexicon {
  kind: 'item-level';
  label: 'conflictual';
  /** Lexèmes injurieux. */
  insults: readonly string[];
  /** Marqueurs de cible 2ᵉ personne / impératif injurieux — sans cible = juron de frustration, exclu. */
  targets: readonly string[];
}

export type LabelLexicon = TopicalLexicon | ItemLevelLexicon;

/**
 * Lexique d'un INTÉRÊT non sensible (D2, PANO-75) — forme SIMPLIFIÉE du topical sensible. Un intérêt
 * n'est pas un sujet sensible : il ne porte donc NI `sensitivity`, NI éventail de lectures
 * (`readingTemplateIds`), NI distinction d'étages nommé/large, NI dégradation 3ᵉ personne (un
 * intérêt reste un intérêt même parlé d'autrui — « je parle beaucoup de cuisine » comme « ma sœur
 * adore cuisiner » signalent tous deux un même thème pour l'annonceur). GARDÉS de la machinerie
 * `detect.ts` : les filtres de bruit (négation, citation, frontières de mot, tolérances
 * masquage/allongement/pluriel) — un intérêt nié ou cité ne compte pas plus qu'un sujet sensible nié.
 *
 * `selfDeclared` reste un simple BONUS de confiance (pas un tag séparé, contrairement aux sensibles
 * où l'auto-déclaration ancre un tag nommé) : « je suis un vrai gamer » vaut plus qu'une mention
 * isolée, mais reste le même thème.
 *
 * Le lexique co-porte le THÈME qu'il produit (`themeId`, `themeLabel`, `usage`) : une graine
 * d'intérêt = un module = un thème. Éviter la dérive entre « ce qui est détecté » et « ce qui est
 * affiché » (le nom + le bloc usage) en les tenant au même endroit — même discipline que
 * `readingTemplateIds` co-porté par les lexiques sensibles.
 */
export interface InterestLexicon {
  kind: 'interest';
  /** Identité du thème produit (`Theme.id` / `InsightBase.themeId`), pas un label sensible fermé —
   * string OUVERTE : la taxonomie d'intérêts n'est pas encore ratifiée (graine jetable, PANO-75). */
  label: string;
  /** `templateId` BRUT du nom de thème affiché (comme `Theme.label`, résolu en présentation). */
  themeLabel: string;
  /** Bloc « ce qui peut en être fait — selon qui y accède » (ADR-0003) : STRUCTURE actée ici, le
   * WORDING est brouillon (PANO-45) et le CONTENU sourcé relève de PANO-55. Peut être vide. */
  usage: readonly ThemeUsage[];
  /**
   * Marqueurs SOLO : quasi-univoques, ils rentrent SEULS (un hit hors négation/citation EST une
   * preuve du thème). Tier de recall — on inclut riche, le plancher + le classement du socle noient
   * le bruit résiduel (méthode PANO-76 reprise : recall assumé, pas pureté FP maximale).
   */
  markers: readonly string[];
  /**
   * Marqueurs ANCRÉS : ambigus (≈ 50/50), ils ne rentrent QUE si un COMPAGNON du domaine co-occurre
   * dans le MÊME item — un `markers`/`selfDeclared` (signal fort), ou un AUTRE ancré (deux 50/50
   * ensemble valent le domaine). C'est l'outil de désambiguïsation par co-occurrence (PANO-76) :
   * « match »/« but » ne comptent que près d'un terme foot ; « console »/« boss » près d'un terme
   * gaming. Isolés, ils sont écartés (bruit). Optionnel.
   */
  anchored?: readonly string[];
  /** Termes d'identité auto-déclarés (« je suis un vrai X », via le pattern PANO-72) — simple BONUS
   * de confiance : leur présence pousse le niveau volume-dérivé de `low` vers `medium`. Compte aussi
   * comme COMPAGNON fort pour ancrer un marqueur ambigu. Optionnel. */
  selfDeclared?: readonly string[];
}

/**
 * Ce que la machinerie `detectLabels` sait détecter : les lexiques sensibles (D1) ET les lexiques
 * d'intérêt (D2). Union utilisée UNIQUEMENT par la signature du détecteur — jamais par les registres
 * de règles (`WIRED_LEXICONS` reste `LabelLexicon[]`, un registre d'intérêts reste `InterestLexicon[]`)
 * pour qu'un intérêt ne puisse pas fuiter dans D1 ni l'inverse.
 */
export type DetectableLexicon = LabelLexicon | InterestLexicon;
