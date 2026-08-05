// THE SYNTHETIC INSTAGRAM EXPORT — a real archive, built in the browser, read by the real pipeline.
//
// ⚠ IT IS A ZIP, NOT A SHORTCUT. The demo hands the connector the same thing a person hands it: an
// archive to open, threads to page through, media to resolve. Nothing here writes a report; what the
// pieces show is what the engine actually extracted, and a bug in an extractor shows up in the demo
// exactly as it would on someone's own export. A demo that injected a ready-made report would be a
// screenshot with extra steps.
//
// ⚠ AND EVERY VALUE IS INVENTED (CLAUDE.md). The handles, the names, the city, the IP addresses, the
// dates, the sentences: none of it comes from any real export, and the structure alone is what
// crosses over from the contract (`docs/instagram-export-schema.md`).
//
// ————— What it weighs, and why that shape —————
//
// 1 000 photos, 500 videos, 250 voice notes — all as message attachments, because the platform card
// promises « toutes les photos, vidéos et vocaux ÉCHANGÉS ». The photos are distinct (a seeded
// gradient each); the videos and voice notes are ONE file each, written once and referenced 750
// times, because the zip stores them once and the pieces draw a poster or an orb rather than the
// bytes.
//
// ─── ⚠ WHAT THIS DEMO DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT DOES NOT PREDICT WHAT THE ENGINE WILL FIND. No count of themes, no expected city, no
//     announced ad value: a header that predicted the output would become false at the first change
//     with nothing to signal it. What the pipeline finds on this archive is measured in
//     `export.test.ts`, and that is where the numbers live;
//   - IT DOES NOT MODEL A REAL ACCOUNT'S PROPORTIONS. The volumes are the maintainer's spec — enough
//     for a heat map, a crowd and a spiral to have something to draw;
//   - IT WRITES ONLY WHAT THE CONNECTOR READS (contract §5). The other 470-odd files of a real
//     export are not simulated: an empty section in the demo means « not written here », and the
//     pieces already say so.

import { strToU8, zipSync } from 'fflate';
import type { Locale } from '../../i18n/locales';
import { type Line, THREADS, type ThreadSpec } from './corpus';
import { gradientPng, minimalMp4, silentM4a } from './media';

/** The account holder. Invented, like the rest. */
const SELF = 'Camille Ferrand';
const SELF_HANDLE = 'cam.ferrand';

/** The demo's clock: the export is « downloaded » on this day, and everything dates back from it. */
const EXPORT_DAY = Date.UTC(2026, 6, 12) / 1000;
const DAY = 86_400;
/** Day 0 of the corpus — the oldest thread opens here. */
const EPOCH = EXPORT_DAY - 1400 * DAY;

/** A seeded generator: the same demo twice, so a screenshot keeps meaning something. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1_664_525 + 1_013_904_223) >>> 0;
    return s / 0x1_00_00_00_00;
  };
}

const pick = <T>(r: () => number, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)] as T;

/* ————— The two dialects (contract §1) —————
   Both are written, and on purpose: an export holds both, and a demo that used one would leave the
   other's reader untested by the only archive most people will ever run. */
const legacy = (root: string, items: ReadonlyArray<Record<string, string>>) => ({
  [root]: items.map((fields) => ({
    string_map_data: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, { value: v }])),
  })),
});

const recent = (
  items: ReadonlyArray<{ title?: string; ts?: number; values: ReadonlyArray<[string, string]> }>,
) =>
  items.map((it) => ({
    ...(it.title === undefined ? {} : { title: it.title }),
    ...(it.ts === undefined ? {} : { timestamp: it.ts }),
    label_values: it.values.map(([label, value]) => ({ label, value })),
  }));

/** `{ title, string_list_data: [{ value, href, timestamp }] }` — the shape the relation lists use. */
const listData = (items: ReadonlyArray<{ value: string; ts: number }>, root?: string): unknown => {
  const body = items.map((it) => ({
    title: '',
    media_list_data: [],
    string_list_data: [
      { href: `https://www.instagram.com/${it.value}`, value: it.value, timestamp: it.ts },
    ],
  }));
  return root === undefined ? body : { [root]: body };
};

/* ════════════════════════════════════════════════════════════════════════════════════════════════
   THE VALUE BANKS — handles, cities, and the prose the non-message files carry.
   ⚠ EVERY ONE IS INVENTED. The handles follow no real account; the cities are real places, which is
   structure (a coordinate) rather than a value about anyone; the IPs are from the ranges reserved
   for documentation (RFC 5737), so none of them can belong to a machine.
   ════════════════════════════════════════════════════════════════════════════════════════════════ */
