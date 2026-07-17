// Ambient minimal pour le strip dev-only (PANO-23) — aujourd'hui le seul lecteur est le diagnostic
// d'ingest de `validate.ts` (l'assertion dev-only sur la sortie du moteur, elle, est retirée).
// On ne référence PAS `vite/client` : il tire la lib DOM et la réinjecterait dans le moteur, ce qui
// DÉFERAIT la frontière que le tsconfig sans `lib: DOM` enforce (même piège qu'en PANO-19 avec
// preact/jsx-runtime). On ne type donc que `DEV`.
interface ImportMetaEnv {
  /** Vrai en dev/test, `false` en prod (Vite remplace la valeur au build → strip du filet). */
  readonly DEV: boolean;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
