import { describe, expect, it, vi } from 'vitest';
import type { AiItem } from './items';
import {
  buildSystemPrompt,
  buildUserMessage,
  calibrateCharsPerToken,
  estimateTokens,
  formatItemLine,
  itemsBudget,
  type RealTokenCounter,
  selectItemsForBudget,
  selectItemsForBudgetExact,
} from './prompt';

const DAY = 24 * 3600 * 1000;

/** Builds dated items, from oldest to most recent (index = chronological order, like
 * `extractAiItems`). `text` is constant: we want to measure the SELECTION, not the text length. */
function makeItems(spec: ('comment' | 'search')[]): AiItem[] {
  return spec.map((kind, index) => ({
    index,
    kind,
    text: `item numero ${index}`,
    epoch: index * DAY,
  }));
}

describe('buildSystemPrompt', () => {
  it('announces the searches only if they actually go out', () => {
    expect(buildSystemPrompt('fr', 'default', false)).toContain("des commentaires d'une personne");
    expect(buildSystemPrompt('fr', 'default', true)).toContain('des commentaires et recherches');
  });

  it('the safety net appends the clause to the default prompt, without rewriting it', () => {
    const base = buildSystemPrompt('fr', 'default', true);
    const safety = buildSystemPrompt('fr', 'safety', true);
    expect(safety.startsWith(base)).toBe(true);
    expect(safety).toContain("n'infère pas de sujets sensibles");
  });

  // ─── THE ENGLISH SIDE ─────────────────────────────────────────────────────────────────────────
  // WHAT THESE ASSERTIONS DO NOT PROVE, and it must be read before citing them: they verify
  // that the LANGUAGE ARRIVES, not that the English prompt WORKS. No bench has measured the output
  // quality nor the refusal rate in English (cf. the header of `buildSystemPrompt`) — a prompt that
  // would make the model refuse would pass these tests green, today and every following day.
  //
  // TWO PAST MUTATIONS, and the second is the reason for the last assertion of each
  // block: (1) `locale === 'en'` branch made unreachable → the FOUR tests turn red;
  // (2) English branch kept but reglued onto `SAFETY_CLAUSE` (the French one) → ONLY the net test
  // turns red, through its `not.toContain('sujets sensibles')`. Without this negative guard, an
  // English prompt ending on a French clause would have passed green: both clauses
  // start with « Et »/« And » and `startsWith(base)` does not look at the end.
  it('renders the English prompt, and no French word leaks into it', () => {
    const en = buildSystemPrompt('en', 'default', true);
    expect(en).toContain('comments and searches');
    expect(en).toContain('What can you infer about their personality');
    // The leak we want to make impossible: one half translated, the other left French.
    expect(en).not.toContain('Voici');
    expect(en).not.toContain("d'une personne");
  });

  it('announces the searches only if they actually go out, in English too', () => {
    expect(buildSystemPrompt('en', 'default', false)).toContain('comments of a person');
    expect(buildSystemPrompt('en', 'default', false)).not.toContain('searches');
  });

  it('the English safety net appends its clause without rewriting the base', () => {
    const base = buildSystemPrompt('en', 'default', true);
    const safety = buildSystemPrompt('en', 'safety', true);
    expect(safety.startsWith(base)).toBe(true);
    expect(safety).toContain('do not infer sensitive subjects');
    // The English clause is indeed the ENGLISH one: the fallback to French would be invisible
    // otherwise, both starting with « Et/And ».
    expect(safety).not.toContain('sujets sensibles');
  });

  it('the two languages render DIFFERENT prompts — otherwise the language does not cross', () => {
    for (const mode of ['default', 'safety'] as const) {
      expect(buildSystemPrompt('en', mode, true)).not.toBe(buildSystemPrompt('fr', mode, true));
    }
  });
});

describe('formatItemLine', () => {
  it('marks the searches and flattens the line breaks (one line = one item)', () => {
    expect(formatItemLine({ index: 3, kind: 'search', text: 'studio lyon', epoch: 0 })).toBe(
      '[3] (rech) studio lyon',
    );
    expect(formatItemLine({ index: 4, kind: 'comment', text: 'deux\nlignes', epoch: 0 })).toBe(
      '[4] deux lignes',
    );
  });
});

