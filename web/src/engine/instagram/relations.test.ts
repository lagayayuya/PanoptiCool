// THE RELATIONS EXTRACTOR — and the three traps it exists to not fall into.
//
// Every fixture is a hand-written SHAPE: key names and encodings from
// `docs/instagram-export-schema.md`, values invented. No fragment of a real export, and the
// usernames below are deliberately unusable as handles.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - IT READS A FAKE SOURCE, not a zip. That `BlobZipExportSource` serves these paths is the
//     business of `blob-zip-source.test.ts`; that the extractor asks for the RIGHT paths is
//     asserted here only in the sense that a wrong path yields an empty section — which is exactly
//     the failure this connector cannot tell apart from an empty account. The paths themselves are
//     verified against the contract by a human reading, and by nothing else;
//   - IT DOES NOT COVER THE THREE COMMENT FILES SEPARATELY. One is exercised; the other two differ
//     only by their root key, and that difference is a line of data in the extractor;
//   - NO SCALE. The reference export has ~550 following and ~8 000 likes; nothing here measures what
//     happens at that size;
//   - IT SAYS NOTHING ABOUT THE INTERFACE. No component reads this report yet.

import { describe, expect, it } from 'vitest';
import { LabelCoverage } from './labels';
import { runRelations } from './relations';

/** A source that serves literals. `readJson` rejects for an absent path, like the real ones. */
function fakeSource(files: Record<string, unknown>) {
  return {
    readJson: <T>(p: string): Promise<T> =>
      p in files ? Promise.resolve(files[p] as T) : Promise.reject(new Error('absent')),
  };
}

const FOLLOWING = {
  relationships_following: [
    { title: 'account_alpha', string_list_data: [{ href: '', timestamp: 1_700_000_000 }] },
    { title: 'account_beta', string_list_data: [{ href: '', timestamp: 1_700_000_100 }] },
  ],
};
const FOLLOWERS = [
  { title: '', string_list_data: [{ value: 'account_alpha', timestamp: 1_700_000_050 }] },
];

describe('the graph', () => {
  it('joins the two lists on the username, and reports reciprocity', async () => {
    const r = await runRelations(
      fakeSource({
        'connections/followers_and_following/following.json': FOLLOWING,
        'connections/followers_and_following/followers_1.json': FOLLOWERS,
      }),
      'fr',
    );
    expect(r.nodes).toHaveLength(2);
    const alpha = r.nodes.find((n) => n.id === 'account_alpha');
    // The one account in BOTH lists is the only one that is mutual — asserted in both directions,
    // because « follows » and « followed » are two facts and holding one is how a graph lies.
    expect(alpha?.follows).toBe(true);
    expect(alpha?.followed).toBe(true);
    const beta = r.nodes.find((n) => n.id === 'account_beta');
    expect(beta?.followed).toBe(true);
    expect(beta?.follows).toBe(false);
    expect(r.self).toEqual({ following: 2, followers: 1 });
  });

  it('⚠ counts an UNDATED interaction and gives it no date', async () => {
    // The prototype pushed `NaN` into the timestamp array and filtered it later. Same result, and a
    // NaN inside an array that gets sorted. The property that must hold either way: the count sees
    // the event, the timeline does not invent a moment for it.
    const r = await runRelations(
      fakeSource({
        'connections/followers_and_following/following.json': {
          relationships_following: [
            { title: 'undated_account', string_list_data: [{ href: '' }] },
            { title: 'dated_account', string_list_data: [{ href: '', timestamp: 1_700_000_000 }] },
          ],
        },
      }),
      'fr',
    );
    const undated = r.nodes.find((n) => n.id === 'undated_account');
    expect(undated?.interactions.following?.count).toBe(1);
    expect(undated?.interactions.following?.timestamps).toEqual([]);
    expect(undated?.firstTs).toBeNull();

    // And the category total counts BOTH, dated or not — the number of events is not the number of
    // dates, and the report says so.
    const following = r.categories.find((c) => c.key === 'following');
    expect(following?.events).toBe(2);
    expect(following?.accounts).toBe(2);
  });
});

