// Lexique d'intérêt `economie` (D2, PANO-89 lot 4) — économie (champ savoir).
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de l'économie FR : concepts, théoriciens, indicateurs. Entités = signal public
// générique enrichi par recherche. Usage SOBRE (édition/edtech).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — concepts/théoriciens univoques : « microeconomie », « macroeconomie », « inflation »,
//     « pib », « keynes », « adam smith », « offre et demande », « recession », « deflation »,
//     « banque centrale », « produit interieur brut ».
//   · ANCRÉ — « economie » (« faire des économies »), « marche » (marché / marche), « croissance »,
//     « monnaie », « offre », « demande », « bourse » (sac / scolarité), « karl marx » (Marx Brothers) : co-occurrence.
//   · EXCLU — « capitalisme »/« communisme » (idéologies → frôlent `politics`, D1) écartés par prudence.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// L'EN est ici PLUS précis que le FR : il SÉPARE la discipline (« economics ») de la chose et de
// l'épargne (« economy »), là où « économie » fusionne les trois. On exploite la séparation.
//   · SOLO — « economics », « microeconomics », « macroeconomics », « gdp », « supply and demand »,
//     « central bank », « interest rate », « monetary policy », « globalization », « stock market ».
//   · ANCRÉ — « economy » (« ECONOMY CLASS », « fuel economy », « the economy » — jamais solo),
//     « growth » (« personal growth », « growth mindset »), « market », « currency » (partagé
//     `crypto`), « supply », « demand », « proof » : compagnon requis.
//   · EXCLUS EN — « capitalism », « communism », « socialism », « inequality » : miroir exact de
//     l'exclusion FR des « -ismes » militants (frôlent `politics`, D1).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Champ SAVOIR (théories, concepts, indicateurs), JAMAIS l'ACTUALITÉ ni la POLITIQUE
// partisane (→ `politics`, D1). Marx figure comme THÉORICIEN de l'économie, jamais comme étiquette
// idéologique ; les « -ismes » militants sont exclus.

import type { InterestLexicon } from '../types';

export const ECONOMIE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'economie',
  themeLabel: 'theme.economie.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.edtech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'microeconomie',
    'macroeconomie',
    'inflation',
    'pib',
    'keynes',
    'adam smith',
    'offre et demande',
    'recession',
    'deflation',
    'banque centrale',
    'produit interieur brut',
    'taux d interet',
    'politique monetaire',
    'mondialisation',
    'karl marx',
    // Variantes EN (PANO-88) : SOLO — « economics » EST la discipline (l'EN sépare, le FR fusionne).
    'economics',
    'microeconomics',
    'macroeconomics',
    'gdp',
    'supply and demand',
    'central bank',
    'interest rate',
    'monetary policy',
    'globalization',
    'stock market',
  ],
  anchored: [
    'economie', // « faire des économies »
    'marche', // marché / marche (verbe)
    'croissance', // croissance générique
    'monnaie', // monnaie (rendu) / devise
    'offre', // offre générique
    'demande', // demande générique
    'bourse', // sac / scolarité vs bourse (finance)
    'capital', // partagé sociologie / générique
    // Variantes EN (PANO-88) : ANCRÉS.
    'economy', // « economy class » / « fuel economy » / « the economy » — jamais solo (EN)
    'growth', // « personal growth » / « growth mindset » (EN)
    'market', // marché générique (EN)
    'currency', // partagé crypto (EN)
    'supply', // offre générique (EN)
    'demand', // demande générique (EN)
  ],
  selfDeclared: ['etudiant en economie'],
};
