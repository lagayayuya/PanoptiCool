// Section 04 « Analyser avec une IA locale » (maquette « parcours guidé », itération 2026-07-20) —
// deux cartes : « 1 · Installer » (système, terminal, modèle, choix de route) et « 2 · Prompt &
// lancement » (fusion des ex-cartes 2 et 3).
//
// Trois invariants tiennent cette section (PANO-45) :
//   - OPT-IN : rien ne part au modèle avant un clic explicite sur « Lancer l'analyse ».
//   - LOCAL : l'unique destinataire est le serveur `llama.cpp` que l'utilisateur fait tourner sur SA
//     machine (localhost par défaut). Aucun appel réseau ailleurs — l'invariant du dépôt tient.
//   - ÉPURE (décision yuya, benchmark 12/07) : le modèle reçoit les items bruts, rien d'autre. Pas de
//     sélection de canaux, pas d'agrégats, pas de thèmes D2 dans le prompt — chacun de ces ajouts a
//     DÉGRADÉ la qualité en benchmark. Ne pas les réintroduire sans nouveau benchmark.
//
// L'itération 2026-07-20 ajoute trois discriminations, toutes au service d'ADR-0006 :
//   - le NAVIGATEUR est nommé (UA, `ai/browser.ts`) : la bannière d'entrée dit à l'avance ce que
//     son moteur permet — Firefox demandera, Chromium exige le cadenas, WebKit ne peut pas. L'ex-
//     pastille « bloqué par le navigateur » disparaît : elle s'affichait aussi sans certitude ;
//   - DEUX ROUTES : A « Depuis ce site » (l'ex-parcours, indisponible sous WebKit) et B « Tout sur
//     ta machine » (zip du site + `llama-server --path`, ADR-0006 décision 5) ;
//   - le MODE LOCALHOST : si la page est servie depuis la boucle locale et que le serveur répond,
//     l'installation n'a plus rien à dire — « Tout est prêt » et la carte 2 est active.
//
// Deux choix de la refonte 2026-07-15 (décisions yuya), inchangés :
//   - PLUS de sélecteur de RAM : la commande de lancement propose TOUJOURS `-c 32768`
//     (`SUGGESTED_CONTEXT`). Au runtime, `/props` (fenêtre réelle du serveur) fait foi.
//   - bouton ⟳ « revérifier » explicite (maquette).

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
import { NAVY } from './palette';

/** Fenêtre de contexte SUGGÉRÉE dans la commande copiable (décision yuya, refonte 2026-07-15).
 * `/props` fait toujours foi au runtime une fois le serveur joint. */
const SUGGESTED_CONTEXT = 32768;

/** Où s'installe Homebrew — une URL n'est pas de la prose, elle vit avec le composant. */
const BREW_URL = 'https://brew.sh';

type ItemsStatus =
  | { kind: 'loading' }
  | { kind: 'ready'; items: AiItem[] }
  | { kind: 'error'; message: string };

type ProbeStatus =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'ok'; modelId: string | null; contextWindow: number | null }
  /** L'échec ne porte QUE `gate`, et c'est une décision. Le message de `fetch` était conservé ici
   * sans qu'aucun rendu ne le lise — or il vaut « Failed to fetch » quelle que soit la cause
   * (ADR-0006, mesuré). Une chaîne constante ne distingue rien : la garder revenait à stocker du
   * bruit et à croire qu'on gardait une preuve. Ce qui informe, c'est la permission. */
  | { kind: 'error'; gate: LocalNetworkGate };

type Verification =
  | { kind: 'unchecked' }
  | { kind: 'checking' }
  | { kind: 'exact'; selection: ExactSelection }
  | { kind: 'unavailable' };

/** Ce que la page sait de son ENVIRONNEMENT — détecté une fois au premier rendu, corrigeable à la
 * main pour l'OS (boutons « ton système »). Un OBJET d'état plutôt que trois lectures directes de
 * `navigator` : le golden d'interface sème ses états par la forme de l'initialiseur, et un objet à
 * clé `browser` se remplace sans toucher aux autres. */
