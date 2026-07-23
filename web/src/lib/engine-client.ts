// Main-thread client of the engine (PANO-27). Shell side (DOM allowed, outside `engine/`): instantiates
// the Worker, transfers the input to it, resolves with the reduced `EngineResult`. The `client:only`
// island (PANO-13/14) will import this function; this module mounts no UI.
//
// The input (zip) is TRANSFERRED (zero-copy); only the reduced result comes back (structured-clone),
// never the parsed graph (ADR-0002). Throwaway worker: one per analysis in v1.

import type { EngineResult } from '../engine/pipeline';
import type { Locale } from '../i18n/locales';

/** What crosses the boundary toward the engine worker. The language accompanies the bytes: the engine
 *  emits prose and has no DOM to read `<html lang>` from. */
export interface EngineRequest {
  zipBytes: Uint8Array;
  locale: Locale;
}

/** Analyzes a `.zip` export in a dedicated Web Worker and resolves with its `EngineResult`. */
export function analyzeExport(zipBytes: Uint8Array, locale: Locale): Promise<EngineResult> {
  const worker = new Worker(new URL('../engine/worker.ts', import.meta.url), { type: 'module' });

  return new Promise<EngineResult>((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<EngineResult>): void => {
      resolve(event.data);
      worker.terminate();
    };
    worker.onerror = (event: ErrorEvent): void => {
      reject(new Error(event.message || 'engine worker error'));
      worker.terminate();
    };

    // Zero-copy transfer ONLY if the view owns its whole underlying buffer. Otherwise (a sub-view
    // of a larger buffer, or a SharedArrayBuffer) we copy: transferring would detach memory
    // the caller may still hold via another view.
    const buffer = zipBytes.buffer;
    const ownsFullBuffer =
      buffer instanceof ArrayBuffer &&
      zipBytes.byteOffset === 0 &&
      zipBytes.byteLength === buffer.byteLength;
    const request: EngineRequest = { zipBytes, locale };
    worker.postMessage(request, ownsFullBuffer ? [buffer] : []);
  });
}
