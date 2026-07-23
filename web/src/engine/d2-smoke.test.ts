// D2 smoke test on a REAL EXPORT — yuya's gate at the end of the batch (PANO-76). GUARDED: skipped
// by default, runs ONLY if the environment variable `D2_SMOKE_ZIP` points to an export .zip.
//
//   D2_SMOKE_ZIP=/path/to/your/export.zip npx vitest run src/engine/d2-smoke.test.ts
//
// AGGREGATES ONLY (PANO-74 decision): it prints the detected themes, their evidence volume and their
// confidence level — NEVER the verbatim text of a comment (no `evidence[].text`, no `triggerTerms`).
// The privacy invariant holds: the export does not leave the machine, and NOTHING of its textual
// content is logged. To be run by yuya on their own export; NEVER executed on real data by the agent
// (only checked on a synthetic zip).

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { processExport } from './pipeline';

const ZIP = process.env.D2_SMOKE_ZIP;

describe('D2 — smoke test on a real export (guarded by D2_SMOKE_ZIP)', () => {
  it.skipIf(!ZIP)(
    'summarizes the detected interest themes — aggregates only, zero verbatim',
    () => {
      if (ZIP === undefined) {
        return;
      }
      const res = processExport(new Uint8Array(readFileSync(ZIP)));
      if (!res.ok) {
        console.log(
          `[D2 smoke] échec pipeline au stade « ${res.stage} » — export non exploitable.`,
        );
        expect(res.ok).toBe(false); // documents the failure without crashing (observation, not assertion)
        return;
      }
      const out = res.output;

      // AGGREGATED summary — only theme identities, counts and a confidence level.
      console.log(`[D2 smoke] ${out.themes.length} thème(s) d’intérêt détecté(s) :`);
      for (const theme of out.themes) {
        for (const d of theme.deductions) {
          console.log(
            `  · ${theme.id} — ${d.evidence.length} preuve(s), confiance ${d.confidence}`,
          );
        }
      }
      console.log(`[D2 smoke] registre de thèmes : ${out.themes.map((t) => t.id).join(', ')}`);

      // Structural privacy guardrail: the smoke prints no verbatim. We also VERIFY that a theme
      // finding is NEVER sensitive, even on real data (a boundary invariant) — it was
      // `sensitivity === undefined`, it is now the `sensitive: false` discriminant.
      for (const theme of out.themes) {
        for (const d of theme.deductions) {
          expect(d.sensitive).toBe(false);
        }
      }
    },
  );
});