describe('selectItemsForBudget', () => {
  it('tier 3 — everything fits: everything goes out, in chronological order', () => {
    const items = makeItems(['comment', 'search', 'comment']);
    const selection = selectItemsForBudget(items, 10_000, 3);
    expect(selection.tier).toBe('all');
    expect(selection.items.map((i) => i.index)).toEqual([0, 1, 2]);
    expect(selection.droppedComments + selection.droppedSearches).toBe(0);
  });

  it('tier 2 — all the comments, then the most recent searches', () => {
    const items = makeItems(['search', 'search', 'comment', 'comment']);
    const budget = selectItemsForBudget(items, 10_000, 3).items.reduce(
      (acc, i) => acc + estimateTokens(formatItemLine(i), 3) + 1,
      0,
    );
    // Budget cut by one item: the OLDEST search (index 0) must drop, not a comment.
    const oneLess = budget - (estimateTokens(formatItemLine(items[0] as AiItem), 3) + 1);
    const selection = selectItemsForBudget(items, oneLess, 3);
    expect(selection.tier).toBe('comments_and_recent_searches');
    expect(selection.droppedComments).toBe(0);
    expect(selection.droppedSearches).toBe(1);
    expect(selection.items.map((i) => i.index)).toEqual([1, 2, 3]);
  });

  it('tier 1 — tight budget: only the most recent comments, no search', () => {
    const items = makeItems(['comment', 'search', 'comment', 'search']);
    const oneComment = estimateTokens(formatItemLine(items[2] as AiItem), 3) + 1;
    const selection = selectItemsForBudget(items, oneComment, 3);
    expect(selection.tier).toBe('recent_comments');
    expect(selection.items.map((i) => i.index)).toEqual([2]); // the most recent comment
    expect(selection.droppedComments).toBe(1);
    expect(selection.droppedSearches).toBe(2);
  });

  it('zero budget: nothing goes out (never a silent partial output)', () => {
    const selection = selectItemsForBudget(makeItems(['comment']), 0, 3);
    expect(selection.items).toEqual([]);
    expect(selection.droppedComments).toBe(1);
  });
});

describe('calibrateCharsPerToken', () => {
  it("recalibrates on the server's real counter", () => {
    // The case measured at the benchmark: ~15,200 characters for 8,850 real tokens.
    expect(calibrateCharsPerToken(15_200, 8_850)).toBeCloseTo(1.72, 2);
  });

  it('rejects aberrant measurements rather than propagating a wrong ratio', () => {
    expect(calibrateCharsPerToken(100, 0)).toBeNull(); // no `usage` returned
    expect(calibrateCharsPerToken(100_000, 10)).toBeNull(); // ratio out of bounds
  });
});

describe('itemsBudget', () => {
  it('reserves enough to generate the response — a prompt never fills the whole window', () => {
    const prompt = buildSystemPrompt('fr', 'default', true);
    expect(itemsBudget(8192, prompt, 2)).toBeLessThan(8192 - 1024);
    expect(itemsBudget(512, prompt, 2)).toBe(0); // window smaller than the reserve: no item
  });
});

describe('buildUserMessage', () => {
  it('one line per item', () => {
    expect(buildUserMessage(makeItems(['comment', 'search']))).toBe(
      '[0] item numero 0\n[1] (rech) item numero 1',
    );
  });
});

