// La valeur nommée que rend le moteur (Refonte A, lot A1 — forme arrêtée par ADR-0004).
//
// UNE fonction (`analyzeExport`, cf. `analyze.ts`), UNE valeur nommée. Remplace `EngineOutput` +
// l'union `Insight` + le magasin de preuves + les registres `RULES`/`EVIDENCE_RULES` + `composeRules`.
//
// LA RÈGLE DE COMPOSITION DE CE TYPE : chaque champ a un LECTEUR NOMMÉ, relevé sur l'écran
// (mesuré fichier par fichier ; méthode ADR-0004). Aucun champ spéculatif — ce que le
// moteur émettait sans lecteur (`framing`, `ruleId`, `sensitivity`, `Theme.sensitive`, le `claim` de
// l'agrégat) n'est pas ici. Plain-data, structured-clone-safe : la sortie du Worker EST ce type
// (ADR-0002, inchangé).

/**
 * Une miette source qui étaye un constat — référence DIRECTE, plus de magasin (§5.4 à la lettre).
 *
 * Le verbatim vit ICI, dupliqué si plusieurs constats la citent : doublon de ~60 chaînes courtes
 * ACCEPTÉ (arbitrage yuya). `channel` + `sourceIndex` remplacent l'`EvidenceId` — l'identité est une
 * PAIRE DE DONNÉES, plus une chaîne à re-parser. Ce que ça supprime concrètement :
 * `Number(ref.evidenceId.replace('comment:', ''))` (ex-`dossier.ts:187`), l'aller-retour
 * stringly-typed qu'imposait un magasin indexé par identifiant.
 *
 * La borne mémoire d'ADR-0003 tient toujours, et par construction plutôt que par discipline :
 * seules les miettes RÉFÉRENCÉES par un constat existent — il n'y a plus de magasin à sur-remplir.
 */
export interface Evidence {
  channel: 'comment' | 'search';
  /** Index dans SA liste source (comments OU searches) — jamais dans un corpus concaténé. */
  sourceIndex: number;
  /** Verbatim de la source, jamais de texte dérivé/interprété (→ `claim`). */
  text: string;
  /** Date source brute (contrat §1.1), verbatim. */
  date: string;
  /** Formes de surface à surligner, ⊂ `text` (ADR-0003). Posées sur CETTE citation : un même
   *  commentaire souligne des mots différents selon le constat qui le cite. */
  triggerTerms?: string[];
  /** Éventail de lectures DE CETTE preuve POUR CE constat (ADR-0003). Verrou C3 conservé : une
   *  lecture est un simple texte — structurellement aucun champ confiance/poids/score. `mode`
   *  ORDONNE, il ne CHIFFRE pas. La confiance vit sur le constat (`Deduction.confidence`). */
  readings?: ReadingFan;
}

/** Éventail de lectures : `ranked` (la 1ʳᵉ domine) ou `equal` (aucune privilégiée). */
export interface ReadingFan {
  mode: 'ranked' | 'equal';
  /** Textes de lecture (A2 : le texte, plus un templateId à router). */
  readings: string[];
}

/**
 * Un constat — l'union du FORK 3 (ratifiée yuya).
 *
 * Fusionne les TROIS axes de gradation dégénérés que le moteur portait (`Confidence.level: 'high'`
 * sans producteur, `SensitivityTier` toujours `3`, `Theme.sensitive` toujours `false`) en UN
 * discriminant qui, lui, VARIE : « produit par D1 » ou non (§2.1).
 *
 * `high` est INTERDIT À LA COMPILATION sur le sensible — ce que le golden §6.1 prouvait par test, le
 * type le dit désormais. Conséquence VOULUE (yuya) : le non-sensible PEUT afficher « élevée ». Aucune
 * règle ne l'émet aujourd'hui ; le type garde la porte ouverte, et la légende de l'UI ne l'annonce
 * plus tant que rien ne l'atteint (une légende sans référent).
 */
export type Deduction = {
  /** Texte constant, produit par une fonction typée de `wording.ts` (A2). SEULE ligne rendue. */
  claim: string;
  evidence: Evidence[];
} & (
  | { sensitive: true; confidence: 'low' | 'medium' }
  | { sensitive: false; confidence: 'low' | 'medium' | 'high' }
);

