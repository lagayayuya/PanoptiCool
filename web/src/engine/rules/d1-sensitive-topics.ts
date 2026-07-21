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
//   - un constat sensible ne porte PLUS de phrase, sauf `conflictual` : l'éventail de lectures porte
//     le sens, et la phrase ne faisait que répéter le titre de la carte. Détail sur `CLAIM_BY_LABEL`.
//
// INTOUCHÉ (le noyau mérité) : la détection vit dans `engine/detect/`, les données dans
// `engine/lexicon/`. Les garde-fous de doctrine ne bougent pas :
//   - 1 constat PAR LABEL détecté (jamais par commentaire, jamais global) ;
//   - tag nommé SEULEMENT si le terme est écrit (B2 — l'étage vient de la machinerie) ;
//   - conflictual : un seul étage, jamais d'éventail (B5, décision yuya PANO-70 §1.4) ;
//   - explicite → medium, indirect → low ;
//   - le signal-sans-vécu (3ᵉ personne) est tagué — c'est la démonstration (C2), pas un bug.

import { DEFAULT_LOCALE, type Locale } from '../../i18n/locales';
import type { Evidence, ReadingFan, Signal } from '../analysis';
import { detectLabels, type LabelDetection } from '../detect/detect';
import { WIRED_LEXICONS } from '../lexicon';
import type { LabelLexicon, SensitiveLabel } from '../lexicon/types';
import type { NormalizedExport } from '../normalize';
import { d1ConflictualNamedClaim, readingText, sensitiveTopicName } from '../wording';
import { buildChannelCorpus } from './shared';

/** Chemin de section source réel (contrat §4) — même section que les volumes, producteurs distincts. */
export const D1_SECTION_PATH = 'Comment/Comments' as const;
/** Recherches (contrat §4) — adaptateur PANO-80 : D1 lit Comments ET Searches, mêmes filtres. */
export const D1_SEARCH_SECTION_PATH = 'Your Activity/Searches' as const;

/**
 * Les constats sensibles n'ont plus de PHRASE — sauf `conflictual`, et la raison est structurelle.
 *
 * La phrase disait ce que le titre de carte disait déjà : cliquer « Santé mentale » pour lire
 * « Terme de santé mentale écrit en toutes lettres » n'apprenait rien. Ce qui porte le sens est
 * l'ÉVENTAIL DE LECTURES — les chemins par lesquels ce signal a pu arriver là.
 *
 * `conflictual` n'a PAS d'éventail, par doctrine (B5 : l'insulte émise EST le signal explicite, il
 * n'y a pas de lecture plurielle à proposer). Sans phrase, sa carte n'aurait plus AUCUN texte. Et sa
 * phrase ne redit pas son titre : elle porte le critère B5 lui-même — propos ÉMIS, VISANT un autre
 * utilisateur — que « Conflictuel » ne dit pas. C'est le seul label où la phrase informe encore.
 *
 * La règle est donc « une phrase quand il n'y a pas d'éventail », et non « une phrase quand ce n'est
 * pas sensible » : les intérêts (D2) gardent la leur pour la même raison.
 */
const CLAIM_BY_LABEL: Partial<Record<SensitiveLabel, (locale: Locale) => string>> = {
  conflictual: d1ConflictualNamedClaim,
};

/** Explicite → `medium`, indirect → `low`. Jamais `high` : le type de `Deduction` l'interdit. */
function d1Level(stage: LabelDetection['stage']): 'low' | 'medium' {
  return stage === 'explicit' ? 'medium' : 'low';
}

