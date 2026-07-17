// Ingestion en FLUX (PANO-91) — la voie B assemblée : décompresse → tokenise en repliant Watch
// History → valide → normalise, SANS jamais matérialiser le graphe des 10⁴–10⁵ items de visionnage.
//
// C'est le fix RÉEL qui supersede le correctif partiel de `normalize.ts` (projection post-`JSON.parse`,
// −36 % mais insuffisant : le pic du `JSON.parse` restait). Ici le graphe géant n'est jamais érigé.
//
// APPROCHE A (intégration commitable) : on replie `Watch History → VideoList` en liste DATES-ONLY
// (`{Date}[]`) — exactement ce que `normalizeExport` projetait, et la seule lecture aval (`.Date`
// rythme, `.length` opacité/absence ; jamais `Link`/`Title`). Zéro refactor des règles
// golden-testées. Les FEATURES du dossier se dérivent ensuite de cette liste via `activity-rhythm`,
// inchangé. La variante « features-only, O(1) »
// (approche B pleine) reste un follow-up : elle ripperait dans 3 règles + le type `NormalizedExport`
// sans changer le verdict crash (dates-only ≈ 9 Mo à 10⁵, une seule copie, loin du pic fatal).
//
// TRUST BOUNDARY PRÉSERVÉE. Seul le TABLEAU de visionnage échappe au `JSON.parse` ; sa validation reste
// faite par valibot via `StreamedExportSchema` (item dates-only `{Date: string}`). Toutes les petites
// sections sont validées par le MÊME contrat que la voie A (schéma réutilisé, DRY). La malformation
// (Date non-string, section absente…) est donc toujours un échec `validate` gracieux, pas un crash.

import * as v from 'valibot';
import { type NormalizableExport, type NormalizedExport, normalizeExport } from '../normalize';
import { decompressJsonEntry, type ParseErrorKind, type ParseOptions } from '../parse';
import { TikTokExportSchema, type ValidationIssue, yourActivityCategory } from '../validate';
import { type ArrayFold, type FoldResolver, JsonStreamError, parseJsonStream } from './json-stream';

/**
 * Garde anti-zip-bomb pour le FLUX — bien au-dessus de tout export réel (10⁵ items ≈ 26 Mo décompressés)
 * mais borne la chaîne décompressée qu'`unzipSync` alloue. Distinct du plafond 25 Mo d'approche A (qui,
 * lui, rejetait de vrais gros exports) : le flux garde l'empreinte bornée quel que soit le volume utile,
 * donc son seul rôle de cap est de refuser une archive pathologique.
 */
export const STREAM_SIZE_LIMIT_BYTES = 512 * 1024 * 1024;

/** Chemin de clés EXACT du tableau replié (les index de tableau n'entrent pas dans le chemin). */
const WATCH_HISTORY_VIDEOLIST_PATH: readonly string[] = [
  'Your Activity',
  'Watch History',
  'VideoList',
];

// --- Schéma « streamed » : le contrat, mais Watch History relâché en dates-only -----------------

/** Item de visionnage vu par le flux : réduit à sa `Date` (le replieur a déjà retiré `Link`/`Title`). */
const streamedWatchHistoryItem = v.object({ Date: v.string() });

/** `Your Activity` avec Watch History dates-only ; tout le reste = le contrat d'origine (`.entries`). */
const streamedYourActivity = v.object({
  ...yourActivityCategory.entries,
  'Watch History': v.object({ VideoList: v.nullable(v.array(streamedWatchHistoryItem)) }),
});

/**
 * Miroir runtime du contrat pour la voie flux : identique à `TikTokExportSchema` SAUF le tableau de
 * visionnage (dates-only). Bâti par spread des `.entries` → aucune duplication du schéma massif ; un
 * ajout de section au contrat se propage ici automatiquement.
 */
export const StreamedExportSchema = v.object({
  ...TikTokExportSchema.entries,
  'Your Activity': streamedYourActivity,
});

// --- Repli de Watch History ---------------------------------------------------------------------

