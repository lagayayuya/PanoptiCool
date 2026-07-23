// Engine pipeline — orchestrates `input → parse → validate → rules → EngineOutput`
// (PANO-27, ADR-0002). A **pure** function, no DOM and no Worker: this is the unit-testable core
// (what PANO-28 will consume on `samples/*.zip`). The Worker (`engine/worker.ts`) is merely an
// adapter; the engine stays portable (ADR-0002).
//
// Narrowing (the 24/25/26 separation made concrete, without a cast):
//   parser → `data: unknown` → the ONLY input of validation;
//   validation `ok:true` → `data: TikTokExport` → the ONLY input of `computeInsights`.
// The typecheck enforces it through the signatures; no `as` short-circuits the boundary.

import type { Locale } from '../i18n/locales';
import type { Analysis } from './analysis';
import { analyze } from './analyze';
import { ingestExportStreaming } from './ingest/ingest-stream';
import type { NormalizedExport } from './normalize';
import type { ParseErrorKind } from './parse';
import type { ValidationIssue } from './validate';

/**
 * Engine result — discriminated union, plain-data (structured-clone-safe, ADR-0002). `too_large`
 * is a **distinct graceful refusal** (calm, PANO-25), never flattened under `parse` (corrupt):
 * the UI reads `stage` without reopening the enum. Every failure is **PII-safe** (parse/validate are).
 */
export type EngineResult =
  | { ok: true; output: Analysis }
  | { ok: false; stage: 'too_large'; originalSize: number; limit: number }
  | { ok: false; stage: 'parse'; error: Exclude<ParseErrorKind, 'export_too_large'> }
  | { ok: false; stage: 'validate'; issues: ValidationIssue[] };

export interface ProcessOptions {
  /** Refusal threshold (decompressed bytes), passed through to the parser. Default = PANO-25 constant. */
  sizeLimitBytes?: number;
  /** Clock for the rhythm's sliding windows (`analyze`). Default = real `Date.now()`; the tests and
   *  the demo fix it so the sliding windows land on the same clock as the one that built the
   *  export. */
  now?: number;
  /** Language of the PROSE emitted by the engine (`Analysis` carries text since ADR-0004). Default =
   *  `DEFAULT_LOCALE`. It comes in THROUGH THE OPTIONS and not through a positional parameter so that
   *  the ~18 existing call sites — tests, goldens, demo — stay unchanged and keep rendering French:
   *  the English batch ADDS a language, it moves none. */
  locale?: Locale;
}

/**
 * Result of the ingestion phase (decompress → stream-tokenize → validate → normalize). Discriminated
 * union: either the `NormalizedExport` ready for the rules, or an already-formed failing
 * `EngineResult`. Since PANO-91, ingestion goes through the STREAM (`ingest/ingest-stream.ts`): the
 * graph of the 10⁴–10⁵ watch items is NEVER materialized (`Watch History` is folded to dates-only on
 * the fly). Gone is the double peak of `JSON.parse` + valibot clone of the whole graph — only the
 * dates-only list survives, carried by `normalized`. Confining it to a function stays useful: the
 * decompressed string and the graph of the small sections become collectable at the `return`, before
 * the rules.
 */
type IngestResult =
  | { ok: true; normalized: NormalizedExport }
  | { ok: false; result: EngineResult };

function ingest(zipBytes: Uint8Array, options: ProcessOptions): IngestResult {
  const ingested = ingestExportStreaming(zipBytes, options);
  if (ingested.ok) {
    return { ok: true, normalized: ingested.normalized };
  }
  if (ingested.stage === 'too_large') {
    return {
      ok: false,
      result: {
        ok: false,
        stage: 'too_large',
        originalSize: ingested.originalSize,
        limit: ingested.limit,
      },
    };
  }
  if (ingested.stage === 'parse') {
    return { ok: false, result: { ok: false, stage: 'parse', error: ingested.error } };
  }
  return { ok: false, result: { ok: false, stage: 'validate', issues: ingested.issues } };
}

/**
 * Runs the full pipeline on the `.zip` bytes. Never throws: every expected failure is a variant of
 * `EngineResult`. Meant to run INSIDE the Worker (but pure, hence testable in node).
 */
export function processExport(zipBytes: Uint8Array, options: ProcessOptions = {}): EngineResult {
  // Streaming ingestion (PANO-91): the graph of watch items is never materialized (folded to
  // dates-only); the decompressed string and the graph of the small sections are freed on the return
  // of `ingest`, before analysis. Only `normalized` (dates-only) survives.
  //
  // The ADR-0003 memory bound (only CITED text crosses the engine→UI boundary, never the parsed
  // graph) still holds, and now by CONSTRUCTION: with no store to fill, a crumb only exists carried
  // by the finding that cites it (`Analysis` → `Deduction.evidence`).
  const ingested = ingest(zipBytes, options);
  if (!ingested.ok) {
    return ingested.result;
  }
  // The pipeline hosts no business logic: it orchestrates, `analyze` composes (batch A1).
  return { ok: true, output: analyze(ingested.normalized, options.now, options.locale) };
}
