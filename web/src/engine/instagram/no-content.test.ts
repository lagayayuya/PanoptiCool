// NO MESSAGE TEXT REACHES A REPORT — ADR-0008 §1, held as a property rather than as a shape.
//
// This is the invariant the Instagram wave was built around: the analysis counts, and the TEXT of a
// thread is opened only when someone opens that thread or hands it to their local model. Everything
// else in the product handles an `EngineOutput` freely — a golden freezes it, the AI page reads it,
// a log could print it — so a message body that reached it once would travel everywhere without
// anyone deciding it should.
//
// ⚠ WHY THIS FILE EXISTS BESIDE `conversations.test.ts`. That net asserts the invariant on the one
// SHAPE that could leak, and says so in its own border: « nothing here proves that NO field of NO
// message can ever reach the output — that rests on the accumulator's shape, which is visible in the
// code and unasserted ». This file asserts it on the OUTPUT, from the other end: it does not read the
// accumulator at all, it reads what came out.
//
// ⚠ THE INSTRUMENT IS THE SYNTHETIC PERSONA, and no other corpus would do. The archives in `samples/`
// are shaped like exports; this one was WRITTEN, line by line, so every sentence in it is a string we
// hold and can look for. `deadleuze` alone carries 145 hand-written lines that no generator would
// produce by accident. A leak is therefore not inferred here — it is found by name.
//
// ─── THE MUTATION THAT VERIFIES THIS FILE ───────────────────────────────────────────────────────
// Run on 2026-08-05, because a net that has never been broken is indistinguishable from an empty one.
//
// ⚠ THE FIRST THING THE MUTATION ESTABLISHED WAS NOT ABOUT THIS FILE. `RawMessage` — the extractor's
// own view of a message — declares `sender_name`, `timestamp_ms`, the media arrays, `call_duration`
// and `reactions`, AND NO CONTENT FIELD AT ALL. The leak could not be written without first widening
// the type that refuses to see the text. That is ADR-0008 §1's « enforced by where the code lives »,
// and it is a stronger guarantee than the one this file was written to add.
//
// The mutation therefore added `content?: string` to `RawMessage`, then carried the LAST message's
// body through the accumulator onto `ConversationSummary` (`lastText`) — one sentence per thread,
// the narrowest leak that can be written — and touched nothing else.
//
// RESULT, AND IT IS NOT THE ONE THAT WAS PREDICTED. The header first claimed both cases would fail
// on `deadleuze`'s « je ne fais que lire ce qui est déjà là ». They did not: they failed on 13 (FR)
// and 15 (EN) OTHER sentences — one per thread whose last message is text rather than a media —
// among them « bonjour, ma commande n’est jamais arrivée » and « quelqu’un a coupé l’eau ? ».
// `deadleuze` leaked nothing, because its closing line (« voilà. c’était le sujet ») is shorter than
// `MIN_LENGTH` and is not a probe. Two things follow, and only the run could give them: the net
// catches the narrowest leak shape there is, one message per thread; and the sentence a reader would
// think of first is not the one that defends them. Restored, `conversations.ts` byte-identical, green.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - THE TWO PATHS THAT ARE SUPPOSED TO READ CONTENT. `makeThreadReader` and `ai/conv-prompt.ts`
//     handle message text BY DESIGN (ADR-0008 §2) — this file says nothing about them, and a bug
//     that made either of them store or log what it reads would not show here;
//   - MEDIA. Attachment filenames and paths are structure, not content, and they legitimately reach
//     the universe module. A leak carried by a FILENAME rather than by a body is outside this reach;
//   - A LEAK THAT REPHRASES. Only the exact written strings are searched. Something that reached the
//     report as a truncation, a normalisation or a hash would pass — the shapes this catches are the
//     ones a copy produces, which is the shape a mistake actually takes;
//   - EVERY OTHER CONNECTOR. TikTok reads comments and searches deliberately (ADR-0008, Context) and
//     is not subject to this property at all.

import { describe, expect, it } from 'vitest';
import { THREADS } from '../../demo/instagram/corpus';
import { buildInstagramDemoExport } from '../../demo/instagram/export';
import { BlobZipExportSource } from '../blob-zip-source';
import { instagramConnector } from './connector';

/** Every sentence the corpus hands to the archive as a message body, in one locale. */
function writtenLines(locale: 'fr' | 'en'): string[] {
  const out: string[] = [];
  for (const thread of THREADS) {
    for (const beat of thread.beats) for (const line of beat.lines) out.push(line[locale]);
    for (const bank of [thread.bank.openers, thread.bank.subjects, thread.bank.tails]) {
      for (const line of bank) out.push(line[locale]);
    }
  }
  return out;
}

/**
 * ⚠ THE FLOOR EXISTS SO THE ZERO CANNOT ARRIVE BY THE WRONG PATH. A short line (« oui », « exact »)
 * would be absent from any report for reasons that have nothing to do with the invariant, and a
 * threshold that emptied the candidate list would make this file pass while measuring nothing. So
 * the count is asserted before the absence is: the search must have had something to search for.
 *
 * ⚠ THE NUMBER IS MEASURED, NOT CHOSEN — and it caught its own author: this floor was first written
 * at 400 from a guess, and the first run answered 216 (FR) / 209 (EN). Written back from what ran.
 */
const MIN_LENGTH = 24;
const MIN_PROBES = 200;

/** One line by name, so the count above cannot be satisfied by 200 sentences that are not this one.
 *  It is `deadleuze`'s, the thread written to be read — the sentence a leak would hurt most. */
const SIGNATURE = {
  fr: 'je ne fais que lire ce qui est déjà là',
  en: 'I’m only reading what is already there',
} as const;

async function analyse(locale: 'fr' | 'en') {
  const { bytes, fileName } = buildInstagramDemoExport(locale);
  const file = new File([bytes.slice().buffer as ArrayBuffer], fileName);
  const source = await BlobZipExportSource.open(file, fileName);
  const result = await instagramConnector.analyze(source, { locale });
  if (!result.ok) throw new Error(`analysis failed: ${JSON.stringify(result)}`);
  return result.report;
}

describe('the Instagram report carries no message content (ADR-0008 §1)', () => {
  for (const locale of ['fr', 'en'] as const) {
    it(`holds against every written line of the synthetic corpus (${locale.toUpperCase()})`, async () => {
      const report = await analyse(locale);
      // The whole output, exactly as every other surface receives it — not a chosen subtree.
      const serialised = JSON.stringify(report);

      const probes = [...new Set(writtenLines(locale).filter((s) => s.length >= MIN_LENGTH))];
      expect(probes.length).toBeGreaterThan(MIN_PROBES);
      expect(probes).toContain(SIGNATURE[locale]);

      const leaked = probes.filter((s) => serialised.includes(s));
      expect(leaked).toEqual([]);
    }, 60_000);
  }
});
