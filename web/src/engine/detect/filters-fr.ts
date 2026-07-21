// Listes FR GÉNÉRIQUES des filtres contextuels (PANO-71) — données transverses de la machinerie,
// PAS du lexique de label : la négation, le discours rapporté et la 3ᵉ personne sont du français
// courant, identiques quel que soit le sujet détecté.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Chaque liste vient de la grammaire/l'usage courant du FR (mots de négation canoniques, verbes
// de parole du discours rapporté, désignations usuelles de proches), construites à l'aveugle de
// tout export réel. Aucun terme n'est issu ni inspiré d'un export d'une personne réelle.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Toutes les entrées sont déjà en forme NORMALISÉE (minuscules, sans accents) — elles matchent
// le `norm` de `normalize-fr.ts` sans re-normalisation.

/** Mots de négation (fenêtre AVANT le marqueur — cf. `NEGATION_WINDOW`). */
export const NEGATIONS: readonly string[] = [
  'pas',
  'jamais',
  'aucun',
  'aucune',
  'sans',
  'ni',
  'non',
  'rien',
];

/** Taille de la fenêtre de négation, en tokens avant le marqueur (mesure PANO-33). */
export const NEGATION_WINDOW = 3;

/**
 * Verbes d'OMISSION : omission + négation = double négation qui AFFIRME l'objet
 * (« je rate jamais la priere » = pratique assidue, pas une négation). Mesuré PANO-33.
 */
export const OMISSION_VERBS: readonly string[] = [
  'rate',
  'rater',
  'rates',
  'manque',
  'manquer',
  'manques',
  'loupe',
  'louper',
  'loupes',
  'seche',
  'secher',
  'saute',
  'sauter',
];

/**
 * Discours rapporté — formes AVEC verbe de parole seulement : « on m'a diagnostique » (passif
 * médical) n'est PAS une citation, donc pas de « on m'a » / « il m'a » nus (piège mesuré PANO-33).
 */
export const CITATION_MARKERS: readonly string[] = [
  "m'a dit",
  "m'a traite",
  "m'a traitee",
  "m'a balance",
  "m'a sorti",
  "m'a lance",
  "m'a appele",
  "m'a raconte",
  'selon',
  "d'apres",
  'parait que',
];

/**
 * Marqueurs de 3ᵉ personne — l'axe « pour qui » (ADR-0003) : le signal existe mais concerne
 * un proche → DÉGRADÉ en indirect (chemin signal-sans-vécu), JAMAIS supprimé.
 *
 * Ce filtre échoue CLOSED (au pire on perd du rappel, jamais on ne nomme à tort) : la liste doit
 * donc être GÉNÉREUSE — un proche manquant ici est une faille de sûreté (« la dépression de ma
 * mère » nommerait l'utilisateur à la place du tiers dont il parle), pas un détail de complétude.
 * Famille proche + élargie ET registre familier (« mec »/« meuf »/« ex »), écrits à l'aveugle,
 * comme le reste du fichier.
 */
export const THIRD_PERSON: readonly string[] = [
  'mon ado',
  'ma soeur',
  'mon frere',
  'mon fils',
  'ma fille',
  'mon pote',
  'ma pote',
  'mon copain',
  'ma copine',
  'un proche',
  'un ami',
  'une amie',
  'mon grand',
  'aider un',
  'aider son',
  'soutenir un proche',
  'accompagner',
  'pour mon',
  'pour son',
  'pour sa',
  // Famille proche (comblement de la faille — mère/père absents à tort).
  'ma mere',
  'mon pere',
  'mes parents',
  // Famille élargie.
  'ma grand mere',
  'mon grand pere',
  'ma mamie',
  'mon papy',
  'mon oncle',
  'ma tante',
  'mon cousin',
  'ma cousine',
  // Registre familier (partenaire/ex).
  'mon mec',
  'ma meuf',
  'mon ex',
];

// --- Pattern d'auto-déclaration (PANO-72, transverse aux 6 labels) ----------------------------
// Structure générique [tête de copule] + [modificateurs optionnels] + [terme d'identité] : capte
// « je suis un vrai catho », « jsuis une grosse dépressive », « chui plutôt de droite » sans
// lister ces variantes (la structure est un pattern → machinerie ; le terme d'identité reste une
// donnée de label, cf. `TopicalLexicon.selfDeclared`). La copule ANCRE l'auto-désignation à la
// personne : un match d'auto-déclaration est toujours EXPLICITE (1ʳᵉ pers.), jamais dégradé en
// 3ᵉ personne. Bénéfice éthique en prime : le registre auto-dépréciatif (« un pauvre dépressif »)
// est capté sans être listé.

/**
 * Verbes qui RAPPORTENT une question — la copule qui les suit, subordonnée par « si », n'affirme
 * rien (« on me demande si je suis X »). Transverses aux six labels : c'est de la grammaire, pas du
 * vocabulaire de sujet, et la même phrase se construit sur n'importe quelle identité.
 *
 * *Pourquoi une liste de VERBES et non de frames complètes.* « on me demande si », « on me demande
 * souvent si », « il m'a demandé hier si » sont la même construction avec un adverbe glissé au
 * milieu. Lister les frames aurait fait dépendre la règle d'un accident d'insertion ; c'est le
 * couple (verbe de question, subordonnant « si ») qui porte le sens, et le vérifier laisse passer
 * l'adverbe sans l'énumérer.
 *
 * *Ce que la liste ne contient pas, et c'est délibéré.* Aucun verbe de parole générique
 * (« dire », « raconter ») : ceux-là vivent déjà dans `CITATION_MARKERS`, où ils FILTRENT. Ici on
 * dégrade, et confondre les deux ferait basculer du discours rapporté vers l'effacement.
 */
