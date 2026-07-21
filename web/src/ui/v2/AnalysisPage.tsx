// Parcours d'analyse (/analyse, refonte 2026-07-15) — l'îlot interactif unique de la page. Deux
// entrées, un seul rendu (`ResultsView`), comme l'historique `DemoAnalysis` (/temp) :
//   - `?demo` dans l'URL → l'export SYNTHÉTIQUE traverse le moteur réel, badge « démo · données
//     fictives » (le lien « essaie d'abord avec des données fictives » de l'accueil) ;
//   - sinon → zone de dépôt (drag & drop OU clic) pour l'export réel de l'utilisateur.
//
// Invariant dur (CLAUDE.md), inchangé : le fichier ne quitte JAMAIS l'appareil — lu en mémoire,
// transféré tel quel au Worker du moteur (PANO-27), zéro réseau. La lecture reste `file.arrayBuffer()`
// (pas `Blob.stream()`) : la décompression zip (`unzipSync`, fflate) exige de toute façon l'archive
// complète en mémoire — un flux ne réduirait pas le pic tant que l'ingestion streaming (PANO-91)
// ne consomme pas un `ReadableStream` de bout en bout. `aiSource` RELIT le `File` à la demande
// (le buffer d'origine est détaché par le transfert au worker).

import { useEffect, useState } from 'preact/hooks';
import { buildDemoExportZip } from '../../demo/synthetic-export';
import type { Analysis } from '../../engine/analysis';
import type { EngineResult } from '../../engine/pipeline';
import { currentLocale, localeHref } from '../../i18n/current';
import { analyzeExport } from '../../lib/engine-client';
import { UI_ANALYSE } from '../copy';
import { formatDecimal } from '../format';
import type { AiSource } from './ai-source';
import { NAVY } from './palette';
import { ResultsView } from './ResultsView';
import { SiteFooter } from './SiteFooter';
import { SiteHeader, type TocChip } from './SiteHeader';
import { useIsMobile } from './useIsMobile';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// TEMPORAIRE — panneau de test des cas limites (demandé pour valider `NoDeductionCard` et la
// bannière « peu de données » de `AiSection` sans avoir à fabriquer un vrai export pauvre). À
// SUPPRIMER une fois la validation faite : ni le panneau ni `EdgeCase` ne sont censés survivre en
// prod. Ne touche à AUCUN chemin réel (export utilisateur) — seulement à la source synthétique.
//
// MASQUÉ pour l'instant (`SHOW_DEV_EDGE_CASE_PANEL = false`) — code conservé tel quel pour
// pouvoir le rallumer d'un coup en repassant la constante à `true`, sans le réécrire.
// ─────────────────────────────────────────────────────────────────────────────────────────────

const SHOW_DEV_EDGE_CASE_PANEL = false;

type EdgeCase = 'normal' | 'noDeductions' | 'lowData';

/** Nombre d'items (commentaires + recherches) gardés en cas « peu de données » — sous
 * `LOW_DATA_THRESHOLD` (5, `NoDeductionCard.ts`) pour déclencher la bannière partout. */
const LOW_DATA_ITEM_COUNT = 3;

/** Retire les déductions D1 (sujets sensibles) et D2 (centres d'intérêt) d'une `Analysis` — seul
 * moyen fiable de garantir « aucune déduction » sur la fixture démo, dont le texte est conçu pour
 * matcher plusieurs lexiques. Le reste (rythme, volumes, mur sémantique) n'est PAS touché : le cas
 * testé est « pas de déductions », pas « pas de données ». TEMPORAIRE, cf. bloc ci-dessus.
 *
 * Lot A1 : filtrait `insights[]` sur deux `ruleId` — il fallait connaître les identités D1/D2 pour
 * deviner lesquels des insights étaient des déductions. Les deux champs sont nommés : on les vide. */
function stripDeductionsForTest(output: Analysis): Analysis {
  return { ...output, themes: [], signals: [] };
}

function buildEdgeCaseZip(edgeCase: EdgeCase): Uint8Array {
  return edgeCase === 'lowData'
    ? buildDemoExportZip(currentLocale(), LOW_DATA_ITEM_COUNT)
    : buildDemoExportZip(currentLocale());
}

