// RANDOM-ACCESS ZIP — reading an archive without unpacking it.
//
// THE PROBLEM THIS SOLVES, in one sentence: `unzipSync` inflates the WHOLE archive into memory, so
// a 2 GB Instagram export cannot be opened in a browser tab at all — not slowly, not at all.
//
// A zip is not a stream: it ends with a CENTRAL DIRECTORY listing every entry with its offset,
// its sizes and its compression method. A few dozen KB at the tail of the file. Read that, and you
// have an index; then each entry is inflated on demand from `Blob.slice(offset, end)`. A dropped
// `File` is disk-backed, so slicing never loads the archive — the browser reads the range.
//
// ⚠ WHAT THIS CHANGES ABOUT « TOO BIG », which was the open question: peak memory stops tracking the
// ARCHIVE and starts tracking the LARGEST SINGLE ENTRY being inflated. On the reference Instagram
// export that is 16 MB against 2 GB total (`docs/instagram-export-schema.md` §2). So the guard
// becomes a per-entry budget, which is a measurable property of the archive — not a guess about the
// reader's machine, which is what a total-size ceiling always was.
//
// It follows that a 2 GB archive of ordinary entries opens, and a 500 MB archive holding one 400 MB
// entry may not. That is the honest shape of the limit, and the copy says so rather than promising
// a number.
//
// ─── WHAT THIS READER DOES NOT DO ───────────────────────────────────────────────────────────────
//   - NO ENCRYPTION, no multi-disk (« spanned ») archives. Both are refused by name rather than
//     mis-parsed into nonsense;
//   - NO COMPRESSION METHOD BUT `store` (0) AND `deflate` (8). Everything Instagram and TikTok
//     produce is one of the two; anything else is refused as unsupported rather than guessed at;
//   - NO ZIP64 END-OF-DIRECTORY *STREAMING*. ZIP64 is READ (an export past 65 535 entries or 4 GB
//     needs it, and the reference export is already at 5 920 entries), but the reader still holds
//     the whole central directory in memory — a few MB at Instagram's scale, and the one allocation
//     proportional to the ENTRY COUNT rather than to the bytes;
//   - NO INTEGRITY CHECK. The CRC-32 in the directory is parsed and NOT verified. Verifying it
//     would mean a second pass over every inflated entry for a failure mode — silent corruption of
//     a file the person just downloaded — that the JSON parse downstream catches anyway, loudly;
//   - NOTHING ABOUT ORDER. Entries come back in central-directory order, which is the archiver's
//     order and means nothing.

/** One entry of the central directory — enough to locate and inflate it, nothing more. */
export interface ZipEntry {
  /** Path inside the archive, `/`-separated, never leading with one. */
  readonly path: string;
  /** Offset of the LOCAL header (not of the data: the local header's length is variable). */
  readonly localHeaderOffset: number;
  readonly compressedSize: number;
  readonly uncompressedSize: number;
  /** 0 = stored, 8 = deflate. Any other value is refused when the entry is read. */
  readonly method: number;
}

export class ZipFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZipFormatError';
  }
}

const EOCD_SIG = 0x06054b50;
const EOCD64_LOCATOR_SIG = 0x07064b50;
const EOCD64_SIG = 0x06064b50;
const CENTRAL_SIG = 0x02014b50;
const LOCAL_SIG = 0x04034b50;

/** The end-of-central-directory record is at most 22 bytes + a 65 535-byte comment. */
const MAX_EOCD_SEARCH = 22 + 0xffff;

/** ZIP64 sentinel: a 32-bit field set to all-ones means « read the real value from the extra field ». */
const U32_MAX = 0xffffffff;
const U16_MAX = 0xffff;

async function sliceBytes(blob: Blob, start: number, end: number): Promise<Uint8Array> {
  return new Uint8Array(await blob.slice(start, end).arrayBuffer());
}