/**
 * L'éventail de lectures — sur les DEUX étages, `conflictual` excepté (il n'a pas de lectures : un
 * propos agressif émis n'a pas d'éventail, cf. B5). Les lectures sont des TEXTES (A2), résolus
 * depuis les clés que le lexique co-porte (`readingTemplateIds`).
 *
 * ── Pourquoi le nommé a maintenant un éventail ──────────────────────────────────────────────────
 * Il n'en avait aucun, sur une hypothèse implicite qui ne tient pas : que l'étage nommé RÉSOUDRAIT
 * l'ambiguïté. Il n'en résout qu'une, la LEXICALE — quel sujet est en jeu. Il ne dit rien du POURQUOI.
 * « témoignages burn out » écrit le terme en toutes lettres et reste une recherche de témoignages :
 * vécu, proche, curiosité restent tous les trois ouverts. Chercher n'est pas déclarer, et écrire le
 * mot ne réduit pas les raisons de l'avoir écrit. Une carte nommée sans éventail présentait donc
 * comme tranché ce qui ne l'était pas — et n'apprenait rien, l'éventail étant la pédagogie.
 *
 * ── `ranked`, jamais `equal` ────────────────────────────────────────────────────────────────────
 * `equal` dirait que « je fais une dépression » et « témoignages burn out » se lisent pareil : faux.
 * Écrire le terme à son propre sujet DÉPLACE la vraisemblance vers le vécu sans fermer le reste,
 * et c'est exactement ce que `ranked` exprime — il ORDONNE sans CHIFFRER (ADR-0003 : aucune
 * pondération par lecture, la confiance vit sur le constat).
 *
 * ── L'ORDRE, désormais RATIFIÉ ──────────────────────────────────────────────────────────────────
 * L'ordre rendu est celui de `readingTemplateIds`. Il n'avait jamais été CHOISI comme un classement ;
 * il l'est depuis, sous la règle « trois mécanismes, pas trois degrés » — le mécanisme « c'est moi »
 * domine quand le terme précis est écrit. Le même ordre sert aux deux étages : `equal` ne classant
 * pas par définition, il n'y a qu'un ordre par label, et la séquence identique rend les deux cartes
 * comparables.
 *
 * Un classement par CANAL a été proposé puis REJETÉ : une recherche TikTok peut être une frappe
 * comme un tap sur un terme suggéré, et un commentaire porte des questions. Le canal corrèle
 * faiblement avec l'intention dans les deux sens. Ce qui faisait lire « témoignages burn out » comme
 * une enquête était LEXICAL, pas structurel — et c'est le registre informationnel qui le traite.
 */
function readingFan(
  lexicon: LabelLexicon,
  stage: LabelDetection['stage'],
  locale: Locale,
): ReadingFan | undefined {
  if (lexicon.kind !== 'topical') {
    return undefined;
  }
  return {
    mode: stage === 'explicit' ? 'ranked' : 'equal',
    // `.map((k) => …)` et NON `.map(readingText)` : `map` passe (valeur, index, tableau), donc la
    // forme courte enverrait l'INDEX comme second argument. Le compilateur l'attrape depuis que le
    // premier paramètre est une `Locale` — il ne l'aurait pas fait quand les deux étaient `string`.
    readings: lexicon.readingTemplateIds.map((key) => readingText(locale, key)),
  };
}

/**
 * D1 — détecte les sujets sensibles dans les textes tapés (commentaires + recherches).
 *
 * `[]` si les deux sources sont vides. Sinon, PAR LABEL détecté, un constat `sensitive: true` portant
 * ses preuves. Un même commentaire prouvant deux labels est cité par les DEUX constats : le verbatim
 * y est dupliqué (doublon de chaînes courtes ACCEPTÉ, arbitrage yuya) — la réutilisation reste
 * visible, recalculée au rendu sur la paire `channel:sourceIndex` (C5), plus stockée.
 */
export function d1SensitiveTopics(
  input: NormalizedExport,
  locale: Locale = DEFAULT_LOCALE,
): Signal[] {
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
    const claim = CLAIM_BY_LABEL[detection.label];
    const fan = readingFan(lexicon, detection.stage, locale);

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
      label: sensitiveTopicName(locale, detection.label),
      ...(claim !== undefined ? { claim: claim(locale) } : {}),
      sensitive: true,
      confidence: d1Level(detection.stage),
      evidence,
    });
  }
  return signals;
}
