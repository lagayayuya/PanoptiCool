// Per-label lexicon types (PANO-70 §2.2) — the STRUCTURE, strictly separated from the machinery
// (`engine/detect/`) and the data (one module per label, `engine/lexicon/<label>.ts`).
//
// Discriminated union on `kind`:
//   - `topical` — two-tier sensitive labels (B1): explicit → named tag; repeated topical →
//     broad tag.
//   - `item-level` — `conflictual` only (B5): the EMITTED insult aimed at another user
//     IS the explicit signal; no indirect tier, never a vague tag by accumulation.
//   - `interest` — non-sensitive INTEREST (D2, PANO-75): SIMPLIFIED form of the topical (see below).
//
// Marker entries are written in NORMALIZED form (lowercase, no accents — the format
// `detect.ts` matches against). Simple terms and phrases accepted. Each data module carries at its
// head its GENERICITY JUSTIFICATION (PANO-70 §2.5/§3 discipline): a term without a generic
// justification does not pass review.

/**
 * A usage line as the LEXICON carries it (ADR-0003). Defined here since Refonte A
 * (batch A2): the `schema.ts` it used to live in is removed, and `Analysis` now carries TEXTS
 * (`ThemeUsageLine`), not keys — the lexicon, for its part, keeps its keys (it is UNTOUCHABLE, and
 * the "wording ratifiable in ONE file" obligation wants the texts to live in `wording.ts`,
 * not in the 57 lexicon modules). It is therefore D2 that resolves these keys into text.
 * Only the type PLUMBING changes here; neither the doctrine nor the lexicon data move.
 */
export interface ThemeUsage {
  /** Actor-category key (`advertiser`, `insurer_employer`…), resolved by `wording.ts`. */
  actor: string;
  /**
   * Usage-template key, resolved by `wording.ts`. `params` is kept OPTIONAL and unused:
   * the 57 lexicon modules write it (`params: {}`) and are untouchable — without it, TS's
   * excess-property check would reject their literals. No usage has ever taken a
   * parameter; the field therefore serves only to avoid touching the data.
   */
  usage: { templateId: string; params?: Record<string, string | number> };
}

/** The 6 sensitive labels blessed by ADR-0003 (catalogue: `docs/constats-sensibles.md`). Pass 1:
 *  3 wired. */
export type SensitiveLabel =
  | 'health_physical'
  | 'mental_health'
  | 'sexuality'
  | 'politics'
  | 'religion'
  | 'conflictual';

