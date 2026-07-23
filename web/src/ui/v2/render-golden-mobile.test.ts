// RENDER GOLDEN — `ResultsView` IN MOBILE.
//
// WHY THIS FILE EXISTS. `render-golden.test.ts` has NEVER rendered anything but the desktop,
// and no one had written it. The cause is mechanical: `useIsMobile` reads `window.matchMedia`;
// in a Node environment `window` is absent, so the hook returns `false` — permanently. Yet the
// components carry complete mobile variants (`M_*`), with their OWN prose:
// shortened titles, the verb « Touche » instead of « Clique sur », a chip table of contents, kicker
// carrying the demo mention. None of this was frozen.
//
// The stake is not cosmetic: six prose-extraction batches were validated « to the byte »
// by a net that did not see these variants. This file covers them — and it will cover them too
// when the English translation arrives, which is half of its value.
//
// WHAT `ui-golden.test.ts` ALREADY COVERS, and that we therefore do not redo here: the mobile
// variants of `SiteHeader`, `LandingPage`, `AnalysisPage` (deposit state) and `AiMobileNotice`. The
// real hole was `ResultsView` and its subtree — `ActivitySection`, `ThemeCardNavy`/`SignalCardNavy`,
// `NoDeductionCard`, `LearnPanel` —, that is the surface densest in extracted prose.
//
// WHY A SEPARATE FILE rather than a section in `render-golden`. That snapshot is
// actively moved by the work on the detector (the FR render changes when a rule changes).
// Doubling its volume would double the noise of their diffs and the conflict surface, for content
// that does not concern them. The mobile is moreover a distinct LAYOUT concern:
// separating it keeps each diff readable.
//
// WHY A `matchMedia` STUB RATHER THAN A MODULE MOCK. Mocking `./useIsMobile` would have been enough
// to force mobile — and would have kept passing if someone changed `MOBILE_QUERY`. The stub
// below REALLY EVALUATES the media query against a viewport width: the threshold is therefore
// exercised, not bypassed. Same cost, strictly sturdier net.
//
// ─── WHAT IT PROVED RETROACTIVELY, AND HOW ──────────────────────────────────────────────────────
// An ordinary golden compares against ITS own baseline. This one had to say something about
// six already-committed batches, whose mobile baseline never existed. Git held it:
//   1. `git worktree add --detach <commit>` on a throwaway tree, `node_modules` linked to the main one;
//   2. THIS file is injected there as is — the probe does not vary, which is what makes the measure
//      comparable — and the snapshot is DELETED before each run (otherwise vitest COMPARES instead
//      of writing, and a « green » would no longer mean anything);
//   3. each batch is compared to ITS OWN PARENT (`X~1` against `X`), not to a distant landmark.
// Point 3 is what makes the measure honest: a first attempt compared « before everything » to
// « after everything », yet the ratified correction commits (Intl, plurals) fall WITHIN that
// interval — the diff then mixed what had to move and what must not. Comparing each
// commit to its parent isolates exactly the question asked.
// Result: the six extraction batches are byte-identical IN MOBILE TOO; the three deliberate
// commits move there exactly what they moved in desktop, to the character.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation (« What a net proves »).
//   - IT ONLY RENDERS `ResultsView`. The other mobile surfaces live in `ui-golden.test.ts`;
//   - IT ONLY SEES ONE WIDTH (390 px, that of the mockups). Nothing here exercises the neighborhood
//     of the threshold, nor the intermediate widths: a layout that breaks at 700 px would pass;
//   - IT DOES NOT EXERCISE THE RESIZE. `useEffect` does not run in string rendering, so
//     the `matchMedia.addEventListener` subscription — the desktop↔mobile switch AT RUNTIME — is
//     never played. Only the INITIAL state is frozen;
//   - IT DOES NOT SEE THE CSS (removed, as in the neighboring goldens): no style regression,
//     hence no proof that the mobile layout is actually readable. It proves that the
//     right TEXT goes into the right BRANCH, not that it displays well;
//   - IT ONLY SEES THE OPEN STATE of the disclosures (precaution 2, inherited from the neighboring golden);
//   - NAMED DEBT, deliberately untreated: nothing here or elsewhere detects a DEAD entry
//     of `ui/copy.ts` (a text no component reads anymore). yuya's arbitration — a dead entry
//     is dead weight, not a false text, so the failure mode is benign; and the same test
//     will be worth more once the catalog is bilingual, since it will then also answer « which
//     EN entry is missing ». To be picked up at that moment, not before.
//   - IT PROVES NOTHING ABOUT ENGLISH. The mobile variants are now frozen IN FRENCH;
//     that is what will allow the translation to be measured when it arrives, but no line here
//     says anything about an English version that does not exist.

