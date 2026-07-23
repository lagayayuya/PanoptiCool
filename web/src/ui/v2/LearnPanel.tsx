// « pour comprendre » educational panels (« parcours guidé » mockup): STATIC content taken
// as is from the mockup, collapsible per section via the dotted button of the header. The wording
// is the mockup's (validated by yuya in Claude Design) — not an engine template.

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
      <span style={KICKER}>{UI_LEARN.kicker}</span>
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
      {open ? UI_LEARN.close : UI_LEARN.open(label)}
    </button>
  );
}

const PANEL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  padding: '24px 28px',
  background: NAVY.learnBg,
  border: `1px dashed ${NAVY.learnBorder}`,
  borderRadius: '12px',
} as const;
const KICKER = {
  fontSize: '10px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: NAVY.learnAccent,
} as const;
const QUESTION = {
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textBright,
} as const;
const GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '20px',
} as const;
const COL = { display: 'flex', flexDirection: 'column', gap: '8px' } as const;
const COL_TITLE = {
  fontSize: '11px',
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.learnTitle,
} as const;
const COL_TEXT = { fontSize: '12.5px', lineHeight: 1.75, color: NAVY.textBody } as const;
const FOOTNOTE = {
  fontSize: '11.5px',
  lineHeight: 1.7,
  color: NAVY.textMuted,
  borderTop: `1px dashed ${NAVY.learnBorder}`,
  paddingTop: '13px',
} as const;
const TOGGLE = {
  cursor: 'pointer',
  flex: 'none',
  fontSize: '10.5px',
  // explicit `lineHeight`: makes this chip's height DETERMINISTIC (28.5 px) — the neighboring « 100 %
  // local » badge aligns to it (cf. `LOCAL_BADGE`), which requires a known height, not « normal ».
  lineHeight: 1,
  fontWeight: 500,
  fontFamily: 'inherit',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.learnAccent,
  background: 'transparent',
  border: `1px dashed ${NAVY.learnBorder}`,
  borderRadius: '20px',
  padding: '8px 13px',
} as const;
