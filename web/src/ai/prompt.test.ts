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

/** Fabrique des items datés, du plus ancien au plus récent (index = ordre chronologique, comme
 * `extractAiItems`). `text` est constant : on veut mesurer la SÉLECTION, pas la longueur du texte. */
function makeItems(spec: ('comment' | 'search')[]): AiItem[] {
  return spec.map((kind, index) => ({
    index,
    kind,
    text: `item numero ${index}`,
    epoch: index * DAY,
  }));
}

describe('buildSystemPrompt', () => {
  it('annonce les recherches seulement si elles partent réellement', () => {
    expect(buildSystemPrompt('fr', 'default', false)).toContain("des commentaires d'une personne");
    expect(buildSystemPrompt('fr', 'default', true)).toContain('des commentaires et recherches');
  });

  it('le filet de sécurité ajoute la clause au prompt par défaut, sans le réécrire', () => {
    const base = buildSystemPrompt('fr', 'default', true);
    const safety = buildSystemPrompt('fr', 'safety', true);
    expect(safety.startsWith(base)).toBe(true);
    expect(safety).toContain("n'infère pas de sujets sensibles");
  });

  // ─── LE VERSANT ANGLAIS ───────────────────────────────────────────────────────────────────────
  // CE QUE CES ASSERTIONS NE PROUVENT PAS, et il faut le lire avant de les citer : elles vérifient
  // que la LANGUE ARRIVE, pas que le prompt anglais MARCHE. Aucun banc n'a mesuré la qualité de
  // sortie ni le taux de refus en anglais (cf. l'en-tête de `buildSystemPrompt`) — un prompt qui
  // ferait refuser le modèle passerait ces tests au vert, aujourd'hui et tous les jours suivants.
  //
  // DEUX MUTATIONS PASSÉES, et la seconde est la raison d'être de la dernière assertion de chaque
  // bloc : (1) branche `locale === 'en'` rendue inatteignable → les QUATRE tests rougissent ;
  // (2) branche anglaise conservée mais recollée sur `SAFETY_CLAUSE` (la française) → SEUL le test
  // du filet rougit, par son `not.toContain('sujets sensibles')`. Sans ce garde-fou négatif, un
  // prompt anglais terminé par une clause française serait passé au vert : les deux clauses
  // commencent par « Et »/« And » et `startsWith(base)` ne regarde pas la fin.
  it('rend le prompt anglais, et aucun mot français ne fuit dedans', () => {
    const en = buildSystemPrompt('en', 'default', true);
    expect(en).toContain('comments and searches');
    expect(en).toContain('What can you infer about their personality');
    // La fuite qu'on veut rendre impossible : une moitié traduite, l'autre restée française.
    expect(en).not.toContain('Voici');
    expect(en).not.toContain("d'une personne");
  });

  it('annonce les recherches seulement si elles partent réellement, en anglais aussi', () => {
    expect(buildSystemPrompt('en', 'default', false)).toContain('comments of a person');
    expect(buildSystemPrompt('en', 'default', false)).not.toContain('searches');
  });

  it('le filet de sécurité anglais ajoute sa clause sans réécrire la base', () => {
    const base = buildSystemPrompt('en', 'default', true);
    const safety = buildSystemPrompt('en', 'safety', true);
    expect(safety.startsWith(base)).toBe(true);
    expect(safety).toContain('do not infer sensitive subjects');
    // La clause anglaise est bien l'ANGLAISE : le repli sur le français serait invisible autrement,
    // les deux commençant par « Et/And ».
    expect(safety).not.toContain('sujets sensibles');
  });

  it('les deux langues rendent des prompts DIFFÉRENTS — sinon la langue ne traverse pas', () => {
    for (const mode of ['default', 'safety'] as const) {
      expect(buildSystemPrompt('en', mode, true)).not.toBe(buildSystemPrompt('fr', mode, true));
    }
  });
});

