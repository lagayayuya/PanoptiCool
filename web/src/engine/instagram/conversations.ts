// CONVERSATIONS — the PRIVATE side, in volumes, dates and types.
//
// ⚠ INVARIANT: NO MESSAGE CONTENT IS RETAINED OR EXPOSED. Not by discipline — by construction: the
// accumulator below holds counters, `(timestamp, sender)` pairs and type tallies, and a message
// object goes out of scope on the next iteration. Reading the text is a SEPARATE, opt-in gesture
// (the local-AI path, one conversation at a time), and it does not pass through here.
//
// ONE PASS OVER THE THREADS, for the whole product. The reference export is 349 threads and ~86 000
// messages; walking them twice to fill two reports would double the slowest phase of the analysis.
// So the inventory's `messages` block is DERIVED from this report
// (`messagesInventoryFromConversations`), and the media universe is fed through an optional sink
// during the same walk.
//
// ⚠ « YOU » IS DETECTED, NOT DECLARED. The export never marks which participant is the account
// holder — it gives display names. The holder is taken to be the sender present in the MOST
// THREADS, which is right for any real account and wrong for a fabricated one-thread export. Every
// « sent by you » figure rests on that inference, and the report carries `self` so the interface can
// show what was inferred rather than assert it.
//
// ─── WHAT THIS EXTRACTOR DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT DOES NOT JOIN TO THE USERNAME SPACE. Display names are not handles; `relations.ts` works in
//     the other space and the two do not merge (see its header);
//   - REPLY MEDIANS ARE ONE-TO-ONE ONLY. In a group, « who answered whom » is not in the data, and a
//     sender-to-sender transition would measure the room, not a relationship;
//   - IT DOES NOT READ REACTION EMOJI, only who reacted and how many times. What the reaction WAS
//     is content;
//   - ⚠ THE HEATMAP AND THE MONTHLY BUCKETS USE LOCAL TIME, deliberately — « your day » is the
//     reader's day, not UTC's. The cost is that the report is MACHINE-DEPENDENT: the same export
//     read in two timezones gives two heatmaps. Any golden over this must pin `TZ`, and the
//     synthetic demo must too.

import type { DirEntry } from '../source';
import type { MessagesInventory } from './inventory';
import { fixMojibake } from './mojibake';

export interface MonthCount {
  /** « 2019-04 », in LOCAL time — see the header. */
  readonly ym: string;
  readonly count: number;
}

export interface ConversationTypes {
  readonly audio: number;
  readonly photos: number;
  readonly videos: number;
  readonly shares: number;
  readonly calls: number;
  readonly callSeconds: number;
}

type SenderTypes = Pick<ConversationTypes, 'audio' | 'photos' | 'videos' | 'shares'>;

/** The same shapes, mutable — accumulators, never outputs. */
type MutableTypes = { -readonly [K in keyof ConversationTypes]: number };
type MutableSenderTypes = { -readonly [K in keyof SenderTypes]: number };

export interface ConversationSummary {
  /** The thread's directory name. ⚠ Built from the contact's handle — a VALUE, never logged. */
  readonly id: string;
  readonly title: string;
  readonly isGroup: boolean;
  readonly participants: number;
  /** Members other than the holder. Empty for a one-to-one, where the title already names them. */
  readonly memberNames: readonly string[];
  readonly messages: number;
  readonly sentBySelf: number;
  readonly received: number;
  readonly firstTs: number | null;
  readonly lastTs: number | null;
  readonly monthly: readonly MonthCount[];
  readonly types: ConversationTypes;
  /** The same types, split by who sent them — the answer to « who sends what ». */
  readonly typesSelf: SenderTypes;
  readonly typesOthers: SenderTypes;
  readonly reactionsGiven: number;
  readonly reactionsReceived: number;
  /** Median reply delay in minutes, one-to-one only, gaps ≤ 24 h. `null` when unmeasurable. */
  readonly medianReplySelfMin: number | null;
  readonly medianReplyOtherMin: number | null;
}

