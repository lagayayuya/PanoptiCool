// Analysis journey (/analyse, 2026-07-15 rework) — the page's single interactive island. Two
// entries, a single render (`ResultsView`), like the historical `DemoAnalysis` (/temp):
//   - `?demo` in the URL → the SYNTHETIC export goes through the real engine, « démo · données
//     fictives » badge (the « essaie d'abord avec des données fictives » link of the home page);
//   - otherwise → drop zone (drag & drop OR click) for the user's real export.
//
// Hard invariant (CLAUDE.md), unchanged: the file NEVER leaves the device — read in memory,
// transferred as is to the engine's Worker (PANO-27), zero network. The read stays `file.arrayBuffer()`
// (not `Blob.stream()`): the zip decompression (`unzipSync`, fflate) requires the whole archive
// in memory anyway — a stream would not reduce the peak as long as streaming ingestion (PANO-91)
// does not consume a `ReadableStream` end to end. `aiSource` RE-READS the `File` on demand
// (the original buffer is detached by the transfer to the worker).

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

type Status =
  | { kind: 'idle'; error?: string }
  | { kind: 'loading' }
  | { kind: 'output'; output: Analysis; aiSource: AiSource; demo: boolean };

/** Failure messages — same groupings as the historical ones (PANO-63), wording not frozen.
 *
 * EXPORTED for the interface golden (`ui-golden.test.ts`): these four sentences are only reachable
 * by the render at the price of a simulated engine failure, and the `too_large` branch also carries a
 * decimal formatting (« Mo »). Freezing them by calling the function is a MORE DIRECT net than
 * fabricating the page state that displays them — and it covers all four branches, not one. */
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

/** `?demo` present in the URL AT LOAD — read only once, at the very first render (SSR-safe:
 * these pages are `client:only` islands, `window` always exists). Serves as the INITIAL `loading`
 * state so as to NEVER flash the drop zone before the demo starts (the `useEffect` that launches
 * the analysis only runs after the first render). */
function isDemoUrl(): boolean {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo');
}

export function AnalysisPage() {
  // Starts in `loading` in demo mode → the drop zone (idle) never appears between the mount
  // and the launch of the analysis (fixes the half-second flash).
  const [status, setStatus] = useState<Status>(() =>
    isDemoUrl() ? { kind: 'loading' } : { kind: 'idle' },
  );
  const [dragOver, setDragOver] = useState(false);
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
        // Minimal observation net (PANO-63) — never network, never persisted.
        console.warn('[PanoptiCool] real export — validation failure:', result.issues);
      }
      setStatus({ kind: 'idle', error: errorMessage(result) });
    } catch {
      setStatus({ kind: 'idle', error: UI_ANALYSE.errorUnexpected });
    }
  }

  // Demo mode (`?demo`): launched on mount — same engine, synthetic source regenerated on demand.
  // The state is ALREADY `loading` (initializer above), so no flash of the drop zone.
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

  // Table of contents as chips (rendered by SiteHeader on MOBILE only, « v4 Mobile » mockup):
  // only when the results are displayed — the drop zone has no sections. The 04
  // chip is dimmed/dotted: local AI is not available on mobile (the anchor leads to
  // the callout that explains it).
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
          <ResultsView output={status.output} aiSource={status.aiSource} demo={status.demo} />
          <div style={FOOTER_WRAP}>
            <SiteFooter />
          </div>
        </>
      ) : status.kind === 'loading' ? (
        // DEDICATED loading screen (no longer the drop shell): avoids the flash of the upload
        // zone at the launch of the demo, and gives clean feedback during the analysis of an export.
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

          {/* Mobile: large touch button « Choisir mon fichier » — drag & drop does not exist with a
              finger, so we do not speak of « glisser ». Desktop: classic drop zone. */}
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
// Dedicated loading screen — centered callout, spinner (animation `pano-spin` defined in
// analyse.astro, the only place where one can put a global @keyframes for an inline style).
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
// Mobile variant of the drop zone (paddings of the « … Mobile » mockup).
const M_UPLOAD_SHELL = {
  ...UPLOAD_SHELL,
  maxWidth: '480px',
  padding: '36px 20px 48px',
} as const;
const M_TITLE = { ...TITLE, fontSize: '27px' } as const;
// MOBILE selection button (no touch drag & drop): full-width target ≥ 54 px.
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
