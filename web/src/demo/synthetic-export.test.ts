// Demo consistency lock ("honest demo" session) — the HONESTY BAR: the demo must
// show what the engine would ACTUALLY produce on these items. This file runs the REAL
// pipeline (`processExport`, D1 + D2 included) on the two variants (`buildSyntheticExportZip` FR,
// `buildSyntheticExportZipEn` EN) and locks: the themes that come out, those that do NOT,
// and the aggregated numbers (volumes, rhythm). If someone changes the items' text without running
// this test, a theme drift (an item that no longer matches, or that matches an unforeseen theme) breaks here —
// never a silent mismatch between the fixture and the real detector.
//
// PORTED AT REWORK A. The bulk of the file is DISPATCH that disappears, not locks that
// change: `insightsByRuleId(output.insights, R1_RULE_ID)[0].value.signalCount` becomes
// `output.volumes.searches`. The field IS the name (§2.3) — there is no longer a heterogeneous list to
// filter, nor a `kind` to narrow, nor a `ruleId` to compare.
//
// What the rework makes disappear here, and what is worth naming:
//   - `d1TemplatePrefixes()` goes ENTIRELY. It re-parsed a template identifier with the regex
//     (`/^d1\.([a-z-]+)\./`) to recover the sensitive label — the stringly-typed inversion the UI
//     also did. D1 now emits the name directly (`Signal.label`), keyed on a CLOSED
//     union: no more regex, no more inversion, exhaustiveness at the compiler;
//   - `sensitivity === 3` (always 3) becomes `sensitive === true` (§2.1);
//   - `value.signalCount` becomes `evidence.length`: the count is no longer recopied next to the
//     evidence, it IS their number — a single source, no longer two that can diverge;
//   - the "significant nocturnal rhythm" assertion is REMOVED: the graduated nocturnal framing no longer
//     has a producer (ADR-0004). The graph, the counters and the estimate stay verified.
//
// TEMPORAL FRAGILITY FIXED: `ProcessOptions.now` now exists ("demo that does not rust"
// batch) and this test injects THE SAME `NOW` clock into the builder AND `processExport` — the
// rhythm's sliding windows fall back on the expected numbers whatever the day the suite runs,
// not only the day `NOW` coincided with the real `Date.now()`.

import { describe, expect, it } from 'vitest';
import { processExport } from '../engine/pipeline';
import { sensitiveTopicName } from '../engine/wording';
import { buildSyntheticExportZip, buildSyntheticExportZipEn } from './synthetic-export';

/** Fixed clock injected INTO THE BUILDER AND `processExport` (its dates are RELATIVE to `now`, never
 *  hard-coded 2026): the two run on the same clock, as in production. */
const NOW = Date.UTC(2026, 6, 16, 12, 0, 0);