export interface ConversationsReport {
  /** The display name inferred to be the account holder — see the header. */
  readonly self: string;
  readonly totals: {
    readonly conversations: number;
    readonly messages: number;
    readonly oneToOne: number;
    readonly groups: number;
    readonly distinctParticipants: number;
    readonly sentBySelf: number;
    readonly firstTs: number | null;
    readonly lastTs: number | null;
    readonly types: ConversationTypes;
    readonly messagesWithReactions: number;
    readonly messageRequests: { readonly threads: number; readonly messages: number };
  };
  /** 7×24 day-by-hour heatmap of messages SENT by the holder. Monday is row 0. */
  readonly heatmap: readonly (readonly number[])[];
  /** Share of the holder's messages sent between 00:00 and 06:00 (0–1). */
  readonly nightShare: number;
  /** Descending by message count. */
  readonly conversations: readonly ConversationSummary[];
}

/** One media reference, handed to the universe module during the same walk. */
export interface MediaDraft {
  readonly path: string;
  readonly ts: number;
  readonly kind: 'photo' | 'video' | 'audio';
  readonly source: 'dm';
  readonly convId: string;
  readonly convTitle: string;
  readonly sender: string;
}

export type MediaSink = (item: MediaDraft) => void;
export type ConversationsProgress = (p: { phase: string; done: number; total: number }) => void;

export interface ThreadSource {
  readJson<T>(path: string): Promise<T>;
  listDir(path: string): Promise<DirEntry[]>;
}

interface RawMessage {
  sender_name?: string;
  timestamp_ms?: number;
  photos?: Array<{ uri?: string }>;
  videos?: Array<{ uri?: string }>;
  audio_files?: Array<{ uri?: string }>;
  share?: unknown;
  call_duration?: number;
  reactions?: Array<{ reaction?: string; actor?: string }>;
}

interface RawThread {
  participants?: Array<{ name?: string }>;
  title?: string;
  messages?: RawMessage[];
}

interface ConvAcc {
  id: string;
  title: string;
  participants: string[];
  senderCounts: Map<string, number>;
  /** `(seconds, sender)` — the strict minimum the holder-dependent metrics need. */
  events: Array<{ ts: number; sender: string }>;
  monthly: Map<string, number>;
  types: MutableTypes;
  typesBySender: Map<string, MutableSenderTypes>;
  reactionsByActor: Map<string, number>;
  reactionsOnMsgsOf: Map<string, number>;
  messagesWithReactions: number;
  messages: number;
}

/**
 * ⚠ CALLS LONGER THAN THIS ARE DATA ERRORS, NOT CALLS. The reference export carries « calls » of up
 * to ~53 days. The event is counted — it happened — but its duration is left out of the total,
 * because one bad row would otherwise dominate every « hours spent talking » figure on the page.
 */
const MAX_CALL_SECONDS = 6 * 3600;

