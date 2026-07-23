// « parcours guidé » results view (« PanoptiCool v4 » mockup, 2026-07-15 rework) — replaces
// `ResultsPage` (which stays served as is on /temp). Four steps, from most factual to most
// interpreted: 01 activity (rhythm + volumes + semantic wall), 02 deductions by theme
// (`ThemeCardNavy`; the findings without a theme become NORMAL cards, `SignalCardNavy`),
// 03 in summary (static mockup content), 04 local AI (`AiSection`, full-width band).
//
// Sections of the old page ABSENT from the mockup, thus REMOVED from here (yuya's decision, rework):
// « ciblage publicitaire » card (adPrivacyGroup), device/network card (deviceNetworkGroup),
// generic `exposedGroup` frame, isolated `absence`/`exposed` cards. The data of the Activity
// panel (PANO-84) and of the semantic wall (opacity) are RE-DISTRIBUTED into section 01 rather than
// removed. The « rester informé » block of the mockup's table of contents (newsletter) is NOT taken.

import type { VNode } from 'preact';
import { useState } from 'preact/hooks';
import type { Analysis } from '../../engine/analysis';
import { UI_LEARN_PANELS, UI_RESULTS } from '../copy';
import { AnalyzableShareCard, RhythmCard, VolumesCard } from './ActivitySection';
import { AiMobileNotice, AiSection } from './AiSection';
import type { AiSource } from './ai-source';
import { EyeLogo } from './EyeLogo';
import { LearnPanel, LearnToggle } from './LearnPanel';
import { NoDeductionCard } from './NoDeductionCard';
import { NAVY } from './palette';
import { buildReuseMap, type Citation } from './reuse';
import {
  CONFIDENCE_RANK,
  distinctEvidenceCount,
  type Level,
  SignalCardNavy,
  ThemeCardNavy,
  themeLevel,
} from './ThemeCardNavy';
import { useIsMobile } from './useIsMobile';

// The DISPLAY of confidence (table-of-contents legend + mobile inline legend) is REMOVED (2026-07-20
// iteration of design v4, user tests): the levels no longer appear anywhere on the
// page, and the « hypothèses, pas un verdict » framing lives in the intro of section 02
// (`sec02Framing`). The engine KEEPS `confidence`, and the RANKING of the cards still reads it
// (`compareCards` below) — it is the display axis that disappears, not the data nor the doctrine.

// The lead/rest DISCLOSURE (FORK 1, option (d)) is REMOVED (yuya's decision, 2026-07-20 retouches): all
// the cards display in sequence, sorted by `compareCards`. What the disclosure protected — eleven
// aligned headers that neutralize each other — is today carried by the cards CLOSED by default:
// a one-line header per card, not eleven open blocks.

/** A card of section 02, ready to render, with the only numbers that rank it.
 *  (No `key` field: the key lives on the `node`, where Preact reads it — one more field here would be
 *  a field nobody reads, exactly what the audit reproaches the old engine for.) */
export interface RankedCard {
  /** `true` = D1 finding (mental health, politics…). Cf. `compareCards`: it is the 1st criterion. */
  sensitive: boolean;
  /** Level displayed by the closed header (theme: the MAX of its findings). */
  level: Level;
  /** DISTINCT evidence — the « M src » of the header. */
  src: number;
  node: VNode;
}

