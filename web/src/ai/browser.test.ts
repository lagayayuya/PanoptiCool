// Témoins de `detectBrowser` — chaque moteur reçoit un DISCOURS différent (ADR-0006), donc une
// détection fausse envoie de fausses instructions. Les UA sont des chaînes SYNTHÉTIQUES réduites
// aux marqueurs discriminants (pas des UA copiées d'une vraie machine).
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
//   - LES UA RÉELLES dans toute leur variété (forks, versions mobiles, anti-empreinte) : on fige la
//     logique des marqueurs, pas le zoo des chaînes du monde ;
//   - LA VÉRITÉ du comportement réseau : elle reste à `local-network.ts`, lue à l'échec.

import { describe, expect, it } from 'vitest';
import { detectBrowser } from './browser';

describe('detectBrowser', () => {
  it('nomme les Chromium par leur marqueur propre, Chrome en dernier', () => {
    expect(detectBrowser('Mozilla/5.0 Chrome/126.0 Safari/537.36 Edg/126.0', false)).toEqual({
      name: 'Edge',
      engine: 'chromium',
    });
    expect(detectBrowser('Mozilla/5.0 Chrome/126.0 Safari/537.36 OPR/111.0', false)).toEqual({
      name: 'Opera',
      engine: 'chromium',
    });
    expect(detectBrowser('Mozilla/5.0 Chrome/126.0 Safari/537.36', false)).toEqual({
      name: 'Chrome',
      engine: 'chromium',
    });
  });

  it("nomme Brave par son API, jamais par l'UA (Brave se déclare Chrome)", () => {
    expect(detectBrowser('Mozilla/5.0 Chrome/126.0 Safari/537.36', true)).toEqual({
      name: 'Brave',
      engine: 'chromium',
    });
  });

  it('distingue Firefox et Safari (le seul « Safari/ » SANS « Chrome/ »)', () => {
    expect(detectBrowser('Mozilla/5.0 Gecko/20100101 Firefox/128.0', false)).toEqual({
      name: 'Firefox',
      engine: 'firefox',
    });
    expect(detectBrowser('Mozilla/5.0 Version/17.5 Safari/605.1.15', false)).toEqual({
      name: 'Safari',
      engine: 'webkit',
    });
  });

  it("ne conclut RIEN d'un UA muet — c'est le chemin « aucune cause nommée » (ADR-0006)", () => {
    expect(detectBrowser('Node.js/22', false)).toEqual({ name: null, engine: 'unknown' });
    expect(detectBrowser('', false)).toEqual({ name: null, engine: 'unknown' });
  });
});
