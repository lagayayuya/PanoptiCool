import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { processExport } from './pipeline';
import { validTikTokExport } from './valid-export.fixture';

/** In-memory `.zip` containing `user_data_tiktok.json` = serialized `json`. */
function zipOf(json: unknown): Uint8Array {
  return zipSync({ 'user_data_tiktok.json': strToU8(JSON.stringify(json)) });
}

describe('processExport', () => {
  // Refonte A: no more `schemaVersion` (the render golden catches drift better than a version field)
  // nor `assertInsight` (a dev-only net on a union the type now holds on its own). What stays
  // checkable HERE is the SHAPE, not a count: the REQUIRED fields of `Analysis` are always there,
  // even when the minimal fixture produces neither theme nor signal.
  it('valid export → ok, Analysis of stable shape (required fields present, even if empty)', () => {
    const res = processExport(zipOf(validTikTokExport()));
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(Array.isArray(res.output.themes)).toBe(true);
      expect(Array.isArray(res.output.signals)).toBe(true);
      expect(res.output.volumes).toBeDefined();
    }
  });

  it('unreadable archive → stage parse (invalid_zip)', () => {
    const res = processExport(new Uint8Array([1, 2, 3, 4, 5]));
    expect(res.ok).toBe(false);
    if (!res.ok && res.stage === 'parse') {
      expect(res.error).toBe('invalid_zip');
    } else {
      expect.unreachable('attendu stage parse');
    }
  });

  it('valid but out-of-contract JSON → stage validate, non-empty issues', () => {
    const res = processExport(zipOf({ not: 'a tiktok export' }));
    expect(res.ok).toBe(false);
    if (!res.ok && res.stage === 'validate') {
      expect(res.issues.length).toBeGreaterThan(0);
    } else {
      expect.unreachable('attendu stage validate');
    }
  });

  it('above the threshold → distinct stage too_large (not flattened under parse)', () => {
    const res = processExport(zipOf(validTikTokExport()), { sizeLimitBytes: 10 });
    expect(res.ok).toBe(false);
    if (!res.ok && res.stage === 'too_large') {
      expect(res.limit).toBe(10);
      expect(res.originalSize).toBeGreaterThan(10);
    } else {
      expect.unreachable('attendu stage too_large');
    }
  });

  it('non-too_large parse error → specific code preserved by the mapping', () => {
    const json = strToU8(JSON.stringify(validTikTokExport()));
    const ambiguous = zipSync({
      'a/user_data_tiktok.json': json,
      'b/user_data_tiktok.json': json,
    });
    const res = processExport(ambiguous);
    expect(res.ok).toBe(false);
    if (!res.ok && res.stage === 'parse') {
      expect(res.error).toBe('ambiguous_json_entry');
    } else {
      expect.unreachable('attendu stage parse / ambiguous_json_entry');
    }
  });
});