/**
 * THE ORDER, and the argument that holds it. Three criteria, from most decisive to the tiebreak:
 *
 *  1. THE SENSITIVE FIRST — ⚠ OPEN FORK, it is yuya's gate (doctrine), not mine. Kept
 *     here because `Analysis` has ALREADY decided one notch below: `signals` and `themes` are two
 *     separate fields, and the type motivates it — "a sensitive subject is not one interest among
 *     others — mixing them would flatten them". Sorting on confidence alone would RE-MERGE the
 *     two populations the schema keeps disjoint, contradicting that decision from the UI.
 *     What it costs is real and is said: the page can open on « Santé mentale ».
 *  2. DECREASING CONFIDENCE — an axis now INTERNAL (the levels no longer display,
 *     2026-07-20 iteration) but which stays the right reading order: what is at the top is what
 *     the platform would dare the most. And it TRULY discriminates — D1 as D2 emit `low` AND
 *     `medium` (`d1Level`: explicit ⇒ medium; `d2Level`: self-declared or voluminous ⇒ medium).
 *  3. VOLUME OF EVIDENCE — tiebreak ONLY. It cannot be the main criterion: D2 already
 *     uses it for its internal top-5 (`rankInterests`), reusing it here would count the
 *     same thing twice; and it measures what the user TALKS about most, when the page deals with what
 *     is deducible ABOUT them — a subject dropped once can be the finding that matters.
 *
 * At complete equality, the STABLE sort (ES2019+) keeps the engine's order — deterministic, testable.
 *
 * EXPORTED for `ranking.test.ts`: these three criteria are DOCTRINE, and the render golden does
 * not reach them (the persona only produces 4 cards, on which the criterion reproduces the prior
 * order — it would pass identically with a wrong comparator). The witness is therefore a unit test.
 */
export function compareCards(a: RankedCard, b: RankedCard): number {
  if (a.sensitive !== b.sensitive) {
    return a.sensitive ? -1 : 1;
  }
  if (a.level !== b.level) {
    return CONFIDENCE_RANK[b.level] - CONFIDENCE_RANK[a.level];
  }
  return b.src - a.src;
}

/** The cards of section 02, ranked. Both populations enter, the order arranges them. */
function rankedCards(output: Analysis, reuseMap: ReadonlyMap<string, Citation[]>): RankedCard[] {
  const cards: RankedCard[] = output.signals.map((signal, i) => ({
    sensitive: signal.sensitive,
    level: signal.confidence,
    src: distinctEvidenceCount([signal]),
    node: (
      <SignalCardNavy key={`signal-${signal.label}-${i}`} signal={signal} reuseMap={reuseMap} />
    ),
  }));
  for (const theme of output.themes) {
    cards.push({
      // No theme is sensitive: the two populations are disjoint by construction (§2.1).
      sensitive: false,
      // A theme without a finding has no level; it can then assert nothing — so the lowest.
      level: themeLevel(theme.deductions) ?? 'low',
      src: distinctEvidenceCount(theme.deductions),
      node: <ThemeCardNavy key={theme.id} theme={theme} reuseMap={reuseMap} />,
    });
  }
  return cards.sort(compareCards);
}

const TOC = [
  { n: '01', label: UI_RESULTS.tocActivity, href: '#sec-activite' },
  { n: '02', label: UI_RESULTS.tocDeductions, href: '#sec-deductions' },
  { n: '03', label: UI_RESULTS.tocSummary, href: '#sec-resume' },
  { n: '04', label: UI_RESULTS.tocAi, href: '#sec-ia' },
] as const;

// The educational contents and the summary lists live in the interface catalog
// (`ui/copy.ts`) — this view renders them, it no longer writes them.

function SectionHead({
  id,
  n,
  title,
  sub,
  framing,
  learn,
  isMobile,
}: {
  id: string;
  n: string;
  title: string;
  sub?: string;
  /** Optional framing under the subtitle — IN the header (the mockup's tightened gap), not
   * in the section's flow: between the two there would be the inter-block spacing, too large. */
  framing?: VNode;
  learn?: { open: boolean; label: string; onToggle: () => void };
  isMobile?: boolean;
}) {
  // Mobile (« v4 Mobile » mockup): no rule, subtitle without indent, « comprendre » button
  // UNDER the title (align-self flex-start) rather than on the right.
  return (
    <div id={id} style={SEC_HEAD_WRAP}>
      <div style={SEC_HEAD_ROW}>
        <span style={SEC_N}>{n}</span>
        <span style={isMobile ? M_SEC_TITLE : SEC_TITLE}>{title}</span>
        {!isMobile && <span style={SEC_RULE} />}
        {!isMobile && learn !== undefined && (
          <LearnToggle open={learn.open} label={learn.label} onToggle={learn.onToggle} />
        )}
      </div>
      {sub !== undefined && <div style={isMobile ? M_SEC_SUB : SEC_SUB}>{sub}</div>}
      {framing !== undefined && <div style={isMobile ? M_SEC_FRAMING : SEC_FRAMING}>{framing}</div>}
      {isMobile && learn !== undefined && (
        <div style={{ alignSelf: 'flex-start' }}>
          <LearnToggle open={learn.open} label={learn.label} onToggle={learn.onToggle} />
        </div>
      )}
    </div>
  );
}

