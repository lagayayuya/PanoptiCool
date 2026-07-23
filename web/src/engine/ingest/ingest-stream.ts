// STREAMING ingestion (PANO-91) — approach B assembled: decompress → tokenize while folding Watch
// History → validate → normalize, WITHOUT ever materializing the graph of the 10⁴–10⁵ watch items.
//
// This is the REAL fix that supersedes `normalize.ts`'s partial patch (post-`JSON.parse` projection,
// −36% but insufficient: the `JSON.parse` peak remained). Here the giant graph is never erected.
//
// APPROACH A (committable integration): we fold `Watch History → VideoList` into a DATES-ONLY list
// (`{Date}[]`) — exactly what `normalizeExport` projected, and the only downstream read (`.Date`
// rhythm, `.length` opacity/absence; never `Link`/`Title`). Zero refactor of the golden-tested
// rules. The dossier's FEATURES are then derived from this list via `activity-rhythm`, unchanged.
// The "features-only, O(1)" variant (full approach B) remains a follow-up: it would ripple through
// 3 rules + the `NormalizedExport` type without changing the crash verdict (dates-only ≈ 9 MB at
// 10⁵, a single copy, far from the fatal peak).
//
// TRUST BOUNDARY PRESERVED. Only the watch ARRAY escapes `JSON.parse`; its validation is still done
// by valibot via `StreamedExportSchema` (dates-only item `{Date: string}`). All the small sections
// are validated by the SAME contract as approach A (reused schema, DRY). Malformation (a non-string
// Date, an absent section…) is therefore still a graceful `validate` failure, not a crash.

import * as v from 'valibot';
import { type NormalizableExport, type NormalizedExport, normalizeExport } from '../normalize';
import { decompressJsonEntry, type ParseErrorKind, type ParseOptions } from '../parse';
import { TikTokExportSchema, type ValidationIssue, yourActivityCategory } from '../validate';
import { type ArrayFold, type FoldResolver, JsonStreamError, parseJsonStream } from './json-stream';

/**
 * Anti-zip-bomb guard for the STREAM — well above any real export (10⁵ items ≈ 26 MB decompressed)
 * but bounds the decompressed string that `unzipSync` allocates. Distinct from approach A's 25 MB
 * ceiling (which rejected genuinely large exports): the stream keeps the footprint bounded whatever
 * the useful volume, so its only cap role is to refuse a pathological archive.
 */
export const STREAM_SIZE_LIMIT_BYTES = 512 * 1024 * 1024;

/** EXACT key path of the folded array (array indices do not enter the path). */
const WATCH_HISTORY_VIDEOLIST_PATH: readonly string[] = [
  'Your Activity',
  'Watch History',
  'VideoList',
];

// --- "streamed" schema: the contract, but Watch History loosened to dates-only ------------------

/** Watch item seen by the stream: reduced to its `Date` (the folder already removed `Link`/`Title`). */
const streamedWatchHistoryItem = v.object({ Date: v.string() });

/** `Your Activity` with dates-only Watch History; everything else = the original contract (`.entries`). */
const streamedYourActivity = v.object({
  ...yourActivityCategory.entries,
  'Watch History': v.object({ VideoList: v.nullable(v.array(streamedWatchHistoryItem)) }),
});

/**
 * Runtime mirror of the contract for the streaming path: identical to `TikTokExportSchema` EXCEPT
 * the watch array (dates-only). Built by spreading `.entries` → no duplication of the massive
 * schema; adding a section to the contract propagates here automatically.
 */
export const StreamedExportSchema = v.object({
  ...TikTokExportSchema.entries,
  'Your Activity': streamedYourActivity,
});

// --- Watch History folding ----------------------------------------------------------------------

/** Extracts `Date` from a transient watch item, without retaining it. Non-object/null → `undefined`
 * (valibot will settle it: `Date: v.string()` fails → graceful `validate`, never a crash). */
function readDate(value: unknown): unknown {
  return typeof value === 'object' && value !== null
    ? (value as { Date?: unknown }).Date
    : undefined;
}

/** Folder: accumulates `{Date}` per item (the transient forgotten at once), returns the dates-only list. */
function watchDatesFold(): ArrayFold {
  const dates: { Date: unknown }[] = [];
  return {
    onItem(value) {
      dates.push({ Date: readDate(value) });
    },
    finalize() {
      return dates;
    },
  };
}

/** Folds ONLY `Your Activity → Watch History → VideoList`; everything else is materialized. */
const resolveWatchHistoryFold: FoldResolver = (path) => {
  if (
    path.length === WATCH_HISTORY_VIDEOLIST_PATH.length &&
    path.every((key, index) => key === WATCH_HISTORY_VIDEOLIST_PATH[index])
  ) {
    return watchDatesFold();
  }
  return null;
};

// --- Result & ingestion function ----------------------------------------------------------------

/**
 * Result of streaming ingestion — discriminated union, plain-data. `parse` covers decompression AND
 * tokenization (a JSON malformation becomes `invalid_json` there). `too_large` = zip-bomb beyond the cap.
 */
export type StreamIngestResult =
  | { ok: true; normalized: NormalizedExport; originalSize: number }
  | { ok: false; stage: 'too_large'; originalSize: number; limit: number }
  | { ok: false; stage: 'parse'; error: Exclude<ParseErrorKind, 'export_too_large'> }
  | { ok: false; stage: 'validate'; issues: ValidationIssue[] };

/**
 * Ingests the `.zip` bytes as a stream → `NormalizedExport` ready for the rules. Never throws: every
 * expected failure is a variant of `StreamIngestResult`. Footprint: the decompressed string + the
 * graph of the small sections + the dates-only list; NEVER the graph of the watch items.
 */
export function ingestExportStreaming(
  zipBytes: Uint8Array,
  options: ParseOptions = {},
): StreamIngestResult {
  const decompressed = decompressJsonEntry(zipBytes, {
    sizeLimitBytes: options.sizeLimitBytes ?? STREAM_SIZE_LIMIT_BYTES,
  });
  if (!decompressed.ok) {
    if (decompressed.error === 'export_too_large') {
      return {
        ok: false,
        stage: 'too_large',
        originalSize: decompressed.originalSize,
        limit: decompressed.limit,
      };
    }
    return { ok: false, stage: 'parse', error: decompressed.error };
  }

  // Streaming tokenization: `data` is the COMPLETE graph of the small sections, but `Watch History →
  // VideoList` is already the dates-only list there (folded on the fly, never held in full).
  let data: unknown;
  try {
    data = parseJsonStream(decompressed.text, resolveWatchHistoryFold);
  } catch (error) {
    if (error instanceof JsonStreamError) {
      return { ok: false, stage: 'parse', error: 'invalid_json' };
    }
    throw error; // unexpected: do not swallow it
  }

  // valibot validation of the streamed graph (small sections per contract, watch dates-only).
  const validated = v.safeParse(StreamedExportSchema, data);
  if (!validated.success) {
    const issues: ValidationIssue[] = validated.issues.map((issue) => ({
      path: v.getDotPath(issue) ?? '(racine)',
      expected: issue.expected ?? 'unknown',
    }));
    return { ok: false, stage: 'validate', issues };
  }

  // `validated.output`: full contract, Watch History dates-only → assignable to `NormalizableExport`.
  const normalized = normalizeExport(validated.output satisfies NormalizableExport);
  return { ok: true, normalized, originalSize: decompressed.originalSize };
}
