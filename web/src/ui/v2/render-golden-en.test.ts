// RENDER GOLDEN — THE ENGLISH TREE. The counterpart of `render-golden.test.ts`, in English.
//
// WHY A SEPARATE FILE, and not two more cases in the existing golden. `ui/copy.ts` and
// `ui/format.ts` resolve the language ONCE, at module evaluation. Rendering English therefore
// requires setting `<html lang>` BEFORE the first import — `vi.resetModules()` + DYNAMIC imports.
// The French golden imports its components statically, at the top of the file: adding English cases
// there would have forced rewriting it entirely, hence touching the file whose mission is
// precisely not to move. Two files, two languages, no risk on the French.
//
// ⚠ WHY THIS GOLDEN DID NOT EXIST BEFORE PERIMETER n°2. As long as `copy.ts` was French, an
// « English » tree rendered FRANGLAIS: English deductions in a French shell, with
// French numbers (U+202F, « 0 comment » in the singular). Freezing it then would have moved the
// snapshot TWICE — once for the franglais, once for the real English. It therefore waits until
// both perimeters are translated, and freezes only a coherent tree.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation: a proof mechanism declares its border. This one is THE SAME as
// that of the French golden, and it must be reread rather than assumed inherited:
//   - THE `ResultsView` SUBTREE ONLY, in DESKTOP. Neither `LandingPage`, nor `AnalysisPage`, nor
//     `SiteHeader`/`SiteFooter`, nor `AiSection` — that is the largest part of `copy.en.ts`.
//     `ui-golden.test.ts` covers these surfaces IN FRENCH; their English counterpart does not exist;
//   - THE DISCLOSURES ARE FORCED OPEN and the clock frozen, as on the French side;
//   - THE CSS IS REMOVED, so no style regression is visible here;
//   - IT DOES NOT JUDGE THE TRANSLATION. It freezes what is rendered, never whether it is well
//     written. An English mistranslation passes this golden green the day it enters, and every day after.
//
// WHAT IT PROVES, and it is precise: that the language CROSSES the whole chain — zip → `processExport`
// with `locale: 'en'` → rules → `Analysis` → components → DOM. It is the only measure that links the
// two ratifiable perimeters to a screen.

import { readFileSync } from 'node:fs';
import { beforeAll, expect, it, vi } from 'vitest';

// The disclosures live behind an internal `useState(false)`; closed, the golden would see neither
// verbatim, nor highlighted term (same precaution as the French golden).
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
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXED_NOW);
});

function readSample(name: string): Uint8Array {
  return new Uint8Array(readFileSync(new URL(`../../../../samples/${name}`, import.meta.url)));
}

function readable(html: string): string {
  return html.replace(/ style="[^"]*"/g, '').replace(/></g, '>\n<');
}

it('v2 EN render — the language crosses the whole chain', async () => {
  // ⚠ THE ORDER IS THE SUBJECT OF THE FILE: the language must be set BEFORE the first import of
  // `copy.ts`/`format.ts`, otherwise they will already have frozen the French. `resetModules` guarantees
  // that the dynamic imports below start from an empty cache.
  vi.resetModules();
  vi.stubGlobal('document', { documentElement: { lang: 'en' } });

  const { h } = await import('preact');
  const { render } = await import('preact-render-to-string');
  const { buildSyntheticExportZip, buildSyntheticExportZipEn } = await import(
    '../../demo/synthetic-export'
  );
  const { processExport } = await import('../../engine/pipeline');
  const { ResultsView } = await import('./ResultsView');

  const cases: { name: string; zip: Uint8Array; demo: boolean }[] = [
    // The EN persona is the BEARING case: it alone exercises the sensitive, the interests and the
    // anchored evidence with English text. The FR persona is included too, by design — it shows
    // the English interface over French DATA, that is what someone would see
    // who switches the language on their own export.
    { name: 'persona-en@en', zip: buildSyntheticExportZipEn(undefined, FIXED_NOW), demo: true },
    { name: 'persona-fr@en', zip: buildSyntheticExportZip(undefined, FIXED_NOW), demo: true },
    { name: 'sample@en', zip: readSample('user_data_tiktok.sample.zip'), demo: false },
  ];

  const parts: string[] = [];
  for (const c of cases) {
    const res = processExport(c.zip, { now: FIXED_NOW, locale: 'en' });
    if (!res.ok) {
      parts.push(`### ${c.name}\nREFUSÉ — ${JSON.stringify(res)}`);
      continue;
    }
    // biome-ignore lint/suspicious/noExplicitAny: the `output` prop follows the type of rework A.
    const view = ResultsView as any;
    parts.push(`### ${c.name}\n${readable(render(h(view, { output: res.output, demo: c.demo })))}`);
  }

  vi.unstubAllGlobals();
  await expect(parts.join('\n\n')).toMatchFileSnapshot('./__snapshots__/render-golden-en.html');
}, 120_000);
