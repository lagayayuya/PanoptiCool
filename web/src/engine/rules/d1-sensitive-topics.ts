// D1 — sensitive-topics detector on Comments + Searches (PANO-71/72, framing PANO-70).
//
// Batch A1: returns `Deduction[]` — the `signals[]` of `Analysis`, directly. What changes:
//   - `sensitivity: 3` (always 3, §2.1) and the `low|medium` ceiling merge into the `Deduction`
//     union: `sensitive: true` ⇒ `confidence: 'low' | 'medium'`, `high` FORBIDDEN at compile time.
//     The ceiling is no longer held by a param type (`InferredLevel`) nor by a golden: it is held by
//     this function's return type;
//   - evidence is now DIRECT references (`channel` + `sourceIndex` + verbatim), no more `EvidenceRef`
//     into a store — `corpus.resolve()` already returns the pair, there is no more id to build. The
//     ADR-0003 memory bound holds by CONSTRUCTION: only the cited crumbs exist;
//   - a sensitive finding NO LONGER carries a sentence, except `conflictual`: the fan of readings
//     carries the meaning, and the sentence only repeated the card title. Detail on `CLAIM_BY_LABEL`.
//
// UNTOUCHED (the earned core): detection lives in `engine/detect/`, the data in `engine/lexicon/`.
// The doctrine guardrails do not move:
//   - 1 finding PER detected LABEL (never per comment, never global);
//   - a named tag ONLY if the term is written (B2 — the stage comes from the machinery);
//   - conflictual: a single stage, never a fan (B5, yuya's decision PANO-70 §1.4);
//   - explicit → medium, indirect → low;
//   - the signal-without-lived-experience (3rd person) is tagged — that is the demonstration (C2),
//     not a bug.

import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales';
import type { Evidence, ReadingFan, Signal } from '../analysis';
import { detectLabels, type LabelDetection } from '../detect/detect';
import { WIRED_LEXICONS } from '../lexicon';
import type { LabelLexicon, SensitiveLabel } from '../lexicon/types';
import type { NormalizedExport } from '../normalize';
import { d1ConflictualNamedClaim, readingText, sensitiveTopicName } from '../wording';
import { buildChannelCorpus } from './shared';

/** Real source section path (contract §4) — same section as the volumes, distinct producers. */
export const D1_SECTION_PATH = 'Comment/Comments' as const;
/** Searches (contract §4) — PANO-80 adapter: D1 reads Comments AND Searches, same filters. */
export const D1_SEARCH_SECTION_PATH = 'Your Activity/Searches' as const;

/**
 * Sensitive findings no longer have a SENTENCE — except `conflictual`, and the reason is structural.
 *
 * The sentence said what the card title already said: clicking "Mental health" to read "Mental
 * health term written out in full" taught nothing. What carries the meaning is the FAN OF READINGS —
 * the paths by which this signal could have landed there.
 *
 * `conflictual` has NO fan, by doctrine (B5: the emitted insult IS the explicit signal, there is no
 * plural reading to offer). Without a sentence, its card would have NO text at all. And its sentence
 * does not restate its title: it carries the B5 criterion itself — a remark EMITTED, DIRECTED AT
 * another user — which "Conflict" does not say. It is the only label where the sentence still
 * informs.
 *
 * The rule is therefore "a sentence when there is no fan", not "a sentence when it is not sensitive":
 * the interests (D2) keep theirs for the same reason.
 */
const CLAIM_BY_LABEL: Partial<Record<SensitiveLabel, (locale: Locale) => string>> = {
  conflictual: d1ConflictualNamedClaim,
};

/** Explicit → `medium`, indirect → `low`. Never `high`: the `Deduction` type forbids it. */
function d1Level(stage: LabelDetection['stage']): 'low' | 'medium' {
  return stage === 'explicit' ? 'medium' : 'low';
}

