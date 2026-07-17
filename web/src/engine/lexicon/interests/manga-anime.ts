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
  ],
  selfDeclared: ['otaku', 'fan de manga'],
};
