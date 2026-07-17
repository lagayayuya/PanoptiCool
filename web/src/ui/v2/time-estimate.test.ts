// Test du wording d'estimation de temps (D, correction PANO-85 point 2) — fonction PURE exportée de
// `time-estimate.ts`. Vérifie la bascule EXACTE à 24 h (heures ↔ jours), le format « soit ~Y h »
// seulement au-delà de 24 h, et l'accord singulier/pluriel + participe (jour/passé, heure/passée).
// Env Vitest = node : on n'importe que la fonction (aucun rendu DOM). WORDING = BROUILLON PANO-45.

import { describe, expect, it } from 'vitest';
import { timeEstimateSentence } from './time-estimate';

describe('timeEstimateSentence — bascule 24 h heures/jours', () => {
  it('< 24 h → format HEURES, sans « soit »', () => {
    // 4 h = 240 min.
    expect(timeEstimateSentence(240)).toBe('~4 heures de ta vie passées cette année sur TikTok.');
  });

  it('exactement 24 h (1440 min) → bascule en JOURS avec « soit ~Y h »', () => {
    expect(timeEstimateSentence(24 * 60)).toBe(
      '~1 jour de ta vie passé cette année sur TikTok, soit ~24 h.',
    );
  });

  it('juste sous 24 h (1439 min) → reste en HEURES', () => {
    // 1439 min ≈ 23,98 h → arrondi 24 h, mais format heures (bascule à 1440 min exacte).
    expect(timeEstimateSentence(1439)).toBe('~24 heures de ta vie passées cette année sur TikTok.');
  });

  it('> 24 h non entier → jours à une décimale + heures (persona : 6000 min)', () => {
    // 6000 min = 100 h = 4,1666… j → « 4,2 jours … soit ~100 h ».
    expect(timeEstimateSentence(6000)).toBe(
      '~4,2 jours de ta vie passés cette année sur TikTok, soit ~100 h.',
    );
  });
});

describe('timeEstimateSentence — singulier/pluriel', () => {
  it('~1 heure (singulier, participe « passée »)', () => {
    // 60 min = 1 h.
    expect(timeEstimateSentence(60)).toBe('~1 heure de ta vie passée cette année sur TikTok.');
  });

  it('~1 jour (singulier, participe « passé »)', () => {
    expect(timeEstimateSentence(1440)).toContain('~1 jour de ta vie passé ');
  });

  it('jours entiers → pas de décimale parasite (« ~2 jours », pas « ~2,0 »)', () => {
    // 2 jours = 2880 min.
    expect(timeEstimateSentence(2880)).toBe(
      '~2 jours de ta vie passés cette année sur TikTok, soit ~48 h.',
    );
  });
});
