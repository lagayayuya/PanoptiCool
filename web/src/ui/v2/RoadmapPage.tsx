// « Feuille de route » page (« Feuille de route verticale » / « … Mobile » mockups) — a vertical
// timeline of the project's steps, then a card saying where a hand would help.
//
// THE SPINE IS HERE, THE PROSE IS IN `ui/copy.*`. `ROADMAP_STEPS` below states the ORDER of the
// steps and the STATUS of each one; that is a fact about the project, identical in every language,
// and writing it twice (once per language) would guarantee that one of the two halves keeps
// announcing « en cours » long after the other stopped. The two lists are paired BY INDEX — a
// pairing no type can hold, since `typeof` of an array gives `T[]` and not a tuple. It is held
// by `roadmap.test.ts`, in both languages.
//
// THE COLORS ARE LOCAL AND NOT IN `palette.ts`, on purpose: that file exists to stop an exact
// value repeated ACROSS components from diverging (its own header says so). These tokens are read
// by this component alone, and four of them (the tag backgrounds, the « en cours » card border)
// differ from the nearest NAVY entry by a hundredth of alpha — hoisting them would add
// near-duplicates to the shared palette, which is the opposite of what it is for.

import { UI_BRAND, UI_ROADMAP } from '../copy';
import { GitHubIcon } from './GitHubIcon';
import { NAVY } from './palette';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { useIsMobile } from './useIsMobile';

/** Where a step stands. The words shown for each are prose (`UI_ROADMAP.status*`). */
export type RoadmapStatus = 'done' | 'now' | 'next';

/**
 * THE SPINE — order and status of the steps. Paired by index with `UI_ROADMAP.steps`, whose
 * length must match (net: `roadmap.test.ts`).
 */
export const ROADMAP_STEPS: readonly RoadmapStatus[] = ['done', 'done', 'now', 'next', 'next'];

