// Sticky site bar (« Accueil v4 » / « PanoptiCool v5 Web » mockups + Mobile variants):
// eye + wordmark, optional contextual badge, roadmap link, language selector and GitHub link. The
// badge's TEXT is not quoted here on purpose: it lives in `UI_ANALYSE.badge*`, and a comment
// repeating it would be false the day it is ratified differently — as happened on 2026-08-03.
// On MOBILE (« … Mobile » mockups): tightened paddings, touch targets ≥ 44 px, roadmap and GitHub
// as icons only, badge hidden (no room at 390 px — the demo mention moves into the hero's kicker,
// which is why that kicker survives on mobile alone), and an optional TABLE OF CONTENTS as
// horizontal scrollable chips under the bar (the journey has no sidebar on mobile).
//
// THE LANGUAGE SELECTOR IS ALWAYS VISIBLE, including when a single language is published.
// This is deliberate and it costs an inert button: it ANNOUNCES that the site has a notion of language.
// On the day a banner suggests English to whoever arrives with `navigator.language: en`, that
// suggestion must be CORRECTABLE with a visible gesture — a product that tells someone what it has
// deduced of them must leave them the control over that deduction, on pain of demonstrating the problem
// it denounces. A selector that only appeared once English was ready would leave that gesture
// without a place.
//
// A declared but unpublished language stays INERT (« bientôt disponible » tooltip): it is
// seen, it is not clicked. The active state is read from the page (`<html lang>`), and is stored
// nowhere — persistence will come with the suggestion banner, not before.

import { currentLocale, currentPath, localeHref } from '../../i18n/current';
import { isPublished, LOCALES, type Locale, localePath } from '../../i18n/locales';
import { UI_BRAND, UI_HEADER } from '../copy';
import { EyeLogo } from './EyeLogo';
import { GitHubIcon } from './GitHubIcon';
import { NAVY } from './palette';
import { useIsMobile } from './useIsMobile';

const GITHUB_URL = UI_BRAND.githubUrl;

/** The roadmap page, reachable from every page of the site. Path WITHOUT language — `localeHref`
 * prefixes it. It is the same slug in both languages, like `/tiktok` and `/mentions-legales`. */
const ROADMAP_PATH = '/feuille-de-route';

/** Mobile table-of-contents entry (chips under the bar). `muted`: section unavailable on mobile
 * (local AI) — dotted chip, dimmed text, but the link stays (the callout explains why). */
export interface TocChip {
  n: string;
  label: string;
  href: string;
  muted?: boolean;
}

/** Roadmap glyph: the timeline of the page it opens — a rail, three stations, the last one hollow. */
function RoadmapIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <path d="M4 2.5v11" />
      <circle cx="4" cy="3.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="8" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12.5" r="1.4" />
      <path d="M7.5 3.5h6M7.5 8h4.5M7.5 12.5h5" />
    </svg>
  );
}

