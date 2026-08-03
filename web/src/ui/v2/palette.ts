// « navy » design palette — values EXTRACTED from the mockups, never invented.
//
// NOT a design system: the repo's ethos stays "no design system, just readable and sober". This
// file only avoids the duplication of exact values repeated across several components.
//
// ─── WHERE THESE VALUES COME FROM, SINCE 2026-08-03 ─────────────────────────────────────────────
// The base tokens are now those of `Instagram/app/src/ui/styles/tokens.css`, which is the ratified
// theme: it was extracted from the « Instagram Shell v4 » and « Accueil v4 » mockups and carries a
// colour rule of its own (yuya, 2026-08-02) — two colours of the product are either EXACTLY the
// same or frankly different, never four points of ΔE apart, because a gap that small reads as a
// mistake rather than as a distinction.
//
// The entries below that the tokens file does not define — the reading fan, the education panels,
// the rhythm graph — keep their mockup values. They are surfaces the Instagram prototype does not
// have.

export const NAVY = {
  // Backgrounds, from deepest to highest.
  bgPage: '#070b18',
  bgPageTop: '#0a1024', // start of the page's vertical gradient
  bgCard: '#0e142a', // `--panel`
  bgInset: '#0a0f22', // `--panel-2` — inset WITHIN a card (volume tiles, chips)
  bgThemeCard: '#101838', // `--panel-hi`
  bgSourceCard: '#0d1428',

  // Borders.
  borderHeader: '#1b2544', // `--line`
  borderCard: '#212c54', // `--line-2`
  borderInset: '#26325a', // `--line-3`
  borderChip: '#2b3865',
  borderPill: '#36446f',

  // Text, from lightest to most discreet.
  textBright: '#eef2ff', // `--ink-bright`
  textHeading: '#dbe3f7', // `--ink-2`
  textBody: '#b6c1dc', // `--ink-dim`
  textSecondary: '#c8d2e8',
  textLede: '#9aa7c7',
  textMuted: '#8d9ab8', // `--muted`
  textDim: '#66739a',
  textFaint: '#7583ab',
  textGhost: '#4d5a80', // `--faint`

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
  risk: '#e8754e', // `--orange`
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

/**
 * The two families of the ratified theme (`tokens.css`: `--font` / `--font-mono`).
 *
 * `SANS` is what the whole interface inherits, set once in `layouts/Page.astro`. `MONO` is NOT a
 * webfont and deliberately so: it is the system stack, used only where the glyphs have to line up
 * — shell commands one copies, the address of a local server, the payload sent to the model. Until
 * 2026-08-03 the entire site was set in JetBrains Mono, so those surfaces were monospace by
 * accident; in a proportional face they would stay legible-looking while being harder to verify
 * character by character, which is the one thing a command block is for.
 */
export const SANS = "Archivo, system-ui, -apple-system, 'Segoe UI', sans-serif";
export const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
