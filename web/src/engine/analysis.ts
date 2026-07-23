// The named value the engine returns (Refonte A, batch A1 — shape settled by ADR-0004).
//
// ONE function (`analyzeExport`, cf. `analyze.ts`), ONE named value. Replaces `EngineOutput` + the
// `Insight` union + the evidence store + the `RULES`/`EVIDENCE_RULES` registries + `composeRules`.
//
// THE COMPOSITION RULE OF THIS TYPE: each field has a NAMED READER, spotted on the screen (measured
// file by file; ADR-0004 method). No speculative field — what the engine emitted with no reader
// (`framing`, `ruleId`, `sensitivity`, `Theme.sensitive`, the aggregate's `claim`) is not here.
// Plain-data, structured-clone-safe: the Worker's output IS this type (ADR-0002, unchanged).

/**
 * A source crumb that backs a finding — DIRECT reference, no more store (§5.4 to the letter).
 *
 * The verbatim lives HERE, duplicated if several findings cite it: a duplicate of ~60 short strings
 * ACCEPTED (yuya's arbitration). `channel` + `sourceIndex` replace the `EvidenceId` — identity is a
 * PAIR OF DATA, no longer a string to re-parse. What this removes concretely:
 * `Number(ref.evidenceId.replace('comment:', ''))` (ex-`dossier.ts:187`), the stringly-typed round
 * trip that a store indexed by identifier imposed.
 *
 * The ADR-0003 memory bound still holds, and by construction rather than by discipline: only the
 * crumbs REFERENCED by a finding exist — there is no more store to over-fill.
 */
export interface Evidence {
  channel: 'comment' | 'search';
  /** Index within ITS source list (comments OR searches) — never within a concatenated corpus. */
  sourceIndex: number;
  /** Verbatim from the source, never derived/interpreted text (→ `claim`). */
  text: string;
  /** Raw source date (contract §1.1), verbatim. */
  date: string;
  /** Surface forms to highlight, ⊂ `text` (ADR-0003). Attached to THIS citation: the same comment
   *  underlines different words depending on the finding that cites it. */
  triggerTerms?: string[];
  /** Fan of readings OF THIS evidence FOR THIS finding (ADR-0003). C3 lock kept: a reading is plain
   *  text — structurally no confidence/weight/score field. `mode` ORDERS, it does not QUANTIFY.
   *  Confidence lives on the finding (`Deduction.confidence`). */
  readings?: ReadingFan;
}

/** Fan of readings: `ranked` (the 1st dominates) or `equal` (none privileged). */
export interface ReadingFan {
  mode: 'ranked' | 'equal';
  /** Reading texts (A2: the text, no longer a templateId to route). */
  readings: string[];
}

/**
 * A finding — the FORK 3 union (ratified by yuya).
 *
 * Merges the THREE degenerate gradation axes the engine carried (`Confidence.level: 'high'` with no
 * producer, `SensitivityTier` always `3`, `Theme.sensitive` always `false`) into ONE discriminant
 * that DOES vary: "produced by D1" or not (§2.1).
 *
 * `high` is FORBIDDEN AT COMPILE TIME on the sensitive — what the §6.1 golden proved by test, the
 * type now states. INTENDED consequence (yuya): the non-sensitive MAY display "high". No rule emits
 * it today; the type keeps the door open, and the UI legend no longer announces it as long as
 * nothing reaches it (a legend with no referent).
 */
export type Deduction = {
  /**
   * The finding's sentence — PRESENT if and only if the finding carries NO fan of readings.
   *
   * The rule is not "sensitive or not", it is **"is there a fan to carry the meaning?"**. A finding
   * with a fan needs no sentence: the fan states the possible readings, the card title states the
   * topic, and the sentence only repeated the title one had just clicked. Two populations have no
   * fan and therefore keep their sentence:
   *   - `conflictual` — no fan BY DOCTRINE (B5: the emitted insult IS the signal, there is no plural
   *     reading to offer). Its sentence additionally carries the B5 criterion itself (emitted,
   *     directed at another user), which the title "Conflict" does not say;
   *   - INTERESTS (D2) — no fan either, and their sentence carries a count.
   *
   * WHY OPTIONAL RATHER THAN DISCRIMINATED: the "if and only if" cannot be expressed in this type,
   * because the fan lives on `Evidence.readings` and not on the finding — the type cannot refer to
   * it. Expressing it would require lifting the fan up to the finding, which is a different job. In
   * the meantime the invariant is TESTED (`claim-fan-invariant.test.ts`) rather than left to
   * discipline: an optional field whose rule is verified is not a field nobody can reason about.
   */
  claim?: string;
  evidence: Evidence[];
} & (
  | { sensitive: true; confidence: 'low' | 'medium' }
  | { sensitive: false; confidence: 'low' | 'medium' | 'high' }
);

