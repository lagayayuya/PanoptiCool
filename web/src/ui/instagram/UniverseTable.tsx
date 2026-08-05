// « EN DÉTAIL » for the media — the spiral, laid flat.
//
// The 3D scene's axis is TIME; this keeps that axis and trades depth for legibility — newest to
// oldest, cut by year. One sees the media themselves, immediately, without opening anything.
//
// ⚠ IT RECEIVES EVERYTHING THE FILTERS KEPT, never the scene's sample. The batch exists to hold a 3D
// scene's frame rate; a list has no such ceiling, and showing the same truncated sample here would
// have taken away this view's only reason to exist — showing ALL of it.
//
// ─── ⚠ WHAT THIS VIEW DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT DOES NOT SORT BY ANYTHING BUT TIME. Sorting media by kind or by account is what the filter
//     bar above already does, and it does it to both views at once;
//   - IT DECODES ON SCROLL, so what is on screen is what has been paid for. The count under the
//     sheet says how many are actually laid down — the only place that gap is visible;
//   - IT SHOWS NO VOICE NOTE'S CONTENT. There is none to show: the export keeps the file, and this
//     interface never plays it to draw something from it.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ResolveMedia } from '../../engine/instagram/connector';
import type { UniverseItem, UniverseKind } from '../../engine/instagram/universe';
import { UI_IG_UNIVERSE } from '../copy.instagram';
import { formatInt } from '../format';
import { dayMonthYear } from './dates';
import { loadImageThumb, loadVideoPoster } from './media-thumb';
import { KIND_COLOR } from './UniverseModule';
import './universe-table.css';

/** A first slice, then one per scroll. Enough to fill two screens. */
const FIRST = 120;
const STEP = 120;

type Order = 'recent' | 'old';

const KIND_UNIT: Record<UniverseKind, () => string> = {
  photo: () => UI_IG_UNIVERSE.kindUnitPhoto,
  video: () => UI_IG_UNIVERSE.kindUnitVideo,
  audio: () => UI_IG_UNIVERSE.kindUnitAudio,
};

/**
 * One thumbnail. It loads its OWN image and releases the object URL on the way out — without which
 * scrolling a thousand media would leave a thousand blobs alive in the tab.
 */
