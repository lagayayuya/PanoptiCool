// Items envoyés au modèle local (PANO-45 — analyse IA sur la page principale). ÉPURE assumée
// (décision yuya, benchmark 12/07) : le modèle reçoit les items BRUTS — commentaires + recherches —
// et rien d'autre. Pas d'agrégats comportementaux, pas de thèmes D2, pas de sélection de canaux : le
// benchmark a montré que chacun de ces ajouts DÉGRADE la qualité de la sortie. Ce module ne fait donc
// qu'une chose : extraire les deux canaux textuels d'un export normalisé, en items indexés.
//
// Pourquoi une voie SÉPARÉE du moteur : `EngineOutput` ne porte que les preuves effectivement citées
// par un constat (borne mémoire, ADR-0003) — jamais la liste complète des commentaires et
// recherches. L'analyse IA en a besoin ; l'élargir au moteur serait une décision de doctrine
// (ADR-0002). On repart donc des octets du zip dans un worker dédié (`items-worker.ts`), sans
// toucher au schéma moteur.
//
// Confidentialité : ces textes ne quittent JAMAIS l'appareil — ils partent au serveur `llama.cpp` de
// l'utilisateur (localhost), sur clic explicite, et nulle part ailleurs.

import type { NormalizedExport } from '../engine/normalize';

export interface AiItem {
  /** Index STABLE et GLOBAL (ordre chronologique, tous canaux confondus) — la clé d'ancrage que le
   * modèle cite (« (idx 3, 7) »). Conservé même quand l'item n'est pas envoyé (plafond de tokens) :
   * deux runs sur le même export citent le même numéro pour le même item. */
  index: number;
  kind: 'comment' | 'search';
  text: string;
  /** Epoch ms, ou null si la date source est absente/illisible — sert au tri par récence (priorité
   * d'envoi). Les items sans date sont considérés comme les plus anciens. */
  epoch: number | null;
}

export interface AiItemCounts {
  comments: number;
  searches: number;
}

/** Date brute d'export (`YYYY-MM-DD HH:MM:SS`, éventuellement suffixée ` UTC`) → epoch ms, ou null. */
function toEpoch(raw: string | undefined): number | null {
  const trimmed = raw?.trim().replace('T', ' ').slice(0, 19);
  const parsed = trimmed ? Date.parse(`${trimmed.replace(' ', 'T')}Z`) : Number.NaN;
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Commentaires + recherches d'un export normalisé, triés par date croissante et indexés 0..N-1.
 * Les textes vides sont écartés (ils ne portent aucun signal et coûteraient une ligne au modèle).
 */
export function extractAiItems(norm: NormalizedExport): AiItem[] {
  const items: Omit<AiItem, 'index'>[] = [];

  for (const comment of norm.Comment.Comments.CommentsList) {
    const text = (comment.comment ?? '').trim();
    if (text) items.push({ kind: 'comment', text, epoch: toEpoch(comment.date) });
  }
  for (const search of norm['Your Activity'].Searches.SearchList) {
    const text = (search.SearchTerm ?? '').trim();
    if (text) items.push({ kind: 'search', text, epoch: toEpoch(search.Date) });
  }

  items.sort(
    (a, b) => (a.epoch ?? Number.NEGATIVE_INFINITY) - (b.epoch ?? Number.NEGATIVE_INFINITY),
  );
  return items.map((item, index) => ({ ...item, index }));
}

export function countAiItems(items: AiItem[]): AiItemCounts {
  return {
    comments: items.filter((i) => i.kind === 'comment').length,
    searches: items.filter((i) => i.kind === 'search').length,
  };
}
