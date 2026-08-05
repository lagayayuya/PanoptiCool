// The export guide — a modal that walks through asking a platform for your file, screen by screen.
//
// WHY IT IS THE FIRST THING ON THE HOME PAGE. Getting the archive is the real obstacle: the menu is
// buried five levels down, JSON is not the default format, Instagram hands over one year unless you
// ask for all of it, and the file takes days to arrive. Everything else this product does is
// useless to someone who never gets past that. The guide is therefore not help content tucked in a
// corner — it is a step of the journey.
//
// THREE SHAPES, ONE COMPONENT: a platform picker, a carousel of steps, and a final slide about the
// wait that offers a calendar reminder (`ics.ts`). The step count is read from the copy array,
// because the two flows do not have the same number of screens (TikTok 6, Instagram 7).
//
// ─── WHAT IS NOT HERE, AND WHY ──────────────────────────────────────────────────────────────────
//   - NO NETWORK. The screenshots are static assets under `public/guides/**`; the `.ics` is built
//     in memory and handed to a download. Nothing is fetched, nothing is sent — the invariant is
//     not weakened by this feature, and there is no recipient to weaken it toward.
//   - NO PERSISTENCE. Closing the modal forgets the step you were on. A guide someone reads once
//     does not deserve a storage key, and the repo has no cookie banner to justify.
//   - THE CAPTIONS, THE SCREENSHOTS AND THE HOTSPOTS AGE TOGETHER. They were captured on
//     2026-07-31. A platform that moves a menu makes this whole modal quietly wrong — the caption,
//     the picture and the box drawn on it — while every test stays green. No net sees that, and the
//     hotspot is the most brittle of the three: it points at a pixel region, so a re-capture at
//     another crop moves the target without moving anything a compiler reads. When a step is
//     re-captured, `TARGETS` below is re-checked in the same pass — against the new asset, on
//     screen, in both languages.

import { useEffect, useRef, useState } from 'preact/hooks';
import { currentLocale } from '../../i18n/current';
import { type Locale, siteUrl } from '../../i18n/locales';
import { UI_GUIDE } from '../copy';
import { buildReminderIcs } from './ics';
import { NAVY } from './palette';
import { useIsMobile } from './useIsMobile';

export type GuidePlatform = 'tiktok' | 'instagram';

/** Where the modal opens: on the picker, or straight into one platform's steps. */
export type GuideTarget = 'pick' | GuidePlatform;

interface Props {
  target: GuideTarget;
  onClose: () => void;
}

/** ⚠ INSTAGRAM FIRST, here and everywhere the two are offered together: it is the richer export and
 *  the one the product leads with. The order is the product's answer to « which one? ». */
const PLATFORMS: readonly GuidePlatform[] = ['instagram', 'tiktok'];

/** Each platform's page, WITHOUT the language — `localeHref`/`siteUrl` prefix it. Same spine as
 *  `LandingPage`'s and `DropScreen`'s; a path is an address, not prose. */
const ROUTE: Record<GuidePlatform, string> = { instagram: '/instagram', tiktok: '/tiktok' };

/** Accent per platform — the only thing that changes colour between the two guides. */
const ACCENT: Record<GuidePlatform, string> = {
  tiktok: NAVY.accent,
  instagram: '#f0a0d8',
};

function guideOf(platform: GuidePlatform) {
  return platform === 'tiktok' ? UI_GUIDE.tiktok : UI_GUIDE.instagram;
}

