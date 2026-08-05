// « 03 · LES MESSAGES » — the volumes, the dates and the types. Never the content.
//
// ⚠ ONE QUERY, TWO RENDERINGS. « Dans le temps » shows the rhythms, « en détail » ranks them — same
// filters, same selection, same modal. The switch is immediate because nothing else changes between
// them, and that is why they are two views of one card rather than two pages.
//
// ⚠ AND THE ENGINE READS NO MESSAGE. Everything here is counted from timestamps, senders and
// attachment lists; the text is fetched only when someone opens a thread and asks to read it, from
// the archive, and is never kept.
//
// ─── ⚠ WHAT THIS PIECE DOES NOT DO ──────────────────────────────────────────────────────────────
//   - IT DOES NOT SAY WHAT WAS SAID. The closest it comes is counting how many voice notes went
//     each way;
//   - IT DOES NOT RANK RELATIONSHIPS. Volume is volume: the most-messaged thread is not the closest
//     person, and nothing here implies it is;
//   - THE GRID IS A CANVAS and is not keyboard-reachable. The detail view is the accessible path to
//     the same selection, which is why it is a real table and not a second drawing.

import { useEffect, useMemo, useState } from 'preact/hooks';
import type { ConversationSummary } from '../../engine/instagram/conversations';
import type { UniverseItem } from '../../engine/instagram/universe';
import { UI_IG_MESSAGES, UI_IG_SHELL } from '../copy.instagram';
import { formatInt } from '../format';
import { ConvModal } from './ConvModal';
import {
  activeCount,
  BALANCES,
  CONTENT_TYPES,
  type ContentType,
  type ConvQuery,
  contentCount,
  DIRECTIONS,
  EMPTY_QUERY,
  matchesConv,
  queryPhraseParts,
} from './conversation-query';
import { monthYear } from './dates';
import { FilterMenu, FilterOption } from './FilterMenu';
import { TIME_BUCKETS } from './filters';
import type { ModuleProps } from './InstagramPage';
import { BATCH, Trame, type TrameHover, TrameLegend } from './Trame';
import { DATA } from './tokens';
import './messages.css';

type View = 'trame' | 'fichier';
type Grain = 'month' | 'quarter' | 'year';
const GRAINS = ['month', 'quarter', 'year'] as const;

/**
 * ⚠ THE CONTENT TINTS ARE THE PRODUCT'S, read from the tokens. A voice note is the same colour in
 * this menu, in this table's column head and in the media universe — a colour that changes meaning
 * between pieces stops being a vocabulary.
 */
export const CONTENT_COLOR: Record<ContentType, () => string> = {
  photos: DATA.cyan,
  videos: DATA.violet,
  audio: DATA.green,
  shares: DATA.amber,
  calls: DATA.orange,
};

/**
 * The group mark: two silhouettes, in the WARM tint.
 *
 * ⚠ IT REPLACES THE WORD « groupe », which took a first name's width on every affected row, and it
 * PRECEDES the name so every name aligns on one gutter. `aria-label` carries the meaning — a
 * decorative icon would leave a screen reader without the one thing that tells two otherwise
 * identical rows apart.
 */
function GroupMark() {
  return (
    <svg class="fc-grp" viewBox="0 0 20 20" role="img" aria-label={UI_IG_MESSAGES.groupMark}>
      <circle cx="7.4" cy="7" r="3.1" />
      <path d="M1.9 16.4c0-2.8 2.5-4.6 5.5-4.6s5.5 1.8 5.5 4.6" />
      <circle cx="14.6" cy="7.8" r="2.5" opacity=".72" />
      <path d="M13.2 12.1c2.6.2 4.9 1.9 4.9 4.3" opacity=".72" />
    </svg>
  );
}

