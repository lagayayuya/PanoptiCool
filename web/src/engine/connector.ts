// The PLATFORM SEAM — what it takes for TikTok to become one connector of two.
//
// Until now the engine had no abstraction to extend: « TikTok » was named in thirteen layers, from
// the zip entry name up to the noun inside the AI prompt. This file draws the line where the split
// already was, rather than inventing a new one.
//
// ─── WHAT IS SHARED, AND WHAT IS NOT ────────────────────────────────────────────────────────────
// SHARED, and unchanged by this file: `detect/` and `lexicon/` (their own headers already said they
// were platform-agnostic), `rules/shared.ts` and its channel corpus, the `Analysis` value type, the
// locale plumbing, and — from here on — the way bytes are reached (`ExportSource`).
//
// ⚠ NOT SHARED: THE REPORT ITSELF. This is the decision the file exists to record, and it went the
// other way first. A TikTok analysis is four sections of deductions by theme; an Instagram analysis
// is six pieces of a dossier — identity, map, conversations, media, accounts, per-thread AI. They
// are different products of the same doctrine, not two renderings of one shape. Forcing them into a
// common `Analysis` would mean either a union of optional fields that every reader has to re-narrow
// (and that no type stops from being read wrongly), or a lowest common denominator that throws away
// what each connector actually found. So `Connector` is GENERIC in its report, and the UI switches
// on `platform` once, at the top, where the switch is visible.
//
// The cost is stated: nothing in the type system makes two connectors' reports comparable, and a
// property that should hold for both — « no finding without evidence », say — has to be asserted
// twice. That is the price of not pretending they are the same object.
//
// ─── WHAT THIS SEAM DOES NOT DO ─────────────────────────────────────────────────────────────────
//   - IT DOES NOT DETECT THE PLATFORM FOR THE USER. `recognize` answers about ONE connector; the
//     choice of which to try belongs to the page, which already knows (the person clicked a card).
//     Sniffing every connector against every archive is a feature nobody asked for, and it would
//     make a corrupt TikTok export report as « not an Instagram export » instead of as broken;
//   - IT CARRIES NO REGISTRY. A `Record<PlatformId, Connector>` would be a table that must list
//     every connector, hence a file that changes whenever one lands — and, worse, one that IMPORTS
//     every connector, defeating the code-splitting the Instagram bundle needs (three.js and
//     maplibre must not reach the TikTok page). The pages import the connector they need;
//   - IT SAYS NOTHING ABOUT MEMORY OR SIZE. Those bounds belong to the `ExportSource`
//     implementation and to each connector's own ingestion.

import type { ExportSource, ProgressFn } from './source';

/** The platforms the product has a connector for. Closed union: a page cannot ask for a third. */
export type PlatformId = 'tiktok' | 'instagram';

/**
 * Why a connector could not produce a report.
 *
 * ⚠ `stage` IS THE UI'S ONLY READ. It is deliberately coarse — a person who dropped the wrong file
 * needs a different sentence from one whose archive is corrupt, and no more granularity than that.
 * The details each variant carries are for the message, never for a second dispatch.
 */
export type ConnectorFailure =
  /** The archive is structurally sound but is not this platform's export. */
  | { readonly stage: 'wrong_platform'; readonly expected: PlatformId }
  /** Refused before allocating: a graceful, calm refusal, never a crash. */
  | { readonly stage: 'too_large'; readonly originalSize: number; readonly limit: number }
  /** Unreadable: not a zip, truncated, an entry that will not decompress, malformed JSON. */
  | { readonly stage: 'parse'; readonly error: string }
  /** Read, but the contents do not match the structure contract. `issues` is PII-safe by
   *  construction — validators cite paths and types, never values. */
  | { readonly stage: 'validate'; readonly issues: readonly string[] };

/** What a connector returns. Discriminated on `ok`, plain data (structured-clone-safe, ADR-0002). */
export type ConnectorResult<TReport> =
  | { readonly ok: true; readonly report: TReport }
  | ({ readonly ok: false } & ConnectorFailure);

export interface ConnectorOptions {
  /** Language of the prose the engine emits (ADR-0004). */
  readonly locale: string;
  /** Clock for sliding windows. Injected so a golden and a demo land on the same one. */
  readonly now?: number;
  /** Reported during long reads. A connector that finishes instantly may never call it. */
  readonly onProgress?: ProgressFn;
}

/**
 * One platform's reader. `TReport` is that platform's own report type — see the note above on why
 * there is no common one.
 *
 * ⚠ `analyze` NEVER THROWS. Every expected failure is a `ConnectorResult` variant; an exception
 * escaping it is a bug in the connector, not a case for the caller to catch. This is the same
 * contract the TikTok pipeline already honoured, promoted to the interface so the second connector
 * inherits it instead of rediscovering it.
 */
export interface Connector<TReport> {
  readonly platform: PlatformId;

  /**
   * Cheap structural test: does this source look like this platform's export? Reads as little as
   * possible — a path's existence, not its contents — because it runs before the person has been
   * told anything, and a slow answer here is a page that appears stuck.
   */
  recognize(source: ExportSource): Promise<boolean>;

  analyze(source: ExportSource, options: ConnectorOptions): Promise<ConnectorResult<TReport>>;
}
