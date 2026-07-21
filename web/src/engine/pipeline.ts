// Pipeline du moteur — orchestration `entrée → parse → validate → règles → EngineOutput`
// (PANO-27, ADR-0002). Fonction **pure**, sans DOM ni Worker : c'est le cœur unit-testable
// (ce que PANO-28 consommera sur `samples/*.zip`). Le Worker (`engine/worker.ts`) n'en est qu'un
// adaptateur ; le moteur reste portable (ADR-0002).
//
// Narrowing (la séparation 24/25/26 rendue concrète, sans cast) :
//   parser → `data: unknown` → SEULE entrée de la validation ;
//   validation `ok:true` → `data: TikTokExport` → SEULE entrée de `computeInsights`.
// Le typecheck l'impose par les signatures ; aucun `as` ne court-circuite la frontière.

import type { Locale } from '../i18n/locales';
import type { Analysis } from './analysis';
import { analyze } from './analyze';
import { ingestExportStreaming } from './ingest/ingest-stream';
import type { NormalizedExport } from './normalize';
import type { ParseErrorKind } from './parse';
import type { ValidationIssue } from './validate';

/**
 * Résultat du moteur — union discriminée, plain-data (structured-clone-safe, ADR-0002). `too_large`
 * est un **refus gracieux distinct** (calme, PANO-25), jamais aplati sous `parse` (corrompu) :
 * l'UI lit `stage` sans rouvrir l'enum. Tous les échecs sont **PII-safe** (parse/validate le sont).
 */
export type EngineResult =
  | { ok: true; output: Analysis }
  | { ok: false; stage: 'too_large'; originalSize: number; limit: number }
  | { ok: false; stage: 'parse'; error: Exclude<ParseErrorKind, 'export_too_large'> }
  | { ok: false; stage: 'validate'; issues: ValidationIssue[] };

export interface ProcessOptions {
  /** Seuil de refus (octets décompressés), transmis au parser. Défaut = constante PANO-25. */
  sizeLimitBytes?: number;
  /** Horloge pour les fenêtres glissantes du rythme (`analyze`). Défaut = `Date.now()` réel ; les
   *  tests et la démo la fixent pour que les fenêtres glissantes retombent sur la même horloge que
   *  celle qui a construit l'export. */
  now?: number;
  /** Langue de la PROSE émise par le moteur (`Analysis` porte du texte depuis ADR-0004). Défaut =
   *  `DEFAULT_LOCALE`. Elle entre PAR LES OPTIONS et non par un paramètre positionnel pour que les
   *  ~18 sites d'appel existants — tests, goldens, démo — restent inchangés et continuent de rendre
   *  du français : le lot anglais AJOUTE une langue, il n'en déplace aucune. */
  locale?: Locale;
}

/**
 * Résultat de la phase d'ingestion (décompresse → tokenise en flux → valide → normalise). Union
 * discriminée : soit le `NormalizedExport` prêt pour les règles, soit un `EngineResult` d'échec déjà
 * formé. Depuis PANO-91, l'ingestion passe par le FLUX (`ingest/ingest-stream.ts`) : le graphe des
 * 10⁴–10⁵ items de visionnage n'est JAMAIS matérialisé (`Watch History` est replié en dates-only à la
 * volée). Fini le double pic `JSON.parse` + clone valibot du graphe entier — seule survit la liste
 * dates-only, portée par `normalized`. Le confinement en fonction reste utile : la chaîne décompressée
 * et le graphe des petites sections deviennent collectables au `return`, avant les règles.
 */
type IngestResult =
  | { ok: true; normalized: NormalizedExport }
  | { ok: false; result: EngineResult };

function ingest(zipBytes: Uint8Array, options: ProcessOptions): IngestResult {
  const ingested = ingestExportStreaming(zipBytes, options);
  if (ingested.ok) {
    return { ok: true, normalized: ingested.normalized };
  }
  if (ingested.stage === 'too_large') {
    return {
      ok: false,
      result: {
        ok: false,
        stage: 'too_large',
        originalSize: ingested.originalSize,
        limit: ingested.limit,
      },
    };
  }
  if (ingested.stage === 'parse') {
    return { ok: false, result: { ok: false, stage: 'parse', error: ingested.error } };
  }
  return { ok: false, result: { ok: false, stage: 'validate', issues: ingested.issues } };
}

/**
 * Exécute le pipeline complet sur les octets du `.zip`. Ne lève jamais : tout échec attendu est une
 * variante de `EngineResult`. Destiné à tourner DANS le Worker (mais pur, donc testable en node).
 */
export function processExport(zipBytes: Uint8Array, options: ProcessOptions = {}): EngineResult {
  // Ingestion en flux (PANO-91) : le graphe des items de visionnage n'est jamais matérialisé (replié
  // en dates-only) ; la chaîne décompressée et le graphe des petites sections sont libérés au retour
  // d'`ingest`, avant l'analyse. Seul `normalized` (dates-only) survit.
  //
  // La borne mémoire d'ADR-0003 (seul le texte CITÉ franchit la frontière moteur→UI, jamais le
  // graphe parsé) tient toujours, et désormais par CONSTRUCTION : sans magasin à remplir, une miette
  // n'existe que portée par le constat qui la cite (`Analysis` → `Deduction.evidence`).
  const ingested = ingest(zipBytes, options);
  if (!ingested.ok) {
    return ingested.result;
  }
  // Le pipeline n'héberge aucune logique métier : il orchestre, `analyze` compose (lot A1).
  return { ok: true, output: analyze(ingested.normalized, options.now, options.locale) };
}
