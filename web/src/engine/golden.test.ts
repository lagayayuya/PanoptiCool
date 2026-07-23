// Shape golden tests (PANO-28): REAL synthetic zips (output of the PANO-11 generator, committed
// under samples/, reproducible, zero-PII) run through the real pipeline (PANO-27).
//
// Goal: prove that the PLUMBING (parse → validate → analyze → `Analysis`) holds on realistic inputs,
// conformant AND adverse (`--empty` / `--absent`). It is the test that confronts the valibot schema
// (PANO-26) with the real generator output: a too-strict schema (the named non-guarantee of the
// PANO-26 bridge) reveals itself HERE.
//
// MOVED TO REFONTE A. This file is the ENGINE golden — not to be confused with the end-to-end RENDER
// golden (zip → ingestion → rules → render, persona included), which is another file and which does
// exercise D1/D2. Three locks are REMOVED, one is CORRECTED:
//   - `schemaVersion` and the `evidence: []` store leave with `EngineOutput`: the engine returns
//     `Analysis`, a named value, and a piece of evidence is referenced directly (ADR-0004);
//   - "every output passes `assertInsight`" is MOOT: that dev-only net checked at runtime the shape
//     of a heterogeneous `Insight` union. Each field now having its own type, the compiler holds
//     what `assertInsight` caught. `assert.ts` disappeared;
//   - the drift golden `themes: undefined` ("not wired yet; must become a non-empty `toEqual` once
//     S2 has run") is CORRECTED, and its prediction was WRONG: S2 ran, and these zips STILL produce
//     no theme or signal. Not for lack of wiring — for lack of text: the generator does not
//     fabricate comments that touch the real lexicons. The lock is therefore translated into what it
//     REALLY measures (cf. the dedicated `it` below): these samples test the PLUMBING, and the core
//     is exercised only by the render golden's persona.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseTikTokExport } from './parse';
import { processExport } from './pipeline';
import { validTikTokExport } from './valid-export.fixture';
import { validateTikTokExport } from './validate';

const BASELINE = 'user_data_tiktok.sample.zip';
const EMPTY = 'user_data_tiktok.empty.zip'; // --empty 'Your Activity/Searches' (SearchList → null)
const ABSENT = 'user_data_tiktok.absent.zip'; // --absent 'Your Activity/Searches' (key omitted)

/** Reads a golden zip from `samples/` (repo root, outside web/). */
function readSample(name: string): Uint8Array {
  return new Uint8Array(readFileSync(new URL(`../../../samples/${name}`, import.meta.url)));
}

/** Utility cast to read/mutate an `unknown` datum in the tests, without `any`. */
function obj(x: unknown): Record<string, unknown> {
  return x as Record<string, unknown>;
}

