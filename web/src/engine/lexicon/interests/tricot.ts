// Lexique d'intérêt `tricot` (D2, PANO-89 lot 4) — tricot / crochet.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du tricot/crochet FR : techniques, matériel, marques. Entités = signal public
// générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « tricot », « amigurumi », « granny square », « point mousse », « aiguilles a tricoter »,
//     « pelote de laine », « phildar », « bergere de france », « tricoter », « crocheter ».
//   · ANCRÉ — « crochet » (partagé sports de combat / hameçon), « maille » (mesh / argot argent),
//     « jersey » (île / maillot), « point » (point générique), « laine » (« laine de verre »),
//     « pelote » (pelote basque), « torsade » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Usage EN réel vérifié par recherche (glossaires knitting/crochet, argot communautaire).
//   · SOLO — « knitting », « knitting needles », « crochet hook », « frogging » (défaire son
//     ouvrage, « rip-it rip-it »), « purl », « skein », « stockinette », « yarnie » : univoques.
//   · ANCRÉ — « yarn » (« spin a yarn » = raconter une histoire), « stash » (planque / réserve
//     générique), « wip » (« work in progress » — partagé `dessin`, écriture, DIY), « cast on » :
//     compagnon requis.
//   · EXCLU — les SIGLES de la communauté, pourtant réels, sont tous écartés : « ufo » (« unfinished
//     object » ↔ SOUCOUPE VOLANTE), « sable » (« stash accumulated beyond life expectancy » ↔ sable/
//     zibeline, et déjà ancré en `patisserie`), « fo », « cal », « tink » (↔ Tinkerbell) → trop courts
//     ou trop polysémiques pour un tier, même ancré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const TRICOT_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'tricot',
  themeLabel: 'theme.tricot.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.craft-supplies', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'tricot',
    'amigurumi',
    'granny square',
    'point mousse',
    'aiguilles a tricoter',
    'pelote de laine',
    'phildar',
    'bergere de france',
    'tricoter',
    'crocheter',
    'snood',
    'echarpe tricotee',
    'laine merinos',
    'jacquard tricot',
    'ouvrage tricot',
    // Variantes EN (PANO-88) : SOLO univoques (techniques / matériel / argot communautaire).
    'knitting',
    'knitting needles',
    'crochet hook',
    'frogging',
    'purl',
    'skein',
    'stockinette',
    'yarnie',
  ],
  anchored: [
    'crochet', // partagé sports de combat / hameçon
    'maille', // mesh / argot argent
    'jersey', // île / maillot
    'point', // point générique
    'laine', // « laine de verre »
    'pelote', // pelote basque
    'torsade', // torsade générique
    // Variantes EN (PANO-88) : ANCRÉS.
    'yarn', // « spin a yarn » = raconter une histoire (EN)
    'stash', // planque / réserve générique (EN)
    'wip', // « work in progress » — partagé dessin / écriture / DIY (EN)
    'cast on', // « cast » générique (EN)
  ],
  selfDeclared: ['tricoteuse', 'tricoteur'],
};
