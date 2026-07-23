// Witness of the "local network" permission read.
//
// WHY THIS FILE EXISTS, and why the detection is a MODULE and not a closure in
// `AiSection`: the goldens render strings WITHOUT running a single `useEffect` (their header
// says so). A detection living in the component would therefore be reached by no net — neither
// golden, nor unit test. Here, the four paths are proven at the call.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation.
//   - IT TOUCHES NO REAL BROWSER. `navigator.permissions` is simulated: this file proves
//     the TRANSLATION of the states into `LocalNetworkGate`, never that such-and-such browser
//     returns such-and-such state. What a browser ACTUALLY returns is recorded in ADR-0006, from
//     manual measurement;
//   - IT DOES NOT PROVE THAT `prompt` NEVER RESOLVES. That is a field observation
//     (ADR-0006), not a property this file can establish — it only freezes the DECISION
//     drawn from it: `prompt` counts as a block;
//   - IT DOES NOT REACH THE SCREEN. Which sentence follows from which `gate` is a matter of the
//     copy and the goldens.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { localNetworkGate } from './local-network';

/** Replaces `navigator.permissions` for the duration of a case. `undefined` simulates a context that
 * does not have the API at all. */
function withPermissions(query: ((d: { name: string }) => Promise<{ state: string }>) | undefined) {
  vi.stubGlobal('navigator', query === undefined ? {} : { permissions: { query } });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('localNetworkGate', () => {
  it('returns `granted` when the browser has granted the permission', async () => {
    withPermissions(async () => ({ state: 'granted' }));
    await expect(localNetworkGate()).resolves.toBe('granted');
  });

  // The two cases that ground the product decision: `prompt` and `denied` are equivalent on screen.
  it('returns `blocked` for `prompt` — the window that never opens is a block', async () => {
    withPermissions(async () => ({ state: 'prompt' }));
    await expect(localNetworkGate()).resolves.toBe('blocked');
  });

  it('returns `blocked` for `denied`', async () => {
    withPermissions(async () => ({ state: 'denied' }));
    await expect(localNetworkGate()).resolves.toBe('blocked');
  });

  // ⚠ This case is the path of browsers WITHOUT Local Network Access. The zero-knowledge it
  // encodes is the opposite of an authorization: it is what forces the interface to offer both
  // outcomes instead of asserting one. On a day this path returned `granted` by mistake, the
  // product would start again saying "server not detected" to someone whose server is running.
  it('returns `unknown` when the browser does not know this permission', async () => {
    withPermissions(() => Promise.reject(new TypeError('unsupported permission name')));
    await expect(localNetworkGate()).resolves.toBe('unknown');
  });

  it('returns `unknown` when the permissions API is absent', async () => {
    withPermissions(undefined);
    await expect(localNetworkGate()).resolves.toBe('unknown');
  });

  it('never throws, even if `query` blows up unexpectedly', async () => {
    withPermissions(() => {
      throw new Error('boom');
    });
    await expect(localNetworkGate()).resolves.toBe('unknown');
  });
});