/** Local-time year-month — see the header on why local, and what it costs. */
function ymOf(tsSec: number): string {
  const d = new Date(tsSec * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? (s[mid] ?? null) : ((s[mid - 1] ?? 0) + (s[mid] ?? 0)) / 2;
}

async function threadDirs(src: ThreadSource, base: string): Promise<string[]> {
  try {
    return (await src.listDir(base)).filter((e) => e.kind === 'directory').map((e) => e.name);
  } catch {
    return [];
  }
}

function emptySenderTypes(): MutableSenderTypes {
  return { audio: 0, photos: 0, videos: 0, shares: 0 };
}

async function accumulateThread(
  src: ThreadSource,
  base: string,
  dir: string,
  mediaSink?: MediaSink,
): Promise<ConvAcc | null> {
  let files: string[];
  try {
    files = (await src.listDir(`${base}/${dir}`))
      .filter((e) => e.kind === 'file' && /^message_\d+\.json$/.test(e.name))
      .map((e) => e.name)
      .sort();
  } catch {
    return null;
  }
  if (files.length === 0) return null;

  const acc: ConvAcc = {
    id: dir,
    title: '',
    participants: [],
    senderCounts: new Map(),
    events: [],
    monthly: new Map(),
    types: { audio: 0, photos: 0, videos: 0, shares: 0, calls: 0, callSeconds: 0 },
    typesBySender: new Map(),
    reactionsByActor: new Map(),
    reactionsOnMsgsOf: new Map(),
    messagesWithReactions: 0,
    messages: 0,
  };

  for (const f of files) {
    let thread: RawThread;
    try {
      thread = await src.readJson<RawThread>(`${base}/${dir}/${f}`);
    } catch {
      continue;
    }
    if (thread.title !== undefined && thread.title !== '') acc.title = fixMojibake(thread.title);
    if (thread.participants !== undefined) {
      acc.participants = thread.participants.map((p) => fixMojibake(p.name ?? ''));
    }

    for (const m of thread.messages ?? []) {
      acc.messages++;
      const sender = fixMojibake(m.sender_name ?? '');
      if (sender !== '') acc.senderCounts.set(sender, (acc.senderCounts.get(sender) ?? 0) + 1);

      // ⚠ FLOOR, NOT ROUND — the prototype rounded here and floored in the inventory, so the same
      // message could land in two different seconds depending on which report asked. At a month
      // boundary that is two different months on the heatmap.
      const ts = typeof m.timestamp_ms === 'number' ? Math.floor(m.timestamp_ms / 1000) : null;
      if (ts !== null) {
        if (sender !== '') acc.events.push({ ts, sender });
        const ym = ymOf(ts);
        acc.monthly.set(ym, (acc.monthly.get(ym) ?? 0) + 1);
      }

      let st: MutableSenderTypes | undefined;
      if (sender !== '') {
        st = acc.typesBySender.get(sender);
        if (st === undefined) {
          st = emptySenderTypes();
          acc.typesBySender.set(sender, st);
        }
      }

      if (m.audio_files !== undefined) {
        acc.types.audio++;
        if (st) st.audio++;
      }
      if (m.photos !== undefined) {
        acc.types.photos++;
        if (st) st.photos++;
      }
      if (m.videos !== undefined) {
        acc.types.videos++;
        if (st) st.videos++;
      }
      if (m.share !== undefined) {
        acc.types.shares++;
        if (st) st.shares++;
      }

      // The media sink runs INSIDE this walk so the universe module costs no second pass.
      if (mediaSink !== undefined && ts !== null) {
        for (const [kind, arr] of [
          ['photo', m.photos],
          ['video', m.videos],
          ['audio', m.audio_files],
        ] as const) {
          for (const ref of arr ?? []) {
            if (ref.uri !== undefined) {
              mediaSink({
                path: ref.uri,
                ts,
                kind,
                source: 'dm',
                convId: dir,
                convTitle: acc.title,
                sender,
              });
            }
          }
        }
      }

      if (typeof m.call_duration === 'number') {
        acc.types.calls++;
        if (m.call_duration > 0 && m.call_duration <= MAX_CALL_SECONDS) {
          acc.types.callSeconds += m.call_duration;
        }
      }

      if (m.reactions !== undefined && m.reactions.length > 0) {
        acc.messagesWithReactions++;
        for (const r of m.reactions) {
          // Only WHO reacted and HOW MANY times. `r.reaction` — the emoji — is content, and is
          // never read.
          const actor = fixMojibake(r.actor ?? '');
          if (actor !== '') {
            acc.reactionsByActor.set(actor, (acc.reactionsByActor.get(actor) ?? 0) + 1);
          }
        }
        if (sender !== '') {
          acc.reactionsOnMsgsOf.set(
            sender,
            (acc.reactionsOnMsgsOf.get(sender) ?? 0) + m.reactions.length,
          );
        }
      }
    }
    // `thread` goes out of scope here — nothing retains a message.
  }
  return acc;
}

export async function runConversations(
  src: ThreadSource,
  onProgress?: ConversationsProgress,
  mediaSink?: MediaSink,
): Promise<ConversationsReport> {
  const INBOX = 'your_instagram_activity/messages/inbox';
  const REQUESTS = 'your_instagram_activity/messages/message_requests';

  const dirs = await threadDirs(src, INBOX);
  const accs: ConvAcc[] = [];
  let done = 0;
  for (const dir of dirs) {
    const acc = await accumulateThread(src, INBOX, dir, mediaSink);
    if (acc !== null) accs.push(acc);
    done++;
    if (done % 10 === 0 || done === dirs.length) {
      onProgress?.({ phase: 'conversations', done, total: dirs.length });
    }
  }

  // Message requests: volumes only, and no media. They are not conversations — a stranger's opening
  // line is not a relationship, and counting them in would stretch every average.
  let reqThreads = 0;
  let reqMessages = 0;
  for (const dir of await threadDirs(src, REQUESTS)) {
    const acc = await accumulateThread(src, REQUESTS, dir);
    if (acc !== null) {
      reqThreads++;
      reqMessages += acc.messages;
    }
  }

  // « You » = the sender present in the most threads. See the header: inferred, not declared.
  const senderThreads = new Map<string, number>();
  for (const acc of accs) {
    for (const sender of acc.senderCounts.keys()) {
      senderThreads.set(sender, (senderThreads.get(sender) ?? 0) + 1);
    }
  }
  let self = '';
  let best = 0;
  for (const [sender, n] of senderThreads) {
    if (n > best) {
      best = n;
      self = sender;
    }
  }

  const heatmap: number[][] = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
  let selfSent = 0;
  let selfNight = 0;
  for (const acc of accs) {
    for (const e of acc.events) {
      if (e.sender !== self) continue;
      selfSent++;
      const d = new Date(e.ts * 1000);
      // Monday = 0: a week that starts on Sunday reads wrong to most of the people this is for.
      const dow = (d.getDay() + 6) % 7;
      const hour = d.getHours();
      const row = heatmap[dow];
      if (row !== undefined) row[hour] = (row[hour] ?? 0) + 1;
      if (hour < 6) selfNight++;
    }
  }

  const participants = new Set<string>();
  const totalTypes: MutableTypes = {
    audio: 0,
    photos: 0,
    videos: 0,
    shares: 0,
    calls: 0,
    callSeconds: 0,
  };
  let totalMessages = 0;
  let totalWithReactions = 0;
  let globalFirst: number | null = null;
  let globalLast: number | null = null;

  const conversations: ConversationSummary[] = accs.map((acc) => {
    for (const p of acc.participants) participants.add(p);
    totalMessages += acc.messages;
    totalWithReactions += acc.messagesWithReactions;
    for (const k of ['audio', 'photos', 'videos', 'shares', 'calls', 'callSeconds'] as const) {
      totalTypes[k] += acc.types[k];
    }

    let firstTs: number | null = null;
    let lastTs: number | null = null;
    for (const e of acc.events) {
      firstTs = firstTs === null ? e.ts : Math.min(firstTs, e.ts);
      lastTs = lastTs === null ? e.ts : Math.max(lastTs, e.ts);
    }
    if (firstTs !== null)
      globalFirst = globalFirst === null ? firstTs : Math.min(globalFirst, firstTs);
    if (lastTs !== null) globalLast = globalLast === null ? lastTs : Math.max(globalLast, lastTs);

    // A thread's `participants` includes the holder, so a one-to-one has 2 entries.
    const isGroup = acc.participants.length > 2;
    let medianSelf: number | null = null;
    let medianOther: number | null = null;
    if (!isGroup && acc.events.length > 1) {
      const sorted = [...acc.events].sort((a, b) => a.ts - b.ts);
      const selfGaps: number[] = [];
      const otherGaps: number[] = [];
      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const cur = sorted[i];
        // Only a change of sender is a REPLY. Two consecutive messages from one person are one
        // turn, and counting the gap between them would measure typing speed.
        if (prev === undefined || cur === undefined || prev.sender === cur.sender) continue;
        const gapMin = (cur.ts - prev.ts) / 60;
        // Over 24 h it is a new conversation, not a slow answer.
        if (gapMin > 24 * 60) continue;
        if (cur.sender === self) selfGaps.push(gapMin);
        else otherGaps.push(gapMin);
      }
      medianSelf = median(selfGaps);
      medianOther = median(otherGaps);
    }

    const typesSelf = acc.typesBySender.get(self) ?? emptySenderTypes();
    const typesOthers = emptySenderTypes();
    for (const [sender, tv] of acc.typesBySender) {
      if (sender === self) continue;
      typesOthers.audio += tv.audio;
      typesOthers.photos += tv.photos;
      typesOthers.videos += tv.videos;
      typesOthers.shares += tv.shares;
    }

    const sent = acc.senderCounts.get(self) ?? 0;
    return {
      id: acc.id,
      title: acc.title || acc.participants.find((p) => p !== self) || acc.id,
      isGroup,
      participants: acc.participants.length,
      memberNames: isGroup ? acc.participants.filter((p) => p !== '' && p !== self) : [],
      messages: acc.messages,
      sentBySelf: sent,
      received: acc.messages - sent,
      firstTs,
      lastTs,
      monthly: [...acc.monthly.entries()]
        .map(([ym, count]) => ({ ym, count }))
        .sort((a, b) => a.ym.localeCompare(b.ym)),
      types: acc.types,
      typesSelf,
      typesOthers,
      reactionsGiven: acc.reactionsByActor.get(self) ?? 0,
      reactionsReceived: acc.reactionsOnMsgsOf.get(self) ?? 0,
      medianReplySelfMin: medianSelf,
      medianReplyOtherMin: medianOther,
    };
  });

  conversations.sort((a, b) => b.messages - a.messages);
  const groups = conversations.filter((c) => c.isGroup).length;

  return {
    self,
    totals: {
      conversations: conversations.length,
      messages: totalMessages,
      oneToOne: conversations.length - groups,
      groups,
      distinctParticipants: participants.size,
      sentBySelf: selfSent,
      firstTs: globalFirst,
      lastTs: globalLast,
      types: totalTypes,
      messagesWithReactions: totalWithReactions,
      messageRequests: { threads: reqThreads, messages: reqMessages },
    },
    heatmap,
    nightShare: selfSent > 0 ? selfNight / selfSent : 0,
    conversations,
  };
}

