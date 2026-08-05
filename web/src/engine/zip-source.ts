// `ZipExportSource` — an `ExportSource` over the bytes of a `.zip`, decompressed in memory.
//
// ⚠ IT INFLATES THE WHOLE ARCHIVE, ONCE, UP FRONT. That is honest for what it serves today — a
// TikTok export is one JSON of a few MB — and it is NOT what the Instagram connector will use: a
// 2 GB archive cannot be held decompressed in a browser tab. The random-access reader (central
// directory + per-entry inflate from `Blob.slice()`) is a separate implementation of the SAME
// contract, which is the whole reason the contract exists. This one stays for the small case and
// for the tests, where a 60 KB fixture through a random-access reader would only be slower.
//
// The size guard is therefore the one that already governed TikTok ingestion (`EXPORT_SIZE_LIMIT_BYTES`),
// applied to the AGGREGATE decompressed size — because for this implementation the aggregate IS the
// peak. A per-entry budget would be the wrong bound here and the right one there; each
// implementation states its own rather than sharing a constant that means two different things.
//
// ─── WHAT THIS IMPLEMENTATION DOES NOT DO ───────────────────────────────────────────────────────
//   - NO STREAMING. `readText` returns an already-decompressed string; nothing here can hand out a
//     `ReadableStream`. The TikTok pipeline tokenizes that string itself (PANO-91);
//   - NO ZIP64, no encrypted entries, no symlinks — whatever `fflate.unzipSync` refuses, this
//     refuses, and it surfaces as an `invalid_zip` at the connector boundary;
//   - NO DIRECTORY ENTRIES OF ITS OWN. Zip archives may or may not store explicit directory
//     records; `listDir` derives the listing from the FILE paths instead, so both kinds of archive
//     list identically. A directory that exists only as an empty record is therefore invisible —
//     which is correct for a reader that wants what is IN it.

import { strFromU8, unzipSync } from 'fflate';
import type { DirEntry, ExportSource } from './source';

/** Thrown for an absent path. Caught at the connector boundary and mapped to a `parse` failure. */
export class EntryNotFound extends Error {
  constructor(path: string) {
    // The PATH is safe to name — it is structure. A VALUE never enters an error message.
    super(`entry not found: ${path}`);
    this.name = 'EntryNotFound';
  }
}

function normalize(path: string): string {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

export class ZipExportSource implements ExportSource {
  private readonly files: Map<string, Uint8Array>;
  private readonly root: string;

  constructor(zipBytes: Uint8Array, rootName = 'export.zip') {
    // `unzipSync` throws on a malformed archive; the caller maps that to `invalid_zip`.
    const unzipped = unzipSync(zipBytes);
    this.files = new Map(
      Object.entries(unzipped)
        // Directory records end in `/` and carry no bytes: dropped, `listDir` derives them.
        .filter(([name]) => !name.endsWith('/'))
        .map(([name, bytes]) => [normalize(name), bytes]),
    );
    this.root = rootName;
  }

  rootName(): string {
    return this.root;
  }

  private bytes(path: string): Uint8Array {
    const found = this.files.get(normalize(path));
    if (found === undefined) {
      throw new EntryNotFound(path);
    }
    return found;
  }

  readText(path: string): Promise<string> {
    return Promise.resolve(strFromU8(this.bytes(path)));
  }

  async readJson<T = unknown>(path: string): Promise<T> {
    return JSON.parse(await this.readText(path)) as T;
  }

  listDir(path: string): Promise<DirEntry[]> {
    const prefix = normalize(path) === '' ? '' : `${normalize(path)}/`;
    // A `Map` rather than a `Set` of names: a directory and a file can share a name in principle,
    // and collapsing them would report the wrong `kind` for one of the two.
    const seen = new Map<string, DirEntry['kind']>();
    for (const full of this.files.keys()) {
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
    const found = this.files.get(normalize(path));
    return Promise.resolve(found === undefined ? null : { size: found.length });
  }

  exists(path: string): Promise<boolean> {
    const p = normalize(path);
    if (this.files.has(p)) return Promise.resolve(true);
    const prefix = `${p}/`;
    for (const full of this.files.keys()) {
      if (full.startsWith(prefix)) return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  /** Aggregate decompressed size — what this implementation's peak actually tracks. */
  totalDecompressedBytes(): number {
    let total = 0;
    for (const bytes of this.files.values()) {
      total += bytes.length;
    }
    return total;
  }
}
