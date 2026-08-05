// THE SEAM BETWEEN THE MARKUP AND THE SHEETS — the one thing no other net in this repo can see.
//
// ⚠ WHY IT EXISTS, and it is not hypothetical. The messages piece was one command from being
// committed with 32 of its classes styled by NOTHING — the header, the filter frame, the thread
// panel, the pager — while 93 of its sheet's 96 rules styled components this port does not carry.
// Lint, typecheck, 935 tests and the build were all green, because not one of them renders: the
// goldens strip CSS by construction, and a class name is a string to the compiler. What HAD already
// been committed was the token half: `identity.css` declared the radii and the warm family, so the
// messages grid reached first came up with no radii, and going through identity first fixed it.
//
// The three properties below are the ones that were silently false, and each is checked in BOTH
// directions, per CLAUDE.md: « chaque classe rendue a une règle » and « chaque règle est rendue »
// are different claims, and holding one told us nothing about the other.
//
// ─── ⚠ WHAT THIS NET DOES NOT COVER ─────────────────────────────────────────────────────────────
//   - ANY PIXEL, AND ANY CASCADE. That a rule EXISTS is all this proves. Wrong colour, wrong order,
//     a selector outranked by a neighbour, a `display: none` that should not be — all pass here;
//   - A CLASS NAME THAT IS NOT WRITTEN LITERALLY IN A `class` ATTRIBUTE. Names assembled at runtime
//     (a lookup table, a concatenation) are invisible to this parse, so a component that builds its
//     classes that way is UNCHECKED rather than failing — see `RUNTIME_BUILT` below, which is the
//     list of what that costs today;
//   - ANY SHEET OUTSIDE `src/ui/instagram/`. The TikTok surfaces use inline styles; the divergence
//     is ratified in ADR-0007's addendum, and this net is the price of it;
//   - THE ORDER SHEETS LOAD IN. It proves each piece's sheets are IMPORTED where the piece renders,
//     which is what the lazy chunks broke; it does not prove the browser applied them in the order
//     the cascade expects;
//   - ⚠ WHETHER A SHEET SURVIVES BUNDLING, except for the one way it is known not to (below). The
//     first version of this file checked imports only, and `filters.css` then vanished from the
//     build the moment a second piece rendered the filter bar — green here, absent in the browser.
//     Reading `dist/` would need a build to have run, which a unit test cannot assume;
//   - ⚠ WHETHER A CLASS HAS A RULE OF ITS OWN. It checks that the NAME appears in some selector.
//     That border is not deduced — mutation 1 established it, below.
//
// ─── VERIFIED BY MUTATION, and this is what each one DID ────────────────────────────────────────
//   1. deleted `.msg-pager`'s own rule → ⚠ STAYED GREEN, which is not what was predicted. The
//      descendant rules (`.msg-pager button`) still name the class, and this net reads names in
//      selectors. So it catches a class NOBODY styles, never a class styled incompletely — the
//      border above is that result, not a caveat written in advance;
//   1b. deleted the only rule naming `.msg-phrase` → red, naming `msg-phrase`;
//   1c. deleted every rule naming `.msg-pager`, descendants included → red, naming `msg-pager`;
//   2. added `.msg-ghost` to a sheet, rendered by nothing → red on the second property;
//   3. moved `--ig-r-ctl` from `shell.css` into `messages.css`, which IS the original bug → red on
//      three sheets at once, each naming the token it could no longer resolve;
//   4. removed the kit's import from the island, leaving both pieces to rely on a sheet nothing
//      loads → red on both, naming the kit's classes. This is the failure that shipped, and it is
//      the one the « reachable, not defined anywhere » distinction exists for;
//   5. removed both `classList` calls for `is-fs-css`, leaving only the prose mention in a comment
//      → red, naming it as an orphan rule. ⚠ The first attempt removed only ONE of the two calls and
//      stayed green, which is correct — the class was still applied — but it proved nothing; the
//      mutation had to remove every application before it tested what was asked;
//   6. read `--stick-r` without declaring it → red. That property is a LOCAL variable, shared
//      between a sheet and its component's arithmetic, and the token rule now says so rather than
//      demanding it live in `shell.css` with the theme;
//   7. gave `filters.css` a second importer — the failure that actually shipped a build with the
//      whole filter bar unstyled → red, naming both importers. Added AFTER that build, because the
//      three properties above were all green while `fm-search` was in no stylesheet at all.
//   8. renamed the only two rules naming `.cm-audio-orb`, a class rendered by `ConvModal` — which
//      imports NO sheet and reaches `messages.css` only because `MessagesModule` renders it → red
//      on `ConvModal.tsx` by name, which is what the parent→child edge below is for.
//      ⚠ The first attempt deleted `.ws-chip {…}` and STAYED GREEN, correctly: `.ws-chip.on` still
//      names the class. Same shape as mutation 1a, met again on a different class — the border
//      « a class nobody styles, never a class styled incompletely » is easy to forget when writing
//      the mutation, and this is the second time it invalidated a first attempt;
//   9. deleted the `.vw-tab` base rules, leaving only `.kit-head .vw-tab { flex: 1 }` → the first
//      two properties stayed GREEN and the fourth went red, naming `vw-tab`. That is not a
//      hypothetical: it is the state the port SHIPPED in, and what the maintainer saw as
//      « l'affichage css est cassé pour La trame / En détail ». The fourth property was added
//      because of it — and it is the fourth property's ONLY reason to exist.
//      ⚠ ITS FIRST IMPLEMENTATION FAILED THIS EXACT MUTATION. It asked whether the class was the
//      LAST COMPOUND of some selector; in `.kit-head .vw-tab` it is, so the mutation stayed green
//      against the very defect the property was written for. What distinguishes a base rule is not
//      its position in the selector but that NOTHING ABOVE the element has to be true — `unconditional()`
//      below. Written down because the wrong version looked entirely reasonable while it proved
//      nothing, and only running the mutation told the two apart.

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const DIR = dirname(fileURLToPath(import.meta.url));