const FIRST = [
  'noor',
  'lise',
  'sacha',
  'yann',
  'ines',
  'tomas',
  'awa',
  'leo',
  'marin',
  'gwen',
  'romane',
  'idris',
  'nadia',
  'theo',
  'paul',
  'camille',
  'kilian',
  'maryse',
  'sarah',
  'jules',
  'nina',
  'omar',
  'elsa',
  'hugo',
  'lou',
  'anouk',
  'basile',
  'maya',
  'remi',
  'zoe',
];
const SECOND = [
  'ferrand',
  'okonjo',
  'valmy',
  'dpz',
  'court',
  'biblio',
  'studio',
  'pixels',
  'velo',
  'expo',
  'atelier',
  'nord',
  'sud',
  'lab',
  'photo',
  'archive',
  'radio',
  'kiosk',
  'plante',
  'fourmi',
];

/** 600 synthetic handles, enough for the follow lists and the interaction targets. */
const HANDLES: readonly string[] = (() => {
  const out: string[] = [];
  for (const a of FIRST) {
    for (const b of SECOND) {
      out.push(`${a}.${b}`);
      if (out.length >= 600) return out;
    }
  }
  return out;
})();

/**
 * The login trail's addresses.
 *
 * ⚠ THEY ARE REAL BLOCKS, AND CHOSEN BY MEASUREMENT — scanned out of the DB-IP database this site
 * ships, so the map's inferred layer actually has cities to draw. The documentation ranges (RFC 5737)
 * that were here first are in no geolocation database by construction: the demo's map came up empty
 * while its legend announced « 0 villes déduites », which is the opposite of what this piece exists
 * to show.
 *
 * ⚠ EACH ONE IS A NETWORK ADDRESS (`x.y.0.0`) — the first of its block, never assigned to a host. It
 * identifies the BLOCK's city, which is what a geolocation database knows and all this demo needs;
 * it is not, and cannot be, anyone's machine. And none of them comes from an export (CLAUDE.md):
 * they were read out of a public database, not out of anyone's data.
 *
 * The weights are the maintainer's: mostly Paris, London and Berlin — three dense zones — with a
 * scattering of other cities around them.
 */
/** Where the DECLARED points sit — posts and stories with coordinates. Structure, not a value. */
const PLACES: ReadonlyArray<{ lat: number; lon: number }> = [
  { lat: 48.8566, lon: 2.3522 },
  { lat: 51.5072, lon: -0.1276 },
  { lat: 52.52, lon: 13.405 },
  { lat: 48.1113, lon: -1.6801 },
  { lat: 45.764, lon: 4.8357 },
  { lat: 41.3874, lon: 2.1686 },
];

const TRAIL: ReadonlyArray<{ ip: string; weight: number }> = [
  // Paris — the home city, and the densest zone.
  { ip: '2.6.0.0', weight: 34 },
  { ip: '2.27.0.0', weight: 22 },
  { ip: '13.36.0.0', weight: 14 },
  { ip: '13.39.0.0', weight: 10 },
  // London.
  { ip: '2.30.0.0', weight: 20 },
  { ip: '2.120.0.0', weight: 14 },
  { ip: '3.9.0.0', weight: 9 },
  // Berlin.
  { ip: '2.210.0.0', weight: 18 },
  { ip: '2.213.0.0', weight: 12 },
  { ip: '51.72.0.0', weight: 8 },
  // The scattering: ten cities, a handful of logins each — a trip, a weekend, a conference.
  { ip: '80.12.0.0', weight: 6 },
  { ip: '2.3.0.0', weight: 5 },
  { ip: '2.9.0.0', weight: 4 },
  { ip: '3.175.0.0', weight: 4 },
  { ip: '82.241.0.0', weight: 3 },
  { ip: '2.153.0.0', weight: 3 },
  { ip: '4.175.0.0', weight: 3 },
  { ip: '34.14.0.0', weight: 3 },
  { ip: '2.103.0.0', weight: 2 },
  { ip: '2.214.0.0', weight: 2 },
];

/** The trail, expanded to one entry per login and weighted as above. */
const TRAIL_POOL: readonly string[] = TRAIL.flatMap(({ ip, weight }) =>
  Array.from({ length: weight }, () => ip),
);

