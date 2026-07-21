// GOLDEN DE RENDU — LES SURFACES QUE `render-golden` NE VOIT PAS.
//
// POURQUOI CE FICHIER EXISTE. `render-golden.test.ts` monte `ResultsView` SANS `aiSource`. Il ne
// rend donc NI `AiSection` (montée derrière `aiSource !== undefined`), NI `LandingPage`, NI
// `AnalysisPage` — et pas davantage `SiteHeader`/`SiteFooter`, qu'aucune de ses vues n'inclut.
// Or ce sont exactement les fichiers qui portent le PLUS de prose. L'obligation de CLAUDE.md
// (« tout changement de comportement se prouve par un golden à diff nul ») ne couvrait donc en
// pratique qu'une fraction de ce que le produit dit. Ce fichier étend le filet à ces surfaces
// AVANT qu'on y déplace quoi que ce soit : un déplacement sous filet est une preuve, un
// déplacement sans filet est une bonne intention.
//
// POURQUOI LES ÉTATS SONT SEMÉS, ET PAS PILOTÉS. `preact-render-to-string` est SYNCHRONE : il
// n'exécute AUCUN `useEffect`. Monter `AiSection` avec une vraie `source` ne rendrait donc que
// l'état INITIAL (`items: loading`, `probe: idle`, run vide) — c'est-à-dire presque aucune de ses
// phrases. Mocker le worker ou le réseau n'y changerait rien : l'effet qui consomme la réponse ne
// tourne pas. Les états qui portent la prose sont donc SEMÉS à l'initialisation du `useState`,
// exactement comme `render-golden` force ses déplis à `true`.
//
// CE QUE CE MÉCANISME SUPPOSE, et pourquoi c'est tenable ICI : que l'ORDRE et la FORME des
// `useState` ne bougent pas. Une extraction de prose remplace `'littéral'` par `UI.x` — elle
// n'ajoute ni ne retire un hook. La graine n'a donc pas à survivre à une refonte de `AiSection` :
// elle doit survivre à CE diff-là, et elle le fait. Si un jour un hook est ajouté, ce fichier
// tombera bruyamment — ce qui est le comportement voulu, pas une fragilité subie.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md. Ce fichier a été écrit POUR combler la frontière d'un autre golden : il
// serait particulièrement malvenu qu'il taise la sienne.
//   - LES ÉTATS NON ÉNUMÉRÉS. Les scénarios ci-dessous sèment un jeu d'états FINI. Restent hors
//     champ : `items: error`, `probe: checking`, `verification: exact`/`checking`, un run EN COURS
//     (`running: true`), un run INTERROMPU, et les messages d'erreur de lancement. Chacun porte de
//     la prose que rien ne fige. `probe: error` en faisait partie et n'en fait PLUS : ses trois
//     issues (`granted`/`blocked`/`unknown`) sont désormais semées, parce qu'elles instruisent
//     quelqu'un sur sa propre machine et qu'une phrase fausse y coûte plus qu'ailleurs (ADR-0006) ;
//   - LES COMBINAISONS D'ENVIRONNEMENT NON SEMÉES (itération 2026-07-20). Les cas ci-dessous fixent
//     un point par discours — Firefox, Chromium, WebKit, inconnu, localhost abouti, route B — pas le
//     produit cartésien : moteur × permission × route × localhost ferait des dizaines de rendus.
//     Restent notamment hors champ : localhost avec serveur ÉTEINT, `probe: error` sous Firefox à
//     permission LUE (`granted`/`blocked`), et les commandes Windows/Linux (l'OS semé est toujours
//     le repli macOS — `localSiteCommand` par OS se fige dans `ai/items.test.ts`) ;
//   - LES VOLUMES ATYPIQUES. Comme le golden voisin, les scénarios utilisent des volumes
//     plausibles (3, 40, 4 000 items) — donc PLURIELS. Les accords au singulier et à zéro ne sont
//     pas atteints ici : ils se fixent dans `ui/copy.test.ts` ;
//   - LES CARTES SENSIBLES, DONC L'ÉVENTAIL DE LECTURES. Ce fichier monte l'accueil, le parcours
//     d'analyse, la section IA et le chrome — jamais `ResultsView`. Les deux goldens réunis n'ont
//     donc JAMAIS rendu d'éventail en mode `equal` : la persona de démo produit un constat NOMMÉ,
//     donc `ranked`. La frontière est STRUCTURELLE — la persona est écrite à l'aveugle, comme une
//     personne, si bien que ce qu'elle n'exerce pas n'est le choix de personne, et que ce que
//     personne n'a décidé d'omettre, personne ne pense à l'écrire. Un défaut a vécu exactement là ;
//     il est couvert par `fan-readings.test.ts` ;
//   - LE COMPORTEMENT. C'est du rendu de chaîne : aucun clic, aucune saisie, aucun effet. Un
//     bouton qui n'appelle plus rien passerait sans bruit ;
//   - LE CSS, retiré par `readable()` comme dans le golden voisin ;
//   - LA VÉRACITÉ DU TEXTE. Un filet fige ce qui est écrit, jamais si c'est vrai ou bien tourné —
//     la relecture du wording reste humaine (cf. l'en-tête de `ui/copy.ts`).

