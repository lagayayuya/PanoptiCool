// Micro-bench CANARI de `detectLabels` sur les 12 lexiques d'intérêt (PANO-76). PAS une optimisation
// ni une refonte du matcher (perf = PANO-87) : juste un repère indicatif pour repérer une régression
// catastrophique (ex. un marqueur qui ferait exploser le backtracking regex). Il imprime le temps et
// n'assère qu'une borne TRÈS lâche — un canari, pas un seuil de perf.
//
// `Date.now()` est autorisé ici (test, pas moteur) : le moteur reste pur, seul le bench chronomètre.

import { describe, expect, it } from 'vitest';
import { INTEREST_LEXICONS } from '../lexicon/interests';
import { detectLabels } from './detect';

/** Corpus synthétique large : phrases variées, certaines porteuses, la plupart anodines. */
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

describe('interests — micro-bench canari (indicatif, PANO-76)', () => {
  it('detectLabels sur 2000 items × 12 lexiques tient dans une borne très lâche', () => {
    const corpus = syntheticCorpus(2000);
    const start = Date.now();
    const detections = detectLabels(corpus, INTEREST_LEXICONS);
    const elapsedMs = Date.now() - start;
    console.log(
      `[interests bench] detectLabels(${corpus.length} items × ${INTEREST_LEXICONS.length} lexiques) = ${elapsedMs} ms, ${detections.length} thèmes détectés`,
    );
    // Borne canari (généreuse, anti-flakiness) : un blow-up de backtracking la ferait sauter.
    expect(elapsedMs).toBeLessThan(10_000);
    // Sanity : le corpus porteur déclenche bien plusieurs thèmes.
    expect(detections.length).toBeGreaterThan(0);
  });
});
