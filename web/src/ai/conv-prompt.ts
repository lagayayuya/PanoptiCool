// WHAT IS SENT TO THE LOCAL MODEL FOR ONE CONVERSATION, and in what form.
//
// ————— What is taken from the TikTok channel, and what is not —————
//
// TAKEN: the token budget, the stable index the model is asked to cite, « one line = one item », and
// the refusal to split into batches (no map-reduce). What does not fit in the window is not sent,
// and the interface says how much was left out — a silence here would read as « everything was
// analysed », which would be false.
//
// NOT TAKEN: the priority ordering between channels. A conversation has one channel and its order is
// chronological, so the budget fills from the END (Yul's decision): the model reads the relationship
// as it stands today.
//
// ⚠ THE STATISTICS BLOCK IS OPTIONAL AND OFF BY DEFAULT. The parent product's 12/07 bench measured
// that adding behavioural aggregates DEGRADES output quality — the model leans on the summary
// instead of reading. The box exists because Yul asked for it, it starts unticked, and the interface
// shows that measurement beside it. Not a precaution: a result.
//
// ─── ⚠ WHAT NO MEASUREMENT COVERS HERE ──────────────────────────────────────────────────────────
//   - THE ENGLISH SIDE, ENTIRELY. Every threshold below (`DEFAULT_TUNING`, `DEFAULT_CHARS_PER_TOKEN`)
//     was measured on French threads. `charsPerToken` in particular is calibrated on French, so an
//     English thread is OVER-estimated and fewer messages are sent than the window would hold —
//     corrected on the first run by `calibrateCharsPerToken`, never before it;
//   - THE ENGLISH PROMPTS THEMSELVES. They are a TRANSLATION AWAITING RATIFICATION, listed side by
//     side in `docs/instagram-ai-prompts.md`. The French ones are ratified; the pattern set by
//     `prompt.ts` is that the English wording is dictated by yuya, word for word, and that has not
//     happened yet for these;
//   - WHETHER A SAFETY CLAUSE NAMING ITS GROUNDS IN ENGLISH TRIGGERS A GLOBAL REFUSAL. Models are
//     more heavily aligned in English, and `prompt.ts` already flags the same risk for its own
//     clause. Unverified on both.

import type { ThreadMessage } from '../engine/instagram/connector';
import type { ConversationSummary } from '../engine/instagram/conversations';
import type { Locale } from '../i18n/locales';

/**
 * The starting prompt, ratified by Yul in French. It is EDITABLE in the interface, and what the
 * person reads in that field is EXACTLY what is sent — no instruction is appended behind the
 * scenes. A supplement about grouping by period used to be, and was removed: the prompt says it
 * itself, and the body carries its own markers.
 *
 * ⚠ THE CURRENT DATE IS PASSED IN, not written into the string. A local model has no notion of the
 * present and, without it, dates the exchanges against its own knowledge cutoff. The prototype hard
 * -coded « août 2026 » with a comment saying it would age; a draft that ages is one nobody notices
 * has aged.
 */
export function buildConversationSystemPrompt(
  locale: Locale,
  options: { now: number; safety: boolean; multiThread: boolean },
): string {
  const when = monthYear(locale, Math.floor(options.now / 1000));
  const parts =
    locale === 'en'
      ? [
          `Here are extracts from a private Instagram conversation, each prefixed with its author's first name. The extracts are grouped by period, from oldest to most recent. What is the dynamic of this relationship and how has it changed over time? Give a general summary at the end, in particular on what the nature of the relationship appears to be (friendship, family, partner, professional or other). Be concise and do not over-interpret. The current date is ${when}.`,
        ]
      : [
          `Voici des extraits d'une conversation privée Instagram, préfixés du prénom de leur auteur. Les extraits sont regroupés par période, du plus ancien au plus récent. Quelle est la dynamique de cette relation et son évolution dans le temps ? Donnes une synthèse générale à la fin, notamment sur ce qui semble être la nature de la relation (amitié, famille, partenaire, professionnel ou autre). Sois concis et ne sur-interprète pas. La date actuelle est ${when}.`,
        ];
  if (options.multiThread) parts.push(MULTI_THREAD_CLAUSE[locale]);
  if (options.safety) parts.push(SAFETY_CLAUSE[locale]);
  return parts.join(' ');
}