/** Lexicon of a two-tier label (B1). */
export interface TopicalLexicon {
  kind: 'topical';
  label: Exclude<SensitiveLabel, 'conflictual'>;
  /**
   * Readings of the fan (`Evidence.readings`) of the INDIRECT finding — keys taken from the
   * readings registry in `docs/constats-sensibles.md`, NEVER invented here: adding a reading means
   * amending the registry first (yuya's gate). Mode always `equal` — readings are displayed
   * flat; confidence lives on the finding, never on a reading (ADR-0003).
   */
  readingTemplateIds: readonly string[];
  /** Precise terms that, applied to oneself, justify a NAMED tag (B2: the fine-grained exists only if it is written). */
  explicit: readonly string[];
  /**
   * BARE identity terms matched ONLY via the self-declaration pattern (« je suis X »,
   * PANO-72) — never on a word boundary alone. Difference with `explicit`: these terms are too
   * ambiguous bare (« lesbienne », « de gauche », « dépressif ») for a named tag without a copula; the
   * copula anchors them to the 1st person. A self-declaration match is always explicit (never
   * degraded to 3rd person). The same term may ALSO live in `indirectCore` (bare → broad tag,
   * B1: « cette actrice est lesbienne » stays indirect, never named). Optional.
   *
   * ── THE `Fr` SUFFIX IS A GATE, NOT A LABELLING (PANO-35) ──────────────────────────────────────
   * **Write here only terms admitted for FRENCH.** This tier is matched ONLY via the copula
   * heads, and `detect.ts` pairs it explicitly with `SELF_DECLARATION_HEADS_FR`. One more language
   * = one more term list (`selfDeclaredEn`) paired with its own heads, never an English
   * term slipped into this list.
   *
   * *Why the gate exists, and it is a measure, not a precaution.* Before this batch, there was
   * only ONE list and ONE set of heads. The heads being FR-only, they formed an **undeclared
   * language gate**: the English-spelling entries present here — `muslim`, `gay`, `ace`,
   * `trans`, `militant`, `liberal`… — were unreachable in English **by accident**, not
   * by decision. Measured: adding a single English head activated them ALL at once, as a
   * NAMED finding, without any of them ever having been examined for English — « im ace at darts » designated
   * someone as asexual. Adding EN heads therefore does not add a feature: it REMOVES
   * a protection that no one had written.
   *
   * The witness `selfdeclared-language-gate.test.ts` holds this gate and carries the registry of
   * English spellings **not admitted for English** — explicitly, rather than unreachable.
   */
  selfDeclaredFr?: readonly string[];
  /**
   * ENGLISH identity terms matched via the self-declaration pattern (« i am X »), paired with
   * `SELF_DECLARATION_HEADS_EN`. Optional.
   *
   * ── THIS TIER NEVER ASSERTS, AND THAT IS ITS REASON FOR BEING ─────────────────────────────────
   * **A hit lands as INDIRECT, never as `explicit`** — unlike `selfDeclaredFr`, which
   * NAMES. This is not one more caution: it is the very form of this tier, and it is named
   * by ADR-0003 (*The demotion*) — "a tier that waives the threshold without allowing naming",
   * here without the waiver (see below).
   *
   * *Why a copy of `selfDeclaredFr` was the wrong move.* The copy would have NAMED
   * « i am gay » in English, i.e. flung open the error cost that the language gate
   * exists to keep shut. And it would have INVERTED the symmetry rule instead of repairing it: the
   * repair requires that « i am straight » fire AS MUCH as « i am gay », not that both
   * rise a tier that no one measured for English. By landing broad, both
   * sides fire equally, and neither gets named. Symmetry is satisfied **by
   * construction**, not by a term count that would need re-verifying at each addition.
   *
   * ── THE COPULA DOES NOT DISAMBIGUATE IN ENGLISH — measure, and it decides everything ──────────
   * **Never make the frame carry a safety load.** The copula doctrine (« la copule
   * ancre la 1ʳᵉ personne », `selfDeclaredFr`) is FRENCH and does not carry over: the English idiom
   * is written massively in the first person. Measured, and these are not edge cases —
   * « im so ocd about my desk drawers », « im autistic about train timetables », « im arthritic
   * after that hike », « im depressed that the bakery closed early » all carry the frame.
   *
   * Hence the consequence for what protects: here safety does NOT come from the frame, it comes from
   * the TIER — and from the term-admission gate, as everywhere else. The frame buys only
   * RECALL (it makes `straight` admissible, where the bare term in `indirectCore` was measured at
   * 1 → 4 wrongs). Long justification and measurement surface: `filters-en.ts`.
   *
   * ── NO SOLO CROSSING, and it is a quantified decision ─────────────────────────────────────────
   * A hit of this tier counts toward the threshold **like any indirect**. The variant that gave it
   * the threshold waiver was measured and REFUSED: it took the idiom from 8 to 16
   * firings (43-phrase set) and added a wrong on `en_idiomatic` — « i am so ocd about
   * the label alignment on the jars ». The term `ocd` was ALREADY in the lexicon; only the waiver
   * let it through. **The cost was not the vocabulary, it was the crossing.**
   *
   * *What it costs, and it is accepted explicitly:* on the two threshold-2 labels
   * (`mental_health`, `health_physical`), « i am diabetic » written ONCE yields NOTHING. That is what
   * the threshold already does everywhere else. On the threshold-1 labels (`religion`, `sexuality`),
   * the absence of a waiver costs nothing at all.
   */
  selfDeclaredEn?: readonly string[];
  /**
   * Markers that set the BROAD tag **on their own** — one hit suffices, the threshold does not apply —
   * and that NEVER name it, however many there are. Optional.
   *
   * The tier of BARE disorder NOUNS (« depression », « anxiety », « ptsd »). They fall between the
   * two existing tiers, and that is why neither fit them:
   *   - `explicit` asserts a condition. On « this heat is giving me depression », that is false —
   *     everyday English uses these nouns as intensifiers (measured, upper-bound bench).
   *   - the indirect threshold requires repetition. But a person who writes ONCE, literally,
   *     that they have depression does not vanish from the field: they would vanish from the detector
   *     (measured too — that is what made the first demotion attempt fail).
   *
   * The name is taken from `InterestLexicon.markers` (« SOLO markers: they enter ON THEIR OWN »):
   * same property, same word. The `indirectThreshold` is NOT touched — this tier goes
   * around it, it does not redefine it.
   *
   * The rule it applies is not new: this lexicon already holds "the full phrase names, the
   * bare noun does not" (`bipolar disorder` vs `bipolar`, `panic attack` vs `panic`). This tier
   * is where the bare nouns that had slipped through land.
   */
  indirectSolo?: readonly string[];
  /**
   * Does this label describe a SUBJECT one frequents, rather than a STATE one is? (ADR-0003, *The state and
   * the subject*.) Default: `false` — the state is the case of the four condition labels.
   *
   * What the flag changes, and it changes only that: a negation before a marker **degrades**
   * the hit to indirect instead of **suppressing** it.
   *
   * *Why a flag rather than a single rule.* On a STATE label, « je ne suis pas
   * déprimé » describes no depression: the negation removes the signal, and the filter is right.
   * On a SUBJECT label, « je supporte pas les fachos » does not remove the politics — the negation
   * carries the POLARITY, not the absence of subject. Applying the state behavior to a subject label
   * makes the product deaf to OPPOSITION, which is the dominant register of political and
   * religious discourse: measured, the lexicon heard only the adherent.
   *
   * *And why a degradation, not an exemption.* Leaving the negation intact would set a
   * NAMED finding on « je ne suis pas socialiste » — asserting precisely what the sentence denies. The
   * degradation keeps the subject and removes the assertion: same form as the informational-register
   * rule, and same failure sense — at worst it under-asserts, which is recoverable.
   *
   * A hit degraded this way NEVER confers solo crossing: it counts toward the threshold like
   * any indirect, and nothing more.
   */
  subjectNotState?: boolean;
  /**
   * ADHERENCE terms whose NEGATION contradicts a self-declaration — SUBJECT labels only,
   * and with no effect if the label declares none. Optional.
   *
   * *What it does, and nothing else.* When an item carries BOTH a self-declaration
   * (« je suis catholique ») and one of these terms UNDER NEGATION (« je ne crois pas »), the
   * self-declaration hit is **capped at indirect** instead of naming. The tag survives, the assertion
   * falls.
   *
   * *Why cap and not filter.* Erasing would be false: someone who writes « catholique
   * mais je ne crois pas » HAS a relationship to that tradition — it is the SUBJECT of their sentence. And
   * filtering would have no end, each distancing turn (« sans vraiment y croire », « plus
   * depuis longtemps ») demanding its own exception. Capping fails by under-asserting,
   * which is recoverable; the filter fails by erasing, which is not.
   *
   * *Why negation did not suffice.* The negation window looks BEFORE the marker, in
   * the same clause. « je suis catholique mais je ne crois pas » denies the BELIEF in a
   * FOLLOWING clause, out of reach — measured: the sentence set a named finding. This list
   * gives the contradiction a marker it can deny, without widening the window for everyone.
   */
  adherence?: readonly string[];
  /** Low-ambiguity topical markers → indirect tier. */
  indirectCore: readonly string[];
  /** Colloquial/polysemous markers — the focus of the recall/FP pair (identifiable calibration). */
  indirectColloquial: readonly string[];
  /** Include the colloquials in the indirect? (calibration ratified PANO-33: ON — we do not mask.) */
  includeColloquial: boolean;
  /** Number of indirect hits required to SET the broad tag (calibration ratified PANO-33). */
  indirectThreshold: number;
}

