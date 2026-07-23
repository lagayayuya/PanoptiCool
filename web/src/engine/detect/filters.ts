// Contextual filters of the machinery — FR + EN composition (PANO-35, batch 1).
//
// `detect.ts` consumes THIS module, never `filters-fr` / `filters-en` directly: the machinery must
// not know how many languages exist, and one more language = one more data module
// + one line here. The per-language lists stay readable and reviewable SEPARATELY (each carries its
// genericity justification); only the composition lives here.
//
// ── NO language detection — and it is a choice, not a shortcut ───────────────────────────
// The lists of both languages are applied to ALL items. Reason: the three PROTECTIVE
// filters (negation, citation, 3rd person) fail CLOSED — at worst, a word of one language
// present in the other costs RECALL, never precision on the sensitive. A language
// detector, in contrast, would introduce a new source of false positives (items are short: a
// three-word search has no reliable language) for zero gain in the safe direction.
// The FR behavior is locked by its goldens (`detect.test.ts`), unchanged by this
// composition.
//
// `NEGATION_WINDOW` stays SHARED (3 tokens, measured PANO-33 on FR): EN negation is placed
// before the marker as in FR (« not in depression » ≡ « pas de dépression »), the window
// carries over. To be re-measured if one day an EN corpus contradicts it.

import {
  CITATION_MARKERS_EN,
  COVERING_PHRASES_EN,
  INFORMATIONAL_EN,
  INFORMATIONAL_SUFFIXES_EN,
  NEGATIONS_EN,
  OMISSION_VERBS_EN,
  SELF_DECLARATION_MODIFIERS_EN,
  THIRD_PERSON_EN,
} from './filters-en';
import {
  CITATION_MARKERS as CITATION_MARKERS_FR,
  INFORMATIONAL as INFORMATIONAL_FR,
  NEGATIONS as NEGATIONS_FR,
  OMISSION_VERBS as OMISSION_VERBS_FR,
  SELF_DECLARATION_MODIFIERS as SELF_DECLARATION_MODIFIERS_FR,
  THIRD_PERSON as THIRD_PERSON_FR,
} from './filters-fr';

export { SELF_DECLARATION_HEADS_EN } from './filters-en';
export {
  NEGATION_WINDOW,
  // FR only, and the name says it: the construction subordinated by « si » is French. English
  // reports its questions differently (« they ask if/whether »), and nothing in this batch covers it —
  // English self-declaration never reaching the named storey anyway, there would be nothing
  // to degrade there.
  REPORTED_QUESTION_VERBS as REPORTED_QUESTION_VERBS_FR,
  SELF_DECLARATION_HEADS_FR,
} from './filters-fr';

/**
 * Self-declaration modifiers, all languages.
 *
 * COMPOSED, where the HEADS stay paired by language — and the asymmetry is deliberate. A head
 * opens access to a list of TERMS: mixing them undoes the language gate (measured, PANO-35).
 * A modifier, in contrast, reaches no term without a head of its own language: « i am vrai gay »
 * and « je suis a gay » belong to neither language, and the (heads, terms) pair stays
 * paired at the call site in `detect.ts`, where a reader checks it.
 *
 * The modifiers carry NO safety load — arbitration 2026-07-18, and now measured
 * rather than reasoned (`filters-en.ts`, *the copula does not disambiguate*). Also measured: the
 * composition moves no counter of the French benches.
 */
export const SELF_DECLARATION_MODIFIERS: readonly string[] = [
  ...SELF_DECLARATION_MODIFIERS_FR,
  ...SELF_DECLARATION_MODIFIERS_EN,
];

/** Negations, all languages (window BEFORE the marker). */
export const NEGATIONS: readonly string[] = [...NEGATIONS_FR, ...NEGATIONS_EN];

/** Omission verbs, all languages (double negation = affirmation). */
export const OMISSION_VERBS: readonly string[] = [...OMISSION_VERBS_FR, ...OMISSION_VERBS_EN];

/** Reported-speech markers, all languages. */
export const CITATION_MARKERS: readonly string[] = [...CITATION_MARKERS_FR, ...CITATION_MARKERS_EN];

/** 3rd-person markers, all languages (degrade to indirect, never suppress). */
export const THIRD_PERSON: readonly string[] = [...THIRD_PERSON_FR, ...THIRD_PERSON_EN];

/**
 * INFORMATIONAL register markers, all languages. Like the 3rd person, they degrade to
 * indirect and never suppress — but for a distinct reason, and the two lists stay
 * separate on that count: the 3rd person says FOR WHOM the signal holds, the informational register says
 * IN WHAT FORM it is written. An item can carry both, or one without the other.
 */
export const INFORMATIONAL: readonly string[] = [...INFORMATIONAL_FR, ...INFORMATIONAL_EN];

/**
 * COMPOUND heads of the informational register, all languages — they count only AFTER a lexicon
 * term (« diabetes symptoms »), never alone (« my symptoms » stays intact).
 *
 * EN only to date, and it is not an oversight: French does not have this defect (it carries
 * bare « symptomes », and its two word orders already degrade). The composition stays written like
 * the others so that adding a language stays a single line — the per-language justification lives in
 * `filters-en.ts`.
 */
export const INFORMATIONAL_SUFFIXES: readonly string[] = [...INFORMATIONAL_SUFFIXES_EN];

/**
 * COVERING phrases, all languages — a marker strictly contained in one of them does not
 * count (« therapy » in « occupational therapy »). EN only to date; the
 * per-language justification lives in `filters-en.ts`.
 */
export const COVERING_PHRASES: readonly string[] = [...COVERING_PHRASES_EN];
