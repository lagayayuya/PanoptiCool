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

/** Têtes de copule d'auto-déclaration (« je suis X »). Formes contractées d'internet incluses. */
export const SELF_DECLARATION_HEADS: readonly string[] = [
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
  'trop',
  'juste',
  'carrement',
  'devenu',
  'devenue',
  'assez',
  'un peu',
];
