// « LA TRAME » — one cell per month per thread, density carried by COLOUR AT FIXED SIZE.
//
// That is the idea worth keeping, and the reason this beats a waterfall: an active month stays
// visible whatever its magnitude, and nothing hides anything.
//
// ─── THE FOUR THINGS ITS EARLIER VERSIONS DID BADLY ─────────────────────────────────────────────
//
//  1. ⚠ IT SCROLLED ON BOTH AXES, which makes it impossible to hold a thread in the eye. Here ONE
//     axis scrolls at a time: in rows, time always fits the width and threads add downward; in
//     columns, time descends and threads scroll sideways.
//
//     The first attempt fitted the cells to the box so nothing ever scrolled. Dropped after trying
//     it (yuya): past a dozen threads the cells were too small to read. BETTER TO SCROLL ON ONE
//     AXIS THAN TO COMPRESS ON BOTH — an unreadable cell shows nothing, an off-screen one is a
//     gesture away.
//  2. TWO THREADS COULD NOT BE COMPARED. A dense row over 3 months and a lukewarm one over 8 years
//     looked alike. Hence the total beside each name.
//  3. ⚠ THE SCALE FLATTENED EVERYTHING. Monthly volumes run from 1 to ~2 600; on a linear scale
//     anything that is not a peak goes black. LOGARITHMIC, and the legend says so.
//  4. It existed only in landscape. The orientation flips now, which is also the layout a phone
//     screen wants.
//
// ⚠ AND THE SCALE COMES FROM THE WHOLE SELECTION, not from the displayed batch. Otherwise the
// colours would change meaning from one page to the next and comparing two batches would be
// impossible — the one thing a heatmap is for.
//
// ─── WHAT THIS COMPONENT DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT READS NO MESSAGE. It draws `monthly` counts, which is all the report carries;
//   - IT DOES NOT SORT. The order is the caller's, and the batch is a window onto it;
//   - IT IS A CANVAS, so it carries no DOM per cell — 50 threads × 150 months is 7 500 nodes the
//     browser would otherwise lay out — and therefore NOTHING IN IT IS SELECTABLE OR REACHABLE BY
//     KEYBOARD. The thread list beside it is the accessible path to the same data, and that is the
//     trade this component makes rather than one it hides.

import type { ComponentChildren, JSX } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ConversationSummary } from '../../engine/instagram/conversations';
import { formatInt } from '../format';
import { DATA, SURFACE } from './tokens';
import './trame.css';

export type Grain = 'month' | 'quarter' | 'year';
export const GRAINS = ['month', 'quarter', 'year'] as const;
export type Orient = 'h' | 'v';

/**
 * ⚠ FIXED BATCH SIZE. This was a four-value setting (10/20/30/50) — a choice nobody can make
 * informedly before trying it, and which has exactly one good answer: the largest number that stays
 * readable. Here it is, decided once.
 */
export const BATCH = 50;

/** Readability floors. Below these a cell stops being hoverable and stops being legible. */
const ROW_MIN = 26;
const COL_MIN = 74;
const TIME_MIN_V = 17;
const PAD = 12;
const NAME_W = 190;
/** Enough for « 18 584 » and its gutter. */
const TOTAL_W = 62;
const NAME_H = 30;
const TOTAL_H = 24;
const TIME_W = 52;
const TIME_H = 22;

/**
 * The « group » mark: two silhouettes, drawn as strokes, to the LEFT of the name.
 *
 * It was a pill carrying the word « groupe », 62 px wide — the width of a first name, taken from
 * every row whether or not that thread was a group (the gutter has to be shared, or the names step
 * raggedly). The icon costs 15 px and reads at a glance, which a word repeated twelve times does
 * not.
 */
const GRP_W = 15;
const GRP_GAP = 8;

