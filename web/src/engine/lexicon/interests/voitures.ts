// Lexique d'intérêt `voitures` (D2, PANO-77 lot 2 · enrichi entités) — voitures / tuning.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de l'auto FR : mécanique, MARQUES, jargon TUNING/prépa. À l'aveugle ; marques
// et jargon = signal public générique enrichi par recherche (constructeurs, divisions perf, argot).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « tuning », « bagnole », « jantes », « echappement », « jdm », « cartographie
//     moteur » ; marques (« renault », « peugeot », « bmw », « audi », « ferrari », « tesla »).
//   · ANCRÉ — 50/50 : « moteur » (recherche), « chevaux » (animaux), « break » (pause), « coupe »,
//     « golf » (sport), « m3 » (fichier), « stance », « swap », « alpine » (montagne), « seat » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// L'auto anglophone se dit par la PRÉPA : pièces et opérations nommées, très univoques.
//   · SOLO — « coilovers », « catback », « downpipe », « intercooler », « blow off valve »,
//     « widebody », « ls swap », « vtec », « autocross », « daily driver », « project car », « dyno »,
//     « naturally aspirated », « rev limiter », « drivetrain », « camber », « ceramic coating »,
//     « limited slip », « ecu tune », « torque converter », « ricer », « cartok », « car meet ».
//   · ANCRÉ — « donuts » (la pâtisserie), « rice » (le riz — seul
//     « ricer » est sûr), « build » (le build du jeu ; la construction), « mods » (les mods de jeu, les
//     modérateurs), « tune » (l'accordage d'une `guitare`, « a tune » = un morceau), « track » (le
//     morceau de musique, la piste d'athlétisme), « headers » (les en-têtes HTTP), « cam » (la webcam),
//     « boost », « lift », « slammed », « sleeper », « spec » : compagnon requis.
//   · ÉCARTÉ — les modèles dont le nom est un mot courant (« focus », « golf » déjà ancré, « charger »,
//     « civic », « soul », « note », « fit ») : ils tirent en permanence sur du texte sans rapport.
//   · ÉCARTÉ, et la raison vaut d'être écrite — « burnout » (le burn dans un nuage de fumée). Le mot
//     est un terme `mental_health` : le garde de frontière D1 d'`interests-battery` REFUSE qu'un
//     marqueur d'intérêt coïncide avec un terme sensible, y compris ancré. La règle est catégorique,
//     pas probabiliste — « il faudrait un compagnon » ne suffit pas, parce que ce qu'elle protège
//     n'est pas le taux de FP mais l'absence de tout chemin d'un mot de détresse vers un thème.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. « motos » = thème séparé du catalogue ; ici les 4-roues.

import type { InterestLexicon } from '../types';

export const VOITURES_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'voitures',
  themeLabel: 'theme.voitures.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.automotive', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Vocabulaire générique
    'voiture',
    'bagnole',
    'tuning',
    'jantes',
    'carrosserie',
    'echappement',
    'cheval fiscal',
    'boite manuelle',
    'permis de conduire',
    'code de la route',
    'supercar',
    'berline',
    'cabriolet',
    'essai auto',
    'hot hatch',
    'cylindree',
    'bas de caisse',
    'becquet',
    'ligne inox',
    'cartographie moteur',
    'admission directe',
    'kit carrosserie',
    // Jargon tuning / prépa
    'jdm',
    'restomod',
    'launch control',
    // Marques
    'renault',
    'peugeot',
    'citroen',
    'bmw',
    'audi',
    'mercedes',
    'volkswagen',
    'toyota',
    'ferrari',
    'porsche',
    'lamborghini',
    'tesla',
    'bugatti',
    'maserati',
    'dacia',
    'nissan',
    'subaru',
    'amg',
    // Variantes EN (PANO-88) : SOLO univoques (prépa / pièces / communauté).
    'coilovers',
    'catback',
    'downpipe',
    'intercooler',
    'blow off valve',
    'widebody',
    'ls swap',
    'vtec',
    'autocross',
    'daily driver',
    'project car',
    'dyno',
    'naturally aspirated',
    'rev limiter',
    'drivetrain',
    'camber',
    'ceramic coating',
    'limited slip',
    'ecu tune',
    'torque converter',
    'ricer',
    'cartok',
    'carsoftiktok',
    'car meet',
  ],
  anchored: [
    'moteur', // moteur de recherche
    'chevaux', // animaux vs chevaux fiscaux
    'break', // pause vs break (carrosserie)
    'coupe', // coupe (carrosserie) / coupe du monde
    'caisse', // cageot / caisse (argot voiture)
    'bolide',
    'roue', // roue générique
    'pneu', // fairly auto mais gardé ancré
    'turbo', // boisson / suralimentation
    'golf', // sport golf vs vw golf
    'm3', // format de fichier vs bmw m3
    'stance', // posture vs style stance
    'swap', // échange vs swap moteur
    'alpine', // montagne vs marque alpine
    'seat', // siège (anglais) vs marque seat
    'drift', // dérive vs drift
    // Variantes EN (PANO-88) : ANCRÉS.
    'donuts', // la pâtisserie (EN)
    'rice', // le riz — seul « ricer » est sûr (EN)
    'build', // le build du jeu / la construction (EN)
    'mods', // les mods de jeu / les modérateurs (EN)
    'tune', // l'accordage d'une guitare / « a tune » = un morceau (EN)
    'track', // le morceau de musique / la piste d'athlétisme (EN)
    'headers', // = les en-têtes HTTP (EN)
    'cam', // la webcam vs l'arbre à cames (EN)
    'boost', // un coup de pouce / le boost du jeu (EN)
    'lift', // l'ascenseur / soulever (EN)
    'slammed', // « slammed with work » / critiqué (EN)
    'sleeper', // « a sleeper hit » / gros dormeur (EN)
    'spec', // spécification en général (EN)
  ],
  selfDeclared: ['passionne d auto', 'mecano'],
};
