// VERIFICATION — the informational-register rule on `health_physical` (PANO-35).
//
// The storey rule was designed and measured on `mental_health`, but it lives in the MACHINERY:
// it therefore applies to any wired topical lexicon, `health_physical` included, and thus in
// production. « symptômes du diabète » degrades there since the previous batch without anyone having
// verified it. The direction is safe — a storey rule can only lower, never create nor suppress —
// so the risk is not safety, it is RECALL: would someone who really lives with a condition lose
// their named finding because they document themselves about it?
//
// ── What this file is, and is not ─────────────────────────────────────────────────────────────────
// Mechanism PROBES, not a rate measurement. There is no persona here, no sealed ground truth, no
// denominator: we verify that a mechanism behaves as its doctrine announces on a label where it had
// never been exercised. A false-positive rate on `health_physical` would demand the same full
// apparatus as for `mental_health` — it does not exist, and this file does not claim to replace it.

import { describe, expect, it } from 'vitest';
import { HEALTH_PHYSICAL_LEXICON } from '../lexicon/health-physical';
import { detectLabels } from './detect';

function constat(textes: string[]): { stage: string; etages: string[] } | null {
  const d = detectLabels(textes, [HEALTH_PHYSICAL_LEXICON])[0];
  if (d === undefined) {
    return null;
  }
  return { stage: d.stage, etages: d.items.map((i) => i.stage) };
}

describe('storey rule — verification on `health_physical`', () => {
  it('the documentary framing degrades a condition term, as on `mental_health`', () => {
    // Someone who is looking things up: the precise term is there, but nothing indicates they LIVE it.
    const r = constat(['symptomes du diabete', "signes de l'endometriose"]);
    expect(r?.stage).toBe('indirect');
    expect(r?.etages).toEqual(['indirect', 'indirect']);
  });

  it('THE RESULT THAT COUNTS — whoever lives with the condition keeps their NAMED finding', () => {
    // The real risk of the rule is there, and it is bounded by a fact of language: a person who
    // lives with a condition NAMES it somewhere in the possessive, and « mon diabète me fatigue » has
    // no documentary framing. The item that describes her therefore survives, and it is enough to
    // hold the named storey — even when the same person documents herself elsewhere.
    const r = constat(['mon diabete me fatigue en ce moment', 'symptomes du diabete']);
    expect(r?.stage).toBe('explicit');
    expect(r?.etages).toEqual(['explicit', 'indirect']);
  });

  it('the lived without any documentary framing is intact — the rule did not touch it', () => {
    const r = constat(['mon diabete me fatigue', 'ma maladie chronique']);
    expect(r?.stage).toBe('explicit');
    expect(r?.etages).toEqual(['explicit', 'explicit']);
  });

  it('the relative stays at broad, and the rule did not make it disappear', () => {
    // Two reasons to cap accumulate here (3rd person AND documentary framing) without ever adding up
    // into suppression: the finding remains, at the broad storey. It is the property that separates a
    // storey rule from a filter.
    const r = constat(['le diabete de ma mere', 'signes de diabete chez ma mere']);
    expect(r?.stage).toBe('indirect');
    expect(r?.etages).toEqual(['indirect', 'indirect']);
  });

  it('MEASURED CORRECTION — `health_physical` does have an EN homography, and I had written the opposite', () => {
    // THIS TEST AFFIRMED THE CONTRARY, and the affirmation was FALSE. It said « no English coverage,
    // neither term nor useful homography (diabetes ≠ diabete) ». The match happens through the PLURAL
    // tolerance of the machinery: `diabete` + s matches « diabetes ».
    //
    // Why it passed anyway: « signs of diabetes » is of informational register, therefore degraded to
    // broad, and a broad item ALONE stayed below the threshold of 2. The assertion therefore measured
    // the threshold, not the coverage — it would have fallen at the first second occurrence. The SOLO
    // crossing made it visible by removing the screen.
    //
    // The lesson is the repo's one on nets: a negative assertion verifies what it reaches, not what
    // it affirms. This one proved « no finding », and I had made it say « no coverage ».
    const enPluriel = constat(['signs of diabetes']);
    expect(enPluriel?.stage).toBe('indirect');
  });

  it('THE COVERAGE IS NO LONGER ACCIDENTAL — « endometriosis » entered, and the test that denied it served', () => {
    // THIS TEST SAID THE OPPOSITE, and it was right to say it: « endometriosis » is not the plural of
    // « endometriose » (-ose / -osis), so nothing caught it, at any storey. It was the demonstration
    // that the EN coverage was PARTIAL in addition to being accidental.
    //
    // The EN vocabulary batch filled it. The line is turned rather than removed: a negative assertion
    // that documented a real hole deserves to say what plugged it, otherwise the reason for the hole
    // is lost with it.
    expect(constat(['my endometriosis has been bad this month'])?.stage).toBe('explicit');
    // And the storey rule applies to the new term as to the old — both word orders.
    expect(constat(['symptoms of endometriosis'])?.stage).toBe('indirect');
    expect(constat(['endometriosis symptoms'])?.stage).toBe('indirect');
  });
});
