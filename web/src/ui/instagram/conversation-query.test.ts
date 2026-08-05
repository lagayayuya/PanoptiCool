// THE CONVERSATIONS QUERY — the four axes, and the two rules that are easy to get backwards.
//
// Why these are worth testing when the rest of the module port is not: they are PURE PREDICATES
// that decide what a reader sees, they fail silently (a filter that quietly widens looks like a
// filter that works), and every one of them encodes a decision rather than a mechanism.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - THE FILTER BAR ITSELF. No component is rendered here; that the menus wire these predicates
//     is the view's business and is not asserted anywhere yet;
//   - THE PHRASE. `queryPhraseParts` returns parts; the sentence built from them lives in the
//     interface and in two languages, and neither is checked here;
//   - THE THRESHOLDS' RIGHTNESS. That « dormant » should be five years is a decision, not a
//     property. What is asserted is that the boundary falls where the constant says.

import { describe, expect, it } from 'vitest';
import type { ConversationSummary } from '../../engine/instagram/conversations';
import {
  activeCount,
  type ContentType,
  type ConvQuery,
  contentCount,
  EMPTY_QUERY,
  matchesConv,
  queryPhraseParts,
} from './conversation-query';
import { DORMANT_YEARS, matchesPrefix, matchesTimeTs, YEAR_SEC } from './filters';

const NOW = Date.UTC(2026, 0, 1) / 1000;

function thread(over: Partial<ConversationSummary> = {}): ConversationSummary {
  return {
    id: 't',
    title: 'Marie Dupont',
    isGroup: false,
    participants: 2,
    memberNames: [],
    messages: 10,
    sentBySelf: 5,
    received: 5,
    firstTs: NOW - 1000,
    lastTs: NOW - 1000,
    monthly: [],
    types: { audio: 0, photos: 0, videos: 0, shares: 0, calls: 0, callSeconds: 0 },
    typesSelf: { audio: 0, photos: 0, videos: 0, shares: 0 },
    typesOthers: { audio: 0, photos: 0, videos: 0, shares: 0 },
    reactionsGiven: 0,
    reactionsReceived: 0,
    medianReplySelfMin: null,
    medianReplyOtherMin: null,
    ...over,
  };
}

const query = (over: Partial<ConvQuery> = {}): ConvQuery => ({ ...EMPTY_QUERY, ...over });

describe('⚠ search is by PREFIX, and by segment prefix', () => {
  it('matches the start of the name and the start of any segment', () => {
    // « Je tape a, ça affiche tous les personnages commençant par a » — as a substring, « a » would
    // keep almost everyone and the search would be useless before the third letter.
    expect(matchesPrefix('Marie Dupont', 'mar')).toBe(true);
    expect(matchesPrefix('Marie Dupont', 'dup')).toBe(true);
    expect(matchesPrefix('jean.martin', 'martin')).toBe(true);
    expect(matchesPrefix('jean-luc_b', 'luc')).toBe(true);
  });

  it('does NOT match mid-segment — that is the whole point', () => {
    // « rie » is inside « Marie ». A substring search would find it, and finding it is the failure.
    expect(matchesPrefix('Marie Dupont', 'rie')).toBe(false);
    expect(matchesPrefix('Marie Dupont', 'upont')).toBe(false);
  });

  it('an empty query keeps everything', () => {
    expect(matchesPrefix('anything', '')).toBe(true);
    expect(matchesPrefix('anything', '   ')).toBe(true);
  });
});

describe('⚠ age buckets, and the clock they must NOT use', () => {
  const at = (yearsAgo: number) => NOW - yearsAgo * YEAR_SEC;

  it('partitions: every thread lands in exactly one bucket', () => {
    for (const yearsAgo of [0.5, 3, 8]) {
      const hits = (['recent', 'fading', 'dormant'] as const).filter((b) =>
        matchesTimeTs(at(yearsAgo), b, NOW),
      );
      // The axis is a PARTITION — which is why it is a single choice in the interface and not a
      // set of checkboxes. If two buckets ever claimed the same thread, that design would be wrong.
      expect(hits, `${yearsAgo} years ago`).toHaveLength(1);
    }
  });

  it('the boundary falls where the constant says', () => {
    expect(matchesTimeTs(at(DORMANT_YEARS - 0.01), 'fading', NOW)).toBe(true);
    expect(matchesTimeTs(at(DORMANT_YEARS + 0.01), 'dormant', NOW)).toBe(true);
  });

  it('an UNDATED thread is dormant, never recent', () => {
    // It has no recent trace, which is what the bucket means. Calling it recent would invent one.
    expect(matchesTimeTs(null, 'dormant', NOW)).toBe(true);
    expect(matchesTimeTs(null, 'recent', NOW)).toBe(false);
    expect(matchesTimeTs(null, 'any', NOW)).toBe(true);
  });

  it('⚠ `nowSec` IS A PARAMETER, and the whole answer moves with it', () => {
    const lastTrace = at(0.5);
    expect(matchesTimeTs(lastTrace, 'recent', NOW)).toBe(true);
    // The same export re-read six years later. If `nowSec` were the machine's clock, every thread
    // would read as dormant — describing the WAIT rather than the data. This is why the caller must
    // pass the export's own last trace.
    const muchLater = NOW + 6 * YEAR_SEC;
    expect(matchesTimeTs(lastTrace, 'recent', muchLater)).toBe(false);
    expect(matchesTimeTs(lastTrace, 'dormant', muchLater)).toBe(true);
  });
});

