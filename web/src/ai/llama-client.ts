// Client of the local `llama.cpp` server (PANO-45) — the ONLY inference backend of the product
// (yuya's decision, benchmark 12/07: in-browser inference, measured, was too unstable for the
// real journey).
//
// The server exposes an OpenAI-compatible API. We only touch five endpoints:
//   - `/v1/models`   → does the server respond, and with which model loaded ("Launch" button active or not);
//   - `/props`       → the REAL context window (`n_ctx`, the one passed to `-c` at launch) — never
//     a client-side guess (the chars/token estimate is too unreliable to ground a
//     safety decision on it);
//   - `/apply-template` + `/tokenize` → EXACT token count (see `countRealPromptTokens`);
//   - `/v1/chat/completions` (SSE) → the inference, streamed, interruptible.
//
// Privacy: this client only talks to the URL entered by the user (localhost by default).
// No other network call exists in this feature.

/** Minimal shape of an OpenAI-compatible SSE chunk. */
interface StreamChunk {
  choices?: { delta?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
}

export interface StreamResult {
  text: string;
  /** REAL counters returned by the server (`usage`) — the source of truth for the displayed token
   * counter AND for recalibrating the pre-send estimate (see `calibrateCharsPerToken`). */
  promptTokens: number;
  completionTokens: number;
  elapsedMs: number;
  /** Stop requested by the user (STOP button) — not a failure: the partial text is kept. */
  interrupted: boolean;
}

/** Handle shared between the STOP button and the streaming loop: set to `true` BEFORE
 * `controller.abort()`, reread at the end to distinguish an intended stop from a real network error. */
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
  /** The server's `n_ctx`, or null if it does not expose it — the caller then falls back to a default. */
  contextWindow: number | null;
}
export type ProbeResult = ProbeOk | { ok: false; error: string };

function trimUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

/**
 * Does the server respond? Returns the loaded model and the real context window. `/props` is
 * best-effort: a server that does not expose it stays perfectly usable (context = default).
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
      // `/props` missing or refused: harmless, we keep `null`.
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
  /** Depending on `with_pieces`, each element is either an id (number) or `{id, piece}` — we only use
   * the LENGTH of the array, never the content, so the exact shape of the elements does not matter. */
  tokens?: unknown[];
}

/**
 * EXACT token count for a (system prompt, user message) pair, via the server — NOT the chars/token
 * heuristic (on real text, the measured gap is ~1.75×, in the DANGEROUS direction — an
 * under-estimation that overflows the window).
 *
 * Two calls: `/apply-template` renders the prompt as `llama-server` will ACTUALLY format it (roles,
 * model-specific special tags); `/tokenize` (`add_special: true`, to also count the BOS token the
 * server adds) tokenizes it with the REAL tokenizer of the loaded model. The length of the returned
 * array is then identical to the `usage.prompt_tokens` a real send would return (verified in session
 * on this model: 7 tokens counted here == 7 real `prompt_tokens`).
 *
 * Returns `null` if either of the two endpoints is missing or errors (a `llama-server` build too
 * old, an unreachable server) — the caller then falls back to the chars/token heuristic as a coarse
 * bound (see `estimateTokens`/`DEFAULT_CHARS_PER_TOKEN`, `prompt.ts`).
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
 * SSE streaming inference. `stream_options: { include_usage: true }` is what makes the `usage`
 * block come back in the last chunk: without it, `prompt_tokens`/`completion_tokens` stay at zero —
 * so neither a real token counter, nor tok/s.
 *
 * `controller.abort()` (STOP button) raises an `AbortError`, at the fetch or the stream read.
 * If `flag.interrupted` is already true, it is an INTENDED stop: we return the text already received,
 * not an error.
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
        model: 'local', // ignored by `llama-server` (a single model loaded), required by the OpenAI schema.
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
    throw new Error(`llama.cpp: HTTP ${res.status} — is the server running on this URL?`);
  if (!res.body) throw new Error('llama.cpp: response with no stream body.');

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
      // The buffer may cut an SSE line mid-way: we only process complete lines and
      // keep the rest (`buffer`) for the next chunk.
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
