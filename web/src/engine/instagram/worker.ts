// Web Worker adapter of the Instagram connector (ADR-0002).
//
// ⚠ WHAT CROSSES IS THE `File`, NOT ITS BYTES — and that is the whole point. The TikTok worker
// transfers a `Uint8Array` because a TikTok export is a few MB; transferring a 2 GB one would mean
// reading it into memory first, which is precisely what the random-access reader exists to avoid.
// A `File` and a `FileSystemDirectoryHandle` are both structured-cloneable, so the SOURCE is built
// on this side of the boundary and the archive is never held whole anywhere.
//
// ⚠ AND THE GEO DATABASE IS LOADED HERE, not on the page. `fetch` works in a worker, so the 40 MB
// of MMDB never touch the main thread and the resolver never has to cross a boundary it could not
// survive (it is a class with methods; structured-clone would drop them). Only its RESULTS travel,
// inside the geo report. The first draft of this file passed `geoResolver: null` and left the page
// to recompute the trajectory — which would have meant a second pass over `profile_activity.json`
// and a geo report that was wrong until it was replaced.
//
// REPORTS ARE POSTED AS THEY LAND, one message per piece. Waiting to post one result would hold all
// seven in memory to clone them at once, and would put a spinner on the page for the whole analysis
// — the behaviour the connector's `onReport` exists to prevent.
//
// THE LANGUAGE CROSSES AS DATA, on the same footing as the file: the engine emits prose (ADR-0004)
// and has no `document` to read `<html lang>` from, which is exactly what makes it pure.
//
// ─── WHAT THIS ADAPTER DOES NOT DO ──────────────────────────────────────────────────────────────
//   - IT DOES NOT SURVIVE THE ANALYSIS. The thread reader and the media resolver are needed AFTER
//     it, on demand; a worker answering those would stay resident holding a file handle for the
//     session. They run on the page, from the same `File`, which is why the page keeps it;
//   - IT REPORTS THE DATABASE'S ABSENCE rather than failing on it. A fresh clone has no MMDB
//     (`NOTICE`), and that must cost the map its inferred layer and nothing else;
//   - NO DOM, verified by the second `tsc` pass over `engine/`.

import type { Locale } from '../../i18n/locales';
import { BlobZipExportSource } from '../blob-zip-source';
import type { ExportSource } from '../source';
import { type InstagramOptions, instagramConnector, type ReportPatch } from './connector';
import { type DirHandle, FsDirectoryExportSource } from './fs-directory-source';
import { MmdbGeoResolver } from './mmdb-geo-resolver';

/** What the page sends. Exactly one of `file` / `directory` is set. */
export interface InstagramWorkerRequest {
  readonly file?: File;
  /** A `FileSystemDirectoryHandle` — cloneable in Chromium, which is where this route exists. */
  readonly directory?: DirHandle;
  readonly locale: Locale;
  readonly now?: number;
}

/** What comes back. Discriminated on `kind`, all plain data (structured-clone-safe). */
export type InstagramWorkerMessage =
  | {
      readonly kind: 'progress';
      readonly phase: string;
      readonly done: number;
      readonly total: number;
    }
  | { readonly kind: 'report'; readonly patch: ReportPatch }
  | { readonly kind: 'geo-database'; readonly available: boolean }
  | { readonly kind: 'coverage'; readonly matched: number; readonly total: number }
  | { readonly kind: 'error'; readonly stage: string }
  | { readonly kind: 'done' };

addEventListener('message', (event: MessageEvent<InstagramWorkerRequest>): void => {
  void run(event.data);
});

async function buildSource(req: InstagramWorkerRequest): Promise<ExportSource | null> {
  try {
    if (req.directory !== undefined) return new FsDirectoryExportSource(req.directory);
    if (req.file !== undefined) return await BlobZipExportSource.open(req.file, req.file.name);
    return null;
  } catch {
    return null;
  }
}

async function run(req: InstagramWorkerRequest): Promise<void> {
  const post = (m: InstagramWorkerMessage) => postMessage(m);

  const source = await buildSource(req);
  if (source === null) {
    post({ kind: 'error', stage: 'parse' });
    return;
  }
  if (!(await instagramConnector.recognize(source))) {
    post({ kind: 'error', stage: 'wrong_platform' });
    return;
  }

  // Loaded before the analysis, and its absence announced immediately: the page can show the notice
  // while the parsing runs, rather than at the end when the map is already on screen without a
  // layer and no one has said why.
  const geoResolver = await MmdbGeoResolver.load();
  post({ kind: 'geo-database', available: geoResolver !== null });

  // ⚠ BUILT AS A VARIABLE, not passed inline. `analyze` takes the base `ConnectorOptions`, so a
  // fresh literal carrying `geoResolver` trips TypeScript's excess-property check — which applies
  // to literals only. Naming it first is not a workaround for the check: it is how the connector's
  // generic contract and this connector's extra options are meant to meet (ADR-0007).
  const options: InstagramOptions = {
    locale: req.locale,
    ...(req.now !== undefined && { now: req.now }),
    geoResolver,
    onProgress: (p) => post({ kind: 'progress', ...p }),
    onReport: (patch: ReportPatch) => post({ kind: 'report', patch }),
  };
  const result = await instagramConnector.analyze(source, options);

  if (!result.ok) {
    post({ kind: 'error', stage: result.stage });
    return;
  }
  post({
    kind: 'coverage',
    matched: result.report.labelCoverage.matched,
    total: result.report.labelCoverage.total,
  });
  post({ kind: 'done' });
}
