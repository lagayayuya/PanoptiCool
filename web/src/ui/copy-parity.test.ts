// FR/EN PARITY OF THE INTERFACE COPY — what the TYPE cannot hold.
//
// WHY THIS FILE EXISTS, even though `copy.en.ts` is annotated `UiCopy` and the compiler already
// refuses a missing key (`ts(2741)`) as much as an extra key (`ts(2353)`) — both measured.
// ONE hole remains, and it is structural:
//
//   **`typeof` of an array gives `T[]`, never a tuple.** An English translation can provide
//   TWO columns where French has THREE, or four axis ticks instead of five, and
//   compile without a word. This perimeter carries a dozen arrays — the columns of the three
//   educational panels and of the AI panel, the steps of the two export guides, the home page's
//   connector bullets, consequences and resource rails, the summary bullets, the roadmap and the
//   hour ticks — and a missing entry is not seen on rereading: it is seen on the page, in English,
//   one day when no one compares the two files anymore.
//
//   The enumerated list below is the inventory; it is the thing to update, knowingly, when an
//   array is added or removed.
//
// The net is therefore at RUNTIME, and it does not duplicate the compiler: it covers exactly what
// the compiler lets through.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation: a proof mechanism declares its border.
//   - IT DOES NOT JUDGE THE TRANSLATION. An English entry that copies the French has the right form,
//     the right length, and passes. The non-copy witness below only catches the crude case —
//     zero translated text. Between « nothing is translated » and « well translated », there is only
//     a human rereading;
//   - IT DOES NOT REACH THE SCREEN. It compares two objects. That a string is RENDERED, in the right
//     place, is the business of the goldens — and no English golden exists as long as the franglais
//     is not lifted;
//   - IT DOES NOT SEE DEAD ENTRIES. A key that no component reads anymore passes like the
//     others, in both languages.

import { describe, expect, it } from 'vitest';
import { EN } from './copy.en';
import { FR } from './copy.fr';
import { EN_INSTAGRAM } from './copy.instagram.en';
import { FR_INSTAGRAM } from './copy.instagram.fr';

/** Paths of all the arrays in the bundle, with their length. Recursive: the arrays live at
 *  several levels (`UI_LEARN_PANELS.rhythm.columns`, `UI_LANDING.feats[].`…). */
function arrayLengths(value: unknown, path = ''): Record<string, number> {
  if (Array.isArray(value)) {
    const own = { [path]: value.length };
    return value.reduce<Record<string, number>>(
      (acc, item, i) => Object.assign(acc, arrayLengths(item, `${path}[${i}]`)),
      own,
    );
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).reduce<Record<string, number>>(
      (acc, [k, v]) => Object.assign(acc, arrayLengths(v, path === '' ? k : `${path}.${k}`)),
      {},
    );
  }
  return {};
}