/** Item-level lexicon of `conflictual` (B5): emitted insult + 2nd-person target, a single tier. */
export interface ItemLevelLexicon {
  kind: 'item-level';
  label: 'conflictual';
  /** Insulting lexemes. */
  insults: readonly string[];
  /** 2nd-person target markers / insulting imperative — without a target = frustration curse, excluded. */
  targets: readonly string[];
}

export type LabelLexicon = TopicalLexicon | ItemLevelLexicon;

/**
 * Lexicon of a non-sensitive INTEREST (D2, PANO-75) — SIMPLIFIED form of the sensitive topical. An interest
 * is not a sensitive subject: it therefore carries NEITHER `sensitivity`, NOR a fan of readings
 * (`readingTemplateIds`), NOR a named/broad tier distinction, NOR 3rd-person degradation (an
 * interest stays an interest even when spoken of another — « je parle beaucoup de cuisine » as « ma sœur
 * adore cuisiner » both signal one same theme for the advertiser). KEPT from the `detect.ts`
 * machinery: the noise filters (negation, quotation, word boundaries,
 * masking/lengthening/plural tolerances) — a negated or quoted interest counts no more than a negated sensitive subject.
 *
 * `selfDeclared` stays a simple confidence BONUS (not a separate tag, unlike the sensitives
 * where self-declaration anchors a named tag): « je suis un vrai gamer » is worth more than an isolated
 * mention, but stays the same theme.
 *
 * The lexicon co-carries the THEME it produces (`themeId`, `themeLabel`, `usage`): one interest
 * seed = one module = one theme. Avoid the drift between "what is detected" and "what is
 * displayed" (the name + the usage block) by keeping them in the same place — same discipline as
 * `readingTemplateIds` co-carried by the sensitive lexicons.
 */
