// Prompts + token budget of the local AI analysis (PANO-45). Two selectable prompts, BOTH
// hand-editable in the UI; the text below is only the starting point.
//
// WORDING = DRAFT (human gate PANO-45, yuya's decision) — these two strings are dictated as they
// stand; they are NOT to be "improved" over the course of a session. Any tweak goes through yuya.
//
// The default prompt mentions « et recherches » ONLY if searches actually go out in the batch:
// under a tight token cap, only the most recent comments survive (see `selectItemsForBudget`) —
// announcing absent searches would make the prompt lie.

import type { Locale } from '../i18n/locales';
import type { AiItem } from './items';

export type PromptMode = 'default' | 'safety';

/** Safety net — clause appended to the default prompt (draft, yuya's wording). */
const SAFETY_CLAUSE =
  "Et n'infère pas de sujets sensibles tels que l'orientation sexuelle, la santé mentale ou une quelconque généralisation.";

/** The same net, in English. Wording DICTATED by yuya (2026-07-20), word for word. */
const SAFETY_CLAUSE_EN =
  'And do not infer sensitive subjects such as sexual orientation, mental health, or any generalization.';

/**
 * System prompt, derived from the LANGUAGE, the mode AND the actual composition of the batch sent
 * (with or without searches).
 *
 * ─── THE LANGUAGE ARRIVES AS A PARAMETER, AND THAT IS DELIBERATE ─────────────────────────────────
 * Same trade-off as `engine/wording.ts`, for another reason: these two strings are tested without a
 * DOM, and an ambient language would force every assertion to set `<html lang>` before the import.
 * The only caller (`ui/v2/AiSection.tsx`) is an island: it reads `currentLocale()` once.
 *
 * ⚠ THE PROMPT DECIDES THE RESPONSE LANGUAGE, and nothing else fixes it: no parameter is sent to
 * the server for that. Accepted consequence — someone who opens `/en` on a French export will
 * receive an ENGLISH analysis of French comments.
 *
 * ⚠ WHAT NO BENCH COVERS. The 12/07 bench measured the input format and the output quality IN
 * FRENCH, on those strings. Nothing was measured on the English side, and two effects are
 * predictable without being verified: (1) since models are massively aligned in English, a clause
 * explicitly naming « sexual orientation, mental health » is more likely to trigger a GLOBAL
 * REFUSAL than in French — the `safety` mode would then be safer and less useful; (2)
 * `DEFAULT_CHARS_PER_TOKEN` is calibrated on French (cf. its comment), so an English batch is
 * OVER-estimated and the tool sends fewer items than it could — mitigated as soon as the server
 * exposes `/tokenize`, never when it is old. Neither is fixed here: naming them rather than fixing
 * them blindly is the choice.
 */
export function buildSystemPrompt(
  locale: Locale,
  mode: PromptMode,
  includesSearches: boolean,
): string {
  // English wording DICTATED by yuya (2026-07-20), word for word — same human gate as the French.
  if (locale === 'en') {
    const channels = includesSearches ? 'comments and searches' : 'comments';
    const base = `Here are the TikTok export data ${channels} of a person. What can you infer about their personality, identity, interests, and beliefs? Provide a general summary at the end. Be concise.`;
    return mode === 'safety' ? `${base} ${SAFETY_CLAUSE_EN}` : base;
  }
  const channels = includesSearches ? 'des commentaires et recherches' : 'des commentaires';
  const base = `Voici les données d'export tiktok ${channels} d'une personne. Que peux-tu inférer sur sa personnalité, identité, intérêts et convictions ? Donne une synthèse générale à la fin. Sois concis.`;
  return mode === 'safety' ? `${base} ${SAFETY_CLAUSE}` : base;
}

/**
 * Format of an item, ONE line: `[index] text`, preceded by `(rech)` for a search. Format kept by
 * the benchmark (12/07) — the richer variants (per-item JSON, dates, channels) degraded the
 * quality. A comment's line breaks are flattened: one line = one item, otherwise the index→text
 * alignment the model cites breaks.
 *
 * ⚠ `(rech)` IS NOT TRANSLATED when the prompt is English, and that is a held choice, not an
 * oversight: the marker is part of the FORMAT the 12/07 bench measured. Changing it to `(search)`
 * changes the token count of each search line and what the model sees as the channel separator —
 * no measurement supports that variant. It probably makes the English prompt more opaque; the
 * translation is decided on a manual test against a local model, never in passing.
 */
