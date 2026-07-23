// Interest lexicon `physique` (D2, PANO-89 batch 4) — physics (knowledge field).
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR physics: concepts, figures, sub-fields. SOBER usage (publishing/edtech).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « physique quantique », « relativite », « einstein », « thermodynamique », « boson »,
//     « electromagnetisme », « fission nucleaire », « entropie », « mecanique quantique », « photon ».
//   · ANCHORED — « physique » (body / PE), « force », « energie », « masse » (crowd / shared muscu),
//     « champ », « onde », « atome », « particule »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// NOTABLE asymmetry: « physique » is anchored in FR because it designates the BODY; « physics » (EN)
// does not carry that sense and becomes SOLO again. The reason for the FR anchoring does not transport.
//   · SOLO — « physics », « quantum physics », « relativity », « general relativity »,
//     « thermodynamics », « quantum mechanics », « electromagnetism », « nuclear fission »,
//     « higgs boson ». (« game physics » is still physics: D2×D2 overlap tolerated.)
//   · ANCHORED — « energy » (« good energy », energy drink), « force », « mass » (= the MASS/service in EN),
//     « field », « wave » (« wave at someone », « new wave »), « atom », « particle », « quantum »
//     (« quantum leap », Quantum of Solace): companion required.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. Bare « physique » never solo (body / PE class).

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
    // EN variants (PANO-88): SOLO — « physics » does NOT designate the body (unlike FR).
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
    'physique', // body / PE class
    'force', // generic force
    'energie', // generic energy
    'masse', // crowd / shared muscu
    'champ', // field (agricultural) / field (physics)
    'onde', // generic wave
    'atome', // atom (figurative) / atom
    'particule', // generic particle
    'quantique', // fairly physics but kept anchored
    // EN variants (PANO-88): ANCHORED.
    'energy', // « good energy » / energy drink (EN)
    'force', // generic force (EN, same spelling as FR)
    'mass', // = the mass/service (EN)
    'field', // field / domain / terrain (EN)
    'wave', // « wave at someone » / « new wave » (EN)
    'atom', // atom (EN)
    'particle', // particle (EN)
    'quantum', // « quantum leap » / Quantum of Solace (EN)
  ],
  selfDeclared: ['etudiant en physique'],
};
