// Lexique d'intérêt `guitare` (D2, PANO-78 lot 3) — guitare & instruments.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la guitare/musique FR : techniques, matériel, MARQUES, autres instruments.
// Entités = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « guitare », « guitariste », « riff », « tablature », « mediator », « stratocaster »,
//     « telecaster », « capodastre », « solfege », « arpege », « ampli », « ibanez ».
//   · ANCRÉ — « fender » (aile de voiture), « gibson » (prénom), « marshall » (prénom), « martin »,
//     « taylor », « accord » (entente), « corde » (lien), « manche » (bras), « basse » (bas), « boss »,
//     « pedale », « yamaha » (partagé motos) : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Usage EN vérifié par recherche (glossaires lutherie / apprentissage).
//   · SOLO — « fretboard », « barre chord », « power chord », « pentatonic », « humbucker »,
//     « single coil », « whammy bar », « floyd rose », « fingerpicking », « palm mute », « hammer on »,
//     « pull off », « alternate picking », « sweep picking », « truss rod », « plectrum »,
//     « stompbox », « pedalboard », « tube amp », « drop d », « open tuning », « guitartok ».
//   · ANCRÉ — « fret » (= S'INQUIÉTER, verbe courant), « pick » (choisir ; le pick du jeu vidéo),
//     « capo » (un lieutenant de la mafia), « tabs » (les ONGLETS du navigateur), « scale » (la
//     balance, « scale up »), « strings » (les chaînes de caractères), « amp » (« amped up » = surexcité ;
//     l'ampère), « tone » (le ton de la voix), « rig » (le PC de gamer), « solo » (seul ; le solo queue),
//     « shred » (le skate ; « shredded » = musclé), « bend », « lick », « nut », « overdrive » :
//     compagnon requis.
//   · ÉCARTÉ — « luthier », « intonation » : mots FRANÇAIS à l'identique, pas des variantes.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible.

import type { InterestLexicon } from '../types';

export const GUITARE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'guitare',
  themeLabel: 'theme.guitare.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.music-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'guitare',
    'guitariste',
    'riff',
    'tablature',
    'mediator',
    'capodastre',
    'stratocaster',
    'telecaster',
    'les paul',
    'ampli guitare',
    'arpege',
    'solfege',
    'partition',
    'tapping',
    'sweeping',
    'distorsion',
    'ibanez',
    'guitare electrique',
    'ukulele',
    // Variantes EN (PANO-88) : SOLO univoques (techniques / lutherie / matériel).
    'fretboard',
    'barre chord',
    'power chord',
    'pentatonic',
    'humbucker',
    'single coil',
    'whammy bar',
    'floyd rose',
    'fingerpicking',
    'palm mute',
    'hammer on',
    'pull off',
    'alternate picking',
    'sweep picking',
    'truss rod',
    'plectrum',
    'stompbox',
    'pedalboard',
    'tube amp',
    'drop d',
    'open tuning',
    'guitartok',
  ],
  anchored: [
    'fender', // aile de voiture vs marque
    'gibson', // prénom / marque
    'marshall', // prénom / marque
    'martin', // prénom / marque
    'taylor', // prénom / marque
    'accord', // entente vs accord (musique)
    'corde', // lien vs corde (instrument)
    'manche', // bras vs manche (guitare)
    'basse', // bas vs basse (instrument)
    'boss', // patron / marque de pédales
    'pedale', // partagé (voitures/cyclisme)
    'yamaha', // partagé motos
    'ampli',
    // Variantes EN (PANO-88) : ANCRÉS.
    'fret', // « to fret » = s'inquiéter, verbe courant (EN)
    'pick', // choisir / le pick du jeu vidéo (EN)
    'capo', // un lieutenant de la mafia (EN)
    'tabs', // = les onglets du navigateur (EN)
    'scale', // la balance / « scale up » (EN)
    'strings', // les chaînes de caractères / « no strings attached » (EN)
    'amp', // « amped up » = surexcité / l'ampère (EN)
    'tone', // le ton de la voix (EN)
    'rig', // le PC de gamer / plateforme pétrolière (EN)
    'shred', // le skate / « shredded » = musclé (EN)
    'bend', // courber / un virage (EN)
    'lick', // lécher (EN)
    'nut', // la noix / « going nuts » vs le sillet (EN)
    'overdrive', // « into overdrive » = à plein régime (EN)
  ],
  selfDeclared: ['guitariste', 'musicien', 'musicienne'],
};
