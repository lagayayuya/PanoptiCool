// The Instagram journey (/instagram) — the page's single interactive island.
//
// Two ways in, one analysis: a dropped `.zip` (everywhere), or the unzipped folder (Chromium only,
// because `showDirectoryPicker` exists nowhere else). Both become an `ExportSource`, and the
// connector cannot tell them apart — which is the whole reason that contract exists (ADR-0007).
//
// ⚠ THE ARCHIVE IS NEVER DECOMPRESSED WHOLE. The zip route reads the central directory and inflates
// one entry at a time from `Blob.slice()`, so a multi-gigabyte export opens and the memory bound is
// a per-entry budget rather than a guess about the machine (`blob-zip-source.ts`). The copy says
// that plainly instead of promising a number.
//
// REPORTS ARRIVE ONE BY ONE, through the connector's `onReport`, and each lights its piece in the
// rail. A page that waited for all seven would show a spinner for the whole analysis and then
// everything at once.
//
// ─── WHAT THIS ISLAND DOES NOT DO YET ───────────────────────────────────────────────────────────
//   - ⚠ ALL SIX PIECES ARE PORTED. What each one does NOT do is stated in its own header, and the
//     rail's numbering is the reader's map;
//   - THE DEMO IS A REAL ARCHIVE. `?demo` builds the synthetic persona's export in the browser and
//     hands it to the same pipeline a dropped file goes through — no injected report, no shortcut.
//     It weighs about 2.5 MB and takes a moment to write, which is why the waiting screen shows
//     while it is being built rather than after.
//
// ⚠ THE ANALYSIS RUNS IN A WORKER, and the `File` stays here. What crosses is the file REFERENCE,
// not its bytes — a `File` clone points at the same disk-backed blob — and the page keeps its own
// handle on it because the thread reader and the media resolver are on-demand paths that outlive
// the worker.

import type { ComponentType } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { BlobZipExportSource } from '../../engine/blob-zip-source';
import {
  type InstagramReport,
  makeMediaResolver,
  makeThreadReader,
  type ReadThread,
  type ReportPatch,
  type ResolveMedia,
} from '../../engine/instagram/connector';
import {
  type DirHandle,
  FsDirectoryExportSource,
  supportsDirectoryPicker,
} from '../../engine/instagram/fs-directory-source';
import { currentLocale } from '../../i18n/current';
import { type InstagramRunInput, runInstagramAnalysis } from '../../lib/instagram-client';
import { UI_IG_RAIL, UI_IG_SHELL } from '../copy.instagram';
import { SiteFooter } from '../v2/SiteFooter';
import { SiteHeader } from '../v2/SiteHeader';
import { ModuleRail, type ModuleStatus } from './ModuleRail';
// ⚠ THE SHARED SHEETS ARE LOADED HERE, by the shell, and not by the pieces that render them.
// Measured, not preferred: a CSS file imported by TWO dynamically-imported chunks is dropped from
// the build entirely — same rules, one importer → emitted; two → in no stylesheet at all, with no
// warning. So the sheet every piece needs is loaded by the one module that is always present, which
// is also what already holds the tokens. `filters.css` joined it the moment a second piece rendered
// the filter bar — and `styles.test.ts` now fails when a sheet gains a second importer, because this
// failure is silent in every other gate.
import './fichier.css';
import './filters.css';
import './kit.css';
import './shell.css';

/**
 * ⚠ MODULES LOAD LAZILY, AND IT IS THE POINT — not a page-weight optimisation. Each pulls a
 * dependency only it needs (MapLibre for the map, `three` for the space), and ADR-0007 turns on
 * none of them ever reaching the TikTok page. Statically imported, opening the identity piece would
 * download the map engine too.
 *
 * ⚠ AND IT IS DONE BY HAND RATHER THAN WITH `lazy`/`Suspense`, on a measurement: those live in
 * `preact/compat`, and importing them put 14 KB on the shell's chunk — 9 KB to 23 KB — for what a
 * dynamic import and one state hook do in ten lines. `compat` will arrive eventually (four modules
 * use `createPortal`), and when it does it will land in THOSE chunks, where their own readers pay
 * for it, rather than on every visitor to this page.
 */
