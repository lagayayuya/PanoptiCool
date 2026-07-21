// GOLDEN DE RENDU — L'ARBRE ANGLAIS. Le pendant de `render-golden.test.ts`, en anglais.
//
// POURQUOI UN FICHIER SÉPARÉ, et non deux cas de plus dans le golden existant. `ui/copy.ts` et
// `ui/format.ts` résolvent la langue UNE FOIS, à l'évaluation du module. Rendre de l'anglais exige
// donc de poser `<html lang>` AVANT le premier import — `vi.resetModules()` + imports DYNAMIQUES.
// Le golden français importe ses composants statiquement, en tête de fichier : y ajouter des cas
// anglais aurait imposé de le réécrire en entier, donc de toucher au fichier dont la mission est
// justement de ne pas bouger. Deux fichiers, deux langues, aucun risque sur le français.
//
// ⚠ POURQUOI CE GOLDEN N'EXISTAIT PAS AVANT LE PÉRIMÈTRE n°2. Tant que `copy.ts` était français, un
// arbre « anglais » rendait du FRANGLAIS : déductions anglaises dans une coquille française, avec
// des nombres français (U+202F, « 0 comment » au singulier). Le figer alors aurait fait bouger le
// snapshot DEUX fois — une fois pour le franglais, une fois pour l'anglais réel. Il attend donc que
// les deux périmètres soient traduits, et ne fige qu'un arbre cohérent.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md : un mécanisme de preuve déclare sa frontière. Celle-ci est LA MÊME que
// celle du golden français, et il faut la relire plutôt que la supposer héritée :
//   - LE SOUS-ARBRE `ResultsView` SEULEMENT, en DESKTOP. Ni `LandingPage`, ni `AnalysisPage`, ni
//     `SiteHeader`/`SiteFooter`, ni `AiSection` — c'est-à-dire la plus grosse part de `copy.en.ts`.
//     `ui-golden.test.ts` couvre ces surfaces EN FRANÇAIS ; leur pendant anglais n'existe pas ;
//   - LES DÉPLIS SONT FORCÉS OUVERTS et l'horloge gelée, comme côté français ;
//   - LE CSS EST RETIRÉ, donc aucune régression de style n'est visible ici ;
//   - IL NE JUGE PAS LA TRADUCTION. Il fige ce qui est rendu, jamais si c'est bien écrit. Un
//     contresens anglais passe ce golden au vert le jour où il y entre, et tous les jours suivants.
//
// CE QU'IL PROUVE, et c'est précis : que la langue TRAVERSE toute la chaîne — zip → `processExport`
// avec `locale: 'en'` → règles → `Analysis` → composants → DOM. C'est la seule mesure qui relie les
// deux périmètres ratifiables à un écran.

import { readFileSync } from 'node:fs';
import { beforeAll, expect, it, vi } from 'vitest';

// Les déplis vivent derrière un `useState(false)` interne ; fermés, le golden ne verrait ni
// verbatim, ni terme surligné (même précaution que le golden français).
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
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXED_NOW);
});

function readSample(name: string): Uint8Array {
  return new Uint8Array(readFileSync(new URL(`../../../../samples/${name}`, import.meta.url)));
}

function readable(html: string): string {
  return html.replace(/ style="[^"]*"/g, '').replace(/></g, '>\n<');
}

it('rendu v2 EN — la langue traverse toute la chaîne', async () => {
  // ⚠ L'ORDRE EST LE SUJET DU FICHIER : la langue doit être posée AVANT le premier import de
  // `copy.ts`/`format.ts`, sans quoi ils auront déjà figé le français. `resetModules` garantit que
  // les imports dynamiques ci-dessous partent d'un cache vide.
  vi.resetModules();
  vi.stubGlobal('document', { documentElement: { lang: 'en' } });

  const { h } = await import('preact');
  const { render } = await import('preact-render-to-string');
  const { buildSyntheticExportZip, buildSyntheticExportZipEn } = await import(
    '../../demo/synthetic-export'
  );
  const { processExport } = await import('../../engine/pipeline');
  const { ResultsView } = await import('./ResultsView');

  const cases: { name: string; zip: Uint8Array; demo: boolean }[] = [
    // La persona EN est le cas PORTEUR : elle seule exerce le sensible, les intérêts et les preuves
    // ancrées avec du texte anglais. La persona FR est incluse aussi, à dessein — elle montre
    // l'interface anglaise par-dessus des DONNÉES françaises, c'est-à-dire ce que verrait quelqu'un
    // qui bascule la langue sur son propre export.
    { name: 'persona-en@en', zip: buildSyntheticExportZipEn(undefined, FIXED_NOW), demo: true },
    { name: 'persona-fr@en', zip: buildSyntheticExportZip(undefined, FIXED_NOW), demo: true },
    { name: 'sample@en', zip: readSample('user_data_tiktok.sample.zip'), demo: false },
  ];

  const parts: string[] = [];
  for (const c of cases) {
    const res = processExport(c.zip, { now: FIXED_NOW, locale: 'en' });
    if (!res.ok) {
      parts.push(`### ${c.name}\nREFUSÉ — ${JSON.stringify(res)}`);
      continue;
    }
    // biome-ignore lint/suspicious/noExplicitAny: la prop `output` suit le type de la refonte A.
    const view = ResultsView as any;
    parts.push(`### ${c.name}\n${readable(render(h(view, { output: res.output, demo: c.demo })))}`);
  }

  vi.unstubAllGlobals();
  await expect(parts.join('\n\n')).toMatchFileSnapshot('./__snapshots__/render-golden-en.html');
}, 120_000);
