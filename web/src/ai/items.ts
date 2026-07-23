// Items sent to the local model (PANO-45 — AI analysis on the main page). Deliberate MINIMALISM
// (yuya's decision, benchmark 12/07): the model receives the RAW items — comments + searches —
// and nothing else. No behavioral aggregates, no D2 themes, no channel selection: the
// benchmark showed that each of these additions DEGRADES the output quality. This module therefore
// does only one thing: extract the two textual channels of a normalized export, as indexed items.
//
// Why a path SEPARATE from the engine: `EngineOutput` only carries the evidence actually cited
// by a finding (memory bound, ADR-0003) — never the complete list of comments and
// searches. The AI analysis needs it; extending the engine to it would be a doctrine decision
// (ADR-0002). We therefore start again from the zip's bytes in a dedicated worker (`items-worker.ts`),
// without touching the engine schema.
//
// Privacy: these texts NEVER leave the device — they go to the user's `llama.cpp` server
// (localhost), on an explicit click, and nowhere else.

import type { NormalizedExport } from '../engine/normalize';

export interface AiItem {
  /** STABLE and GLOBAL index (chronological order, all channels combined) — the anchoring key the
   * model cites (« (idx 3, 7) »). Kept even when the item is not sent (token cap):
   * two runs on the same export cite the same number for the same item. */
  index: number;
  kind: 'comment' | 'search';
  text: string;
  /** Epoch ms, or null if the source date is missing/unreadable — used for sorting by recency (send
   * priority). Items without a date are considered the oldest. */
  epoch: number | null;
}

export interface AiItemCounts {
  comments: number;
  searches: number;
}

/** Raw export date (`YYYY-MM-DD HH:MM:SS`, possibly suffixed with ` UTC`) → epoch ms, or null. */
function toEpoch(raw: string | undefined): number | null {
  const trimmed = raw?.trim().replace('T', ' ').slice(0, 19);
  const parsed = trimmed ? Date.parse(`${trimmed.replace(' ', 'T')}Z`) : Number.NaN;
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Comments + searches of a normalized export, sorted by increasing date and indexed 0..N-1.
 * Empty texts are discarded (they carry no signal and would cost the model a line).
 */
export function extractAiItems(norm: NormalizedExport): AiItem[] {
  const items: Omit<AiItem, 'index'>[] = [];

  for (const comment of norm.Comment.Comments.CommentsList) {
    const text = (comment.comment ?? '').trim();
    if (text) items.push({ kind: 'comment', text, epoch: toEpoch(comment.date) });
  }
  for (const search of norm['Your Activity'].Searches.SearchList) {
    const text = (search.SearchTerm ?? '').trim();
    if (text) items.push({ kind: 'search', text, epoch: toEpoch(search.Date) });
  }

  items.sort(
    (a, b) => (a.epoch ?? Number.NEGATIVE_INFINITY) - (b.epoch ?? Number.NEGATIVE_INFINITY),
  );
  return items.map((item, index) => ({ ...item, index }));
}

export function countAiItems(items: AiItem[]): AiItemCounts {
  return {
    comments: items.filter((i) => i.kind === 'comment').length,
    searches: items.filter((i) => i.kind === 'search').length,
  };
}
