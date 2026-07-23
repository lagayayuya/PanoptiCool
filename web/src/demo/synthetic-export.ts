// Bundled synthetic sample — demo persona (PANO R&D, "honest demo" session rework).
// Reconstructed into a `TikTokExport` (via `validTikTokExport` + populated Comment/Searches/Watch
// History/Following/Like List) to exercise the REAL PRE-PROCESSING (`ingestExportStreaming` +
// `computeInsights`), not a shortcut that skips the engine: each theme displayed by the demo is what
// the engine ACTUALLY detects on these items (D1/D2, `engine/detect/detect.ts`), locked by
// `synthetic-export.test.ts`.
//
// No content from a real export: a 100% invented persona, zero PII (CLAUDE.md). Two variants,
// the SAME persona and the SAME aggregated numbers (views, likes, follows, 14 comments, 24 searches,
// rhythm): at equal volume, the output gap between the two measures the LANGUAGE and nothing else.
//
// Both lists are written as people, never as sets of triggers — what
// the detector draws from them is a MEASUREMENT, taken after the fact, and it lives in
// `synthetic-export.test.ts` (real pipeline, D1 + D2). No theme count is announced here: a header
// that predicts the engine's output becomes false at the first lexicon batch, with nothing to signal it.

import { strToU8, zipSync } from 'fflate';
import { validTikTokExport } from '../engine/valid-export.fixture';
import type { Locale } from '../i18n/locales';

interface SyntheticItem {
  kind: 'comment' | 'search';
  text: string;
}

// --- FR items (38: 14 comments + 24 searches) — order = order of appearance, filler first ---
// (the "low data" panel, `AnalysisPage.tsx`, truncates to the FIRST N items: the first ones
// stay neutral on purpose, the items that trigger a theme come after).
//
// Verified by `synthetic-export.test.ts` by running `detectLabels` (real D1 + D2) on EXACTLY
// these texts: D1 → {mental_health, conflictual}; D2 (after the PANO-75 floor) → {chats (2 items),
// cinema_series (3 items: « spin off », « kubrick »/« cinéma », and the « netflix » of the
// conflictual comment — an item SHARED between the two themes, cf. below)}. Nothing else crosses the
// floor (`sneakers`/`voitures`/`coiffure` graze 1 item each, below the floor of 2 — an honest side
// effect of the real lexicon, not a hand-picked fixture).
const SYNTHETIC_ITEMS_FR: readonly SyntheticItem[] = [
  { kind: 'search', text: 'horaires ouverture pharmacie dimanche' },
  { kind: 'search', text: 'météo demain matin' },
  { kind: 'comment', text: 'enfin le week-end, j’ai trop hâte de dormir un peu plus' },
  { kind: 'search', text: 'prix billet train pas cher' },
  { kind: 'comment', text: 'le nouveau resto du quartier est sympa, faudra y retourner' },
  { kind: 'search', text: 'combien de temps cuire un œuf dur' },
  { kind: 'comment', text: 'il pleut encore aujourd’hui, marre de ce temps' },
  { kind: 'search', text: 'comment nettoyer des baskets blanches' },
  { kind: 'comment', text: 'petit tour au marché ce matin, plein de monde' },
  { kind: 'search', text: 'adresse mairie plus proche' },
  // --- chats (D2, floor 2 items) ---
  { kind: 'comment', text: 'miaou' },
  { kind: 'comment', text: 'quand le mien était encore chaton il était pareil' },
  { kind: 'search', text: 'heure ouverture supermarché dimanche' },
  // --- cinema_series (D2) ---
  {
    kind: 'comment',
    text: 'on attend toujours le spin off..',
  },
  {
    kind: 'comment',
    text: 'si tu veux du vrai cinéma regarde un kubrick',
  },
  { kind: 'search', text: 'comment faire une capture écran' },
  // --- conflictual (D1, item-level) + cinema_series (3rd item, « netflix »): insult emitted, targets
  // 2nd person — the same comment feeds both themes (shared evidence store, C5).

  {
    kind: 'comment',
    text: 'tu es juste stupide, les séries netflix ne valent pas le détour',
  },
  { kind: 'search', text: 'différence entre thym et origan' },
  { kind: 'comment', text: 'vivement les vacances, j’ai besoin de changer d’air' },
  { kind: 'search', text: 'comment se désinscrire d’une newsletter' },
  { kind: 'comment', text: 'j’ai enfin fini de ranger l’appart, ça fait du bien' },
  { kind: 'search', text: 'prix moyen loyer studio' },
  { kind: 'comment', text: 'merci pour les conseils, ça m’a bien aidé' },
  { kind: 'search', text: 'comment plier une chemise' },
  { kind: 'comment', text: 'content pour toi, bonne nouvelle !' },
  { kind: 'search', text: 'durée de vie moyenne ampoule led' },
  { kind: 'comment', text: 'petite balade au parc cet après-midi, il faisait beau' },
  { kind: 'search', text: 'comment réinitialiser un mot de passe' },
  { kind: 'search', text: 'numéro service client la poste' },
  // --- mental_health (D1, explicit): search about burnout testimonials ---
  { kind: 'search', text: 'témoignages burn out' },
  { kind: 'search', text: 'comment enlever une tache de gras' },
  { kind: 'search', text: 'distance paris marseille en voiture' },
  { kind: 'search', text: 'comment éteindre les notifications d’une appli' },
  { kind: 'search', text: 'prix moyen coupe de cheveux' },
  { kind: 'search', text: 'comment désembuer un pare-brise' },
  { kind: 'search', text: 'horaires bus ligne 12' },
  { kind: 'search', text: 'comment congeler du pain' },
  { kind: 'search', text: 'comment changer la pile d’une télécommande' },
];

