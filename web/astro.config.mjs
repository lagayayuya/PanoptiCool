import preact from '@astrojs/preact';
import { defineConfig } from 'astro/config';

// PanoptiCool — coquille Astro + îlots Preact (ADR-0002).
// `output` reste sur le défaut « static » : build statique servi par Caddy (ADR-0001),
// parsing/insights 100 % côté client. Aucun rendu serveur.
export default defineConfig({
  integrations: [preact()],
});
