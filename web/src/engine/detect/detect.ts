// Lexical detection core (PANO-71) — GENERIC: `(texts + wired lexicons) → detections
// per label`. No label data here (it lives in `engine/lexicon/`), no insight
// (the D1 rule is the Comments adapter; Searches will be another adapter, PANO-70 §1.6).
//
// THIS IS THE DOCTRINE FILE. It contains only the CARE rules — what prevents naming
// someone wrongly. The locating mechanics (« where is this marker in this text? ») are
// extracted into `matcher.ts`: optimized, measured (PANO-87), and opinion-free. Here we decide
// one thing only: what a hit MEANS.
//
// The four MEASURED behaviors — this is where the value (and the risk) of the
// classifier lives, not in the word lists:
//   1. word boundaries (« malade » ⊄ « maladie », « psy » ⊄ « psychologie » inverse);
//   2. negation window BEFORE the marker, with the double-negation exception (omission verb
//      + negation = AFFIRMATION: « je rate jamais la priere ») — and, on SUBJECT labels
//      (`subjectNotState`), a negation DEGRADES instead of suppressing: « je supporte pas les
//      fachos » stays politics. Doctrine: ADR-0003, *L'état et le sujet*;
//   3. citation / reported speech → attributed to someone else → hit suppressed;
//   4. 3rd person (« mon ado », « pour ma soeur ») → DEGRADED to indirect, NEVER suppressed —
//      this is the signal-without-lived-experience path (B3: tagging anyway IS the demonstration, C2);
//   5. INFORMATIONAL register (« signes de X », « prevalence of X ») → DEGRADED the same way.
//      This is not one more filter: it is a STOREY rule, and it fails by under-asserting
//      where a filter would fail by removing real signal. It exists because the 3rd person
//      is item-local and looks for a possessive — « signes de dépression chez l'adolescent », typed
//      by a worried parent, carries none and used to place a NAMED finding on them (measured, register
//      bench). Doctrine: ADR-0003, *Le registre informationnel*.
//
// Expressive ELONGATION (PANO-36) is handled here because its guard is a doctrine choice: if
// direct matching fails, we retry in the SKELETONIZED space, CONDITIONED on an elongation
// ≥ 3 visible in the matched surface — « connnnard » matches « connard », but « cône » (without
// elongation) will never match « conne ». This is a RECALL problem, not an emotional signal:
// no effect on confidence (reading anger would be classifying intent, out of doctrine).
// The other variation tolerances (hyphen↔space, self-censorship, plural) are pure locating:
// `normalize-fr.ts` and `matcher.ts`.
//
// `conflictual` (item-level, B5): insult ISSUED + 2nd-person target, outside citation; frustration
// swear-word without a target excluded; a single storey, never indirect.

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

/** Contribution of ONE item (one comment) to ONE label: its storey and its surface forms. */
export interface ItemHit {
  /** Index of the item in the input list (key of the deterministic `EvidenceId` on the adapter side). */
  itemIndex: number;
  /** Storey of THIS item hit (an explicit in the 3rd person arrives here already degraded to `indirect`;
   * an interest hit is always `explicit`, D2 having a single storey). */
  stage: DetectionStage;
  /** Surface forms matched in the ORIGINAL text (→ `triggerTerms`, ⊂ text down to the character). */
  surfaces: string[];
  /** Does this hit come from a SELF-DECLARATION (« je suis un vrai X »)? Populated by INTERESTS (D2) where
   * it feeds the confidence bonus; left absent by the sensitive classifiers (D1). */
  selfDeclared?: boolean;
  /**
   * Does this hit carry a SOLO marker (`TopicalLexicon.indirectSolo`), which waives the threshold?
   *
   * Carried HERE rather than re-derived at aggregation, and this is not a refinement: `surfaces` contains
   * the forms of the ORIGINAL text (cf. just above), not the lexicon entries. Cross-referencing them with
   * the marker list therefore misses everything normalization had brought together — accented « dépression »
   * is not found in a list written without accents. Measured: the solo tier did not arm
   * in French. Only the classifier knows which list matched; it says so.
   */
  solo?: boolean;
}

/**
 * Aggregated detection of a label: the tag's storey and the items that carry it (the evidence).
 * Generic over the label type (PANO-75, MECHANICS ONLY): `SensitiveLabel` on the D1 side,
 * `string` (theme identity) on the D2 side — the machinery merely copies `lexicon.label`, it
 * never interprets its value. The `string` default covers the uses that only read `stage`/`items`.
 */
