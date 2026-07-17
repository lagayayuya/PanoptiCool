// D1 — détecteur de sujets sensibles sur les Comments + Searches (PANO-71/72, cadrage PANO-70).
//
// Lot A1 : rend `Deduction[]` — les `signals[]` d'`Analysis`, directement. Ce qui change :
//   - `sensitivity: 3` (toujours 3, §2.1) et le plafond `low|medium` fusionnent dans l'union
//     `Deduction` : `sensitive: true` ⇒ `confidence: 'low' | 'medium'`, `high` INTERDIT à la
//     compilation. Le plafond n'est plus tenu par un type de param (`InferredLevel`) ni par un
//     golden : il est tenu par le type de retour de cette fonction ;
//   - les preuves sont des références DIRECTES (`channel` + `sourceIndex` + verbatim), plus des
//     `EvidenceRef` vers un magasin — `corpus.resolve()` rend déjà la paire, il n'y a plus d'id à
//     fabriquer. La borne mémoire d'ADR-0003 tient par CONSTRUCTION : seules les miettes citées existent ;
//   - le `claim` est le TEXTE, produit par une fonction typée et NOMMÉE de `wording.ts` (A2) : un
//     label sans claim est une erreur de compilation (`CLAIM_BY_LABEL` est exhaustif sur
//     `SensitiveLabel`), plus un « [gabarit manquant] » au runtime. Le `framing` part (jamais rendu).
//
// INTOUCHÉ (le noyau mérité) : la détection vit dans `engine/detect/`, les données dans
// `engine/lexicon/`. Les garde-fous de doctrine ne bougent pas :
//   - 1 constat PAR LABEL détecté (jamais par commentaire, jamais global) ;
//   - tag nommé SEULEMENT si le terme est écrit (B2 — l'étage vient de la machinerie) ;
//   - conflictual : un seul étage, jamais d'éventail (B5, décision yuya PANO-70 §1.4) ;
//   - explicite → medium, indirect → low ;
//   - le signal-sans-vécu (3ᵉ personne) est tagué — c'est la démonstration (C2), pas un bug.

import type { Evidence, ReadingFan, Signal } from '../analysis';
import { detectLabels, type LabelDetection } from '../detect/detect';
import { WIRED_LEXICONS } from '../lexicon';
import type { LabelLexicon, SensitiveLabel } from '../lexicon/types';
import type { NormalizedExport } from '../normalize';
import {
  d1ConflictualNamedClaim,
  d1HealthPhysicalBroadClaim,
  d1HealthPhysicalNamedClaim,
  d1MentalHealthBroadClaim,
  d1MentalHealthNamedClaim,
  d1PoliticsBroadClaim,
  d1PoliticsNamedClaim,
  d1ReligionBroadClaim,
  d1ReligionNamedClaim,
  d1SexualityBroadClaim,
  d1SexualityNamedClaim,
  readingText,
  sensitiveTopicName,
} from '../wording';
import { buildChannelCorpus } from './shared';

/** Chemin de section source réel (contrat §4) — même section que les volumes, producteurs distincts. */
export const D1_SECTION_PATH = 'Comment/Comments' as const;
/** Recherches (contrat §4) — adaptateur PANO-80 : D1 lit Comments ET Searches, mêmes filtres. */
export const D1_SEARCH_SECTION_PATH = 'Your Activity/Searches' as const;

/**
 * Claim par label × étage — ce qui remplace l'ALLOWLIST `D1_TEMPLATE_IDS` de `templateId`.
 * `Record<SensitiveLabel, …>` : le type FORCE à déclarer chaque label béni, et chaque valeur est la
 * FONCTION elle-même (importée) — plus une chaîne à faire correspondre à un catalogue.
 * `broad` absent = un seul étage (conflictual, B5).
 */
const CLAIM_BY_LABEL: Record<SensitiveLabel, { named: () => string; broad?: () => string }> = {
  mental_health: { named: d1MentalHealthNamedClaim, broad: d1MentalHealthBroadClaim },
  politics: { named: d1PoliticsNamedClaim, broad: d1PoliticsBroadClaim },
  conflictual: { named: d1ConflictualNamedClaim },
  health_physical: { named: d1HealthPhysicalNamedClaim, broad: d1HealthPhysicalBroadClaim },
  sexuality: { named: d1SexualityNamedClaim, broad: d1SexualityBroadClaim },
  religion: { named: d1ReligionNamedClaim, broad: d1ReligionBroadClaim },
};

/** Explicite → `medium`, indirect → `low`. Jamais `high` : le type de `Deduction` l'interdit. */
function d1Level(stage: LabelDetection['stage']): 'low' | 'medium' {
  return stage === 'explicit' ? 'medium' : 'low';
}

/** L'éventail `equal` du §5 — INDIRECT SEULEMENT, jamais conflictual. Les lectures sont désormais des
 *  TEXTES (A2), résolus depuis les clés que le lexique co-porte (`readingTemplateIds`). */
function readingFan(lexicon: LabelLexicon, stage: LabelDetection['stage']): ReadingFan | undefined {
  if (lexicon.kind !== 'topical' || stage !== 'indirect') {
    return undefined;
  }
  return { mode: 'equal', readings: lexicon.readingTemplateIds.map(readingText) };
}

/**
 * D1 — détecte les sujets sensibles dans les textes tapés (commentaires + recherches).
 *
 * `[]` si les deux sources sont vides. Sinon, PAR LABEL détecté, un constat `sensitive: true` portant
 * ses preuves. Un même commentaire prouvant deux labels est cité par les DEUX constats : le verbatim
 * y est dupliqué (doublon de chaînes courtes ACCEPTÉ, arbitrage yuya) — la réutilisation reste
 * visible, recalculée au rendu sur la paire `channel:sourceIndex` (C5), plus stockée.
 */
export function d1SensitiveTopics(input: NormalizedExport): Signal[] {
  const commentsList = input.Comment.Comments.CommentsList;
  const searchList = input['Your Activity'].Searches.SearchList;
  if (commentsList.length === 0 && searchList.length === 0) {
    return [];
  }

  const corpus = buildChannelCorpus(
    commentsList.map((c) => ({ comment: c.comment, date: c.date })),
    searchList,
  );
  const detections = detectLabels(corpus.texts, WIRED_LEXICONS);

  const signals: Signal[] = [];
  for (const detection of detections) {
    const lexicon = WIRED_LEXICONS.find((l) => l.label === detection.label);
    if (lexicon === undefined) {
      continue; // impossible par construction (detectLabels ne détecte que les câblés)
    }
    const claims = CLAIM_BY_LABEL[detection.label];
    const claim = detection.stage === 'explicit' ? claims.named : (claims.broad ?? claims.named);
    const fan = readingFan(lexicon, detection.stage);

    const evidence: Evidence[] = detection.items.map((item): Evidence => {
      // `resolve` rend déjà { channel, sourceIndex, text, date } : la preuve EST cette paire + la
      // citation. Plus d'`EvidenceId` à fabriquer ici, ni à re-parser chez le consommateur (§5.4).
      const ch = corpus.resolve(item.itemIndex);
      return {
        ...ch,
        triggerTerms: item.surfaces,
        ...(fan !== undefined ? { readings: fan } : {}),
      };
    });

    signals.push({
      label: sensitiveTopicName(detection.label),
      claim: claim(),
      sensitive: true,
      confidence: d1Level(detection.stage),
      evidence,
    });
  }
  return signals;
}