/**
 * The net, added to the prompt when the box is ticked — and added INSIDE the field, visible and
 * editable like the rest.
 *
 * It NAMES the grounds rather than forbidding « sensitive topics » wholesale: an abstract
 * instruction does not tell a model what to refrain from, and it goes on doing it believing it has
 * obeyed. The three named are the ones the product's doctrine holds costliest to have wrongly
 * attributed (ADR-0003), and the last clause aims at the GESTURE rather than its object: what
 * wounds is going from a clue to a category.
 */
export const SAFETY_CLAUSE: Record<Locale, string> = {
  fr:
    "Ne déduis rien sur la santé mentale, les convictions religieuses, l'orientation sexuelle, " +
    "l'origine ou les opinions politiques des personnes, et ne généralise pas : ne conclus rien " +
    "d'un individu à partir d'un groupe supposé, ni d'un groupe à partir d'un individu.",
  en:
    'Do not infer anything about the mental health, religious beliefs, sexual orientation, origin ' +
    'or political opinions of the people involved, and do not generalise: conclude nothing about ' +
    'an individual from a supposed group, nor about a group from an individual.',
};

/** Added when several conversations are analysed together. */
export const MULTI_THREAD_CLAUSE: Record<Locale, string> = {
  fr:
    'Les messages viennent de plusieurs conversations distinctes, chacune annoncée par son ' +
    "en-tête. Ne les confonds pas, et compare-les si c'est éclairant.",
  en:
    'The messages come from several distinct conversations, each announced by its own header. Do ' +
    'not confuse them, and compare them where that is illuminating.',
};

/**
 * Marks the silence between the earlier context and the exchange itself.
 *
 * ⚠ IT EXPLAINS ITSELF, on its own line. A system-prompt supplement used to give the key; it was
 * removed so that the editable field is the whole prompt. A marker whose meaning lives somewhere
 * other than the line it appears on is a marker that can be lost.
 */
export const GAP_MARK: Record<Locale, string> = {
  fr: '--- (après un silence) ---',
  en: '--- (after a silence) ---',
};

/** Header of one period block. Kept here so the reserved token count below matches what is drawn. */
function periodHead(locale: Locale, i: number, total: number, from: number | null): string {
  const when = from === null ? UNKNOWN_DATE[locale] : monthYear(locale, from);
  return locale === 'en'
    ? `--- Period ${i}/${total} · ${when} ---`
    : `--- Période ${i}/${total} · ${when} ---`;
}

const UNKNOWN_DATE: Record<Locale, string> = { fr: 'date inconnue', en: 'unknown date' };

