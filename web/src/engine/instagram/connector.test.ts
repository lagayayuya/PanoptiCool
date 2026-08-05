// THE INSTAGRAM CONNECTOR, END TO END — over a real zip, through the real `ExportSource`.
//
// This is the first test in the connector that touches all seven extractors at once, and the first
// that reads through an archive rather than a fake source. What it is for: the ORDER, which is a
// dependency graph and not a preference, and which fails SILENTLY when wrong — « sent by you »
// counted against the wrong person, a media universe with no direction.
//
// The archive is built here from literals following `docs/instagram-export-schema.md`. Every value
// is invented; the display names and handles below are not usable as either.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - SCALE. Three threads and a handful of files, against 349 threads, ~86 000 messages and 507
//     JSON files in the reference export. Nothing here measures memory or time;
//   - THE GEO DATABASE. The resolver is a stub (`mmdb-geo-resolver.test.ts` covers the mapping,
//     and no test in this repository reads a real MMDB);
//   - THE VALUE REPORT. `runValue` returns `null` while its table is unratified, so `report.value`
//     is absent — asserted below as an absence, which is the current correct behaviour and will
//     have to change deliberately on the day the table is ratified;
//   - ⚠ THE PROGRESS AND PATCH CALLBACKS' TIMING. That patches arrive IN ORDER is asserted; that
//     they arrive early enough to be useful is a property of a real 2 GB archive, not of this one.

import { strToU8, zipSync } from 'fflate';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ZipExportSource } from '../zip-source';
import { type InstagramOptions, instagramConnector, makeThreadReader } from './connector';
import type { GeoResolver } from './geo';

// The heatmap and the monthly buckets are local-time by design (`conversations.ts`), so a test that
// asserts on them has to pin the zone or it passes in Paris and fails in Tokyo.
const ORIGINAL_TZ = process.env.TZ;
beforeAll(() => {
  process.env.TZ = 'UTC';
});
afterAll(() => {
  process.env.TZ = ORIGINAL_TZ;
});

const HOLDER = 'Holder Name';
const T = Date.UTC(2024, 0, 15, 12, 0, 0);

const RESOLVER: GeoResolver = {
  lookup: (ip) =>
    ip === '203.0.113.7' ? { lat: 12.5, lon: -30.25, city: 'Inferred-City', country: 'ZZ' } : null,
};

function json(v: unknown): Uint8Array {
  return strToU8(JSON.stringify(v));
}

/** A minimal but COMPLETE export: every file the seven extractors read that this test asserts on. */
function buildArchive(): Uint8Array {
  const thread = (other: string, messages: unknown[]) => ({
    participants: [{ name: HOLDER }, { name: other }],
    title: other,
    messages,
  });
  return zipSync({
    // — messages: two threads, the second larger so the sort is exercised —
    'your_instagram_activity/messages/inbox/thread_a/message_1.json': json(
      thread('Contact A', [
        { sender_name: HOLDER, timestamp_ms: T, content: 'zzz-secret-body' },
        { sender_name: 'Contact A', timestamp_ms: T + 600_000 },
        { sender_name: HOLDER, timestamp_ms: T + 900_000, photos: [{ uri: 'media/p1.jpg' }] },
      ]),
    ),
    'your_instagram_activity/messages/inbox/thread_b/message_1.json': json(
      thread('Contact B', [
        { sender_name: HOLDER, timestamp_ms: T, audio_files: [{ uri: 'media/a1.aac' }] },
      ]),
    ),
    // — identity —
    'personal_information/personal_information/personal_information.json': json({
      profile_user: [
        {
          string_map_data: {
            'Nom de profil': { value: 'synthetic_handle' },
            'Compte privÃ©': { value: 'True' },
          },
        },
      ],
    }),
    'security_and_login_information/login_and_profile_creation/signup_details.json': json({
      account_history_registration_info: [
        { string_map_data: { Heure: { timestamp: Math.floor(Date.UTC(2019, 5, 1) / 1000) } } },
      ],
    }),
    // — geo: one login with an IP the resolver knows —
    'security_and_login_information/login_and_profile_creation/profile_activity.json': json([
      {
        label_values: [
          { label: 'Adresse IP', value: '203.0.113.7' },
          { label: 'Dernière connexion', timestamp_value: Math.floor(T / 1000) },
          { label: 'Type', value: 'Connexion' },
        ],
      },
    ]),
    // — relations —
    'connections/followers_and_following/following.json': json({
      relationships_following: [
        { title: 'account_alpha', string_list_data: [{ href: '', timestamp: 1 }] },
      ],
    }),
    // — a published story, for the universe —
    'your_instagram_activity/media/stories.json': json({
      ig_stories: [{ uri: 'media/s1.mp4', creation_timestamp: Math.floor(T / 1000) }],
    }),
  });
}

