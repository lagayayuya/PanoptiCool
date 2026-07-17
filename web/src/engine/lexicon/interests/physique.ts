// Lexique d'intérêt `physique` (D2, PANO-89 lot 4) — physique (champ savoir).
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la physique FR : concepts, figures, sous-champs. Usage SOBRE (édition/edtech).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « physique quantique », « relativite », « einstein », « thermodynamique », « boson »,
//     « electromagnetisme », « fission nucleaire », « entropie », « mecanique quantique », « photon ».
//   · ANCRÉ — « physique » (corps / EPS), « force », « energie », « masse » (foule / partagé muscu),
//     « champ », « onde », « atome », « particule » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Asymétrie NOTABLE : « physique » est ancré en FR parce qu'il désigne le CORPS ; « physics » (EN)
// ne porte pas ce sens et redevient SOLO. La raison de l'ancrage FR ne se transporte pas.
//   · SOLO — « physics », « quantum physics », « relativity », « general relativity »,
//     « thermodynamics », « quantum mechanics », « electromagnetism », « nuclear fission »,
//     « higgs boson ». (« game physics » reste de la physique : chevauchement D2×D2 toléré.)
//   · ANCRÉ — « energy » (« good energy », energy drink), « force », « mass » (= la MESSE en EN),
//     « field », « wave » (« wave at someone », « new wave »), « atom », « particle », « quantum »
//     (« quantum leap », Quantum of Solace) : compagnon requis.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. « physique » nu jamais solo (corps / cours d'EPS).

import type { InterestLexicon } from '../types';

export const PHYSIQUE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'physique',
  themeLabel: 'theme.physique.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.edtech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'physique quantique',
    'relativite',
    'einstein',
    'thermodynamique',
    'boson',
    'mecanique quantique',
    'electromagnetisme',
    'fission nucleaire',
    'entropie',
    'photon',
    'electron',
    'neutron',
    'newton',
    'relativite generale',
    'loi de newton',
    // Variantes EN (PANO-88) : SOLO — « physics » ne désigne PAS le corps (contrairement au FR).
    'physics',
    'quantum physics',
    'relativity',
    'general relativity',
    'thermodynamics',
    'quantum mechanics',
    'electromagnetism',
    'nuclear fission',
    'higgs boson',
  ],
  anchored: [
    'physique', // corps / cours d'EPS
    'force', // force générique
    'energie', // énergie générique
    'masse', // foule / partagé muscu
    'champ', // champ (agricole) / champ (physique)
    'onde', // onde générique
    'atome', // atome (au figuré) / atome
    'particule', // particule générique
    'quantique', // fairly physique mais gardé ancré
    // Variantes EN (PANO-88) : ANCRÉS.
    'energy', // « good energy » / energy drink (EN)
    'force', // force générique (EN, même graphie que le FR)
    'mass', // = la messe (EN)
    'field', // champ / domaine / terrain (EN)
    'wave', // « wave at someone » / « new wave » (EN)
    'atom', // atome (EN)
    'particle', // particule (EN)
    'quantum', // « quantum leap » / Quantum of Solace (EN)
  ],
  selfDeclared: ['etudiant en physique'],
};
