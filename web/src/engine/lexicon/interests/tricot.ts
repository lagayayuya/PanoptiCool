// Interest lexicon `tricot` (D2, PANO-89 batch 4) — knitting / crochet.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR knitting/crochet: techniques, gear, brands. Entities = generic public
// signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « tricot », « amigurumi », « granny square », « point mousse », « aiguilles a tricoter »,
//     « pelote de laine », « phildar », « bergere de france », « tricoter », « crocheter ».
//   · ANCHORED — « crochet » (shared with combat sports / fishhook), « maille » (mesh / money slang),
//     « jersey » (island / jersey), « point » (generic stitch/point), « laine » (« laine de verre »),
//     « pelote » (Basque pelota), « torsade »: co-occurrence.
//   · EXCLUDED — nothing hopeless.
//
// ── EN variants (PANO-88) — FP probe ───────────────────────────────────────────────────────────
// Real EN usage verified by research (knitting/crochet glossaries, community slang).
//   · SOLO — « knitting », « knitting needles », « crochet hook », « frogging » (undoing your
//     work, « rip-it rip-it »), « purl », « skein », « stockinette », « yarnie »: univocal.
//   · ANCHORED — « yarn » (« spin a yarn » = tell a story), « stash » (hideout / generic
//     reserve), « wip » (« work in progress » — shared with `dessin`, writing, DIY), « cast on »:
//     companion required.
//   · EXCLUDED — the community ABBREVIATIONS, though real, are all discarded: « ufo » (« unfinished
//     object » ↔ FLYING SAUCER), « sable » (« stash accumulated beyond life expectancy » ↔ sand/
//     sable, and already anchored in `patisserie`), « fo », « cal », « tink » (↔ Tinkerbell) → too short
//     or too polysemous for a tier, even anchored.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive.

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
    // EN variants (PANO-88): univocal SOLO (techniques / gear / community slang).
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
    'crochet', // shared with combat sports / fishhook
    'maille', // mesh / money slang
    'jersey', // island / jersey
    'point', // generic stitch/point
    'laine', // « laine de verre »
    'pelote', // Basque pelota
    'torsade', // generic cable/twist
    // EN variants (PANO-88): ANCHORED.
    'yarn', // « spin a yarn » = tell a story (EN)
    'stash', // hideout / generic reserve (EN)
    'wip', // « work in progress » — shared with drawing / writing / DIY (EN)
    'cast on', // generic « cast » (EN)
  ],
  selfDeclared: ['tricoteuse', 'tricoteur'],
};
