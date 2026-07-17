// Détection mobile pour les variantes de mise en page (maquettes « … Mobile », refonte 2026-07-15).
// Les composants v2 sont stylés inline (pas de feuille CSS par composant), donc pas de media query
// possible au niveau des styles : on branche la mise en page en JS via `matchMedia`. Tous les
// composants concernés sont des îlots `client:only` (ADR-0002) — `window` existe toujours au rendu.

import { useEffect, useState } from 'preact/hooks';

/** Seuil unique : en dessous, les maquettes mobiles s'appliquent (conçues à 390 px, conteneur
 * max 480 px) ; au-dessus, les maquettes desktop. */
export const MOBILE_QUERY = '(max-width: 720px)';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}
