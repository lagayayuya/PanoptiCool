// TikTok as ONE CONNECTOR OF TWO — the adapter between the platform seam (`connector.ts`) and the
// pipeline that already existed (`pipeline.ts`, PANO-27).
//
// ⚠ IT WRAPS, IT DOES NOT REWRITE. The pipeline keeps taking the zip's bytes and keeps doing its own
// streaming ingestion (PANO-91: the 10⁴–10⁵ watch items are folded to dates-only on the fly, never
// materialised). Re-plumbing it to read through `ExportSource` would replace a measured, tested
// ingestion with an unmeasured one, for no gain the reader can see — a TikTok export is ONE entry,
// so a source that can list directories buys it nothing.
//
// What the seam does buy, and the reason this file exists at all: the PAGE no longer needs to know
// that a TikTok export is a zip holding `user_data_tiktok.json`. It hands over a source and a
// platform; everything platform-shaped stops here.
//
// ─── WHAT THIS ADAPTER DOES NOT COVER ───────────────────────────────────────────────────────────
//   - IT ADDS NO ANALYSIS. Every finding still comes from `processExport`; this file maps failures
//     and reads one entry. If a behaviour changed here, the four goldens would say so, and they do
//     not — that is the intended result, and it is what `connector.test.ts` pins;
//   - IT DOES NOT WIDEN WHAT COUNTS AS A TIKTOK EXPORT. `recognize` tests for the one entry the
//     contract names (§0). An HTML export, a partial export, an export from another platform: all
//     answer `false`, and none of them is told apart from the others — a distinction the person does
//     not need and that we could not make honestly.

import type { Analysis } from './analysis';
import type { Connector, ConnectorOptions, ConnectorResult } from './connector';
import { TIKTOK_JSON_ENTRY_NAME } from './parse';
import { processExport } from './pipeline';
import type { ExportSource } from './source';
import { ZipExportSource } from './zip-source';

/** TikTok's report IS `Analysis` — the value type the four goldens and the whole v5 page read. */
export type TiktokReport = Analysis;

/**
 * ⚠ THE SOURCE MUST BE A `ZipExportSource`, and the type cannot say so.
 *
 * `Connector` promises to work from any `ExportSource`, and this connector needs the ARCHIVE BYTES,
 * because the pipeline's streaming ingestion decompresses them itself. Reading the JSON entry
 * through the source and handing the string over would work — and would silently drop the
 * streaming, doubling the peak on the largest exports.
 *
 * So the narrowing is checked at runtime and refused loudly rather than hidden behind a cast. The
 * day a folder source has to feed this connector (Instagram's route, not TikTok's), this is the
 * line that will say what has to change.
 */
export interface TiktokSource extends ExportSource {
  readonly zipBytes: Uint8Array;
}

/** A `ZipExportSource` that also keeps the archive bytes, for the connector above. */
export class TiktokZipSource extends ZipExportSource implements TiktokSource {
  readonly zipBytes: Uint8Array;
  constructor(zipBytes: Uint8Array, rootName?: string) {
    super(zipBytes, rootName);
    this.zipBytes = zipBytes;
  }
}

function hasZipBytes(source: ExportSource): source is TiktokSource {
  return source instanceof TiktokZipSource;
}

export const tiktokConnector: Connector<TiktokReport> = {
  platform: 'tiktok',

  async recognize(source: ExportSource): Promise<boolean> {
    // One `exists` on the entry the contract names. Deliberately not a read: `recognize` runs
    // before the person has been told anything, and inflating megabytes to answer a yes/no is how
    // a page comes to look frozen.
    return source.exists(TIKTOK_JSON_ENTRY_NAME);
  },

  analyze(source: ExportSource, options: ConnectorOptions): Promise<ConnectorResult<TiktokReport>> {
    if (!hasZipBytes(source)) {
      return Promise.resolve({
        ok: false,
        stage: 'parse',
        error: 'tiktok_connector_requires_zip_bytes',
      });
    }
    const result = processExport(source.zipBytes, {
      locale: options.locale as never,
      ...(options.now !== undefined && { now: options.now }),
    });
    if (result.ok) {
      return Promise.resolve({ ok: true, report: result.output });
    }
    if (result.stage === 'too_large') {
      return Promise.resolve({
        ok: false,
        stage: 'too_large',
        originalSize: result.originalSize,
        limit: result.limit,
      });
    }
    if (result.stage === 'validate') {
      // ⚠ FLATTENED TO STRINGS, and the loss is intentional. `ValidationIssue` carries a path and a
      // kind that the UI has never read — it renders one sentence for the whole failure. Crossing
      // the seam with the richer type would export a shape only the TikTok half can produce, and
      // oblige the second connector to fabricate one. The issues stay PII-safe either way:
      // validators cite paths and types, never values.
      return Promise.resolve({
        ok: false,
        stage: 'validate',
        issues: result.issues.map((i) => `${i.path}: expected ${i.expected}`),
      });
    }
    return Promise.resolve({ ok: false, stage: 'parse', error: result.error });
  },
};