describe('⚠ contents combine with AND', () => {
  const withMedia = thread({
    types: { audio: 3, photos: 5, videos: 0, shares: 0, calls: 0, callSeconds: 0 },
    typesSelf: { audio: 0, photos: 5, videos: 0, shares: 0 },
    typesOthers: { audio: 3, photos: 0, videos: 0, shares: 0 },
  });

  it('two ticked contents keep only what has BOTH', () => {
    const both = new Set<ContentType>(['photos', 'audio']);
    expect(matchesConv(withMedia, query({ contents: both }), NOW)).toBe(true);
    // Adding a third the thread lacks must NARROW. A filter that widened as you added to it would
    // do the opposite of what selecting more things means.
    const three = new Set<ContentType>(['photos', 'audio', 'videos']);
    expect(matchesConv(withMedia, query({ contents: three }), NOW)).toBe(false);
  });

  it('the direction modifies the CONTENT count, and is not a filter of its own', () => {
    expect(contentCount(withMedia, 'photos', 'self')).toBe(5);
    expect(contentCount(withMedia, 'photos', 'others')).toBe(0);
    // « photos, sent by me » matches; « audio, sent by me » does not, because they received those.
    expect(
      matchesConv(withMedia, query({ contents: new Set(['photos']), direction: 'self' }), NOW),
    ).toBe(true);
    expect(
      matchesConv(withMedia, query({ contents: new Set(['audio']), direction: 'self' }), NOW),
    ).toBe(false);
  });

  it('⚠ CALLS IGNORE THE DIRECTION, because the export does not record who placed them', () => {
    const called = thread({
      types: { audio: 0, photos: 0, videos: 0, shares: 0, calls: 4, callSeconds: 600 },
    });
    // Same answer whichever direction is asked: filtering « calls sent by you » would return a
    // number the data cannot support, so the direction is dropped rather than guessed.
    for (const dir of ['any', 'self', 'others'] as const) {
      expect(contentCount(called, 'calls', dir), dir).toBe(4);
    }
  });
});

describe('balance', () => {
  it('an exact 50/50 thread belongs to NEITHER side', () => {
    const even = thread({ sentBySelf: 5, received: 5 });
    // Putting it in one would be a coin toss shown as a fact.
    expect(matchesConv(even, query({ balance: 'self' }), NOW)).toBe(false);
    expect(matchesConv(even, query({ balance: 'others' }), NOW)).toBe(false);
    expect(matchesConv(even, query({ balance: 'any' }), NOW)).toBe(true);
  });

  it('otherwise it follows the majority', () => {
    expect(
      matchesConv(thread({ sentBySelf: 9, received: 1 }), query({ balance: 'self' }), NOW),
    ).toBe(true);
    expect(
      matchesConv(thread({ sentBySelf: 1, received: 9 }), query({ balance: 'others' }), NOW),
    ).toBe(true);
  });
});

describe('the phrase is decomposed, never assembled here', () => {
  it('counts the engaged axes', () => {
    expect(activeCount(EMPTY_QUERY)).toBe(0);
    expect(activeCount(query({ search: '  ' }))).toBe(0);
    expect(
      activeCount(query({ search: 'mar', contents: new Set(['photos']), time: 'recent' })),
    ).toBe(3);
  });

  it('⚠ returns PARTS, so a translation is a translation and not a second function', () => {
    // The prototype built « avec photos et vocaux envoyés par toi » here — prose, in one language,
    // with French word order baked into the concatenation. English orders those clauses
    // differently, so no translation of that output was possible.
    const parts = queryPhraseParts(query({ contents: new Set(['photos']), direction: 'self' }));
    expect(parts).toMatchObject({ contents: ['photos'], direction: 'self', directionAlone: false });
    expect(parts.empty).toBe(false);

    // Direction on its own is phrased differently, and the flag says so rather than the interface
    // re-deriving it from an empty array.
    expect(queryPhraseParts(query({ direction: 'others' })).directionAlone).toBe(true);
    expect(queryPhraseParts(EMPTY_QUERY).empty).toBe(true);
  });
});
