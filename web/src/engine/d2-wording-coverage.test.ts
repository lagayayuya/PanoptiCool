// Couverture du wording de D2 (PANO-75) — porté sur `wording.ts` à la Refonte A (lot A2).
//
// Chaque clé que D2 PEUT résoudre — nom de thème, usage, acteur — a son texte, pour qu'aucun
// « [gabarit manquant] » n'apparaisse sur une carte de thème. Le claim générique de D2, lui, est une
// fonction importée : sa présence est tenue par le COMPILATEUR, ce test n'a plus à la vérifier.
//
// ⚠ CE TEST EST LE SEUL FILET SUR CES ~110 CLÉS, et c'est le point aveugle de la refonte : le golden
// de rendu ne couvre que les thèmes que la persona exerce (chats, cinema_series) — soit 2 sur ~60.
// Un libellé ou un usage non routé sur les ~50 autres passerait le golden EN VERT et rendrait
// « [gabarit manquant : theme.x.label] » chez l'utilisateur. Les clés étant des chaînes ouvertes
// portées par le lexique (INTOUCHABLE), le compilateur ne peut pas les tenir : l'exhaustivité
// test-only est le plafond réel. NE PAS ALLÉGER — il n'y a rien derrière.

import { describe, expect, it } from 'vitest';
import { INTEREST_LEXICONS } from './lexicon/interests';
import {
  actorLabel,
  hasThemeLabel,
  hasUsage,
  MISSING_WORDING_PREFIX,
  themeLabelText,
} from './wording';

describe('couverture wording D2 (thèmes d’intérêt)', () => {
  it('le registre porte des lexiques (le balayage ne rate pas la couverture réelle)', () => {
    expect(INTEREST_LEXICONS.length).toBeGreaterThan(0);
  });

  it('chaque thème a son libellé + chaque usage son texte + chaque acteur son libellé', () => {
    for (const lexicon of INTEREST_LEXICONS) {
      expect(hasThemeLabel(lexicon.themeLabel), `libellé manquant : ${lexicon.themeLabel}`).toBe(
        true,
      );
      for (const u of lexicon.usage) {
        expect(hasUsage(u.usage.templateId), `usage manquant : ${u.usage.templateId}`).toBe(true);
        // `actorLabel` retombe sur la clé brute si non routée — on exige un vrai libellé (pas la clé).
        expect(actorLabel(u.actor), `acteur non routé : ${u.actor}`).not.toBe(u.actor);
      }
    }
  });

  it('aucun libellé de thème ne rend le marqueur « manquant »', () => {
    for (const lexicon of INTEREST_LEXICONS) {
      expect(themeLabelText(lexicon.themeLabel).startsWith(MISSING_WORDING_PREFIX)).toBe(false);
    }
  });
});
