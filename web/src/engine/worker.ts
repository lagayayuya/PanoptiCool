// Adaptateur Web Worker du moteur (PANO-27, ADR-0002).
//
// Reçoit l'entrée (octets du `.zip`, transférée par le client), exécute le pipeline DANS le worker,
// et ne `postMessage` QUE le `EngineResult` réduit — jamais le graphe parsé (qui doublerait la
// mémoire via structured-clone). Globals **WebWorker** (`onmessage`/`postMessage`), AUCUN DOM :
// la frontière moteur PANO-19 tient ici aussi (vérifié par la 2ᵉ passe `tsc` no-DOM).

import { processExport } from './pipeline';

addEventListener('message', (event: MessageEvent<Uint8Array>): void => {
  postMessage(processExport(event.data));
});