const POLL_QUESTIONS: Record<Locale, readonly string[]> = {
  fr: [
    'thé ou café ?',
    'on sort ce soir ?',
    'quelle pochette vous préférez ?',
    'je coupe ma frange ?',
    'lequel des deux ?',
  ],
  en: [
    'tea or coffee?',
    'going out tonight?',
    'which cover do you prefer?',
    'should I cut my fringe?',
    'which of the two?',
  ],
};

const COMMENTS: Record<Locale, readonly string[]> = {
  fr: [
    'trop beau',
    'oh la la',
    'je viens la semaine prochaine promis',
    'la lumière 👌',
    'c’était une super soirée',
    'félicitations !!',
    'tu as pris ça où ?',
    'on refait ça',
    'la deuxième photo 😍',
    'courage pour la suite',
  ],
  en: [
    'so good',
    'oh wow',
    'I’ll come next week I promise',
    'that light 👌',
    'it was a great evening',
    'congratulations!!',
    'where did you take this?',
    'let’s do it again',
    'the second photo 😍',
    'good luck with the rest',
  ],
};

/**
 * The advertising categories. ⚠ THEY ARE INVENTED, and deliberately banal: this file is the one the
 * identity piece turns into « what an advertiser can buy you on », and inventing a lurid list would
 * make the demonstration flattering rather than true.
 */
const AD_CATEGORIES: Record<Locale, readonly string[]> = {
  fr: [
    'Voyages en train',
    'Librairies indépendantes',
    'Musique live',
    'Cuisine végétarienne',
    'Course à pied',
    'Photographie argentique',
    'Jeux de société',
    'Location d’appartement',
  ],
  en: [
    'Train travel',
    'Independent bookshops',
    'Live music',
    'Vegetarian cooking',
    'Running',
    'Film photography',
    'Board games',
    'Flat rental',
  ],
};

export interface DemoExport {
  readonly bytes: Uint8Array;
  readonly fileName: string;
}

/**
 * Builds the archive. `locale` picks which of the two parallel corpora is written — the AI prompt
 * follows the interface's language, so a French interface reading English threads would be
 * demonstrating a mismatch rather than a deduction.
 */
