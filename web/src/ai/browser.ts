// Which browser is looking at the page — to choose WHICH instructions to show first.
//
// ADR-0006: an HTTPS site's access to the local server depends on the browser's ENGINE, and the
// three engines are not three degrees of the same problem — Firefox asks for the permission on its
// own, Chromium requires it without ever offering it, WebKit cannot work. The interface thus has
// three possible discourses, and this module says which one to hold.
//
// ─── WHAT THIS MODULE DOES NOT COVER ────────────────────────────────────────────────────────────
// CLAUDE.md obligation: a mechanism declares its boundary.
//   - THE USER-AGENT IS DECLARATIVE. A browser can disguise itself (anti-fingerprinting settings,
//     exotic forks): this module chooses INSTRUCTIONS to display, never a security behavior. The
//     truth about the permission stays `local-network.ts`, read at the moment of failure;
//   - `unknown` IS NOT A VERDICT. An unrecognized engine is neither compatible nor blocked — it is
//     the case where the interface names no cause (ADR-0006, decision 4);
//   - IT DOES NOT DETECT VERSIONS. Chromium's "local network" permission dates from
//     Chrome 142: an older Chromium reaches localhost without asking anything, and falls here into
//     the same discourse as the recent ones — the padlock instruction is simply moot there.

/** The ENGINE, the only dimension that decides the discourse (ADR-0006). */
export type BrowserEngine = 'chromium' | 'firefox' | 'webkit' | 'unknown';

export interface BrowserInfo {
  /** Display name (« Brave », « Safari »…) — `null` when the UA says nothing usable;
   * the interface then falls back to « ton navigateur » (catalog). */
  name: string | null;
  engine: BrowserEngine;
}

/**
 * Best-effort detection from the user-agent. `hasBraveApi` comes from `'brave' in navigator`:
 * Brave declares itself as Chrome in its UA, only its API names it.
 *
 * The order of the tests follows the specificity of the markers: Chromium browsers all embed
 * `Chrome/`, and Safari is the only one to carry `Safari/` WITHOUT `Chrome/`.
 */
export function detectBrowser(userAgent: string, hasBraveApi: boolean): BrowserInfo {
  if (hasBraveApi) return { name: 'Brave', engine: 'chromium' };
  if (userAgent.includes('Firefox/')) return { name: 'Firefox', engine: 'firefox' };
  if (userAgent.includes('Edg/')) return { name: 'Edge', engine: 'chromium' };
  if (userAgent.includes('OPR/')) return { name: 'Opera', engine: 'chromium' };
  if (userAgent.includes('Chrome/')) return { name: 'Chrome', engine: 'chromium' };
  if (userAgent.includes('Safari/')) return { name: 'Safari', engine: 'webkit' };
  return { name: null, engine: 'unknown' };
}
