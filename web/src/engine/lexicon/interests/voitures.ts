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
  ],
  selfDeclared: ['passionne d auto', 'mecano'],
};
