// Client main-thread du moteur (PANO-27). Côté coquille (DOM permis, hors `engine/`) : instancie
// le Worker, lui transfère l'entrée, résout avec le `EngineResult` réduit. L'îlot `client:only`
// (PANO-13/14) importera cette fonction ; ce module ne monte aucune UI.
//
// L'entrée (zip) est TRANSFÉRÉE (zéro-copie) ; seul le résultat réduit revient (structured-clone),
// jamais le graphe parsé (ADR-0002). Worker jetable : un par analyse en v1.

import type { EngineResult } from '../engine/pipeline';

/** Analyse un export `.zip` dans un Web Worker dédié et résout avec son `EngineResult`. */
export function analyzeExport(zipBytes: Uint8Array): Promise<EngineResult> {
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

    // Transfert zéro-copie SEULEMENT si la vue possède tout son buffer sous-jacent. Sinon (sous-vue
    // d'un buffer plus grand, ou SharedArrayBuffer) on copie : transférer détacherait de la mémoire
    // que l'appelant tient peut-être encore via une autre vue.
    const buffer = zipBytes.buffer;
    const ownsFullBuffer =
      buffer instanceof ArrayBuffer &&
      zipBytes.byteOffset === 0 &&
      zipBytes.byteLength === buffer.byteLength;
    worker.postMessage(zipBytes, ownsFullBuffer ? [buffer] : []);
  });
}
