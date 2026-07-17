// Lexique d'intérêt `photographie` (D2, PANO-77 lot 2 · enrichi entités) — photographie.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la photo FR : matériel, techniques, LOGICIELS, MARQUES, ABRÉVIATIONS/jargon.
// À l'aveugle ; marques et sigles = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « photographie », « appareil photo », « reflex », « argentique », « bokeh »,
//     « dslr », « hybride », « lightroom » ; marques (« nikon », « fujifilm », « leica », « gopro »).
//   · ANCRÉ — 50/50 : « photo » (générique), « objectif » (but), « canon » (arme/norme), « sony »,
//     « sigma » (maths / slang), « iso » (norme org), « expo » (exposition), « macro », « pose »,
//     « raw », « filtre », « zoom », « capteur » : co-occurrence.
//   · EXCLU — rien de désespéré.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de « dessin/illustration » (thème séparé).

import type { InterestLexicon } from '../types';

export const PHOTOGRAPHIE_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'photographie',
  themeLabel: 'theme.photographie.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.photo-gear', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    // Vocabulaire / techniques
    'photographie',
    'appareil photo',
    'reflex',
    'photographe',
    'retouche photo',
    'lightroom',
    'argentique',
    'grand angle',
    'profondeur de champ',
    'prise de vue',
    'photo de rue',
    'tirage photo',
    'portrait photo',
    'bokeh',
    'dslr',
    'hybride photo',
    'longue exposition',
    'vitesse d obturation',
    'diaphragme',
    'teleobjectif',
    // Marques / logiciels
    'nikon',
    'fujifilm',
    'leica',
    'gopro',
    'hasselblad',
    'capture one',
    'photoshop',
    'trepied',
    // Variantes EN (PANO-88) : SOLO univoque.
    'golden hour',
  ],
  anchored: [
    'photo', // « photo de profil » générique
    'objectif', // but vs objectif photo
    'canon', // arme / norme / marque
    'sony', // marque large
    'sigma', // maths / « sigma » (slang) vs marque
    'iso', // norme / organisation vs sensibilité
    'expo', // exposition (concert) / exposition photo
    'macro', // macro (tableur) vs macrophoto
    'pose', // posture
    'cliche', // idée reçue
    'raw', // cru (anglais) vs format brut
    'filtre', // filtre générique
    'zoom', // zoom générique / visio
    'capteur', // capteur générique
    'focale',
    'shooting', // séance photo vs anglais générique (EN, ancré)
    'editing', // retouche vs montage/édition générique (EN)
  ],
  selfDeclared: ['photographe', 'passionne de photo'],
};
