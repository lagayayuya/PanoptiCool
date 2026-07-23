// Interest lexicon `rap` (D2, PANO-77 batch 2 · entities enriched) — rap / hip-hop.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR rap: genre, studio/scene jargon, emblematic ARTISTS. Blind;
// artists and jargon = generic public signal enriched by research (FR scene, slang).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — genre/culture + univocal artists: « rap », « freestyle », « punchline », « mixtape »,
//     « egotrip », « ninho », « damso », « nekfeu », « gazo », « tiakola », « soolking ».
//   · ANCHORED — 50/50: « flow » (river), « prod », « feat », « trap » (trap), « drill » (drill),
//     « sample », « jul » (first name/month), « sch », « zola » (Émile Zola), « leto », « dinos »: co-occurrence.
//   · EXCLUDED — « clash » (= conflict, brushes the aggressive sense) discarded out of caution.
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// EN-only layer of anglophone rap, on top of the FR scene already covered.
//   · SOLO — « cypher », « diss track », « type beat », « battle rap », « crate digging », « emcee »,
//     « ghostwriter », « uk drill », « drill music », « trap beat », « g funk », « sixteen bars »,
//     « ad libs », « double time flow », « lyricism », « hiphopheads ».
//   · ANCHORED — « bars » (the BARS where one drinks, chocolate bars, signal bars: a very
//     frequent word, big FP provider), « mc » (acronym), « hook » (the door hook, the BOXING
//     hook), « verse » (the biblical verse), « label » (the label): companion required.
//   · NOTE — « drill » and « trap » stay anchored (already there): they are the DRILL and the TRAP. Only
//     their compound forms (« uk drill », « drill music », « trap beat ») enter solo.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. Markers = genre/culture VOCABULARY, never lyric CONTENT (violence,
// politics) — the D1 boundary is held by the lexicon, not by the subject of the tracks.

import type { InterestLexicon } from '../types';

export const RAP_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'rap',
  themeLabel: 'theme.rap.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.music-streaming', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Genre / culture
    'rap',
    'rappeur',
    'rappeuse',
    'hip hop',
    'freestyle',
    'punchline',
    'beatmaker',
    'clip rap',
    'rap francais',
    'mixtape',
    'egotrip',
    'boom bap',
    'rap game',
    'instru rap',
    // Artists (univocal)
    'ninho',
    'werenoi',
    'tiakola',
    'gazo',
    'damso',
    'nekfeu',
    'orelsan',
    'booba',
    'kaaris',
    'niska',
    'laylow',
    'soolking',
    'sofiane',
    'alonzo',
    'sdm',
    'koba lad',
    'freeze corleone',
    'lomepal',
    'josman',
    // Jargon / industry
    'adlib',
    'sacem',
    'disque d or',
    // EN variants (PANO-88): SOLO univocal (anglophone scene / studio jargon).
    'cypher',
    'diss track',
    'type beat',
    'battle rap',
    'crate digging',
    'emcee',
    'ghostwriter',
    'uk drill',
    'drill music',
    'trap beat',
    'g funk',
    'sixteen bars',
    'ad libs',
    'double time flow',
    'lyricism',
    'hiphopheads',
  ],
  anchored: [
    'rime', // generic rhyme
    'flow', // river / generic English
    'prod', // generic production
    'feat', // featuring / English
    'trap', // trap
    'drill', // drill (tool)
    'sample', // sample
    'couplet', // generic verse
    'jul', // first name / July
    'sch', // ambiguous acronym
    'zola', // Émile Zola vs the rapper
    'leto', // Jared Leto / first name
    'dinos', // dinosaurs vs the rapper
    'maes', // common surname vs the rapper
    'hamza', // common first name vs the rapper
    'plug', // plug (English) vs plug (rap)
    // EN variants (PANO-88): ANCHORED.
    'bars', // the bars where one drinks / chocolate bars / signal bars (EN)
    'mc', // acronym — also generic « master of ceremonies » (EN)
    'hook', // door hook / boxing hook (EN)
    'verse', // the biblical verse (EN)
    'label', // the label / to label a file (EN)
  ],
  selfDeclared: ['rappeur', 'rappeuse'],
};