describe('the connector, end to end', () => {
  const run = async (over: Partial<InstagramOptions> = {}) => {
    const source = new ZipExportSource(buildArchive(), 'export.zip');
    const result = await instagramConnector.analyze(source, {
      locale: 'fr',
      now: Date.UTC(2026, 0, 1),
      geoResolver: RESOLVER,
      ...over,
    } as InstagramOptions);
    return result;
  };

  it('recognizes an Instagram archive, and refuses one that is not', async () => {
    await expect(instagramConnector.recognize(new ZipExportSource(buildArchive()))).resolves.toBe(
      true,
    );
    // The right FORM, the wrong contents: recognition is about the contract's directories.
    const other = zipSync({ 'user_data_tiktok.json': json({}) });
    await expect(instagramConnector.recognize(new ZipExportSource(other))).resolves.toBe(false);
  });

  it('⚠ the ORDER holds: the holder is inferred first, and the universe knows the direction', async () => {
    const r = await run();
    expect(r.ok).toBe(true);
    if (!r.ok) return;

    // Conversations ran first and inferred the holder…
    expect(r.report.conversations.self).toBe(HOLDER);
    // …so the universe could turn a sender's NAME into a DIRECTION. This is the assertion that
    // fails, silently and plausibly, if universe ever runs before conversations.
    const dmPhoto = r.report.universe.items.find((i) => i.path === 'media/p1.jpg');
    expect(dmPhoto?.bySelf).toBe(true);
    expect(r.report.universe.counts.bySource).toEqual({ dm: 2, story: 1, post: 0 });
  });

  it('⚠ MEASURED — each thread file is read ONCE, not once per report', async () => {
    // ⚠ THE FIRST VERSION OF THIS TEST ASSERTED THE WRONG THING. It compared the inventory's
    // message figures against the conversations report's and called that « derived, not
    // recomputed ». Measured by mutation: removing the derivation left it GREEN, because a
    // re-walk produces THE SAME NUMBERS — that is the whole point of a re-walk. Agreement was
    // never evidence of a single pass.
    //
    // What distinguishes them is the COST, so that is what is counted. On the reference export the
    // difference is 349 threads and ~86 000 messages walked twice.
    const inner = new ZipExportSource(buildArchive(), 'export.zip');
    const reads = new Map<string, number>();
    const counting = {
      rootName: () => inner.rootName(),
      readJson: <T>(p: string): Promise<T> => {
        reads.set(p, (reads.get(p) ?? 0) + 1);
        return inner.readJson<T>(p);
      },
      readText: (p: string) => inner.readText(p),
      listDir: (p: string) => inner.listDir(p),
      stat: (p: string) => inner.stat(p),
      exists: (p: string) => inner.exists(p),
    };
    const r = await instagramConnector.analyze(counting, {
      locale: 'fr',
      now: Date.UTC(2026, 0, 1),
      geoResolver: RESOLVER,
    } as InstagramOptions);
    expect(r.ok).toBe(true);

    const threadReads = [...reads].filter(([p]) => p.includes('/messages/inbox/'));
    // Anchoring: the threads really were read. Without this, « never twice » would also hold for
    // an archive nobody opened.
    expect(threadReads.length).toBeGreaterThan(0);
    expect(threadReads.filter(([, n]) => n > 1)).toEqual([]);

    // And the two reports still agree — a weaker property than the one above, but a real one:
    // the derivation must not lose anything on the way.
    if (!r.ok) return;
    expect(r.report.inventory.messages.totalMessages).toBe(r.report.conversations.totals.messages);
    expect(r.report.inventory.messages.range.from).toBe('2024-01-15');
  });

  it('identity reads what inventory and geo found, not the archive again', async () => {
    const r = await run();
    if (!r.ok) return;
    expect(r.report.identity.account.signupTs).toBe(Math.floor(Date.UTC(2019, 5, 1) / 1000));
    // 2019-06 to 2026-01 is a little over six and a half years.
    expect(r.report.identity.account.ageYears).toBeGreaterThan(6);
    expect(r.report.identity.account.loginEvents).toBe(1);
    expect(r.report.identity.account.distinctIps).toBe(1);
    const handle = r.report.identity.anchors.find((a) => a.key === 'profileName');
    expect(handle?.values).toEqual(['synthetic_handle']);
  });

  it('the map keeps its two layers apart, and the resolver only feeds one', async () => {
    const r = await run();
    if (!r.ok) return;
    expect(r.report.geo.trajectory).toHaveLength(1);
    expect(r.report.geo.trajectory[0]?.city).toBe('Inferred-City');
    // Declared stays empty: this archive has no GPS point, and an inferred one must never fill it.
    expect(r.report.geo.declared).toEqual([]);
  });

  it('⚠ WITHOUT a resolver the trajectory is empty and nothing else changes', async () => {
    const r = await run({ geoResolver: null });
    if (!r.ok) return;
    // The degraded mode, asserted rather than assumed: a fresh clone has no geo database, and the
    // rest of the dossier must be unaffected.
    expect(r.report.geo.trajectory).toEqual([]);
    expect(r.report.geo.counts.ipEvents).toBe(1);
    expect(r.report.conversations.totals.messages).toBe(4);
    expect(r.report.identity.anchorsPresent).toBeGreaterThan(0);
  });

  it('⚠ no message content reaches the report', async () => {
    const r = await run();
    if (!r.ok) return;
    // The archive carries a body; the report must not. Anchored by the message count, so the
    // absence has one possible cause.
    expect(r.report.conversations.totals.messages).toBe(4);
    expect(JSON.stringify(r.report)).not.toContain('zzz-secret-body');
  });

  it('reports how many labels it recognised — the silent failure’s only symptom', async () => {
    const r = await run();
    if (!r.ok) return;
    expect(r.report.labelCoverage.matched).toBeGreaterThan(0);
    expect(r.report.labelCoverage.total).toBeGreaterThan(r.report.labelCoverage.matched);
  });

  it('emits each piece as it lands, in dependency order', async () => {
    const seen: string[] = [];
    await run({ onReport: (p) => seen.push(...Object.keys(p)) });
    // Conversations before universe, inventory before identity. The page can render the first
    // screen without waiting for the last report — and the order here IS the dependency graph.
    expect(seen.indexOf('conversations')).toBeLessThan(seen.indexOf('universe'));
    expect(seen.indexOf('inventory')).toBeLessThan(seen.indexOf('identity'));
    expect(seen.indexOf('geo')).toBeLessThan(seen.indexOf('identity'));
  });

  it('⚠ carries NO value report while its table is unratified', async () => {
    const r = await run();
    if (!r.ok) return;
    // An absent key, not a zeroed report — the interface must handle « not available », because a
    // zeroed one renders as « your data is worth nothing ».
    expect(Object.hasOwn(r.report, 'value')).toBe(false);
  });
});

