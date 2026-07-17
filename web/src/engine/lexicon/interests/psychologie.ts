// Lexique d'intérêt `psychologie` (D2, PANO-89 lot 4) — psychologie ACADÉMIQUE.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire ACADÉMIQUE de la psychologie FR : penseurs, expériences célèbres, concepts. Usage
// SOBRE (édition/edtech).
//
// ── FRONTIÈRE — RENFORCÉE (le point le plus sensible du lot 4) ──────────────────────────────────
// STRICTEMENT le champ académique. La séparation d'avec le CLINIQUE/VÉCU (qui appartient à
// `mental_health`, D1) est tenue par CONSTRUCTION : ce lexique ne contient QUE des noms de penseurs,
// des expériences/effets nommés, et des concepts théoriques. Il ne contient AUCUN terme de soin, de
// professionnel, de trouble ou de vécu.
//   · EXCLUS SANS EXCEPTION (appartiennent à D1) : « psy », « psychologue », « psychiatre »,
//     « therapie », « therapeute », « phobie »/« phobie sociale », « depression », « anxiete »,
//     « tdah », « burn out », « toc », « bipolaire », « nevrose », « trauma », « libido », « stress ».
//   · La machinerie protège les entités : « psychanalyse »/« psychologie » ne matchent PAS le
//     marqueur D1 « psy » (frontière de mot). Le guard de frontière (`interests-battery.test.ts`)
//     passe CHAQUE marqueur des 3 tiers dans D1 et exige zéro détection — la preuve mécanique de la
//     séparation. Toute collision = STOP et remontée à yuya (aucune constatée à l'écriture).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — penseurs/expériences/concepts univoques : « freud », « pavlov », « milgram »,
//     « psychanalyse », « biais cognitif », « dissonance cognitive », « psychologie sociale »,
//     « behaviorisme », « effet dunning kruger ».
//   · ANCRÉ — « jung » (« jeune » ?), « gestalt », « conditionnement » (emballage), « inconscient »
//     (imprudent), « heuristique », « ego » : co-occurrence.
//
// ── Variantes EN (PANO-88) — sondage FP, FRONTIÈRE TENUE À L'IDENTIQUE ─────────────────────────
// La règle de construction ci-dessus vaut mot pour mot en EN : QUE des penseurs, des expériences/
// effets nommés, et des concepts théoriques.
//   · SOLO — « psychoanalysis », « social psychology », « cognitive psychology », « cognitive bias »,
//     « cognitive dissonance », « behaviorism », « dunning kruger », « maslow », « classical
//     conditioning », « operant conditioning », « milgram experiment » : univoques ET académiques.
//   · ANCRÉ — « psychology » nu : ancré, PAS solo. Deux raisons — (1) symétrie stricte avec le FR, où
//     « psychologie » nu est ABSENT des marqueurs (seules les locutions « psychologie sociale/
//     cognitive » sont solo) ; (2) « REVERSE psychology » et « the psychology of… » sont des usages
//     courants non-académiques. Aussi « unconscious » (= INCONSCIENT au sens ASSOMMÉ en EN — le sens
//     médical domine, cf. « knocked unconscious »), « heuristic », « archetype ».
//   · EXCLUS EN — SANS EXCEPTION, miroir exact de la liste FR ci-dessus (appartiennent à D1) :
//     « therapy », « therapist », « psychologist », « psychiatrist », « depression », « anxiety »,
//     « adhd », « ocd », « bipolar », « ptsd », « trauma », « burnout », « phobia », « neurosis »,
//     « libido », « stress », « mental health ». Aucun n'entre ici, à aucun tier. « placebo effect »
//     écarté aussi (frôle `health_physical`, D1).

import type { InterestLexicon } from '../types';

export const PSYCHOLOGIE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'psychologie',
  themeLabel: 'theme.psychologie.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.edtech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'psychanalyse',
    'freud',
    'pavlov',
    'milgram',
    'skinner',
    'piaget',
    'psychologie sociale',
    'biais cognitif',
    'biais cognitifs',
    'dissonance cognitive',
    'behaviorisme',
    'cognitivisme',
    'effet dunning kruger',
    'pyramide de maslow',
    'experience de milgram',
    'psychologie cognitive',
    'conditionnement pavlovien',
    // Variantes EN (PANO-88) : SOLO — univoques ET académiques (aucun terme de soin/trouble/vécu).
    'psychoanalysis',
    'social psychology',
    'cognitive psychology',
    'cognitive bias',
    'cognitive dissonance',
    'behaviorism',
    'dunning kruger',
    'maslow',
    'classical conditioning',
    'operant conditioning',
    'milgram experiment',
  ],
  anchored: [
    'jung', // « jeune » (homophone approché) / Carl Jung
    'gestalt', // fairly académique mais gardé ancré
    'conditionnement', // emballage / mise en condition
    'inconscient', // imprudent (adjectif) / l'inconscient
    'heuristique', // heuristique (informatique) / concept
    'ego', // ego générique / le Moi
    'archetype', // archétype générique
    // Variantes EN (PANO-88) : ANCRÉS.
    'psychology', // « reverse psychology » / « the psychology of… » — jamais solo (symétrie FR)
    'unconscious', // = assommé (« knocked unconscious ») — le sens médical domine (EN)
    'heuristic', // heuristique (informatique) (EN)
  ],
  selfDeclared: ['etudiant en psychologie'],
};