describe('golden — pipeline on the generator output (PANO-11)', () => {
  it('realistic baseline → ok, and a genuinely populated Analysis (≠ empty-engine stub)', () => {
    const res = processExport(readSample(BASELINE));
    expect(res.ok).toBe(true);
    if (res.ok) {
      // The producers that read COUNTS run on this zip: it carries activity.
      expect(res.output.rhythm).toBeDefined();
      expect(res.output.opacity).toBeDefined();
      expect(Object.keys(res.output.volumes).length).toBeGreaterThan(0);

      // Rhythm: time-INDEPENDENT SHAPE only (the baseline runs on `Date.now()` — an assertion on a
      // sliding window would rot with the clock). Invariant: 24 hourly counters, and each dated video
      // bucketed once (sum = VideoList size — the committed sample's dates all parse).
      const parsedBaseline = parseTikTokExport(readSample(BASELINE));
      const videoCount =
        parsedBaseline.ok &&
        Array.isArray(
          obj(obj(obj(parsedBaseline.data)['Your Activity'])['Watch History']).VideoList,
        )
          ? (
              obj(obj(obj(parsedBaseline.data)['Your Activity'])['Watch History'])
                .VideoList as unknown[]
            ).length
          : 0;
      expect(res.output.rhythm?.hourlyActivity).toHaveLength(24);
      expect(res.output.rhythm?.hourlyActivity.reduce((a, b) => a + b, 0)).toBe(videoCount);
    }
  });

  it('drift golden: these samples exercise NEITHER D1 NOR D2 — the plumbing, not the core', () => {
    // What replaces `themes: undefined` ("not wired yet"). D1/D2 have been wired since, and these
    // zips stay mute: the PANO-11 generator fabricates realistic STRUCTURES, not texts that touch
    // the lexicons. Naming it rather than letting it be believed covered is the point:
    //   - the CORE (detection, fans, trigger terms, C5) is exercised only by the persona of the
    //     end-to-end RENDER GOLDEN — hence its deliberate presence in that golden;
    //   - the exhaustiveness of the ~110 lexicon keys is held by `d1/d2-wording-coverage.test.ts`,
    //     and by nothing else.
    // If this test turns red, it is not a regression: it means the samples have started to carry
    // meaningful text — good news to note, not to mask.
    const res = processExport(readSample(BASELINE));
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.output.themes).toEqual([]);
      expect(res.output.signals).toEqual([]);
    }
  });

  it('--empty (populated section forced to empty) → ok, and the section carries its `null` encoding', () => {
    const res = processExport(readSample(EMPTY));
    expect(res.ok).toBe(true);
    // ENCODING assertion (not just ok): Searches/SearchList has its `null` empty encoding (§4).
    const parsed = parseTikTokExport(readSample(EMPTY));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const searches = obj(obj(obj(parsed.data)['Your Activity']).Searches);
      expect(searches.SearchList).toBeNull();
    }
  });

  it('--absent (section key omitted) → ok:false, stage validate (empty ≠ absent), not a crash', () => {
    const res = processExport(readSample(ABSENT));
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.stage).toBe('validate');
  });

  it('baseline too large (tiny threshold) → stage too_large distinct from parse (PANO-25/27 loop)', () => {
    const res = processExport(readSample(BASELINE), { sizeLimitBytes: 10 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.stage).toBe('too_large');
  });
});

describe('golden — coverage of the three empty encodings (§1.2) on the baseline', () => {
  it('the baseline carries the three encodings null / [] / {} (and validates)', () => {
    const parsed = parseTikTokExport(readSample(BASELINE));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const data = obj(parsed.data);
    // NULL : Income+ Wallet → Transaction History → TransactionsList
    expect(obj(obj(data['Income+ Wallet'])['Transaction History']).TransactionsList).toBeNull();
    // [] : Likes and Favorites → Favorite Comment → FavoriteCommentList
    const lf = obj(data['Likes and Favorites']);
    expect(obj(lf['Favorite Comment']).FavoriteCommentList).toEqual([]);
    // {} : Likes and Favorites → Collection
    expect(lf.Collection).toEqual({});
    // CHANGED section (NullableList<SearchItem>): populated (array) on the baseline; the empty branch
    // (null) is covered by the --empty test → both branches exercised on real zips.
    expect(Array.isArray(obj(obj(data['Your Activity']).Searches).SearchList)).toBe(true);
  });
});

describe('golden — negatives: the schema DISTINGUISHES the encodings (non-vacuity)', () => {
  // NB: for the "Unverified" sections with `null` encoding (typed `unknown[] | null`), the schema
  // accepts both `null` AND `[]` — assumed `valibot ⊇ contract` looseness (PANO-26). The negatives
  // below therefore test the REAL distinctions (array vs object vs null where the type is precise),
  // not the null↔[] distinction (accepted by design).

  it('section `[]` receives `null` → reject', () => {
    const data = obj(validTikTokExport());
    obj(obj(data['Likes and Favorites'])['Favorite Comment']).FavoriteCommentList = null;
    expect(validateTikTokExport(data).ok).toBe(false);
  });

  it('precise list section receives `{}` → reject', () => {
    const data = obj(validTikTokExport());
    obj(obj(data.Comment).Comments).CommentsList = {};
    expect(validateTikTokExport(data).ok).toBe(false);
  });

  it('section `null` receives `{}` → reject', () => {
    const data = obj(validTikTokExport());
    obj(obj(data['Income+ Wallet'])['Transaction History']).TransactionsList = {};
    expect(validateTikTokExport(data).ok).toBe(false);
  });
});