export function ResultsView({
  output,
  aiSource,
  demo = false,
}: {
  output: Analysis;
  aiSource?: AiSource;
  /** Demo mode (mobile: the header badge has no room — the info moves into the kicker). */
  demo?: boolean;
}) {
  const [learn, setLearn] = useState<Record<string, boolean>>({});
  const toggleLearn = (key: string) => setLearn((l) => ({ ...l, [key]: !l[key] }));
  const isMobile = useIsMobile();

  // Distribution by section — batch A1: there is nothing left to distribute. This view made THREE
  // passes to recover what the engine already knew: `find(kind === 'aggregate')`,
  // `find(kind === 'opacity')`, and `buildPageBlocks` (144 lines of grouping by theme, of
  // dispatch on a `Set` of `ruleId` and of filtering out natures off the mockup). The engine names:
  // `output.rhythm`, `output.opacity`, `output.themes`, `output.signals` — the sort is read, no longer done.
  //
  // Only « aussi exploité par » still requires a computation, because it is a relation BETWEEN findings
  // that none of them carries alone: recomputed here, no longer stored (C5, §5.4).
  const reuseMap = buildReuseMap(output);
  const hasDeductions = output.signals.length > 0 || output.themes.length > 0;

  // All the cards, ranked (`compareCards`), in sequence — no more lead/rest cut (2026-07-20
  // retouches).
  const cards = rankedCards(output, reuseMap);

  // Mobile (« v4 Mobile » mockup): no sidebar (the table of contents lives as chips in the header,
  // cf. SiteHeader/AnalysisPage), hero in a column WITHOUT the eye, confidence legend INLINE under the
  // hero, kicker carrying the demo mention.
  // The demo suffix lives in the kicker ONLY on mobile — on desktop, the header badge already carries
  // the information (no duplicate).
  const kicker = demo && isMobile ? UI_RESULTS.kickerDemo : UI_RESULTS.kicker;

  return (
    <div style={PAGE}>
      <div style={isMobile ? M_SHELL : GRID}>
        {!isMobile && (
          <nav aria-label={UI_RESULTS.tocAriaLabel} style={SIDEBAR}>
            <span style={TOC_TITLE}>{UI_RESULTS.tocTitle}</span>
            {TOC.map((t) => (
              <a key={t.n} href={t.href} class="hv-toc" style={TOC_LINK}>
                <span style={TOC_N}>{t.n}</span>
                {t.label}
              </a>
            ))}
          </nav>
        )}

        <div style={isMobile ? M_CONTENT : CONTENT}>
          {/* --- Hero -------------------------------------------------------------------------- */}
          <div style={isMobile ? M_HERO : HERO}>
            <div style={HERO_COL}>
              <span style={isMobile ? M_KICKER : KICKER}>{kicker}</span>
              <h1 style={isMobile ? M_HERO_TITLE : HERO_TITLE}>
                {UI_RESULTS.heroTitleLine1}
                {!isMobile && <br />}
                {isMobile ? ' ' : ''}
                {UI_RESULTS.heroTitleLine2}
              </h1>
              <p style={isMobile ? M_HERO_LEDE : HERO_LEDE}>{UI_RESULTS.heroLede}</p>
              <p style={isMobile ? M_HERO_SUB : HERO_SUB}>{UI_RESULTS.heroSub}</p>
            </div>
            {!isMobile && (
              <div style={HERO_EYE}>
                <EyeLogo variant="hero" />
              </div>
            )}
          </div>

          {/* --- 01 · Your activity --------------------------------------------------------------- */}
          <SectionHead
            id="sec-activite"
            isMobile={isMobile}
            n="01"
            title={UI_RESULTS.sec01Title}
            sub={UI_RESULTS.sec01Sub}
            learn={{
              open: !!learn.rythme,
              label: UI_RESULTS.sec01LearnLabel,
              onToggle: () => toggleLearn('rythme'),
            }}
          />
          {learn.rythme && (
            <LearnPanel
              question={UI_LEARN_PANELS.rhythm.question}
              columns={UI_LEARN_PANELS.rhythm.columns}
            />
          )}
          {output.rhythm !== undefined && <RhythmCard rhythm={output.rhythm} />}
          <div style={CARDS_ROW}>
            <VolumesCard
              volumes={output.volumes}
              videosWatchedTotal={output.rhythm?.videosWatched.total}
            />
            {output.opacity !== undefined && <AnalyzableShareCard opacity={output.opacity} />}
          </div>

          {/* --- 02 · Deductions by theme --------------------------------------------------------- */}
          <SectionHead
            id="sec-deductions"
            isMobile={isMobile}
            n="02"
            title={UI_RESULTS.sec02Title}
            sub={UI_RESULTS.sec02Sub(
              isMobile ? UI_RESULTS.sec02TapVerbMobile : UI_RESULTS.sec02TapVerbDesktop,
            )}
            framing={
              /* The section's FRAMING: once, in the intro, « hypothèses, jamais un verdict » —
                 in place of the confidence apparatus each card repeated. The two
                 example-words carry the style of what they name (mockup): « surlignage »
                 is highlighted, « principale » has the tint of the main reading. */
              <>
                {UI_RESULTS.sec02FramingLead}
                <span style={FRAMING_HIGHLIGHT}>{UI_RESULTS.sec02FramingHighlightWord}</span>
                {UI_RESULTS.sec02FramingMiddle}
                <span style={FRAMING_PRIMARY}>{UI_RESULTS.sec02FramingPrimaryWord}</span>
                {UI_RESULTS.sec02FramingTail}
              </>
            }
            learn={{
              open: !!learn.deduc,
              label: UI_RESULTS.sec02LearnLabel,
              onToggle: () => toggleLearn('deduc'),
            }}
          />
          {learn.deduc && (
            <LearnPanel
              question={UI_LEARN_PANELS.deductions.question}
              columns={UI_LEARN_PANELS.deductions.columns}
              footnote={UI_LEARN_PANELS.deductions.footnote}
            />
          )}
          {/* The page's order is a STAGING decision: it lives here (`compareCards`),
              no longer in the order of an engine registry. It no longer follows "the signals, then the
              themes" — which was only the composition order of `insights[]` inherited from
              `buildPageBlocks`, never a choice. The sensitive stays at the top, but because a criterion
              says so, and at equal confidence a better-substantiated card comes first. */}
          <div style={THEME_LIST}>
            {cards.map((c) => c.node)}
            {/* « aucune déduction » edge case (CasAucuneDeduction mockups): full card —
                probable reason, asymmetry reminder, raw-text disclosure, lexicon
                enrichment, advice — in place of the old dry paragraph. */}
            {!hasDeductions && <NoDeductionCard aiSource={aiSource} isMobile={isMobile} />}
          </div>

          {/* --- 03 · In summary ------------------------------------------------------------------ */}
          <SectionHead
            id="sec-resume"
            isMobile={isMobile}
            n="03"
            title={UI_RESULTS.sec03Title}
            learn={{
              open: !!learn.marche,
              label: UI_RESULTS.sec03LearnLabel,
              onToggle: () => toggleLearn('marche'),
            }}
          />
          {learn.marche && (
            <LearnPanel
              question={UI_LEARN_PANELS.market.question}
              columns={UI_LEARN_PANELS.market.columns}
            />
          )}
          <div style={SUMMARY_CARD}>
            <div style={SUMMARY_LEDE}>{UI_RESULTS.summaryLede}</div>
            <div style={SUMMARY_COLS}>
              <div style={SUMMARY_COL_LEFT}>
                <div style={SUMMARY_COL_TITLE}>{UI_RESULTS.summaryDataTypesTitle}</div>
                <div style={CHIP_ROW}>
                  {UI_RESULTS.summaryDataTypes.map((t) => (
                    <span key={t} style={DATA_CHIP}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div style={SUMMARY_COL_RIGHT}>
                <div style={SUMMARY_COL_TITLE}>{UI_RESULTS.summaryActorsTitle}</div>
                <div style={TAKEAWAYS}>
                  {UI_RESULTS.summaryActorTakeaways.map((t) => (
                    <div key={t} style={TAKEAWAY_ROW}>
                      <span style={{ color: NAVY.textFaint }}>›</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 04 · Local AI (full-width band) ------------------------------------------------------- */}
      {/* Mobile: local AI requires a computer (llama.cpp) — explanatory callout + decorative
          preview in place of the interactive section (« v4 Mobile » mockup). The callout lives IN
          the content flow (no full-width band). */}
      {aiSource !== undefined &&
        (isMobile ? (
          <div style={M_SHELL_TAIL}>
            <AiMobileNotice />
          </div>
        ) : (
          <AiSection source={aiSource} />
        ))}
    </div>
  );
}

// --- Styles (« parcours guidé » mockup) ------------------------------------------------------------
const PAGE = { display: 'flex', flexDirection: 'column' } as const;
const GRID = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '48px 40px 32px',
  display: 'grid',
  gridTemplateColumns: '210px minmax(0, 1fr)',
  gap: '52px',
  alignItems: 'start',
  width: '100%',
  boxSizing: 'border-box',
} as const;
const SIDEBAR = {
  position: 'sticky',
  top: '78px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
} as const;
const TOC_TITLE = {
  fontSize: '10px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.textMuted,
  padding: '0 12px 8px',
} as const;
const TOC_LINK = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textSecondary,
  textDecoration: 'none',
  borderRadius: '8px',
  padding: '10px 12px',
  border: '1px solid transparent',
} as const;
const TOC_N = { fontSize: '11px', fontWeight: 600, lineHeight: 1, color: NAVY.accent } as const;
const CONTENT = { display: 'flex', flexDirection: 'column', gap: '26px', minWidth: 0 } as const;
const HERO = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(220px, 320px)',
  gap: '40px',
  alignItems: 'center',
  paddingBottom: '28px',
} as const;
const HERO_COL = { display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 } as const;
const HERO_EYE = { minWidth: 0 } as const;
const KICKER = {
  fontSize: '11px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const HERO_TITLE = {
  margin: 0,
  fontSize: '38px',
  fontWeight: 500,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
} as const;
const HERO_LEDE = {
  margin: 0,
  fontSize: '14px',
  lineHeight: 1.8,
  color: NAVY.textBody,
  maxWidth: '560px',
} as const;
const HERO_SUB = {
  margin: 0,
  fontSize: '12px',
  lineHeight: 1.75,
  color: NAVY.textMuted,
  maxWidth: '560px',
} as const;
const SEC_HEAD_WRAP = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  paddingTop: '22px',
} as const;
const SEC_HEAD_ROW = { display: 'flex', alignItems: 'center', gap: '14px' } as const;
const SEC_N = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: '1px solid rgba(47,212,240,.5)',
  fontSize: '12px',
  fontWeight: 600,
  color: NAVY.accent,
  flex: 'none',
} as const;
const SEC_TITLE = {
  fontSize: '17px',
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textBright,
} as const;
const SEC_RULE = { flex: 1, height: '1px', background: NAVY.borderCard } as const;
const SEC_SUB = {
  fontSize: '12px',
  lineHeight: 1.6,
  color: NAVY.textMuted,
  paddingLeft: '44px',
} as const;
// Section 02 framing — same indent as the subtitle, a more discreet tone (mockup).
const SEC_FRAMING = {
  fontSize: '11px',
  lineHeight: 1.7,
  color: NAVY.textFaint,
  paddingLeft: '44px',
  maxWidth: '720px',
} as const;
const M_SEC_FRAMING = { fontSize: '12px', lineHeight: 1.7, color: NAVY.textFaint } as const;
// The two example-words of the framing — same styles as what they designate (mockup):
// the source highlighting (`highlight`), the tint of the main reading.
const FRAMING_HIGHLIGHT = {
  color: NAVY.textBright,
  borderBottom: '1px solid rgba(255,255,255,.45)',
} as const;
const FRAMING_PRIMARY = { color: '#cdb6f0' } as const;
const CARDS_ROW = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  alignItems: 'stretch',
} as const;
const THEME_LIST = { display: 'flex', flexDirection: 'column', gap: '16px' } as const;
const SUMMARY_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '26px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '12px',
} as const;
const SUMMARY_LEDE = {
  fontSize: '13.5px',
  lineHeight: 1.75,
  color: NAVY.textBody,
  maxWidth: '820px',
} as const;
const SUMMARY_COLS = { display: 'flex', gap: '40px', flexWrap: 'wrap' } as const;
const SUMMARY_COL_LEFT = {
  flex: '1 1 240px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '11px',
} as const;
const SUMMARY_COL_RIGHT = {
  flex: '2 1 320px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '11px',
} as const;
const SUMMARY_COL_TITLE = {
  fontSize: '11px',
  lineHeight: 1.3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textMuted,
} as const;
const CHIP_ROW = { display: 'flex', flexWrap: 'wrap', gap: '8px' } as const;
const DATA_CHIP = {
  fontSize: '12px',
  lineHeight: 1.3,
  color: NAVY.textHeading,
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '6px',
  padding: '7px 11px',
} as const;
const TAKEAWAYS = {
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
  fontSize: '12.5px',
  lineHeight: 1.6,
  color: NAVY.textBody,
} as const;
const TAKEAWAY_ROW = { display: 'flex', gap: '10px' } as const;