describe('selectItemsForBudgetExact', () => {
  /** Simulates `countRealPromptTokens`: 1 "token" per character, deterministic — enough to verify the
   * selection LOGIC (tiers, binary search, never an overrun) without depending on a real server.
   * `completionReserve: 0` in all the tests below: what is tested here is the PRIORITY and the
   * binary search, not the size of the reserve (already covered by `itemsBudget`). */
  const fakeCounter: RealTokenCounter = async (systemPrompt, userMessage) =>
    systemPrompt.length + userMessage.length;
  /** Same counter, but non-nullable — to prepare the tests' budgets (never passed to
   * `selectItemsForBudgetExact`, which receives `fakeCounter` and must handle the `null` case itself). */
  async function countExact(systemPrompt: string, userMessage: string): Promise<number> {
    const n = await fakeCounter(systemPrompt, userMessage);
    if (n === null) throw new Error('fakeCounter ne renvoie jamais null dans ces tests');
    return n;
  }
  const sysPrompt = (includesSearches: boolean) =>
    buildSystemPrompt('fr', 'default', includesSearches);
  const select = (items: AiItem[], contextWindow: number) =>
    selectItemsForBudgetExact(items, contextWindow, sysPrompt, fakeCounter, 0);

  it('tier 3 — everything fits: everything goes out, in chronological order', async () => {
    const items = makeItems(['comment', 'search', 'comment']);
    const selection = await select(items, 100_000);
    if (selection === null) throw new Error('sélection nulle inattendue');
    expect(selection.tier).toBe('all');
    expect(selection.items.map((i) => i.index)).toEqual([0, 1, 2]);
    expect(selection.droppedComments + selection.droppedSearches).toBe(0);
  });

  it('tier 2 — all the comments, then the most recent searches', async () => {
    const items = makeItems(['search', 'search', 'comment', 'comment']);
    const full = await select(items, 100_000);
    if (full === null) throw new Error('sélection nulle inattendue');
    // A budget just below what is needed for EVERYTHING: the oldest search (index 0) must
    // drop first, never a comment.
    const selection = await select(items, full.promptTokens - 1);
    if (selection === null) throw new Error('sélection nulle inattendue');
    expect(selection.tier).toBe('comments_and_recent_searches');
    expect(selection.droppedComments).toBe(0);
    expect(selection.droppedSearches).toBe(1);
    expect(selection.items.map((i) => i.index)).toEqual([1, 2, 3]); // index 0 (the oldest) drops
  });

  it('tier 1 — tight budget: only the most recent comments, no search', async () => {
    const items = makeItems(['comment', 'search', 'comment', 'search']);
    // Budget = system alone + just enough for ONE item line (`[2] item numero 2`, 18 characters).
    const zero = await countExact(sysPrompt(false), '');
    const selection = await select(items, zero + 18);
    if (selection === null) throw new Error('sélection nulle inattendue');
    expect(selection.tier).toBe('recent_comments');
    expect(selection.items.map((i) => i.index)).toEqual([2]); // the most recent comment
    expect(selection.droppedComments).toBe(1);
    expect(selection.droppedSearches).toBe(2);
  });

  it('zero budget: nothing goes out (never a silent partial output)', async () => {
    const selection = await select(makeItems(['comment']), 0);
    if (selection === null) throw new Error('sélection nulle inattendue');
    expect(selection.items).toEqual([]);
    expect(selection.droppedComments).toBe(1);
  });

  it('NEVER exceeds the budget (context − margin) — the central invariant of the selection', async () => {
    const items = makeItems([
      'comment',
      'search',
      'comment',
      'comment',
      'search',
      'search',
      'comment',
    ]);
    const reserve = 40;
    // Windows above the floor (system prompt alone + margin): below it, even 0 items does not
    // suffice to fit — documented case, outside this function's contract (see its docstring).
    const floor = (await countExact(sysPrompt(false), '')) + reserve;
    for (const contextWindow of [floor + 10, floor + 200, floor + 1000, 100_000]) {
      const selection = await selectItemsForBudgetExact(
        items,
        contextWindow,
        sysPrompt,
        fakeCounter,
        reserve,
      );
      if (selection === null) throw new Error('sélection nulle inattendue');
      expect(selection.promptTokens + reserve).toBeLessThanOrEqual(contextWindow);
    }
  });

  it('returns null if the count fails on the very first attempt (endpoint unavailable)', async () => {
    const failing: RealTokenCounter = vi.fn(async () => null);
    const selection = await selectItemsForBudgetExact(
      makeItems(['comment']),
      10_000,
      sysPrompt,
      failing,
    );
    expect(selection).toBeNull();
  });
});