export function formatItemLine(item: AiItem): string {
  const marker = item.kind === 'search' ? ' (rech)' : '';
  return `[${item.index}]${marker} ${item.text.replace(/\s+/g, ' ').trim()}`;
}

export function buildUserMessage(items: AiItem[]): string {
  return items.map(formatItemLine).join('\n');
}

/**
 * Token count estimate. `charsPerToken` is CALIBRATED on the server's real counter (see
 * `calibrateCharsPerToken`): the fixed heuristic used until now under-estimated heavily (5071
 * estimated against 8850 real on a single batch — the conversation template, the accents and the
 * emoji tokenize far denser than English text). As long as no run has occurred, we start from a
 * deliberately PESSIMISTIC value: better to send a little less than to have the prompt truncated.
 */
export const DEFAULT_CHARS_PER_TOKEN = 2;

export function estimateTokens(text: string, charsPerToken: number): number {
  return Math.ceil(text.length / charsPerToken);
}

/** Guard bounds: a ratio outside this interval betrays an aberrant measurement, not a calibration. */
const MIN_CHARS_PER_TOKEN = 1.2;
const MAX_CHARS_PER_TOKEN = 6;

/**
 * Recalibrates the chars/token ratio on the `prompt_tokens` actually returned by the server (`usage`
 * field of the OpenAI-compatible API). The next send then estimates accurately, on THIS model and
 * THIS tokenizer.
 */
export function calibrateCharsPerToken(
  promptChars: number,
  realPromptTokens: number,
): number | null {
  if (promptChars <= 0 || realPromptTokens <= 0) return null;
  const ratio = promptChars / realPromptTokens;
  if (ratio < MIN_CHARS_PER_TOKEN || ratio > MAX_CHARS_PER_TOKEN) return null;
  return ratio;
}

export interface Selection {
  /** Items actually sent, in chronological order (increasing index). */
  items: AiItem[];
  /** Priority tier reached (see `selectItemsForBudget`). */
  tier: 'recent_comments' | 'comments_and_recent_searches' | 'all';
  droppedComments: number;
  droppedSearches: number;
}

/**
 * Cap by TOKENS, with the priority decided by yuya:
 *   1. the most recent comments;
 *   2. all comments + the most recent searches;
 *   3. everything.
 * We split NOTHING (no batch/map-reduce, deferred): what does not fit in the window does not go
 * out, and the UI says how many items were left aside — a silence here would read as "everything
 * was analyzed", which would be false.
 */
/** Priority order shared by `selectItemsForBudget` and `selectItemsForBudgetExact`: comments from
 * most recent to oldest, THEN searches from most recent to oldest — never a mix. */
function recentFirst(list: AiItem[]): AiItem[] {
  return [...list].sort(
    (a, b) => (b.epoch ?? Number.NEGATIVE_INFINITY) - (a.epoch ?? Number.NEGATIVE_INFINITY),
  );
}

function priorityOrder(items: AiItem[]): { comments: AiItem[]; searches: AiItem[] } {
  return {
    comments: recentFirst(items.filter((i) => i.kind === 'comment')),
    searches: recentFirst(items.filter((i) => i.kind === 'search')),
  };
}

function selectionFromCounts(
  comments: AiItem[],
  searches: AiItem[],
  keptComments: number,
  keptSearches: number,
): Omit<Selection, 'items'> {
  const droppedComments = comments.length - keptComments;
  const droppedSearches = searches.length - keptSearches;
  const tier: Selection['tier'] =
    droppedComments > 0
      ? 'recent_comments'
      : droppedSearches > 0
        ? 'comments_and_recent_searches'
        : 'all';
  return { tier, droppedComments, droppedSearches };
}

export function selectItemsForBudget(
  items: AiItem[],
  budgetTokens: number,
  charsPerToken: number,
): Selection {
  const cost = (item: AiItem) => estimateTokens(formatItemLine(item), charsPerToken) + 1; // +1: line break
  const { comments, searches } = priorityOrder(items);

  const kept: AiItem[] = [];
  let spent = 0;
  const take = (list: AiItem[]): number => {
    let taken = 0;
    for (const item of list) {
      const price = cost(item);
      if (spent + price > budgetTokens) break;
      spent += price;
      kept.push(item);
      taken++;
    }
    return taken;
  };

  const keptComments = take(comments);
  // Searches are only offered once ALL comments are served (tiers 2 and 3): under a tight
  // budget, a comment (spontaneous text) carries more signal than an isolated search.
  const keptSearches = keptComments === comments.length ? take(searches) : 0;

  return {
    items: kept.sort((a, b) => a.index - b.index),
    ...selectionFromCounts(comments, searches, keptComments, keptSearches),
  };
}

