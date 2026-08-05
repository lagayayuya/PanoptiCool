// `ExportSource` over a DIRECTORY the person picked, through the File System Access API.
//
// ⚠ WHY A SECOND ROUTE EXISTS AT ALL. An Instagram export arrives as a zip, and the random-access
// reader opens one fine — so this is not about capability. It is about the case where the zip is
// gone: people unzip an archive to look inside it, then delete it. Asking them to re-request an
// export that takes three days to arrive, because they kept only the folder, is not an answer.
//
// ⚠ AND IT IS CHROMIUM-ONLY, which is a fact about browsers rather than a choice. `showDirectoryPicker`
// is not implemented in Firefox or Safari. The zip route works everywhere and is the one the
// interface offers first; this one appears only where it can work, and its absence is never an
// error message about the person's browser being wrong.
//
// ─── WHAT THIS IMPLEMENTATION DOES NOT DO ───────────────────────────────────────────────────────
//   - IT ASKS FOR NO PERMISSION BEYOND READ. The picker grants read access to one directory the
//     person chose; nothing here can write, and nothing walks outside it;
//   - IT DOES NOT CACHE HANDLES BETWEEN SESSIONS. Persisting a directory handle in IndexedDB is
//     possible and deliberately not done: a site that silently regains access to a folder after a
//     reload is not what « nothing leaves your device » should feel like;
//   - IT HAS NO SIZE BUDGET. Reading one file at a time from a real filesystem has no equivalent of
//     the zip reader's per-entry inflation, so the guard that matters there means nothing here;
//   - IT IS NOT TESTED AGAINST A REAL PICKER. `showDirectoryPicker` needs a user gesture in a real
//     browser; the tests exercise the traversal over a fake handle tree, and the border says so.

import type { DirEntry, ExportSource } from '../source';

/** The slice of the File System Access API this file uses — declared so it can be faked. */
export interface DirHandle {
  readonly name: string;
  readonly kind: 'directory';
  entries(): AsyncIterableIterator<[string, DirHandle | FileHandleLike]>;
  getDirectoryHandle(name: string): Promise<DirHandle>;
  getFileHandle(name: string): Promise<FileHandleLike>;
}

export interface FileHandleLike {
  readonly name: string;
  readonly kind: 'file';
  getFile(): Promise<{
    size: number;
    text(): Promise<string>;
    arrayBuffer(): Promise<ArrayBuffer>;
  }>;
}

/** Whether this browser can offer the folder route at all. */
export function supportsDirectoryPicker(): boolean {
  return typeof globalThis !== 'undefined' && 'showDirectoryPicker' in globalThis;
}

function segments(path: string): string[] {
  return path.split('/').filter((s) => s !== '' && s !== '.');
}

export class FsDirectoryExportSource implements ExportSource {
  constructor(private readonly root: DirHandle) {}

  rootName(): string {
    return this.root.name;
  }

  /**
   * Walks to a path's parent directory.
   *
   * Returns `null` rather than throwing when a segment is missing: half an export is optional, and
   * every caller upstream already treats an absent section as an empty one.
   */
  private async dirFor(parts: string[]): Promise<DirHandle | null> {
    let dir = this.root;
    for (const part of parts) {
      try {
        dir = await dir.getDirectoryHandle(part);
      } catch {
        return null;
      }
    }
    return dir;
  }

  private async fileFor(path: string): Promise<FileHandleLike | null> {
    const parts = segments(path);
    const name = parts.pop();
    if (name === undefined) return null;
    const dir = await this.dirFor(parts);
    if (dir === null) return null;
    try {
      return await dir.getFileHandle(name);
    } catch {
      return null;
    }
  }

  async readText(path: string): Promise<string> {
    const handle = await this.fileFor(path);
    if (handle === null) throw new Error(`entry not found: ${path}`);
    return (await handle.getFile()).text();
  }

  async readBytes(path: string): Promise<Uint8Array> {
    const handle = await this.fileFor(path);
    if (handle === null) throw new Error(`entry not found: ${path}`);
    return new Uint8Array(await (await handle.getFile()).arrayBuffer());
  }

  async readJson<T = unknown>(path: string): Promise<T> {
    return JSON.parse(await this.readText(path)) as T;
  }

  async listDir(path: string): Promise<DirEntry[]> {
    const dir = await this.dirFor(segments(path));
    if (dir === null) return [];
    const out: DirEntry[] = [];
    for await (const [name, handle] of dir.entries()) {
      out.push({ name, kind: handle.kind });
    }
    return out;
  }

  async stat(path: string): Promise<{ size: number } | null> {
    const handle = await this.fileFor(path);
    if (handle === null) return null;
    return { size: (await handle.getFile()).size };
  }

  async exists(path: string): Promise<boolean> {
    if ((await this.fileFor(path)) !== null) return true;
    // A path can name a DIRECTORY — which is what `recognize` probes for — so a failed file lookup
    // is only half the answer.
    return (await this.dirFor(segments(path))) !== null;
  }
}
