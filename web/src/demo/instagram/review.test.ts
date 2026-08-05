// THE REVIEW FILE, WRITTEN FROM THE CORPUS ITSELF.
//
// ⚠ IT IS GENERATED, NOT MAINTAINED. The maintainer ratifies the demo's prose before a push
// (`docs/instagram-demo-corpus.md`), and a document typed by hand beside the code it describes
// drifts on the first edit — this test REGENERATES it and fails when the file on disk no longer
// matches, so the review is always of what actually ships.
//
// Run `npm run test -- --update` to refresh it after changing the corpus.
//
// ─── WHAT THE REVIEW FILE SHOWS, AND WHAT IT DOES NOT ───────────────────────────────────────────
//   - IT SHOWS EVERY BEAT IN FULL, in both languages. Those are the hand-written scenes, and they
//     are what a reader is being asked to ratify;
//   - IT SHOWS THE BANKS, not the millions of sentences they combine into. The connective tissue is
//     combinatorial, so printing it would be printing a sample of a sample — the banks are the thing
//     that was chosen.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { THREADS } from './corpus';

const DOC = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../../docs/instagram-demo-corpus.md',
);

function render(): string {
  const out: string[] = [
    '# The Instagram demo — its whole corpus, for ratification',
    '',
    '⚠ **Generated from `web/src/demo/instagram/corpus.ts`** by `review.test.ts`. Editing this file by',
    'hand changes nothing: edit the corpus and re-run the tests.',
    '',
    '⚠ **Every value below is invented.** No handle, first name, date or sentence comes from any real',
    'export (CLAUDE.md). The arcs are ordinary shapes — a relationship, a friendship, a study group —',
    'because that is what an inbox holds, not because they describe anyone.',
    '',
    'What is printed here is the **hand-written** part: the beats, in order, in both languages. The',
    'volume between them is combined from the banks printed under each thread, so the corpus is a few',
    'hundred authored lines and about four thousand generated ones — and this file is where that',
    'distinction is visible.',
    '',
    '---',
    '',
  ];
  for (const [i, t] of THREADS.entries()) {
    const authored = t.beats.reduce((n, b) => n + b.lines.length, 0);
    out.push(`## ${i + 1}. \`${t.handle}\` — « ${t.titleFr} » / « ${t.titleEn} »`);
    out.push('');
    out.push(
      `- **${t.messages} messages**, days ${t.fromDay}–${t.toDay} · ` +
        `${authored} written by hand, ${t.messages - authored} combined · ` +
        `${Math.round(t.mediaShare * 100)} % of the filler carries a media` +
        (t.others === undefined ? '' : ` · **group** with ${t.others.join(', ')}`),
    );
    out.push('');
    for (const beat of t.beats) {
      out.push(`### day ${beat.day}`);
      out.push('');
      out.push('| | FR | EN |');
      out.push('|---|---|---|');
      for (const line of beat.lines) {
        const who = line.self ? '**moi**' : t.titleFr;
        out.push(
          `| ${who} | ${line.fr.replace(/\|/g, '\\|')} | ${line.en.replace(/\|/g, '\\|')} |`,
        );
      }
      out.push('');
    }
    out.push('<details><summary>banks</summary>');
    out.push('');
    for (const [name, lines] of [
      ['openers', t.bank.openers],
      ['subjects', t.bank.subjects],
      ['tails', t.bank.tails],
    ] as const) {
      out.push(`- **${name}** — ${lines.map((x) => `« ${x.fr} » / « ${x.en} »`).join(' · ')}`);
    }
    out.push('');
    out.push('</details>');
    out.push('');
  }
  return `${out.join('\n').trimEnd()}\n`;
}

it('the review file matches the corpus', () => {
  const wanted = render();
  const current = (() => {
    try {
      return readFileSync(DOC, 'utf8');
    } catch {
      return '';
    }
  })();
  if (current !== wanted) writeFileSync(DOC, wanted);
  expect(readFileSync(DOC, 'utf8')).toBe(wanted);
});
