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
   *
   * ── LE SUFFIXE `Fr` EST UNE PORTE, PAS UN ÉTIQUETAGE (PANO-35) ────────────────────────────────
   * **N'écrire ici que des termes admis pour le FRANÇAIS.** Ce tier ne se matche QUE via les têtes
   * de copule, et `detect.ts` l'apparie explicitement à `SELF_DECLARATION_HEADS_FR`. Une langue de
   * plus = une liste de termes de plus (`selfDeclaredEn`) appariée à ses propres têtes, jamais un
   * terme anglais glissé dans cette liste-ci.
   *
   * *Pourquoi la porte existe, et c'est une mesure, pas une précaution.* Avant ce lot, il n'y avait
   * qu'UNE liste et qu'UN jeu de têtes. Les têtes étant FR-only, elles formaient une **porte de
   * langue non déclarée** : les entrées de graphie anglaise présentes ici — `muslim`, `gay`, `ace`,
   * `trans`, `militant`, `liberal`… — étaient inatteignables en anglais **par accident**, et non
   * par décision. Mesuré : ajouter une seule tête anglaise les activait TOUTES d'un coup, en constat
   * NOMMÉ, sans qu'aucune n'ait jamais été examinée pour l'anglais — « im ace at darts » désignait
   * quelqu'un comme asexuel. Ajouter des têtes EN n'ajoute donc pas une fonctionnalité : ça RETIRE
   * une protection que personne n'avait écrite.
   *
   * Le témoin `selfdeclared-language-gate.test.ts` tient cette porte et porte le registre des
   * graphies anglaises **non admises pour l'anglais** — explicitement, plutôt qu'inatteignables.
   */
  selfDeclaredFr?: readonly string[];
  /**
   * Termes d'identité ANGLAIS matchés via le pattern d'auto-déclaration (« i am X »), appariés à
   * `SELF_DECLARATION_HEADS_EN`. Optionnel.
   *
   * ── CE TIER N'AFFIRME JAMAIS, ET C'EST SA RAISON D'ÊTRE ───────────────────────────────────────
   * **Un hit atterrit en INDIRECT, jamais en `explicit`** — contrairement à `selfDeclaredFr`, qui
   * NOMME. Ce n'est pas une prudence de plus : c'est la forme même de ce tier, et elle est nommée
   * par ADR-0003 (*La rétrogradation*) — « un tier qui dispense du seuil sans permettre de nommer »,
   * ici sans la dispense (voir plus bas).
   *
   * *Pourquoi un calque de `selfDeclaredFr` était le mauvais geste.* Le calque aurait fait NOMMER
   * « i am gay » en anglais, c'est-à-dire ouvert en grand le coût d'erreur que la porte de langue
   * existe pour tenir fermé. Et il aurait INVERSÉ la règle de symétrie au lieu de la réparer : la
   * réparation demande que « i am straight » déclenche AUTANT que « i am gay », pas que les deux
   * montent d'un étage que personne n'a mesuré pour l'anglais. En atterrissant en large, les deux
   * versants se déclenchent à égalité, et aucun ne se fait nommer. La symétrie est satisfaite **par
   * construction**, pas par un décompte de termes qu'il faudrait re-vérifier à chaque ajout.
   *
   * ── LA COPULE NE DÉSAMBIGUÏSE PAS EN ANGLAIS — mesure, et elle décide de tout ─────────────────
   * **Ne jamais faire porter de charge de sûreté au cadre.** La doctrine de la copule (« la copule
   * ancre la 1ʳᵉ personne », `selfDeclaredFr`) est FRANÇAISE et ne traverse pas : l'idiome anglais
   * s'écrit massivement à la première personne. Mesuré, et ce ne sont pas des cas limites —
   * « im so ocd about my desk drawers », « im autistic about train timetables », « im arthritic
   * after that hike », « im depressed that the bakery closed early » portent tous le cadre.
   *
   * D'où la conséquence sur ce qui protège : ici la sûreté ne vient PAS du cadre, elle vient de
   * l'ÉTAGE — et de la porte d'admission des termes, comme partout ailleurs. Le cadre n'achète que
   * du RAPPEL (il rend `straight` admissible, là où le terme nu en `indirectCore` a été mesuré à
   * 1 → 4 torts). Justification longue et surface de mesure : `filters-en.ts`.
   *
   * ── PAS DE FRANCHISSEMENT SOLO, et c'est une décision chiffrée ────────────────────────────────
   * Un hit de ce tier compte au seuil **comme n'importe quel indirect**. La variante qui lui donnait
   * la dispense de seuil a été mesurée et REFUSÉE : elle faisait passer l'idiome de 8 à 16
   * déclenchements (jeu de 43 phrases) et ajoutait un tort sur `en_idiomatic` — « i am so ocd about
   * the label alignment on the jars ». Le terme `ocd` était DÉJÀ au lexique ; seule la dispense le
   * faisait passer. **Le coût n'était pas le vocabulaire, c'était le franchissement.**
   *
   * *Ce que ça coûte, et c'est accepté explicitement :* sur les deux labels à seuil 2
   * (`mental_health`, `health_physical`), « i am diabetic » écrit UNE fois ne rend RIEN. C'est ce
   * que le seuil fait déjà partout ailleurs. Sur les labels à seuil 1 (`religion`, `sexuality`),
   * l'absence de dispense ne coûte rien du tout.
   */
  selfDeclaredEn?: readonly string[];
  /**
   * Marqueurs qui posent le tag LARGE **à eux seuls** — un hit suffit, le seuil ne s'applique pas —
   * et qui ne le NOMMENT jamais, quel qu'en soit le nombre. Optionnel.
   *
   * Le tier des NOMS NUS de trouble (« depression », « anxiety », « ptsd »). Ils tombent entre les
   * deux tiers existants, et c'est pour ça qu'aucun ne leur allait :
   *   - `explicit` affirme une condition. Sur « this heat is giving me depression », c'est faux —
   *     l'anglais courant emploie ces noms comme intensificateurs (mesuré, banc de borne haute).
   *   - le seuil indirect exige la répétition. Or une personne qui écrit UNE fois, littéralement,
   *     qu'elle fait une dépression ne disparaît pas du champ : elle disparaîtrait du détecteur
   *     (mesuré aussi — c'est ce qui a fait échouer la première tentative de rétrogradation).
   *
   * Le nom reprend celui de `InterestLexicon.markers` (« marqueurs SOLO : ils rentrent SEULS ») :
   * même propriété, même mot. Le seuil de `indirectThreshold` n'est PAS touché — ce tier passe à
   * côté, il ne le redéfinit pas.
   *
   * La règle qu'il applique n'est pas neuve : ce lexique tient déjà « le syntagme complet nomme, le
   * nom nu ne le fait pas » (`bipolar disorder` vs `bipolar`, `panic attack` vs `panic`). Ce tier
   * est l'endroit où atterrissent les noms nus qui y avaient échappé.
   */
  indirectSolo?: readonly string[];
  /**
   * Ce label décrit-il un SUJET qu'on fréquente, plutôt qu'un ÉTAT qu'on est ? (ADR-0003, *L'état et
   * le sujet*.) Défaut : `false` — l'état est le cas des quatre labels de condition.
   *
   * Ce que le drapeau change, et il ne change que ça : une négation devant un marqueur **dégrade**
   * le hit en indirect au lieu de le **supprimer**.
   *
   * *Pourquoi il faut un drapeau plutôt qu'une règle unique.* Sur un label d'ÉTAT, « je ne suis pas
   * déprimé » ne décrit aucune dépression : la négation retire le signal, et le filtre a raison.
   * Sur un label de SUJET, « je supporte pas les fachos » ne retire pas la politique — la négation
   * porte la POLARITÉ, pas l'absence de sujet. Appliquer le comportement d'état à un label de sujet
   * rend le produit sourd à l'OPPOSITION, qui est le registre dominant du discours politique et
   * religieux : mesuré, le lexique n'entendait que celui qui adhère.
   *
   * *Et pourquoi une dégradation, pas une exemption.* Laisser la négation intacte ferait poser un
   * constat NOMMÉ sur « je ne suis pas socialiste » — affirmer précisément ce que la phrase nie. La
   * dégradation garde le sujet et retire l'affirmation : même forme que la règle du registre
   * informationnel, et même sens d'échec — au pire elle sous-affirme, ce qui se rattrape.
   *
   * Un hit ainsi dégradé ne confère JAMAIS le franchissement solo : il compte au seuil comme
   * n'importe quel indirect, et rien de plus.
   */
  subjectNotState?: boolean;
  /**
   * Termes d'ADHÉSION dont la NÉGATION contredit une auto-déclaration — labels de SUJET seulement,
   * et sans effet si le label n'en déclare pas. Optionnel.
   *
   * *Ce que ça fait, et rien d'autre.* Quand un item porte À LA FOIS une auto-déclaration
   * (« je suis catholique ») et l'un de ces termes SOUS NÉGATION (« je ne crois pas »), le hit
   * d'auto-déclaration est **plafonné en indirect** au lieu de nommer. Le tag survit, l'affirmation
   * tombe.
   *
   * *Pourquoi plafonner et non filtrer.* Effacer serait faux : quelqu'un qui écrit « catholique
   * mais je ne crois pas » A une relation à cette tradition — c'est le SUJET de sa phrase. Et
   * filtrer n'aurait pas de fin, chaque tournure d'éloignement (« sans vraiment y croire », « plus
   * depuis longtemps ») demandant sa propre exception. Le plafonnement échoue en sous-affirmant,
   * ce qui se rattrape ; le filtre échoue en effaçant, ce qui ne se rattrape pas.
   *
   * *Pourquoi la négation ne suffisait pas.* La fenêtre de négation regarde AVANT le marqueur, dans
   * la même proposition. « je suis catholique mais je ne crois pas » nie la CROYANCE dans une
   * proposition SUIVANTE, hors de portée — mesuré : la phrase posait un constat nommé. Cette liste
   * donne à la contradiction un marqueur qu'elle puisse nier, sans élargir la fenêtre pour tout le
   * monde.
   */
  adherence?: readonly string[];
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
