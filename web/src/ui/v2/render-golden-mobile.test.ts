// GOLDEN DE RENDU — `ResultsView` EN MOBILE.
//
// POURQUOI CE FICHIER EXISTE. `render-golden.test.ts` n'a JAMAIS rendu autre chose que le desktop,
// et personne ne l'avait écrit. La cause est mécanique : `useIsMobile` lit `window.matchMedia` ;
// en environnement Node `window` est absent, donc le hook rend `false` — en permanence. Les
// composants portent pourtant des variantes mobiles complètes (`M_*`), avec leur PROPRE prose :
// titres raccourcis, verbe « Touche » au lieu de « Clique sur », sommaire en chips, kicker portant
// la mention démo. Rien de tout cela n'était figé.
//
// L'enjeu n'est pas cosmétique : six lots d'extraction de prose ont été validés « à l'octet près »
// par un filet qui ne voyait pas ces variantes. Ce fichier les couvre — et il les couvrira aussi
// quand la traduction anglaise arrivera, ce qui est la moitié de sa valeur.
//
// CE QUE `ui-golden.test.ts` COUVRE DÉJÀ, et qu'on ne refait donc pas ici : les variantes mobiles
// de `SiteHeader`, `LandingPage`, `AnalysisPage` (état de dépôt) et `AiMobileNotice`. Le trou réel
// était `ResultsView` et son sous-arbre — `ActivitySection`, `ThemeCardNavy`/`SignalCardNavy`,
// `NoDeductionCard`, `LearnPanel` —, c'est-à-dire la surface la plus dense en prose extraite.
//
// POURQUOI UN FICHIER SÉPARÉ plutôt qu'une section dans `render-golden`. Ce snapshot-là est
// activement déplacé par les travaux sur le détecteur (le rendu FR change quand une règle change).
// Doubler son volume doublerait le bruit de leurs diffs et la surface de conflit, pour un contenu
// qui ne les concerne pas. Le mobile est en outre une préoccupation de MISE EN PAGE distincte : la
// séparer garde chaque diff lisible.
//
// POURQUOI UN STUB DE `matchMedia` PLUTÔT QU'UN MOCK DU MODULE. Mocker `./useIsMobile` aurait suffi
// à forcer le mobile — et aurait continué de passer si quelqu'un changeait `MOBILE_QUERY`. Le stub
// ci-dessous ÉVALUE VRAIMENT la requête média contre une largeur de viewport : le seuil est donc
// exercé, pas contourné. Même coût, filet strictement plus solide.
//
// ─── CE QU'IL A PROUVÉ RÉTROACTIVEMENT, ET COMMENT ──────────────────────────────────────────────
// Un golden ordinaire se compare à SA propre ligne de base. Celui-ci devait dire quelque chose de
// six lots déjà committés, dont la ligne de base mobile n'a jamais existé. Git la contenait :
//   1. `git worktree add --detach <commit>` sur un arbre jetable, `node_modules` lié au principal ;
//   2. CE fichier y est injecté tel quel — la sonde ne varie pas, c'est ce qui rend la mesure
//      comparable — et le snapshot est SUPPRIMÉ avant chaque exécution (sinon vitest COMPARE au
//      lieu d'écrire, et un « vert » ne voudrait plus rien dire) ;
//   3. chaque lot est comparé à SON PROPRE PARENT (`X~1` contre `X`), et non à une borne lointaine.
// Le point 3 est ce qui rend la mesure honnête : une première tentative comparait « avant tout » à
// « après tout », or les commits de correction ratifiés (Intl, pluriels) tombent DANS cet
// intervalle — le diff mêlait alors ce qui devait bouger et ce qui ne devait pas. Comparer chaque
// commit à son parent isole exactement la question posée.
// Résultat : les six lots d'extraction sont byte-identiques EN MOBILE AUSSI ; les trois commits
// délibérés y déplacent exactement ce qu'ils déplaçaient en desktop, au caractère près.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md (« Ce qu'un filet prouve »).
//   - IL NE REND QUE `ResultsView`. Les autres surfaces mobiles vivent dans `ui-golden.test.ts` ;
//   - IL NE VOIT QU'UNE LARGEUR (390 px, celle des maquettes). Rien ici n'exerce le voisinage du
//     seuil, ni les largeurs intermédiaires : une mise en page qui casse à 700 px passerait ;
//   - IL N'EXERCE PAS LE CHANGEMENT DE TAILLE. `useEffect` ne tourne pas au rendu de chaîne, donc
//     l'abonnement `matchMedia.addEventListener` — le passage desktop↔mobile À CHAUD — n'est
//     jamais joué. Seul l'état INITIAL est figé ;
//   - IL NE VOIT PAS LE CSS (retiré, comme dans les goldens voisins) : aucune régression de style,
//     donc aucune preuve que la mise en page mobile est effectivement lisible. Il prouve que le
//     bon TEXTE part dans la bonne BRANCHE, pas qu'il s'affiche bien ;
//   - IL NE VOIT QUE L'ÉTAT OUVERT des déplis (précaution 2, héritée du golden voisin) ;
//   - DETTE NOMMÉE, volontairement non traitée : rien ici ni ailleurs ne détecte une entrée MORTE
//     de `ui/copy.ts` (un texte que plus aucun composant ne lit). Arbitrage yuya — une entrée morte
//     est du poids mort, pas un texte faux, donc le mode de défaillance est bénin ; et le même test
//     vaudra davantage une fois le catalogue bilingue, puisqu'il répondra alors aussi « quelle
//     entrée EN manque ». À reprendre à ce moment-là, pas avant.
//   - IL NE PROUVE RIEN SUR L'ANGLAIS. Les variantes mobiles sont désormais figées EN FRANÇAIS ;
//     c'est ce qui permettra de mesurer la traduction quand elle arrivera, mais aucune ligne ici ne
//     dit quoi que ce soit d'une version anglaise qui n'existe pas.