// --- EN items (38: 14 comments + 24 searches), SAME layout as FR --------------------------------
// The SAME person as the FR list, transposed into an English-speaking life (US register): the cat, the taste
// for cinema, the background fatigue, a moment of mood, chores. This is NOT a translation — a
// French speaker's chores translated into English describe nobody (« city hall address » is
// nobody's errand in the United States).
//
// Three writing rules carried over from the FR list, because they are what holds the persona together:
//   1. a comment is HALF a conversation — a reply to a video one does not see,
//      never a self-standing opinion. « mine does this exact thing at 4am » reads; a full
//      and punctuated review does not read as a comment;
//   2. the sensitive goes through a SEARCH and at a distance (« burnout recovery stories » — other
//      people's subject), while the fatigue is diluted into comments that diagnose
//      nothing. This is the product's point: the deduction is born from banal accumulation, not from a confession;
//   3. a high and deliberate noise floor — the overwhelming majority of items mean nothing.
//
// SAME aggregates as FR (14/24): at identical volume, a FR↔EN output gap measures the language and
// nothing else. What these texts ACTUALLY trigger is measured by `synthetic-export.test.ts`,
// which runs the real detector — never announced here.
const SYNTHETIC_ITEMS_EN: readonly SyntheticItem[] = [
  { kind: 'search', text: 'pharmacy hours sunday' },
  { kind: 'search', text: 'weather tomorrow morning' },
  { kind: 'comment', text: 'friday finally, sleeping in til noon and nobody can stop me' },
  { kind: 'search', text: 'cheapest way to book train tickets' },
  { kind: 'comment', text: 'the new place on the corner is actually good, going back friday' },
  { kind: 'search', text: 'how long to boil an egg' },
  { kind: 'comment', text: 'raining again, i give up' },
  { kind: 'search', text: 'how to clean white sneakers' },
  { kind: 'comment', text: 'went to the farmers market this morning, way too many people' },
  { kind: 'search', text: 'dmv appointment near me' },
  // --- chats ---
  { kind: 'comment', text: 'mine does this exact thing at 4am' },
  { kind: 'comment', text: 'he was like this as a kitten too and never grew out of it' },
  { kind: 'search', text: 'grocery store hours sunday' },
  // --- cinema_series ---
  { kind: 'comment', text: 'still waiting on the spin off..' },
  { kind: 'comment', text: 'if you want actual cinema go watch a kubrick' },
  { kind: 'search', text: 'how to take a screenshot on windows' },
  // --- targeted mood (2nd person) + « netflix »: a single item can feed two themes (C5) ---
  { kind: 'comment', text: 'nah you’re just stupid, netflix shows aren’t worth the time' },
  { kind: 'search', text: 'thyme vs oregano difference' },
  { kind: 'comment', text: 'vacation cannot come soon enough, i need out of here' },
  { kind: 'search', text: 'how to unsubscribe from emails' },
  { kind: 'comment', text: 'finally cleaned the whole apartment, feels like a different place' },
  { kind: 'search', text: 'average rent one bedroom' },
  { kind: 'comment', text: 'thanks for this, genuinely helped' },
  { kind: 'search', text: 'how to fold a fitted sheet' },
  { kind: 'comment', text: 'happy for you!! big news' },
  { kind: 'search', text: 'how long do led bulbs last' },
  { kind: 'comment', text: 'walked around the park all afternoon, actually nice out' },
  { kind: 'search', text: 'how to reset password' },
  { kind: 'search', text: 'usps customer service number' },
  // --- fatigue, at a distance: the subject is other people's ---
  { kind: 'search', text: 'burnout recovery stories' },
  { kind: 'search', text: 'how to get grease stain out' },
  { kind: 'search', text: 'chicago to detroit drive time' },
  { kind: 'search', text: 'turn off app notifications' },
  { kind: 'search', text: 'average haircut price' },
  { kind: 'search', text: 'how to defog windshield fast' },
  { kind: 'search', text: 'bus schedule route 12' },
  { kind: 'search', text: 'can you freeze bread' },
  { kind: 'search', text: 'how to change remote battery' },
];

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