/**
 * The control to tap, framed on each screenshot — `{x, y, w, h}` as PERCENTAGES of the image box.
 *
 * WHY PERCENTAGES AND NOT A BAKED-IN FRAME. Drawing the box into the 26 assets would mean
 * re-exporting all of them to move one rectangle, and would burn the highlight into a file that a
 * later capture replaces. As an overlay it stays adjustable, it costs no bytes, and the screenshots
 * stay what they are: unaltered pictures of someone else's app.
 *
 * They are geometry, not prose, so they do NOT live in `copy.*`.
 *
 * `null` means there is nothing to tap on that screen — the last Instagram step is a confirmation,
 * and framing something there would invent an action.
 *
 * ⚠ ONE TABLE PER LANGUAGE, AND THAT IS NOT REDUNDANCY. The obvious economy — one rectangle per
 * step, since the two captures show the same screen — was tried and is wrong: the platforms wrap
 * their own text differently in French and English, so a description that runs to three lines in
 * one language and four in the other pushes every row below it down. Measured, not supposed:
 * « Vos informations et autorisations » sits 3 % lower than « Your information and permissions »,
 * « Télécharger tes données » 4 % lower than « Download your data ». A shared rectangle either
 * misses in one language or grows tall enough to frame the neighbouring row in both. No re-crop
 * fixes this — it is the app's layout, not the capture's framing.
 *
 * ⚠ EVERY RECTANGLE BELOW WAS MEASURED ON SCREEN, off a percentage grid laid over the real asset,
 * in the language it belongs to. They are tied to the captures of 2026-07-31: a re-capture moves
 * the rows, and nothing here will go red about it.
 */
