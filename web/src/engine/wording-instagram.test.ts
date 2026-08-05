// THE INSTAGRAM WORDING PERIMETER — parity, and the doctrine that forbids the second person.
//
// Same two nets as `wording-parity.test.ts` and `wording.test.ts` on the TikTok side, for the same
// reasons. What is NOT duplicated is the argument; it is written once, there.
//
// ─── (1) PARITY, AT THE TYPECHECK ───────────────────────────────────────────────────────────────
// `InstagramWording = typeof FR` only holds the keys IF the French tables stay UNANNOTATED
// LITERALS. Annotating one `Record<string, string>` erases them, and an EMPTY English table would
// compile — measured on the TikTok pair. The `@ts-expect-error` below are assertions: if parity
// stops being held the expected error is no longer emitted, the directive becomes unused, and
// `astro check` fails. The net is at the typecheck because that is the only place the property
// exists.
//
// ─── (2) THE DOCTRINE, AT RUNTIME ───────────────────────────────────────────────────────────────
// ADR-0003: the engine never addresses the person. It describes a system. The sweep below runs over
// BOTH languages, because English makes the slip easier than French — « what this lets someone do
// to you » reads naturally and is precisely what is forbidden.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - IT JUDGES NO TRANSLATION. An English entry that copies the French passes parity and passes
//     the sweep. Between « nothing is translated » and « well translated » there is only a human
//     rereading, and this file is not it;
//   - IT DOES NOT REACH THE SCREEN. That these strings are RENDERED, in the right place, is the
//     business of the Instagram goldens — which do not exist yet;
//   - THE SWEEP IS LEXICAL. It catches the second-person pronouns and possessives it lists. A
//     sentence that addresses the person without using one (« imagine a home located by… ») passes.
//     That residue is a human read, and saying so is cheaper than implying the list is exhaustive;
//   - IT SEES NO DEAD ENTRY. A key no extractor reads passes like the others.

import { describe, expect, it } from 'vitest';
import type { InstagramWording } from './wording.instagram';
import { instagramWording } from './wording.instagram';
import { EN } from './wording.instagram.en';
import { FR } from './wording.instagram.fr';

// ─── (1) THE TYPECHECK NET ──────────────────────────────────────────────────────────────────────
// These declarations never execute. Each `@ts-expect-error` bears on the NEXT LINE — careful when
// editing: a literal split over several lines shifts the error and makes the directive unused for
// a reason that is not the right one.

// A table missing a key must be REJECTED.
// @ts-expect-error — `anchors` stripped of an anchor: the compiler must see it.
const _MISSING_ANCHOR: InstagramWording['anchors'] = { name: FR.anchors.name };

// An UNKNOWN key must be REJECTED (the other direction of parity).
//
// ⚠ TWO WAYS TO BREAK THIS ASSERTION WITHOUT TOUCHING IT, both hit while writing this file:
//   1. LET THE FORMATTER SPLIT THE LITERAL. The error is then reported on the line of the offending
//      KEY rather than on the annotated one, the directive goes « unused », and the typecheck fails
//      for a reason that is not the one under test. Hence the short alias below, which keeps the
//      whole literal on one line;
//   2. EXTRACT THE LITERAL TO A VARIABLE — the obvious fix for (1), and it silently DISABLES the
//      assertion. TypeScript's excess-property check applies to FRESH OBJECT LITERALS only; a
//      variable with an extra property is structurally assignable and compiles fine. The directive
//      then goes unused for the opposite reason, and a reader who only reads the message cannot
//      tell the two cases apart. The literal must stay inline.
const LINK = FR.legalLinkage;
// @ts-expect-error — a ghost key in `legalLinkage`: the compiler must see it.
const _GHOST_LINKAGE: InstagramWording['legalLinkage'] = { ...LINK, ghost: LINK.history };

// A FUNCTION whose signature diverges must be REJECTED.
// @ts-expect-error — `distinctIps` takes one string, not a number.
const _WRONG_SIGNATURE: InstagramWording['evidence']['distinctIps'] = (n: number) => `${n}`;

// ─── (2) THE RUNTIME NETS ───────────────────────────────────────────────────────────────────────

/** Every constant string of a bundle, flattened. Functions are excluded — they are called with
 *  parameters below, where their output can be swept like any other sentence. */
function constantStrings(o: unknown, out: string[] = []): string[] {
  if (typeof o === 'string') out.push(o);
  else if (o !== null && typeof o === 'object')
    for (const v of Object.values(o)) constantStrings(v, out);
  return out;
}

/** Output of every function of a bundle, called with placeholder arguments. */
function functionOutputs(w: InstagramWording): string[] {
  return [
    w.evidence.distinctIps('13'),
    w.evidence.distinctDevices('4'),
    w.evidence.addressCount('2'),
    w.evidence.gpsPoints('7'),
    w.evidence.truncated('40', '166'),
    w.coverage.partial('12', '31'),
  ];
}

/**
 * ⚠ THE LIST IS THE ASSERTION. Whole words only, so « tone » does not match « ton » and
 * « voter » does not match « vote » — a substring sweep here reports the whole file and gets
 * disabled within a week, which is worse than no sweep.
 */
const SECOND_PERSON = [
  // French
  'tu',
  'te',
  'toi',
  'ton',
  'ta',
  'tes',
  'vous',
  'votre',
  'vos',
  // English
  'you',
  'your',
  'yours',
  "you're",
  'yourself',
];

describe('parity', () => {
  it('the two bundles hold the same keys, at every depth', () => {
    // The typecheck above holds this by construction; this asserts it once at runtime so that the
    // day someone annotates the French tables — the exact mistake the header warns about — a test
    // says so in words rather than only a directive going unused.
    const keys = (o: unknown, prefix = ''): string[] =>
      o !== null && typeof o === 'object'
        ? Object.entries(o).flatMap(([k, v]) => [`${prefix}${k}`, ...keys(v, `${prefix}${k}.`)])
        : [];
    expect(keys(EN).sort()).toEqual(keys(FR).sort());
  });

  it('the English bundle is not a copy of the French', () => {
    const fr = constantStrings(FR);
    const en = constantStrings(EN);
    expect(fr.length).toBe(en.length);
    const identical = fr.filter((s, i) => s === en[i]).length;
    // A margin, not zero: « Port » and a few labels are legitimately identical.
    expect(identical / fr.length).toBeLessThan(0.2);
  });
});

describe('⚠ doctrine — the engine never addresses the person (ADR-0003)', () => {
  for (const [locale, bundle] of [
    ['fr', FR],
    ['en', EN],
  ] as const) {
    it(`${locale} — no second person, constants or function output`, () => {
      const sentences = [...constantStrings(bundle), ...functionOutputs(bundle)];
      // Anchoring: the sweep really has something to sweep. Without it, an empty bundle would pass
      // this test and prove nothing — the zero would have a second possible cause.
      expect(sentences.length).toBeGreaterThan(40);

      const offenders = sentences.filter((s) =>
        SECOND_PERSON.some((w) => new RegExp(`\\b${w}\\b`, 'i').test(s)),
      );
      expect(offenders).toEqual([]);
    });
  }
});

describe('the selector', () => {
  it('resolves each language, and falls back to French rather than crashing', () => {
    expect(instagramWording('fr').anchors.name.label).toBe(FR.anchors.name.label);
    expect(instagramWording('en').anchors.name.label).toBe(EN.anchors.name.label);
    // The language crosses the worker boundary via `postMessage`, where the closed union does not
    // survive — so this path is reachable in production, not only in a test.
    expect(instagramWording('de' as 'fr').anchors.name.label).toBe(FR.anchors.name.label);
  });
});
