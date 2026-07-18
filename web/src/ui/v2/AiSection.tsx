// Section 04 « Analyser avec une IA locale » (maquette « parcours guidé »), dans l'habillage
// 3 étapes de la maquette.
//
// Trois invariants tiennent cette section (PANO-45) :
//   - OPT-IN : rien ne part au modèle avant un clic explicite sur « Lancer l'analyse ».
//   - LOCAL : l'unique destinataire est le serveur `llama.cpp` que l'utilisateur fait tourner sur SA
//     machine (localhost par défaut). Aucun appel réseau ailleurs — l'invariant du dépôt tient.
//   - ÉPURE (décision yuya, benchmark 12/07) : le modèle reçoit les items bruts, rien d'autre. Pas de
//     sélection de canaux, pas d'agrégats, pas de thèmes D2 dans le prompt — chacun de ces ajouts a
//     DÉGRADÉ la qualité en benchmark. Ne pas les réintroduire sans nouveau benchmark.
//
// Le bouton « Lancer l'analyse » n'est actif que si le serveur répond (`probeLlamaCpp`) : plutôt que
// d'échouer après coup, on montre d'abord comment l'installer (zone d'aide, adaptée à l'OS détecté).
//
// Deux choix de la refonte 2026-07-15 (décisions yuya) :
//   - PLUS de sélecteur de RAM : la commande de lancement propose TOUJOURS `-c 32768`
//     (`SUGGESTED_CONTEXT`). Au runtime, `/props` (fenêtre réelle du serveur) fait foi, inchangé.
//   - bouton ⟳ « revérifier » explicite (maquette).

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  DEFAULT_CONTEXT_WINDOW,
  detectOs,
  installCommand,
  MODEL_CHOICES,
  type ModelChoice,
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
import type { AiSource } from './ai-source';
import { LearnPanel, LearnToggle } from './LearnPanel';
import { LOW_DATA_THRESHOLD } from './NoDeductionCard';
import { NAVY } from './palette';

/** Fenêtre de contexte SUGGÉRÉE dans la commande copiable (décision yuya, refonte 2026-07-15).
 * `/props` fait toujours foi au runtime une fois le serveur joint. */
const SUGGESTED_CONTEXT = 32768;

type ItemsStatus =
  | { kind: 'loading' }
  | { kind: 'ready'; items: AiItem[] }
  | { kind: 'error'; message: string };

type ProbeStatus =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'ok'; modelId: string | null; contextWindow: number | null }
  | { kind: 'error'; message: string };

type Verification =
  | { kind: 'unchecked' }
  | { kind: 'checking' }
  | { kind: 'exact'; selection: ExactSelection }
  | { kind: 'unavailable' };

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

const LEARN_IA = {
  question: 'Comment fonctionne le modèle qui tourne chez toi ?',
  columns: [
    {
      title: 'Prédire le mot suivant',
      text: 'Un modèle de langage ne « pense » pas : il prédit le fragment de mot le plus probable, des milliers de fois de suite. C’est ce flux que tu vois s’écrire.',
    },
    {
      title: 'Tokens',
      text: 'Ton texte est découpé en « tokens » (~¾ de mot chacun). C’est l’unité comptée partout ici : taille du prompt, vitesse en tok/s, longueur de la réponse.',
    },
    {
      title: 'Quantisation (Q4, Q3…)',
      text: 'Les variantes proposées sont le même modèle plus ou moins compressé pour tenir dans ta mémoire. Plus c’est compressé, plus c’est léger — et moins c’est fin.',
    },
    {
      title: 'Local = privé',
      text: 'Le modèle est un simple fichier sur ton disque. Une fois téléchargé, tu peux couper Internet : l’analyse fonctionne toujours, et rien ne sort de ta machine.',
    },
  ],
} as const;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      style={{ ...COPY_BTN, color: copied ? NAVY.ok : '#93a0bf' }}
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      {copied ? 'copié ✓' : 'copier'}
    </button>
  );
}

