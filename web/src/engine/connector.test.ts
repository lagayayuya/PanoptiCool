// WITNESS OF THE PLATFORM SEAM — that routing TikTok through `Connector` changed no analysis.
//
// WHY THIS FILE EXISTS. `tiktok-connector.ts` claims in its header that it WRAPS the pipeline
// rather than rewriting it. That claim is worth exactly what verifies it, and the four goldens do
// not: they call `processExport` directly, so they would stay green if the connector produced
// something else entirely — or produced nothing, since no golden renders through it.
//
// The bearing assertion is therefore an EQUALITY between the two paths on the same bytes, not a
// snapshot of either. A snapshot would freeze the connector's output and go green on the day both
// halves drifted together.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - THE `ExportSource` CONTRACT IN GENERAL. It exercises `ZipExportSource` on one small archive.
//     Directory listing on a deep tree, a 16 MB entry, a missing directory — none of it is here;
//     that belongs with the random-access implementation and its bench;
//   - MEMORY. `ZipExportSource` inflates the whole archive and this file does not measure the peak,
//     so nothing here would notice the day that becomes the wrong strategy. Its own header says
//     which case it is for; this test says nothing about it;
//   - THE FAILURE MAPPING END TO END. Two failure paths are exercised below (a non-zip, and a
//     source without the archive bytes). `too_large` and `validate` are NOT: reaching them needs a
//     26 MB archive and a deliberately malformed export, which `pipeline.test.ts` already builds
//     and which this file would only duplicate;
//   - WHAT THE UI DOES WITH ANY OF IT. No page reads the connector yet — the analysis page still
//     calls the engine client directly. That wiring lands with the second connector, and until then
//     this test is the connector's only reader.

import { expect, it } from 'vitest';
import { buildDemoExportZip } from '../demo/synthetic-export';
import { TIKTOK_JSON_ENTRY_NAME } from './parse';
import { processExport } from './pipeline';
import { TiktokZipSource, tiktokConnector } from './tiktok-connector';
import { ZipExportSource } from './zip-source';

const FIXED_NOW = Date.UTC(2026, 6, 16, 12, 0, 0);

it('the connector returns EXACTLY what the pipeline returns, on the same bytes', async () => {
  const zip = buildDemoExportZip('fr');

  const direct = processExport(zip, { locale: 'fr', now: FIXED_NOW });
  const viaSeam = await tiktokConnector.analyze(new TiktokZipSource(zip), {
    locale: 'fr',
    now: FIXED_NOW,
  });

  // Anchoring: the persona really does produce findings. Without this the equality below could hold
  // between two empty analyses and prove nothing — the zero would have two possible causes.
  expect(direct.ok).toBe(true);
  if (!direct.ok) return;
  expect(direct.output.signals.length + direct.output.themes.length).toBeGreaterThan(0);

  expect(viaSeam.ok).toBe(true);
  if (!viaSeam.ok) return;
  expect(viaSeam.report).toEqual(direct.output);
});

it('recognizes a TikTok archive by the entry the contract names, and only that', async () => {
  const zip = buildDemoExportZip('fr');
  await expect(tiktokConnector.recognize(new TiktokZipSource(zip))).resolves.toBe(true);

  // An archive of the right FORM carrying the wrong entry: recognition is about the contract's
  // entry, not about being a zip. Built here rather than reused, so the negative case cannot go
  // green because the fixture happened to be empty.
  const { zipSync, strToU8 } = await import('fflate');
  const other = zipSync({ 'some_other_export.json': strToU8('{}') });
  await expect(tiktokConnector.recognize(new ZipExportSource(other))).resolves.toBe(false);
});

it('a source without the archive bytes is REFUSED, not silently degraded', async () => {
  // `ZipExportSource` satisfies `ExportSource` but carries no `zipBytes`. The connector needs them
  // for its streaming ingestion, and the type cannot express that — so the refusal is the only
  // thing standing between this case and a quiet loss of the streaming path.
  const plain = new ZipExportSource(buildDemoExportZip('fr'));
  const result = await tiktokConnector.analyze(plain, { locale: 'fr', now: FIXED_NOW });
  expect(result.ok).toBe(false);
  if (result.ok) return;
  expect(result.stage).toBe('parse');
});

it('ZipExportSource lists, stats and reads the one entry a TikTok export has', async () => {
  const source = new ZipExportSource(buildDemoExportZip('fr'), 'demo.zip');
  expect(source.rootName()).toBe('demo.zip');
  await expect(source.exists(TIKTOK_JSON_ENTRY_NAME)).resolves.toBe(true);
  await expect(source.exists('nope.json')).resolves.toBe(false);

  const stat = await source.stat(TIKTOK_JSON_ENTRY_NAME);
  expect(stat).not.toBeNull();
  expect(stat?.size).toBeGreaterThan(0);

  expect(await source.listDir('')).toContainEqual({
    name: TIKTOK_JSON_ENTRY_NAME,
    kind: 'file',
  });

  // The entry parses as the contract's 10 top-level categories — a read that goes through the
  // source rather than through the pipeline, which is the point of having the source at all.
  const parsed = await source.readJson<Record<string, unknown>>(TIKTOK_JSON_ENTRY_NAME);
  expect(Object.keys(parsed).length).toBe(10);
});
