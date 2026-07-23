// Home page (« Accueil v2 » mockup, 2026-07-15 rework). DELIBERATE gaps vs the mockup
// (yuya's decisions): no newsletter section; a single selectable platform (TikTok), the
// dotted chip becomes « Instagram, YouTube… bientôt ».
//
// The language selector only leads somewhere for a PUBLISHED locale — it is `localeHref` that
// carries this rule, not this page. Writing here the inventory of what does or does not have a target behind
// would go stale at the first locale added, with nothing to signal it.
//
// The consent modal takes the mockup as is: the « Continuer vers l'export » click
// (mandatory checked box) leads to the real journey (/analyse); the « données fictives » link leads to
// the same page in demo mode (/analyse?demo) — same render, synthetic source.

import { useState } from 'preact/hooks';
import { localeHref } from '../../i18n/current';
import { UI_CONSENT, UI_LANDING } from '../copy';
import { EyeLogo } from './EyeLogo';
import { NAVY } from './palette';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { useIsMobile } from './useIsMobile';

// Paths WITHOUT language: `localeHref` sets it at render time. Keeping them here as module
// constants would have frozen the language at module LOAD, before the page is necessarily read.
const DEMO_PATH = '/analyse?demo';
const ANALYSE_PATH = '/analyse';

const STEPS = UI_LANDING.steps;

/** Styling of the 3 cards — colors ONLY, in the catalog's order (`UI_LANDING.feats`).
 * The prose lives in the catalog; this array only carries what is not text. */
