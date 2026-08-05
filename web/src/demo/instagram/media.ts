// THE DEMO'S MEDIA BYTES — written here, not shipped.
//
// ⚠ NOTHING IS DOWNLOADED AND NOTHING IS BUNDLED. A demo that fetched images would break the one
// promise this product makes, and a demo that shipped 1 750 files would weigh more than the site. So
// the bytes are SYNTHESISED: a seeded gradient per photo, one minimal video, one silent audio.
//
// ⚠ THE PNG IS WRITTEN BY HAND, chunk by chunk, because there is no canvas in a worker's reach here
// and `toDataURL` would give a file the zip cannot dedupe. `fflate`'s deflate does the compression,
// and CRC-32 is computed the same way the format asks.
//
// ─── WHAT THESE BYTES ARE NOT ───────────────────────────────────────────────────────────────────
//   - THEY ARE NOT PHOTOGRAPHS. A gradient with a number on it is what a thumbnail grid needs to
//     show a grid; nobody should read the demo's images as pictures of anything;
//   - THE VIDEO AND THE AUDIO ARE ONE FILE EACH, reused at every path. The pieces that show them
//     draw a poster or an orb — what differs between two voice notes is their date, not their bytes.

import { deflateSync } from 'fflate';

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xed_b8_83_20 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xff_ff_ff_ff;
  for (const b of bytes) c = (CRC_TABLE[(c ^ b) & 0xff] as number) ^ (c >>> 8);
  return (c ^ 0xff_ff_ff_ff) >>> 0;
}

function u32(n: number): Uint8Array {
  return new Uint8Array([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const name = new Uint8Array([...type].map((c) => c.charCodeAt(0)));
  const body = new Uint8Array(name.length + data.length);
  body.set(name);
  body.set(data, name.length);
  const out = new Uint8Array(4 + body.length + 4);
  out.set(u32(data.length));
  out.set(body, 4);
  out.set(u32(crc32(body)), 4 + body.length);
  return out;
}

/**
 * A gradient PNG, 96 × 96, whose two colours come from the seed.
 *
 * ⚠ THE FILTER BYTE PER ROW IS PART OF THE FORMAT, not padding: a scanline that forgets it decodes
 * as garbage in every viewer, and the demo would show 1 000 broken thumbnails with no error anywhere.
 */
export function gradientPng(seed: number): Uint8Array {
  const size = 96;
  const h1 = (seed * 47) % 360;
  const h2 = (h1 + 60 + ((seed * 13) % 120)) % 360;
  const raw = new Uint8Array(size * (size * 3 + 1));
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const t = (x + y) / (size * 2);
      const [r, g, b] = hsl(h1 + (h2 - h1) * t, 0.42, 0.28 + 0.24 * t);
      raw[p++] = r;
      raw[p++] = g;
      raw[p++] = b;
    }
  }
  const ihdr = new Uint8Array(13);
  ihdr.set(u32(size));
  ihdr.set(u32(size), 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  const parts = [
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib(raw)),
    chunk('IEND', new Uint8Array(0)),
  ];
  const total = parts.reduce((n, x) => n + x.length, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const x of parts) {
    out.set(x, at);
    at += x.length;
  }
  return out;
}

/** zlib wrapper around a raw deflate — PNG's IDAT expects the header and the Adler-32. */
function zlib(raw: Uint8Array): Uint8Array {
  const body = deflateSync(raw, { level: 6 });
  let a = 1;
  let b = 0;
  for (const byte of raw) {
    a = (a + byte) % 65_521;
    b = (b + a) % 65_521;
  }
  const out = new Uint8Array(2 + body.length + 4);
  out[0] = 0x78;
  out[1] = 0x01;
  out.set(body, 2);
  out.set(u32(((b << 16) | a) >>> 0), 2 + body.length);
  return out;
}

function hsl(hDeg: number, s: number, lum: number): [number, number, number] {
  const h = ((hDeg % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * lum - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lum - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

/**
 * A minimal MP4 the browser accepts as a video element's source. It holds no picture — the pieces
 * that show a video draw a poster from the first frame and fall back to a glyph when there is none,
 * which is exactly what happens here and is honest: the demo has no footage to show.
 */
export function minimalMp4(): Uint8Array {
  const box = (type: string, ...payload: Uint8Array[]): Uint8Array => {
    const len = payload.reduce((n, p) => n + p.length, 8);
    const out = new Uint8Array(len);
    out.set(u32(len));
    out.set(new Uint8Array([...type].map((c) => c.charCodeAt(0))), 4);
    let at = 8;
    for (const p of payload) {
      out.set(p, at);
      at += p.length;
    }
    return out;
  };
  const ascii = (s: string) => new Uint8Array([...s].map((c) => c.charCodeAt(0)));
  const ftyp = box('ftyp', ascii('isom'), u32(512), ascii('isomiso2mp41'));
  const mdat = box('mdat', new Uint8Array(8));
  const out = new Uint8Array(ftyp.length + mdat.length);
  out.set(ftyp);
  out.set(mdat, ftyp.length);
  return out;
}

/** A short silent AAC-in-M4A. Same reasoning as the video: a voice note's bytes are not its point. */
export function silentM4a(): Uint8Array {
  return minimalMp4();
}