export interface LabelDetection<L extends string = string> {
  label: L;
  /** AGGREGATED storey: `explicit` (≥ 1 explicit item) or `indirect` (indirect-item threshold reached). */
  stage: DetectionStage;
  items: ItemHit[];
}

// --- The care filters ----------------------------------------------------------------------------

function tokens(norm: string): string[] {
  return norm.match(/[\w'-]+/g) ?? [];
}

/** Negation window AFTER an adherence marker — cf. `hasTrailingNegation` for why the
 *  direction and the brevity. Distinct from `NEGATION_WINDOW`, which it neither replaces nor widens. */
const ADHERENCE_NEGATION_WINDOW = 2;

/**
 * Negation in the window BEFORE the marker — EXCEPT double negation « rate/manque jamais X »
 * (omission verb + negation = AFFIRMS X, measured PANO-33).
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

/** Reported speech (citation marker present) OR marker inside quotes → attributed to someone else. */
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
 * INFORMATIONAL register: the item questions, defines or quantifies a condition instead of
 * describing it in someone (« signes de X », « prevalence of X », « qu'est ce que X »).
 */
function isInformational(text: NormalizedText): boolean {
  return INFORMATIONAL.some((marker) => findMarker(text, marker) !== null);
}

/**
 * Informational register in COMPOUND form: a lexicon term followed by a documentary head
 * (« diabetes symptoms », « burnout signs »). Same rule as `isInformational`, second form.
 *
 * It exists because the by-preposition list missed the DOMINANT word order of English:
 * « symptoms of diabetes » degraded, « diabetes symptoms » named. The head is recognized
 * only ADJACENT TO A TERM — this is what lets us not admit bare « symptoms », whose exclusion
 * from the main list is deliberate (« my symptoms have been worse » describes lived experience and must
 * not degrade).
 *
 * The anchor is the EXPLICIT term alone: an indirect term already produces a broad storey, there is
 * nothing to lower.
 */
function hasInformationalCompound(text: NormalizedText, explicitTerms: readonly string[]): boolean {
  for (const term of explicitTerms) {
    const pos = findMarker(text, normString(term));
    if (pos === null) {
      continue;
    }
    // End of the WORD, not end of the marker: the plural tolerance makes « diabete » match in
    // « diabetes », and the span can stop before the « s ». Without this catch-up, the following head
    // would never be adjacent.
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

// --- Matching spaces --------------------------------------------------------------------------

/** The two matching spaces of an item: direct, and skeletonized (elongations, PANO-36). */
interface TextSpaces {
  full: NormalizedText;
  skeleton: NormalizedText;
}

/** Builds the matching spaces of a text (once per item). */
function buildSpaces(text: string): TextSpaces {
  const full = normalizeFr(text);
  return { full, skeleton: skeletonize(full) };
}

/** Visible expressive elongation: ≥ 3 times the same character in a row. */
const ELONGATION = /(.)\1\1/;

/**
 * Hit of a marker WITHIN A SPACE: present (word boundary), neither negated nor cited. Returns the
 * SURFACE FORM (sliced from the original via the offset map), or `null`.
 * `requireElongation` = the guard of the skeleton fallback: the matched surface must carry a
 * visible elongation, otherwise the skeleton could make « cône » match « conne ».
 */
/**
 * Is the marker SWALLOWED by a covering phrase? « therapy » in « occupational therapy ».
 *
 * The containment is STRICT, and that is what makes the rule usable: without it, a covering
 * phrase would block itself, and `health_physical` would lose the signal we precisely want to let
 * it claim. Only the SHORTER marker falls.
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

/** Hit of a marker: direct space first, then skeletonized (guarded) fallback. */
function hitSurface(spaces: TextSpaces, rawMarker: string): string | null {
  const marker = normString(rawMarker); // defensive: the data is already normalized (memoized)
  const direct = hitIn(spaces.full, marker, false);
  if (direct !== null) {
    return direct;
  }
  return hitIn(spaces.skeleton, collapseRuns(marker), true);
}

/**
 * Surfaces of markers PRESENT BUT NEGATED — the exact mirror of `hitSurfaces`, and it exists only
 * for SUBJECT labels (`TopicalLexicon.subjectNotState`). Same gates as `hitIn` (citation,
 * covering phrase): only negation changes meaning, from suppression toward degradation.
 *
 * Written alongside `hitIn` rather than inside it, and deliberately so: the path of the five other labels
 * is not touched by a single line. A rework of `hitIn` would have moved the fallback into the
 * skeletonized space (today a negated hit falls back there), and a batch whose doctrine bears on `politics` and
 * `religion` has no business shifting the behavior of `mental_health` by side effect.
 *
 * DIRECT SPACE ONLY — no skeletonized fallback: negation is a fact of FUNCTION WORDS, which
 * expressive elongation does not distort. Same reason as the storey capping just below.
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
 * Is an ADHERENCE marker followed by a negation? The missing half of `isNegated`, and it
 * exists only for the self-declaration contradiction (`TopicalLexicon.adherence`).
 *
 * WHY A WINDOW AFTER, when the entire rest of the file looks BEFORE. French negation
 * is DISCONTINUOUS (« ne … pas »), and the first element is not a usable negation
 * marker: `ne` is too frequent outside negation to enter `NEGATIONS`, so the
 * before-window sees NOTHING on « je ne crois pas » — the weight is on `pas`, which FOLLOWS the verb.
 * Measured: without this window, the contradiction rule never fired.
 *
 * SHORT WINDOW (2 tokens), and that is what separates it from a « there is a negation somewhere ».
 * Also measured: a wide window capped « je pratique, je ne m'en cache pas » — a sentence
 * that AFFIRMS, whose `pas` belongs to an altogether different clause. Two tokens cover the
 * negation attached to the verb and nothing more.
 *
 * Strictly local scope: `isNegated` is not touched, so no other label moves.
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
 * Is the self-declaration SUBORDINATED to a reported question? (« on me demande si je suis X »)
 *
 * THE SAME MECHANISM AS THE ADHERENCE CONTRADICTION, SEEN FROM THE OTHER SIDE. The
 * self-declaration pattern reads a COPULA and nothing else: it does not distinguish « je suis X », which
 * affirms, from « on me demande si je suis X », which reports a third party's question. Measured, and across
 * the three labels that declare self-declared terms — not just the one that found it.
 *
 * WHY DEGRADE AND NOT FILTER, and it is the same reason as elsewhere in this file: erasing
 * would be false. Someone who is asked the question IS in relation with the subject — it is the very
 * subject of their sentence. The tag stays, the assertion falls.
 *
 * THE STRUCTURE IS VERIFIED, and not just the presence of the words: the question verb must precede
 * the copula, and « si » must sit BETWEEN the two. It is « si » that subordinates, and requiring it in
 * the right place separates « on me demande si je suis X » (reported) from « je suis X, et si on me le
 * demande je le dis » (affirmed) — two sentences that carry exactly the same words.
 *
 * WHAT THIS RULE DOES NOT COVER, and saying so keeps it from being over-cited: the question asked
 * WITHOUT « si » (« tu es X ? — oui »), the reported question in English, and the DENIAL that follows an
 * affirmation (« je suis X, je réponds non »). This last one was examined and set aside, measured: French
 * uses « non mais » as an AFFIRMATIVE emphasis marker (« je suis X, non mais
 * vraiment »), so a trailing negation does not distinguish denial from emphasis. It is the
 * failure mode that had already imposed a short window on `hasTrailingNegation`.
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

/** Surfaces of the markers that hit, deduplicated, marker order preserved. */
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
 * Surfaces of SELF-DECLARED identity terms (PANO-72): « je suis (un vrai) X ». The whole span
 * (copula + modifiers + term) is the surface form, highlightable as is. Neither negated (
 * negation breaks the pattern), nor cited. Always explicit (the copula anchors the 1st person).
 *
 * `heads` is a PARAMETER, and it is the language gate (PANO-35): a head list reads only
 * the terms admitted for ITS language. The (heads, terms) pair is therefore visible at the call site, where
 * a reader can check it is properly paired — and not buried in a global import that
 * read everything lying around.
 */
function hitSelfDeclared(
  spaces: TextSpaces,
  terms: readonly string[],
  heads: readonly string[],
): string[] {
  if (!canSelfDeclare(spaces.full, heads)) {
    return []; // no head copula → the pattern cannot match (short-circuit PANO-87)
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

// --- Per-item classification ---------------------------------------------------------------------

/** Item → topical hit (B1/B3): explicit about oneself, else degraded/indirect, else nothing. */
function classifyTopicalItem(
  spaces: TextSpaces,
  lexicon: TopicalLexicon,
): Omit<ItemHit, 'itemIndex'> | null {
  // Self-declaration (« je suis X »): always explicit, NEVER degraded by the 3rd person —
  // the copula anchors the 1st person (PANO-72). A « je suis dépressif, comme ma fille » stays an
  // explicit lived experience of the speaker.
  const selfDeclaredSurfaces = hitSelfDeclared(
    spaces,
    lexicon.selfDeclaredFr ?? [],
    SELF_DECLARATION_HEADS_FR,
  );
  // ENGLISH SELF-DECLARATION — same mechanism, OPPOSITE STOREY. It does NOT enter
  // `explicitSurfaces`: it joins the indirect block below, and confers no solo
  // crossing there. Both properties are the doctrine of the tier, not one more caution —
  // `TopicalLexicon.selfDeclaredEn` carries them with their measurements.
  //
  // The (heads, terms) pair is visible HERE for both languages, and this is the language gate:
  // each term list is read only with the heads of ITS language. A reader checks
  // the pairing at a glance, without going back up into an import.
  const selfDeclaredEnSurfaces = hitSelfDeclared(
    spaces,
    lexicon.selfDeclaredEn ?? [],
    SELF_DECLARATION_HEADS_EN,
  );
  const explicitNudeSurfaces = hitSurfaces(spaces, lexicon.explicit);
  // Storey capping (3rd person, informational register): direct space only — no
  // elongation tolerance on function words, the gain would be nil and the FP surface
  // needlessly widened.
  // STOREY CAPPING — this is not a filter, and the distinction is the thing not to lose:
  // a filter answers « does this finding exist », by yes or no, and errs by REMOVING
  // real signal; this answers « at which storey », and at worst errs by under-asserting.
  //
  // The TWO reasons produce the same storey and are kept SEPARATE, because they do not say
  // the same thing and do not open the same rights:
  //   - the 3rd person says FOR WHOM the signal holds (B3);
  //   - the informational register says IN WHAT FORM it is written.
  // Only the second confers the SOLO crossing (see below).
  const third = hasThirdPerson(spaces.full);
  // The TWO forms of the informational register — by preposition (« symptoms of X ») and by
  // compound (« X symptoms ») — produce the same capping and open the same rights. This is
  // deliberate: they are two word orders for a single register, not two rules. Distinguishing them
  // downstream would make the storey depend on a fact of syntax, which no doctrine requires.
  const informational =
    isInformational(spaces.full) || hasInformationalCompound(spaces.full, lexicon.explicit);
  const capped = third || informational;
  // Bare explicit terms are capped (B3); self-declaration NEVER is — the copula
  // anchors the 1st person, and « je suis en dépression, comme dans les signes de dépression que j'ai
  // lus » stays a declared lived experience.
  // CONTRADICTED SELF-DECLARATION — SUBJECT labels only (`TopicalLexicon.adherence`). An item
  // that declares a belonging AND denies adherence in the same breath (« je suis catholique mais je ne
  // crois pas ») cannot NAME: the copula does anchor the 1st person, but the sentence removes
  // the assertion the named storey would carry.
  //
  // It is a CAPPING, not a filter, and the distinction is the whole point: erasing would be false
  // — this person has a relation to this tradition, it is the very subject of their sentence. The tag
  // stays, the assertion falls. Doctrine and rationale: `TopicalLexicon.adherence`.
  const contradicted =
    lexicon.subjectNotState === true &&
    selfDeclaredSurfaces.length > 0 &&
    hasTrailingNegation(spaces.full, lexicon.adherence ?? []);
  // REPORTED QUESTION — the other side of the same mechanism, and it is NOT reserved to subject
  // labels. The adherence contradiction assumes one can adhere or not to what one declares, which
  // only makes sense for a SUBJECT; a reported question, in contrast, removes the assertion whatever
  // the label — « on me demande si je suis dépressif » no more affirms a depression than a
  // belonging. Hence the absence of a `subjectNotState` guard here, which would be a copy of form
  // without its reason.
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
  // SOLO markers are indirect markers like the others AT THE ITEM LEVEL: what
  // distinguishes them is AGGREGATION (they waive the threshold). They are matched separately only
  // so it can be SIGNALED — not because their classification would differ.
  const soloSurfaces = hitSurfaces(spaces, lexicon.indirectSolo ?? []);
  const indirectMarkers = lexicon.includeColloquial
    ? [...lexicon.indirectCore, ...lexicon.indirectColloquial]
    : lexicon.indirectCore;
  const indirectSurfaces = hitSurfaces(spaces, indirectMarkers);
  // POLARITY — SUBJECT labels only (ADR-0003, *L'état et le sujet*). A NEGATED marker is not
  // suppressed, it is degraded: « je supporte pas les fachos » and « je ne crois pas en dieu » are
  // on the subject, and negation tells its polarity, not its absence. The named storey stays closed to them —
  // asserting on a sentence that denies would be exactly the error the filter avoided.
  const negatedSurfaces =
    lexicon.subjectNotState === true
      ? negatedHitSurfaces(spaces, [...lexicon.explicit, ...indirectMarkers])
      : [];
  // Bare explicit term, capped → DEGRADED to indirect (never named, never suppressed — B3).
  const degraded = capped ? explicitNudeSurfaces : [];
  // NON-ASSERTED self-declaration falls back here — contradicted by an adherence negation, or
  // subordinated to a reported question. This is the move that distinguishes these two rules from a filter:
  // the surface is kept as indirect evidence. Without this line, the capping would erase the
  // hit instead of lowering it — exactly what doctrine refuses. The two causes share this
  // slot because they produce the SAME result; they stay two distinct booleans because
  // they do not fire on the same labels.
  const unassertedSurfaces = contradicted || reported ? selfDeclaredSurfaces : [];
  const surfaces: string[] = [];
  for (const s of [
    // ENGLISH self-declaration arrives here and nowhere else — never in `explicitSurfaces`.
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
  // SOLO CROSSING — same rule, second path.
  //
  // A term degraded by the INFORMATIONAL REGISTER crosses ALONE, exactly like a bare name from
  // `indirectSolo`. Both cases share the same form: the precise term IS written, and it is the FRAMING
  // that forbids asserting. The bare-name tier already held this form for bare names; it was
  // missing this path. It is a rule joining a case it had missed, not a new
  // rule — and without it, the two mechanisms composed into a DISAPPEARANCE: the framing removed
  // the named storey, then the threshold removed the finding, whereas neither rule required
  // that there be nothing left to show.
  //
  // The 3rd person, in contrast, confers NOTHING. Its reason is the reverse: it says the signal does
  // not concern the speaker, which is precisely a reason NOT to let an isolated item place
  // a finding on them. The two cappings produce the same storey for opposite reasons,
  // and only one of the two justifies skipping the threshold.
  const degradedSolo = informational && degraded.length > 0;
  // SAME CROSSING FOR NON-ASSERTED SELF-DECLARATION, and for the reason already written just
  // above: the precise term IS written, and it is the FRAMING that forbids asserting. Without this
  // line, the degradation composes with the threshold into a DISAPPEARANCE — the capping removes
  // the named storey, then the threshold removes the finding, whereas neither rule requires
  // that there be nothing left to show. It is erasure through the back door, very
  // exactly what « degrade, don't filter » refuses.
  //
  // Measured, and this is what made the rule visible: « on me demande si je suis dépressif » returned
  // NOTHING on a threshold-2 label, where the same frame returned a broad finding on threshold-1
  // labels. The capping of the adherence contradiction carried the same latent defect, without
  // any bench being able to see it — its only label declaring `adherence` is at threshold 1.
  const unassertedSolo = unassertedSurfaces.length > 0;
  // AND ENGLISH SELF-DECLARATION CONFERS NONE — a DELIBERATE, measured absence, not to be
  // « fixed » by filing it with the two cases above.
  //
  // Its neighbors in this block cross because the precise term IS written and only the FRAMING
  // forbids asserting. The form looks alike, and that is the trap: here the framing establishes nothing
  // about the speaker, because the English frame does not disambiguate (`filters-en.ts`). Giving it the
  // crossing would amount to making the frame carry a load it does not bear.
  //
  // Measured, rejected variant: the waiver took a set of 43 idiom sentences from 8 to 16
  // firings and added a wrong on `en_idiomatic` (« i am so ocd about the label alignment
  // on the jars ») — on a term, `ocd`, that was ALREADY in the lexicon. The cost is not the
  // vocabulary, it is the crossing. Price accepted in exchange: on threshold-2 labels,
  // « i am diabetic » written a single time returns nothing.
  if (surfaces.length > 0) {
    return {
      stage: 'indirect',
      surfaces,
      ...(soloSurfaces.length > 0 || degradedSolo || unassertedSolo ? { solo: true } : {}),
    };
  }
  return null;
}

/** Item → conflictual hit (B5): insult issued + 2nd-person target, outside citation. */
function classifyConflictualItem(
  spaces: TextSpaces,
  lexicon: ItemLevelLexicon,
): Omit<ItemHit, 'itemIndex'> | null {
  if (CITATION_MARKERS.some((c) => findMarker(spaces.full, c) !== null)) {
    return null; // REPORTED / received insult (« il m'a traite de… ») — out of scope
  }
  const insultSurfaces = hitSurfaces(spaces, lexicon.insults);
  if (insultSurfaces.length === 0) {
    return null;
  }
  // 2nd-person target: direct space only (function words, cf. classifyTopicalItem).
  const targeted = lexicon.targets.some((t) => findMarker(spaces.full, normString(t)) !== null);
  // Without a 2nd-person target = frustration swear-word (« putain ce bug ») → excluded.
  return targeted ? { stage: 'explicit', surfaces: insultSurfaces } : null;
}

/**
 * Item → INTEREST hit (D2, PANO-75; co-occurrence PANO-76): a marker present (word
 * boundary), neither negated nor cited. SIMPLIFIED form of `classifyTopicalItem` — NO call to `hasThirdPerson`:
 * the absence of 3rd-person degradation IS the rule « an interest stays an interest » (talking about others
 * signals the same theme). Always `explicit` (a single storey). `selfDeclared` surfaced for the bonus.
 *
 * CO-OCCURRENCE DISAMBIGUATION (collect-then-filter, single-pass compatible PANO-87): we
 * gather ALL the item's raw hits (solo, anchored, self-declared), then keep the ANCHORED
 * (ambiguous) markers ONLY if a domain companion co-occurs — a solo/selfDeclared (strong
 * signal), or ANOTHER anchored one (two 50/50s together are worth the domain). Isolated anchored ones are set aside.
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
  // A STRONG companion (solo or self-declared) is enough to anchor; otherwise, two distinct anchored ones
  // anchor each other. Isolated, an anchored one does not count.
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

// --- Aggregation ------------------------------------------------------------------------------------

/**
 * Detects ONE lexicon over the already-normalized texts → the aggregated storey + its contributing items, or
 * `null` if the lexicon does not tag. Typed on the CONCRETE union `DetectableLexicon` (and not the
 * generic of `detectLabels`) because narrowing by `kind` does not work on a type
 * parameter: here the value is concrete, the discrimination narrows correctly toward each classifier.
 *   - `interest` (D2): a single storey; no threshold — the RANKING (top-N, floor) lives in the
 *     D2 rule; we emit any interest having ≥ 1 hit;
 *   - `item-level` (conflictual): ≥ 1 item emitted → `explicit`;
 *   - `topical` (sensitive): ≥ 1 explicit → `explicit`; else ≥ 1 SOLO marker **or** ≥ indirect
 *     threshold → `indirect`.
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
  // A SOLO marker waives the threshold, and it ALONE: it can never raise the storey.
  // The ceiling is structural — this block is AFTER the `explicit` return, so a solo never adds
  // anything to a named finding, and it cannot fabricate one.
  const hasSolo = items.some((i) => i.stage === 'indirect' && i.solo === true);
  if (hasSolo || indirectCount >= lexicon.indirectThreshold) {
    return { stage: 'indirect', items };
  }
  return null;
}

/**
 * Detects labels over a list of texts (the items of ONE section, in source order).
 * Generic over the label type (PANO-75, MECHANICS ONLY): the type of `lexicon.label` is
 * propagated as is toward `LabelDetection.label` — D1 (`LabelLexicon[]`) receives `SensitiveLabel`, D2
 * (`InterestLexicon[]`) receives `string`, without the machinery ever interpreting the value. The
 * detection behavior is UNCHANGED for D1 (non-regression goldens: `detect.test.ts`,
 * `lexicon-battery.test.ts`, `d1-sensitive-topics.test.ts`).
 *
 * `items` carries ALL the contributing items of the retained label (the evidence to reference); the
 * non-retained items never enter the store (bound §5.1). The RANKING of interests (top-N, floor)
 * does NOT live here: it is the D2 rule that applies it on these raw detections.
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