describe('FR demo — honesty bar (real pipeline)', () => {
  const result = processExport(buildSyntheticExportZip(undefined, NOW), { now: NOW });
  if (!result.ok) {
    throw new Error(`export synthétique FR invalide : ${JSON.stringify(result)}`);
  }
  const { output } = result;

  it('D1 outputs ONLY mental_health and conflictual (not politics/health-physical/sexuality/religion)', () => {
    // Ex-`d1TemplatePrefixes`: the subject's name is EMITTED, no longer extracted from a templateId with a regex.
    expect(new Set(output.signals.map((s) => s.label))).toEqual(
      new Set([sensitiveTopicName('fr', 'mental_health'), sensitiveTopicName('fr', 'conflictual')]),
    );
  });

  it('mental_health is a BROAD finding — « témoignages burn out » no longer names, but crosses alone', () => {
    // TRIP-WIRE FLIPPED TWICE, and the SEQUENCE matters more than the final state — that is why
    // it is written here rather than replaced:
    //
    //   1. BEFORE — a NAMED finding. « témoignages burn out » writes the term in full, thus
    //      the named tier, thus the card asserted a lived experience on the faith of a search for accounts.
    //   2. THEN — no finding AT ALL. The informational register degraded the item (asking for
    //      testimonials asserts nothing), and the repetition threshold did the rest: a degraded item
    //      stays ONE item, and a broad finding requires TWO. Two correct rules composed into a
    //      disappearance neither of the two asked for.
    //   3. NOW — a BROAD finding. The degraded item crosses ALONE, as a bare disorder name already
    //      does (`indirectSolo`): in both cases the precise term IS written, and it is the
    //      FRAMING that forbids asserting. The rule is not new, it joins a path it
    //      had missed.
    //
    // What the card says now is what it should have said from the start: there is indeed a
    // mental health signal here, and it does not suffice to assert a lived experience.
    const signal = output.signals.find(
      (s) => s.label === sensitiveTopicName('fr', 'mental_health'),
    );
    expect(signal?.sensitive).toBe(true);
    expect(signal?.evidence).toHaveLength(1);
    // The tier IS the result: `low` is the broad's confidence, `medium` the named's.
    expect(signal?.confidence).toBe('low');
  });

  it('conflictual carries a single explicit signal (the targeted insult)', () => {
    const signal = output.signals.find((s) => s.label === sensitiveTopicName('fr', 'conflictual'));
    expect(signal?.evidence).toHaveLength(1);
  });

  it('D2 retains ONLY chats (2 items) and cinema_series (3 items) — PANO-75 floor respected', () => {
    expect(new Set(output.themes.map((t) => t.id))).toEqual(new Set(['chats', 'cinema_series']));
    const evidenceOf = (id: string) =>
      output.themes.find((t) => t.id === id)?.deductions[0]?.evidence;
    expect(evidenceOf('chats')).toHaveLength(2);
    // 3 = « spin off » + « kubrick »/« cinéma » + the « netflix » of the conflictual comment (item
    // shared between the two themes, C5).
    expect(evidenceOf('cinema_series')).toHaveLength(3);
  });

  it('volumes = 24 searches / 14 comments / 300 follows / 2700 likes', () => {
    // Ex-R1/R2/R3/R5 + `ACTIVITY_PANEL_RULE_IDS`: the field IS the name (§2.3), no more dispatch.
    expect(output.volumes.searches).toBe(24);
    expect(output.volumes.comments).toBe(14);
    expect(output.volumes.follows).toBe(300);
    expect(output.volumes.endorsements).toBe(2700);
  });

  it('views: 50,000 total (Activity Summary), 6,100 over 12 months, 420 over 30 days', () => {
    expect(output.volumes.allTime?.videosWatchedToEnd).toBe(50_000);
    expect(output.rhythm?.videosWatched).toEqual({
      total: 50_000,
      last12Months: 6100,
      last30Days: 420,
    });
  });

  it('rhythm graph: 24 hourly counters + estimate by plausible sessionization', () => {
    expect(output.rhythm?.hourlyActivity).toHaveLength(24);
    // No target value frozen on the estimate (a REAL computation by sessionization, not recopied):
    // we only lock a plausible order of magnitude ("about 29 h").
    expect(output.rhythm?.estimatedMinutes).toBeGreaterThan(1000);
    expect(output.rhythm?.estimatedMinutes).toBeLessThan(2200);
  });

  it('semantic wall / opacity: present, readable << opaque (order of magnitude, no frozen value)', () => {
    expect(output.opacity?.readableCount).toBe(24 + 14);
    expect(output.opacity?.opaqueCount).toBeGreaterThan((output.opacity?.readableCount ?? 0) * 10);
  });
});

