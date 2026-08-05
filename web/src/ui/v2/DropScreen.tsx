// « Dépose ton export » — the one entry screen, for both connectors.
//
// ⚠ WHY IT IS SHARED. Instagram used to have a front door of its own on `/instagram`: its own
// kicker, its own title, its own guarantees, its own pair of buttons — a second first screen, for a
// journey the home page already opens. Two doors to the same room is two places to say the same
// promise and two chances to say it differently, and the home page's consent modal only knew how to
// walk toward one of them. So the Instagram landing is gone (Yul's decision) and both platforms
// arrive here, from `/fr` and `/en`, through the same modal.
//
// WHAT DIFFERS BETWEEN THE TWO IS PASSED IN, and it is not decoration:
//   - Instagram has a SECOND ROUTE (the unzipped folder, Chromium only) and an archive that can
//     weigh gigabytes, so it hands `extras` a button and a note that TikTok has nothing to say about;
//   - Instagram reads message content on demand, so it states three guarantees where TikTok's lede
//     is the whole promise.
// Everything else — the measure, the drop zone, the two actions, the footer — is one component.
//
// ─── WHAT THIS SCREEN DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT DOES NOT READ THE FILE. It hands a `File` to whoever rendered it; the two journeys open it
//     very differently (one buffer for TikTok, a zip central directory for Instagram) and neither
//     belongs to a drop zone;
//   - IT DOES NOT KNOW WHETHER THE FILE IS THE RIGHT ONE. `error` comes back from the engine.