/**
 * Un constat sensible isolé (D1) : un `Deduction` + le NOM COURT de son sujet (« Santé mentale »).
 *
 * POURQUOI un champ EN PLUS du `Deduction` : `SignalCardNavy` titre sa carte avec ce mot court,
 * jamais avec la phrase-claim (décision yuya, refonte 2026-07-15). La forme nommée initiale (lot A1)
 * a manqué ce lecteur ; l'UI le retrouvait en INVERSANT l'allowlist `D1_TEMPLATE_IDS`
 * (`claim.templateId` → label sensible) — une inversion que A2 rend impossible, le claim devenant un
 * texte. Sans ce champ, l'en-tête des cartes de signal disparaît du rendu : le golden l'aurait
 * attrapé, on l'écrit plutôt que de l'y découvrir. C'est la méthode ADR-0004 (partir de l'écran)
 * appliquée là où l'inventaire initial a manqué un lecteur.
 *
 * Symétrique d'`AnalysisTheme.label` : un signal a un nom, comme un thème — c'est la seule chose que
 * les deux populations disjointes partagent.
 */
export type Signal = Deduction & { label: string };

/** Une ligne du registre d'usage d'un thème (ADR-0003) — textes résolus (A2), plus de clés. */
export interface ThemeUsageLine {
  actor: string;
  usage: string;
}

/** Un thème d'intérêt et ses constats (→ `ThemeCardNavy`). */
export interface AnalysisTheme {
  id: string;
  /** Le TEXTE du nom (A2), plus un templateId à router. */
  label: string;
  usage: ThemeUsageLine[];
  deductions: Deduction[];
}

/** Rythme d'activité horaire + compteurs + estimation (→ `RhythmCard`).
 *  Porteur de DONNÉES seulement : le `claim`/`framing`/`confidence` de l'ex-`aggregate` n'est plus
 *  rendu depuis la refonte v2 (l'encart nocturne a été retiré) — il n'est donc plus émis. */
export interface Rhythm {
  /** Un compteur par heure, longueur 24 (0 h…23 h). */
  hourlyActivity: number[];
  /** `total` est ALL-TIME (Activity Summary) ; les deux autres sont des fenêtres GLISSANTES sur
   *  Watch History (≈ 1 an). Le mélange est voulu (PANO-85). */
  videosWatched: { total: number; last12Months: number; last30Days: number };
  /** Minutes de visionnage ESTIMÉES par sessionisation (hypothèses : `rules/activity-rhythm.ts`). */
  estimatedMinutes: number;
}

/**
 * Volumes de l'export (→ `VolumesCard`) — NOMMÉS, plus de dispatch sur `ruleId`.
 *
 * C'est §2.3 rendu concret : `ACTIVITY_PANEL_RULE_IDS = {R1, R2, R3, R5}` (le `Set` par lequel l'UI
 * re-devinait ce que le moteur savait déjà) disparaît parce que le champ EST le nom. Fenêtre ≈ 1 an
 * (couverte par l'export), sauf `allTime` — JAMAIS mélangées (PANO-84).
 */
export interface Volumes {
  searches?: number;
  comments?: number;
  follows?: number;
  endorsements?: number;
  /** Totaux FACTUELS ALL-TIME d'Activity Summary (depuis l'inscription au compte). */
  allTime?: { videosShared: number; videosWatchedToEnd: number };
}

/** Mur sémantique : l'asymétrie de lisibilité, en comptes (→ `AnalyzableShareCard`). */
export interface Opacity {
  /** Items comportementaux auto-décrits hors-ligne (texte). */
  readableCount: number;
  /** Items opaques (liens muets, illisibles sans réseau). */
  opaqueCount: number;
}

/**
 * Ce que le moteur rend.
 *
 * `themes[].deductions` et `signals[]` sont SÉPARÉS — séparation ACTÉE (yuya), pas une commodité :
 * les deux populations sont disjointes par construction (aucun thème n'est sensible, aucun constat
 * sensible n'a de thème). Assumé : un sujet sensible n'est pas un centre d'intérêt parmi d'autres —
 * les mélanger les aplatirait. Conséquence : regrouper un sujet sensible sous un thème demanderait
 * de re-toucher ce type. C'est un choix, pas une fatalité — écrit ici plutôt que figé en silence.
 */
export interface Analysis {
  /** Absent si l'export ne porte aucun historique de visionnage exploitable. */
  rhythm?: Rhythm;
  volumes: Volumes;
  /** Absent si le mur sémantique n'a rien à compter. */
  opacity?: Opacity;
  themes: AnalysisTheme[];
  /** Les constats sensibles (D1), sans thème. */
  signals: Signal[];
}
