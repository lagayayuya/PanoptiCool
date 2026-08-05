// THE CONVERSATION PROMPT — what is sent, in what order, and what is deliberately not sent.
//
// Everything here fails PLAUSIBLY rather than loudly: a prompt with the wrong date still reads like
// a prompt, a sampler that drops half a thread still returns sequences, and a period made only of
// « X started a video chat » still looks like an exchange. None of it throws.
//
// ─── ⚠ WHAT THIS NET DOES NOT COVER ─────────────────────────────────────────────────────────────
//   - WHETHER ANY OF IT PRODUCES A GOOD ANALYSIS. The thresholds in `DEFAULT_TUNING` were measured
//     against a local model on real French threads, and nothing automated can replace that. What is
//     asserted here is that the mechanism does what its comments claim;
//   - THE ENGLISH WORDING. It is a translation awaiting ratification (`docs/instagram-ai-prompts.md`);
//     the assertions below check that a locale CHANGES the output, never that the English is right;
//   - THE TOKEN ESTIMATE'S ACCURACY. `charsPerToken` is a pessimistic guess until the server's real
//     counter calibrates it; the tests use round numbers so the arithmetic is checkable by hand;
//   - THE PLATFORM-NOTICE LIST'S COMPLETENESS, which the module's own header disclaims. What is
//     asserted is that a notice it DOES know is removed before selection, not at render.
//
// ─── VERIFIED BY MUTATION, and what each one DID ────────────────────────────────────────────────
//   1. removed the pre-selection notice filter, leaving them to be dropped at render → ⚠ STAYED
//      GREEN on the first version of that test, which had put the notices in a clump of their own:
//      the clump was then dropped by the LAST sieve (`minWords`) instead, for a different reason
//      with the same visible outcome. Rewritten to interleave them inside a real exchange under a
//      tight budget, where the difference is the one that matters — a notice removed late has been
//      PAID for — it goes red, naming the notices that reached the selection;
//   2. dropped the `sent.has(m.index)` guard on padding → red: the same messages come back in two
//      periods;
//   3. wrote the date back into the prompt as the prototype had it → red on `mars 2027`.

import { describe, expect, it } from 'vitest';
import type { ThreadMessage } from '../engine/instagram/connector';
import {
  buildConversationSystemPrompt,
  buildSequenceUserMessage,
  calibrateCharsPerToken,
  DEFAULT_TUNING,
  formatMessageLine,
  GAP_MARK,
  isPlatformNotice,
  SAFETY_CLAUSE,
  selectSequences,
} from './conv-prompt';

const T0 = Date.UTC(2024, 0, 15, 12, 0, 0) / 1000;

function msg(i: number, over: Partial<ThreadMessage> = {}): ThreadMessage {
  return {
    index: i,
    sender: 'Alex Doe',
    ts: T0 + i * 60,
    text: `message ${i}`,
    media: [],
    share: null,
    callSeconds: null,
    unsent: false,
    ...over,
  };
}

/** A chained run of `n` messages starting at index `from`, `startTs` seconds along. */
function run(from: number, n: number, startTs: number): ThreadMessage[] {
  return Array.from({ length: n }, (_, k) => msg(from + k, { ts: startTs + k * 60 }));
}