describe('formatItemLine', () => {
  it('marque les recherches et aplatit les retours à la ligne (une ligne = un item)', () => {
    expect(formatItemLine({ index: 3, kind: 'search', text: 'studio lyon', epoch: 0 })).toBe(
      '[3] (rech) studio lyon',
    );
    expect(formatItemLine({ index: 4, kind: 'comment', text: 'deux\nlignes', epoch: 0 })).toBe(
      '[4] deux lignes',
    );
  });
});

describe('selectItemsForBudget', () => {
  it("palier 3 — tout tient : tout part, dans l'ordre chronologique", () => {
    const items = makeItems(['comment', 'search', 'comment']);
    const selection = selectItemsForBudget(items, 10_000, 3);
    expect(selection.tier).toBe('all');
    expect(selection.items.map((i) => i.index)).toEqual([0, 1, 2]);
    expect(selection.droppedComments + selection.droppedSearches).toBe(0);
  });

  it('palier 2 — tous les commentaires, puis les recherches les plus récentes', () => {
    const items = makeItems(['search', 'search', 'comment', 'comment']);
    const budget = selectItemsForBudget(items, 10_000, 3).items.reduce(
      (acc, i) => acc + estimateTokens(formatItemLine(i), 3) + 1,
      0,
    );
    // Budget amputé d'un item : la recherche la plus ANCIENNE (index 0) doit tomber, pas un commentaire.
    const oneLess = budget - (estimateTokens(formatItemLine(items[0] as AiItem), 3) + 1);
    const selection = selectItemsForBudget(items, oneLess, 3);
    expect(selection.tier).toBe('comments_and_recent_searches');
    expect(selection.droppedComments).toBe(0);
    expect(selection.droppedSearches).toBe(1);
    expect(selection.items.map((i) => i.index)).toEqual([1, 2, 3]);
  });

  it('palier 1 — budget serré : seulement les commentaires les plus récents, aucune recherche', () => {
    const items = makeItems(['comment', 'search', 'comment', 'search']);
    const oneComment = estimateTokens(formatItemLine(items[2] as AiItem), 3) + 1;
    const selection = selectItemsForBudget(items, oneComment, 3);
    expect(selection.tier).toBe('recent_comments');
    expect(selection.items.map((i) => i.index)).toEqual([2]); // le commentaire le plus récent
    expect(selection.droppedComments).toBe(1);
    expect(selection.droppedSearches).toBe(2);
  });

  it('budget nul : rien ne part (jamais de sortie partielle silencieuse)', () => {
    const selection = selectItemsForBudget(makeItems(['comment']), 0, 3);
    expect(selection.items).toEqual([]);
    expect(selection.droppedComments).toBe(1);
  });
});

describe('calibrateCharsPerToken', () => {
  it('recale sur le compteur réel du serveur', () => {
    // Le cas mesuré au benchmark : ~15 200 caractères pour 8 850 tokens réels.
    expect(calibrateCharsPerToken(15_200, 8_850)).toBeCloseTo(1.72, 2);
  });

  it('rejette les mesures aberrantes plutôt que de propager un ratio faux', () => {
    expect(calibrateCharsPerToken(100, 0)).toBeNull(); // pas de `usage` renvoyé
    expect(calibrateCharsPerToken(100_000, 10)).toBeNull(); // ratio hors bornes
  });
});

describe('itemsBudget', () => {
  it('réserve de quoi générer la réponse — un prompt ne remplit jamais toute la fenêtre', () => {
    const prompt = buildSystemPrompt('fr', 'default', true);
    expect(itemsBudget(8192, prompt, 2)).toBeLessThan(8192 - 1024);
    expect(itemsBudget(512, prompt, 2)).toBe(0); // fenêtre plus petite que la réserve : aucun item
  });
});

describe('buildUserMessage', () => {
  it('une ligne par item', () => {
    expect(buildUserMessage(makeItems(['comment', 'search']))).toBe(
      '[0] item numero 0\n[1] (rech) item numero 1',
    );
  });
});

