// Prompts + budget de tokens de l'analyse IA locale (PANO-45). Deux prompts sélectionnables, TOUS
// DEUX éditables à la main dans l'UI ; le texte ci-dessous n'est que le point de départ.
//
// WORDING = BROUILLON (porte humaine PANO-45, décision yuya) — ces deux chaînes sont dictées telles
// quelles ; elles ne sont PAS à « améliorer » au fil d'une session. Toute retouche passe par yuya.
//
// Le prompt par défaut mentionne « et recherches » UNIQUEMENT si des recherches partent réellement
// dans le lot : sous un plafond de tokens serré, seules les commentaires les plus récents survivent
// (voir `selectItemsForBudget`) — annoncer des recherches absentes ferait mentir le prompt.

import type { AiItem } from './items';

export type PromptMode = 'default' | 'safety';

/** Filet de sécurité — clause ajoutée au prompt par défaut (brouillon, wording yuya). */
const SAFETY_CLAUSE =
  "Et n'infère pas de sujets sensibles tels que l'orientation sexuelle, la santé mentale ou une quelconque généralisation.";

/**
 * Prompt système, dérivé du mode ET de la composition réelle du lot envoyé (avec ou sans recherches).
 */
export function buildSystemPrompt(mode: PromptMode, includesSearches: boolean): string {
  const channels = includesSearches ? 'des commentaires et recherches' : 'des commentaires';
  const base = `Voici les données d'export tiktok ${channels} d'une personne. Que peux-tu inférer sur sa personnalité, identité, intérêts et convictions ? Donne une synthèse générale à la fin. Sois concis.`;
  return mode === 'safety' ? `${base} ${SAFETY_CLAUSE}` : base;
}

/**
 * Format d'un item, UNE ligne : `[index] texte`, précédé de `(rech)` pour une recherche. Format retenu
 * par le benchmark (12/07) — les variantes plus riches (JSON par item, dates, canaux) ont dégradé la
 * qualité. Les retours à la ligne d'un commentaire sont aplatis : une ligne = un item, sinon
 * l'alignement index→texte que le modèle cite se casse.
 */
export function formatItemLine(item: AiItem): string {
  const marker = item.kind === 'search' ? ' (rech)' : '';
  return `[${item.index}]${marker} ${item.text.replace(/\s+/g, ' ').trim()}`;
}

export function buildUserMessage(items: AiItem[]): string {
  return items.map(formatItemLine).join('\n');
}

/**
 * Estimation du nombre de tokens. `charsPerToken` est CALIBRÉ sur le compteur réel du serveur (voir
 * `calibrateCharsPerToken`) : l'heuristique fixe utilisée jusqu'ici sous-estimait lourdement (5071
 * estimés contre 8850 réels sur un même lot — le gabarit de conversation, les accents et les emoji
 * tokenisent bien plus dense qu'un texte anglais). Tant qu'aucun run n'a eu lieu, on part d'une valeur
 * volontairement PESSIMISTE : mieux vaut envoyer un peu moins que de faire tronquer le prompt.
 */
export const DEFAULT_CHARS_PER_TOKEN = 2;

export function estimateTokens(text: string, charsPerToken: number): number {
  return Math.ceil(text.length / charsPerToken);
}

/** Bornes de garde : un ratio hors de cet intervalle trahit une mesure aberrante, pas une calibration. */
const MIN_CHARS_PER_TOKEN = 1.2;
const MAX_CHARS_PER_TOKEN = 6;

/**
 * Recale le ratio chars/token sur le `prompt_tokens` réellement renvoyé par le serveur (champ `usage`
 * de l'API OpenAI-compatible). Le prochain envoi estime alors juste, sur CE modèle et CE tokenizer.
 */
export function calibrateCharsPerToken(
  promptChars: number,
  realPromptTokens: number,
): number | null {
  if (promptChars <= 0 || realPromptTokens <= 0) return null;
  const ratio = promptChars / realPromptTokens;
  if (ratio < MIN_CHARS_PER_TOKEN || ratio > MAX_CHARS_PER_TOKEN) return null;
  return ratio;
}

