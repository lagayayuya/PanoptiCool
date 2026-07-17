// Lexique d'intérêt `cinema_series` (D2, PANO-77 lot 2 · enrichi entités) — cinéma & séries.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant du cinéma / des séries FR : métiers, formats, PLATEFORMES, FRANCHISES,
// RÉALISATEURS, JARGON spectateur. À l'aveugle ; entités = signal public générique enrichi par
// recherche (services de streaming, franchises, studios, jargon fandom).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « realisateur », « box office », « blockbuster », « spoiler », « reboot »,
//     plateformes (« netflix », « disney plus »), franchises (« marvel », « star wars »), studios
//     (« a24 », « pixar »), réalisateurs (« tarantino », « scorsese », « nolan »).
//   · ANCRÉ — 50/50 : « film » (plastique), « serie » (sport), « acteur », « scene », « role »,
//     « plan », « ecran », « sortie », « bond » (james bond / lien), « dc » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de « manga_anime ».

import type { InterestLexicon } from '../types';

export const CINEMA_SERIES_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'cinema_series',
  themeLabel: 'theme.cinema-series.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.streaming', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Vocabulaire générique
    'cinema',
    'long metrage',
    'court metrage',
    'realisateur',
    'bande annonce',
    'box office',
    'serie tv',
    'saison finale',
    'blockbuster',
    'science fiction',
    'film d horreur',
    'comedie romantique',
    'seance de cine',
    'grand ecran',
    'binge watching',
    'biopic',
    'avant premiere',
    // Jargon fandom
    'spoiler',
    'reboot',
    'spin off',
    'prequel',
    'cliffhanger',
    'easter egg',
    'cinematic universe',
    'mcu',
    // Plateformes de streaming
    'netflix',
    'prime video',
    'disney plus',
    'hbo max',
    'apple tv',
    'canal plus',
    'paramount plus',
    // Franchises
    'marvel',
    'star wars',
    'harry potter',
    'fast and furious',
    'game of thrones',
    'stranger things',
    'breaking bad',
    // Studios & réalisateurs
    'a24',
    'pixar',
    'dreamworks',
    'tarantino',
    'scorsese',
    'spielberg',
    'nolan',
    'kubrick',
  ],
  anchored: [
    'film', // film plastique / pellicule
    'serie', // série (sport / suite) — chevauche muscu
    'acteur', // agissant
    'scene', // scène (théâtre / crime)
    'role', // rôle générique
    'plan', // carte / projet
    'ecran', // écran générique
    'sortie', // exit vs sortie ciné
    'episode', // épisode générique
    'casting', // casting générique
    'bond', // james bond / lien (anglais)
    'dc', // abréviation
    'villeneuve', // ville vs Denis Villeneuve
    // Variantes EN (PANO-88) : ancrées (polysémiques).
    'plot twist', // rebondissement vs générique (EN)
    'cameo', // apparition vs générique (EN)
    'recap', // résumé d'épisode vs générique (EN)
  ],
  selfDeclared: ['cinephile', 'serievore'],
};
