// RENDER GOLDEN — THE SURFACES `render-golden` DOES NOT SEE.
//
// WHY THIS FILE EXISTS. `render-golden.test.ts` mounts `ResultsView` WITHOUT `aiSource`. It therefore
// renders NEITHER `AiSection` (mounted behind `aiSource !== undefined`), NOR `LandingPage`, NOR
// `AnalysisPage` — nor `SiteHeader`/`SiteFooter`, which none of its views includes.
// Yet these are exactly the files that carry the MOST prose. The CLAUDE.md obligation
// (« every change of behavior is proven by a zero-diff golden ») therefore in
// practice covered only a fraction of what the product says. This file extends the net to these surfaces
// BEFORE anything is moved there: a move under a net is a proof, a
// move without a net is a good intention.
//
// WHY THE STATES ARE SEEDED, AND NOT DRIVEN. `preact-render-to-string` is SYNCHRONOUS: it
// runs NO `useEffect`. Mounting `AiSection` with a real `source` would therefore render only
// the INITIAL state (`items: loading`, `probe: idle`, empty run) — that is almost none of its
// sentences. Mocking the worker or the network would change nothing: the effect that consumes the
// response does not run. The states that carry the prose are therefore SEEDED at the `useState`
// initialization, exactly as `render-golden` forces its disclosures to `true`.
//
// WHAT THIS MECHANISM ASSUMES, and why it is tenable HERE: that the ORDER and the FORM of the
// `useState` do not move. A prose extraction replaces `'literal'` with `UI.x` — it
// neither adds nor removes a hook. The seed therefore need not survive a rework of `AiSection`:
// it must survive THAT diff, and it does. If one day a hook is added, this file
// will fall noisily — which is the intended behavior, not a fragility suffered.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation. This file was written TO fill the border of another golden: it
// would be particularly ill-advised for it to hush its own.
//   - THE NON-ENUMERATED STATES. The scenarios below seed a FINITE set of states. Out of
//     scope remain: `items: error`, `probe: checking`, `verification: exact`/`checking`, a run IN PROGRESS
//     (`running: true`), an INTERRUPTED run, and the launch error messages. Each carries
//     prose that nothing freezes. `probe: error` was part of it and is NO LONGER: its three
//     outcomes (`granted`/`blocked`/`unknown`) are now seeded, because they instruct
//     someone on their own machine and a false sentence costs more there than elsewhere (ADR-0006);
//   - THE NON-SEEDED ENVIRONMENT COMBINATIONS (2026-07-20 iteration). The cases below fix
//     one point per discourse — Firefox, Chromium, WebKit, unknown, successful localhost, route B — not the
//     cartesian product: engine × permission × route × localhost would make dozens of renders.
//     Notably out of scope remain: localhost with the server OFF, `probe: error` under Firefox with
//     READ permission (`granted`/`blocked`), and the Windows/Linux commands (the seeded OS is always
//     the macOS fallback — `localSiteCommand` per OS is frozen in `ai/items.test.ts`);
//   - THE ATYPICAL VOLUMES. Like the neighboring golden, the scenarios use
//     plausible volumes (3, 40, 4,000 items) — hence PLURAL. The singular and zero agreements are
//     not reached here: they are fixed in `ui/copy.test.ts`;
//   - THE SENSITIVE CARDS, HENCE THE FAN OF READINGS. This file mounts the home page, the analysis
//     journey, the AI section and the chrome — never `ResultsView`. The two goldens combined have
//     therefore NEVER rendered a fan in `equal` mode: the demo persona produces a NAMED finding,
//     hence `ranked`. The border is STRUCTURAL — the persona is written blind, like a
//     person, so that what it does not exercise is no one's choice, and what
//     no one decided to omit, no one thinks to write down. A defect lived exactly there;
//     it is covered by `fan-readings.test.ts`;
//   - THE MODALS, BOTH OF THEM. `ConsentModal` and `ExportGuide` render only when their state says
//     open, and this file seeds no state inside `LandingPage` — so it freezes the BUTTONS that open
//     them and nothing behind. The export guide is the larger gap: its picker, its six/seven step
//     slides per platform per language, its wait slide and the whole of `UI_GUIDE` are rendered by
//     no net at all. What IS held elsewhere is the format of the file its last slide produces
//     (`ics.test.ts`) and the FR/EN length parity of the two step arrays
//     (`ui/copy-parity.test.ts`); between those two and the screen, there is nothing;
//   - THE BEHAVIOR. This is string rendering: no click, no input, no effect. A
//     button that calls nothing anymore would pass silently;
//   - THE CSS, removed by `readable()` as in the neighboring golden;
//   - THE TRUTHFULNESS OF THE TEXT. A net freezes what is written, never whether it is true or well
//     turned — the rereading of the wording stays human (cf. the header of `ui/copy.ts`).