/**
 * Every ported piece takes the same props — the whole patch — and reads what it needs. A per-piece
 * prop shape would mean a union here and a narrowing at every call site, to spare each module two
 * fields it ignores.
 */
export interface ModuleProps {
  report: ReportPatch;
  status: Record<string, ModuleStatus>;
  onSelect: (id: string) => void;
  /** Reads one thread's text, on demand. `undefined` until the source is open — only the AI piece
   *  uses it, and it is the only path in the product that touches message content. */
  readThread: ReadThread | undefined;
  /** Resolves a media path to bytes, on demand. `undefined` until the source is open. */
  resolveMedia: ResolveMedia | undefined;
}
type ModuleComponent = ComponentType<ModuleProps>;

/** Loaders by piece. A piece with no entry is one that has not been ported yet. */
const MODULE_LOADERS: Record<string, () => Promise<ModuleComponent>> = {
  identity: () => import('./IdentityModule').then((m) => m.IdentityModule as ModuleComponent),
  messages: () => import('./MessagesModule').then((m) => m.MessagesModule as ModuleComponent),
  ai: () => import('./AnalyseModule').then((m) => m.AnalyseModule as ModuleComponent),
  map: () => import('./MapModule').then((m) => m.MapModule as ModuleComponent),
  interactions: () => import('./SpaceModule').then((m) => m.SpaceModule as ModuleComponent),
  files: () => import('./UniverseModule').then((m) => m.UniverseModule as ModuleComponent),
};

/** What each piece needs before it can render anything at all. */
const MODULE_READY: Record<string, (r: ReportPatch) => boolean> = {
  identity: (r) => r.identity !== undefined && r.inventory !== undefined,
  messages: (r) => r.conversations !== undefined,
  ai: (r) => r.conversations !== undefined,
  map: (r) => r.geo !== undefined,
  interactions: (r) => r.relations !== undefined,
  files: (r) => r.universe !== undefined,
};

type Phase =
  | { kind: 'idle' }
  | { kind: 'reading'; progress?: { phase: string; done: number; total: number } }
  | { kind: 'error'; message: string }
  | { kind: 'ready' };

/** When fewer than this share of known field labels matched, the export is probably in a language
 *  this version does not know — and the interface must say so rather than render empty sections. */
const LOW_COVERAGE_RATIO = 0.25;

