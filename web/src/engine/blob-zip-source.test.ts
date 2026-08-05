// RANDOM-ACCESS ZIP — the witness, and the measurement that turns « too big » into a property of
// the archive rather than a guess about the machine.
//
// WHAT IT PROVES, in order of how much it matters:
//   1. the two `ExportSource` implementations return the SAME BYTES for the same archive — the whole
//      claim of having a contract with two implementations;
//   2. the index cost is INDEPENDENT OF THE ARCHIVE'S BYTES — measured by counting the bytes
//      actually sliced (never by timing), on two archives with the same entry count and a tenfold
//      difference in content. « A small fraction of the archive » would have been the weaker claim
//      and the misleading one: on a 428 KB fixture the index reads 23 % of the file, because the
//      64 KB tail scan dominates. The fraction SHRINKS as the archive grows, which is exactly why
//      the invariant to assert is independence, not a ratio;
//   3. the per-entry budget refuses BEFORE inflating, from the directory's declared size.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation: a proof mechanism declares its border — and a bench that says « 2 GB works »
// without naming its hardware is exactly the over-cited net the rule exists for.
//
//   - ⚠ IT HAS NEVER SEEN A 2 GB ARCHIVE. The archives here are a few MB, built in-process. What is
//     measured is the READ PATTERN — index cost proportional to the tail, entry cost proportional to
//     the entry — which is what makes the 2 GB claim plausible; it is NOT a measurement of 2 GB. The
//     real check is a maintainer dropping a real export in a real browser, and until that is done
//     and recorded, nothing here licenses the sentence « 2 GB works »;
//   - IT DOES NOT MEASURE MEMORY. `Blob.slice()` in Node is not the browser's disk-backed slice; a
//     Node `Blob` built from a `Uint8Array` holds its bytes in memory whatever this file does. So
//     the peak measured here is meaningless and is not measured. What IS verified is that the code
//     never asks for more than one entry at a time — a property of the read pattern, visible in the
//     byte counter below, and the reason the browser's peak will follow;
//   - NO ZIP64 ARCHIVE IS EXERCISED. `fflate` emits ZIP64 records only past its thresholds, and
//     building a 4 GB fixture to cross them is not a test, it is a machine. The ZIP64 branch of
//     `readCentralDirectory` is therefore READ but not RUN — a real hole, stated rather than
//     implied by silence, and the most likely place for a defect to survive this file;
//   - NO ENCRYPTED, MULTI-DISK OR STORED-METHOD-OTHER-THAN-0/8 ARCHIVE. The refusals are written;
//     only the encrypted one is exercised, by hand-setting the flag bit.

import { strToU8, zipSync } from 'fflate';
import { expect, it } from 'vitest';
import { BlobZipExportSource, EntryTooLarge } from './blob-zip-source';
import { readCentralDirectory } from './ingest/zip-directory';
import { ZipExportSource } from './zip-source';

/** A tree with enough entries, depths and sizes that listing and slicing have something to get
 *  wrong. Contents are synthetic and deterministic — a seeded filler, never a real value. */
function buildTree(entryCount = 60, fillerBytes = 20_000): Record<string, Uint8Array> {
  const files: Record<string, Uint8Array> = {};
  for (let i = 0; i < entryCount; i++) {
    const dir = `dir_${i % 5}/sub_${i % 3}`;
    // Deterministic filler that still compresses like text rather than like zeros.
    const body = Array.from({ length: fillerBytes / 20 }, (_, k) => `line ${i}-${k} filler\n`).join(
      '',
    );
    files[`${dir}/entry_${i}.json`] = strToU8(JSON.stringify({ i, body }));
  }
  return files;
}

/** Wraps a `Blob` and counts the bytes each `slice()` actually asks for. */
function countingBlob(bytes: Uint8Array): {
  blob: Blob;
  sliced: () => number;
  byteLength: number;
} {
  const inner = new Blob([bytes as unknown as BlobPart]);
  let total = 0;
  const proxy = {
    size: inner.size,
    slice(start: number, end: number) {
      total += end - start;
      return inner.slice(start, end);
    },
  } as unknown as Blob;
  return { blob: proxy, sliced: () => total, byteLength: bytes.length };
}

it('the two ExportSource implementations return the same bytes for the same archive', async () => {
  const zip = zipSync(buildTree());
  const sync = new ZipExportSource(zip);
  const random = await BlobZipExportSource.open(new Blob([zip as unknown as BlobPart]));

  // Anchoring: the fixture really has a tree. Comparing two empty listings would pass and prove
  // nothing — the equality's zero would have a second possible cause.
  const dirs = await random.listDir('');
  expect(dirs.length).toBe(5);
  expect(dirs.every((d) => d.kind === 'directory')).toBe(true);

  for (const path of ['dir_0/sub_0/entry_0.json', 'dir_4/sub_1/entry_19.json']) {
    expect(await random.readText(path)).toBe(await sync.readText(path));
    expect(await random.stat(path)).toEqual(await sync.stat(path));
  }
  expect(await random.listDir('dir_1/sub_0')).toEqual(await sync.listDir('dir_1/sub_0'));
  expect(await random.exists('dir_2')).toBe(true);
  expect(await random.exists('dir_9')).toBe(false);
});

