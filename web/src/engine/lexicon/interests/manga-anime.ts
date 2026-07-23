// Interest lexicon `manga_anime` (D2, PANO-76 batch 1, DEEP rewrite) — manga & JP animation.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR manga / anime: genres, emblematic works (public entities enriched
// by research), fandom jargon. Blind from common usage.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal genres and titles (often multi-word, safe): « manga », « mangaka »,
//     « shonen », « vostfr », « otaku », « naruto », « dragon ball », « demon slayer »,
//     « jujutsu kaisen », « attack on titan », « my hero academia », « chainsaw man », etc.
//   · ANCHORED — homographs RECOVERED by co-occurrence: « anime » (= « animé » adjective), « bleach »
//     (cleaning product), « one piece » (swimsuit), « scan » (scanning), « goku »: count near
//     a manga companion.
//   · EXCLUDED — bare « chapitre » (book), bare « saison » (too generic).
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// The anglophone fandom has its own lexicon, largely transliterated from Japanese — hence very univocal.
//   · SOLO — « josei », « mecha », « tsundere », « yandere », « husbando », « scanlation », « fansub »,
//     « simulcast », « light novel », « doujinshi », « chuunibyou », « nakama », « senpai »,
//     « tankobon », « sakuga », « manhwa », « manhua », « omake », « ecchi », « shonen jump »,
//     « myanimelist », « weeb », « weeaboo », « animetok », « powerscaling », « plot armor », « best girl ».
//   · ANCHORED — « canon » (= the CANON camera, and « canon » = good-looking in FRENCH slang: double
//     trap), « sub » (YouTube subscriber, soccer substitute, sandwich, sub-bass: the worst collision of
//     the batch), « dub » (dub reggae), « op » (Reddit « original poster », game « overpowered »),
//     « ship » (to ship a parcel), « panel » (solar panel), « raw » (RAW file), « oshi »: companion required.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from « film & series » (separate theme).

import type { InterestLexicon } from '../types';

export const MANGA_ANIME_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'manga_anime',
  themeLabel: 'theme.manga-anime.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.anime-merch', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'manga',
    'mangaka',
    'shonen',
    'shojo',
    'shoujo',
    'seinen',
    'vostfr',
    'otaku',
    'japanime',
    'waifu',
    'scan manga',
    'webtoon',
    'naruto',
    'dragon ball',
    'demon slayer',
    'jujutsu kaisen',
    'attack on titan',
    'my hero academia',
    'chainsaw man',
    'solo leveling',
    'dandadan',
    'frieren',
    'spy x family',
    'blue lock',
    'hunter x hunter',
    'tokyo ghoul',
    'fullmetal alchemist',
    'death note',
    'sailor moon',
    'one punch man',
    'jujutsu',
    // Platforms, genres & titles (retrofit PANO-90)
    'crunchyroll',
    'manga plus',
    'scantrad',
    'isekai',
    'haikyuu',
    'black clover',
    'vinland saga',
    'evangelion',
    'jojo bizarre adventure',
    'chapitre scan',
    'arc narratif',
    // EN variants (PANO-88): SOLO univocal (genres / fandom / platforms).
    'josei',
    'mecha',
    'tsundere',
    'yandere',
    'husbando',
    'scanlation',
    'fansub',
    'simulcast',
    'light novel',
    'doujinshi',
    'chuunibyou',
    'nakama',
    'senpai',
    'tankobon',
    'sakuga',
    'manhwa',
    'manhua',
    'omake',
    'ecchi',
    'shonen jump',
    'myanimelist',
    'weeb',
    'weeaboo',
    'animetok',
    'weebtiktok',
    'powerscaling',
    'plot armor',
    'best girl',
  ],
  anchored: [
    'anime', // = « animé » (adjective) / « dessin animé »
    'bleach', // cleaning product (but also the work)
    'one piece', // one-piece swimsuit
    'scan', // generic scanning
    'goku', // first name (character) ambiguous in isolation
    'saga', // generic saga vs manga saga
    'filler', // filler episode vs « filler » (skincare/generic)
    'arc', // narrative arc vs arc (weapon / architecture)
    // EN variants (PANO-88): ANCHORED.
    'canon', // the Canon camera; and « canon » = good-looking in French slang — double trap (EN)
    'sub', // subscriber / substitute / sandwich / sub-bass — the worst collision of the batch (EN)
    'dub', // dub reggae vs dubbing (EN)
    'op', // « original poster » (Reddit) / « overpowered » (game) vs the opening (EN)
    'ship', // to ship a parcel (EN)
    'panel', // solar panel / conference panel vs manga panel (EN)
    'raw', // RAW file (photo) vs untranslated scan (EN)
    'oshi', // short and ambiguous (EN)
  ],
  selfDeclared: ['otaku', 'fan de manga'],
};
