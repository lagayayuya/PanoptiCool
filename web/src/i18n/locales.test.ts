// LANGUAGE CONSISTENCY NET — it holds ONE invariant, and it is the only one that matters here:
//
//   **nothing that addresses a bot names an unpublished language.**
//
// WHY THAT INVARIANT. It was born when the `/fr` ⁄ `/en` symmetry existed with English
// OFF: an hreflang, a sitemap entry or an `alternate` naming `en` would have invited
// the indexing of a shell. English has been on since 2026-07-20 and that case no longer arises
// as such; the invariant, for its part, depends on no language in particular and keeps the gate for
// the next one — the accident is not seen at review, it is seen three weeks later,
// in a search engine's results.
//
// It also holds the converse, less spectacular but more likely: a language declared
// published whose pages do not exist. That is a sitemap announcing 404s.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation. This file is the kind of test one then cites as "the i18n is
// tested" — it does not test the i18n, it tests a correspondence of lists.
//   - IT DOES NOT READ THE `dist/`. It compares TypeScript lists and the tree of `src/pages/`.
//     That the build actually produces these URLs, that it produces no others, and that
//     `find dist -path '*en*'` stays empty, is verified on the build — not here;
//   - IT FOLLOWS NO REDIRECT. That `/` goes to `/fr`, that `/analyse` responds, that a
//     `meta refresh` is well-formed: none of that is exercised. No request is made;
//   - IT DOES NOT LOOK AT THE COMPONENTS' LINKS. An `href="/analyse"` forgotten without a language
//     prefix passes this test silently; it is the render goldens that freeze it;
//   - IT DOES NOT VERIFY THE RENDERING OF `lang`. It reads the SOURCE of the pages and forbids a
//     hard-coded language code there; that `Astro.currentLocale` then renders the right value is seen at build;
//   - IT SAYS NOTHING ABOUT THE CONTENT. That an `en/` page exists does not prove it is translated, nor
//     that the English analysis is worth anything. It is a plumbing test; what English
//     ACTUALLY renders is measured elsewhere (`ui/v2/render-golden-en.test.ts`), and the gap measured at
//     switch-on lives in `i18n/locales.ts`, not here.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  HTML_LANG,
  LOCALES,
  type Locale,
  localePath,
  PAGE_PATHS,
  PUBLISHED_LOCALES,
} from './locales';

const PAGES_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'pages');

/** The folders of `src/pages/` that carry a declared language name — the BUILT languages. */
function builtLocales(): Locale[] {
  return LOCALES.filter((locale) => existsSync(join(PAGES_DIR, locale)));
}

describe('published languages and built languages', () => {
  it('publishes only languages whose pages exist', () => {
    expect([...PUBLISHED_LOCALES].sort()).toEqual(builtLocales().sort());
  });

  it('gives each published language all the site pages', () => {
    for (const locale of PUBLISHED_LOCALES) {
      const files = readdirSync(join(PAGES_DIR, locale));
      for (const path of PAGE_PATHS) {
        const expected = path === '/' ? 'index.astro' : `${path.slice(1)}.astro`;
        expect(files, `langue « ${locale} », page « ${path} »`).toContain(expected);
      }
    }
  });

  it('publishes a subset of the declared languages', () => {
    for (const locale of PUBLISHED_LOCALES) {
      expect(LOCALES).toContain(locale);
    }
  });
});