function CommandLine({ command }: { command: string }) {
  return (
    <div style={CMD_ROW}>
      <span style={CMD_TEXT}>{command}</span>
      <CopyButton text={command} />
    </div>
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
  const [items, setItems] = useState<ItemsStatus>({ kind: 'loading' });
  const [url, setUrl] = useState(serverUrl());
  const [probe, setProbe] = useState<ProbeStatus>({ kind: 'idle' });
  const [probeNonce, setProbeNonce] = useState(0);
  const [mode, setMode] = useState<PromptMode>('default');
  const [editedPrompt, setEditedPrompt] = useState<string | null>(null);
  const [charsPerToken, setCharsPerToken] = useState(DEFAULT_CHARS_PER_TOKEN);
  const [run, setRun] = useState<RunState>(EMPTY_RUN);
  const [error, setError] = useState<string | null>(null);
  const [choice, setChoice] = useState<ModelChoice>(MODEL_CHOICES[0] as ModelChoice);
  const [verification, setVerification] = useState<Verification>({ kind: 'unchecked' });
  const [payloadOpen, setPayloadOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

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
  // sans que personne l'ait demandé — le navigateur ouvre alors sa permission « accéder à d'autres
  // applis et services sur cet appareil » dès l'arrivée sur la page. Rien ne fuite (localhost ne
  // quitte pas l'appareil), mais un outil qui montre la surveillance ne peut pas ouvrir sur cette
  // demande-là. Au clic, la même permission arrive APRÈS une intention, où elle se comprend.
  useEffect(() => {
    if (probeNonce === 0) return; // pas encore demandé — on ne touche à rien
    let cancelled = false;
    setProbe({ kind: 'checking' });
    void probeLlamaCpp(url).then((result) => {
      if (cancelled) return;
      setProbe(
        result.ok
          ? { kind: 'ok', modelId: result.modelId, contextWindow: result.contextWindow }
          : { kind: 'error', message: result.error },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [url, probeNonce]);

  // Contexte RÉEL du serveur (`/props`) — jamais une supposition une fois le serveur joint.
  const contextWindow =
    (probe.kind === 'ok' ? probe.contextWindow : null) ?? DEFAULT_CONTEXT_WINDOW;
  const allItems = items.kind === 'ready' ? items.items : [];

  const heuristicSelection = useMemo(() => {
    const budget = itemsBudget(contextWindow, buildSystemPrompt(mode, true), charsPerToken);
    return selectItemsForBudget(allItems, budget, charsPerToken);
  }, [allItems, contextWindow, mode, charsPerToken]);

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
      (includesSearches) => buildSystemPrompt(mode, includesSearches),
      (sys, user) => countRealPromptTokens(url, sys, user),
    ).then((result) => {
      if (cancelled) return;
      setVerification(result ? { kind: 'exact', selection: result } : { kind: 'unavailable' });
    });
    return () => {
      cancelled = true;
    };
  }, [allItems, contextWindow, mode, probe.kind, url]);

  const selection: Selection =
    verification.kind === 'exact' ? verification.selection : heuristicSelection;

  const includesSearches = selection.items.some((i) => i.kind === 'search');
  const defaultPrompt = buildSystemPrompt(mode, includesSearches);
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
      ? (run.completionTokens / (run.elapsedMs / 1000)).toFixed(1)
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

  const os = detectOs(typeof navigator === 'undefined' ? '' : navigator.userAgent);
  const osLabel = os === 'windows' ? 'Windows' : os === 'macos' ? 'macOS' : 'Linux';
  const install = installCommand(os);
  const serve = serveCommand(choice, SUGGESTED_CONTEXT);
  const serverStatus =
    probe.kind === 'ok'
      ? { color: NAVY.ok, label: 'serveur détecté' }
      : probe.kind === 'checking'
        ? { color: '#93a0bf', label: 'vérification…' }
        : probe.kind === 'idle'
          ? { color: '#93a0bf', label: 'non vérifié' }
          : { color: NAVY.risk, label: 'serveur non détecté' };

  return (
    <div id="sec-ia" style={BAND}>
      <div style={SHELL}>
        <div style={HEAD}>
          <span style={KICKER}>04 · aller plus loin</span>
          <div style={TITLE_ROW}>
            <span style={TITLE}>Analyser avec une IA locale</span>
            <span style={LOCAL_BADGE}>100 % local</span>
            <LearnToggle
              open={learnOpen}
              label="le modèle"
              onToggle={() => setLearnOpen(!learnOpen)}
            />
          </div>
          <p style={LEDE}>
            Le modèle tourne sur ton ordinateur : rien n'est envoyé sur Internet. Trois étapes —
            installer, choisir un prompt, lancer.
          </p>
        </div>

        {/* Bannière « peu de données » (maquette CasPeuDeDonnees) — avant les 3 étapes. */}
        {lowData && (
          <div style={LOW_DATA_BANNER} role="status">
            <span style={LOW_DATA_ICON} aria-hidden="true">
              ▲
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <span style={LOW_DATA_TITLE}>
                Ton export contient très peu de texte : {counts.comments} commentaire(s) et{' '}
                {counts.searches} recherche(s).
              </span>
              <span style={LOW_DATA_TEXT}>
                En dessous de {LOW_DATA_THRESHOLD} items, chaque phrase pèse trop lourd : le modèle
                va sur-interpréter et tirer des conclusions fragiles. Tu peux quand même lancer
                l'analyse — lis simplement le résultat comme une hypothèse, pas comme un portrait.
              </span>
            </div>
          </div>
        )}

        {learnOpen && <LearnPanel question={LEARN_IA.question} columns={LEARN_IA.columns} />}

        {/* --- Étape 1 : installer -------------------------------------------------------------- */}
        <div style={STEP_CARD}>
          <div style={STEP_HEAD}>
            <StepTitle n="1" label="Installer le modèle" />
            <span style={OS_BADGE}>{osLabel} détecté</span>
          </div>
          <div style={FIELD_COL}>
            <span style={STEP_TEXT}>
              Installe llama.cpp, c'est le moteur qui fait tourner le modèle :
            </span>
            <CommandLine command={install} />
          </div>
          <div style={FIELD_COL}>
            <span style={STEP_TEXT}>
              Choisis un modèle, du meilleur au plus léger. Le plus lourd demande le plus de mémoire
              :
            </span>
            <div style={MODEL_GRID}>
              {MODEL_CHOICES.map((m) => {
                const sel = m.quant === choice.quant;
                return (
                  <button
                    type="button"
                    key={m.quant}
                    style={sel ? MODEL_BTN_ON : MODEL_BTN}
                    onClick={() => setChoice(m)}
                  >
                    <span
                      style={{ ...MODEL_Q, color: sel ? NAVY.accentBright : NAVY.textSecondary }}
                    >
                      {m.quant}
                    </span>
                    <span style={MODEL_SIZE}>{m.sizeGb}</span>
                    {m.note !== undefined && (
                      <span
                        style={{
                          ...MODEL_NOTE,
                          color: m.note === 'recommandé' ? NAVY.accent : '#e6b6a3',
                        }}
                      >
                        {m.note}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={FIELD_COL}>
            <span style={STEP_TEXT}>
              Lance le serveur, il télécharge le modèle au premier lancement (~{choice.sizeGb}),
              puis reste ouvert en arrière-plan :
            </span>
            <CommandLine command={serve} />
          </div>
          <div style={ADDR_ROW}>
            <span style={ADDR_LABEL}>adresse du serveur</span>
            <input
              type="text"
              value={url}
              spellcheck={false}
              aria-label="Adresse du serveur"
              style={ADDR_INPUT}
              onInput={(e) => setUrl(e.currentTarget.value)}
            />
            <div style={STATUS_GROUP}>
              <div style={{ ...STATUS_DOT, background: serverStatus.color }} />
              <span style={{ fontSize: '11px', lineHeight: 1.3, color: serverStatus.color }}>
                {serverStatus.label}
                {probe.kind === 'ok' && probe.modelId !== null ? ` : ${probe.modelId}` : ''}
              </span>
              {/* Tant que rien n'a été sondé, l'action porte son nom en toutes lettres : c'est ELLE
                  qui déclenche le premier contact avec localhost. Le ⟳ ne revient qu'ensuite. */}
              <button
                type="button"
                title={probe.kind === 'idle' ? 'vérifier la connexion' : 'revérifier'}
                aria-label={
                  probe.kind === 'idle'
                    ? 'Vérifier la connexion au serveur'
                    : 'Revérifier le serveur'
                }
                style={RECHECK_BTN}
                onClick={() => setProbeNonce((n) => n + 1)}
              >
                {probe.kind === 'idle' ? 'vérifier la connexion' : '⟳'}
              </button>
            </div>
          </div>
          <div style={STEP_FOOT}>
            Tu peux changer cette adresse pour pointer vers n'importe quel serveur compatible, et
            donc faire tourner un tout autre modèle si tu préfères.
          </div>
        </div>

        {/* --- Étape 2 : prompt ------------------------------------------------------------------ */}
        <div style={STEP_CARD}>
          <div style={STEP_HEAD}>
            <StepTitle n="2" label="Prompt d'analyse" />
            <span style={{ flex: 1 }} />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                style={mode === 'default' ? PRESET_ON : PRESET}
                onClick={() => selectMode('default')}
              >
                Prompt par défaut
              </button>
              <button
                type="button"
                style={mode === 'safety' ? PRESET_ON : PRESET}
                onClick={() => selectMode('safety')}
              >
                Prompt « filet de sécurité »
              </button>
            </div>
          </div>
          <textarea
            value={systemPrompt}
            spellcheck={false}
            aria-label="Prompt d'analyse"
            style={PROMPT_AREA}
            onInput={(e) => setEditedPrompt(e.currentTarget.value)}
          />
          {items.kind === 'loading' && (
            <span style={STEP_FOOT}>Lecture des commentaires et des recherches…</span>
          )}
          {items.kind === 'error' && (
            <span style={ERROR_TEXT}>
              Impossible de relire l'export pour l'analyse IA : {items.message}
            </span>
          )}
          {items.kind === 'ready' && (
            <>
              <div style={COUNT_ROW}>
                {/* Compteur teinté + suffixe en cas de peu de données (maquette CasPeuDeDonnees). */}
                <span style={{ ...COUNT_TEXT, ...(lowData ? { color: '#e8a184' } : {}) }}>
                  {sentCounts.comments} commentaires · {sentCounts.searches} recherches inclus ·{' '}
                  {tokensAreExact
                    ? `${estimatedTokens} tokens (vérifié)`
                    : `≈ ${estimatedTokens} tokens`}
                  {selection.droppedComments + selection.droppedSearches > 0 &&
                    ` · ${selection.droppedComments + selection.droppedSearches} items laissés de côté (fenêtre de ${contextWindow} tokens)`}
                  {lowData && ' — très peu de données'}
                </span>
                <span style={{ flex: 1 }} />
                <button
                  type="button"
                  style={PAYLOAD_TOGGLE}
                  onClick={() => setPayloadOpen(!payloadOpen)}
                >
                  {payloadOpen
                    ? 'masquer ce qui sera envoyé ▴'
                    : 'voir exactement ce qui sera envoyé ▾'}
                </button>
              </div>
              {verification.kind === 'checking' && (
                <span style={STEP_FOOT}>
                  Vérification du nombre exact de tokens auprès du serveur…
                </span>
              )}
              {verification.kind === 'unavailable' && (
                <span style={STEP_FOOT}>
                  Ce serveur n'expose pas /tokenize (build ancien) — le compte ci-dessus est une
                  estimation, volontairement pessimiste.
                </span>
              )}
              {selection.tier === 'recent_comments' && counts.searches > 0 && (
                <span style={STEP_FOOT}>
                  Priorité au plus récent : seuls les commentaires les plus récents tiennent dans la
                  fenêtre du modèle ({counts.comments} commentaires et {counts.searches} recherches
                  au total).
                </span>
              )}
              {selection.tier === 'comments_and_recent_searches' && (
                <span style={STEP_FOOT}>
                  Tous les commentaires tiennent, plus les recherches les plus récentes (
                  {selection.droppedSearches} recherches plus anciennes laissées de côté).
                </span>
              )}
              {payloadOpen && (
                <div
                  style={PAYLOAD_BOX}
                >{`[système]\n${systemPrompt}\n\n[items]\n${userMessage}`}</div>
              )}
            </>
          )}
        </div>

        {/* --- Étape 3 : lancer ------------------------------------------------------------------ */}
        <div style={STEP_CARD}>
          <div style={STEP_HEAD}>
            <StepTitle n="3" label="Lancer" />
            <span style={{ flex: 1 }} />
            {run.running && (
              <button type="button" style={STOP_BTN} onClick={stop}>
                ■ Arrêter
              </button>
            )}
            <button
              type="button"
              disabled={!canRun}
              style={canRun ? RUN_BTN : RUN_BTN_OFF}
              onClick={() => void launch()}
            >
              {run.running ? 'analyse en cours…' : 'Lancer l’analyse'}
            </button>
          </div>
          {probe.kind === 'idle' && !run.running && (
            <div style={WARN_TEXT}>
              Serveur non vérifié — lance-le (étape 1) puis clique sur « vérifier la connexion ».
              Ton navigateur demandera alors l’autorisation de joindre ton réseau local : c’est ce
              qui permet à cette page de parler au serveur qui tourne chez toi, et rien d’autre.
            </div>
          )}
          {(probe.kind === 'error' || probe.kind === 'checking') && !run.running && (
            <div style={WARN_TEXT}>Serveur non détecté — lance-le (étape 1) puis clique sur ⟳.</div>
          )}
          {/* Rappel « peu de données » à l'étape 3 (maquette CasPeuDeDonnees) — jamais bloquant. */}
          {lowData && (
            <div style={LOW_DATA_HINT}>
              Peu de données : le résultat sera indicatif, à lire avec recul.
            </div>
          )}
          {error !== null && <div style={ERROR_BOX}>{error}</div>}
          {(run.running || run.text !== '') && (
            <div style={FIELD_COL}>
              <div style={RESULT_BOX}>
                {run.text}
                {run.running && <span style={{ color: NAVY.accent }}>▌</span>}
              </div>
              {!run.running && run.text !== '' && (
                <span style={STEP_FOOT}>
                  {run.interrupted ? 'Analyse interrompue (sortie partielle) — ' : ''}
                  {run.promptTokens > 0
                    ? `${run.promptTokens} tokens lus · ${run.completionTokens} générés · ${(run.elapsedMs / 1000).toFixed(1)} s`
                    : `${(run.elapsedMs / 1000).toFixed(1)} s`}
                  {tokPerSec !== null ? ` · ${tokPerSec} tok/s` : ''}
                </span>
              )}
            </div>
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
const LOCAL_BADGE = {
  fontSize: '9.5px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: NAVY.accent,
  border: '1px solid rgba(47,212,240,.4)',
  borderRadius: '20px',
  padding: '5px 9px',
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
const OS_BADGE = {
  fontSize: '9.5px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#a3b0cf',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '20px',
  padding: '5px 8px',
} as const;
const FIELD_COL = { display: 'flex', flexDirection: 'column', gap: '8px' } as const;
const STEP_TEXT = { fontSize: '12px', lineHeight: 1.6, color: NAVY.textBody } as const;
const STEP_FOOT = { fontSize: '11px', lineHeight: 1.65, color: NAVY.textMuted } as const;
const CMD_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
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
const COPY_BTN = {
  cursor: 'pointer',
  flex: 'none',
  fontSize: '10px',
  fontWeight: 500,
  fontFamily: 'inherit',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  background: 'transparent',
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
  borderTop: `1px solid ${NAVY.borderCard}`,
  paddingTop: '14px',
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
  fontSize: '13px',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: '#a3b0cf',
  background: 'transparent',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '6px',
  padding: '6px 10px',
} as const;
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
        <span style={MN_N}>04</span>
        <span style={MN_TITLE}>Analyser avec une IA locale</span>
      </div>
      <div style={MN_CALLOUT} role="status">
        <span style={MN_ICON} aria-hidden="true">
          🖥
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={MN_CALLOUT_TITLE}>
            L'analyse par IA n'est disponible que sur ordinateur pour l'instant.
          </span>
          <span style={MN_CALLOUT_TEXT}>
            Le modèle tourne localement sur ta machine et demande un ordinateur. Ouvre PanoptiCool
            sur ton ordi pour cette étape — rien ne change pour le reste de l'analyse.
          </span>
        </div>
      </div>
      <div aria-hidden="true" style={MN_PREVIEW_CLIP}>
        <div style={MN_PREVIEW}>
          <div style={MN_FAKE_CARD}>
            <div style={MN_FAKE_HEAD}>
              <span style={MN_FAKE_N}>1</span>
              <span style={MN_FAKE_TITLE}>Installer le modèle</span>
            </div>
            <div style={MN_FAKE_TEXT}>
              Installe llama.cpp, c'est le moteur qui fait tourner le modèle :
            </div>
            <div style={MN_FAKE_CMD}>brew install llama.cpp</div>
            <div style={MN_FAKE_MODELS}>
              <div style={MN_FAKE_MODEL_ON}>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: NAVY.accentBright }}>
                  UD-Q4_K_XL
                </span>
                <span style={{ fontSize: '11px', color: '#a3b0cf' }}>2,2 Go</span>
              </div>
              <div style={MN_FAKE_MODEL}>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: NAVY.textSecondary }}>
                  IQ4_XS
                </span>
                <span style={{ fontSize: '11px', color: '#a3b0cf' }}>2,0 Go</span>
              </div>
            </div>
          </div>
          <div style={MN_FAKE_CARD}>
            <div style={MN_FAKE_HEAD}>
              <span style={MN_FAKE_N}>2</span>
              <span style={MN_FAKE_TITLE}>Prompt d'analyse</span>
            </div>
            <div style={MN_FAKE_PROMPT}>
              Tu es un analyste. À partir des recherches et commentaires TikTok ci-dessous, déduis
              prudemment : centres d'intérêt, habitudes, rythme de vie…
            </div>
          </div>
          <div style={MN_FAKE_CARD}>
            <div style={MN_FAKE_HEAD}>
              <span style={MN_FAKE_N}>3</span>
              <span style={MN_FAKE_TITLE}>Lancer</span>
              <span style={{ flex: 1 }} />
              <span style={MN_FAKE_RUN}>Lancer l'analyse</span>
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
