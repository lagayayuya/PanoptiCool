// OBJECT URLS FOR MEDIA, created once per path and revoked together.
//
// ⚠ WHY THIS EXISTS AT ALL. The engine's resolver returns BYTES (`connector.ts`), deliberately: it
// has no idea how long a caller wants them, and caching them there would be a memory leak with a
// friendly name. But a map's thumbnails are recycled in a pool and redrawn on every frame of a pan —
// minting a fresh object URL per frame would both leak and make the thumbnail flicker as the browser
// reloaded it.
//
// So the URLs are cached HERE, at the piece's level, where something knows when they stop being
// needed: the piece unmounts, `revokeAll` runs, and every handle goes at once.
//
// ─── ⚠ WHAT THIS DOES NOT DO ────────────────────────────────────────────────────────────────────
//   - IT DOES NOT BOUND ITSELF. Every distinct path opened during a visit is held until the piece
//     unmounts. On the reference export that is what the map actually shows — a few dozen media —
//     and it is NOT safe for a surface that could walk thousands. The media grid pages deliberately
//     for that reason;
//   - IT DOES NOT DEDUPLICATE CONCURRENT CALLS beyond the promise cache: two callers asking for the
//     same path at once share one read, which is the point, but a caller that asks and then leaves
//     still pays for the read.

import type { ResolveMedia } from '../../engine/instagram/connector';

export interface MediaUrls {
  /** The object URL for a path, or `null` when the entry is not in the export. */
  url: (path: string) => Promise<string | null>;
  /** Releases every URL handed out. Call it when the piece goes away. */
  revokeAll: () => void;
}

export function createMediaUrls(resolve: ResolveMedia): MediaUrls {
  // Promises, not strings: two thumbnails asking for the same path in the same frame must not read
  // the archive twice.
  const cache = new Map<string, Promise<string | null>>();

  return {
    url(path: string) {
      const hit = cache.get(path);
      if (hit !== undefined) return hit;
      const pending = resolve(path).then((bytes) =>
        // A fresh copy: the resolver may return a view onto a larger buffer, and `Blob` would keep
        // that whole buffer alive for as long as the URL exists.
        bytes === null ? null : URL.createObjectURL(new Blob([bytes.slice().buffer])),
      );
      cache.set(path, pending);
      return pending;
    },
    revokeAll() {
      for (const pending of cache.values()) {
        void pending.then((u) => {
          if (u !== null) URL.revokeObjectURL(u);
        });
      }
      cache.clear();
    },
  };
}
