// WHERE TO PORTAL A MODAL — `document.body`, EXCEPT when a scene is in native fullscreen.
//
// ————— The defect it fixes —————
//
// Native fullscreen renders ONLY the promoted element and its descendants: the browser puts it in a
// top layer and the rest of the document stops existing on screen. A modal portalled to
// `document.body` is therefore perfectly mounted, responds to the keyboard, and stays invisible.
// Clicking a figure or a particle while fullscreen seemed to do nothing — then the card appeared all
// at once on leaving fullscreen, where it had been waiting the whole time.
//
// ————— What it does NOT concern —————
//
// The FALLBACK fullscreen (`.is-fs-css`, for Safari iOS which refuses the native one outside video)
// never had this problem: the element stays in the document's flow there, and modals sit above it by
// the cascade. `document.fullscreenElement` is `null` in that mode, so this hook returns
// `document.body` — exactly what is wanted. One rule settles both modes.
//
// ⚠ CHANGING CONTAINER REMOUNTS THE SUBTREE: a media playing at the time restarts from zero. That is
// the price of a fullscreen round trip, and it is paid only there.

import { useEffect, useState } from 'preact/hooks';

export function usePortalHost(): HTMLElement | null {
  const [host, setHost] = useState<HTMLElement | null>(() =>
    typeof document === 'undefined' ? null : hostNow(),
  );

  useEffect(() => {
    const sync = () => setHost(hostNow());
    // Resynchronised on mount: the modal can open WHILE ALREADY fullscreen, in which case no
    // `fullscreenchange` will ever arrive.
    sync();
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  return host;
}

function hostNow(): HTMLElement {
  const fs = document.fullscreenElement;
  return fs instanceof HTMLElement ? fs : document.body;
}
