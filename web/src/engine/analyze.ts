// Le moteur : UNE fonction, UNE valeur nommée (Refonte A, lot A1).
//
// REMPLACE `rules/index.ts` (registres `RULES`/`EVIDENCE_RULES` + `composeRules` + la fusion du
// magasin de preuves). Ce qui a disparu, et pourquoi ce n'est pas un appauvrissement :
//   - les DEUX REGISTRES existaient pour typer une liste hétérogène de producteurs derrière une
//     signature commune (`(input) => Insight[]`). Chaque producteur ayant désormais un nom et un
//     type de retour PROPRE, il n'y a plus de liste à parcourir : cette fonction les appelle. Le
//     registre était l'indirection qui permettait à l'UI de re-router (`ruleId`) ce que le moteur
//     savait déjà ;
//   - la FUSION DU MAGASIN (dédup par `EvidenceId`) part avec le magasin : les preuves sont des
//     références directes, un doublon de verbatim est ACCEPTÉ (arbitrage yuya), et la réutilisation
//     (C5) est RECALCULÉE au rendu sur la paire `channel:sourceIndex` — plus stockée.
//
// L'ORDRE DES CHAMPS N'EST PAS L'ORDRE DE LA PAGE. `Analysis` est une valeur nommée : c'est l'UI qui
// décide de rendre `signals` avant `themes` (elle reproduit l'ordre que produisait l'ancien
// `insights[]` : D1 émis avant D2). Le moteur ne met plus en scène.

import type { Analysis } from './analysis';
import type { NormalizedExport } from './normalize';
import { readRhythm } from './rules/activity-rhythm';
import { d1SensitiveTopics } from './rules/d1-sensitive-topics';
import { d2Interests } from './rules/d2-interests';
import { readOpacity } from './rules/opacity-semantic-wall';
import { readVolumes } from './rules/volumes';

/**
 * Analyse l'export **validé et normalisé** (`NormalizedExport` : sections-listes coalescées en `[]`
 * au seam, PANO-28/30). Fonction PURE : pas d'effet de bord, pas d'I/O, pas de DOM.
 *
 * Chaque producteur rend `undefined`/`[]` si sa source est vide ; une analyse globalement vide reste
 * une sortie VALIDE (PANO-28) — un compte neuf n'est pas une erreur.
 *
 * `rhythm` et `opacity` sont OMIS (pas mis à `undefined`) quand leur producteur n'a rien : sous
 * `exactOptionalPropertyTypes`, la distinction compte, et « absent » est la sémantique voulue.
 */
export function analyze(input: NormalizedExport, now: number = Date.now()): Analysis {
  const rhythm = readRhythm(input, now);
  const opacity = readOpacity(input);
  return {
    ...(rhythm !== undefined ? { rhythm } : {}),
    volumes: readVolumes(input),
    ...(opacity !== undefined ? { opacity } : {}),
    themes: d2Interests(input),
    signals: d1SensitiveTopics(input),
  };
}
