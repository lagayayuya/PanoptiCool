// THE PAIRING OF THE HOME'S RESOURCE RAILS — the one thing no type holds.
//
// The two rails at the foot of the page draw from TWO lists that must stay in step:
//   - `LEARN_URLS` / `ACT_URLS` (component) — the addresses, identical in every language;
//   - `UI_LANDING.learnLinks` / `actLinks` (`ui/copy.fr.ts` / `.en.ts`) — the name and the note.
//
// They are paired BY INDEX, on the model of the roadmap's spine, and for the same reason: a URL is
// an address, not prose. Nothing in TypeScript can require the pairing — `typeof` of an array gives
// `T[]` and never a tuple, so three URLs facing two entries compiles. What it renders is a link
// pointing at `#`, which looks like a link and goes nowhere.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation: a proof mechanism declares its border.
//   - IT DOES NOT OPEN THE LINKS. That `haveibeenpwned.com` still answers, that the Privacy Guides
//     page still lives at that path, is not reachable from a test that must run offline. These six
//     addresses were opened by hand when they were written; nothing here will notice the day one
//     of them 404s. That is the most likely way this page rots.
//   - IT DOES NOT CHECK THAT THE NAME DESCRIBES THE DESTINATION. « noyb » facing the address of
//     La Quadrature du Net passes: the lists would have the right length and the wrong order. Only
//     a human reading the rendered rail catches that.
//   - IT SAYS NOTHING ABOUT THE PLATFORM CARDS. Those read their bullets straight from `copy.*`
//     with no parallel spine, so there is nothing to pair — `copy-parity.test.ts` holds their
//     FR/EN lengths.

import { describe, expect, it } from 'vitest';
import { EN } from '../copy.en';
import { FR } from '../copy.fr';
import { ACT_URLS, LEARN_URLS } from './LandingPage';

describe('home — resource rails, spine and prose', () => {
  // Control « by which path the zero arrives » (CLAUDE.md): two EMPTY lists would satisfy every
  // equality below. The spines are asserted by their exact length first, so that adding a link is
  // a knowing gesture here as much as in the copy.
  it('has three addresses per rail', () => {
    expect(LEARN_URLS.length).toBe(3);
    expect(ACT_URLS.length).toBe(3);
  });

  it('gives every address its prose, in both languages', () => {
    for (const bundle of [FR, EN]) {
      expect(bundle.UI_LANDING.learnLinks.length).toBe(LEARN_URLS.length);
      expect(bundle.UI_LANDING.actLinks.length).toBe(ACT_URLS.length);
    }
  });

  // A rail entry with an empty name renders a link with nothing to click on, and one with an empty
  // note renders a box half the height of its neighbours — both pass the length checks above.
  it('leaves no entry without a name or a note', () => {
    for (const bundle of [FR, EN]) {
      for (const link of [...bundle.UI_LANDING.learnLinks, ...bundle.UI_LANDING.actLinks]) {
        expect(link.name.length).toBeGreaterThan(0);
        expect(link.note.length).toBeGreaterThan(0);
      }
    }
  });

  // The addresses are absolute and external: a relative one would resolve against `/fr` or `/en`
  // and quietly become a broken internal link, which is not what a rail of outside resources is.
  it('points outward, over https', () => {
    for (const url of [...LEARN_URLS, ...ACT_URLS]) {
      expect(url.startsWith('https://')).toBe(true);
    }
  });
});