import type { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { localeHref } from '../../i18n/current';
import { UI_ANALYSE, UI_GUIDE, UI_LANDING } from '../copy';
import { ExportGuide, type GuidePlatform } from './ExportGuide';
import { NAVY } from './palette';
import { SiteFooter } from './SiteFooter';
import { useIsMobile } from './useIsMobile';

/** Each platform's route, WITHOUT the language — `localeHref` prefixes it. The demo link is this
 *  same path with `?demo`. A path is an address, not prose, so it does not live in `copy.*`. */
const ROUTE: Record<GuidePlatform, string> = { tiktok: '/tiktok', instagram: '/instagram' };

/** ⚠ NOT `.zip` ALONE. macOS reports some archives with a MIME type the extension filter then
 *  hides, and a picker that greys out the right file is indistinguishable from one that is broken.
 *  Reported on the Instagram route, which is where the archives are large enough to be repacked. */
const ACCEPT = '.zip,application/zip,application/x-zip-compressed';

interface Props {
  platform: GuidePlatform;
  /** The picked or dropped file. Nothing is read here. */
  onFile: (file: File) => void;
  /** A failure from the engine, shown under the zone. */
  error?: string | undefined;
  /** Rendered between the zone and the two actions — the second route and the size note, which
   *  only Instagram has. */
  extras?: ComponentChildren;
  /** What the platform promises about its own export. Empty for TikTok: its lede says it all. */
  guarantees?: readonly string[];
}

export function DropScreen({ platform, onFile, error, extras, guarantees }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const isMobile = useIsMobile();

  const name = platform === 'instagram' ? UI_LANDING.instagramName : UI_LANDING.tiktokName;

  const pick = (file: File | undefined) => {
    if (file !== undefined) onFile(file);
  };

  return (
    <>
      <div style={isMobile ? M_SHELL : SHELL}>
        <span style={KICKER}>{UI_ANALYSE.kicker}</span>
        <h1 style={isMobile ? M_TITLE : TITLE}>
          {isMobile ? UI_ANALYSE.titleMobile(name) : UI_ANALYSE.titleDesktop(name)}
        </h1>
        <p style={LEDE}>
          {UI_ANALYSE.ledeLead}
          {isMobile ? UI_ANALYSE.ledeMobile(name) : UI_ANALYSE.ledeDesktop(name)}
        </p>

        {/* Mobile: a large touch button « Choisir mon fichier » — drag & drop does not exist with a
            finger, so we do not speak of « glisser ». Desktop: the classic drop zone. */}
        {isMobile ? (
          <label style={M_PICK_BTN}>
            <span style={M_PICK_ICON} aria-hidden="true">
              ⇪
            </span>
            <span style={M_PICK_MAIN}>{UI_ANALYSE.pickButtonMobile}</span>
            <input
              type="file"
              accept={ACCEPT}
              style={FILE_INPUT}
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                e.currentTarget.value = '';
                pick(file);
              }}
            />
          </label>
        ) : (
          <label
            style={dragOver ? DROPZONE_OVER : DROPZONE}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              pick(e.dataTransfer?.files?.[0]);
            }}
          >
            <span style={DROP_ICON} aria-hidden="true">
              ⇣
            </span>
            <span style={DROP_MAIN}>{UI_ANALYSE.dropMain}</span>
            <span style={DROP_SUB}>{UI_ANALYSE.dropSub}</span>
            <input
              type="file"
              accept={ACCEPT}
              style={FILE_INPUT}
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                e.currentTarget.value = '';
                pick(file);
              }}
            />
          </label>
        )}

        {extras}
        {error !== undefined && <p style={ERROR}>{error}</p>}

        {/* ⚠ THE GUIDE REPLACES A PARAGRAPH OF MENU PATH. This screen used to spell out TikTok's
            five taps in one grey sentence — true for one platform, invisible to whoever needs it,
            and impossible to write twice over for an Instagram flow that runs seven screens. The
            button opens the same guide the home page's call to action does, on this platform. */}
        <div style={ACTION_ROW}>
          <button type="button" class="hv-cta" style={GUIDE_BTN} onClick={() => setGuideOpen(true)}>
            {UI_GUIDE.openLabel}
            <span style={ARROW}>→</span>
          </button>
          <a href={localeHref(`${ROUTE[platform]}?demo`)} class="hv-bd" style={DEMO_BTN}>
            {UI_ANALYSE.hintDemoLink}
          </a>
        </div>

        {guarantees !== undefined && guarantees.length > 0 && (
          <ul style={GUARANTEES}>
            {guarantees.map((g) => (
              <li key={g} style={GUARANTEE}>
                <span style={GUARANTEE_DOT} />
                {g}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ⚠ WHAT HOLDS THE FOOTER DOWN IS `flex: 1` ON THE SHELL ABOVE, not anything here: each
          journey's page is a flex column filling the viewport, the shell takes the slack, and the
          footer lands on the bottom edge. It used to sit right under the last line of a 720 px
          column, leaving a third of a screen of empty navy under it on any normal display. */}
      <div style={isMobile ? M_FOOTER_WRAP : FOOTER_WRAP}>
        <SiteFooter />
      </div>

      {guideOpen && <ExportGuide target={platform} onClose={() => setGuideOpen(false)} />}
    </>
  );
}

// --- Styles ---------------------------------------------------------------------------------------
// ⚠ THE SITE'S MEASURE (1080 / 40), not the 720 this screen used to keep for itself. At 720 the drop
// zone sat in a narrow well while every other page of the site ran to 1080, and the step that starts
// the journey looked like a dialog someone had left open on top of it.
const SHELL = {
  flex: 1,
  width: '100%',
  boxSizing: 'border-box',
  maxWidth: '1080px',
  margin: '0 auto',
  padding: '72px 40px 56px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
} as const;
const M_SHELL = { ...SHELL, maxWidth: '480px', padding: '36px 20px 40px' } as const;
const FOOTER_WRAP = { padding: '0 40px 40px' } as const;
const M_FOOTER_WRAP = { padding: '0 20px 28px' } as const;

const KICKER = {
  fontSize: '11px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const TITLE = {
  margin: 0,
  fontSize: '38px',
  fontWeight: 600,
  lineHeight: 1.15,
  letterSpacing: '-0.025em',
  color: NAVY.textBright,
} as const;
const M_TITLE = { ...TITLE, fontSize: '27px' } as const;
const LEDE = {
  margin: 0,
  fontSize: '15px',
  lineHeight: 1.75,
  color: NAVY.textLede,
  maxWidth: '720px',
} as const;

const DROPZONE = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '72px 24px',
  marginTop: '8px',
  background: NAVY.bgCard,
  border: `2px dashed ${NAVY.borderChip}`,
  borderRadius: '18px',
  cursor: 'pointer',
  textAlign: 'center',
} as const;
const DROPZONE_OVER = {
  ...DROPZONE,
  border: `2px dashed ${NAVY.accent}`,
  background: NAVY.accentBgSoft,
} as const;
const DROP_ICON = { fontSize: '30px', color: NAVY.accent, lineHeight: 1 } as const;
const DROP_MAIN = { fontSize: '16px', fontWeight: 500, color: NAVY.textBright } as const;
const DROP_SUB = { fontSize: '12px', color: NAVY.textMuted } as const;
const FILE_INPUT = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
} as const;
const ERROR = { margin: 0, fontSize: '13px', lineHeight: 1.6, color: NAVY.risk } as const;

const ACTION_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
  paddingTop: '8px',
} as const;
const GUIDE_BTN = {
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
const ARROW = { fontSize: '15px', lineHeight: 1, color: NAVY.textMuted } as const;
const DEMO_BTN = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.2,
  color: '#a7b2cd',
  background: 'transparent',
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '12px',
  padding: '15px 20px',
  textDecoration: 'none',
} as const;

const GUARANTEES = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  margin: '8px 0 0',
  padding: 0,
  listStyle: 'none',
} as const;
const GUARANTEE = {
  display: 'flex',
  gap: '11px',
  fontSize: '14px',
  lineHeight: 1.55,
  color: NAVY.textMuted,
} as const;
const GUARANTEE_DOT = {
  width: '5px',
  height: '5px',
  borderRadius: '50%',
  background: NAVY.accent,
  flex: 'none',
  marginTop: '9px',
} as const;

// MOBILE selection button (no touch drag & drop): a full-width target ≥ 56 px.
const M_PICK_BTN = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '56px',
  marginTop: '8px',
  padding: '16px 20px',
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
  borderRadius: '14px',
  cursor: 'pointer',
} as const;
const M_PICK_ICON = { fontSize: '18px', color: NAVY.accent, lineHeight: 1 } as const;
const M_PICK_MAIN = { fontSize: '14px', fontWeight: 600, color: NAVY.accentBright } as const;
