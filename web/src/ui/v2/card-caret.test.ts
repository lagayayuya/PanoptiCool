// WITNESS OF THE CLOSED CARET — the marker that says a card can be opened at all.
//
// WHY THIS FILE EXISTS. v5 adds a caret to the header of every deduction card (`ThemeCardV5`
// mockup): v4 had none, and nothing but the cursor said the header was a control. The glyph
// therefore carries real information, and it has TWO values.
//
// ONE OF THE TWO IS REACHED BY NO GOLDEN. The four end-to-end goldens mock `useState` so that every
// boolean initialized to `false` starts `true` (their « precaution 2 », without which they would
// freeze neither verbatim nor highlight). Every card they render is thus OPEN: measured, `▴` appears
// 7 times in each render golden and 11 times in `ui-golden`, and `▾` appears ZERO times in all four.
// The closed caret — the one the reader sees FIRST, before any click — is rendered by nothing under
// test. That is the shape of hole CLAUDE.md calls a coverage held in one direction only.
//
// VERIFIED BY MUTATION, since a witness is not verified by rereading:
//   - swapping the two glyphs in `copy.fr.ts` (`caretClosed: '▴'`) ⇒ this file goes RED and it alone
//     in the suite — the four goldens stay green, which is precisely the point being made above;
//   - dropping the `open ?` branch in `ThemeCardNavy` so the header always renders `caretOpen` ⇒ this
//     file goes RED, the goldens stay green.
// Both were run, both gave the predicted result.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - THE OPEN CARET. Held by the four goldens, which render nothing else — this file deliberately
//     does not duplicate them;
//   - THE TRANSITION. Nothing here clicks. What is frozen is the FIRST render, like
//     `sensitive-collapse.test.ts` next door and for the same reason: it is the state the reader
//     meets, not a behaviour over time;
//   - WHETHER THE GLYPH IS LEGIBLE, OR EVEN VISIBLE. It renders `aria-hidden` (the button's
//     `aria-expanded` already carries the state for a screen reader); its size and its colour are
//     inline styles, which `readable()` strips from the goldens and this file never reads;
//   - THE THEME CARD's own header. `ThemeCardNavy` and `SignalCardNavy` are two components with two
//     `useState`; this file exercises the THEME one. The signal card's collapsed first render is
//     the subject of `sensitive-collapse.test.ts`.

import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { expect, it } from 'vitest';
import type { AnalysisTheme } from '../../engine/analysis';
import { UI_CARD } from '../copy';
import { ThemeCardNavy } from './ThemeCardNavy';

// Synthetic verbatim (repo invariant: no value from a real export) — a string ONLY the expanded
// body can make appear.
const VERBATIM = 'zzz-preuve-temoin-caret';

const THEME: AnalysisTheme = {
  id: 'cooking',
  label: 'Cuisine',
  deductions: [
    {
      label: 'Cuisine',
      sensitive: false,
      confidence: 'medium',
      evidence: [
        { channel: 'search', sourceIndex: 0, text: VERBATIM, date: '2026-01-01 00:00:00' },
      ],
    },
  ],
  usage: [],
};

it('a closed card shows the CLOSED caret (the state no golden renders)', () => {
  const html = render(h(ThemeCardNavy, { theme: THEME, reuseMap: new Map() }));

  // Anchoring: the card really is closed. Asserting the glyph alone would pass on a card whose
  // state we had not established — the zero below would then have two possible causes.
  expect(html).toContain('aria-expanded="false"');
  expect(html).not.toContain(VERBATIM);

  // The bearing assertion, in BOTH directions: the closed glyph is there AND the open one is not.
  // Only the first would go green if the header rendered both.
  expect(html).toContain(UI_CARD.caretClosed);
  expect(html).not.toContain(UI_CARD.caretOpen);
});
