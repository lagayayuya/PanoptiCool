import { describe, expect, it, vi } from 'vitest';
import { validTikTokExport } from './valid-export.fixture';
import { collectUnknownKeyPaths, validateTikTokExport } from './validate';

/** Utility cast to mutate an `unknown` input in the tests, without `any`. */
function obj(x: unknown): Record<string, unknown> {
  return x as Record<string, unknown>;
}

describe('validateTikTokExport', () => {
  it('valid export (empty encodings) → ok', () => {
    const res = validateTikTokExport(validTikTokExport());
    expect(res.ok).toBe(true);
    if (res.ok) expect(Object.keys(res.data)).toHaveLength(10);
  });

  it('well-formed populated section → ok', () => {
    const data = validTikTokExport();
    obj(obj(data).Comment).Comments = {
      App: 1,
      CommentsList: [
        {
          date: '2026-05-14 21:03:11 UTC',
          comment: 'x',
          photo: '',
          video: '',
          sticker: '',
          originalPostUrl: '',
          'original post link': '',
        },
      ],
    };
    expect(validateTikTokExport(data).ok).toBe(true);
  });

  it('absent top-level key → failure reported (empty ≠ absent)', () => {
    const { Comment: _omit, ...rest } = validTikTokExport();
    const res = validateTikTokExport(rest);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.issues.some((i) => i.path === 'Comment')).toBe(true);
  });

  it('absent nested key → failure reported at the right path', () => {
    const data = validTikTokExport();
    const profileMap = obj(obj(obj(obj(data)['Profile And Settings'])['Profile Info']).ProfileMap);
    delete profileMap.userName;
    const res = validateTikTokExport(data);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.issues.some((i) => i.path.endsWith('ProfileMap.userName'))).toBe(true);
  });

  it('out-of-contract key → tolerant validation (ok) but the key is traceable', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const data = validTikTokExport();
    obj(data).BrandNewSectionFromTikTok = { foo: 1 };
    const res = validateTikTokExport(data);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(collectUnknownKeyPaths(data, res.data)).toContain('BrandNewSectionFromTikTok');
    }
    warn.mockRestore();
  });

  it('PII-safe issues: { path, expected } only, never the received value', () => {
    const data = validTikTokExport();
    obj(obj(data).Comment).Comments = { App: 'pii-sentinel@example.com', CommentsList: [] };
    const res = validateTikTokExport(data);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(JSON.stringify(res.issues)).not.toContain('pii-sentinel@example.com');
      for (const issue of res.issues) {
        expect(Object.keys(issue).sort()).toEqual(['expected', 'path']);
      }
      expect(res.issues.some((i) => i.path.endsWith('Comments.App'))).toBe(true);
    }
  });
});

describe('collectUnknownKeyPaths', () => {
  it('spots the extra, nested keys, by path', () => {
    expect(
      collectUnknownKeyPaths({ a: 1, b: 2, c: { d: 3, e: 4 } }, { a: 1, c: { d: 3 } }),
    ).toEqual(['b', 'c.e']);
  });

  it('nothing extra → []', () => {
    expect(collectUnknownKeyPaths({ a: 1 }, { a: 1 })).toEqual([]);
  });
});
