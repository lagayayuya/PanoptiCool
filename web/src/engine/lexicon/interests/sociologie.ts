// Lexique d'intérêt `sociologie` (D2, PANO-89 lot 4) — sociologie (champ savoir).
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la sociologie FR : penseurs, concepts, sous-champs. Entités = signal public
// générique enrichi par recherche. Usage SOBRE (édition/edtech).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « sociologie », « sociologue », « bourdieu », « durkheim », « habitus », « capital
//     social », « capital culturel », « fait social », « anomie », « stratification sociale ».
//   · ANCRÉ — « weber » (unité de mesure / nom), « classe », « norme », « role » (partagé cinéma),
//     « structure », « domination », « reproduction » (biologie) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
//   · SOLO — « sociology », « sociologist », « social capital », « cultural capital », « social
//     fact », « social stratification », « social mobility », « socialization », « social sciences »,
//     « ethnography », « social class », « social norms » : les LOCUTIONS EN sont peu ambiguës.
//   · ANCRÉ — le nu reste ambigu : « class » (cours / classe scolaire — le 50/50 majeur), « norm »
//     (prénom Norm !), « structure », « domination », « reproduction » (biologie) : compagnon requis.
//   · EXCLU — « social » nu (trop générique : réseaux sociaux, sortie entre amis) ; « woke »,
//     « privilege », « patriarchy » écartés comme MILITANTS (frôlent `politics`, D1) — symétrie avec
//     l'exclusion des « -ismes » côté `economie`.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Champ SAVOIR (concepts, penseurs), jamais l'opinion politique partisane ni l'actualité.

import type { InterestLexicon } from '../types';

export const SOCIOLOGIE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'sociologie',
  themeLabel: 'theme.sociologie.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.edtech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'sociologie',
    'sociologue',
    'bourdieu',
    'durkheim',
    'habitus',
    'capital social',
    'capital culturel',
    'determinisme social',
    'fait social',
    'anomie',
    'stratification sociale',
    'mobilite sociale',
    'socialisation',
    'sciences sociales',
    'ethnographie',
    // Variantes EN (PANO-88) : SOLO univoques — les locutions EN sont peu ambiguës.
    'sociology',
    'sociologist',
    'social capital',
    'cultural capital',
    'social fact',
    'social stratification',
    'social mobility',
    'socialization',
    'social sciences',
    'ethnography',
    'social class',
    'social norms',
  ],
  anchored: [
    'weber', // unité (weber) / patronyme
    'classe', // classe (école) / classe sociale
    'norme', // norme générique
    'role', // partagé cinéma
    'structure', // structure générique
    'domination', // domination générique
    'reproduction', // biologie / reproduction sociale
    // Variantes EN (PANO-88) : ANCRÉS — le nu EN reste ambigu.
    'class', // cours / classe scolaire — le 50/50 majeur (EN)
    'norm', // prénom (Norm) vs norme (EN)
  ],
  selfDeclared: ['etudiant en sociologie'],
};