/** `YYYY-MM-DD HH:MM:SS` (UTC, contract §1.1) from an epoch — never a machine timezone. */
function fmtUtc(ms: number): string {
  const iso = new Date(ms).toISOString(); // 2026-07-16T10:20:30.000Z
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)}`;
}

function fmtUtcSuffixed(ms: number): string {
  return `${fmtUtc(ms)} UTC`;
}

/** UTC midnight of the day containing `ms`. */
function dayFloor(ms: number): number {
  return Math.floor(ms / DAY_MS) * DAY_MS;
}

/** Comments/Searches: dates spread over the last ~55 days before `now`, in the array's order
 * (oldest first — reflects an export where the most recent items close the list). */
function withDates(
  items: readonly SyntheticItem[],
  now: number,
): (SyntheticItem & { ms: number })[] {
  const spanMs = 55 * DAY_MS;
  const stepMs = spanMs / items.length;
  return items.map((item, i) => ({ ...item, ms: now - spanMs + i * stepMs }));
}

/**
 * Watching rhythm (PANO-57/85, honest this time: it is the real `Watch History` that feeds the
 * graph, not a hand-typed histogram). ONE session/day, night bias (hour cycle
 * mostly 23h–4h, the product's "night" window — `activity-rhythm.ts`):
 *   - 30 recent days × 14 videos/day = 420 (30-day window);
 *   - 335 older days (31→365 d) totaling 5680 (320 days at 17, 15 days at 16);
 *   - total = 6100 (12-month window, `videosWatched.last12Months`);
 *   - a 16 s gap between videos of a same session (never two sessions/day → no risk of
 *     inter-session merging, `SESSION_GAP_MS` = 5 min in `activity-rhythm.ts`) gives an estimate
 *     of about 28-29 h of watching — a REAL computation done by the rule, not a recopied value.
 */
const NIGHT_BIASED_HOUR_CYCLE = [23, 0, 1, 2, 22, 3, 20, 21, 14, 10, 19, 4];
const RECENT_DAYS = 30;
const RECENT_PER_DAY = 14; // 30 * 14 = 420
const OLDER_DAYS = 335;
const OLDER_BASE_PER_DAY = 16;
const OLDER_BONUS_DAYS = 320; // 320*17 + 15*16 = 5680
const INTRA_SESSION_GAP_MS = 16 * 1000;

function watchSessionsFor(now: number, days: number, perDay: (dayIndex: number) => number) {
  const sessions: { startMs: number; size: number }[] = [];
  for (let d = 0; d < days; d++) {
    const dayStart = dayFloor(now) - d * DAY_MS;
    const hour = NIGHT_BIASED_HOUR_CYCLE[d % NIGHT_BIASED_HOUR_CYCLE.length] ?? 0;
    const minute = (d * 7) % 60;
    sessions.push({ startMs: dayStart + hour * HOUR_MS + minute * MINUTE_MS, size: perDay(d) });
  }
  return sessions;
}

function buildWatchHistory(now: number): { Date: string; Link: string; Title: string }[] {
  const recent = watchSessionsFor(now, RECENT_DAYS, () => RECENT_PER_DAY);
  // 31-day offset to open the "older" window (30 recent days, never overlapped).
  const older = watchSessionsFor(now - 31 * DAY_MS, OLDER_DAYS, (d) =>
    d < OLDER_BONUS_DAYS ? OLDER_BASE_PER_DAY + 1 : OLDER_BASE_PER_DAY,
  );
  const items: { Date: string; Link: string; Title: string }[] = [];
  let i = 0;
  for (const session of [...recent, ...older]) {
    for (let k = 0; k < session.size; k++) {
      items.push({
        Date: fmtUtc(session.startMs + k * INTRA_SESSION_GAP_MS),
        Link: `https://www.tiktokv.com/share/video/synthetic-${i}/`,
        Title: '',
      });
      i++;
    }
  }
  return items;
}

/** 300 synthetic followed accounts (R3, `comptes suivis`) — invented usernames, zero PII. */
function buildFollowing(now: number): { Date: string; UserName: string }[] {
  const count = 300;
  return Array.from({ length: count }, (_, i) => ({
    Date: fmtUtc(now - (count - i) * DAY_MS * 0.6),
    UserName: `compte_suivi_${String(i + 1).padStart(4, '0')}`,
  }));
}

