// THE TWEENS THAT REPLACED GSAP — that they reach their target, and land exactly on it.
//
// ⚠ THE FAILURES HERE ARE ALL QUIET. A tween that stops a thousandth short still looks like it
// arrived; an easing with the wrong shape still moves the thing; a cancelled tween that keeps
// running just fights whoever took over. None of it throws, and none of it is visible in one frame.
//
// ─── ⚠ WHAT THIS NET DOES NOT COVER ─────────────────────────────────────────────────────────────
//   - HOW IT LOOKS. That `back.out(1.6)` is the right overshoot for a sprite arriving is a design
//     decision taken by watching it; what is asserted is that the curve HAS an overshoot and the
//     documented constant;
//   - FRAME PACING. The clock is faked here, so nothing measures behaviour under a loaded main
//     thread — which is exactly when a per-tween `requestAnimationFrame` would show its limits, as
//     the module's own header says;
//   - CONCURRENT TWEENS ON ONE TARGET. gsap interrupted by default and this does not; the call sites
//     are responsible, and no test here checks that they are.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { easeInOutCubic, easeOutBack, tweenVec3 } from './tween';

/** Drives `requestAnimationFrame` by hand, so a tween can be stepped a frame at a time. */
let now = 0;
let queue: Array<(t: number) => void> = [];

beforeEach(() => {
  now = 0;
  queue = [];
  vi.stubGlobal('requestAnimationFrame', (cb: (t: number) => void) => {
    queue.push(cb);
    return queue.length;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
});
afterEach(() => vi.unstubAllGlobals());

/**
 * Advances the fake clock by `ms` and runs the queue until it settles.
 *
 * ⚠ IT DRAINS RATHER THAN STEPPING ONCE. A tween re-queues itself every frame, so running one batch
 * would advance it by exactly one frame however far the clock moved — and a test asserting « it
 * arrived » would be asserting on a tween one frame old.
 */
function advance(ms: number) {
  now += ms;
  for (let guard = 0; guard < 1000 && queue.length > 0; guard++) {
    const due = queue;
    queue = [];
    for (const cb of due) cb(now);
  }
}

describe('the easings', () => {
  it('are anchored at both ends', () => {
    for (const ease of [easeInOutCubic, easeOutBack()]) {
      expect(ease(0)).toBeCloseTo(0, 10);
      expect(ease(1)).toBeCloseTo(1, 10);
    }
  });

  it('⚠ `back.out` OVERSHOOTS — that is the whole point of it', () => {
    // A sprite that eases in without overshooting reads as teleported into place. Somewhere before
    // the end the curve must go past 1 and come back.
    const ease = easeOutBack();
    const peak = Math.max(...Array.from({ length: 99 }, (_, i) => ease((i + 1) / 100)));
    expect(peak).toBeGreaterThan(1);
  });

  it('`inOut` is symmetric and slow at both ends', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 10);
    // Slow at the start: a tenth of the way through time is far less than a tenth of the way there.
    expect(easeInOutCubic(0.1)).toBeLessThan(0.05);
    expect(easeInOutCubic(0.9)).toBeGreaterThan(0.95);
  });
});

describe('a tween', () => {
  it('⚠ LANDS EXACTLY on its target, not near it', () => {
    // An overshooting easing does not return exactly 1 by accident of floating point, and a sprite
    // left a thousandth off its place never quite arrives — visible when a grid of them should line
    // up.
    const v = { x: 0, y: 0, z: 0 };
    tweenVec3(v, { x: 3, y: -7, z: 0.5 }, { durationMs: 100, ease: easeOutBack() });
    advance(0);
    advance(1000);
    expect(v).toEqual({ x: 3, y: -7, z: 0.5 });
  });

  it('moves through the middle rather than jumping at the end', () => {
    const v = { x: 0, y: 0, z: 0 };
    tweenVec3(v, { x: 100, y: 0, z: 0 }, { durationMs: 100, ease: (t) => t });
    advance(0);
    advance(50);
    expect(v.x).toBeGreaterThan(40);
    expect(v.x).toBeLessThan(60);
  });

  it('honours a delay, which is what staggers an arriving grid', () => {
    const v = { x: 0, y: 0, z: 0 };
    tweenVec3(v, { x: 10, y: 0, z: 0 }, { durationMs: 100, delayMs: 200, ease: (t) => t });
    advance(0);
    advance(150);
    expect(v.x).toBe(0);
    advance(150);
    expect(v.x).toBeGreaterThan(0);
  });

  it('calls back once it has arrived, and only then', () => {
    const done = vi.fn();
    const v = { x: 0, y: 0, z: 0 };
    tweenVec3(v, { x: 1, y: 0, z: 0 }, { durationMs: 100, ease: (t) => t, onDone: done });
    advance(0);
    advance(50);
    expect(done).not.toHaveBeenCalled();
    advance(100);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('⚠ STOPS WHERE IT IS when cancelled — it does not snap to the target', () => {
    // That is what a camera taken over by the person's own drag must do. Snapping would yank the
    // view out from under the gesture that interrupted it.
    const v = { x: 0, y: 0, z: 0 };
    const h = tweenVec3(v, { x: 100, y: 0, z: 0 }, { durationMs: 100, ease: (t) => t });
    advance(0);
    advance(50);
    const mid = v.x;
    h.cancel();
    advance(500);
    expect(v.x).toBe(mid);
    expect(v.x).toBeLessThan(100);
  });
});
