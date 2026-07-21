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

/**
 * Un constat qui cite une miette, et le NOM sous lequel il apparaît dans « aussi exploité par ».
 *
 * Ce nom était le `claim` pour un signal D1 — sa phrase entière. Il est désormais son `label`
 * (« Conflictuel », « Santé mentale »), pour deux raisons qui vont dans le même sens : la phrase a
 * disparu des constats à éventail, et une carte se citait de toute façon mieux par son nom court que
 * par un syntagme de douze mots. Le renvoi se lit « aussi exploité par : Conflictuel ».
 */
export interface Citation {
  /** Identité du constat citeur — l'OBJET lui-même : c'est ce qui permet d'exclure « soi » sans
   *  index global (l'ancien `j !== i` sur `output.insights`, qui n'existe plus). */
  deduction: Deduction;
  /** Nom affiché du citeur : label de thème (D2) ou label de signal (D1). */
  name: string;
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
  const add = (deduction: Deduction, name: string, themeLabel?: string) => {
    for (const e of deduction.evidence) {
      const key = evidenceKey(e);
      const citation: Citation = {
        deduction,
        name,
        ...(themeLabel !== undefined ? { themeLabel } : {}),
      };
      map.set(key, [...(map.get(key) ?? []), citation]);
    }
  };
  // `signals` d'abord : D1 était composé avant D2 dans l'ancien `insights[]`, et l'ordre des citeurs
  // décide de l'ordre du libellé joint (« A · B »).
  for (const signal of analysis.signals) {
    add(signal, signal.label);
  }
  for (const theme of analysis.themes) {
    for (const deduction of theme.deductions) {
      add(deduction, theme.label, theme.label);
    }
  }
  return map;
}

/**
 * Libellé « aussi exploité par » d'une miette, du point de vue du constat qui l'affiche : les AUTRES
 * citeurs, nommés par leur label — de thème (D2) ou de signal (D1). L'exclusion de « soi » se fait
 * sur l'IDENTITÉ du constat (`c.deduction !== self`), jamais sur la comparaison des noms : deux
 * constats d'un même thème sont deux citeurs distincts qui portent le même nom.
 * `null` si personne d'autre ne cite la miette. (Le libellé est clé sur le THÈME, jamais sur une
 * identité de règle — correctif délibéré, à ne pas défaire ; son commit d'origine n'a pas survécu
 * à la réécriture d'historique v1.)
 */
export function reuseLabel(
  reuseMap: ReadonlyMap<string, Citation[]>,
  evidence: Evidence,
  self: Deduction,
  currentThemeLabel: string | undefined,
): string | null {
  // Deux exclusions, et la seconde a été héritée d'un mécanisme disparu : les citeurs du MÊME thème
  // que la carte courante. L'ancienne version les gardait en les nommant par leur `claim`, faute de
  // quoi la carte se serait citée par son propre nom. Nommer par label rend ce repli impossible — et
  // inutile : « aussi exploité par : Cinéma & séries » sur la carte Cinéma & séries n'apprend rien.
  // On les écarte donc, plutôt que de les renommer. La comparaison exige les DEUX labels définis :
  // `undefined === undefined` écarterait tous les signaux D1 d'une carte de signal.
  const others = (reuseMap.get(evidenceKey(evidence)) ?? []).filter(
    (c) =>
      c.deduction !== self &&
      !(currentThemeLabel !== undefined && c.themeLabel === currentThemeLabel),
  );
  if (others.length === 0) {
    return null;
  }
  const labels = Array.from(new Set(others.map((c) => c.name)));
  return labels.join(' · ');
}
