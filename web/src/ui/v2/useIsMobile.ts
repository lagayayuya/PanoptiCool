// Mobile detection for the layout variants (« … Mobile » mockups, 2026-07-15 rework).
// The v2 components are styled inline (no per-component CSS sheet), so no media query is
// possible at the style level: we switch the layout in JS via `matchMedia`. All the
// components concerned are `client:only` islands (ADR-0002) — `window` always exists at render.

import { useEffect, useState } from 'preact/hooks';

/** Single threshold: below it, the mobile mockups apply (designed at 390 px, container
 * max 480 px); above it, the desktop mockups. */
export const MOBILE_QUERY = '(max-width: 720px)';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}
