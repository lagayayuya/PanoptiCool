// UNIVERSE AND VALUE — the media inventory, and the module that is gated shut.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - ⚠ THE VALUE FIGURES THEMSELVES. The table is a research PROPOSAL
//     (`docs/data-value-reference-table.md`); whether $44.14 was Europe's 2019 ARPU is a question
//     for a human reading sources, and no test can answer it. What is asserted here is that the
//     module REFUSES to produce anything while the table is unratified, and that the arithmetic
//     over it is the arithmetic intended;
//   - THE 3D RENDER. `universe` emits paths and dates; what the spiral does with them is the
//     interface's business;
//   - MEDIA BYTES. Nothing here opens a file, which is the point of the module;
//   - ⚠ THE ARITHMETIC BEHIND THE GATE, and this is the largest gap in the file. `runValue` returns
//     `null`, so roughly two hundred lines of computation are UNREACHED by any assertion here. They
//     were exercised once, by hand, by flipping `VALUE_TABLE_RATIFIED` and reading the output — and
//     that probe found an inverted range (a HIGH of $0 under a LOW of $1 when no category is
//     present), which is recorded in `value.ts` where the clamp now lives. The day the table is
//     ratified, that probe has to become a test; until then, saying the code is unexercised is more
//     use than a green tick that covers a `return null`.

import { describe, expect, it } from 'vitest';
import type { MediaDraft } from './conversations';
import { runUniverse } from './universe';
import { runValue, type ValueInputs } from './value';
import { ARPU_EUROPE, VALUE_TABLE_RATIFIED } from './value-table';

function fakeSource(files: Record<string, unknown>) {
  return {
    readJson: <T>(p: string): Promise<T> =>
      p in files ? Promise.resolve(files[p] as T) : Promise.reject(new Error('absent')),
  };
}

const HOLDER = 'Holder Name';
const draft = (over: Partial<MediaDraft>): MediaDraft => ({
  path: 'media/x.jpg',
  ts: 1_700_000_000,
  kind: 'photo',
  source: 'dm',
  convId: 't1',
  convTitle: 'Contact A',
  sender: HOLDER,
  ...over,
});

describe('universe', () => {
  it('⚠ resolves the sender to a DIRECTION and throws the name away', async () => {
    const r = await runUniverse(
      fakeSource({}),
      [draft({ sender: HOLDER }), draft({ path: 'media/y.jpg', sender: 'Contact A' })],
      HOLDER,
    );
    expect(r.items.map((i) => i.bySelf)).toEqual([true, false]);
    // The interface needs to know whether a photo was sent or received, never by whom. If the name
    // ever survived into the report, this would find it.
    expect(JSON.stringify(r)).not.toContain(HOLDER);
  });

  it('adds stories and posts, and types each by its extension', async () => {
    const r = await runUniverse(
      fakeSource({
        'your_instagram_activity/media/stories.json': {
          ig_stories: [{ uri: 'media/s1.mp4', creation_timestamp: 1_600_000_000 }],
        },
        'your_instagram_activity/media/posts_1.json': [
          { creation_timestamp: 1_650_000_000, media: [{ uri: 'media/p1.webp' }] },
        ],
      }),
      [draft({ path: 'media/voice.aac', kind: 'audio' })],
      HOLDER,
    );
    expect(r.counts.byKind).toEqual({ photo: 1, video: 1, audio: 1 });
    expect(r.counts.bySource).toEqual({ dm: 1, story: 1, post: 1 });
    // Ascending, so the range is the two ends.
    expect(r.items.map((i) => i.ts)).toEqual([1_600_000_000, 1_650_000_000, 1_700_000_000]);
    expect(r.timeRange).toEqual({ from: 1_600_000_000, to: 1_700_000_000 });
  });

  it('drops an UNDATED media rather than placing it at zero', async () => {
    const r = await runUniverse(
      fakeSource({
        'your_instagram_activity/media/stories.json': {
          // No `creation_timestamp`: a spiral of time cannot show a point with no time, and 1970 is
          // not a neutral default — it is a wrong answer that draws a spike.
          ig_stories: [
            { uri: 'media/undated.jpg' },
            { uri: 'media/ok.jpg', creation_timestamp: 1 },
          ],
        },
      }),
      [],
      HOLDER,
    );
    expect(r.items).toHaveLength(1);
    expect(r.items[0]?.path).toBe('media/ok.jpg');
  });

  it('lists the DM threads that hold media, by volume', async () => {
    const r = await runUniverse(
      fakeSource({}),
      [
        draft({ convId: 'a', convTitle: 'A' }),
        draft({ convId: 'b', convTitle: 'B' }),
        draft({ convId: 'b', convTitle: 'B', path: 'media/2.jpg' }),
      ],
      HOLDER,
    );
    expect(r.conversations).toEqual([
      { id: 'b', title: 'B', items: 2 },
      { id: 'a', title: 'A', items: 1 },
    ]);
  });
});

