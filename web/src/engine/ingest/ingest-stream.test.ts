// Tests of streaming ingestion (PANO-91). Locks: (1) folding produces a dates-only Watch History
// (Link/Title removed); (2) the small sections stay validated by the contract (trust boundary
// intact); (3) failures are graceful (discriminated union), never exceptions.
//
// Here we prove the FUNCTIONAL correctness of the stream, not its memory behavior: vitest does not
// propagate a reliable heap cap to the worker (cf. `scale.test.ts` cartouche), so a numeric memory
// canary would require a separate node bench — none exists in the repo anymore.

import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import type { WatchHistoryItem } from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import { ingestExportStreaming } from './ingest-stream';

/** Zips a JSON export under the entry name expected by the decompressor. */
function zipExport(exportObj: unknown): Uint8Array {
  return zipSync({ 'user_data_tiktok.json': strToU8(JSON.stringify(exportObj)) });
}

/** Fixture with a populated Watch History (full Date/Link/Title items, to prove the projection). */
function exportWithWatchHistory(items: readonly WatchHistoryItem[]) {
  const exp = validTikTokExport();
  (exp['Your Activity']['Watch History'] as { VideoList: readonly WatchHistoryItem[] }).VideoList =
    items;
  return exp;
}

describe('ingestExportStreaming — dates-only Watch History fold', () => {
  it('projects each watch item onto {Date}, without Link/Title', () => {
    const res = ingestExportStreaming(
      zipExport(
        exportWithWatchHistory([
          { Date: '2024-01-15 00:30:00', Link: 'https://x/1/', Title: 'titre 1' },
          { Date: '2024-06-15 12:30:00', Link: 'https://x/2/', Title: '' },
        ]),
      ),
    );

    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const videoList = res.normalized['Your Activity']['Watch History'].VideoList;
    expect(videoList).toHaveLength(2);
    expect(Object.keys(videoList[0] as object)).toEqual(['Date']); // Link/Title removed
    expect(videoList[0]?.Date).toBe('2024-01-15 00:30:00');
    expect(videoList[1]?.Date).toBe('2024-06-15 12:30:00');
  });

  it('empty Watch History (VideoList: []) → empty list, no failure', () => {
    const res = ingestExportStreaming(zipExport(validTikTokExport()));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.normalized['Your Activity']['Watch History'].VideoList).toEqual([]);
  });

  it('coalesces the nullable sections like approach A (null → [])', () => {
    const exp = validTikTokExport();
    (exp.Comment.Comments as { CommentsList: null }).CommentsList = null;
    const res = ingestExportStreaming(zipExport(exp));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.normalized.Comment.Comments.CommentsList).toEqual([]);
  });
});

describe('ingestExportStreaming — trust boundary & graceful failures', () => {
  it('malformed JSON → { ok:false, stage:"parse", error:"invalid_json" }', () => {
    const zip = zipSync({ 'user_data_tiktok.json': strToU8('{"Comment": {') });
    const res = ingestExportStreaming(zip);
    expect(res).toEqual({ ok: false, stage: 'parse', error: 'invalid_json' });
  });

  it('non-string watch Date → validate failure (the folded array stays validated)', () => {
    const exp = validTikTokExport();
    (exp['Your Activity']['Watch History'] as { VideoList: unknown }).VideoList = [
      { Date: 12345, Link: 'x', Title: '' }, // numeric Date → violates the contract
    ];
    const res = ingestExportStreaming(zipExport(exp));
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.stage).toBe('validate');
  });

  it('absent required section → validate failure', () => {
    // Here we fabricate an input the contract FORBIDS (a required section removed), to verify that
    // validation refuses it. `TikTokExport` describes it as read-only and without an index
    // signature: going through `unknown` is the only cast TS accepts, and it says plainly what we
    // are doing — stepping out of the type on purpose, just long enough to break the datum.
    const exp = validTikTokExport() as unknown as Record<string, unknown>;
    delete exp.Comment;
    const res = ingestExportStreaming(zipExport(exp));
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.stage).toBe('validate');
  });

  it('invalid zip → { ok:false, stage:"parse", error:"invalid_zip" }', () => {
    const res = ingestExportStreaming(new Uint8Array([1, 2, 3, 4]));
    expect(res).toEqual({ ok: false, stage: 'parse', error: 'invalid_zip' });
  });

  it('JSON entry absent from the zip → parse/json_entry_not_found', () => {
    const zip = zipSync({ 'autre.json': strToU8('{}') });
    const res = ingestExportStreaming(zip);
    expect(res).toEqual({ ok: false, stage: 'parse', error: 'json_entry_not_found' });
  });

  it('beyond the size cap (low option) → { ok:false, stage:"too_large" }', () => {
    const res = ingestExportStreaming(zipExport(validTikTokExport()), { sizeLimitBytes: 10 });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.stage).toBe('too_large');
  });
});