/**
 * Tokens the JS side of a component names, so they are read from `tokens.ts` rather than a `class`
 * attribute. They must still resolve, and for the same reason: a canvas gradient reading a token
 * that lives in a lazily-loaded sheet silently gets the fallback grey.
 */
const TOKENS_READ_FROM_TS = /token\('(--[a-z0-9-]+)'\)/g;

/**
 * ⚠ MAPLIBRE'S OWN CLASSES. The library puts them on nodes it creates; the map's sheet only
 * overrides them. Nothing in this repository renders them, and nothing should.
 */
const LIBRARY_PREFIXES = ['maplibregl-'];

/**
 * Built by concatenation, so the literal never appears in the markup: `trame-${orient}`, and the
 * map detail's `cd-point ${point.kind}`.
 *
 * ⚠ THE KIND SPELLINGS ARE THE ENGINE'S. `last-known` carries a hyphen because `DeclaredKind` does;
 * writing it with an underscore silently produced a class no sheet carries — which is what this
 * list, cross-checked against the sheets, is for.
 */
const RUNTIME_BUILT = new Set([
  'trame-h',
  'trame-v',
  'post',
  'story',
  'last-known',
  // The AI page's status banner: `an-banner ${tone}`, three tones decided from the browser's engine.
  'ok',
  'warn',
  'flat',
]);

/**
 * ⚠ RENDERED ON PURPOSE WITH NO RULE OF ITS OWN — the one exemption, named rather than absorbed.
 *
 * `trame-h` is the grid's DEFAULT orientation, which the base `.trame` rules already serve; only
 * `trame-v` needs to override anything. The class stays in the markup because the DOM should say
 * which orientation is showing, and the day `.trame-h` needs a rule this line is where to look.
 *
 * ⚠ EVERY NAME ADDED HERE STOPS BEING CHECKED, so each one carries its reason. `sr-only` was on this
 * list for about a minute before it turned out to be a real missing rule — without it the map's
 * hidden period list renders visibly, under the summary it exists to replace.
 */
