// Section 04 « Analyser avec une IA locale » (« guided journey » mockup, 2026-07-20 iteration) —
// two cards: « 1 · Installer » (system, terminal, model, route choice) and « 2 · Prompt &
// lancement » (merge of the ex-cards 2 and 3).
//
// Three invariants hold this section (PANO-45):
//   - OPT-IN: nothing goes to the model before an explicit click on « Lancer l'analyse ».
//   - LOCAL: the only recipient is the `llama.cpp` server the user runs on THEIR
//     machine (localhost by default). No network call elsewhere — the repo's invariant holds.
//   - MINIMALISM (yuya's decision, benchmark 12/07): the model receives the raw items, nothing else. No
//     channel selection, no aggregates, no D2 themes in the prompt — each of these additions
//     DEGRADED the quality in the benchmark. Do not reintroduce them without a new benchmark.
//
// The 2026-07-20 iteration adds three discriminations, all in service of ADR-0006:
//   - the BROWSER is named (UA, `ai/browser.ts`): the entry banner says in advance what
//     its engine allows — Firefox will ask, Chromium requires the padlock, WebKit cannot. The ex-
//     pill « bloqué par le navigateur » disappears: it also showed without certainty;
//   - TWO ROUTES: A « Depuis ce site » (the ex-journey, unavailable under WebKit) and B « Tout sur
//     ta machine » (site zip + `llama-server --path`, ADR-0006 decision 5);
//   - the LOCALHOST MODE: if the page is served from the local loop and the server responds,
//     the installation has nothing left to say — « Tout est prêt » and card 2 is active.
//
// Two choices of the 2026-07-15 rework (yuya's decisions), unchanged:
//   - NO MORE RAM selector: the launch command ALWAYS proposes `-c 32768`
//     (`SUGGESTED_CONTEXT`). At runtime, `/props` (the server's real window) prevails.
//   - an explicit ⟳ « revérifier » button (mockup).

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { type BrowserInfo, detectBrowser } from '../../ai/browser';
import {
  DEFAULT_CONTEXT_WINDOW,
  detectOs,
  installCommand,
  localSiteCommand,
  MODEL_CHOICES,
  type ModelChoice,
  type Os,
  SITE_ZIP_NAME,
  serveCommand,
  serverUrl,
} from '../../ai/install-help';
import type { AiItem } from '../../ai/items';
import { countAiItems } from '../../ai/items';
import { extractAiItemsInWorker } from '../../ai/items-client';
import {
  countRealPromptTokens,
  type InterruptFlag,
  probeLlamaCpp,
  runLlamaCppStream,
} from '../../ai/llama-client';
import { type LocalNetworkGate, localNetworkGate } from '../../ai/local-network';
import {
  buildSystemPrompt,
  buildUserMessage,
  calibrateCharsPerToken,
  DEFAULT_CHARS_PER_TOKEN,
  type ExactSelection,
  estimateTokens,
  itemsBudget,
  type PromptMode,
  type Selection,
  selectItemsForBudget,
  selectItemsForBudgetExact,
} from '../../ai/prompt';
import { currentLocale } from '../../i18n/current';
import { UI_AI, UI_AI_LEARN, UI_AI_MOBILE, UI_BRAND } from '../copy';
import { formatDecimal, formatFixedDecimal } from '../format';
import type { AiSource } from './ai-source';
import { LearnPanel, LearnToggle } from './LearnPanel';
import { LOW_DATA_THRESHOLD } from './NoDeductionCard';
import { MONO, NAVY } from './palette';

/** Context window SUGGESTED in the copyable command (yuya's decision, 2026-07-15 rework).
 * `/props` always prevails at runtime once the server is reached. */
const SUGGESTED_CONTEXT = 32768;

/** Where Homebrew installs — a URL is not prose, it lives with the component. */
const BREW_URL = 'https://brew.sh';

type ItemsStatus =
  | { kind: 'loading' }
  | { kind: 'ready'; items: AiItem[] }
  | { kind: 'error'; message: string };

type ProbeStatus =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'ok'; modelId: string | null; contextWindow: number | null }
  /** The failure carries ONLY `gate`, and that is a decision. The `fetch` message was kept here
   * without any render reading it — yet it equals « Failed to fetch » whatever the cause
   * (ADR-0006, measured). A constant string distinguishes nothing: keeping it amounted to storing
   * noise and believing one kept evidence. What informs is the permission. */
  | { kind: 'error'; gate: LocalNetworkGate };

type Verification =
  | { kind: 'unchecked' }
  | { kind: 'checking' }
  | { kind: 'exact'; selection: ExactSelection }
  | { kind: 'unavailable' };

/** What the page knows of its ENVIRONMENT — detected once at first render, correctable by
 * hand for the OS (« ton système » buttons). A state OBJECT rather than three direct reads of
 * `navigator`: the interface golden seeds its states by the shape of the initializer, and an object
 * with a `browser` key is replaced without touching the others. */
interface AiEnv {
  os: Os;
  browser: BrowserInfo;
  /** The page is served from the local loop (route B completed, or dev). ADR-0006's walls
   * then do NOT exist: same origin or loopback → loopback, exempted by the three engines. */
  localhost: boolean;
  /** The origin to probe when `localhost` — the server that just served the page. */
  origin: string | null;
}

function detectAiEnv(): AiEnv {
  const nav = globalThis.navigator;
  const loc = globalThis.location;
  const localhost = loc !== undefined && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(loc.hostname);
  return {
    os: detectOs(nav?.userAgent ?? ''),
    browser: detectBrowser(nav?.userAgent ?? '', nav !== undefined && 'brave' in nav),
    localhost,
    origin: localhost ? loc.origin : null,
  };
}

type RouteChoice = 'site' | 'local';

interface RunState {
  text: string;
  running: boolean;
  interrupted: boolean;
  promptTokens: number;
  completionTokens: number;
  elapsedMs: number;
}

const EMPTY_RUN: RunState = {
  text: '',
  running: false,
  interrupted: false,
  promptTokens: 0,
  completionTokens: 0,
  elapsedMs: 0,
};