export function InstagramPage() {
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const [report, setReport] = useState<ReportPatch>({});
  const [coverage, setCoverage] = useState<InstagramReport['labelCoverage']>();
  const [geoMissing, setGeoMissing] = useState(false);
  const [active, setActive] = useState('identity');
  const [canPickFolder, setCanPickFolder] = useState(false);
  const [loaded, setLoaded] = useState<Record<string, ModuleComponent>>({});
  /** Pieces the person has opened at least once. They stay mounted; see the render. */
  const [opened, setOpened] = useState<readonly string[]>(['identity']);
  /** ⚠ KEPT AFTER THE ANALYSIS. The worker is thrown away when it finishes; the thread reader and
   *  the media resolver are on-demand paths that run here, from this same file. */
  const [source, setSource] = useState<Omit<InstagramRunInput, 'locale'>>();
  const [readThread, setReadThread] = useState<ReadThread>();
  const [resolveMedia, setResolveMedia] = useState<ResolveMedia>();

  /**
   * ⚠ A SECOND SOURCE, ON THE MAIN THREAD, and that is not a duplicate of the worker's.
   *
   * The worker's died with it. Reading one thread's text is an on-demand gesture that happens long
   * after the analysis — on a click, in the AI piece — so it needs a source that is still open. Both
   * point at the same disk-backed file; neither holds its bytes.
   *
   * It is built ONCE the first analysis has a source, not on every render: `BlobZipExportSource.open`
   * reads the archive's central directory, and doing that per render would re-read it per keystroke.
   */
  useEffect(() => {
    if (source === undefined) return;
    let alive = true;
    void (async () => {
      const s =
        source.directory !== undefined
          ? new FsDirectoryExportSource(source.directory)
          : source.file !== undefined
            ? await BlobZipExportSource.open(source.file, source.file.name)
            : null;
      // Stored behind a thunk: `setState` calls a function argument instead of storing it.
      if (alive && s !== null) {
        setReadThread(() => makeThreadReader(s));
        setResolveMedia(() => makeMediaResolver(s));
      }
    })();
    return () => {
      alive = false;
    };
  }, [source]);

  // Read after mount: on the server there is no `showDirectoryPicker`, and rendering the folder
  // button then hiding it would flash a control the person cannot use.
  useEffect(() => setCanPickFolder(supportsDirectoryPicker()), []);

  /**
   * ⚠ `?demo` BUILDS AN ARCHIVE, it does not load a report. The synthetic persona is written to a
   * zip here and dropped into the same `analyze` a real file goes through — so what the demo shows
   * is what the engine extracted, and an extractor's bug shows up in it exactly as it would on
   * someone's own export.
   *
   * The chunk is dynamic: a visitor who never asks for the demo does not download its corpus.
   */
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('demo')) return;
    let alive = true;
    setPhase({ kind: 'reading' });
    void import('../../demo/instagram/export').then(({ buildInstagramDemoExport }) => {
      if (!alive) return;
      const { bytes, fileName } = buildInstagramDemoExport(currentLocale());
      const file = new File([bytes.slice().buffer as ArrayBuffer], fileName, {
        type: 'application/zip',
      });
      analyze({ file });
    });
    return () => {
      alive = false;
    };
  }, []);

  // Fetches the active piece's chunk once, the first time it is opened. A failed import leaves the
  // placeholder standing rather than blanking the page — the rest of the dossier is still readable.
  useEffect(() => {
    setOpened((prev) => (prev.includes(active) ? prev : [...prev, active]));
  }, [active]);

  useEffect(() => {
    const load = MODULE_LOADERS[active];
    if (load === undefined || loaded[active] !== undefined) return;
    let cancelled = false;
    void load().then((Component) => {
      if (!cancelled) setLoaded((prev) => ({ ...prev, [active]: Component }));
    });
    return () => {
      cancelled = true;
    };
  }, [active, loaded]);

  const analyze = useCallback((input: Omit<InstagramRunInput, 'locale'>) => {
    setPhase({ kind: 'reading' });
    setReport({});
    setSource(input);

    void runInstagramAnalysis(
      { ...input, locale: currentLocale() },
      {
        onProgress: (progress) => setPhase({ kind: 'reading', progress }),
        onReport: (patch) => {
          setReport((prev) => ({ ...prev, ...patch }));
          // The first piece to land ends the waiting screen: the reader can start on the dossier
          // while the rest is still being built.
          setPhase({ kind: 'ready' });
        },
        // The geo database is optional (`NOTICE`). Its absence costs the map its inferred layer and
        // nothing else — announced BEFORE the analysis, so the notice is on screen while the
        // parsing runs rather than appearing once the map is already there without a layer.
        onGeoDatabase: (available) => setGeoMissing(!available),
        onCoverage: setCoverage,
        onError: (stage) =>
          setPhase({
            kind: 'error',
            message:
              stage === 'wrong_platform'
                ? UI_IG_SHELL.errorNotInstagram
                : stage === 'worker'
                  ? UI_IG_SHELL.errorWorker
                  : UI_IG_SHELL.errorUnreadable,
          }),
      },
    );
  }, []);

  const openFolder = useCallback(() => {
    const picker = (globalThis as { showDirectoryPicker?: () => Promise<DirHandle> })
      .showDirectoryPicker;
    if (picker === undefined) return;
    void picker()
      .then((directory) => analyze({ directory }))
      // A cancelled picker is not an error: the person changed their mind, and an error pane
      // would tell them they did something wrong.
      .catch(() => undefined);
  }, [analyze]);

  const status: Record<string, ModuleStatus> = {
    identity: report.identity && report.inventory ? 'ready' : 'loading',
    // ⚠ BOTH REPORTS, for the map: the places come from geo, the raw matter of the detail view from
    // the identity anchors. Announcing it ready on one source would open a piece missing its last
    // floor.
    map: report.geo && report.identity ? 'ready' : 'loading',
    messages: report.conversations ? 'ready' : 'loading',
    interactions: report.relations ? 'ready' : 'loading',
    files: report.universe ? 'ready' : 'loading',
    ai: report.conversations ? 'ready' : 'loading',
  };

  const lowCoverage =
    coverage !== undefined && coverage.matched < coverage.total * LOW_COVERAGE_RATIO;

  return (
    <div class="ig-shell">
      <SiteHeader badge={UI_IG_SHELL.badgeReal} />
      <main class="ig-stage">
        {phase.kind === 'idle' && (
          <div class="ig-landing">
            <p class="ig-kicker">{UI_IG_SHELL.kicker}</p>
            <h1 class="ig-title">
              {UI_IG_SHELL.titleLead}
              <span class="ig-stamp">{UI_IG_SHELL.titlePlatform}</span>
              {UI_IG_SHELL.titleTail}
            </h1>
            <p class="ig-lede">{UI_IG_SHELL.lede}</p>

            <div class="ig-actions">
              {/* ⚠ THE INPUT IS A TRANSPARENT OVERLAY, NOT `display: none`. A hidden input is not
                  reliably activated by its label across engines, and this is the same pattern the
                  TikTok drop zone has always used (`AnalysisPage`'s `FILE_INPUT`). Reported: the
                  first pick did nothing, the second worked. */}
              <label class="ig-btn-primary ig-file-label">
                {UI_IG_SHELL.openZip}
                <input
                  type="file"
                  // Not `.zip` alone: macOS reports some archives with a MIME the extension filter
                  // then hides, and a picker that greys out the right file is indistinguishable
                  // from one that is broken.
                  accept=".zip,application/zip,application/x-zip-compressed"
                  class="ig-file-input"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    e.currentTarget.value = '';
                    if (file !== undefined) analyze({ file });
                  }}
                />
              </label>
              {canPickFolder && (
                <button type="button" class="ig-btn-ghost" onClick={openFolder}>
                  {UI_IG_SHELL.openFolder}
                </button>
              )}
            </div>

            <p class="ig-size-note">{UI_IG_SHELL.sizeNote}</p>
            {canPickFolder && <p class="ig-hint">{UI_IG_SHELL.folderHint}</p>}

            <ul class="ig-guarantees">
              {UI_IG_SHELL.guarantees.map((g) => (
                <li key={g}>
                  <span class="ig-dot" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}

        {phase.kind === 'reading' && (
          <div class="ig-analysing">
            <p class="ig-kicker">{UI_IG_SHELL.analysingKicker}</p>
            <div class="ig-phase">{phase.progress?.phase ?? UI_IG_SHELL.analysingKicker}</div>
            <div class="ig-progress-track">
              <div
                class="ig-progress-fill"
                style={{
                  // No total yet means no percentage to show — a bar at 0 reads as stuck, and a
                  // bar at a made-up figure lies. A short fixed sliver says « started ».
                  width:
                    phase.progress && phase.progress.total > 0
                      ? `${Math.round((phase.progress.done / phase.progress.total) * 100)}%`
                      : '18%',
                }}
              />
            </div>
            <div class="ig-progress-meta">
              {phase.progress && phase.progress.total > 0
                ? `${phase.progress.done} / ${phase.progress.total}`
                : '…'}
            </div>
            <p class="ig-hint">{UI_IG_SHELL.analysingSub}</p>
          </div>
        )}

        {phase.kind === 'error' && (
          <div class="ig-error">
            <p class="ig-kicker">{UI_IG_SHELL.errorKicker}</p>
            <p class="ig-error-msg">{phase.message}</p>
            <button type="button" class="ig-btn-primary" onClick={() => setPhase({ kind: 'idle' })}>
              {UI_IG_SHELL.errorRetry}
            </button>
          </div>
        )}

        {phase.kind === 'ready' && (
          <>
            {lowCoverage && coverage !== undefined && (
              <div class="ig-notice ig-notice-warn" role="status">
                <span aria-hidden="true">▲</span>
                <span>
                  {UI_IG_SHELL.lowCoverage(String(coverage.matched), String(coverage.total))}
                </span>
              </div>
            )}
            {geoMissing && (
              <div class="ig-notice ig-notice-info" role="status">
                <span aria-hidden="true">●</span>
                <span>{UI_IG_SHELL.noGeoDatabase}</span>
              </div>
            )}
            <div class="ig-dashboard">
              <ModuleRail active={active} status={status} onSelect={setActive} />
              <section class="ig-module">
                {/* The placeholder covers both « not ported yet » and « its chunk is still on the
                    wire »: from where the reader sits those look the same, and distinguishing them
                    would mean explaining our build to them. */}
                {/* ⚠ EVERY PIECE ALREADY OPENED STAYS MOUNTED, hidden rather than unmounted.
                    Unmounting destroys a WebGL scene, a MapLibre map with the zoom and framing the
                    person just set, every decoded thumbnail and every camera position — so coming
                    back rebuilt all of it and the piece « reloaded » on each click of the rail. The
                    prototype hides for exactly this reason. `hidden` takes it out of the flow AND
                    out of the accessibility tree, which `display:none` from a class would do
                    without saying so in the markup. */}
                {opened.map((id) => (
                  <div key={id} hidden={id !== active} class="ig-piece">
                    <ActiveModule
                      Component={loaded[id]}
                      id={id}
                      report={report}
                      status={status}
                      onSelect={setActive}
                      readThread={readThread}
                      resolveMedia={resolveMedia}
                    />
                  </div>
                ))}
              </section>
            </div>
          </>
        )}
      </main>
      <div style={{ padding: '0 40px 40px' }}>
        <SiteFooter />
      </div>
    </div>
  );
}

/** Renders the active piece when its chunk AND its reports are both there. */
function ActiveModule({
  Component,
  id,
  report,
  status,
  onSelect,
  readThread,
  resolveMedia,
}: {
  Component: ModuleComponent | undefined;
  id: string;
  report: ReportPatch;
  status: Record<string, ModuleStatus>;
  onSelect: (id: string) => void;
  readThread: ReadThread | undefined;
  resolveMedia: ResolveMedia | undefined;
}) {
  // ⚠ A PIECE WAITS FOR ALL ITS REPORTS, not just one. The identity piece reads the anchors AND
  // the inventory's counts; half of them renders a card with holes in it, which looks like an
  // export that is missing something rather than an analysis still running.
  const ready = MODULE_READY[id];
  if (Component === undefined || ready === undefined || !ready(report)) {
    return <Placeholder id={id} />;
  }
  return (
    <Component
      report={report}
      status={status}
      onSelect={onSelect}
      readThread={readThread}
      resolveMedia={resolveMedia}
    />
  );
}

/** A piece that has not been ported yet, or whose chunk is still loading. */
function Placeholder({ id }: { id: string }) {
  return (
    <div class="ig-placeholder">
      <span class="ig-placeholder-title">{UI_IG_RAIL.items.find((i) => i.id === id)?.label}</span>
      <span>{UI_IG_RAIL.comingSoon}</span>
    </div>
  );
}
