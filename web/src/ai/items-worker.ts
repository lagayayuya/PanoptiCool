// AI items extraction worker (PANO-45). Receives the `.zip` bytes, returns the list of
// comments + searches. Separate from the engine worker (`engine/worker.ts`) and with no effect on
// it: the engine keeps its contract (reduced `EngineResult`, ADR-0002); this worker is the path
// dedicated to the raw texts the AI analysis needs (see `items.ts`).
//
// Why a worker and not the main thread: ingesting a real export decompresses and tokenizes a
// JSON of several tens of MB — doing it on the main thread would freeze the page during the
// rendering of the findings. No DOM here, like the engine worker.

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
