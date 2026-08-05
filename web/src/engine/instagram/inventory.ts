// INVENTORY — « what your export actually contains », in aggregates and nothing else.
//
// Counts, date ranges, presence of a section. NO content, NO third-party name, NO PII: this report
// crosses the Worker→UI boundary and is structured-clone-safe by construction (primitives, arrays,
// flat objects). It is the module that answers « is this file worth the three days it took to
// arrive » before anything is deduced from it.
//
// ⚠ THE MESSAGE PASS IS THE REAL INGESTION TEST. The reference export holds 349 threads and ~86 000
// messages across paged files, so the discipline is: parse ONE thread file, count it, let it go.
// Two large threads are never held at once, and nothing accumulates but integers and a set of
// participant names. Loading the inbox to count it would defeat the random-access reader that
// exists so a 2 GB archive can be opened at all.
//
// ─── WHAT THIS EXTRACTOR DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT COUNTS `inbox` FOR THE DATE RANGE, NOT the message requests. A request from a stranger in
//     2016 would stretch « your conversations run from… » over a period that was never a
//     conversation. Requests are reported separately, with their own two numbers;
//   - IT DOES NOT IDENTIFY ANYONE. `distinctParticipants` is the SIZE of a set of display names;
//     the names themselves never leave this function;
//   - IT DOES NOT SAY WHAT A SECTION CONTAINS, only whether the directory is there. An empty
//     section and a rich one both read `present: true`;
//   - THE ACTIVITY COUNTS ARE PER FILE, and the export pages some of them (`post_comments_1.json`).
//     A second page would be uncounted — an under-count that no test here can see, because no
//     fixture has one.

import type { DirEntry } from '../source';
import { isLabel, type LabelCoverage, type LabelKey } from './labels';
import { fixMojibake } from './mojibake';
import { labelValues, stringMap, toList } from './shapes';

/** The nine top-level directories of an export (`docs/instagram-export-schema.md` §0). */
const TOP_SECTIONS = [
  'connections',
  'personal_information',
  'your_instagram_activity',
  'security_and_login_information',
  'ads_information',
  'logged_information',
  'media',
  'preferences',
  'apps_and_websites_off_of_instagram',
] as const;

export interface DateRange {
  /** ISO day (YYYY-MM-DD), or null when nothing is dated. */
  readonly from: string | null;
  readonly to: string | null;
}

export interface MessagesInventory {
  readonly conversations: number;
  readonly totalMessages: number;
  readonly oneToOne: number;
  readonly groups: number;
  readonly distinctParticipants: number;
  readonly range: DateRange;
  readonly contentTypes: {
    readonly shares: number;
    readonly reactionMessages: number;
    readonly audio: number;
    readonly photos: number;
    readonly videos: number;
    readonly calls: number;
  };
  readonly messageRequests: { readonly threads: number; readonly messages: number };
  readonly distribution: {
    readonly over1000: number;
    readonly over100: number;
    readonly under10: number;
  };
}

export interface ConnectionsInventory {
  readonly following: number;
  readonly followers: number;
  readonly pendingSent: number;
  readonly blocked: number;
  readonly closeFriends: number;
}

export interface ActivityInventory {
  readonly likedPosts: number;
  readonly likedComments: number;
  readonly storyLikes: number;
  readonly polls: number;
  readonly comments: number;
  readonly storiesViewed: number;
  readonly savedPosts: number;
}

export interface MediaInventory {
  readonly posts: number;
  readonly postsWithGps: number;
  readonly stories: number;
  readonly archivedPosts: number;
}

export interface LocationInventory {
  /** The city Meta INFERS from the activity — never given, and the report says so. */
  readonly inferredCity: string;
  readonly adCategories: number;
  readonly gpsPosts: number;
  readonly autofillAddresses: number;
  readonly hasLastKnown: boolean;
  readonly distinctLoginIps: number;
}

export interface IdentityInventory {
  readonly profileActivityEvents: number;
  readonly distinctDeviceIds: number;
  readonly profileChanges: number;
  /** Account creation, epoch seconds — the pivot every « for how long » computation hangs on. */
  readonly signupTs: number | null;
}

export interface SectionPresence {
  readonly name: string;
  readonly present: boolean;
}

export interface InventoryReport {
  readonly rootName: string;
  readonly sections: readonly SectionPresence[];
  readonly messages: MessagesInventory;
  readonly connections: ConnectionsInventory;
  readonly activity: ActivityInventory;
  readonly media: MediaInventory;
  readonly location: LocationInventory;
  readonly identity: IdentityInventory;
}

