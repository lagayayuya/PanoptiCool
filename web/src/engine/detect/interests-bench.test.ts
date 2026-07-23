// CANARY micro-bench of `detectLabels` over the 12 interest lexicons (PANO-76). NOT an optimization
// nor a rework of the matcher (perf = PANO-87): just an indicative marker to catch a catastrophic
// regression (e.g. a marker that would blow up regex backtracking). It prints the time and
// asserts only a VERY loose bound — a canary, not a perf threshold.
//
// `Date.now()` is allowed here (test, not engine): the engine stays pure, only the bench times.

import { describe, expect, it } from 'vitest';
import { INTEREST_LEXICONS } from '../lexicon/interests';
import { detectLabels } from './detect';

/** Large synthetic corpus: varied sentences, some bearing signals, most anodyne. */
function syntheticCorpus(n: number): string[] {
  const seeds = [
    'grosse seance de musculation puis footing tranquille',
    'un bon jeu video ce soir avec une manette et une bonne partie',
    'le bitcoin et la blockchain, staking sur binance',
    'ma routine skincare acide hyaluronique et un peu de mascara',
    'la kpop et les mangas shonen, naruto et demon slayer',
    'belle lumiere ce soir sur la ville, rien de particulier',
    'trop bien cette journee au parc avec les amis',
    'quel but magnifique en ligue des champions hier',
  ];
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(seeds[i % seeds.length] ?? '');
  }
  return out;
}

describe('interests — canary micro-bench (indicative, PANO-76)', () => {
  it('detectLabels over 2000 items × 12 lexicons stays within a very loose bound', () => {
    const corpus = syntheticCorpus(2000);
    const start = Date.now();
    const detections = detectLabels(corpus, INTEREST_LEXICONS);
    const elapsedMs = Date.now() - start;
    console.log(
      `[interests bench] detectLabels(${corpus.length} items × ${INTEREST_LEXICONS.length} lexiques) = ${elapsedMs} ms, ${detections.length} thèmes détectés`,
    );
    // Canary bound (generous, anti-flakiness): a backtracking blow-up would make it snap.
    expect(elapsedMs).toBeLessThan(10_000);
    // Sanity: the bearing corpus does trigger several themes.
    expect(detections.length).toBeGreaterThan(0);
  });
});