export function buildInstagramDemoExport(locale: Locale): DemoExport {
  const files: Record<string, Uint8Array> = {};
  const json = (path: string, value: unknown) => {
    files[path] = strToU8(JSON.stringify(value));
  };

  const handles = HANDLES;
  const r = rng(20_260_712);

  /* ————— Identity (contract §5) ————— */
  json('personal_information/personal_information/personal_information.json', {
    profile_user: [
      {
        media_map_data: {},
        string_map_data: {
          'Nom de profil': { value: SELF_HANDLE, timestamp: EXPORT_DAY - 40 * DAY },
          Nom: { value: SELF, timestamp: EXPORT_DAY - 900 * DAY },
          'Adresse e-mail': {
            value: 'camille.ferrand@example.invalid',
            timestamp: EXPORT_DAY - 900 * DAY,
          },
          'Numéro de téléphone': { value: '+33 6 00 00 00 00', timestamp: EXPORT_DAY - 700 * DAY },
          'Numéro de téléphone confirmé': { value: 'True' },
          Genre: { value: 'Non précisé' },
          'Date de naissance': { value: '1999-04-17' },
          'Compte privé': { value: 'False' },
        },
      },
    ],
  });
  json(
    'personal_information/personal_information/profile_changes.json',
    legacy('profile_profile_change', [
      {
        Modifié: 'Nom de profil',
        'Valeur précédente': 'camille.f',
        'Nouvelle valeur': SELF_HANDLE,
      },
      { Modifié: 'Photo de profil', 'Nouvelle valeur': 'media/profile/avatar.jpg' },
    ]),
  );
  json(
    'personal_information/information_about_you/profile_based_in.json',
    legacy('inferred_data_primary_location', [{ 'Ville actuelle': 'Rennes, France' }]),
  );
  json(
    'personal_information/information_about_you/possible_phone_numbers.json',
    legacy('inferred_data_possible_phone_numbers', [
      { 'Numéro de téléphone': '+33 6 00 00 00 01' },
    ]),
  );
  json(
    'personal_information/autofill_information/autofill_information.json',
    legacy('ig_autofill_information', [
      {
        'Adresse e-mail': 'camille.ferrand@example.invalid',
        'Code postal': '35000',
        Ville: 'Rennes',
      },
    ]),
  );

  /* ————— Relations ————— */
  const followers = handles
    .slice(0, 240)
    .map((h, i) => ({ value: h, ts: EXPORT_DAY - (60 + i * 4) * DAY }));
  const following = handles
    .slice(120, 500)
    .map((h, i) => ({ value: h, ts: EXPORT_DAY - (30 + i * 3) * DAY }));
  json('connections/followers_and_following/followers_1.json', listData(followers));
  json(
    'connections/followers_and_following/following.json',
    listData(following, 'relationships_following'),
  );
  json(
    'connections/followers_and_following/close_friends.json',
    listData(
      handles.slice(0, 12).map((h, i) => ({ value: h, ts: EXPORT_DAY - (200 + i * 30) * DAY })),
      'relationships_close_friends',
    ),
  );
  json(
    'connections/followers_and_following/blocked_profiles.json',
    listData(
      handles.slice(500, 505).map((h, i) => ({ value: h, ts: EXPORT_DAY - (400 + i * 50) * DAY })),
      'relationships_blocked_users',
    ),
  );
  json(
    'connections/followers_and_following/hide_story_from.json',
    listData(
      handles.slice(505, 515).map((h, i) => ({ value: h, ts: EXPORT_DAY - (300 + i * 20) * DAY })),
      'relationships_hide_stories_from',
    ),
  );
  json(
    'connections/followers_and_following/pending_follow_requests.json',
    listData(
      handles.slice(515, 522).map((h, i) => ({ value: h, ts: EXPORT_DAY - (100 + i * 15) * DAY })),
      'relationships_follow_requests_sent',
    ),
  );

  /* ————— Geo: a login trail, one declared city, one last known point ————— */
  json(
    'security_and_login_information/login_and_profile_creation/login_activity.json',
    legacy(
      'account_history_login_history',
      // 400 logins (the maintainer's figure), spread over the whole life of the account so the time
      // cursor has something to reveal rather than one block at the end.
      Array.from({ length: 400 }, (_, i) => {
        return {
          'Adresse IP': pick(r, TRAIL_POOL),
          Heure: String(EXPORT_DAY - Math.floor(r() * 1200) * DAY),
          'Code de langue': locale === 'fr' ? 'fr_FR' : 'en_GB',
          "Agent d'utilisateur": i % 3 === 0 ? 'Instagram Android' : 'Mozilla/5.0 (iPhone)',
          Port: String(40_000 + Math.floor(r() * 20_000)),
        };
      }),
    ),
  );
  json(
    'security_and_login_information/login_and_profile_creation/last_known_location.json',
    legacy('account_history_imprecise_last_known_location', [
      {
        'Latitude imprécise': '48.11',
        'Longitude imprécise': '-1.68',
        'Heure de mise à jour': String(EXPORT_DAY - 3 * DAY),
      },
    ]),
  );
  json('security_and_login_information/login_and_profile_creation/signup_details.json', {
    /**
     * ⚠ THE SIGN-UP DATE LIVES IN THE ENTRY'S `timestamp`, NOT IN ITS `value`, and it is what
     * every « X ans d'activité » on the page is computed from — the ad value included. Written as
     * a string, the whole dossier reads « 0 ans » with nothing anywhere saying why.
     */
    account_history_registration_info: [
      {
        string_map_data: {
          'Adresse IP': { value: '203.0.113.7' },
          Heure: { timestamp: EXPORT_DAY - 1400 * DAY },
          'Nom d’utilisateur': { value: SELF_HANDLE },
        },
      },
    ],
  });
  /**
   * ⚠ THE TRAJECTORY IS READ FROM `profile_activity`, NOT from `login_activity` — and its date comes
   * from « Dernière connexion », not « Heure ». Written with the wrong label, every point was dated
   * `undefined` and dropped one line later: 400 logins produced 0 cities, and the map said so
   * without saying why. The recent dialect here, in the export's own language, which is also what
   * exercises the label table's French path.
   *
   * 400 connections (the maintainer's figure), weighted onto Paris, London and Berlin so the density
   * field has three real zones rather than an even sprinkle, plus ten cities around them.
   */
  json(
    'security_and_login_information/login_and_profile_creation/profile_activity.json',
    recent(
      Array.from({ length: 400 }, (_, i) => {
        const ts = EXPORT_DAY - Math.floor(r() * 1300) * DAY - Math.floor(r() * DAY);
        return {
          ts,
          values: [
            ['Adresse IP', pick(r, TRAIL_POOL)],
            ['ID d’appareil', `dev-${(i % 6) + 1}`],
            ['Type', i % 23 === 0 ? 'Checkpoint' : 'Connexion'],
            ['Dernière connexion', String(ts)],
          ] as ReadonlyArray<[string, string]>,
        };
      }),
    ),
  );

  /* ————— The 500 varied interactions (spec) —————
     Varied ON PURPOSE: the crowd and the spiral need differentiated events to play, not one cloud of
     the same gesture repeated. */
  const spread = (n: number, from: number, to: number): number[] =>
    Array.from({ length: n }, (_, i) => Math.round(from + ((to - from) * i) / Math.max(1, n - 1)));

  json('your_instagram_activity/likes/liked_comments.json', {
    likes_comment_likes: spread(120, EPOCH, EXPORT_DAY - 5 * DAY).map((ts, i) => ({
      title: pick(r, handles),
      string_list_data: [{ href: '', value: '👍', timestamp: ts + (i % 7) * 3600 }],
    })),
  });
  json('your_instagram_activity/story_interactions/story_likes.json', {
    story_activities_story_likes: spread(150, EPOCH, EXPORT_DAY - 2 * DAY).map((ts, i) => ({
      title: pick(r, handles),
      string_list_data: [{ href: '', value: '❤️', timestamp: ts + (i % 5) * 3600 }],
    })),
  });
  json('your_instagram_activity/story_interactions/polls.json', {
    story_activities_polls: spread(60, EPOCH + 200 * DAY, EXPORT_DAY - 10 * DAY).map((ts, i) => ({
      title: pick(r, handles),
      string_list_data: [
        { href: '', value: pick(r, POLL_QUESTIONS[locale]), timestamp: ts + i * 60 },
      ],
    })),
  });
  json(
    'your_instagram_activity/comments/post_comments_1.json',
    recent(
      spread(110, EPOCH + 100 * DAY, EXPORT_DAY - 4 * DAY).map((ts, i) => ({
        ts,
        values: [
          ['Commentaire', pick(r, COMMENTS[locale])],
          ['Propriétaire du média', handles[(i * 7) % handles.length] as string],
          ['Heure', String(ts)],
        ] as ReadonlyArray<[string, string]>,
      })),
    ),
  );
  json(
    'your_instagram_activity/comments/reels_comments.json',
    recent(
      spread(60, EPOCH + 400 * DAY, EXPORT_DAY - 8 * DAY).map((ts, i) => ({
        ts,
        values: [
          ['Commentaire', pick(r, COMMENTS[locale])],
          ['Propriétaire du média', handles[(i * 11) % handles.length] as string],
          ['Heure', String(ts)],
        ] as ReadonlyArray<[string, string]>,
      })),
    ),
  );

  /* ————— Published media: stories and posts, so the universe has a source other than messages ————— */
  json('your_instagram_activity/media/stories.json', {
    ig_stories: spread(90, EPOCH + 150 * DAY, EXPORT_DAY - 6 * DAY).map((ts, i) => {
      const path = `media/stories/story_${i}.png`;
      files[path] = gradientPng(900 + i);
      const p = PLACES[i % PLACES.length] as (typeof PLACES)[number];
      return {
        uri: path,
        creation_timestamp: ts,
        title: '',
        media_metadata:
          i % 3 === 0
            ? { photo_metadata: { exif_data: [{ latitude: p.lat, longitude: p.lon }] } }
            : undefined,
      };
    }),
  });
  json(
    'your_instagram_activity/media/posts_1.json',
    spread(40, EPOCH + 60 * DAY, EXPORT_DAY - 12 * DAY).map((ts, i) => {
      const path = `media/posts/post_${i}.png`;
      files[path] = gradientPng(1300 + i);
      return {
        media: [{ uri: path, creation_timestamp: ts, title: '' }],
        title: '',
        creation_timestamp: ts,
      };
    }),
  );
  // ⚠ THE SPLIT THE CONTRACT NAMES: `posts_1.json` carries the URI, `posts.json` carries the GPS,
  // and the map joins them on the timestamp. Writing only one of the two would leave the map's
  // declared layer empty on an archive that clearly has posts.
  json(
    'your_instagram_activity/media/posts.json',
    recent(
      spread(40, EPOCH + 60 * DAY, EXPORT_DAY - 12 * DAY).map((ts, i) => {
        const p = pick(r, PLACES);
        return {
          ts,
          values: [
            ['Latitude', (p.lat + (i % 5) * 0.01).toFixed(4)],
            ['Longitude', (p.lon + (i % 7) * 0.01).toFixed(4)],
            ['Heure de mise à jour', String(ts)],
          ] as ReadonlyArray<[string, string]>,
        };
      }),
    ),
  );
  json('your_instagram_activity/media/archived_posts.json', { ig_archived_post_media: [] });
  json('your_instagram_activity/comments/hype.json', []);

  /* ————— Ad value ————— */
  json('ads_information/instagram_ads_and_businesses/other_categories_used_to_reach_you.json', {
    label_values: [
      {
        label: 'Autres catégories',
        vec: AD_CATEGORIES[locale].map((value) => ({ value })),
      },
    ],
  });

  /* ————— The export request, which is what dates the archive ————— */
  json(
    'your_instagram_activity/other_activity/your_information_download_requests.json',
    legacy('instagram_information_download_requests', [
      { 'Heure de la demande': String(EXPORT_DAY - DAY), 'Heure de fin': String(EXPORT_DAY) },
    ]),
  );

  /* ————— The threads, and their attachments ————— */
  writeThreads(files, locale, r);

  return {
    bytes: zipSync(files, { level: 0 }),
    fileName: `instagram-${SELF_HANDLE}-demo.zip`,
  };
}

