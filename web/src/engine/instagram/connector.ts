// THE INSTAGRAM CONNECTOR — the seven extractors, in the one order their dependencies allow.
//
// ⚠ THE ORDER IS NOT A PREFERENCE, it is a graph. Conversations must run first because it is the
// pass that infers WHO THE ACCOUNT HOLDER IS (the sender present in the most threads) and that
// collects the DM media on the way; universe needs both. Identity needs inventory and geo. Value
// needs everything. Reordering any of it produces a report that is silently wrong rather than
// broken — « sent by you » counted against the wrong person, a media universe with no direction.
//
// ⚠ AND THE THREADS ARE WALKED ONCE. The inventory's `messages` block is DERIVED from the
// conversations report rather than recomputed, and the media come from that same walk through a
// sink. On the reference export that is 349 threads and ~86 000 messages; walking them twice would
// double the slowest phase for numbers we already hold.
//
// REPORTS ARE EMITTED AS THEY LAND, through `onReport`. The first useful screen is the inventory,
// which arrives long before the map has resolved 166 IPs — a page that waits for everything shows a
// spinner for the whole analysis and then everything at once, which is the worst of both.
//
// ─── WHAT THIS CONNECTOR DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT DOES NOT READ MESSAGE CONTENT. The conversations pass counts and dates; the text goes only
//     to the local-AI path, on an explicit click, thread by thread (`readThread` below);
//   - IT DOES NOT LOAD MEDIA BYTES. `universe` lists paths; the interface resolves them one at a
//     time (`resolveMedia`);
//   - IT PRODUCES NO VALUE REPORT while the reference table is unratified — `runValue` returns
//     `null`, by design (`value-table.ts`), and `report.value` is then absent;
//   - IT DOES NOT DETECT THE PLATFORM FOR THE USER (ADR-0007): `recognize` answers about this
//     connector only, and the page already knows which card was clicked.

import type { Locale } from '../../i18n/locales';
import type { Connector, ConnectorOptions, ConnectorResult } from '../connector';
import type { ExportSource } from '../source';
import {
  type ConversationsReport,
  type MediaDraft,
  messagesInventoryFromConversations,
  runConversations,
} from './conversations';
import { type GeoReport, type GeoResolver, runGeo } from './geo';
import { type IdentityReport, runIdentity } from './identity';
import { type InventoryReport, runInventory } from './inventory';
import { LabelCoverage } from './labels';
import { fixMojibake } from './mojibake';
import { type RelationsReport, runRelations } from './relations';
import { runUniverse, type UniverseReport } from './universe';
import { runValue, type ValueReport } from './value';

/** The six pieces of the dossier. `value` is absent while its table is unratified. */
export interface InstagramReport {
  readonly inventory: InventoryReport;
  readonly conversations: ConversationsReport;
  readonly universe: UniverseReport;
  readonly geo: GeoReport;
  readonly relations: RelationsReport;
  readonly identity: IdentityReport;
  readonly value?: ValueReport;
  /**
   * ⚠ HOW MANY FIELD LABELS WERE RECOGNISED, out of how many are known. The connector's one silent
   * failure has no other symptom: an export in a language whose field names we lack produces empty
   * sections that look exactly like an empty account (`labels.ts`). The interface is expected to
   * say so when this is low, and it cannot do that unless the number crosses.
   */
  readonly labelCoverage: { readonly matched: number; readonly total: number };
}

/** A partial report, emitted as each piece lands. */
export type ReportPatch = Partial<Omit<InstagramReport, 'labelCoverage'>>;

export interface InstagramOptions extends ConnectorOptions {
  /** Resolves login IPs to places. `null` = the map keeps its declared layer only. */
  readonly geoResolver?: GeoResolver | null;
  /** Called as each piece lands, so the first screen does not wait for the last report. */
  readonly onReport?: (patch: ReportPatch) => void;
}

/** Paths that must exist for an archive to be an Instagram export (contract §0). */
const SIGNATURE_PATHS = ['personal_information', 'your_instagram_activity'] as const;