/**
 * Locates the end-of-central-directory record by scanning BACKWARDS from the tail.
 *
 * ⚠ SCANNING BACKWARDS IS NOT AN OPTIMISATION, it is correctness. The EOCD signature is four
 * ordinary bytes and can legitimately occur inside a compressed entry; the LAST occurrence is the
 * real one. A forward scan finds a decoy in an archive that contains a zip.
 */
async function findEocd(blob: Blob): Promise<{ view: DataView; offsetInBlob: number }> {
  const searchLen = Math.min(blob.size, MAX_EOCD_SEARCH);
  const start = blob.size - searchLen;
  const tail = await sliceBytes(blob, start, blob.size);
  const view = new DataView(tail.buffer, tail.byteOffset, tail.byteLength);
  for (let i = tail.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === EOCD_SIG) {
      return {
        view: new DataView(tail.buffer, tail.byteOffset + i, tail.length - i),
        offsetInBlob: start + i,
      };
    }
  }
  throw new ZipFormatError('not a zip: no end-of-central-directory record');
}

/**
 * Reads the central directory and returns the entry index.
 *
 * The cost is one small read at the tail plus one read of the directory itself — never the entries.
 */
export async function readCentralDirectory(blob: Blob): Promise<ZipEntry[]> {
  const { view: eocd, offsetInBlob } = await findEocd(blob);

  let entryCount = eocd.getUint16(10, true);
  let directorySize = eocd.getUint32(12, true);
  let directoryOffset = eocd.getUint32(16, true);
  const diskNumber = eocd.getUint16(4, true);

  if (diskNumber !== 0) {
    throw new ZipFormatError('multi-disk archives are not supported');
  }

  // ZIP64: any of the three fields saturated means the real values live in the ZIP64 records that
  // sit just BEFORE the EOCD. The locator is fixed-size, so it is found by subtraction.
  if (entryCount === U16_MAX || directorySize === U32_MAX || directoryOffset === U32_MAX) {
    const locatorStart = offsetInBlob - 20;
    if (locatorStart < 0) {
      throw new ZipFormatError('zip64 fields present but no zip64 locator');
    }
    const locatorBytes = await sliceBytes(blob, locatorStart, locatorStart + 20);
    const locator = new DataView(locatorBytes.buffer, locatorBytes.byteOffset, 20);
    if (locator.getUint32(0, true) !== EOCD64_LOCATOR_SIG) {
      throw new ZipFormatError('zip64 fields present but no zip64 locator');
    }
    // The locator carries a 64-bit offset. `getBigUint64` → `Number` is exact below 2^53, which is
    // 9 PB: an archive large enough to lose precision here cannot be held by a browser anyway.
    const eocd64Offset = Number(locator.getBigUint64(8, true));
    const eocd64Bytes = await sliceBytes(blob, eocd64Offset, eocd64Offset + 56);
    const eocd64 = new DataView(eocd64Bytes.buffer, eocd64Bytes.byteOffset, eocd64Bytes.byteLength);
    if (eocd64.getUint32(0, true) !== EOCD64_SIG) {
      throw new ZipFormatError('zip64 locator points at no zip64 record');
    }
    entryCount = Number(eocd64.getBigUint64(32, true));
    directorySize = Number(eocd64.getBigUint64(40, true));
    directoryOffset = Number(eocd64.getBigUint64(48, true));
  }

  const dirBytes = await sliceBytes(blob, directoryOffset, directoryOffset + directorySize);
  const dir = new DataView(dirBytes.buffer, dirBytes.byteOffset, dirBytes.byteLength);
  const decoder = new TextDecoder('utf-8');
  const entries: ZipEntry[] = [];

  let p = 0;
  for (let i = 0; i < entryCount; i++) {
    if (p + 46 > dirBytes.length || dir.getUint32(p, true) !== CENTRAL_SIG) {
      throw new ZipFormatError(`corrupt central directory at entry ${i}`);
    }
    const flags = dir.getUint16(p + 8, true);
    const method = dir.getUint16(p + 10, true);
    let compressedSize = dir.getUint32(p + 20, true);
    let uncompressedSize = dir.getUint32(p + 24, true);
    const nameLen = dir.getUint16(p + 28, true);
    const extraLen = dir.getUint16(p + 30, true);
    const commentLen = dir.getUint16(p + 32, true);
    let localHeaderOffset = dir.getUint32(p + 42, true);

    // Bit 0 of the general-purpose flags is the encryption bit. Named rather than mis-inflated:
    // an encrypted entry decompresses into garbage without erroring.
    if ((flags & 0x1) !== 0) {
      throw new ZipFormatError('encrypted entries are not supported');
    }

    const nameStart = p + 46;
    const path = decoder.decode(dirBytes.subarray(nameStart, nameStart + nameLen));

    // ZIP64 extra field (id 0x0001): the saturated 32-bit fields are re-read here, IN THE ORDER the
    // spec fixes — uncompressed, compressed, offset — and only those that were saturated are
    // present. Reading them positionally without that check is the classic way to get an offset
    // that points into the middle of a file.
    if (
      compressedSize === U32_MAX ||
      uncompressedSize === U32_MAX ||
      localHeaderOffset === U32_MAX
    ) {
      let e = nameStart + nameLen;
      const extraEnd = e + extraLen;
      while (e + 4 <= extraEnd) {
        const headerId = dir.getUint16(e, true);
        const dataSize = dir.getUint16(e + 2, true);
        if (headerId === 0x0001) {
          let q = e + 4;
          if (uncompressedSize === U32_MAX) {
            uncompressedSize = Number(dir.getBigUint64(q, true));
            q += 8;
          }
          if (compressedSize === U32_MAX) {
            compressedSize = Number(dir.getBigUint64(q, true));
            q += 8;
          }
          if (localHeaderOffset === U32_MAX) {
            localHeaderOffset = Number(dir.getBigUint64(q, true));
          }
          break;
        }
        e += 4 + dataSize;
      }
    }

    // Directory records carry no data and end in `/`. Dropped: `listDir` derives directories from
    // the file paths, so an archive that stores them and one that does not list identically.
    if (!path.endsWith('/')) {
      entries.push({ path, localHeaderOffset, compressedSize, uncompressedSize, method });
    }
    p = nameStart + nameLen + extraLen + commentLen;
  }
  return entries;
}

