// THE TWEENS THE MEDIA UNIVERSE NEEDS, and nothing more.
//
// ⚠ IT EXISTS BECAUSE GSAP DOES NOT SHIP. Its licence reads « standard "no charge" license » — not an
// OSI licence, and CLAUDE.md forbids a blocking proprietary dependency under AGPL without explicit
// justification (ADR-0005). The prototype used it in eight places, all of the same shape: move a
// vector to another vector over a duration, with an easing.
//
// ⚠ AND THAT IS ALL THIS IS. A general animation library is a large surface; eight vector tweens are
// forty lines. What is NOT here — timelines, staggering as a first-class idea, keyframes, scroll
// triggers, plugin easings — is not missing, it is out of scope. The day something needs one, it
// arrives designed, not by widening this.
//
// ─── ⚠ WHAT THIS MODULE DOES NOT DO ─────────────────────────────────────────────────────────────
//   - IT DOES NOT DRIVE ITS OWN CLOCK. There is no ticker: each tween holds a `requestAnimationFrame`
//     of its own, which is the right shape for a handful and the wrong one for hundreds. The universe
//     starts at most a few dozen at once, and staggers the rest;
//   - IT DOES NOT INTERRUPT A TWEEN ON THE SAME TARGET. gsap did, by default. Two tweens racing to
//     move one vector will fight, and the last frame written wins. Every call site here either
//     targets something nothing else is moving, or is the only tween of its kind in flight — see
//     `cancel`, which the camera paths use to make that true rather than assume it;
//   - IT DOES NOT SNAP TO THE TARGET ON CANCEL. A cancelled tween stops where it is, which is what a
//     camera taken over by the person's own drag should do.

export interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

export type Easing = (t: number) => number;

/**
 * `power3.inOut` — the prototype's camera easing. Slow at both ends, quick through the middle: a
 * camera that starts and stops abruptly reads as a cut rather than as a move.
 */
export const easeInOutCubic: Easing = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * `back.out(1.6)` — the arrival easing. It OVERSHOOTS and settles, which is what makes a sprite look
 * placed rather than teleported. 1.6 is the prototype's overshoot; the formula below is the standard
 * one with that constant substituted, so the curve is the same.
 */
export const easeOutBack = (overshoot = 1.6): Easing => {
  const c3 = overshoot + 1;
  return (t) => 1 + c3 * (t - 1) ** 3 + overshoot * (t - 1) ** 2;
};

export interface TweenHandle {
  /** Stops where it is. Safe to call after it has finished. */
  cancel: () => void;
}

/**
 * Moves `target` to `to` over `durationMs`. Returns a handle so a caller can drop it — which the
 * camera does the moment the person takes over.
 */
export function tweenVec3(
  target: Vec3Like,
  to: Vec3Like,
  options: { durationMs: number; ease?: Easing; delayMs?: number; onDone?: () => void },
): TweenHandle {
  const ease = options.ease ?? easeInOutCubic;
  const delay = options.delayMs ?? 0;
  const from = { x: target.x, y: target.y, z: target.z };
  const to3 = { x: to.x, y: to.y, z: to.z };
  let raf = 0;
  // ⚠ `null`, NOT `0`, as the « not started » sentinel. A real `requestAnimationFrame` timestamp is
  // never 0, so `start === 0` looked safe — and it silently re-anchored the tween on every frame
  // under a clock that does start at zero, freezing it at its origin forever. Found by the test,
  // which drives its own clock; a browser would never have shown it.
  let start: number | null = null;
  let cancelled = false;

  const step = (now: number) => {
    if (cancelled) return;
    if (start === null) start = now;
    const elapsed = now - start - delay;
    if (elapsed < 0) {
      raf = requestAnimationFrame(step);
      return;
    }
    const p = Math.min(1, elapsed / options.durationMs);
    const k = ease(p);
    target.x = from.x + (to3.x - from.x) * k;
    target.y = from.y + (to3.y - from.y) * k;
    target.z = from.z + (to3.z - from.z) * k;
    if (p < 1) {
      raf = requestAnimationFrame(step);
      return;
    }
    // ⚠ LANDED EXACTLY on the target. An easing that overshoots does not end at 1 by accident of
    // floating point, and a sprite left a thousandth off its place is a sprite that never quite
    // arrives — visible when a whole grid of them is meant to line up.
    target.x = to3.x;
    target.y = to3.y;
    target.z = to3.z;
    options.onDone?.();
  };
  raf = requestAnimationFrame(step);

  return {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    },
  };
}