// --- MOBILE styles (« PanoptiCool v4 Mobile » mockup) ----------------------------------------------
const M_SHELL = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '32px 20px 56px',
  width: '100%',
  boxSizing: 'border-box',
} as const;
// The mobile AI callout lives in the same column as the rest (no full-width band).
const M_SHELL_TAIL = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '0 20px 56px',
  width: '100%',
  boxSizing: 'border-box',
} as const;
const M_CONTENT = { display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 } as const;
const M_HERO = { display: 'flex', flexDirection: 'column', paddingBottom: '8px' } as const;
const M_KICKER = {
  fontSize: '11px',
  lineHeight: 1.4,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const M_HERO_TITLE = {
  margin: 0,
  fontSize: '27px',
  fontWeight: 500,
  lineHeight: 1.25,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
} as const;
const M_HERO_LEDE = {
  margin: 0,
  fontSize: '13.5px',
  lineHeight: 1.75,
  color: NAVY.textBody,
} as const;
const M_HERO_SUB = {
  margin: 0,
  fontSize: '12.5px',
  lineHeight: 1.7,
  color: NAVY.textMuted,
} as const;
const M_SEC_TITLE = {
  fontSize: '15.5px',
  fontWeight: 500,
  lineHeight: 1.35,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: NAVY.textBright,
} as const;
const M_SEC_SUB = { fontSize: '12.5px', lineHeight: 1.65, color: NAVY.textMuted } as const;
