// `BlobZipExportSource` — an `ExportSource` over a zip that is NEVER unpacked.
//
// The second implementation of the contract, and the reason the contract exists. `ZipExportSource`
// inflates the whole archive up front: right for a TikTok export of a few MB, impossible for an
// Instagram export of 2 GB. This one reads the central directory (a few dozen KB at the tail) and
// inflates one entry at a time from `Blob.slice()`. A dropped `File` IS a `Blob` and is disk-backed,
// so slicing reads a range rather than loading the archive.
//
// ⚠ THE SIZE GUARD IS PER ENTRY, and that is the whole point. A total-decompressed ceiling was
// always a guess about the reader's machine dressed up as a property of the file. Peak memory here
// tracks the largest entry being inflated — a fact about the archive, readable from the directory
// BEFORE allocating anything. So the refusal happens before the allocation that would fail, which
// is what makes it a graceful refusal rather than a crash.
//
// It follows, and the copy must say so rather than promise a number: a 2 GB archive of ordinary
// entries opens; a 500 MB archive holding one 400 MB entry does not.
//
// ─── WHAT THIS IMPLEMENTATION DOES NOT DO ───────────────────────────────────────────────────────
//   - IT DOES NOT CACHE. Two `readJson` calls on the same path inflate twice. Deliberate: caching
//     the 16 MB entry of the reference export would hold it for the whole session, which is the
//     memory this class exists to avoid. A caller that re-reads in a loop pays for it — and the
//     Instagram extractors each read their paths once;
//   - IT DOES NOT BOUND THE AGGREGATE. Nothing stops a caller from holding every inflated entry at
//     once; the bound is on ONE inflation. What the extractors keep is their business, and
//     `EngineOutput`'s memory bound (ADR-0003) is what governs it downstream;
//   - IT DOES NOT VERIFY CRC-32 (see `zip-directory.ts`);
//   - IT IS ASYNC, WHERE `ZipExportSource` IS NOT — the sync one resolves already-inflated bytes.
//     Both satisfy the same promise-returning contract, so no caller can tell, which is the point.

import { inflateSync } from 'fflate';
import {
  inflateEntry,
  readCentralDirectory,
  type ZipEntry,
  ZipFormatError,
} from './ingest/zip-directory';
import type { DirEntry, ExportSource } from './source';
import { EntryNotFound } from './zip-source';

/**
 * Largest single entry this reader will inflate.
 *
 * ⚠ THE NUMBER IS AN ARGUMENT, NOT A FEELING. The reference Instagram export's largest entry is
 * 16.2 MB (`docs/instagram-export-schema.md` §2, `liked_posts.json` of an eight-year account with
 * ~8 000 likes). 128 MB is therefore ~8× the observed worst case, which leaves room for an account
 * an order of magnitude heavier while staying far below what a browser tab will refuse. It bounds
 * ONE inflation, not the session.
 */
export const MAX_ENTRY_BYTES = 128 * 1024 * 1024;

export class EntryTooLarge extends Error {
  constructor(
    readonly path: string,
    readonly size: number,
    readonly limit: number,
  ) {
    // Sizes and paths are structure; no value is ever named in an error.
    super(`entry too large: ${path} (${size} > ${limit})`);
    this.name = 'EntryTooLarge';
  }
}

function normalize(path: string): string {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

export class BlobZipExportSource implements ExportSource {
  private constructor(
    private readonly blob: Blob,
    private readonly entries: Map<string, ZipEntry>,
    private readonly root: string,
    private readonly maxEntryBytes: number,
  ) {}

  /**
   * Reads the index. The only await before the source is usable, and it touches a few dozen KB —
   * so a 2 GB archive is ready in about the time a 2 MB one is.
   */
  static async open(
    blob: Blob,
    rootName = 'export.zip',
    maxEntryBytes: number = MAX_ENTRY_BYTES,
  ): Promise<BlobZipExportSource> {
    const list = await readCentralDirectory(blob);
    const map = new Map<string, ZipEntry>();
    for (const e of list) {
      map.set(normalize(e.path), e);
    }
    return new BlobZipExportSource(blob, map, rootName, maxEntryBytes);
  }

  rootName(): string {
    return this.root;
  }

  /** Every entry's declared uncompressed size — read from the directory, nothing inflated. */
  totalUncompressedBytes(): number {
    let total = 0;
    for (const e of this.entries.values()) {
      total += e.uncompressedSize;
    }
    return total;
  }

  /** Largest single entry — the number the per-entry budget is actually about. */
  largestEntryBytes(): number {
    let max = 0;
    for (const e of this.entries.values()) {
      if (e.uncompressedSize > max) max = e.uncompressedSize;
    }
    return max;
  }

  async readBytes(path: string): Promise<Uint8Array> {
    const entry = this.entries.get(normalize(path));
    if (entry === undefined) {
      throw new EntryNotFound(path);
    }
    // Refused BEFORE the allocation, from the directory's declared size. Checking after inflating
    // would be checking after the failure it exists to prevent.
    if (entry.uncompressedSize > this.maxEntryBytes) {
      throw new EntryTooLarge(entry.path, entry.uncompressedSize, this.maxEntryBytes);
    }
    return inflateEntry(this.blob, entry, (bytes, expectedSize) =>
      // `fflate.inflateSync` with `out` pre-sized: one allocation of the known size rather than the
      // doubling-buffer growth, which would transiently hold ~1.5× the entry.
      inflateSync(bytes, { out: new Uint8Array(expectedSize) }),
    );
  }

  async readText(path: string): Promise<string> {
    return new TextDecoder('utf-8').decode(await this.readBytes(path));
  }

  async readJson<T = unknown>(path: string): Promise<T> {
    return JSON.parse(await this.readText(path)) as T;
  }

  listDir(path: string): Promise<DirEntry[]> {
    const prefix = normalize(path) === '' ? '' : `${normalize(path)}/`;
    const seen = new Map<string, DirEntry['kind']>();
    for (const full of this.entries.keys()) {
      if (!full.startsWith(prefix)) continue;
      const rest = full.slice(prefix.length);
      const slash = rest.indexOf('/');
      if (slash === -1) {
        seen.set(rest, 'file');
      } else if (!seen.has(rest.slice(0, slash))) {
        seen.set(rest.slice(0, slash), 'directory');
      }
    }
    return Promise.resolve([...seen].map(([name, kind]) => ({ name, kind })));
  }

  stat(path: string): Promise<{ size: number } | null> {
    const e = this.entries.get(normalize(path));
    return Promise.resolve(e === undefined ? null : { size: e.uncompressedSize });
  }

  exists(path: string): Promise<boolean> {
    const p = normalize(path);
    if (this.entries.has(p)) return Promise.resolve(true);
    const prefix = `${p}/`;
    for (const full of this.entries.keys()) {
      if (full.startsWith(prefix)) return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}

export { ZipFormatError };