describe('⚠ usernames from hrefs — the trap that would name a node after a post', () => {
  it('takes the handle from /stories/USER and REFUSES /p/ and /reel/', async () => {
    const r = await runRelations(
      fakeSource({
        'your_instagram_activity/story_interactions/story_likes.json': [
          {
            timestamp: 1_700_000_000,
            label_values: [
              { label: 'x', href: 'https://www.instagram.com/stories/story_author/1' },
            ],
          },
          // A post URL: the first segment is a POST ID, not a handle. Accepting it would create a
          // node named after a piece of content and count interactions against it.
          {
            timestamp: 1_700_000_001,
            label_values: [{ label: 'x', href: 'https://www.instagram.com/p/AbCdEf123/' }],
          },
          {
            timestamp: 1_700_000_002,
            label_values: [{ label: 'x', href: 'https://www.instagram.com/reel/XyZ987/' }],
          },
        ],
      }),
      'fr',
    );
    // Both directions: the good one is kept AND the two bad ones are absent.
    expect(r.nodes.map((n) => n.id)).toEqual(['story_author']);
  });
});

describe('content — what is kept, and what is only counted', () => {
  it('keeps the poll QUESTION and the posted COMMENT, both being the person’s own writing', async () => {
    const coverage = new LabelCoverage();
    const r = await runRelations(
      fakeSource({
        'your_instagram_activity/story_interactions/polls.json': [
          {
            timestamp: 1_700_000_000,
            label_values: [
              { label: 'x', href: 'https://www.instagram.com/stories/poll_author/1' },
              // Mojibake, as it arrives.
              { label: 'Question', value: 'Prise de tÃªte ou pas ?' },
            ],
          },
        ],
        'your_instagram_activity/comments/post_comments_1.json': [
          {
            string_map_data: {
              'Media Owner': { value: 'comment_target' },
              Time: { timestamp: 1_700_000_500 },
              Comment: { value: 'trÃ¨s joli' },
            },
          },
        ],
      }),
      'fr',
      coverage,
    );

    const poll = r.nodes.find((n) => n.id === 'poll_author');
    // The mojibake is repaired on the way through — the one place content passes the repair.
    expect(poll?.content?.poll?.[0]?.text).toBe('Prise de tête ou pas ?');

    const commented = r.nodes.find((n) => n.id === 'comment_target');
    expect(commented?.content?.comment?.[0]?.text).toBe('très joli');
    expect(commented?.interactions.comment?.timestamps).toEqual([1_700_000_500]);

    // ⚠ The coverage recorded the labels it matched. This is the connector's only symptom for a
    // label table that does not fit the export's language, so it is asserted here rather than
    // trusted to be wired.
    const summary = coverage.summary();
    expect(summary.missed).not.toContain('mediaOwner');
    expect(summary.missed).not.toContain('comment');
    expect(summary.missed).not.toContain('pollQuestion');
  });

  it('a story LIKE keeps no content — nothing of the other person’s crosses', async () => {
    const r = await runRelations(
      fakeSource({
        'your_instagram_activity/story_interactions/story_likes.json': [
          {
            timestamp: 1_700_000_000,
            label_values: [
              { label: 'x', href: 'https://www.instagram.com/stories/author/1' },
              { label: 'Legend', value: 'a caption that must not be kept' },
            ],
          },
        ],
      }),
      'fr',
    );
    expect(r.nodes[0]?.interactions.story_like?.count).toBe(1);
    expect(r.nodes[0]?.content).toBeUndefined();
  });
});

describe('absence and language', () => {
  it('an export missing every file yields an empty report, not an error', async () => {
    // Half an export is optional. Refusing on the first missing path refuses real accounts.
    const r = await runRelations(fakeSource({}), 'fr');
    expect(r.nodes).toEqual([]);
    expect(r.self).toEqual({ following: 0, followers: 0 });
    // The eleven categories are still described, at zero — a category that vanishes when empty
    // cannot be shown as « nothing here », which is information.
    expect(r.categories).toHaveLength(11);
    expect(r.categories.every((c) => c.accounts === 0 && c.events === 0)).toBe(true);
  });

  it('the category labels follow the locale', async () => {
    const fr = await runRelations(fakeSource({}), 'fr');
    const en = await runRelations(fakeSource({}), 'en');
    const label = (r: typeof fr, k: string) => r.categories.find((c) => c.key === k)?.label;
    expect(label(fr, 'blocked')).toBe('Bloqués');
    expect(label(en, 'blocked')).toBe('Blocked');
    // Structure does NOT follow the locale — the kinds are a fact about the categories.
    expect(fr.categories.map((c) => c.kind)).toEqual(en.categories.map((c) => c.kind));
  });
});
