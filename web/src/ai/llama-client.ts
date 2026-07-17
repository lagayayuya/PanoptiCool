// Client du serveur `llama.cpp` local (PANO-45) — le SEUL backend d'inférence du produit (décision
// yuya, benchmark 12/07 : l'inférence dans le navigateur, mesurée, était trop instable pour le
// parcours réel).
//
// Le serveur expose une API OpenAI-compatible. On n'y touche que cinq endpoints :
//   - `/v1/models`   → le serveur répond-il, et avec quel modèle chargé (bouton « Lancer » actif ou non) ;
//   - `/props`       → fenêtre de contexte RÉELLE (`n_ctx`, celle passée à `-c` au lancement) — jamais
//     une supposition côté client (l'estimation chars/token est trop peu fiable pour fonder une
//     décision de sécurité dessus) ;
//   - `/apply-template` + `/tokenize` → comptage EXACT de tokens (voir `countRealPromptTokens`) ;
//   - `/v1/chat/completions` (SSE) → l'inférence, en streaming, interruptible.
//
// Confidentialité : ce client ne parle qu'à l'URL saisie par l'utilisateur (localhost par défaut).
// Aucun autre appel réseau n'existe dans cette fonctionnalité.

/** Forme minimale d'un chunk SSE OpenAI-compatible. */
interface StreamChunk {
  choices?: { delta?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

export interface StreamResult {
  text: string;
  /** Compteurs RÉELS renvoyés par le serveur (`usage`) — la source de vérité pour le compteur de
   * tokens affiché ET pour recalibrer l'estimation pré-envoi (voir `calibrateCharsPerToken`). */
  promptTokens: number;
  completionTokens: number;
  elapsedMs: number;
  /** Arrêt demandé par l'utilisateur (bouton STOP) — pas un échec : le texte partiel est conservé. */
  interrupted: boolean;
}

/** Poignée partagée entre le bouton STOP et la boucle de streaming : posée à `true` AVANT
 * `controller.abort()`, relue à la fin pour distinguer un arrêt voulu d'une vraie erreur réseau. */
export interface InterruptFlag {
  interrupted: boolean;
}

interface OpenAiModelsResponse {
  data?: { id?: string }[];
}

interface PropsResponse {
  default_generation_settings?: { n_ctx?: number };
}

export interface ProbeOk {
  ok: true;
  modelId: string | null;
  /** `n_ctx` du serveur, ou null s'il ne l'expose pas — l'appelant retombe alors sur un défaut. */
  contextWindow: number | null;
}
export type ProbeResult = ProbeOk | { ok: false; error: string };

function trimUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

/**
 * Le serveur répond-il ? Renvoie le modèle chargé et la fenêtre de contexte réelle. `/props` est
 * best-effort : un serveur qui ne l'expose pas reste parfaitement utilisable (contexte = défaut).
 */
export async function probeLlamaCpp(baseUrl: string): Promise<ProbeResult> {
  const base = trimUrl(baseUrl);
  try {
    const res = await fetch(`${base}/v1/models`);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const json = (await res.json()) as OpenAiModelsResponse;
    let contextWindow: number | null = null;
    try {
      const propsRes = await fetch(`${base}/props`);
      if (propsRes.ok) {
        const props = (await propsRes.json()) as PropsResponse;
        contextWindow = props.default_generation_settings?.n_ctx ?? null;
      }
    } catch {
      // `/props` absent ou refusé : sans conséquence, on garde `null`.
    }
    return { ok: true, modelId: json.data?.[0]?.id ?? null, contextWindow };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

interface ApplyTemplateResponse {
  prompt?: string;
}

interface TokenizeResponse {
  /** Selon `with_pieces`, chaque élément est soit un id (number), soit `{id, piece}` — on n'utilise
   * que la LONGUEUR du tableau, jamais le contenu, donc peu importe la forme exacte des éléments. */
  tokens?: unknown[];
}

/**
 * Comptage EXACT de tokens pour un couple (prompt système, message utilisateur), via le serveur —
 * PAS l'heuristique chars/token (sur du texte réel, l'écart mesuré est de ~1,75×, dans le sens
 * DANGEREUX — sous-estimation qui fait déborder la fenêtre).
 *
 * Deux appels : `/apply-template` rend le prompt tel que `llama-server` le formatera RÉELLEMENT (rôles,
 * balises spéciales du modèle) ; `/tokenize` (`add_special: true`, pour compter aussi le token BOS que
 * le serveur ajoute) le tokenise avec le tokenizer RÉEL du modèle chargé. La longueur du tableau rendu
 * est alors identique au `usage.prompt_tokens` qu'un envoi réel renverrait (vérifié en session sur ce
 * modèle : 7 tokens comptés ici == 7 `prompt_tokens` réels).
 *
 * Renvoie `null` si l'un des deux endpoints est absent ou en erreur (build de `llama-server` trop
 * ancien, serveur injoignable) — l'appelant retombe alors sur l'heuristique chars/token comme borne
 * grossière (voir `estimateTokens`/`DEFAULT_CHARS_PER_TOKEN`, `prompt.ts`).
 */
export async function countRealPromptTokens(
  baseUrl: string,
  systemPrompt: string,
  userMessage: string,
): Promise<number | null> {
  const base = trimUrl(baseUrl);
  try {
    const templateRes = await fetch(`${base}/apply-template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    });
    if (!templateRes.ok) return null;
    const template = (await templateRes.json()) as ApplyTemplateResponse;
    if (typeof template.prompt !== 'string') return null;

    const tokenizeRes = await fetch(`${base}/tokenize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: template.prompt, add_special: true }),
    });
    if (!tokenizeRes.ok) return null;
    const tokenized = (await tokenizeRes.json()) as TokenizeResponse;
    return Array.isArray(tokenized.tokens) ? tokenized.tokens.length : null;
  } catch {
    return null;
  }
}

/**
 * Inférence en streaming SSE. `stream_options: { include_usage: true }` est ce qui fait renvoyer le
 * bloc `usage` dans le dernier chunk : sans lui, `prompt_tokens`/`completion_tokens` restent à zéro —
 * donc ni compteur réel de tokens, ni tok/s.
 *
 * `controller.abort()` (bouton STOP) fait lever une `AbortError`, au fetch ou à la lecture du flux.
 * Si `flag.interrupted` est déjà vrai, c'est un arrêt VOULU : on rend le texte déjà reçu, pas une erreur.
 */
export async function runLlamaCppStream(
  baseUrl: string,
  systemPrompt: string,
  userMessage: string,
  onDelta: (delta: string) => void,
  controller: AbortController,
  flag: InterruptFlag,
): Promise<StreamResult> {
  const t0 = performance.now();
  let text = '';
  let promptTokens = 0;
  let completionTokens = 0;
  const elapsed = () => Math.round(performance.now() - t0);

  let res: Response;
  try {
    res = await fetch(`${trimUrl(baseUrl)}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'local', // ignoré par `llama-server` (un seul modèle chargé), requis par le schéma OpenAI.
        stream: true,
        stream_options: { include_usage: true },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0,
      }),
    });
  } catch (err) {
    if (flag.interrupted)
      return { text, promptTokens, completionTokens, elapsedMs: elapsed(), interrupted: true };
    throw err instanceof Error ? err : new Error(String(err));
  }
  if (!res.ok)
    throw new Error(`llama.cpp : HTTP ${res.status} — le serveur tourne-t-il sur cette URL ?`);
  if (!res.body) throw new Error('llama.cpp : réponse sans corps de flux.');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      let step: ReadableStreamReadResult<Uint8Array>;
      try {
        step = await reader.read();
      } catch (err) {
        if (flag.interrupted) break;
        throw err;
      }
      if (step.done) break;
      buffer += decoder.decode(step.value, { stream: true });
      // Le tampon peut couper une ligne SSE en plein milieu : on ne traite que les lignes complètes et
      // on garde le reste (`buffer`) pour le prochain chunk.
      for (;;) {
        const newlineIdx = buffer.indexOf('\n');
        if (newlineIdx < 0) break;
        const line = buffer.slice(0, newlineIdx).trim();
        buffer = buffer.slice(newlineIdx + 1);
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        let json: StreamChunk;
        try {
          json = JSON.parse(payload);
        } catch {
          continue;
        }
        const delta = json.choices?.[0]?.delta?.content ?? '';
        if (delta) {
          text += delta;
          onDelta(delta);
        }
        if (json.usage) {
          promptTokens = json.usage.prompt_tokens ?? promptTokens;
          completionTokens = json.usage.completion_tokens ?? completionTokens;
        }
      }
    }
  } finally {
    void reader.cancel().catch(() => {});
  }
  return {
    text,
    promptTokens,
    completionTokens,
    elapsedMs: elapsed(),
    interrupted: flag.interrupted,
  };
}