function drawGroupMark(ctx: CanvasRenderingContext2D, x: number, cy: number): void {
  const u = GRP_W / 20;
  ctx.save();
  ctx.translate(x, cy - GRP_W / 2);
  ctx.scale(u, u);
  ctx.strokeStyle = DATA.orange();
  ctx.lineWidth = 1.7 / u;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(7.4, 7, 3.1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(7.4, 16.6, 5.5, Math.PI, 0);
  ctx.stroke();
  ctx.globalAlpha = 0.72;
  ctx.beginPath();
  ctx.arc(14.6, 7.8, 2.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(14.9, 16.4, 4.3, Math.PI * 1.15, Math.PI * 1.95);
  ctx.stroke();
  ctx.restore();
}

/**
 * A multi-hue sequential ramp. One hue varying in lightness would be the sober choice, but on a
 * dark ground the low values become indistinguishable from the void; the hue progression gives
 * legible steps where lightness alone does not.
 *
 * ⚠ A DECLARED EXEMPTION FROM THE PALETTE RULE. The product requires that two colours be identical
 * or frankly different (the ratified theme's own rule); a CONTINUOUS ramp is made of intermediate
 * values and cannot comply — the same exemption a stepped family gets. Its two ENDS are vocabulary
 * (the void is `--ig-panel-hi`, the full is `--ig-warm`); the four middle stops belong to no axis
 * and mean nothing but « between the two ».
 */
const RAMP: ReadonlyArray<readonly [number, readonly [number, number, number]]> = [
  [0, [16, 24, 56]], // #101838 — the void
  [0.22, [34, 80, 122]],
  [0.45, [43, 127, 155]],
  [0.62, [63, 156, 147]],
  [0.78, [168, 180, 126]],
  [0.9, [221, 154, 85]],
  [1, [232, 117, 78]], // #e8754e — the full
];

export function ramp(t: number): string {
  const x = Math.max(0, Math.min(1, t));
  for (let i = 1; i < RAMP.length; i++) {
    const stop = RAMP[i];
    const prev = RAMP[i - 1];
    if (stop === undefined || prev === undefined) break;
    const [p1, c1] = stop;
    const [p0, c0] = prev;
    if (x <= p1) {
      const k = (x - p0) / (p1 - p0 || 1);
      const mix = (a: number, b: number) => Math.round(a + (b - a) * k);
      return `rgb(${mix(c0[0], c1[0])},${mix(c0[1], c1[1])},${mix(c0[2], c1[2])})`;
    }
  }
  return 'rgb(232,117,78)';
}

function ymIndex(ym: string, base: string): number {
  const [y, m] = ym.split('-').map(Number);
  const [by, bm] = base.split('-').map(Number);
  return ((y ?? 0) - (by ?? 0)) * 12 + ((m ?? 0) - (bm ?? 0));
}
function ymAt(base: string, i: number): { y: number; m: number } {
  const [by, bm] = base.split('-').map(Number);
  const y = (by ?? 0) + Math.floor(((bm ?? 1) - 1 + i) / 12);
  const m = (((bm ?? 1) - 1 + i) % 12) + 1;
  return { y, m };
}

/** Groups months by grain, and names each column. */
export function buckets(base: string, months: number, grain: Grain) {
  const idx: number[] = [];
  const labels: string[] = [];
  const majors: boolean[] = [];
  for (let i = 0; i < months; i++) {
    const { y, m } = ymAt(base, i);
    const key =
      grain === 'year' ? `${y}` : grain === 'quarter' ? `${y}-T${Math.ceil(m / 3)}` : `${y}-${m}`;
    if (labels[labels.length - 1] !== key) {
      labels.push(key);
      majors.push(m === 1 || grain === 'year');
    }
    idx[i] = labels.length - 1;
  }
  return { idx, labels, majors, count: labels.length };
}

/**
 * The scale legend, taken out of the grid's foot and placed under the tabs.
 *
 * ⚠ Below the grid it forced a reader down the whole height before they could know how to interpret
 * the colours. It also hosts the HOVER READOUT, which lived in the foot too: both say the same thing
 * — how to read what you are looking at — and separating them by a thousand pixels of grid made the
 * eye travel on every hovered cell.
 */
export function TrameLegend({ children }: { children?: ComponentChildren }) {
  return (
    <div class="tr-scale">
      <span>{/* « moins » — supplied by the caller's copy */}</span>
      {[0.22, 0.45, 0.62, 0.78, 0.9, 1].map((t) => (
        <i key={t} style={{ background: ramp(t) }} />
      ))}
      <span class="tr-readout">{children}</span>
    </div>
  );
}

/** What the grid reports about its hover. The grid knows it; the page displays it. */
export interface TrameHover {
  title: string;
  total: number;
  /** Only on a real cell: above a name there is no date. */
  label?: string | undefined;
  value?: number | undefined;
}

export function Trame({
  conversations,
  grain,
  orient,
  offset,
  onSelect,
  onHover,
}: {
  conversations: readonly ConversationSummary[];
  grain: Grain;
  orient: Orient;
  offset: number;
  onSelect: (c: ConversationSummary) => void;
  onHover: (h: TrameHover | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  /** The hovered ROW, even outside the grid: it decides the cursor and the readout. */
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const hitRef = useRef({ x0: 0, y0: 0, cw: 0, ch: 0, rows: 0, cols: 0 });
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewW, setViewW] = useState(0);

  const rows = useMemo(() => conversations.slice(offset, offset + BATCH), [conversations, offset]);

  const grid = useMemo(() => {
    let min: string | null = null;
    let max: string | null = null;
    for (const c of conversations) {
      for (const m of c.monthly) {
        if (min === null || m.ym < min) min = m.ym;
        if (max === null || m.ym > max) max = m.ym;
      }
    }
    if (min === null || max === null) return null;
    const base = min;
    const b = buckets(base, ymIndex(max, base) + 1, grain);

    const foldInto = (c: ConversationSummary) => {
      const v = new Array<number>(b.count).fill(0);
      for (const m of c.monthly) {
        const k = b.idx[ymIndex(m.ym, base)];
        if (k !== undefined) v[k] = (v[k] ?? 0) + m.count;
      }
      return v;
    };

    // Values of the DISPLAYED batch…
    const cells = rows.map(foldInto);
    // …but the SCALE comes from the whole selection: otherwise the colours would change meaning
    // from one batch to the next, and comparing two pages would be impossible.
    let peak = 1;
    for (const c of conversations) {
      for (const x of foldInto(c)) if (x > peak) peak = x;
    }
    return { base, b, cells, peak };
  }, [conversations, rows, grain]);

  /**
   * ⚠ THE BOX FOLLOWS THE CONTENT, not the other way round. Instead of compressing cells to fit a
   * fixed frame, a readable size is fixed and the container scrolls on ONE axis.
   *
   * ⚠ AND THE MARGINS ARE COMPUTED ONCE, HERE. They used to be worked out twice — once for the
   * box's size, once inside the drawing — and the two disagreed: the drawing reserved 26 px above
   * the names for the group mark, the box did not, so the last time-row was drawn 14 px past the
   * canvas and simply disappeared. Measured on 2026-08-04: the paint reached the last pixel of a
   * canvas whose bottom 12 px are supposed to be padding.
   */
  const R = rows.length;
  const C = grid?.b.count ?? 0;
  const anyGroup = rows.some((c) => c.isGroup);
  /** In columns the group mark sits ABOVE the name: the header has to make room for it. */
  const nameH = orient === 'v' ? NAME_H + (anyGroup ? 26 : 0) : 0;
  const totalH = orient === 'v' ? TOTAL_H : 0;
  const timeH = orient === 'h' ? TIME_H : 0;
  const contentH =
    orient === 'h' ? PAD * 2 + R * ROW_MIN + timeH : PAD * 2 + nameH + totalH + C * TIME_MIN_V;
  const contentW = orient === 'v' ? PAD * 2 + TIME_W + R * COL_MIN : 0;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (wrap === null || canvas === null || grid === null) return;

    const draw = () => {
      // ⚠ MEASURED ON THE SCROLL BOX, NOT ON THE STAGE. The stage's own width is what this function
      // decides, so reading it back was a round trip through the DOM — and after a switch of
      // orientation the stage still carried the OTHER orientation's width for a frame: the grid was
      // then drawn 3 776 px wide inside a 1 180 px box, and every recent column sat outside it,
      // unreachable. Observed on 2026-08-04, and it is what « les dernières cases récentes sont
      // cachées » was. The scroll box's width depends on nothing this function does.
      const view = scrollRef.current?.clientWidth ?? wrap.clientWidth;
      const W = orient === 'h' ? view : Math.max(view, contentW);
      const H = contentH;
      if (W === 0 || H === 0) return;
      // Capped at 2: past that the pixel count grows faster than anything a reader can see, and a
      // 50 × 150 grid on a 3× display is a canvas nobody needs.
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      const ctx = canvas.getContext('2d');
      if (ctx === null) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.font = '500 13px Archivo, system-ui, sans-serif';

      const GAP = 1;
      const nameW = orient === 'h' ? NAME_W : 0;
      const totalW = orient === 'h' ? TOTAL_W : 0;
      const timeW = orient === 'v' ? TIME_W : 0;

      // HORIZONTAL: rows are threads, columns are time. VERTICAL: the reverse.
      // ⚠ IN ROWS, THE YEARS ARE READ ABOVE THE GRID (yuya's decision, where the prototype put them
      // underneath): the eye meets the axis before the thing it dates, and on fifty rows the label
      // strip was a screen away from the first cell it names.
      const gridX = PAD + (orient === 'h' ? nameW + totalW : timeW);
      const gridY = PAD + (orient === 'h' ? timeH : nameH + totalH);
      const gridW = W - gridX - PAD;
      const gridH = H - gridY - PAD;

      // The grid FILLS the space when there is some and OVERFLOWS it when there is not — the
      // container scrolls, the cell never shrinks below its floor.
      const cw = orient === 'h' ? gridW / C : Math.max(COL_MIN, gridW / R);
      const ch = orient === 'h' ? Math.max(ROW_MIN, gridH / R) : Math.max(TIME_MIN_V, gridH / C);
      hitRef.current = { x0: gridX, y0: gridY, cw, ch, rows: R, cols: C };

      const cellX = (r: number, c: number) => gridX + (orient === 'h' ? c * cw : r * cw);
      const cellY = (r: number, c: number) => gridY + (orient === 'h' ? r * ch : c * ch);

      // ——— the grid ———
      const logPeak = Math.log1p(grid.peak);
      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          const v = grid.cells[r]?.[c] ?? 0;
          ctx.fillStyle = v === 0 ? SURFACE.panelHi() : ramp(Math.log1p(v) / logPeak);
          ctx.fillRect(cellX(r, c), cellY(r, c), Math.max(1, cw - GAP), Math.max(1, ch - GAP));
        }
      }

      /**
       * ⚠ THE THREAD BAND DRAWS ON THE WHOLE ROW, including outside the grid — over its name and
       * its total. That is exactly the area that accepts the click, so it has to react the same
       * way; otherwise half the clickable target stays mute.
       *
       * The TIME band and the outline need a real cell: they designate a DATE, which does not
       * exist above a name.
       */
      if (hoverRow !== null && hoverRow < R) {
        ctx.fillStyle = 'rgba(233,231,225,0.07)';
        if (orient === 'h') ctx.fillRect(0, gridY + hoverRow * ch, W, ch - GAP);
        else ctx.fillRect(gridX + hoverRow * cw, 0, cw - GAP, H);
      }
      if (hover !== null && hover.r < R && hover.c < C) {
        ctx.fillStyle = 'rgba(233,231,225,0.07)';
        if (orient === 'h') ctx.fillRect(gridX + hover.c * cw, gridY, cw - GAP, gridH);
        else ctx.fillRect(gridX, gridY + hover.c * ch, gridW, ch - GAP);
        ctx.strokeStyle = DATA.inkBright();
        ctx.lineWidth = 1.4;
        ctx.strokeRect(
          cellX(hover.r, hover.c) - 0.5,
          cellY(hover.r, hover.c) - 0.5,
          Math.max(2, cw - GAP + 1),
          Math.max(2, ch - GAP + 1),
        );
      }

      // ——— names, and each row's total ———
      for (let r = 0; r < R; r++) {
        const conv = rows[r];
        if (conv === undefined) continue;
        const isHov = hoverRow === r;
        ctx.fillStyle = isHov ? DATA.inkBright() : DATA.muted();
        if (orient === 'h') {
          const y = gridY + r * ch + ch / 2 + 3.5;
          ctx.textAlign = 'left';
          // ⚠ The mark's gutter is RESERVED for the whole batch, group or not: without the
          // reservation the names would settle at different x from one row to the next, and the
          // column would read as a sawtooth.
          const gutter = anyGroup ? GRP_W + GRP_GAP : 0;
          const max = Math.floor((nameW - gutter - 10) / 6.6);
          ctx.fillText(
            conv.title.length > max ? `${conv.title.slice(0, max - 1)}…` : conv.title,
            PAD + gutter,
            y,
          );
          if (conv.isGroup) drawGroupMark(ctx, PAD, gridY + r * ch + ch / 2);
          // The volume BAR is gone (yuya): it doubled what the number says exactly, and on a list
          // sorted by volume it only ever drew a staircase.
          ctx.fillStyle = isHov ? DATA.inkBright() : DATA.faint();
          ctx.textAlign = 'right';
          ctx.fillText(formatInt(conv.messages), PAD + nameW + totalW - 8, y);
          ctx.textAlign = 'left';
        } else {
          // Names stay HORIZONTAL (yuya): rotated, they were unreadable. The rotation only existed
          // because the columns were too narrow — giving the column a floor width fixes the cause.
          const x = gridX + r * cw + cw / 2;
          ctx.textAlign = 'center';
          const max = Math.floor((cw - 6) / 6.2);
          ctx.fillText(
            conv.title.length > max ? `${conv.title.slice(0, Math.max(1, max - 1))}…` : conv.title,
            x,
            PAD + nameH - 9,
          );
          if (conv.isGroup) drawGroupMark(ctx, x - GRP_W / 2, PAD + nameH - 26);
          ctx.fillStyle = isHov ? DATA.inkBright() : DATA.faint();
          ctx.fillText(formatInt(conv.messages), x, PAD + nameH + totalH - 12);
          ctx.textAlign = 'left';
        }
      }

      // ——— time labels ———
      ctx.fillStyle = DATA.faint();
      ctx.font = '400 11px Archivo, system-ui, sans-serif';
      // ⚠ ONE label per year, at the year's start. Combining « the majors » with « one in N »
      // produced duplicates (2015 2015 2016 2016…): two rules for one need, and only one was
      // needed.
      const majorsIdx = grid.b.majors.flatMap((m, i) => (m ? [i] : []));
      const room = orient === 'h' ? 34 : 16;
      const stride = Math.max(
        1,
        Math.ceil(majorsIdx.length / Math.floor((orient === 'h' ? gridW : gridH) / room)),
      );
      for (let k = 0; k < majorsIdx.length; k += stride) {
        const c = majorsIdx[k];
        if (c === undefined) continue;
        const label = grid.b.labels[c]?.split('-')[0];
        if (label === undefined) continue;
        if (orient === 'h') {
          ctx.textAlign = 'center';
          ctx.fillText(label, gridX + c * cw + cw / 2, gridY - 7);
        } else {
          ctx.textAlign = 'right';
          ctx.fillText(label, PAD + timeW - 8, gridY + c * ch + ch / 2 + 3);
        }
      }
      ctx.textAlign = 'left';
    };

    draw();
    // ⚠ THE SCROLL BOX IS WHAT IS WATCHED, for the same reason it is what is measured: in columns
    // the stage's width is a constant this component sets, so a narrowed window never resized it
    // and the grid kept the width of a viewport that no longer existed.
    const ro = new ResizeObserver(draw);
    ro.observe(scrollRef.current ?? wrap);
    return () => ro.disconnect();
  }, [grid, rows, orient, hover, hoverRow, contentH, contentW]);

  const pick = (e: { clientX: number; clientY: number }) => {
    const wrap = wrapRef.current;
    if (wrap === null || grid === null) return null;
    const box = wrap.getBoundingClientRect();
    const { x0, y0, cw, ch, rows: nR, cols: nC } = hitRef.current;
    const x = e.clientX - box.left - x0;
    const y = e.clientY - box.top - y0;
    const r = orient === 'h' ? Math.floor(y / ch) : Math.floor(x / cw);
    const c = orient === 'h' ? Math.floor(x / cw) : Math.floor(y / ch);
    if (r < 0 || r >= nR || c < 0 || c >= nC) return null;
    return { r, c };
  };

  /**
   * The thread under the cursor, ignoring the time coordinate.
   *
   * ⚠ The click used to be accepted only ON a grid cell: aiming at a thread's NAME, or its total,
   * did nothing — and that is exactly where one points to say « open this thread ». So only the
   * thread axis is tested, extended across the whole box.
   */
  const pickRow = (e: { clientX: number; clientY: number }): number | null => {
    const wrap = wrapRef.current;
    if (wrap === null || grid === null) return null;
    const box = wrap.getBoundingClientRect();
    const { x0, y0, cw, ch, rows: nR } = hitRef.current;
    const along =
      orient === 'h' ? (e.clientY - box.top - y0) / ch : (e.clientX - box.left - x0) / cw;
    const r = Math.floor(along);
    return r >= 0 && r < nR ? r : null;
  };

  const hovered = hover !== null && grid !== null ? rows[hover.r] : undefined;

  /**
   * ⚠ ONLY CHANGES ARE REPORTED. Emitting a fresh object on every render would re-render the page,
   * therefore the grid, indefinitely — the key below is the guard.
   */
  const sentRef = useRef('');
  useEffect(() => {
    const rowConv = hoverRow !== null ? rows[hoverRow] : undefined;
    const info: TrameHover | null =
      hovered !== undefined && hover !== null && grid !== null
        ? {
            title: hovered.title,
            total: hovered.messages,
            label: grid.b.labels[hover.c],
            value: grid.cells[hover.r]?.[hover.c] ?? 0,
          }
        : rowConv !== undefined
          ? { title: rowConv.title, total: rowConv.messages }
          : null;
    const key = info === null ? '' : `${info.title}|${info.label ?? ''}|${info.value ?? ''}`;
    if (key === sentRef.current) return;
    sentRef.current = key;
    onHover(info);
  }, [hovered, hover, hoverRow, rows, grid, onHover]);

  // ⚠ A DRAWN SCROLLBAR. macOS overlays its own and hides them at rest, so without this nothing
  // says there are more threads off to the side.
  const maxScroll = Math.max(0, contentW - viewW);
  const thumbPct = contentW > 0 ? Math.min(100, (viewW / contentW) * 100) : 100;
  const thumbLeft = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - thumbPct) : 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (el === null) return;
    const measure = () => setViewW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dragThumb = (e: JSX.TargetedPointerEvent<HTMLDivElement>) => {
    const track = e.currentTarget.parentElement;
    if (track === null || maxScroll <= 0) return;
    const startX = e.clientX;
    const start = scrollRef.current?.scrollLeft ?? 0;
    const ratio = contentW / track.clientWidth;
    const move = (ev: PointerEvent) => {
      if (scrollRef.current !== null) {
        scrollRef.current.scrollLeft = start + (ev.clientX - startX) * ratio;
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div class={`trame trame-${orient}`}>
      {orient === 'v' && maxScroll > 0 && (
        <div class="tr-cbar">
          <div class="tr-cbar-track">
            <div
              class="tr-cbar-thumb"
              style={{ left: `${thumbLeft}%`, width: `${thumbPct}%` }}
              onPointerDown={dragThumb}
            />
          </div>
        </div>
      )}
      <div
        ref={scrollRef}
        class="tr-scroll"
        onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}
      >
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: a canvas heatmap has no per-cell node to focus; the thread list beside it is the keyboard path to the same data (cf. this file's header). */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: same. */}
        <div
          ref={wrapRef}
          class={`tr-stage ${hoverRow !== null ? 'on-row' : ''}`}
          style={
            orient === 'v'
              ? { width: `${contentW}px`, height: `${contentH}px` }
              : { height: `${contentH}px` }
          }
          onPointerMove={(e) => {
            setHover(pick(e));
            setHoverRow(pickRow(e));
          }}
          onPointerLeave={() => {
            setHover(null);
            setHoverRow(null);
          }}
          onClick={(e) => {
            const r = pickRow(e);
            const conv = r === null ? undefined : rows[r];
            if (conv !== undefined) onSelect(conv);
          }}
        >
          {/* ⚠ THE BOX IS SET HERE, the pixels in `draw()`. Sizing it only from the effect left it
              carrying the previous orientation's box until the next paint — a 3 776 px canvas inside
              a 1 180 px scroller, whose right-hand columns nothing could reach. Declared with the
              markup, the box can never lag the orientation it belongs to. */}
          <canvas
            ref={canvasRef}
            style={
              orient === 'v'
                ? { width: `${contentW}px`, height: `${contentH}px` }
                : { width: '100%', height: `${contentH}px` }
            }
          />
        </div>
      </div>
    </div>
  );
}
