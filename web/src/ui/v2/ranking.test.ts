// WITNESS OF THE CARD RANKING (`compareCards`, section 02).
//
// WHY THIS TEST EXISTS — and why the render golden does not replace it. `compareCards` carries
// three DOCTRINE criteria (the sensitive first; then the confidence; the volume only breaks ties).
// The golden (`render-golden.test.ts`) renders the persona end to end, but it produces only
// FOUR cards, and on those four the criterion REPRODUCES the engine's emission order: the golden
// would pass identically with a comparator that ranks nothing. It freezes a render, it does not prove
// a sort. The section's real ceiling is ~11 cards (≤ 6 D1 signals + ≤ 5 D2 themes), with
// crossings the persona never reaches.
//
// Hence SYNTHETIC cards: we choose the crossings instead of suffering them. Each case is
// built to FAIL if the branch it targets is broken — a case that passes on both sides
// is not a witness, it is exactly the golden's defect.
//
// `node` is never read by the comparator: a bare VNode suffices, and it serves as a LABEL to
// distinguish two cards that the three criteria judge equal (otherwise « stable order » would be
// untestable — one could not read the difference between « preserved » and « permuted »).

import { h } from 'preact';
import { describe, expect, it } from 'vitest';
import { compareCards, type RankedCard } from './ResultsView';

/** A synthetic card: the three numbers that rank it, plus a label the sort IGNORES. */
function card(tag: string, fields: Omit<RankedCard, 'node'>): RankedCard {
  return { ...fields, node: h('div', null, tag) };
}

/** The labels, in the order the sort returns them. */
function order(cards: RankedCard[]): string[] {
  return [...cards].sort(compareCards).map((c) => String(c.node.props.children));
}

describe('compareCards — criterion 1: the sensitive goes first', () => {
  // THE crossing that proves a PRECEDENCE and not a tiebreak: the sensitive is the LOWEST of the
  // two in confidence. If it still goes first, it means `sensitive` is indeed read first —
  // at equal level, the case would prove nothing.
  const sensitiveLow = card('sensible', { sensitive: true, level: 'low', src: 1 });
  const interestMedium = card('intérêt', { sensitive: false, level: 'medium', src: 9 });

  it('a sensitive « incertaine » finding leads a better-backed « moyenne » theme', () => {
    expect(order([sensitiveLow, interestMedium])).toEqual(['sensible', 'intérêt']);
  });

  it('…whatever the input order (it is the criterion that ranks, not the engine)', () => {
    expect(order([interestMedium, sensitiveLow])).toEqual(['sensible', 'intérêt']);
  });
});

describe('compareCards — criterion 2: the decreasing confidence, before the volume', () => {
  it('« moyenne » leads « incertaine » between two themes', () => {
    const low = card('incertaine', { sensitive: false, level: 'low', src: 3 });
    const medium = card('moyenne', { sensitive: false, level: 'medium', src: 3 });
    expect(order([low, medium])).toEqual(['moyenne', 'incertaine']);
  });

  it('the confidence outranks the volume: « moyenne / 1 src » leads « incertaine / 50 src »', () => {
    // The volume cannot lift a less-asserted card: it BREAKS TIES, it does not rank.
    const lowMany = card('incertaine', { sensitive: false, level: 'low', src: 50 });
    const mediumFew = card('moyenne', { sensitive: false, level: 'medium', src: 1 });
    expect(order([lowMany, mediumFew])).toEqual(['moyenne', 'incertaine']);
  });
});

describe('compareCards — criterion 3: at equal confidence, the volume breaks the tie', () => {
  it('between two « moyenne » themes, the better-backed goes first', () => {
    const few = card('2 src', { sensitive: false, level: 'medium', src: 2 });
    const many = card('7 src', { sensitive: false, level: 'medium', src: 7 });
    expect(order([few, many])).toEqual(['7 src', '2 src']);
  });

  it('the tiebreak also holds between two sensitive findings', () => {
    const few = card('1 src', { sensitive: true, level: 'low', src: 1 });
    const many = card('4 src', { sensitive: true, level: 'low', src: 4 });
    expect(order([few, many])).toEqual(['4 src', '1 src']);
  });
});

describe('compareCards — total equality: the stable sort keeps the engine order', () => {
  it('two cards the three criteria judge equal come out in their input order', () => {
    // The two differ ONLY by the label — a field `compareCards` does not read. That is what
    // makes the stability observable: the sort has no way to tell them apart.
    const first = card('première', { sensitive: false, level: 'medium', src: 4 });
    const second = card('seconde', { sensitive: false, level: 'medium', src: 4 });
    expect(order([first, second])).toEqual(['première', 'seconde']);
    expect(order([second, first])).toEqual(['seconde', 'première']);
  });
});

describe('compareCards — the three criteria together, on a full section', () => {
  it('ranks eleven cards (the measured ceiling: 6 D1 signals + 5 D2 themes)', () => {
    // The case the golden will never see: the persona caps at 4 cards. Here the three criteria
    // cross — a comparator that forgot one would give a different order.
    const cards = [
      card('t-med-2', { sensitive: false, level: 'medium', src: 2 }),
      card('s-low-1', { sensitive: true, level: 'low', src: 1 }),
      card('t-low-9', { sensitive: false, level: 'low', src: 9 }),
      card('s-med-3', { sensitive: true, level: 'medium', src: 3 }),
      card('t-med-5', { sensitive: false, level: 'medium', src: 5 }),
      card('s-low-6', { sensitive: true, level: 'low', src: 6 }),
      card('t-high-1', { sensitive: false, level: 'high', src: 1 }),
      card('s-med-8', { sensitive: true, level: 'medium', src: 8 }),
      card('s-low-2', { sensitive: true, level: 'low', src: 2 }),
      card('s-low-4', { sensitive: true, level: 'low', src: 4 }),
      card('t-med-7', { sensitive: false, level: 'medium', src: 7 }),
    ];
    expect(order(cards)).toEqual([
      // The six sensitive first, « moyenne » before « incertaine », volume as tiebreak.
      's-med-8',
      's-med-3',
      's-low-6',
      's-low-4',
      's-low-2',
      's-low-1',
      // Then the themes, same hierarchy. `high` has no producer today but the TYPE
      // allows it (FORK 3): if a rule emits one someday, the sort already places it at the top.
      't-high-1',
      't-med-7',
      't-med-5',
      't-med-2',
      't-low-9',
    ]);
  });
});