import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { beforeAll, expect, it, vi } from 'vitest';

// --- Semis d'état ----------------------------------------------------------------------------
// `SEED` est remplacé AVANT chaque rendu. Les initialiseurs PARESSEUX (`useState(() => …)`, dont
// `useIsMobile`) passent intacts : les toucher casserait leur contrat.
let SEED: (init: unknown) => unknown = (v) => v;

vi.mock('preact/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('preact/hooks')>();
  return {
    ...actual,
    useState: <T>(init: T) =>
      actual.useState(typeof init === 'function' ? init : (SEED(init) as T)),
  };
});

// `useIsMobile` lit `matchMedia`, absent en environnement Node — il rendrait TOUJOURS desktop.
// On le pilote donc directement, pour figer AUSSI les variantes mobiles des maquettes.
let MOBILE = false;
vi.mock('./useIsMobile', () => ({
  MOBILE_QUERY: '(max-width: 720px)',
  useIsMobile: () => MOBILE,
}));

const { AiMobileNotice, AiSection } = await import('./AiSection');
const { AnalysisPage, errorMessage } = await import('./AnalysisPage');
const { LandingPage } = await import('./LandingPage');
const { SiteFooter } = await import('./SiteFooter');
const { SiteHeader } = await import('./SiteHeader');

const FIXED_NOW = Date.UTC(2026, 6, 16, 12, 0, 0);

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(FIXED_NOW);
});

/** Même convention que `render-golden` : on garde structure et texte, on jette le CSS. */
function readable(html: string): string {
  return html.replace(/ style="[^"]*"/g, '').replace(/></g, '>\n<');
}

// --- Graines ----------------------------------------------------------------------------------
// Textes SYNTHÉTIQUES (invariant du dépôt : aucune valeur d'un vrai export n'entre ici).
function items(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    index: i,
    kind: (i % 2 === 0 ? 'comment' : 'search') as 'comment' | 'search',
    text: i % 2 === 0 ? `commentaire synthétique ${i}` : `recherche synthétique ${i}`,
    epoch: FIXED_NOW - i * 86_400_000,
  }));
}

/** Rendu avec `run` TERMINÉ : c'est le seul état qui affiche le pied de bloc portant les durées et
 * le débit (`tok/s`) — les sites de formatage décimal corrigés sans filet au lot précédent. */
const DONE_RUN = {
  text: 'Sortie synthétique du modèle local.',
  running: false,
  interrupted: false,
  promptTokens: 1234,
  completionTokens: 567,
  elapsedMs: 8900,
};

/** Le sondage joint, cas par défaut de la plupart des scénarios. */
const PROBE_OK = { kind: 'ok', modelId: 'modele-local-test', contextWindow: 8192 };