export function RoadmapPage() {
  const isMobile = useIsMobile();
  const steps = pairSteps();
  const last = steps.length - 1;

  return (
    <div style={PAGE}>
      {/* NO BADGE (yuya's decision): the bar already carries the roadmap link, and the kicker of
          the hero names the page two lines below. Saying it a third time in the bar was noise. */}
      <SiteHeader />

      <div style={isMobile ? M_SHELL : SHELL}>
        <div style={isMobile ? M_HERO : HERO}>
          <span style={isMobile ? M_KICKER : KICKER}>{UI_ROADMAP.kicker}</span>
          <h1 style={isMobile ? M_TITLE : TITLE}>
            {UI_ROADMAP.titleLine1}
            <br />
            {UI_ROADMAP.titleLine2}
          </h1>
          <p style={LEDE}>{UI_ROADMAP.lede}</p>
        </div>

        <ol style={TIMELINE}>
          {steps.map(({ status, prose }, i) => {
            const tone = TONE[status];
            // A rail segment is green when it LEAVES a finished step: the top of a step reads the
            // status of the one above it, the bottom reads its own. The two ends of the list carry
            // no segment — the rail starts at the first dot and stops at the last.
            const lineTop =
              i === 0 ? 'transparent' : steps[i - 1]?.status === 'done' ? LINE_DONE : LINE_FUTURE;
            const lineBottom =
              i === last ? 'transparent' : status === 'done' ? LINE_DONE : LINE_FUTURE;

            const rail = (
              <div style={RAIL}>
                <div style={{ ...(isMobile ? M_RAIL_HEAD : RAIL_HEAD), background: lineTop }} />
                <div
                  style={{
                    ...(isMobile ? M_DOT : DOT),
                    background: tone.dotBg,
                    border: `2px solid ${tone.dotBd}`,
                  }}
                  class={status === 'now' ? 'rm-pulse' : undefined}
                />
                <div style={{ ...RAIL_TAIL, background: lineBottom }} />
              </div>
            );

            const tag = (
              <span
                style={{
                  ...(isMobile ? M_TAG : TAG),
                  color: tone.tagCol,
                  background: tone.tagBg,
                  border: `1px solid ${tone.tagBd}`,
                }}
              >
                {STATUS_LABEL[status]}
              </span>
            );

            // The DATE moves: a left column on desktop (the mockup aligns them on a gutter), on the
            // tag's line on mobile — 390 px cannot carry a gutter AND a readable card.
            return isMobile ? (
              <li key={prose.title} style={M_ROW}>
                {rail}
                <div style={{ ...M_CARD, border: `1px solid ${tone.cardBd}` }}>
                  <div style={M_TAG_ROW}>
                    {tag}
                    <span style={{ ...M_DATE, color: tone.dateCol }}>{prose.date}</span>
                  </div>
                  <span style={M_STEP_TITLE}>{prose.title}</span>
                  <span style={M_STEP_TEXT}>{prose.text}</span>
                </div>
              </li>
            ) : (
              <li key={prose.title} style={ROW}>
                <div style={DATE_COL}>
                  <span style={{ ...DATE, color: tone.dateCol }}>{prose.date}</span>
                </div>
                {rail}
                <div class="rm-card" style={{ ...CARD, border: `1px solid ${tone.cardBd}` }}>
                  {tag}
                  <span style={STEP_TITLE}>{prose.title}</span>
                  <span style={STEP_TEXT}>{prose.text}</span>
                </div>
              </li>
            );
          })}
        </ol>

        <div style={isMobile ? M_HELP : HELP}>
          <div style={HELP_HEAD}>
            <span style={isMobile ? M_KICKER : KICKER}>{UI_ROADMAP.helpKicker}</span>
            <span style={isMobile ? M_HELP_TITLE : HELP_TITLE}>{UI_ROADMAP.helpTitle}</span>
            <span style={HELP_LEDE}>{UI_ROADMAP.helpLede}</span>
          </div>

          <div style={isMobile ? M_HELP_LIST : HELP_LIST}>
            {UI_ROADMAP.helpItems.map((item) => (
              <div key={item} style={isMobile ? M_HELP_ITEM : HELP_ITEM}>
                {/* Decorative dash: `aria-hidden` so a screen reader reads the sentence, not a rule. */}
                <span style={HELP_DASH} aria-hidden="true">
                  —
                </span>
                <span style={HELP_TEXT}>{item}</span>
              </div>
            ))}
          </div>

          <div style={isMobile ? M_HELP_ACTIONS : HELP_ACTIONS}>
            <a
              href={UI_BRAND.githubUrl}
              target="_blank"
              rel="noreferrer"
              class="hv-br"
              style={isMobile ? M_GH_CTA : GH_CTA}
            >
              <GitHubIcon size={isMobile ? 15 : 14} />
              {UI_ROADMAP.helpGithub}
            </a>
            <a
              href={`mailto:${UI_BRAND.contactMail}`}
              class="hv-cy"
              style={isMobile ? M_CONTACT_CTA : CONTACT_CTA}
            >
              {UI_ROADMAP.helpContact}
            </a>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

/**
 * The spine and the prose, paired by index. A prose entry without a status (or the reverse) is
 * DROPPED rather than half-rendered — `roadmap.test.ts` is what forbids the case from arising.
 */
function pairSteps() {
  return ROADMAP_STEPS.map((status, i) => ({ status, prose: UI_ROADMAP.steps[i] })).filter(
    (s): s is { status: RoadmapStatus; prose: (typeof UI_ROADMAP.steps)[number] } =>
      s.prose !== undefined,
  );
}

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  done: UI_ROADMAP.statusDone,
  now: UI_ROADMAP.statusNow,
  next: UI_ROADMAP.statusNext,
};

// --- Status tokens (mockup values, cf. this file's header) --------------------------------------
const LINE_DONE = '#2c6b4a';
const LINE_FUTURE = NAVY.borderInset;

const TONE: Record<
  RoadmapStatus,
  {
    tagCol: string;
    tagBg: string;
    tagBd: string;
    dotBg: string;
    dotBd: string;
    cardBd: string;
    dateCol: string;
  }
> = {
  done: {
    tagCol: NAVY.ok,
    tagBg: 'rgba(74,222,128,.08)',
    tagBd: NAVY.okBorder,
    dotBg: NAVY.ok,
    dotBd: NAVY.ok,
    cardBd: NAVY.borderCard,
    dateCol: NAVY.textDim,
  },
  now: {
    tagCol: NAVY.accent,
    tagBg: 'rgba(47,212,240,.08)',
    tagBd: 'rgba(47,212,240,.35)',
    dotBg: NAVY.bgPage,
    dotBd: NAVY.accent,
    cardBd: 'rgba(47,212,240,.45)',
    dateCol: NAVY.accent,
  },
  next: {
    tagCol: NAVY.learnAccent,
    tagBg: 'rgba(165,180,255,.08)',
    tagBd: 'rgba(165,180,255,.35)',
    dotBg: NAVY.bgPage,
    dotBd: NAVY.learnBorder,
    cardBd: NAVY.borderCard,
    dateCol: NAVY.textDim,
  },
};

// --- Styles (mockup values, NAVY palette) -------------------------------------------------------
const PAGE = {
  minHeight: '100vh',
  background: `linear-gradient(180deg, ${NAVY.bgPageTop} 0%, ${NAVY.bgPage} 340px)`,
  color: NAVY.textBright,
} as const;
// SAME COLUMN AS THE HOME PAGE (1160 px, 40 px gutters — cf. `LandingPage`'s `SHELL`), and not the
// 860 px of the mockup. Two pages of the same site whose content stops at different distances from
// the edge read as two sites: going from one to the other, the whole page slides sideways. What the
// mockup was protecting — a line length one can read — is held instead by `maxWidth` on the hero
// and on the step texts, which is where it belongs.
const SHELL = {
  maxWidth: '1160px',
  margin: '0 auto',
  padding: '64px 40px 90px',
  display: 'flex',
  flexDirection: 'column',
  gap: '56px',
} as const;
const HERO = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxWidth: '680px',
} as const;
const KICKER = {
  fontSize: '11px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const TITLE = {
  margin: 0,
  fontSize: '40px',
  fontWeight: 500,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
} as const;
const LEDE = { margin: 0, fontSize: '13px', lineHeight: 1.8, color: NAVY.textLede } as const;

