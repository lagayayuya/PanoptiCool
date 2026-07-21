// Palette du design « navy » (refonte 2026-07-15) — valeurs EXTRAITES des maquettes, pas inventées.
//
// PAS un design system : l'éthos du dépôt reste « pas de design system, juste lisible et sobre ». Ce
// fichier évite seulement la duplication de valeurs exactes répétées dans plusieurs composants.

export const NAVY = {
  // Fonds, du plus profond au plus élevé.
  bgPage: '#070b18',
  bgPageTop: '#0a1024', // départ du dégradé vertical de page
  bgCard: '#0f1730',
  bgInset: '#0b1226', // encart DANS une carte (tuiles de volume, chips)
  bgThemeCard: '#131c38',
  bgSourceCard: '#0d1428',

  // Bordures.
  borderHeader: '#1a2447',
  borderCard: '#1e2a52',
  borderInset: '#26325a',
  borderChip: '#2b3865',
  borderPill: '#36446f',

  // Texte, du plus clair au plus discret.
  textBright: '#e9eefb',
  textHeading: '#dde4f4',
  textBody: '#aab6d6',
  textSecondary: '#c8d2e8',
  textLede: '#9aa7c7',
  textMuted: '#8b98c0',
  textDim: '#66739a',
  textFaint: '#7583ab',
  textGhost: '#4d5a80',

  // Accent principal (cyan).
  accent: '#2fd4f0',
  accentBright: '#7ce6f8',
  accentBgSoft: 'rgba(47,212,240,.10)',
  accentBorderSoft: 'rgba(47,212,240,.55)',

  // Opacité des puces « éteintes » (carte « aucune déduction »). Ex-`confidenceEmptyOpacity` : les
  // teintes de confiance sont parties avec leur affichage (itération 2026-07-20) ; l'opacité, elle,
  // a un lecteur.
  dimmedDotOpacity: 0.16,

  // Pédagogie (« pour comprendre ») — accent indigo, cadre pointillé.
  learnAccent: '#a5b4ff',
  learnTitle: '#b8c4ff',
  learnBorder: '#3b4a86',
  learnBg: 'rgba(124,150,255,.05)',

  // Éventail de lectures — lavande pour la lecture principale.
  readingPrimaryText: '#e6e1f5',
  readingPrimaryLabel: '#a99be0',
  readingPrimaryBg: 'rgba(169,155,224,.13)',
  readingPrimaryBorder: 'rgba(169,155,224,.42)',

  // Risque / usage — accent orange.
  risk: '#e8754e',
  riskText: '#efc4b2',
  riskLabel: '#e6b6a3',
  riskBg: 'rgba(232,117,78,.08)',
  riskBorder: 'rgba(232,117,78,.3)',

  // Graphe de rythme.
  graphDay: '#5b6d99',

  // Divers.
  ok: '#4ade80',
  okBg: 'rgba(74,222,128,.07)',
  okBorder: 'rgba(74,222,128,.35)',
  donutRest: '#1c2749',
} as const;

/** Police du design — la même famille auto-hébergée que le reste du site (PANO-56). */
export const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