/** « September 2024 » / « septembre 2024 ». */
function monthYear(locale: Locale, sec: number): string {
  return new Date(sec * 1000).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * What replaces the text of a message that has none. These go INTO the prompt, so they are
 * translated — a French marker inside an English extract is one more thing for the model to
 * misread.
 */
const PLACEHOLDERS = {
  fr: {
    share: '(lien partagé)',
    call: (min: number) => `(appel, ${min} min)`,
    unsent: '(message supprimé)',
    media: { photo: 'photo', video: 'vidéo', audio: 'vocal' },
  },
  en: {
    share: '(shared link)',
    call: (min: number) => `(call, ${min} min)`,
    unsent: '(deleted message)',
    media: { photo: 'photo', video: 'video', audio: 'voice note' },
  },
} satisfies Record<Locale, unknown>;

/**
 * One line per message: `[index] Firstname: text`.
 *
 * The index is the one from the FULL thread, not from the extract sent: two analyses of the same
 * thread cite the same number for the same message however much was sent.
 *
 * Line breaks are flattened — one line = one message, or the index→text alignment the model cites
 * breaks apart.
 */
export function formatMessageLine(m: ThreadMessage, locale: Locale): string {
  const who = m.sender.split(/\s+/)[0] ?? m.sender;
  const p = PLACEHOLDERS[locale];
  let body = m.text.replace(/\s+/g, ' ').trim();
  if (body === '') {
    // ⚠ A MESSAGE WITH NO TEXT IS NOT EMPTY — it often carries the whole turn. What it WAS is said;
    // the content is not in the export, and nothing here invents it.
    if (m.media.length > 0) body = `(${m.media.map((x) => p.media[x.kind]).join(', ')})`;
    else if (m.share !== null) body = p.share;
    else if (m.callSeconds !== null) body = p.call(Math.round(m.callSeconds / 60));
    else if (m.unsent) body = p.unsent;
    else return '';
  }
  return `[${m.index}] ${who} : ${body}`;
}

/** Optional statistics block, at the head of the user message. */
export function buildStatsBlock(conv: ConversationSummary, locale: Locale): string {
  const pct = conv.messages > 0 ? Math.round((conv.sentBySelf / conv.messages) * 100) : 0;
  const t = conv.types;
  const en = locale === 'en';
  const lines: string[] = [];

  const kind = conv.isGroup
    ? en
      ? ` (group, ${conv.participants} participants)`
      : ` (groupe, ${conv.participants} participants)`
    : en
      ? ' (one-to-one)'
      : ' (tête-à-tête)';
  lines.push(en ? `Thread: ${conv.title}${kind}` : `Fil : ${conv.title}${kind}`);
  lines.push(
    en
      ? `Messages: ${conv.messages} in total, ${pct} % written by the person analysing`
      : `Messages : ${conv.messages} au total, ${pct} % écrits par la personne qui analyse`,
  );

  const bits: string[] = [];
  const label = (n: number, fr: string, e: string) => `${n} ${en ? e : fr}`;
  if (t.photos) bits.push(label(t.photos, 'photos', 'photos'));
  if (t.videos) bits.push(label(t.videos, 'vidéos', 'videos'));
  if (t.audio) bits.push(label(t.audio, 'vocaux', 'voice notes'));
  if (t.shares) bits.push(label(t.shares, 'partages', 'shares'));
  if (t.calls) bits.push(label(t.calls, 'appels', 'calls'));
  if (bits.length > 0) {
    lines.push(
      en ? `Contents exchanged: ${bits.join(', ')}` : `Contenus échangés : ${bits.join(', ')}`,
    );
  }

  if (conv.medianReplySelfMin !== null && conv.medianReplyOtherMin !== null) {
    const a = Math.round(conv.medianReplySelfMin);
    const b = Math.round(conv.medianReplyOtherMin);
    lines.push(
      en
        ? `Median reply delay: ${a} min for one, ${b} min for the other`
        : `Délai de réponse médian : ${a} min pour l'une, ${b} min pour l'autre`,
    );
  }
  return `${lines.join('\n')}\n\n---\n`;
}

/**
 * Token estimate. Deliberately PESSIMISTIC until a run has happened: better to send a little less
 * than to have the prompt truncated. The ratio is recalibrated against the server's real counter
 * after the first send (see `calibrateCharsPerToken`).
 */
export const DEFAULT_CHARS_PER_TOKEN = 2;

export function estimateTokens(text: string, charsPerToken: number): number {
  return Math.ceil(text.length / charsPerToken);
}

/** Guard bounds: outside this interval the measurement is aberrant, not the calibration. */
const MIN_CHARS_PER_TOKEN = 1.2;
const MAX_CHARS_PER_TOKEN = 6;

export function calibrateCharsPerToken(
  promptChars: number,
  realPromptTokens: number,
): number | null {
  if (promptChars <= 0 || realPromptTokens <= 0) return null;
  const ratio = promptChars / realPromptTokens;
  if (ratio < MIN_CHARS_PER_TOKEN || ratio > MAX_CHARS_PER_TOKEN) return null;
  return ratio;
}

/* ————————————————————————————————————————————————————————————————————————————————————————————————
 * THE SEQUENCE SAMPLER — what makes a twelve-year thread readable in one window.
 *
 * Sending « the last N messages » shows the model the end of the story and nothing else. What is
 * wanted is EXCHANGES spread over the whole span: bursts of back-and-forth, each announced by its
 * period, so the model can see what changed rather than what is current.
 * ———————————————————————————————————————————————————————————————————————————————————————————————— */

export interface Selection {
  /** Messages kept, in chronological order. */
  kept: ThreadMessage[];
  dropped: number;
  from: number | null;
  to: number | null;
}

/**
 * ————— THE TUNING, AND WHY IT LIVES IN A SANDBOX —————
 *
 * Every sampling threshold is gathered here and adjustable. That is a deliberate reversal: a
 * « periods per thread » control once existed on the main path, it could only make the result worse
 * without anyone being able to tell, and it was removed for that reason.
 *
 * What changes is not the judgment on that control — it is the PLACE. There it was on everyone's
 * path, with no reference point and no way back. Here it is in a folded section, named a sandbox,
 * with the defaults restorable in one click and the effect of every notch visible immediately in the
 * final prompt. A control you can undo and whose consequence you can see is an instrument; the same
 * control without both is a trap. The ordinary path still asks for nothing.
 */
export interface SequenceTuning {
  /** Past this silence between two messages, the exchange is broken. */
  gapMinutes: number;
  /** Target size of a sequence — used to estimate how many the budget pays for. */
  targetPerSequence: number;
  /** Hard ceiling: beyond it, the tail of the exchange is not sent. */
  maxPerSequence: number;
  /** Below this it is an isolated message, not a sequence. */
  minPerSequence: number;
  /** Messages carrying WORDS required — this is what rules out a burst of voice notes. */
  minWords: number;
  /** Below this many messages, the sequence is given earlier context. */
  shortAt: number;
  /** How many earlier messages it is given. */
  padBefore: number;
  /** How many identical lines before folding to `×N`. Never below 2. */
  repeatAt: number;
  /** Ceiling on the number of sequences. `0` = derived from the budget, as on the normal path. */
  maxSequences: number;
}

export const DEFAULT_TUNING: SequenceTuning = {
  gapMinutes: 45,
  targetPerSequence: 14,
  maxPerSequence: 20,
  minPerSequence: 3,
  minWords: 2,
  shortAt: 5,
  padBefore: 5,
  repeatAt: 3,
  maxSequences: 0,
};

/** Upper bound on the number of sequences when it is derived from the budget. */
const SEQ_HARD_CAP = 40;

/* ————— PLATFORM NOISE —————
 *
 * Instagram writes some « messages » itself: a video call opening and ending, an attachment being
 * sent. They carry a participant's name and look like turns, but nobody wrote them — and a whole
 * period can be NOTHING BUT these:
 *
 *     [15049] nora : nora_zina_ started a video chat
 *     [15050] nora : Video chat ended
 *
 * The model reads them as an exchange and draws a relationship from it. That is budget spent to
 * produce a false reading, so they are removed BEFORE selection rather than at render: a message
 * dropped at render has already been paid for, counted, and has already decided where to cut. That
 * is exactly what produced the empty periods Yul observed (a header, then nothing).
 *
 * ⚠ THIS LIST CLAIMS NO COMPLETENESS. It covers the notices actually encountered, in the two
 * languages the export writes them in. Instagram produces others — missed calls, pinning, a group
 * rename, polls — that have not been seen and will therefore pass. It is not an oracle of noise: it
 * is an open list, to be extended when a case turns up.
 *
 * The patterns describe a FORM (« <someone> sent an attachment »), never a name: the handle is a
 * wildcard. No export value lives here.
 */
const PLATFORM_NOTICES: readonly RegExp[] = [
  // Video call — the opening carries the handle of whoever started it, the end has no author.
  /^.{1,64} started a video chat$/i,
  /^.{1,64} a démarré un chat vidéo$/i,
  /^video chat ended$/i,
  /^chat vidéo terminé$/i,
  // Attachment — the content is not in the export, so the line says nothing more.
  /^.{1,64} sent an attachment\.?$/i,
  /^.{1,64} a envoyé une pièce jointe\.?$/i,
];

/** True when the « message » was written by the platform rather than by a person. */
export function isPlatformNotice(m: ThreadMessage): boolean {
  const t = m.text.replace(/\s+/g, ' ').trim();
  return t !== '' && PLATFORM_NOTICES.some((re) => re.test(t));
}

/** Does the message carry WORDS? A voice note or a photo does not: their content is not exported. */
function hasWords(m: ThreadMessage): boolean {
  return m.text.trim() !== '' && !isPlatformNotice(m);
}

/**
 * What deserves to enter the budget: neither a platform notice nor a message that would render no
 * line at all. A voice note PASSES — `(vocal)` says who spoke and when, which reads.
 */
function isAnalysable(m: ThreadMessage, locale: Locale): boolean {
  return !isPlatformNotice(m) && formatMessageLine(m, locale) !== '';
}

export interface Sequence {
  from: number | null;
  to: number | null;
  messages: ThreadMessage[];
  /** How many HEAD messages are earlier context rather than the exchange itself. */
  context: number;
}

export interface SequenceSelection extends Selection {
  sequences: Sequence[];
  /** Sequences ACTUALLY sent, and those the budget did not pay for. These are not time slices: a
   *  sequence is an exchange. */
  periods: number;
  emptyPeriods: number;
  /** Platform notices removed — shown, never silent. */
  noise: number;
}

/** A chained run, and its position in the thread (to find what precedes it). */
interface Run {
  messages: ThreadMessage[];
  /** Index, in the filtered list, of the run's first message. */
  at: number;
}

/**
 * ALL the thread's sequences, computed ONCE over the whole run.
 *
 * ⚠ WHAT THIS FIXES. The earlier version cut the thread into equal periods FIRST, then looked for
 * the best chained run inside each slice. The cut therefore landed in the middle of exchanges: an
 * eight-message sequence straddling a boundary became two fragments of four, each under the
 * threshold or truncated. And the more periods were asked for, the narrower the slices and the more
 * sequences were cut — hence the behaviour Yul observed: RAISING the number of sequences LOWERED
 * the number of messages kept.
 *
 * Here the sequences are found over the whole thread, before any division. A boundary can no longer
 * break one: they are the objects, and periods are only a way of spreading them.
 */
function allSequences(clean: readonly ThreadMessage[], tuning: SequenceTuning): Run[] {
  const runs: Run[] = [];
  let current: ThreadMessage[] = [];
  let startedAt = 0;
  let lastTs: number | null = null;
  for (let i = 0; i < clean.length; i++) {
    const m = clean[i] as ThreadMessage;
    const gap = lastTs !== null ? m.ts - lastTs : 0;
    if (current.length > 0 && gap > tuning.gapMinutes * 60) {
      runs.push({ messages: current, at: startedAt });
      current = [];
    }
    if (current.length === 0) startedAt = i;
    current.push(m);
    lastTs = m.ts;
  }
  if (current.length > 0) runs.push({ messages: current, at: startedAt });
  // The START of the sequence: what is wanted is the opening of the exchange, not its tail.
  return runs
    .filter((r) => r.messages.length >= tuning.minPerSequence)
    .map((r) => ({ messages: r.messages.slice(0, tuning.maxPerSequence), at: r.at }));
}

/**
 * `k` sequences SPREAD over the chronological list, both ends included.
 *
 * Spreading by INDEX rather than by date is deliberate: a thread sleeps for two years then explodes
 * over six months — cut by date, half the periods would land in the silence and return nothing. By
 * index, every chosen sequence contains something by construction.
 */
function spread<T>(runs: readonly T[], k: number): T[] {
  if (k >= runs.length) return [...runs];
  if (k <= 1) return runs.length > 0 ? [runs[runs.length - 1] as T] : [];
  const out: T[] = [];
  for (let i = 0; i < k; i++) {
    out.push(runs[Math.round((i * (runs.length - 1)) / (k - 1))] as T);
  }
  return [...new Set(out)];
}

/** Tokens reserved for a sequence's `--- Period i/N · month year ---` header. */
const HEAD_TOKENS = 12;

/**
 * Takes sequences spread over the thread's whole span, under the token budget.
 *
 * The number of sequences is NO LONGER hand-adjustable on the main path (Yul's decision): it is
 * derived from the budget and from what the thread actually contains. A control that can only make
 * the result worse is not a control, it is a trap — and that one did, see `allSequences`.
 */
export function selectSequences(
  messages: readonly ThreadMessage[],
  budgetTokens: number,
  charsPerToken: number,
  locale: Locale,
  tuning: SequenceTuning = DEFAULT_TUNING,
): SequenceSelection {
  // Cleaning comes BEFORE everything else: platform notices must neither count towards an
  // exchange's length, nor decide where it is cut, nor be paid for.
  const clean = messages.filter((m) => isAnalysable(m, locale));
  const noise = messages.filter(isPlatformNotice).length;

  const empty: SequenceSelection = {
    kept: [],
    dropped: messages.length,
    from: null,
    to: null,
    sequences: [],
    periods: 0,
    emptyPeriods: 0,
    noise,
  };
  if (clean.length === 0) return empty;

  const runs = allSequences(clean, tuning);
  if (runs.length === 0) return empty;

  const cost = (m: ThreadMessage) =>
    estimateTokens(formatMessageLine(m, locale), charsPerToken) + 1;
  const avg = Math.max(
    1,
    Math.round(clean.slice(-200).reduce((s, m) => s + cost(m), 0) / Math.min(200, clean.length)),
  );
  const perSequence = avg * tuning.targetPerSequence + HEAD_TOKENS;
  /**
   * How many sequences the budget pays for, bounded by what the thread CONTAINS. Asking twenty
   * sequences of a thread that has six produced fourteen empty periods; counting those as periods
   * gave a displayed number that described nothing.
   */
  const fromBudget = Math.max(
    1,
    Math.min(SEQ_HARD_CAP, Math.floor(budgetTokens / Math.max(1, perSequence))),
  );
  // A hand-set ceiling CAPS, it does not raise: above what the budget pays for, the extra sequences
  // would go out empty or truncated.
  const wanted = tuning.maxSequences > 0 ? Math.min(tuning.maxSequences, fromBudget) : fromBudget;
  const picked = spread(runs, Math.min(wanted, runs.length));

  /**
   * Budget shared PER SEQUENCE, not consumed as it goes.
   *
   * Measured: filling chronologically, a twelve-year thread exhausted the budget in 2022 and the
   * last sequences fell off — the « spread » view stopped three years before the end. Each gets its
   * share; what one does not use passes to the next.
   */
  const sequences: Sequence[] = [];
  /** What has already gone out: the padding must repeat none of it (see below). */
  const sent = new Set<number>();
  const share = Math.floor(budgetTokens / Math.max(1, picked.length));
  let credit = 0;
  let tooPoor = 0;
  for (const run of picked) {
    let room = share + credit - HEAD_TOKENS;
    const kept: ThreadMessage[] = [];
    for (const m of run.messages) {
      const price = cost(m);
      if (price > room) break;
      room -= price;
      kept.push(m);
    }
    if (kept.length < tuning.minPerSequence) {
      tooPoor++;
      credit += share;
      continue;
    }

    /**
     * Padding applies ONLY if the sequence is short BY NATURE — that is, if it was taken whole and
     * still comes to fewer than five messages.
     *
     * If it is short because the budget truncated it, adding past to it while throwing away the
     * rest of the SAME exchange would give a less coherent extract, not a more coherent one: it
     * would replace the end of one conversation with the beginning of another.
     */
    const context: ThreadMessage[] = [];
    if (kept.length === run.messages.length && kept.length < tuning.shortAt) {
      const before = clean.slice(Math.max(0, run.at - tuning.padBefore), run.at);
      // Nearest first: if the budget gives out, the most relevant is kept.
      for (let i = before.length - 1; i >= 0; i--) {
        const m = before[i] as ThreadMessage;
        /**
         * ⚠ NEVER THE SAME MESSAGE TWICE. When a short sequence closely follows one already kept,
         * the five messages preceding it ARE the end of that one: without this guard the prompt
         * repeated them word for word, at the same numbers, two periods apart. The model saw two
         * distinct moments of an exchange that happened once. (Seen in a witness, not predicted.)
         */
        if (sent.has(m.index)) break;
        const price = cost(m);
        if (price > room) break;
        room -= price;
        context.unshift(m);
      }
    }

    const all = [...context, ...kept];
    /**
     * Last sieve: a sequence of voice notes or photos says nothing readable. It is dropped HERE and
     * not earlier, because the earlier context may be exactly what brings it the missing words.
     */
    if (all.filter(hasWords).length < tuning.minWords) {
      tooPoor++;
      credit += share;
      continue;
    }

    credit = Math.max(0, room);
    for (const m of all) sent.add(m.index);
    sequences.push({
      from: all[0]?.ts ?? null,
      to: all[all.length - 1]?.ts ?? null,
      messages: all,
      context: context.length,
    });
  }

  /**
   * ————— SECOND PASS: SPEND WHAT IS LEFT, AROUND THE SEQUENCES ALREADY CHOSEN —————
   *
   * ⚠ THE FIRST PASS ROUTINELY LEAVES A THIRD OF THE WINDOW UNUSED, and the leftover has nowhere to
   * go: a sequence that ends before its share is spent passes the credit on, but a thread whose runs
   * are all short simply stops asking. The model then gets a prompt well under the size it was
   * given, made of extracts too thin to reason on — and a model with too little to read does not say
   * less, it invents more (yuya, on the demo: « ça fait halluciner le modèle »).
   *
   * So what is left is spent WIDENING what was already chosen, one message at a time, after then
   * before, round-robin across the sequences. Widening rather than adding sequences: a wider extract
   * is a longer stretch of one exchange, where an extra sequence is another isolated fragment.
   *
   * ⚠ IT NEVER CROSSES INTO ANOTHER SEQUENCE. `sent` holds every index already out, and a widening
   * that met one would stitch two periods into a run the thread never had.
   */
  const spent = sequences.reduce((n, sq) => n + sq.messages.reduce((k, m) => k + cost(m), 0), 0);
  let left = budgetTokens - spent - sequences.length * HEAD_TOKENS;
  const edges = sequences.map((sq) => {
    const first = sq.messages[0]?.index ?? 0;
    const last = sq.messages[sq.messages.length - 1]?.index ?? 0;
    return {
      sq,
      lo: clean.findIndex((m) => m.index === first),
      hi: clean.findIndex((m) => m.index === last),
    };
  });
  for (let grew = true; grew && left > 0; ) {
    grew = false;
    for (const e of edges) {
      if (left <= 0) break;
      for (const dir of [1, -1] as const) {
        const at = dir === 1 ? e.hi + 1 : e.lo - 1;
        const m = at >= 0 ? clean[at] : undefined;
        if (m === undefined || sent.has(m.index)) continue;
        const price = cost(m);
        if (price > left) continue;
        left -= price;
        sent.add(m.index);
        if (dir === 1) {
          e.hi = at;
          (e.sq.messages as ThreadMessage[]).push(m);
        } else {
          e.lo = at;
          (e.sq.messages as ThreadMessage[]).unshift(m);
        }
        grew = true;
      }
    }
  }
  // The widened bounds are the sequence's own: a period announced by dates the extract no longer
  // covers would be worse than no dates at all.
  for (const sq of sequences) {
    (sq as { from: number | null }).from = sq.messages[0]?.ts ?? null;
    (sq as { to: number | null }).to = sq.messages[sq.messages.length - 1]?.ts ?? null;
  }

  const flat = sequences.flatMap((s) => s.messages);
  return {
    kept: flat,
    dropped: messages.length - flat.length,
    from: flat[0]?.ts ?? null,
    to: flat[flat.length - 1]?.ts ?? null,
    sequences,
    periods: sequences.length,
    emptyPeriods: tooPoor,
    noise,
  };
}

/**
 * Folds a run of IDENTICAL lines into one, counted: `[18177-18181] jul : (vocal) ×5`.
 *
 * Five voice notes in a row produced five rigorously identical lines but for the number. Not false,
 * but it costs five times the price of information that fits on one line — and the model, seeing
 * repetition, draws a pattern that does not exist. Counting keeps the information (there were five)
 * without paying for it five times.
 *
 * Accepted consequence on the budget: the body sent is slightly SHORTER than the selection
 * provisioned, since the price is computed message by message upstream. That is the safe direction
 * of the discrepancy — never more than planned.
 */
function collapseRepeats(
  msgs: readonly ThreadMessage[],
  repeatAt: number,
  locale: Locale,
): string[] {
  const lines = msgs.map((m) => formatMessageLine(m, locale));
  const strip = (l: string) => l.replace(/^\[\d+\]\s/, '');
  const out: string[] = [];
  let i = 0;
  while (i < msgs.length) {
    const line = lines[i] as string;
    if (line === '') {
      i++;
      continue;
    }
    const body = strip(line);
    let j = i + 1;
    while (j < msgs.length && lines[j] !== '' && strip(lines[j] as string) === body) j++;
    if (j - i >= Math.max(2, repeatAt)) {
      const first = msgs[i] as ThreadMessage;
      const last = msgs[j - 1] as ThreadMessage;
      out.push(`[${first.index}-${last.index}] ${body} ×${j - i}`);
    } else {
      for (let k = i; k < j; k++) out.push(lines[k] as string);
    }
    i = j;
  }
  return out;
}

/**
 * User message for sequence mode. Each block is announced by its period — without that the model
 * would read one continuous thread and misdate what it compares.
 */
export function buildSequenceUserMessage(
  sel: SequenceSelection,
  stats: string | null,
  locale: Locale,
  tuning: SequenceTuning = DEFAULT_TUNING,
): string {
  const blocks = sel.sequences.map((s, i) => {
    const head = periodHead(locale, i + 1, sel.sequences.length, s.from);
    const lines =
      s.context > 0
        ? [
            ...collapseRepeats(s.messages.slice(0, s.context), tuning.repeatAt, locale),
            GAP_MARK[locale],
            ...collapseRepeats(s.messages.slice(s.context), tuning.repeatAt, locale),
          ]
        : collapseRepeats(s.messages, tuning.repeatAt, locale);
    return `${head}\n${lines.join('\n')}`;
  });
  const body = blocks.join('\n\n');
  return stats === null ? body : `${stats}\n${body}`;
}
