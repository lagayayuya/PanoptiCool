// Interest lexicon `psychologie` (D2, PANO-89 batch 4) — ACADEMIC psychology.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// ACADEMIC vocabulary of FR psychology: thinkers, famous experiments, concepts. SOBER
// usage (publishing/edtech).
//
// ── BOUNDARY — REINFORCED (the most sensitive point of batch 4) ─────────────────────────────────
// STRICTLY the academic field. The separation from the CLINICAL/LIVED (which belongs to
// `mental_health`, D1) is held by CONSTRUCTION: this lexicon contains ONLY thinker names,
// named experiments/effects, and theoretical concepts. It contains NO term of care, of
// professional, of disorder or of lived experience.
//   · EXCLUDED WITHOUT EXCEPTION (belong to D1): « psy », « psychologue », « psychiatre »,
//     « therapie », « therapeute », « phobie »/« phobie sociale », « depression », « anxiete »,
//     « tdah », « burn out », « toc », « bipolaire », « nevrose », « trauma », « libido », « stress ».
//   · The machinery protects the entities: « psychanalyse »/« psychologie » do NOT match the
//     D1 marker « psy » (word boundary). The boundary guard (`interests-battery.test.ts`)
//     passes EACH marker of the 3 tiers through D1 and requires zero detection — the mechanical proof of the
//     separation. Any collision = STOP and escalation to yuya (none observed at writing).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal thinkers/experiments/concepts: « freud », « pavlov », « milgram »,
//     « psychanalyse », « biais cognitif », « dissonance cognitive », « psychologie sociale »,
//     « behaviorisme », « effet dunning kruger ».
//   · ANCHORED — « jung » (« jeune »?), « gestalt », « conditionnement » (packaging), « inconscient »
//     (reckless), « heuristique », « ego »: co-occurrence.
//
// ── EN variants (PANO-88) — FP survey, BOUNDARY HELD IDENTICALLY ───────────────────────────────
// The construction rule above holds word for word in EN: ONLY thinkers, named experiments/
// effects, and theoretical concepts.
//   · SOLO — « psychoanalysis », « social psychology », « cognitive psychology », « cognitive bias »,
//     « cognitive dissonance », « behaviorism », « dunning kruger », « maslow », « classical
//     conditioning », « operant conditioning », « milgram experiment »: univocal AND academic.
//   · ANCHORED — bare « psychology »: anchored, NOT solo. Two reasons — (1) strict symmetry with FR, where
//     bare « psychologie » is ABSENT from the markers (only the phrases « psychologie sociale/
//     cognitive » are solo); (2) « REVERSE psychology » and « the psychology of… » are common
//     non-academic uses. Also « unconscious » (= UNCONSCIOUS in the KNOCKED-OUT sense in EN — the
//     medical sense dominates, cf. « knocked unconscious »), « heuristic », « archetype ».
//   · EN EXCLUDED — WITHOUT EXCEPTION, exact mirror of the FR list above (belong to D1):
//     « therapy », « therapist », « psychologist », « psychiatrist », « depression », « anxiety »,
//     « adhd », « ocd », « bipolar », « ptsd », « trauma », « burnout », « phobia », « neurosis »,
//     « libido », « stress », « mental health ». None enters here, at any tier. « placebo effect »
//     discarded too (brushes `health_physical`, D1).

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
    // EN variants (PANO-88): SOLO — univocal AND academic (no term of care/disorder/lived experience).
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
    'jung', // « jeune » (approximate homophone) / Carl Jung
    'gestalt', // fairly academic but kept anchored
    'conditionnement', // packaging / conditioning
    'inconscient', // reckless (adjective) / the unconscious
    'heuristique', // heuristic (computing) / concept
    'ego', // generic ego / the Self
    'archetype', // generic archetype
    // EN variants (PANO-88): ANCHORED.
    'psychology', // « reverse psychology » / « the psychology of… » — never solo (FR symmetry)
    'unconscious', // = knocked out (« knocked unconscious ») — the medical sense dominates (EN)
    'heuristic', // heuristic (computing) (EN)
  ],
  selfDeclared: ['etudiant en psychologie'],
};
