// « navy » design palette (2026-07-15 rework) — values EXTRACTED from the mockups, not invented.
//
// NOT a design system: the repo's ethos stays "no design system, just readable and sober". This
// file only avoids the duplication of exact values repeated across several components.

export const NAVY = {
  // Backgrounds, from deepest to highest.
  bgPage: '#070b18',
  bgPageTop: '#0a1024', // start of the page's vertical gradient
  bgCard: '#0f1730',
  bgInset: '#0b1226', // inset WITHIN a card (volume tiles, chips)
  bgThemeCard: '#131c38',
  bgSourceCard: '#0d1428',

  // Borders.
  borderHeader: '#1a2447',
  borderCard: '#1e2a52',
  borderInset: '#26325a',
  borderChip: '#2b3865',
  borderPill: '#36446f',

  // Text, from lightest to most discreet.
  textBright: '#e9eefb',
  textHeading: '#dde4f4',
  textBody: '#aab6d6',
  textSecondary: '#c8d2e8',
  textLede: '#9aa7c7',
  textMuted: '#8b98c0',
  textDim: '#66739a',
  textFaint: '#7583ab',
  textGhost: '#4d5a80',

  // Main accent (cyan).
  accent: '#2fd4f0',
  /** The Instagram connector's accent — the one colour that tells the two cards apart. */
  instagram: '#f0a0d8',
  accentBright: '#7ce6f8',
  accentBgSoft: 'rgba(47,212,240,.10)',
  accentBorderSoft: 'rgba(47,212,240,.55)',

  // Opacity of the « éteintes » bullets (« aucune déduction » card). Ex-`confidenceEmptyOpacity`: the
  // confidence tints left with their display (2026-07-20 iteration); the opacity, for its part,
  // has a reader.
  dimmedDotOpacity: 0.16,

  // Education (« pour comprendre ») — indigo accent, dotted frame.
  learnAccent: '#a5b4ff',
  learnTitle: '#b8c4ff',
  learnBorder: '#3b4a86',
  learnBg: 'rgba(124,150,255,.05)',

  // Reading fan — lavender for the primary reading.
  readingPrimaryText: '#e6e1f5',
  readingPrimaryLabel: '#a99be0',
  readingPrimaryBg: 'rgba(169,155,224,.13)',
  readingPrimaryBorder: 'rgba(169,155,224,.42)',

  // Risk / usage — orange accent.
  risk: '#e8754e',
  riskText: '#efc4b2',
  riskLabel: '#e6b6a3',
  riskBg: 'rgba(232,117,78,.08)',
  riskBorder: 'rgba(232,117,78,.3)',

  // Rhythm graph.
  graphDay: '#5b6d99',

  // Miscellaneous.
  ok: '#4ade80',
  okBg: 'rgba(74,222,128,.07)',
  okBorder: 'rgba(74,222,128,.35)',
  donutRest: '#1c2749',
} as const;

/** Design font — the same self-hosted family as the rest of the site (PANO-56). */
export const MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
