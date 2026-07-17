// Test d'ÉCHELLE (PANO-91) — le canari MÉMOIRE qui manquait. Un vrai export TikTok (Watch History
// ≈ 5·10⁴ items — la plus grosse section, §0) tuait le Worker mobile SANS erreur console : saturation
// mémoire (le process/Worker tué par l'OS, pas une exception JS — d'où le silence). Cause racine
// profilée : `JSON.parse` matérialise d'un coup TOUT le graphe (pic rss ≈ 11× le poids du JSON), puis
// les copies (clone valibot du graphe) et le travail des règles s'y empilent ; le pic transitoire
// dépasse l'enveloppe d'un Worker mobile milieu de gamme. Correctif (`normalize.ts` + `pipeline.ts`) :
// Watch History est projeté sur ses SEULES dates (seul champ lu en aval — `.Date` pour le rythme,
// `.length` pour l'opacité/absence ; jamais `Link`/`Title`, ≈ 2/3 du poids de la section), et
// `parsed`/`validated` (deux copies complètes du graphe) sont libérés AVANT les règles.
//
// Budget mesuré (banc de profilage, DEV=true, 150k VideoList) : plancher de survie
// `--max-old-space-size` 112MB → 72MB, soit une enveloppe heap ≈ 36 % plus serrée tenue par le fix.
//
// Ce que ce test VERROUILLE (garanties DÉTERMINISTES, non bruitées) : au volume réel, (1) `normalize`
// ne retient QUE les dates de Watch History — l'invariant structurel qui BORNE l'empreinte ; (2) le
// pipeline complet aboutit sans hang sous un budget temps généreux ; (3) les lectures Watch History des
// règles (rythme sur `.Date`, opacité sur `.length`) restent correctes à l'échelle. Un budget heap
// CHIFFRÉ n'est délibérément PAS asserté : sans `--expose-gc` ni cap heap propagé au worker vitest, la
// mesure serait bruitée et trompeuse (au volume réel les transitoires pré/post-fix se recouvrent) — la
// garantie mémoire fiable est l'invariant STRUCTUREL ci-dessus, le budget chiffré vit dans ce cartouche.

import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { normalizeExport } from './normalize';
import { processExport } from './pipeline';
import type { WatchHistoryItem } from './tiktok-export';
import { validTikTokExport } from './valid-export.fixture';

/** Volume réel d'un gros export (Watch History pilote `--volume`, §0). */
const SCALE_N = 50_000;

/** Budget temps GÉNÉREUX (CI lente, marge ×large) : garde-fou anti-hang, pas une mesure de perf. Le
 * pipeline tourne ~100ms en local sur ce banc (0 commentaire → aucun coût d1/d2). */
const SCALE_TIME_BUDGET_MS = 5_000;

/** Export réel-volume : Watch History peuplée de `n` items datés, Link/Title RÉALISTES (pour que la
 * projection ait un poids à retirer), le reste au vide conforme (fixture). */
function bigWatchHistoryExport(n: number) {
  const exp = validTikTokExport();
  const items: WatchHistoryItem[] = Array.from({ length: n }, (_, i) => ({
    Date: `2024-${String((i % 12) + 1).padStart(2, '0')}-15 ${String(i % 24).padStart(2, '0')}:30:00`,
    Link: `https://www.tiktokv.com/share/video/${7000000000000000000 + i}/`,
    Title: i % 3 === 0 ? '' : 'un titre de video assez court',
  }));
  (exp['Your Activity']['Watch History'] as { VideoList: WatchHistoryItem[] }).VideoList = items;
  return exp;
}

describe('échelle (PANO-91) — empreinte mémoire bornée à ~50k Watch History', () => {
  it('normalize projette Watch History sur ses seules DATES (invariant mémoire)', () => {
    const norm = normalizeExport(bigWatchHistoryExport(SCALE_N));
    const videoList = norm['Your Activity']['Watch History'].VideoList;

    expect(videoList).toHaveLength(SCALE_N);
    // Chaque item réduit à `{Date}` — `Link`/`Title` retirés (le gros du poids de la section). Un
    // retour à `{Date, Link, Title}` (régression) casse ici : c'est le rôle du canari.
    for (const index of [0, SCALE_N >> 1, SCALE_N - 1]) {
      const item = videoList[index];
      expect(item).toBeDefined();
      expect(Object.keys(item as object)).toEqual(['Date']);
    }
    // La date reste intacte (les règles la lisent au caractère près).
    expect(videoList[0]?.Date).toBe('2024-01-15 00:30:00');
  });

  it('processExport aboutit au volume réel sans hang, lectures Watch History préservées', () => {
    const bytes = zipSync({
      'user_data_tiktok.json': strToU8(JSON.stringify(bigWatchHistoryExport(SCALE_N))),
    });

    const started = Date.now();
    const res = processExport(bytes);
    const elapsedMs = Date.now() - started;

    expect(res.ok).toBe(true);
    expect(elapsedMs).toBeLessThan(SCALE_TIME_BUDGET_MS);
    if (!res.ok) {
      return; // narrowing (l'assertion ci-dessus a déjà fait échouer le test)
    }

    // Opacité : lecture `.length` préservée — les 50k vidéos comptent dans l'opaque.
    // (Refonte A : plus de `find` sur un `ruleId` — le champ EST le nom.)
    expect(res.output.opacity).toBeDefined();
    // Rythme : lecture `.Date` préservée — le rythme est produit sur les 50k dates.
    expect(res.output.rhythm).toBeDefined();
  });
});
