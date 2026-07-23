// GENERIC FR lists of the contextual filters (PANO-71) — cross-cutting data of the machinery,
// NOT label lexicon: negation, reported speech and the 3rd person are everyday
// French, identical whatever the subject detected.
//
// ── Genericity justification (PANO-70 §3, §2.5 discipline) ─────────────────────────────────
// Each list comes from the grammar/everyday usage of FR (canonical negation words, speech
// verbs of reported speech, usual designations of relatives), built blind to
// any real export. No term is drawn from or inspired by a real person's export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// All entries are already in NORMALIZED form (lowercase, no accents) — they match
// the `norm` of `normalize-fr.ts` without re-normalization.

/** Negation words (window BEFORE the marker — cf. `NEGATION_WINDOW`). */
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

/** Size of the negation window, in tokens before the marker (PANO-33 measurement). */
export const NEGATION_WINDOW = 3;

/**
 * OMISSION verbs: omission + negation = double negation that AFFIRMS the object
 * (« je rate jamais la priere » = diligent practice, not a negation). Measured PANO-33.
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
 * Reported speech — forms WITH a speech verb only: « on m'a diagnostique » (medical
 * passive) is NOT a citation, hence no bare « on m'a » / « il m'a » (trap measured PANO-33).
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
 * 3rd-person markers — the « for whom » axis (ADR-0003): the signal exists but concerns
 * a relative → DEGRADED to indirect (signal-without-lived-experience path), NEVER suppressed.
 *
 * This filter fails CLOSED (at worst we lose recall, we never name wrongly): the list must
 * therefore be GENEROUS — a relative missing here is a safety flaw (« la dépression de ma
 * mère » would name the user in place of the third party they are talking about), not a completeness detail.
 * Close + extended family AND colloquial register (« mec »/« meuf »/« ex »), written blind,
 * like the rest of the file.
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
  // Close family (flaw fill — mother/father wrongly absent).
  'ma mere',
  'mon pere',
  'mes parents',
  // Extended family.
  'ma grand mere',
  'mon grand pere',
  'ma mamie',
  'mon papy',
  'mon oncle',
  'ma tante',
  'mon cousin',
  'ma cousine',
  // Colloquial register (partner/ex).
  'mon mec',
  'ma meuf',
  'mon ex',
];

// --- Self-declaration pattern (PANO-72, cross-cutting the 6 labels) ----------------------------
// Generic structure [copula head] + [optional modifiers] + [identity term]: captures
// « je suis un vrai catho », « jsuis une grosse dépressive », « chui plutôt de droite » without
// listing these variants (the structure is a pattern → machinery; the identity term stays a
// label datum, cf. `TopicalLexicon.selfDeclared`). The copula ANCHORS the self-designation to the
// person: a self-declaration match is always EXPLICIT (1st pers.), never degraded to
// 3rd person. Ethical benefit as a bonus: the self-deprecating register (« un pauvre dépressif »)
// is captured without being listed.

/**
 * Verbs that REPORT a question — the copula that follows them, subordinated by « si », affirms
 * nothing (« on me demande si je suis X »). Cross-cutting the six labels: it is grammar, not
 * subject vocabulary, and the same sentence is built on any identity.
 *
 * *Why a list of VERBS and not of complete frames.* « on me demande si », « on me demande
 * souvent si », « il m'a demandé hier si » are the same construction with an adverb slipped in the
 * middle. Listing the frames would have made the rule depend on an insertion accident; it is the
 * (question verb, subordinating « si ») pair that carries the meaning, and checking it lets
 * the adverb through without enumerating it.
 *
 * *What the list does not contain, and deliberately so.* No generic speech verb
 * (« dire », « raconter »): those already live in `CITATION_MARKERS`, where they FILTER. Here we
 * degrade, and confusing the two would tip from reported speech toward erasure.
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

/** Copula heads of self-declaration (« je suis X »). Contracted internet forms included. */
export const SELF_DECLARATION_HEADS_FR: readonly string[] = [
  'je suis',
  'jsuis',
  "j'suis",
  'chui',
  'chuis',
  'je me sens',
];

/**
 * Optional generic modifiers between the copula and the term (« un vrai », « une grosse »,
 * « plutôt »…). Cross-cutting: neither label vocabulary nor sensitive markers — grammar.
 * Negation (« pas », « jamais »…) is NOT here: it breaks the pattern by construction
 * (« je suis pas croyant » does not have the term stuck to the copula), so negation stays handled.
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
  // PERSON NOUNS — « je suis une femme trans », « je suis un mec bi », « je suis une personne
  // non binaire ». These are modifiers just like « un vrai »: the semantic head
  // stays the identity term that follows, and the person noun merely carries it.
  //
  // They are here, in the GRAMMAR, rather than as phrases in each lexicon, and that is the point:
  // « femme trans », « homme trans », « personne trans », « mec trans » are the same construction
  // repeated. Listing them per label would have multiplied the entries without ever covering the next, and
  // the measured gap was not lexical — the bare term was already admitted, it is the interposed
  // person noun that broke the pattern.
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
 * INFORMATIONAL REGISTER (FR) — documentary-framing markers.
 *
 * This is NOT a filter: these markers never suppress a finding, they **lower its
 * storey** (named → broad). Searching a symptom IS a signal — a platform reads it, and the
 * product must show it — but it is not proof of a lived condition, and the product must
 * therefore not assert one. Doctrine: ADR-0003, *Le registre informationnel*.
 *
 * Admission criterion, and it is worth holding: a marker enters if it signals that the item
 * **questions, defines or quantifies** a condition, instead of describing it in someone. No
 * entry was drawn from a bench item — without which the rule would be nothing but a mirror of what we
 * wanted to see it catch.
 *
 * What does NOT enter: the turns of phrase that distinguish « X est Y » from « j'ai X ». Covering them
 * would amount to requiring a 1st-person anchoring, which would also degrade the person living the
 * condition — measured, and set aside for that reason.
 */
export const INFORMATIONAL: readonly string[] = [
  // Question — the most common form of a worried relative's search.
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
  // Solicit ANOTHER'S experience — fourth mode of the informational register, added after the
  // first batch. Questioning, defining and quantifying placed the item ON a condition;
  // this one places it as a request for ACCOUNTS. A testimonial is by definition someone
  // else's experience: asking for it situates the author as a reader, not a bearer.
  //
  // It also covers, and legitimately, the bearer who questions — « quelqu'un a déjà eu ça ? » written
  // by someone concerned. The sentence contains the term but affirms nothing about its author, so
  // the named storey is not justified there: the degradation is correct in the sense of doctrine (the fine-grained
  // exists only if it is WRITTEN), not a collateral damage we tolerate.
  'temoignage',
  'avis sur',
  "retour d'experience",
  'retour d experience',
  "quelqu'un a deja",
  'quelquun a deja',
  // Define.
  'difference entre',
  'definition',
  'signification',
  'types de',
  'explication',
  // Quantify — the register of documentation and study.
  'prevalence',
  'statistiques',
  'meta analyse',
  'revue systematique',
];
