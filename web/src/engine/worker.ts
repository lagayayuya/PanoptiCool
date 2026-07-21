// Adaptateur Web Worker du moteur (PANO-27, ADR-0002).
//
// Reçoit l'entrée (octets du `.zip`, transférée par le client) ET LA LANGUE, exécute le pipeline
// DANS le worker, et ne `postMessage` QUE le `EngineResult` réduit — jamais le graphe parsé (qui
// doublerait la mémoire via structured-clone). Globals **WebWorker** (`onmessage`/`postMessage`),
// AUCUN DOM : la frontière moteur PANO-19 tient ici aussi (vérifié par la 2ᵉ passe `tsc` no-DOM).
//
// POURQUOI LA LANGUE TRAVERSE LE MESSAGE. Le moteur émet de la PROSE (`Analysis` porte `claim` et
// `label`, ADR-0004) et n'a pas de `document` où lire `<html lang>` — c'est justement ce qui le
// rend pur. La langue est donc une DONNÉE D'ENTRÉE, au même titre que les octets : c'est l'UI qui
// la connaît, le worker ne la devine pas.
//
// ⚠ LE TYPE NE SURVIT PAS À `postMessage` (structured-clone ne porte pas `Locale`). Une langue
// inconnue n'est donc pas impossible ici, seulement improbable ; `wording.ts` retombe sur le
// français plutôt que de planter. Ne pas s'en remettre au type seul.

import type { EngineRequest } from '../lib/engine-client';
import { processExport } from './pipeline';

addEventListener('message', (event: MessageEvent<EngineRequest>): void => {
  const { zipBytes, locale } = event.data;
  postMessage(processExport(zipBytes, { locale }));
});
