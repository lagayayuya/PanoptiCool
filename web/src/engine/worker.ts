// Web Worker adapter of the engine (PANO-27, ADR-0002).
//
// Receives the input (`.zip` bytes, transferred by the client) AND THE LANGUAGE, runs the pipeline
// INSIDE the worker, and `postMessage`s ONLY the reduced `EngineResult` — never the parsed graph
// (which would double the memory via structured-clone). **WebWorker** globals
// (`onmessage`/`postMessage`), NO DOM: the PANO-19 engine boundary holds here too (verified by the
// 2nd no-DOM `tsc` pass).
//
// WHY THE LANGUAGE CROSSES THE MESSAGE. The engine emits PROSE (`Analysis` carries `claim` and
// `label`, ADR-0004) and has no `document` from which to read `<html lang>` — which is precisely
// what makes it pure. The language is therefore an INPUT DATUM, on the same footing as the bytes:
// the UI knows it, the worker does not guess it.
//
// ⚠ THE TYPE DOES NOT SURVIVE `postMessage` (structured-clone does not carry `Locale`). An unknown
// language is therefore not impossible here, only improbable; `wording.ts` falls back to French
// rather than crash. Do not rely on the type alone.

import type { EngineRequest } from '../lib/engine-client';
import { processExport } from './pipeline';

addEventListener('message', (event: MessageEvent<EngineRequest>): void => {
  const { zipBytes, locale } = event.data;
  postMessage(processExport(zipBytes, { locale }));
});