/**
 * `probe` est PARAMÉTRABLE parce que les phrases d'échec ne sont rendues par rien d'autre. Elles
 * vivent toutes derrière `probe.kind === 'error'`, que ce fichier a longtemps déclaré hors champ —
 * si bien qu'un changement de leur texte laissait le golden VERT. Mesuré : réécrire `step3WarnIdle`
 * et brancher trois messages d'échec n'a produit aucun diff tant que ces scénarios n'existaient pas.
 *
 * `env` et `route` sont PARAMÉTRABLES pour la même raison (itération 2026-07-20) : la bannière
 * navigateur, les notes de permission et la route B ne se rendent que sur un environnement précis —
 * en Node, l'UA ne nomme aucun moteur et la page n'est pas sur localhost, donc sans semis ces
 * phrases n'existeraient sur le chemin d'aucun rendu. Les cibles se reconnaissent à la FORME de
 * leur initialiseur : l'état d'environnement porte une clé `browser`, celui de route une clé
 * `choice` — c'est le contrat que `AiSection` documente sur ses `useState`.
 */
function aiSeed(
  itemCount: number,
  probe: unknown = PROBE_OK,
  opts: { env?: Record<string, unknown>; route?: 'site' | 'local' } = {},
) {
  return (init: unknown): unknown => {
    if (init === false) return true; // déplis ouverts, comme dans `render-golden`
    if (init !== null && typeof init === 'object') {
      const o = init as Record<string, unknown>;
      if (o.kind === 'loading') return { kind: 'ready', items: items(itemCount) };
      if (o.kind === 'idle') return probe;
      if ('browser' in o) return { ...o, ...opts.env };
      if ('choice' in o) return { choice: opts.route ?? null };
      if ('running' in o) return DONE_RUN;
    }
    return init;
  };
}

