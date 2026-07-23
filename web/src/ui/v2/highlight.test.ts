// Lock on evidence highlighting (session « surlignage — frontières de mot »). Two possible faults,
// two test panels:
//   - `splitTriggerTerms` (pure mechanics): a marker must NEVER highlight a piece of a neighboring
//     word (« série » inside « sérieux »).
//   - the PROVENANCE (via the REAL engine): the `triggerTerms` of an item cited by SEVERAL findings
//     are those of THIS finding on THIS item, never aggregated or borrowed from another finding.
//
// Rework A: the second panel no longer goes through `resolveEvidenceV2` (store + parallel array
// aligned on `insights[]`, removed) — each finding CARRIES its evidence. The tested lock is the same,
// and it is even more direct to formulate: the duplication of the verbatim between two findings (yuya's
// arbitration) is precisely what lets each carry ITS own surfaces.

import { describe, expect, it } from 'vitest';
import { buildSyntheticExportZip } from '../../demo/synthetic-export';
import { processExport } from '../../engine/pipeline';
import { splitTriggerTerms } from './highlight';

describe('splitTriggerTerms — unicode-safe word boundaries', () => {
  it('« c’est pas sérieux ce que fait netflix »: only « netflix » is highlighted (not « série » in « sérieux »)', () => {
    const parts = splitTriggerTerms("c'est pas sérieux ce que fait netflix", ['serie', 'netflix']);
    const marked = parts.filter((p) => p.marked).map((p) => p.text);
    expect(marked).toEqual(['netflix']);
  });

  it('« des séries netflix »: « séries » AND « netflix » are highlighted', () => {
    // `triggerTerms` carries the surface ACTUALLY matched (verbatim, plural included — cf. `detect.ts`
    // `surfaceForm`), never the normalized form of the marker: here « séries », not « série ».
    const parts = splitTriggerTerms('des séries netflix', ['séries', 'netflix']);
    const marked = parts.filter((p) => p.marked).map((p) => p.text);
    expect(marked).toEqual(['séries', 'netflix']);
  });

  it('« concert de rap ce soir »: no « con » highlighted', () => {
    const parts = splitTriggerTerms('concert de rap ce soir', ['con']);
    expect(parts.some((p) => p.marked)).toBe(false);
  });

  it('« il est concentré sur son jeu video »: no « con » highlighted', () => {
    const parts = splitTriggerTerms('il est concentré sur son jeu video', ['con']);
    expect(parts.some((p) => p.marked)).toBe(false);
  });

  it('reconstitutes the exact text whatever the result (no character lost/added)', () => {
    const cases: [string, string[]][] = [
      ["c'est pas sérieux ce que fait netflix", ['serie', 'netflix']],
      ['des séries netflix', ['série', 'netflix']],
      ['concert de rap ce soir', ['con']],
    ];
    for (const [text, terms] of cases) {
      const parts = splitTriggerTerms(text, terms);
      expect(parts.map((p) => p.text).join('')).toBe(text);
    }
  });

  it('with no term: a single unmarked fragment', () => {
    expect(splitTriggerTerms('texte neutre', undefined)).toEqual([
      { text: 'texte neutre', marked: false },
    ]);
    expect(splitTriggerTerms('texte neutre', [])).toEqual([
      { text: 'texte neutre', marked: false },
    ]);
  });
});

describe('provenance of the triggerTerms (real pipeline)', () => {
  const NOW = Date.UTC(2026, 6, 16, 12, 0, 0);
  const result = processExport(buildSyntheticExportZip(undefined, NOW));
  if (!result.ok) {
    throw new Error(`export synthétique invalide : ${JSON.stringify(result)}`);
  }
  const analysis = result.output;
  const allDeductions = [...analysis.signals, ...analysis.themes.flatMap((t) => t.deductions)];

  it('the shared conflictual/cinema_series comment highlights, under EACH finding, ONLY its own surfaces', () => {
    // The comment « tu es juste stupide, les séries netflix ne valent pas le détour » feeds both
    // `conflictual` (D1: insult + target) and `cinema_series` (D2: « netflix ») — same source,
    // cited by TWO findings (C5). Each citation carries ITS surfaces, never those of the other.
    const conflictual = analysis.signals.find((s) => s.label === 'Conflictuel');
    const cinema = analysis.themes.find((t) => t.id === 'cinema_series');
    expect(conflictual, 'signal conflictual attendu sur la persona').toBeDefined();
    expect(cinema, 'thème cinema_series attendu sur la persona').toBeDefined();

    const sharedInConflictual = conflictual?.evidence.find((e) => e.text.includes('netflix'));
    // The two citations designate the SAME source: same `channel:sourceIndex` pair (the identity is
    // data now, no longer a string — that is what replaces the equality of `EvidenceId`).
    const sharedInCinema = cinema?.deductions
      .flatMap((d) => d.evidence)
      .find(
        (e) =>
          e.channel === sharedInConflictual?.channel &&
          e.sourceIndex === sharedInConflictual?.sourceIndex,
      );
    expect(sharedInConflictual).toBeDefined();
    expect(sharedInCinema).toBeDefined();

    // On the conflictual side: never « netflix » in triggerTerms (it is not the insult).
    expect(sharedInConflictual?.triggerTerms).toBeDefined();
    for (const term of sharedInConflictual?.triggerTerms ?? []) {
      expect(term.toLowerCase()).not.toContain('netflix');
    }
    // On the cinema_series side: « netflix » present, never the insult of the same item.
    expect(sharedInCinema?.triggerTerms?.some((t) => t.toLowerCase().includes('netflix'))).toBe(
      true,
    );
  });

  it('each triggerTerm is indeed a verbatim substring of the text of its evidence', () => {
    let checked = 0;
    for (const deduction of allDeductions) {
      for (const e of deduction.evidence) {
        for (const term of e.triggerTerms ?? []) {
          checked++;
          expect(
            e.text.toLowerCase().includes(term.toLowerCase()),
            `"${term}" absent de "${e.text}"`,
          ).toBe(true);
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});
