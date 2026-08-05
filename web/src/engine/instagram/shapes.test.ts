// THE TWO DIALECTS, AND THE NESTING THAT COST 199 CITIES.
//
// Every fixture below is a hand-written SHAPE — the key names and encodings from
// `docs/instagram-export-schema.md`, with invented values. No fragment of a real export.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - IT READS NO FILE. It exercises the shape helpers on literals; that the extractors call them
//     on the right paths is asserted where the extractors live;
//   - IT DOES NOT PROVE THE CONTRACT IS RIGHT. If a third dialect exists in an export nobody has
//     opened, these helpers return empty for it and this file stays green;
//   - NO PERFORMANCE CLAIM. `toList` on a 8 000-item array is not measured here.

import { describe, expect, it } from 'vitest';
import {
  hrefOf,
  itemTimestampSec,
  labelValues,
  nestedValueByLabel,
  stringMap,
  toList,
  valueByLabel,
} from './shapes';

describe('the list, wrapped or not', () => {
  it('reads a top-level array and a single-key wrapper identically', () => {
    expect(toList([{ a: 1 }, { a: 2 }])).toHaveLength(2);
    expect(toList({ relationships_following: [{ a: 1 }] })).toHaveLength(1);
  });

  it('returns [] rather than throwing on everything else', () => {
    // An export is untrusted and half-optional; refusing on the first surprise refuses real
    // accounts. Each of these is a shape a real file has been seen to take.
    for (const input of [null, undefined, 42, 'text', {}, { media: [] }]) {
      expect(toList(input)).toEqual([]);
    }
  });
});

describe('the two dialects', () => {
  const RECENT = {
    timestamp: 1_700_000_000,
    label_values: [
      { label: 'Nom de profil', value: 'synthetic-handle' },
      { label: 'Adresse IP', value: '203.0.113.7', href: 'https://example.invalid/a' },
    ],
  };
  const LEGACY = {
    title: '',
    string_map_data: {
      // As it arrives: the label IS the key, and it is double-encoded.
      'NumÃ©ro de tÃ©lÃ©phone': { value: '+00 000', timestamp: 1_700_000_001 },
    },
  };

  it('recent — a value is found by its label, through the mojibake', () => {
    expect(valueByLabel(RECENT, 'Nom de profil')).toBe('synthetic-handle');
    expect(labelValues(RECENT)).toHaveLength(2);
    expect(hrefOf(RECENT)).toBe('https://example.invalid/a');
  });

  it('legacy — the map is returned with its raw keys, repair left to the comparison', () => {
    // The helper does NOT repair the keys in place: a caller comparing raw would then silently
    // fail, so the repair belongs at the comparison (`labels.isLabel`), where it cannot be skipped.
    expect(Object.keys(stringMap(LEGACY))).toEqual(['NumÃ©ro de tÃ©lÃ©phone']);
    expect(stringMap(RECENT)).toEqual({});
  });

  it('a label that is absent yields undefined, in both dialects', () => {
    expect(valueByLabel(RECENT, 'Genre')).toBeUndefined();
    expect(valueByLabel(LEGACY, 'Genre')).toBeUndefined();
  });
});

describe('⚠ the nesting that a flat walk misses', () => {
  // THE REGRESSION THIS GUARDS. `profile_based_in` puts the declared city one level down, under a
  // `dict`. Reading `label_values` flat returns nothing, and the prototype then substituted a
  // Geo-IP inference for 199 declared cities — a worse answer wearing the same confidence.
  const PROFILE_BASED_IN = {
    media: [],
    label_values: [
      {
        label: 'DÃ©tails',
        dict: [
          { label: 'Lieu', value: 'Ville-Fictive, ZZ' },
          { label: 'Source', value: 'declared' },
        ],
      },
    ],
  };

  it('finds a value under `dict`, where the flat read finds nothing', () => {
    // Both directions in one test, because the pair IS the finding: flat blind, nested sighted.
    expect(valueByLabel(PROFILE_BASED_IN, 'Lieu')).toBeUndefined();
    expect(nestedValueByLabel(PROFILE_BASED_IN, 'Lieu')).toBe('Ville-Fictive, ZZ');
  });

  it('finds it under `vec` too, which is the other spelling of the same idea', () => {
    const withVec = {
      label_values: [{ label: 'Détails', vec: [{ label: 'Lieu', value: 'X, ZZ' }] }],
    };
    expect(nestedValueByLabel(withVec, 'Lieu')).toBe('X, ZZ');
  });

  it('does not descend two levels — the shape is one deep and pretending otherwise would guess', () => {
    const twoDeep = {
      label_values: [
        { label: 'A', dict: [{ label: 'B', dict: [{ label: 'Lieu', value: 'deep' }] }] },
      ],
    };
    expect(nestedValueByLabel(twoDeep, 'Lieu')).toBeUndefined();
  });
});

describe('timestamps', () => {
  it('reads seconds directly and FLOORS milliseconds', () => {
    expect(itemTimestampSec({ timestamp: 1_700_000_000 })).toBe(1_700_000_000);
    // ⚠ Floored, not rounded. `1_700_000_000_999` rounds UP to the next second — and at a month
    // boundary that moves a message into the next month, which is visible on the conversation
    // heatmap and nowhere else.
    expect(itemTimestampSec({ timestamp_ms: 1_700_000_000_999 })).toBe(1_700_000_000);
  });

  it('returns undefined when neither field is there', () => {
    expect(itemTimestampSec({})).toBeUndefined();
    expect(itemTimestampSec(null)).toBeUndefined();
  });
});
