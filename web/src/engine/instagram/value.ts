// VALUE — what the data market charges for a profile like this one.
//
// ⚠ IT REREADS NOTHING FROM THE EXPORT. Everything is derived from the reports the other five
// extractors already produced, plus the static table. 100 % deterministic, no I/O, no network — so
// the same export gives the same figures on any machine, which is the minimum a page that shows
// money owes its reader.
//
// ⚠ AND IT REFUSES TO PRODUCE ANYTHING WHILE `VALUE_TABLE_RATIFIED` IS FALSE. The table is a
// research proposal; its own source document opens with « nothing is wired into the module until
// this table is ratified ». So the gate is in the code rather than in a comment someone has to
// remember, and `runValue` returns `null` — a state the interface must handle, not a zero it can
// render.
//
// ─── WHAT THIS MODULE DOES NOT SAY ──────────────────────────────────────────────────────────────
// The framing matters more than the arithmetic here, so it is stated where the arithmetic is:
//   - THESE AMOUNTS DO NOT SAY WHAT SOMEONE IS WORTH. They say what the market charges for data
//     about someone like them. Systemic register — the mirror this whole product is (ADR-0003);
//   - ARPU IS REVENUE, NOT PROFIT, and it covers all of Meta — Facebook, Instagram, WhatsApp — not
//     Instagram alone;
//   - BROKER PRICES ARE CATALOGUE PRICES FOR AGGREGATED PROFILES, not « this dossier », sold as is;
//   - BLACK-MARKET PRICES ARE OBSERVED LISTINGS, with wide variance and often stale resale data;
//   - THE THREE REGISTERS NEVER ADD UP. Summing them produces a number that means nothing while
//     looking authoritative, and this module never returns such a total.

import type { Locale } from '../../i18n/locales';
import { instagramWording } from '../wording.instagram';
import type { ConversationsReport } from './conversations';
import type { GeoReport } from './geo';
import type { InventoryReport } from './inventory';
import type { RelationsReport } from './relations';
import type { UniverseReport } from './universe';
import {
  ADVERTISING_RANGE,
  ARPU_EUROPE,
  BROKER,
  type Confidence,
  DARKWEB,
  REFERENCE_TABLE_DATE,
  VALUE_CATEGORIES,
  VALUE_TABLE_RATIFIED,
  type ValueCategoryKey,
} from './value-table';

const SEC_PER_YEAR = 31_557_600;

export interface AdvertisingYear {
  readonly year: number;
  readonly arpu: number;
  /** Fraction of the year the account existed (0–1). */
  readonly activeFraction: number;
  readonly amount: number;
  readonly cumulative: number;
  readonly confidence: Confidence;
  readonly note: string;
  /** That year's activity — feeds the value-against-activity timeline. */
  readonly messages: number;
  readonly media: number;
}

export interface StockPoint {
  readonly year: number;
  readonly low: number;
  readonly high: number;
}

export interface CategoryPresence {
  readonly key: ValueCategoryKey;
  readonly label: string;
  readonly present: boolean;
  /** The measured evidence from the export, or the reason for the absence. */
  readonly evidence: string;
  readonly low: number;
  readonly high: number;
}

export interface ValueReport {
  readonly accountCreatedTs: number | null;
  readonly accountAgeYears: number;
  readonly referenceTableDate: string;
  readonly advertising: {
    readonly byYear: readonly AdvertisingYear[];
    readonly totalLow: number;
    readonly totalHigh: number;
  };
  readonly broker: {
    readonly low: number;
    readonly high: number;
    readonly byYear: readonly StockPoint[];
    readonly annualValueLow: number;
    readonly annualValueHigh: number;
  };
  readonly darkweb: {
    readonly low: number;
    readonly high: number;
    readonly byYear: readonly StockPoint[];
    readonly items: ReadonlyArray<{
      readonly label: string;
      readonly price: string;
      readonly applies: boolean;
    }>;
  };
  readonly completeness: {
    readonly present: readonly CategoryPresence[];
    readonly missing: readonly CategoryPresence[];
    readonly filledCount: number;
    readonly totalCount: number;
  };
  readonly milestones: ReadonlyArray<{ readonly year: number; readonly label: string }>;
}