// The WHOLE command zone copies on click (yuya's request): the row is a `<button>`, and
// the « copier / copié ✓ » label is now only a `<span>` — no more button inside the button, no
// more hover effect on this label. The hover stays on the whole row (`hv-bd`), which IS
// the clickable target.
function CommandLine({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      class="hv-bd"
      style={CMD_ROW}
      aria-label={UI_AI.copyCommandAria}
      onClick={() => {
        void navigator.clipboard?.writeText(command).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      <span style={CMD_TEXT}>{command}</span>
      <span style={{ ...COPY_BTN, color: copied ? NAVY.ok : '#93a0bf' }}>
        {copied ? UI_AI.copyButtonDone : UI_AI.copyButton}
      </span>
    </button>
  );
}

function StepTitle({ n, label }: { n: string; label: string }) {
  return (
    <>
      <span style={STEP_N}>{n}</span>
      <span style={STEP_LABEL}>{label}</span>
    </>
  );
}

export function AiSection({ source }: { source: AiSource }) {
  // The page's language, read ONCE: it decides the system prompt, thus the language of the
  // model's response — nothing else fixes it server-side (cf. `ai/prompt.ts`).
  const locale = currentLocale();
  const [items, setItems] = useState<ItemsStatus>({ kind: 'loading' });
  const [env] = useState<AiEnv>(detectAiEnv());
  const [osSel, setOsSel] = useState<Os | null>(null);
  // An object with a `choice` key (not a bare string): the golden's seeding recognizes its targets by the
  // SHAPE of the initializer, and `null` is the shape of other states of this section.
  const [route, setRoute] = useState<{ choice: RouteChoice | null }>({ choice: null });
  const [url, setUrl] = useState(env.origin ?? serverUrl());
  const [probe, setProbe] = useState<ProbeStatus>({ kind: 'idle' });
  // In localhost mode, the probe goes off ON ITS OWN (initial nonce 1): the probed server is the one that
  // just served the page — the contact does not precede the intention, it follows it (the person
  // launched this server and typed its address). Outside localhost, nothing goes out before the click (ADR-0006:
  // probing at load was discarded there, and the reason still holds).
  const [probeNonce, setProbeNonce] = useState(env.localhost ? 1 : 0);
  const [mode, setMode] = useState<PromptMode>('default');
  const [editedPrompt, setEditedPrompt] = useState<string | null>(null);
  const [charsPerToken, setCharsPerToken] = useState(DEFAULT_CHARS_PER_TOKEN);
  const [run, setRun] = useState<RunState>(EMPTY_RUN);
  const [error, setError] = useState<string | null>(null);
  const [choice, setChoice] = useState<ModelChoice>(MODEL_CHOICES[0] as ModelChoice);
  const [verification, setVerification] = useState<Verification>({ kind: 'unchecked' });
  const [payloadOpen, setPayloadOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [termOpen, setTermOpen] = useState(false);

  const interruptFlag = useRef<InterruptFlag>({ interrupted: false });
  const abortRef = useRef<AbortController | null>(null);

  // Item extraction as soon as the section shows (local worker, nothing goes out — the opt-in bears on the SEND).
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const bytes = await source();
        const result = await extractAiItemsInWorker(bytes);
        if (cancelled) return;
        setItems(
          result.ok
            ? { kind: 'ready', items: result.items }
            : { kind: 'error', message: result.error },
        );
      } catch (err) {
        if (!cancelled)
          setItems({ kind: 'error', message: err instanceof Error ? err.message : String(err) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  // Server probe — NEVER on mount: only on explicit request (`probeNonce > 0`),
  // then at each address change. Probing on display would send a `fetch` toward localhost
  // without anyone asking for it. Nothing leaks (localhost does not leave the device), but a
  // tool that shows surveillance cannot contact a machine without being asked to.
  //
  // This deferral GUARANTEES NO PERMISSION WINDOW. It promised so for a long time, and it is false:
  // the browser alone decides whether it asks anything, and some never ask
  // (ADR-0006). What the deferral holds, for its part, is intact — the first contact follows an intention,
  // and it is at this spot that the interface explains what to do when the browser, for its part, stays silent.
  useEffect(() => {
    if (probeNonce === 0) return; // not yet requested — we touch nothing
    let cancelled = false;
    setProbe({ kind: 'checking' });
    void (async () => {
      const result = await probeLlamaCpp(url);
      if (cancelled) return;
      if (result.ok) {
        setProbe({ kind: 'ok', modelId: result.modelId, contextWindow: result.contextWindow });
        return;
      }
      // The permission is only read on FAILURE: when the server responds, there is nothing to
      // explain, and a useless read is one read too many.
      const gate = await localNetworkGate();
      if (!cancelled) setProbe({ kind: 'error', gate });
    })();
    return () => {
      cancelled = true;
    };
  }, [url, probeNonce]);

  // The server's REAL context (`/props`) — never a guess once the server is reached.
  const contextWindow =
    (probe.kind === 'ok' ? probe.contextWindow : null) ?? DEFAULT_CONTEXT_WINDOW;
  const allItems = items.kind === 'ready' ? items.items : [];

  const heuristicSelection = useMemo(() => {
    const budget = itemsBudget(contextWindow, buildSystemPrompt(locale, mode, true), charsPerToken);
    return selectItemsForBudget(allItems, budget, charsPerToken);
  }, [allItems, contextWindow, mode, charsPerToken, locale]);

  // EXACT selection verified by the server (/apply-template + /tokenize).
  useEffect(() => {
    if (probe.kind !== 'ok' || allItems.length === 0) {
      setVerification({ kind: 'unchecked' });
      return;
    }
    let cancelled = false;
    setVerification({ kind: 'checking' });
    void selectItemsForBudgetExact(
      allItems,
      contextWindow,
      (includesSearches) => buildSystemPrompt(locale, mode, includesSearches),
      (sys, user) => countRealPromptTokens(url, sys, user),
    ).then((result) => {
      if (cancelled) return;
      setVerification(result ? { kind: 'exact', selection: result } : { kind: 'unavailable' });
    });
    return () => {
      cancelled = true;
    };
  }, [allItems, contextWindow, mode, probe.kind, url, locale]);

  const selection: Selection =
    verification.kind === 'exact' ? verification.selection : heuristicSelection;

  const includesSearches = selection.items.some((i) => i.kind === 'search');
  const defaultPrompt = buildSystemPrompt(locale, mode, includesSearches);
  const systemPrompt = editedPrompt ?? defaultPrompt;
  const userMessage = useMemo(() => buildUserMessage(selection.items), [selection.items]);

  const estimatedTokens =
    verification.kind === 'exact'
      ? verification.selection.promptTokens
      : estimateTokens(systemPrompt, charsPerToken) + estimateTokens(userMessage, charsPerToken);
  const tokensAreExact = verification.kind === 'exact';
  const counts = countAiItems(allItems);
  const sentCounts = countAiItems(selection.items);
  // « peu de données » edge case (CasPeuDeDonnees mockup): below LOW_DATA_THRESHOLD items,
  // each sentence weighs too heavily — the model over-interprets. We WARN (banner + tinted
  // counter + reminder at step 3) without ever blocking the launch: hypothesis, not portrait.
  const lowData = items.kind === 'ready' && allItems.length < LOW_DATA_THRESHOLD;
  const canRun =
    probe.kind === 'ok' &&
    selection.items.length > 0 &&
    !run.running &&
    verification.kind !== 'checking';
  const tokPerSec =
    !run.running && run.elapsedMs > 0 && run.completionTokens > 0
      ? formatDecimal(run.completionTokens / (run.elapsedMs / 1000))
      : null;

  function selectMode(next: PromptMode): void {
    setMode(next);
    setEditedPrompt(null);
  }

  async function launch(): Promise<void> {
    if (!canRun) return;
    setError(null);
    setRun({ ...EMPTY_RUN, running: true });
    interruptFlag.current = { interrupted: false };
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const result = await runLlamaCppStream(
        url,
        systemPrompt,
        userMessage,
        (delta) => setRun((r) => ({ ...r, text: r.text + delta })),
        controller,
        interruptFlag.current,
      );
      setRun({ ...result, running: false });
      const calibrated = calibrateCharsPerToken(
        systemPrompt.length + userMessage.length,
        result.promptTokens,
      );
      if (calibrated !== null) setCharsPerToken(calibrated);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setRun((r) => ({ ...r, running: false }));
    } finally {
      abortRef.current = null;
    }
  }

  function stop(): void {
    interruptFlag.current.interrupted = true;
    abortRef.current?.abort();
  }

  // --- Environment: OS (correctable), browser, localhost mode --------------------------------------
  const os = osSel ?? env.os;
  const osLabel: Record<Os, string> = { macos: 'macOS', windows: 'Windows', linux: 'Linux' };
  const browser = env.browser;
  const browserName = browser.name ?? UI_AI.browserFallbackName;
  // On the local loop, ADR-0006's walls do NOT exist (origin = target = localhost, exempted
  // by the three engines): every browser is compatible there, and the red/green banner — which
  // only speaks of remote HTTPS origins — has nothing to say. yuya verified the behavior, so we
  // re-hide the banner when the hostname is localhost.
  const compat = env.localhost || browser.engine !== 'webkit';
  const effRoute: RouteChoice = compat ? (route.choice ?? 'site') : 'local';
  const localMode = env.localhost && probe.kind === 'ok';
  const promptActive = !(effRoute === 'local' && !localMode);

  const install = installCommand(os);
  const serve = serveCommand(choice, SUGGESTED_CONTEXT);
  const localCmd = localSiteCommand(os, choice, SUGGESTED_CONTEXT);

  /** The entry banner — the discourse per ENGINE (ADR-0006): two work, one is a wall, and
   * the unknown is assigned no cause. `null` on localhost: no wall, nothing to warn about. */
  const banner = env.localhost
    ? null
    : browser.engine === 'firefox'
      ? { ok: true, title: UI_AI.bwCompatTitle(browserName), text: UI_AI.bwCompatTextFirefox }
      : browser.engine === 'chromium'
        ? { ok: true, title: UI_AI.bwCompatTitle(browserName), text: UI_AI.bwCompatTextChromium }
        : browser.engine === 'webkit'
          ? {
              ok: false,
              title: UI_AI.bwBlockedTitle(browserName),
              text: UI_AI.bwBlockedText(browserName),
            }
          : { ok: false, title: UI_AI.bwUnknownTitle, text: UI_AI.bwUnknownText };

  /** The permission note BEFORE the first click (route A) — Firefox will open a window, Chromium
   * never, and localhost has no permission to ask (`null`). */
  const permNote = env.localhost
    ? null
    : browser.engine === 'firefox'
      ? UI_AI.permNoteFirefox(browserName)
      : browser.engine === 'chromium'
        ? UI_AI.permNoteChromium(browserName)
        : UI_AI.permNoteGeneric;

  /** The failure help, chosen on what we KNOW (ADR-0006, decisions 2-4): the read permission
   * first, the recognized engine next — never a cause asserted without evidence. On localhost,
   * no wall is possible: a failure is an absence. */
  const probeFailureHelp = (gate: LocalNetworkGate): string => {
    if (env.localhost || gate === 'granted') return UI_AI.step3WarnAbsent;
    if (gate === 'blocked') return UI_AI.step3WarnBlocked;
    return browser.engine === 'firefox' ? UI_AI.step3WarnFirefox : UI_AI.step3WarnUnknown;
  };

  /** The pill now says only what we KNOW: « non détecté » when the network was really
   * reached (permission granted, or local loop), « connexion impossible » otherwise. The detailed
   * diagnosis lives in `probeFailureHelp`. */
  const serverStatus =
    probe.kind === 'ok'
      ? { color: NAVY.ok, label: UI_AI.probeOk }
      : probe.kind === 'checking'
        ? { color: '#93a0bf', label: UI_AI.probeChecking }
        : probe.kind === 'idle'
          ? { color: '#93a0bf', label: UI_AI.probeIdle }
          : {
              color: NAVY.risk,
              label:
                env.localhost || probe.gate === 'granted'
                  ? UI_AI.probeErrorAbsent
                  : UI_AI.probeErrorUnknown,
            };

  return (
    <div id="sec-ia" style={BAND}>
      <div style={SHELL}>
        <div style={HEAD}>
          {/* Numbered like 01–03 above: this band is the page's fourth step, not a product of its
              own — it used to open on a kicker of its own instead. */}
          <div style={TITLE_ROW}>
            <span style={SEC_N}>{UI_AI.sectionNumber}</span>
            <span style={TITLE}>{UI_AI.title}</span>
            <span style={LOCAL_BADGE}>{UI_AI.localBadge}</span>
            <span style={HEAD_SPACER} />
            <LearnToggle
              open={learnOpen}
              label={UI_AI.learnLabel}
              onToggle={() => setLearnOpen(!learnOpen)}
            />
          </div>
          <p style={LEDE}>{UI_AI.lede}</p>
        </div>

        {/* « peu de données » banner (CasPeuDeDonnees mockup) — before the 3 steps. */}
        {lowData && (
          <div style={LOW_DATA_BANNER} role="status">
            <span style={LOW_DATA_ICON} aria-hidden="true">
              ▲
            </span>
            <div style={BANNER_COL}>
              <span style={LOW_DATA_TITLE}>
                {UI_AI.lowDataCounts(counts.comments, counts.searches)}
              </span>
              <span style={LOW_DATA_TEXT}>{UI_AI.lowDataText(LOW_DATA_THRESHOLD)}</span>
            </div>
          </div>
        )}

        {learnOpen && <LearnPanel question={UI_AI_LEARN.question} columns={UI_AI_LEARN.columns} />}

        {/* --- Browser banner (ADR-0006: the discourse per engine, BEFORE any installation).
            `null` on localhost — no wall to warn about. -- */}
        {banner !== null && (
          <div style={banner.ok ? BANNER_OK : BANNER_WARN} role="status">
            <span
              style={{ ...BANNER_ICON, color: banner.ok ? NAVY.ok : NAVY.risk }}
              aria-hidden="true"
            >
              {banner.ok ? '✓' : '▲'}
            </span>
            <div style={BANNER_COL}>
              <span style={{ ...BANNER_TITLE, color: banner.ok ? '#bfe9cd' : NAVY.riskText }}>
                {banner.title}
              </span>
              <span style={{ ...BANNER_TEXT, color: banner.ok ? '#9ec7ac' : '#d9a894' }}>
                {banner.text}
              </span>
            </div>
          </div>
        )}

        {/* --- Card 1: install -------------------------------------------------------------------- */}
        <div style={STEP_CARD}>
          <div style={STEP_HEAD}>
            <StepTitle n="1" label={UI_AI.step1Label} />
            <span style={HEAD_SPACER} />
          </div>

          {/* The OS picker leaves the title row and takes its own, with the terminal disclosure
              pushed to its right end. Two reasons: at 22 px the step title no longer shares a line
              with three buttons, and the picker only means something when there IS something to
              install — in local mode the whole row is moot, so it does not render. */}
          {!localMode && (
            <div style={OS_PICK_ROW}>
              <span style={OS_PICK_LABEL}>{UI_AI.osPickLabel}</span>
              <div style={OS_BTN_GROUP}>
                {(['macos', 'windows', 'linux'] as const).map((o) => (
                  <button
                    type="button"
                    key={o}
                    class="hv-bd"
                    style={o === os ? OS_BTN_ON : OS_BTN}
                    onClick={() => setOsSel(o)}
                  >
                    {osLabel[o]}
                  </button>
                ))}
              </div>
              <span style={HEAD_SPACER} />
              <button
                type="button"
                class="hl-btn"
                style={TERM_BTN}
                aria-expanded={termOpen}
                onClick={() => setTermOpen(!termOpen)}
              >
                {termOpen ? UI_AI.termOpened : UI_AI.termClosed}
              </button>
            </div>
          )}

          {localMode ? (
            /* Route B completed (or dev): the page AND the model are served from the machine — there
               is literally nothing to install. */
            <div style={READY_BOX} role="status">
              <span style={{ ...BANNER_ICON, color: NAVY.ok }} aria-hidden="true">
                ✓
              </span>
              <div style={BANNER_COL}>
                <span style={{ ...BANNER_TITLE, color: '#bfe9cd' }}>{UI_AI.readyTitle}</span>
                <span style={{ ...BANNER_TEXT, color: '#9ec7ac' }}>{UI_AI.readyText}</span>
              </div>
            </div>
          ) : (
            <>
              {/* v5 turns the disclosure into a two-column panel of the same family as the
                  educational ones: the button sits in the row above (beside the OS picker) and
                  what it opens is a panel, not a box wrapped around its own trigger. */}
              {termOpen && (
                <div class="hl-learn" style={TERM_BOX}>
                  <span style={TERM_TITLE}>{UI_AI.termPanelTitle}</span>
                  <div style={TERM_GRID}>
                    <div style={TERM_COL}>
                      <span style={TERM_COL_TITLE}>{UI_AI.termWhatTitle}</span>
                      <span style={TERM_TEXT}>{UI_AI.termIntro}</span>
                    </div>
                    <div style={TERM_COL}>
                      <span style={TERM_COL_TITLE}>{UI_AI.termHowTitle(osLabel[os])}</span>
                      <span style={TERM_TEXT}>{UI_AI.termHows[os]}</span>
                    </div>
                  </div>
                </div>
              )}

              <div style={SUB_ROW}>
                <span style={SUB_N}>1</span>
                <div style={SUB_BODY}>
                  <span style={STEP_TEXT}>{UI_AI.step1InstallText}</span>
                  <CommandLine command={install} />
                  {os !== 'windows' && (
                    <span style={STEP_FOOT}>
                      {UI_AI.brewNoteLead}
                      <a
                        href={BREW_URL}
                        target="_blank"
                        rel="noreferrer"
                        class="hv-a"
                        style={FOOT_LINK}
                      >
                        {UI_AI.brewNoteLinkLabel}
                      </a>
                      {UI_AI.brewNoteAfter}
                    </span>
                  )}
                </div>
              </div>

              <div style={SUB_ROW}>
                <span style={SUB_N}>2</span>
                <div style={SUB_BODY}>
                  <span style={STEP_TEXT}>{UI_AI.step1ChooseText}</span>
                  <div style={MODEL_GRID}>
                    {MODEL_CHOICES.map((m) => {
                      const sel = m.quant === choice.quant;
                      return (
                        <button
                          type="button"
                          key={m.quant}
                          class="hv-bd"
                          style={sel ? MODEL_BTN_ON : MODEL_BTN}
                          onClick={() => setChoice(m)}
                        >
                          <span
                            style={{
                              ...MODEL_Q,
                              color: sel ? NAVY.accentBright : NAVY.textSecondary,
                            }}
                          >
                            {m.quant}
                          </span>
                          <span style={MODEL_SIZE}>
                            {UI_AI.modelSize(formatFixedDecimal(m.sizeGb))}
                          </span>
                          {m.note !== undefined && (
                            <span
                              style={{
                                ...MODEL_NOTE,
                                color: m.note === 'recommended' ? NAVY.accent : '#e6b6a3',
                              }}
                            >
                              {UI_AI.modelNotes[m.note]}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={SUB_ROW}>
                <span style={SUB_N}>3</span>
                <div style={SUB_BODY}>
                  <span style={STEP_TEXT}>{UI_AI.routeIntro}</span>
                  <div style={ROUTE_GRID}>
                    <button
                      type="button"
                      class="hv-bd"
                      aria-disabled={!compat}
                      style={
                        !compat ? ROUTE_BTN_OFF : effRoute === 'site' ? ROUTE_BTN_ON : ROUTE_BTN
                      }
                      onClick={() => {
                        if (compat) setRoute({ choice: 'site' });
                      }}
                    >
                      <span
                        style={{
                          ...ROUTE_TITLE,
                          color: effRoute === 'site' ? NAVY.accentBright : NAVY.textSecondary,
                        }}
                      >
                        {UI_AI.routeSiteTitle}
                      </span>
                      <span style={ROUTE_TEXT}>{UI_AI.routeSiteText}</span>
                      {!compat && (
                        <span style={ROUTE_UNAVAIL}>{UI_AI.routeSiteUnavailable(browserName)}</span>
                      )}
                    </button>
                    <button
                      type="button"
                      class="hv-bd"
                      style={effRoute === 'local' ? ROUTE_BTN_ON : ROUTE_BTN}
                      onClick={() => setRoute({ choice: 'local' })}
                    >
                      <span
                        style={{
                          ...ROUTE_TITLE,
                          color: effRoute === 'local' ? NAVY.accentBright : NAVY.textSecondary,
                        }}
                      >
                        {UI_AI.routeLocalTitle}
                      </span>
                      <span style={ROUTE_TEXT}>{UI_AI.routeLocalText}</span>
                    </button>
                  </div>
                </div>
              </div>

              {effRoute === 'site' && (
                <>
                  <div style={SUB_ROW}>
                    <span style={SUB_N}>4</span>
                    <div style={SUB_BODY}>
                      <span style={STEP_TEXT}>{UI_AI.step1ServeText}</span>
                      <CommandLine command={serve} />
                    </div>
                  </div>
                  <div style={ADDR_BLOCK}>
                    {permNote !== null && <div style={NOTE_BOX}>{permNote}</div>}
                    <div style={ADDR_ROW}>
                      <span style={ADDR_LABEL}>{UI_AI.step1AddressLabel}</span>
                      <input
                        type="text"
                        value={url}
                        spellcheck={false}
                        aria-label={UI_AI.step1AddressAria}
                        style={ADDR_INPUT}
                        onInput={(e) => setUrl(e.currentTarget.value)}
                      />
                      <div style={STATUS_GROUP}>
                        <div style={{ ...STATUS_DOT, background: serverStatus.color }} />
                        <span style={{ ...STATUS_LABEL, color: serverStatus.color }}>
                          {serverStatus.label}
                          {probe.kind === 'ok' && probe.modelId !== null
                            ? UI_AI.probeModelSuffix(probe.modelId)
                            : ''}
                        </span>
                        {/* The action spells out its name in full, before AS WELL AS after the
                            first probe (2026-07-20 retouch: no more ⟳ glyph) — it is it
                            that triggers any contact with localhost. */}
                        <button
                          type="button"
                          class="hv-cy"
                          aria-label={UI_AI.probeCheckAria}
                          style={RECHECK_BTN}
                          onClick={() => setProbeNonce((n) => n + 1)}
                        >
                          {UI_AI.probeCheckAction}
                        </button>
                      </div>
                    </div>
                    <div style={STEP_FOOT}>{UI_AI.step1Foot}</div>
                  </div>
                </>
              )}

              {effRoute === 'local' && (
                <>
                  <div style={SUB_ROW}>
                    <span style={SUB_N}>4</span>
                    <div style={SUB_BODY}>
                      <span style={STEP_TEXT}>{UI_AI.localDownloadText}</span>
                      <div style={ZIP_ROW}>
                        <a href={`/${SITE_ZIP_NAME}`} download class="hv-br" style={ZIP_BTN}>
                          {UI_AI.localZipButton(SITE_ZIP_NAME)}
                        </a>
                        <a
                          href={UI_BRAND.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          class="hv-cy"
                          style={GH_LINK}
                        >
                          {UI_AI.localGithubLink}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div style={SUB_ROW}>
                    <span style={SUB_N}>5</span>
                    <div style={SUB_BODY}>
                      <span style={STEP_TEXT}>{UI_AI.localCmdText}</span>
                      <CommandLine command={localCmd} />
                      <span style={STEP_FOOT}>{UI_AI.localCmdExplain}</span>
                    </div>
                  </div>
                  <div style={NOTE_BOX}>
                    {UI_AI.localOpenBefore}
                    <a href={serverUrl()} class="hv-a" style={LOCAL_URL_LINK}>
                      {serverUrl()}
                    </a>
                    {UI_AI.localOpenAfter}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* --- Card 2: prompt & launch (merge of the ex-cards 2 and 3) ---------------------------- */}
        <div style={STEP_CARD}>
          <div style={STEP_HEAD}>
            <StepTitle n="2" label={UI_AI.step2MergedLabel} />
            <span style={{ flex: 1 }} />
            {promptActive && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  class="hv-bd"
                  style={mode === 'default' ? PRESET_ON : PRESET}
                  onClick={() => selectMode('default')}
                >
                  {UI_AI.step2PresetDefault}
                </button>
                <button
                  type="button"
                  class="hv-bd"
                  style={mode === 'safety' ? PRESET_ON : PRESET}
                  onClick={() => selectMode('safety')}
                >
                  {UI_AI.step2PresetSafety}
                </button>
              </div>
            )}
          </div>

          {!promptActive ? (
            /* Route B chosen, page still served from the remote origin: the rest happens on
               the local copy of the site — this card says so, and offers nothing actionable here. */
            <div style={NOTE_BOX}>
              {UI_AI.step2WaitingBefore}
              <a href={serverUrl()} class="hv-a" style={LOCAL_URL_LINK}>
                {serverUrl()}
              </a>
              {UI_AI.step2WaitingAfter}
            </div>
          ) : (
            <>
              <textarea
                class="hv-bd"
                value={systemPrompt}
                spellcheck={false}
                aria-label={UI_AI.step2PromptAria}
                style={PROMPT_AREA}
                onInput={(e) => setEditedPrompt(e.currentTarget.value)}
              />
              {items.kind === 'loading' && <span style={STEP_FOOT}>{UI_AI.step2ItemsLoading}</span>}
              {items.kind === 'error' && (
                <span style={ERROR_TEXT}>{UI_AI.step2ItemsError(items.message)}</span>
              )}
              {items.kind === 'ready' && (
                <>
                  <div style={COUNT_ROW}>
                    {/* Tinted counter + suffix in case of little data (CasPeuDeDonnees mockup). */}
                    <span style={{ ...COUNT_TEXT, ...(lowData ? { color: '#e8a184' } : {}) }}>
                      {UI_AI.includedCounts(sentCounts.comments, sentCounts.searches)}
                      {tokensAreExact
                        ? UI_AI.tokensExact(String(estimatedTokens))
                        : UI_AI.tokensEstimated(String(estimatedTokens))}
                      {selection.droppedComments + selection.droppedSearches > 0 &&
                        UI_AI.tokensDropped(
                          selection.droppedComments + selection.droppedSearches,
                          String(contextWindow),
                        )}
                      {lowData && UI_AI.lowDataCountSuffix}
                    </span>
                    <span style={{ flex: 1 }} />
                    <button
                      type="button"
                      style={PAYLOAD_TOGGLE}
                      onClick={() => setPayloadOpen(!payloadOpen)}
                    >
                      {payloadOpen ? UI_AI.payloadHide : UI_AI.payloadShow}
                    </button>
                  </div>
                  {verification.kind === 'checking' && (
                    <span style={STEP_FOOT}>{UI_AI.verifyChecking}</span>
                  )}
                  {verification.kind === 'unavailable' && (
                    <span style={STEP_FOOT}>{UI_AI.verifyUnavailable}</span>
                  )}
                  {selection.tier === 'recent_comments' && counts.searches > 0 && (
                    <span style={STEP_FOOT}>
                      {UI_AI.recentOnly(counts.comments, counts.searches)}
                    </span>
                  )}
                  {selection.tier === 'comments_and_recent_searches' && (
                    <span style={STEP_FOOT}>
                      {UI_AI.searchesTruncated(selection.droppedSearches)}
                    </span>
                  )}
                  {payloadOpen && (
                    <div style={PAYLOAD_BOX}>{UI_AI.payloadPreview(systemPrompt, userMessage)}</div>
                  )}
                </>
              )}

              <div style={RUN_ROW}>
                {/* The failure help is chosen on what we KNOW (read permission + recognized engine,
                    `probeFailureHelp`) — never a cause asserted without evidence (ADR-0006).
                    v5 lets the help be a flex item of the row rather than a wrapper that always
                    grows: the button is pushed right by its own `margin-left: auto`, so when
                    there is no help to show the row does not keep a phantom column. */}
                {!run.running && probe.kind === 'idle' && (
                  <div style={WARN_TEXT}>{UI_AI.step3WarnIdle}</div>
                )}
                {!run.running && probe.kind === 'checking' && (
                  <div style={WARN_TEXT}>{UI_AI.probeChecking}</div>
                )}
                {!run.running && probe.kind === 'error' && (
                  <div style={WARN_TEXT}>{probeFailureHelp(probe.gate)}</div>
                )}
                {run.running && (
                  <button type="button" style={STOP_BTN} onClick={stop}>
                    {UI_AI.step3Stop}
                  </button>
                )}
                <button
                  type="button"
                  class={canRun ? 'hv-br' : undefined}
                  disabled={!canRun}
                  style={canRun ? RUN_BTN : RUN_BTN_OFF}
                  onClick={() => void launch()}
                >
                  {run.running ? UI_AI.step3Running : UI_AI.step3Run}
                </button>
              </div>
              {/* « peu de données » reminder at launch (CasPeuDeDonnees mockup) — never blocking. */}
              {lowData && <div style={LOW_DATA_HINT}>{UI_AI.lowDataHint}</div>}
              {error !== null && <div style={ERROR_BOX}>{error}</div>}
              {(run.running || run.text !== '') && (
                <div style={FIELD_COL}>
                  <div style={RESULT_BOX}>
                    {run.text}
                    {run.running && <span style={{ color: NAVY.accent }}>▌</span>}
                  </div>
                  {!run.running && run.text !== '' && (
                    <span style={RESULT_STATS}>
                      {run.interrupted ? UI_AI.runInterrupted : ''}
                      {run.promptTokens > 0
                        ? UI_AI.runStats(
                            String(run.promptTokens),
                            String(run.completionTokens),
                            formatDecimal(run.elapsedMs / 1000),
                          )
                        : UI_AI.runElapsed(formatDecimal(run.elapsedMs / 1000))}
                      {tokPerSec !== null ? UI_AI.runThroughput(tokPerSec) : ''}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Styles (« PanoptiCool v5 Web » mockup, section 04) --------------------------------------------
// Same pass as the rest of the page: the structure is v4's (two step cards, the install route
// picker, the prompt and its payload), the SIZES are v5's. Section 04 carried the smallest type of
// the whole product — 9.5 px tracked uppercase on the OS picker, the model notes, the route labels
// and the copy button — on the one section that asks the reader to run commands they do not know.
// It is now 13–16 px sentence case throughout.
//
// The band also loses its cyan top rule and its gradient for a flat inset panel: the rule made
// section 04 read as a separate product, and it is the fourth step of one page.
const BAND = {
  marginTop: '24px',
  background: NAVY.bgInset,
  borderTop: `1px solid ${NAVY.borderHeader}`,
} as const;
const SHELL = {
  maxWidth: '1080px',
  margin: '0 auto',
  padding: '64px 40px 80px',
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
} as const;
const HEAD = { display: 'flex', flexDirection: 'column', gap: '18px' } as const;
const TITLE_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  flexWrap: 'wrap',
} as const;
/** The section number, set exactly like 01–03 in `ResultsView` — this band is the fourth step of
 *  the same page, and it used to announce itself with a kicker of its own. */
const SEC_N = { fontSize: '12px', fontWeight: 600, lineHeight: 1, color: NAVY.accent } as const;
const TITLE = {
  fontSize: '30px',
  fontWeight: 600,
  lineHeight: 1.15,
  letterSpacing: '-0.025em',
  color: '#ffffff',
} as const;
const LOCAL_BADGE = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.2,
  color: NAVY.accent,
  border: '1px solid rgba(47,212,240,.4)',
  borderRadius: '20px',
  padding: '7px 12px',
} as const;
const HEAD_SPACER = { flex: 1 } as const;
const LEDE = {
  margin: 0,
  fontSize: '17px',
  lineHeight: 1.65,
  color: NAVY.textBody,
  maxWidth: '760px',
} as const;
const STEP_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '32px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '20px',
} as const;
const STEP_HEAD = { display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' } as const;
// The step number loses its ring, like the section numbers above: at 22 px the figure carries
// itself, and a circle around it only competed with the label beside.
const STEP_N = {
  fontSize: '22px',
  fontWeight: 700,
  lineHeight: 1,
  color: NAVY.accent,
  flex: 'none',
} as const;
const STEP_LABEL = {
  fontSize: '22px',
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: '#ffffff',
} as const;
// System selector — the detection stays best-effort, but the person can correct it with one click.
const OS_BTN_GROUP = { display: 'flex', gap: '8px', flexWrap: 'wrap' } as const;
const OS_PICK_ROW = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  flexWrap: 'wrap',
} as const;
const OS_PICK_LABEL = {
  fontSize: '14px',
  lineHeight: 1,
  color: NAVY.textMuted,
  paddingTop: '13px',
} as const;
const OS_BTN = {
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'inherit',
  lineHeight: 1.2,
  color: NAVY.textBody,
  background: 'transparent',
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '10px',
  padding: '11px 14px',
} as const;
const OS_BTN_ON = {
  ...OS_BTN,
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: `1px solid ${NAVY.accent}`,
} as const;
const FIELD_COL = { display: 'flex', flexDirection: 'column', gap: '12px' } as const;
// Browser banner / « tout est prêt » callout — the green/orange tints of the mockup.
const BANNER_BASE = {
  display: 'flex',
  gap: '14px',
  alignItems: 'flex-start',
  borderRadius: '20px',
  padding: '22px 26px',
} as const;
const BANNER_OK = {
  ...BANNER_BASE,
  background: NAVY.okBg,
  border: '1px solid rgba(74,222,128,.3)',
} as const;
const BANNER_WARN = {
  ...BANNER_BASE,
  background: NAVY.riskBg,
  border: '1px solid rgba(232,117,78,.35)',
} as const;
const READY_BOX = {
  ...BANNER_BASE,
  background: 'rgba(74,222,128,.06)',
  border: '1px solid rgba(74,222,128,.3)',
  borderRadius: '16px',
  padding: '20px 24px',
} as const;
const BANNER_ICON = { fontSize: '16px', lineHeight: 1.5, flex: 'none' } as const;
const BANNER_COL = { display: 'flex', flexDirection: 'column', gap: '9px' } as const;
const BANNER_TITLE = { fontSize: '17px', fontWeight: 600, lineHeight: 1.5 } as const;
const BANNER_TEXT = { fontSize: '15px', lineHeight: 1.7, maxWidth: '780px' } as const;
// « jamais ouvert de terminal ? » disclosure — dotted, same family as the educational panels, and
// in v5 it IS one: the mockup opens it into a two-column learn panel rather than a boxed note.
const TERM_BTN = {
  cursor: 'pointer',
  flex: 'none',
  textAlign: 'left',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'inherit',
  lineHeight: 1.2,
  color: NAVY.learnAccent,
  background: 'transparent',
  border: `1px dashed ${NAVY.learnBorder}`,
  borderRadius: '11px',
  padding: '11px 15px',
} as const;
const TERM_BOX = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  padding: '28px',
  background: NAVY.learnBg,
  border: `1px dashed ${NAVY.learnBorder}`,
  borderRadius: '20px',
} as const;
const TERM_TITLE = {
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.3,
  color: '#ffffff',
} as const;
const TERM_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
  gap: '24px',
} as const;
const TERM_COL = { display: 'flex', flexDirection: 'column', gap: '9px', minWidth: 0 } as const;
const TERM_COL_TITLE = {
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: 1.3,
  color: NAVY.learnTitle,
} as const;
const TERM_TEXT = { fontSize: '15px', lineHeight: 1.7, color: NAVY.textBody } as const;
// Numbered sub-steps of card 1 (small cyan squares).
const SUB_ROW = { display: 'flex', gap: '16px', alignItems: 'flex-start' } as const;
const SUB_N = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  borderRadius: '8px',
  background: NAVY.accent,
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: 1,
  color: NAVY.bgPage,
  flex: 'none',
} as const;
const SUB_BODY = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
} as const;
// The two routes (A / B).
const ROUTE_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
  gap: '14px',
} as const;
const ROUTE_BTN = {
  minWidth: 0,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  gap: '10px',
  padding: '22px 24px',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '16px',
  fontFamily: 'inherit',
} as const;
const ROUTE_BTN_ON = {
  ...ROUTE_BTN,
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
} as const;
const ROUTE_BTN_OFF = { ...ROUTE_BTN, cursor: 'not-allowed', opacity: 0.55 } as const;
const ROUTE_TITLE = { fontSize: '17px', fontWeight: 600, lineHeight: 1.3 } as const;
const ROUTE_TEXT = { fontSize: '15px', lineHeight: 1.65, color: NAVY.textBody } as const;
const ROUTE_UNAVAIL = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.5,
  color: '#e8a184',
} as const;
// Indigo callout — permission note, « ouvre localhost » note, card 2 awaiting route B.
const NOTE_BOX = {
  fontSize: '15px',
  lineHeight: 1.7,
  color: NAVY.learnTitle,
  background: 'rgba(124,150,255,.06)',
  border: `1px solid ${NAVY.learnBorder}`,
  borderRadius: '14px',
  padding: '16px 18px',
} as const;
const ADDR_BLOCK = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  borderTop: `1px solid ${NAVY.borderHeader}`,
  paddingTop: '22px',
} as const;
// Route B: site download.
const ZIP_ROW = { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' } as const;
const ZIP_BTN = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: 1.2,
  color: NAVY.bgPage,
  background: NAVY.accent,
  borderRadius: '12px',
  padding: '15px 20px',
  textDecoration: 'none',
} as const;
const GH_LINK = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: 1.2,
  color: NAVY.textHeading,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '12px',
  padding: '15px 20px',
  textDecoration: 'none',
} as const;
const FOOT_LINK = { color: NAVY.accent, textDecoration: 'none' } as const;
// Launch row (card 2): the help on the left, the button pushed right.
const RUN_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  flexWrap: 'wrap',
  borderTop: `1px solid ${NAVY.borderHeader}`,
  paddingTop: '20px',
} as const;
const STEP_TEXT = { fontSize: '16px', lineHeight: 1.6, color: NAVY.textHeading } as const;
const STEP_FOOT = { fontSize: '15px', lineHeight: 1.65, color: NAVY.textMuted } as const;
// Command row — it is a `<button>`: full-width clickable target, text aligned left.
const CMD_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  boxSizing: 'border-box',
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: 'inherit',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '12px',
  padding: '16px 18px',
} as const;
const CMD_TEXT = {
  flex: 1,
  minWidth: 0,
  fontSize: '14px',
  lineHeight: 1.5,
  color: NAVY.accentBright,
  overflowWrap: 'anywhere',
  fontFamily: MONO,
} as const;
// The « copier / copié ✓ » label — a visual marker (the whole row copies), so no hover of its own.
const COPY_BTN = {
  flex: 'none',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '10px',
  padding: '11px 14px',
} as const;
const MODEL_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
  gap: '10px',
} as const;
const MODEL_BTN = {
  minWidth: 0,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  gap: '8px',
  padding: '16px 18px',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '14px',
  fontFamily: 'inherit',
} as const;
const MODEL_BTN_ON = {
  ...MODEL_BTN,
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
} as const;
const MODEL_Q = {
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: 1.3,
  overflowWrap: 'anywhere',
} as const;
const MODEL_SIZE = { fontSize: '15px', lineHeight: 1, color: NAVY.textBody } as const;
const MODEL_NOTE = { fontSize: '13px', fontWeight: 500, lineHeight: 1.35 } as const;
const ADDR_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
} as const;
const ADDR_LABEL = { fontSize: '14px', lineHeight: 1, color: NAVY.textMuted } as const;
const ADDR_INPUT = {
  flex: 1,
  minWidth: '220px',
  fontSize: '14px',
  lineHeight: 1.4,
  fontFamily: MONO,
  color: NAVY.textBright,
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '12px',
  padding: '15px 17px',
} as const;
const STATUS_GROUP = { display: 'flex', alignItems: 'center', gap: '10px' } as const;
const STATUS_DOT = { width: '11px', height: '11px', borderRadius: '50%', flex: 'none' } as const;
const STATUS_LABEL = { fontSize: '15px', fontWeight: 500, lineHeight: 1.3 } as const;
const RECHECK_BTN = {
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 600,
  fontFamily: 'inherit',
  lineHeight: 1.2,
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: 'none',
  borderRadius: '12px',
  padding: '15px 20px',
} as const;
/** The link to the local copy of the site — clickable (2026-07-20 retouch). */
const LOCAL_URL_LINK = { color: NAVY.accentBright, textDecoration: 'none' } as const;
const PRESET = {
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'inherit',
  lineHeight: 1.2,
  color: NAVY.textBody,
  background: 'transparent',
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '11px',
  padding: '11px 15px',
} as const;
const PRESET_ON = {
  ...PRESET,
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: `1px solid ${NAVY.accent}`,
} as const;
// ⚠ THE PROMPT AREA LEAVES THE MONOSPACE. It is the one place here where the reader WRITES prose
// rather than reads a command — the mockup sets it in the interface face, and the commands and the
// payload keep `MONO` for the reason `palette.ts` gives (glyphs one verifies character by
// character). The distinction is now legible instead of accidental.
const PROMPT_AREA = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '150px',
  resize: 'vertical',
  fontSize: '15px',
  lineHeight: 1.7,
  fontFamily: 'inherit',
  color: NAVY.textBright,
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '12px',
  padding: '16px 18px',
} as const;
const COUNT_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
} as const;
const COUNT_TEXT = { fontSize: '15px', lineHeight: 1.45, color: NAVY.textBody } as const;
const PAYLOAD_TOGGLE = {
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 500,
  fontFamily: 'inherit',
  lineHeight: 1.3,
  color: NAVY.accent,
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(47,212,240,.4)',
  padding: '3px 0',
} as const;
const PAYLOAD_BOX = {
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '16px',
  padding: '20px 22px',
  fontSize: '14px',
  lineHeight: 1.85,
  color: NAVY.textBody,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  maxHeight: '340px',
  overflow: 'auto',
  fontFamily: MONO,
} as const;
const RUN_BTN = {
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  fontFamily: 'inherit',
  lineHeight: 1.2,
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: 'none',
  borderRadius: '12px',
  padding: '17px 26px',
  marginLeft: 'auto',
  flex: 'none',
} as const;
const RUN_BTN_OFF = { ...RUN_BTN, cursor: 'not-allowed', background: NAVY.textDim } as const;
const STOP_BTN = {
  ...RUN_BTN,
  background: '#7a2a24',
  color: NAVY.textBright,
} as const;
const WARN_TEXT = {
  flex: 1,
  minWidth: '260px',
  fontSize: '15px',
  lineHeight: 1.65,
  color: NAVY.riskText,
} as const;
// « peu de données » edge case.
const LOW_DATA_BANNER = {
  display: 'flex',
  gap: '14px',
  alignItems: 'flex-start',
  background: NAVY.riskBg,
  border: '1px solid rgba(232,117,78,.35)',
  borderRadius: '20px',
  padding: '22px 26px',
} as const;
const LOW_DATA_ICON = {
  color: NAVY.risk,
  fontSize: '16px',
  lineHeight: 1.5,
  flex: 'none',
} as const;
const LOW_DATA_TITLE = {
  fontSize: '17px',
  fontWeight: 600,
  lineHeight: 1.5,
  color: NAVY.riskText,
} as const;
const LOW_DATA_TEXT = {
  fontSize: '15px',
  lineHeight: 1.7,
  color: '#d9a894',
  maxWidth: '760px',
} as const;
const LOW_DATA_HINT = { fontSize: '15px', lineHeight: 1.65, color: '#d9a894' } as const;
const ERROR_TEXT = { fontSize: '15px', lineHeight: 1.65, color: NAVY.riskText } as const;
const ERROR_BOX = {
  ...ERROR_TEXT,
  background: NAVY.riskBg,
  border: `1px solid ${NAVY.riskBorder}`,
  borderRadius: '14px',
  padding: '16px 18px',
} as const;
const RESULT_BOX = {
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '16px',
  padding: '22px 24px',
  fontSize: '16px',
  lineHeight: 1.8,
  color: NAVY.textBright,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  maxHeight: '420px',
  overflowY: 'auto',
} as const;
const RESULT_STATS = { fontSize: '14px', lineHeight: 1.45, color: NAVY.textMuted } as const;

// --- MOBILE variant (« PanoptiCool v4 Mobile » mockup) ---------------------------------------------
// Local AI requires a computer (llama.cpp): on mobile we do NOT display the interactive
// section, but an explanatory callout + a blurred DECORATIVE PREVIEW of the 3 steps (aria-hidden,
// non-interactive) — the user sees that a step exists and where to do it, without fake buttons.

export function AiMobileNotice() {
  return (
    <div id="sec-ia" style={MN_WRAP}>
      <div style={MN_HEAD}>
        <span style={MN_N}>{UI_AI_MOBILE.sectionNumber}</span>
        <span style={MN_TITLE}>{UI_AI.title}</span>
      </div>
      <div style={MN_CALLOUT} role="status">
        <span style={MN_ICON} aria-hidden="true">
          🖥
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={MN_CALLOUT_TITLE}>{UI_AI_MOBILE.calloutTitle}</span>
          <span style={MN_CALLOUT_TEXT}>{UI_AI_MOBILE.calloutText}</span>
        </div>
      </div>
      <div aria-hidden="true" style={MN_PREVIEW_CLIP}>
        <div style={MN_PREVIEW}>
          <div style={MN_FAKE_CARD}>
            <div style={MN_FAKE_HEAD}>
              <span style={MN_FAKE_N}>1</span>
              <span style={MN_FAKE_TITLE}>{UI_AI.step1Label}</span>
            </div>
            <div style={MN_FAKE_TEXT}>{UI_AI.step1InstallText}</div>
            <div style={MN_FAKE_CMD}>{UI_AI_MOBILE.previewCommand}</div>
            <div style={MN_FAKE_MODELS}>
              <div style={MN_FAKE_MODEL_ON}>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: NAVY.accentBright }}>
                  {UI_AI_MOBILE.previewModelOn}
                </span>
                <span style={{ fontSize: '11px', color: '#a3b0cf' }}>
                  {UI_AI.modelSize(formatFixedDecimal(UI_AI_MOBILE.previewModelOnSizeGb))}
                </span>
              </div>
              <div style={MN_FAKE_MODEL}>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: NAVY.textSecondary }}>
                  {UI_AI_MOBILE.previewModelOff}
                </span>
                <span style={{ fontSize: '11px', color: '#a3b0cf' }}>
                  {UI_AI.modelSize(formatFixedDecimal(UI_AI_MOBILE.previewModelOffSizeGb))}
                </span>
              </div>
            </div>
          </div>
          <div style={MN_FAKE_CARD}>
            <div style={MN_FAKE_HEAD}>
              <span style={MN_FAKE_N}>2</span>
              <span style={MN_FAKE_TITLE}>{UI_AI.step2Label}</span>
            </div>
            <div style={MN_FAKE_PROMPT}>{UI_AI_MOBILE.previewPrompt}</div>
          </div>
          <div style={MN_FAKE_CARD}>
            <div style={MN_FAKE_HEAD}>
              <span style={MN_FAKE_N}>3</span>
              <span style={MN_FAKE_TITLE}>{UI_AI.step3Label}</span>
              <span style={{ flex: 1 }} />
              <span style={MN_FAKE_RUN}>{UI_AI.step3Run}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MN_WRAP = { display: 'flex', flexDirection: 'column', paddingTop: '14px' } as const;
const MN_HEAD = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  paddingBottom: '16px',
} as const;
const MN_N = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: `1px solid ${NAVY.learnBorder}`,
  fontSize: '12px',
  fontWeight: 600,
  color: NAVY.textMuted,
  flex: 'none',
} as const;
const MN_TITLE = {
  fontSize: '15.5px',
  fontWeight: 500,
  lineHeight: 1.35,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: NAVY.textBright,
} as const;
const MN_CALLOUT = {
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
  background: 'rgba(47,212,240,.06)',
  border: '1px solid rgba(47,212,240,.4)',
  borderRadius: '12px',
  padding: '16px 18px',
  marginBottom: '16px',
} as const;
const MN_ICON = { color: NAVY.accent, fontSize: '15px', lineHeight: 1.5, flex: 'none' } as const;
const MN_CALLOUT_TITLE = {
  fontSize: '13px',
  fontWeight: 600,
  lineHeight: 1.5,
  color: NAVY.textBright,
} as const;
const MN_CALLOUT_TEXT = { fontSize: '12px', lineHeight: 1.65, color: NAVY.textLede } as const;
const MN_PREVIEW_CLIP = { position: 'relative', borderRadius: '12px', overflow: 'hidden' } as const;
const MN_PREVIEW = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  filter: 'grayscale(1) blur(2.5px)',
  opacity: 0.45,
  pointerEvents: 'none',
  userSelect: 'none',
} as const;
const MN_FAKE_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '20px',
  background: 'rgba(12,19,41,.65)',
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '12px',
} as const;
const MN_FAKE_HEAD = { display: 'flex', alignItems: 'center', gap: '12px' } as const;
const MN_FAKE_N = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  border: '1px solid rgba(47,212,240,.5)',
  fontSize: '12px',
  fontWeight: 600,
  color: NAVY.accent,
  flex: 'none',
} as const;
const MN_FAKE_TITLE = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: NAVY.textHeading,
} as const;
const MN_FAKE_TEXT = { fontSize: '12px', lineHeight: 1.6, color: NAVY.textBody } as const;
const MN_FAKE_CMD = {
  background: NAVY.bgPage,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '8px',
  padding: '11px 13px',
  fontSize: '12px',
  lineHeight: 1.4,
  color: NAVY.accentBright,
} as const;
const MN_FAKE_MODELS = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } as const;
const MN_FAKE_MODEL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  padding: '12px 13px',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
} as const;
const MN_FAKE_MODEL_ON = {
  ...MN_FAKE_MODEL,
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
} as const;
const MN_FAKE_PROMPT = {
  background: NAVY.bgPage,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
  padding: '14px 16px',
  fontSize: '12px',
  lineHeight: 1.7,
  color: NAVY.textHeading,
} as const;
const MN_FAKE_RUN = {
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: 1,
  color: NAVY.bgPage,
  background: NAVY.accent,
  borderRadius: '8px',
  padding: '13px 20px',
} as const;
