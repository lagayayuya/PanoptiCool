// THE `claim` INVARIANT — a sentence if and only if no fan of readings.
//
// ── Why this file exists ─────────────────────────────────────────────────────────────────────────
// `Deduction.claim` is OPTIONAL, and an optional field whose rule no one knows is exactly what must
// not be left behind. The type cannot express the "if and only if": the fan lives on
// `Evidence.readings`, hence on the EVIDENCE, not on the finding — a finding type cannot refer to
// it. Expressing it would mean lifting the fan up to the finding, which is a different job than this
// one.
//
// The rule is therefore held HERE rather than by the compiler, and it is written to be read:
//
//   a finding carries a SENTENCE ⟺ it carries NO fan
//
// This is NOT "sensitive or not". Two populations with no fan keep their sentence:
//   · `conflictual` — no fan by doctrine (B5: the emitted insult IS the explicit signal, there is
//     no plural reading to offer). Its sentence additionally carries the B5 CRITERION — a remark
//     EMITTED, DIRECTED AT another user — which the title "Conflict" does not say;
//   · the INTERESTS (D2) — no fan either, and their sentence carries a count.
//
// ── What this file does NOT cover ────────────────────────────────────────────────────────────────
// It verifies the CONSISTENCY of the engine's output on a synthetic corpus, not that the render
// honors the rule: it is `render-golden` that shows the card, and `fan-readings.test.ts` that
// guarantees no reading is lost at display. It also says nothing about the labels no test corpus
// triggers — it verifies what it reaches, and no more.

import { describe, expect, it } from 'vitest';
import type { Deduction } from './analysis';
import { analyze } from './analyze';
import { normalizeExport } from './normalize';
import type { CommentItem, SearchItem, TikTokExport } from './tiktok-export';
import { validTikTokExport } from './valid-export.fixture';

/** Corpus triggering both populations: fan labels, `conflictual`, and an interest. */
const CORPUS = [
  'ma dépression me suit depuis des années',
  'je cherche un bon psy dans le coin',
  "t'es vraiment un abruti d'avoir écrit ça",
  'grosse manif demain contre la réforme',
  'les élections approchent, allez voter',
  'encore une soirée sur mon jeu vidéo préféré avec la manette',
  'un bon jeu video et une partie tranquille ce soir',
];

function analyse() {
  const base = validTikTokExport() as TikTokExport & {
    Comment: { Comments: { CommentsList: readonly CommentItem[] } };
    'Your Activity': { Searches: { SearchList: readonly SearchItem[] } };
  };
  base.Comment.Comments.CommentsList = CORPUS.map((comment, i) => ({
    date: `2026-06-15 10:00:0${i % 10} UTC`,
    comment,
    photo: '',
    video: '',
    sticker: '',
    originalPostUrl: '',
    'original post link': '',
  }));
  return analyze(normalizeExport(base), Date.UTC(2026, 6, 16, 12, 0, 0));
}

/** All findings of the analysis — D1 signals and D2 theme deductions together. */
function tousLesConstats(): { nom: string; deduction: Deduction }[] {
  const out = analyse();
  return [
    ...out.signals.map((s) => ({ nom: s.label, deduction: s as Deduction })),
    ...out.themes.flatMap((t) => t.deductions.map((d) => ({ nom: t.label, deduction: d }))),
  ];
}

const porteUnEventail = (d: Deduction) => d.evidence.some((e) => e.readings !== undefined);

describe('`claim` ⟺ no fan', () => {
  it('the corpus does trigger BOTH populations (the test does not pass vacuously)', () => {
    const constats = tousLesConstats();
    expect(constats.some((c) => porteUnEventail(c.deduction))).toBe(true);
    expect(constats.some((c) => !porteUnEventail(c.deduction))).toBe(true);
  });

  it('a finding WITH a fan NEVER carries a sentence', () => {
    const fautifs = tousLesConstats()
      .filter((c) => porteUnEventail(c.deduction) && c.deduction.claim !== undefined)
      .map((c) => `${c.nom} : « ${c.deduction.claim} »`);
    expect(fautifs).toEqual([]);
  });

  it('a finding WITHOUT a fan ALWAYS carries a sentence — otherwise its card would be mute', () => {
    // This is the half that protects: a finding with no fan AND no sentence would have no text at
    // all. That is precisely the risk `conflictual` would have run if the rule had been "no sentence
    // on the sensitive" instead of "no sentence when there is a fan".
    const muets = tousLesConstats()
      .filter((c) => !porteUnEventail(c.deduction) && c.deduction.claim === undefined)
      .map((c) => c.nom);
    expect(muets).toEqual([]);
  });
});
