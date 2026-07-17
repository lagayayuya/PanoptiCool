// Pied de page (maquettes « Accueil v2 » / « parcours guidé »).

import { NAVY } from './palette';

export function SiteFooter() {
  return (
    <div style={WRAP}>
      <span style={TAGLINE}>PanoptiCool — tes données restent chez toi.</span>
      <div style={LINKS}>
        <a href="/mentions-legales" style={LEGAL}>
          Mentions légales
        </a>
        <span style={{ color: NAVY.borderInset }}>·</span>
        <a href="mailto:yuya@panopti.cool" style={MAIL}>
          yuya@panopti.cool
        </a>
      </div>
      <span style={CREDITS}>Développé par Yuya et Claude (Sonnet 5, Opus 4.8 et Fable 5)</span>
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
