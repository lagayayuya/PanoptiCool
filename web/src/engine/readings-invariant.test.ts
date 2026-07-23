// PROPERTY golden (S1b / PANO-50) — the "no confidence per reading" lock (ADR-0003, carried over by
// ADR-0004), on the fan carried by the EVIDENCE (`Evidence`).
//
// We PROVE the invariant, we do not presume it from the refactor (the issue's requirement).
//
// WHAT REFONTE A CHANGED FOR THIS LOCK — it tightens, it does not loosen. A reading was an
// `Interpretation` (= `TemplateRef`: `{templateId, params}`): an OBJECT, which had to be checked —
// at runtime AND by `@ts-expect-error` — to carry neither `confidence`, nor weight, nor score. The
// `params: Record<string, string|number>` moreover left "the little door" open (known limitation,
// ADR-0004): nothing forbade `params: { weight: 0.9 }`.
// A reading is now a STRING (A2). A `string` cannot carry a field: the property is no longer checked,
// it is INEXPRESSIBLE. The `params` little door closes with it. What remains to hold is the fan
// itself: `mode` ORDERS (position in the array), it does not QUANTIFY — confidence lives on the
// finding (`Deduction.confidence`), never here.

import { describe, expect, it } from 'vitest';
import type { Evidence, ReadingFan } from './analysis';

// Standalone example (does not depend on the persona): one ranked fan, one equal, one piece of
// evidence with no fan — both `mode`s exercised, plus the "no reading" case.
const SAMPLE: Evidence[] = [
  {
    channel: 'comment',
    sourceIndex: 0,
    text: 'exemple classé',
    date: '2026-01-01 12:00:00',
    readings: { mode: 'ranked', readings: ['vécu personnel', 'préoccupation pour un proche'] },
  },
  {
    channel: 'comment',
    sourceIndex: 1,
    text: 'exemple à égalité',
    date: '2026-01-01 12:00:00',
    readings: {
      mode: 'equal',
      readings: ['ironie ou provocation', 'engagement politique sincère'],
    },
  },
  { channel: 'search', sourceIndex: 0, text: 'sans éventail', date: '2026-01-01 12:00:00' },
];

const fans = (evidence: readonly Evidence[]): ReadingFan[] =>
  evidence.flatMap((e) => (e.readings === undefined ? [] : [e.readings]));

describe('C3 lock — no confidence per reading', () => {
  it('the example does exercise both modes (the test does not pass vacuously)', () => {
    expect(
      fans(SAMPLE)
        .map((f) => f.mode)
        .sort(),
    ).toEqual(['equal', 'ranked']);
  });

  it('a fan carries ONLY { mode, readings } — no score key, at runtime', () => {
    for (const fan of fans(SAMPLE)) {
      expect(Object.keys(fan).sort()).toEqual(['mode', 'readings']);
      expect(['ranked', 'equal']).toContain(fan.mode);
    }
  });

  it('a reading is a STRING: carrying a score is structurally impossible', () => {
    for (const fan of fans(SAMPLE)) {
      for (const reading of fan.readings) {
        expect(typeof reading).toBe('string');
      }
    }
  });

  it('`ranked` ORDERS by position, it does not QUANTIFY: primacy = index 0', () => {
    const ranked = fans(SAMPLE).find((f) => f.mode === 'ranked');
    // The primary reading is read at index 0 (array order) — not via a weight on the reading.
    expect(ranked?.readings[0]).toBe('vécu personnel');
  });

  it('proof at the TYPE level (checked by tsc): a weight on the fan = a compile error', () => {
    // @ts-expect-error — a `ReadingFan` only accepts { mode, readings } (no global weight).
    const fan: ReadingFan = { mode: 'ranked', readings: [], weight: 1 };
    // @ts-expect-error — a reading is a `string`: a score-carrying object does not compile.
    const scored: ReadingFan = { mode: 'ranked', readings: [{ text: 'r', confidence: 0.9 }] };
    expect(fan).toBeDefined();
    expect(scored).toBeDefined();
  });
});