/**
 * The fan of readings — on BOTH stages, `conflictual` excepted (it has no readings: an emitted
 * aggressive remark has no fan, cf. B5). The readings are TEXTS (A2), resolved from the keys the
 * lexicon co-carries (`readingTemplateIds`).
 *
 * ── Why the named stage now has a fan ───────────────────────────────────────────────────────────
 * It had none, on an implicit assumption that does not hold: that the named stage would RESOLVE the
 * ambiguity. It resolves only one, the LEXICAL one — which topic is at play. It says nothing of the
 * WHY. "burn out testimonies" writes the term out in full and remains a search for testimonies:
 * lived, relative, curiosity all three stay open. Searching is not declaring, and writing the word
 * does not narrow the reasons for having written it. A named card without a fan therefore presented
 * as settled what was not — and taught nothing, the fan being the pedagogy.
 *
 * ── `ranked`, never `equal` ─────────────────────────────────────────────────────────────────────
 * `equal` would say that "I have depression" and "burn out testimonies" read the same: false.
 * Writing the term about oneself SHIFTS the likelihood toward the lived without closing the rest,
 * and that is exactly what `ranked` expresses — it ORDERS without QUANTIFYING (ADR-0003: no
 * per-reading weighting, confidence lives on the finding).
 *
 * ── THE ORDER, now RATIFIED ─────────────────────────────────────────────────────────────────────
 * The rendered order is that of `readingTemplateIds`. It had never been CHOSEN as a ranking; it is
 * now, under the rule "three mechanisms, not three degrees" — the "it's me" mechanism dominates when
 * the precise term is written. The same order serves both stages: `equal` not ranking by definition,
 * there is only one order per label, and the identical sequence makes the two cards comparable.
 *
 * A ranking by CHANNEL was proposed then REJECTED: a TikTok search can be a keystroke as much as a
 * tap on a suggested term, and a comment carries questions. The channel correlates weakly with
 * intent in both directions. What made "burn out testimonies" read like an inquiry was LEXICAL, not
 * structural — and it is the informational register that handles it.
 */
function readingFan(
  lexicon: LabelLexicon,
  stage: LabelDetection['stage'],
  locale: Locale,
): ReadingFan | undefined {
  if (lexicon.kind !== 'topical') {
    return undefined;
  }
  return {
    mode: stage === 'explicit' ? 'ranked' : 'equal',
    // `.map((k) => …)` and NOT `.map(readingText)`: `map` passes (value, index, array), so the short
    // form would send the INDEX as the second argument. The compiler catches it now that the first
    // parameter is a `Locale` — it would not have when both were `string`.
    readings: lexicon.readingTemplateIds.map((key) => readingText(locale, key)),
  };
}

/**
 * D1 — detects sensitive topics in typed texts (comments + searches).
 *
 * `[]` if both sources are empty. Otherwise, PER detected LABEL, a `sensitive: true` finding carrying
 * its evidence. A single comment proving two labels is cited by BOTH findings: the verbatim is
 * duplicated there (short-string duplicate ACCEPTED, yuya's arbitration) — reuse stays visible,
 * recomputed at render on the `channel:sourceIndex` pair (C5), no longer stored.
 */
export function d1SensitiveTopics(
  input: NormalizedExport,
  locale: Locale = DEFAULT_LOCALE,
): Signal[] {
  const commentsList = input.Comment.Comments.CommentsList;
  const searchList = input['Your Activity'].Searches.SearchList;
  if (commentsList.length === 0 && searchList.length === 0) {
    return [];
  }

  const corpus = buildChannelCorpus(
    commentsList.map((c) => ({ comment: c.comment, date: c.date })),
    searchList,
  );
  const detections = detectLabels(corpus.texts, WIRED_LEXICONS);

  const signals: Signal[] = [];
  for (const detection of detections) {
    const lexicon = WIRED_LEXICONS.find((l) => l.label === detection.label);
    if (lexicon === undefined) {
      continue; // impossible by construction (detectLabels only detects the wired ones)
    }
    const claim = CLAIM_BY_LABEL[detection.label];
    const fan = readingFan(lexicon, detection.stage, locale);

    const evidence: Evidence[] = detection.items.map((item): Evidence => {
      // `resolve` already returns { channel, sourceIndex, text, date }: the evidence IS this pair +
      // the citation. No more `EvidenceId` to build here, nor to re-parse at the consumer (§5.4).
      const ch = corpus.resolve(item.itemIndex);
      return {
        ...ch,
        triggerTerms: item.surfaces,
        ...(fan !== undefined ? { readings: fan } : {}),
      };
    });

    signals.push({
      label: sensitiveTopicName(locale, detection.label),
      ...(claim !== undefined ? { claim: claim(locale) } : {}),
      sensitive: true,
      confidence: d1Level(detection.stage),
      evidence,
    });
  }
  return signals;
}
