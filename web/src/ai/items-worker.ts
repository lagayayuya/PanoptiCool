// Worker d'extraction des items IA (PANO-45). Reçoit les octets du `.zip`, rend la liste des
// commentaires + recherches. Séparé du worker moteur (`engine/worker.ts`) et sans effet sur lui : le
// moteur garde son contrat (`EngineResult` réduit, ADR-0002) ; ce worker-ci est la voie dédiée aux
// textes bruts dont l'analyse IA a besoin (voir `items.ts`).
//
// Pourquoi un worker et pas le fil principal : l'ingestion d'un vrai export décompresse et tokenise un
// JSON de plusieurs dizaines de Mo — le faire sur le fil principal gèlerait la page pendant le rendu
// des constats. Aucun DOM ici, comme le worker moteur.

import { ingestExportStreaming } from '../engine/ingest/ingest-stream';
import { type AiItem, extractAiItems } from './items';

export type AiItemsResult = { ok: true; items: AiItem[] } | { ok: false; error: string };

addEventListener('message', (event: MessageEvent<Uint8Array>): void => {
  const ingested = ingestExportStreaming(event.data);
  const result: AiItemsResult = ingested.ok
    ? { ok: true, items: extractAiItems(ingested.normalized) }
    : { ok: false, error: `ingestion impossible (${ingested.stage})` };
  postMessage(result);
});
