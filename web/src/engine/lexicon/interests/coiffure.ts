// Lexique d'intérêt `coiffure` (D2, PANO-77 lot 2 · enrichi entités) — coiffure / soin capillaire.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la coiffure FR : coupes, TECHNIQUES de couleur, soins, MARQUES et outils.
// À l'aveugle ; techniques/marques = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « coiffure », « brushing », « balayage », « babylights », « ombre hair »,
//     « lissage bresilien », « wolf cut », marques (« kerastase », « olaplex », « steampod »).
//   · ANCRÉ — 50/50 : « coupe » (du monde), « boucles » (buckles), « racines » (origines), « volume »
//     (chevauche muscu/photo), « frange », « coloration », « mulet » (poisson), « ghd », « loreal » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de `maquillage` et `skincare`.

import type { InterestLexicon } from '../types';

export const COIFFURE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'coiffure',
  themeLabel: 'theme.coiffure.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.haircare', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Coupes / techniques
    'coiffure',
    'coiffeur',
    'coiffeuse',
    'brushing',
    'balayage',
    'meches',
    'babylights',
    'tie and dye',
    'lissage bresilien',
    'chignon',
    'tresse',
    'extensions cheveux',
    'apres shampoing',
    'cheveux boucles',
    'carre plongeant',
    'ombre hair',
    'soin capillaire',
    'coupe de cheveux',
    'degrade cheveux',
    'fer a lisser',
    'wolf cut',
    'frange rideau',
    'keratine',
    // Marques / outils
    'kerastase',
    'olaplex',
    'steampod',
    'franck provost',
    'schwarzkopf',
    // Variantes EN (PANO-88) : SOLO univoques.
    'curly girl method',
    'hair routine',
  ],
  anchored: [
    'coupe', // coupe du monde / carrosserie
    'boucles', // buckles / boucles
    'racines', // origines / racines (cheveux)
    'volume', // chevauche muscu (volume de cheveux)
    'frange', // frange générique
    'pointe', // pointe générique
    'coloration', // coloration générique
    'raie', // poisson vs raie (cheveux)
    'mulet', // poisson vs coupe mulet
    'ghd', // sigle marque (court)
    'loreal', // marque large / générique
    'patine', // patine (objet) vs patine (cheveux)
    'blowout', // brushing (EN) vs « blow out » générique
  ],
  selfDeclared: ['coiffeur', 'coiffeuse'],
};
