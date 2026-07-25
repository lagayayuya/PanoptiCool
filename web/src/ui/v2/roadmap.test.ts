// THE PAIRING OF THE ROADMAP — the one thing no type holds.
//
// The page draws its steps from TWO lists that must stay in step:
//   - `ROADMAP_STEPS` (component) — the ORDER and the STATUS, identical in every language;
//   - `UI_ROADMAP.steps` (`ui/copy.fr.ts` / `.en.ts`) — the prose, one entry per step.
//
// They are paired BY INDEX, and nothing in TypeScript can require it: `typeof` of an array gives
// `T[]` and never a tuple — the compiler accepts five statuses facing four texts, exactly as it
// accepts a shorter English array (which is `copy-parity.test.ts`'s subject). The component
// DROPS an unpaired step rather than rendering half of one; this file is what makes that drop
// impossible, in both languages.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation: a proof mechanism declares its border.
//   - IT DOES NOT VERIFY THE ALIGNMENT OF THE MEANING. Two lists of five where the statuses have
//     been shifted by one — « en cours » landing on the English version instead of Instagram —
//     pass here without a word. Only a rereading of the rendered page catches that, and what
//     freezes the rendering is `ui-golden.test.ts`;
//   - IT SAYS NOTHING ABOUT THE DATES. That « 31 juillet 2026 » is still ahead, that a step marked
//     `done` really is: nothing here reads a clock. This list is ratified by hand;
//   - IT DOES NOT REACH THE PAGE. It compares two arrays. That the timeline renders them, in
//     order, with the right rail colors, is the goldens' business.

import { describe, expect, it } from 'vitest';
import { EN } from '../copy.en';
import { FR } from '../copy.fr';
import { ROADMAP_STEPS } from './RoadmapPage';

describe('roadmap — spine and prose', () => {
  // Control « by which path the zero arrives » (CLAUDE.md): two EMPTY lists would satisfy every
  // equality below. The spine is therefore asserted non-empty first, and by its exact length —
  // adding a step must be a knowing gesture here too.
  it('has a spine of five steps', () => {
    expect(ROADMAP_STEPS.length).toBe(5);
  });

  it('gives each step of the spine its French prose', () => {
    expect(FR.UI_ROADMAP.steps.length).toBe(ROADMAP_STEPS.length);
  });

  it('gives each step of the spine its English prose', () => {
    expect(EN.UI_ROADMAP.steps.length).toBe(ROADMAP_STEPS.length);
  });

  // The tag of a step is looked up by status. A status without a word would render an EMPTY tag —
  // a step whose state is no longer written anywhere, on a page whose whole subject is the state
  // of things.
  it('names every status used by the spine, in both languages', () => {
    const labels = { done: 'statusDone', now: 'statusNow', next: 'statusNext' } as const;
    for (const status of new Set(ROADMAP_STEPS)) {
      expect(FR.UI_ROADMAP[labels[status]]).toBeTruthy();
      expect(EN.UI_ROADMAP[labels[status]]).toBeTruthy();
    }
  });
});
