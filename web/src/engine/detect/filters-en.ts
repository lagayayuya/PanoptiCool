// Listes EN GÉNÉRIQUES des filtres contextuels (PANO-35, lot 1) — pendant EXACT de `filters-fr.ts`.
// Mêmes natures, même rôle : ce sont des DONNÉES transverses de la machinerie, pas du lexique de
// label. La négation, le discours rapporté et la 3ᵉ personne sont de l'anglais courant, identiques
// quel que soit le sujet détecté.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Chaque liste vient de la grammaire / l'usage courant de l'EN (négations canoniques et leurs
// contractions, verbes de parole du discours rapporté, désignations usuelles de proches), écrites à
// l'aveugle depuis l'usage commun. Aucun terme n'est issu ni inspiré d'un export d'une personne
// réelle.
//
// ── POURQUOI CE LOT EXISTE, ET POURQUOI IL VIENT EN PREMIER ───────────────────────────────────
// Mesuré (`docs/portabilite-en-filtres.md`) : sur du texte EN, les filtres FR ne matchent rien.
// Les trois filtres PROTECTEURS échouaient donc OUVERT — « i am NOT in depression », « SHE TOLD ME
// her depression is hard » et « MY SISTER has depression » produisaient tous trois un tag NOMMÉ
// `mental_health` sur le locuteur (violant SENS-B3 et SENS-C1/C2), par simple HOMOGRAPHIE FR/EN
// (« depression », « burnout », « diabetes » via le pluriel `s?`) — sans qu'aucun marqueur EN n'ait
// jamais été ajouté aux lexiques sensibles. Ce lot referme cette porte.
//
// ── SENS DE L'ÉCHEC : c'est ce qui rend ce lot SÛR à livrer seul ──────────────────────────────
// Les trois listes ci-dessous ne peuvent que SUPPRIMER un hit (négation, citation) ou le DÉGRADER
// en indirect (3ᵉ personne). Elles échouent donc CLOSED : appliquées à tort (un mot EN présent dans
// un texte FR), elles coûtent du RAPPEL, jamais de la précision sur le sensible. C'est pourquoi
// elles sont appliquées à TOUS les items sans détection de langue — le sur-filtrage est la
// direction sûre, et il évite d'introduire un classifieur de langue (qui, lui, aurait ses propres
// faux positifs). Le comportement FR est verrouillé par ses goldens, inchangés.
//
// ── DETTE ASSUMÉE, NOMMÉE : l'auto-déclaration EN n'est PAS livrée ici ────────────────────────
// `SELF_DECLARATION_HEADS` reste FR-only (« je suis », « chui »…) : « i'm depressive » ne tague
// donc RIEN. Cet écart est un défaut de RAPPEL, pas de sûreté — il échoue CLOSED, dans l'autre
// sens que les listes ci-dessous. La raison de le différer est justement là : la copule est le seul
// filtre qui CRÉE un tag nommé explicite (elle échoue OPEN), et elle demande la mesure que PANO-33
// avait faite pour le FR. À traiter dans un lot 2 de PANO-35, jamais en passant.
//
// Toutes les entrées sont déjà en forme NORMALISÉE (minuscules, sans accents ; apostrophe droite —
// `normalize-fr` unifie `’` → `'`, et le tiret vaut espace).

/** Mots de négation EN (fenêtre AVANT le marqueur — cf. `NEGATION_WINDOW`, partagée avec le FR). */
export const NEGATIONS_EN: readonly string[] = [
  'not',
  'never',
  'no',
  'none',
  'nothing',
  'nobody',
  'nowhere',
  'without',
  'nor',
  'neither',
  'cannot',
  // Contractions — les DEUX graphies : `normalize-fr` conserve l'apostrophe (« don't »), mais
  // l'usage d'internet écrit tout autant sans (« dont »). La comparaison est une égalité de token.
  "don't",
  'dont',
  "doesn't",
  'doesnt',
  "didn't",
  'didnt',
  "isn't",
  'isnt',
  "wasn't",
  'wasnt',
  "aren't",
  'arent',
  "weren't",
  'werent',
  "won't",
  'wont',
  "can't",
  'cant',
  "couldn't",
  'couldnt',
  "shouldn't",
  'shouldnt',
  "wouldn't",
  'wouldnt',
  "haven't",
  'havent',
  "hasn't",
  'hasnt',
  "hadn't",
  'hadnt',
  "ain't",
  'aint',
];

/**
 * Verbes d'OMISSION EN : omission + négation = double négation qui AFFIRME l'objet (« i never miss
 * mass » = pratique assidue). Pendant de `OMISSION_VERBS` (« je rate jamais la priere », mesuré
 * PANO-33).
 *
 * SEULE liste de ce module qui échoue OPEN (elle ANNULE une négation). Tenue volontairement COURTE
 * et sans ambiguïté FR : le seul homographe FR est « miss » (titre de concours), dont la
 * co-occurrence avec une négation ET un marqueur sensible dans la même fenêtre est inerte.
 */
export const OMISSION_VERBS_EN: readonly string[] = [
  'miss',
  'misses',
  'missed',
  'skip',
  'skips',
  'skipped',
];

/**
 * Discours rapporté EN — formes AVEC verbe de parole seulement. Même piège que le FR (mesuré
 * PANO-33) : le PASSIF MÉDICAL n'est PAS une citation — « i was told i have… » / « i was diagnosed »
 * rapportent un diagnostic reçu, pas les propos d'un tiers sur un tiers. D'où l'absence volontaire
 * de « was told » et de « told me i » nus.
 */
export const CITATION_MARKERS_EN: readonly string[] = [
  'told me',
  'called me',
  'said that',
  'according to',
  'apparently',
  'they say',
  'people say',
  'he said',
  'she said',
  'they said',
];

/**
 * Marqueurs de 3ᵉ personne EN — l'axe « pour qui » (ADR-0003) : le signal existe mais concerne
 * un proche → DÉGRADÉ en indirect (chemin signal-sans-vécu), JAMAIS supprimé.
 *
 * NOTE (écart FR relevé, NON corrigé ici) : la liste FR ne porte ni « ma mere » ni « mon pere ». Ce
 * lot ne touche PAS au FR (non-régression stricte) ; l'écart est signalé pour arbitrage séparé.
 */
export const THIRD_PERSON_EN: readonly string[] = [
  'my sister',
  'my brother',
  'my son',
  'my daughter',
  'my kid',
  'my child',
  'my teen',
  'my teenager',
  'my mom',
  'my mother',
  'my dad',
  'my father',
  'my friend',
  'my best friend',
  'my partner',
  'my boyfriend',
  'my girlfriend',
  'my wife',
  'my husband',
  'my roommate',
  'my coworker',
  'a friend of mine',
  'for my',
  'helping my',
  'help my',
  'support my',
  'supporting a',
];
