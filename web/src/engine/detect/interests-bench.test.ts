// CANARY micro-bench of `detectLabels` over the interest lexicons (PANO-76). NOT an optimization nor
// a rework of the matcher (perf = PANO-87): just an indicative marker to catch a catastrophic
// regression (e.g. a marker that would blow up regex backtracking). It prints the time and asserts
// only a VERY loose bound — a canary, not a perf threshold.
//
// `Date.now()` is allowed here (test, not engine): the engine stays pure, only the bench times.
//
// ⚠ IT COULD NOT REACH ITS OWN ASSERTION, and had been failing for that reason. The bound is 10 s
// while vitest's default per-test timeout is 5 s, so the only failure this canary could ever produce
// was a timeout — which says nothing about backtracking and everything about the clock. It went red
// when the lexicon set grew from the 12 this file was named after to 52: same code, four times the
// work. The timeout below is now above the bound, so the assertion is what decides.
//
// ─── ⚠ WHAT THIS BENCH PROVES, AND ON WHAT ──────────────────────────────────────────────────────
//   - MEASURED 2026-08-03 at ~7.1 s on an Apple-silicon laptop, against a 10 s bound. That is 1.4×
//     of headroom, which is thin for a canary and is why it must not be read as a perf threshold:
//     a slower machine will fail it without anything having regressed. Whether the bound moves or
//     the matcher does is a decision, and this line is where it is owed;
//   - IT MEASURES ONE CORPUS SHAPE. Eight seed sentences repeated to 2 000 items. A pathological
//     input — very long strings, adversarial repetition — is not covered by any bench here.

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
  it('detectLabels over 2000 items × every interest lexicon stays within a very loose bound', () => {
    const corpus = syntheticCorpus(2000);
    const start = Date.now();
    const detections = detectLabels(corpus, INTEREST_LEXICONS);
    const elapsedMs = Date.now() - start;
    console.log(
      `[interests bench] detectLabels(${corpus.length} items × ${INTEREST_LEXICONS.length} lexicons) = ${elapsedMs} ms, ${detections.length} themes detected`,
    );
    // Canary bound (generous, anti-flakiness): a backtracking blow-up would make it snap.
    expect(elapsedMs).toBeLessThan(10_000);
    // Sanity: the bearing corpus does trigger several themes.
    expect(detections.length).toBeGreaterThan(0);
    // ⚠ ABOVE THE BOUND, deliberately: a timeout below it would make the bound unreachable, which is
    // exactly how this canary spent its time failing for a reason that was not its own.
  }, 30_000);
});