interface AiEnv {
  os: Os;
  browser: BrowserInfo;
  /** La page est servie depuis la boucle locale (route B aboutie, ou dev). Les murs d'ADR-0006
   * n'existent alors PAS : même origine ou loopback → loopback, exempté par les trois moteurs. */
  localhost: boolean;
  /** L'origine à sonder quand `localhost` — le serveur qui vient de servir la page. */
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

// TOUTE la zone de commande copie au clic (demande yuya) : la rangée est un `<button>`, et
// l'étiquette « copier / copié ✓ » n'est plus qu'un `<span>` — plus de bouton dans le bouton, plus
// d'effet de survol sur cette étiquette. Le survol reste sur la rangée entière (`hv-bd`), qui EST
// la cible cliquable.
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
  // La langue de la page, lue UNE fois : elle décide le prompt système, donc la langue de la
  // réponse du modèle — rien d'autre ne la fixe côté serveur (cf. `ai/prompt.ts`).
  const locale = currentLocale();
  const [items, setItems] = useState<ItemsStatus>({ kind: 'loading' });
  const [env] = useState<AiEnv>(detectAiEnv());
  const [osSel, setOsSel] = useState<Os | null>(null);
  // Objet à clé `choice` (pas une chaîne nue) : le semis du golden reconnaît ses cibles à la FORME
  // de l'initialiseur, et `null` est la forme d'autres états de cette section.
  const [route, setRoute] = useState<{ choice: RouteChoice | null }>({ choice: null });
  const [url, setUrl] = useState(env.origin ?? serverUrl());
  const [probe, setProbe] = useState<ProbeStatus>({ kind: 'idle' });
  // En mode localhost, le sondage part TOUT SEUL (nonce initial 1) : le serveur sondé est celui qui
  // vient de servir la page — le contact ne précède pas l'intention, il la suit (la personne a
  // lancé ce serveur et tapé son adresse). Hors localhost, rien ne part avant le clic (ADR-0006 :
  // sonder au chargement y a été écarté, et la raison tient toujours).
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

  // Extraction des items dès l'affichage (worker local, rien ne sort — l'opt-in porte sur l'ENVOI).
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

  // Sondage du serveur — JAMAIS au montage : uniquement sur demande explicite (`probeNonce > 0`),
  // puis à chaque changement d'adresse. Sonder à l'affichage enverrait un `fetch` vers localhost
  // sans que personne l'ait demandé. Rien ne fuite (localhost ne quitte pas l'appareil), mais un
  // outil qui montre la surveillance ne peut pas contacter une machine sans qu'on le lui demande.
  //
  // Ce report NE GARANTIT AUCUNE FENÊTRE DE PERMISSION. Il l'a longtemps promis, et c'est faux :
  // le navigateur décide seul s'il demande quoi que ce soit, et certains ne demandent jamais
  // (ADR-0006). Ce que le report tient, lui, est intact — le premier contact suit une intention,
  // et c'est à cet endroit que l'interface explique quoi faire quand le navigateur, lui, se tait.
  useEffect(() => {
    if (probeNonce === 0) return; // pas encore demandé — on ne touche à rien
    let cancelled = false;
    setProbe({ kind: 'checking' });
    void (async () => {
      const result = await probeLlamaCpp(url);
      if (cancelled) return;
      if (result.ok) {
        setProbe({ kind: 'ok', modelId: result.modelId, contextWindow: result.contextWindow });
        return;
      }
      // La permission ne se lit qu'en cas d'ÉCHEC : quand le serveur répond, il n'y a rien à
      // expliquer, et une lecture inutile est une lecture de trop.
      const gate = await localNetworkGate();
      if (!cancelled) setProbe({ kind: 'error', gate });
    })();
    return () => {
      cancelled = true;
    };
  }, [url, probeNonce]);

