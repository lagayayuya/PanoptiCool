// Home page (« Accueil v4 » mockup). ONE DELIBERATE GAP vs the mockup (yuya's decision): no
// newsletter block. The site is a static build with no server, so the form would either do nothing
// or hand an address to a third party — a field that pretends to subscribe you is the one thing
// this product cannot ship.
//
// WHAT v4 REPLACES. The « Comment ça marche » steps and the « Ce que tu vas découvrir » cards are
// gone, with their copy: both described the journey in the abstract, and the two connector cards
// below say the same thing concretely, per platform. The export guide says the rest, in screenshots
// rather than in a paragraph.
//
// The language selector only leads somewhere for a PUBLISHED locale — it is `localeHref` that
// carries this rule, not this page. Writing here the inventory of what does or does not have a
// target behind would go stale at the first locale added, with nothing to signal it.

import { useState } from 'preact/hooks';
import { localeHref } from '../../i18n/current';
import { UI_CONSENT, UI_GUIDE, UI_LANDING } from '../copy';
import { ExportGuide, type GuideTarget } from './ExportGuide';
import { EyeLogo } from './EyeLogo';
import { NAVY } from './palette';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { useIsMobile } from './useIsMobile';

// Paths WITHOUT language: `localeHref` sets it at render time. Keeping them here as module
// constants would have frozen the language at module LOAD, before the page is necessarily read.
const DEMO_PATH = '/analyse?demo';
const ANALYSE_PATH = '/analyse';

/**
 * Whether the Instagram connector is reachable.
 *
 * NOT a flag to be forgotten: the card renders in full either way, because the reader needs to know
 * what the export contains BEFORE requesting it — the file takes days to arrive. What the flag
 * governs is only whether the two buttons lead to an analysis or to the export guide. The commit
 * that lands the connector flips it, and nothing else here moves.
 */
const INSTAGRAM_LIVE = false;

/**
 * The URLs of the two resource rails — the language-independent SPINE, paired BY INDEX with
 * `UI_LANDING.learnLinks` / `actLinks`, exactly as `ROADMAP_STEPS` pairs with `UI_ROADMAP.steps`.
 *
 * A URL is an address, not prose: it does not translate, and putting it in `copy.*` would ask a
 * translator to keep two copies of it in step. The cost of the split is that nothing but
 * `landing.test.ts` notices if one list gains an entry and the other does not.
 */
export const LEARN_URLS: readonly string[] = [
  'https://www.laquadrature.net/',
  'https://noyb.eu/',
  'https://www.privacyguides.org/en/basics/why-privacy-matters/',
];
export const ACT_URLS: readonly string[] = [
  'https://haveibeenpwned.com/',
  'https://www.privacyguides.org/en/basics/threat-modeling/',
  'https://www.privacyguides.org/en/tools/',
];