it("MEASURED — indexing cost is independent of the archive's BYTES, and one read touches one entry", async () => {
  // THE REAL INVARIANT, and it is not « a fraction of the archive ». The index costs the tail scan
  // plus the central directory, both functions of the ENTRY COUNT — so growing the CONTENT tenfold
  // while keeping the count identical must not move it. That is the property that makes a 2 GB drop
  // feasible, and it is the one thing this file can actually measure without a 2 GB fixture.
  const small = zipSync(buildTree(60, 20_000));
  const big = zipSync(buildTree(60, 200_000));

  const a = countingBlob(small);
  const b = countingBlob(big);
  await BlobZipExportSource.open(a.blob);
  await BlobZipExportSource.open(b.blob);

  // Anchoring: the two archives really do differ in size, so the equality below is not comparing a
  // thing with itself.
  expect(b.byteLength).toBeGreaterThan(a.byteLength * 5);

  // Same entry count → same index cost, to the byte. Not « similar »: identical, because neither
  // the tail scan nor the directory read depends on what the entries contain.
  expect(b.sliced()).toBe(a.sliced());

  const source = await BlobZipExportSource.open(b.blob);
  const before = b.sliced();
  await source.readText('dir_0/sub_0/entry_0.json');
  const oneEntry = b.sliced() - before;

  // One read touches its own entry (plus a 30-byte local header), never the archive. If a future
  // change re-read the whole blob, this is the assertion that would say so.
  const entrySize = (await source.stat('dir_0/sub_0/entry_0.json'))?.size ?? 0;
  expect(entrySize).toBeGreaterThan(0);
  expect(oneEntry).toBeLessThan(entrySize + 1024);
});

it('the per-entry budget refuses BEFORE inflating, from the declared size', async () => {
  const zip = zipSync(buildTree(4, 40_000));
  const source = await BlobZipExportSource.open(
    new Blob([zip as unknown as BlobPart]),
    'export.zip',
    // A limit below the entries' declared size: nothing must inflate.
    1_000,
  );
  await expect(source.readText('dir_0/sub_0/entry_0.json')).rejects.toBeInstanceOf(EntryTooLarge);

  // And the same archive opens under a limit above it — so the refusal came from the budget, not
  // from the reader being unable to read the archive at all. Without this, the rejection above has
  // two possible causes and distinguishes neither.
  const ok = await BlobZipExportSource.open(new Blob([zip as unknown as BlobPart]));
  await expect(ok.readText('dir_0/sub_0/entry_0.json')).resolves.toContain('filler');
});

it('the directory reports sizes without inflating anything', async () => {
  const zip = zipSync(buildTree(10));
  const { blob, sliced } = countingBlob(zip);
  const source = await BlobZipExportSource.open(blob);
  const after = sliced();

  expect(source.largestEntryBytes()).toBeGreaterThan(0);
  expect(source.totalUncompressedBytes()).toBeGreaterThan(source.largestEntryBytes());
  // Reading the two figures costs nothing: they come from the index already in hand.
  expect(sliced()).toBe(after);
});

it('a non-zip is refused by name, not mis-parsed', async () => {
  const notAZip = new Blob([strToU8('this is not an archive') as unknown as BlobPart]);
  await expect(readCentralDirectory(notAZip)).rejects.toThrow(/no end-of-central-directory/);
});

it('an encrypted entry is refused rather than inflated into garbage', async () => {
  const zip = zipSync(buildTree(2));
  // Set bit 0 (encryption) of the general-purpose flags in the FIRST central-directory record.
  // Located by signature rather than by a computed offset, so the mutation survives fixture changes.
  const copy = zip.slice();
  const view = new DataView(copy.buffer, copy.byteOffset, copy.byteLength);
  let patched = false;
  for (let i = 0; i + 4 <= copy.length; i++) {
    if (view.getUint32(i, true) === 0x02014b50) {
      view.setUint16(i + 8, view.getUint16(i + 8, true) | 0x1, true);
      patched = true;
      break;
    }
  }
  // Without this the test could pass on an archive it never patched — the rejection would then be
  // measuring something else entirely.
  expect(patched).toBe(true);
  await expect(readCentralDirectory(new Blob([copy as unknown as BlobPart]))).rejects.toThrow(
    /encrypted/,
  );
});
