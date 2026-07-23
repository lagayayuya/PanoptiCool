// Minimal ambient for the dev-only strip (PANO-23) — today the only reader is the ingest diagnostic
// of `validate.ts` (the dev-only assertion on the engine's output has itself been removed).
// We do NOT reference `vite/client`: it pulls in the DOM lib and would re-inject it into the engine,
// which would UNDO the boundary the tsconfig without `lib: DOM` enforces (same trap as in PANO-19
// with preact/jsx-runtime). We therefore only type `DEV`.
interface ImportMetaEnv {
  /** True in dev/test, `false` in prod (Vite replaces the value at build → strip of the net). */
  readonly DEV: boolean;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