function ConsentModal({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const [checked, setChecked] = useState(false);
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: close on click outside the modal — Esc would be a plus, not a prerequisite.
    // biome-ignore lint/a11y/noStaticElementInteractions: closing veil, not a control — the ✕ button stays the accessible path.
    <div style={isMobile ? M_OVERLAY : OVERLAY} onClick={onClose}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: only stops the propagation of the overlay click. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={UI_CONSENT.dialogAriaLabel}
        style={isMobile ? M_MODAL : MODAL}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={MODAL_HEAD}>
          <span style={KICKER}>{UI_CONSENT.kicker}</span>
          <span style={{ flex: 1 }} />
          <button
            type="button"
            aria-label={UI_CONSENT.closeAriaLabel}
            style={CLOSE_BTN}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <span style={MODAL_TITLE}>{UI_CONSENT.title}</span>
        <div style={MODAL_BODY}>
          <div style={MODAL_LINE}>
            <span style={{ color: NAVY.risk, flex: 'none' }}>▲</span>
            <span>
              {UI_CONSENT.line1Before}
              <span style={EM}>{UI_CONSENT.line1Strong}</span>
              {UI_CONSENT.line1Middle}
              <span style={EM}>{UI_CONSENT.line1Strong2}</span>
            </span>
          </div>
          <div style={MODAL_LINE}>
            <span style={{ color: NAVY.ok, flex: 'none' }}>●</span>
            <span>
              {UI_CONSENT.line2Before}
              <span style={EM}>{UI_CONSENT.line2Strong}</span>
              {UI_CONSENT.line2After}
            </span>
          </div>
          <div style={MODAL_LINE}>
            <span style={{ color: '#8fa3ff', flex: 'none' }}>●</span>
            <span>
              {UI_CONSENT.line3Before}
              {isMobile ? UI_CONSENT.line3DeviceMobile : UI_CONSENT.line3DeviceDesktop}
              {UI_CONSENT.line3After}
            </span>
          </div>
        </div>
        <label style={CONSENT_LABEL}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.currentTarget.checked)}
            style={isMobile ? M_CHECKBOX : CHECKBOX}
          />
          <span style={CONSENT_TEXT}>{UI_CONSENT.consentCheckbox}</span>
        </label>
        {/* Mobile (bottom sheet): STACKED full-width buttons, « Continuer » first
            (« Accueil v2 Mobile » mockup); desktop: row with « Pas maintenant » on the left. */}
        <div style={isMobile ? M_MODAL_ACTIONS : MODAL_ACTIONS}>
          {!isMobile && (
            <button type="button" style={LATER_BTN} onClick={onClose}>
              {UI_CONSENT.laterButton}
            </button>
          )}
          {!isMobile && <span style={{ flex: 1 }} />}
          <button
            type="button"
            disabled={!checked}
            style={{
              ...(checked ? GO_BTN : GO_BTN_OFF),
              ...(isMobile ? M_FULL_BTN : {}),
            }}
            onClick={() => {
              if (checked) window.location.href = localeHref(ANALYSE_PATH);
            }}
          >
            {UI_CONSENT.continueButton}
          </button>
          {isMobile && (
            <button type="button" style={{ ...LATER_BTN, ...M_FULL_BTN }} onClick={onClose}>
              {UI_CONSENT.laterButton}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [consentOpen, setConsentOpen] = useState(false);
  // `null` = closed. The hero opens the guide on its picker; each platform card opens it straight
  // on its own steps.
  const [guideTarget, setGuideTarget] = useState<GuideTarget | null>(null);
  const isMobile = useIsMobile();

  const platformCard = (p: {
    name: string;
    lede: string;
    bullets: readonly string[];
    open: string;
    demo: string;
    accent: string;
    live: boolean;
    guide: GuideTarget;
  }) => (
    <div style={PLATFORM_CARD}>
      {/* The card LEADS with the platform's name over a panel — the mockup's masthead, minus its
          image. ⚠ THE PANEL IS EMPTY ON PURPOSE, in both cards. The mockup's previews are renders
          of a REAL export (actual photographs), which cannot enter a public repo, and the v5
          analysis page is about to change what a render even looks like — so a preview built now
          would be a picture of a screen that no longer exists. Both get filled from the synthetic
          persona once that page has settled. */}
      <div style={PREVIEW}>
        <span aria-hidden="true" style={PREVIEW_FADE} />
        <div style={PREVIEW_ID}>
          <span style={PREVIEW_NAME}>{p.name}</span>
        </div>
      </div>
      <div style={isMobile ? M_PLATFORM_BODY : PLATFORM_BODY}>
        <span style={PLATFORM_LEDE}>{p.lede}</span>
        <span style={DIVIDER} />
        <div style={BULLETS}>
          {p.bullets.map((b) => (
            <span key={b} style={BULLET}>
              <span style={{ ...BULLET_DOT, background: p.accent }} />
              {b}
            </span>
          ))}
        </div>
        <span style={{ flex: 1 }} />
        <div style={PLATFORM_ACTIONS}>
          <button
            type="button"
            class="hv-br"
            style={{ ...PLATFORM_CTA, background: p.accent }}
            onClick={() => (p.live ? setConsentOpen(true) : setGuideTarget(p.guide))}
          >
            {p.open}
          </button>
          {p.live ? (
            <a href={localeHref(DEMO_PATH)} class="hv-bd" style={PLATFORM_DEMO}>
              {p.demo}
            </a>
          ) : (
            <span style={PLATFORM_SOON_TAG}>{UI_LANDING.platformComingSoon}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={PAGE}>
      <SiteHeader />

      <div style={isMobile ? M_SHELL : SHELL}>
        {/* --- Hero ---------------------------------------------------------------------------- */}
        <div style={isMobile ? undefined : HERO}>
          <div style={isMobile ? M_HERO_COL : HERO_COL}>
            <h1 style={isMobile ? M_HERO_TITLE : HERO_TITLE}>{UI_LANDING.heroTitle}</h1>
            <p style={isMobile ? M_HERO_LEDE : HERO_LEDE}>{UI_LANDING.heroLede}</p>
            {/* Getting the archive is the first obstacle and by far the biggest — the guide is the
                hero's call to action. Sized to its content, not to the column: it opens a modal,
                it does not start the analysis, and a full-width filled button claimed otherwise. */}
            <div style={CTA_ROW}>
              <button
                type="button"
                class="hv-cta"
                style={CTA}
                onClick={() => setGuideTarget('pick')}
              >
                {UI_GUIDE.openLabel}
                <span style={CTA_ARROW}>→</span>
              </button>
            </div>
            <div style={isMobile ? M_TRUST_COL : TRUST_ROW}>
              {UI_LANDING.trust.map((t) => (
                <span key={t} style={TRUST_ITEM}>
                  <span style={TRUST_DOT} />
                  {t}
                </span>
              ))}
            </div>
          </div>
          {!isMobile && (
            <div style={HERO_EYE}>
              <EyeLogo variant="hero" />
            </div>
          )}
        </div>

        {/* --- The two connectors -------------------------------------------------------------- */}
        <div style={isMobile ? M_PLATFORM_GRID : PLATFORM_GRID}>
          {platformCard({
            name: UI_LANDING.instagramName,
            lede: UI_LANDING.instagramLede,
            bullets: UI_LANDING.instagramBullets,
            open: UI_LANDING.instagramOpen,
            demo: UI_LANDING.instagramDemo,
            accent: NAVY.instagram,
            live: INSTAGRAM_LIVE,
            guide: 'instagram',
          })}
          {platformCard({
            name: UI_LANDING.tiktokName,
            lede: UI_LANDING.tiktokLede,
            bullets: UI_LANDING.tiktokBullets,
            open: UI_LANDING.tiktokOpen,
            demo: UI_LANDING.tiktokDemo,
            accent: NAVY.accent,
            live: true,
            guide: 'tiktok',
          })}
          <div style={SOON_BOX}>
            <span style={SOON_TEXT}>{UI_LANDING.platformSoon}</span>
          </div>
        </div>
      </div>

      {/* --- The right, and what it actually gets you — its own band ------------------------- */}
      <div style={BAND}>
        <div style={isMobile ? M_BAND_INNER : BAND_INNER}>
          <div style={RIGHT_COL}>
            <span style={isMobile ? M_H2 : H2}>{UI_LANDING.rightTitle}</span>
            <p style={PROSE}>{UI_LANDING.rightLaw}</p>
            <p style={PROSE}>{UI_LANDING.rightArchive}</p>
            <p style={PROSE}>{UI_LANDING.rightProduct}</p>
          </div>
          <div style={isMobile ? M_STAT_CARD : STAT_CARD}>
            <div style={STAT}>
              <span style={isMobile ? M_STAT_N : STAT_N}>{UI_LANDING.statMessages}</span>
              <span style={STAT_LABEL}>{UI_LANDING.statMessagesLabel}</span>
            </div>
            <span style={STAT_DIVIDER} />
            <div style={STAT}>
              <span style={isMobile ? M_STAT_N : STAT_N}>{UI_LANDING.statValue}</span>
              <span style={STAT_LABEL}>{UI_LANDING.statValueLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={isMobile ? M_TAIL : TAIL}>
        {/* --- Where the profiles go --------------------------------------------------------- */}
        <div style={SECTION_HEAD}>
          <span style={isMobile ? M_H2 : H2}>{UI_LANDING.marketTitle}</span>
          <p style={PROSE}>{UI_LANDING.marketLede}</p>
        </div>
        <div style={CARD_GRID}>
          {UI_LANDING.consequences.map((c) => (
            <div key={c.title} style={isMobile ? M_CARD : CARD}>
              <span style={KICKER}>{c.kicker}</span>
              <span style={CARD_TITLE}>{c.title}</span>
              <span style={CARD_TEXT}>{c.text}</span>
            </div>
          ))}
        </div>

        {/* --- Why « panopticool »? ---------------------------------------------------------- */}
        <div style={isMobile ? M_WHY_CARD : WHY_CARD}>
          <span style={KICKER}>{UI_LANDING.whyKicker}</span>
          <p style={WHY_TEXT}>
            {UI_LANDING.whyTextBefore}
            <i>{UI_LANDING.whyTextItalic}</i>
            {UI_LANDING.whyTextAfter}
          </p>
          <div style={WHY_LINKS}>
            <a href={localeHref(DEMO_PATH)} class="hv-cy" style={WHY_LINK}>
              {UI_LANDING.whyDemoTikTok}
            </a>
            {INSTAGRAM_LIVE && (
              <a href={localeHref(DEMO_PATH)} class="hv-bd" style={WHY_LINK}>
                {UI_LANDING.whyDemoInstagram}
              </a>
            )}
          </div>
        </div>

        {/* --- Going further ----------------------------------------------------------------- */}
        <div style={RAIL_GRID}>
          <Rail
            kicker={UI_LANDING.learnKicker}
            title={UI_LANDING.learnTitle}
            lede={UI_LANDING.learnLede}
            links={UI_LANDING.learnLinks}
            urls={LEARN_URLS}
            isMobile={isMobile}
          />
          <Rail
            kicker={UI_LANDING.actKicker}
            title={UI_LANDING.actTitle}
            lede={UI_LANDING.actLede}
            links={UI_LANDING.actLinks}
            urls={ACT_URLS}
            isMobile={isMobile}
          />
        </div>

        <SiteFooter />
      </div>

      {consentOpen && <ConsentModal onClose={() => setConsentOpen(false)} isMobile={isMobile} />}
      {guideTarget !== null && (
        <ExportGuide target={guideTarget} onClose={() => setGuideTarget(null)} />
      )}
    </div>
  );
}

/** One resource rail. `links` carries the prose, `urls` the addresses — paired by index. */
function Rail({
  kicker,
  title,
  lede,
  links,
  urls,
  isMobile,
}: {
  kicker: string;
  title: string;
  lede: string;
  links: readonly { name: string; note: string }[];
  urls: readonly string[];
  isMobile: boolean;
}) {
  return (
    <div style={isMobile ? M_RAIL : RAIL}>
      <span style={KICKER}>{kicker}</span>
      <span style={RAIL_TITLE}>{title}</span>
      <span style={RAIL_LEDE}>{lede}</span>
      <span style={{ flex: 1 }} />
      {links.map((l, i) => (
        <a
          key={l.name}
          href={urls[i] ?? '#'}
          target="_blank"
          rel="noreferrer"
          class="hv-a"
          style={RAIL_LINK}
        >
          <span style={RAIL_LINK_COL}>
            <span style={RAIL_LINK_NAME}>{l.name}</span>
            <span style={RAIL_LINK_NOTE}>{l.note}</span>
          </span>
          <span style={{ flex: 1 }} />
          <span style={RAIL_ARROW}>→</span>
        </a>
      ))}
    </div>
  );
}

// --- Consent modal ------------------------------------------------------------------------------
const OVERLAY = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  background: 'rgba(7,11,24,.8)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
} as const;
const MODAL = {
  width: '560px',
  maxWidth: '100%',
  maxHeight: '100%',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '14px',
  boxShadow: '0 30px 80px rgba(0,0,0,.6)',
  padding: '28px 30px',
} as const;
const MODAL_HEAD = { display: 'flex', alignItems: 'center', gap: '12px' } as const;
const CLOSE_BTN = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '7px',
  border: `1px solid ${NAVY.borderChip}`,
  background: 'transparent',
  color: NAVY.textLede,
  fontSize: '13px',
} as const;
const MODAL_TITLE = {
  fontSize: '17px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textBright,
} as const;
const MODAL_BODY = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  fontSize: '11.5px',
  lineHeight: 1.75,
  color: NAVY.textLede,
} as const;
const MODAL_LINE = { display: 'flex', gap: '11px' } as const;
const EM = { color: NAVY.textBright } as const;
const CONSENT_LABEL = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '11px',
  cursor: 'pointer',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
  padding: '13px 15px',
} as const;
const CHECKBOX = {
  accentColor: NAVY.accent,
  width: '15px',
  height: '15px',
  marginTop: '1px',
  flex: 'none',
} as const;
const CONSENT_TEXT = { fontSize: '11px', lineHeight: 1.6, color: NAVY.textSecondary } as const;
const MODAL_ACTIONS = { display: 'flex', alignItems: 'center', gap: '14px' } as const;
const LATER_BTN = {
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: 500,
  fontFamily: 'inherit',
  lineHeight: 1.3,
  color: NAVY.textLede,
  background: 'transparent',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '8px',
  padding: '12px 18px',
} as const;
const GO_BTN = {
  cursor: 'pointer',
  fontSize: '11.5px',
  fontWeight: 600,
  fontFamily: 'inherit',
  letterSpacing: '0.03em',
  lineHeight: 1.3,
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: 'none',
  borderRadius: '8px',
  padding: '13px 20px',
} as const;
const GO_BTN_OFF = {
  ...GO_BTN,
  cursor: 'not-allowed',
  color: NAVY.textDim,
  background: '#1c2749',
} as const;