interface Target {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

const TARGETS: Record<GuidePlatform, Record<Locale, readonly (Target | null)[]>> = {
  tiktok: {
    fr: [
      { x: 89, y: 3, w: 9, h: 7 }, // the ☰ menu, top right of the profile
      { x: 22, y: 65, w: 73, h: 9 }, // « Paramètres et confidentialité », bottom of the menu
      { x: 3, y: 84, w: 94, h: 9 }, // « Compte », in the Account section
      { x: 3, y: 92, w: 94, h: 8 }, // « Télécharger tes données », last row
      { x: 5, y: 59, w: 90, h: 10 }, // the JSON row of the format picker
      { x: 50, y: 13, w: 45, h: 7 }, // the « Télécharger les données » tab
    ],
    en: [
      { x: 89, y: 3, w: 9, h: 7 },
      { x: 22, y: 65, w: 73, h: 9 },
      { x: 3, y: 83, w: 94, h: 9 },
      // 4 % higher than the French: « Vérification de l'entreprise » takes three lines of
      // description where « Business verification » takes two, and the rows below move with it.
      { x: 3, y: 88, w: 94, h: 9 },
      { x: 5, y: 59, w: 90, h: 10 },
      { x: 50, y: 13, w: 45, h: 7 },
    ],
  },
  instagram: {
    fr: [
      { x: 4, y: 30, w: 92, h: 18 }, // « Espace Comptes », description included
      { x: 4, y: 73, w: 92, h: 9 }, // « Vos informations et autorisations »
      { x: 4, y: 42, w: 92, h: 9 }, // « Exporter vos informations »
      { x: 4, y: 40, w: 92, h: 8 }, // the « Créer une exportation » button
      { x: 5, y: 39, w: 90, h: 9 }, // « Exporter sur mon appareil »
      { x: 6, y: 50, w: 88, h: 35 }, // the three rows: period, format, media quality
      null, // confirmation screen — nothing to tap
    ],
    en: [
      // The English description runs to three lines where the French takes four, so the block is
      // shorter — same top, smaller height.
      { x: 4, y: 30, w: 92, h: 15 },
      { x: 4, y: 70, w: 92, h: 9 },
      { x: 4, y: 42, w: 92, h: 9 },
      { x: 4, y: 37, w: 92, h: 8 },
      { x: 5, y: 35, w: 90, h: 9 },
      { x: 6, y: 50, w: 88, h: 35 },
      null,
    ],
  },
};

/** `?? null` because `noUncheckedIndexedAccess` widens the lookup, and the wait slide indexes one
 *  past the end of the array. */
function hotspotAt(platform: GuidePlatform, locale: Locale, step: number): Target | null {
  return TARGETS[platform][locale][step] ?? null;
}

/**
 * Builds the reminder and hands it to the browser as a download.
 *
 * The object URL is revoked on a timer rather than immediately: Safari has to have started the
 * download before the URL dies, and there is no event that says it has.
 */
function downloadReminder(platform: GuidePlatform): void {
  const now = new Date();
  const ics = buildReminderIcs(
    {
      summary:
        platform === 'tiktok' ? UI_GUIDE.reminderSummaryTikTok : UI_GUIDE.reminderSummaryInstagram,
      description: UI_GUIDE.reminderDescription,
      // `siteUrl`, NOT `location.origin`: the reminder is read days later, on a phone, by a
      // calendar that will follow that link. `location.origin` writes down wherever the page
      // happened to be served from — it shipped `http://localhost:8080/fr/tiktok` from a dev
      // server, which is a link to nothing on anyone else's machine.
      // ⚠ THE PLATFORM'S OWN PAGE, not TikTok's. This read `'/tiktok'` outright, so the reminder for
      // an Instagram export — set days in advance, opened on a phone — landed the reader on the
      // other connector's drop screen.
      url: siteUrl(currentLocale(), ROUTE[platform]),
    },
    now,
    `panopticool-${platform}-${now.getTime()}@panopti.cool`,
  );
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `panopticool-${platform}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function ExportGuide({ target, onClose }: Props) {
  const isMobile = useIsMobile();
  const [platform, setPlatform] = useState<GuidePlatform | null>(target === 'pick' ? null : target);
  const [step, setStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Escape closes, and the dialog takes focus on open — a modal that traps the eye but not the
  // keyboard is a modal only for people using a mouse.
  useEffect(() => {
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const steps = platform === null ? [] : guideOf(platform).steps;
  // NOT named `target` — that is the prop saying which slide the modal opens on. The two are
  // different things, and the collision typechecked as `'pick'.x`.
  // `?? null` because `noUncheckedIndexedAccess` makes the lookup `Target | null | undefined`, and
  // the wait slide indexes one past the end.
  const hotspot = platform === null ? null : hotspotAt(platform, currentLocale(), step);
  // One slide past the last step: the wait, and the calendar reminder.
  const lastIndex = steps.length;
  const onWaitSlide = step === lastIndex;

  function go(delta: number): void {
    setStep((s) => Math.min(lastIndex, Math.max(0, s + delta)));
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: the backdrop duplicates Escape (handler above) and the ✕ button — it is not the only way out.
    // biome-ignore lint/a11y/noStaticElementInteractions: closing veil, not a control — the ✕ button stays the accessible path.
    <div style={BACKDROP} onClick={onClose}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: only stops the propagation of the backdrop click. */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={platform === null ? UI_GUIDE.pickTitle : guideOf(platform).label}
        tabIndex={-1}
        style={isMobile ? M_DIALOG : DIALOG}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={TOP_ROW}>
          {platform !== null && target === 'pick' ? (
            <button
              type="button"
              style={GHOST_BTN}
              onClick={() => {
                setPlatform(null);
                setStep(0);
              }}
            >
              ← {UI_GUIDE.back}
            </button>
          ) : (
            <span />
          )}
          <button type="button" style={GHOST_BTN} onClick={onClose} aria-label={UI_GUIDE.close}>
            ✕
          </button>
        </div>

        {platform === null ? (
          <>
            <h2 style={TITLE}>{UI_GUIDE.pickTitle}</h2>
            <p style={LEDE}>{UI_GUIDE.pickLede}</p>
            <div style={isMobile ? M_PICK_ROW : PICK_ROW}>
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  // The name is not left to the nested spans: a card whose accessible name is
                  // computed from two stacked paragraphs announces the whole lede.
                  aria-label={guideOf(p).label}
                  class="hv-bd"
                  style={{ ...PICK_CARD, borderColor: NAVY.borderChip }}
                  onClick={() => {
                    setPlatform(p);
                    setStep(0);
                  }}
                >
                  <span style={{ ...PICK_NAME, color: ACCENT[p] }}>{guideOf(p).label}</span>
                  <span style={PICK_LEDE}>{guideOf(p).lede}</span>
                </button>
              ))}
            </div>
          </>
        ) : onWaitSlide ? (
          <div style={WAIT_BOX}>
            <h2 style={TITLE}>{UI_GUIDE.waitTitle}</h2>
            <p style={LEDE}>{UI_GUIDE.waitText}</p>
            <button
              type="button"
              class="hv-br"
              style={{ ...REMINDER_BTN, background: ACCENT[platform] }}
              onClick={() => downloadReminder(platform)}
            >
              {UI_GUIDE.reminderButton}
            </button>
            <p style={NOTE}>{UI_GUIDE.reminderNote}</p>
          </div>
        ) : (
          <>
            <p style={STEP_COUNT}>{UI_GUIDE.stepOf(step + 1, steps.length)}</p>
            <p style={STEP_TEXT}>{steps[step]?.text}</p>
            <div style={SHOT_WRAP}>
              <img
                src={`/guides/${platform}/${currentLocale()}/0${step + 1}.webp`}
                alt={steps[step]?.alt ?? ''}
                width={540}
                height={720}
                style={SHOT}
              />
              {/* Decoration, hence `aria-hidden`: the caption above already says where to tap, in
                  words. The frame repeats it for the eye, it does not carry it. */}
              {hotspot != null && (
                <span
                  aria-hidden="true"
                  style={{
                    ...TARGET_BOX,
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    width: `${hotspot.w}%`,
                    height: `${hotspot.h}%`,
                  }}
                />
              )}
            </div>
          </>
        )}

        {platform !== null && (
          <div style={NAV_ROW}>
            <button
              type="button"
              style={step === 0 ? NAV_BTN_OFF : NAV_BTN}
              disabled={step === 0}
              onClick={() => go(-1)}
            >
              ← {UI_GUIDE.previous}
            </button>
            <div style={DOTS}>
              {Array.from({ length: steps.length + 1 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  // The last dot is the wait slide, not a step: `stepOf` would announce
                  // « Step 8 of 7 », which is what it did before this branch existed.
                  aria-label={
                    i === lastIndex ? UI_GUIDE.waitDot : UI_GUIDE.stepOf(i + 1, steps.length)
                  }
                  style={{
                    ...DOT,
                    background: i === step ? ACCENT[platform] : NAVY.borderChip,
                  }}
                  onClick={() => setStep(i)}
                />
              ))}
            </div>
            <button
              type="button"
              style={onWaitSlide ? NAV_BTN_OFF : NAV_BTN}
              disabled={onWaitSlide}
              onClick={() => go(1)}
            >
              {UI_GUIDE.next} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const BACKDROP = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  background: 'rgba(7,11,24,.82)',
  backdropFilter: 'blur(6px)',
} as const;
const DIALOG = {
  position: 'relative',
  width: '100%',
  maxWidth: '520px',
  maxHeight: '92vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '18px 22px 22px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '16px',
  textAlign: 'center',
} as const;
const M_DIALOG = { ...DIALOG, maxWidth: '100%', padding: '14px 14px 18px' } as const;
const TOP_ROW = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as const;
const GHOST_BTN = {
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '11px',
  color: NAVY.textMuted,
  background: 'transparent',
  border: 'none',
  padding: '6px 4px',
} as const;
const TITLE = {
  margin: 0,
  fontSize: '17px',
  fontWeight: 500,
  lineHeight: 1.3,
  color: NAVY.textBright,
} as const;
const LEDE = { margin: 0, fontSize: '12px', lineHeight: 1.7, color: NAVY.textLede } as const;
const NOTE = { margin: 0, fontSize: '10.5px', lineHeight: 1.6, color: NAVY.textDim } as const;
const PICK_ROW = { display: 'flex', gap: '12px', marginTop: '4px' } as const;
const M_PICK_ROW = { ...PICK_ROW, flexDirection: 'column' } as const;
const PICK_CARD = {
  flex: 1,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  padding: '16px 14px',
  fontFamily: 'inherit',
  textAlign: 'left',
  background: NAVY.bgPage,
  border: '1px solid',
  borderRadius: '12px',
} as const;
const PICK_NAME = { fontSize: '14px', fontWeight: 600 } as const;
const PICK_LEDE = { fontSize: '11px', lineHeight: 1.6, color: NAVY.textMuted } as const;
const STEP_COUNT = {
  margin: 0,
  fontSize: '10.5px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: NAVY.textDim,
} as const;
const STEP_TEXT = {
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.6,
  color: NAVY.textBright,
  minHeight: '42px',
} as const;
// The 26 assets are all 540×720. `aspectRatio` reserves exactly that, so the box neither
// letterboxes today nor resizes under the reader's cursor when they step through; `contain` is the
// safety net for a re-capture at another ratio, which then letterboxes instead of moving the modal.
// The frame is positioned against THIS box, not against the image: `object-fit: contain` would let
// a differently-proportioned asset float inside its box, and the percentages would then point at
// the letterbox instead of at the control. The wrapper carries the same ratio as the assets, so the
// two coincide — and if they ever stop, the frame is wrong in a way that is visible at a glance.
const SHOT_WRAP = {
  position: 'relative',
  width: '100%',
  maxWidth: '288px',
  aspectRatio: '3 / 4',
  flexShrink: 0,
  margin: '0 auto',
} as const;
const TARGET_BOX = {
  position: 'absolute',
  boxSizing: 'border-box',
  border: `2px solid ${NAVY.accent}`,
  borderRadius: '7px',
  // The halo is what makes the frame readable over a white screenshot as much as over a dark one.
  boxShadow: `0 0 0 3px rgba(47,212,240,.22), 0 0 12px rgba(47,212,240,.35)`,
  pointerEvents: 'none',
} as const;
const SHOT = {
  display: 'block',
  width: '100%',
  maxWidth: '288px',
  // ⚠ `height: auto` is LOAD-BEARING, and not obvious. The `height` attribute on the `<img>` — kept
  // for the layout reservation — is a presentational hint that makes the used height DEFINITE, and
  // `aspect-ratio` is ignored the moment both dimensions are. The box then fell back to the
  // intrinsic 720px and the column's flex-shrink squashed it to whatever was left: measured at
  // 288×539 instead of 288×384, i.e. the screenshot rendered at the wrong ratio inside `contain`.
  height: 'auto',
  aspectRatio: '3 / 4',
  // ...and once the ratio governs, the box must not be squashed either: the dialog scrolls
  // (`overflowY: auto`), so refusing to shrink is what keeps the proportions on a short viewport.
  flexShrink: 0,
  objectFit: 'contain',
  margin: '0 auto',
  borderRadius: '10px',
  border: `1px solid ${NAVY.borderChip}`,
  background: NAVY.bgPage,
} as const;
const WAIT_BOX = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '18px 0 6px',
} as const;
const REMINDER_BTN = {
  cursor: 'pointer',
  alignSelf: 'center',
  fontFamily: 'inherit',
  fontSize: '12px',
  fontWeight: 600,
  color: NAVY.bgPage,
  border: 'none',
  borderRadius: '9px',
  padding: '11px 18px',
} as const;
const NAV_ROW = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  marginTop: '2px',
} as const;
const NAV_BTN = {
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '11px',
  color: NAVY.textSecondary,
  background: 'transparent',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '8px',
  padding: '8px 11px',
} as const;
const NAV_BTN_OFF = {
  ...NAV_BTN,
  color: NAVY.textDim,
  cursor: 'not-allowed',
  opacity: 0.5,
} as const;
const DOTS = { display: 'flex', gap: '6px' } as const;
const DOT = {
  cursor: 'pointer',
  width: '7px',
  height: '7px',
  padding: 0,
  border: 'none',
  borderRadius: '50%',
} as const;
