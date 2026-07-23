// Interest lexicon `histoire` (D2, PANO-89 batch 4) — history (knowledge field).
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR history: periods, figures, historical facts. Entities = generic
// public signal enriched by research. SOBER usage (publishing/edtech).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal periods/figures: « antiquite », « moyen age », « renaissance », « medieval »,
//     « napoleon », « jules cesar », « revolution francaise », « prehistoire », « empire romain »,
//     « pharaon », « croisades », « seconde guerre mondiale ».
//   · ANCHORED — « histoire » (« une histoire » = story), « empire », « guerre », « siecle », « roi »,
//     « bataille », « epoque », « dynastie »: co-occurrence.
//   · EXCLUDED — nothing desperate.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
//   · SOLO — named periods / figures / facts: « middle ages », « ancient rome », « roman empire »,
//     « ancient egypt », « pharaoh », « crusades », « prehistory », « french revolution »,
//     « world war two », « ww2 », « julius caesar », « antiquity », « historian », « archaeology ».
//   · ANCHORED — « history »: THE MAJOR TRAP of the whole batch. In EN, « history » is PLATFORM
//     vocabulary before being a discipline — « search history », « watch history », « browsing
//     history », « clear my history », « my history with him ». Anchored, never solo. Also « war »
//     (news), « king » (Stephen King / Burger King / chess king), « battle » (DANCE battle,
//     RAP battle — shared `danse`/`rap`), « century », « dynasty » (the TV SERIES), « empire ».
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. KNOWLEDGE field (periods, figures, past facts), NEVER the NEWS nor partisan
// POLITICS (→ `politics`, D1). The named wars are historical facts; bare « guerre » is
// anchored (historical companion required) so as not to capture the news.

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
    // EN variants (PANO-88): SOLO — NAMED periods / figures / facts (never the news).
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
    'histoire', // « une histoire » (story) / « histoires »
    'empire', // Empire State / generic empire
    'guerre', // news vs historical war
    'siecle', // generic century
    'roi', // generic king / « roi de la fête »
    'bataille', // generic battle
    'epoque', // « à l'époque »
    'dynastie', // generic dynasty
    // EN variants (PANO-88): ANCHORED.
    'history', // « search / watch / browsing history » — PLATFORM vocabulary (EN): major trap
    'war', // news vs historical war (EN)
    'king', // Stephen King / Burger King / chess king (EN)
    'battle', // dance battle / rap battle — shared danse, rap (EN)
    'century', // generic century (EN)
    'dynasty', // the TV series (EN)
  ],
  selfDeclared: ['passionne d histoire'],
};