export interface Selection {
  /** Items réellement envoyés, en ordre chronologique (index croissant). */
  items: AiItem[];
  /** Palier de priorité atteint (voir `selectItemsForBudget`). */
  tier: 'recent_comments' | 'comments_and_recent_searches' | 'all';
  droppedComments: number;
  droppedSearches: number;
}

/**
 * Plafond par TOKENS, avec la priorité décidée par yuya :
 *   1. les commentaires les plus récents ;
 *   2. tous les commentaires + les recherches les plus récentes ;
 *   3. tout.
 * On ne découpe RIEN (pas de batch/map-reduce, différé) : ce qui ne tient pas dans la fenêtre ne part
 * pas, et l'UI dit combien d'items ont été laissés de côté — un silence ici se lirait comme « tout a
 * été analysé », ce qui serait faux.
 */
/** Ordre de priorité partagé par `selectItemsForBudget` et `selectItemsForBudgetExact` : commentaires
 * du plus récent au plus ancien, PUIS recherches du plus récent au plus ancien — jamais un mélange. */
function recentFirst(list: AiItem[]): AiItem[] {
  return [...list].sort(
    (a, b) => (b.epoch ?? Number.NEGATIVE_INFINITY) - (a.epoch ?? Number.NEGATIVE_INFINITY),
  );
}

function priorityOrder(items: AiItem[]): { comments: AiItem[]; searches: AiItem[] } {
  return {
    comments: recentFirst(items.filter((i) => i.kind === 'comment')),
    searches: recentFirst(items.filter((i) => i.kind === 'search')),
  };
}

function selectionFromCounts(
  comments: AiItem[],
  searches: AiItem[],
  keptComments: number,
  keptSearches: number,
): Omit<Selection, 'items'> {
  const droppedComments = comments.length - keptComments;
  const droppedSearches = searches.length - keptSearches;
  const tier: Selection['tier'] =
    droppedComments > 0
      ? 'recent_comments'
      : droppedSearches > 0
        ? 'comments_and_recent_searches'
        : 'all';
  return { tier, droppedComments, droppedSearches };
}

export function selectItemsForBudget(
  items: AiItem[],
  budgetTokens: number,
  charsPerToken: number,
): Selection {
  const cost = (item: AiItem) => estimateTokens(formatItemLine(item), charsPerToken) + 1; // +1 : saut de ligne
  const { comments, searches } = priorityOrder(items);

  const kept: AiItem[] = [];
  let spent = 0;
  const take = (list: AiItem[]): number => {
    let taken = 0;
    for (const item of list) {
      const price = cost(item);
      if (spent + price > budgetTokens) break;
      spent += price;
      kept.push(item);
      taken++;
    }
    return taken;
  };

  const keptComments = take(comments);
  // Les recherches ne sont proposées qu'une fois TOUS les commentaires servis (paliers 2 et 3) : sous
  // budget serré, un commentaire (texte spontané) porte plus de signal qu'une recherche isolée.
  const keptSearches = keptComments === comments.length ? take(searches) : 0;

  return {
    items: kept.sort((a, b) => a.index - b.index),
    ...selectionFromCounts(comments, searches, keptComments, keptSearches),
  };
}

/**
 * Budget d'items = fenêtre de contexte du serveur − la réserve de génération − le prompt système.
 * La réserve garantit qu'il reste de la place pour ÉCRIRE la réponse : un prompt qui remplit toute la
 * fenêtre ne laisse rien au modèle pour générer.
 */
export const COMPLETION_RESERVE_TOKENS = 1024;

export function itemsBudget(
  contextWindow: number,
  systemPrompt: string,
  charsPerToken: number,
): number {
  return Math.max(
    0,
    contextWindow - COMPLETION_RESERVE_TOKENS - estimateTokens(systemPrompt, charsPerToken),
  );
}

