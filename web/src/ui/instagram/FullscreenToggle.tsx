// « FULLSCREEN » — for the two 3D scenes.
//
// ————— Why the button lives INSIDE the scene —————
//
// Native fullscreen shows ONE element: everything outside it disappears. A button placed in a
// settings bar would therefore be invisible once you were in, and the only way out would be guessing
// Escape. It sits in the element that goes fullscreen, so it is always reachable — the same control
// takes you in and out.
//
// ————— Two mechanisms, because one is not enough —————
//
// Native fullscreen is asked for first. Safari on iPhone grants it to no element but a video: on the
// main mobile browser, relying on it alone would give nothing. So it falls back to a CSS fullscreen
// — the element takes the whole window in `fixed`. The rendering is the same but for the browser's
// own bar remaining; vastly preferable to a button that does nothing.
//
// The CSS mode has to reimplement what the native one provides: Escape to leave, and blocking the
// scroll of the page behind.
//
// ─── ⚠ WHAT THIS CONTROL DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT DOES NOT MAKE THE SCENE RESPONSIVE. It changes the element's size; a renderer that does not
//     watch its container will keep drawing at the old one. Both scenes observe their canvas;
//   - IT DOES NOT SURVIVE A REMOUNT. Leaving the piece while fullscreen leaves the document's own
//     state to the browser, which exits it — correct, and not something this component tracks.

import type { RefObject } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { UI_IG_CONTROLS } from '../copy.instagram';
import './fullscreen.css';

export function FullscreenToggle({
  targetRef,
  label,
}: {
  targetRef: RefObject<HTMLElement | null>;
  /** Completes the label: « Show the scene fullscreen ». */
  label?: string;
}) {
  const t = UI_IG_CONTROLS;
  const what = label ?? t.fullscreenScene;
  const [on, setOn] = useState(false);
  /** True when in the CSS fallback — the native state is read from the document instead. */
  const [css, setCss] = useState(false);

  /** The browser can leave without us (Escape, a system gesture): follow its state. */
  useEffect(() => {
    const sync = () => {
      // The CSS fallback does not depend on the document's state: it must not be overwritten.
      if (css) return;
      setOn(document.fullscreenElement === targetRef.current);
    };
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, [targetRef, css]);

  /** CSS fallback: Escape leaves, and the page behind must not scroll. */
  useEffect(() => {
    if (!on || !css) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOn(false);
        setCss(false);
      }
    };
    document.body.classList.add('fs-lock');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('fs-lock');
      window.removeEventListener('keydown', onKey);
    };
  }, [on, css]);

  /**
   * ⚠ THE CLASS IS SET IN BOTH MODES, native included.
   *
   * It used to serve the fallback only, and the native mode relied on the `:fullscreen` selector.
   * That was fragile: the page's sheet fixes a height on the stage which survives going fullscreen,
   * and it had to be contradicted rule by rule, winning the specificity race every time. One scene
   * passed, the other did not.
   *
   * `is-fs` carries the SIZE in both modes; `is-fs-css` adds the POSITIONING, and only in fallback.
   * Forcing both on the native mode was the second defect: the browser already puts the element in
   * the top layer, and re-imposing `position: fixed` made it render at its natural size in the
   * middle of a black background.
   */
  useEffect(() => {
    const el = targetRef.current;
    if (el === null) return;
    el.classList.toggle('is-fs', on);
    el.classList.toggle('is-fs-css', on && css);
    return () => {
      el.classList.remove('is-fs');
      el.classList.remove('is-fs-css');
    };
  }, [on, css, targetRef]);

  const toggle = () => {
    const el = targetRef.current;
    if (el === null) return;
    if (on) {
      if (document.fullscreenElement !== null) void document.exitFullscreen().catch(() => {});
      setOn(false);
      setCss(false);
      return;
    }
    if (typeof el.requestFullscreen === 'function') {
      void el
        .requestFullscreen()
        .then(() => {
          setCss(false);
          setOn(true);
        })
        // Refused (iOS, a permissions policy, a disallowed iframe): fall back to CSS rather than
        // give up. The person's gesture has to produce something.
        .catch(() => {
          setCss(true);
          setOn(true);
        });
      return;
    }
    setCss(true);
    setOn(true);
  };

  return (
    <button
      type="button"
      class="fs-btn"
      aria-pressed={on}
      // The label states the ACTION, not the state — « Leave » when leaving is what it does.
      // `aria-pressed` carries the state, so a screen reader announces both without repeating.
      aria-label={on ? t.fullscreenExit(what) : t.fullscreenEnter(what)}
      onClick={toggle}
    >
      <span class="fs-ico" aria-hidden="true">
        {on ? '⤡' : '⤢'}
      </span>
      {/* Hidden when narrow by the sheet — the label would eat the scene. `aria-label` goes on
          carrying the whole sentence for a screen reader either way. */}
      <span class="fs-txt">{on ? t.fullscreenExitShort : t.fullscreenShort}</span>
    </button>
  );
}
