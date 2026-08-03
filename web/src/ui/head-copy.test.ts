// The net on `head-copy.ts` — that a language ASKED FOR is the language RETURNED.
//
// WHY IT EXISTS. Before this module, the eight `.astro` pages hard-coded their own `<title>` and
// `<meta description>`. The reason was real: `copy.ts` resolves the language by reading
// `document.documentElement.lang`, which does not exist in Node at build time, so an English page
// reading `UI_*` emitted FRENCH head text. The workaround left that prose outside the ratifiable
// perimeter — and it did not even hold everywhere: `og:image:alt` was written once, in French, and
// served as such to the English tree.
//
// So the property to pin is not "the keys exist" (the compiler holds that through `UiCopy`) nor
// "FR and EN have the same shape" (`copy-parity.test.ts` holds that). It is the one the old
// workaround was silently getting wrong: ASK FOR ENGLISH, GET ENGLISH.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - IT DOES NOT JUDGE THE TRANSLATION. It checks that the two languages return DIFFERENT strings,
//     never that the English one is correct, idiomatic, or even about the right page. A title
//     mistranslated into English passes here without a sound; only human re-reading catches that.
//   - IT DOES NOT CHECK THAT THE PAGES CALL IT. That an `.astro` file passes `head.analyseTitle`
//     rather than `head.homeTitle` to its layout is not reachable from here. What holds that is the
//     build itself plus reading the eight pages — there is no automatic net on it today.
//   - IT SAYS NOTHING ABOUT `copy.ts`. That selector keeps its DOM-based resolution, deliberately,
//     for the islands; this module is the build-time path and nothing else.

import { describe, expect, it } from 'vitest';
import { LOCALES } from '../i18n/locales';
import { headCopy } from './head-copy';

describe('headCopy — the language asked for is the language returned', () => {
  it('returns a non-empty string for every key, in every language', () => {
    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(headCopy(locale))) {
        expect(typeof value, `${key} (${locale})`).toBe('string');
        expect(value.length, `${key} (${locale})`).toBeGreaterThan(0);
      }
    }
  });

  // THE ASSERTION THIS MODULE EXISTS FOR. If `headCopy` fell back to French for every locale — the
  // exact defect the eight hard-coded heads were working around — every key would match and this
  // goes red. Verified by MUTATION: making `BUNDLES` return `FR.UI_HEAD` for both locales turns
  // this test red on all nine keys, and only this test in the whole suite.
  it('every English key differs from its French counterpart', () => {
    const fr = headCopy('fr');
    const en = headCopy('en');
    const identical = Object.keys(fr).filter(
      (k) => fr[k as keyof typeof fr] === en[k as keyof typeof en],
    );
    expect(identical, 'these keys are the same string in both languages').toEqual([]);
  });

  // The two languages carry the same keys — held by the compiler through `UiCopy`, restated here
  // because a runtime consumer (`SiteHead.astro`) destructures the object and a missing key would
  // render `undefined` into a `<meta>` rather than fail.
  it('both languages expose the same keys', () => {
    expect(Object.keys(headCopy('en')).sort()).toEqual(Object.keys(headCopy('fr')).sort());
  });
});