// --- MOBILE styles (« Accueil v2 Mobile » mockup: single column, touch targets ≥ 44 px) ------------
// The background (gradient) covers the FULL width — no ceiling here, otherwise the black body appears as
// bands on either side of the 480 px container on intermediate screens (720 px and less,
// but wider than 480). Only the CONTENT is centered at 480 px (M_SHELL).

// --- Mobile modal: bottom sheet (« Accueil v2 Mobile » mockup) -------------------------------------
const M_OVERLAY = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  background: 'rgba(7,11,24,.8)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
} as const;
const M_MODAL = {
  width: '100%',
  maxWidth: '480px',
  maxHeight: '88vh',
  overflow: 'auto',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '18px 18px 0 0',
  boxShadow: '0 -20px 60px rgba(0,0,0,.6)',
  padding: '22px 20px 28px',
} as const;
const M_CHECKBOX = {
  accentColor: NAVY.accent,
  width: '20px',
  height: '20px',
  marginTop: '1px',
  flex: 'none',
} as const;
const M_MODAL_ACTIONS = { display: 'flex', flexDirection: 'column', gap: '10px' } as const;
const M_FULL_BTN = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '50px',
  justifyContent: 'center',
  textAlign: 'center',
} as const;

// --- v4 sections ----------------------------------------------------------------------------

