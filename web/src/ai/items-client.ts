// Client fil-principal du worker d'extraction (PANO-45) — même idiome que `lib/engine-client.ts` :
// instancie un worker jetable, lui TRANSFÈRE les octets (zéro-copie), résout avec la liste d'items.

import type { AiItemsResult } from './items-worker';

export function extractAiItemsInWorker(zipBytes: Uint8Array): Promise<AiItemsResult> {
  const worker = new Worker(new URL('./items-worker.ts', import.meta.url), { type: 'module' });

  return new Promise<AiItemsResult>((resolve) => {
    worker.onmessage = (event: MessageEvent<AiItemsResult>): void => {
      resolve(event.data);
      worker.terminate();
    };
    worker.onerror = (event: ErrorEvent): void => {
      resolve({ ok: false, error: event.message || 'worker error' });
      worker.terminate();
    };

    // Transfert zéro-copie seulement si la vue possède tout son buffer (même garde qu'engine-client).
    const buffer = zipBytes.buffer;
    const ownsFullBuffer =
      buffer instanceof ArrayBuffer &&
      zipBytes.byteOffset === 0 &&
      zipBytes.byteLength === buffer.byteLength;
    worker.postMessage(zipBytes, ownsFullBuffer ? [buffer] : []);
  });
}