export interface ExactSelection extends Selection {
  /** Tokens RÉELS du prompt final retenu (système + items), mesurés via `countTokens` — jamais estimés. */
  promptTokens: number;
}

/** Signature de `countRealPromptTokens` (llama-client.ts) — injectée plutôt qu'importée, pour rester
 * testable sans serveur réel (voir prompt.test.ts, un compteur simulé y tient lieu de serveur). */
export type RealTokenCounter = (
  systemPrompt: string,
  userMessage: string,
) => Promise<number | null>;

/**
 * Comme `selectItemsForBudget`, mais ne fait AUCUNE hypothèse chars/token : chaque candidat est
 * VÉRIFIÉ par un comptage réel (`countTokens`, voir `countRealPromptTokens`), sur le prompt EXACT qui
 * serait envoyé (système + items retenus, avec le bon "et recherches" une fois qu'une recherche entre
 * dans le lot). Recherche dichotomique sur le nombre d'items retenus dans l'ordre de priorité (mêmes
 * paliers que `selectItemsForBudget` : commentaires du plus récent au plus ancien, PUIS recherches) —
 * `O(log n)` appels réseau plutôt qu'un appel par item, tout en restant un comptage exact à chaque
 * étape (l'heuristique chars/token a un écart mesuré de ~1,75× sur du texte réel, dans le sens qui
 * fait déborder la fenêtre — elle ne doit plus fonder cette décision une fois le serveur joignable).
 *
 * Renvoie `null` si `countTokens` échoue dès le premier essai (endpoint absent/serveur injoignable) —
 * l'appelant retombe alors sur `selectItemsForBudget` (heuristique chars/token, borne grossière).
 */
export async function selectItemsForBudgetExact(
  items: AiItem[],
  contextWindow: number,
  buildSystemPromptForSelection: (includesSearches: boolean) => string,
  countTokens: RealTokenCounter,
  completionReserve: number = COMPLETION_RESERVE_TOKENS,
): Promise<ExactSelection | null> {
  const { comments, searches } = priorityOrder(items);
  const ordered = [...comments, ...searches]; // priorité : tous les commentaires avant toute recherche.

  const promptTokensFor = async (k: number): Promise<number | null> => {
    const slice = ordered.slice(0, k);
    const systemPrompt = buildSystemPromptForSelection(slice.some((i) => i.kind === 'search'));
    const userMessage = buildUserMessage(slice.sort((a, b) => a.index - b.index));
    return countTokens(systemPrompt, userMessage);
  };

  // k = 0 tient toujours PAR CONVENTION (rien à envoyer) : si même le prompt système seul dépasse la
  // fenêtre, ce n'est pas cette fonction qui le détecte — `itemsBudget`/l'UI le signalent en amont.
  const zeroTokens = await promptTokensFor(0);
  if (zeroTokens === null) return null; // serveur/`endpoint` indisponible dès le premier essai.

  const fits = async (k: number): Promise<boolean> => {
    if (k === 0) return true;
    const tokens = await promptTokensFor(k);
    // Un échec EN COURS de recherche (serveur qui tombe en plein milieu) est traité comme "ne tient
    // pas" : on préfère sous-livrer que propager `null` au milieu d'une dichotomie déjà entamée.
    return tokens !== null && tokens + completionReserve <= contextWindow;
  };

  let lo = 0;
  let hi = ordered.length;
  while (lo < hi) {
    const mid = lo + Math.ceil((hi - lo) / 2);
    if (await fits(mid)) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  const k = lo;
  const finalTokens = k === 0 ? zeroTokens : ((await promptTokensFor(k)) ?? zeroTokens);

  const keptComments = Math.min(k, comments.length);
  const keptSearches = k - keptComments;
  const items_ = ordered.slice(0, k).sort((a, b) => a.index - b.index);

  return {
    items: items_,
    promptTokens: finalTokens,
    ...selectionFromCounts(comments, searches, keptComments, keptSearches),
  };
}
