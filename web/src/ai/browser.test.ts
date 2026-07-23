// Witnesses of `detectBrowser` — each engine receives a different DISCOURSE (ADR-0006), so a
// wrong detection sends wrong instructions. The UAs are SYNTHETIC strings reduced
// to the discriminating markers (not UAs copied from a real machine).
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - REAL UAs in all their variety (forks, mobile versions, anti-fingerprinting): we freeze the
//     logic of the markers, not the world's zoo of strings;
//   - THE TRUTH of the network behavior: it stays with `local-network.ts`, read at failure.

import { describe, expect, it } from 'vitest';
import { detectBrowser } from './browser';

describe('detectBrowser', () => {
  it('names the Chromium browsers by their own marker, Chrome last', () => {
    expect(detectBrowser('Mozilla/5.0 Chrome/126.0 Safari/537.36 Edg/126.0', false)).toEqual({
      name: 'Edge',
      engine: 'chromium',
    });
    expect(detectBrowser('Mozilla/5.0 Chrome/126.0 Safari/537.36 OPR/111.0', false)).toEqual({
      name: 'Opera',
      engine: 'chromium',
    });
    expect(detectBrowser('Mozilla/5.0 Chrome/126.0 Safari/537.36', false)).toEqual({
      name: 'Chrome',
      engine: 'chromium',
    });
  });

  it('names Brave by its API, never by the UA (Brave declares itself Chrome)', () => {
    expect(detectBrowser('Mozilla/5.0 Chrome/126.0 Safari/537.36', true)).toEqual({
      name: 'Brave',
      engine: 'chromium',
    });
  });

  it('distinguishes Firefox and Safari (the only « Safari/ » WITHOUT « Chrome/ »)', () => {
    expect(detectBrowser('Mozilla/5.0 Gecko/20100101 Firefox/128.0', false)).toEqual({
      name: 'Firefox',
      engine: 'firefox',
    });
    expect(detectBrowser('Mozilla/5.0 Version/17.5 Safari/605.1.15', false)).toEqual({
      name: 'Safari',
      engine: 'webkit',
    });
  });

  it('concludes NOTHING from a mute UA — this is the « no named cause » path (ADR-0006)', () => {
    expect(detectBrowser('Node.js/22', false)).toEqual({ name: null, engine: 'unknown' });
    expect(detectBrowser('', false)).toEqual({ name: null, engine: 'unknown' });
  });
});