export interface ValueInputs {
  readonly inventory: InventoryReport;
  readonly geo: GeoReport;
  readonly relations: RelationsReport;
  readonly conversations: ConversationsReport;
  readonly universe: UniverseReport;
  /** Account creation; failing that, the first known trace. */
  readonly accountCreatedTs: number | null;
  /** « Now », injected so the result stays deterministic and testable. */
  readonly nowTs: number;
  readonly locale: Locale;
}

/** Messages and media per year — shared by the timeline and the stock curves. */
function activityByYear(inp: ValueInputs): {
  msgsByYear: Map<number, number>;
  mediaByYear: Map<number, number>;
} {
  const msgsByYear = new Map<number, number>();
  for (const c of inp.conversations.conversations) {
    for (const m of c.monthly) {
      const y = Number(m.ym.slice(0, 4));
      msgsByYear.set(y, (msgsByYear.get(y) ?? 0) + m.count);
    }
  }
  const mediaByYear = new Map<number, number>();
  for (const it of inp.universe.items) {
    const y = new Date(it.ts * 1000).getFullYear();
    mediaByYear.set(y, (mediaByYear.get(y) ?? 0) + 1);
  }
  return { msgsByYear, mediaByYear };
}

/**
 * Register 1 — Σ (that year's ARPU × the fraction of the year the account existed).
 *
 * ⚠ NEVER « CURRENT ARPU × N YEARS », which is the intuitive computation and overstates an old
 * account by a factor of several: ARPU in 2014 was a ninth of today's, and a nine-year-old account
 * spent most of its life on the low part of that curve.
 */
function advertising(
  createdTs: number | null,
  nowTs: number,
  msgsByYear: Map<number, number>,
  mediaByYear: Map<number, number>,
) {
  const byYear: AdvertisingYear[] = [];
  let cumulative = 0;
  const firstRow = ARPU_EUROPE[0];
  const createdYear =
    createdTs !== null ? new Date(createdTs * 1000).getFullYear() : (firstRow?.year ?? 2014);
  const nowYear = new Date(nowTs * 1000).getFullYear();

  for (const row of ARPU_EUROPE) {
    if (row.year < createdYear || row.year > nowYear) continue;
    const start = Date.UTC(row.year, 0, 1) / 1000;
    const end = Date.UTC(row.year + 1, 0, 1) / 1000;
    let fraction = 1;
    // The first year is partial from the signup date, the current one is partial up to now — and a
    // one-year-old account hits BOTH, hence `min` rather than an else-branch.
    if (row.year === createdYear && createdTs !== null) {
      fraction = Math.max(0, Math.min(1, (end - createdTs) / (end - start)));
    }
    if (row.year === nowYear) {
      fraction = Math.min(fraction, Math.max(0, (nowTs - start) / (end - start)));
    }
    const amount = row.arpu * fraction;
    cumulative += amount;
    byYear.push({
      year: row.year,
      arpu: row.arpu,
      activeFraction: fraction,
      amount,
      cumulative,
      confidence: row.confidence,
      note: row.note,
      messages: msgsByYear.get(row.year) ?? 0,
      media: mediaByYear.get(row.year) ?? 0,
    });
  }

  return {
    byYear,
    totalLow: Math.round(cumulative * ADVERTISING_RANGE.low),
    totalHigh: Math.round(cumulative * ADVERTISING_RANGE.high),
  };
}

/**
 * Which monetisable categories this export actually carries, each with its measured evidence.
 *
 * ⚠ EVERY PRESENCE IS DERIVED, none is assumed. The prototype hard-coded `present: true` for
 * identity, phone and email — so an export carrying none of them would still have reported all
 * three, with an evidence string describing data that was not there. That is the worst failure a
 * module about someone's data can have: a confident sentence about a field it never read.
 */
