// Interest lexicon `biologie` (D2, PANO-89 batch 4) — biology (knowledge field).
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR biology: concepts, figures, sub-fields. SOBER usage (publishing/edtech).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « adn », « mitose », « meiose », « darwin », « genetique », « photosynthese »,
//     « chromosome », « microbiologie », « biodiversite », « membrane cellulaire ».
//   · ANCHORED — « cellule » (prison / phone), « evolution », « espece » (espèces / cash),
//     « gene » (« gêne »), « culture » (bacterial / general culture), « milieu », « noyau »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
//   · SOLO — « biology », « dna », « mitosis », « meiosis », « genetics », « photosynthesis »,
//     « microbiology », « biodiversity », « ecosystem », « natural selection », « molecular
//     biology », « organism »: univocal.
//   · ANCHORED — « cell » (PRISON / SPREADSHEET cell / phone — the major 50/50), « species »,
//     « bacteria »: companion required.
//   · EXCLUDED — « bio »: in EN, it is the PROFILE BIO (« link in bio », « check my bio ») and the
//     biography, well before biology. DISCARDED, even as anchored — a platform marker has
//     no place in a knowledge lexicon.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. KNOWLEDGE field. No pathology/medical-experience marker (stays `health_physical`, D1).

import type { InterestLexicon } from '../types';

export const BIOLOGIE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'biologie',
  themeLabel: 'theme.biologie.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.edtech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'biologie',
    'adn',
    'mitose',
    'meiose',
    'darwin',
    'genetique',
    'photosynthese',
    'chromosome',
    'microbiologie',
    'biodiversite',
    'membrane cellulaire',
    'ecosysteme',
    'enzyme',
    'selection naturelle',
    'biologie moleculaire',
    // EN variants (PANO-88): SOLO univocal.
    'biology',
    'dna',
    'mitosis',
    'meiosis',
    'genetics',
    'photosynthesis',
    'microbiology',
    'biodiversity',
    'ecosystem',
    'natural selection',
    'molecular biology',
    'organism',
  ],
  anchored: [
    'cellule', // prison / phone
    'evolution', // generic evolution
    'espece', // espèces (cash) / species
    'gene', // « gêne » (homophone) / gene
    'culture', // bacterial culture / general culture
    'milieu', // milieu (environment) / in the middle
    'noyau', // noyau (fruit pit) / cell nucleus
    'bacterie', // fairly bio but kept anchored
    // EN variants (PANO-88): ANCHORED.
    'cell', // prison cell / spreadsheet cell / phone — the major 50/50 (EN)
    'species', // generic species (EN)
    'bacteria', // EN spelling of « bacterie »
  ],
  selfDeclared: ['etudiant en biologie'],
};
