import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { parseTikTokExport } from './parse';

/** Construit un `.zip` en mémoire depuis un map `chemin → contenu texte`. */
function zipWith(files: Record<string, string>): Uint8Array {
  const entries: Record<string, Uint8Array> = {};
  for (const [name, content] of Object.entries(files)) entries[name] = strToU8(content);
  return zipSync(entries);
}

describe('parseTikTokExport', () => {
  it('parse un export valide → ok, data (unknown), originalSize', () => {
    const json = '{"Comment":{"Comments":{"App":1,"CommentsList":[]}}}';
    const res = parseTikTokExport(zipWith({ 'user_data_tiktok.json': json }));
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.data).toEqual({ Comment: { Comments: { App: 1, CommentsList: [] } } });
      expect(res.originalSize).toBe(strToU8(json).length);
    }
  });

  it('tolère un préfixe de dossier (localisation par basename)', () => {
    const res = parseTikTokExport(zipWith({ 'TikTok/user_data_tiktok.json': '{"x":1}' }));
    expect(res.ok).toBe(true);
  });

  it('aucune entrée correspondante → json_entry_not_found (pas de fallback .json)', () => {
    const res = parseTikTokExport(zipWith({ 'autre_fichier.json': '{}' }));
    expect(res).toEqual({ ok: false, error: 'json_entry_not_found' });
  });

  it('plusieurs candidats → ambiguous_json_entry (échec bruyant, pas « le premier »)', () => {
    const res = parseTikTokExport(
      zipWith({
        'a/user_data_tiktok.json': '{"x":1}',
        'b/user_data_tiktok.json': '{"x":2}',
      }),
    );
    expect(res.ok).toBe(false);
    if (!res.ok && res.error === 'ambiguous_json_entry') {
      expect(res.candidates).toHaveLength(2);
    } else {
      expect.unreachable('attendu ambiguous_json_entry');
    }
  });

  it('au-dessus du seuil → export_too_large, refus avant décompression', () => {
    const json = `{"big":"${'x'.repeat(1000)}"}`;
    const res = parseTikTokExport(zipWith({ 'user_data_tiktok.json': json }), {
      sizeLimitBytes: 100,
    });
    expect(res.ok).toBe(false);
    if (!res.ok && res.error === 'export_too_large') {
      expect(res.limit).toBe(100);
      expect(res.originalSize).toBeGreaterThan(100);
    } else {
      expect.unreachable('attendu export_too_large');
    }
  });

  it('JSON malformé → invalid_json', () => {
    const res = parseTikTokExport(zipWith({ 'user_data_tiktok.json': '{bad json' }));
    expect(res).toEqual({ ok: false, error: 'invalid_json' });
  });

  it('archive illisible → invalid_zip', () => {
    const res = parseTikTokExport(new Uint8Array([1, 2, 3, 4, 5]));
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe('invalid_zip');
  });
});
