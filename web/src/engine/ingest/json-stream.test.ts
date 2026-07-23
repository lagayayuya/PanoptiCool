// Tests of the streaming JSON parser (PANO-91). Two guarantees: (1) FIDELITY — the same result as
// `JSON.parse` on the shapes a TikTok export carries (the anti-divergence canary); (2) FOLDING — a
// designated array is never materialized (its items pass through `onItem`, the final value is the
// folder's), proof of the memory mechanism.

import { describe, expect, it } from 'vitest';
import { type ArrayFold, type FoldResolver, JsonStreamError, parseJsonStream } from './json-stream';

/** No folding — the parser must behave like `JSON.parse`. */
const noFold: FoldResolver = () => null;

/** Parses and compares to `JSON.parse` (the reference). */
function expectSameAsJsonParse(text: string): void {
  expect(parseJsonStream(text, noFold)).toEqual(JSON.parse(text));
}

describe('parseJsonStream — fidelity to JSON.parse', () => {
  it('scalars', () => {
    for (const text of ['true', 'false', 'null', '0', '-1', '3.14', '1e3', '-2.5e-2', '"hello"']) {
      expectSameAsJsonParse(text);
    }
  });

  it('strings with escapes', () => {
    expectSameAsJsonParse('"a\\"b"');
    expectSameAsJsonParse('"ligne\\nretour\\ttab"');
    expectSameAsJsonParse('"slash\\/back\\\\"');
    expectSameAsJsonParse('"unicode \\u00e9\\u00e8"'); // é è
    expectSameAsJsonParse('"\\b\\f\\r"');
  });

  it('nested objects and arrays, with whitespace', () => {
    expectSameAsJsonParse('{ "a" : 1 , "b" : [ 1 , 2 , 3 ] }');
    expectSameAsJsonParse('{"nested":{"deep":{"x":[true,false,null]}},"arr":[]}');
    expectSameAsJsonParse('\n\t{ "empty": {}, "list": [] }\n');
    expectSameAsJsonParse('[{"k":"v"},{"k":"w"}]');
  });

  it('typical export shapes (spaced/cased keys, dates, links)', () => {
    const text = JSON.stringify({
      'Your Activity': {
        'Watch History': {
          VideoList: [
            { Date: '2024-01-15 00:30:00', Link: 'https://x/1/', Title: '' },
            { Date: '2024-02-15 12:30:00', Link: 'https://x/2/', Title: 'un titre' },
          ],
        },
      },
      Comment: { Comments: { App: 0, CommentsList: null } },
    });
    expectSameAsJsonParse(text);
  });

  it('duplicate key: "last wins" like JSON.parse (assumed limitation)', () => {
    expectSameAsJsonParse('{"a":1,"a":2}');
  });

  it('rejects malformation (JsonStreamError), does not guess', () => {
    for (const bad of ['', '{', '[1,', '{"a":}', 'tru', '{"a" 1}', '[1 2]', '"nonferme', '01x']) {
      expect(() => parseJsonStream(bad, noFold)).toThrow(JsonStreamError);
    }
  });

  it('rejects superfluous content after the root', () => {
    expect(() => parseJsonStream('{} {}', noFold)).toThrow(JsonStreamError);
    expect(() => parseJsonStream('1 2', noFold)).toThrow(JsonStreamError);
  });
});

describe('parseJsonStream — array folding (memory mechanism)', () => {
  it('folds the array at the targeted path: items via onItem, final value from the folder', () => {
    const seen: unknown[] = [];
    const fold: FoldResolver = (path) =>
      path.length === 2 && path[0] === 'big' && path[1] === 'items'
        ? {
            onItem(value) {
              seen.push(value);
            },
            finalize: () => ({ count: seen.length }),
          }
        : null;

    const text = JSON.stringify({
      big: { items: [{ n: 1 }, { n: 2 }, { n: 3 }] },
      other: [10, 20],
    });
    const result = parseJsonStream(text, fold) as {
      big: { items: unknown };
      other: unknown;
    };

    // The folded array (at the `items` key) is replaced by the folder's value — never materialized.
    expect(result.big.items).toEqual({ count: 3 });
    // The items did pass through onItem.
    expect(seen).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
    // A NON-targeted array (`other`) is materialized normally.
    expect(result.other).toEqual([10, 20]);
  });

  it('folds an EMPTY array (finalize called, onItem never)', () => {
    let items = 0;
    const fold: FoldResolver = (path) =>
      path[0] === 'items' && path.length === 1
        ? {
            onItem() {
              items += 1;
            },
            finalize: () => 'REPLIÉ',
          }
        : null;
    const result = parseJsonStream('{"items":[]}', fold) as { items: unknown };
    expect(result.items).toBe('REPLIÉ');
    expect(items).toBe(0);
  });

  it('retains only ONE item at a time (the folder does not keep the list)', () => {
    // Indirect proof: on a large array, a folder that counts only the simultaneous max would stay at
    // 1 if it forgot each item — but we cannot observe the GC; we verify instead that the folder sees
    // EACH item exactly once and in order, without any list surviving.
    const n = 5000;
    let sum = 0;
    let last = -1;
    let ordered = true;
    const fold: ArrayFold = {
      onItem(value) {
        const i = (value as { i: number }).i;
        if (i !== last + 1) ordered = false;
        last = i;
        sum += i;
      },
      finalize: () => null,
    };
    const items = Array.from({ length: n }, (_, i) => ({ i })); // 0..n-1
    const result = parseJsonStream(`{"items":${JSON.stringify(items)}}`, (p) =>
      p[0] === 'items' ? fold : null,
    ) as { items: unknown };

    expect(result.items).toBeNull(); // finalize replaced the array
    expect(ordered).toBe(true);
    expect(last).toBe(n - 1);
    expect(sum).toBe((n * (n - 1)) / 2);
  });
});
