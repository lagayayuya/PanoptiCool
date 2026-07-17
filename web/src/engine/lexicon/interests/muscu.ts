// Lexique d'intérêt `muscu` (D2, PANO-76 lot 1, réécriture PROFONDE) — musculation / renforcement.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la musculation FR : exercices, matériel, nutrition sportive, jargon salle.
// Écrit à l'aveugle depuis l'usage commun, jamais depuis un export.
//
// ── Méthode recall (PANO-76 reprise) ───────────────────────────────────────────────────────────
// On INCLUT riche ; le plancher + le classement du socle noient le bruit résiduel. Deux tiers :
//   · SOLO — quasi-univoques, rentrent seuls (« musculation », « squat », « deadlift »).
//   · ANCRÉ — 50/50 dont le sens NON-sportif est courant : ne comptent qu'avec un compagnon du
//     domaine (« seche » près de « muscu », pas « la terre est seche »).
//   · EXCLU — le vraiment désespéré : « masse » (foule), « serie » (TV), « pompe » (chaussure/à eau).
//
// ── Entités (rétrofit standard, PANO-90) ───────────────────────────────────────────────────────
// Marques de nutrition/apparel et jargon de salle ajoutés : « myprotein », « gymshark », « drop set »,
// « rm » (rep max, ancré). Recherche publique.
//
// ── Variantes anglaises (PANO-88) ──────────────────────────────────────────────────────────────
// EN courant en FR : SOLO univoques (« workout », « push day », « pull day », « leg day ») ; ANCRÉ
// polysémiques (« gym » = gymnastique/prénom, « bulk » = vrac, « shredded » = déchiqueté).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de « fitness/cross-training » (thème séparé). Le RAPPORT AU CORPS / les TCA
// restent D1 : aucun marqueur de poids, calories ou restriction (« sèche » = coupe sportive, ancrée).

import type { InterestLexicon } from '../types';

export const MUSCU_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'muscu',
  themeLabel: 'theme.muscu.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.supplements', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'musculation',
    'muscu',
    'salle de sport',
    'salle de muscu',
    'prise de masse',
    'developpe couche',
    'souleve de terre',
    'deadlift',
    'squat',
    'soulever de la fonte',
    'gainage',
    'hypertrophie',
    'street workout',
    'programme full body',
    'push pull legs',
    'halteres',
    'barre de traction',
    'kettlebell',
    'biceps',
    'triceps',
    'pectoraux',
    'quadriceps',
    'ischios',
    'abdos',
    'proteine en poudre',
    'whey',
    'creatine',
    'shaker proteine',
    'temps sous tension',
    'a la salle',
    'jour de bras',
    'seance jambes',
    'seance pecs',
    'seance dos',
    // Marques & jargon (rétrofit PANO-90)
    'myprotein',
    'gymshark',
    'optimum nutrition',
    'nutrimuscle',
    'drop set',
    'superset',
    'prise de force',
    'bcaa',
    'shaker whey',
    // Variantes EN (PANO-88)
    'workout',
    'push day',
    'pull day',
    'leg day',
  ],
  anchored: [
    'seche', // coupe sportive vs « sec / la terre sèche »
    'volume', // phase de volume vs « le volume sonore »
    'serie', // série de reps vs série TV → ancré (le sens TV domine hors contexte)
    'reps', // répétitions vs abréviation quelconque
    'fonte', // soulever de la fonte vs « la fonte des neiges »
    'charge', // charge de travail vs « charge mentale / à charge »
    'bras', // jour de bras vs bras générique
    'rm', // rep max vs sigle générique
    'congestion', // congestion musculaire vs trafic / médical
    'gym', // salle vs gymnastique / prénom (EN)
    'bulk', // phase de volume vs « en vrac » (EN)
    'shredded', // sec/dessiné vs « déchiqueté » (EN)
  ],
  selfDeclared: ['bodybuilder', 'pratiquant de muscu', 'powerlifter'],
};
