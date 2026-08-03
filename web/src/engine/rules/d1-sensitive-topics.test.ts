// D1 goldens (PANO-71) — the STRUCTURAL guardrails of the PANO-70 §4 framing, locked down:
//   - 1 finding per detected label; `[]` if both channels are empty;
//   - `sensitive: true` on EVERY D1 finding;
//   - named tag ⇒ non-empty triggerTerms (B2); triggerTerms ⊂ the evidence text, character for
//     character;
//   - a fan on BOTH storeys (`ranked` on the named one, `equal` on the broad one), readings ⊆ the
//     lexicon's register (§5); never a fan on conflictual (B5);
//   - no per-reading confidence or weight (structural: a reading is a STRING);
//   - confidence capped at medium (explicit → medium, indirect → low);
//   - only the CITED crumbs exist (ADR-0003's memory bound, now by construction).
// Sentences are 100 % SYNTHETIC (invented here).
//
// CARRIED OVER AT REWORK A. Two locks change NATURE, and that has to be said rather than rewritten
// in silence:
//   - « claim ⊆ allowlist » no longer has an object: FAN findings have no sentence at all any more.
//     What is checked now is the DISTRIBUTION — a sentence exactly where there is no fan
//     (`conflictual` alone, on the D1 side);
//   - « a multi-label item stored ONCE » is INVERTED: the store is gone, the verbatim is DUPLICATED
//     between co-citing findings (yuya's arbitration, cost accepted). What remains to lock down —
//     and what was the real stake — is that each citation carries ITS OWN surfaces, not the other's.

import { describe, expect, it } from 'vitest';
import type { Evidence } from '../analysis';
import { WIRED_LEXICONS } from '../lexicon';
import { normalizeExport } from '../normalize';
import type { CommentItem, SearchItem, TikTokExport } from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import { d1ConflictualNamedClaim, readingText, sensitiveTopicName } from '../wording';
import { d1SensitiveTopics } from './d1-sensitive-topics';

/** Valid export whose `CommentsList`/`SearchList` carry the given texts (fixed dates, the rest
 * empty). Single channel by default (`searches = []`). */
function withChannels(
  comments: readonly string[],
  searches: readonly string[],
): ReturnType<typeof normalizeExport> {
  const base = validTikTokExport() as TikTokExport & {
    Comment: { Comments: { CommentsList: readonly CommentItem[] } };
    'Your Activity': { Searches: { SearchList: readonly SearchItem[] } };
  };
  base.Comment.Comments.CommentsList = comments.map((comment, i) => ({
    date: `2026-06-15 10:00:0${i % 10} UTC`,
    comment,
    photo: '',
    video: '',
    sticker: '',
    originalPostUrl: `https://example.invalid/post/${i}`,
    'original post link': '',
  }));
  base['Your Activity'].Searches.SearchList = searches.map((SearchTerm, i) => ({
    Date: `2026-06-16 11:00:0${i % 10}`,
    SearchTerm,
  }));
  return normalizeExport(base);
}

/** Historical alias (Comments only, Searches empty) — behavior of the EXISTING goldens UNCHANGED. */
const withComments = (texts: readonly string[]) => withChannels(texts, []);
/** Export where ONLY `SearchList` carries the given terms. */
const withSearches = (terms: readonly string[]) => withChannels([], terms);

/** Allowed readings (§5 register, via the wired lexicons), as TEXT — the lexicon carries the keys. */
const ALLOWED_READINGS = new Set(
  WIRED_LEXICONS.flatMap((l) => (l.kind === 'topical' ? [...l.readingTemplateIds] : [])).map(
    (key: string) => readingText('fr', key),
  ),
);

/** Rich synthetic corpus: explicit, indirect, multi-label, non-bearing. */
const RICH = [
  'ma dépression me suit depuis des années', // mental_health: BARE noun → broad (solo tier)
  'je cherche un bon psy dans le coin', // mental_health, indirect
  "t'es vraiment un abruti d'avoir écrit ça", // conflictual (emitted, targeted)
  'super recette de gâteau au chocolat', // non-bearing: must NEVER be cited
  'grosse manif demain contre la réforme', // politics, indirect (1/2)
  'les élections approchent, allez voter', // politics, indirect (2/2)
  // THE ONLY NAMED and TOPICAL finding of the corpus, and it was not in it. Without it, the
  // assertion on the named fan below met NO case at all: it went green for a reason that was not
  // its own (the only `medium` signal was `conflictual`, non-topical, which never has a fan). It
  // thereby survived a reversal of doctrine without going red.
  'je vais a la messe tous les dimanches', // religion EXPLICIT → named + `ranked` fan
];

const run = (texts: readonly string[]) => d1SensitiveTopics(withComments(texts));

/**
 * The storey is read off the CONFIDENCE, no longer off the sentence.
 *
 * These tests used to recognize a named finding by comparing its sentence to a set of expected
 * sentences. That was a proxy, and it fell with the sentences — but it was already one step too
 * many: `d1Level` DEFINES `explicit → medium` / `indirect → low`, so the confidence IS the storey,
 * with no intermediary to keep up to date. A test that goes through prose to read a property of
 * structure breaks at the first change of prose, which is exactly what just happened.
 */