const NO_RULE_NEEDED = new Set([
  'trame-h',
  // Structural wrappers whose CHILDREN carry every rule: a grouping element with no box of its own.
  // They were unstyled in the prototype too, and giving them rules to satisfy this net would be
  // inventing design to satisfy a test.
  'ca-city',
  'ca-track-wrap',
  'pt-popup',
  // The threads table's grid columns. They are placed by ORDER in `grid-template-columns`, so the
  // name and the balance need no rule of their own — only the columns that align right or recolour
  // have one. They carry the reading, not the styling, and the prototype leaves them bare too.
  'fc-c-name',
  'fc-c-bal',
  'fi-c-name',
  'fi-c-act',
  'fi-c-when',
  // A sortable header is a `button.fi-th`: the element selector already dresses it, and this class
  // exists so the non-sortable header can be told apart in the markup.
  'fi-sortable',
  // A video thumbnail is a `.cm-thumb` like any other; this class marks it in the markup so the
  // play badge and the poster path can be told apart on reading. Bare in the prototype too.
  'cm-video',
]);

/**
 * The sheets the always-present island imports, so they are in place whichever piece is opened
 * first. ⚠ READ FROM THE ISLAND rather than listed here: `kit.css` moved into it for a build reason
 * (see that import's comment), and a list written by hand would have kept saying `shell.css` while
 * half the bricks had moved.
 */
function alwaysLoaded(): Set<string> {
  const src = readFileSync(join(DIR, 'InstagramPage.tsx'), 'utf8');
  return new Set([...src.matchAll(/import '\.\/([\w.-]+\.css)'/g)].map((m) => m[1] as string));
}

function read(file: string): string {
  return readFileSync(join(DIR, file), 'utf8');
}

const ALWAYS_LOADED = alwaysLoaded();
const SHEETS = readdirSync(DIR).filter((f) => f.endsWith('.css'));
const COMPONENTS = readdirSync(DIR).filter((f) => f.endsWith('.tsx'));

/** Class selectors a sheet defines. Comments are stripped: they name classes in prose. */
function selectorsOf(sheet: string): Set<string> {
  const body = read(sheet).replace(/\/\*[\s\S]*?\*\//g, '');
  return new Set([...body.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1] as string));
}

/**
 * The classes a sheet styles **unconditionally** — named by a selector that requires no ancestor, so
 * the rule lands wherever the class is rendered.
 *
 * ⚠ « THE LAST COMPOUND » IS NOT THE TEST, and believing it was cost a mutation. In
 * `.kit-head .vw-tab` the class IS the last compound — and that is exactly the rule that existed
 * while the tabs rendered as bare browser buttons. What makes a rule a BASE rule is that nothing
 * has to be true above the element.
 */
function unconditional(sheet: string): Set<string> {
  const body = read(sheet).replace(/\/\*[\s\S]*?\*\//g, '');
  const out = new Set<string>();
  for (const m of body.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
    for (const sel of (m[1] as string).split(',')) {
      const t = sel.trim();
      if (t === '' || t.startsWith('@') || t.startsWith('%')) continue;
      // One compound only. Combinators inside `:not(…)` / `:is(…)` don't make a rule conditional on
      // an ancestor, so the parenthesised parts come out before the test.
      if (/[\s>+~]/.test(t.replace(/\([^)]*\)/g, ''))) continue;
      for (const c of t.matchAll(/\.([a-zA-Z][\w-]*)/g)) out.add(c[1] as string);
    }
  }
  return out;
}

/**
 * The class names inside one `class=` / `className=` value.
 *
 * ⚠ ONLY THE LITERAL PARTS, plus quoted strings inside an interpolation. A tokenizer that split the
 * whole value on punctuation also returned `rank`, `<`, `8` and every identifier in the expression —
 * so a growing list of exemptions had to be kept, and each entry was a name that stopped being
 * checked. Reading `city-marker ${rank < 8 ? 'major' : 'mid'}` as « city-marker, major, mid » needs
 * no exemptions at all.
 */
function classTokens(raw: string): string[] {
  const out: string[] = [];
  for (const m of raw.matchAll(/\$\{([^}]*)\}/g)) {
    for (const q of (m[1] as string).matchAll(/'([^']*)'|"([^"]*)"/g)) {
      out.push(...`${q[1] ?? ''} ${q[2] ?? ''}`.split(/\s+/));
    }
  }
  out.push(...raw.replace(/\$\{[^}]*\}/g, ' ').split(/\s+/));
  return out.filter((n) => /^[a-zA-Z][\w-]*$/.test(n));
}