/**
 * Reads ONE thread's messages, on demand.
 *
 * ⚠ THIS IS THE ONLY PATH THAT TOUCHES MESSAGE TEXT, and it exists so the local-AI analysis can be
 * an explicit, per-conversation gesture rather than something the engine did on the way past. The
 * separation is the reason the extractors can promise they retain no content.
 */
export interface ThreadMediaRef {
  readonly kind: 'photo' | 'video' | 'audio';
  readonly path: string;
}

export interface ThreadMessage {
  /**
   * Position in the thread AS RETURNED here, and the number the model is asked to cite. Two
   * analyses of the same thread quote the same number for the same message however much of the
   * thread was sent — which is what makes a citation checkable at all.
   */
  readonly index: number;
  readonly sender: string;
  readonly ts: number;
  readonly text: string;
  readonly media: readonly ThreadMediaRef[];
  readonly share: { readonly link: string; readonly text: string } | null;
  readonly callSeconds: number | null;
  readonly unsent: boolean;
}

export type ReadThread = (threadId: string) => Promise<readonly ThreadMessage[]>;

/**
 * Beyond this, a call duration is a data error rather than a very long call. Taken from the
 * engine's own bound, so one export cannot report two different notions of a plausible call.
 */
const MAX_CALL_SECONDS = 6 * 3600;

export function makeThreadReader(source: ExportSource): ReadThread {
  return async (threadId: string) => {
    const base = `your_instagram_activity/messages/inbox/${threadId}`;
    const files = (await source.listDir(base))
      .filter((e) => e.kind === 'file' && /^message_\d+\.json$/.test(e.name))
      .map((e) => e.name)
      // ⚠ DESCENDING: `message_1.json` holds the MOST RECENT messages (contract §0.1), so reading
      // in filename order gives a reversed history — and a model handed a reversed conversation
      // will confidently describe a relationship running backwards.
      .sort((a, b) => Number(b.match(/\d+/)?.[0] ?? 0) - Number(a.match(/\d+/)?.[0] ?? 0));

    type Raw = {
      sender_name?: string;
      timestamp_ms?: number;
      content?: string;
      photos?: Array<{ uri?: string }>;
      videos?: Array<{ uri?: string }>;
      audio_files?: Array<{ uri?: string }>;
      share?: { link?: string; share_text?: string };
      call_duration?: number;
      is_unsent?: boolean;
    };

    const raw: Raw[] = [];
    for (const f of files) {
      const thread = await source
        .readJson<{ messages?: Raw[] }>(`${base}/${f}`)
        // An unreadable page must not take the whole thread with it.
        .catch(() => undefined);
      for (const m of thread?.messages ?? []) raw.push(m);
    }

    // Sorted by TIMESTAMP rather than by reversing the pages: an export with one page the other way
    // round would otherwise give a shuffled thread with nothing to signal it.
    raw.sort((a, b) => (a.timestamp_ms ?? 0) - (b.timestamp_ms ?? 0));

    const out: ThreadMessage[] = [];
    for (const m of raw) {
      // ⚠ A TIMESTAMP IS REQUIRED, and it is the only thing that is. A message with no time cannot
      // be placed in a period or on either side of a silence, which is what the sampler cuts on.
      if (typeof m.timestamp_ms !== 'number') continue;

      const media: ThreadMediaRef[] = [];
      for (const p of m.photos ?? []) if (p.uri) media.push({ kind: 'photo', path: p.uri });
      for (const p of m.videos ?? []) if (p.uri) media.push({ kind: 'video', path: p.uri });
      for (const p of m.audio_files ?? []) if (p.uri) media.push({ kind: 'audio', path: p.uri });

      const call = m.call_duration;
      out.push({
        index: out.length,
        // ⚠ REPAIRED, and this is the one place content passes through `fixMojibake` — see that
        // module's header, whose bound this widened. Measured on the repair itself: an emoji's
        // mojibake form is entirely below U+0100, so it is restored rather than skipped, and clean
        // text fails the UTF-8 decode and comes back untouched.
        sender: fixMojibake(m.sender_name ?? ''),
        ts: Math.floor(m.timestamp_ms / 1000),
        text: fixMojibake(m.content ?? ''),
        media,
        share:
          m.share?.link !== undefined && m.share.link !== ''
            ? { link: m.share.link, text: fixMojibake(m.share.share_text ?? '') }
            : null,
        callSeconds: typeof call === 'number' && call > 0 && call <= MAX_CALL_SECONDS ? call : null,
        unsent: m.is_unsent === true,
      });
    }
    return out;
  };
}