describe('⚠ value — gated shut until the table is ratified', () => {
  const inputs: ValueInputs = {
    inventory: {
      rootName: 'x',
      sections: [],
      messages: {
        conversations: 0,
        totalMessages: 0,
        oneToOne: 0,
        groups: 0,
        distinctParticipants: 0,
        range: { from: null, to: null },
        contentTypes: { shares: 0, reactionMessages: 0, audio: 0, photos: 0, videos: 0, calls: 0 },
        messageRequests: { threads: 0, messages: 0 },
        distribution: { over1000: 0, over100: 0, under10: 0 },
      },
      connections: { following: 0, followers: 0, pendingSent: 0, blocked: 0, closeFriends: 0 },
      activity: {
        likedPosts: 0,
        likedComments: 0,
        storyLikes: 0,
        polls: 0,
        comments: 0,
        storiesViewed: 0,
        savedPosts: 0,
      },
      media: { posts: 0, postsWithGps: 0, stories: 0, archivedPosts: 0 },
      location: {
        inferredCity: '',
        adCategories: 0,
        gpsPosts: 0,
        autofillAddresses: 0,
        hasLastKnown: false,
        distinctLoginIps: 0,
      },
      identity: {
        profileActivityEvents: 0,
        distinctDeviceIds: 0,
        profileChanges: 0,
        signupTs: null,
      },
    },
    geo: {
      declared: [],
      trajectory: [],
      addresses: [],
      cities: [],
      counts: {
        posts: 0,
        stories: 0,
        lastKnown: 0,
        addresses: 0,
        ipEvents: 0,
        distinctIps: 0,
        geolocated: 0,
        distinctCities: 0,
        declaredPlaces: 0,
      },
      timeRange: null,
    },
    relations: { nodes: [], categories: [], self: { following: 0, followers: 0 } },
    conversations: {
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
    },
    universe: {
      items: [],
      counts: {
        total: 0,
        byKind: { photo: 0, video: 0, audio: 0 },
        bySource: { dm: 0, story: 0, post: 0 },
      },
      timeRange: null,
      conversations: [],
    },
    accountCreatedTs: Date.UTC(2019, 6, 1) / 1000,
    nowTs: Date.UTC(2026, 0, 1) / 1000,
    locale: 'fr',
  };

  it('returns NULL, not an empty report', () => {
    // ⚠ THE BEARING ASSERTION OF THIS FILE. An empty report renders as « your data is worth
    // nothing » — a claim, and a false one. `null` is a state the interface must handle.
    expect(VALUE_TABLE_RATIFIED).toBe(false);
    expect(runValue(inputs)).toBeNull();
  });

  it('the ARPU table is per-YEAR, not per-quarter — the trap the source document names', () => {
    // $17.29 and $23.14 circulate widely and are Q4 FIGURES. Confusing them divides every result by
    // about three, and both readings produce a plausible number — which is why this is asserted on
    // the table rather than left to the reader of a comment.
    const y2023 = ARPU_EUROPE.find((r) => r.year === 2023);
    expect(y2023?.arpu).toBeGreaterThan(23.14 * 2);
    expect(y2023?.confidence).toBe('derived');
    // And every row carries its confidence — the interface is obliged to show it, so it must exist.
    expect(ARPU_EUROPE.every((r) => r.confidence !== undefined && r.note !== '')).toBe(true);
  });
});