const FEAT_COLORS: readonly { tagColor: string; border: string }[] = [
  { tagColor: NAVY.accent, border: NAVY.borderCard },
  { tagColor: NAVY.accent, border: NAVY.borderCard },
  { tagColor: '#8fa3ff', border: NAVY.learnBorder },
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
  const isMobile = useIsMobile();

  return (
    <div style={isMobile ? M_PAGE : PAGE}>
      <SiteHeader />
      <div style={isMobile ? M_SHELL : SHELL}>
        {/* --- Hero (mobile: single column, static centered logo — Mobile mockup) -------------- */}
        <div style={isMobile ? undefined : HERO}>
          <div style={HERO_COL}>
            <span style={isMobile ? M_KICKER : KICKER}>{UI_LANDING.heroKicker}</span>
            <h1 style={isMobile ? M_HERO_TITLE : HERO_TITLE}>{UI_LANDING.heroTitle}</h1>
            <p style={isMobile ? M_HERO_LEDE : HERO_LEDE}>{UI_LANDING.heroLede}</p>
            <div style={PICK_BLOCK}>
              <span style={PICK_LABEL}>{UI_LANDING.pickLabel}</span>
              <div style={isMobile ? M_PICK_COL : PICK_ROW}>
                <div style={isMobile ? M_PLATFORM_ON : PLATFORM_ON}>
                  <span style={isMobile ? M_PLATFORM_NAME : PLATFORM_NAME}>
                    {UI_LANDING.platformTikTok}
                  </span>
                  <span style={isMobile ? M_PLATFORM_SUB : PLATFORM_SUB}>
                    {UI_LANDING.platformAvailable}
                  </span>
                </div>
                <div style={isMobile ? M_PLATFORM_SOON : PLATFORM_SOON}>
                  <span style={isMobile ? M_SOON_TEXT : SOON_TEXT}>{UI_LANDING.platformSoon}</span>
                </div>
              </div>
            </div>
            <div style={isMobile ? M_CTA_COL : CTA_ROW}>
              <button
                type="button"
                style={isMobile ? M_CTA : CTA}
                onClick={() => setConsentOpen(true)}
              >
                {UI_LANDING.ctaAnalyse}{' '}
                <span style={{ fontSize: isMobile ? '15px' : '13px' }}>→</span>
              </button>
              <a href={localeHref(DEMO_PATH)} style={isMobile ? M_DEMO_BTN : DEMO_LINK}>
                {UI_LANDING.ctaDemo}
              </a>
            </div>
            <div style={isMobile ? M_TRUST_COL : TRUST_ROW}>
              {UI_LANDING.trust.map((t) => (
                <span key={t} style={isMobile ? M_TRUST_ITEM : TRUST_ITEM}>
                  <span style={isMobile ? M_TRUST_DOT : TRUST_DOT} />
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

        {/* --- How it works ------------------------------------------------------------------- */}
        <div style={isMobile ? M_SECTION : SECTION}>
          {isMobile ? (
            <div style={M_SECTION_HEAD}>
              <span style={M_SECTION_TITLE}>{UI_LANDING.howTitle}</span>
              <span style={SECTION_NOTE}>{UI_LANDING.howNote}</span>
            </div>
          ) : (
            <div style={SECTION_HEAD}>
              <span style={SECTION_TITLE}>{UI_LANDING.howTitle}</span>
              <span style={RULE} />
              <span style={SECTION_NOTE}>{UI_LANDING.howNote}</span>
            </div>
          )}
          <div style={isMobile ? M_CARD_COL : CARD_GRID}>
            {STEPS.map((st) => (
              <div key={st.n} style={isMobile ? M_STEP_CARD : STEP_CARD}>
                <span style={STEP_N}>{st.n}</span>
                <span style={isMobile ? M_CARD_TITLE : CARD_TITLE}>{st.title}</span>
                <span style={isMobile ? M_CARD_TEXT : CARD_TEXT}>{st.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- What you will discover ----------------------------------------------------------- */}
        <div style={isMobile ? M_SECTION : SECTION}>
          {isMobile ? (
            <span style={M_SECTION_TITLE}>{UI_LANDING.discoverTitle}</span>
          ) : (
            <div style={SECTION_HEAD}>
              <span style={SECTION_TITLE}>{UI_LANDING.discoverTitle}</span>
              <span style={RULE} />
            </div>
          )}
          <div style={isMobile ? M_CARD_COL : CARD_GRID}>
            {UI_LANDING.feats.map((f, i) => (
              <div
                key={f.tag}
                style={{
                  ...(isMobile ? M_FEAT_CARD : FEAT_CARD),
                  border: `1px solid ${FEAT_COLORS[i]?.border ?? NAVY.borderCard}`,
                }}
              >
                <div style={FEAT_TAG_ROW}>
                  <span style={{ ...FEAT_TAG, color: FEAT_COLORS[i]?.tagColor ?? NAVY.accent }}>
                    {f.tag}
                  </span>
                  {isMobile && 'mobileBadge' in f && f.mobileBadge !== undefined && (
                    <span style={M_DESKTOP_ONLY_BADGE}>{f.mobileBadge}</span>
                  )}
                </div>
                <span style={isMobile ? M_CARD_TITLE : CARD_TITLE}>{f.title}</span>
                <span style={isMobile ? M_CARD_TEXT : CARD_TEXT}>
                  {isMobile && 'mobileText' in f && f.mobileText !== undefined
                    ? f.mobileText
                    : f.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Why « panopticool »? ------------------------------------------------------------- */}
        <div style={isMobile ? M_WHY_CARD : WHY_CARD}>
          <span style={isMobile ? M_KICKER : KICKER}>{UI_LANDING.whyKicker}</span>
          <p style={isMobile ? M_WHY_TEXT : WHY_TEXT}>
            {UI_LANDING.whyTextBefore}
            <i>{UI_LANDING.whyTextItalic}</i>
            {UI_LANDING.whyTextAfter}
          </p>
          <a href={localeHref(DEMO_PATH)} style={isMobile ? M_WHY_LINK : WHY_LINK}>
            {UI_LANDING.whyLink}
          </a>
        </div>

        <SiteFooter />
      </div>

      {consentOpen && <ConsentModal onClose={() => setConsentOpen(false)} isMobile={isMobile} />}
    </div>
  );
}

// --- Styles (mockup values, NAVY palette) ---------------------------------------------------------
const PAGE = {
  minHeight: '100vh',
  background: `linear-gradient(180deg, ${NAVY.bgPageTop} 0%, ${NAVY.bgPage} 480px)`,
  color: NAVY.textBright,
} as const;
const SHELL = {
  maxWidth: '1160px',
  margin: '0 auto',
  padding: '72px 40px 64px',
  display: 'flex',
  flexDirection: 'column',
  gap: '72px',
} as const;
const HERO = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 440px)',
  gap: '56px',
  alignItems: 'center',
} as const;
const HERO_COL = { display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 } as const;
const HERO_EYE = { minWidth: 0 } as const;
const KICKER = {
  fontSize: '10px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const HERO_TITLE = {
  margin: 0,
  fontSize: '42px',
  fontWeight: 500,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
  textWrap: 'balance',
} as const;
const HERO_LEDE = {
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.8,
  color: NAVY.textLede,
  maxWidth: '540px',
} as const;
const PICK_BLOCK = {
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
  paddingTop: '6px',
} as const;
const PICK_LABEL = {
  fontSize: '9px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: NAVY.textDim,
} as const;
const PICK_ROW = { display: 'flex', gap: '10px', flexWrap: 'wrap' } as const;
const PLATFORM_ON = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '12px 18px',
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
  borderRadius: '10px',
} as const;
const PLATFORM_NAME = { fontSize: '12px', fontWeight: 600, color: NAVY.accentBright } as const;
const PLATFORM_SUB = {
  fontSize: '9px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const PLATFORM_SOON = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 18px',
  border: `1px dashed ${NAVY.borderInset}`,
  borderRadius: '10px',
} as const;
const SOON_TEXT = { fontSize: '10px', lineHeight: 1.3, color: NAVY.textGhost } as const;
const CTA_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  flexWrap: 'wrap',
  paddingTop: '4px',
} as const;
const CTA = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'inherit',
  letterSpacing: '0.03em',
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: 'none',
  borderRadius: '9px',
  padding: '15px 24px',
} as const;
const DEMO_LINK = {
  fontSize: '11.5px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textLede,
  textDecoration: 'none',
  borderBottom: `1px solid ${NAVY.borderChip}`,
  paddingBottom: '3px',
} as const;
const TRUST_ROW = { display: 'flex', gap: '18px', flexWrap: 'wrap', paddingTop: '4px' } as const;
const TRUST_ITEM = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '10px',
  color: NAVY.textDim,
} as const;
const TRUST_DOT = {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  background: NAVY.ok,
} as const;
const SECTION = { display: 'flex', flexDirection: 'column', gap: '22px' } as const;
const SECTION_HEAD = { display: 'flex', alignItems: 'center', gap: '14px' } as const;
const SECTION_TITLE = {
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: NAVY.textBright,
} as const;
const RULE = { flex: 1, height: '1px', background: NAVY.borderCard } as const;
const SECTION_NOTE = {
  fontSize: '9.5px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textDim,
} as const;
const CARD_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '16px',
} as const;
const STEP_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '24px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '12px',
} as const;
const STEP_N = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  border: '1px solid rgba(47,212,240,.5)',
  fontSize: '11px',
  fontWeight: 600,
  color: NAVY.accent,
} as const;
const CARD_TITLE = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textBright,
} as const;
const CARD_TEXT = { fontSize: '11px', lineHeight: 1.7, color: NAVY.textLede } as const;
const FEAT_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '24px',
  background: NAVY.bgCard,
  borderRadius: '12px',
} as const;
const FEAT_TAG = { fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' } as const;
const WHY_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '32px',
  background: 'linear-gradient(180deg, #0e1836, #0b1226)',
  border: '1px solid #243362',
  borderRadius: '14px',
  alignItems: 'flex-start',
} as const;
const WHY_TEXT = {
  margin: 0,
  fontSize: '12px',
  lineHeight: 1.8,
  color: NAVY.textLede,
  maxWidth: '760px',
} as const;
const WHY_LINK = {
  fontSize: '11px',
  fontWeight: 500,
  color: NAVY.accent,
  borderBottom: '1px solid rgba(47,212,240,.4)',
  paddingBottom: '2px',
  textDecoration: 'none',
} as const;

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
const FEAT_TAG_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
} as const;
// The background (gradient) covers the FULL width — no ceiling here, otherwise the black body appears as
// bands on either side of the 480 px container on intermediate screens (720 px and less,
// but wider than 480). Only the CONTENT is centered at 480 px (M_SHELL).
const M_PAGE = { ...PAGE } as const;
const M_SHELL = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '36px 20px 48px',
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
} as const;
const M_KICKER = {
  fontSize: '11px',
  lineHeight: 1.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const M_HERO_TITLE = {
  margin: 0,
  fontSize: '28px',
  fontWeight: 500,
  lineHeight: 1.25,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
  textWrap: 'balance',
} as const;
const M_HERO_LEDE = {
  margin: 0,
  fontSize: '14px',
  lineHeight: 1.75,
  color: NAVY.textLede,
} as const;
const M_PICK_COL = { display: 'flex', flexDirection: 'column', gap: '10px' } as const;
const M_PLATFORM_ON = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '52px',
  padding: '14px 18px',
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
  borderRadius: '12px',
} as const;
const M_PLATFORM_NAME = { fontSize: '14px', fontWeight: 600, color: NAVY.accentBright } as const;
const M_PLATFORM_SUB = {
  fontSize: '11px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const M_PLATFORM_SOON = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  boxSizing: 'border-box',
  padding: '10px 18px',
  border: `1px dashed ${NAVY.borderInset}`,
  borderRadius: '12px',
} as const;
const M_SOON_TEXT = { fontSize: '12px', lineHeight: 1.4, color: NAVY.textGhost } as const;
const M_CTA_COL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingTop: '4px',
} as const;
const M_CTA = {
  ...CTA,
  justifyContent: 'center',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '54px',
  fontSize: '14px',
  lineHeight: 1.3,
  borderRadius: '12px',
  padding: '16px 24px',
} as const;
const M_DEMO_BTN = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '48px',
  boxSizing: 'border-box',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.5,
  color: NAVY.textSecondary,
  textDecoration: 'none',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '12px',
  padding: '12px 18px',
  textAlign: 'center',
} as const;
const M_TRUST_COL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  paddingTop: '2px',
} as const;
const M_TRUST_ITEM = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  lineHeight: 1.4,
  color: NAVY.textMuted,
} as const;
const M_TRUST_DOT = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: NAVY.ok,
  flex: 'none',
} as const;
const M_SECTION = { display: 'flex', flexDirection: 'column', gap: '18px' } as const;
const M_SECTION_HEAD = { display: 'flex', flexDirection: 'column', gap: '6px' } as const;
const M_SECTION_TITLE = {
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: NAVY.textBright,
} as const;
const M_CARD_COL = { display: 'flex', flexDirection: 'column', gap: '14px' } as const;
const M_STEP_CARD = { ...STEP_CARD, gap: '11px', padding: '20px' } as const;
const M_FEAT_CARD = { ...FEAT_CARD, padding: '20px' } as const;
const M_CARD_TITLE = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.45,
  color: NAVY.textBright,
} as const;
const M_CARD_TEXT = { fontSize: '12.5px', lineHeight: 1.7, color: NAVY.textLede } as const;
const M_DESKTOP_ONLY_BADGE = {
  fontSize: '9.5px',
  lineHeight: 1.3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.riskLabel,
  border: '1px solid rgba(232,117,78,.4)',
  borderRadius: '20px',
  padding: '4px 8px',
} as const;
const M_WHY_CARD = { ...WHY_CARD, gap: '14px', padding: '24px 20px' } as const;
const M_WHY_TEXT = { margin: 0, fontSize: '13px', lineHeight: 1.75, color: NAVY.textLede } as const;
const M_WHY_LINK = {
  display: 'flex',
  alignItems: 'center',
  minHeight: '44px',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.accent,
  textDecoration: 'none',
} as const;

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
