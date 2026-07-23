// Test of the time-estimate wording (D, PANO-85 fix point 2) — PURE function exported from
// `time-estimate.ts`. Checks the EXACT switch at 24 h (hours ↔ days), the « soit ~Y h » format
// only beyond 24 h, and the singular/plural agreement + participle (jour/passé, heure/passée).
// Vitest env = node: we import only the function (no DOM render). WORDING = PANO-45 DRAFT.

import { describe, expect, it } from 'vitest';
import { timeEstimateSentence } from './time-estimate';

describe('timeEstimateSentence — 24 h hours/days switch', () => {
  it('< 24 h → HOURS format, without « soit »', () => {
    // 4 h = 240 min.
    expect(timeEstimateSentence(240)).toBe('~4 heures de ta vie passées cette année sur TikTok.');
  });

  it('exactly 24 h (1440 min) → switches to DAYS with « soit ~Y h »', () => {
    expect(timeEstimateSentence(24 * 60)).toBe(
      '~1 jour de ta vie passé cette année sur TikTok, soit ~24 h.',
    );
  });

  it('just under 24 h (1439 min) → stays in HOURS', () => {
    // 1439 min ≈ 23.98 h → rounds to 24 h, but hours format (switch at exactly 1440 min).
    expect(timeEstimateSentence(1439)).toBe('~24 heures de ta vie passées cette année sur TikTok.');
  });

  it('> 24 h non-integer → days to one decimal + hours (persona: 6000 min)', () => {
    // 6000 min = 100 h = 4.1666… d → « 4,2 jours … soit ~100 h ».
    expect(timeEstimateSentence(6000)).toBe(
      '~4,2 jours de ta vie passés cette année sur TikTok, soit ~100 h.',
    );
  });
});

describe('timeEstimateSentence — singular/plural', () => {
  it('~1 heure (singular, participle « passée »)', () => {
    // 60 min = 1 h.
    expect(timeEstimateSentence(60)).toBe('~1 heure de ta vie passée cette année sur TikTok.');
  });

  it('~1 jour (singular, participle « passé »)', () => {
    expect(timeEstimateSentence(1440)).toContain('~1 jour de ta vie passé ');
  });

  it('whole days → no spurious decimal (« ~2 jours », not « ~2,0 »)', () => {
    // 2 days = 2880 min.
    expect(timeEstimateSentence(2880)).toBe(
      '~2 jours de ta vie passés cette année sur TikTok, soit ~48 h.',
    );
  });
});
