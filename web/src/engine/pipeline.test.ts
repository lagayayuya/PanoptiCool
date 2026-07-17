import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { processExport } from './pipeline';
import { validTikTokExport } from './valid-export.fixture';

/** `.zip` en mémoire contenant `user_data_tiktok.json` = `json` sérialisé. */
function zipOf(json: unknown): Uint8Array {
  return zipSync({ 'user_data_tiktok.json': strToU8(JSON.stringify(json)) });
}

describe('processExport', () => {
  // Refonte A : plus de `schemaVersion` (le golden de rendu attrape la dérive mieux qu'un champ de
  // version) ni d'`assertInsight` (filet dev-only sur une union que le type tient désormais seul).
  // Ce qui reste vérifiable ICI est la FORME, pas un compte : les champs REQUIS d'`Analysis` sont
  // toujours là, même quand la fixture minimale ne produit ni thème ni signal.
  it('export valide → ok, Analysis de forme stable (champs requis présents, même vides)', () => {
    const res = processExport(zipOf(validTikTokExport()));
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(Array.isArray(res.output.themes)).toBe(true);
      expect(Array.isArray(res.output.signals)).toBe(true);
      expect(res.output.volumes).toBeDefined();
    }
  });

  it('archive illisible → stage parse (invalid_zip)', () => {
    const res = processExport(new Uint8Array([1, 2, 3, 4, 5]));
    expect(res.ok).toBe(false);
    if (!res.ok && res.stage === 'parse') {
      expect(res.error).toBe('invalid_zip');
    } else {
      expect.unreachable('attendu stage parse');
    }
  });

  it('JSON valide mais hors-contrat → stage validate, issues non vides', () => {
    const res = processExport(zipOf({ not: 'a tiktok export' }));
    expect(res.ok).toBe(false);
    if (!res.ok && res.stage === 'validate') {
      expect(res.issues.length).toBeGreaterThan(0);
    } else {
      expect.unreachable('attendu stage validate');
    }
  });

  it('au-dessus du seuil → stage too_large distinct (pas aplati sous parse)', () => {
    const res = processExport(zipOf(validTikTokExport()), { sizeLimitBytes: 10 });
    expect(res.ok).toBe(false);
    if (!res.ok && res.stage === 'too_large') {
      expect(res.limit).toBe(10);
      expect(res.originalSize).toBeGreaterThan(10);
    } else {
      expect.unreachable('attendu stage too_large');
    }
  });

  it('erreur parse non-too_large → code spécifique préservé par le mapping', () => {
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
