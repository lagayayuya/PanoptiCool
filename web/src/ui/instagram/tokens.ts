// THE DATA COLOURS, read from the stylesheet rather than written twice.
//
// ⚠ WHY THIS EXISTS. A handful of tints ENCODE MEANING — the two sides of a conversation, the five
// content types, the ramp's ends — and they are needed on BOTH sides: in CSS for legends and bars,
// in TypeScript for canvas gradients and computed fills. The prototype wrote them twice, and the
// result is on the record: two violets (#c58af0 / #cdb6f0) and two mints (#63c2a3 / #5fd4b0)
// depending on the page. Same value today, guaranteed divergence tomorrow.
//
// The stylesheet stays THE home. This module reads what is declared there, so a tint changed in one
// place changes everywhere — including inside a canvas.
//
// ─── ⚠ WHAT THIS MODULE DOES NOT GUARANTEE ──────────────────────────────────────────────────────
//   - IT READS `:root` AT CALL TIME. The shell's sheet is loaded by the page, so it is in place long
//     before a lazily-loaded module runs. If someone moved these tokens into a MODULE sheet, the
//     read would return the fallback and say nothing about it;
//   - IT DOES NOT FOLLOW A THEME CHANGE. Values are memoised on first read. There is one theme
//     today; the day there are two, this cache has to be cleared, and this line is the only warning;
//   - IT IS NOT AVAILABLE WITHOUT A DOM. Every caller is a browser component; a golden that rendered
//     one in Node would get the fallback for every colour, silently. No golden does yet.

/** Returned when a property is missing — a VISIBLE colour, never a silent black. */
const FALLBACK = '#8d9ab8';

const cache = new Map<string, string>();

/** The computed value of a custom property on `:root`. */
export function token(name: string): string {
  const hit = cache.get(name);
  if (hit !== undefined) return hit;
  const raw =
    typeof document === 'undefined'
      ? ''
      : getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = raw === '' ? FALLBACK : raw;
  cache.set(name, value);
  return value;
}

/**
 * The meaning-bearing vocabulary.
 *
 * ⚠ THESE ARE FUNCTIONS, NOT CONSTANTS. A constant would be frozen at the moment the module is
 * imported — which, for a lazily-loaded module, depends on which page was visited and when. A
 * function reads when the pixel is about to be drawn.
 *
 * When two axes need the same idea they take the SAME entry, never a neighbouring one. That rule is
 * what the two violets came from breaking.
 */
export const DATA = {
  /** « you », one-to-one threads. */
  cyan: () => token('--ig-accent'),
  /** « the other », group threads, the ramp's full end. */
  orange: () => token('--ig-warm'),
  violet: () => token('--ig-violet'),
  green: () => token('--ig-green'),
  amber: () => token('--ig-amber'),
  inkBright: () => token('--ig-ink-bright'),
  muted: () => token('--ig-muted'),
  faint: () => token('--ig-faint'),
} as const;

export const SURFACE = {
  /** The empty cell of a grid — the ramp's zero end. */
  panelHi: () => token('--ig-panel-hi'),
  panel: () => token('--ig-panel'),
  /** The scenes' background, and the colour their fog fades into. */
  bg: () => token('--ig-bg'),
  line: () => token('--ig-line'),
  line3: () => token('--ig-line-3'),
} as const;

/**
 * A token as a NUMBER, for three.js — which takes `0xrrggbb` and not a CSS string.
 *
 * ⚠ IT ACCEPTS ONLY `#rrggbb`, and returns a visible magenta otherwise rather than a silent black.
 * A scene built from tokens that quietly resolved to zero is a scene that renders, looks plausible,
 * and is wrong — the exact failure `token()`'s own fallback exists to avoid.
 */
export function hex(css: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(css.trim());
  return m === null ? 0xff00ff : Number.parseInt(m[1] as string, 16);
}