const CASES: {
  name: string;
  mobile: boolean;
  seed: (i: unknown) => unknown;
  node: () => unknown;
}[] = [
  { name: 'header-desktop', mobile: false, seed: (v) => v, node: () => h(SiteHeader, null) },
  {
    name: 'header-desktop-badge',
    mobile: false,
    seed: (v) => v,
    node: () => h(SiteHeader, { badge: 'démo · données fictives' }),
  },
  {
    name: 'header-mobile-toc',
    mobile: true,
    seed: (v) => v,
    node: () =>
      h(SiteHeader, {
        toc: [
          { n: '01', label: 'Ton activité', href: '#sec-activite' },
          { n: '04', label: 'IA locale', href: '#sec-ia', muted: true },
        ],
      }),
  },
  { name: 'footer', mobile: false, seed: (v) => v, node: () => h(SiteFooter, null) },

  // `LandingPage` : le `false → true` ouvre la modale de consentement, qui porte l'essentiel de
  // la prose juridique de la page. Fermée, le golden ne verrait que le héros.
  {
    name: 'landing-desktop',
    mobile: false,
    seed: (v) => (v === false ? true : v),
    node: () => h(LandingPage, null),
  },
  {
    name: 'landing-mobile',
    mobile: true,
    seed: (v) => (v === false ? true : v),
    node: () => h(LandingPage, null),
  },

  // `AnalysisPage` : l'état `output` est déjà couvert par `render-golden` (c'est `ResultsView`).
  // Ce qui ne l'était pas, c'est la zone de dépôt et le message d'échec.
  { name: 'analyse-idle', mobile: false, seed: (v) => v, node: () => h(AnalysisPage, null) },
  { name: 'analyse-idle-mobile', mobile: true, seed: (v) => v, node: () => h(AnalysisPage, null) },

  // `AiSection` : deux volumes, parce que la bannière « peu de données » et le compteur d'envoi
  // sont sur des branches OPPOSÉES du même seuil (`LOW_DATA_THRESHOLD`).
  {
    name: 'ai-section',
    mobile: false,
    seed: aiSeed(40),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  {
    name: 'ai-section-low-data',
    mobile: false,
    seed: aiSeed(3),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // Volume ÉLEVÉ : au-delà du budget de tokens, la sélection tronque et bascule de tier — c'est
  // le seul chemin qui rend les phrases « priorité au plus récent » et leurs compteurs.
  {
    name: 'ai-section-truncated',
    mobile: false,
    seed: aiSeed(4000),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // Les QUATRE états du sondage qui portent une instruction. Chacun dit à quelqu'un quoi faire de sa
  // propre machine ; c'est la surface où une phrase fausse coûte le plus cher (ADR-0006), et c'était
  // la seule que rien ne figeait.
  {
    name: 'ai-section-probe-idle',
    mobile: false,
    seed: aiSeed(40, { kind: 'idle' }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  {
    name: 'ai-section-probe-absent',
    mobile: false,
    seed: aiSeed(40, { kind: 'error', gate: 'granted' }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  {
    name: 'ai-section-probe-blocked',
    mobile: false,
    seed: aiSeed(40, { kind: 'error', gate: 'blocked' }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // Permission illisible ET moteur non reconnu : le cas où l'aide ne nomme aucune cause et renvoie
  // vers la route B (ADR-0006, décision 4).
  {
    name: 'ai-section-probe-unknown',
    mobile: false,
    seed: aiSeed(40, { kind: 'error', gate: 'unknown' }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },

  // Les TROIS discours de la bannière navigateur (ADR-0006 : deux marchent, un est un mur), plus le
  // parcours de la route B et le mode localhost. Chaque cas rend des phrases qu'aucun autre chemin
  // ne rend — bannière, note de permission, « indisponible avec Safari », « Tout est prêt ».
  {
    name: 'ai-section-firefox',
    mobile: false,
    seed: aiSeed(40, PROBE_OK, { env: { browser: { name: 'Firefox', engine: 'firefox' } } }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  {
    name: 'ai-section-chromium',
    mobile: false,
    seed: aiSeed(40, PROBE_OK, { env: { browser: { name: 'Chrome', engine: 'chromium' } } }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // Firefox reconnu + échec à permission illisible : la seule aide qui ose nommer la fenêtre
  // spontanée (comportement mesuré, ADR-0006).
  {
    name: 'ai-section-firefox-down',
    mobile: false,
    seed: aiSeed(
      40,
      { kind: 'error', gate: 'unknown' },
      { env: { browser: { name: 'Firefox', engine: 'firefox' } } },
    ),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // WebKit : option A désactivée, route forcée sur B, carte 2 en attente de la copie locale.
  {
    name: 'ai-section-safari',
    mobile: false,
    seed: aiSeed(40, { kind: 'idle' }, { env: { browser: { name: 'Safari', engine: 'webkit' } } }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // Route B choisie depuis un navigateur compatible : mêmes étapes 4-5, carte 2 en attente.
  {
    name: 'ai-section-route-local',
    mobile: false,
    seed: aiSeed(
      40,
      { kind: 'idle' },
      { env: { browser: { name: 'Chrome', engine: 'chromium' } }, route: 'local' },
    ),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  // Mode localhost abouti (route B, ou dev) : plus de bannière, « Tout est prêt », carte 2 active.
  {
    name: 'ai-section-localhost-ready',
    mobile: false,
    seed: aiSeed(40, PROBE_OK, {
      env: {
        browser: { name: 'Firefox', engine: 'firefox' },
        localhost: true,
        origin: 'http://localhost:8080',
      },
    }),
    node: () => h(AiSection, { source: async () => new Uint8Array() }),
  },
  { name: 'ai-mobile-notice', mobile: true, seed: (v) => v, node: () => h(AiMobileNotice, null) },
];

it('rendu UI — golden des surfaces hors `render-golden`', async () => {
  const parts: string[] = [];
  for (const c of CASES) {
    MOBILE = c.mobile;
    SEED = c.seed;
    // biome-ignore lint/suspicious/noExplicitAny: chaque cas monte un composant de props différentes.
    parts.push(`### ${c.name}\n${readable(render(c.node() as any))}`);
  }
  SEED = (v) => v;
  MOBILE = false;

  // Les QUATRE messages d'échec de `AnalysisPage`. Ils ne s'affichent qu'après un échec moteur ;
  // les appeler directement les fige tous, y compris le « Mo » décimal corrigé sans filet au lot
  // précédent. Tailles choisies pour rendre une décimale NON nulle (donc la virgule française).
  parts.push(
    `### analyse-messages-echec\n${[
      errorMessage({
        ok: false,
        stage: 'too_large',
        originalSize: 150_000_000,
        limit: 110_000_000,
      }),
      errorMessage({ ok: false, stage: 'validate', issues: [] }),
      errorMessage({ ok: false, stage: 'parse', error: 'json_entry_not_found' }),
      errorMessage({ ok: false, stage: 'parse', error: 'invalid_zip' }),
    ].join('\n')}`,
  );

  await expect(parts.join('\n\n')).toMatchFileSnapshot('./__snapshots__/ui-golden.html');
}, 120_000);
