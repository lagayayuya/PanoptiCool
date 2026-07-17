// Verrou du surlignage de preuves (session « surlignage — frontières de mot »). Deux fautes possibles,
// deux volets de test :
//   - `splitTriggerTerms` (mécanique pure) : un marqueur ne doit JAMAIS surligner un morceau de mot
//     voisin (« série » à l'intérieur de « sérieux »).
//   - la PROVENANCE (via le moteur RÉEL) : les `triggerTerms` d'un item cité par PLUSIEURS constats
//     sont ceux de CE constat sur CET item, jamais agrégés ou empruntés à un autre constat.
//
// Refonte A : le second volet ne passe plus par `resolveEvidenceV2` (magasin + tableau parallèle
// aligné sur `insights[]`, retirés) — chaque constat PORTE ses preuves. Le verrou testé est le même,
// et il est même plus direct à formuler : la duplication du verbatim entre deux constats (arbitrage
// yuya) est précisément ce qui permet à chacun de porter SES propres surfaces.

import { describe, expect, it } from 'vitest';
import { buildSyntheticExportZip } from '../../demo/synthetic-export';
import { processExport } from '../../engine/pipeline';
import { splitTriggerTerms } from './highlight';

describe('splitTriggerTerms — frontières de mot unicode-safe', () => {
  it('« c’est pas sérieux ce que fait netflix » : seul « netflix » est surligné (pas « série » dans « sérieux »)', () => {
    const parts = splitTriggerTerms("c'est pas sérieux ce que fait netflix", ['serie', 'netflix']);
    const marked = parts.filter((p) => p.marked).map((p) => p.text);
    expect(marked).toEqual(['netflix']);
  });

  it('« des séries netflix » : « séries » ET « netflix » sont surlignés', () => {
    // `triggerTerms` porte la surface RÉELLEMENT matchée (verbatim, pluriel inclus — cf. `detect.ts`
    // `surfaceForm`), jamais la forme normalisée du marqueur : ici « séries », pas « série ».
    const parts = splitTriggerTerms('des séries netflix', ['séries', 'netflix']);
    const marked = parts.filter((p) => p.marked).map((p) => p.text);
    expect(marked).toEqual(['séries', 'netflix']);
  });

  it('« concert de rap ce soir » : aucun « con » surligné', () => {
    const parts = splitTriggerTerms('concert de rap ce soir', ['con']);
    expect(parts.some((p) => p.marked)).toBe(false);
  });

  it('« il est concentré sur son jeu video » : aucun « con » surligné', () => {
    const parts = splitTriggerTerms('il est concentré sur son jeu video', ['con']);
    expect(parts.some((p) => p.marked)).toBe(false);
  });

  it('reconstitue le texte exact quel que soit le résultat (aucun caractère perdu/ajouté)', () => {
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

  it('sans terme : un seul fragment non marqué', () => {
    expect(splitTriggerTerms('texte neutre', undefined)).toEqual([
      { text: 'texte neutre', marked: false },
    ]);
    expect(splitTriggerTerms('texte neutre', [])).toEqual([
      { text: 'texte neutre', marked: false },
    ]);
  });
});

describe('provenance des triggerTerms (pipeline réel)', () => {
  const NOW = Date.UTC(2026, 6, 16, 12, 0, 0);
  const result = processExport(buildSyntheticExportZip(undefined, NOW));
  if (!result.ok) {
    throw new Error(`export synthétique invalide : ${JSON.stringify(result)}`);
  }
  const analysis = result.output;
  const allDeductions = [...analysis.signals, ...analysis.themes.flatMap((t) => t.deductions)];

  it('le commentaire partagé conflictual/cinema_series ne surligne, sous CHAQUE constat, QUE ses propres surfaces', () => {
    // Le commentaire « tu es juste stupide, les séries netflix ne valent pas le détour » nourrit à la
    // fois `conflictual` (D1 : insulte + cible) et `cinema_series` (D2 : « netflix ») — même source,
    // citée par DEUX constats (C5). Chaque citation porte SES surfaces, jamais celles de l'autre.
    const conflictual = analysis.signals.find((s) => s.label === 'Conflictuel');
    const cinema = analysis.themes.find((t) => t.id === 'cinema_series');
    expect(conflictual, 'signal conflictual attendu sur la persona').toBeDefined();
    expect(cinema, 'thème cinema_series attendu sur la persona').toBeDefined();

    const sharedInConflictual = conflictual?.evidence.find((e) => e.text.includes('netflix'));
    // Les deux citations désignent la MÊME source : même paire `channel:sourceIndex` (l'identité est
    // une donnée, plus une chaîne — c'est ce qui remplace l'égalité d'`EvidenceId`).
    const sharedInCinema = cinema?.deductions
      .flatMap((d) => d.evidence)
      .find(
        (e) =>
          e.channel === sharedInConflictual?.channel &&
          e.sourceIndex === sharedInConflictual?.sourceIndex,
      );
    expect(sharedInConflictual).toBeDefined();
    expect(sharedInCinema).toBeDefined();

    // Côté conflictual : jamais « netflix » dans triggerTerms (ce n'est pas l'insulte).
    expect(sharedInConflictual?.triggerTerms).toBeDefined();
    for (const term of sharedInConflictual?.triggerTerms ?? []) {
      expect(term.toLowerCase()).not.toContain('netflix');
    }
    // Côté cinema_series : « netflix » présent, jamais l'insulte du même item.
    expect(sharedInCinema?.triggerTerms?.some((t) => t.toLowerCase().includes('netflix'))).toBe(
      true,
    );
  });

  it('chaque triggerTerm est bien une sous-chaîne verbatim du texte de sa preuve', () => {
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
