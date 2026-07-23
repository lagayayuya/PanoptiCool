// D2 wording coverage (PANO-75) — moved onto `wording.ts` in Refonte A (batch A2).
//
// Each key D2 CAN resolve — theme name, usage, actor — has its text, so that no
// "[gabarit manquant]" appears on a theme card. D2's generic claim, though, is an imported
// function: its presence is held by the COMPILER, this test no longer has to check it.
//
// ⚠ THIS TEST IS THE ONLY NET ON THESE ~110 KEYS, and it is the refonte's blind spot: the render
// golden covers only the themes the persona exercises (chats, cinema_series) — i.e. 2 out of ~60.
// A label or usage unrouted on the other ~50 would pass the golden GREEN and render
// "[gabarit manquant : theme.x.label]" at the user's. The keys being open strings carried by the
// lexicon (UNTOUCHABLE), the compiler cannot hold them: test-only exhaustiveness is the real
// ceiling. DO NOT LIGHTEN — there is nothing behind it.

import { describe, expect, it } from 'vitest';
import { LOCALES } from '../i18n/locales';
import { INTEREST_LEXICONS } from './lexicon/interests';
import {
  hasActorLabel,
  hasThemeLabel,
  hasUsage,
  MISSING_WORDING_PREFIX,
  themeLabelText,
} from './wording';

describe('D2 wording coverage (interest themes)', () => {
  it('the registry carries lexicons (the sweep does not miss the real coverage)', () => {
    expect(INTEREST_LEXICONS.length).toBeGreaterThan(0);
  });

  it('each theme has its label + each usage its text + each actor its label', () => {
    for (const lexicon of INTEREST_LEXICONS) {
      expect(hasThemeLabel(lexicon.themeLabel), `libellé manquant : ${lexicon.themeLabel}`).toBe(
        true,
      );
      for (const u of lexicon.usage) {
        expect(hasUsage(u.usage.templateId), `usage manquant : ${u.usage.templateId}`).toBe(true);
        // ⚠ WE TEST THE ROUTING, NOT THE DIFFERENCE FROM THE KEY. The old form required
        // `actorLabel(k) !== k`: true in French by accident, false as soon as a word translates to
        // itself (`advertiser` → `advertiser`). `hasActorLabel` states the intended property.
        expect(hasActorLabel(u.actor), `acteur non routé : ${u.actor}`).toBe(true);
      }
    }
  });

  it('no theme label renders the "missing" marker', () => {
    for (const lexicon of INTEREST_LEXICONS) {
      for (const locale of LOCALES) {
        expect(
          themeLabelText(locale, lexicon.themeLabel).startsWith(MISSING_WORDING_PREFIX),
          `libellé manquant en ${locale} : ${lexicon.themeLabel}`,
        ).toBe(false);
      }
    }
  });
});
