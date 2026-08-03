// D2 MECHANICS goldens (PANO-75 base) — they lock the rule's behavior INDEPENDENTLY of the real
// content of the lexicons (PANO-76+ batches). Just as D1 separates `detect.test.ts` (FAKE lexicons)
// from `lexicon-battery.test.ts` (real lexicons), D2's mechanics are tested on fake lexicons
// injected through `d2Interests`'s `lexicons` parameter: the base stays literally intact when
// content batches change the real register.
//
// Guardrails checked here: never any `readings`, ranking (floor + sort by volume), confidence
// derived from volume, self-declaration bonus, well-formed theme (name + usage block). The real
// CONTENT (per-theme detection, adversity, the D1 border, D1×D2 dedup) lives in
// `detect/interests-battery.test.ts`. Sentences 100 % synthetic, never taken from a real export.
//
// CARRIED OVER AT REWORK A. Three locks change NATURE — that has to be said, not rewritten in
// silence:
//   - « D2 NEVER emits `sensitivity` » becomes « `sensitive === false` ». This is NOT a rename:
//     §2.1 merged three DEGENERATE gradation axes (`sensitivity` always `3`, `Theme.sensitive`
//     always `false`, `Confidence.level: 'high'` with no producer) into ONE discriminant that does
//     VARY. The assertion moves from « absent » to « explicitly false » — and the `Theme.sensitive`
//     we additionally checked has gone, the information lives in exactly one place;
//   - « the insights are grouped by `themeId`, in order » is no longer testable BECAUSE it has
//     become STRUCTURAL: a theme CARRIES its findings (`deductions`). The grouping that
//     `buildPageBlocks` used to redo at display time is done HERE, once. What a test can still
//     prove, and what remains a rule decision: D2 emits ONE finding per retained theme;
//   - « claim = a TemplateRef from the allowlist » becomes the REAL identity (same switch as the D1
//     goldens): the claim is the TEXT of `d2InterestClaim(volume)`, it CANNOT come out of a list.
//     So what we check is that it carries the RIGHT volume — which the allowlist did not prove.
// The evidence store disappears along with `evidenceId`/`source.path`: a piece of evidence is
// referenced directly, its identity is the `channel`/`sourceIndex` pair (§5.4).

import { describe, expect, it } from 'vitest';
import type { AnalysisTheme, Deduction } from '../analysis';
import type { InterestLexicon } from '../lexicon/types';
import { normalizeExport } from '../normalize';
import type { CommentItem, SearchItem, TikTokExport } from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import { d2InterestClaim } from '../wording';
import { d2Interests } from './d2-interests';

/** FAKE lexicons — invented markers, with no possible collision, to test the mechanics alone. */
const ANIMAL: InterestLexicon = {
  kind: 'interest',
  label: 'factice_animal',
  themeLabel: 'theme.factice-animal.label',
  usage: [{ actor: 'advertiser', usage: { templateId: 'usage.factice.animal', params: {} } }],
  markers: ['wombat', 'okapi', 'tapir'],
  // Ambiguous markers: they only count next to a companion from the domain (co-occurrence,
  // PANO-76).
  anchored: ['patte', 'poil'],
  selfDeclared: ['zoologue'],
};
const PLANT: InterestLexicon = {
  kind: 'interest',
  label: 'factice_plante',
  themeLabel: 'theme.factice-plante.label',
  usage: [{ actor: 'platform', usage: { templateId: 'usage.factice.plante', params: {} } }],
  markers: ['bonsai', 'ficus'],
};
const FAKES: readonly InterestLexicon[] = [ANIMAL, PLANT];

/** Valid export whose `CommentsList`/`SearchList` carry the given texts (fixed dates, the rest
 * empty). Single channel by default — the historical tests pass `withChannels(texts, [])`, cf. the
 * `withComments` alias below, behavior UNCHANGED (PANO-80). */
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
function withComments(texts: readonly string[]): ReturnType<typeof normalizeExport> {
  return withChannels(texts, []);
}

/** Export where ONLY `SearchList` carries the given terms (`CommentsList` empty). */
function withSearches(terms: readonly string[]): ReturnType<typeof normalizeExport> {
  return withChannels([], terms);
}

