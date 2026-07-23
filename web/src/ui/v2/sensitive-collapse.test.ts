// WITNESS OF THE DEFAULT COLLAPSE OF A SENSITIVE FINDING — SENS-C4, the « door » half.
//
// WHY THIS FILE EXISTS. ADR-0003 (*What carries the safety: the door, not the threshold*) makes the
// collapse the **door of consent**, and its *Consequences* write in black and white that it can
// **fall silently**. It was the only point of the doctrine that predicted its own mode of
// failure without anyone watching it: the collapse hung on a `useState(false)` in
// `ThemeCardNavy.tsx`, frozen by accident and not by measure.
//
// BY ACCIDENT, AND ONE MUST SAY WHICH — otherwise the rest seems redundant with the goldens. The two
// render goldens **mock `useState`** to force every boolean initialized to `false` toward `true`
// (their « precaution 2 », without which they would see neither verbatim nor highlight). They are
// therefore **structurally blind** to the initial value: switching the source to `useState(true)` moves
// not a byte there. The « sensible » badge, on the other hand, is indeed held by them — it depends on no
// state.
//
// THE BEARING ASSERTION is `aria-expanded="false"`, not the absence of the body. An absence is a
// **zero**, and CLAUDE.md requires asking by which path it arrives: a finding without evidence
// would render an empty body whatever the state. `aria-expanded` changes **value** under mutation,
// it cannot go green for another reason. The absence of the verbatim is here only a
// **secondary** assertion, and it is legitimate only because the evidence below exists: the
// only path that erases it from the render is the collapse.
//
// VERIFIED BY MUTATION (the test proves nothing until this is done):
//   - `SignalCardNavy`: `useState(false)` → `useState(true)` ⇒ THIS file goes red, and it alone in
//     the whole suite;
//   - `ThemeCardNavy`: same toggle on the other collapse (the theme cards, non-sensitive) ⇒ this
//     file stays GREEN. The witness is therefore specific to the sensitive mechanism, not coupled by
//     chance to the neighboring collapse.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// CLAUDE.md obligation: a proof mechanism declares its border, otherwise it ends up over-cited.
//   - THE « BADGE » HALF OF SENS-C4. This file verifies that the badge is PRESENT, but only
//     to anchor on the right subject (a sensitive card, not any card). Its prose and its
//     place in the header are frozen by the render goldens, not here;
//   - THE SENSITIVE SIGNAL CARD (`SignalCardNavy`) ONLY. The collapse of the THEME cards is a
//     distinct `useState` in the same file; it carries no doctrine of the sensitive and remains
//     outside this witness — the cross mutation above measures it;
//   - THE BEHAVIOR AFTER CLICK. What is frozen is the **first-render** state, that is what
//     SENS-C4 protects (the unconsented glance). Nothing here says the card opens or
//     that it closes again;
//   - NO SECOND MOBILE WITNESS, and it is a measured choice rather than an omission: `SignalCardNavy`
//     does not read `useIsMobile`. The `open` state therefore has **no device branch** to exercise
//     twice, and a mobile witness would replay the same code on the same value. The day a variant
//     `M_*` conditions the collapse, this line becomes false and this witness must double;
//   - THE ENGINE PATH. The finding below is built by hand, not produced by the detector.
//     This witness says « a sensitive card renders collapsed », never « the engine emits a sensitive » —
//     that second property lives in the benches of `detect/`. It is deliberate: hooking the witness
//     to the persona would make it vacant the day a rule stops emitting.

import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { expect, it } from 'vitest';
import type { Signal } from '../../engine/analysis';
import { UI_CARD } from '../copy';
import { SignalCardNavy } from './ThemeCardNavy';

// Synthetic verbatim (repo invariant: no value from a real export). It has only one role —
// to be a string that ONLY the expanded body can make appear in the render.
const VERBATIM = 'zzz-preuve-temoin-repli';

const SENSITIVE_SIGNAL: Signal = {
  label: 'Santé mentale',
  sensitive: true,
  confidence: 'medium',
  evidence: [
    {
      channel: 'search',
      sourceIndex: 0,
      text: VERBATIM,
      date: '2026-01-01 00:00:00',
    },
  ],
};

it('SENS-C4 — a sensitive finding starts COLLAPSED (ADR-0003: the collapse is the door of consent)', () => {
  const html = render(h(SignalCardNavy, { signal: SENSITIVE_SIGNAL, reuseMap: new Map() }));

  // Anchoring: we are indeed looking at a SENSITIVE card. Without this, the test would hold on any
  // card and would no longer say anything about the doctrine it cites.
  expect(html).toContain(UI_CARD.sensitiveTag);

  // The bearing assertion: the door is closed at first render.
  expect(html).toContain('aria-expanded="false"');

  // Secondary: the evidence exists (above), so its absence from the render can only come from the collapse.
  expect(html).not.toContain(VERBATIM);
});