// --- Styles — values taken from the « Accueil v4 » mockup, not invented ------------------------
const PAGE = { minHeight: '100vh', background: NAVY.bgPage, color: NAVY.textBright } as const;
/** The mockup's measure: 1080 content, 40 gutter. */
const SHELL = { maxWidth: '1080px', margin: '0 auto', padding: '0 40px' } as const;
const M_SHELL = { ...SHELL, padding: '0 20px' } as const;

const HERO = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: '40px',
  padding: '104px 0 60px',
} as const;
const HERO_COL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '26px',
  minWidth: 0,
  maxWidth: '830px',
} as const;
const M_HERO_COL = { ...HERO_COL, gap: '20px', padding: '52px 0 40px' } as const;
const HERO_EYE = { minWidth: 0 } as const;
const HERO_TITLE = {
  margin: 0,
  fontSize: '66px',
  fontWeight: 600,
  lineHeight: 1.04,
  letterSpacing: '-0.038em',
  color: '#ffffff',
  textWrap: 'balance',
} as const;
const M_HERO_TITLE = { ...HERO_TITLE, fontSize: '34px', lineHeight: 1.12 } as const;
const HERO_LEDE = {
  margin: 0,
  fontSize: '19px',
  lineHeight: 1.62,
  color: NAVY.textBody,
  maxWidth: '640px',
} as const;
const M_HERO_LEDE = { ...HERO_LEDE, fontSize: '15px' } as const;