const isNamedTier = (signal: { confidence: string }) => signal.confidence === 'medium';

describe('d1SensitiveTopics — shape', () => {
  it('Comments AND Searches empty → [] (guard preserved)', () => {
    expect(d1SensitiveTopics(normalizeExport(validTikTokExport()))).toEqual([]);
    expect(d1SensitiveTopics(withChannels([], []))).toEqual([]);
  });

  it('no bearing text → no detection, no crumb cited (§5.1 bound)', () => {
    expect(run(['belle lumière ce soir', 'recette de pain maison'])).toEqual([]);
  });

  it('1 finding PER detected LABEL', () => {
    const out = run(RICH);
    expect(out).toHaveLength(4); // mental_health + conflictual + politics + religion
    // The DISTINCTION used to be read off the claims; it is now read off the LABELS, which is in any
    // case the direct witness of « one finding per label ». Going through prose to count labels was
    // a detour, and it does not survive the disappearance of the prose.
    expect(new Set(out.map((s) => s.label)).size).toBe(4);
  });
});

describe('d1SensitiveTopics — structural goldens (PANO-70 §4 framing)', () => {
  const out = run(RICH);

  it('sensitive === true on every D1 finding (ex-`sensitivity === 3`, always 3 — §2.1)', () => {
    for (const signal of out) {
      expect(signal.sensitive).toBe(true);
    }
  });

  it('ONLY `conflictual` carries a sentence — fan findings no longer have one', () => {
    // This test used to check that the storey picked the RIGHT claim. The claims of the fan labels
    // no longer exist: the fan carries the meaning, the sentence merely repeated the card's title.
    // What remains verifiable, and is the real rule, is the DISTRIBUTION — a sentence exactly where
    // there is no fan.
    const withClaim = out.filter((s) => s.claim !== undefined).map((s) => s.label);
    expect(withClaim).toEqual([sensitiveTopicName('fr', 'conflictual')]);
    expect(out.find((s) => s.label === sensitiveTopicName('fr', 'conflictual'))?.claim).toBe(
      d1ConflictualNamedClaim('fr'),
    );
  });

  it('triggerTerms ⊂ the text of ITS OWN evidence, character for character', () => {
    for (const signal of out) {
      for (const e of signal.evidence) {
        for (const term of e.triggerTerms ?? []) {
          expect(e.text.includes(term), `« ${term} » missing from « ${e.text} »`).toBe(true);
        }
      }
    }
  });

  it('NAMED tag ⇒ non-empty triggerTerms on every piece of evidence (B2)', () => {
    const named = out.filter(isNamedTier);
    expect(named.length).toBeGreaterThan(0);
    for (const signal of named) {
      for (const e of signal.evidence) {
        expect(e.triggerTerms?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  // This assertion used to state « a fan ONLY on the indirect, never on the named » — the doctrine
  // of BEFORE. ADR-0003 (*Uncertainty*) now says the opposite: the named finding CARRIES a `ranked`
  // fan, because the named storey resolves only the LEXICAL ambiguity (which subject) and never the
  // WHY. The test did not go red at the reversal: its corpus carried no signal that was both named
  // and topical, so the faulty branch was never taken. The missing case is now in RICH, and it is
  // what holds this assertion up.
  it('fan: `ranked` on the named, `equal` on the indirect, none on the non-topical', () => {
    const topical = out.filter((s) => s.evidence.some((e) => e.readings !== undefined));
    // Anti-vacuity: BOTH modes must be met, otherwise the assertion proves nothing.
    const modes = new Set(topical.flatMap((s) => s.evidence.map((e) => e.readings?.mode)));
    expect(modes).toEqual(new Set(['ranked', 'equal']));

    for (const signal of out) {
      const named = isNamedTier(signal);
      for (const e of signal.evidence) {
        // `conflictual` is not topical: no fan, at any storey. It is the case where the
        // discriminant is ABSENT from the export (the relationship), and where a fan would dress an
        // inability up as legitimate plurality — ADR-0003, *Uncertainty*.
        // `signal.label` carries the DISPLAYED name, not the lexicon id — comparing against the id
        // would always miss, and the branch below would never be taken.
        if (signal.label === sensitiveTopicName('fr', 'conflictual')) {
          expect(e.readings).toBeUndefined();
          continue;
        }
        expect(e.readings?.mode).toBe(named ? 'ranked' : 'equal');
        for (const reading of e.readings?.readings ?? []) {
          expect(ALLOWED_READINGS.has(reading)).toBe(true);
          // No per-reading confidence or weight: a reading is a STRING (C3, tightened).
          expect(typeof reading).toBe('string');
        }
      }
    }
  });

  it('confidence capped at medium — `high` is forbidden at compile time, never reached at runtime', () => {
    for (const signal of out) {
      expect(['low', 'medium']).toContain(signal.confidence);
    }
  });

  it('only the CITED crumbs exist (§5.1 bound) — the non-bearing item never appears', () => {
    for (const signal of out) {
      for (const e of signal.evidence) {
        expect(e.text).not.toContain('gâteau'); // the corpus's non-bearing item
      }
    }
  });
});

describe('d1SensitiveTopics — decision D (conflictual = aggression against PEOPLE only)', () => {
  it('criticism of a thing/idea with no 2nd-person address → NEVER conflictual (anti-regression golden)', () => {
    // A lexical insult is present but there is NO 2nd-person target (« cette » was removed from the
    // lexicon for exactly this reason: a demonstrative is not an address to the interlocutor).
    const out = run([
      'cette blague est vraiment debile',
      'ce film est un vrai bouffon de scénario',
    ]);
    expect(out.some((s) => s.claim === d1ConflictualNamedClaim('fr'))).toBe(false);
  });
});

describe('d1SensitiveTopics — multi-label and signal-without-lived-experience', () => {
  it('a multi-label comment: cited by EACH finding, each with ITS OWN triggerTerms', () => {
    // Ex-« stored ONCE »: the store is gone, the verbatim is DUPLICATED (yuya's arbitration).
    // The lock that matters survives intact — and it was the only one that mattered: two findings
    // citing the same source NEVER lend each other their surfaces (« manif » on the politics side,
    // « abruti » on the conflictual side). That is also what the duplication makes structurally
    // possible.
    const out = run([
      "t'es un abruti et ta manif est ridicule", // conflictual AND politics (1/2)
      'les élections arrivent vite', // politics (2/2)
    ]);
    expect(out).toHaveLength(2);
    const citationOf = (i: number): Evidence | undefined =>
      out[i]?.evidence.find((e) => e.channel === 'comment' && e.sourceIndex === 0);
    const a = citationOf(0);
    const b = citationOf(1);
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(a?.text).toBe(b?.text); // same source, verbatim duplicated — the accepted cost
    expect(a?.triggerTerms).not.toEqual(b?.triggerTerms); // ... and distinct surfaces: the gain
  });

  it('signal-without-lived-experience (3rd person): TAGGED, as indirect — the demonstration (C2), not a bug', () => {
    const out = run([
      'chercher un psy pour mon fils', // demoted, 3rd person
      "la dépression de ma fille m'inquiète", // explicit, demoted by 3rd person
    ]);
    expect(out).toHaveLength(1);
    // The storey is read off the confidence: `low` = broad. The finding EXISTS (tagging the people
    // around someone is the demonstration, C2) and asserts nothing about the speaker.
    expect(out[0]?.confidence).toBe('low');
    expect(out[0]?.claim).toBeUndefined();
  });
});

describe('d1SensitiveTopics — Searches adapter (PANO-80, PANO-70 §1.6)', () => {
  it('Comments empty BUT Searches bearing → detected all the same (the guard no longer blocks wrongly)', () => {
    const out = d1SensitiveTopics(withSearches(['ma dépression me suit depuis des années']));
    expect(out).toHaveLength(1);
    // What this test keeps is the CHANNEL (a search on its own is enough to detect), not the storey.
    // The finding has been broad ever since bare nouns stopped naming — and this case is worth
    // noting: a SINGLE search still produces a finding, which the threshold of 2 would have
    // forbidden without the solo tier. The channel guard and the tier floor are both proven here at
    // once.
    expect(out[0]?.confidence).toBe('low');
  });

  it('detection on SEARCHES alone: each piece of evidence carries the `search` channel and its source index', () => {
    // Ex-`evidenceId: 'search:<index>'` + `source: { path }`: the identity is a PAIR of data, no
    // longer a prefixed string to build and then re-parse (§5.4).
    const out = d1SensitiveTopics(
      withSearches([
        'ma dépression me suit depuis des années',
        'je cherche un bon psy dans le coin',
      ]),
    );
    expect(out).toHaveLength(1); // same label (mental_health), aggregated
    expect(
      out[0]?.evidence.map((e) => ({ channel: e.channel, sourceIndex: e.sourceIndex })),
    ).toEqual([
      { channel: 'search', sourceIndex: 0 },
      { channel: 'search', sourceIndex: 1 },
    ]);
  });

  it('MIXED detection (comment + search, same label): distinct channels, index OWN to each list', () => {
    // The hard point the old `comment:0` / `search:0` protected with a PREFIX: two items with source
    // index 0 on two channels must not collide. The pair holds it natively.
    const out = d1SensitiveTopics(
      withChannels(
        ['ma dépression me suit depuis des années'], // comment, sourceIndex 0
        ['je cherche un bon psy dans le coin'], // search, sourceIndex 0
      ),
    );
    expect(out).toHaveLength(1); // a single label (mental_health), both channels aggregated
    expect(
      out[0]?.evidence.map((e) => ({ channel: e.channel, sourceIndex: e.sourceIndex })),
    ).toEqual([
      { channel: 'comment', sourceIndex: 0 },
      { channel: 'search', sourceIndex: 0 },
    ]);
  });
});