import { readFileSync } from 'node:fs';
import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { beforeAll, expect, it, vi } from 'vitest';
import { buildSyntheticExportZip, buildSyntheticExportZipEn } from '../../demo/synthetic-export';
import { processExport } from '../../engine/pipeline';
import { ResultsView } from './ResultsView';

/** Width of the mobile mockups. Below the `MOBILE_QUERY` threshold (720 px). */
const VIEWPORT_WIDTH = 390;

/** Evaluates `(max-width: Npx)` for real — that is what makes `MOBILE_QUERY` EXERCISED and not
 * bypassed. A query of another shape does not match: the test would fall, which is the
 * intended behavior if the threshold changes in nature. */
function matchMediaStub(query: string): { matches: boolean } {
  const m = query.match(/\(max-width:\s*(\d+)px\)/);
  return { matches: m?.[1] !== undefined && VIEWPORT_WIDTH <= Number(m[1]) };
}

// Precaution 2 (inherited): every boolean toggle initialized to `false` — the disclosures — is opened.
vi.mock('preact/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('preact/hooks')>();
  return {
    ...actual,
    useState: <T>(init: T) =>
      actual.useState(init === (false as unknown as T) ? (true as unknown as T) : init),
  };
});

const FIXED_NOW = Date.UTC(2026, 6, 16, 12, 0, 0);

beforeAll(() => {
  // `useIsMobile` tests `typeof window !== 'undefined'` BEFORE calling `matchMedia`: so both are
  // needed. `location` is provided as a precaution — other views read `window.location.search`.
  (globalThis as { window?: unknown }).window = {
    matchMedia: matchMediaStub,
    location: { search: '' },
  };
  // Precaution 1 (inherited): frozen clock → reproducible sliding windows.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXED_NOW);
});

function readSample(name: string): Uint8Array {
  return new Uint8Array(readFileSync(new URL(`../../../../samples/${name}`, import.meta.url)));
}

/** Precaution 3 (inherited): we keep the structure and the text, we drop the CSS. */
function readable(html: string): string {
  return html.replace(/ style="[^"]*"/g, '').replace(/></g, '>\n<');
}

it('v2 MOBILE render — end-to-end golden (persona + committed zips)', async () => {
  const cases: { name: string; zip: Uint8Array; demo: boolean }[] = [
    { name: 'persona-fr', zip: buildSyntheticExportZip(undefined, FIXED_NOW), demo: true },
    { name: 'persona-en', zip: buildSyntheticExportZipEn(undefined, FIXED_NOW), demo: true },
    { name: 'sample', zip: readSample('user_data_tiktok.sample.zip'), demo: false },
    { name: 'empty', zip: readSample('user_data_tiktok.empty.zip'), demo: false },
    { name: 'absent', zip: readSample('user_data_tiktok.absent.zip'), demo: false },
  ];

  const parts: string[] = [];
  for (const c of cases) {
    const res = processExport(c.zip);
    if (!res.ok) {
      parts.push(`### ${c.name}\nREFUSÉ — ${JSON.stringify(res)}`);
      continue;
    }
    // biome-ignore lint/suspicious/noExplicitAny: same `output` prop as the desktop golden.
    const view = ResultsView as any;
    parts.push(`### ${c.name}\n${readable(render(h(view, { output: res.output, demo: c.demo })))}`);
  }

  await expect(parts.join('\n\n')).toMatchFileSnapshot('./__snapshots__/render-golden-mobile.html');
}, 120_000);
