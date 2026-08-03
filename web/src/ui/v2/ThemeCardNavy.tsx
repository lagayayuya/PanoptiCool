// « navy » theme card (« ThemeCardNavy » mockup, 2026-07-15 rework; 2026-07-20 iteration) —
// replaces `ThemeCard` (PANO-56) on the new journey. Same semantics as before, new
// styling:
//   - CLOSED header: name + « sensible » badge + « N sources » — and NOTHING else. The 3 confidence
//     bullets and their label (« confiance moyenne / incertaine ») are REMOVED (2026-07-20
//     iteration, user tests): the framing lives in the intro of section 02
//     (`UI_RESULTS.sec02Framing`), no longer card by card. The engine KEEPS `confidence` — the
//     ranking (`compareCards`, `themeLevel`) reads the same level as before;
//   - open: inferences (dot + claim), evidence grouped by fan (primary/secondary or
//     equivalent readings), source text with HIGHLIGHTING of the trigger words
//     (`triggerTerms`, ADR-0003 — first real consumption of the field), « aussi exploité
//     par » line, usage block (orange).
//
// NO blur/« contenu masqué » (yuya's decision, 2026-07-15 rework): the « sensible » badge is enough
// to signal the nature of the content; the opening gesture stays the same as for the other cards.
//
// `SignalCardNavy` (yuya's decision, rework): the isolated sensitive findings (D1) are
// COLLAPSIBLE cards like the themes, with a « mot » header (not the claim sentence) + « sensible » badge.
//
// BATCH A1/A3 — WHAT THIS FILE NO LONGER DOES. It no longer reads the engine, it renders a named value:
//   - the « sensible » badge read `theme.sensitive` (always `false`) on themes and
//     `insight.sensitivity !== undefined` (always `3`) on signals: TWO degenerate axes for
//     a binary distinction. It is now the discriminant `deduction.sensitive` (§2.1);
//   - a signal's header was recovered by INVERTING `D1_TEMPLATE_IDS` (templateId → label): the
//     engine NAMES (`Signal.label`), there is nothing left to invert — nor the defensive fallback that went
//     with it (the type guarantees the name);
//   - no more `renderTemplate`/`actorLabel`: `Analysis` carries the TEXTS (batch A2);
//   - no more `resolved[index]` (parallel array aligned on `insights[]`): each finding carries
//     its evidence; only « aussi exploité par » is recomputed (`reuse.ts`).

import { Fragment } from 'preact';
import { useState } from 'preact/hooks';
import type {
  AnalysisTheme,
  Deduction,
  Evidence,
  ReadingFan,
  Signal,
  ThemeUsageLine,
} from '../../engine/analysis';
import { UI_CARD } from '../copy';
import { splitTriggerTerms } from './highlight';
import { NAVY } from './palette';
import { type Citation, evidenceKey, reuseLabel } from './reuse';

/** The union of levels stays defined HERE even though no label displays it anymore (2026-07-20
 * iteration): `compareCards` and `themeLevel` still rank on it — it is sorting data,
 * no longer display data. */
export type Level = 'low' | 'medium' | 'high';

/** Source category displayed at the top of an evidence card. Keyed on the CHANNEL of the evidence (`comment` /
 * `search`) — the evidence carries its channel as data, we no longer derive the label from the last segment
 * of a section path (`SectionRef.path`, removed with the store). Closed union ⇒ exhaustiveness
 * held by the compiler, and the fallback to the raw segment no longer has a reason to be. */
const SOURCE_KIND_LABEL: Record<Evidence['channel'], string> = {
  search: UI_CARD.channelSearch,
  comment: UI_CARD.channelComment,
};

function sourceKindLabel(channel: Evidence['channel']): string {
  return SOURCE_KIND_LABEL[channel];
}

// --- Reading fan (above the sources it interprets, mockup) ---------------------------------------

/**
 * The fan renders ALL the readings it is given, in both modes.
 *
 * The `equal` mode rendered exactly TWO of them — `readings[0]`, a separator, `readings[1]` — and
 * lost the rest silently. The five topical lexicons carry three: the third
 * never appeared on a broad finding. How many readings a label should carry is a
 * catalog decision; rendering fewer than one receives is not one, it is a loss of
 * data. The `≡` separator is therefore interleaved BETWEEN the readings rather than coded once, and the
 * render follows the array's real length.
 */