/** Extrait `Date` d'un item de visionnage transitoire, sans le retenir. Non-objet/null → `undefined`
 * (valibot tranchera : `Date: v.string()` échoue → `validate` gracieux, jamais de crash). */
function readDate(value: unknown): unknown {
  return typeof value === 'object' && value !== null
    ? (value as { Date?: unknown }).Date
    : undefined;
}

/** Replieur : accumule `{Date}` par item (transitoire oublié aussitôt), rend la liste dates-only. */
function watchDatesFold(): ArrayFold {
  const dates: { Date: unknown }[] = [];
  return {
    onItem(value) {
      dates.push({ Date: readDate(value) });
    },
    finalize() {
      return dates;
    },
  };
}

/** Replie UNIQUEMENT `Your Activity → Watch History → VideoList` ; tout le reste est matérialisé. */
const resolveWatchHistoryFold: FoldResolver = (path) => {
  if (
    path.length === WATCH_HISTORY_VIDEOLIST_PATH.length &&
    path.every((key, index) => key === WATCH_HISTORY_VIDEOLIST_PATH[index])
  ) {
    return watchDatesFold();
  }
  return null;
};

// --- Résultat & fonction d'ingestion ------------------------------------------------------------

/**
 * Résultat de l'ingestion en flux — union discriminée, plain-data. `parse` couvre décompression ET
 * tokenisation (une malformation JSON y devient `invalid_json`). `too_large` = zip-bomb au-delà du cap.
 */
export type StreamIngestResult =
  | { ok: true; normalized: NormalizedExport; originalSize: number }
  | { ok: false; stage: 'too_large'; originalSize: number; limit: number }
  | { ok: false; stage: 'parse'; error: Exclude<ParseErrorKind, 'export_too_large'> }
  | { ok: false; stage: 'validate'; issues: ValidationIssue[] };

/**
 * Ingère les octets du `.zip` en flux → `NormalizedExport` prêt pour les règles. Ne lève jamais :
 * tout échec attendu est une variante de `StreamIngestResult`. Empreinte : la chaîne décompressée +
 * le graphe des petites sections + la liste dates-only ; JAMAIS le graphe des items de visionnage.
 */
export function ingestExportStreaming(
  zipBytes: Uint8Array,
  options: ParseOptions = {},
): StreamIngestResult {
  const decompressed = decompressJsonEntry(zipBytes, {
    sizeLimitBytes: options.sizeLimitBytes ?? STREAM_SIZE_LIMIT_BYTES,
  });
  if (!decompressed.ok) {
    if (decompressed.error === 'export_too_large') {
      return {
        ok: false,
        stage: 'too_large',
        originalSize: decompressed.originalSize,
        limit: decompressed.limit,
      };
    }
    return { ok: false, stage: 'parse', error: decompressed.error };
  }

  // Tokenisation en flux : `data` est le graphe COMPLET des petites sections, mais `Watch History →
  // VideoList` y est déjà la liste dates-only (repliée à la volée, jamais tenue en entier).
  let data: unknown;
  try {
    data = parseJsonStream(decompressed.text, resolveWatchHistoryFold);
  } catch (error) {
    if (error instanceof JsonStreamError) {
      return { ok: false, stage: 'parse', error: 'invalid_json' };
    }
    throw error; // inattendu : ne pas l'avaler
  }

  // Validation valibot du graphe streamé (petites sections au contrat, visionnage dates-only).
  const validated = v.safeParse(StreamedExportSchema, data);
  if (!validated.success) {
    const issues: ValidationIssue[] = validated.issues.map((issue) => ({
      path: v.getDotPath(issue) ?? '(racine)',
      expected: issue.expected ?? 'unknown',
    }));
    return { ok: false, stage: 'validate', issues };
  }

  // `validated.output` : contrat complet, Watch History dates-only → assignable à `NormalizableExport`.
  const normalized = normalizeExport(validated.output satisfies NormalizableExport);
  return { ok: true, normalized, originalSize: decompressed.originalSize };
}