function DevEdgeCasePanel({
  current,
  onPick,
}: {
  current: EdgeCase;
  onPick: (c: EdgeCase) => void;
}) {
  const options: { id: EdgeCase; label: string }[] = [
    { id: 'normal', label: UI_ANALYSE.devCaseNormal },
    { id: 'noDeductions', label: UI_ANALYSE.devCaseNoDeductions },
    { id: 'lowData', label: UI_ANALYSE.devCaseLowData },
  ];
  return (
    <div style={DEV_PANEL_OUTER}>
      <div style={DEV_PANEL}>
        <span style={DEV_LABEL}>{UI_ANALYSE.devPanelLabel}</span>
        <div style={DEV_ROW}>
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              style={o.id === current ? DEV_BTN_ON : DEV_BTN}
              onClick={() => onPick(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type Status =
  | { kind: 'idle'; error?: string }
  | { kind: 'loading' }
  | { kind: 'output'; output: Analysis; aiSource: AiSource; demo: boolean };

/** Messages d'échec — mêmes regroupements que l'historique (PANO-63), wording non figé.
 *
 * EXPORTÉ pour le golden d'interface (`ui-golden.test.ts`) : ces quatre phrases ne sont atteignables
 * par le rendu qu'au prix d'un échec moteur simulé, et la branche `too_large` porte en plus un
 * formatage décimal (« Mo »). Les figer en appelant la fonction est un filet PLUS DIRECT que de
 * fabriquer l'état de page qui les affiche — et il couvre les quatre branches, pas une. */
export function errorMessage(result: Extract<EngineResult, { ok: false }>): string {
  if (result.stage === 'too_large') {
    const mb = (n: number) => UI_ANALYSE.errorMegabytes(formatDecimal(n / (1024 * 1024)));
    return UI_ANALYSE.errorTooLarge(mb(result.originalSize), mb(result.limit));
  }
  if (result.stage === 'validate') {
    return UI_ANALYSE.errorValidate;
  }
  if (result.error === 'json_entry_not_found') {
    return UI_ANALYSE.errorNoJson;
  }
  return UI_ANALYSE.errorUnreadable;
}

/** `?demo` présent dans l'URL AU CHARGEMENT — lu une seule fois, au tout premier rendu (SSR-safe :
 * ces pages sont des îlots `client:only`, `window` existe toujours). Sert d'état INITIAL `loading`
 * pour ne JAMAIS flasher la zone de dépôt avant que la démo ne démarre (le `useEffect` qui lance
 * l'analyse ne court qu'après le premier rendu). */
function isDemoUrl(): boolean {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo');
}

export function AnalysisPage() {
  // Démarre en `loading` en mode démo → la zone de dépôt (idle) n'apparaît jamais entre le montage
  // et le lancement de l'analyse (corrige le flash d'une demi-seconde).
  const [status, setStatus] = useState<Status>(() =>
    isDemoUrl() ? { kind: 'loading' } : { kind: 'idle' },
  );
  const [dragOver, setDragOver] = useState(false);
  // TEMPORAIRE (panneau de test ci-dessus) — cas limite actuellement affiché en mode démo.
  const [edgeCase, setEdgeCase] = useState<EdgeCase>('normal');
  const isMobile = useIsMobile();

  async function analyze(zipBytes: Uint8Array, aiSource: AiSource, demo: boolean): Promise<void> {
    setStatus({ kind: 'loading' });
    try {
      const result = await analyzeExport(zipBytes, currentLocale());
      if (result.ok) {
        setStatus({ kind: 'output', output: result.output, aiSource, demo });
        return;
      }
      if (result.stage === 'validate') {
        // Filet d'observation minimal (PANO-63) — jamais réseau, jamais persisté.
        console.warn('[PanoptiCool] export réel — échec de validation :', result.issues);
      }
      setStatus({ kind: 'idle', error: errorMessage(result) });
    } catch {
      setStatus({ kind: 'idle', error: UI_ANALYSE.errorUnexpected });
    }
  }

  /** TEMPORAIRE — relance la démo avec la variante choisie dans le panneau de test. */
  async function runDemo(nextEdgeCase: EdgeCase): Promise<void> {
    setEdgeCase(nextEdgeCase);
    setStatus({ kind: 'loading' });
    try {
      const result = await analyzeExport(buildEdgeCaseZip(nextEdgeCase), currentLocale());
      if (!result.ok) {
        setStatus({ kind: 'idle', error: errorMessage(result) });
        return;
      }
      const output =
        nextEdgeCase === 'noDeductions' ? stripDeductionsForTest(result.output) : result.output;
      setStatus({
        kind: 'output',
        output,
        aiSource: () => Promise.resolve(buildEdgeCaseZip(nextEdgeCase)),
        demo: true,
      });
    } catch {
      setStatus({ kind: 'idle', error: UI_ANALYSE.errorUnexpected });
    }
  }

  // Mode démo (`?demo`) : lancé au montage — même moteur, source synthétique régénérée à la demande.
  // L'état est DÉJÀ `loading` (initializer ci-dessus), donc aucun flash de la zone de dépôt.
  useEffect(() => {
    if (isDemoUrl()) {
      void analyze(
        buildDemoExportZip(currentLocale()),
        () => Promise.resolve(buildDemoExportZip(currentLocale())),
        true,
      );
    }
  }, []);

  function handleFile(file: File | undefined): void {
    if (file === undefined) return;
    void file
      .arrayBuffer()
      .then((buffer) =>
        analyze(
          new Uint8Array(buffer),
          () => file.arrayBuffer().then((b) => new Uint8Array(b)),
          false,
        ),
      );
  }

  const badge =
    status.kind === 'output'
      ? status.demo
        ? UI_ANALYSE.badgeDemo
        : UI_ANALYSE.badgeReal
      : undefined;

  // Sommaire en chips (rendu par SiteHeader sur MOBILE uniquement, maquette « v4 Mobile ») :
  // seulement quand les résultats sont affichés — la zone de dépôt n'a pas de sections. La chip
  // 04 est éteinte/pointillée : l'IA locale n'est pas disponible sur mobile (l'ancre mène à
  // l'encart qui l'explique).
  const toc: TocChip[] | undefined =
    status.kind === 'output'
      ? [
          { n: '01', label: UI_ANALYSE.tocActivity, href: '#sec-activite' },
          { n: '02', label: UI_ANALYSE.tocDeductions, href: '#sec-deductions' },
          { n: '03', label: UI_ANALYSE.tocSummary, href: '#sec-resume' },
          { n: '04', label: UI_ANALYSE.tocAi, href: '#sec-ia', muted: true },
        ]
      : undefined;

  return (
    <div style={PAGE}>
      <SiteHeader {...(badge !== undefined && { badge })} {...(toc !== undefined && { toc })} />

      {status.kind === 'output' ? (
        <>
          {/* TEMPORAIRE — uniquement en mode démo, cf. bloc en tête de fichier. */}
          {SHOW_DEV_EDGE_CASE_PANEL && status.demo && (
            <DevEdgeCasePanel current={edgeCase} onPick={(c) => void runDemo(c)} />
          )}
          <ResultsView output={status.output} aiSource={status.aiSource} demo={status.demo} />
          <div style={FOOTER_WRAP}>
            <SiteFooter />
          </div>
        </>
      ) : status.kind === 'loading' ? (
        // Écran de chargement DÉDIÉ (plus la coquille de dépôt) : évite le flash de la zone
        // d'upload au lancement de la démo, et donne un retour propre pendant l'analyse d'un export.
        <div style={isMobile ? M_UPLOAD_SHELL : UPLOAD_SHELL}>
          <div style={LOADING_BOX}>
            <span style={SPINNER} aria-hidden="true" />
            <span style={DROP_MAIN}>{UI_ANALYSE.loadingMain}</span>
            <span style={DROP_SUB}>{UI_ANALYSE.loadingSub}</span>
          </div>
        </div>
      ) : (
        <div style={isMobile ? M_UPLOAD_SHELL : UPLOAD_SHELL}>
          <span style={KICKER}>{UI_ANALYSE.kicker}</span>
          <h1 style={isMobile ? M_TITLE : TITLE}>
            {isMobile ? UI_ANALYSE.titleMobile : UI_ANALYSE.titleDesktop}
          </h1>
          <p style={LEDE}>
            {UI_ANALYSE.ledeLead}
            {isMobile ? UI_ANALYSE.ledeMobile : UI_ANALYSE.ledeDesktop}
          </p>

          {/* Mobile : gros bouton tactile « Choisir mon fichier » — le drag & drop n'existe pas au
              doigt, on ne parle donc pas de « glisser ». Desktop : zone de dépôt classique. */}
          {isMobile ? (
            <label style={M_PICK_BTN}>
              <span style={M_PICK_ICON} aria-hidden="true">
                ⇪
              </span>
              <span style={M_PICK_MAIN}>{UI_ANALYSE.pickButtonMobile}</span>
              <input
                type="file"
                accept=".zip"
                style={FILE_INPUT}
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  e.currentTarget.value = '';
                  handleFile(file);
                }}
              />
            </label>
          ) : (
            <label
              style={dragOver ? DROPZONE_OVER : DROPZONE}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer?.files?.[0]);
              }}
            >
              <span style={DROP_ICON} aria-hidden="true">
                ⇣
              </span>
              <span style={DROP_MAIN}>{UI_ANALYSE.dropMain}</span>
              <span style={DROP_SUB}>{UI_ANALYSE.dropSub}</span>
              <input
                type="file"
                accept=".zip"
                style={FILE_INPUT}
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  e.currentTarget.value = '';
                  handleFile(file);
                }}
              />
            </label>
          )}

          {status.error !== undefined && <p style={ERROR}>{status.error}</p>}
          <p style={HINT}>
            {UI_ANALYSE.hintLead}
            <a href={localeHref('/analyse?demo')} style={DEMO_LINK}>
              {UI_ANALYSE.hintDemoLink}
            </a>
          </p>
          <div style={{ paddingTop: isMobile ? '32px' : '48px' }}>
            <SiteFooter />
          </div>
        </div>
      )}
    </div>
  );
}

