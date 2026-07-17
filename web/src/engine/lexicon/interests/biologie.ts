// Lexique d'intérêt `biologie` (D2, PANO-89 lot 4) — biologie (champ savoir).
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la biologie FR : concepts, figures, sous-champs. Usage SOBRE (édition/edtech).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « adn », « mitose », « meiose », « darwin », « genetique », « photosynthese »,
//     « chromosome », « microbiologie », « biodiversite », « membrane cellulaire ».
//   · ANCRÉ — « cellule » (prison / téléphone), « evolution », « espece » (espèces / cash),
//     « gene » (« gêne »), « culture » (culture bactérienne / générale), « milieu », « noyau » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
//   · SOLO — « biology », « dna », « mitosis », « meiosis », « genetics », « photosynthesis »,
//     « microbiology », « biodiversity », « ecosystem », « natural selection », « molecular
//     biology », « organism » : univoques.
//   · ANCRÉ — « cell » (cellule de PRISON / de TABLEUR / téléphone — le 50/50 majeur), « species »,
//     « bacteria » : compagnon requis.
//   · EXCLU — « bio » : en EN, c'est la BIO DE PROFIL (« link in bio », « check my bio ») et la
//     biographie, bien avant la biologie. ÉCARTÉ, même en ancré — un marqueur de plateforme n'a
//     rien à faire dans un lexique de savoir.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Champ SAVOIR. Aucun marqueur de pathologie/vécu médical (reste `health_physical`, D1).

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
    // Variantes EN (PANO-88) : SOLO univoques.
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
    'cellule', // prison / téléphone
    'evolution', // évolution générique
    'espece', // espèces (cash) / espèce
    'gene', // « gêne » (homophone) / gène
    'culture', // culture bactérienne / culture générale
    'milieu', // milieu (environnement) / au milieu
    'noyau', // noyau (fruit) / noyau cellulaire
    'bacterie', // fairly bio mais gardé ancré
    // Variantes EN (PANO-88) : ANCRÉS.
    'cell', // cellule de prison / de tableur / téléphone — le 50/50 majeur (EN)
    'species', // espèce générique (EN)
    'bacteria', // graphie EN de « bacterie »
  ],
  selfDeclared: ['etudiant en biologie'],
};