/** Class names a component writes literally, in markup OR through `classList`. */
function classesOf(component: string): Set<string> {
  const src = read(component);
  const out = new Set<string>();
  // ⚠ IMPERATIVE CLASSES TOO, and both gaps were found by this net going red on rules that were in
  // use. Fullscreen applies its three classes through `classList`, because the element it dresses
  // belongs to the piece rather than to the toggle; and the map builds almost its whole DOM by hand,
  // because MapLibre markers are DOM nodes outside the framework's tree. A parse reading only
  // `class=` calls those rules orphans — thirty-one of them, on the map alone.
  for (const m of src.matchAll(/classList\.(?:add|remove|toggle)\('([\w-]+)'/g)) {
    out.add(m[1] as string);
  }
  for (const m of src.matchAll(/\.className = `([^`]*)`|\.className = '([^']*)'/g)) {
    for (const name of classTokens(`${m[1] ?? ''} ${m[2] ?? ''}`)) out.add(name);
  }
  // `new Popup({ className: 'dossier-popup' })` — a class handed to a library to apply.
  for (const m of src.matchAll(/className: '([\w\s-]+)'/g)) {
    for (const name of classTokens(m[1] as string)) out.add(name);
  }
  // `querySelector('.x')` / `querySelectorAll('.x.y')` — the map sweeps its own markers that way.
  for (const m of src.matchAll(/querySelector(?:All)?\('([^']*)'\)/g)) {
    for (const name of (m[1] as string).split('.')) {
      if (name !== '' && /^[a-zA-Z][\w-]*$/.test(name)) out.add(name);
    }
  }
  // ⚠ AND A `class={…}` THAT IS NOT A TEMPLATE. `class={cond ? 'esp-hidden' : undefined}` is a
  // perfectly ordinary way to write a conditional class, and it was invisible here: the scene's
  // hiding class went in with no rule at all, and this file stayed green. Quoted strings inside the
  // braces, same reading as inside an interpolation.
  for (const m of src.matchAll(/class=\{([^`{}]*)\}/g)) {
    for (const q of (m[1] as string).matchAll(/'([^']*)'|"([^"]*)"/g)) {
      for (const name of `${q[1] ?? ''} ${q[2] ?? ''}`.split(/\s+/)) {
        if (/^[a-zA-Z][\w-]*$/.test(name)) out.add(name);
      }
    }
  }
  for (const m of src.matchAll(/class=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
    for (const name of classTokens(`${m[1] ?? ''} ${m[2] ?? ''}`)) {
      // A concatenated name leaves its literal prefix (`trame-` from `trame-${orient}`). It stands
      // for the declared variants, so the check lands on those — a prefix that matches none stays
      // in the list and fails, rather than being quietly dropped.
      if (name.endsWith('-')) {
        for (const built of RUNTIME_BUILT) if (built.startsWith(name)) out.add(built);
        continue;
      }
      out.add(name);
    }
  }
  return out;
}

/**
 * The sheets loaded when a component renders: its own CSS imports, plus those of every sibling
 * component it imports. ⚠ THIS IS THE PROPERTY THE CHUNKS BROKE — a piece is a chunk loaded on
 * demand and its sheet travels with it, so « identity.css declares it » is not an answer to « the
 * messages piece reads it ».
 */
function ownSheets(component: string, seen = new Set<string>()): Set<string> {
  if (seen.has(component)) return new Set();
  seen.add(component);
  const src = read(component);
  const out = new Set<string>();
  for (const m of src.matchAll(/import '\.\/([\w.-]+\.css)'/g)) out.add(m[1] as string);
  for (const m of src.matchAll(/from '\.\/([\w-]+)'/g)) {
    const sibling = `${m[1] as string}.tsx`;
    if (COMPONENTS.includes(sibling)) {
      for (const s of ownSheets(sibling, seen)) out.add(s);
    }
  }
  return out;
}

