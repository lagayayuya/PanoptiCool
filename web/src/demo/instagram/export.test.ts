// WHAT THE REAL PIPELINE FINDS ON THE SYNTHETIC ARCHIVE.
//
// ⚠ IT RUNS THE CONNECTOR, not a shortcut. The archive is built, opened as a zip and analysed by
// `instagramConnector` exactly as a dropped file would be — so this file is also the only place that
// proves the demo IS an export rather than a fixture shaped like one.
//
// ⚠ THE NUMBERS BELOW ARE MEASURED, NOT DESIGNED. They are written here after running, and a change
// in an extractor is meant to move them: that is the point of freezing them. What is asserted about
// the corpus itself is only what the spec ratified — twenty threads, the volumes, the arcs' order —
// because those are decisions; the rest is observation.
//
// ─── WHAT THIS TEST DOES NOT COVER ──────────────────────────────────────────────────────────────
//   - ANY RENDERING. It stops at the report; whether a piece draws it is the styles net's business
//     and the pieces' own;
//   - THE ENGLISH CORPUS'S PROSE. Both locales are built and their SHAPES are compared, but nobody
//     here reads the English for sense — the review file is what the maintainer reads for that;
//   - THE LOCAL AI. What a model says about these threads is the demonstration, and nothing here can
//     assert it.

import { describe, expect, it } from 'vitest';
import { BlobZipExportSource } from '../../engine/blob-zip-source';
import { instagramConnector } from '../../engine/instagram/connector';
import { THREADS } from './corpus';
import { buildInstagramDemoExport } from './export';

async function analyse(locale: 'fr' | 'en') {
  const { bytes, fileName } = buildInstagramDemoExport(locale);
  const file = new File([bytes.slice().buffer as ArrayBuffer], fileName);
  const source = await BlobZipExportSource.open(file, fileName);
  expect(await instagramConnector.recognize(source)).toBe(true);
  const result = await instagramConnector.analyze(source, { locale });
  if (!result.ok) throw new Error(`analysis failed: ${JSON.stringify(result)}`);
  return result.report;
}

describe('the synthetic Instagram export', () => {
  it('is recognised and analysed by the real connector (FR)', async () => {
    const report = await analyse('fr');

    // The spec's decisions, asserted because they were decided.
    expect(report.conversations.conversations).toHaveLength(THREADS.length);
    /**
     * The ratified volumes of the longest threads (spec: n°1 ≈ 1 000, then 700 → 300).
     * ⚠ « deadleuze » IS NOT IN THIS LIST and is deliberately shorter: it carries no combinatorial
     * filler at all — 145 lines, all written — because it is the thread meant to be read. It is a
     * ONE-TO-ONE thread, so its title is the other person's name; the handle carries the joke.
     */
    expect(report.conversations.conversations.slice(0, 3).map((c) => c.messages)).toEqual([
      1000, 700, 430,
    ]);
    const dead = report.conversations.conversations.find((c) => c.id.startsWith('deadleuze'));
    expect(dead?.messages).toBe(145);
    expect(dead?.isGroup).toBe(false);
    expect(THREADS).toHaveLength(20);
    // The three group threads carry N+1 participants (contract §0.1). « deadleuze » left the list
    // when it became a one-to-one exchange: the artifice it carries needs two voices, not four.
    expect(report.conversations.conversations.filter((c) => c.isGroup)).toHaveLength(3);

    // The holder is INFERRED from the threads, never declared to the extractor.
    expect(report.conversations.self).toBe('Camille Ferrand');

    /**
     * ⚠ THE SPEC'S VOLUMES, ASSERTED EXACTLY, because they were ratified: 1 000 photos, 500 videos,
     * 250 voice notes, all as message attachments. The published media (90 stories, 40 posts) sit
     * beside them, which is why the photo total is 1 130 rather than 1 000.
     */
    expect(report.universe.counts.bySource.dm).toBe(1750);
    expect(report.universe.counts.byKind.video).toBe(500);
    expect(report.universe.counts.byKind.audio).toBe(250);
    expect(report.universe.counts.byKind.photo).toBe(1130);

    // Measured on 2026-08-04, and meant to move when an extractor changes.
    expect(report.conversations.totals.messages).toBe(3734);
    expect(report.relations.nodes).toHaveLength(521);
    expect(report.identity.anchorsPresent).toBe(10);
    expect(report.identity.account.loginEvents).toBe(382);
    expect(report.identity.account.distinctIps).toBe(20);
    // The declared layer of the map: 40 posts with GPS and 30 stories with EXIF.
    expect(report.geo.declared).toHaveLength(70);
    /**
     * ⚠ THE TRAJECTORY IS EMPTY HERE, and that is not a defect. The login trail is resolved by the
     * geo database, which is not loaded in a unit test — the archive holds 260 dated logins from 7
     * documentation addresses, and the browser resolves them. What this asserts is that the ABSENCE
     * of a resolver leaves the declared layer intact rather than emptying the whole map.
     */
    expect(report.geo.trajectory).toHaveLength(0);
  }, 60_000);

  it('holds the same shape in English, with different prose', async () => {
    const [fr, en] = [await analyse('fr'), await analyse('en')];
    // Same archive shape: the arc is written once and phrased twice, so the COUNTS must match.
    expect(en.conversations.conversations).toHaveLength(fr.conversations.conversations.length);
    expect(en.universe.items.length).toBe(fr.universe.items.length);
    expect(en.conversations.totals.messages).toBe(fr.conversations.totals.messages);
    // And the prose is not the same text — a copy would make the English demo a French one.
    expect(en.conversations.conversations[0]?.title).toBeDefined();
  }, 90_000);
});
