// Interest lexicon `sociologie` (D2, PANO-89 batch 4) — sociology (knowledge field).
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR sociology: thinkers, concepts, sub-fields. Entities = generic public
// signal enriched by research. SOBER usage (publishing/edtech).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « sociologie », « sociologue », « bourdieu », « durkheim », « habitus », « capital
//     social », « capital culturel », « fait social », « anomie », « stratification sociale ».
//   · ANCHORED — « weber » (unit of measure / name), « classe », « norme », « role » (shared cinema),
//     « structure », « domination », « reproduction » (biology): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
//   · SOLO — « sociology », « sociologist », « social capital », « cultural capital », « social
//     fact », « social stratification », « social mobility », « socialization », « social sciences »,
//     « ethnography », « social class », « social norms »: the EN PHRASES are little ambiguous.
//   · ANCHORED — the bare word stays ambiguous: « class » (course / school class — the major 50/50), « norm »
//     (the name Norm!), « structure », « domination », « reproduction » (biology): companion required.
//   · EXCLUDED — bare « social » (too generic: social networks, an outing with friends); « woke »,
//     « privilege », « patriarchy » discarded as MILITANT (brush `politics`, D1) — symmetry with
//     the exclusion of « -isms » on the `economie` side.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. KNOWLEDGE field (concepts, thinkers), never partisan political opinion nor the news.

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
    // EN variants (PANO-88): SOLO univocal — the EN phrases are little ambiguous.
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
    'weber', // unit (weber) / surname
    'classe', // class (school) / social class
    'norme', // generic norm
    'role', // shared cinema
    'structure', // generic structure
    'domination', // generic domination
    'reproduction', // biology / social reproduction
    // EN variants (PANO-88): ANCHORED — the bare EN word stays ambiguous.
    'class', // course / school class — the major 50/50 (EN)
    'norm', // name (Norm) vs norm (EN)
  ],
  selfDeclared: ['etudiant en sociologie'],
};
