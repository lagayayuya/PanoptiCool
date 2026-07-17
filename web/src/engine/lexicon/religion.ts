// Lexique `religion` (PANO-72, passe 2) — label de SUJET (pratique / appartenance / avis /
// curiosité, décision D). Le plus délicat des six.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Vocabulaire religieux du FR courant (toutes confessions), écrit à l'aveugle depuis l'usage
// commun, jamais depuis un export :
//   · soutenu : appartenance et pratique (croyant, pratiquant, pèlerinage, catéchisme) ;
//   · courant : lieux, textes, figures, rites (mosquée, coran, imam, ramadan, messe) ;
//   · familier : formules lexicalisées marquées (hamdoulah, bismillah).
// FRONTIÈRES tenues (décision D — religion NE re-confond PAS ces cas) :
//   · label de SUJET : PAS de registre « opinion hostile » ici (≠ politics). Un avis sur la
//     religion qui emploie ce vocabulaire topical est capté en indirect ; l'éventail de lectures
//     porte la lecture « avis personnel ». La critique d'une religion comme IDÉE n'est taguée
//     NULLE PART ;
//   · hostilité anti-CROYANT (insulte visant une personne) → `conflictual`, jamais ici ;
//   · terme visant un GROUPE ethnico-religieux dans l'absolu → HAINEUX, exclu de TOUT lexique,
//     SIGNALÉ comme périmètre d'un futur label dédié — jamais tranché seul, jamais inclus ici.
// Exclusion assumée (décision yuya) : « wallah / inchallah / machallah » EXCLUS
// (interjections lexicalisées dans l'argot FR général — ne pas taguer une population sur son
// sociolecte) ; « hamdoulah / alhamdulillah » (plus marqués) en indirectColloquial seulement.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées NORMALISÉES. Seuil 1 (calibrage PANO-33) : « église » culturelle taguera en LARGE, et
// l'éventail de lectures (« curiosité / intérêt ») porte cette lecture — multi-interprétabilité, pas
// un bug. La sécurité du sensible vit dans le GRILLAGE d'affichage — le constat démarre replié,
// derrière un badge « sensible » — et non dans le seuil : monter le seuil réserverait l'affichage aux
// cas les plus nets sans rien rendre plus sûr, chaque carte étant déjà derrière une porte (ADR-0003).

import type { TopicalLexicon } from './types';

export const RELIGION_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'religion',
  // Lectures du registre §5 : pratique / appartenance · avis personnel · curiosité / intérêt.
  readingTemplateIds: [
    'sensitive.religion.reading.practice',
    'sensitive.religion.reading.opinion',
    'sensitive.religion.reading.curiosity',
  ],
  // Pratique/déclaration à soi, NON copulaire (locutions) — le tag nommé passe surtout par
  // `selfDeclared`.
  explicit: [
    'je prie',
    'ma foi',
    'je crois en dieu',
    'je fais le ramadan',
    'je porte le voile',
    'je vais a la messe',
    'ma paroisse',
    'mon eglise',
    'ma mosquee',
  ],
  // Appartenance AUTO-DÉCLARÉE (« je suis croyant », « chui musulman ») → tag nommé via pattern.
  // « athée » inclus (auto-position, comme « apolitique »). Emprunt lexicalisé « muslim » (employé
  // par des francophones). « feuj » EXCLU (terme de groupe ethnico-religieux — signalé à yuya).
  selfDeclared: [
    'croyant',
    'croyante',
    'musulman',
    'musulmane',
    'muslim',
    'muslima',
    'chretien',
    'chretienne',
    'juif',
    'juive',
    'catholique',
    'catho',
    'protestant',
    'protestante',
    'evangelique',
    'bouddhiste',
    'athee',
    'pratiquant',
    'pratiquante',
  ],
  // Vocabulaire de sujet, non ambigu → tag large.
  indirectCore: [
    'religion',
    'spiritualite',
    'la priere',
    'priere',
    'ramadan',
    'careme',
    'messe',
    'mosquee',
    'synagogue',
    'coran',
    'torah',
    'evangile',
    'imam',
    'rabbin',
    'pape',
    'halal',
    'casher',
    'hijab',
    'islam',
    'christianisme',
    'judaisme',
    'bouddhisme',
    'atheisme',
    'catechisme',
    'pelerinage',
    'aid moubarak',
    'priere du vendredi',
  ],
  // Culturel-polysémique (« belle église romane » = tourisme) → tag large + éventail « curiosité ».
  // EXCLUS après sondage FP (PANO-72, seuil 1) — collisions hors-domaine trop massives, pas de la
  // multi-interprétabilité mais du bruit : « voile » (bateau), « temple » (« mal aux temples » /
  // tourisme / jeu), « pasteur » (Institut/Louis Pasteur, toponymes), « baptême » (« baptême de
  // l'air / du feu »). La pratique reste captée par les auto-déclarations et le vocabulaire de sujet.
  indirectColloquial: [
    'eglise',
    'bible',
    'communion',
    'la mecque',
    'hamdoulah',
    'alhamdulillah',
    'starfoullah',
    'bismillah',
  ],
  includeColloquial: true,
  indirectThreshold: 1,
};