// ⚠ The call to action OPENS A MODAL — it does not start the analysis. The mockup gives it the
// recessed treatment for that reason, and sizes it to its content: a full-width filled button
// reads as « go », which is a promise this control does not keep.
const CTA_ROW = { display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '2px' } as const;
const CTA = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontFamily: 'inherit',
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: 1.2,
  color: NAVY.textBright,
  background: '#111938',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '12px',
  padding: '16px 22px',
} as const;
const CTA_ARROW = { fontSize: '15px', lineHeight: 1, color: NAVY.textMuted } as const;

const TRUST_ROW = { display: 'flex', gap: '26px', flexWrap: 'wrap', paddingTop: '4px' } as const;
const M_TRUST_COL = { ...TRUST_ROW, gap: '10px', flexDirection: 'column' } as const;
const TRUST_ITEM = {
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.5,
  color: '#9dabc8',
} as const;
const TRUST_DOT = {
  width: '5px',
  height: '5px',
  borderRadius: '50%',
  background: NAVY.accent,
  flex: 'none',
} as const;

// --- The two connector cards ---
const PLATFORM_GRID = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '22px',
  paddingBottom: '104px',
  alignItems: 'stretch',
} as const;
const M_PLATFORM_GRID = {
  ...PLATFORM_GRID,
  gridTemplateColumns: '1fr',
  paddingBottom: '56px',
} as const;
const PLATFORM_CARD = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '22px',
  overflow: 'hidden',
} as const;
const PREVIEW = {
  position: 'relative',
  aspectRatio: '16 / 10',
  overflow: 'hidden',
  background: NAVY.bgInset,
} as const;
const PREVIEW_FADE = {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(180deg, rgba(7,11,24,.10) 0%, rgba(7,11,24,.05) 42%, rgba(14,20,42,.92) 100%)',
} as const;
const PREVIEW_ID = {
  position: 'absolute',
  left: '24px',
  bottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
} as const;
const PREVIEW_NAME = {
  fontSize: '31px',
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: '-0.028em',
  color: '#ffffff',
} as const;
const PLATFORM_BODY = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  flex: 1,
  padding: '22px 26px 26px',
} as const;
const M_PLATFORM_BODY = { ...PLATFORM_BODY, padding: '20px 18px 22px' } as const;
const PLATFORM_LEDE = { fontSize: '13px', lineHeight: 1.55, color: NAVY.textMuted } as const;
const DIVIDER = { height: '1px', background: NAVY.donutRest } as const;
const BULLETS = { display: 'flex', flexDirection: 'column', gap: '11px' } as const;
const BULLET = {
  display: 'flex',
  gap: '11px',
  fontSize: '15px',
  lineHeight: 1.5,
  color: '#c4cee6',
} as const;
const BULLET_DOT = {
  width: '5px',
  height: '5px',
  borderRadius: '50%',
  flex: 'none',
  marginTop: '9px',
} as const;
const PLATFORM_ACTIONS = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  paddingTop: '4px',
} as const;
const PLATFORM_CTA = {
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: 1.2,
  color: NAVY.bgPage,
  border: 'none',
  borderRadius: '12px',
  padding: '17px 22px',
} as const;
const PLATFORM_DEMO = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.2,
  color: '#a7b2cd',
  background: 'transparent',
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '12px',
  padding: '15px 22px',
  textAlign: 'center',
  textDecoration: 'none',
} as const;
const PLATFORM_SOON_TAG = {
  fontSize: '13px',
  color: NAVY.textDim,
  textAlign: 'center',
  padding: '15px 22px',
} as const;
const SOON_BOX = {
  gridColumn: '1 / -1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px dashed ${NAVY.borderInset}`,
  borderRadius: '16px',
  padding: '19px',
} as const;
const SOON_TEXT = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.6,
  color: NAVY.textMuted,
  letterSpacing: '0.01em',
} as const;

