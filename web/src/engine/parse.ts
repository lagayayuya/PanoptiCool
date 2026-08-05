// Parsing pipeline — approach A (PANO-25, ADR-0002, PANO-5 findings).
//
// Decompresses the `.zip` export in memory (`fflate`), locates the sole `user_data_tiktok.json`,
// then `JSON.parse`. Designed to run in the Web Worker (pure TS, no DOM, ADR-0002).
//
// SEAM (a) — decided in the PANO-25 session: the parser returns `data: unknown`. The
// `unknown → TikTokExport` validation is PANO-26's job (valibot) at the ingest boundary. Casting
// here would lie to the type (the input is untrusted), against strict++/`noUncheckedIndexedAccess`.
//
// LOUD FAILURES (criterion 1): no exception crosses the boundary — each failure is a variant of
// `ParseResult` (discriminated union, structured-clone serializable). No wording in the engine
// (ADR-0004): the variant carries an `error` + its structured data; the presentation layer maps the
// code to a message.
//
// KNOWN LIMITATION (criterion 1, option 1a): native `JSON.parse` (approach A) silently collapses any
// duplicate keys *within one object* (`{"a":1,"a":2}` → `{a:2}`) — the `reviver` does not see them.
// Detecting them would require a tokenizing parser (approach B, out of v1). The contract
// `docs/tiktok-export-schema.md` has no such case; §1.6 (section duplicated under two parents) and
// §1.7 (malformed but valid key) are NOT object duplicates and are handled correctly.

import { strFromU8, type UnzipFileInfo, unzipSync } from 'fflate';

/** Name of the sole JSON file expected in the archive (contract §0).
 *  EXPORTED since the platform seam: `tiktok-connector.ts` recognises an archive by this entry, and
 *  a second copy of the string is a second thing to update. */
export const TIKTOK_JSON_ENTRY_NAME = 'user_data_tiktok.json';

/**
 * **Decompressed** size threshold (bytes) beyond which we refuse gracefully (criterion 2).
 * ~25 MB = the A→B switchover threshold measured by PANO-5; beyond it, approach A risks the OOM
 * ADR-0002 wants to avoid, and B (SAX) is not implemented in v1. To be confirmed on real devices
 * (PANO-18). Adjustable; overridable per call via `ParseOptions.sizeLimitBytes`.
 */
export const EXPORT_SIZE_LIMIT_BYTES = 25 * 1024 * 1024;

/** Pipeline failure codes. */
export type ParseErrorKind =
  | 'invalid_zip'
  | 'json_entry_not_found'
  | 'ambiguous_json_entry'
  | 'export_too_large'
  | 'invalid_json';

/**
 * Pipeline result — discriminated union, plain-data (transferable out of the Worker). Success
 * carries `data: unknown` (seam a); each failure carries its code + the data useful to the UI.
 */
export type ParseResult =
  | { ok: true; data: unknown; originalSize: number }
  | { ok: false; error: 'invalid_zip' }
  | { ok: false; error: 'json_entry_not_found' }
  | { ok: false; error: 'ambiguous_json_entry'; candidates: string[] }
  | { ok: false; error: 'export_too_large'; originalSize: number; limit: number }
  | { ok: false; error: 'invalid_json' };

export interface ParseOptions {
  /** Refusal threshold (decompressed bytes). Default `EXPORT_SIZE_LIMIT_BYTES`. */
  sizeLimitBytes?: number;
}

/** Basename of a zip entry path (`/` separator, zip standard). Tolerates a folder prefix. */
function basename(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash === -1 ? path : path.slice(slash + 1);
}

/**
 * Result of decompression alone (without `JSON.parse`): the entry's JSON text + its size.
 * Discriminated union, reused by the classic parser (`parseTikTokExport`) AND by streaming ingestion
 * (`ingest/ingest-stream.ts`, PANO-91), which prefers the TEXT (it tokenizes it without materializing
 * the graph) over a materializing `JSON.parse`.
 */
export type DecompressResult =
  | { ok: true; text: string; originalSize: number }
  | { ok: false; error: 'invalid_zip' }
  | { ok: false; error: 'json_entry_not_found' }
  | { ok: false; error: 'ambiguous_json_entry'; candidates: string[] }
  | { ok: false; error: 'export_too_large'; originalSize: number; limit: number };

/**
 * Decompresses the export and returns the TEXT of the sole `user_data_tiktok.json` (does not parse).
 * Shared step: the memory peak here is only the decompressed string (bounded, ~the weight of the
 * JSON) — materializing the graph (approach A) or avoiding it (stream, approach B) is decided AFTER.
 * Graceful refusal beyond `sizeLimitBytes` (anti-zip-bomb guard; adjustable per call — the stream
 * raises it).
 */
export function decompressJsonEntry(
  zipBytes: Uint8Array,
  options: ParseOptions = {},
): DecompressResult {
  const sizeLimit = options.sizeLimitBytes ?? EXPORT_SIZE_LIMIT_BYTES;

  // Pass 1 — metadata only: the filter returns `false` (no decompression), which lets us locate the
  // entry and read `originalSize` BEFORE decompressing (criterion 2).
  const candidates: { name: string; originalSize: number }[] = [];
  try {
    unzipSync(zipBytes, {
      filter: (file: UnzipFileInfo): boolean => {
        if (basename(file.name) === TIKTOK_JSON_ENTRY_NAME) {
          candidates.push({ name: file.name, originalSize: file.originalSize });
        }
        return false;
      },
    });
  } catch {
    return { ok: false, error: 'invalid_zip' };
  }

  if (candidates.length === 0) return { ok: false, error: 'json_entry_not_found' };
  if (candidates.length > 1) {
    return { ok: false, error: 'ambiguous_json_entry', candidates: candidates.map((c) => c.name) };
  }

  const entry = candidates[0];
  if (entry === undefined) return { ok: false, error: 'json_entry_not_found' };

  // Criterion 2 — graceful refusal BEFORE decompressing if the decompressed size exceeds the threshold.
  if (entry.originalSize > sizeLimit) {
    return {
      ok: false,
      error: 'export_too_large',
      originalSize: entry.originalSize,
      limit: sizeLimit,
    };
  }

  // Pass 2 — decompress the single retained entry.
  let bytes: Uint8Array | undefined;
  try {
    const decoded = unzipSync(zipBytes, {
      filter: (file: UnzipFileInfo) => file.name === entry.name,
    });
    bytes = decoded[entry.name];
  } catch {
    return { ok: false, error: 'invalid_zip' };
  }
  if (bytes === undefined) return { ok: false, error: 'json_entry_not_found' };

  return { ok: true, text: strFromU8(bytes), originalSize: entry.originalSize };
}

/**
 * Decompresses the export, locates `user_data_tiktok.json`, parses it (approach A, `JSON.parse`).
 * Does NOT validate the shape (PANO-26). Never throws: every expected failure is a variant of
 * `ParseResult`. The engine's ingestion now goes through the STREAM (`ingest/`); this function
 * remains the reference approach-A path (parsing tests, memory comparison).
 */
export function parseTikTokExport(zipBytes: Uint8Array, options: ParseOptions = {}): ParseResult {
  const decompressed = decompressJsonEntry(zipBytes, options);
  if (!decompressed.ok) {
    return decompressed;
  }

  let data: unknown;
  try {
    data = JSON.parse(decompressed.text);
  } catch {
    return { ok: false, error: 'invalid_json' };
  }

  return { ok: true, data, originalSize: decompressed.originalSize };
}
