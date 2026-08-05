// UNIVERSE — the inventory of the export's MEDIA: paths and metadata, never the bytes.
//
// The 3D space and the time spiral are built from this list. The files themselves are loaded on
// demand by the interface, one at a time, on the main thread — an export holds 5 413 media
// (`docs/instagram-export-schema.md` §2), and reading them here would mean holding gigabytes to
// answer a question about dates.
//
// ⚠ THE DM MEDIA ARRIVE ALREADY COLLECTED, from the conversations pass (`MediaSink`). Re-scanning
// 349 threads to find attachments a walk had just read past would double the slowest phase of the
// analysis for nothing. Stories and posts are added here because their files are small and are not
// on that path.
//
// ⚠ AND THE SENDER'S NAME IS RESOLVED THEN THROWN AWAY. A draft carries `sender` because the
// account holder is not known while the threads are being walked — it is inferred from the whole
// corpus afterwards. Here it becomes `bySelf`, a direction, and the name goes no further: the
// interface needs to know whether a photo was sent or received, never by whom.
//
// ─── WHAT THIS EXTRACTOR DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT DOES NOT OPEN A MEDIA FILE. No dimensions, no duration, no EXIF — those come from the
//     bytes, and the bytes stay on disk. The story GPS that `geo.ts` reads comes from the JSON's
//     `media_metadata`, not from the image;
//   - IT DOES NOT VERIFY THAT A PATH EXISTS. A media referenced by a message but absent from the
//     archive is listed like any other, and the interface will fail to load it. Checking 5 413
//     paths against the directory would cost a full listing to prevent a broken thumbnail;
//   - IT DOES NOT DATE WHAT THE EXPORT DOES NOT DATE. An undated media is DROPPED rather than
//     placed at zero — a spiral of time cannot show a point with no time, and 1970 is not a
//     neutral default, it is a wrong answer;
//   - IT KNOWS NOTHING OF WHAT IS IN THE IMAGE. No recognition of any kind, here or anywhere in
//     this product.

import type { MediaDraft } from './conversations';
import { toList } from './shapes';

export type UniverseKind = 'photo' | 'video' | 'audio';
export type UniverseSource = 'dm' | 'story' | 'post';

export interface UniverseItem {
  /** Path inside the export, relative to its root. */
  readonly path: string;
  readonly ts: number;
  readonly kind: UniverseKind;
  readonly source: UniverseSource;
  /** The thread it came from — DMs only, and what the account-exclusion panel filters on. */
  readonly convId?: string;
  readonly convTitle?: string;
  /**
   * `true` when the account holder sent it. A story or a post is theirs by nature; only messages
   * split into sent and received.
   */
  readonly bySelf?: boolean;
}

export interface UniverseReport {
  /** Every DATED media, ascending. */
  readonly items: readonly UniverseItem[];
  readonly counts: {
    readonly total: number;
    readonly byKind: Record<UniverseKind, number>;
    readonly bySource: Record<UniverseSource, number>;
  };
  readonly timeRange: { readonly from: number; readonly to: number } | null;
  /** DM threads holding at least one media — the exclusion panel's list. */
  readonly conversations: ReadonlyArray<{
    readonly id: string;
    readonly title: string;
    readonly items: number;
  }>;
}

type JsonSource = { readJson: <T>(p: string) => Promise<T> };

async function read(src: JsonSource, path: string, root?: string): Promise<unknown[]> {
  try {
    const d = await src.readJson<unknown>(path);
    if (root !== undefined && d && typeof d === 'object') {
      const wrapped = (d as Record<string, unknown>)[root];
      if (Array.isArray(wrapped)) return wrapped;
    }
    return toList(d);
  } catch {
    return [];
  }
}

/**
 * The kind, from the extension.
 *
 * ⚠ THE FALLBACK IS `photo`, and it is a real choice rather than a default. An unknown extension is
 * far more often an image format we have not listed than a video or a voice note — and the cost of
 * being wrong is asymmetric: a mis-typed photo renders as a broken thumbnail, a mis-typed video
 * asks the interface to decode something that is not one.
 */
function kindFromPath(path: string): UniverseKind {
  const ext = (path.split('.').pop() ?? '').toLowerCase();
  if (['mp4', 'mov', 'webm', 'mkv'].includes(ext)) return 'video';
  if (['aac', 'm4a', 'wav', 'mp3', 'opus', 'ogg'].includes(ext)) return 'audio';
  return 'photo';
}

export async function runUniverse(
  src: JsonSource,
  /** Collected during the conversations pass — never re-scanned. */
  dmDrafts: readonly MediaDraft[],
  /** The account holder, inferred by that pass. Settles sent versus received. */
  self: string,
): Promise<UniverseItem[] extends never ? never : UniverseReport> {
  const items: UniverseItem[] = dmDrafts.map(({ sender, ...it }) => ({
    ...it,
    bySelf: sender === self,
  }));

  // Published stories. A story is the holder's by nature — the question of direction does not
  // arise, so `bySelf` is not an inference here.
  for (const s of await read(src, 'your_instagram_activity/media/stories.json', 'ig_stories')) {
    const story = s as { uri?: string; creation_timestamp?: number };
    if (story.uri !== undefined && typeof story.creation_timestamp === 'number') {
      items.push({
        path: story.uri,
        ts: story.creation_timestamp,
        kind: kindFromPath(story.uri),
        source: 'story',
        bySelf: true,
      });
    }
  }

  // Posts — the legacy files, which are the ones carrying `uri` (the recent `posts.json` carries
  // the GPS instead; the same split `geo.ts` has to join across).
  const harvestPosts = (list: unknown[]) => {
    for (const it of list) {
      const o = it as {
        creation_timestamp?: number;
        media?: Array<{ uri?: string; creation_timestamp?: number }>;
      };
      for (const m of o.media ?? []) {
        const ts = m.creation_timestamp ?? o.creation_timestamp;
        if (m.uri !== undefined && typeof ts === 'number') {
          items.push({ path: m.uri, ts, kind: kindFromPath(m.uri), source: 'post', bySelf: true });
        }
      }
    }
  };
  harvestPosts(await read(src, 'your_instagram_activity/media/posts_1.json'));
  harvestPosts(
    await read(src, 'your_instagram_activity/media/archived_posts.json', 'ig_archived_post_media'),
  );

  items.sort((a, b) => a.ts - b.ts);

  const byKind: Record<UniverseKind, number> = { photo: 0, video: 0, audio: 0 };
  const bySource: Record<UniverseSource, number> = { dm: 0, story: 0, post: 0 };
  const convMap = new Map<string, { id: string; title: string; items: number }>();
  for (const it of items) {
    byKind[it.kind]++;
    bySource[it.source]++;
    if (it.convId === undefined) continue;
    const c = convMap.get(it.convId) ?? {
      id: it.convId,
      // Falls back to the thread's directory name, which is the only other handle on it.
      title: it.convTitle ?? it.convId,
      items: 0,
    };
    c.items++;
    if (it.convTitle !== undefined && it.convTitle !== '') c.title = it.convTitle;
    convMap.set(it.convId, c);
  }

  const first = items[0];
  const last = items[items.length - 1];
  return {
    items,
    counts: { total: items.length, byKind, bySource },
    // Already sorted, so the bounds are the ends — no second pass and no `Math.min(...)` spread,
    // which blows the stack well below 5 413 arguments on some engines.
    timeRange: first !== undefined && last !== undefined ? { from: first.ts, to: last.ts } : null,
    conversations: [...convMap.values()].sort((a, b) => b.items - a.items),
  };
}
