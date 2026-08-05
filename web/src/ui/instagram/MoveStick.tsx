// « THE STICK » — the touch move control, for the two 3D scenes.
//
// Both scenes are walked with the keyboard. A phone has none, and they became plain images: you
// could turn the view with a finger but never move, so never get inside anything.
//
// ————— What it writes, and how —————
//
// ⚠ IT REPORTS NOTHING TO THE FRAMEWORK. It writes into a ref that the render loop reads on every
// frame. A `useState` per finger movement would cause sixty renders a second of the whole page — for
// a value only the 3D engine consumes.
//
// The output is ANALOGUE, between −1 and 1 on each axis, length bounded to 1. A stick returning only
// all-or-nothing would be worth four keys, and you could not approach something slowly — the most
// useful gesture in both scenes.
//
// It appears only for COARSE pointers or narrow screens (see the sheet): on a machine with a
// keyboard it would occupy a corner of the scene for nothing.
//
// ─── ⚠ WHAT THIS CONTROL DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT IS NOT KEYBOARD-REACHABLE, deliberately: it exists because there is no keyboard. Where
//     there is one, the arrow keys on the scene are the path, and this control is not rendered;
//   - IT DOES NOT TURN THE VIEW. Rotation stays on the canvas underneath; this pad swallows its own
//     gesture so the two do not fire at once.

import type { RefObject } from 'preact';
import { useRef } from 'preact/hooks';
import { UI_IG_CONTROLS } from '../copy.instagram';
import './movestick.css';

export interface MoveVec {
  x: number;
  z: number;
}

/** Usable radius of the pad, in pixels. Must match `--stick-r` in the sheet. */
const R = 46;

export function MoveStick({
  vecRef,
  onEngage,
  label,
}: {
  vecRef: RefObject<MoveVec>;
  /** Called on first contact — used to lift the controls veil. */
  onEngage?: () => void;
  label?: string;
}) {
  const padRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);

  const setVec = (x: number, z: number) => {
    const vec = vecRef.current;
    if (vec === null) return;
    vec.x = x;
    vec.z = z;
    const k = knobRef.current;
    if (k !== null) k.style.transform = `translate(${x * R}px, ${z * R}px)`;
  };

  const track = (e: PointerEvent & { currentTarget: HTMLDivElement }) => {
    const pad = padRef.current;
    if (pad === null) return;
    const r = pad.getBoundingClientRect();
    let dx = (e.clientX - (r.left + r.width / 2)) / R;
    let dy = (e.clientY - (r.top + r.height / 2)) / R;
    const len = Math.hypot(dx, dy);
    // Bounded to the CIRCLE, not the square: otherwise a diagonal would go 1.41 times faster than a
    // straight line, which is felt immediately in use.
    if (len > 1) {
      dx /= len;
      dy /= len;
    }
    setVec(dx, dy);
  };

  return (
    // `role="application"` is the point: this pad takes raw pointer gestures, and no native element
    // carries that meaning.
    <div
      ref={padRef}
      class="stick"
      role="application"
      aria-label={label ?? UI_IG_CONTROLS.stickLabel}
      // The pad swallows the gesture: without this it would also trigger the view rotation, which
      // lives on the canvas just underneath.
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        onEngage?.();
        track(e);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) track(e);
      }}
      onPointerUp={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setVec(0, 0);
      }}
      // A finger leaving the screen, or an incoming call, would otherwise leave the stick jammed at
      // full deflection and the camera running away.
      onPointerCancel={() => setVec(0, 0)}
      onLostPointerCapture={() => setVec(0, 0)}
    >
      <span class="stick-ring" aria-hidden="true" />
      <span ref={knobRef} class="stick-knob" aria-hidden="true" />
    </div>
  );
}
