// INVENTORY AND IDENTITY — the two that read the account itself.
//
// Fixtures are hand-written SHAPES from `docs/instagram-export-schema.md`. Every value is invented,
// and the identity values below are deliberately impossible ones (`+00 000`, `0.0.0.0`) so that a
// leak would be obvious rather than plausible.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - THE MEMORY DISCIPLINE. `walkThreads` is written to hold one thread file at a time; nothing
//     here measures that, and a change that buffered the whole inbox would pass. The property is
//     visible in the code and asserted nowhere — the honest statement of a real gap;
//   - SCALE. The reference export is 349 threads and ~86 000 messages; the fixtures are three
//     threads. Paging (`message_1.json`, `message_2.json`) IS exercised, at two files;
//   - THE PROSE ITSELF. That the sentences are in the third person is `wording-instagram.test.ts`'s
//     business, in both languages. This file checks that the extractor USES them rather than
//     writing its own — which is the regression that would put French back inside the engine.

import { describe, expect, it } from 'vitest';
import { FR } from '../wording.instagram.fr';
import type { GeoReport } from './geo';
import { runIdentity } from './identity';
import { type InventorySource, runInventory } from './inventory';
import { LabelCoverage } from './labels';

function fakeSource(files: Record<string, unknown>, dirs: Record<string, string[]> = {}) {
  const src: InventorySource = {
    rootName: () => 'export-fixture',
    readJson: <T>(p: string): Promise<T> =>
      p in files ? Promise.resolve(files[p] as T) : Promise.reject(new Error('absent')),
    listDir: (p) =>
      Promise.resolve(
        (dirs[p] ?? []).map((name) => ({
          name,
          kind: name.endsWith('.json') ? ('file' as const) : ('directory' as const),
        })),
      ),
    exists: (p) =>
      Promise.resolve(Object.keys(files).some((f) => f === p || f.startsWith(`${p}/`))),
  };
  return src;
}

const EMPTY_GEO: GeoReport = {
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
};

describe('inventory — the message pass', () => {
  const INBOX = 'your_instagram_activity/messages/inbox';
  const files = {
    [`${INBOX}/thread_a/message_1.json`]: {
      participants: [{ name: 'Holder' }, { name: 'Contact A' }],
      messages: [
        { timestamp_ms: 1_700_000_000_000, content: 'x' },
        // A media message carries no `content` key at all (contract §0.1) — see the assertion
        // below for exactly what that does and does not establish.
        { timestamp_ms: 1_700_000_100_000, photos: [] },
        { timestamp_ms: 1_700_000_200_000, audio_files: [{}] },
      ],
    },
    [`${INBOX}/thread_a/message_2.json`]: {
      participants: [{ name: 'Holder' }, { name: 'Contact A' }],
      messages: [{ timestamp_ms: 1_600_000_000_000, content: 'older page' }],
    },
    [`${INBOX}/thread_group/message_1.json`]: {
      participants: [{ name: 'Holder' }, { name: 'Contact A' }, { name: 'Contact B' }],
      messages: [{ timestamp_ms: 1_700_000_300_000, share: {} }],
    },
  };
  const dirs = {
    [INBOX]: ['thread_a', 'thread_group'],
    [`${INBOX}/thread_a`]: ['message_1.json', 'message_2.json'],
    [`${INBOX}/thread_group`]: ['message_1.json'],
  };

  it('reads every page of a thread, and tells a group from a one-to-one', async () => {
    const r = await runInventory(fakeSource(files, dirs));
    const m = r.messages;
    expect(m.conversations).toBe(2);
    // Four messages in the two pages of thread_a, one in the group.
    expect(m.totalMessages).toBe(5);
    // `participants` includes the account holder, so a one-to-one has 2 entries and a group 3+.
    expect(m.oneToOne).toBe(1);
    expect(m.groups).toBe(1);
    expect(m.distinctParticipants).toBe(3);
  });

  it('counts an EMPTY media array as a media message', async () => {
    const r = await runInventory(fakeSource(files, dirs));
    // ⚠ WHAT THIS PROVES, AND WHAT IT DOES NOT. It proves `photos: []` counts as a photo message —
    // real, because a media message carries no `content` key at all (contract §0.1) and a reader
    // keyed on `content` drops it.
    //
    // It does NOT prove that `'photos' in m` is required rather than `if (m.photos)`. Measured by
    // mutation: swapping one for the other leaves this test GREEN, because an empty array is
    // TRUTHY in JavaScript. The two forms diverge only on `photos: null`, which no observed export
    // produces — so `in` is a belt-and-braces here, not a measured need, and claiming otherwise
    // would be citing this test for something it never checked.
    expect(r.messages.contentTypes.photos).toBe(1);
    expect(r.messages.contentTypes.audio).toBe(1);
    expect(r.messages.contentTypes.shares).toBe(1);
    expect(r.messages.contentTypes.videos).toBe(0);
  });

  it('the date range spans the OLDER page too — paging runs backwards', async () => {
    const r = await runInventory(fakeSource(files, dirs));
    // `message_1.json` holds the most RECENT messages (contract §0.1). A reader that stopped at the
    // first file would report a range starting in 2023 instead of 2020.
    expect(r.messages.range.from).toBe('2020-09-13');
    expect(r.messages.range.to).toBe('2023-11-14');
  });

  it('an empty export yields zeros and a null range, not an error', async () => {
    const r = await runInventory(fakeSource({}));
    expect(r.messages.conversations).toBe(0);
    expect(r.messages.range).toEqual({ from: null, to: null });
    expect(r.sections).toHaveLength(9);
    expect(r.sections.every((s) => !s.present)).toBe(true);
  });
});