describe('copy — FR/EN parity', () => {
  it('each array has the SAME length in both languages (what the type does not hold)', () => {
    const fr = arrayLengths(FR);
    const en = arrayLengths(EN);
    expect(en).toEqual(fr);
  });

  // ⚠ THE SECOND PAIR IS SWEPT SEPARATELY, not merged into the first. Merging them would make one
  // enumerated list cover two perimeters, and the list below is the thing a reviewer reads to know
  // what is under watch — a list that spans two files answers « which one? » with a shrug.
  it('the Instagram pair holds the same array lengths', () => {
    expect(arrayLengths(EN_INSTAGRAM)).toEqual(arrayLengths(FR_INSTAGRAM));
  });

  it('the Instagram sweep finds exactly the known arrays', () => {
    expect(Object.keys(arrayLengths(FR_INSTAGRAM)).sort()).toEqual([
      // Added with the identity module, knowingly — which is what this list is for: the three
      // educational columns must stay three in both languages, and no type holds that.
      // The AI page's four teaching columns and its three cautions: their COUNT is the layout, and
      // no type holds it — a translation with two cautions would silently drop one.
      'UI_IG_ANALYSE.learnCols',
      'UI_IG_ANALYSE.warnCols',
      'UI_IG_IDENTITY.learnCols',
      'UI_IG_RAIL.items',
      // ⚠ `UI_IG_SHELL.guarantees` LEFT THIS LIST when the Instagram landing that carried it was
      // removed (2026-08-05) and Yul dropped the three sentences from the perimeter. Removing an
      // entry here is the same knowing gesture as adding one: what it costs is that no test now
      // holds a FR/EN length for that group, because that group no longer has an array.
      // ⚠ THE CONTROLS VEIL'S LINES ARE SEGMENTED, alternating plain and emphasised — so each line
      // is itself an array, and its LENGTH decides which words are set as a key cap. A translation
      // that merges two segments silently unbolds one. Three lines per pointer, and the equality
      // above holds the segment count of each: that is exactly what this list is for.
      'UI_IG_SPACE.veilMouse',
      'UI_IG_SPACE.veilMouse[0]',
      'UI_IG_SPACE.veilMouse[1]',
      'UI_IG_SPACE.veilMouse[2]',
      'UI_IG_SPACE.veilTouch',
      'UI_IG_SPACE.veilTouch[0]',
      'UI_IG_SPACE.veilTouch[1]',
      'UI_IG_SPACE.veilTouch[2]',
      // The media scene wears the same veil, and its lines are segmented for the same reason.
      'UI_IG_UNIVERSE.veilMouse',
      'UI_IG_UNIVERSE.veilMouse[0]',
      'UI_IG_UNIVERSE.veilMouse[1]',
      'UI_IG_UNIVERSE.veilMouse[2]',
      'UI_IG_UNIVERSE.veilTouch',
      'UI_IG_UNIVERSE.veilTouch[0]',
      'UI_IG_UNIVERSE.veilTouch[1]',
      'UI_IG_UNIVERSE.veilTouch[2]',
    ]);
  });

  // Control « by which path the zero arrives » (CLAUDE.md): the equality above would be true and
  // EMPTY if the sweep found no array — a bug in `arrayLengths` would make it green
  // for the worst of reasons.
  //
  // The list is ENUMERATED rather than counted, on the model of the claims sentinel in
  // `engine/wording.test.ts`: an ADDED array makes this test fall, and that is intended — it forces
  // one to ask whether its translation has the right length, instead of letting it in unwatched.
  // To be updated KNOWINGLY, never by reflex.
  it('the sweep finds exactly the known arrays (the equality above bears on content)', () => {
    expect(Object.keys(arrayLengths(FR)).sort()).toEqual([
      'UI_ACTIVITY.hourMarks',
      'UI_AI_LEARN.columns',
      // The two guides do NOT have the same number of steps (TikTok 6, Instagram 7): the flows do
      // not have the same number of screens. What parity requires is FR == EN per platform, which
      // is what the equality above checks — not that the two platforms agree with each other.
      'UI_GUIDE.instagram.steps',
      'UI_GUIDE.tiktok.steps',
      'UI_LANDING.actLinks',
      'UI_LANDING.consequences',
      'UI_LANDING.instagramBullets',
      'UI_LANDING.learnLinks',
      'UI_LANDING.tiktokBullets',
      'UI_LANDING.trust',
      'UI_LEARN_PANELS.deductions.columns',
      'UI_LEARN_PANELS.market.columns',
      'UI_LEARN_PANELS.rhythm.columns',
      'UI_RESULTS.summaryActorTakeaways',
      'UI_RESULTS.summaryDataTypes',
      'UI_ROADMAP.helpItems',
      'UI_ROADMAP.steps',
    ]);
  });

  it('the two bundles are not the same text (the EN bundle is not a copy)', () => {
    // Comparison on the CONSTANT strings only: functions do not compare, and
    // a few entries are identical BY DESIGN (brand, URL, glyphs, `previewCommand`).
    const flat = (o: unknown, out: string[] = []): string[] => {
      if (typeof o === 'string') out.push(o);
      else if (o !== null && typeof o === 'object') for (const v of Object.values(o)) flat(v, out);
      return out;
    };
    const frStrings = flat(FR);
    const enStrings = flat(EN);
    expect(frStrings.length).toBe(enStrings.length);
    const identical = frStrings.filter((s, i) => s === enStrings[i]).length;
    // A copied bundle would give `identical === frStrings.length`. We require a clear margin.
    expect(identical / frStrings.length).toBeLessThan(0.2);
  });
});
