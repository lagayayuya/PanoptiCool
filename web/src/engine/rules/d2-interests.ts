// D2 — INTERESTS detector on Comments + Searches (PANO-75, project PANO-74; PANO-80).
//
// Batch A1: returns `AnalysisTheme[]` — the `themes[]` of `Analysis`, directly. A theme CARRIES its
// findings (`deductions`) instead of each finding pointing to a theme by `themeId`: the grouping
// that `buildPageBlocks` redid at display (grouping the insights by `themeId`, at their first
// appearance) is done HERE, once, by the only rule that already knows everything. `grouping.ts`
// disappears.
//
// `Theme.sensitive` leaves: D2 wrote `false`, always (§2.1), and D1 produces no theme — the two
// populations are DISJOINT by construction. The `themes[].deductions` vs `signals[]` separation
// enacts it (yuya's decision).
//
// UNCHANGED DOCTRINE (PANO-74 decisions, do not reopen):
//   - NO sensitivity emitted (an interest is not a sensitive topic) → `sensitive: false`;
//   - NO fan of readings (an interest does not read "lived / relative / curiosity");
//   - aggregation by RANKING, not by thresholding: an item floor then top-N by volume;
//   - confidence DERIVED FROM VOLUME, capped `medium`; self-declaration is a BONUS low → medium.
//
// The `medium` ceiling is NO LONGER held by the type here: `sensitive: false` allows `high` (FORK 3
// — "the non-sensitive MAY display high"). No rule emits it; `d2Level` stays capped, and that is now
// a RULE decision, explicit, rather than a type prohibition.

import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales';
import type { AnalysisTheme, Deduction, Evidence } from '../analysis';
import { detectLabels, type LabelDetection } from '../detect/detect';
import { INTEREST_LEXICONS } from '../lexicon/interests';
import type { InterestLexicon } from '../lexicon/types';
import type { NormalizedExport } from '../normalize';
import { actorLabel, d2InterestClaim, themeLabelText, usageText } from '../wording';
import { buildChannelCorpus } from './shared';

/** Real source section path (contract §4). */
export const D2_SECTION_PATH = 'Comment/Comments' as const;
/** Searches (contract §4) — PANO-80 adapter, like D1. */
export const D2_SEARCH_SECTION_PATH = 'Your Activity/Searches' as const;

/** Evidence-item FLOOR to retain a theme (DRAFT calibration PANO-75): an interest attested by a
 *  single comment is too weak for a card — we require REPEATED usage. */
const D2_ITEM_FLOOR = 2;

/** MAX number of themes retained, by decreasing volume. A display bound: the most-attested
 *  interests, not the long tail. Draft PANO-75. */
const D2_TOP_N = 5;

/** Volume beyond which confidence goes `low → medium` (same logic as the ex-r2). */
const D2_MEDIUM_VOLUME_THRESHOLD = 4;

/** D2 confidence: derived from volume, with a self-declaration BONUS. Capped `medium` BY RULE CHOICE
 *  (the type would allow `high` on the non-sensitive — cf. header). */
function d2Level(volume: number, selfDeclared: boolean): 'low' | 'medium' {
  if (selfDeclared || volume >= D2_MEDIUM_VOLUME_THRESHOLD) {
    return 'medium';
  }
  return 'low';
}

/** Item floor, then top-N by DECREASING volume. STABLE sort (ES2019+) → at equal volume, the order
 *  of `INTEREST_LEXICONS` decides (deterministic tie-break). */
function rankInterests(detections: readonly LabelDetection[]): LabelDetection[] {
  return detections
    .filter((d) => d.items.length >= D2_ITEM_FLOOR)
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, D2_TOP_N);
}

/**
 * D2 — detects interests, ranks them, and produces one theme per retained interest (name + usage
 * block + its finding). `[]` if the sources are empty or if no interest reaches the floor.
 *
 * @param lexicons registry of interest lexicons. Default = `INTEREST_LEXICONS` (the real wired one);
 *   the MECHANICS tests inject FAKE lexicons to stay independent of the real content — the base stays
 *   intact when the content batches change the registry.
 */
export function d2Interests(
  input: NormalizedExport,
  lexicons: readonly InterestLexicon[] = INTEREST_LEXICONS,
  // The language comes THIRD, after `lexicons`, and that is a choice: putting it second would have
  // rewritten the eight test calls that name their fake lexicons — churn on files another pass edits
  // in parallel, for no readability gain here.
  locale: Locale = DEFAULT_LOCALE,
): AnalysisTheme[] {
  const commentsList = input.Comment.Comments.CommentsList;
  const searchList = input['Your Activity'].Searches.SearchList;
  if (commentsList.length === 0 && searchList.length === 0) {
    return [];
  }

  const corpus = buildChannelCorpus(
    commentsList.map((c) => ({ comment: c.comment, date: c.date })),
    searchList,
  );
  const ranked = rankInterests(detectLabels(corpus.texts, lexicons));

  const themes: AnalysisTheme[] = [];
  for (const detection of ranked) {
    const lexicon = lexicons.find((l) => l.label === detection.label);
    if (lexicon === undefined) {
      continue; // impossible by construction (detectLabels only detects the wired ones)
    }

    // No `readings` (an interest has no fan); `triggerTerms` highlightable.
    const evidence: Evidence[] = detection.items.map(
      (item): Evidence => ({ ...corpus.resolve(item.itemIndex), triggerTerms: item.surfaces }),
    );

    const volume = detection.items.length;
    const deduction: Deduction = {
      claim: d2InterestClaim(locale, volume),
      sensitive: false,
      confidence: d2Level(
        volume,
        detection.items.some((i) => i.selfDeclared === true),
      ),
      evidence,
    };

    themes.push({
      id: lexicon.label,
      // Texts resolved HERE (A2): the lexicon is UNTOUCHABLE and keeps its keys; `Analysis` carries
      // the text, so the UI has nothing left to route (it no longer even imports the engine, batch A3).
      label: themeLabelText(locale, lexicon.themeLabel),
      usage: lexicon.usage.map((u) => ({
        actor: actorLabel(locale, u.actor),
        usage: usageText(locale, u.usage.templateId),
      })),
      deductions: [deduction],
    });
  }
  return themes;
}
