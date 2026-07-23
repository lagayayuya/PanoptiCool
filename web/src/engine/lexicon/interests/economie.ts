// Interest lexicon `economie` (D2, PANO-89 batch 4) — economics (knowledge field).
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR economics: concepts, theorists, indicators. Entities = generic public
// signal enriched by research. SOBER usage (publishing/edtech).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal concepts/theorists: « microeconomie », « macroeconomie », « inflation »,
//     « pib », « keynes », « adam smith », « offre et demande », « recession », « deflation »,
//     « banque centrale », « produit interieur brut ».
//   · ANCHORED — « economie » (« faire des économies »), « marche » (market / step), « croissance »,
//     « monnaie », « offre », « demande », « bourse » (bag / scholarship), « karl marx » (Marx Brothers): co-occurrence.
//   · EXCLUDED — « capitalisme »/« communisme » (ideologies → brush `politics`, D1) discarded out of caution.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// EN here is MORE precise than FR: it SEPARATES the discipline (« economics ») from the thing and
// from saving (« economy »), where « économie » fuses the three. We exploit the separation.
//   · SOLO — « economics », « microeconomics », « macroeconomics », « gdp », « supply and demand »,
//     « central bank », « interest rate », « monetary policy », « globalization », « stock market ».
//   · ANCHORED — « economy » (« ECONOMY CLASS », « fuel economy », « the economy » — never solo),
//     « growth » (« personal growth », « growth mindset »), « market », « currency » (shared
//     `crypto`), « supply », « demand », « proof »: companion required.
//   · EN EXCLUDED — « capitalism », « communism », « socialism », « inequality »: exact mirror of
//     the FR exclusion of militant « -isms » (brush `politics`, D1).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. KNOWLEDGE field (theories, concepts, indicators), NEVER the NEWS nor partisan
// POLITICS (→ `politics`, D1). Marx appears as an economic THEORIST, never as an ideological
// label; the militant « -isms » are excluded.

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
    // EN variants (PANO-88): SOLO — « economics » IS the discipline (EN separates, FR fuses).
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
    'marche', // market / step (verb)
    'croissance', // generic growth
    'monnaie', // change (money) / currency
    'offre', // generic offer
    'demande', // generic demand
    'bourse', // bag / scholarship vs bourse (finance)
    'capital', // shared sociologie / generic
    // EN variants (PANO-88): ANCHORED.
    'economy', // « economy class » / « fuel economy » / « the economy » — never solo (EN)
    'growth', // « personal growth » / « growth mindset » (EN)
    'market', // generic market (EN)
    'currency', // shared crypto (EN)
    'supply', // generic supply (EN)
    'demand', // generic demand (EN)
  ],
  selfDeclared: ['etudiant en economie'],
};