import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { beforeAll, expect, it, vi } from 'vitest';

// --- State seeding ----------------------------------------------------------------------------
// `SEED` is replaced BEFORE each render. The LAZY initializers (`useState(() => …)`, including
// `useIsMobile`) pass through intact: touching them would break their contract.
let SEED: (init: unknown) => unknown = (v) => v;

vi.mock('preact/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('preact/hooks')>();
  return {
    ...actual,
    useState: <T>(init: T) =>
      actual.useState(typeof init === 'function' ? init : (SEED(init) as T)),
  };
});

// `useIsMobile` reads `matchMedia`, absent in a Node environment — it would ALWAYS render desktop.
// We therefore drive it directly, to freeze the mobile variants of the mockups AS WELL.
let MOBILE = false;
vi.mock('./useIsMobile', () => ({
  MOBILE_QUERY: '(max-width: 720px)',
  useIsMobile: () => MOBILE,
}));

const { AiMobileNotice, AiSection } = await import('./AiSection');
const { AnalysisPage, errorMessage } = await import('./AnalysisPage');
const { LandingPage } = await import('./LandingPage');
const { RoadmapPage } = await import('./RoadmapPage');
const { SiteFooter } = await import('./SiteFooter');
const { SiteHeader } = await import('./SiteHeader');
// ⚠ READ FROM THE PERIMETER, NEVER RETYPED. This case used to pass the badge as a literal
// (« démo · données fictives »), so the golden went on freezing a string the product had stopped
// producing — a net green for a reason that is not its own. Reading `UI_ANALYSE` makes the
// snapshot move when the ratified copy moves, which is the only thing it can usefully witness here.
const { UI_ANALYSE } = await import('../copy');

const FIXED_NOW = Date.UTC(2026, 6, 16, 12, 0, 0);

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXED_NOW);
});

/** Same convention as `render-golden`: we keep structure and text, we drop the CSS. */
function readable(html: string): string {
  return html.replace(/ style="[^"]*"/g, '').replace(/></g, '>\n<');
}

// --- Seeds ----------------------------------------------------------------------------------
// SYNTHETIC texts (repo invariant: no value from a real export enters here).
function items(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    index: i,
    kind: (i % 2 === 0 ? 'comment' : 'search') as 'comment' | 'search',
    text: i % 2 === 0 ? `commentaire synthétique ${i}` : `recherche synthétique ${i}`,
    epoch: FIXED_NOW - i * 86_400_000,
  }));
}

/** Render with `run` FINISHED: it is the only state that displays the block footer carrying the
 * durations and the throughput (`tok/s`) — the decimal-formatting sites fixed without a net in the
 * previous batch. */
const DONE_RUN = {
  text: 'Sortie synthétique du modèle local.',
  running: false,
  interrupted: false,
  promptTokens: 1234,
  completionTokens: 567,
  elapsedMs: 8900,
};

/** The reachable probe, the default case of most scenarios. */
const PROBE_OK = { kind: 'ok', modelId: 'modele-local-test', contextWindow: 8192 };

/**
 * `probe` is PARAMETRIZABLE because the failure sentences are rendered by nothing else. They
 * all live behind `probe.kind === 'error'`, which this file long declared out of scope —
 * so that a change in their text left the golden GREEN. Measured: rewriting `step3WarnIdle`
 * and wiring three failure messages produced no diff as long as these scenarios did not exist.
 *
 * `env` and `route` are PARAMETRIZABLE for the same reason (2026-07-20 iteration): the browser
 * banner, the permission notes and route B are rendered only on a precise environment —
 * in Node, the UA names no engine and the page is not on localhost, so without seeding these
 * sentences would exist on the path of no render. The targets are recognized by the FORM of
 * their initializer: the environment state carries a `browser` key, the route one a `choice`
 * key — that is the contract `AiSection` documents on its `useState`.
 */
