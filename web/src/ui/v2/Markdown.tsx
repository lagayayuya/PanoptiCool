// The text of a model's answer, laid out.
//
// ⚠ WHY THIS FILE CAME BACK. The prototype rendered the answer through a small markdown pass; the
// port dropped the renderer and kept the class that went with it — `.ca-out.md`, whose one job is to
// hand the whitespace over to that renderer (`white-space: normal`). With the renderer gone, the
// class only undid the `pre-wrap` the raw-text path depended on: every answer arrived as a single
// run-on block, its `###` and `**` visible and its paragraphs gone. Reported as « le prompt de
// réponse ne semble plus formaté », reproducible in demo and out of it.
//
// ————— Why not a library —————
//
// A markdown library renders HTML, which then has to be injected with `dangerouslySetInnerHTML` and
// therefore sanitised. This text comes from a language model: not hostile, but not written by us
// either, and one `<img onerror>` in an answer would be enough. Here nothing is ever interpreted as
// HTML — the pass produces ELEMENTS, never a string of tags. The risk is not reduced, it is absent.
// And this product runs offline, with no dependency left to install.
//
// ————— WHAT IS RENDERED, AND NOTHING ELSE —————
//
// Blocks: `#` to `######` headings, `-`/`*`/`+` lists, `1.` numbered lists, `>` quotes, ``` code
// fences, `---` rules, paragraphs. Inline: `**bold**`, `*italic*` and `_italic_`, `` `code` ``.
//
// DELIBERATELY NOT RENDERED:
//   · LINKS. A local model can invent one; a clickable link inside an answer would be an invitation
//     to leave the page for an address nobody checked. The syntax is left as it is — visible, inert.
//   · images, tables, raw HTML, footnotes.
// Anything unrecognised stays TEXT: nothing ever disappears from the render.
//
// ————— The stream —————
//
// The answer arrives token by token: at every frame the markdown is INCOMPLETE — a missing ```
// fence, an open `**`. The parse is therefore defensive: an unclosed fence renders to the end of the
// text received, an unclosed emphasis stays text. Nothing jumps.
//
// ⚠ STYLED INLINE, WITH NO STYLESHEET, and that is not the v2 convention applied blindly. This
// component is rendered from BOTH products — the TikTok section styles itself inline, the Instagram
// piece through `src/ui/instagram/*.css` — and a sheet imported by two lazily-loaded chunks is
// dropped from the build entirely (`instagram/styles.test.ts` exists because that shipped twice).
// So the rules travel with the elements, and every colour here is `currentColor` at some opacity:
// the block takes the palette of whatever renders it, and neither product owns it.

import type { ComponentChildren, VNode } from 'preact';

/** Splits a line into bold / italic / code, keeping whatever is not recognised. */
function inline(src: string, keyPrefix: string): ComponentChildren[] {
  const out: ComponentChildren[] = [];
  // One pass, four patterns: code first — it neutralises what it contains.
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\n]+\*)|(_[^_\n]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null = re.exec(src);
  let i = 0;
  while (m !== null) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const tok = m[0];
    const key = `${keyPrefix}-i${i++}`;
    if (tok.startsWith('`')) {
      out.push(
        <code key={key} style={CODE}>
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith('**')) {
      out.push(
        <strong key={key} style={STRONG}>
          {tok.slice(2, -2)}
        </strong>,
      );
    } else {
      out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
    m = re.exec(src);
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

type Block =
  | { kind: 'p' | 'quote'; lines: string[] }
  | { kind: 'h'; level: number; text: string }
  | { kind: 'ul' | 'ol'; items: string[] }
  | { kind: 'code'; lines: string[] }
  | { kind: 'hr' };

function parse(src: string): Block[] {
  const lines = src.split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] as string;

    if (line.trimStart().startsWith('```')) {
      const body: string[] = [];
      i++;
      // Unclosed = take it to the end: that is the normal case while streaming.
      while (i < lines.length && !(lines[i] as string).trimStart().startsWith('```')) {
        body.push(lines[i] as string);
        i++;
      }
      i++;
      blocks.push({ kind: 'code', lines: body });
      continue;
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ kind: 'hr' });
      i++;
      continue;
    }

    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h !== null) {
      blocks.push({ kind: 'h', level: (h[1] as string).length, text: h[2] as string });
      i++;
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i] as string)) {
        items.push((lines[i] as string).replace(/^\s*[-*+]\s+/, ''));
        i++;
      }
      blocks.push({ kind: 'ul', items });
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i] as string)) {
        items.push((lines[i] as string).replace(/^\s*\d+[.)]\s+/, ''));
        i++;
      }
      blocks.push({ kind: 'ol', items });
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i] as string)) {
        body.push((lines[i] as string).replace(/^\s*>\s?/, ''));
        i++;
      }
      blocks.push({ kind: 'quote', lines: body });
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const body: string[] = [];
    while (
      i < lines.length &&
      (lines[i] as string).trim() !== '' &&
      !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i] as string) &&
      !/^#{1,6}\s+/.test(lines[i] as string) &&
      !(lines[i] as string).trimStart().startsWith('```') &&
      !/^\s*>\s?/.test(lines[i] as string)
    ) {
      body.push(lines[i] as string);
      i++;
    }
    blocks.push({ kind: 'p', lines: body });
  }
  return blocks;
}