// The timeline is an ORDERED LIST: the order is the meaning here, and a screen reader announces
// « 3 sur 5 » only for a list. The markers are removed, the rail replaces them visually.
const TIMELINE = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  margin: 0,
  padding: 0,
  listStyle: 'none',
} as const;
const ROW = {
  display: 'grid',
  gridTemplateColumns: '150px 40px 1fr',
  alignItems: 'stretch',
} as const;
const DATE_COL = { display: 'flex', justifyContent: 'flex-end', padding: '22px 18px 0 0' } as const;
const DATE = {
  fontSize: '11px',
  lineHeight: 1.4,
  textAlign: 'right',
  whiteSpace: 'nowrap',
} as const;
const RAIL = { display: 'flex', flexDirection: 'column', alignItems: 'center' } as const;
const RAIL_HEAD = { width: '2px', height: '24px' } as const;
const RAIL_TAIL = { width: '2px', flex: 1 } as const;
const DOT = { width: '16px', height: '16px', borderRadius: '50%', flex: 'none' } as const;
const CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '11px',
  padding: '18px 20px',
  margin: '6px 0 14px',
  background: NAVY.bgCard,
  borderRadius: '12px',
} as const;
const TAG = {
  alignSelf: 'flex-start',
  fontSize: '9.5px',
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  borderRadius: '20px',
  padding: '5px 9px',
} as const;
const STEP_TITLE = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textBright,
} as const;
const STEP_TEXT = { fontSize: '11.5px', lineHeight: 1.7, color: NAVY.textLede } as const;

