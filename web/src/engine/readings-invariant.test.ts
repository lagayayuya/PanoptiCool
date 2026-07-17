// Golden de PROPRIÉTÉ (S1b / PANO-50) — verrou « pas de confiance par lecture » (ADR-0003,
// reconduit par ADR-0004), sur l'éventail porté par la PREUVE (`Evidence`).
//
// On PROUVE l'invariant, on ne le présume pas du refactor (exigence de l'issue).
//
// CE QUE LA REFONTE A CHANGE POUR CE VERROU — il se resserre, il ne se relâche pas. Une lecture était
// un `Interpretation` (= `TemplateRef` : `{templateId, params}`) : un OBJET, dont il fallait vérifier
// — au runtime ET par `@ts-expect-error` — qu'il ne portait ni `confidence`, ni poids, ni score. Le
// `params: Record<string, string|number>` laissait d'ailleurs « la petite porte » ouverte (limite
// connue, ADR-0004) : rien n'interdisait `params: { weight: 0.9 }`.
// Une lecture est désormais une CHAÎNE (A2). Un `string` ne peut pas porter de champ : la propriété
// n'est plus vérifiée, elle est INEXPRIMABLE. La petite porte de `params` se ferme avec elle.
// Ce qui reste à tenir est l'éventail lui-même : `mode` ORDONNE (position dans le tableau), il ne
// CHIFFRE pas — la confiance vit sur le constat (`Deduction.confidence`), jamais ici.

import { describe, expect, it } from 'vitest';
import type { Evidence, ReadingFan } from './analysis';

// Exemple autonome (ne dépend pas de la persona) : un éventail classé, un à égalité, une preuve sans
// éventail — les deux `mode` exercés, plus le cas « pas de lecture ».
const SAMPLE: Evidence[] = [
  {
    channel: 'comment',
    sourceIndex: 0,
    text: 'exemple classé',
    date: '2026-01-01 12:00:00',
    readings: { mode: 'ranked', readings: ['vécu personnel', 'préoccupation pour un proche'] },
  },
  {
    channel: 'comment',
    sourceIndex: 1,
    text: 'exemple à égalité',
    date: '2026-01-01 12:00:00',
    readings: {
      mode: 'equal',
      readings: ['ironie ou provocation', 'engagement politique sincère'],
    },
  },
  { channel: 'search', sourceIndex: 0, text: 'sans éventail', date: '2026-01-01 12:00:00' },
];

const fans = (evidence: readonly Evidence[]): ReadingFan[] =>
  evidence.flatMap((e) => (e.readings === undefined ? [] : [e.readings]));

describe('verrou C3 — pas de confiance par lecture', () => {
  it('l’exemple exerce bien les deux modes (le test ne passe pas à vide)', () => {
    expect(
      fans(SAMPLE)
        .map((f) => f.mode)
        .sort(),
    ).toEqual(['equal', 'ranked']);
  });

  it('un éventail ne porte QUE { mode, readings } — aucune clé de score, au runtime', () => {
    for (const fan of fans(SAMPLE)) {
      expect(Object.keys(fan).sort()).toEqual(['mode', 'readings']);
      expect(['ranked', 'equal']).toContain(fan.mode);
    }
  });

  it('une lecture est une CHAÎNE : porter un score est structurellement impossible', () => {
    for (const fan of fans(SAMPLE)) {
      for (const reading of fan.readings) {
        expect(typeof reading).toBe('string');
      }
    }
  });

  it('`ranked` ORDONNE par la position, il ne CHIFFRE pas : la primauté = index 0', () => {
    const ranked = fans(SAMPLE).find((f) => f.mode === 'ranked');
    // La lecture principale se lit à l'index 0 (ordre du tableau) — pas via un poids sur la lecture.
    expect(ranked?.readings[0]).toBe('vécu personnel');
  });

  it('preuve au niveau TYPE (vérifiée par tsc) : un poids sur l’éventail = erreur de compilation', () => {
    // @ts-expect-error — un `ReadingFan` n'accepte que { mode, readings } (aucun poids global).
    const fan: ReadingFan = { mode: 'ranked', readings: [], weight: 1 };
    // @ts-expect-error — une lecture est un `string` : un objet porteur de score ne compile pas.
    const scored: ReadingFan = { mode: 'ranked', readings: [{ text: 'r', confidence: 0.9 }] };
    expect(fan).toBeDefined();
    expect(scored).toBeDefined();
  });
});
