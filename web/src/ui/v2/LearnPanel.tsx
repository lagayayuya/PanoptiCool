// « pour comprendre » educational panels (« PanoptiCool v5 Web » mockup): STATIC content taken
// as is from the mockup, collapsible per section via the dotted button of the header. The wording
// is the mockup's (validated by yuya in Claude Design) — not an engine template.
//
// v5 DROPPED THE « POUR COMPRENDRE » KICKER, and the panel reads better without it: the question is
// now set at 20 px, which makes it unmistakably the panel's heading, and the control that opened it
// already says « comprendre · … ». The label was announcing what the reader had just clicked.

import { UI_LEARN } from '../copy';
import { NAVY } from './palette';

export interface LearnColumn {
  title: string;
  text: string;
}

export function LearnPanel({
  question,
  columns,
  footnote,
}: {
  question: string;
  columns: readonly LearnColumn[];
  footnote?: string;
}) {
  return (
    <div class="hl-learn" style={PANEL}>
      <span style={QUESTION}>{question}</span>
      <div style={GRID}>
        {columns.map((c) => (
          <div key={c.title} style={COL}>
            <span style={COL_TITLE}>{c.title}</span>
            <span style={COL_TEXT}>{c.text}</span>
          </div>
        ))}
      </div>
      {footnote !== undefined && <div style={FOOTNOTE}>{footnote}</div>}
    </div>
  );
}

/** Dotted button « comprendre · … » / « fermer ✕ » of the section headers. */
export function LearnToggle({
  open,
  label,
  onToggle,
}: {
  open: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button type="button" class="hl-btn" style={TOGGLE} onClick={onToggle} aria-expanded={open}>
      {UI_LEARN.open(label)} {open ? UI_LEARN.glyphOpen : UI_LEARN.glyphClosed}
    </button>
  );
}

// The mockup's grid breaks at `min(100%, 260px)` rather than at a bare 260 px: inside a narrow
// parent, a bare minimum forces the track wider than the container and the row overflows. The
// `min()` lets the track fall back to the full width instead. Same form in every v5 grid here.
const PANEL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  padding: '28px',
  background: NAVY.learnBg,
  border: `1px dashed ${NAVY.learnBorder}`,
  borderRadius: '20px',
} as const;
const QUESTION = {
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.3,
  color: '#ffffff',
} as const;
const GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
  gap: '24px',
} as const;
const COL = { display: 'flex', flexDirection: 'column', gap: '9px', minWidth: 0 } as const;
const COL_TITLE = {
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: 1.3,
  color: NAVY.learnTitle,
} as const;
const COL_TEXT = { fontSize: '15px', lineHeight: 1.7, color: NAVY.textBody } as const;
const FOOTNOTE = {
  fontSize: '15px',
  lineHeight: 1.7,
  color: NAVY.textBody,
  borderTop: `1px dashed ${NAVY.learnBorder}`,
  paddingTop: '18px',
} as const;
const TOGGLE = {
  cursor: 'pointer',
  flex: 'none',
  fontSize: '14px',
  lineHeight: 1.2,
  fontWeight: 500,
  fontFamily: 'inherit',
  color: NAVY.learnAccent,
  background: 'transparent',
  border: `1px dashed ${NAVY.learnBorder}`,
  borderRadius: '11px',
  padding: '11px 15px',
} as const;