function aiSeed(
  itemCount: number,
  probe: unknown = PROBE_OK,
  opts: { env?: Record<string, unknown>; route?: 'site' | 'local' } = {},
) {
  return (init: unknown): unknown => {
    if (init === false) return true; // disclosures open, as in `render-golden`
    if (init !== null && typeof init === 'object') {
      const o = init as Record<string, unknown>;
      if (o.kind === 'loading') return { kind: 'ready', items: items(itemCount) };
      if (o.kind === 'idle') return probe;
      if ('browser' in o) return { ...o, ...opts.env };
      if ('choice' in o) return { choice: opts.route ?? null };
      if ('running' in o) return DONE_RUN;
    }
    return init;
  };
}

/**
 * The home page's seeder. ⚠ IT USED TO BE `v === false ? true : v`, and that stopped opening
 * anything the day the consent modal gained a platform: « open » is no longer a boolean but the
 * name of the connector whose journey was clicked, so the state initialises to `null` and the old
 * seed walked straight past it. The golden went on rendering the page with no modal at all — the
 * legal prose it exists to freeze, gone, with the snapshot still updating cleanly.
 *
 * ⚠ TWO `null` STATES NOW, and only the first is one this file covers: `consentFor` is declared
 * before `guideTarget`, which opens the export guide — deliberately out of this net (see the border
 * above), and worth several hundred lines of screenshots and captions if it were seeded by
 * accident. So the FIRST `null` is named and the rest pass through. The order of the two `useState`
 * is the assumption; it is the one this file's header already declares, and it falls noisily.
 *
 * One instance PER CASE: the counter is consumed by the render it was built for.
 */
function landingSeed(): (init: unknown) => unknown {
  let firstNull = true;
  return (v) => {
    if (v === null && firstNull) {
      firstNull = false;
      return 'instagram';
    }
    return v === false ? true : v;
  };
}

