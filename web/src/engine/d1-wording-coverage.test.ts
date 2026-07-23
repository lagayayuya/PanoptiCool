// D1 wording coverage (PANO-71) — moved onto `wording.ts` in Refonte A (batch A2).
//
// WHAT THIS TEST NO LONGER CHECKS, because the COMPILER holds it. The old test swept
// `D1_TEMPLATE_IDS` (a `templateId` allowlist) and required each id to have a template. The claims
// are now IMPORTED functions, stored in a `Record<SensitiveLabel, …>`: a label with no claim, or a
// vanished claim, does not compile. The test can no longer add anything there.
//
// WHAT IT STILL CHECKS, and stays indispensable: the READINGS (§5). Their keys are carried by the
// lexicons (`readingTemplateIds: readonly string[]`) — OPEN strings, hence out of the compiler's
// reach without re-typing the lexicon (UNTOUCHABLE). Exhaustiveness there is test-only: that is its
// real ceiling.
//
// ⚠ THIS TEST IS THE ONLY NET ON THESE KEYS. The render golden covers ONLY what the persona
// exercises (mental_health, conflictual): an unrouted reading on a label the persona does not
// exercise would pass the golden green and render "[gabarit manquant : …]" in production. Do not
// lighten it — there is nothing behind it.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from './lexicon';
import { hasReading, readingKeys } from './wording';

describe('D1 wording coverage (wired labels)', () => {
  it('each §5 reading of the wired lexicons has its text', () => {
    for (const lexicon of WIRED_LEXICONS) {
      if (lexicon.kind !== 'topical') {
        continue;
      }
      for (const key of lexicon.readingTemplateIds) {
        expect(hasReading(key), `texte de lecture manquant : ${key}`).toBe(true);
      }
    }
  });

  it('NO reading text is orphaned — the other direction of coverage', () => {
    // The test above checks that every wiring has its text. This one checks the reverse: that every
    // text is wired. Three `politics` readings lived ratified and read by no one — approved text,
    // rendered nowhere, that nothing flagged. It is the dead-catalogue-entry in miniature, and it is
    // visible in NEITHER direction of coverage taken alone.
    const cablees = new Set(
      WIRED_LEXICONS.flatMap((l) => (l.kind === 'topical' ? [...l.readingTemplateIds] : [])),
    );
    const orphelines = readingKeys().filter((k) => !cablees.has(k));
    expect(orphelines, `texte(s) de lecture câblé(s) à rien : ${orphelines.join(', ')}`).toEqual(
      [],
    );
  });

  it('the wired registry carries at least one topical lexicon (the filter does not miss coverage)', () => {
    expect(WIRED_LEXICONS.some((l) => l.kind === 'topical')).toBe(true);
  });
});