describe('the system prompt', () => {
  it('⚠ takes its date from `now` — the prototype wrote it into the string', () => {
    // A local model has no notion of the present. The prototype hard-coded « août 2026 » with a
    // comment saying it would age; this is what stops it ageing.
    const p = buildConversationSystemPrompt('fr', {
      now: Date.UTC(2027, 2, 9),
      safety: false,
      multiThread: false,
    });
    expect(p).toContain('mars 2027');
    expect(p).not.toContain('août 2026');
  });

  it('says the same thing in two languages, and neither leaks into the other', () => {
    const opts = { now: Date.UTC(2026, 7, 1), safety: false, multiThread: false };
    const fr = buildConversationSystemPrompt('fr', opts);
    const en = buildConversationSystemPrompt('en', opts);
    expect(fr).toContain('août 2026');
    expect(en).toContain('August 2026');
    expect(en).not.toMatch(/conversation privée|synthèse/);
    expect(fr).not.toMatch(/relationship|summary/);
  });

  it('appends the clauses only when asked, and inside the editable text', () => {
    const base = { now: T0 * 1000, safety: false, multiThread: false };
    expect(buildConversationSystemPrompt('fr', base)).not.toContain(SAFETY_CLAUSE.fr);
    expect(buildConversationSystemPrompt('fr', { ...base, safety: true })).toContain(
      SAFETY_CLAUSE.fr,
    );
    // Both at once, and in a stable order — the field is what the person reads before sending.
    const both = buildConversationSystemPrompt('en', { ...base, safety: true, multiThread: true });
    expect(both.indexOf('several distinct conversations')).toBeLessThan(
      both.indexOf('Do not infer anything'),
    );
  });
});

describe('a message line', () => {
  it('⚠ says what a message with no text WAS, rather than rendering nothing', () => {
    // A photo is often the whole turn. Rendering it as an empty line would leave the model a hole
    // in a conversation it reads as continuous — a silence it would then explain.
    expect(formatMessageLine(msg(3, { text: '', media: [{ kind: 'photo', path: 'p' }] }), 'fr')) //
      .toBe('[3] Alex : (photo)');
    expect(formatMessageLine(msg(3, { text: '', callSeconds: 125 }), 'fr')).toBe(
      '[3] Alex : (appel, 2 min)',
    );
    expect(formatMessageLine(msg(3, { text: '', unsent: true }), 'en')).toBe(
      '[3] Alex : (deleted message)',
    );
    expect(
      formatMessageLine(msg(3, { text: '', media: [{ kind: 'audio', path: 'a' }] }), 'en'),
    ).toBe('[3] Alex : (voice note)');
  });

  it('renders nothing at all when there is nothing to say', () => {
    expect(formatMessageLine(msg(3, { text: '' }), 'fr')).toBe('');
  });

  it('flattens line breaks — one line, one message', () => {
    // The index→text alignment the model is asked to cite breaks otherwise.
    expect(formatMessageLine(msg(7, { text: 'a\nb\n  c' }), 'fr')).toBe('[7] Alex : a b c');
  });

  it('keeps the FULL-THREAD index, not the position in the extract', () => {
    expect(formatMessageLine(msg(15049), 'fr')).toMatch(/^\[15049\] /);
  });
});