import { readFileSync } from 'node:fs';
import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { beforeAll, expect, it, vi } from 'vitest';
import { buildSyntheticExportZip, buildSyntheticExportZipEn } from '../../demo/synthetic-export';
import { processExport } from '../../engine/pipeline';
import { ResultsView } from './ResultsView';

/** Largeur des maquettes mobiles. Sous le seuil de `MOBILE_QUERY` (720 px). */
const VIEWPORT_WIDTH = 390;

/** Évalue `(max-width: Npx)` pour de vrai — c'est ce qui fait que `MOBILE_QUERY` est EXERCÉ et non
 * contourné. Une requête d'une autre forme ne matche pas : le test tomberait, ce qui est le
 * comportement voulu si le seuil change de nature. */
function matchMediaStub(query: string): { matches: boolean } {
  const m = query.match(/\(max-width:\s*(\d+)px\)/);
  return { matches: m?.[1] !== undefined && VIEWPORT_WIDTH <= Number(m[1]) };
}

// Précaution 2 (héritée) : toute bascule booléenne initialisée à `false` — les déplis — est ouverte.
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
  // `useIsMobile` teste `typeof window !== 'undefined'` AVANT d'appeler `matchMedia` : il faut donc
  // les deux. `location` est fourni par prudence — d'autres vues lisent `window.location.search`.
  (globalThis as { window?: unknown }).window = {
    matchMedia: matchMediaStub,
    location: { search: '' },
  };
  // Précaution 1 (héritée) : horloge gelée → fenêtres glissantes reproductibles.
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXED_NOW);
});

function readSample(name: string): Uint8Array {
  return new Uint8Array(readFileSync(new URL(`../../../../samples/${name}`, import.meta.url)));
}

/** Précaution 3 (héritée) : on garde la structure et le texte, on jette le CSS. */
function readable(html: string): string {
  return html.replace(/ style="[^"]*"/g, '').replace(/></g, '>\n<');
}

it('rendu v2 MOBILE — golden de bout en bout (persona + zips committés)', async () => {
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
      parts.push(`### ${c.name}\nREFUSÉ — ${JSON.stringify(res)}`);
      continue;
    }
    // biome-ignore lint/suspicious/noExplicitAny: même prop `output` que le golden desktop.
    const view = ResultsView as any;
    parts.push(`### ${c.name}\n${readable(render(h(view, { output: res.output, demo: c.demo })))}`);
  }

  await expect(parts.join('\n\n')).toMatchFileSnapshot('./__snapshots__/render-golden-mobile.html');
}, 120_000);