describe('inventory — the inferred city', () => {
  it('reads the city Meta DEDUCES, from one level down', async () => {
    const coverage = new LabelCoverage();
    const r = await runInventory(
      fakeSource({
        'personal_information/information_about_you/profile_based_in.json': {
          label_values: [
            {
              label: 'DÃ©tails',
              dict: [
                { label: 'Ville', value: 'Ville-Fictive' },
                { label: 'Pays', value: 'ZZ' },
              ],
            },
          ],
        },
      }),
      () => {},
      coverage,
    );
    // The value is nested under `dict`; a flat read returns nothing, which is how the prototype
    // lost 199 declared cities.
    expect(r.location.inferredCity).toBe('Ville-Fictive, ZZ');
    expect(coverage.summary().missed).not.toContain('city');
  });
});

describe('identity — anchors', () => {
  const PROFILE = {
    'personal_information/personal_information/personal_information.json': {
      profile_user: [
        {
          string_map_data: {
            'Nom de profil': { value: 'synthetic_handle' },
            // Mojibake, as it arrives.
            'NumÃ©ro de tÃ©lÃ©phone': { value: '+00 000 000' },
            'Compte privÃ©': { value: 'True' },
          },
        },
      ],
    },
  };

  it('marks present what the export carries, absent what it does not', async () => {
    const inventory = await runInventory(fakeSource(PROFILE));
    const r = await runIdentity(fakeSource(PROFILE), {
      inventory,
      geo: EMPTY_GEO,
      nowTs: 1_700_000_000,
      locale: 'fr',
    });
    const by = (k: string) => r.anchors.find((a) => a.key === k);
    expect(by('profileName')?.present).toBe(true);
    expect(by('profileName')?.values).toEqual(['synthetic_handle']);
    // The mojibake is repaired on the VALUE too, here — a phone number holds no emoji, and the
    // repair returns anything it cannot re-interpret untouched.
    expect(by('phone')?.values).toEqual(['+00 000 000']);
    // Both directions: what is missing is marked absent AND carries no value.
    expect(by('name')?.present).toBe(false);
    expect(by('name')?.values).toEqual([]);
    expect(r.anchorsPresent).toBe(3);
  });

  it('⚠ takes its prose from the wording perimeter, never from inside the engine', async () => {
    const inventory = await runInventory(fakeSource(PROFILE));
    const r = await runIdentity(fakeSource(PROFILE), {
      inventory,
      geo: EMPTY_GEO,
      nowTs: 1_700_000_000,
      locale: 'fr',
    });
    // The regression this guards: a French sentence written back into the extractor. Comparing
    // against the bundle rather than against a literal means the test cannot drift from it.
    expect(r.anchors.find((a) => a.key === 'name')?.enables).toBe(FR.anchors.name.enables);
    expect(r.legalLinkage[0]?.title).toBe(FR.legalLinkage.pseudonymity.title);
  });

  it('follows the locale, prose and only prose', async () => {
    const inventory = await runInventory(fakeSource(PROFILE));
    const inputs = { inventory, geo: EMPTY_GEO, nowTs: 1_700_000_000 } as const;
    const fr = await runIdentity(fakeSource(PROFILE), { ...inputs, locale: 'fr' });
    const en = await runIdentity(fakeSource(PROFILE), { ...inputs, locale: 'en' });
    expect(fr.anchors[0]?.label).not.toBe(en.anchors[0]?.label);
    // The STRUCTURE is a fact about the account and does not translate.
    expect(fr.anchors.map((a) => a.strength)).toEqual(en.anchors.map((a) => a.strength));
    expect(fr.anchorsPresent).toBe(en.anchorsPresent);
  });
});