  // Contexte RÉEL du serveur (`/props`) — jamais une supposition une fois le serveur joint.
  const contextWindow =
    (probe.kind === 'ok' ? probe.contextWindow : null) ?? DEFAULT_CONTEXT_WINDOW;
  const allItems = items.kind === 'ready' ? items.items : [];

  const heuristicSelection = useMemo(() => {
    const budget = itemsBudget(contextWindow, buildSystemPrompt(locale, mode, true), charsPerToken);
    return selectItemsForBudget(allItems, budget, charsPerToken);
  }, [allItems, contextWindow, mode, charsPerToken, locale]);

  // Sélection EXACTE vérifiée par le serveur (/apply-template + /tokenize).
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
  // Cas limite « peu de données » (maquette CasPeuDeDonnees) : sous LOW_DATA_THRESHOLD items,
  // chaque phrase pèse trop lourd — le modèle sur-interprète. On PRÉVIENT (bannière + compteur
  // teinté + rappel à l'étape 3) sans jamais bloquer le lancement : hypothèse, pas portrait.
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

  // --- Environnement : OS (corrigeable), navigateur, mode localhost --------------------------------
  const os = osSel ?? env.os;
  const osLabel: Record<Os, string> = { macos: 'macOS', windows: 'Windows', linux: 'Linux' };
  const browser = env.browser;
  const browserName = browser.name ?? UI_AI.browserFallbackName;
  // Sur la boucle locale, les murs d'ADR-0006 n'existent PAS (origine = cible = localhost, exemptée
  // par les trois moteurs) : tout navigateur y est compatible, et la bannière rouge/verte — qui ne
  // parle que des origines HTTPS distantes — n'a rien à y dire. yuya a vérifié le comportement, on
  // re-masque donc la bannière quand le hostname est localhost.
  const compat = env.localhost || browser.engine !== 'webkit';
  const effRoute: RouteChoice = compat ? (route.choice ?? 'site') : 'local';
  const localMode = env.localhost && probe.kind === 'ok';
  const promptActive = !(effRoute === 'local' && !localMode);

  const install = installCommand(os);
  const serve = serveCommand(choice, SUGGESTED_CONTEXT);
  const localCmd = localSiteCommand(os, choice, SUGGESTED_CONTEXT);

  /** La bannière d'entrée — le discours par MOTEUR (ADR-0006) : deux marchent, un est un mur, et
   * l'inconnu ne se voit attribuer aucune cause. `null` sur localhost : aucun mur, rien à prévenir. */
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

  /** La note de permission AVANT le premier clic (route A) — Firefox ouvrira une fenêtre, Chromium
   * jamais, et localhost n'a aucune permission à demander (`null`). */
  const permNote = env.localhost
    ? null
    : browser.engine === 'firefox'
      ? UI_AI.permNoteFirefox(browserName)
      : browser.engine === 'chromium'
        ? UI_AI.permNoteChromium(browserName)
        : UI_AI.permNoteGeneric;

  /** L'aide d'échec, choisie sur ce qu'on SAIT (ADR-0006, décisions 2-4) : la permission lue
   * d'abord, le moteur reconnu ensuite — jamais une cause affirmée sans preuve. Sur localhost,
   * aucun mur n'est possible : un échec est une absence. */
  const probeFailureHelp = (gate: LocalNetworkGate): string => {
    if (env.localhost || gate === 'granted') return UI_AI.step3WarnAbsent;
    if (gate === 'blocked') return UI_AI.step3WarnBlocked;
    return browser.engine === 'firefox' ? UI_AI.step3WarnFirefox : UI_AI.step3WarnUnknown;
  };

