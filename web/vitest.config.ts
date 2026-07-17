import { defineConfig } from 'vitest/config';

// Tests du moteur en environnement Node (pas de DOM), cohérent avec la frontière
// moteur sans `lib: DOM` (ADR-0002 ; enforced en PANO-19). Si des tests de composants
// Preact arrivent, basculer sur getViteConfig d'Astro + un environnement DOM.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
