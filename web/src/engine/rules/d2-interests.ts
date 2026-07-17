// D2 — détecteur d'INTÉRÊTS sur les Comments + Searches (PANO-75, chantier PANO-74 ; PANO-80).
//
// Lot A1 : rend `AnalysisTheme[]` — les `themes[]` d'`Analysis`, directement. Un thème PORTE ses
// constats (`deductions`) au lieu que chaque constat pointe un thème par `themeId` : le regroupement
// que `buildPageBlocks` refaisait à l'affichage (grouper les insights par `themeId`, à leur première
// apparition) est fait ICI, une fois, par la seule règle qui sait déjà tout. `grouping.ts` disparaît.
//
// `Theme.sensitive` part : D2 écrivait `false`, toujours (§2.1), et D1 ne produit pas de thème — les
// deux populations sont DISJOINTES par construction. La séparation `themes[].deductions` vs
// `signals[]` l'acte (décision yuya).
//
// DOCTRINE INCHANGÉE (décisions PANO-74, ne pas rouvrir) :
//   - AUCUNE sensibilité émise (un intérêt n'est pas un sujet sensible) → `sensitive: false` ;
//   - AUCUN éventail de lectures (un intérêt ne se lit pas « vécu / proche / curiosité ») ;
//   - agrégation par CLASSEMENT, pas par seuillage : plancher d'items puis top-N par volume ;
//   - confiance DÉRIVÉE DU VOLUME, plafonnée `medium` ; l'auto-déclaration est un BONUS low → medium.
//
// Le plafond `medium` n'est PLUS tenu par le type ici : `sensitive: false` autorise `high` (FORK 3 —
// « le non-sensible PEUT afficher élevée »). Aucune règle ne l'émet ; `d2Level` reste plafonné, et
// c'est désormais une décision de RÈGLE, explicite, plutôt qu'un interdit de type.

import type { AnalysisTheme, Deduction, Evidence } from '../analysis';
import { detectLabels, type LabelDetection } from '../detect/detect';
import { INTEREST_LEXICONS } from '../lexicon/interests';
import type { InterestLexicon } from '../lexicon/types';
import type { NormalizedExport } from '../normalize';
import { actorLabel, d2InterestClaim, themeLabelText, usageText } from '../wording';
import { buildChannelCorpus } from './shared';

/** Chemin de section source réel (contrat §4). */
export const D2_SECTION_PATH = 'Comment/Comments' as const;
/** Recherches (contrat §4) — adaptateur PANO-80, comme D1. */
export const D2_SEARCH_SECTION_PATH = 'Your Activity/Searches' as const;

/** PLANCHER d'items-preuve pour retenir un thème (calibrage BROUILLON PANO-75) : un intérêt attesté
 *  par un seul commentaire est trop faible pour une carte — on exige un usage RÉPÉTÉ. */
const D2_ITEM_FLOOR = 2;

/** Nombre MAX de thèmes retenus, par volume décroissant. Borne d'affichage : les intérêts les plus
 *  attestés, pas la longue traîne. Brouillon PANO-75. */
const D2_TOP_N = 5;

/** Volume au-delà duquel la confiance passe `low → medium` (même logique que l'ex-r2). */
const D2_MEDIUM_VOLUME_THRESHOLD = 4;

/** Confiance D2 : dérivée du volume, avec BONUS d'auto-déclaration. Plafonnée `medium` PAR CHOIX DE
 *  RÈGLE (le type autoriserait `high` sur du non-sensible — cf. en-tête). */
function d2Level(volume: number, selfDeclared: boolean): 'low' | 'medium' {
  if (selfDeclared || volume >= D2_MEDIUM_VOLUME_THRESHOLD) {
    return 'medium';
  }
  return 'low';
}

/** Plancher d'items, puis top-N par volume DÉCROISSANT. Tri STABLE (ES2019+) → à volume égal,
 *  l'ordre de `INTEREST_LEXICONS` tranche (tie-break déterministe). */
function rankInterests(detections: readonly LabelDetection[]): LabelDetection[] {
  return detections
    .filter((d) => d.items.length >= D2_ITEM_FLOOR)
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, D2_TOP_N);
}

/**
 * D2 — détecte les intérêts, les classe, et produit un thème par intérêt retenu (nom + bloc usage +
 * son constat). `[]` si les sources sont vides ou si aucun intérêt n'atteint le plancher.
 *
 * @param lexicons registre de lexiques d'intérêt. Défaut = `INTEREST_LEXICONS` (le câblé réel) ; les
 *   tests de MÉCANIQUE injectent des lexiques FACTICES pour rester indépendants du contenu réel — le
 *   socle reste intact quand les lots de contenu changent le registre.
 */
export function d2Interests(
  input: NormalizedExport,
  lexicons: readonly InterestLexicon[] = INTEREST_LEXICONS,
): AnalysisTheme[] {
  const commentsList = input.Comment.Comments.CommentsList;
  const searchList = input['Your Activity'].Searches.SearchList;
  if (commentsList.length === 0 && searchList.length === 0) {
    return [];
  }

  const corpus = buildChannelCorpus(
    commentsList.map((c) => ({ comment: c.comment, date: c.date })),
    searchList,
  );
  const ranked = rankInterests(detectLabels(corpus.texts, lexicons));

  const themes: AnalysisTheme[] = [];
  for (const detection of ranked) {
    const lexicon = lexicons.find((l) => l.label === detection.label);
    if (lexicon === undefined) {
      continue; // impossible par construction (detectLabels ne détecte que les câblés)
    }

    // Pas de `readings` (un intérêt n'a pas d'éventail) ; `triggerTerms` surlignables.
    const evidence: Evidence[] = detection.items.map(
      (item): Evidence => ({ ...corpus.resolve(item.itemIndex), triggerTerms: item.surfaces }),
    );

    const volume = detection.items.length;
    const deduction: Deduction = {
      claim: d2InterestClaim(volume),
      sensitive: false,
      confidence: d2Level(
        volume,
        detection.items.some((i) => i.selfDeclared === true),
      ),
      evidence,
    };

    themes.push({
      id: lexicon.label,
      // Textes résolus ICI (A2) : le lexique est INTOUCHABLE et garde ses clés ; `Analysis` porte le
      // texte, donc l'UI n'a plus rien à router (elle n'importe même plus le moteur, lot A3).
      label: themeLabelText(lexicon.themeLabel),
      usage: lexicon.usage.map((u) => ({
        actor: actorLabel(u.actor),
        usage: usageText(u.usage.templateId),
      })),
      deductions: [deduction],
    });
  }
  return themes;
}
