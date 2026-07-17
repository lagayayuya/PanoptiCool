// Lexique d'intérêt `electro` (D2, PANO-78 lot 3) — musique électro / DJ.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de l'électro FR : genres, ARTISTES, festivals, matériel, jargon. Entités =
// signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « techno », « dj set », « david guetta », « daft punk », « charlotte de witte »,
//     « tomorrowland », « french touch », « hardstyle », « boiler room », « platines ».
//   · ANCRÉ — « house » (maison), « trance » (transe), « set », « mix », « drop » (chute), « kick »,
//     « bass », « acid », « justice » (justice / groupe), « garage » (parking / genre), « dj » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. « french touch »/« daft punk » partagés avec la culture musicale large (assumé).

import type { InterestLexicon } from '../types';

export const ELECTRO_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'electro',
  themeLabel: 'theme.electro.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.music-streaming', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'techno',
    'dj set',
    'french touch',
    'hardstyle',
    'boiler room',
    'platines',
    'david guetta',
    'daft punk',
    'charlotte de witte',
    'dj snake',
    'martin garrix',
    'deep house',
    'tech house',
    'drum and bass',
    'tomorrowland',
    'table de mixage',
    'synthe modulaire',
    'edm',
    // Artistes / genres / festivals / matériel (enrichi)
    'gesaffelstein',
    'amelie lens',
    'boris brejcha',
    'kavinsky',
    'bob sinclar',
    'psytrance',
    'dubstep',
    'gabber',
    'synthwave',
    'awakenings',
    'kappa futurfestival',
    'boiler set',
    'controleur midi',
    'vinyle mix',
    'basse ligne',
  ],
  anchored: [
    'house', // maison / house music
    'trance', // transe / genre
    'set', // ensemble / DJ set
    'mix', // mélange / mix
    'drop', // chute / drop
    'kick', // coup / kick (batterie)
    'bass', // basse générique
    'acid', // acide / acid house
    'justice', // justice / le groupe
    'garage', // parking / genre garage
    'dj', // sigle (disc jockey)
    'cdj', // matériel (court)
    'minimal', // minimal générique vs genre
    'hardcore', // intense générique vs genre
    'techhouse', // (gardé ancré, court)
    'bpm', // sigle
    'rave', // rêver (anglais) vs rave party
    'ambient', // ambiant générique vs genre
    'b2b', // back to back (DJ) vs sigle (EN)
    'warm up', // set d'ouverture vs échauffement générique (EN)
  ],
  selfDeclared: ['dj', 'producteur de musique'],
};