// --- The right — a band of its own, so the page breathes between two card fields ---
const BAND = {
  background: NAVY.bgInset,
  borderTop: `1px solid ${NAVY.borderHeader}`,
  borderBottom: `1px solid ${NAVY.borderHeader}`,
} as const;
const BAND_INNER = {
  maxWidth: '1080px',
  margin: '0 auto',
  padding: '80px 40px',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '72px',
  alignItems: 'start',
} as const;
const M_BAND_INNER = {
  ...BAND_INNER,
  padding: '48px 20px',
  gridTemplateColumns: '1fr',
  gap: '28px',
} as const;
const RIGHT_COL = { display: 'flex', flexDirection: 'column', gap: '20px' } as const;
const H2 = {
  fontSize: '34px',
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: '-0.025em',
  color: '#ffffff',
  textWrap: 'balance',
} as const;
const M_H2 = { ...H2, fontSize: '24px' } as const;
const PROSE = { margin: 0, fontSize: '16px', lineHeight: 1.7, color: NAVY.textBody } as const;
const STAT_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
  padding: '36px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '20px',
} as const;
const M_STAT_CARD = { ...STAT_CARD, gap: '20px', padding: '24px' } as const;
const STAT = { display: 'flex', flexDirection: 'column', gap: '6px' } as const;
const STAT_N = {
  fontSize: '76px',
  fontWeight: 700,
  lineHeight: 0.9,
  letterSpacing: '-0.04em',
  color: NAVY.accent,
} as const;
const M_STAT_N = { ...STAT_N, fontSize: '44px' } as const;
const STAT_LABEL = { fontSize: '14px', lineHeight: 1.5, color: NAVY.textBody } as const;
const STAT_DIVIDER = { height: '1px', background: NAVY.borderCard } as const;