export const REPORTED_QUESTION_VERBS: readonly string[] = [
  'demande',
  'demandes',
  'demandent',
  'demandait',
  'demandaient',
  'demander',
  'demandee',
  'savoir',
];

/** Têtes de copule d'auto-déclaration (« je suis X »). Formes contractées d'internet incluses. */
export const SELF_DECLARATION_HEADS_FR: readonly string[] = [
  'je suis',
  'jsuis',
  "j'suis",
  'chui',
  'chuis',
  'je me sens',
];

/**
 * Modificateurs génériques optionnels entre la copule et le terme (« un vrai », « une grosse »,
 * « plutôt »…). Transverses : ni vocabulaire de label, ni marqueurs sensibles — de la grammaire.
 * La négation (« pas », « jamais »…) n'y figure PAS : elle brise le pattern par construction
 * (« je suis pas croyant » n'a pas le terme collé à la copule), donc la négation reste gérée.
 */
export const SELF_DECLARATION_MODIFIERS: readonly string[] = [
  'un',
  'une',
  'vrai',
  'vraie',
  'gros',
  'grosse',
  'petit',
  'petite',
  'grand',
  'grande',
  'pauvre',
  'simple',
  'pur',
  'pure',
  'plutot',
  'vraiment',
  'tres',
  // NOMS DE PERSONNE — « je suis une femme trans », « je suis un mec bi », « je suis une personne
  // non binaire ». Ce sont des modificateurs au même titre que « un vrai » : la tête sémantique
  // reste le terme d'identité qui suit, et le nom de personne ne fait que le porter.
  //
  // Ils sont ici, dans la GRAMMAIRE, plutôt qu'en syntagmes dans chaque lexique, et c'est le point :
  // « femme trans », « homme trans », « personne trans », « mec trans » sont la même construction
  // répétée. Les lister par label aurait multiplié les entrées sans jamais couvrir la suivante, et
  // le trou mesuré n'était pas lexical — le terme nu était déjà admis, c'est le nom de personne
  // intercalé qui cassait le pattern.
  'homme',
  'femme',
  'personne',
  'mec',
  'meuf',
  'garcon',
  'fille',
  'trop',
  'juste',
  'carrement',
  'devenu',
  'devenue',
  'assez',
  'un peu',
];

/**
 * REGISTRE INFORMATIONNEL (FR) — marqueurs de cadrage documentaire.
 *
 * Ce n'est PAS un filtre : ces marqueurs ne suppriment jamais un constat, ils en **abaissent
 * l'étage** (nommé → large). Chercher un symptôme EST un signal — une plateforme le lit, et le
 * produit doit le montrer — mais ce n'est pas la preuve d'une condition vécue, et le produit ne doit
 * donc pas en affirmer une. Doctrine : ADR-0003, *Le registre informationnel*.
 *
 * Critère d'admission, et il vaut la peine d'être tenu : un marqueur entre s'il signale que l'item
 * **interroge, définit ou quantifie** une condition, au lieu de la décrire chez quelqu'un. Aucune
 * entrée n'a été tirée d'un item de banc — sans quoi la règle ne serait qu'un miroir de ce qu'on
 * voulait lui voir rattraper.
 *
 * Ce qui n'y entre PAS : les tournures qui distinguent « X est Y » de « j'ai X ». Les couvrir
 * reviendrait à exiger un ancrage 1ʳᵉ personne, ce qui dégraderait aussi la personne qui vit la
 * condition — mesuré, et écarté pour cette raison.
 */
export const INFORMATIONAL: readonly string[] = [
  // Interroger — la forme la plus courante de la recherche d'un proche inquiet.
  'signes de',
  'signe de',
  'symptomes',
  'symptome de',
  'causes de',
  'cause de',
  'que faire',
  'est ce normal',
  "qu'est ce que",
  'quest ce que',
  "c'est quoi",
  'cest quoi',
  'comment aider',
  'comment soutenir',
  'comment reconnaitre',
  'comment savoir',
  'comment detecter',
  // Solliciter l'expérience d'AUTRUI — quatrième mode du registre informationnel, ajouté après le
  // premier lot. Interroger, définir et quantifier posaient l'item en question SUR une condition ;
  // celui-ci le pose en demande de RÉCITS. Un témoignage est par définition l'expérience de
  // quelqu'un d'autre : le demander situe l'auteur en lecteur, pas en porteur.
  //
  // Il couvre aussi, et légitimement, le porteur qui interroge — « quelqu'un a déjà eu ça ? » écrit
  // par quelqu'un de concerné. La phrase contient le terme mais n'affirme rien sur son auteur, donc
  // l'étage nommé n'y est pas justifié : la dégradation est correcte au sens de la doctrine (le fin
  // n'existe que s'il est ÉCRIT), pas un dommage collatéral qu'on tolère.
  'temoignage',
  'avis sur',
  "retour d'experience",
  'retour d experience',
  "quelqu'un a deja",
  'quelquun a deja',
  // Définir.
  'difference entre',
  'definition',
  'signification',
  'types de',
  'explication',
  // Quantifier — le registre de la documentation et de l'étude.
  'prevalence',
  'statistiques',
  'meta analyse',
  'revue systematique',
];