/**
 * Items budget = the server's context window − the generation reserve − the system prompt.
 * The reserve guarantees room is left to WRITE the response: a prompt that fills the whole window
 * leaves nothing for the model to generate.
 */
export const COMPLETION_RESERVE_TOKENS = 1024;

export function itemsBudget(
  contextWindow: number,
  systemPrompt: string,
  charsPerToken: number,
): number {
  return Math.max(
    0,
    contextWindow - COMPLETION_RESERVE_TOKENS - estimateTokens(systemPrompt, charsPerToken),
  );
}

export interface ExactSelection extends Selection {
  /** REAL tokens of the final kept prompt (system + items), measured via `countTokens` — never estimated. */
  promptTokens: number;
}

/** Signature of `countRealPromptTokens` (llama-client.ts) — injected rather than imported, to stay
 * testable without a real server (see prompt.test.ts, where a simulated counter stands in for the server). */
export type RealTokenCounter = (
  systemPrompt: string,
  userMessage: string,
) => Promise<number | null>;

/**
 * Like `selectItemsForBudget`, but makes NO chars/token assumption: each candidate is VERIFIED by a
 * real count (`countTokens`, see `countRealPromptTokens`), on the EXACT prompt that would be sent
 * (system + kept items, with the right "and searches" once a search enters the batch). Binary
 * search on the number of kept items in priority order (same tiers as `selectItemsForBudget`:
 * comments from most recent to oldest, THEN searches) — `O(log n)` network calls rather than one
 * call per item, while staying an exact count at each step (the chars/token heuristic has a measured
 * gap of ~1.75× on real text, in the direction that overflows the window — it must no longer ground
 * this decision once the server is reachable).
 *
 * Returns `null` if `countTokens` fails on the very first attempt (missing endpoint/unreachable
 * server) — the caller then falls back to `selectItemsForBudget` (chars/token heuristic, coarse bound).
 */
export async function selectItemsForBudgetExact(
  items: AiItem[],
  contextWindow: number,
  buildSystemPromptForSelection: (includesSearches: boolean) => string,
  countTokens: RealTokenCounter,
  completionReserve: number = COMPLETION_RESERVE_TOKENS,
): Promise<ExactSelection | null> {
  const { comments, searches } = priorityOrder(items);
  const ordered = [...comments, ...searches]; // priority: all comments before any search.

  const promptTokensFor = async (k: number): Promise<number | null> => {
    const slice = ordered.slice(0, k);
    const systemPrompt = buildSystemPromptForSelection(slice.some((i) => i.kind === 'search'));
    const userMessage = buildUserMessage(slice.sort((a, b) => a.index - b.index));
    return countTokens(systemPrompt, userMessage);
  };

  // k = 0 always holds BY CONVENTION (nothing to send): if even the system prompt alone exceeds the
  // window, it is not this function that detects it — `itemsBudget`/the UI signal it upstream.
  const zeroTokens = await promptTokensFor(0);
  if (zeroTokens === null) return null; // server/`endpoint` unavailable on the very first attempt.

  const fits = async (k: number): Promise<boolean> => {
    if (k === 0) return true;
    const tokens = await promptTokensFor(k);
    // A failure DURING the search (a server that goes down mid-way) is treated as "does not fit":
    // we prefer to under-deliver rather than propagate `null` in the middle of an already-started
    // binary search.
    return tokens !== null && tokens + completionReserve <= contextWindow;
  };

  let lo = 0;
  let hi = ordered.length;
  while (lo < hi) {
    const mid = lo + Math.ceil((hi - lo) / 2);
    if (await fits(mid)) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  const k = lo;
  const finalTokens = k === 0 ? zeroTokens : ((await promptTokensFor(k)) ?? zeroTokens);

  const keptComments = Math.min(k, comments.length);
  const keptSearches = k - keptComments;
  const items_ = ordered.slice(0, k).sort((a, b) => a.index - b.index);

  return {
    items: items_,
    promptTokens: finalTokens,
    ...selectionFromCounts(comments, searches, keptComments, keptSearches),
  };
}
