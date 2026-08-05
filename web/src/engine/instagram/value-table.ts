// REFERENCE TABLE — what the data market charges for a profile.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ ⚠ NOT RATIFIED. `VALUE_TABLE_RATIFIED` below is `false`, and the module that renders      │
// │ these figures MUST refuse to display while it is. The source document says it in its own  │
// │ first line — « proposal, not integrated. Nothing is wired into the module until this      │
// │ table is ratified » — and a research proposal that reaches a public page because someone  │
// │ ported the file around it is exactly the failure the flag exists to prevent.              │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// An embedded, versioned and DATED constant: revising it must be an isolated, auditable gesture.
// No network call ever (offline invariant, ADR-0002) — which is also why everything stays in
// DOLLARS: converting to euros would need an exchange rate, therefore a request.
//
// Sources and method: `docs/data-value-reference-table.md`.
//
// ⚠ THREE REGISTERS THAT NEVER ADD UP. They answer three different questions, and summing them
// would produce a number that means nothing while looking authoritative:
//   1. ADVERTISING — a cumulative FLOW: what Meta earned from an account over its life;
//   2. BROKER — a STOCK: what a data broker's catalogue charges for a profile;
//   3. BLACK MARKET — a STOCK: observed listing prices.
//
// ⚠ AND EACH FIGURE CARRIES ITS CONFIDENCE, which the interface is obliged to show. « extrapolated »
// beside « confirmed » without a mark is a fabrication presented as a measurement.

/**
 * ⚠ THE GATE. Flip to `true` only once yuya has reviewed `docs/data-value-reference-table.md` line
 * by line. Until then, the value module renders nothing — the numbers below are research, and
 * research on a public page is a claim.
 */
export const VALUE_TABLE_RATIFIED = false;

export const REFERENCE_TABLE_DATE = '2026-07-15';

export type Confidence = 'confirmed' | 'derived' | 'interpolated' | 'extrapolated';

export interface ArpuYear {
  readonly year: number;
  /** Annual Europe ARPU, in dollars. */
  readonly arpu: number;
  readonly confidence: Confidence;
  /** Why this figure, in the source's own terms. Rendered beside it, never dropped. */
  readonly note: string;
}

/**
 * Europe ARPU, ANNUAL. Meta stopped publishing the regional figure after 2023.
 *
 * ⚠ THE TRAP THIS TABLE EXISTS TO AVOID: the widely-quoted $17.29 and $23.14 are QUARTERS (Q4),
 * not years. Confusing them divides the result by about three, and the mistake is invisible —
 * both readings produce a plausible number.
 */
export const ARPU_EUROPE: readonly ArpuYear[] = [
  { year: 2014, arpu: 11.6, confidence: 'confirmed', note: 'Meta reporting, regional series' },
  { year: 2015, arpu: 14.5, confidence: 'interpolated', note: 'between the 2014 and 2017 anchors' },
  { year: 2016, arpu: 19.5, confidence: 'interpolated', note: 'between the 2014 and 2017 anchors' },
  {
    year: 2017,
    arpu: 26.8,
    confidence: 'confirmed',
    note: 'Meta reporting (CAGR >35 % since 2014)',
  },
  { year: 2018, arpu: 36.0, confidence: 'interpolated', note: 'between the 2017 and 2019 anchors' },
  { year: 2019, arpu: 44.14, confidence: 'confirmed', note: '+20.3 % YoY, an all-time high' },
  { year: 2020, arpu: 50.0, confidence: 'derived', note: '+15 % announced for Europe' },
  { year: 2021, arpu: 68.0, confidence: 'derived', note: '+35 % announced for Europe' },
  { year: 2022, arpu: 58.0, confidence: 'derived', note: 'post-ATT decline (Q4 2022 = $17.29)' },
  { year: 2023, arpu: 72.0, confidence: 'derived', note: 'Q4 2023 = $23.14 confirmed, annualised' },
  {
    year: 2024,
    arpu: 83.0,
    confidence: 'extrapolated',
    note: 'Meta no longer publishes regional ARPU',
  },
  { year: 2025, arpu: 95.0, confidence: 'extrapolated', note: 'via global ARPP $57.03 (+$7.4)' },
  { year: 2026, arpu: 104.0, confidence: 'extrapolated', note: 'trend continued' },
];

/** Uncertainty band on the advertising total — deliberately wide (yuya). */
export const ADVERTISING_RANGE = { low: 0.88, high: 1.12 } as const;

/** Register 2 — a broker's catalogue price for a profile (market bounds). */
export const BROKER = {
  profileLow: 0.5,
  profileHigh: 200,
  /** Macro context, shown as such: a US average, NOT a resale price. */
  annualValuePerUserLow: 240,
  annualValuePerUserHigh: 263,
} as const;

/** Register 3 — observed listing prices (consolidated August 2025). */
export const DARKWEB = {
  instagramAccount: 12,
  facebookAccount: [45, 50] as const,
  fullz: [20, 100] as const,
  fullzMedian: 37,
  /** Age premium: older accounts get past anti-fraud filters. */
  agePremiumPerYear: 0.04,
  agePremiumMax: 0.6,
} as const;

/** A category of monetisable data. `key` is stable; the LABEL lives in the wording perimeter. */
export interface ValueCategory {
  readonly key: ValueCategoryKey;
  /** Market range for the category, in dollars. ⚠ Never totalled in the interface. */
  readonly low: number;
  readonly high: number;
}

export type ValueCategoryKey =
  | 'identity'
  | 'address'
  | 'phone'
  | 'email'
  | 'social'
  | 'geo'
  | 'consumption'
  | 'device'
  | 'payment'
  | 'health'
  | 'finance'
  | 'adtargeting'
  | 'offmeta';

export const VALUE_CATEGORIES: readonly ValueCategory[] = [
  { key: 'identity', low: 8, high: 30 },
  { key: 'address', low: 5, high: 25 },
  { key: 'phone', low: 3, high: 15 },
  { key: 'email', low: 2, high: 10 },
  { key: 'social', low: 5, high: 40 },
  { key: 'geo', low: 8, high: 45 },
  { key: 'consumption', low: 6, high: 35 },
  { key: 'device', low: 3, high: 20 },
  { key: 'payment', low: 10, high: 40 },
  { key: 'health', low: 50, high: 250 },
  { key: 'finance', low: 40, high: 150 },
  { key: 'adtargeting', low: 5, high: 20 },
  { key: 'offmeta', low: 5, high: 30 },
];
