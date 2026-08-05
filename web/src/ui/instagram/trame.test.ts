// THE TIMELINE'S TWO PURE PARTS — the colour ramp and the month bucketing.
//
// The drawing is a canvas and is not tested; these two are the parts that carry DECISIONS about
// what the grid says, and both fail plausibly rather than loudly: a wrong ramp still draws colours,
// and wrong buckets still draw a grid.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - ANY PIXEL. Nothing renders. Hit-testing, the drawn scrollbar, the hover bands and the
//     name truncation are unasserted — a canvas has no DOM to query, and a screenshot test would
//     pin the rendering rather than the reasoning;
//   - THE LOGARITHMIC SCALE'S APPLICATION. `Math.log1p(v) / logPeak` lives inside the draw loop;
//     what is asserted here is that the ramp it feeds is monotonic and anchored at its ends;
//   - THE COLOURS THEMSELVES. That `--ig-warm` is the right orange is a theme decision.

import { describe, expect, it } from 'vitest';
import { buckets, ramp } from './Trame';

/** `rgb(r,g,b)` → the three numbers. */
function rgb(s: string): [number, number, number] {
  const m = s.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (m === null) throw new Error(`not an rgb string: ${s}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

describe('the ramp', () => {
  it('is anchored at both ends on the theme’s vocabulary', () => {
    // ⚠ The two ENDS are vocabulary; the four middle stops are not. `#101838` is the empty cell,
    // `#e8754e` the full one — the same two colours the legend and the CSS use.
    expect(rgb(ramp(0))).toEqual([16, 24, 56]);
    expect(rgb(ramp(1))).toEqual([232, 117, 78]);
  });

  it('clamps outside [0, 1] rather than extrapolating', () => {
    // A count above the peak should not exist, but if rounding ever produced one the ramp must not
    // walk off the end of its stop list and return a colour from nowhere.
    expect(ramp(-5)).toBe(ramp(0));
    expect(ramp(99)).toBe(ramp(1));
  });

  it('⚠ is MONOTONIC in perceived weight — more messages never reads as less', () => {
    // The property that makes a heatmap legible at all. It is checked on the RED channel, which is
    // the one that climbs across every stop of this ramp (blue does not: it rises then falls, which
    // is exactly why a single-hue ramp was rejected — see the component's header).
    let previous = -1;
    for (let t = 0; t <= 1; t += 0.05) {
      const [r] = rgb(ramp(t));
      expect(r, `at ${t.toFixed(2)}`).toBeGreaterThanOrEqual(previous);
      previous = r;
    }
  });

  it('interpolates between stops rather than snapping to them', () => {
    // A stepped ramp would lose exactly the distinctions the log scale exists to preserve.
    const between = rgb(ramp(0.11));
    const low = rgb(ramp(0));
    const high = rgb(ramp(0.22));
    expect(between[0]).toBeGreaterThan(low[0]);
    expect(between[0]).toBeLessThan(high[0]);
  });
});

describe('the month bucketing', () => {
  it('at month grain, one column per month, and every month maps to its own', () => {
    const b = buckets('2024-01', 14, 'month');
    expect(b.count).toBe(14);
    expect(b.idx[0]).toBe(0);
    expect(b.idx[13]).toBe(13);
  });

  it('at quarter grain, three months fold into one column', () => {
    const b = buckets('2024-01', 12, 'quarter');
    expect(b.count).toBe(4);
    // January, February and March are one column; April opens the next.
    expect(b.idx[0]).toBe(0);
    expect(b.idx[2]).toBe(0);
    expect(b.idx[3]).toBe(1);
  });

  it('at year grain, twelve months fold into one column', () => {
    const b = buckets('2024-01', 24, 'year');
    expect(b.count).toBe(2);
    expect(b.idx[11]).toBe(0);
    expect(b.idx[12]).toBe(1);
  });

  it('⚠ marks ONE major per year, which is what stops the duplicated labels', () => {
    // Combining « the majors » with « one in N » produced 2015 2015 2016 2016… — two rules for one
    // need. Only January is a major, so the label pass has a single rule to follow.
    const b = buckets('2024-06', 24, 'month');
    const majors = b.majors.flatMap((m, i) => (m ? [i] : []));
    // 2024-06 … 2026-05 contains exactly two Januaries: 2025-01 at index 7 and 2026-01 at 19.
    expect(majors.length).toBe(2);
    expect(b.labels[majors[0] ?? 0]).toBe('2025-1');
  });

  it('crosses a year boundary without losing a month', () => {
    const b = buckets('2023-11', 4, 'month');
    // Nov, Dec, Jan, Feb — the wrap must not restart the index or collapse two months into one.
    expect(b.labels).toEqual(['2023-11', '2023-12', '2024-1', '2024-2']);
  });
});
