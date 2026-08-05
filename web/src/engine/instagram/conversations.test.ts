// THE CONVERSATIONS EXTRACTOR — the private side, and the inference everything else rests on.
//
// Fixtures are hand-written thread shapes (`docs/instagram-export-schema.md` §0.1) with invented
// display names. No fragment of a real export, and no thread directory named after anyone.
//
// ⚠ THE TIMEZONE IS PINNED, and it has to be. The heatmap and the monthly buckets use LOCAL time by
// design — « your day » is the reader's day, not UTC's — which makes the report machine-dependent.
// Without `TZ` fixed here, this file would pass in Paris and fail in Tokyo.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - THE NO-CONTENT INVARIANT, as a property. It is asserted below on the one shape that could
//     leak (a message body reaching the report), but nothing here proves that NO field of NO
//     message can ever reach the output — that rests on the accumulator's shape, which is visible
//     in the code and unasserted;
//   - SCALE AND MEMORY. Three threads, not 349; nothing measures that one thread file is held at a
//     time;
//   - THE MEDIA SINK'S CONSUMER. It is exercised as a callback; the universe module that will read
//     it does not exist yet.

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  type ConversationsReport,
  type MediaDraft,
  messagesInventoryFromConversations,
  runConversations,
  type ThreadSource,
} from './conversations';

const ORIGINAL_TZ = process.env.TZ;
beforeAll(() => {
  process.env.TZ = 'UTC';
});
afterAll(() => {
  process.env.TZ = ORIGINAL_TZ;
});

function fakeSource(files: Record<string, unknown>, dirs: Record<string, string[]>): ThreadSource {
  return {
    readJson: <T>(p: string): Promise<T> =>
      p in files ? Promise.resolve(files[p] as T) : Promise.reject(new Error('absent')),
    listDir: (p) =>
      Promise.resolve(
        (dirs[p] ?? []).map((name) => ({
          name,
          kind: name.endsWith('.json') ? ('file' as const) : ('directory' as const),
        })),
      ),
  };
}

const INBOX = 'your_instagram_activity/messages/inbox';
const HOLDER = 'Holder Name';
const T0 = Date.UTC(2024, 0, 15, 12, 0, 0) / 1000; // a Monday, noon UTC

/** Builds an inbox from `{ dir: messages }`, with the holder in every thread. */
function inbox(threads: Record<string, { participants: string[]; messages: unknown[] }>) {
  const files: Record<string, unknown> = {};
  const dirs: Record<string, string[]> = { [INBOX]: Object.keys(threads) };
  for (const [dir, t] of Object.entries(threads)) {
    files[`${INBOX}/${dir}/message_1.json`] = {
      participants: t.participants.map((name) => ({ name })),
      title: t.participants.find((p) => p !== HOLDER) ?? '',
      messages: t.messages,
    };
    dirs[`${INBOX}/${dir}`] = ['message_1.json'];
  }
  return fakeSource(files, dirs);
}

describe('⚠ « you » is inferred, and everything sent-by-you rests on it', () => {
  it('takes the sender present in the MOST threads', async () => {
    const r = await runConversations(
      inbox({
        t1: {
          participants: [HOLDER, 'Contact A'],
          messages: [
            { sender_name: HOLDER, timestamp_ms: T0 * 1000 },
            { sender_name: 'Contact A', timestamp_ms: (T0 + 60) * 1000 },
          ],
        },
        t2: {
          participants: [HOLDER, 'Contact B'],
          messages: [{ sender_name: HOLDER, timestamp_ms: T0 * 1000 }],
        },
        // Contact A sends more messages overall than the holder in this thread, but appears in
        // fewer THREADS — which is the whole point of the criterion.
        t3: {
          participants: [HOLDER, 'Contact A'],
          messages: [
            { sender_name: 'Contact A', timestamp_ms: T0 * 1000 },
            { sender_name: 'Contact A', timestamp_ms: (T0 + 1) * 1000 },
            { sender_name: 'Contact A', timestamp_ms: (T0 + 2) * 1000 },
          ],
        },
      }),
    );
    expect(r.self).toBe(HOLDER);
    expect(r.totals.sentBySelf).toBe(2);
  });
});