const CASES: {
  name: string;
  mobile: boolean;
  seed: (i: unknown) => unknown;
  node: () => unknown;
}[] = [
  { name: 'header-desktop', mobile: false, seed: (v) => v, node: () => h(SiteHeader, null) },
  {
    name: 'header-desktop-badge',
    mobile: false,
    seed: (v) => v,
    node: () => h(SiteHeader, { badge: UI_ANALYSE.badgeDemo }),
  },
  {
    name: 'header-mobile-toc',
    mobile: true,
    seed: (v) => v,
    node: () =>
      h(SiteHeader, {
        toc: [
          { n: '01', label: 'Ton activité', href: '#sec-activite' },
          { n: '04', label: 'IA locale', href: '#sec-ia', muted: true },
        ],
      }),
  },
  { name: 'footer', mobile: false, seed: (v) => v, node: () => h(SiteFooter, null) },

  // `LandingPage`: the seeder opens the consent modal, which carries most of the page's legal
  // prose. Closed, the golden would see only the hero. See `landingSeed` for what changed the day
  // the modal stopped being a boolean.
  {
    name: 'landing-desktop',
    mobile: false,
    seed: landingSeed(),
    node: () => h(LandingPage, null),
  },
  {
    name: 'landing-mobile',
    mobile: true,
    seed: landingSeed(),
    node: () => h(LandingPage, null),
  },

  // `RoadmapPage`: a page with no state — the two variants render everything it says. The rail
  // colors are dropped by `readable()` (it strips the CSS); what is frozen here is the ORDER of
  // the steps, their tags and their prose. The alignment of the spine on the prose is
  // `roadmap.test.ts`'s business.
  { name: 'roadmap-desktop', mobile: false, seed: (v) => v, node: () => h(RoadmapPage, null) },
  { name: 'roadmap-mobile', mobile: true, seed: (v) => v, node: () => h(RoadmapPage, null) },

  // `AnalysisPage`: the `output` state is already covered by `render-golden` (it is `ResultsView`).
  // What was not covered is the drop zone and the failure message.
  { name: 'analyse-idle', mobile: false, seed: (v) => v, node: () => h(AnalysisPage, null) },
  { name: 'analyse-idle-mobile', mobile: true, seed: (v) => v, node: () => h(AnalysisPage, null) },

  // `AiSection`: two volumes, because the « peu de données » banner and the send counter
  // are on OPPOSITE branches of the same threshold (`LOW_DATA_THRESHOLD`).
  {
    name: 'ai-section',
    mobile: false,
    seed: aiSeed(40),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  {
    name: 'ai-section-low-data',
    mobile: false,
    seed: aiSeed(3),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // HIGH volume: beyond the token budget, the selection truncates and switches tier — it is
  // the only path that renders the « priorité au plus récent » sentences and their counters.
  {
    name: 'ai-section-truncated',
    mobile: false,
    seed: aiSeed(4000),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // The FOUR probe states that carry an instruction. Each tells someone what to do with their
  // own machine; it is the surface where a false sentence costs the most (ADR-0006), and it was
  // the only one nothing froze.
  {
    name: 'ai-section-probe-idle',
    mobile: false,
    seed: aiSeed(40, { kind: 'idle' }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  {
    name: 'ai-section-probe-absent',
    mobile: false,
    seed: aiSeed(40, { kind: 'error', gate: 'granted' }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  {
    name: 'ai-section-probe-blocked',
    mobile: false,
    seed: aiSeed(40, { kind: 'error', gate: 'blocked' }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // Unreadable permission AND unrecognized engine: the case where the help names no cause and refers
  // to route B (ADR-0006, decision 4).
  {
    name: 'ai-section-probe-unknown',
    mobile: false,
    seed: aiSeed(40, { kind: 'error', gate: 'unknown' }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },

  // The THREE discourses of the browser banner (ADR-0006: two work, one is a wall), plus the
  // route B journey and the localhost mode. Each case renders sentences that no other path
  // renders — banner, permission note, « indisponible avec Safari », « Tout est prêt ».
  {
    name: 'ai-section-firefox',
    mobile: false,
    seed: aiSeed(40, PROBE_OK, { env: { browser: { name: 'Firefox', engine: 'firefox' } } }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  {
    name: 'ai-section-chromium',
    mobile: false,
    seed: aiSeed(40, PROBE_OK, { env: { browser: { name: 'Chrome', engine: 'chromium' } } }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // Firefox recognized + failure with unreadable permission: the only help that dares name the
  // spontaneous window (measured behavior, ADR-0006).
  {
    name: 'ai-section-firefox-down',
    mobile: false,
    seed: aiSeed(
      40,
      { kind: 'error', gate: 'unknown' },
      { env: { browser: { name: 'Firefox', engine: 'firefox' } } },
    ),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // WebKit: option A disabled, route forced to B, card 2 awaiting the local copy.
  {
    name: 'ai-section-safari',
    mobile: false,
    seed: aiSeed(40, { kind: 'idle' }, { env: { browser: { name: 'Safari', engine: 'webkit' } } }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // Route B chosen from a compatible browser: same steps 4-5, card 2 waiting.
  {
    name: 'ai-section-route-local',
    mobile: false,
    seed: aiSeed(
      40,
      { kind: 'idle' },
      { env: { browser: { name: 'Chrome', engine: 'chromium' } }, route: 'local' },
    ),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // Successful localhost mode (route B, or dev): no more banner, « Tout est prêt », card 2 active.
  {
    name: 'ai-section-localhost-ready',
    mobile: false,
    seed: aiSeed(40, PROBE_OK, {
      env: {
        browser: { name: 'Firefox', engine: 'firefox' },
        localhost: true,
        origin: 'http://localhost:8080',
      },
    }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  { name: 'ai-mobile-notice', mobile: true, seed: (v) => v, node: () => h(AiMobileNotice, null) },
];

it('UI render — golden of the surfaces outside `render-golden`', async () => {
  const parts: string[] = [];
  for (const c of CASES) {
    MOBILE = c.mobile;
    SEED = c.seed;
    // biome-ignore lint/suspicious/noExplicitAny: each case mounts a component with different props.
    parts.push(`### ${c.name}\n${readable(render(c.node() as any))}`);
  }
  SEED = (v) => v;
  MOBILE = false;

  // The FOUR failure messages of `AnalysisPage`. They only appear after an engine failure;
  // calling them directly freezes them all, including the decimal « Mo » fixed without a net in the
  // previous batch. Sizes chosen to render a NON-zero decimal (hence the French comma).
  parts.push(
    `### analyse-messages-echec\n${[
      errorMessage({
        ok: false,
        stage: 'too_large',
        originalSize: 150_000_000,
        limit: 110_000_000,
      }),
      errorMessage({ ok: false, stage: 'validate', issues: [] }),
      errorMessage({ ok: false, stage: 'parse', error: 'json_entry_not_found' }),
      errorMessage({ ok: false, stage: 'parse', error: 'invalid_zip' }),
    ].join('\n')}`,
  );

  await expect(parts.join('\n\n')).toMatchFileSnapshot('./__snapshots__/ui-golden.html');
}, 120_000);
