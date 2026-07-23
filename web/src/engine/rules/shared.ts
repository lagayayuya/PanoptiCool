// Helpers SHARED by the producers (ex-`rule.ts`, Refonte A batch A1).
//
// What disappeared with the `rule.ts` file: the `Rule`/`EvidenceRule` type (there is no more
// registry to type — `analyze.ts` calls each producer by its name), the `Insight` factories by
// `kind` (the `Insight` union no longer exists), `capVerbatim`/`SAMPLE_SIGNALS_CAP` (their only
// client was `InferredValue.sampleSignals`, with no reader on screen), and the three `EvidenceId`
// factories (`commentEvidenceId`/`searchEvidenceId`/`channelEvidenceId`) — evidence is now a DIRECT
// reference carrying `channel` + `sourceIndex`, there is no more string to build nor to re-parse
// (§5.4).
//
// The inferred confidence ceiling no longer needs a dedicated type (`InferredLevel`): on the
// sensitive it is carried by the `Deduction` union itself (`sensitive: true` ⇒ `low | medium`,
// `high` forbidden AT COMPILE TIME).

/**
 * A text item candidate for lexical matching, with its originating CHANNEL (PANO-80).
 *
 * Its shape is exactly that of `Evidence` minus the citation fields (`triggerTerms`, `readings`):
 * since §5.4, `resolve()` directly returns what is needed to build a piece of evidence — that is the
 * stringly-typed round trip gone, not merely a `Map`.
 */
export interface ChannelText {
  channel: 'comment' | 'search';
  /** Index within ITS source list (comments OR searches) — never within the concatenated corpus. */
  sourceIndex: number;
  /** Verbatim text (the `comment` or the `SearchTerm`). */
  text: string;
  /** Raw source date (§1.1 format), verbatim. */
  date: string;
}

/**
 * COMMENTS + SEARCHES corpus combined for uniform detection (PANO-80, Searches adapter PANO-70
 * §1.6). Concatenates the two lists into ONE corpus (comments first, then searches) for ONE single
 * `detectLabels` pass: the per-label aggregation machinery runs across both channels without any
 * producer having to re-implement it per channel. `resolve(itemIndex)` recovers the channel + the
 * source item of an index in the concatenated corpus.
 */
export function buildChannelCorpus(
  comments: readonly { comment: string; date: string }[],
  searches: readonly { SearchTerm: string; Date: string }[],
): { texts: string[]; resolve: (itemIndex: number) => ChannelText } {
  const texts = [...comments.map((c) => c.comment), ...searches.map((s) => s.SearchTerm)];
  const nComments = comments.length;
  function resolve(itemIndex: number): ChannelText {
    if (itemIndex < nComments) {
      const c = comments[itemIndex];
      return {
        channel: 'comment',
        sourceIndex: itemIndex,
        text: c?.comment ?? '',
        date: c?.date ?? '',
      };
    }
    const sourceIndex = itemIndex - nComments;
    const s = searches[sourceIndex];
    return {
      channel: 'search',
      sourceIndex,
      text: s?.SearchTerm ?? '',
      date: s?.Date ?? '',
    };
  }
  return { texts, resolve };
}

/**
 * Parses a raw source date (contract §1.1: bare `YYYY-MM-DD HH:MM:SS` OR `… UTC` suffix) into an
 * epoch ms UTC. `null` if unparsable. An INTERNAL step of the engine (never at the boundary):
 * strips ` UTC`, normalizes the space to `T`, forces the `Z` timezone — otherwise `Date.parse` would
 * apply the LOCAL timezone of the runtime environment (drift depending on the machine).
 */
export function parseRawDateUTC(raw: string): number | null {
  const t = Date.parse(`${raw.trim().replace(/ UTC$/, '').replace(' ', 'T')}Z`);
  return Number.isNaN(t) ? null : t;
}