/** Resolves a media path to bytes, on demand. Returns `null` when the entry is absent. */
export type ResolveMedia = (path: string) => Promise<Uint8Array | null>;

export function makeMediaResolver(source: ExportSource): ResolveMedia {
  return async (path: string) => {
    // ⚠ NOT CACHED, deliberately: the reference export holds 5 413 media, and a cache that never
    // evicts is a memory leak with a friendly name. The interface shows a handful at a time and
    // knows when to release them; this layer does not.
    const withBytes = source as ExportSource & { readBytes?: (p: string) => Promise<Uint8Array> };
    if (typeof withBytes.readBytes !== 'function') return null;
    return withBytes.readBytes(path).catch(() => null);
  };
}

export const instagramConnector: Connector<InstagramReport> = {
  platform: 'instagram',

  async recognize(source: ExportSource): Promise<boolean> {
    // Two directory probes, no read. An HTML export, a partial one, another platform's: all false,
    // and none told apart from the others — a distinction the person does not need and that we
    // could not draw honestly.
    for (const p of SIGNATURE_PATHS) {
      if (!(await source.exists(p))) return false;
    }
    return true;
  },

  async analyze(
    source: ExportSource,
    options: ConnectorOptions,
  ): Promise<ConnectorResult<InstagramReport>> {
    const opts = options as InstagramOptions;
    const locale = options.locale as Locale;
    const coverage = new LabelCoverage();
    const emit = (patch: ReportPatch) => opts.onReport?.(patch);

    try {
      // 1 — Conversations. Infers the account holder, collects the DM media. Everything downstream
      //     that says « you » depends on this pass having run first.
      const drafts: MediaDraft[] = [];
      const conversations = await runConversations(
        source,
        (p) => options.onProgress?.(p),
        (d) => drafts.push(d),
      );
      emit({ conversations });

      // 2 — Universe. Needs the holder, to turn a sender's name into a direction.
      const universe = await runUniverse(source, drafts, conversations.self);
      emit({ universe });

      // 3 — Inventory, with the message block DERIVED rather than recomputed.
      const inventory = await runInventory(
        source,
        (p) => options.onProgress?.(p),
        coverage,
        messagesInventoryFromConversations(conversations),
      );
      emit({ inventory });

      // 4 — Geo. Without a resolver there is simply no trajectory: the declared layer stands alone,
      //     which is the honest degraded mode rather than an error (`mmdb-geo-resolver.ts`).
      const resolver = opts.geoResolver ?? { lookup: () => null };
      const geo = await runGeo(source, resolver, locale, coverage);
      emit({ geo });

      const relations = await runRelations(source, locale, coverage);
      emit({ relations });

      // 5 — Identity. Needs inventory and geo; emits no value of its own that they do not carry.
      const identity = await runIdentity(
        source,
        { inventory, geo, nowTs: Math.floor((options.now ?? Date.now()) / 1000), locale },
        coverage,
      );
      emit({ identity });

      // 6 — Value. Returns `null` while its reference table is unratified, and the report then
      //     carries no `value` key at all — an absent key, not a zeroed report.
      const value = runValue({
        inventory,
        geo,
        relations,
        conversations,
        universe,
        accountCreatedTs: inventory.identity.signupTs,
        nowTs: Math.floor((options.now ?? Date.now()) / 1000),
        locale,
      });
      if (value !== null) emit({ value });

      const summary = coverage.summary();
      return {
        ok: true,
        report: {
          inventory,
          conversations,
          universe,
          geo,
          relations,
          identity,
          ...(value !== null && { value }),
          labelCoverage: { matched: summary.matched, total: summary.total },
        },
      };
    } catch (err) {
      // The extractors swallow an absent file themselves; anything reaching here is the archive
      // being unreadable, not a section being empty.
      return {
        ok: false,
        stage: 'parse',
        error: err instanceof Error ? err.name : 'unreadable_archive',
      };
    }
  },
};
