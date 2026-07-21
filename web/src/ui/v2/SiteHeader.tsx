// Barre de site sticky (maquettes « Accueil v2 » / « parcours guidé » + variantes Mobile) :
// œil + wordmark, badge contextuel optionnel (« démo · données fictives »), sélecteur de langue et
// lien GitHub. Sur MOBILE (maquettes « … Mobile ») : paddings resserrés, cibles tactiles ≥ 44 px,
// GitHub en icône seule, badge masqué (pas la place à 390 px — l'info « démo » passe dans le kicker
// du héros, cf. ResultsView), et un SOMMAIRE optionnel en chips horizontales scrollables sous la
// barre (le parcours n'a pas de sidebar sur mobile).
//
// LE SÉLECTEUR DE LANGUE EST TOUJOURS VISIBLE, y compris quand une seule langue est publiée.
// C'est délibéré et ça se paye d'un bouton inerte : il ANNONCE que le site a une notion de langue.
// Le jour où une bannière suggérera l'anglais à qui arrive en `navigator.language: en`, cette
// suggestion devra être CORRIGEABLE d'un geste visible — un produit qui dit à quelqu'un ce qu'il a
// déduit de lui doit lui laisser la main sur cette déduction, sous peine de démontrer le problème
// qu'il dénonce. Un sélecteur qui n'apparaîtrait qu'une fois l'anglais prêt laisserait ce geste
// sans place.
//
// Une langue déclarée mais non publiée reste INERTE (info-bulle « bientôt disponible ») : elle se
// voit, elle ne se clique pas. L'état actif se lit sur la page (`<html lang>`), et n'est stocké
// nulle part — la persistance viendra avec la bannière de suggestion, pas avant.

import { currentLocale, currentPath, localeHref } from '../../i18n/current';
import { isPublished, LOCALES, type Locale, localePath } from '../../i18n/locales';
import { UI_BRAND, UI_HEADER } from '../copy';
import { EyeLogo } from './EyeLogo';
import { NAVY } from './palette';
import { useIsMobile } from './useIsMobile';

const GITHUB_URL = UI_BRAND.githubUrl;

/** Entrée du sommaire mobile (chips sous la barre). `muted` : section indisponible sur mobile
 * (IA locale) — chip pointillée, texte éteint, mais le lien reste (l'encart explique pourquoi). */
export interface TocChip {
  n: string;
  label: string;
  href: string;
  muted?: boolean;
}

function GitHubIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function SiteHeader({ badge, toc }: { badge?: string; toc?: readonly TocChip[] }) {
  const isMobile = useIsMobile();

  const active = currentLocale();
  const here = currentPath();
  const langGroup = (
    // biome-ignore lint/a11y/useSemanticElements: un <fieldset> imposerait son chrome de formulaire — deux contrôles suffisent (markup de la maquette).
    <div role="group" aria-label={UI_HEADER.langGroupAriaLabel} style={LANG_GROUP}>
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
        // Publiée : un vrai lien vers LA MÊME page. Non publiée : un bouton mort qui le dit.
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
          {langGroup}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={UI_HEADER.githubAriaLabel}
            class="hv-cy"
            style={M_GH_LINK}
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
/** Le libellé de chaque langue — un code, pas de la prose : il ne se traduit pas d'une langue à
 * l'autre (« FR » reste « FR » sur le site anglais). Les chaînes vivent au catalogue. */
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
/** Ce qu'il faut à un <a> pour se poser dans le groupe comme le fait un <button> : ni soulignement,
 * ni ligne de base décalée. Les cotes (taille, padding) restent celles de `LANG_BASE`. */
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

// --- Variante mobile (maquettes « … Mobile » : cibles 44 px, GitHub icône seule) -------------------
const M_WRAP = {
  position: 'sticky',
  top: 0,
  zIndex: 50,
  background: 'rgba(7,11,24,.88)',
  backdropFilter: 'blur(12px)',
  borderBottom: `1px solid ${NAVY.borderHeader}`,
} as const;
// Le fond de la barre couvre toute la largeur (M_WRAP), mais le CONTENU s'aligne sur la colonne
// 480 px du reste de la page (M_SHELL) — sinon logo et wordmark flottent au bord sur tablette.
const M_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
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
const M_WORDMARK = {
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  color: NAVY.textBright,
  textDecoration: 'none',
} as const;
const M_LANG_BASE = {
  ...LANG_BASE,
  fontSize: '12px',
  padding: '13px 13px',
  minHeight: '44px',
} as const;
const M_LANG_ON = { ...M_LANG_BASE, color: NAVY.bgPage, background: NAVY.accent } as const;
const M_LANG_OFF = {
  ...M_LANG_BASE,
  color: NAVY.textMuted,
  background: 'transparent',
  cursor: 'default',
} as const;
const M_GH_LINK = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