function run(texts: readonly string[]): AnalysisTheme[] {
  return d2Interests(withComments(texts), FAKES);
}

function runChannels(comments: readonly string[], searches: readonly string[]): AnalysisTheme[] {
  return d2Interests(withChannels(comments, searches), FAKES);
}

/** The theme with the given `id`, or `undefined` — replaces the `find` on `insight.themeId`. */
const themeById = (themes: readonly AnalysisTheme[], id: string): AnalysisTheme | undefined =>
  themes.find((t) => t.id === id);

/** The findings of every theme (ex-`out.insights`, which was flat). */
const allDeductions = (themes: readonly AnalysisTheme[]): Deduction[] =>
  themes.flatMap((t) => t.deductions);

describe('d2Interests — shape', () => {
  it('Comments empty → []', () => {
    expect(d2Interests(normalizeExport(validTikTokExport()), FAKES)).toEqual([]);
  });

  it('an interest below the floor (a single hit) → no theme (§5.1 bound: no crumb cited)', () => {
    expect(run(['un wombat traverse la clairière', 'belle lumière ce soir'])).toEqual([]);
  });

  it('an interest at the floor (≥ 2 hits) → 1 theme carrying 1 finding', () => {
    const out = run(['un wombat au zoo', 'encore un okapi superbe']);
    expect(out).toHaveLength(1);
    expect(out[0]?.id).toBe('factice_animal');
    expect(out[0]?.deductions).toHaveLength(1);
    // The claim carries the REAL volume (2 hits) — ex-« claim.templateId ⊆ allowlist ».
    expect(out[0]?.deductions[0]?.claim).toBe(d2InterestClaim('fr', 2));
  });
});

describe('d2Interests — structural goldens (PANO-74 framing)', () => {
  // animal ×3, plant ×2 → two themes, animal first (decreasing volume).
  const CORPUS = [
    'un wombat au réveil', // animal 1
    'encore un okapi', // animal 2
    'et un tapir aussi', // animal 3
    'mon bonsai a grandi', // plant 1
    'un ficus au salon', // plant 2
    'belle balade en forêt', // non-bearing: never cited
  ];
  const out = run(CORPUS);

  it('D2 NEVER emits a sensitive finding (ex-« never any sensitivity » — §2.1)', () => {
    for (const deduction of allDeductions(out)) {
      expect(deduction.sensitive).toBe(false);
    }
  });

  it('D2 NEVER emits readings (no fan of readings)', () => {
    for (const deduction of allDeductions(out)) {
      for (const e of deduction.evidence) {
        expect(e.readings).toBeUndefined();
      }
    }
  });

  it('ranking: floor respected and themes sorted by decreasing volume', () => {
    expect(out.map((t) => t.id)).toEqual(['factice_animal', 'factice_plante']);
    for (const deduction of allDeductions(out)) {
      for (const e of deduction.evidence) {
        expect(e.text).not.toContain('forêt'); // the non-bearing item never gets in (§5.1 bound)
      }
    }
  });

  it('ONE finding per retained theme (ex-« insights grouped by themeId » — now structural)', () => {
    for (const theme of out) {
      expect(theme.deductions).toHaveLength(1);
    }
  });

  it('confidence derived from volume, never high (animal 3 < threshold → low)', () => {
    for (const deduction of allDeductions(out)) {
      expect(deduction.confidence === 'low' || deduction.confidence === 'medium').toBe(true);
    }
    expect(themeById(out, 'factice_animal')?.deductions[0]?.confidence).toBe('low');
  });

  it('well-formed theme: name as TEXT, usage = actor + usage as TEXT (A2, no more TemplateRef)', () => {
    for (const theme of out) {
      expect(typeof theme.label).toBe('string');
      for (const u of theme.usage) {
        expect(typeof u.actor).toBe('string');
        expect(typeof u.usage).toBe('string');
      }
    }
  });

  it('triggerTerms ⊂ the text of ITS OWN evidence, character for character', () => {
    for (const deduction of allDeductions(out)) {
      for (const e of deduction.evidence) {
        for (const term of e.triggerTerms ?? []) {
          expect(e.text.includes(term), `« ${term} » missing from « ${e.text} »`).toBe(true);
        }
      }
    }
  });
});

