// Couverture du wording de D1 (PANO-71) — porté sur `wording.ts` à la Refonte A (lot A2).
//
// CE QUE CE TEST NE VÉRIFIE PLUS, parce que le COMPILATEUR le tient. L'ancien test balayait
// `D1_TEMPLATE_IDS` (allowlist de `templateId`) et demandait à chaque id d'avoir un gabarit. Les
// claims sont désormais des fonctions IMPORTÉES, rangées dans un `Record<SensitiveLabel, …>` : un
// label sans claim, ou un claim disparu, ne compile pas. Le test ne peut plus rien y ajouter.
//
// CE QU'IL VÉRIFIE ENCORE, et qui reste indispensable : les LECTURES (§5). Leurs clés sont portées
// par les lexiques (`readingTemplateIds: readonly string[]`) — des chaînes OUVERTES, donc hors de
// portée du compilateur sans retyper le lexique (INTOUCHABLE). L'exhaustivité y est test-only : c'est
// son plafond réel.
//
// ⚠ CE TEST EST LE SEUL FILET SUR CES CLÉS. Le golden de rendu ne couvre QUE ce que la persona
// exerce (mental_health, conflictual) : une lecture non routée sur un label que la persona n'exerce
// pas passerait le golden en vert et rendrait « [gabarit manquant : …] » en production. Ne pas
// l'alléger — il n'y a rien derrière.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from './lexicon';
import { hasReading } from './wording';

describe('couverture wording D1 (labels câblés)', () => {
  it('chaque lecture §5 des lexiques câblés a son texte', () => {
    for (const lexicon of WIRED_LEXICONS) {
      if (lexicon.kind !== 'topical') {
        continue;
      }
      for (const key of lexicon.readingTemplateIds) {
        expect(hasReading(key), `texte de lecture manquant : ${key}`).toBe(true);
      }
    }
  });

  it('le registre câblé porte au moins un lexique topical (le filtre ne rate pas la couverture)', () => {
    expect(WIRED_LEXICONS.some((l) => l.kind === 'topical')).toBe(true);
  });
});