// --- The tail: consequences, why, rails ---
const TAIL = {
  maxWidth: '1080px',
  margin: '0 auto',
  padding: '92px 40px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '34px',
} as const;
const M_TAIL = { ...TAIL, padding: '56px 20px 0', gap: '26px' } as const;
const SECTION_HEAD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  maxWidth: '720px',
} as const;
const CARD_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
  gap: '18px',
} as const;
const CARD = {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '26px 28px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '20px',
} as const;
const M_CARD = { ...CARD, padding: '22px 20px' } as const;
/** The section kicker of the whole page: 12 px, tracked, uppercase, cyan. */
const KICKER = {
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const CARD_TITLE = {
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.25,
  letterSpacing: '-0.015em',
  color: '#ffffff',
} as const;
const CARD_TEXT = { fontSize: '15px', lineHeight: 1.65, color: NAVY.textBody } as const;

const WHY_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '30px 32px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '20px',
} as const;
const M_WHY_CARD = { ...WHY_CARD, padding: '24px 20px' } as const;
const WHY_TEXT = {
  margin: 0,
  fontSize: '16px',
  lineHeight: 1.7,
  color: NAVY.textBody,
  maxWidth: '760px',
} as const;
const WHY_LINKS = { display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '2px' } as const;
const WHY_LINK = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.2,
  color: NAVY.textHeading,
  background: 'transparent',
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '12px',
  padding: '14px 20px',
  textDecoration: 'none',
} as const;

const RAIL_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
  gap: '22px',
  alignItems: 'stretch',
} as const;
const RAIL = {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '30px 32px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '20px',
} as const;
const M_RAIL = { ...RAIL, padding: '24px 20px' } as const;
const RAIL_TITLE = {
  fontSize: '22px',
  fontWeight: 600,
  lineHeight: 1.25,
  letterSpacing: '-0.02em',
  color: '#ffffff',
  paddingTop: '10px',
} as const;
const RAIL_LEDE = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: NAVY.textMuted,
  padding: '8px 0 12px',
} as const;
const RAIL_LINK = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '14px',
  padding: '15px 0',
  borderTop: `1px solid ${NAVY.borderHeader}`,
  textDecoration: 'none',
} as const;
const RAIL_LINK_COL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
} as const;
const RAIL_LINK_NAME = {
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: 1.35,
  color: NAVY.textHeading,
} as const;
const RAIL_LINK_NOTE = { fontSize: '13px', lineHeight: 1.4, color: NAVY.textMuted } as const;
const RAIL_ARROW = { fontSize: '14px', lineHeight: 1, color: NAVY.accent, flex: 'none' } as const;