  /** La pastille ne dit plus que ce qu'on SAIT : « non détecté » quand le réseau a vraiment été
   * atteint (permission accordée, ou boucle locale), « connexion impossible » sinon. Le diagnostic
   * détaillé vit dans `probeFailureHelp`. */
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
          <span style={KICKER}>{UI_AI.kicker}</span>
          <div style={TITLE_ROW}>
            <span style={TITLE}>{UI_AI.title}</span>
            <span style={LOCAL_BADGE}>{UI_AI.localBadge}</span>
            <LearnToggle
              open={learnOpen}
              label={UI_AI.learnLabel}
              onToggle={() => setLearnOpen(!learnOpen)}
            />
          </div>
          <p style={LEDE}>{UI_AI.lede}</p>
        </div>

        {/* Bannière « peu de données » (maquette CasPeuDeDonnees) — avant les 3 étapes. */}
        {lowData && (
          <div style={LOW_DATA_BANNER} role="status">
            <span style={LOW_DATA_ICON} aria-hidden="true">
              ▲
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <span style={LOW_DATA_TITLE}>
                {UI_AI.lowDataCounts(counts.comments, counts.searches)}
              </span>
              <span style={LOW_DATA_TEXT}>{UI_AI.lowDataText(LOW_DATA_THRESHOLD)}</span>
            </div>
          </div>
        )}

        {learnOpen && <LearnPanel question={UI_AI_LEARN.question} columns={UI_AI_LEARN.columns} />}