export interface InterestLexicon {
  kind: 'interest';
  /** Identity of the produced theme (`Theme.id` / `InsightBase.themeId`), not a closed sensitive label —
   * OPEN string: the interest taxonomy is not yet ratified (throwaway seed, PANO-75). */
  label: string;
  /** RAW `templateId` of the displayed theme name (like `Theme.label`, resolved at presentation). */
  themeLabel: string;
  /** Block "what can be done with it — depending on who accesses it" (ADR-0003): STRUCTURE settled here, the
   * WORDING is draft (PANO-45) and the sourced CONTENT falls under PANO-55. May be empty. */
  usage: readonly ThemeUsage[];
  /**
   * SOLO markers: near-univocal, they enter ON THEIR OWN (a hit outside negation/quotation IS
   * evidence of the theme). Recall tier — we include richly, the floor + the base ranking drown
   * the residual noise (PANO-76 method reused: recall assumed, not maximal FP purity).
   */
  markers: readonly string[];
  /**
   * ANCHORED markers: ambiguous (≈ 50/50), they enter ONLY if a domain COMPANION co-occurs
   * in the SAME item — a `markers`/`selfDeclared` (strong signal), or ANOTHER anchored (two 50/50
   * together are worth the domain). This is the co-occurrence disambiguation tool (PANO-76):
   * « match »/« but » count only near a foot term; « console »/« boss » near a
   * gaming term. Isolated, they are discarded (noise). Optional.
   */
  anchored?: readonly string[];
  /** Self-declared identity terms (« je suis un vrai X », via the PANO-72 pattern) — a simple confidence
   * BONUS: their presence pushes the volume-derived level from `low` toward `medium`. Also counts
   * as a strong COMPANION to anchor an ambiguous marker. Optional. */
  selfDeclared?: readonly string[];
}

/**
 * What the `detectLabels` machinery can detect: the sensitive lexicons (D1) AND the interest
 * lexicons (D2). Union used ONLY by the detector's signature — never by the rule registries
 * (`WIRED_LEXICONS` stays `LabelLexicon[]`, an interest registry stays `InterestLexicon[]`)
 * so that an interest cannot leak into D1 nor vice versa.
 */
export type DetectableLexicon = LabelLexicon | InterestLexicon;