export function MessagesModule({ report: patch, readThread, resolveMedia }: ModuleProps) {
  const t = UI_IG_MESSAGES;
  const report = patch.conversations;

  const [view, setView] = useState<View>('trame');
  const [q, setQ] = useState<ConvQuery>(EMPTY_QUERY);
  const [grain, setGrain] = useState<Grain>('quarter');
  const [orient, setOrient] = useState<'h' | 'v'>('h');
  const vertical = orient === 'v';
  const [offset, setOffset] = useState(0);
  const [learn, setLearn] = useState(false);

  // The thread's media, indexed once. The universe report lands separately from the conversations
  // one, so this is empty until it does — and an empty index simply hides the plate.
  const mediaByConv = useMemo(() => {
    const m = new Map<string, UniverseItem[]>();
    for (const it of patch.universe?.items ?? []) {
      if (it.convId === undefined) continue;
      const arr = m.get(it.convId);
      if (arr === undefined) m.set(it.convId, [it]);
      else arr.push(it);
    }
    return m;
  }, [patch.universe]);
  const [selected, setSelected] = useState<ConversationSummary | null>(null);
  const [hovered, setHovered] = useState<TrameHover | null>(null);

  // ⚠ THE EXPORT'S OWN CLOCK, not the machine's: an archive read two years later would otherwise
  // describe the wait rather than the data.
  const nowSec = useMemo(
    () =>
      Math.max(0, ...(report?.conversations ?? []).map((c) => c.lastTs ?? 0)) || Date.now() / 1000,
    [report],
  );

  const matching = useMemo(
    () => (report?.conversations ?? []).filter((c) => matchesConv(c, q, nowSec)),
    [report, q, nowSec],
  );

  // ⚠ DEPENDS ON `q`: filtering from page 4 of a large selection otherwise lands on an empty grid
  // and says nothing about why.
  useEffect(() => setOffset(0), [q]);

  if (report === undefined) return null;

  const totals = report.totals;
  const first = Math.min(...report.conversations.map((c) => c.firstTs ?? Number.POSITIVE_INFINITY));
  const last = Math.max(...report.conversations.map((c) => c.lastTs ?? 0));
  const dated = Number.isFinite(first) && last > 0;
  const years = dated ? Math.max(1, Math.round((last - first) / 31_557_600)) : 0;
  const span = dated ? t.spanFromTo(monthYear(first), monthYear(last)) : t.spanAll;
  const pctSelf = totals.messages > 0 ? Math.round((totals.sentBySelf / totals.messages) * 100) : 0;

  const pages = Math.max(1, Math.ceil(matching.length / BATCH));
  const page = Math.min(pages, Math.floor(offset / BATCH) + 1);

  const beyond = CONTENT_TYPES.map((k) => ({
    label: t.contentLabels[k],
    n: report.conversations.reduce((sum, c) => sum + contentCount(c, k, 'any'), 0),
  })).filter((x) => x.n > 0);

  return (
    <div class="convs">
      <section class="convs-hero">
        <h1 class="convs-h1">{t.h1(String(years))}</h1>
        <p class="convs-lede">{t.lede(span)}</p>
        <button
          type="button"
          class="learn-btn"
          aria-expanded={learn}
          onClick={() => setLearn((v) => !v)}
        >
          {t.learnOpen} {learn ? UI_IG_SHELL.learnGlyphOpen : UI_IG_SHELL.learnGlyphClosed}
        </button>
      </section>

      {learn && (
        <div class="learn-panel">
          <span class="learn-h">{t.learnTitle}</span>
          <div class="learn-cols">
            <div>
              <span class="learn-k">{t.learnKeptK}</span>
              <span class="learn-p">{t.learnKeptP}</span>
            </div>
            <div>
              <span class="learn-k">{t.learnCryptK}</span>
              <span class="learn-p">{t.learnCryptP}</span>
            </div>
            <div>
              <span class="learn-k">{t.learnFormK}</span>
              <span class="learn-p">{t.learnFormP}</span>
            </div>
          </div>
        </div>
      )}

      {/* ⚠ THE FIGURES ARE A BAND, outside the card. They describe the WHOLE export; inside the card
          they would read as a property of the filtered selection. */}
      <div class="kit-tiles">
        <Tile v={formatInt(totals.messages)} k={t.tileMessages} />
        <Tile v={formatInt(totals.distinctParticipants)} k={t.tilePeople} />
        <Tile v={formatInt(totals.conversations)} k={t.tileThreads(formatInt(totals.groups))} />
        <Tile v={`${pctSelf} %`} k={t.tileSelf(formatInt(totals.sentBySelf))} />
      </div>

      <section class="card convs-card">
        {/* The COUNT as the title, the query as the subtitle, the clearing beside it. The number
            used to be written twice — here in words, and again under the filters. */}
        <header class="kit-head">
          <span class="kit-count">{t.count(formatInt(matching.length))}</span>
          <span role="status" class="kit-sub">
            {phrase(q)}
          </span>
          {activeCount(q) > 0 && (
            <button type="button" class="query-reset" onClick={() => setQ(EMPTY_QUERY)}>
              {t.filters.reset}
            </button>
          )}
          <span class="kit-spacer" />
          {/* biome-ignore lint/a11y/useSemanticElements: `<fieldset>` groups FORM controls; these are
              view switches, and `role="group"` with a label is the ARIA pattern for them. */}
          <div class="vw-tabs" role="group" aria-label={t.viewGroupLabel}>
            {(
              [
                ['trame', t.viewTrame],
                ['fichier', t.viewFile],
              ] as Array<[View, string]>
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                class={`vw-tab ${view === v ? 'on' : ''}`}
                aria-pressed={view === v}
                onClick={() => setView(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <ConvFilters conversations={report.conversations} q={q} onChange={setQ} />

        {view === 'trame' && (
          <>
            {/* ⚠ THE READOUT REPLACES THE HINT, it does not join it. Rendered side by side they
                read as one sentence — « clique une ligne pour ouvrir le fil nora · 2017-T4 · 0
                messages » — and the instruction went on giving an order about a cell already under
                the pointer. */}
            <TrameLegend>
              {hovered === null ? (
                <span class="tr-ro-hint">{t.hint}</span>
              ) : (
                <span>
                  {hovered.label !== undefined
                    ? t.hoverCell(hovered.title, hovered.label, formatInt(hovered.value ?? 0))
                    : t.hoverRow(hovered.title, formatInt(hovered.total))}
                </span>
              )}
            </TrameLegend>

            {/* ⚠ ONE BLOCK: the bar and the grid must not be separated by the container's gap, or
                their borders do not meet. And the bar borrows the FILTER MENUS' controls rather than
                inventing a second set — one mechanic to learn on the page, not two. */}
            <div class="vw-block">
              <div class="vw-bar">
                <FilterMenu label={t.grain} summary={t.grains[grain]} active={false}>
                  {GRAINS.map((g) => (
                    <FilterOption key={g} checked={grain === g} onClick={() => setGrain(g)}>
                      {t.grains[g]}
                    </FilterOption>
                  ))}
                </FilterMenu>
                <button
                  type="button"
                  class={`fm-btn ${vertical ? 'on' : ''}`}
                  aria-pressed={vertical}
                  onClick={() => setOrient(orient === 'h' ? 'v' : 'h')}
                >
                  <span class="fm-axis">{t.orient}</span>
                  <span class="fm-value">{vertical ? t.orientV : t.orientH}</span>
                </button>

                {pages > 1 && (
                  <div class="vw-pager vw-bar-right">
                    <button
                      type="button"
                      class="vw-arrow"
                      disabled={page === 1}
                      aria-label={t.prevPage}
                      onClick={() => setOffset(Math.max(0, offset - BATCH))}
                    >
                      ←
                    </button>
                    {/* The number of PAGES, not the range of threads. « 21–40 of 349 » asked for a
                        mental calculation to answer the only question an arrow raises: how many
                        times will I have to click? */}
                    <span class="vw-range tnum">
                      <span class="vw-range-k">{t.page}</span>
                      {page} / {pages}
                    </span>
                    <button
                      type="button"
                      class="vw-arrow"
                      disabled={page === pages}
                      aria-label={t.nextPage}
                      onClick={() => setOffset(offset + BATCH)}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
              <Trame
                conversations={matching}
                grain={grain}
                orient={orient}
                offset={offset}
                onSelect={setSelected}
                onHover={setHovered}
              />
            </div>
          </>
        )}

        {view === 'fichier' && <FichierConv conversations={matching} onOpen={setSelected} />}
      </section>

      <section class="card">
        <header class="kit-head">
          <h2 class="card-h">{t.beyondTitle}</h2>
          <span class="kit-sub">{t.beyondLede}</span>
        </header>
        <div class="cv-beyond">
          {beyond.map((x) => (
            <div key={x.label} class="cv-beyond-item">
              <span class="cv-beyond-v tnum">{formatInt(x.n)}</span>
              <span class="cv-beyond-k">{x.label}</span>
            </div>
          ))}
        </div>
      </section>

      {selected !== null && (
        <ConvModal
          conv={selected}
          self={report.self}
          media={mediaByConv.get(selected.id) ?? []}
          readThread={readThread}
          resolveMedia={resolveMedia}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function Tile({ v, k }: { v: string; k: string }) {
  return (
    <div class="kit-tile">
      <span class="kit-tile-v tnum">{v}</span>
      <span class="kit-tile-k">{k}</span>
    </div>
  );
}

/** Builds the sentence from the query's PARTS — the assembly is per language, by design. */
function phrase(q: ConvQuery): string {
  const t = UI_IG_MESSAGES;
  const p = queryPhraseParts(q);
  if (p.empty) return t.phraseNone;
  const parts: string[] = [];
  if (p.search !== null) parts.push(t.phraseSearch(p.search));
  if (p.contents.length > 0) {
    parts.push(p.contents.map((c) => t.contentLabels[c].toLowerCase()).join(' + '));
  }
  if (p.direction !== 'any') parts.push(t.directionLabels[p.direction].toLowerCase());
  if (p.balance !== 'any') parts.push(t.balanceLabels[p.balance].toLowerCase());
  if (p.time !== 'any') parts.push(t.timeLabels[p.time].toLowerCase());
  return t.phraseActive(parts.join(' · '));
}

/* ============================ The filter bar ============================ */

function ConvFilters({
  conversations,
  q,
  onChange,
}: {
  conversations: readonly ConversationSummary[];
  q: ConvQuery;
  onChange: (q: ConvQuery) => void;
}) {
  const t = UI_IG_MESSAGES;
  const toggleContent = (c: ContentType) => {
    const next = new Set(q.contents);
    if (!next.delete(c)) next.add(c);
    onChange({ ...q, contents: next });
  };
  const contentSummary =
    q.contents.size === 0
      ? q.direction === 'any'
        ? t.filters.contentsAll
        : t.directionLabels[q.direction]
      : q.contents.size === 1
        ? t.contentLabels[[...q.contents][0] as ContentType]
        : t.filters.contentsChecked(String(q.contents.size));

  return (
    <div class="rel-controls">
      <div class="filter-menus">
        <input
          class="fm-search"
          type="search"
          placeholder={t.searchPlaceholder}
          aria-label={t.searchLabel}
          value={q.search}
          onInput={(e) => onChange({ ...q, search: e.currentTarget.value })}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onChange({ ...q, search: '' });
          }}
        />

        <FilterMenu
          label={t.filters.contents}
          summary={contentSummary}
          active={q.contents.size > 0 || q.direction !== 'any'}
        >
          {CONTENT_TYPES.map((c) => (
            <FilterOption
              key={c}
              multi
              checked={q.contents.has(c)}
              count={conversations.filter((x) => contentCount(x, c, q.direction) > 0).length}
              color={CONTENT_COLOR[c]()}
              onClick={() => toggleContent(c)}
            >
              {t.contentLabels[c]}
            </FilterOption>
          ))}
          {/* ⚠ THE DIRECTION LIVES UNDER THE CONTENTS, after a separator. It is not an axis —
              « received » alone filters nothing — and placing it here states that dependency
              instead of describing it in a legend. */}
          <div class="fm-sep" />
          {DIRECTIONS.map((d) => (
            <FilterOption
              key={d}
              checked={q.direction === d}
              onClick={() => onChange({ ...q, direction: d })}
            >
              {t.directionLabels[d]}
            </FilterOption>
          ))}
        </FilterMenu>

        <FilterMenu
          label={t.filters.balance}
          summary={t.balanceLabels[q.balance]}
          active={q.balance !== 'any'}
        >
          {BALANCES.map((b) => (
            <FilterOption
              key={b}
              checked={q.balance === b}
              onClick={() => onChange({ ...q, balance: b })}
            >
              {t.balanceLabels[b]}
            </FilterOption>
          ))}
        </FilterMenu>

        <FilterMenu label={t.filters.time} summary={t.timeLabels[q.time]} active={q.time !== 'any'}>
          {TIME_BUCKETS.map((b) => (
            <FilterOption
              key={b}
              checked={q.time === b}
              onClick={() => onChange({ ...q, time: b })}
            >
              {t.timeLabels[b]}
            </FilterOption>
          ))}
        </FilterMenu>
      </div>
    </div>
  );
}

/* ============================ « En détail » ============================ */

type SortKey = 'title' | 'balance' | 'messages';

/**
 * ⚠ ONE COLUMN PER TYPE, and not a row of pills.
 *
 * The pills each carried a border, a dot and a word, and above all they MOVED from one row to the
 * next depending on which types were present: two threads could never be compared at a glance, and
 * « who sends me the most voice notes? » had no answer. The word is written ONCE, in the header.
 */
function FichierConv({
  conversations,
  onOpen,
}: {
  conversations: readonly ConversationSummary[];
  onOpen: (c: ConversationSummary) => void;
}) {
  const t = UI_IG_MESSAGES;
  const [sort, setSort] = useState<SortKey>('messages');
  const [asc, setAsc] = useState(false);

  const share = (c: ConversationSummary) => (c.messages === 0 ? 0 : c.sentBySelf / c.messages);
  const rows = useMemo(() => {
    const dir = asc ? 1 : -1;
    return [...conversations].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title) * (asc ? 1 : -1);
      if (sort === 'balance') return (share(a) - share(b)) * dir;
      return (a.messages - b.messages) * dir;
    });
  }, [conversations, sort, asc]);

  /**
   * ⚠ `aria-pressed` AND NOT `aria-sort`. The latter is the right word, and it is only valid on a
   * `columnheader` — which would mean declaring this an ARIA table, and each row here is a BUTTON,
   * not a row: giving it `role="row"` would take the button semantics away from the only control
   * that opens a thread. So the header says « active », the arrow says which way, and what a screen
   * reader loses is the direction — stated here rather than left to be discovered.
   */
  const head = (key: SortKey, label: string, cls: string) => (
    <button
      type="button"
      class={`fi-th fi-sortable ${cls} ${sort === key ? 'on' : ''}`}
      aria-pressed={sort === key}
      onClick={() => {
        if (sort === key) setAsc(!asc);
        else {
          setSort(key);
          setAsc(false);
        }
      }}
    >
      {label}
      <span class="fi-arrow">{sort === key ? (asc ? '▲' : '▼') : '·'}</span>
    </button>
  );

  return (
    <div class="fichier fi-solo">
      <div class="fi-main">
        {/* No counter here: the query bar just above already carries the number of threads, and it
            says in addition what the filters kept. */}
        <div class="fi-head fc-grid">
          {head('title', t.tableThread, 'fc-c-name')}
          {head('balance', t.tableBalance, 'fc-c-bal')}
          {/* Volume is NOT sortable: it is already the default order, and a clickable header that
              only confirms what one sees invites a click with no effect. */}
          <span class="fi-th fc-c-msg">{t.tableMessages}</span>
          {CONTENT_TYPES.map((k) => (
            <span key={k} class="fi-th fc-c-n" style={{ color: CONTENT_COLOR[k]() }}>
              {t.contentLabels[k]}
            </span>
          ))}
        </div>

        <div class="fi-rows">
          {rows.length === 0 && <p class="fi-empty">{t.tableEmpty}</p>}
          {rows.map((c) => {
            const s = share(c);
            return (
              // The whole row is the button: a full-width target, and one tab stop per thread.
              <button key={c.id} type="button" class="fi-row fc-grid" onClick={() => onOpen(c)}>
                <span class="fc-c-name fi-name">
                  {c.isGroup && <GroupMark />}
                  {c.title}
                </span>
                {/* A two-colour bar: your share on the left, theirs on the right. */}
                <span class="fc-c-bal fc-bal" title={t.balanceTitle(String(Math.round(s * 100)))}>
                  <i class="fc-bal-self" style={{ width: `${s * 100}%` }} />
                  <i class="fc-bal-other" style={{ width: `${(1 - s) * 100}%` }} />
                </span>
                <span class="fc-c-msg tnum">{formatInt(c.messages)}</span>
                {/* ⚠ A DOT FOR ABSENCE, never a zero: a column of zeros reads as a measurement,
                    where there is nothing to measure. */}
                {CONTENT_TYPES.map((k) => {
                  const n = contentCount(c, k, 'any');
                  return (
                    <span key={k} class={`fc-c-n tnum ${n === 0 ? 'z' : ''}`}>
                      {n === 0 ? '·' : formatInt(n)}
                    </span>
                  );
                })}
              </button>
            );
          })}
        </div>

        <p class="fi-legend">{t.tableLegend}</p>
      </div>
    </div>
  );
}