function FanView({ fan }: { fan: ReadingFan }) {
  // No more title above the fan (2026-07-20 iteration): the intro of section 02
  // explains once and for all what these readings are — repeating it on each group was
  // noise. The `equal` mode is read by the `≡`, the `ranked` mode by its primary/secondary labels.
  if (fan.mode === 'equal') {
    return (
      <div style={FAN}>
        <div style={FAN_EQUAL_ROW}>
          {fan.readings.map((reading, i) => (
            <Fragment key={reading}>
              {i > 0 && <span style={FAN_EQUAL_SEP}>≡</span>}
              <span style={CHIP_EQUAL}>{reading}</span>
            </Fragment>
          ))}
        </div>
      </div>
    );
  }
  const [main, ...rest] = fan.readings;
  // `ranked` = "the 1st dominates, the others are alternatives of the SAME rank": they thus spread
  // under ONE single « secondaire » label, not one per chip. Repeating « SECONDAIRE » above
  // each alternative suggested a gradation between them that does not exist (flagged by
  // yuya: two « SECONDARY » in a row). All the readings stay rendered (fan-readings.test).
  return (
    <div style={FAN}>
      <div style={FAN_RANKED_ROW}>
        {main !== undefined && (
          <div style={RANKED_COL}>
            <span style={RANKED_LABEL_MAIN}>{UI_CARD.fanMain}</span>
            <span style={CHIP_MAIN}>{main}</span>
          </div>
        )}
        {rest.length > 0 && (
          <div style={RANKED_COL}>
            <span style={RANKED_LABEL_SEC}>{UI_CARD.fanSecondary}</span>
            <div style={SEC_CHIPS}>
              {rest.map((r) => (
                <span key={r} style={CHIP_SEC}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Card of an evidence source -------------------------------------------------------------------

function SourceCard({ ev, reuse }: { ev: Evidence; reuse: string | null }) {
  const parts = splitTriggerTerms(ev.text, ev.triggerTerms);
  return (
    <div style={SRC_CARD}>
      <div style={SRC_HEAD}>
        <span style={SRC_KIND}>{sourceKindLabel(ev.channel)}</span>
        <span style={HEAD_SPACER} />
        {reuse !== null && <span style={SRC_SHARED}>{UI_CARD.sourceReused}</span>}
      </div>
      <div style={SRC_TEXT}>
        «{' '}
        {parts.map((p, i) => (
          <span key={`${i}-${p.text}`} style={p.marked ? MARK_ON : undefined}>
            {p.text}
          </span>
        ))}{' '}
        »
      </div>
      {reuse !== null && (
        <div style={SRC_REUSE}>
          {UI_CARD.sourceReuseLead}
          <span style={{ color: NAVY.textBright }}>{reuse}</span>
        </div>
      )}
    </div>
  );
}

// --- Fan + sources grouping (same consecutive logic as `EvidenceDepli`, PANO-57) -----------------

type RenderGroup =
  | { kind: 'fan'; fan: ReadingFan; items: Evidence[] }
  | { kind: 'plain'; item: Evidence };

/** Two fans are "the same" if they order the same readings the same way. The comparison is
 *  now a STRING equality: a reading used to be a `TemplateRef`, whose equality required
 *  comparing the id AND the params via `JSON.stringify` — a reading never took a param. */
function fansEqual(a: ReadingFan, b: ReadingFan): boolean {
  return (
    a.mode === b.mode &&
    a.readings.length === b.readings.length &&
    a.readings.every((r, i) => r === b.readings[i])
  );
}

function groupConsecutiveFans(evidence: readonly Evidence[]): RenderGroup[] {
  const groups: RenderGroup[] = [];
  for (const ev of evidence) {
    if (ev.readings === undefined) {
      groups.push({ kind: 'plain', item: ev });
      continue;
    }
    const last = groups[groups.length - 1];
    if (last?.kind === 'fan' && fansEqual(last.fan, ev.readings)) {
      last.items.push(ev);
    } else {
      groups.push({ kind: 'fan', fan: ev.readings, items: [ev] });
    }
  }
  return groups;
}

function EvidenceList({
  deduction,
  reuseMap,
  currentThemeLabel,
}: {
  deduction: Deduction;
  reuseMap: ReadonlyMap<string, Citation[]>;
  currentThemeLabel?: string | undefined;
}) {
  const evidence = deduction.evidence;
  if (evidence.length === 0) {
    return null;
  }
  const reuseOf = (ev: Evidence) => reuseLabel(reuseMap, ev, deduction, currentThemeLabel);
  return (
    <div style={EV_BLOCK}>
      {groupConsecutiveFans(evidence).map((group, gi) =>
        group.kind === 'fan' ? (
          <div key={group.items[0] ? evidenceKey(group.items[0]) : gi} style={EV_GROUP}>
            <FanView fan={group.fan} />
            <div style={EV_FAN_SOURCES}>
              {group.items.map((ev) => (
                <SourceCard key={evidenceKey(ev)} ev={ev} reuse={reuseOf(ev)} />
              ))}
            </div>
          </div>
        ) : (
          <div key={evidenceKey(group.item)} style={EV_GROUP}>
            <SourceCard ev={group.item} reuse={reuseOf(group.item)} />
          </div>
        ),
      )}
    </div>
  );
}

// --- Rendering of an inference (dot + claim + level + evidence) -----------------------------------

function InferenceView({
  deduction,
  reuseMap,
  currentThemeLabel,
}: {
  deduction: Deduction;
  reuseMap: ReadonlyMap<string, Citation[]>;
  currentThemeLabel?: string | undefined;
}) {
  // UNIFORMIZED title (2026-07-20 mockup retouch): each inference opens on a
  // dot + title line. When the evidence carries a fan, the title is « Lectures
  // pertinentes. » — the fan IS the reading, repeating the claim above was a duplicate. Without
  // a fan, the claim; and without claim or fan, the line says so rather than disappearing.
  const hasFan = deduction.evidence.some((ev) => ev.readings !== undefined);
  const heading = hasFan
    ? UI_CARD.readingsHeading
    : (deduction.claim ?? UI_CARD.readingsHeadingNone);
  return (
    <div style={INF}>
      <div style={INF_HEAD}>
        <div style={{ ...INF_DOT, background: NAVY.accent }} />
        <div style={INF_LABEL}>{heading}</div>
      </div>
      <div style={INF_BODY}>
        <EvidenceList
          deduction={deduction}
          reuseMap={reuseMap}
          currentThemeLabel={currentThemeLabel}
        />
      </div>
    </div>
  );
}

// --- Usage block (« ce qui peut en être fait ») ---------------------------------------------------

function UsageBlock({ usage }: { usage: readonly ThemeUsageLine[] }) {
  return (
    <div style={USAGE}>
      <div style={USAGE_HEAD}>
        <span aria-hidden="true" style={{ color: NAVY.risk, fontSize: '15px', lineHeight: 1 }}>
          ▲
        </span>
        <span style={USAGE_TITLE}>{UI_CARD.usageTitle}</span>
      </div>
      <div style={USAGE_LIST}>
        {usage.map((u, i) => (
          <div key={`${u.actor}-${i}`} style={USAGE_ROW}>
            <span style={USAGE_ACTOR}>{u.actor}</span>
            <span style={USAGE_TEXT}>{u.usage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- THEME card -----------------------------------------------------------------------------------

export const CONFIDENCE_RANK: Record<Level, number> = { low: 0, medium: 1, high: 2 };

/** Aggregated level of a theme (CLOSED header): the MAX of its findings — the most asserted reading
 * the platform would dare for this theme. (Ex-`themeConfidenceLevel` of `grouping.ts`: no more `state` to discriminate,
 * every finding carries a level.)
 *
 * EXPORTED from the "hierarchy" pass: `ResultsView` ranks the cards on THIS level — the one the
 * header displays. The sort and the bullets read the same number; a card cannot be ranked
 * high while displaying low. */
export function themeLevel(deductions: readonly Deduction[]): Level | undefined {
  let best: Level | undefined;
  for (const d of deductions) {
    if (best === undefined || CONFIDENCE_RANK[d.confidence] > CONFIDENCE_RANK[best]) {
      best = d.confidence;
    }
  }
  return best;
}

/** Number of DISTINCT pieces of evidence of a theme (« src » count), all findings combined — a same
 * shared crumb (C5) counts only once. Ex-`themeEvidenceCount`, keyed on the pair.
 * EXPORTED: it is the « M src » of the header, and the tiebreaker of `ResultsView`'s sort (same number). */
export function distinctEvidenceCount(deductions: readonly Deduction[]): number {
  const keys = new Set<string>();
  for (const d of deductions) {
    for (const e of d.evidence) {
      keys.add(evidenceKey(e));
    }
  }
  return keys.size;
}

export function ThemeCardNavy({
  theme,
  reuseMap,
}: {
  theme: AnalysisTheme;
  reuseMap: ReadonlyMap<string, Citation[]>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article class="hl-card" style={CARD}>
      <button type="button" style={HEAD_BTN} aria-expanded={open} onClick={() => setOpen(!open)}>
        <div style={HEAD_TOP}>
          <div style={HEAD_NAME_ROW}>
            <span style={NAME}>{theme.label}</span>
            {/* No « sensible » badge on a theme: the two populations are disjoint by
                construction (§2.1) — the badge lives on `SignalCardNavy`. The ex-`theme.sensitive`
                was never `true`; the type now says so, rather than a dead condition. */}
          </div>
          <span style={HEAD_SPACER} />
          <span style={HEAD_META}>
            {UI_CARD.headSources(distinctEvidenceCount(theme.deductions))}
          </span>
          <span style={HEAD_CARET} aria-hidden="true">
            {open ? UI_CARD.caretOpen : UI_CARD.caretClosed}
          </span>
        </div>
      </button>
      {open && (
        <div style={BODY}>
          {theme.deductions.map((deduction, i) => (
            <InferenceView
              key={`${theme.id}-${i}`}
              deduction={deduction}
              reuseMap={reuseMap}
              currentThemeLabel={theme.label}
            />
          ))}
          {theme.usage.length > 0 && <UsageBlock usage={theme.usage} />}
        </div>
      )}
    </article>
  );
}

// --- SIGNAL card without a theme (sensitive D1: PANO-71) ------------------------------------------
// 2026-07-15 rework (yuya's decisions): rendered like the theme cards — collapsible, header with a short
// WORD (not the claim sentence, which created a dissonance with the themes) + « sensible » badge,
// claim sentence revealed on opening. NO blur: the « sensible » badge is enough.
//
// Batch A1: the 3 apparatuses this block carried have disappeared, without a single pixel moving —
//   - `SENSITIVE_LABEL_WORD` (table of short words) → `wording.ts`: it is prose, it lives
//     in THE wording file;
//   - `LABEL_BY_CLAIM_TEMPLATE_ID` (inverse of the D1 allowlist, rebuilt at each load to
//     recover the label from the claim) → the engine NAMES: `signal.label`;
//   - the `word === null` fallback → it covered the "claim not resolved to a label" case; `Signal.label`
//     being required, that case no longer arises. One fewer fallback, because one more type.

export function SignalCardNavy({
  signal,
  reuseMap,
}: {
  signal: Signal;
  reuseMap: ReadonlyMap<string, Citation[]>;
}) {
  const [open, setOpen] = useState(false);
  const srcCount = new Set(signal.evidence.map(evidenceKey)).size;

  return (
    <article class="hl-card" style={CARD}>
      <button type="button" style={HEAD_BTN} aria-expanded={open} onClick={() => setOpen(!open)}>
        <div style={HEAD_TOP}>
          <div style={HEAD_NAME_ROW}>
            <span style={NAME}>{signal.label}</span>
            {signal.sensitive && <span style={SENSIBLE_TAG}>{UI_CARD.sensitiveTag}</span>}
          </div>
          <span style={HEAD_SPACER} />
          <span style={HEAD_META}>{UI_CARD.headSources(srcCount)}</span>
          <span style={HEAD_CARET} aria-hidden="true">
            {open ? UI_CARD.caretOpen : UI_CARD.caretClosed}
          </span>
        </div>
      </button>
      {open && (
        <div style={BODY}>
          <InferenceView deduction={signal} reuseMap={reuseMap} />
        </div>
      )}
    </article>
  );
}

// --- Styles (« ThemeCardV5 » mockup) --------------------------------------------------------------
// THE CARD IS WHERE v5 CHANGES THE MOST, and it is the one that needed it: v4 set its labels at
// 7.5–10.5 px in uppercase with tracking — « LECTURE PRINCIPALE », « RECHERCHE », « RECOUPÉ ». At
// that size uppercase micro-type reads as decoration, and the reader skips to the quoted sentence
// without ever learning what frames it. v5 sets the same words in plain 13–15 px sentence case.
// Nothing was removed; the apparatus simply became readable, which is the whole point of a card
// whose job is to show WHY a deduction was made.
//
// The padding NO LONGER LIVES on the card but on its children (header button + body). Reason: the
// card has the padding, but the toggle-click is on the BUTTON it contains. A click in the padding
// ring therefore fell on the `<article>` (without `onClick`), not on the button. The
// catch-up attempt via negative margins + `calc(100% + 32px)` FAILED in flex-column (the flex layout
// does not extend the clickable box as the block model would — measured, flagged by yuya). By
// carrying the padding on the button itself, its REAL box — thus its clickable area — covers the whole
// width and the whole height of the header, ring included. No more trick.
const CARD = {
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
} as const;
const HEAD_BTN = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  boxSizing: 'border-box',
  width: '100%',
  padding: '24px 26px',
  textAlign: 'left',
  fontFamily: 'inherit',
  color: 'inherit',
} as const;
const HEAD_TOP = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  flexWrap: 'wrap',
} as const;
const HEAD_NAME_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  flexWrap: 'wrap',
  minWidth: 0,
} as const;
const NAME = {
  fontSize: '22px',
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: '#ffffff',
} as const;
// ⚠ THE « SENSIBLE » BADGE TURNS ORANGE. v4 set it in the same grey as the rest of the header,
// where it read as one more metadata chip; v5 gives it the risk accent the page uses nowhere else
// on a card. It is the one label that changes how the card underneath should be read — ADR-0003 is
// exactly about not letting that pass unmarked — so it is now the only coloured thing in the row.
const SENSIBLE_TAG = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.2,
  color: '#e8a184',
  border: '1px solid rgba(232,117,78,.45)',
  borderRadius: '20px',
  padding: '6px 12px',
} as const;
const HEAD_SPACER = { flex: 1 } as const;
const HEAD_META = {
  fontSize: '15px',
  lineHeight: 1.3,
  color: NAVY.textBody,
  whiteSpace: 'nowrap',
} as const;
/** The open/closed marker. v4 had none — the header was a button that looked like a title, and
 *  nothing said it could be opened until the cursor happened to cross it. */
const HEAD_CARET = { fontSize: '13px', lineHeight: 1, color: NAVY.accent } as const;
// The body carries its own inset (the card no longer has padding). Horizontal and bottom margin
// aligned on the header's 26 px, so the separator runs along the body rather than the card.
const BODY = {
  margin: '0 26px 26px',
  borderTop: `1px solid ${NAVY.borderHeader}`,
  paddingTop: '22px',
  display: 'flex',
  flexDirection: 'column',
  gap: '26px',
} as const;
const INF = { display: 'flex', flexDirection: 'column', gap: '16px' } as const;
const INF_HEAD = { display: 'flex', gap: '12px', alignItems: 'flex-start' } as const;
const INF_DOT = {
  marginTop: '8px',
  width: '9px',
  height: '9px',
  borderRadius: '50%',
  flex: 'none',
} as const;
const INF_LABEL = {
  flex: 1,
  minWidth: 0,
  fontSize: '17px',
  fontWeight: 500,
  lineHeight: 1.6,
  color: '#ffffff',
} as const;
// 21 px = the dot's 9 px + the 12 px gap: the evidence hangs under the claim, not under the bullet.
const INF_BODY = { marginLeft: '21px', display: 'flex', flexDirection: 'column' } as const;
const EV_BLOCK = { display: 'flex', flexDirection: 'column' } as const;
const EV_GROUP = {
  marginTop: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
} as const;
const EV_FAN_SOURCES = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  borderLeft: `2px solid ${NAVY.borderInset}`,
  paddingLeft: '16px',
} as const;
const FAN = { display: 'flex', flexDirection: 'column', gap: '14px' } as const;
const FAN_RANKED_ROW = { display: 'flex', flexWrap: 'wrap', gap: '12px' } as const;
const RANKED_COL = { display: 'flex', flexDirection: 'column', gap: '7px' } as const;
// The « secondaires » alternatives align in a row under their single label.
const SEC_CHIPS = { display: 'flex', flexWrap: 'wrap', gap: '12px' } as const;
const RANKED_LABEL_MAIN = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1,
  color: NAVY.readingPrimaryLabel,
} as const;
const RANKED_LABEL_SEC = { ...RANKED_LABEL_MAIN, color: NAVY.textMuted } as const;
const CHIP_BASE = {
  fontSize: '15px',
  lineHeight: 1.3,
  borderRadius: '11px',
  padding: '11px 14px',
} as const;
const CHIP_MAIN = {
  ...CHIP_BASE,
  fontWeight: 500,
  color: NAVY.readingPrimaryText,
  background: NAVY.readingPrimaryBg,
  border: `1px solid ${NAVY.readingPrimaryBorder}`,
} as const;
const CHIP_SEC = {
  ...CHIP_BASE,
  color: NAVY.textBody,
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
} as const;
const CHIP_EQUAL = {
  ...CHIP_BASE,
  color: NAVY.textHeading,
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
} as const;
const FAN_EQUAL_ROW = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
} as const;
const FAN_EQUAL_SEP = { fontSize: '16px', lineHeight: 1, color: NAVY.textMuted } as const;
const SRC_CARD = {
  padding: '16px 18px',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
} as const;
const SRC_HEAD = { display: 'flex', alignItems: 'center', gap: '12px' } as const;
const SRC_KIND = { fontSize: '14px', lineHeight: 1, color: NAVY.textMuted } as const;
const SRC_SHARED = {
  fontSize: '13px',
  lineHeight: 1.2,
  color: NAVY.textHeading,
  border: `1px solid ${NAVY.borderPill}`,
  borderRadius: '20px',
  padding: '5px 11px',
} as const;
const SRC_TEXT = { fontSize: '15px', lineHeight: 1.7, color: NAVY.textHeading } as const;
const MARK_ON = {
  color: '#ffffff',
  background: 'rgba(255,255,255,.10)',
  borderBottom: '1px solid rgba(255,255,255,.45)',
  borderRadius: '3px',
  padding: '1px 3px',
  fontWeight: 600,
} as const;
const SRC_REUSE = { fontSize: '14px', lineHeight: 1.5, color: NAVY.textMuted } as const;
const USAGE = {
  border: '1px solid rgba(232,117,78,.35)',
  background: 'rgba(232,117,78,.06)',
  borderRadius: '16px',
  padding: '20px 22px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
} as const;
const USAGE_HEAD = { display: 'flex', alignItems: 'center', gap: '10px' } as const;
const USAGE_TITLE = {
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.3,
  color: '#e8a184',
} as const;
const USAGE_LIST = { display: 'flex', flexDirection: 'column' } as const;
// v5 RULES BETWEEN THE ROWS instead of spacing them. Each row is « qui » / « ce qu'il en fait »,
// and the actor column is a real grid track: at 15 px the old fixed 104 px column truncated
// « courtiers de données » on the first wrap.
const USAGE_ROW = {
  display: 'grid',
  gridTemplateColumns: 'minmax(120px, 180px) minmax(0, 1fr)',
  gap: '18px',
  alignItems: 'baseline',
  padding: '12px 0',
  borderTop: '1px solid rgba(232,117,78,.2)',
} as const;
const USAGE_ACTOR = {
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.riskText,
} as const;
const USAGE_TEXT = {
  minWidth: 0,
  fontSize: '15px',
  lineHeight: 1.55,
  color: NAVY.textBody,
} as const;