describe('d2Interests — self-declaration bonus', () => {
  it('« je suis un vrai zoologue » pushes confidence low → medium', () => {
    const out = run(['je suis un vrai zoologue', 'un wombat superbe']);
    expect(themeById(out, 'factice_animal')?.deductions[0]?.confidence).toBe('medium');
  });
});

describe('d2Interests — disambiguation by CO-OCCURRENCE (anchored markers)', () => {
  it('an ISOLATED anchored marker (no companion) does not count — even repeated, no theme', () => {
    // « patte » is anchored; two items with « patte » alone, no companion from the domain → no
    // theme.
    expect(run(['une patte dans la boue', 'encore une patte cassée'])).toEqual([]);
  });

  it('an anchored marker next to a SOLO companion counts (« wombat » anchors « patte »)', () => {
    // 2 items to reach the floor: each has a solo (wombat/okapi) that anchors the anchored marker.
    const animal = themeById(
      run(['un wombat avec une patte cassée', 'un okapi et son poil ras']),
      'factice_animal',
    );
    expect(animal).toBeDefined();
    // The anchored marker's surface is indeed retained as evidence (triggerTerm).
    const surfaces = (animal?.deductions[0]?.evidence ?? []).flatMap((e) => e.triggerTerms ?? []);
    expect(surfaces).toContain('patte');
  });

  it('TWO distinct anchored markers anchor each other (« patte » + « poil »)', () => {
    const out = run(['patte et poil partout ce matin', 'encore patte et poil sur le tapis']);
    expect(themeById(out, 'factice_animal')).toBeDefined();
  });

  it('an anchored marker next to a companion SELF-DECLARATION counts', () => {
    const out = run(['je suis un vrai zoologue, quelle patte', 'un wombat de plus']);
    expect(themeById(out, 'factice_animal')).toBeDefined();
  });
});

describe('d2Interests — Searches adapter (PANO-80, PANO-70 §1.6)', () => {
  it('Comments empty BUT Searches bearing (≥ floor) → theme detected all the same', () => {
    const out = d2Interests(withSearches(['un wombat au zoo', 'encore un okapi superbe']), FAKES);
    expect(out).toHaveLength(1);
    expect(out[0]?.id).toBe('factice_animal');
  });

  it('detection on SEARCHES alone: each piece of evidence carries the `search` channel and its source index', () => {
    // Ex-`evidenceId: 'search:<index>'` + `source: { path }`: the identity is a PAIR of data, no
    // longer a prefixed string to build and then re-parse (§5.4).
    const out = d2Interests(withSearches(['un wombat au zoo', 'encore un okapi superbe']), FAKES);
    const animal = themeById(out, 'factice_animal');
    expect(
      (animal?.deductions[0]?.evidence ?? []).map((e) => ({
        channel: e.channel,
        sourceIndex: e.sourceIndex,
      })),
    ).toEqual([
      { channel: 'search', sourceIndex: 0 },
      { channel: 'search', sourceIndex: 1 },
    ]);
  });

  it('floor reached ACROSS both channels (1 comment + 1 search) → theme detected', () => {
    // The hard point the `comment:`/`search:` prefixes protected: two items with source index 0 on
    // two channels must not collide. The pair holds it natively.
    const animal = themeById(
      runChannels(['un wombat au réveil'], ['encore un okapi superbe']),
      'factice_animal',
    );
    expect(animal).toBeDefined();
    expect(
      (animal?.deductions[0]?.evidence ?? []).map((e) => ({
        channel: e.channel,
        sourceIndex: e.sourceIndex,
      })),
    ).toEqual([
      { channel: 'comment', sourceIndex: 0 },
      { channel: 'search', sourceIndex: 0 },
    ]);
  });

  it('Comments empty AND Searches empty → [] (guard preserved)', () => {
    expect(d2Interests(withChannels([], []), FAKES)).toEqual([]);
  });
});