function Thumb({
  item,
  media,
  onOpen,
}: {
  item: UniverseItem;
  media: ResolveMedia;
  onOpen: (i: UniverseItem) => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'none'>('loading');

  useEffect(() => {
    if (item.kind === 'audio') {
      setState('none');
      return;
    }
    let alive = true;
    let url: string | null = null;
    void media(item.path)
      .then(async (bytes) => {
        if (!alive || bytes === null) {
          if (alive) setState('none');
          return;
        }
        url = URL.createObjectURL(new Blob([bytes.slice().buffer]));
        const canvas =
          item.kind === 'video' ? await loadVideoPoster(url, 200) : await loadImageThumb(url, 200);
        if (!alive) return;
        ref.current?.replaceChildren(canvas);
        setState('ok');
      })
      .catch(() => {
        if (alive) setState('none');
      });
    return () => {
      alive = false;
      // The decoding is done: the thumbnail IS a canvas, and the object URL has no further use.
      if (url !== null) URL.revokeObjectURL(url);
    };
  }, [item, media]);

  const title = `${KIND_UNIT[item.kind]()} · ${dayMonthYear(item.ts)}${
    item.convTitle === undefined ? '' : ` · ${item.convTitle}`
  }`;

  return (
    <button
      type="button"
      class={`uf-thumb uf-${item.kind} ${state}`}
      title={title}
      onClick={() => onOpen(item)}
    >
      <span ref={ref} class="uf-thumb-img" />
      {state !== 'ok' && (
        <span class="uf-thumb-glyph" style={{ color: KIND_COLOR[item.kind]() }}>
          {item.kind === 'audio' ? '▮▮▮' : item.kind === 'video' ? '▶' : '·'}
        </span>
      )}
      {state === 'ok' && item.kind === 'video' && <span class="uf-thumb-play">▶</span>}
    </button>
  );
}

export function UniverseTable({
  items,
  media,
  onOpen,
}: {
  items: readonly UniverseItem[];
  media: ResolveMedia;
  onOpen: (i: UniverseItem) => void;
}) {
  const t = UI_IG_UNIVERSE;
  const [order, setOrder] = useState<Order>('recent');
  const [shown, setShown] = useState(FIRST);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(
    () => [...items].sort((a, b) => (order === 'recent' ? b.ts - a.ts : a.ts - b.ts)),
    [items, order],
  );

  // A change of query or of direction sends the sheet back to its first slice: otherwise one would
  // keep paying to decode media the filter has just excluded.
  useEffect(() => setShown(FIRST), [items, order]);

  /**
   * Scrolling loads the next slice. An observer on a sentinel rather than a `scroll` listener: it
   * fires on entering the field, where a listener would run on every pixel to do nothing most of
   * the time.
   *
   * ⚠ THE OBSERVER IS RECREATED ON EVERY SLICE, and that is indispensable. An `IntersectionObserver`
   * only reports TRANSITIONS: if the sentinel stays visible after a slice loads — which happens as
   * soon as the slice is shorter than a screen — no second call ever comes and the scrolling freezes
   * after one batch. A fresh observer reports its target's state immediately.
   */
  useEffect(() => {
    const el = sentinelRef.current;
    if (el === null || shown >= sorted.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown((n) => Math.min(sorted.length, n + STEP));
        }
      },
      { rootMargin: '600px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sorted.length, shown]);

  const visible = sorted.slice(0, shown);

  /** Cut by year: the spiral's markers, transposed flat. */
  const sections = useMemo(() => {
    const out: Array<{ year: number; items: UniverseItem[] }> = [];
    for (const it of visible) {
      const y = new Date(it.ts * 1000).getFullYear();
      const last = out[out.length - 1];
      if (last !== undefined && last.year === y) last.items.push(it);
      else out.push({ year: y, items: [it] });
    }
    return out;
  }, [visible]);

  return (
    <div class="uni-fichier">
      <div class="uf-tools">
        {/* ⚠ NOT THE TOTAL — the card's header already carries that. This says how many are
            ACTUALLY laid down right now, the rest arriving as one scrolls. */}
        <span class="tnum">
          {t.tableListed(formatInt(visible.length), formatInt(items.length))}
        </span>
        <div class="uf-order">
          {(
            [
              ['recent', t.tableRecent],
              ['old', t.tableOld],
            ] as Array<[Order, string]>
          ).map(([o, label]) => (
            <button
              key={o}
              type="button"
              class={`uf-order-btn ${order === o ? 'on' : ''}`}
              aria-pressed={order === o}
              onClick={() => setOrder(o)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 && <p class="fi-empty">{t.tableEmpty}</p>}

      {sections.map((sec) => (
        <section key={`${sec.year}-${sec.items[0]?.path ?? ''}`} class="uf-year">
          <h3 class="uf-year-h tnum">
            {sec.year}
            <span class="uf-year-n">
              {t.tableShownInYear(formatInt(sec.items.length), sec.items.length > 1)}
            </span>
          </h3>
          <div class="uf-grid">
            {sec.items.map((it) => (
              <Thumb key={it.path} item={it} media={media} onOpen={onOpen} />
            ))}
          </div>
        </section>
      ))}

      <div ref={sentinelRef} class="uf-sentinel">
        {shown < sorted.length ? (
          <>
            <span class="tnum">{t.tableProgress(formatInt(shown), formatInt(sorted.length))}</span>
            {/* ⚠ A FALLBACK CONTROL, not decoration. Loading on scroll depends on an intersection
                observer: it does not fire from the keyboard, nor inside a container whose window has
                no surface. An explicit command guarantees the rest is always reachable. */}
            <button
              type="button"
              class="uf-more"
              onClick={() => setShown((n) => Math.min(sorted.length, n + STEP))}
            >
              {t.tableMore(formatInt(Math.min(STEP, sorted.length - shown)))}
            </button>
          </>
        ) : (
          items.length > 0 && <span class="tnum">{t.tableEnd(formatInt(sorted.length))}</span>
        )}
      </div>
    </div>
  );
}