/** What the inventory needs of a source: reading, listing, and the root's display name. */
export interface InventorySource {
  rootName(): string;
  readJson<T>(path: string): Promise<T>;
  listDir(path: string): Promise<DirEntry[]>;
  exists(path: string): Promise<boolean>;
}

export type ProgressFn = (p: { phase: string; done: number; total: number }) => void;

function isoDay(sec: number): string {
  return new Date(sec * 1000).toISOString().slice(0, 10);
}

async function countList(src: InventorySource, path: string): Promise<number> {
  try {
    return toList(await src.readJson(path)).length;
  } catch {
    return 0;
  }
}

async function readList(src: InventorySource, path: string, root?: string): Promise<unknown[]> {
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

interface MessageRaw {
  timestamp_ms?: number;
  share?: unknown;
  reactions?: unknown;
  audio_files?: unknown;
  photos?: unknown;
  videos?: unknown;
  call_duration?: unknown;
}
interface ThreadRaw {
  participants?: Array<{ name?: string }>;
  messages?: MessageRaw[];
}

interface ThreadWalk {
  conversations: number;
  totalMessages: number;
  oneToOne: number;
  groups: number;
  participants: Set<string>;
  minTs: number | null;
  maxTs: number | null;
  shares: number;
  reactionMessages: number;
  audio: number;
  photos: number;
  videos: number;
  calls: number;
  perConvCounts: number[];
}

function emptyWalk(): ThreadWalk {
  return {
    conversations: 0,
    totalMessages: 0,
    oneToOne: 0,
    groups: 0,
    participants: new Set(),
    minTs: null,
    maxTs: null,
    shares: 0,
    reactionMessages: 0,
    audio: 0,
    photos: 0,
    videos: 0,
    calls: 0,
    perConvCounts: [],
  };
}

async function walkThreads(
  src: InventorySource,
  dir: string,
  onProgress: ProgressFn,
  phase: string,
): Promise<ThreadWalk> {
  const acc = emptyWalk();

  let convDirs: string[];
  try {
    convDirs = (await src.listDir(dir)).filter((e) => e.kind === 'directory').map((e) => e.name);
  } catch {
    return acc;
  }

  let i = 0;
  for (const conv of convDirs) {
    i++;
    if (i % 10 === 0 || i === convDirs.length) {
      onProgress({ phase, done: i, total: convDirs.length });
    }
    let files: string[];
    try {
      files = (await src.listDir(`${dir}/${conv}`))
        .filter((e) => e.kind === 'file' && /^message_\d+\.json$/.test(e.name))
        .map((e) => e.name);
    } catch {
      continue;
    }
    if (files.length === 0) continue;

    let convMessageCount = 0;
    let participantsLen = 0;
    for (const f of files) {
      let thread: ThreadRaw;
      try {
        thread = await src.readJson<ThreadRaw>(`${dir}/${conv}/${f}`);
      } catch {
        continue;
      }
      participantsLen = thread.participants?.length ?? participantsLen;
      for (const p of thread.participants ?? []) {
        // Only the SIZE of this set ever leaves the function. The names are the join key of a
        // count, never an output.
        if (p.name !== undefined && p.name !== '') acc.participants.add(p.name);
      }
      for (const m of thread.messages ?? []) {
        convMessageCount++;
        const t = m.timestamp_ms;
        if (typeof t === 'number') {
          const sec = Math.floor(t / 1000);
          acc.minTs = acc.minTs === null ? sec : Math.min(acc.minTs, sec);
          acc.maxTs = acc.maxTs === null ? sec : Math.max(acc.maxTs, sec);
        }
        // `in` rather than a truthiness test. A media message carries `photos` and NO `content`
        // key at all (`docs/instagram-export-schema.md` §0.1), so keying on `content` drops it.
        //
        // ⚠ THE TWO FORMS ONLY DIVERGE ON `null` — an empty array is truthy — and no observed
        // export emits `photos: null`. So this is a belt-and-braces, measured as such by a mutation
        // that left the suite green, and it is written down rather than left to read as a
        // load-bearing choice someone must not touch.
        if ('share' in m) acc.shares++;
        if ('reactions' in m) acc.reactionMessages++;
        if ('audio_files' in m) acc.audio++;
        if ('photos' in m) acc.photos++;
        if ('videos' in m) acc.videos++;
        if ('call_duration' in m) acc.calls++;
      }
      // `thread` goes out of scope on the next iteration — nothing retains it. This is the whole
      // memory discipline of the pass.
    }
    acc.conversations++;
    acc.totalMessages += convMessageCount;
    acc.perConvCounts.push(convMessageCount);
    // A thread's `participants` includes the account holder, so a one-to-one has 2 entries.
    if (participantsLen > 2) acc.groups++;
    else acc.oneToOne++;
  }
  return acc;
}

async function extractMessages(
  src: InventorySource,
  onProgress: ProgressFn,
): Promise<MessagesInventory> {
  const base = 'your_instagram_activity/messages';
  const inbox = await walkThreads(src, `${base}/inbox`, onProgress, 'conversations');
  const reqs = await walkThreads(src, `${base}/message_requests`, onProgress, 'message-requests');

  return {
    conversations: inbox.conversations,
    totalMessages: inbox.totalMessages,
    oneToOne: inbox.oneToOne,
    groups: inbox.groups,
    distinctParticipants: inbox.participants.size,
    // ⚠ THE RANGE IS THE INBOX'S ONLY. A message request from a stranger in 2016 would stretch
    // « your conversations run from… » across years that were never a conversation.
    range: {
      from: inbox.minTs !== null ? isoDay(inbox.minTs) : null,
      to: inbox.maxTs !== null ? isoDay(inbox.maxTs) : null,
    },
    contentTypes: {
      shares: inbox.shares,
      reactionMessages: inbox.reactionMessages,
      audio: inbox.audio,
      photos: inbox.photos,
      videos: inbox.videos,
      calls: inbox.calls,
    },
    messageRequests: { threads: reqs.conversations, messages: reqs.totalMessages },
    distribution: {
      over1000: inbox.perConvCounts.filter((n) => n > 1000).length,
      over100: inbox.perConvCounts.filter((n) => n > 100).length,
      under10: inbox.perConvCounts.filter((n) => n < 10).length,
    },
  };
}

async function extractConnections(src: InventorySource): Promise<ConnectionsInventory> {
  const c = 'connections/followers_and_following';
  return {
    following: await countList(src, `${c}/following.json`),
    followers: await countList(src, `${c}/followers_1.json`),
    pendingSent: await countList(src, `${c}/pending_follow_requests.json`),
    blocked: await countList(src, `${c}/blocked_profiles.json`),
    closeFriends: await countList(src, `${c}/close_friends.json`),
  };
}

async function extractActivity(src: InventorySource): Promise<ActivityInventory> {
  const a = 'your_instagram_activity';
  return {
    likedPosts: await countList(src, `${a}/likes/liked_posts.json`),
    likedComments: await countList(src, `${a}/likes/liked_comments.json`),
    storyLikes: await countList(src, `${a}/story_interactions/story_likes.json`),
    polls: await countList(src, `${a}/story_interactions/polls.json`),
    comments: await countList(src, `${a}/comments/post_comments_1.json`),
    storiesViewed: await countList(src, `${a}/story_interactions/stories_viewed.json`),
    savedPosts: await countList(src, `${a}/saved/saved_posts.json`),
  };
}

async function extractMedia(
  src: InventorySource,
  coverage?: LabelCoverage,
): Promise<MediaInventory> {
  let posts = 0;
  let postsWithGps = 0;
  const list = await readList(src, 'your_instagram_activity/media/posts.json');
  posts = list.length;
  for (const item of list) {
    let lat: string | undefined;
    let lon: string | undefined;
    for (const lv of labelValues(item)) {
      if (isLabel(lv.label, 'latitude')) {
        coverage?.record('latitude');
        lat = lv.value;
      } else if (isLabel(lv.label, 'longitude')) {
        coverage?.record('longitude');
        lon = lv.value;
      }
    }
    // Same (0, 0) rejection as `geo.ts`, and for the same reason: Null Island is what an absent
    // fix serialises to. The two must agree, or the inventory's count and the map's pins diverge.
    if (
      lat !== undefined &&
      lon !== undefined &&
      (Math.abs(Number(lat)) > 1e-3 || Math.abs(Number(lon)) > 1e-3)
    ) {
      postsWithGps++;
    }
  }
  return {
    posts,
    postsWithGps,
    stories: await countList(src, 'your_instagram_activity/media/stories.json'),
    archivedPosts: await countList(src, 'your_instagram_activity/media/archived_posts.json'),
  };
}

async function hasValidLastKnown(src: InventorySource, coverage?: LabelCoverage): Promise<boolean> {
  for (const item of await readList(
    src,
    'security_and_login_information/login_and_profile_creation/last_known_location.json',
  )) {
    for (const [rawKey, v] of Object.entries(stringMap(item))) {
      // Either precision counts: the question is « is there a position at all », and Meta stores
      // whichever it has.
      for (const key of ['preciseLatitude', 'impreciseLatitude'] as const) {
        if (isLabel(rawKey, key) && Math.abs(Number(v.value)) > 1e-3) {
          coverage?.record(key);
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * ⚠ TAKES THE MEDIA REPORT RATHER THAN RE-READING IT. The prototype called `extractMedia` twice —
 * once for the media block, once from inside the location block — which parses `posts.json` twice.
 * That file is one of the largest in the export.
 */
async function extractLocation(
  src: InventorySource,
  media: MediaInventory,
  coverage?: LabelCoverage,
): Promise<LocationInventory> {
  const autofillAddresses = await countList(
    src,
    'personal_information/autofill_information/autofill_information.json',
  );
  const hasLastKnown = await hasValidLastKnown(src, coverage);

  const loginIps = new Set<string>();
  for (const item of await readList(
    src,
    'security_and_login_information/login_and_profile_creation/login_activity.json',
    'account_history_login_history',
  )) {
    for (const [rawKey, v] of Object.entries(stringMap(item))) {
      if (isLabel(rawKey, 'ipAddress') && v.value !== undefined) {
        coverage?.record('ipAddress');
        loginIps.add(v.value);
      }
    }
  }

  // The city Meta INFERS — nested under `dict`, which is the read that a flat walk misses.
  let inferredCity = '';
  const basedIn = await src
    .readJson<unknown>('personal_information/information_about_you/profile_based_in.json')
    .catch(() => undefined);
  for (const item of Array.isArray(basedIn) ? basedIn : [basedIn]) {
    for (const lv of labelValues(item)) {
      const sub = lv.dict;
      if (!Array.isArray(sub)) continue;
      const parts: string[] = [];
      for (const key of ['city', 'region', 'country'] as const satisfies readonly LabelKey[]) {
        const hit = (sub as Array<{ label?: string; value?: string }>).find((x) =>
          isLabel(x.label, key),
        );
        if (hit?.value !== undefined && hit.value !== '') {
          coverage?.record(key);
          parts.push(fixMojibake(hit.value));
        }
      }
      if (parts.length > 0) inferredCity = parts.join(', ');
    }
  }

  // Advertising categories used to reach the account — a `vec` of names, counted, never listed.
  let adCategories = 0;
  const adCats = await src
    .readJson<unknown>(
      'ads_information/instagram_ads_and_businesses/other_categories_used_to_reach_you.json',
    )
    .catch(() => undefined);
  for (const item of Array.isArray(adCats) ? adCats : [adCats]) {
    for (const lv of labelValues(item)) {
      if (Array.isArray(lv.vec)) adCategories += lv.vec.length;
    }
  }

  return {
    inferredCity,
    adCategories,
    gpsPosts: media.postsWithGps,
    autofillAddresses,
    hasLastKnown,
    distinctLoginIps: loginIps.size,
  };
}

async function extractIdentity(
  src: InventorySource,
  coverage?: LabelCoverage,
): Promise<IdentityInventory> {
  const activity = await readList(
    src,
    'security_and_login_information/login_and_profile_creation/profile_activity.json',
  );
  const deviceIds = new Set<string>();
  for (const item of activity) {
    for (const lv of labelValues(item)) {
      if (isLabel(lv.label, 'deviceId') && lv.value !== undefined) {
        coverage?.record('deviceId');
        deviceIds.add(lv.value);
      }
    }
  }

  const profileChanges = await countList(
    src,
    'personal_information/personal_information/profile_changes.json',
  );

  let signupTs: number | null = null;
  for (const item of await readList(
    src,
    'security_and_login_information/login_and_profile_creation/signup_details.json',
    'account_history_registration_info',
  )) {
    for (const [rawKey, v] of Object.entries(stringMap(item))) {
      if (isLabel(rawKey, 'time') && typeof v.timestamp === 'number' && v.timestamp > 0) {
        coverage?.record('time');
        signupTs = v.timestamp;
      }
    }
  }

  return {
    profileActivityEvents: activity.length,
    distinctDeviceIds: deviceIds.size,
    profileChanges,
    signupTs,
  };
}

export async function runInventory(
  src: InventorySource,
  onProgress: ProgressFn = () => {},
  coverage?: LabelCoverage,
  /** Supplied when the conversations pass already walked the threads — avoids a second walk. */
  presetMessages?: MessagesInventory,
): Promise<InventoryReport> {
  const sections: SectionPresence[] = [];
  for (const name of TOP_SECTIONS) {
    sections.push({ name, present: await src.exists(name) });
  }

  const messages = presetMessages ?? (await extractMessages(src, onProgress));
  const connections = await extractConnections(src);
  const activity = await extractActivity(src);
  const media = await extractMedia(src, coverage);
  const location = await extractLocation(src, media, coverage);
  const identity = await extractIdentity(src, coverage);

  return {
    rootName: src.rootName(),
    sections,
    messages,
    connections,
    activity,
    media,
    location,
    identity,
  };
}