/**
 * The inventory's `messages` block, derived from this report — so the 349 threads are walked ONCE
 * (yuya's decision on the prototype).
 */
export function messagesInventoryFromConversations(rep: ConversationsReport): MessagesInventory {
  const t = rep.totals;
  // ⚠ `null`, NOT AN EMPTY STRING. The prototype returned `''` for an absent bound, where
  // `DateRange` promises `string | null` — so « no dated message » rendered as an empty date
  // instead of as an absence, and no type caught it because `''` is a `string`.
  const iso = (sec: number | null) =>
    sec === null ? null : new Date(sec * 1000).toISOString().slice(0, 10);
  let over1000 = 0;
  let over100 = 0;
  let under10 = 0;
  for (const c of rep.conversations) {
    if (c.messages > 1000) over1000++;
    if (c.messages > 100) over100++;
    if (c.messages < 10) under10++;
  }
  return {
    conversations: t.conversations,
    totalMessages: t.messages,
    oneToOne: t.oneToOne,
    groups: t.groups,
    distinctParticipants: t.distinctParticipants,
    range: { from: iso(t.firstTs), to: iso(t.lastTs) },
    contentTypes: {
      shares: t.types.shares,
      reactionMessages: t.messagesWithReactions,
      audio: t.types.audio,
      photos: t.types.photos,
      videos: t.types.videos,
      calls: t.types.calls,
    },
    messageRequests: t.messageRequests,
    distribution: { over1000, over100, under10 },
  };
}