/**
 * Inflates ONE entry, reading only its bytes.
 *
 * ⚠ THE LOCAL HEADER MUST BE RE-READ, and this is the trap of random-access zip: the central
 * directory gives the offset of the local HEADER, whose name and extra-field lengths are variable —
 * and the local extra field is routinely a DIFFERENT length from the central one. Computing the
 * data offset from the central entry's lengths lands a few bytes off, and deflate then fails with a
 * corrupt-stream error that looks like a broken archive rather than like this bug.
 */
export async function inflateEntry(
  blob: Blob,
  entry: ZipEntry,
  inflateRaw: (bytes: Uint8Array, expectedSize: number) => Uint8Array,
): Promise<Uint8Array> {
  const headBytes = await sliceBytes(blob, entry.localHeaderOffset, entry.localHeaderOffset + 30);
  const head = new DataView(headBytes.buffer, headBytes.byteOffset, headBytes.byteLength);
  if (head.getUint32(0, true) !== LOCAL_SIG) {
    throw new ZipFormatError(`no local header for ${entry.path}`);
  }
  const nameLen = head.getUint16(26, true);
  const extraLen = head.getUint16(28, true);
  const dataStart = entry.localHeaderOffset + 30 + nameLen + extraLen;
  const raw = await sliceBytes(blob, dataStart, dataStart + entry.compressedSize);

  if (entry.method === 0) {
    return raw;
  }
  if (entry.method !== 8) {
    throw new ZipFormatError(`unsupported compression method ${entry.method} for ${entry.path}`);
  }
  return inflateRaw(raw, entry.uncompressedSize);
}
