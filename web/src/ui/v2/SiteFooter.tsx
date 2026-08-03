// Footer — « Accueil v4 » and « PanoptiCool v5 Web » give it the SAME shape, so it is written once:
// a ruled row, tagline at the left, links and credits pushed right. v4 stacked it centred at
// 9–10 px, which is below the size at which a legal notice is a link one can actually aim at.

import { localeHref } from '../../i18n/current';
import { UI_BRAND, UI_FOOTER } from '../copy';
import { NAVY } from './palette';

export function SiteFooter() {
  return (
    <div style={WRAP}>
      <span style={TAGLINE}>{UI_FOOTER.tagline}</span>
      <span style={SPACER} />
      <a href={localeHref('/mentions-legales')} class="hv-a" style={LINK}>
        {UI_FOOTER.legalLink}
      </a>
      <a href={`mailto:${UI_BRAND.contactMail}`} class="hv-a" style={LINK}>
        {UI_BRAND.contactMail}
      </a>
      <span style={CREDITS}>{UI_FOOTER.credits}</span>
    </div>
  );
}

const WRAP = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  flexWrap: 'wrap',
  borderTop: `1px solid ${NAVY.borderHeader}`,
  paddingTop: '28px',
  marginTop: '12px',
} as const;
const TAGLINE = { fontSize: '13px', lineHeight: 1.6, color: NAVY.textMuted } as const;
const SPACER = { flex: 1 } as const;
const LINK = {
  fontSize: '13px',
  lineHeight: 1.5,
  color: '#a7b2cd',
  textDecoration: 'none',
} as const;
const CREDITS = { fontSize: '13px', lineHeight: 1.6, color: NAVY.textMuted } as const;