describe('identity — the archived past', () => {
  const CHANGES = {
    'personal_information/personal_information/profile_changes.json': {
      profile_profile_change: [
        {
          string_map_data: {
            // ⚠ The change TYPE is English inside a French export — an untranslated value in a
            // localised file, so it is compared as a literal rather than through the label table.
            Modifié: { value: 'Username' },
            'Date de modification': { timestamp: 1_600_000_000 },
            'Valeur précédente': { value: 'former_handle' },
          },
        },
        {
          string_map_data: {
            Modifié: { value: 'Profile Name' },
            'Date de modification': { timestamp: 1_650_000_000 },
            'Valeur précédente': { value: 'Former Display Name' },
          },
        },
      ],
    },
  };

  it('keeps the abandoned handles, newest first, with a FIELD KEY rather than a French word', async () => {
    const inventory = await runInventory(fakeSource(CHANGES));
    const r = await runIdentity(fakeSource(CHANGES), {
      inventory,
      geo: EMPTY_GEO,
      nowTs: 1_700_000_000,
      locale: 'fr',
    });
    expect(r.history.usernameChanges).toBe(1);
    expect(r.history.displayNameChanges).toBe(1);
    expect(r.history.previousValuesRetained).toBe(2);
    // Newest first, and the field is a KEY — the prototype emitted « pseudo » / « nom affiché »,
    // which is prose, from inside the engine, in one language.
    expect(r.history.previousIdentities.map((p) => p.field)).toEqual(['displayName', 'username']);
    expect(r.history.previousIdentities[1]?.value).toBe('former_handle');
  });
});

describe('identity — the login trail', () => {
  it('⚠ counts a login whether the export says « Connexion » or « Login »', async () => {
    const activity = (type: string) => ({
      'security_and_login_information/login_and_profile_creation/profile_activity.json': [
        {
          label_values: [
            { label: 'Adresse IP', value: '0.0.0.0' },
            { label: 'Type', value: type },
          ],
        },
      ],
    });
    for (const word of ['Connexion', 'Login']) {
      const files = activity(word);
      const inventory = await runInventory(fakeSource(files));
      const r = await runIdentity(fakeSource(files), {
        inventory,
        geo: EMPTY_GEO,
        nowTs: 1_700_000_000,
        locale: 'fr',
      });
      // A count that silently halves on an English export is the exact failure this connector is
      // built to avoid — and it would look like a quieter account, not like a bug.
      expect(r.account.loginEvents, word).toBe(1);
      expect(r.account.distinctIps).toBe(1);
    }
  });

  it('reports the export requests — asking leaves a trace too', async () => {
    const files = {
      'your_instagram_activity/other_activity/your_information_download_requests.json': [{}, {}],
    };
    const inventory = await runInventory(fakeSource(files));
    const r = await runIdentity(fakeSource(files), {
      inventory,
      geo: EMPTY_GEO,
      nowTs: 1_700_000_000,
      locale: 'fr',
    });
    expect(r.account.exportRequests).toBe(2);
    expect(r.legalLinkage[4]?.fact).toContain('2');
  });
});