function completeness(inp: ValueInputs): CategoryPresence[] {
  const w = instagramWording(inp.locale).valueCategories;
  const { inventory: inv, geo, relations, conversations } = inp;
  const anchors = inv.identity;

  const hasIdentity =
    geo.addresses.length > 0 || anchors.profileChanges > 0 || anchors.signupTs !== null;
  const found: Record<ValueCategoryKey, { present: boolean; evidence: string }> = {
    identity: {
      present: hasIdentity,
      evidence: hasIdentity ? w.identity.present : w.identity.absent,
    },
    address: {
      present: geo.addresses.length > 0,
      evidence:
        geo.addresses.length > 0 ? w.address.present(geo.addresses.length) : w.address.absent,
    },
    phone: {
      present: inv.location.autofillAddresses > 0 || anchors.profileChanges > 0,
      evidence:
        inv.location.autofillAddresses > 0 || anchors.profileChanges > 0
          ? w.phone.present
          : w.phone.absent,
    },
    email: {
      present: anchors.signupTs !== null,
      evidence: anchors.signupTs !== null ? w.email.present : w.email.absent,
    },
    social: {
      present: relations.nodes.length > 0,
      evidence:
        relations.nodes.length > 0
          ? w.social.present(relations.nodes.length, conversations.totals.distinctParticipants)
          : w.social.absent,
    },
    geo: {
      present: geo.counts.geolocated > 0 || geo.declared.length > 0,
      evidence:
        geo.counts.geolocated > 0 || geo.declared.length > 0
          ? w.geo.present(geo.declared.length, geo.counts.geolocated, geo.counts.distinctCities)
          : w.geo.absent,
    },
    consumption: {
      present: inv.activity.savedPosts > 0 || inv.activity.likedPosts > 0,
      evidence:
        inv.activity.savedPosts > 0 || inv.activity.likedPosts > 0
          ? w.consumption.present(inv.activity.savedPosts, inv.activity.likedPosts)
          : w.consumption.absent,
    },
    device: {
      present: anchors.distinctDeviceIds > 0,
      evidence:
        anchors.distinctDeviceIds > 0
          ? w.device.present(anchors.distinctDeviceIds, anchors.profileActivityEvents)
          : w.device.absent,
    },
    // ⚠ THESE FOUR ARE ABSENT FROM AN INSTAGRAM EXPORT BY NATURE, not by accident, and saying so is
    // part of the finding: the market prices them highest, and the platform simply does not hand
    // them over. The category is shown as missing rather than hidden.
    payment: { present: false, evidence: w.payment.absent },
    health: { present: false, evidence: w.health.absent },
    finance: { present: false, evidence: w.finance.absent },
    adtargeting: {
      present: inv.location.adCategories > 0,
      evidence:
        inv.location.adCategories > 0
          ? w.adtargeting.present(inv.location.adCategories)
          : w.adtargeting.absent,
    },
    offmeta: { present: false, evidence: w.offmeta.absent },
  };

  return VALUE_CATEGORIES.map((c) => ({
    key: c.key,
    label: w[c.key].label,
    present: found[c.key].present,
    evidence: found[c.key].evidence,
    low: c.low,
    high: c.high,
  }));
}

/**
 * The two « value right now » curves.
 *
 * ⚠ INDICATIVE, AND DOCUMENTED AS SUCH. The model is simple on purpose: value grows with the
 * categories filled and the volume accumulated. Real timelines are plugged in — messages per year,
 * media per year — and nothing is invented to smooth a curve.
 */
function stockCurves(inp: ValueInputs, cats: CategoryPresence[], years: number[]) {
  const { msgsByYear, mediaByYear } = activityByYear(inp);
  const totalVolume =
    [...msgsByYear.values()].reduce((a, b) => a + b, 0) +
    [...mediaByYear.values()].reduce((a, b) => a + b, 0);

  const present = cats.filter((c) => c.present);
  const brokerFullLow = Math.max(BROKER.profileLow, present.reduce((a, c) => a + c.low, 0) * 0.25);
  // ⚠ CLAMPED TO AT LEAST THE LOW BOUND. With no category present the sum is 0, so `min(200, 0)`
  // gave a HIGH of $0 under a LOW of $1 — an inverted range, which renders as « between $1 and $0 »
  // and is the sort of thing a reader notices before any developer does. Found by opening the gate
  // and reading the output, not by reading the code.
  const brokerFullHigh = Math.max(
    brokerFullLow,
    Math.min(BROKER.profileHigh, present.reduce((a, c) => a + c.high, 0) * 0.35),
  );

  const createdYear =
    inp.accountCreatedTs !== null
      ? new Date(inp.accountCreatedTs * 1000).getFullYear()
      : (years[0] ?? new Date(inp.nowTs * 1000).getFullYear());
  const hasIdentity = cats.find((c) => c.key === 'identity')?.present ?? false;
  const dwBase = DARKWEB.instagramAccount + (hasIdentity ? DARKWEB.fullz[0] : 0);
  const dwFull = DARKWEB.instagramAccount + DARKWEB.fullzMedian * 1.4;

  const broker: StockPoint[] = [];
  const darkweb: StockPoint[] = [];
  let cum = 0;
  for (const y of years) {
    cum += (msgsByYear.get(y) ?? 0) + (mediaByYear.get(y) ?? 0);
    const share = totalVolume > 0 ? cum / totalVolume : 1;
    broker.push({
      year: y,
      low: Math.round(brokerFullLow * (0.3 + 0.7 * share) * 10) / 10,
      high: Math.round(brokerFullHigh * (0.3 + 0.7 * share) * 10) / 10,
    });
    const age = Math.max(0, y - createdYear);
    const premium = 1 + Math.min(DARKWEB.agePremiumMax, age * DARKWEB.agePremiumPerYear);
    darkweb.push({
      year: y,
      low: Math.round(dwBase * premium * (0.5 + 0.5 * share)),
      high: Math.round(dwFull * premium * (0.5 + 0.5 * share)),
    });
  }

  const lastBroker = broker[broker.length - 1];
  const lastDw = darkweb[darkweb.length - 1];
  return {
    broker,
    darkweb,
    brokerLow: Math.round(lastBroker?.low ?? brokerFullLow),
    brokerHigh: Math.round(lastBroker?.high ?? brokerFullHigh),
    dwLow: lastDw?.low ?? dwBase,
    dwHigh: lastDw?.high ?? Math.round(dwFull),
  };
}

