// Highlighting of trigger words in a source text (ex-`evidence-v2.ts`).
//
// Extracted as is from `evidence-v2.ts`, removed at batch A1: this module resolved nothing anymore once
// the evidence store was removed (the evidence carries its verbatim), but the HIGHLIGHTING, for its part, stays a
// rendering mechanism in its own right — the « ThemeCardNavy » mockup underlines the spotted word. No
// line of logic has changed.

/** Fragment of source text, marked or not (highlighting of trigger words). */
export interface TextPart {
  text: string;
  marked: boolean;
}

/** Splits `text` into marked/unmarked fragments according to `terms` (case-insensitive) — the
 * mockup's highlighting mechanism. Without a term: a single unmarked fragment.
 *
 * UNICODE-SAFE word boundaries (not `\b`, ASCII-only in JS — would break on accents: « série »,
 * « déjà »). Lookarounds `(?<![\p{L}\p{N}])…(?![\p{L}\p{N}])` with `giu`, same boundary logic as
 * the detector (`detect.ts` — `isAlnum`/word boundaries). Without it, a marker matched a PIECE
 * of a neighboring word (« série » highlighted inside « sérieux ») — a term that never triggered
 * presented itself as evidence (a display bug, the engine itself only returns the real surfaces).
 * Terms sorted from longest to shortest: at equal position, the regex keeps the FIRST of
 * the alternation — sorting avoids a short term masking a long term that contains it. */
export function splitTriggerTerms(text: string, terms: readonly string[] | undefined): TextPart[] {
  if (terms === undefined || terms.length === 0) {
    return [{ text, marked: false }];
  }
  const escaped = [...terms]
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${escaped.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  const parts: TextPart[] = [];
  let last = 0;
  let m = re.exec(text);
  while (m !== null) {
    if (m.index > last) {
      parts.push({ text: text.slice(last, m.index), marked: false });
    }
    parts.push({ text: m[0], marked: true });
    last = m.index + m[0].length;
    if (re.lastIndex === m.index) {
      re.lastIndex++;
    }
    m = re.exec(text);
  }
  if (last < text.length) {
    parts.push({ text: text.slice(last), marked: false });
  }
  return parts;
}