/**
 * Writes the twenty threads, their pages and their attachments.
 *
 * ⚠ PAGED IN REVERSE (contract §0.1): `message_1.json` holds the MOST RECENT messages and the
 * numbering grows backwards through time. A demo that paged forwards would be the one archive in
 * existence that reads in the wrong order — and the reader that gets it wrong shows nothing at all.
 *
 * ⚠ AND A MEDIA MESSAGE HAS NO `content` KEY, rather than an empty one. That is the trap the
 * contract names: a reader keyed on `content` silently drops every photo, voice note and reel, and
 * this is the archive that would have to catch it.
 */
function writeThreads(files: Record<string, Uint8Array>, locale: Locale, r: () => number): void {
  /**
   * ⚠ ONE PATH PER FILE, and the bytes are what is shared. Pointing 750 messages at two URIs made
   * the demo the one archive where a path is not unique — which is legal in the format and turned
   * out to break the media scene's reuse map (see `UniverseModule`). A real export names each file
   * once; so does this one. The bytes behind them are identical and the zip stores them as such.
   */
  const video = minimalMp4();
  const audio = silentM4a();
  let photoSeed = 0;
  let clipSeed = 0;
  let voiceSeed = 0;

  // ⚠ COMPOSED FIRST, ATTACHED AFTER. The spec fixes the TOTALS (1 000 photos, 500 videos, 250 voice
  // notes), so they are handed out across the whole inbox rather than drawn thread by thread: a
  // share rolled per message lands wherever chance puts it, and the platform card promises the
  // figure, not a distribution.
  const composed = THREADS.map((spec) => ({ spec, messages: composeThread(spec, locale, r) }));
  attachMedia(composed);

  for (const { spec, messages } of composed) {
    const dir = `your_instagram_activity/messages/inbox/${spec.handle}_1789${spec.handle.length}`;

    // Attachments: the share of the thread that carries a media instead of text.
    const built = messages.map((m, _i) => {
      if (!m.media) return m;
      // ⚠ THE MIX IS THE SPEC'S — 1 000 photos, 500 videos, 250 voice notes — so it is COUNTED
      // rather than sampled: a share drawn per message lands wherever chance puts it, and the demo
      // would promise « toutes les photos, vidéos et vocaux échangés » over whatever came out.
      const kind = m.kind as 'photo' | 'video' | 'audio';
      if (kind === 'photo') {
        const uris: string[] = [];
        for (let k = 0; k < (m.count ?? 1); k++) {
          const path = `${dir}/photos/${photoSeed}.png`;
          files[path] = gradientPng(photoSeed++);
          uris.push(path);
        }
        return { ...m, attach: { key: 'photos', uris } };
      }
      if (kind === 'video') {
        const path = `${dir}/videos/${clipSeed++}.mp4`;
        files[path] = video;
        return { ...m, attach: { key: 'videos', uris: [path] } };
      }
      const path = `${dir}/audio/${voiceSeed++}.m4a`;
      files[path] = audio;
      return { ...m, attach: { key: 'audio_files', uris: [path] } };
    });

    const participants = [
      { name: SELF },
      { name: spec.titleFr },
      ...(spec.others ?? []).map((name) => ({ name })),
    ];
    const title = locale === 'fr' ? spec.titleFr : spec.titleEn;

    // Newest first inside a page, and page 1 holds the newest.
    const PAGE = 400;
    const newestFirst = [...built].reverse();
    for (let p = 0; p * PAGE < newestFirst.length; p++) {
      const slice = newestFirst.slice(p * PAGE, (p + 1) * PAGE);
      files[`${dir}/message_${p + 1}.json`] = strToU8(
        JSON.stringify({
          participants,
          messages: slice.map((m) => ({
            sender_name: m.self ? SELF : m.from,
            timestamp_ms: m.ts * 1000,
            // ⚠ ONE payload sibling, never two, and never an empty `content` beside a media.
            ...(m.attach === undefined
              ? { content: m.text }
              : {
                  [m.attach.key]: m.attach.uris.map((uri) => ({
                    uri,
                    creation_timestamp: m.ts,
                  })),
                }),
            is_geoblocked_for_viewer: false,
            is_unsent_image_by_messenger_kid_parent: false,
          })),
          title,
          is_still_participant: true,
          thread_path: `inbox/${spec.handle}`,
          magic_words: [],
        }),
      );
    }
  }
}