// --- Styles ---------------------------------------------------------------------------------------
const PAGE = {
  minHeight: '100vh',
  background: `linear-gradient(180deg, ${NAVY.bgPageTop} 0%, ${NAVY.bgPage} 340px)`,
  color: NAVY.textBright,
} as const;
const FOOTER_WRAP = {
  background: 'linear-gradient(180deg, #0a1024, #070b18)',
  padding: '0 40px 40px',
} as const;
const UPLOAD_SHELL = {
  maxWidth: '720px',
  margin: '0 auto',
  padding: '72px 40px 64px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
} as const;
const KICKER = {
  fontSize: '11px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const TITLE = {
  margin: 0,
  fontSize: '32px',
  fontWeight: 500,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
} as const;
const LEDE = { margin: 0, fontSize: '13px', lineHeight: 1.8, color: NAVY.textLede } as const;
const DROPZONE = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '56px 24px',
  marginTop: '8px',
  background: NAVY.bgCard,
  border: `2px dashed ${NAVY.borderChip}`,
  borderRadius: '14px',
  cursor: 'pointer',
  textAlign: 'center',
} as const;
const DROPZONE_OVER = {
  ...DROPZONE,
  border: `2px dashed ${NAVY.accent}`,
  background: NAVY.accentBgSoft,
} as const;
const DROP_ICON = { fontSize: '26px', color: NAVY.accent, lineHeight: 1 } as const;
const DROP_MAIN = { fontSize: '14px', fontWeight: 500, color: NAVY.textBright } as const;
const DROP_SUB = { fontSize: '11px', color: NAVY.textMuted } as const;
const FILE_INPUT = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
} as const;
const ERROR = { margin: 0, fontSize: '12px', lineHeight: 1.6, color: NAVY.risk } as const;
const HINT = { margin: 0, fontSize: '11px', lineHeight: 1.7, color: NAVY.textDim } as const;
const DEMO_LINK = { color: NAVY.accent, textDecoration: 'none' } as const;
// Écran de chargement dédié — encart centré, spinner (animation `pano-spin` définie dans
// analyse.astro, seul endroit où l'on peut poser un @keyframes global pour un style inline).
const LOADING_BOX = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '14px',
  padding: '72px 24px',
  marginTop: '8px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '14px',
  textAlign: 'center',
} as const;
const SPINNER = {
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  border: `2px solid ${NAVY.borderChip}`,
  borderTopColor: NAVY.accent,
  animation: 'pano-spin 0.8s linear infinite',
} as const;
// Variante mobile de la zone de dépôt (paddings de la maquette « … Mobile »).
const M_UPLOAD_SHELL = {
  ...UPLOAD_SHELL,
  maxWidth: '480px',
  padding: '36px 20px 48px',
} as const;
const M_TITLE = { ...TITLE, fontSize: '27px' } as const;
// Bouton de sélection MOBILE (pas de drag & drop tactile) : cible pleine largeur ≥ 54 px.
const M_PICK_BTN = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '56px',
  marginTop: '8px',
  padding: '16px 20px',
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
  borderRadius: '14px',
  cursor: 'pointer',
} as const;
const M_PICK_ICON = { fontSize: '18px', color: NAVY.accent, lineHeight: 1 } as const;
const M_PICK_MAIN = { fontSize: '14px', fontWeight: 600, color: NAVY.accentBright } as const;

// --- Panneau TEMPORAIRE de test des cas limites (à supprimer après validation) ----------------------
const DEV_PANEL_OUTER = {
  background: 'rgba(232,117,78,.1)',
  borderBottom: `1px dashed ${NAVY.riskBorder}`,
} as const;
const DEV_PANEL = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '12px',
  maxWidth: '1160px',
  margin: '0 auto',
  padding: '10px 24px',
} as const;
const DEV_LABEL = {
  fontSize: '10.5px',
  fontWeight: 600,
  letterSpacing: '0.04em',
  color: NAVY.riskLabel,
  flex: 'none',
} as const;
const DEV_ROW = { display: 'flex', gap: '8px', flexWrap: 'wrap' } as const;
const DEV_BTN = {
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: NAVY.textSecondary,
  background: 'transparent',
  border: `1px solid ${NAVY.riskBorder}`,
  borderRadius: '20px',
  padding: '6px 12px',
} as const;
const DEV_BTN_ON = {
  ...DEV_BTN,
  color: NAVY.bgPage,
  background: NAVY.risk,
  border: `1px solid ${NAVY.risk}`,
} as const;
