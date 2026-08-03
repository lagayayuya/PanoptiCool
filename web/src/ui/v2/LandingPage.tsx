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
    <div style={isMobile ? M_PLATFORM_CARD : PLATFORM_CARD}>
      <span style={{ ...PLATFORM_NAME, color: p.accent }}>{p.name}</span>
      <p style={PLATFORM_LEDE}>{p.lede}</p>
      <ul style={BULLETS}>
        {p.bullets.map((b) => (
          <li key={b} style={BULLET}>
            <span style={{ ...BULLET_DOT, background: p.accent }} />
            {b}
          </li>
        ))}
      </ul>
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
          <a href={localeHref(DEMO_PATH)} class="hv-cy" style={PLATFORM_DEMO}>
            {p.demo}
          </a>
        ) : (
          <span style={PLATFORM_SOON_TAG}>{UI_LANDING.platformComingSoon}</span>
        )}
      </div>
    </div>
  );

  return (
    <div style={isMobile ? M_PAGE : PAGE}>
      <SiteHeader />
      <div style={isMobile ? M_SHELL : SHELL}>
        {/* --- Hero ---------------------------------------------------------------------------- */}
        <div style={isMobile ? undefined : HERO}>
          <div style={HERO_COL}>
            <h1 style={isMobile ? M_HERO_TITLE : HERO_TITLE}>{UI_LANDING.heroTitle}</h1>
            <p style={isMobile ? M_HERO_LEDE : HERO_LEDE}>{UI_LANDING.heroLede}</p>
            {/* Getting the archive is the first obstacle and by far the biggest — the guide is the
                hero's call to action, not a help link further down the page. */}
            <button
              type="button"
              class="hv-br"
              style={isMobile ? M_CTA : CTA}
              onClick={() => setGuideTarget('pick')}
            >
              {UI_GUIDE.openLabel} <span style={{ fontSize: isMobile ? '15px' : '13px' }}>→</span>
            </button>
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

        {/* --- The two connectors -------------------------------------------------------------- */}
        <div style={isMobile ? M_CARD_COL : PLATFORM_GRID}>
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
        </div>
        <p style={SOON_LINE}>{UI_LANDING.platformSoon}</p>

        {/* --- The right, and what it actually gets you ---------------------------------------- */}
        <div style={isMobile ? M_SECTION : SECTION}>
          <h2 style={isMobile ? M_BIG_TITLE : BIG_TITLE}>{UI_LANDING.rightTitle}</h2>
          <div style={isMobile ? M_CARD_COL : PROSE_GRID}>
            <p style={PROSE}>{UI_LANDING.rightLaw}</p>
            <p style={PROSE}>{UI_LANDING.rightArchive}</p>
            <p style={PROSE}>{UI_LANDING.rightProduct}</p>
          </div>
          <div style={isMobile ? M_CARD_COL : STAT_ROW}>
            <div style={STAT}>
              <span style={STAT_N}>{UI_LANDING.statMessages}</span>
              <span style={STAT_LABEL}>{UI_LANDING.statMessagesLabel}</span>
            </div>
            <div style={STAT}>
              <span style={STAT_N}>{UI_LANDING.statValue}</span>
              <span style={STAT_LABEL}>{UI_LANDING.statValueLabel}</span>
            </div>
          </div>
        </div>

        {/* --- Where the profiles go ----------------------------------------------------------- */}
        <div style={isMobile ? M_SECTION : SECTION}>
          <h2 style={isMobile ? M_BIG_TITLE : BIG_TITLE}>{UI_LANDING.marketTitle}</h2>
          <p style={PROSE}>{UI_LANDING.marketLede}</p>
          <div style={isMobile ? M_CARD_COL : CARD_GRID}>
            {UI_LANDING.consequences.map((c) => (
              <div key={c.title} style={isMobile ? M_STEP_CARD : STEP_CARD}>
                <span style={CONSEQUENCE_KICKER}>{c.kicker}</span>
                <span style={isMobile ? M_CARD_TITLE : CARD_TITLE}>{c.title}</span>
                <span style={isMobile ? M_CARD_TEXT : CARD_TEXT}>{c.text}</span>
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
          <div style={WHY_LINKS}>
            <a href={localeHref(DEMO_PATH)} class="hv-cy" style={isMobile ? M_WHY_LINK : WHY_LINK}>
              {UI_LANDING.whyDemoTikTok}
            </a>
            {INSTAGRAM_LIVE && (
              <a
                href={localeHref(DEMO_PATH)}
                class="hv-cy"
                style={isMobile ? M_WHY_LINK : WHY_LINK}
              >
                {UI_LANDING.whyDemoInstagram}
              </a>
            )}
          </div>
        </div>

        {/* --- Going further ------------------------------------------------------------------- */}
        <div style={isMobile ? M_CARD_COL : RAIL_GRID}>
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
      <span style={isMobile ? M_CARD_TITLE : CARD_TITLE}>{title}</span>
      <p style={RAIL_LEDE}>{lede}</p>
      <div style={RAIL_LINKS}>
        {links.map((l, i) => (
          <a
            key={l.name}
            href={urls[i] ?? '#'}
            target="_blank"
            rel="noreferrer"
            class="hv-bd"
            style={RAIL_LINK}
          >
            <span style={RAIL_LINK_NAME}>{l.name}</span>
            <span style={RAIL_LINK_NOTE}>{l.note}</span>
          </a>
        ))}
      </div>
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
const CARD_TITLE = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textBright,
} as const;
const CARD_TEXT = { fontSize: '11px', lineHeight: 1.7, color: NAVY.textLede } as const;
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
const M_CARD_COL = { display: 'flex', flexDirection: 'column', gap: '14px' } as const;
const M_STEP_CARD = { ...STEP_CARD, gap: '11px', padding: '20px' } as const;
const M_CARD_TITLE = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.45,
  color: NAVY.textBright,
} as const;
const M_CARD_TEXT = { fontSize: '12.5px', lineHeight: 1.7, color: NAVY.textLede } as const;
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

// --- v4 sections ----------------------------------------------------------------------------
const PLATFORM_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '18px',
} as const;
const PLATFORM_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '24px 22px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '16px',
} as const;
const M_PLATFORM_CARD = { ...PLATFORM_CARD, padding: '20px 18px' } as const;
const PLATFORM_NAME = { fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em' } as const;
const PLATFORM_LEDE = {
  margin: 0,
  fontSize: '12px',
  lineHeight: 1.7,
  color: NAVY.textLede,
} as const;
const BULLETS = {
  listStyle: 'none',
  margin: '2px 0 0',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
} as const;
const BULLET = {
  display: 'flex',
  gap: '9px',
  fontSize: '11.5px',
  lineHeight: 1.6,
  color: NAVY.textSecondary,
} as const;
const BULLET_DOT = {
  flex: 'none',
  width: '5px',
  height: '5px',
  borderRadius: '50%',
  marginTop: '6px',
} as const;
const PLATFORM_ACTIONS = {
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
  marginTop: '6px',
} as const;
const PLATFORM_CTA = {
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '12.5px',
  fontWeight: 600,
  color: NAVY.bgPage,
  border: 'none',
  borderRadius: '9px',
  padding: '12px 14px',
} as const;
const PLATFORM_DEMO = {
  fontSize: '11.5px',
  color: NAVY.textMuted,
  textDecoration: 'none',
  textAlign: 'center',
} as const;
const PLATFORM_SOON_TAG = { fontSize: '11px', color: NAVY.textDim, textAlign: 'center' } as const;
const SOON_LINE = {
  margin: 0,
  fontSize: '11.5px',
  color: NAVY.textDim,
  textAlign: 'center',
} as const;
const BIG_TITLE = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
} as const;
const M_BIG_TITLE = { ...BIG_TITLE, fontSize: '19px' } as const;
const PROSE_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '18px',
} as const;
const PROSE = { margin: 0, fontSize: '12px', lineHeight: 1.8, color: NAVY.textLede } as const;
const STAT_ROW = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '18px',
} as const;
const STAT = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  padding: '18px 20px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '14px',
} as const;
const STAT_N = {
  fontSize: '26px',
  fontWeight: 600,
  color: NAVY.accent,
  letterSpacing: '-0.02em',
} as const;
const STAT_LABEL = { fontSize: '11.5px', lineHeight: 1.6, color: NAVY.textLede } as const;
const CONSEQUENCE_KICKER = {
  fontSize: '10px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.textDim,
} as const;
const WHY_LINKS = { display: 'flex', gap: '18px', flexWrap: 'wrap' } as const;
const RAIL_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '18px',
} as const;
const RAIL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '22px 20px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '16px',
} as const;
const M_RAIL = { ...RAIL, padding: '18px 16px' } as const;
const RAIL_LEDE = {
  margin: '0 0 4px',
  fontSize: '11.5px',
  lineHeight: 1.7,
  color: NAVY.textLede,
} as const;
const RAIL_LINKS = { display: 'flex', flexDirection: 'column', gap: '8px' } as const;
const RAIL_LINK = {
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  padding: '11px 13px',
  background: NAVY.bgPage,
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '10px',
  textDecoration: 'none',
} as const;
const RAIL_LINK_NAME = { fontSize: '12px', fontWeight: 500, color: NAVY.textBright } as const;
const RAIL_LINK_NOTE = { fontSize: '11px', lineHeight: 1.5, color: NAVY.textMuted } as const;
