// Lexique d'intérêt `mode` (D2, PANO-77 lot 2 · enrichi entités PANO-77 reprise) — mode / style.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la mode FR : pièces, coupes, ESTHÉTIQUES, MAISONS et ENSEIGNES, JARGON de
// communauté. À l'aveugle depuis l'usage commun ; marques/jargon = signal public générique enrichi
// par recherche (maisons de luxe, fast-fashion, argot mode).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « haute couture », « streetwear », « ootd », « y2k », « gorpcore » ; maisons
//     univoques (« balenciaga », « jacquemus », « mugler », « prada », « vinted », « shein »).
//   · ANCRÉ — 50/50 récupérés par co-occurrence : « mode » (mode d'emploi), « look », « style »,
//     « fit », « drip » (goutte), « dupe », marques-mots-courants (« coach », « guess », « mango »,
//     « gap », « celine », « kenzo »).
//   · EXCLU — « ss » / « aw » / « fw » (abréviations saisons) : trop ambigus, « ss » à connotation
//     historique sensible → écartés (on garde « fashion week » en clair).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de « sneakers » et « coiffure ».

import type { InterestLexicon } from '../types';

export const MODE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'mode',
  themeLabel: 'theme.mode.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.fast-fashion', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Vocabulaire générique
    'haute couture',
    'pret a porter',
    'garde robe',
    'dressing',
    'fashion week',
    'defile de mode',
    'streetwear',
    'friperie',
    'seconde main',
    'total look',
    'it bag',
    'fringues',
    'tendance mode',
    'look du jour',
    'lookbook',
    'capsule collection',
    'basique intemporel',
    'sappe',
    // Jargon / esthétiques (argot communauté)
    'ootd',
    'fit check',
    'y2k',
    'old money',
    'quiet luxury',
    'gorpcore',
    'blokecore',
    'thrift',
    'seconde peau',
    // Maisons de luxe (univoques)
    'balenciaga',
    'jacquemus',
    'mugler',
    'prada',
    'dior',
    'saint laurent',
    'bottega veneta',
    'loewe',
    'gucci',
    'chanel',
    'hermes',
    'louis vuitton',
    'givenchy',
    'versace',
    'miu miu',
    'ganni',
    'off white',
    'stone island',
    // Enseignes fast-fashion (univoques)
    'zara',
    'uniqlo',
    'shein',
    'bershka',
    'vinted',
    'kiabi',
    // Variantes EN (PANO-88) : SOLO univoques (formats communauté mode).
    'try on haul',
    'grwm',
  ],
  anchored: [
    'mode', // mode d'emploi / « en mode » / mode avion
    'look', // regard / anglais générique
    'style', // style générique
    'fit', // « fit » (forme) / anglais
    'drip', // goutte à goutte
    'dupe', // duper / copie
    'tenue', // comportement (« tenue de route »)
    'marque', // trace / verbe marquer
    'collection', // collection (timbres)
    'vintage', // ancien générique
    'piece', // salle / monnaie
    'coupe', // coupe du monde / cheveux
    'runway', // piste (aéroport)
    // Marques homographes (mots courants / prénoms)
    'coach', // coach sportif
    'guess', // « guess » (deviner)
    'mango', // fruit
    'gap', // écart
    'celine', // prénom
    'kenzo', // prénom
    'outfit', // tenue vs anglais générique (EN, ancré)
    'haul', // achats mode vs générique (EN)
  ],
  selfDeclared: ['passionnee de mode', 'fashionista', 'styliste'],
};