describe('the sampler', () => {
  const BUDGET = 4000;
  const CPT = 2;

  it('recognises the notices it knows about', () => {
    for (const text of [
      'nora_zina_ started a video chat',
      'Video chat ended',
      'someone a envoyé une pièce jointe',
    ]) {
      expect(isPlatformNotice(msg(0, { text })), text).toBe(true);
    }
    expect(isPlatformNotice(msg(0, { text: 'on a commencé à parler' }))).toBe(false);
  });

  it('⚠ removes a platform notice BEFORE selection — so it is never PAID for', () => {
    // ⚠ THE FIRST VERSION OF THIS TEST ASSERTED THE WRONG THING. It put the notices in a clump of
    // their own and checked they did not come out, which stayed GREEN when the pre-filter was
    // removed: the clump was then dropped by the LAST sieve instead (`minWords`), for a different
    // reason, with the same visible outcome. It measured the sieve and said « pre-filter ».
    //
    // What actually distinguishes the two is the BUDGET. Interleaved inside a real exchange, a
    // notice removed late has already been counted, already been paid for, and has already pushed
    // real messages out of the window.
    const interleaved = Array.from({ length: 10 }, (_, i) =>
      msg(i, {
        ts: T0 + i * 60,
        text: i % 2 === 0 ? `message ${i}` : 'nora_zina_ started a video chat',
      }),
    );
    // A budget that pays for the five real messages, and not for ten lines.
    const sel = selectSequences(interleaved, 80, CPT, 'fr');

    expect(sel.noise).toBe(5);
    expect(sel.kept.filter(isPlatformNotice)).toEqual([]);
    // All five real messages fit, because the notices cost nothing.
    expect(sel.kept.map((m) => m.index)).toEqual([0, 2, 4, 6, 8]);
  });

  it('cuts on the silence, so an exchange is one sequence', () => {
    const messages = [
      ...run(0, 5, T0),
      // Two hours later: past `gapMinutes`, so a different exchange.
      ...run(5, 5, T0 + 2 * 3600),
    ];
    const sel = selectSequences(messages, BUDGET, CPT, 'fr');
    expect(sel.periods).toBe(2);
    expect(sel.sequences[0]?.messages.map((m) => m.index)).toEqual([0, 1, 2, 3, 4]);
  });

  it('⚠ spreads over the whole span rather than filling from one end', () => {
    // Measured on a real thread: filling chronologically exhausted the budget years before the end,
    // so the « spread » view stopped three years early. Ten exchanges, a budget for a few.
    const messages = Array.from({ length: 10 }, (_, k) =>
      run(k * 5, 5, T0 + k * 86_400 * 40),
    ).flat();
    const sel = selectSequences(messages, 600, CPT, 'fr');
    expect(sel.periods).toBeGreaterThan(1);
    /**
     * Both ends are present: the oldest exchange and the newest.
     *
     * ⚠ ASSERTED AS « CONTAINS », NOT « STARTS AT », since the widening pass. It used to read
     * `sequences[last].messages[0].index === 45` and went red at 38 — correctly: the last sequence
     * now begins earlier because the leftover budget grew it backwards. The claim being made is that
     * the span is covered end to end, and a first index is only one way of checking that; the day
     * widening arrived, it was the wrong one.
     */
    const first = sel.sequences[0]?.messages.map((m) => m.index) ?? [];
    const last = sel.sequences[sel.sequences.length - 1]?.messages.map((m) => m.index) ?? [];
    expect(first).toContain(0);
    expect(last).toContain(45);
  });

  it('⚠ never sends the same message twice, however the padding falls', () => {
    // Seen in a witness, not predicted: a short sequence right after a kept one was padded with the
    // five messages before it — which WERE the end of that one. The model saw two distinct moments
    // of an exchange that happened once.
    const messages = [
      ...run(0, 8, T0),
      // A short one, just past the gap, so it qualifies for padding.
      ...run(8, 3, T0 + 8 * 60 + 46 * 60),
    ];
    const sel = selectSequences(messages, BUDGET, CPT, 'fr');
    const indices = sel.kept.map((m) => m.index);
    expect(new Set(indices).size).toBe(indices.length);
  });

  it('drops a sequence with no words, and counts it rather than hiding it', () => {
    // Five voice notes in a row: we know someone sent five, we know nothing of what they said, and
    // a model would invent it.
    const audio = Array.from({ length: 5 }, (_, k) =>
      msg(k, { text: '', media: [{ kind: 'audio', path: `a${k}` }], ts: T0 + k * 60 }),
    );
    const sel = selectSequences(audio, BUDGET, CPT, 'fr');
    expect(sel.kept).toHaveLength(0);
    expect(sel.emptyPeriods).toBe(1);
  });

  it('reports what it left behind', () => {
    const sel = selectSequences(run(0, 5, T0), BUDGET, CPT, 'fr');
    expect(sel.dropped).toBe(0);
    // A budget too small to pay for anything leaves everything behind, and says so.
    const starved = selectSequences(run(0, 5, T0), 1, CPT, 'fr');
    expect(starved.dropped).toBe(5);
    expect(starved.kept).toHaveLength(0);
  });
});

