// « 05 · L'ANALYSE LOCALE » — a conversation, a model on the person's own machine, and what it says.
//
// This is the piece where the product stops describing what an algorithm could deduce and lets one
// do it, in front of the reader, on their own words. Everything else in this dossier counts and
// dates; this one interprets.
//
// ⚠ IT IS A PIECE, NOT A PANEL INSIDE A THREAD. It carries an install tutorial, a server check and a
// token budget — three things settled ONCE, not per thread opened — and an analysis is worth more
// across SEVERAL conversations, which a panel bolted to one thread cannot offer.
//
// ⚠ THE SETUP TUTORIAL IS DUPLICATED FROM `ui/v2/AiSection.tsx`, KNOWINGLY (yuya, 2026-08-03). The
// alternative — one shared component — was proposed and declined; each page stands alone instead.
// What is NOT duplicated is what the commands are made of: `ai/install-help.ts` stays the single
// home for the model list, the two commands and the suggested window, so the two tutorials can drift
// in wording but never in what they tell someone to type.
//
// ─── WHAT THIS PIECE DOES NOT DO ────────────────────────────────────────────────────────────────
//   - IT SENDS NOTHING ANYWHERE BUT `localhost`. The only network recipient is the server on the
//     person's machine, reached on an explicit click. There is no other endpoint in this file;
//   - IT DOES NOT RENDER MARKDOWN. The model's answer is shown as it arrives, pre-wrapped, the same
//     as the TikTok section. A renderer is a dependency and a surface, for a formatting the answer
//     does not need;
//   - IT DOES NOT KEEP THE ANSWER. Nothing is stored, nothing is exported. Reloading loses it, and
//     that is the honest behaviour for a page that promises nothing leaves;
//   - IT DOES NOT CHECK WHAT THE MODEL SAYS. Nothing here can: that is the demonstration, and the
//     reason the safety clause is in the field by default rather than behind a toggle.

import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { detectBrowser } from '../../ai/browser';
import {
  buildConversationSystemPrompt,
  buildSequenceUserMessage,
  calibrateCharsPerToken,
  DEFAULT_CHARS_PER_TOKEN,
  DEFAULT_TUNING,
  estimateTokens,
  SAFETY_CLAUSE,
  selectSequences,
} from '../../ai/conv-prompt';
import {
  DEFAULT_CONTEXT_WINDOW,
  detectOs,
  installCommand,
  isLocalOrigin,
  localSiteCommand,
  MODEL_CHOICES,
  type ModelChoice,
  type Os,
  SITE_ZIP_NAME,
  SUGGESTED_CONTEXT,
  serveCommand,
  serverUrl,
} from '../../ai/install-help';
import {
  countRealPromptTokens,
  type InterruptFlag,
  probeLlamaCpp,
  runLlamaCppStream,
} from '../../ai/llama-client';
import { type LocalNetworkGate, localNetworkGate } from '../../ai/local-network';
import type { ThreadMessage } from '../../engine/instagram/connector';
import { currentLocale } from '../../i18n/current';
import { UI_BRAND } from '../copy';
import { UI_IG_ANALYSE, UI_IG_SHELL } from '../copy.instagram';
import { formatInt } from '../format';
import { dayMonthYear } from './dates';
import type { ModuleProps } from './InstagramPage';
import './analyse.css';

/** Share of the window kept for the ANSWER. The rest is what may be filled with the conversation. */
const RESERVE_FOR_ANSWER = 0.35;

const OS_LABEL: Record<Os, string> = { macos: 'macOS', windows: 'Windows', linux: 'Linux' };

type ProbeState =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'ok'; ctx: number }
  | { state: 'fail'; message: string };

