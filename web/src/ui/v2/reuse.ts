// « Aussi exploité par » (C5) — RECOMPUTED at render, no longer stored (Rework A, batch A1, §5.4).
//
// Replaces `evidence-v2.ts` (`resolveEvidenceV2`): there is no more store to resolve, so no more
// `EvidenceRef → EvidenceItem` indirection nor parallel array aligned on `insights[]`. Each
// finding carries its evidence; this module answers only ONE question: "who else cites this
// crumb?". The key is the pair `channel:sourceIndex` — the same one `Evidence` already carries, not an
// identifier to re-parse.
//
// ⚠ WHAT THE TARGET'S §5.4 SKETCH DOES NOT SAY, and what would break the golden if followed to the
// letter: it only walks `themes[].deductions`. But D1 and D2 deliberately share their
// sources (a same comment can prove a sensitive signal AND an interest — this is the
// C5 demonstration, exercised by the persona: `comment:8` feeds `conflictual` AND `cinema_series`).
// A THEME card must be able to name the SIGNAL that overlaps its evidence: without the `signals[]` in
// the table, the « ↳ aussi exploité par : Propos agressif… » line disappears from the render, silently.
// We therefore walk both populations — `signals[]` FIRST, to reproduce the order of the old
// `insights[]` (D1 was composed before D2), on which the order of the joined labels depends.

import type { Analysis, Deduction, Evidence } from '../../engine/analysis';

/**
 * A finding that cites a crumb, and the NAME under which it appears in « aussi exploité par ».
 *
 * This name was the `claim` for a D1 signal — its whole sentence. It is now its `label`
 * (« Conflictuel », « Santé mentale »), for two reasons that go the same way: the sentence
 * disappeared from the fan findings, and a card cited itself better by its short name anyway than
 * by a twelve-word phrase. The reference reads « aussi exploité par : Conflictuel ».
 */
export interface Citation {
  /** Identity of the citing finding — the OBJECT itself: it is what allows excluding "self" without
   *  a global index (the old `j !== i` on `output.insights`, which no longer exists). */
  deduction: Deduction;
  /** Displayed name of the citer: theme label (D2) or signal label (D1). */
  name: string;
  themeLabel?: string;
}

/** Key of a crumb: the pair of data `Evidence` carries, not a string to re-parse. */
export function evidenceKey(e: Pick<Evidence, 'channel' | 'sourceIndex'>): string {
  return `${e.channel}:${e.sourceIndex}`;
}

/**
 * Table `crumb key → findings that cite it`. A same finding citing the same crumb twice appears
 * there twice — with no effect: it is excluded from its own label anyway.
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
  // `signals` first: D1 was composed before D2 in the old `insights[]`, and the order of the citers
  // decides the order of the joined label (« A · B »).
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
 * « aussi exploité par » label of a crumb, from the point of view of the finding that displays it: the OTHER
 * citers, named by their label — theme (D2) or signal (D1). The exclusion of "self" is done
 * on the IDENTITY of the finding (`c.deduction !== self`), never on the comparison of names: two
 * findings of a same theme are two distinct citers carrying the same name.
 * `null` if no one else cites the crumb. (The label is keyed on the THEME, never on a
 * rule identity — a deliberate fix, not to be undone; its original commit did not survive
 * the v1 history rewrite.)
 */
export function reuseLabel(
  reuseMap: ReadonlyMap<string, Citation[]>,
  evidence: Evidence,
  self: Deduction,
  currentThemeLabel: string | undefined,
): string | null {
  // Two exclusions, and the second was inherited from a vanished mechanism: the citers of the SAME theme
  // as the current card. The old version kept them by naming them by their `claim`, failing
  // which the card would have cited itself by its own name. Naming by label makes this fallback impossible — and
  // useless: « aussi exploité par : Cinéma & séries » on the Cinéma & séries card teaches nothing.
  // We therefore set them aside, rather than renaming them. The comparison requires BOTH labels defined:
  // `undefined === undefined` would set aside all the D1 signals of a signal card.
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
