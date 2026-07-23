// THE FR/EN WORDING PARITY — pinned to the COMPILER, not only at runtime.
//
// WHY THIS FILE EXISTS. `wording.ts` announces that the compiler holds parity in both directions.
// This guarantee rests on a condition that IS NOT VISIBLE ON READING: the tables of `wording.fr.ts`
// must stay UNANNOTATED LITERALS. The day someone writes
// `readings: { … } as Readonly<Record<string, string>>` — the natural reflex, and what the
// ex-monolingual file did — `typeof FR` stops carrying the keys, and an EMPTY English table compiles
// without an error. Measured, not supposed.
//
// The guarantee would therefore fall SILENTLY, and everything relying on it would become false at
// the same stroke: `readingKeys()`/`hasReading()` read ONLY the French, availing themselves of the
// fact that the two key sets are identical by construction. This reasoning is correct as long as the
// condition holds, and false the second it stops — without any red test saying so.
//
// HOW IT GOES ABOUT IT. The `@ts-expect-error` below are full-fledged assertions: if parity stops
// being held, the expected error is no longer emitted, the directive becomes "unused" and
// **`astro check` fails**. The net is therefore at the TYPECHECK, not at runtime — the only place
// where the property exists.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation: a proof mechanism declares its boundary.
//   - IT PROVES NOTHING ABOUT THE CONTENT. An English entry that copies the French word for word
//     passes here, and will pass everywhere else. Parity proves that an entry EXISTS, never that it
//     is TRANSLATED — that half is a human review, and it has no net;
//   - IT DOES NOT COVER LEXICON COVERAGE. That the tables carry the REAL keys of the lexicons is
//     another property, held by `d1/d2-wording-coverage.test.ts`;
//   - IT TESTS ONLY A SAMPLE OF SHAPES. One witness table per category (closed, open), not all four
//     tables. What it pins is the MECHANISM — if the annotation came back, it would come back by a
//     global reflex, not on an isolated table.

import { describe, expect, it } from 'vitest';
import { hasReading, hasThemeLabel, hasUsage, readingKeys } from './wording';
import { EN } from './wording.en';
import { FR } from './wording.fr';

// ─── (1) THE TYPECHECK NET ──────────────────────────────────────────────────────────────────────
// These declarations never execute. Their role is to fail AT COMPILE TIME if parity is no longer
// held. Each `@ts-expect-error` bears on the NEXT LINE — careful when editing: a literal split over
// several lines shifts the error and makes the directive "unused" for a reason that is not the right
// one (a trap hit while getting this net right).

type Bundle = typeof FR;

// An OPEN table missing a key must be REJECTED.
// @ts-expect-error — `readings` stripped of a reading: the compiler must see it.
const _MISSING_READING: Bundle['readings'] = { 'sensitive.mental-health.reading.lived': 'x' };

// An UNKNOWN key must be REJECTED (the other direction of parity).
// @ts-expect-error — `usages` with a ghost key: the compiler must see it.
const _GHOST_USAGE: Bundle['usages'] = { ...FR.usages, 'usage.advertiser.ghost': 'x' };

// A CLOSED table (union `SensitiveLabel`) missing a label must be REJECTED.
// @ts-expect-error — a blessed label with no short name does not compile.
const _MISSING_LABEL: Bundle['sensitiveTopicName'] = { mental_health: 'x' };

// ─── (2) THE RUNTIME NET ────────────────────────────────────────────────────────────────────────
// The typecheck above is the real net, but it does not run under Vitest: these assertions make the
// property VISIBLE in the test output, and catch the case where someone disables the directives
// above without removing them.

describe('wording — FR/EN parity', () => {
  const TABLES = [
    'readings',
    'themeLabels',
    'usages',
    'actorLabels',
    'sensitiveTopicName',
  ] as const;

  for (const table of TABLES) {
    it(`\`${table}\` carries exactly the same keys in FR and in EN`, () => {
      expect(Object.keys(EN[table]).sort()).toEqual(Object.keys(FR[table]).sort());
    });
  }

  // The tables must not be EMPTY: a parity between two empty tables is true and useless. This is the
  // "by which path does the zero arrive" check required by CLAUDE.md — here, the verification that
  // the equality above bears on something.
  it('the compared tables are not empty (the equality above bears on content)', () => {
    for (const table of TABLES) {
      expect(Object.keys(FR[table]).length, table).toBeGreaterThan(0);
    }
  });

  // The `hasX`/`readingKeys` resolvers read ONLY the French, availing themselves of parity. If
  // parity fell, they would lie about the English without any other test saying so.
  it('the key resolvers hold for English too (what they assume without saying it)', () => {
    for (const key of Object.keys(EN.readings)) {
      expect(hasReading(key), `lecture EN absente du routage : ${key}`).toBe(true);
    }
    for (const key of Object.keys(EN.themeLabels)) {
      expect(hasThemeLabel(key), `thème EN absent du routage : ${key}`).toBe(true);
    }
    for (const key of Object.keys(EN.usages)) {
      expect(hasUsage(key), `usage EN absent du routage : ${key}`).toBe(true);
    }
    expect(readingKeys().length).toBe(Object.keys(EN.readings).length);
  });

  // The three witnesses of section (1) have NO work at runtime: theirs is done when `tsc` reads
  // them. This test does not verify them — it REFERENCES them, so that no tool takes them for dead
  // code and removes them, which would unhook the typecheck net without a sound.
  it('the typecheck witnesses are referenced (they work at compile time, not here)', () => {
    expect([_MISSING_READING, _GHOST_USAGE, _MISSING_LABEL]).toHaveLength(3);
  });
});
