// Main-thread client of the extraction worker (PANO-45) — same idiom as `lib/engine-client.ts`:
// instantiates a throwaway worker, TRANSFERS the bytes to it (zero-copy), resolves with the item list.

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

    // Zero-copy transfer only if the view owns its whole buffer (same guard as engine-client).
    const buffer = zipBytes.buffer;
    const ownsFullBuffer =
      buffer instanceof ArrayBuffer &&
      zipBytes.byteOffset === 0 &&
      zipBytes.byteLength === buffer.byteLength;
    worker.postMessage(zipBytes, ownsFullBuffer ? [buffer] : []);
  });
}