export function AnalyseModule({ report, readThread }: ModuleProps) {
  const t = UI_IG_ANALYSE;
  const locale = currentLocale();
  const conversations = report.conversations;

  /* ————— The server ————— */
  const [os, setOs] = useState<Os>(() => detectOs(navigator.userAgent));
  const browser = useMemo(() => detectBrowser(navigator.userAgent, 'brave' in navigator), []);
  const [gate, setGate] = useState<LocalNetworkGate>('unknown');
  const [model, setModel] = useState<ModelChoice>(MODEL_CHOICES[0] as ModelChoice);
  const [url, setUrl] = useState(serverUrl());
  const [probe, setProbe] = useState<ProbeState>({ state: 'idle' });

  // Read after mount: the page is prerendered, and `location` does not exist while it is.
  const [local, setLocal] = useState(false);
  useEffect(() => {
    setLocal(isLocalOrigin(window.location.hostname));
    void localNetworkGate().then(setGate);
  }, []);

  const check = useCallback(async () => {
    setProbe({ state: 'checking' });
    const r = await probeLlamaCpp(url);
    setProbe(
      r.ok
        ? { state: 'ok', ctx: r.contextWindow ?? DEFAULT_CONTEXT_WINDOW }
        : { state: 'fail', message: r.error },
    );
  }, [url]);

  /* ————— The source ————— */
  /**
   * ⚠ ONE CONVERSATION AT A TIME (yuya's decision). Multi-select SPLIT the budget between threads:
   * three ticked meant three thirds of a reading, and the model compared relationships it had only
   * seen in fragments. Radios rather than checkboxes — the control's shape states the rule before
   * anyone tries it.
   */
  const [picked, setPicked] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [threads, setThreads] = useState<ReadonlyMap<string, readonly ThreadMessage[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  /**
   * ⚠ ONLY THE TICKED THREADS ARE READ, and each only once. The engine keeps no message text, so
   * re-reading three hundred conversations to analyse two would mean paying for the whole export
   * again on every visit.
   */
  useEffect(() => {
    if (readThread === undefined || picked === null) return;
    const missing = threads.has(picked) ? [] : [picked];
    if (missing.length === 0) return;
    let alive = true;
    setLoading(true);
    setLoadError(false);
    void (async () => {
      const next = new Map(threads);
      for (const id of missing) {
        try {
          next.set(id, await readThread(id));
        } catch {
          if (alive) setLoadError(true);
          break;
        }
      }
      if (!alive) return;
      setThreads(next);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [picked, threads, readThread]);

  const convList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...(conversations?.conversations ?? [])]
      .filter((c) => q === '' || c.title.toLowerCase().includes(q))
      .sort((a, b) => b.messages - a.messages);
  }, [conversations, query]);

  /* ————— The sending settings ————— */
  /**
   * ⚠ THE FIELD IS THE PROMPT. Nothing is appended on the way out — that used to be the case for a
   * supplement about periods and for the safety clause, and it made the « exactly what will be
   * sent » of the preview just below a lie.
   *
   * So the clause is INSERTED INTO THE TEXT when ticked and removed when unticked, and the box holds
   * no state of its own: it reads whether the sentence is in the field. Reword it by hand and the
   * box unticks — which is honest, since it is then no longer the ratified clause but a sentence of
   * one's own.
   */
  const [prompt, setPrompt] = useState(() =>
    buildConversationSystemPrompt(locale, { now: Date.now(), safety: false, multiThread: false }),
  );
  const [charsPerToken, setCharsPerToken] = useState(DEFAULT_CHARS_PER_TOKEN);
  const [learn, setLearn] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [route, setRoute] = useState<'site' | 'local'>('site');
  const [payloadOpen, setPayloadOpen] = useState(false);
  const [payloadCopied, setPayloadCopied] = useState(false);
  const [realTokens, setRealTokens] = useState<number | null>(null);

  const safety = prompt.includes(SAFETY_CLAUSE[locale]);
  const toggleSafety = () =>
    setPrompt((p) =>
      p.includes(SAFETY_CLAUSE[locale])
        ? p
            .replace(SAFETY_CLAUSE[locale], '')
            .replace(/\s{2,}/g, ' ')
            .trim()
        : `${p.trim()} ${SAFETY_CLAUSE[locale]}`,
    );

  const ctx = probe.state === 'ok' ? probe.ctx : DEFAULT_CONTEXT_WINDOW;

  /**
   * ⚠ TWO QUANTITIES, and confusing them WAS the bug. `promptWindow` is the total room for what is
   * sent (the server's window less the answer reserve); `budgetTokens` is what REMAINS for the
   * messages once the system prompt is written.
   *
   * The overflow warning compared the total (system + body) against the second — that is, against
   * the total minus the system. It fired as soon as the body approached its budget, which is exactly
   * when the sampling had done its job well. It now compares two quantities of the same kind.
   */
  const promptWindow = Math.floor(ctx * (1 - RESERVE_FOR_ANSWER));
  const budgetTokens = Math.max(0, promptWindow - estimateTokens(prompt, charsPerToken));

  const chosen = useMemo(
    () => convList.find((c) => c.id === picked && threads.has(c.id)) ?? null,
    [convList, picked, threads],
  );

  // ⚠ THE WHOLE BUDGET GOES TO THE ONE THREAD. There is nothing to split any more, which is the
  // point of choosing one: the model reads a relationship, not three fragments of three.
  const blocks = useMemo(() => {
    if (chosen === null) return [];
    const messages = threads.get(chosen.id) ?? [];
    const sel = selectSequences(messages, budgetTokens, charsPerToken, locale, DEFAULT_TUNING);
    return [
      {
        conv: chosen,
        sel,
        body: buildSequenceUserMessage(sel, null, locale, DEFAULT_TUNING),
        messages,
      },
    ];
  }, [chosen, threads, budgetTokens, charsPerToken, locale]);

  const userMessage = useMemo(() => blocks[0]?.body ?? '', [blocks]);

  const sentCount = blocks.reduce((n, b) => n + b.sel.kept.length, 0);
  const totalCount = blocks.reduce((n, b) => n + b.messages.length, 0);
  const sequenceCount = blocks.reduce((n, b) => n + b.sel.sequences.length, 0);
  const estimated = estimateTokens(prompt + userMessage, charsPerToken);

  // The server's real counter, whenever it is reachable and there is something to count.
  useEffect(() => {
    if (probe.state !== 'ok' || userMessage === '') {
      setRealTokens(null);
      return;
    }
    let alive = true;
    void countRealPromptTokens(url, prompt, userMessage).then((n) => {
      if (alive) setRealTokens(n);
    });
    return () => {
      alive = false;
    };
  }, [probe.state, url, prompt, userMessage]);

  /* ————— The run ————— */
  const [out, setOut] = useState('');
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState(false);
  const [runStats, setRunStats] = useState<{ p: number; c: number; ms: number } | null>(null);
  const abortRef = useRef<{ controller: AbortController; flag: InterruptFlag } | null>(null);
  const outRef = useRef<HTMLDivElement>(null);

  /**
   * The question field opens to the height of its text, and follows the typing.
   *
   * `rows` does not do it: the number of lines depends on the WIDTH, which depends on the screen.
   * Ten lines cover the draft on a wide screen and truncate it on a laptop — and it is the WHOLE
   * prompt that has to be readable at a glance, otherwise it gets edited unread.
   *
   * `field-sizing: content` would do this in CSS, but Firefox does not know it — and Firefox is the
   * browser this very page recommends two cards higher.
   */
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const grow = useCallback(() => {
    const el = promptRef.current;
    if (el === null) return;
    // Reset first: without it the height could only ever grow.
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);
  useEffect(() => {
    grow();
    window.addEventListener('resize', grow);
    return () => window.removeEventListener('resize', grow);
    // ⚠ IT ALSO HAS TO FOLLOW WHAT IS TYPED, and it did not: with no dependency and no call on
    // input, the height froze at the ten rows the field opened with. The `onInput` below calls it.
  }, [grow]);

  const run = async () => {
    if (userMessage === '') return;
    setOut('');
    setRunError(false);
    setRunStats(null);
    setRunning(true);
    const controller = new AbortController();
    const flag: InterruptFlag = { interrupted: false };
    abortRef.current = { controller, flag };
    try {
      const res = await runLlamaCppStream(
        url,
        prompt,
        userMessage,
        (d) => {
          setOut((prev) => prev + d);
          requestAnimationFrame(() =>
            outRef.current?.scrollTo({ top: outRef.current.scrollHeight }),
          );
        },
        controller,
        flag,
      );
      setRunStats({ p: res.promptTokens, c: res.completionTokens, ms: res.elapsedMs });
      // The server's real count is the truth: it recalibrates the pre-send estimate for next time.
      const ratio = calibrateCharsPerToken(prompt.length + userMessage.length, res.promptTokens);
      if (ratio !== null) setCharsPerToken(ratio);
    } catch {
      setRunError(true);
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  };

  const _stop = () => {
    const a = abortRef.current;
    if (a === null) return;
    // The flag goes up BEFORE the abort, so the loop can tell an intended stop from a network error.
    a.flag.interrupted = true;
    a.controller.abort();
  };

  if (conversations === undefined) return null;

  /**
   * ⚠ THE ROUTE IS EFFECTIVE, not merely chosen. Route A needs the browser to let a page reach the
   * machine it runs on, and WebKit refuses: a page that let one pick it anyway would send someone
   * down a path that cannot work. When it is impossible the choice falls back to B, and the button
   * says why rather than going quietly grey.
   */
  const routeAPossible = browser.engine !== 'webkit';
  const effRoute = route === 'site' && !routeAPossible ? 'local' : route;
  const onSite = effRoute === 'site';
  const browserName = browser.name ?? t.bannerUnknownT;

  const banner = local
    ? { tone: 'ok', title: t.bannerLocalT, text: t.bannerLocalP }
    : browser.engine === 'webkit'
      ? { tone: 'warn', title: t.bannerKoT(browserName), text: t.bannerKoP }
      : browser.engine === 'unknown'
        ? { tone: 'flat', title: t.bannerUnknownT, text: t.bannerUnknownP }
        : { tone: 'ok', title: t.bannerOkT(browserName), text: t.bannerOkP };

  const ready = probe.state === 'ok';
  const payloadText = `${prompt}\n\n${userMessage}`;
  const period = blocks[0]?.sel;

  return (
    <div class="an">
      <section class="kit-hero">
        <h1 class="kit-h1">{t.h1}</h1>
        <p class="kit-lede">{t.lede}</p>
        <button
          type="button"
          class="learn-btn"
          aria-expanded={learn}
          onClick={() => setLearn((v) => !v)}
        >
          {t.learnOpen} {learn ? UI_IG_SHELL.learnGlyphOpen : UI_IG_SHELL.learnGlyphClosed}
        </button>
      </section>

      {learn && (
        <div class="learn-panel">
          <span class="learn-h">{t.learnTitle}</span>
          <div class="learn-cols">
            {t.learnCols.map((c) => (
              <div key={c.k}>
                <span class="learn-k">{c.k}</span>
                <span class="learn-p">{c.p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The browser's state, BEFORE the first step. */}
      <div role="status" class={`an-banner ${banner.tone}`}>
        <span aria-hidden="true" class="an-banner-ico">
          {banner.tone === 'ok' ? '✓' : banner.tone === 'warn' ? '▲' : '•'}
        </span>
        <span class="an-banner-body">
          <span class="an-banner-t">{banner.title}</span>
          <span class="an-banner-p">{banner.text}</span>
        </span>
      </div>

      {/**
       * ⚠ THE WARNING COMES BEFORE THE STATUS BANNER AND BEFORE THE FIRST STEP, and that is its
       * whole meaning: a caution read after launching is no longer a caution, it is an excuse. It
       * is not collapsible for the same reason.
       *
       * It does not merely warn. The third block turns the model's weakness into the demonstration
       * — if it deduces this much on a laptop, what the platform does is of another order — and the
       * last one leaves the page: it is the product's only sentence about what the reader will do
       * elsewhere.
       */}
      <section class="an-warn">
        <div class="an-warn-h">
          <span class="an-warn-k">{t.warnK}</span>
          <h2>{t.warnH}</h2>
        </div>
        <div class="an-warn-cols">
          {t.warnCols.map((c) => (
            <div key={c.t}>
              <span class="an-warn-t">{c.t}</span>
              <span class="an-warn-p">{c.p}</span>
            </div>
          ))}
        </div>
        <p class="an-warn-foot">
          <b>{t.warnFootB}</b>
          {t.warnFootP}
        </p>
      </section>

      {/* ————— 1. Start the model ————— */}
      <section class="card ca-step">
        {/* The system choice sits IN the heading: it commands everything the card shows next, and
            it used to sit under the first sentence it governs. */}
        <div class="kit-head">
          <h2>
            <span class="ca-num">1</span> {t.step1}
          </h2>
          <span class="kit-spacer" />
          {/* Le dépliant du terminal PRÉCÈDE le choix du système : c'est la marche la plus haute
              du parcours, et celle qu'aucune commande copiable ne franchit. La reléguer sous la
              rangée la faisait manquer par ceux à qui elle s'adresse. */}
          <button
            type="button"
            class="learn-btn"
            aria-expanded={termOpen}
            onClick={() => setTermOpen(!termOpen)}
          >
            {t.terminalSummary}{' '}
            {termOpen ? UI_IG_SHELL.learnGlyphOpen : UI_IG_SHELL.learnGlyphClosed}
          </button>
          <span class="an-os-k">{t.osLabel}</span>
          <div class="ca-os">
            {(['macos', 'windows', 'linux'] as Os[]).map((o) => (
              <button
                key={o}
                type="button"
                class={`ca-pill ${os === o ? 'on' : ''}`}
                aria-pressed={os === o}
                onClick={() => setOs(o)}
              >
                {OS_LABEL[o]}
              </button>
            ))}
          </div>
        </div>

        {termOpen && (
          <div class="learn-panel an-term-panel">
            <span class="learn-h">{t.terminalPanelTitle}</span>
            <div class="learn-cols">
              {/* Le COMMENT d'abord : qui ouvre ceci cherche le geste, pas la définition. */}
              <div>
                <span class="learn-k">{t.terminalHowTitle(OS_LABEL[os])}</span>
                <span class="learn-p">
                  {os === 'windows'
                    ? t.terminalWindows
                    : os === 'linux'
                      ? t.terminalLinux
                      : t.terminalMacos}
                </span>
              </div>
              <div>
                <span class="learn-k">{t.terminalWhatTitle}</span>
                <span class="learn-p">{t.terminalWhat}</span>
              </div>
            </div>
          </div>
        )}

        <p class="ca-p">
          {t.installBefore}
          <b>llama.cpp</b>
          {t.installAfter}
        </p>
        <Command cmd={installCommand(os)} />
        {os !== 'windows' && (
          <p class="an-note">
            {t.brewNote}
            <a href="https://brew.sh" target="_blank" rel="noreferrer noopener">
              brew.sh
            </a>
            .
          </p>
        )}

        {/* ⚠ RADIO CARDS, not pills. Four pills of which one is active do not say that one is
            choosing ONE model; a radio group says it before anyone tries. */}
        <fieldset class="ca-models">
          <legend class="ca-p">{t.modelsLegend}</legend>
          <div class="ca-models-grid">
            {MODEL_CHOICES.map((m) => (
              <label key={m.quant} class={`ca-model ${model.quant === m.quant ? 'on' : ''}`}>
                <input
                  type="radio"
                  name="an-quant"
                  checked={model.quant === m.quant}
                  onChange={() => setModel(m)}
                />
                <span class="ca-model-b">
                  <span class="ca-model-n">{m.quant}</span>
                  <span class="ca-model-s tnum">
                    {t.modelSize(m.sizeGb.toFixed(1).replace('.', locale === 'fr' ? ',' : '.'))}
                    {m.note === 'recommended' && <i class="ca-tag">{t.modelRecommended}</i>}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* ————— The two routes ————— */}
        <p class="ca-p an-route-intro">{t.routeIntro}</p>
        <div class="an-routes">
          <button
            type="button"
            class={`an-route ${onSite ? 'on' : ''} ${routeAPossible ? '' : 'off'}`}
            disabled={!routeAPossible}
            onClick={() => setRoute('site')}
          >
            <b>{t.routeAT}</b>
            <i>{t.routeAP}</i>
            {!routeAPossible && <span class="an-route-off">{t.routeAOff(browserName)}</span>}
          </button>
          <button
            type="button"
            class={`an-route ${onSite ? '' : 'on'}`}
            onClick={() => setRoute('local')}
          >
            <b>{t.routeBT}</b>
            <i>{t.routeBP}</i>
          </button>
        </div>

        {onSite ? (
          <>
            <p class="ca-p">{t.routeAServe}</p>
            <Command cmd={serveCommand(model, SUGGESTED_CONTEXT)} />
            {/* The permission note BEFORE the first click, matched to the recognised browser:
                Firefox will open a window, Chromium never will. */}
            {!local && (
              <p class="an-note">
                {browser.engine === 'firefox'
                  ? t.routeAFirefox(browserName)
                  : browser.engine === 'chromium'
                    ? t.routeAChromium(browserName)
                    : t.routeAUnknown}
              </p>
            )}
          </>
        ) : (
          <>
            {/* ⚠ THE ARCHIVE IS A BUILD ARTIFACT OF THIS SITE, generated from `dist/` at every
                build. The old objection to a downloadable copy — a channel going stale against the
                online site — does not hold: same build, same content. The prototype pointed at a
                `dist/` one builds oneself, which is true there and would be a lie here. */}
            <p class="ca-p">{t.localDownload}</p>
            <div class="an-zip">
              <a class="an-zip-btn" href={`/${SITE_ZIP_NAME}`} download>
                {t.localZipButton(SITE_ZIP_NAME)}
              </a>
              <a
                class="an-zip-src"
                href={UI_BRAND.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t.localGithubLink}
              </a>
            </div>
            <p class="ca-p">{t.localCmd}</p>
            <Command cmd={localSiteCommand(os, model, SUGGESTED_CONTEXT)} />
            <p class="an-note">
              {t.localOpenBefore}
              <code>{serverUrl()}</code>
              {t.localOpenAfter}
            </p>
          </>
        )}
      </section>

      {/* ————— 2. The check ————— */}
      <section class="card ca-step">
        <h2>
          <span class="ca-num">2</span> {t.step2}
        </h2>
        <div class="ca-probe">
          <input
            type="url"
            value={url}
            onInput={(e) => setUrl(e.currentTarget.value)}
            aria-label={t.urlAria}
          />
          <button
            type="button"
            class="ca-go"
            disabled={probe.state === 'checking'}
            onClick={() => void check()}
          >
            {probe.state === 'checking' ? t.checking : t.check}
          </button>
        </div>
        {probe.state === 'ok' && <p class="ca-ok tnum">{t.probeOk('', formatInt(probe.ctx))}</p>}
        {probe.state === 'fail' && (
          <div class="ca-ko">
            <p>{gate === 'granted' ? t.probeKoNotFound : t.probeKoImpossible}</p>
            {/* ⚠ A `fetch` FAILS WITH THE SAME MESSAGE whether the server is absent or the browser
                blocked it. The permission, on the other hand, is readable without touching the
                network — which is what tells the two apart here. */}
            {local ? (
              <p>{t.probeKoLocal}</p>
            ) : gate === 'blocked' ? (
              <p>{t.probeKoBlocked(browserName)}</p>
            ) : gate === 'granted' ? (
              <p>{t.probeKoGranted}</p>
            ) : (
              <p>{t.probeKoUnknown(browserName)}</p>
            )}
            <p class="ca-detail tnum">{t.probeDetail(probe.message)}</p>
          </div>
        )}
      </section>

      {/* ————— 3. What gets analysed ————— */}
      <section class="card ca-step">
        <h2>
          <span class="ca-num">3</span> {t.step3}
        </h2>

        <input
          type="search"
          class="fm-search an-search"
          placeholder={t.searchPlaceholder}
          value={query}
          onInput={(e) => setQuery(e.currentTarget.value)}
        />
        {/* biome-ignore lint/a11y/useSemanticElements: a radiogroup of `<label>`s wrapping real
            radios — the ARIA role names the group the markup already implements. */}
        <div class="an-picker" role="radiogroup" aria-label={t.pickerAria}>
          {convList.slice(0, 120).map((c) => (
            <label key={c.id} class={`an-pick ${picked === c.id ? 'on' : ''}`}>
              <input
                type="radio"
                name="an-thread"
                checked={picked === c.id}
                onChange={() => setPicked(c.id)}
              />
              <span class="an-pick-t">{c.title}</span>
              <span class="an-pick-n tnum">{formatInt(c.messages)}</span>
            </label>
          ))}
        </div>
        <p class="an-picked tnum">
          {picked === null
            ? t.pickNone
            : /* The title comes from the LIST, not from the loaded thread: between the click and
                 the end of the reading — or if the reading fails — the thread does not exist yet,
                 and the line showed « Conversation chosen: » followed by nothing. */
              t.picked(convList.find((c) => c.id === picked)?.title ?? '')}
          {loading && t.loadingSuffix}
        </p>
        {loadError && <p class="ca-ko">{t.loadError('')}</p>}
      </section>

      {/* ————— 4. The sending ————— */}
      <section class="card ca-step">
        {/* Les DEUX prompts en tête de carte, comme dans le produit TikTok : ce sont deux
            questions au choix, pas un réglage à cocher sur l'une d'elles. Le filet n'est pas
            sélectionné d'entrée — c'est une variante assumée, pas un défaut de sécurité. */}
        <div class="kit-head">
          <h2>
            <span class="ca-num">4</span> {t.step4}
          </h2>
          <span class="kit-spacer" />
          <button
            type="button"
            class={`ca-pill ${safety ? '' : 'on'}`}
            aria-pressed={!safety}
            onClick={() => {
              if (safety) toggleSafety();
            }}
          >
            {t.promptDefaultBtn}
          </button>
          <button
            type="button"
            class={`ca-pill ${safety ? 'on' : ''}`}
            aria-pressed={safety}
            onClick={() => {
              if (!safety) toggleSafety();
            }}
          >
            {t.promptSafetyBtn}
          </button>
        </div>

        <label class="ca-field">
          <span>
            {t.promptLabel} <i class="ca-draft">{t.promptDraft}</i>
          </span>
          <textarea
            ref={promptRef}
            value={prompt}
            rows={7}
            onInput={(e) => {
              setPrompt(e.currentTarget.value);
              grow();
            }}
          />
        </label>

        {/* ⚠ WHAT WILL LEAVE, WORD FOR WORD. A page that promises nothing leaves must be able to
            show what does. Closed by default — it is a verification, not required reading — and it
            shows the system prompt AND the body, in the order the server will receive them. */}
        <div class="an-payload">
          <button
            type="button"
            class="an-payload-btn"
            aria-expanded={payloadOpen}
            onClick={() => setPayloadOpen((v) => !v)}
          >
            {payloadOpen ? t.payloadHide : t.payloadShow}
          </button>
          {payloadOpen && (
            <div class="an-payload-box">
              <div class="an-payload-head">
                <span class="an-payload-t">{t.payloadT}</span>
                <span class="an-payload-meta tnum">
                  {t.payloadMeta(formatInt(sentCount), formatInt(realTokens ?? estimated))}
                </span>
                <span class="kit-spacer" />
                <button
                  type="button"
                  class="an-payload-copy"
                  onClick={() => {
                    void navigator.clipboard?.writeText(payloadText).catch(() => {});
                    setPayloadCopied(true);
                    setTimeout(() => setPayloadCopied(false), 1600);
                  }}
                >
                  {payloadCopied ? t.copied : t.copy}
                </button>
              </div>
              <pre class="an-payload-pre">{payloadText}</pre>
              <p class="an-payload-note">{t.payloadNote}</p>
            </div>
          )}
        </div>

        {/* ⚠ ONE CARD, AND NO SETTING. There were two — the method on one side, the count on the
            other — and one carried a « periods per thread » field one could make worse without
            knowing. The number of sequences now follows from the budget and from what the thread
            holds; there is nothing left to set, so nothing left to separate. */}
        <div class="an-sample">
          <p class="ca-budget tnum">
            <b>{t.sampleK}</b>{' '}
            {t.sampleBudget(
              formatInt(sentCount),
              formatInt(totalCount),
              formatInt(sequenceCount),
              sequenceCount > 1,
              formatInt(realTokens ?? estimated),
            )}{' '}
            {realTokens !== null ? t.sampleReal : t.sampleEstimate}
            {period !== undefined &&
              period.from !== null &&
              period.to !== null &&
              t.samplePeriod(dayMonthYear(period.from), dayMonthYear(period.to))}
          </p>
          <p>{t.sampleP}</p>
        </div>

        {estimated > promptWindow && userMessage !== '' && (
          <p class="ca-over">{t.over(formatInt(promptWindow))}</p>
        )}

        <div class="ca-actions">
          <button
            type="button"
            class="ca-run"
            disabled={!ready || running || userMessage === ''}
            onClick={() => void run()}
          >
            {running ? t.runningLabel : t.run}
          </button>
          {running && (
            <button
              type="button"
              class="ca-stop"
              onClick={() => {
                const a = abortRef.current;
                if (a === null) return;
                a.flag.interrupted = true;
                a.controller.abort();
              }}
            >
              {t.stop}
            </button>
          )}
          {!ready && <span class="ca-hint">{t.hintServer}</span>}
          {ready && userMessage === '' && <span class="ca-hint">{t.hintThread}</span>}
        </div>

        {runError && <p class="ca-ko">{t.privacy}</p>}

        {(out !== '' || running) && (
          <>
            <div class="ca-out md" ref={outRef}>
              {out}
              {running && <span class="ca-caret">▍</span>}
            </div>
            {runStats !== null && (
              <p class="ca-detail tnum">
                {t.runStats(
                  formatInt(runStats.p),
                  formatInt(runStats.c),
                  String(Math.round(runStats.ms / 100) / 10),
                  String(runStats.c > 0 ? Math.round(runStats.c / (runStats.ms / 1000)) : 0),
                )}
              </p>
            )}
          </>
        )}

        <p class="ca-privacy">{t.privacy}</p>
      </section>
    </div>
  );
}

/** A copyable command. The command itself comes from `install-help.ts`; this only draws it. */
function Command({ cmd }: { cmd: string }) {
  const t = UI_IG_ANALYSE;
  const [done, setDone] = useState(false);
  return (
    <div class="ca-cmd">
      <code>{cmd}</code>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(cmd).then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1600);
          });
        }}
      >
        {done ? t.copied : t.copy}
      </button>
    </div>
  );
}
