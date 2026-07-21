// Lexique d'intérêt `manga_anime` (D2, PANO-76 lot 1, réécriture PROFONDE) — manga & animation JP.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du manga / anime FR : genres, œuvres emblématiques (entités publiques enrichies
// par recherche), jargon fandom. À l'aveugle depuis l'usage commun.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — genres et titres univoques (souvent multi-mots, sûrs) : « manga », « mangaka »,
//     « shonen », « vostfr », « otaku », « naruto », « dragon ball », « demon slayer »,
//     « jujutsu kaisen », « attack on titan », « my hero academia », « chainsaw man », etc.
//   · ANCRÉ — homographes RÉCUPÉRÉS par co-occurrence : « anime » (= « animé » adjectif), « bleach »
//     (produit ménager), « one piece » (maillot), « scan » (numérisation), « goku » : comptent près
//     d'un compagnon manga.
//   · EXCLU — « chapitre » nu (livre), « saison » nu (trop générique).
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Le fandom anglophone a son propre lexique, largement translittéré du japonais — donc très univoque.
//   · SOLO — « josei », « mecha », « tsundere », « yandere », « husbando », « scanlation », « fansub »,
//     « simulcast », « light novel », « doujinshi », « chuunibyou », « nakama », « senpai »,
//     « tankobon », « sakuga », « manhwa », « manhua », « omake », « ecchi », « shonen jump »,
//     « myanimelist », « weeb », « weeaboo », « animetok », « powerscaling », « plot armor », « best girl ».
//   · ANCRÉ — « canon » (= l'appareil photo CANON, et « canon » = beau en argot FRANÇAIS : double
//     piège), « sub » (abonné YouTube, remplaçant au foot, sandwich, sous-basse : la pire collision du
//     lot), « dub » (le dub reggae), « op » (« original poster » de Reddit, « overpowered » du jeu),
//     « ship » (expédier un colis), « panel » (panneau solaire), « raw » (fichier RAW), « oshi » : compagnon requis.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de « cinéma & séries » (thème séparé).

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
    // Plateformes, genres & titres (rétrofit PANO-90)
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
    // Variantes EN (PANO-88) : SOLO univoques (genres / fandom / plateformes).
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
    'anime', // = « animé » (adjectif) / « dessin animé »
    'bleach', // produit ménager (mais aussi l'œuvre)
    'one piece', // maillot une pièce
    'scan', // numérisation générique
    'goku', // prénom (personnage) isolé ambigu
    'saga', // saga générique vs saga manga
    'filler', // épisode de remplissage vs « filler » (skincare/générique)
    'arc', // arc narratif vs arc (arme / architecture)
    // Variantes EN (PANO-88) : ANCRÉS.
    'canon', // l'appareil photo Canon ; et « canon » = beau en argot français — double piège (EN)
    'sub', // abonné / remplaçant / sandwich / sous-basse — la pire collision du lot (EN)
    'dub', // le dub reggae vs le doublage (EN)
    'op', // « original poster » (Reddit) / « overpowered » (jeu) vs l'opening (EN)
    'ship', // expédier un colis (EN)
    'panel', // panneau solaire / panel de conférence vs case de manga (EN)
    'raw', // fichier RAW (photo) vs scan non traduit (EN)
    'oshi', // court et ambigu (EN)
  ],
  selfDeclared: ['otaku', 'fan de manga'],
};