/**
 * ⚠ RETURNS `null` UNTIL THE TABLE IS RATIFIED — see `value-table.ts`. Not an empty report: an
 * empty report renders as « your data is worth nothing », which is a claim, and a false one.
 */
export function runValue(inp: ValueInputs): ValueReport | null {
  if (!VALUE_TABLE_RATIFIED) return null;

  const w = instagramWording(inp.locale);
  const { msgsByYear, mediaByYear } = activityByYear(inp);
  const ads = advertising(inp.accountCreatedTs, inp.nowTs, msgsByYear, mediaByYear);
  const cats = completeness(inp);
  const stocks = stockCurves(
    inp,
    cats,
    ads.byYear.map((y) => y.year),
  );

  const ageYears =
    inp.accountCreatedTs !== null ? (inp.nowTs - inp.accountCreatedTs) / SEC_PER_YEAR : 0;
  const hasIdentity = cats.find((c) => c.key === 'identity')?.present ?? false;
  const hasAddress = cats.find((c) => c.key === 'address')?.present ?? false;

  const milestones: Array<{ year: number; label: string }> = [];
  if (inp.accountCreatedTs !== null) {
    milestones.push({
      year: new Date(inp.accountCreatedTs * 1000).getFullYear(),
      label: w.milestones.accountCreated,
    });
  }
  const addrUpdated = inp.geo.addresses.find((a) => a.updated !== undefined)?.updated;
  if (addrUpdated !== undefined) {
    milestones.push({
      year: new Date(addrUpdated * 1000).getFullYear(),
      label: w.milestones.addressRecorded,
    });
  }

  return {
    accountCreatedTs: inp.accountCreatedTs,
    accountAgeYears: Math.round(ageYears * 10) / 10,
    referenceTableDate: REFERENCE_TABLE_DATE,
    advertising: ads,
    broker: {
      low: stocks.brokerLow,
      high: stocks.brokerHigh,
      byYear: stocks.broker,
      annualValueLow: BROKER.annualValuePerUserLow,
      annualValueHigh: BROKER.annualValuePerUserHigh,
    },
    darkweb: {
      low: stocks.dwLow,
      high: stocks.dwHigh,
      byYear: stocks.darkweb,
      items: [
        {
          label: w.darkwebItems.instagramAccount,
          price: `~$${DARKWEB.instagramAccount}`,
          applies: true,
        },
        {
          label: w.darkwebItems.fullz,
          price: `$${DARKWEB.fullz[0]}–${DARKWEB.fullz[1]}`,
          applies: hasIdentity,
        },
        {
          label: w.darkwebItems.address,
          price: w.darkwebItems.includedInFile,
          applies: hasAddress,
        },
        {
          label: w.darkwebItems.facebookAccount,
          price: `$${DARKWEB.facebookAccount[0]}–${DARKWEB.facebookAccount[1]}`,
          applies: false,
        },
      ],
    },
    completeness: {
      present: cats.filter((c) => c.present),
      missing: cats.filter((c) => !c.present),
      filledCount: cats.filter((c) => c.present).length,
      totalCount: cats.length,
    },
    milestones,
  };
}