export function SiteHeader({ badge, toc }: { badge?: string; toc?: readonly TocChip[] }) {
  const isMobile = useIsMobile();

  const active = currentLocale();
  const here = currentPath();
  const langGroup = (
    // biome-ignore lint/a11y/useSemanticElements: a <fieldset> would impose its form chrome — two controls suffice (mockup markup).
    <div
      role="group"
      aria-label={UI_HEADER.langGroupAriaLabel}
      style={isMobile ? M_LANG_GROUP : LANG_GROUP}
    >
      {LOCALES.map((locale) => {
        const label = LANG_LABEL[locale];
        const on = isMobile ? M_LANG_ON : LANG_ON;
        const off = isMobile ? M_LANG_OFF : LANG_OFF;
        if (locale === active) {
          return (
            <button key={locale} type="button" class="hv-br" style={on} aria-current="true">
              {label}
            </button>
          );
        }
        // Published: a real link to THE SAME page. Unpublished: a dead button that says so.
        return isPublished(locale) ? (
          <a
            key={locale}
            href={localePath(locale, here)}
            class="hv-br"
            style={{ ...off, ...LANG_LINK }}
          >
            {label}
          </a>
        ) : (
          <button
            key={locale}
            type="button"
            style={off}
            title={UI_HEADER.langUnavailableTitle}
            aria-disabled="true"
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  if (isMobile) {
    return (
      <div style={M_WRAP}>
        <div style={M_ROW}>
          <a href={localeHref('/')} style={M_LOGO_CROP} aria-label={UI_HEADER.homeAriaLabel}>
            <img src="/logo.png" alt={UI_HEADER.logoAlt} style={M_LOGO_IMG} />
          </a>
          <a href={localeHref('/')} style={M_WORDMARK}>
            {UI_HEADER.wordmark}
          </a>
          <span style={{ flex: 1 }} />
          <a
            href={localeHref(ROADMAP_PATH)}
            aria-label={UI_HEADER.roadmapLabel}
            class="hv-cy"
            style={M_ICON_LINK}
          >
            <RoadmapIcon size={17} />
          </a>
          {langGroup}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={UI_HEADER.githubAriaLabel}
            class="hv-cy"
            style={M_ICON_LINK}
          >
            <GitHubIcon size={17} />
          </a>
        </div>
        {toc !== undefined && (
          <nav aria-label={UI_HEADER.tocAriaLabel} style={M_TOC}>
            {toc.map((t) => (
              <a key={t.n} href={t.href} class="hv-toc" style={t.muted ? M_CHIP_MUTED : M_CHIP}>
                <span style={{ ...M_CHIP_N, color: t.muted ? NAVY.textDim : NAVY.accent }}>
                  {t.n}
                </span>
                {t.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    );
  }

  return (
    <div style={BAR}>
      <a href={localeHref('/')} style={LOGO_LINK} aria-label={UI_HEADER.homeAriaLabel}>
        <EyeLogo variant="header" />
      </a>
      <a href={localeHref('/')} style={WORDMARK}>
        {UI_HEADER.wordmark}
      </a>
      {badge !== undefined && <span style={BADGE}>{badge}</span>}
      <span style={{ flex: 1 }} />
      {/* NO ICON on desktop (yuya's decision): the label says it, and the glyph next to the
          framed GitHub button made the bar's right side read as three competing controls. */}
      <a href={localeHref(ROADMAP_PATH)} class="hv-cy" style={NAV_LINK}>
        {UI_HEADER.roadmapLabel}
      </a>
      {langGroup}
      <a href={GITHUB_URL} target="_blank" rel="noreferrer" class="hv-cy" style={GH_LINK}>
        <GitHubIcon size={13} />
        {UI_HEADER.githubLabel}
      </a>
    </div>
  );
}

const BAR = {
  position: 'sticky',
  top: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 32px',
  background: 'rgba(7,11,24,.82)',
  backdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${NAVY.borderHeader}`,
} as const;
const LOGO_LINK = { display: 'flex', textDecoration: 'none' } as const;
const WORDMARK = {
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  color: NAVY.textBright,
  textDecoration: 'none',
} as const;
const BADGE = {
  fontSize: '9.5px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY.textMuted,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '20px',
  padding: '5px 10px',
  marginLeft: '4px',
  whiteSpace: 'nowrap',
} as const;
/** The label of each language — a code, not prose: it does not translate from one language to
 * the other (« FR » stays « FR » on the English site). The strings live in the catalog. */
const LANG_LABEL: Record<Locale, string> = { fr: UI_HEADER.langFr, en: UI_HEADER.langEn };

const LANG_GROUP = {
  display: 'flex',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '8px',
  overflow: 'hidden',
} as const;
const LANG_BASE = {
  cursor: 'pointer',
  fontSize: '10px',
  fontWeight: 600,
  fontFamily: 'inherit',
  border: 'none',
  padding: '9px 11px',
} as const;
const LANG_ON = { ...LANG_BASE, color: NAVY.bgPage, background: NAVY.accent } as const;
/** What an <a> needs to sit in the group as a <button> does: neither underline,
 * nor a shifted baseline. The dimensions (size, padding) stay those of `LANG_BASE`. */
const LANG_LINK = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  cursor: 'pointer',
} as const;
const LANG_OFF = {
  ...LANG_BASE,
  color: NAVY.textMuted,
  background: 'transparent',
  cursor: 'default',
} as const;
const GH_LINK = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.04em',
  color: NAVY.textSecondary,
  textDecoration: 'none',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '7px',
  padding: '9px 13px',
} as const;
/** Roadmap link — same shape as the GitHub link, BORDERLESS: two framed buttons side by side would
 * read as a pair of equals, when one leaves the site and the other does not. */
const NAV_LINK = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.04em',
  color: NAVY.textSecondary,
  textDecoration: 'none',
  border: '1px solid transparent',
  borderRadius: '7px',
  padding: '9px 11px',
} as const;

// --- Mobile variant (« … Mobile » mockups: 44 px targets, GitHub icon only) ------------------------
const M_WRAP = {
  position: 'sticky',
  top: 0,
  zIndex: 50,
  background: 'rgba(7,11,24,.88)',
  backdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${NAVY.borderHeader}`,
} as const;
// The bar's background covers the full width (M_WRAP), but the CONTENT aligns on the
// 480 px column of the rest of the page (M_SHELL) — otherwise logo and wordmark float at the edge on tablet.
// `gap: 8px` and not 10: with the roadmap link added, six items share 358 px at 390 px, and 10 px
// gaps put the row 5 px over — the wordmark then truncates on the reference width itself. Measured.
const M_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  maxWidth: '480px',
  margin: '0 auto',
  boxSizing: 'border-box',
} as const;
const M_LOGO_CROP = {
  width: '52px',
  height: '30px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
  textDecoration: 'none',
} as const;
const M_LOGO_IMG = { width: '105px', height: '59px', display: 'block' } as const;
// SHRINKABLE, and it is not cosmetic. The mobile bar carries logo, wordmark, two icon links and
// the language selector: at 390 px it fits, below it no longer does. `minWidth: 0` is what allows a
// flex item to go under its content width — without it the row OVERFLOWS instead of compressing,
// and the language selector leaves the screen on a small phone.
const M_WORDMARK = {
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  color: NAVY.textBright,
  textDecoration: 'none',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;
/**
 * ⚠ THE 44 px IS ON THE GROUP, and it is the group that has the border.
 *
 * Each language button used to carry `minHeight: 44px` itself. The group's own 1 px frame then sat
 * OUTSIDE those 44 px, so the selector stood 46 px tall between two 44 px icon buttons — visibly
 * thicker, and off-centre with them. Fixing the child would have left the same class of bug
 * standing: whichever element owns the border must be the one that owns the height, or the two
 * numbers drift apart again at the first padding change. `border-box` here and on the icon links
 * makes the declared height the MEASURED height on both, whatever the UA's default.
 *
 * The touch target does not shrink: the group is still 44 px tall and each button fills it.
 */
const M_LANG_GROUP = {
  ...LANG_GROUP,
  height: '44px',
  boxSizing: 'border-box',
  alignItems: 'stretch',
  flex: 'none',
} as const;
// The horizontal padding alone now — the height comes from the group above.
const M_LANG_BASE = {
  ...LANG_BASE,
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  fontSize: '12px',
  padding: '0 12px',
} as const;
const M_LANG_ON = { ...M_LANG_BASE, color: NAVY.bgPage, background: NAVY.accent } as const;
const M_LANG_OFF = {
  ...M_LANG_BASE,
  color: NAVY.textMuted,
  background: 'transparent',
  cursor: 'default',
} as const;
/** Square 44 px target — carries the GitHub link AND the roadmap link, which are icon-only on
 * mobile: at 390 px the bar has no room for two more labels (their accessible names carry them). */
const M_ICON_LINK = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: '44px',
  height: '44px',
  color: NAVY.textSecondary,
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '8px',
  textDecoration: 'none',
  flex: 'none',
} as const;
const M_TOC = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  padding: '0 16px 10px',
  maxWidth: '480px',
  margin: '0 auto',
  boxSizing: 'border-box',
} as const;
const M_CHIP = {
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  minHeight: '44px',
  fontSize: '12px',
  fontWeight: 500,
  color: NAVY.textSecondary,
  textDecoration: 'none',
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '22px',
  padding: '10px 15px',
} as const;
const M_CHIP_MUTED = {
  ...M_CHIP,
  color: NAVY.textMuted,
  border: `1px dashed ${NAVY.borderInset}`,
} as const;
const M_CHIP_N = { fontSize: '11px', fontWeight: 600, lineHeight: 1 } as const;