/** One block, rendered. Split out so the map below stays readable. */
function block(b: Block, key: string): VNode {
  switch (b.kind) {
    case 'hr':
      return <hr key={key} style={HR} />;
    case 'h': {
      // ⚠ A `<p>`, NOT AN `<h2>`. The headings of an answer are not headings of the PAGE: they must
      // not enter the document outline, where they would interleave with the interface's own.
      const size = HEADING_SIZE[Math.min(6, Math.max(1, b.level)) - 1] as string;
      return (
        <p key={key} style={{ ...HEADING, fontSize: size }} role="presentation">
          {inline(b.text, key)}
        </p>
      );
    }
    case 'code':
      return (
        <pre key={key} style={PRE}>
          <code>{b.lines.join('\n')}</code>
        </pre>
      );
    case 'ul':
      return (
        <ul key={key} style={LIST}>
          {b.items.map((it, j) => (
            <li key={`${key}-${j}`}>{inline(it, `${key}-${j}`)}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={key} style={LIST}>
          {b.items.map((it, j) => (
            <li key={`${key}-${j}`}>{inline(it, `${key}-${j}`)}</li>
          ))}
        </ol>
      );
    case 'quote':
      return (
        <blockquote key={key} style={QUOTE}>
          {inline(b.lines.join(' '), key)}
        </blockquote>
      );
    default:
      return (
        <p key={key} style={PARAGRAPH}>
          {inline(b.lines.join('\n'), key)}
        </p>
      );
  }
}

/** A model's answer, laid out. `trailing` is the streaming caret, if any — it belongs after the
 *  last block rather than inside it, where an unfinished sentence would push it around. */
export function Markdown({
  text,
  trailing,
}: {
  text: string;
  trailing?: ComponentChildren;
}): VNode {
  return (
    <>
      {parse(text).map((b, n) => block(b, `b${n}`))}
      {trailing}
    </>
  );
}

// --- Styles ---------------------------------------------------------------------------------------
// Every colour is `currentColor` at an opacity: the block inherits the palette of whatever renders
// it, so the same component sits in the TikTok section and in the Instagram piece unchanged.
const HEADING_SIZE = ['1.35em', '1.2em', '1.08em', '1em', '1em', '1em'] as const;
const HEADING = { margin: '1.4em 0 0.5em', fontWeight: 600, lineHeight: 1.3 } as const;
const PARAGRAPH = { margin: '0 0 0.9em' } as const;
const LIST = { margin: '0 0 0.9em', paddingLeft: '1.4em' } as const;
const STRONG = { fontWeight: 600 } as const;
const CODE = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '0.9em',
  background: 'rgba(255,255,255,.07)',
  borderRadius: '4px',
  padding: '0.1em 0.35em',
} as const;
const PRE = {
  margin: '0 0 0.9em',
  padding: '0.9em 1em',
  overflowX: 'auto',
  background: 'rgba(255,255,255,.05)',
  borderRadius: '10px',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '0.88em',
  lineHeight: 1.55,
} as const;
const QUOTE = {
  margin: '0 0 0.9em',
  padding: '0.1em 0 0.1em 1em',
  borderLeft: '2px solid currentColor',
  opacity: 0.85,
} as const;
const HR = {
  margin: '1.4em 0',
  border: 'none',
  height: '1px',
  background: 'currentColor',
  opacity: 0.18,
} as const;