describe('selectItemsForBudgetExact', () => {
  /** Simule `countRealPromptTokens` : 1 "token" par caractère, déterministe — assez pour vérifier la
   * LOGIQUE de sélection (paliers, dichotomie, jamais de dépassement) sans dépendre d'un vrai serveur.
   * `completionReserve: 0` dans tous les tests ci-dessous : ce qui est testé ici est la PRIORITÉ et la
   * dichotomie, pas la taille de la réserve (déjà couverte par `itemsBudget`). */
  const fakeCounter: RealTokenCounter = async (systemPrompt, userMessage) =>
    systemPrompt.length + userMessage.length;
  /** Même compteur, mais non-nullable — pour préparer les budgets des tests (jamais passé à
   * `selectItemsForBudgetExact`, qui reçoit `fakeCounter` et doit gérer le cas `null` lui-même). */
  async function countExact(systemPrompt: string, userMessage: string): Promise<number> {
    const n = await fakeCounter(systemPrompt, userMessage);
    if (n === null) throw new Error('fakeCounter ne renvoie jamais null dans ces tests');
    return n;
  }
  const sysPrompt = (includesSearches: boolean) =>
    buildSystemPrompt('fr', 'default', includesSearches);
  const select = (items: AiItem[], contextWindow: number) =>
    selectItemsForBudgetExact(items, contextWindow, sysPrompt, fakeCounter, 0);

  it("palier 3 — tout tient : tout part, dans l'ordre chronologique", async () => {
    const items = makeItems(['comment', 'search', 'comment']);
    const selection = await select(items, 100_000);
    if (selection === null) throw new Error('sélection nulle inattendue');
    expect(selection.tier).toBe('all');
    expect(selection.items.map((i) => i.index)).toEqual([0, 1, 2]);
    expect(selection.droppedComments + selection.droppedSearches).toBe(0);
  });

  it('palier 2 — tous les commentaires, puis les recherches les plus récentes', async () => {
    const items = makeItems(['search', 'search', 'comment', 'comment']);
    const full = await select(items, 100_000);
    if (full === null) throw new Error('sélection nulle inattendue');
    // Un budget juste sous le nécessaire pour TOUT : la recherche la plus ancienne (index 0) doit
    // tomber en premier, jamais un commentaire.
    const selection = await select(items, full.promptTokens - 1);
    if (selection === null) throw new Error('sélection nulle inattendue');
    expect(selection.tier).toBe('comments_and_recent_searches');
    expect(selection.droppedComments).toBe(0);
    expect(selection.droppedSearches).toBe(1);
    expect(selection.items.map((i) => i.index)).toEqual([1, 2, 3]); // index 0 (le plus ancien) tombe
  });

  it('palier 1 — budget serré : seulement les commentaires les plus récents, aucune recherche', async () => {
    const items = makeItems(['comment', 'search', 'comment', 'search']);
    // Budget = système seul + tout juste assez pour UN item ligne (`[2] item numero 2`, 18 caractères).
    const zero = await countExact(sysPrompt(false), '');
    const selection = await select(items, zero + 18);
    if (selection === null) throw new Error('sélection nulle inattendue');
    expect(selection.tier).toBe('recent_comments');
    expect(selection.items.map((i) => i.index)).toEqual([2]); // le commentaire le plus récent
    expect(selection.droppedComments).toBe(1);
    expect(selection.droppedSearches).toBe(2);
  });

  it('budget nul : rien ne part (jamais de sortie partielle silencieuse)', async () => {
    const selection = await select(makeItems(['comment']), 0);
    if (selection === null) throw new Error('sélection nulle inattendue');
    expect(selection.items).toEqual([]);
    expect(selection.droppedComments).toBe(1);
  });

  it('ne dépasse JAMAIS le budget (contexte − marge) — l’invariant central de la sélection', async () => {
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
    // Fenêtres au-dessus du plancher (prompt système seul + marge) : en dessous, même 0 item ne
    // suffit pas à tenir — cas documenté, hors du contrat de cette fonction (voir sa docstring).
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

  it('renvoie null si le comptage échoue dès le premier essai (endpoint indisponible)', async () => {
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
