// Witnesses of the FR formatting. Two rules are caught here, and neither is intuitive — that is
// precisely why they are tested rather than left to review.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDecimal, formatFixedDecimal, formatInt, formatPercent, plural } from './format';

describe('formatInt — thousands grouping', () => {
  it('groups with a NARROW no-break space (U+202F), not an ASCII space', () => {
    // The point of the file: two hand-written `formatInt` diverged on THIS character, and the
    // golden did not show it. We therefore fix it explicitly, by code point.
    expect(formatInt(50_000)).toBe('50 000');
    expect(formatInt(1_234_567)).toBe('1 234 567');
  });

  it('does not group below a thousand, and rounds', () => {
    expect(formatInt(420)).toBe('420');
    expect(formatInt(419.6)).toBe('420');
  });
});

describe('formatPercent — percentage', () => {
  it('separates with an ORDINARY no-break space (U+00A0), not the narrow one of thousands', () => {
    // The CLDR distinction the hand-written code missed: U+202F for thousands, U+00A0 here.
    expect(formatPercent(0.26)).toBe('26 %');
    expect(formatPercent(0.01)).toBe('1 %');
  });

  it('takes a RATIO, not a 0–100 value', () => {
    expect(formatPercent(1)).toBe('100 %');
  });
});

describe('formatDecimal — decimal with a comma', () => {
  it('renders a comma, never a point', () => {
    expect(formatDecimal(4.2)).toBe('4,2');
  });

  it('renders an INTEGER when the count comes out round (the singular depends on it)', () => {
    // `timeEstimateSentence` tests `daysStr === '1'` to choose « jour » rather than « jours ».
    // If this rendered « 1,0 », the singular would never trigger.
    expect(formatDecimal(1)).toBe('1');
    expect(formatDecimal(2)).toBe('2');
  });
});

describe('formatFixedDecimal — decimal ALWAYS displayed', () => {
  it('keeps the null decimal, where `formatDecimal` removes it', () => {
    // The two formatters exist because the right answer depends on the NEIGHBORHOOD: in a
    // column of sizes (2,2 / 1,9 / 1,5), « 2 Go » breaks the alignment; in a sentence,
    // « 1,0 jour » does not read. This test fixes the contrast, not only the value.
    expect(formatFixedDecimal(2)).toBe('2,0');
    expect(formatDecimal(2)).toBe('2');
    expect(formatFixedDecimal(2.2)).toBe('2,2');
  });
});

describe('plural — number agreement', () => {
  it('⚠ puts ZERO in the singular — French rule, counter-intuitive from English', () => {
    expect(plural(0, 'commentaire', 'commentaires')).toBe('commentaire');
  });

  it('puts 1 in the singular and 2+ in the plural', () => {
    expect(plural(1, 'item', 'items')).toBe('item');
    expect(plural(2, 'item', 'items')).toBe('items');
    expect(plural(38, 'item', 'items')).toBe('items');
  });
});

// ─── ENGLISH FORMATTING — and the maneuver it requires ──────────────────────────────────────────
// This block exists because the rest of the file proves ONLY French. As long as it was missing,
// "`format.ts` is delocalized" was only an assertion: the six formatters could have stayed
// pinned on `fr-FR` without a single assertion turning red — English was on the path
// of no test.
//
// THE MANEUVER, and it holds as is for `ui/copy.ts`. `format.ts` resolves the language ONCE,
// at module load. So `<html lang>` must be set BEFORE the import, hence `resetModules()` +
// a dynamic import. A static `import` at the top of the file would already have frozen French.
//
// ⚠ WHAT THIS BLOCK DOES NOT COVER: it tests the FORMATTERS, not the render. That a component calls
// the right formatter in the right place is a matter of the goldens; and no English golden exists to date.
describe('EN formatting — the file is no longer pinned on fr-FR', () => {
  async function loadAs(lang: string): Promise<typeof import('./format')> {
    vi.resetModules();
    vi.stubGlobal('document', { documentElement: { lang } });
    return import('./format');
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('groups with a COMMA and without U+202F', async () => {
    const { formatInt } = await loadAs('en');
    expect(formatInt(50_000)).toBe('50,000');
    expect([...formatInt(50_000)].some((c) => c.charCodeAt(0) === 0x202f)).toBe(false);
  });

  it('does NOT insert a no-break space before « % » (U+00A0 is a French rule)', async () => {
    const { formatPercent } = await loadAs('en');
    expect(formatPercent(0.42)).toBe('42%');
  });

  it('⚠ puts ZERO in the PLURAL — the exact inverse of French, and the case nobody renders', async () => {
    const { plural } = await loadAs('en');
    expect(plural(0, 'comment', 'comments')).toBe('comments');
    expect(plural(1, 'comment', 'comments')).toBe('comment');
  });

  it('French stays intact when the page is French (no leak from one test to another)', async () => {
    const { formatInt, plural } = await loadAs('fr');
    // Assertion by CODE POINT, and not by literal: the French separator is U+202F, an
    // invisible character a careless copy replaces by an ordinary space with nothing
    // to show it. It is the very defect this file exists to catch — writing it out in full
    // avoids reproducing it in its own witness.
    expect([...formatInt(50_000)].map((c) => c.charCodeAt(0))).toEqual([
      0x35, 0x30, 0x202f, 0x30, 0x30, 0x30,
    ]);
    expect(plural(0, 'commentaire', 'commentaires')).toBe('commentaire');
  });
});