/**
 * Every sheet in place when this component draws: what it pulls in itself, plus what WHOEVER RENDERS
 * IT pulls in — a child mounts inside its parent, so the parent's sheet is loaded around it.
 *
 * ⚠ THE UPWARD EDGE IS ONE LEVEL DEEP, and that is the whole point. Made transitive it runs through a
 * SHARED child: `FilterMenu` is rendered by two pieces, so « the parents of my children's parents »
 * quietly handed the messages piece's sheet to the space piece — and the space piece then looked
 * fully styled while `vw-block` was in a sheet it never loads. Found by looking at the screen, not
 * by this file, which is why the mutation for it is recorded in the log above.
 */
function sheetsReaching(component: string): Set<string> {
  const out = ownSheets(component);
  for (const parent of COMPONENTS) {
    if (parent === component) continue;
    const rendersIt = new RegExp(`from '\\./${component.replace('.tsx', '')}'`).test(read(parent));
    // ⚠ THE PARENT'S OWN SHEETS ONLY — never `sheetsReaching(parent)`, see above.
    if (rendersIt) for (const s of ownSheets(parent)) out.add(s);
  }
  // Whatever the island itself imports is present before any piece mounts.
  for (const sheet of ALWAYS_LOADED) out.add(sheet);
  return out;
}

describe('every class rendered has a rule where it renders', () => {
  it.each(COMPONENTS)('%s', (component) => {
    const reachable = new Set<string>();
    for (const sheet of sheetsReaching(component)) {
      for (const sel of selectorsOf(sheet)) reachable.add(sel);
    }
    const missing = [...classesOf(component)]
      .filter((c) => !reachable.has(c) && !NO_RULE_NEEDED.has(c))
      .sort();
    // ⚠ REACHABLE, not « defined anywhere ». Checking the whole directory would go green on exactly
    // the bug this file was written for: the rule existed, in a sheet that piece never loads.
    expect(missing, `styled by no sheet ${component} loads`).toEqual([]);
  });
});

describe('every rule is rendered by something', () => {
  it.each(SHEETS)('%s', (sheet) => {
    const rendered = new Set<string>([...RUNTIME_BUILT]);
    for (const c of COMPONENTS) {
      for (const name of classesOf(c)) rendered.add(name);
    }
    const orphans = [...selectorsOf(sheet)]
      .filter((s) => !rendered.has(s) && !LIBRARY_PREFIXES.some((p) => s.startsWith(p)))
      .sort();
    // « No code that runs for no one » (CLAUDE.md) applies to a stylesheet too — and a sheet full of
    // rules for absent components is what hid the missing ones.
    expect(orphans, `rules for markup no component renders, in ${sheet}`).toEqual([]);
  });
});

/**
 * ⚠ CLASSES THAT ARE ONLY EVER AN ANCESTOR. `.kit-head .vw-tab { flex: 1 }` names `vw-tab`, so the
 * property above counts it as styled — and the tabs still rendered as two bare browser buttons,
 * because their base rules never crossed over from the prototype. That is the SAME border the
 * mutation log calls 1a, met in production instead of in a mutation, and the property below is
 * what closes it.
 *
 * A modifier legitimately lives here: `.reg-rows.guessed dt` is how `guessed` is meant to work, and
 * it has no box of its own. So the exceptions are named, one by one, rather than the rule loosened.
 */
const MODIFIER_ONLY = new Set([
  // Toggles the whole register block's palette; it dresses its children, never itself.
  'guessed',
  // Marks a category row that HAS something to unfold: it changes the row's cursor and its label on
  // hover, and has no box of its own.
  'expandable',
  // Multi-select menus draw a checkbox instead of a radio — the mark, not the option.
  'multi',
  // The heatmap read vertically: it re-lays its stage and its rows, and has no box of its own.
  'trame-v',
  // A city's rank in the map's legend: three tints of the SAME marker, applied to its label.
  'major',
  'mid',
  'minor',
  // A place seen from more than one address — same marker, a different label.
  'shared',
  // ⚠ THESE TWO DRESS MARKUP THIS REPO DOES NOT WRITE. `dossier-popup` is handed to MapLibre, which
  // builds `.maplibregl-popup-content` inside it; `pt-head` wraps a `<b>` and a `<span>` with no
  // wrapper styling of its own. An « own » rule for either would be invented to satisfy this test.
  'dossier-popup',
  'pt-head',
  // ⚠ THESE TWO ARE SPACING BETWEEN SIBLINGS, not a missing base rule. `.cm-year + .cm-year` gives
  // every year but the FIRST its separation, and `.zone-tip .zt-when` a line that has no existence
  // outside its tip. Neither element has a box of its own to describe.
  'cm-year',
  'zt-when',
  // Spacing between year sections in the contact sheet — same shape as `cm-year` above.
  'uf-year',
]);