/**
 * Hands the ratified totals out across the inbox: 1 000 photos, 500 videos, 250 voice notes.
 *
 * ⚠ ROUND-ROBIN ACROSS THREADS, WEIGHTED BY LENGTH, and never on a beat. A beat is a written scene;
 * replacing one of its lines with a photo would put a hole in the middle of the one thing the AI
 * piece is meant to read whole.
 */
function attachMedia(all: ReadonlyArray<{ spec: ThreadSpec; messages: Composed[] }>): void {
  // ⚠ ONE PASS, ROUND-ROBIN, DISTINCT MESSAGES. The first version indexed into each thread's free
  // messages with a ratio and pushed the SAME object several times: 1 750 assignments landed on a
  // few hundred messages, the last write won, and the whole inbox came out as voice notes. The
  // interleave is what spreads the mix across threads instead of filling the first one.
  /**
   * ⚠ THE POOL IS TOPPED UP RATHER THAN THE SHARES TUNED. The totals are ratified, so they cannot
   * depend on a filler share landing right: when the messages marked by `mediaShare` are not enough,
   * any other NON-BEAT message is recruited. A beat is never touched — replacing a written line with
   * a photo puts a hole in the middle of the one thing the AI piece is meant to read whole.
   */
  const queues = all.map(({ spec, messages }) => {
    // ⚠ A THREAD AT ZERO STAYS AT ZERO. `mediaShare: 0` is a statement about the thread, not a low
    // probability: the recruiting below would otherwise hand an attachment to the one thread whose
    // point is that every line was written.
    if (spec.mediaShare === 0) return [];
    const marked = messages.filter((m) => m.media);
    const spare = messages.filter((m) => !m.media && !m.fromBeat);
    return [...marked, ...spare];
  });
  const order: Composed[] = [];
  for (let round = 0; ; round++) {
    let moved = false;
    for (const q of queues) {
      const next = q[round];
      if (next === undefined) continue;
      order.push(next);
      moved = true;
    }
    if (!moved) break;
  }

  /**
   * ⚠ A PHOTO MESSAGE MAY CARRY SEVERAL PHOTOS, and the format says so: `photos` is an array. It is
   * also what an inbox looks like — one message, four pictures of the same evening. Without it the
   * ratified totals would need 1 750 messages out of 4 100 to be attachments, and the threads would
   * read as a photo dump rather than as conversations.
   */
  const want: Array<['photo' | 'video' | 'audio', number]> = [
    ['photo', 1000],
    ['video', 500],
    ['audio', 250],
  ];
  let at = 0;
  for (const [kind, n] of want) {
    let left = n;
    while (left > 0 && at < order.length) {
      const m = order[at++] as Composed;
      const take = kind === 'photo' ? Math.min(left, 1 + (at % 3)) : 1;
      m.kind = kind;
      m.count = take;
      left -= take;
    }
  }
  // What was marked but got no kind carries none: the totals are the spec's, not the filler's.
  for (const { messages } of all) {
    for (const m of messages) m.media = m.kind !== undefined;
  }
}

