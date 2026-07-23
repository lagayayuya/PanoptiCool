// THE FAN RENDERS ALL ITS READINGS — in BOTH modes.
//
// ── Why this file exists, and why no one had seen the defect ─────────────────────────────────────
// The `equal` mode rendered exactly TWO readings (`readings[0]`, a separator, `readings[1]`) and
// lost the rest silently. The five topical lexicons carry three: the third
// never appeared on a broad finding.
//
// The defect survived because NO golden renders an `equal` fan. The demo persona produces
// a NAMED `mental_health` finding; `render-golden` and `ui-golden` therefore mount cards that
// exercise only the `ranked` mode (and, before batch A, no fan at all).
//
// It is a border that NEITHER `render-golden` NOR `ui-golden` declared, and it is STRUCTURAL:
// the persona was written blind, like a person and not like a set of triggers. What
// it does not exercise is therefore no one's choice — and what no one decided to omit,
// no one thinks to write down. The two goldens do declare what they do NOT MOUNT (AiSection,
// mobile, LandingPage…); they could not declare what they mount without reaching it.
//
// ── What this file does NOT cover ────────────────────────────────────────────────────────────────
// It mounts a card carrying a fan, and looks at a single thing: no reading lost. It
// says nothing of the layout, nor of the ORDER of the readings (not ratified — catalog §4), nor of
// the NUMBER a label must carry (catalog decision). Rendering fewer readings than one receives
// is not a product decision: it is a data loss, and that is all that is tested here.

import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { describe, expect, it, vi } from 'vitest';
import type { Evidence, ReadingFan, Signal } from '../../engine/analysis';
import { SignalCardNavy } from './ThemeCardNavy';

// Disclosures forced open — same idiom as `render-golden`: the fan lives behind an
// internal `useState(false)`, and closed it would simply not be rendered.
vi.mock('preact/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('preact/hooks')>();
  return {
    ...actual,
    useState: <T>(init: T) =>
      actual.useState(init === (false as unknown as T) ? (true as unknown as T) : init),
  };
});

/** Three invented readings — the test bears on the rendered COUNT, never on ratified texts. */
const TROIS_LECTURES = ['lecture alpha', 'lecture beta', 'lecture gamma'] as const;

function carte(mode: ReadingFan['mode']): string {
  const preuve: Evidence = {
    channel: 'search',
    sourceIndex: 0,
    text: 'texte de preuve synthetique',
    date: '2026-07-16 12:00:00',
    triggerTerms: [],
    readings: { mode, readings: [...TROIS_LECTURES] },
  };
  const signal: Signal = {
    sensitive: true,
    label: 'Santé mentale',
    claim: 'Constat synthétique de test.',
    confidence: 'low',
    evidence: [preuve],
  };
  return render(h(SignalCardNavy, { signal, reuseMap: new Map() }));
}

describe('reading fan — no reading lost at render', () => {
  for (const mode of ['equal', 'ranked'] as const) {
    it(`mode \`${mode}\`: the THREE readings are rendered`, () => {
      const html = carte(mode);
      for (const lecture of TROIS_LECTURES) {
        expect(html).toContain(lecture);
      }
    });
  }

  it('mode `equal`: the separator is INTERLEAVED, so there is one fewer than readings', () => {
    // The guard that distinguishes « renders three readings » from « renders them correctly »: a
    // separator hardcoded once would produce a false count as soon as we leave the pair.
    const separateurs = (carte('equal').match(/≡/g) ?? []).length;
    expect(separateurs).toBe(TROIS_LECTURES.length - 1);
  });
});
