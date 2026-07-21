// GOLDEN DE RENDU v2 — le filet de la refonte A (audit d'architecture §5).
//
// POURQUOI CE TEST EXISTE. La refonte A change le schéma PAR CONSTRUCTION (`EngineOutput` →
// `Analysis`) : aucun diff exact n'est donc possible à la frontière du moteur. Le seul point de
// mesure qui SURVIT à la refonte est **ce que l'utilisateur voit**. Ce golden rend l'UI v2 de bout
// en bout (zip → ingestion → règles → rendu) et fige le résultat. La promesse « le rendu v2 ne
// bouge pas » devient vérifiable par diff, au lieu d'être affirmée.
//
// CE QU'IL COUVRE, et pourquoi la persona est OBLIGATOIRE : les 3 zips committés de `samples/` ne
// produisent AUCUN topic D1/D2 — ni sensible, ni intérêt, ni preuve, ni thème (mesuré). Un golden
// bâti sur eux « prouverait » l'invariance de tout SAUF du cœur que la refonte réécrit. La persona
// de démo (`demo/synthetic-export.ts`) est donc le cas porteur : elle seule exerce le sensible
// (mental_health, conflictual), les intérêts (chats, cinema_series), les preuves ancrées, les
// triggerTerms surlignés et le C5 (« comment:8 » nourrit conflictual ET cinema_series).
//
// TROIS PRÉCAUTIONS, sans quoi le filet serait troué :
//   1. horloge GELÉE — `activity-rhythm` calcule ses fenêtres glissantes sur `Date.now()` ;
//   2. déplis FORCÉS OUVERTS — les preuves vivent derrière un `useState(false)` interne ; fermés,
//      le golden ne verrait ni verbatim, ni terme surligné, ni C5 ;
//   3. styles RETIRÉS — le CSS n'est pas du comportement, et son volume rendrait le diff illisible.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md : un mécanisme de preuve déclare sa frontière, sinon il finit sur-cité.
// Celui-ci a été cité comme s'il couvrait « le rendu » ; il couvre le sous-arbre `ResultsView`, et
// pas davantage :
//   - `AiSection` — montée derrière `aiSource !== undefined`, jamais passé ici ;
//   - `LandingPage`, `AnalysisPage`, `SiteHeader`, `SiteFooter` — aucune de ces vues n'entre dans
//     `ResultsView`. Elles sont couvertes par `ui-golden.test.ts`, ajouté pour ce trou précis ;
//   - L'ÉVENTAIL EN MODE `equal`. La persona de démo produit un constat `mental_health` NOMMÉ, donc
//     un éventail `ranked` : le mode `equal` (constats larges) n'est monté par aucun golden. La
//     frontière est STRUCTURELLE et mérite d'être lue comme telle — la persona est écrite à
//     l'aveugle, comme une personne, donc ce qu'elle n'exerce pas n'est le choix de personne, et ce
//     que personne n'a décidé d'omettre, personne ne pense à l'écrire. Un défaut a vécu là (le mode
//     `equal` tronquait à deux lectures) ; il est couvert par `fan-readings.test.ts`.
//   - LE MOBILE, EN ENTIER. `useIsMobile` lit `matchMedia` ; en environnement Node, `window` est
//     absent, donc il rend `false` — ce golden n'a JAMAIS rendu autre chose que le desktop, alors
//     que les composants portent des variantes mobiles complètes (`M_*`) ;
//   - l'état FERMÉ des déplis : la précaution 2 les force tous ouverts. Le rendu replié, celui que
//     l'utilisateur voit en premier, n'est pas figé ;
//   - le CSS (précaution 3) : aucune régression de style n'est détectable ici ;
//   - les formes au SINGULIER. Persona et zips committés portent des volumes réalistes, donc
//     pluriels : « 1 items » est resté invisible ici jusqu'à ce qu'un test d'appel le montre
//     (`ui/copy.test.ts`).

import { readFileSync } from 'node:fs';
import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { beforeAll, expect, it, vi } from 'vitest';
import { buildSyntheticExportZip, buildSyntheticExportZipEn } from '../../demo/synthetic-export';
import { processExport } from '../../engine/pipeline';
import { ResultsView } from './ResultsView';

// Précaution 2 : toute bascule booléenne initialisée à `false` (les déplis) est ouverte.
vi.mock('preact/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('preact/hooks')>();
  return {
    ...actual,
    useState: <T>(init: T) =>
      actual.useState(init === (false as unknown as T) ? (true as unknown as T) : init),
  };
});

const FIXED_NOW = Date.UTC(2026, 6, 16, 12, 0, 0);

beforeAll(() => {
  // Précaution 1 : horloge gelée → fenêtres glissantes reproductibles.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXED_NOW);
});

function readSample(name: string): Uint8Array {
  return new Uint8Array(readFileSync(new URL(`../../../../samples/${name}`, import.meta.url)));
}

/** Précaution 3 : on garde la structure et le texte, on jette le CSS. Une balise par ligne. */
function readable(html: string): string {
  return html.replace(/ style="[^"]*"/g, '').replace(/></g, '>\n<');
}

it('rendu v2 — golden de bout en bout (persona + zips committés)', async () => {
  const cases: { name: string; zip: Uint8Array; demo: boolean }[] = [
    { name: 'persona-fr', zip: buildSyntheticExportZip(undefined, FIXED_NOW), demo: true },
    { name: 'persona-en', zip: buildSyntheticExportZipEn(undefined, FIXED_NOW), demo: true },
    { name: 'sample', zip: readSample('user_data_tiktok.sample.zip'), demo: false },
    { name: 'empty', zip: readSample('user_data_tiktok.empty.zip'), demo: false },
    { name: 'absent', zip: readSample('user_data_tiktok.absent.zip'), demo: false },
  ];

  const parts: string[] = [];
  for (const c of cases) {
    const res = processExport(c.zip);
    if (!res.ok) {
      // Un refus EST un comportement (`absent` : clé `Searches` omise → rejet à la validation).
      // On le fige tel quel plutôt que de le masquer : la refonte ne doit pas le changer non plus.
      parts.push(`### ${c.name}\nREFUSÉ — ${JSON.stringify(res)}`);
      continue;
    }
    // biome-ignore lint/suspicious/noExplicitAny: la prop `output` change de type à la refonte A.
    const view = ResultsView as any;
    parts.push(`### ${c.name}\n${readable(render(h(view, { output: res.output, demo: c.demo })))}`);
  }

  await expect(parts.join('\n\n')).toMatchFileSnapshot('./__snapshots__/render-golden.html');
}, 120_000);