describe('every rendered class is styled on its own, not only as an ancestor', () => {
  it.each(COMPONENTS)('%s', (component) => {
    const own = new Set<string>();
    const mentioned = new Set<string>();
    for (const sheet of sheetsReaching(component)) {
      for (const c of unconditional(sheet)) own.add(c);
      for (const c of selectorsOf(sheet)) mentioned.add(c);
    }
    // Only classes the sheets DO mention: one they never name at all is the property above's job,
    // and reporting it twice would say « two defects » where there is one.
    const ancestorOnly = [...classesOf(component)]
      .filter((c) => mentioned.has(c) && !own.has(c) && !MODIFIER_ONLY.has(c))
      .sort();
    expect(ancestorOnly, `named only inside a descendant selector, for ${component}`).toEqual([]);
  });
});

describe('no sheet has two importers', () => {
  /**
   * ⚠ MEASURED, NOT A STYLE RULE. A CSS file imported by TWO dynamically-imported chunks is dropped
   * from the build ENTIRELY — same rules, one importer → emitted, two → in no stylesheet at all,
   * with no warning from Vite, Astro, the linter or the compiler. It happened twice here: `kit.css`
   * when a second piece read the shared bricks, then `filters.css` when a second piece rendered the
   * filter bar.
   *
   * The remedy both times was the same: the island loads it. So that is the invariant — a sheet has
   * at most one importer, and a shared one is the island's.
   */
  it.each(SHEETS)('%s', (sheet) => {
    const importers = COMPONENTS.filter((c) =>
      [...read(c).matchAll(/import '\.\/([\w.-]+\.css)'/g)].some((m) => m[1] === sheet),
    );
    expect(
      importers.length,
      `${sheet} is imported by ${importers.join(', ')} — a sheet with two importers is dropped ` +
        'from the build; move it to the island, as kit.css and filters.css were',
    ).toBeLessThanOrEqual(1);
  });
});

describe('every token resolves from the sheet the page always loads', () => {
  const declared = new Set(
    [...read('shell.css').matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map((m) => m[1] as string),
  );

  it.each(SHEETS)('%s', (sheet) => {
    const body = read(sheet);
    // A property a sheet declares AND reads is a local variable, not a theme token — `--stick-r`
    // holds one number that the sheet and its component must agree on. The cross-sheet hole this
    // property exists for is a token declared in ONE piece's sheet and read from ANOTHER.
    const local = new Set([...body.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map((m) => m[1] as string));
    // A `var(--x, fallback)` carries its own answer; only the bare ones must resolve.
    const bare = [...body.matchAll(/var\((--[a-zA-Z0-9-]+)(\s*,)?/g)]
      .filter((m) => m[2] === undefined)
      .map((m) => m[1] as string);
    const unresolved = [...new Set(bare.filter((t) => !declared.has(t) && !local.has(t)))].sort();
    expect(unresolved, `declared neither in shell.css nor in ${sheet}, but read by it`).toEqual([]);
  });

  it('⚠ including the ones only TypeScript reads — a canvas cannot use a CSS variable', () => {
    // `tokens.ts` returns a visible grey when a property is missing, which is the failure this
    // catches: a heatmap whose full end is grey looks like data, not like a broken token.
    const fromTs = [...read('tokens.ts').matchAll(TOKENS_READ_FROM_TS)].map((m) => m[1] as string);
    expect(fromTs.length).toBeGreaterThan(5);
    expect([...new Set(fromTs.filter((t) => !declared.has(t)))].sort()).toEqual([]);
  });
});