describe('per-conversation figures', () => {
  const source = () =>
    inbox({
      main: {
        participants: [HOLDER, 'Contact A'],
        messages: [
          { sender_name: HOLDER, timestamp_ms: T0 * 1000 },
          // A reply 10 minutes later.
          { sender_name: 'Contact A', timestamp_ms: (T0 + 600) * 1000 },
          // The holder answers 4 minutes after that.
          { sender_name: HOLDER, timestamp_ms: (T0 + 840) * 1000 },
          // Two messages in a row from the same person: ONE turn, not a reply.
          { sender_name: HOLDER, timestamp_ms: (T0 + 900) * 1000 },
          // Media: no `content` key at all, which is how the export writes them.
          {
            sender_name: HOLDER,
            timestamp_ms: (T0 + 1000) * 1000,
            photos: [{ uri: 'media/p1.jpg' }],
          },
          {
            sender_name: 'Contact A',
            timestamp_ms: (T0 + 1100) * 1000,
            audio_files: [{ uri: 'media/a1.aac' }],
            reactions: [{ reaction: '❤', actor: HOLDER }],
          },
        ],
      },
      group: {
        participants: [HOLDER, 'Contact A', 'Contact B'],
        messages: [{ sender_name: 'Contact B', timestamp_ms: T0 * 1000 }],
      },
    });

  it('splits sent from received, and types by who sent them', async () => {
    const r = await runConversations(source());
    const main = r.conversations.find((c) => c.id === 'main');
    expect(main?.messages).toBe(6);
    expect(main?.sentBySelf).toBe(4);
    expect(main?.received).toBe(2);
    // « Who sends what » — the photo is the holder's, the voice note is not.
    expect(main?.typesSelf.photos).toBe(1);
    expect(main?.typesOthers.photos).toBe(0);
    expect(main?.typesSelf.audio).toBe(0);
    expect(main?.typesOthers.audio).toBe(1);
  });

  it('⚠ a reply is a CHANGE OF SENDER, never two messages in a row', async () => {
    const r = await runConversations(source());
    const main = r.conversations.find((c) => c.id === 'main');
    // Six messages, but only THREE are replies — a reply is a change of sender:
    //   holder → A at +600 s  ⇒ 10 min  (A replying)
    //   A → holder at +840 s  ⇒  4 min  (the holder replying)
    //   holder → A at +1100 s ⇒  1.67 min (A replying to the media message)
    // The holder's three consecutive messages in between are ONE turn; counting the gaps inside
    // them would measure typing speed, not a relationship. So A has two reply gaps and their
    // median is the mean of the two — which is what caught my own fixture: I had written this
    // expectation as if A replied once.
    expect(main?.medianReplyOtherMin).toBeCloseTo((10 + 100 / 60) / 2, 5);
    expect(main?.medianReplySelfMin).toBe(4);
  });

  it('⚠ a GROUP gets no reply median — « who answered whom » is not in the data', async () => {
    const r = await runConversations(source());
    const group = r.conversations.find((c) => c.id === 'group');
    expect(group?.isGroup).toBe(true);
    // Both null, and both for the same reason. A sender-to-sender transition in a group measures
    // the room, not a relationship.
    expect(group?.medianReplySelfMin).toBeNull();
    expect(group?.medianReplyOtherMin).toBeNull();
    expect(group?.memberNames).toEqual(['Contact A', 'Contact B']);
  });

  it('counts reactions by WHO, never WHAT', async () => {
    const r = await runConversations(source());
    const main = r.conversations.find((c) => c.id === 'main');
    expect(main?.reactionsGiven).toBe(1);
    expect(r.totals.messagesWithReactions).toBe(1);
    // The emoji is content. If it ever reached the report, this would find it.
    expect(JSON.stringify(r)).not.toContain('❤');
  });
});

describe('⚠ no message content reaches the report', () => {
  it('a message body appears nowhere in the output', async () => {
    const SECRET = 'zzz-contenu-qui-ne-doit-pas-sortir';
    const r = await runConversations(
      inbox({
        t1: {
          participants: [HOLDER, 'Contact A'],
          messages: [{ sender_name: HOLDER, timestamp_ms: T0 * 1000, content: SECRET }],
        },
      }),
    );
    // The bearing assertion of the module's invariant. It is a serialisation sweep rather than a
    // field check, because the invariant is « nowhere », not « not in this field ».
    expect(JSON.stringify(r)).not.toContain(SECRET);
    // Anchoring: the message WAS read — otherwise the absence above has a second cause.
    expect(r.totals.messages).toBe(1);
  });
});

