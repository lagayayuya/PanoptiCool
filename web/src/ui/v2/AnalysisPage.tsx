// Analysis journey (/tiktok, 2026-07-15 rework) — the page's single interactive island. Two
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
import { currentLocale } from '../../i18n/current';
import { analyzeExport } from '../../lib/engine-client';
import { UI_ANALYSE } from '../copy';
import { formatDecimal } from '../format';
import type { AiSource } from './ai-source';
import { DropScreen } from './DropScreen';
import { LoadingScreen } from './LoadingScreen';
import { NAVY } from './palette';
import { ResultsView } from './ResultsView';
import { SiteFooter } from './SiteFooter';
import { SiteHeader, type TocChip } from './SiteHeader';

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
        // DEDICATED loading screen (no longer the drop shell): avoids the flash of the upload zone
        // at the launch of the demo, and gives clean feedback during the analysis of an export.
        // ⚠ SHARED WITH THE INSTAGRAM JOURNEY since Yul asked for one wait, not two — this shape is
        // the one that was kept. It lives in `v2/LoadingScreen`.
        <LoadingScreen />
      ) : (
        // ⚠ THE DROP SCREEN IS SHARED WITH THE INSTAGRAM JOURNEY (`v2/DropScreen`). It used to live
        // here, in TikTok's colours and TikTok's menu path, while Instagram kept a landing of its
        // own — two first screens for one journey. The footer moved into it too: the page is a flex
        // column now, and the footer sits at the bottom of it rather than under the last line.
        <DropScreen
          platform="tiktok"
          onFile={(file) => handleFile(file)}
          {...(status.error !== undefined && { error: status.error })}
        />
      )}
    </div>
  );
}

// --- Styles ---------------------------------------------------------------------------------------
// ⚠ A FLEX COLUMN, and `100dvh` rather than `100vh`: the drop screen's shell takes the slack
// (`flex: 1`) so the footer lands on the bottom edge rather than under the last line. On a phone
// `100vh` counts the address bar as if it were never there, which put the footer just below the
// fold — reachable only by a scroll that has nothing left to show.
const PAGE = {
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  background: `linear-gradient(180deg, ${NAVY.bgPageTop} 0%, ${NAVY.bgPage} 340px)`,
  color: NAVY.textBright,
} as const;
const FOOTER_WRAP = {
  background: 'linear-gradient(180deg, #0a1024, #070b18)',
  padding: '0 40px 40px',
} as const;