        {/* --- Bannière navigateur (ADR-0006 : le discours par moteur, AVANT toute installation).
            `null` sur localhost — pas de mur à prévenir. -- */}
        {banner !== null && (
          <div style={banner.ok ? BANNER_OK : BANNER_WARN} role="status">
            <span
              style={{ ...BANNER_ICON, color: banner.ok ? NAVY.ok : NAVY.risk }}
              aria-hidden="true"
            >
              {banner.ok ? '✓' : '▲'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ ...BANNER_TITLE, color: banner.ok ? '#bfe9cd' : NAVY.riskText }}>
                {banner.title}
              </span>
              <span style={{ ...BANNER_TEXT, color: banner.ok ? '#9ec7ac' : '#d9a894' }}>
                {banner.text}
              </span>
            </div>
          </div>
        )}

        {/* --- Carte 1 : installer ---------------------------------------------------------------- */}
        <div style={STEP_CARD}>
          <div style={STEP_HEAD}>
            <StepTitle n="1" label={UI_AI.step1Label} />
            <span style={{ flex: 1 }} />
            <div style={OS_PICK_ROW}>
              <span style={OS_PICK_LABEL}>{UI_AI.osPickLabel}</span>
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
          </div>

          {localMode ? (
            /* Route B aboutie (ou dev) : la page ET le modèle sont servis depuis la machine — il
               n'y a littéralement rien à installer. */
            <div style={READY_BOX} role="status">
              <span style={{ ...BANNER_ICON, color: NAVY.ok }} aria-hidden="true">
                ✓
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ ...BANNER_TITLE, color: '#bfe9cd' }}>{UI_AI.readyTitle}</span>
                <span style={{ ...BANNER_TEXT, color: '#9ec7ac' }}>{UI_AI.readyText}</span>
              </div>
            </div>
          ) : (
            <>
              <div class="hv-bd" style={TERM_BOX}>
                <button type="button" style={TERM_BTN} onClick={() => setTermOpen(!termOpen)}>
                  {termOpen ? UI_AI.termOpened : UI_AI.termClosed}
                </button>
                {termOpen && (
                  <div style={TERM_BODY}>
                    <span style={TERM_TEXT}>{UI_AI.termIntro}</span>
                    <span style={TERM_TEXT}>
                      {UI_AI.termHowLead(osLabel[os], UI_AI.termHows[os])}
                    </span>
                  </div>
                )}
              </div>

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
                        <span
                          style={{ fontSize: '11px', lineHeight: 1.3, color: serverStatus.color }}
                        >
                          {serverStatus.label}
                          {probe.kind === 'ok' && probe.modelId !== null
                            ? UI_AI.probeModelSuffix(probe.modelId)
                            : ''}
                        </span>
                        {/* L'action porte son nom en toutes lettres, avant COMME après le
                            premier sondage (retouche 2026-07-20 : plus de glyphe ⟳) — c'est elle
                            qui déclenche tout contact avec localhost. */}
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

        {/* --- Carte 2 : prompt & lancement (fusion des ex-cartes 2 et 3) -------------------------- */}
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
            /* Route B choisie, page encore servie depuis l'origine distante : la suite se passe sur
               la copie locale du site — cette carte le dit, et n'offre rien d'actionnable ici. */
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
                    {/* Compteur teinté + suffixe en cas de peu de données (maquette CasPeuDeDonnees). */}
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* L'aide d'échec se choisit sur ce qu'on SAIT (permission lue + moteur reconnu,
                      `probeFailureHelp`) — jamais une cause affirmée sans preuve (ADR-0006). */}
                  {!run.running && probe.kind === 'idle' && (
                    <div style={WARN_TEXT}>{UI_AI.step3WarnIdle}</div>
                  )}
                  {!run.running && probe.kind === 'checking' && (
                    <div style={WARN_TEXT}>{UI_AI.probeChecking}</div>
                  )}
                  {!run.running && probe.kind === 'error' && (
                    <div style={WARN_TEXT}>{probeFailureHelp(probe.gate)}</div>
                  )}
                </div>
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
              {/* Rappel « peu de données » au lancement (maquette CasPeuDeDonnees) — jamais bloquant. */}
              {lowData && <div style={LOW_DATA_HINT}>{UI_AI.lowDataHint}</div>}
              {error !== null && <div style={ERROR_BOX}>{error}</div>}
              {(run.running || run.text !== '') && (
                <div style={FIELD_COL}>
                  <div style={RESULT_BOX}>
                    {run.text}
                    {run.running && <span style={{ color: NAVY.accent }}>▌</span>}
                  </div>
                  {!run.running && run.text !== '' && (
                    <span style={STEP_FOOT}>
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

// --- Styles (maquette « parcours guidé », section 04) ----------------------------------------------
const BAND = {
  marginTop: '20px',
  background: 'linear-gradient(180deg, #0e1836, #0a1024)',
  borderTop: '1px solid rgba(47,212,240,.45)',
} as const;
const SHELL = {
  maxWidth: '1020px',
  margin: '0 auto',
  padding: '58px 40px 40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
} as const;
const HEAD = { display: 'flex', flexDirection: 'column', gap: '12px' } as const;
const KICKER = {
  fontSize: '11px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const TITLE_ROW = { display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' } as const;
const TITLE = {
  fontSize: '26px',
  fontWeight: 500,
  lineHeight: 1.2,
  letterSpacing: '-0.01em',
  color: NAVY.textBright,
} as const;
// Aligné en hauteur avec le bouton « comprendre » voisin (`LearnToggle`, tous deux lineHeight 1) :
// même boîte de 28,5 px (police 9,5 + 2×8,5 padding + 2 bordure = 10,5 + 2×8 + 2 pour le bouton).
// yuya : les deux doivent partager haut et bas dans la rangée de titre.
const LOCAL_BADGE = {
  fontSize: '9.5px',
  lineHeight: 1,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: NAVY.accent,
  border: '1px solid rgba(47,212,240,.4)',
  borderRadius: '20px',
  padding: '8.5px 9px',
} as const;
const LEDE = {
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.8,
  color: NAVY.textBody,
  maxWidth: '720px',
} as const;
const STEP_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  padding: '28px',
  background: 'rgba(12,19,41,.65)',
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '12px',
} as const;
const STEP_HEAD = { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' } as const;
const STEP_N = {
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
const STEP_LABEL = {
  fontSize: '13.5px',
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textHeading,
} as const;
// Sélecteur de système (maquette v4) — remplace l'ex-badge « OS détecté » : la détection reste
// best-effort, mais la personne peut désormais corriger d'un clic.
const OS_PICK_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexWrap: 'wrap',
} as const;
const OS_PICK_LABEL = {
  fontSize: '9.5px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY.textMuted,
} as const;
const OS_BTN = {
  cursor: 'pointer',
  fontSize: '9.5px',
  fontWeight: 500,
  fontFamily: 'inherit',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textMuted,
  background: 'transparent',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '20px',
  padding: '6px 10px',
} as const;
const OS_BTN_ON = {
  ...OS_BTN,
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: `1px solid ${NAVY.accent}`,
} as const;
const FIELD_COL = { display: 'flex', flexDirection: 'column', gap: '8px' } as const;
// Bannière navigateur / encart « tout est prêt » — les teintes vert/orange de la maquette.
const BANNER_BASE = {
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
  borderRadius: '12px',
  padding: '16px 20px',
} as const;
const BANNER_OK = {
  ...BANNER_BASE,
  background: 'rgba(74,222,128,.05)',
  border: '1px solid rgba(74,222,128,.28)',
} as const;
const BANNER_WARN = {
  ...BANNER_BASE,
  background: NAVY.riskBg,
  border: '1px solid rgba(232,117,78,.35)',
} as const;
const READY_BOX = {
  ...BANNER_BASE,
  background: 'rgba(74,222,128,.05)',
  border: '1px solid rgba(74,222,128,.28)',
  borderRadius: '10px',
} as const;
const BANNER_ICON = { fontSize: '13px', lineHeight: 1.5, flex: 'none' } as const;
const BANNER_TITLE = { fontSize: '12.5px', fontWeight: 600, lineHeight: 1.5 } as const;
const BANNER_TEXT = { fontSize: '11.5px', lineHeight: 1.7, maxWidth: '760px' } as const;
// Dépli « jamais ouvert de terminal ? » (maquette) — pointillé, même famille que les panneaux
// pédagogiques.
const TERM_BOX = {
  display: 'flex',
  flexDirection: 'column',
  border: `1px dashed ${NAVY.borderChip}`,
  borderRadius: '9px',
} as const;
const TERM_BTN = {
  cursor: 'pointer',
  textAlign: 'left',
  fontSize: '10.5px',
  fontWeight: 500,
  fontFamily: 'inherit',
  lineHeight: 1.3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.learnAccent,
  background: 'transparent',
  border: 'none',
  padding: '12px 15px',
} as const;
const TERM_BODY = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '0 15px 14px',
} as const;
const TERM_TEXT = { fontSize: '11.5px', lineHeight: 1.75, color: NAVY.textBody } as const;
// Sous-étapes numérotées de la carte 1 (petits carrés cyan, maquette).
const SUB_ROW = { display: 'flex', gap: '14px', alignItems: 'flex-start' } as const;
const SUB_N = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
  borderRadius: '5px',
  background: NAVY.accent,
  fontSize: '10px',
  fontWeight: 700,
  color: NAVY.bgPage,
  flex: 'none',
} as const;
const SUB_BODY = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
} as const;
// Les deux routes (A / B).
const ROUTE_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '12px',
} as const;
const ROUTE_BTN = {
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  gap: '8px',
  padding: '16px 18px',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '10px',
  fontFamily: 'inherit',
} as const;
const ROUTE_BTN_ON = {
  ...ROUTE_BTN,
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
} as const;
const ROUTE_BTN_OFF = { ...ROUTE_BTN, cursor: 'not-allowed', opacity: 0.55 } as const;
const ROUTE_TITLE = {
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: 1.3,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
} as const;
const ROUTE_TEXT = { fontSize: '11px', lineHeight: 1.7, color: '#9aa7c7' } as const;
const ROUTE_UNAVAIL = {
  fontSize: '9.5px',
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#e8a184',
} as const;
// Encart indigo — note de permission, note « ouvre localhost », carte 2 en attente de la route B.
const NOTE_BOX = {
  fontSize: '11.5px',
  lineHeight: 1.75,
  color: NAVY.learnTitle,
  background: 'rgba(124,150,255,.06)',
  border: `1px solid ${NAVY.learnBorder}`,
  borderRadius: '8px',
  padding: '12px 15px',
} as const;
const ADDR_BLOCK = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  borderTop: `1px solid ${NAVY.borderCard}`,
  paddingTop: '14px',
} as const;
// Route B : téléchargement du site.
const ZIP_ROW = { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' } as const;
const ZIP_BTN = {
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: 1,
  color: NAVY.bgPage,
  background: NAVY.accent,
  borderRadius: '8px',
  padding: '12px 18px',
  textDecoration: 'none',
} as const;
const GH_LINK = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '11.5px',
  fontWeight: 500,
  lineHeight: 1,
  color: NAVY.textSecondary,
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '8px',
  padding: '12px 16px',
  textDecoration: 'none',
} as const;
const FOOT_LINK = { color: NAVY.accent, textDecoration: 'none' } as const;
// Rangée de lancement (carte 2) : l'aide à gauche, les boutons à droite.
const RUN_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  borderTop: `1px solid ${NAVY.borderCard}`,
  paddingTop: '14px',
} as const;
const STEP_TEXT = { fontSize: '12px', lineHeight: 1.6, color: NAVY.textBody } as const;
const STEP_FOOT = { fontSize: '11px', lineHeight: 1.65, color: NAVY.textMuted } as const;
// Rangée de commande — c'est un `<button>` : cible cliquable pleine largeur, texte aligné à gauche.
const CMD_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  boxSizing: 'border-box',
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: 'inherit',
  background: NAVY.bgPage,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '8px',
  padding: '11px 13px',
} as const;
const CMD_TEXT = {
  flex: 1,
  fontSize: '12.5px',
  lineHeight: 1.5,
  color: NAVY.accentBright,
  overflowWrap: 'anywhere',
} as const;
// L'étiquette « copier / copié ✓ » — un simple repère visuel désormais (la rangée entière copie),
// donc SANS survol propre.
const COPY_BTN = {
  flex: 'none',
  fontSize: '10px',
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '6px',
  padding: '7px 11px',
} as const;
const MODEL_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '8px',
} as const;
const MODEL_BTN = {
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  gap: '7px',
  padding: '12px 13px',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
  fontFamily: 'inherit',
} as const;
const MODEL_BTN_ON = {
  ...MODEL_BTN,
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
} as const;
const MODEL_Q = {
  fontSize: '11.5px',
  fontWeight: 600,
  lineHeight: 1.3,
  overflowWrap: 'anywhere',
} as const;
const MODEL_SIZE = { fontSize: '11px', lineHeight: 1, color: '#a3b0cf' } as const;
const MODEL_NOTE = {
  fontSize: '9.5px',
  lineHeight: 1.35,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
} as const;
const ADDR_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
} as const;
const ADDR_LABEL = {
  fontSize: '11px',
  lineHeight: 1.3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textMuted,
} as const;
const ADDR_INPUT = {
  flex: 1,
  minWidth: '200px',
  fontSize: '12px',
  lineHeight: 1.3,
  fontFamily: 'inherit',
  color: NAVY.textBright,
  background: NAVY.bgPage,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '7px',
  padding: '9px 12px',
} as const;
const STATUS_GROUP = { display: 'flex', alignItems: 'center', gap: '8px' } as const;
const STATUS_DOT = { width: '9px', height: '9px', borderRadius: '50%' } as const;
const RECHECK_BTN = {
  cursor: 'pointer',
  fontSize: '10px',
  fontWeight: 500,
  fontFamily: 'inherit',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#a3b0cf',
  background: 'transparent',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '6px',
  padding: '8px 12px',
} as const;
/** Le lien vers la copie locale du site — cliquable (retouche 2026-07-20). */
const LOCAL_URL_LINK = { color: NAVY.accentBright, textDecoration: 'none' } as const;
const PRESET = {
  cursor: 'pointer',
  fontSize: '10.5px',
  fontWeight: 500,
  fontFamily: 'inherit',
  lineHeight: 1.3,
  color: '#93a0bf',
  background: 'transparent',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '20px',
  padding: '8px 14px',
} as const;
const PRESET_ON = {
  ...PRESET,
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: `1px solid ${NAVY.accent}`,
} as const;
const PROMPT_AREA = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '130px',
  resize: 'vertical',
  fontSize: '12.5px',
  lineHeight: 1.75,
  fontFamily: 'inherit',
  color: NAVY.textHeading,
  background: NAVY.bgPage,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
  padding: '14px 16px',
} as const;
const COUNT_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  flexWrap: 'wrap',
} as const;
const COUNT_TEXT = { fontSize: '11px', lineHeight: 1.45, color: '#a3b0cf' } as const;
const PAYLOAD_TOGGLE = {
  cursor: 'pointer',
  fontSize: '11px',
  fontFamily: 'inherit',
  lineHeight: 1.3,
  color: NAVY.accent,
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(47,212,240,.4)',
  padding: '2px 0',
} as const;
const PAYLOAD_BOX = {
  background: NAVY.bgPage,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
  padding: '15px 17px',
  fontSize: '11.5px',
  lineHeight: 1.8,
  color: '#96a3c4',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  maxHeight: '300px',
  overflow: 'auto',
} as const;
const RUN_BTN = {
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'inherit',
  letterSpacing: '0.04em',
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: 'none',
  borderRadius: '8px',
  padding: '13px 22px',
} as const;
const RUN_BTN_OFF = { ...RUN_BTN, cursor: 'not-allowed', background: NAVY.textDim } as const;
const STOP_BTN = {
  ...RUN_BTN,
  background: '#7a2a24',
  color: NAVY.textBright,
} as const;
const WARN_TEXT = { fontSize: '11.5px', lineHeight: 1.65, color: NAVY.riskText } as const;
// Cas limite « peu de données » (maquette CasPeuDeDonnees).
const LOW_DATA_BANNER = {
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
  background: NAVY.riskBg,
  border: '1px solid rgba(232,117,78,.35)',
  borderRadius: '12px',
  padding: '18px 22px',
} as const;
const LOW_DATA_ICON = {
  color: NAVY.risk,
  fontSize: '14px',
  lineHeight: 1.5,
  flex: 'none',
} as const;
const LOW_DATA_TITLE = {
  fontSize: '13px',
  fontWeight: 600,
  lineHeight: 1.5,
  color: NAVY.riskText,
} as const;
const LOW_DATA_TEXT = {
  fontSize: '12px',
  lineHeight: 1.7,
  color: '#d9a894',
  maxWidth: '720px',
} as const;
const LOW_DATA_HINT = { fontSize: '11.5px', lineHeight: 1.65, color: '#d9a894' } as const;
const ERROR_TEXT = { fontSize: '11.5px', lineHeight: 1.65, color: NAVY.risk } as const;
const ERROR_BOX = {
  ...ERROR_TEXT,
  background: NAVY.riskBg,
  border: `1px solid ${NAVY.riskBorder}`,
  borderRadius: '8px',
  padding: '12px 15px',
} as const;
const RESULT_BOX = {
  background: NAVY.bgPage,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
  padding: '17px 19px',
  fontSize: '12.5px',
  lineHeight: 1.8,
  color: NAVY.textHeading,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  maxHeight: '420px',
  overflowY: 'auto',
} as const;

// --- Variante MOBILE (maquette « PanoptiCool v4 Mobile ») ------------------------------------------
// L'IA locale demande un ordinateur (llama.cpp) : sur mobile on n'affiche PAS la section
// interactive, mais un encart explicatif + un APERÇU DÉCORATIF flouté des 3 étapes (aria-hidden,
// non interactif) — l'utilisateur voit qu'une étape existe et où la faire, sans faux boutons.

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