describe('calls, and the durations that are data errors', () => {
  it('counts an absurd call and leaves its duration out of the total', async () => {
    const r = await runConversations(
      inbox({
        t1: {
          participants: [HOLDER, 'Contact A'],
          messages: [
            { sender_name: HOLDER, timestamp_ms: T0 * 1000, call_duration: 600 },
            // ~53 days. The reference export carries values like this.
            { sender_name: HOLDER, timestamp_ms: (T0 + 10) * 1000, call_duration: 4_600_000 },
          ],
        },
      }),
    );
    // Both directions: the event is counted AND its duration is excluded. One bad row would
    // otherwise dominate every « hours spent talking » figure on the page.
    expect(r.totals.types.calls).toBe(2);
    expect(r.totals.types.callSeconds).toBe(600);
  });
});

describe('the heatmap', () => {
  it('places a Monday-noon message at row 0, and counts the night share', async () => {
    const MONDAY_NOON = Date.UTC(2024, 0, 15, 12, 0, 0);
    const MONDAY_3AM = Date.UTC(2024, 0, 15, 3, 0, 0);
    const r = await runConversations(
      inbox({
        t1: {
          participants: [HOLDER, 'Contact A'],
          messages: [
            { sender_name: HOLDER, timestamp_ms: MONDAY_NOON },
            { sender_name: HOLDER, timestamp_ms: MONDAY_3AM },
            // Someone else's message must NOT enter the holder's clock.
            { sender_name: 'Contact A', timestamp_ms: MONDAY_3AM },
          ],
        },
      }),
    );
    expect(r.heatmap[0]?.[12]).toBe(1);
    expect(r.heatmap[0]?.[3]).toBe(1);
    // One of the holder's two messages is before 06:00.
    expect(r.nightShare).toBe(0.5);
    expect(r.totals.sentBySelf).toBe(2);
  });
});

describe('the inventory derived from this one pass', () => {
  it('⚠ an absent bound is null, not an empty string', () => {
    const empty: ConversationsReport = {
      self: '',
      totals: {
        conversations: 0,
        messages: 0,
        oneToOne: 0,
        groups: 0,
        distinctParticipants: 0,
        sentBySelf: 0,
        firstTs: null,
        lastTs: null,
        types: { audio: 0, photos: 0, videos: 0, shares: 0, calls: 0, callSeconds: 0 },
        messagesWithReactions: 0,
        messageRequests: { threads: 0, messages: 0 },
      },
      heatmap: [],
      nightShare: 0,
      conversations: [],
    };
    // The prototype returned `''` where `DateRange` promises `string | null`, so « no dated
    // message » rendered as an empty date rather than as an absence — and no type caught it,
    // because `''` is a `string`.
    expect(messagesInventoryFromConversations(empty).range).toEqual({ from: null, to: null });
  });

  it('buckets the conversation sizes', async () => {
    const r = await runConversations(
      inbox({
        big: {
          participants: [HOLDER, 'Contact A'],
          messages: Array.from({ length: 150 }, (_, i) => ({
            sender_name: HOLDER,
            timestamp_ms: (T0 + i) * 1000,
          })),
        },
        tiny: {
          participants: [HOLDER, 'Contact B'],
          messages: [{ sender_name: HOLDER, timestamp_ms: T0 * 1000 }],
        },
      }),
    );
    const inv = messagesInventoryFromConversations(r);
    expect(inv.distribution).toEqual({ over1000: 0, over100: 1, under10: 1 });
    expect(inv.range.from).toBe('2024-01-15');
  });
});

describe('the media sink', () => {
  it('emits one draft per attachment, during the same walk', async () => {
    const drafts: MediaDraft[] = [];
    await runConversations(
      inbox({
        t1: {
          participants: [HOLDER, 'Contact A'],
          messages: [
            {
              sender_name: HOLDER,
              timestamp_ms: T0 * 1000,
              photos: [{ uri: 'media/p1.jpg' }, { uri: 'media/p2.jpg' }],
              videos: [{ uri: 'media/v1.mp4' }],
            },
          ],
        },
      }),
      undefined,
      (d) => drafts.push(d),
    );
    expect(drafts.map((d) => d.kind)).toEqual(['photo', 'photo', 'video']);
    expect(drafts[0]).toMatchObject({ path: 'media/p1.jpg', source: 'dm', convId: 't1' });
  });
});
