// Tests de l'ingestion en flux (PANO-91). Verrouille : (1) le repli produit une Watch History
// dates-only (Link/Title retirés) ; (2) les petites sections restent validées par le contrat (trust
// boundary intacte) ; (3) les échecs sont gracieux (union discriminée), jamais des exceptions.
//
// Ici on prouve la CORRECTION fonctionnelle du flux, pas sa tenue en mémoire : vitest ne propage pas
// de cap heap fiable au worker (cf. cartouche de `scale.test.ts`), donc un canari mémoire chiffré
// demanderait un banc node séparé — il n'en existe plus dans le dépôt.

import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import type { WatchHistoryItem } from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import { ingestExportStreaming } from './ingest-stream';

/** Zippe un export JSON sous le nom d'entrée attendu par le décompresseur. */
function zipExport(exportObj: unknown): Uint8Array {
  return zipSync({ 'user_data_tiktok.json': strToU8(JSON.stringify(exportObj)) });
}

/** Fixture avec Watch History peuplée (items complets Date/Link/Title, pour prouver la projection). */
function exportWithWatchHistory(items: readonly WatchHistoryItem[]) {
  const exp = validTikTokExport();
  (exp['Your Activity']['Watch History'] as { VideoList: readonly WatchHistoryItem[] }).VideoList =
    items;
  return exp;
}

describe('ingestExportStreaming — repli Watch History dates-only', () => {
  it('projette chaque item de visionnage sur {Date}, sans Link/Title', () => {
    const res = ingestExportStreaming(
      zipExport(
        exportWithWatchHistory([
          { Date: '2024-01-15 00:30:00', Link: 'https://x/1/', Title: 'titre 1' },
          { Date: '2024-06-15 12:30:00', Link: 'https://x/2/', Title: '' },
        ]),
      ),
    );

    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const videoList = res.normalized['Your Activity']['Watch History'].VideoList;
    expect(videoList).toHaveLength(2);
    expect(Object.keys(videoList[0] as object)).toEqual(['Date']); // Link/Title retirés
    expect(videoList[0]?.Date).toBe('2024-01-15 00:30:00');
    expect(videoList[1]?.Date).toBe('2024-06-15 12:30:00');
  });

  it('Watch History vide (VideoList: []) → liste vide, pas d’échec', () => {
    const res = ingestExportStreaming(zipExport(validTikTokExport()));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.normalized['Your Activity']['Watch History'].VideoList).toEqual([]);
  });

  it('coalesce les sections nullable comme la voie A (null → [])', () => {
    const exp = validTikTokExport();
    (exp.Comment.Comments as { CommentsList: null }).CommentsList = null;
    const res = ingestExportStreaming(zipExport(exp));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.normalized.Comment.Comments.CommentsList).toEqual([]);
  });
});

describe('ingestExportStreaming — trust boundary & échecs gracieux', () => {
  it('JSON malformé → { ok:false, stage:"parse", error:"invalid_json" }', () => {
    const zip = zipSync({ 'user_data_tiktok.json': strToU8('{"Comment": {') });
    const res = ingestExportStreaming(zip);
    expect(res).toEqual({ ok: false, stage: 'parse', error: 'invalid_json' });
  });

  it('Date de visionnage non-string → échec validate (le tableau replié reste validé)', () => {
    const exp = validTikTokExport();
    (exp['Your Activity']['Watch History'] as { VideoList: unknown }).VideoList = [
      { Date: 12345, Link: 'x', Title: '' }, // Date numérique → viole le contrat
    ];
    const res = ingestExportStreaming(zipExport(exp));
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.stage).toBe('validate');
  });

  it('section requise absente → échec validate', () => {
    // On fabrique ici une entrée que le contrat INTERDIT (section requise retirée), pour vérifier que
    // la validation la refuse. `TikTokExport` la décrit en lecture seule et sans signature d'index :
    // le passage par `unknown` est le seul cast que TS accepte, et il dit bien ce qu'on fait —
    // sortir du type exprès, le temps de casser la donnée.
    const exp = validTikTokExport() as unknown as Record<string, unknown>;
    delete exp.Comment;
    const res = ingestExportStreaming(zipExport(exp));
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.stage).toBe('validate');
  });

  it('zip invalide → { ok:false, stage:"parse", error:"invalid_zip" }', () => {
    const res = ingestExportStreaming(new Uint8Array([1, 2, 3, 4]));
    expect(res).toEqual({ ok: false, stage: 'parse', error: 'invalid_zip' });
  });

  it('entrée JSON absente du zip → parse/json_entry_not_found', () => {
    const zip = zipSync({ 'autre.json': strToU8('{}') });
    const res = ingestExportStreaming(zip);
    expect(res).toEqual({ ok: false, stage: 'parse', error: 'json_entry_not_found' });
  });

  it('au-delà du cap taille (option basse) → { ok:false, stage:"too_large" }', () => {
    const res = ingestExportStreaming(zipExport(validTikTokExport()), { sizeLimitBytes: 10 });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.stage).toBe('too_large');
  });
});
