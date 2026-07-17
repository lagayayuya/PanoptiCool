// Lexique d'intérêt `philosophie` (D2, PANO-89 lot 4) — philosophie (champ savoir).
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la philosophie FR : penseurs, courants, concepts. Entités = signal public
// générique enrichi par recherche. Usage SOBRE (édition/edtech, pas un faux segment marketing).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — penseurs et courants univoques : « nietzsche », « descartes », « sartre », « foucault »,
//     « spinoza », « stoicisme », « existentialisme », « metaphysique », « epistemologie », « cogito ».
//   · ANCRÉ — concepts génériques : « morale », « ethique », « raison », « verite », « conscience »,
//     « liberte », « etre » (verbe), « kant » (« quant ») : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
//   · SOLO — courants et penseurs univoques : « philosopher », « stoicism », « existentialism »,
//     « metaphysics », « epistemology », « phenomenology », « nihilism », « empiricism »,
//     « socrates », « aristotle », « trolley problem ».
//   · ANCRÉ — « philosophy » (le PIÈGE MAJEUR : « my philosophy in life », « our company
//     philosophy » — l'acception « devise personnelle » est au moins aussi courante que la
//     discipline), « ethics » (« work ethics », comité d'éthique), « morality », « free will »,
//     « consciousness », « plato » (Play-Doh, homophone approché) : compagnon requis.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Champ SAVOIR (penseurs, courants), jamais l'opinion politique partisane.

import type { InterestLexicon } from '../types';

export const PHILOSOPHIE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'philosophie',
  themeLabel: 'theme.philosophie.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.edtech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'philosophie',
    'philosophe',
    'stoicisme',
    'existentialisme',
    'metaphysique',
    'epistemologie',
    'phenomenologie',
    'nietzsche',
    'descartes',
    'sartre',
    'foucault',
    'spinoza',
    'socrate',
    'aristote',
    'epicurisme',
    'nihilisme',
    'dialectique',
    'empirisme',
    'cogito',
    // Variantes EN (PANO-88) : SOLO univoques (courants / penseurs / cas d'école).
    'philosopher',
    'stoicism',
    'existentialism',
    'metaphysics',
    'epistemology',
    'phenomenology',
    'nihilism',
    'empiricism',
    'socrates',
    'aristotle',
    'trolley problem',
  ],
  anchored: [
    'morale', // morale générique
    'ethique', // éthique générique
    'raison', // raison / « avoir raison »
    'verite', // vérité générique
    'conscience', // conscience générique
    'liberte', // liberté générique
    'etre', // verbe être / l'être
    'kant', // « quant à » (homophone) vs Kant
    'platon', // fairly univoque mais gardé ancré (prénom rare)
    // Variantes EN (PANO-88) : ANCRÉS.
    'philosophy', // « my philosophy in life » / « company philosophy » — piège majeur (EN)
    'ethics', // « work ethics » / comité d'éthique (EN)
    'morality', // morale générique (EN)
    'free will', // libre arbitre / usage courant (EN)
    'consciousness', // conscience générique (EN)
    'plato', // Play-Doh (homophone approché) vs Platon (EN)
  ],
  selfDeclared: ['etudiant en philosophie'],
};