describe('the rendered body', () => {
  it('announces each period, so the model does not read one continuous thread', () => {
    const messages = [...run(0, 5, T0), ...run(5, 5, T0 + 2 * 3600)];
    const sel = selectSequences(messages, 4000, 2, 'fr');
    const body = buildSequenceUserMessage(sel, null, 'fr');
    expect(body).toContain('--- Période 1/2 · janvier 2024 ---');
    expect(body).toContain('--- Période 2/2 · janvier 2024 ---');
    expect(buildSequenceUserMessage(sel, null, 'en')).toContain(
      '--- Period 1/2 · January 2024 ---',
    );
  });

  it('⚠ folds identical lines, counted — five voice notes cost one line, not five', () => {
    const messages = [
      msg(0, { text: 'salut' }),
      ...Array.from({ length: 5 }, (_, k) =>
        msg(1 + k, { text: '', media: [{ kind: 'audio', path: 'a' }], ts: T0 + (1 + k) * 60 }),
      ),
      msg(6, { text: 'tu disais ?' }),
    ];
    const sel = selectSequences(messages, 4000, 2, 'fr');
    const body = buildSequenceUserMessage(sel, null, 'fr');
    expect(body).toContain('[1-5] Alex : (vocal) ×5');
    // The information survives — there were five — without being paid for five times.
    expect(body.match(/\(vocal\)/g)).toHaveLength(1);
  });

  it('marks the silence before earlier context, in the prompt’s own language', () => {
    // ⚠ THE PADDING MUST COME FROM MESSAGES NOT ALREADY SENT, so the fixture puts a run of TWO
    // before the silence: below `minPerSequence`, it is never a sequence of its own and so never
    // sent — but it stays in the cleaned thread, which is exactly what padding draws on. Padding a
    // short sequence from the tail of a sequence already sent is what the dedup guard forbids, and
    // a fixture built that way returns no context at all.
    const messages = [...run(0, 2, T0), ...run(2, 3, T0 + 50 * 60)];
    const sel = selectSequences(messages, 4000, 2, 'fr');
    const padded = sel.sequences.find((s) => s.context > 0);
    expect(padded, 'no sequence received context — the fixture no longer exercises padding') //
      .toBeDefined();
    expect(buildSequenceUserMessage(sel, null, 'fr')).toContain(GAP_MARK.fr);
    expect(buildSequenceUserMessage(sel, null, 'en')).toContain(GAP_MARK.en);
  });

  it('puts the statistics block first when it is asked for, and omits it otherwise', () => {
    const sel = selectSequences(run(0, 5, T0), 4000, 2, 'fr');
    expect(buildSequenceUserMessage(sel, 'STATS\n\n---\n', 'fr')).toMatch(/^STATS/);
    expect(buildSequenceUserMessage(sel, null, 'fr')).toMatch(/^--- Période/);
  });
});

describe('the token calibration', () => {
  it('refuses an aberrant measurement rather than believing it', () => {
    expect(calibrateCharsPerToken(8000, 4000)).toBe(2);
    // Outside the guard bounds the measurement is wrong, not the calibration.
    expect(calibrateCharsPerToken(8000, 100)).toBeNull();
    expect(calibrateCharsPerToken(8000, 8000)).toBeNull();
    expect(calibrateCharsPerToken(0, 10)).toBeNull();
  });
});

describe('the defaults are the ratified ones', () => {
  it('holds the measured tuning, so a change is a decision and not a drift', () => {
    // These nine numbers were measured against a local model. Changing one is a ratification, and
    // this line is what makes that visible in a diff.
    expect(DEFAULT_TUNING).toEqual({
      gapMinutes: 45,
      targetPerSequence: 14,
      maxPerSequence: 20,
      minPerSequence: 3,
      minWords: 2,
      shortAt: 5,
      padBefore: 5,
      repeatAt: 3,
      maxSequences: 0,
    });
  });
});
