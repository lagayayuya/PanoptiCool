// `ExportSource` — the boundary between the engine (pure TS, portable) and HOW the bytes of an
// export are reached: a dropped zip, a folder picked through the File System Access API, a native
// filesystem, a test fixture on disk.
//
// The engine knows ONLY this interface. It never references `window`, `File` or `FileSystemHandle`
// (ADR-0002). Porting to another host means writing another implementation; the engine does not
// move. Ported from the Instagram prototype, whose engine was written against this contract from
// the start — that is the one piece of its architecture that arrives already right.
//
// PATHS ARE RELATIVE TO THE EXPORT ROOT, separated by `/`, never leading with one.
//
// ─── WHY IT EXISTS HERE, WHEN TIKTOK NEEDS ONE FILE ─────────────────────────────────────────────
// A TikTok export is a zip holding a single JSON; reading it needs no directory listing, and this
// interface is plainly oversized for it. Instagram's is a tree of 500+ files across 9 directories
// (`docs/instagram-export-schema.md`), read by path, some of them 16 MB. The contract is sized for
// the second because the second is what cannot be expressed without it — and the first goes through
// it so that ONE ingestion path is maintained, not two that drift.
//
// ─── WHAT THIS CONTRACT DOES NOT PROMISE ────────────────────────────────────────────────────────
//   - NO WRITES. An export is read; nothing here can modify the source, and that is deliberate:
//     the product must be unable to touch the person's file even by accident;
//   - NO ORDERING. `listDir` returns entries in whatever order the implementation finds them. A
//     reader that needs an order sorts;
//   - NO CACHING GUARANTEE. Two `readJson` calls on the same path may parse twice. A caller that
//     reads a 16 MB entry in a loop is paying for it, and it is on the caller to notice;
//   - NOTHING ABOUT MEMORY. `readText` on a 16 MB entry allocates 16 MB. The per-entry budget that
//     bounds it lives with the implementation, not with the contract.

/** One entry of a directory listing. */
export interface DirEntry {
  readonly name: string;
  readonly kind: 'file' | 'directory';
}

export interface ExportSource {
  /** Name of the root — for DISPLAY only. Never parsed, never used to route. */
  rootName(): string;
  /** Reads a text file, already decoded as UTF-8. Rejects if absent. */
  readText(path: string): Promise<string>;
  /** Reads and parses a JSON file. Rejects if absent or malformed. */
  readJson<T = unknown>(path: string): Promise<T>;
  /** Lists a directory's contents. Resolves to `[]` if the directory is absent — an empty section
   *  and a missing one are the same thing to a reader that only wants what is there. */
  listDir(path: string): Promise<DirEntry[]>;
  /** Size of an entry WITHOUT loading its bytes; `null` if absent. This is what makes a per-entry
   *  memory budget possible: the decision to refuse is taken before the allocation. */
  stat(path: string): Promise<{ size: number } | null>;
  /** Whether a path exists, file or directory. */
  exists(path: string): Promise<boolean>;
}

/** Progress during a long read, so the interface can show something other than a frozen page. */
export type ProgressFn = (p: { phase: string; done: number; total: number }) => void;
