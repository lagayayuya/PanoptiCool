// Lexique d'intérêt `skincare` (D2, PANO-76 lot 1, réécriture PROFONDE) — soin de la peau.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du soin de la peau FR : produits, actifs, routines. « skincare » LEXICALISÉ
// (dette PANO-35). À l'aveugle depuis l'usage commun.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « skincare », « acide hyaluronique », « retinol », « niacinamide »,
//     « routine skincare » (phrase), « creme hydratante » (phrase), « soin du visage » (phrase).
//   · ANCRÉ — 50/50 : « serum » (médical), « masque » (sanitaire/théâtre), « soin » (générique),
//     « creme » (alimentaire), « peau » (générique), « pores », « hydratation », « gommage » :
//     co-occurrence requise.
//   · EXCLU — rien de désespéré ici ; les 50/50 sont récupérés par ancrage.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Une pathologie dermatologique nommée (eczéma, psoriasis) relèverait de
// `health_physical` (D1) — non captée : on reste sur la routine cosmétique, pas le diagnostic. Le
// garde de frontière vérifie qu'aucun marqueur (dont « acne ») ne déclenche D1.

import type { InterestLexicon } from '../types';

export const SKINCARE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'skincare',
  themeLabel: 'theme.skincare.label',
  usage: [
    {
      actor: 'advertiser',
      usage: { templateId: 'usage.advertiser.skincare-products', params: {} },
    },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'skincare',
    'soin du visage',
    'creme hydratante',
    'serum visage',
    'acide hyaluronique',
    'retinol',
    'niacinamide',
    'nettoyant visage',
    'routine skincare',
    'gommage visage',
    'masque visage',
    'contour des yeux',
    'points noirs',
    'creme solaire',
    'double nettoyage',
    'soin hydratant',
    'exfoliant visage',
    'vitamine c serum',
    'peau grasse',
    'peau seche visage',
    // Marques & jargon (rétrofit PANO-90)
    'cerave',
    'the ordinary',
    'la roche posay',
    'bioderma',
    'glass skin',
    'slugging',
    'acide salicylique',
    'ceramides',
    // Variantes EN (PANO-88) : SOLO univoques (jargon skincare).
    'skin barrier',
    'grwm',
  ],
  anchored: [
    'serum', // sérum médical
    'masque', // masque sanitaire / théâtre
    'soin', // soin générique
    'creme', // crème alimentaire
    'peau', // peau (générique)
    'pores', // pores vs générique
    'hydratation', // hydratation (sport/santé) vs cosmétique
    'gommage', // gommage (autre) vs exfoliation
    'imperfections', // imperfections cutanées vs générique
    'aha', // acide (skincare) vs sigle / interjection
    'bha', // acide (skincare) vs sigle
    'avene', // marque vs générique
    'glow up', // transformation beauté vs générique (EN)
  ],
};
