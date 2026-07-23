import { defineConfig } from 'vitest/config';

// Engine tests in a Node environment (no DOM), consistent with the engine boundary
// without `lib: DOM` (ADR-0002; enforced in PANO-19). If Preact component tests
// arrive, switch to Astro's getViteConfig + a DOM environment.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