describe('pages declare their language instead of writing it', () => {
  // WHY THIS WITNESS EXISTS. The pages hard-wrote `<html lang="fr">`. As long as a single
  // tree existed, it was right; at the first English page — copied from the French one, as
  // `locales.ts`'s procedure requires — the attribute lied. And it lies SILENTLY: the
  // hreflangs, the canonical and the sitemap are computed server-side and stay correct, while
  // `i18n/current.ts`, which READS this attribute, fabricates for all the islands links to the wrong
  // language. Measured before the fix on `/en/analyse`: the selector showed FR active, the links
  // pointed to `/fr`, and the language link doubled into `/en/en/analyse`.
  //
  // Deriving the attribute from `Astro.currentLocale` makes the thing true by construction; this witness
  // keeps the gate, because the fault reintroduces itself from a simple copy-paste.
  it('writes no hard-coded language code in <html lang>', () => {
    for (const locale of PUBLISHED_LOCALES) {
      for (const file of readdirSync(join(PAGES_DIR, locale))) {
        const source = readFileSync(join(PAGES_DIR, locale, file), 'utf8');
        expect(source, `${locale}/${file}`).not.toMatch(/<html\s+lang="/);
      }
    }
  });
});

describe('English is on — and both halves are there', () => {
  // THESE TWO WITNESSES ARE THE INVERSE OF WHAT THEY SAID (switch-on of 2026-07-20). They required
  // `PUBLISHED_LOCALES` without `en` and `src/pages/en/` absent; their role was to make switch-on
  // IMPOSSIBLE BY INADVERTENCE, and they held it to the end — the flip had to turn them over by
  // hand, thus knowingly. Turned over, they keep the other gate: a switch-off
  // by inadvertence, which would leave a `/en` built but unpublished.
  it('declares English in the routing', () => {
    expect(LOCALES).toContain('en');
  });

  it('publishes it, and its pages exist', () => {
    expect(PUBLISHED_LOCALES).toContain('en');
    expect(existsSync(join(PAGES_DIR, 'en'))).toBe(true);
  });
});

describe('the URLs announced to bots', () => {
  // The heart of the net: we RECONSTRUCT here what `SiteHead` and the sitemap emit, from the
  // same functions, and we verify that no unpublished language appears in them.
  const announced = PAGE_PATHS.flatMap((path) =>
    PUBLISHED_LOCALES.map((locale) => localePath(locale, path)),
  );

  // ⚠ THIS ASSERTION EMPTIED ITSELF ON THE DAY OF SWITCH-ON, AND IT STAYED GREEN. It looped
  // on `LOCALES \ PUBLISHED_LOCALES`; the two lists coinciding since 2026-07-20, this
  // set is EMPTY, the double loop no longer executes, and the test passes without reaching anything.
  // This is the pattern CLAUDE.md names: a negative assertion verifies what it REACHES, not what
  // it asserts — and it then passes green for a reason that is not its own.
  //
  // Rewritten in the POSITIVE direction: each announced URL carries a prefix that is a published
  // language. The property is the same, it no longer depends on the existence of a switched-off language, and
  // the count of verified URLs is asserted so that an empty `announced` cannot re-empty it.
  //
  // PAST MUTATION: `localePath` forced to prefix `/de` instead of the received language. The assertion
  // turns RED (« /de nomme de, qui n'est pas une langue publiée »). The previous version, for its part, would have
  // stayed green on that same mutation — its loop no longer executed.
  it('names only published languages', () => {
    expect(announced.length).toBe(PAGE_PATHS.length * PUBLISHED_LOCALES.length);
    for (const url of announced) {
      const prefix = url.split('/')[1];
      expect(
        PUBLISHED_LOCALES as readonly string[],
        `« ${url} » nomme « ${prefix} », qui n'est pas une langue publiée`,
      ).toContain(prefix);
    }
  });

  it('carries an hreflang code for each published language', () => {
    for (const locale of PUBLISHED_LOCALES) {
      expect(HTML_LANG[locale]).toBeTruthy();
    }
  });
});

describe('localePath', () => {
  it('renders the root without a trailing slash — a single form, thus a single canonical', () => {
    expect(localePath('fr', '/')).toBe('/fr');
  });

  it('prefixes the other paths', () => {
    expect(localePath('fr', '/analyse')).toBe('/fr/analyse');
    expect(localePath('en', '/mentions-legales')).toBe('/en/mentions-legales');
  });

  it('lets the query through — the demo journey depends on it', () => {
    expect(localePath('fr', '/analyse?demo')).toBe('/fr/analyse?demo');
  });
});