/**
 * An isolated sensitive finding (D1): a `Deduction` + the SHORT NAME of its topic ("Mental health").
 *
 * WHY a field IN ADDITION to the `Deduction`: `SignalCardNavy` titles its card with this short word,
 * never with the claim-sentence (yuya's decision, 2026-07-15 refonte). The initial named form
 * (batch A1) missed this reader; the UI recovered it by INVERTING the `D1_TEMPLATE_IDS` allowlist
 * (`claim.templateId` → sensitive label) — an inversion A2 makes impossible, the claim becoming
 * text. Without this field, the header of the signal cards disappears from the render: the golden
 * would have caught it, we write it rather than discover it there. This is the ADR-0004 method
 * (start from the screen) applied where the initial inventory missed a reader.
 *
 * Symmetric with `AnalysisTheme.label`: a signal has a name, like a theme — it is the only thing the
 * two disjoint populations share.
 */
export type Signal = Deduction & { label: string };

/** One line of a theme's usage register (ADR-0003) — resolved texts (A2), no more keys. */
export interface ThemeUsageLine {
  actor: string;
  usage: string;
}

/** An interest theme and its findings (→ `ThemeCardNavy`). */
export interface AnalysisTheme {
  id: string;
  /** The TEXT of the name (A2), no longer a templateId to route. */
  label: string;
  usage: ThemeUsageLine[];
  deductions: Deduction[];
}

/** Hourly activity rhythm + counters + estimate (→ `RhythmCard`).
 *  DATA carrier only: the `claim`/`framing`/`confidence` of the ex-`aggregate` is no longer rendered
 *  since the v2 refonte (the night inset was removed) — so it is no longer emitted. */
export interface Rhythm {
  /** One counter per hour, length 24 (0h…23h). */
  hourlyActivity: number[];
  /** `total` is ALL-TIME (Activity Summary); the other two are SLIDING windows over Watch History
   *  (≈ 1 year). The mix is intentional (PANO-85). */
  videosWatched: { total: number; last12Months: number; last30Days: number };
  /** Watch minutes ESTIMATED by sessionization (assumptions: `rules/activity-rhythm.ts`). */
  estimatedMinutes: number;
}

/**
 * Export volumes (→ `VolumesCard`) — NAMED, no more dispatch on `ruleId`.
 *
 * This is §2.3 made concrete: `ACTIVITY_PANEL_RULE_IDS = {R1, R2, R3, R5}` (the `Set` by which the
 * UI re-guessed what the engine already knew) disappears because the field IS the name. Window ≈ 1
 * year (covered by the export), except `allTime` — NEVER mixed (PANO-84).
 */
export interface Volumes {
  searches?: number;
  comments?: number;
  follows?: number;
  endorsements?: number;
  /** FACTUAL ALL-TIME totals from Activity Summary (since account registration). */
  allTime?: { videosShared: number; videosWatchedToEnd: number };
}

/** Semantic wall: the readability asymmetry, in counts (→ `AnalyzableShareCard`). */
export interface Opacity {
  /** Behavioral items self-described offline (text). */
  readableCount: number;
  /** Opaque items (mute links, unreadable without the network). */
  opaqueCount: number;
}

/**
 * What the engine returns.
 *
 * `themes[].deductions` and `signals[]` are SEPARATE — a separation SETTLED (yuya), not a
 * convenience: the two populations are disjoint by construction (no theme is sensitive, no sensitive
 * finding has a theme). Assumed: a sensitive topic is not one interest among others — mixing them
 * would flatten them. Consequence: grouping a sensitive topic under a theme would require touching
 * this type again. It is a choice, not a fatality — written here rather than frozen in silence.
 */
export interface Analysis {
  /** Absent if the export carries no usable watch history. */
  rhythm?: Rhythm;
  volumes: Volumes;
  /** Absent if the semantic wall has nothing to count. */
  opacity?: Opacity;
  themes: AnalysisTheme[];
  /** The sensitive findings (D1), without a theme. */
  signals: Signal[];
}
