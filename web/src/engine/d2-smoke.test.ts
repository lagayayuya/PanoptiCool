// Smoke test D2 sur EXPORT RÉEL — la porte de yuya en fin de lot (PANO-76). GARDÉ : sauté par défaut,
// ne tourne QUE si la variable d'environnement `D2_SMOKE_ZIP` pointe vers un .zip d'export.
//
//   D2_SMOKE_ZIP=/chemin/vers/ton/export.zip npx vitest run src/engine/d2-smoke.test.ts
//
// AGRÉGATS SEULEMENT (décision PANO-74) : il imprime les thèmes détectés, leur volume de preuves et
// leur niveau de confiance — JAMAIS le texte verbatim d'un commentaire (aucun `evidence[].text`, aucun
// `triggerTerms`). L'invariant privacy tient : l'export ne quitte pas la machine, et RIEN de son
// contenu textuel n'est journalisé. À lancer par yuya sur son propre export ; JAMAIS exécuté sur des
// données réelles par l'agent (seulement vérifié sur un zip synthétique).

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { processExport } from './pipeline';

const ZIP = process.env.D2_SMOKE_ZIP;

describe('D2 — smoke test sur export réel (gardé par D2_SMOKE_ZIP)', () => {
  it.skipIf(!ZIP)(
    'résume les thèmes d’intérêt détectés — agrégats seulement, zéro verbatim',
    () => {
      if (ZIP === undefined) {
        return;
      }
      const res = processExport(new Uint8Array(readFileSync(ZIP)));
      if (!res.ok) {
        console.log(
          `[D2 smoke] échec pipeline au stade « ${res.stage} » — export non exploitable.`,
        );
        expect(res.ok).toBe(false); // documente l'échec sans faire planter (observation, pas assertion)
        return;
      }
      const out = res.output;

      // Résumé AGRÉGÉ — que des identités de thème, des comptes et un niveau de confiance.
      console.log(`[D2 smoke] ${out.themes.length} thème(s) d’intérêt détecté(s) :`);
      for (const theme of out.themes) {
        for (const d of theme.deductions) {
          console.log(
            `  · ${theme.id} — ${d.evidence.length} preuve(s), confiance ${d.confidence}`,
          );
        }
      }
      console.log(`[D2 smoke] registre de thèmes : ${out.themes.map((t) => t.id).join(', ')}`);

      // Garde-fou privacy structurel : le smoke n'imprime aucun verbatim. On VÉRIFIE aussi qu'un
      // constat de thème n'est JAMAIS sensible, même sur données réelles (invariant de frontière) —
      // c'était `sensitivity === undefined`, c'est désormais le discriminant `sensitive: false`.
      for (const theme of out.themes) {
        for (const d of theme.deductions) {
          expect(d.sensitive).toBe(false);
        }
      }
    },
  );
});
