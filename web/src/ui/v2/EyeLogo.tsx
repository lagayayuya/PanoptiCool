// Œil PanoptiCool animé (maquettes « Accueil v2 » / « parcours guidé ») : le logo PNG + un faisceau
// lumineux découpé à la forme du logo par un masque CSS, orienté vers le curseur. L'angle est écrit
// DIRECTEMENT dans une variable CSS (`--ang`) via le DOM — jamais dans l'état Preact : un re-render
// par mousemove serait un gâchis pur pour un effet purement décoratif.

import { useEffect, useRef } from 'preact/hooks';

const LOGO_SRC = '/logo.png';

/** Faisceau + point lumineux, sous masque du logo — enfants du conteneur positionné. */
function Glow({ blur, withPupil }: { blur: number; withPupil?: boolean }) {
  return (
    <div style={MASK}>
      <div style={{ ...BEAM, filter: `blur(${blur}px)` }} />
      {withPupil && <div style={PUPIL} />}
    </div>
  );
}

/**
 * `variant` :
 *   - `header` — vignette 58×34 (l'œil recadré dans la barre), faisceau net ;
 *   - `hero`   — pleine largeur, ratio natif du PNG (1080×607), faisceau diffus + pupille.
 */
export function EyeLogo({ variant }: { variant: 'header' | 'hero' }) {
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = eyeRef.current;
      if (el === null) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.46;
      const ang = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
      el.style.setProperty('--ang', `${ang.toFixed(1)}deg`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (variant === 'header') {
    return (
      <div style={HEADER_CROP}>
        <div ref={eyeRef} style={HEADER_EYE}>
          <img src={LOGO_SRC} alt="PanoptiCool" style={IMG} />
          <Glow blur={1} />
        </div>
      </div>
    );
  }
  return (
    <div ref={eyeRef} style={HERO_EYE}>
      <img src={LOGO_SRC} alt="" style={IMG} />
      <Glow blur={3} withPupil />
    </div>
  );
}

const HEADER_CROP = {
  width: '58px',
  height: '34px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
} as const;
const HEADER_EYE = { position: 'relative', width: '118px', height: '66px', flex: 'none' } as const;
const HERO_EYE = { position: 'relative', width: '100%', aspectRatio: '1080 / 607' } as const;
const IMG = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
} as const;
const MASK = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  mixBlendMode: 'screen',
  WebkitMaskImage: `url('${LOGO_SRC}')`,
  maskImage: `url('${LOGO_SRC}')`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
} as const;
const BEAM = {
  position: 'absolute',
  left: '50%',
  top: '27%',
  width: '46%',
  height: '38%',
  transform: 'rotate(var(--ang, 32deg))',
  transformOrigin: '0 50%',
  clipPath: 'polygon(0 46%, 100% 0%, 100% 100%, 0 54%)',
  background:
    'linear-gradient(90deg, rgba(235,250,255,.9), rgba(190,235,255,.4) 55%, rgba(150,220,245,0) 96%)',
} as const;
const PUPIL = {
  position: 'absolute',
  left: '50%',
  top: '46%',
  width: '26px',
  height: '26px',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(235,250,255,.8), rgba(190,235,255,0) 70%)',
} as const;
