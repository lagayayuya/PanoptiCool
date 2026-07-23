// v2 RENDER GOLDEN — the net of rework A (architecture audit §5).
//
// WHY THIS TEST EXISTS. Rework A changes the schema BY CONSTRUCTION (`EngineOutput` →
// `Analysis`): no exact diff is therefore possible at the engine's border. The only
// measurement point that SURVIVES the rework is **what the user sees**. This golden renders the v2
// UI end to end (zip → ingestion → rules → render) and freezes the result. The promise « the v2
// render does not move » becomes verifiable by diff, instead of merely asserted.
//
// WHAT IT COVERS, and why the persona is MANDATORY: the 3 committed zips of `samples/` produce
// NO D1/D2 topic — no sensitive, no interest, no evidence, no theme (measured). A golden
// built on them « would prove » the invariance of everything EXCEPT the core the rework rewrites.
// The demo persona (`demo/synthetic-export.ts`) is therefore the bearing case: it alone exercises
// the sensitive (mental_health, conflictual), the interests (chats, cinema_series), the anchored
// evidence, the highlighted triggerTerms and the C5 (« comment:8 » feeds conflictual AND cinema_series).
//
// THREE PRECAUTIONS, without which the net would be holed:
//   1. clock FROZEN — `activity-rhythm` computes its sliding windows on `Date.now()`;
//   2. disclosures FORCED OPEN — the evidence lives behind an internal `useState(false)`; closed,
//      the golden would see neither verbatim, nor highlighted term, nor C5;
//   3. styles REMOVED — CSS is not behavior, and its volume would make the diff unreadable.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation: a proof mechanism declares its border, otherwise it ends up over-cited.
// This one was cited as if it covered « the render »; it covers the `ResultsView` subtree, and
// no more:
//   - `AiSection` — mounted behind `aiSource !== undefined`, never passed here;
//   - `LandingPage`, `AnalysisPage`, `SiteHeader`, `SiteFooter` — none of these views enters
//     `ResultsView`. They are covered by `ui-golden.test.ts`, added for that precise hole;
//   - THE FAN IN `equal` MODE. The demo persona produces a NAMED `mental_health` finding, hence
//     a `ranked` fan: the `equal` mode (broad findings) is mounted by no golden. The
//     border is STRUCTURAL and deserves to be read as such — the persona is written
//     blind, like a person, so what it does not exercise is no one's choice, and what
//     no one decided to omit, no one thinks to write down. A defect lived there (the `equal`
//     mode truncated at two readings); it is covered by `fan-readings.test.ts`.
//   - THE MOBILE, IN FULL. `useIsMobile` reads `matchMedia`; in a Node environment, `window` is
//     absent, so it returns `false` — this golden has NEVER rendered anything but the desktop, even
//     though the components carry complete mobile variants (`M_*`);
//   - the CLOSED state of the disclosures: precaution 2 forces them all open. The collapsed render,
//     the one the user sees first, is not frozen;
//   - the CSS (precaution 3): no style regression is detectable here;
//   - the SINGULAR forms. Persona and committed zips carry realistic volumes, hence
//     plurals: « 1 items » stayed invisible here until a calling test showed it
//     (`ui/copy.test.ts`).

import { readFileSync } from 'node:fs';
import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { beforeAll, expect, it, vi } from 'vitest';
import { buildSyntheticExportZip, buildSyntheticExportZipEn } from '../../demo/synthetic-export';
import { processExport } from '../../engine/pipeline';
import { ResultsView } from './ResultsView';

// Precaution 2: every boolean toggle initialized to `false` (the disclosures) is opened.
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
  // Precaution 1: frozen clock → reproducible sliding windows.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXED_NOW);
});

function readSample(name: string): Uint8Array {
  return new Uint8Array(readFileSync(new URL(`../../../../samples/${name}`, import.meta.url)));
}

/** Precaution 3: we keep the structure and the text, we drop the CSS. One tag per line. */
function readable(html: string): string {
  return html.replace(/ style="[^"]*"/g, '').replace(/></g, '>\n<');
}

it('v2 render — end-to-end golden (persona + committed zips)', async () => {
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
      // A refusal IS a behavior (`absent`: `Searches` key omitted → rejected at validation).
      // We freeze it as is rather than hide it: the rework must not change it either.
      parts.push(`### ${c.name}\nREFUSÉ — ${JSON.stringify(res)}`);
      continue;
    }
    // biome-ignore lint/suspicious/noExplicitAny: the `output` prop changes type at rework A.
    const view = ResultsView as any;
    parts.push(`### ${c.name}\n${readable(render(h(view, { output: res.output, demo: c.demo })))}`);
  }

  await expect(parts.join('\n\n')).toMatchFileSnapshot('./__snapshots__/render-golden.html');
}, 120_000);