interface Composed {
  readonly self: boolean;
  readonly from: string;
  readonly text: string;
  readonly ts: number;
  media: boolean;
  /** Set by `attachMedia` on the messages that end up carrying one. */
  kind?: 'photo' | 'video' | 'audio';
  /** How many files that message carries — a photo message may hold several. */
  count?: number;
  /** Written scene, never turned into an attachment. */
  readonly fromBeat: boolean;
  readonly attach?: { key: string; uris: readonly string[] };
}

/**
 * One thread, from its beats and its banks.
 *
 * ⚠ THE BEATS KEEP THEIR ORDER AND THEIR CONTIGUITY. The AI piece samples RUNS of messages, so a
 * scene split across the filler would never be read whole — which would make the arcs invisible to
 * the one feature they exist for.
 */
function composeThread(spec: ThreadSpec, locale: Locale, r: () => number): Composed[] {
  const out: Composed[] = [];
  const other = spec.others === undefined ? spec.titleFr : undefined;
  const speaker = () =>
    other ??
    (spec.others as readonly string[])[
      Math.floor(r() * (spec.others as readonly string[]).length)
    ] ??
    spec.titleFr;

  const beatDays = new Set(spec.beats.map((b) => b.day));
  const fillerCount = Math.max(
    0,
    spec.messages - spec.beats.reduce((n, b) => n + b.lines.length, 0),
  );
  const span = Math.max(1, spec.toDay - spec.fromDay);

  // The filler's days: spread across the thread's life, denser in its middle — a conversation is not
  // uniform, and a heat map on a uniform thread shows one flat band.
  const days: number[] = [];
  for (let i = 0; i < fillerCount; i++) {
    const t = i / Math.max(1, fillerCount - 1);
    const bell = 0.5 - Math.cos(Math.PI * t) / 2;
    days.push(spec.fromDay + Math.round(span * (0.15 * t + 0.85 * bell)));
  }
  days.sort((a, b) => a - b);

  const authored = spec.beats.reduce((n, b) => n + b.lines.length, 0);
  let beatsLeft = authored;
  let di = 0;
  const emitFiller = (untilDay: number) => {
    while (di < days.length && (days[di] as number) <= untilDay) {
      // ⚠ THE TARGET IS A COUNT OF MESSAGES, and a filler slot now emits one to three of them. The
      // budget is checked per slot, or the ratified volumes drift by a third.
      if (out.length + beatsLeft >= spec.messages) return;
      const day = days[di++] as number;
      /**
       * ⚠ THE THREE BANKS ARE THREE MESSAGES, NOT ONE SENTENCE. Gluing an opener, a subject and a
       * tail into one string produced « dis les clés je m'en occupe » — word salad, which the AI
       * piece then sampled as if it were speech. People text in short consecutive turns, and the
       * banks are written as whole lines: emitted as such, a run reads as an exchange even when
       * nothing is being said.
       */
      const at = EPOCH + day * DAY + Math.floor(r() * 14 * 3600) + 8 * 3600;
      const turn = [
        pick(r, spec.bank.openers),
        pick(r, spec.bank.subjects),
        pick(r, spec.bank.tails),
      ];
      const lines = r() < 0.4 ? turn.slice(0, 1 + Math.floor(r() * 3)) : [turn[1] as Line];
      // The last slot may overshoot by a line or two; trimmed here so the volume is exact.
      const room = spec.messages - beatsLeft - out.length;
      for (const [k, line] of lines.slice(0, Math.max(1, room)).entries()) {
        out.push({
          self: line.self,
          from: speaker(),
          text: line[locale],
          ts: at + k * (30 + Math.floor(r() * 90)),
          media: k === 0 && r() < spec.mediaShare,
          fromBeat: false,
        });
      }
    }
  };

  for (const beat of spec.beats) {
    emitFiller(beat.day - 1);
    beatsLeft -= beat.lines.length;
    let at = EPOCH + beat.day * DAY + 9 * 3600 + Math.floor(r() * 8 * 3600);
    for (const line of beat.lines) {
      at += 40 + Math.floor(r() * 400);
      out.push({
        self: line.self,
        from: speaker(),
        text: line[locale],
        ts: at,
        media: false,
        fromBeat: true,
      });
    }
  }
  emitFiller(spec.toDay);

  out.sort((a, b) => a.ts - b.ts);
  // A thread that opens on a beat day should still open on its beat: the sort above is stable, and
  // the filler for that day was emitted before it.
  void beatDays;
  return out;
}
