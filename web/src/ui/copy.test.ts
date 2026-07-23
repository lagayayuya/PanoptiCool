// Witnesses of the COUNTED sentences of the catalog, in the SINGULAR.
//
// WHY THIS FILE EXISTS, when two goldens already render these surfaces: the goldens render
// REALISTIC volumes, thus always plural. They stayed green while « 1 items laissés
// de côté » was displayed — the faulty form was on the path of no render. A net proves
// only what it reaches; these cases are therefore fixed at the call, not at the render.
//
// French puts ZERO in the singular — it is half the cases tested here, and the one a hand-written
// `n > 1` silently misses.
//
// ─── WHAT THIS NET DOES NOT COVER ─────────────────────────────────────────────────────────────────
// CLAUDE.md obligation. This file exists precisely because another net had a blind
// spot; its own is the exact symmetric.
//   - IT DOES NOT REACH THE SCREEN. It calls catalog functions. That the sentence is RENDERED,
//     in the right place, with the right spaces around, is a matter of the goldens — the flattening of
//     JSX spaces, in particular, is only visible at render;
//   - IT DOES NOT SEE THE DEAD ENTRIES. An entry of `copy.ts` that no component reads anymore
//     passes this test like the others. Nothing here proves a text is still displayed;
//   - IT ONLY COVERS THE COUNTED SENTENCES, those where an agreement is at play. The overwhelming majority of the
//     catalog is constant and is not reread here;
//   - IT DOES NOT JUDGE THE TONE. Like the goldens: what is written, never whether it is well written.

import { describe, expect, it } from 'vitest';
import { UI_AI, UI_NO_DEDUCTION, UI_UNITS } from './copy';

describe('counted units', () => {
  it('agrees the noun at 0, 1 and 2', () => {
    expect(UI_UNITS.item(0)).toBe('item');
    expect(UI_UNITS.item(1)).toBe('item');
    expect(UI_UNITS.item(2)).toBe('items');
    expect(UI_UNITS.comment(1)).toBe('commentaire');
    expect(UI_UNITS.search(1)).toBe('recherche');
  });
});

describe('counted sentences — the singular, which the goldens never render', () => {
  it('agrees the NOUN and the PARTICIPLE of the discarded items', () => {
    // Ex-bug: « 1 items laissés de côté » — two mistakes in four words.
    expect(UI_AI.tokensDropped(1, '8192')).toBe(
      ' · 1 item laissé de côté (fenêtre de 8192 tokens)',
    );
    expect(UI_AI.tokensDropped(3, '8192')).toBe(
      ' · 3 items laissés de côté (fenêtre de 8192 tokens)',
    );
  });

  it('agrees the noun, adjective and participle of the discarded searches', () => {
    expect(UI_AI.searchesTruncated(1)).toContain('1 recherche plus ancienne laissée de côté');
    expect(UI_AI.searchesTruncated(2)).toContain('2 recherches plus anciennes laissées de côté');
  });

  it('agrees the counters of the « peu de données » banner', () => {
    expect(UI_AI.lowDataCounts(1, 1)).toBe(
      'Ton export contient très peu de texte : 1 commentaire et 1 recherche.',
    );
    // Zero in the singular — the case English would put in the plural.
    expect(UI_AI.lowDataCounts(0, 0)).toBe(
      'Ton export contient très peu de texte : 0 commentaire et 0 recherche.',
    );
  });

  it('agrees the counters of the « aucune déduction » card (ex-« recherche(s) »)', () => {
    expect(UI_NO_DEDUCTION.dataCounts(1, 1)).toBe('1 recherche · 1 commentaire');
    expect(UI_NO_DEDUCTION.dataCounts(0, 2)).toBe('0 recherche · 2 commentaires');
  });
});

describe('typography of percentages written out in full', () => {
  it('separates with a no-break space, never an ASCII space that would allow a line break', () => {
    // The COMPUTED percentages go through `Intl` (U+00A0); those written in prose must
    // place the SAME character, otherwise « 100 » and « % » can end up on two lines.
    for (const s of [UI_AI.localBadge]) {
      expect(s).not.toMatch(/\d %/);
      expect(s).toMatch(/\d %/);
    }
  });
});
