// Pied de page (maquettes « Accueil v2 » / « parcours guidé »).

import { localeHref } from '../../i18n/current';
import { UI_BRAND, UI_FOOTER } from '../copy';
import { NAVY } from './palette';

export function SiteFooter() {
  return (
    <div style={WRAP}>
      <span style={TAGLINE}>{UI_FOOTER.tagline}</span>
      <div style={LINKS}>
        <a href={localeHref('/mentions-legales')} style={LEGAL}>
          {UI_FOOTER.legalLink}
        </a>
        <span style={{ color: NAVY.borderInset }}>·</span>
        <a href={`mailto:${UI_BRAND.contactMail}`} style={MAIL}>
          {UI_BRAND.contactMail}
        </a>
      </div>
      <span style={CREDITS}>{UI_FOOTER.credits}</span>
    </div>
  );
}

const WRAP = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'center',
  textAlign: 'center',
  paddingTop: '20px',
} as const;
const TAGLINE = { fontSize: '10px', lineHeight: 1.6, color: NAVY.textDim } as const;
const LINKS = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
  justifyContent: 'center',
} as const;
const LEGAL = {
  fontSize: '10px',
  lineHeight: 1.4,
  color: NAVY.textMuted,
  borderBottom: `1px solid ${NAVY.borderChip}`,
  textDecoration: 'none',
} as const;
const MAIL = {
  fontSize: '10px',
  lineHeight: 1.4,
  color: NAVY.textMuted,
  textDecoration: 'none',
} as const;
const CREDITS = { fontSize: '9px', lineHeight: 1.6, color: NAVY.textGhost } as const;