describe('EN demo — the honesty bar reveals the real limit of the lexicons', () => {
  const result = processExport(buildSyntheticExportZipEn(undefined, NOW), { now: NOW });
  if (!result.ok) {
    throw new Error(`export synthétique EN invalide : ${JSON.stringify(result)}`);
  }
  const { output } = result;

  // A MEASUREMENT, not a target. The EN persona was written blind (a person, not a list of
  // triggers); this block records what the detector draws from it TODAY.
  //
  // THE EN BATCH OF `mental_health` LANDED (PANO-35) — and these numbers did NOT move a byte.
  // This is not a miss: the persona, written without aiming at the lexicons, meets NONE of the ~50
  // delivered terms. It is the most useful measurement of this block, and it says a limit of the instrument
  // rather than a limit of the lexicon: a persona measures RECALL on a writing voice, never
  // a false-positive rate. What the batch adds is exercised by the adversarial battery
  // (`engine/detect/lexicon-battery.test.ts`), the only place that crosses it; what would be needed to
  // measure FPs is named as debt in the catalog (bench of personas in contrasted registers).
  it('D1 outputs mental_health AND conflictual — two OWNED EN coverages, nothing more', () => {
    // `mental_health` crosses via « burnout », the same word on both sides: it crossed ALREADY
    // before its batch, without any decision willing it, and it is since annotated « (EN) ».
    // `conflictual` joined the list at the EN batch of its lexicon — and it, it had to be WILLED:
    // its gate requires an insult AND a target, and both lists were FR.
    expect(new Set(output.signals.map((s) => s.label))).toEqual(
      new Set([sensitiveTopicName('fr', 'mental_health'), sensitiveTopicName('fr', 'conflictual')]),
    );
    const mental = output.signals.find(
      (s) => s.label === sensitiveTopicName('fr', 'mental_health'),
    );
    expect(mental?.sensitive).toBe(true);
    expect(mental?.evidence).toHaveLength(1);
    // The term that crosses is PINNED, not only the label: this is what distinguishes an
    // owned coverage from a count. If another term of a batch started crossing, this
    // line would say so instead of letting it blend into an unchanged total.
    expect(mental?.evidence[0]?.triggerTerms).toEqual(['burnout']);
  });

  // This test ASSERTED the opposite — "the EN targeted insult does NOT trigger conflictual (no
  // EN variant in the lexicon)". It was a trip-wire on this label's EN debt, and it was
  // FLIPPED, never removed: a deleted trip-wire leaves no trace of what it guarded.
  // The negative assertion becomes positive, with its pinned term.
  //
  // This is the ONLY recall movement of `conflictual`'s EN batch, and it is intended: the EN lexicon
  // is deliberately small — an order of magnitude below the FR — because nothing in an export
  // separates the joke between friends from aggression — cf. the header of `lexicon/conflictual.ts`. Any
  // movement OUTSIDE this single item would be an over-matching term, and must be read as such.
  it('the EN targeted insult triggers conflictual — via « stupid » + the target « you’re »', () => {
    const signal = output.signals.find((s) => s.label === sensitiveTopicName('fr', 'conflictual'));
    expect(signal, 'la persona EN porte une insulte ciblée : elle doit être lue').toBeDefined();
    expect(signal?.sensitive).toBe(true);
    // Item-level (B5): a single emitted item suffices, and a single one is expected.
    expect(signal?.evidence).toHaveLength(1);
    // The pinned term, not only the label — same discipline as « burnout » above: if
    // another term of the batch started crossing, this line would say so.
    expect(signal?.evidence[0]?.triggerTerms).toEqual(['stupid']);
  });

  it('D2 retains ONLY cinema_series (3 items) — chats has no EN variant', () => {
    expect(new Set(output.themes.map((t) => t.id))).toEqual(new Set(['cinema_series']));
    expect(
      output.themes.find((t) => t.id === 'cinema_series')?.deductions[0]?.evidence,
    ).toHaveLength(3);
  });

  it('same aggregated volumes as the FR version (24/14/300/2700, 50000/6100/420)', () => {
    expect(output.volumes.searches).toBe(24);
    expect(output.volumes.comments).toBe(14);
    expect(output.volumes.follows).toBe(300);
    expect(output.volumes.endorsements).toBe(2700);
    expect(output.volumes.allTime?.videosWatchedToEnd).toBe(50_000);
    expect(output.rhythm?.videosWatched.last12Months).toBe(6100);
    expect(output.rhythm?.videosWatched.last30Days).toBe(420);
  });
});
