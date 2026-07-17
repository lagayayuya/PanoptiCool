// Lexique d'intérêt `histoire` (D2, PANO-89 lot 4) — histoire (champ savoir).
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de l'histoire FR : périodes, figures, faits historiques. Entités = signal
// public générique enrichi par recherche. Usage SOBRE (édition/edtech).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — périodes/figures univoques : « antiquite », « moyen age », « renaissance », « medieval »,
//     « napoleon », « jules cesar », « revolution francaise », « prehistoire », « empire romain »,
//     « pharaon », « croisades », « seconde guerre mondiale ».
//   · ANCRÉ — « histoire » (« une histoire » = récit), « empire », « guerre », « siecle », « roi »,
//     « bataille », « epoque », « dynastie » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
//   · SOLO — périodes / figures / faits nommés : « middle ages », « ancient rome », « roman empire »,
//     « ancient egypt », « pharaoh », « crusades », « prehistory », « french revolution »,
//     « world war two », « ww2 », « julius caesar », « antiquity », « historian », « archaeology ».
//   · ANCRÉ — « history » : LE PIÈGE MAJEUR de tout le lot. En EN, « history » est du vocabulaire de
//     PLATEFORME avant d'être une discipline — « search history », « watch history », « browsing
//     history », « clear my history », « my history with him ». Ancré, jamais solo. Aussi « war »
//     (actualité), « king » (Stephen King / Burger King / roi des échecs), « battle » (DANCE battle,
//     RAP battle — partagés `danse`/`rap`), « century », « dynasty » (la SÉRIE TV), « empire ».
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Champ SAVOIR (périodes, figures, faits passés), JAMAIS l'ACTUALITÉ ni la POLITIQUE
// partisane (→ `politics`, D1). Les guerres nommées sont des faits historiques ; « guerre » nu est
// ancré (compagnon historique requis) pour ne pas capter l'actualité.

import type { InterestLexicon } from '../types';

export const HISTOIRE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'histoire',
  themeLabel: 'theme.histoire.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.edtech', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'antiquite',
    'moyen age',
    'renaissance',
    'medieval',
    'napoleon',
    'jules cesar',
    'revolution francaise',
    'prehistoire',
    'empire romain',
    'feodalite',
    'seconde guerre mondiale',
    'egypte antique',
    'pharaon',
    'croisades',
    'louis xiv',
    'histoire de france',
    'gaulois',
    'archeologie',
    // Variantes EN (PANO-88) : SOLO — périodes / figures / faits NOMMÉS (jamais l'actualité).
    'middle ages',
    'ancient rome',
    'roman empire',
    'ancient egypt',
    'pharaoh',
    'crusades',
    'prehistory',
    'french revolution',
    'world war two',
    'ww2',
    'julius caesar',
    'antiquity',
    'historian',
    'archaeology',
  ],
  anchored: [
    'histoire', // « une histoire » (récit) / « histoires »
    'empire', // Empire State / empire générique
    'guerre', // actualité vs guerre historique
    'siecle', // siècle générique
    'roi', // roi générique / « roi de la fête »
    'bataille', // bataille générique
    'epoque', // « à l'époque »
    'dynastie', // dynastie générique
    // Variantes EN (PANO-88) : ANCRÉS.
    'history', // « search / watch / browsing history » — vocabulaire de PLATEFORME (EN) : piège majeur
    'war', // actualité vs guerre historique (EN)
    'king', // Stephen King / Burger King / roi des échecs (EN)
    'battle', // dance battle / rap battle — partagés danse, rap (EN)
    'century', // siècle générique (EN)
    'dynasty', // la série TV (EN)
  ],
  selfDeclared: ['passionne d histoire'],
};