describe('the thread reader — the only path that touches message text', () => {
  it('returns a thread in CHRONOLOGICAL order, across reversed pages', async () => {
    const files: Record<string, Uint8Array> = {
      // ⚠ `message_1.json` holds the MOST RECENT messages. A reader that concatenated in filename
      // order would hand a model a conversation running backwards — which it would then describe,
      // confidently, as a relationship that started at the end.
      'your_instagram_activity/messages/inbox/t/message_1.json': json({
        messages: [{ sender_name: HOLDER, timestamp_ms: T + 2000, content: 'later' }],
      }),
      'your_instagram_activity/messages/inbox/t/message_2.json': json({
        messages: [{ sender_name: HOLDER, timestamp_ms: T, content: 'earlier' }],
      }),
    };
    const read = makeThreadReader(new ZipExportSource(zipSync(files)));
    const msgs = await read('t');
    expect(msgs.map((m) => m.text)).toEqual(['earlier', 'later']);
  });

  it('⚠ KEEPS a media message, which carries no text at all', async () => {
    // It used to drop them, and that was wrong for the one path this reader serves: a photo is
    // often the whole turn, and removing it leaves a hole in a thread the model reads as
    // continuous — a silence it will then explain. What the media WAS survives; the bytes do not.
    const read = makeThreadReader(
      new ZipExportSource(
        zipSync({
          'your_instagram_activity/messages/inbox/t/message_1.json': json({
            messages: [
              { sender_name: HOLDER, timestamp_ms: T, photos: [{ uri: 'media/p.jpg' }] },
              { sender_name: HOLDER, timestamp_ms: T + 1, content: 'a word' },
            ],
          }),
        }),
      ),
    );
    const msgs = await read('t');
    expect(msgs).toHaveLength(2);
    expect(msgs[0]?.media).toEqual([{ kind: 'photo', path: 'media/p.jpg' }]);
    expect(msgs[0]?.text).toBe('');
  });

  it('repairs the double encoding in message text and sender names', async () => {
    // ⚠ THE ONE PLACE CONTENT PASSES THROUGH `fixMojibake`. Without it the local-AI path receives
    // every accented sentence as noise, and the model reads noise.
    const mojibake = (t: string) =>
      [...new TextEncoder().encode(t)].map((b) => String.fromCharCode(b)).join('');
    const read = makeThreadReader(
      new ZipExportSource(
        zipSync({
          'your_instagram_activity/messages/inbox/t/message_1.json': json({
            messages: [
              {
                sender_name: mojibake('Amélie'),
                timestamp_ms: T,
                content: mojibake('déjà là 😀'),
              },
            ],
          }),
        }),
      ),
    );
    const msgs = await read('t');
    expect(msgs[0]?.sender).toBe('Amélie');
    // The emoji too: its mojibake form is entirely below U+0100, so the repair reaches it.
    expect(msgs[0]?.text).toBe('déjà là 😀');
  });

  it('gives each message a stable index, and reads a call, a share and an unsend', async () => {
    const read = makeThreadReader(
      new ZipExportSource(
        zipSync({
          'your_instagram_activity/messages/inbox/t/message_1.json': json({
            messages: [
              { sender_name: HOLDER, timestamp_ms: T, call_duration: 125 },
              {
                sender_name: HOLDER,
                timestamp_ms: T + 1,
                share: { link: 'https://example.invalid/x', share_text: 'look' },
              },
              { sender_name: HOLDER, timestamp_ms: T + 2, is_unsent: true },
              // ⚠ Beyond six hours a duration is a data error, not a very long call.
              { sender_name: HOLDER, timestamp_ms: T + 3, call_duration: 99999 },
            ],
          }),
        }),
      ),
    );
    const msgs = await read('t');
    expect(msgs.map((m) => m.index)).toEqual([0, 1, 2, 3]);
    expect(msgs[0]?.callSeconds).toBe(125);
    expect(msgs[1]?.share).toEqual({ link: 'https://example.invalid/x', text: 'look' });
    expect(msgs[2]?.unsent).toBe(true);
    expect(msgs[3]?.callSeconds).toBeNull();
  });
});
