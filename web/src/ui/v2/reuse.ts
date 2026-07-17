// « Aussi exploité par » (C5) — RECALCULÉ au rendu, plus stocké (Refonte A, lot A1, §5.4).
//
// Remplace `evidence-v2.ts` (`resolveEvidenceV2`) : il n'y a plus de magasin à résoudre, donc plus
// d'indirection `EvidenceRef → EvidenceItem` ni de tableau parallèle aligné sur `insights[]`. Chaque
// constat porte ses preuves ; ce module ne répond qu'à UNE question : « qui d'autre cite cette
// miette ? ». La clé est la paire `channel:sourceIndex` — la même qu'`Evidence` porte déjà, pas un
// identifiant à re-parser.
//
// ⚠ CE QUE LE CROQUIS §5.4 DE LA CIBLE NE DIT PAS, et qui casserait le golden si on le suivait à la
// lettre : il ne parcourt que `themes[].deductions`. Or D1 et D2 partagent délibérément leurs
// sources (un même commentaire peut prouver un signal sensible ET un intérêt — c'est la
// démonstration C5, exercée par la persona : `comment:8` nourrit `conflictual` ET `cinema_series`).
// Une carte de THÈME doit pouvoir nommer le SIGNAL qui recoupe sa preuve : sans les `signals[]` dans
// la table, la ligne « ↳ aussi exploité par : Propos agressif… » disparaît du rendu, en silence.
// On parcourt donc les deux populations — `signals[]` d'ABORD, pour reproduire l'ordre de l'ancien
// `insights[]` (D1 était composé avant D2), dont dépend l'ordre des libellés joints.

import type { Analysis, Deduction, Evidence } from '../../engine/analysis';

/** Un constat qui cite une miette. `themeLabel` absent ⇒ c'est un signal (D1), qui n'a pas de thème
 *  — c'est alors son `claim` qui le nomme à l'écran (comportement conservé de `reuseLabel`). */
export interface Citation {
  /** Identité du constat citeur — l'OBJET lui-même : c'est ce qui permet d'exclure « soi » sans
   *  index global (l'ancien `j !== i` sur `output.insights`, qui n'existe plus). */
  deduction: Deduction;
  claim: string;
  themeLabel?: string;
}

/** Clé d'une miette : la paire de données qu'`Evidence` porte, pas une chaîne à re-parser. */
export function evidenceKey(e: Pick<Evidence, 'channel' | 'sourceIndex'>): string {
  return `${e.channel}:${e.sourceIndex}`;
}

/**
 * Table `clé de miette → constats qui la citent`. Un même constat citant deux fois la même miette y
 * figure deux fois — sans effet : il est de toute façon exclu de son propre libellé.
 */
export function buildReuseMap(analysis: Analysis): Map<string, Citation[]> {
  const map = new Map<string, Citation[]>();
  const add = (deduction: Deduction, themeLabel?: string) => {
    for (const e of deduction.evidence) {
      const key = evidenceKey(e);
      const citation: Citation = {
        deduction,
        claim: deduction.claim,
        ...(themeLabel !== undefined ? { themeLabel } : {}),
      };
      map.set(key, [...(map.get(key) ?? []), citation]);
    }
  };
  // `signals` d'abord : D1 était composé avant D2 dans l'ancien `insights[]`, et l'ordre des citeurs
  // décide de l'ordre du libellé joint (« A · B »).
  for (const signal of analysis.signals) {
    add(signal);
  }
  for (const theme of analysis.themes) {
    for (const deduction of theme.deductions) {
      add(deduction, theme.label);
    }
  }
  return map;
}

/**
 * Libellé « aussi exploité par » d'une miette, du point de vue du constat qui l'affiche : les AUTRES
 * citeurs, nommés par leur THÈME quand ils en ont un, par leur `claim` sinon (signal D1) ou quand le
 * thème est celui de la carte courante — sinon une carte se citerait elle-même par son propre nom.
 * `null` si personne d'autre ne cite la miette. (Le libellé est clé sur le THÈME, jamais sur une
 * identité de règle — fix `ace3dc3`, préservé.)
 */
export function reuseLabel(
  reuseMap: ReadonlyMap<string, Citation[]>,
  evidence: Evidence,
  self: Deduction,
  currentThemeLabel: string | undefined,
): string | null {
  const others = (reuseMap.get(evidenceKey(evidence)) ?? []).filter((c) => c.deduction !== self);
  if (others.length === 0) {
    return null;
  }
  const labels = Array.from(
    new Set(
      others.map((c) =>
        c.themeLabel === undefined || c.themeLabel === currentThemeLabel ? c.claim : c.themeLabel,
      ),
    ),
  );
  return labels.join(' · ');
}
