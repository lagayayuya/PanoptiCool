// Animated PanoptiCool eye (« Accueil v2 » / « parcours guidé » mockups): the PNG logo + a light
// beam cut to the logo's shape by a CSS mask, oriented toward the cursor. The angle is written
// DIRECTLY into a CSS variable (`--ang`) via the DOM — never into the Preact state: a re-render
// per mousemove would be pure waste for a purely decorative effect.

import { useEffect, useRef } from 'preact/hooks';

const LOGO_SRC = '/logo.png';

/** Beam + light dot, under the logo mask — children of the positioned container. */
function Glow({ blur, withPupil }: { blur: number; withPupil?: boolean }) {
  return (
    <div style={MASK}>
      <div style={{ ...BEAM, filter: `blur(${blur}px)` }} />
      {withPupil && <div style={PUPIL} />}
    </div>
  );
}

/**
 * `variant`:
 *   - `header` — 58×34 thumbnail (the eye cropped in the bar), sharp beam;
 *   - `hero`   — full width, the PNG's native ratio (1080×607), diffuse beam + pupil.
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
