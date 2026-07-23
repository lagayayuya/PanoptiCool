// What the browser lets through toward `localhost` — the question `fetch` refuses to answer.
//
// WHY THIS MODULE EXISTS. A `fetch` toward the local server fails with `TypeError: Failed to
// fetch`, and this string is RIGOROUSLY THE SAME whether the server is absent or the
// browser blocked the request (measured: a dead port, an unreachable IP and a real block return
// identical bytes). The browser console, for its part, knows exactly what happened — but
// none of that is readable from the script. The product thus asserted "server not detected"
// to someone whose server was running.
//
// The permission, however, is read WITHOUT touching the network. It is the only angle by which a
// script can distinguish "no server" from "the browser refused" (ADR-0006).
//
// ─── WHAT THIS MODULE DOES NOT COVER ────────────────────────────────────────────────────────────
// CLAUDE.md obligation: a proof mechanism declares its boundary.
//   - IT DOES NOT PROBE THE SERVER. It says what the browser authorizes, never whether something
//     is listening at the other end. The two combine at the caller;
//   - `unknown` DOES NOT MEAN "authorized". It means this browser does not know this
//     permission, so NOTHING can be concluded — neither one way nor the other. A browser
//     that blocks by another route (mixed-content control, with no permission to grant) falls
//     here, and the interface must then offer both outcomes rather than guess one;
//   - IT DOES NOT SAY HOW TO UNBLOCK. The exact path (setting, menu, command) depends on the
//     browser and lives in the copy, not here.

/**
 * What the browser authorizes toward the local address space.
 *
 * `blocked` DELIBERATELY combines the API's `prompt` and `denied` states. It is not a
 * shortcut: on the measured Chromium browsers, `prompt` never resolves on its own —
 * no window opens, even behind a real click, and the permission stays indefinitely in
 * that state (ADR-0006). A `prompt` that does not complete is a block from the point of view of the
 * person in front of the screen, and it is that point of view the interface must serve.
 */
export type LocalNetworkGate = 'granted' | 'blocked' | 'unknown';

/** Name of the permission (Local Network Access specification). Absent from browsers that
 * do not implement LNA — their `query` then rejects, which is the `unknown` path. */
const PERMISSION_NAME = 'local-network-access';

/**
 * Reads the "local network" permission WITHOUT emitting any request.
 *
 * Never throws: anything that is not a usable response becomes `unknown`, because a
 * caller that must choose a sentence to display has no use for an exception.
 */
export async function localNetworkGate(): Promise<LocalNetworkGate> {
  // `navigator.permissions` is missing from entire contexts (old browsers, some Workers) —
  // optional access avoids turning it into an exception to catch.
  const permissions = globalThis.navigator?.permissions;
  if (permissions === undefined) return 'unknown';
  try {
    // The name is not in the TS lib's `PermissionName`: the LNA spec is more recent than the
    // bundled types. The cast bears on the NAME ONLY, and the `catch` covers precisely the case where
    // the browser does not recognize it.
    const status = await permissions.query({ name: PERMISSION_NAME as PermissionName });
    return status.state === 'granted' ? 'granted' : 'blocked';
  } catch {
    return 'unknown';
  }
}