/** 2700 synthetic likes (R5, « likes, favoris et republications » — favorites/reposts at 0
 * here, so the displayed count is exactly 2700). */
function buildLikes(now: number): { date: string; link: string }[] {
  const count = 2700;
  return Array.from({ length: count }, (_, i) => ({
    date: fmtUtc(now - (count - i) * HOUR_MS * 3),
    link: `https://www.tiktokv.com/share/video/synthetic-like-${i}/`,
  }));
}

function buildComments(items: readonly (SyntheticItem & { ms: number })[]) {
  return items
    .filter((i) => i.kind === 'comment')
    .map((i) => ({
      date: fmtUtcSuffixed(i.ms),
      comment: i.text,
      photo: '',
      video: '',
      sticker: '',
      originalPostUrl: '',
      'original post link': '',
    }));
}

function buildSearches(items: readonly (SyntheticItem & { ms: number })[]) {
  return items
    .filter((i) => i.kind === 'search')
    .map((i) => ({ Date: fmtUtc(i.ms), SearchTerm: i.text }));
}

/**
 * Builds an in-memory synthetic TikTok export `.zip` (never written to disk), for a
 * given language (items already in the right language).
 *
 * `maxItems` (optional, edge-case test panel, `ui/v2/AnalysisPage.tsx`): keeps only the
 * first N items (comments + searches combined, source array order) instead of the full
 * list. `now` (optional, testability): injected clock, default = `Date.now()` — Watch
 * History/Following/Like List and the comment/search dates are ALWAYS computed relative
 * to `now`, never hard-coded 2026 dates: the demo stays correct whatever the execution date.
 */
function buildZip(
  sourceItems: readonly SyntheticItem[],
  maxItems: number | undefined,
  now: number,
): Uint8Array {
  const base = structuredClone(validTikTokExport());
  const sliced = maxItems === undefined ? sourceItems : sourceItems.slice(0, Math.max(0, maxItems));
  const dated = withDates(sliced, now);

  const comments = buildComments(dated);
  const searches = buildSearches(dated);
  const following = buildFollowing(now);
  const likes = buildLikes(now);
  const watchHistory = buildWatchHistory(now);

  const merged = {
    ...base,
    Comment: { Comments: { App: 0, CommentsList: comments } },
    'Likes and Favorites': {
      ...base['Likes and Favorites'],
      'Like List': { App: 0, ItemFavoriteList: likes },
    },
    'Profile And Settings': {
      ...base['Profile And Settings'],
      Following: { App: 0, IsFastLane: false, Following: following },
    },
    'Your Activity': {
      ...base['Your Activity'],
      'Activity Summary': {
        ActivitySummaryMap: {
          note: '',
          videosCommentedOnSinceAccountRegistration: comments.length,
          videosSharedSinceAccountRegistration: 0,
          // ALL-TIME (watched to the end since registration) — the demo's target number.
          videosWatchedToTheEndSinceAccountRegistration: 50_000,
        },
      },
      Searches: { SearchList: searches },
      'Watch History': { VideoList: watchHistory },
    },
  };

  const json = JSON.stringify(merged);
  return zipSync({ 'user_data_tiktok.json': strToU8(json) });
}

/** FR variant (the one wired to the « Analyser les données test » button). */
export function buildSyntheticExportZip(maxItems?: number, now: number = Date.now()): Uint8Array {
  return buildZip(SYNTHETIC_ITEMS_FR, maxItems, now);
}

/**
 * EN variant — same aggregated numbers, same persona, texts in English. At identical volume and
 * persona, what is missing in English is read in the GAP with the FR output
 * (`synthetic-export.test.ts`): that is its primary reason for being, and it does not change.
 */
export function buildSyntheticExportZipEn(maxItems?: number, now: number = Date.now()): Uint8Array {
  return buildZip(SYNTHETIC_ITEMS_EN, maxItems, now);
}

/**
 * The DEMO's persona, in the page's language.
 *
 * ⚠ THIS IS NOT A TRANSLATION CONVENIENCE. The displayed evidence is VERBATIM: the unfolded demo
 * shows the exact text that triggered each deduction, highlighted term included. Serving the
 * French persona under the English interface would therefore display FRENCH comments as
 * evidence — on the page whose whole function is to make the person read what has been read
 * of them. The demo's language is not a label, it is the data itself.
 */
export function buildDemoExportZip(locale: Locale, maxItems?: number): Uint8Array {
  return locale === 'en' ? buildSyntheticExportZipEn(maxItems) : buildSyntheticExportZip(maxItems);
}