const HELP = {
  display: 'flex',
  flexDirection: 'column',
  gap: '22px',
  padding: '30px 32px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '12px',
} as const;
const HELP_HEAD = { display: 'flex', flexDirection: 'column', gap: '10px' } as const;
const HELP_TITLE = {
  fontSize: '19px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textBright,
} as const;
// NO `maxWidth` (ex-640 px, of the 860 px mockup): in the widened card the lede broke three lines
// before the items below it, which read as a wrapping bug rather than as a measure.
const HELP_LEDE = { fontSize: '12px', lineHeight: 1.8, color: NAVY.textLede } as const;
const HELP_LIST = { display: 'flex', flexDirection: 'column', gap: '11px' } as const;
const HELP_ITEM = { display: 'flex', gap: '11px', alignItems: 'flex-start' } as const;
const HELP_DASH = {
  fontSize: '11.5px',
  lineHeight: 1.75,
  color: NAVY.textFaint,
  flex: 'none',
} as const;
const HELP_TEXT = { fontSize: '11.5px', lineHeight: 1.75, color: NAVY.textLede } as const;
const HELP_ACTIONS = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
  borderTop: `1px solid ${NAVY.borderCard}`,
  paddingTop: '20px',
} as const;
const GH_CTA = {
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: '0.03em',
  color: NAVY.bgPage,
  background: NAVY.accent,
  borderRadius: '9px',
  padding: '14px 20px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
} as const;
const CONTACT_CTA = {
  fontSize: '11.5px',
  fontWeight: 500,
  lineHeight: 1,
  color: NAVY.textSecondary,
  border: `1px solid ${NAVY.textFaint}`,
  borderRadius: '9px',
  padding: '14px 18px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
} as const;

// --- Mobile variant (« … Mobile » mockup: no date gutter, 48-52 px targets) ---------------------
const M_SHELL = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '32px 20px 56px',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
} as const;
const M_HERO = { display: 'flex', flexDirection: 'column', gap: '14px' } as const;
const M_KICKER = { ...KICKER, fontSize: '10.5px', lineHeight: 1.4 } as const;
const M_TITLE = { ...TITLE, fontSize: '27px', lineHeight: 1.25, textWrap: 'balance' } as const;
const M_ROW = {
  display: 'grid',
  gridTemplateColumns: '16px 1fr',
  columnGap: '14px',
  alignItems: 'stretch',
} as const;
const M_RAIL_HEAD = { width: '2px', height: '20px' } as const;
const M_DOT = { ...DOT, width: '14px', height: '14px' } as const;
const M_CARD = {
  ...CARD,
  gap: '10px',
  padding: '16px 16px 18px',
  margin: '0 0 14px',
} as const;
const M_TAG_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  flexWrap: 'wrap',
} as const;
const M_TAG = { ...TAG, fontSize: '9px' } as const;
const M_DATE = { fontSize: '10.5px', lineHeight: 1, whiteSpace: 'nowrap' } as const;
const M_STEP_TITLE = { ...STEP_TITLE, lineHeight: 1.45 } as const;
const M_STEP_TEXT = { fontSize: '12px', lineHeight: 1.75, color: NAVY.textLede } as const;
const M_HELP = { ...HELP, gap: '20px', padding: '24px 18px' } as const;
const M_HELP_TITLE = { ...HELP_TITLE, fontSize: '17px', textWrap: 'balance' } as const;
const M_HELP_LIST = { ...HELP_LIST, gap: '12px' } as const;
const M_HELP_ITEM = { ...HELP_ITEM, gap: '10px' } as const;
const M_HELP_ACTIONS = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  borderTop: `1px solid ${NAVY.borderCard}`,
  paddingTop: '18px',
} as const;
const M_GH_CTA = {
  ...GH_CTA,
  justifyContent: 'center',
  minHeight: '52px',
  fontSize: '13px',
  lineHeight: 1.3,
  borderRadius: '12px',
  padding: '15px 18px',
  textAlign: 'center',
  whiteSpace: 'normal',
} as const;
const M_CONTACT_CTA = {
  ...CONTACT_CTA,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '48px',
  fontSize: '12.5px',
  lineHeight: 1.3,
  borderRadius: '12px',
  padding: '14px 18px',
  whiteSpace: 'normal',
} as const;
