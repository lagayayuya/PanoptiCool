// Interest lexicon `philosophie` (D2, PANO-89 batch 4) — philosophy (knowledge field).
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR philosophy: thinkers, currents, concepts. Entities = generic public
// signal enriched by research. SOBER usage (publishing/edtech, not a fake marketing segment).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal thinkers and currents: « nietzsche », « descartes », « sartre », « foucault »,
//     « spinoza », « stoicisme », « existentialisme », « metaphysique », « epistemologie », « cogito ».
//   · ANCHORED — generic concepts: « morale », « ethique », « raison », « verite », « conscience »,
//     « liberte », « etre » (verb), « kant » (« quant »): co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
//   · SOLO — univocal currents and thinkers: « philosopher », « stoicism », « existentialism »,
//     « metaphysics », « epistemology », « phenomenology », « nihilism », « empiricism »,
//     « socrates », « aristotle », « trolley problem ».
//   · ANCHORED — « philosophy » (the MAJOR TRAP: « my philosophy in life », « our company
//     philosophy » — the « personal motto » sense is at least as common as the
//     discipline), « ethics » (« work ethics », ethics committee), « morality », « free will »,
//     « consciousness », « plato » (Play-Doh, approximate homophone): companion required.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. KNOWLEDGE field (thinkers, currents), never partisan political opinion.

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
    // EN variants (PANO-88): SOLO univocal (currents / thinkers / textbook cases).
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
    'morale', // generic morals
    'ethique', // generic ethics
    'raison', // reason / « avoir raison »
    'verite', // generic truth
    'conscience', // generic consciousness/conscience
    'liberte', // generic freedom
    'etre', // verb to be / being
    'kant', // « quant à » (homophone) vs Kant
    'platon', // fairly univocal but kept anchored (rare first name)
    // EN variants (PANO-88): ANCHORED.
    'philosophy', // « my philosophy in life » / « company philosophy » — major trap (EN)
    'ethics', // « work ethics » / ethics committee (EN)
    'morality', // generic morals (EN)
    'free will', // free will / common usage (EN)
    'consciousness', // generic consciousness (EN)
    'plato', // Play-Doh (approximate homophone) vs Plato (EN)
  ],
  selfDeclared: ['etudiant en philosophie'],
};
