// « THE TIME WHEEL » — what replaced a play button and a slider.
//
// The player had two problems. You had to WAIT to see (and wait again to see it once more), and a
// native slider says nothing about the data: you could not tell where the loaded periods were, so
// where it was worth stopping.
//
// The wheel is a DENSE band: it draws the number of points per month. You read at a glance where the
// life happened, and you move there directly — drag, mouse wheel, or arrow keys. Going forward and
// going back cost the same gesture, which was not true of a playback.
//
// It sits INSIDE the map rather than under it: time is a dimension of the map, not a setting beside
// it.
//
// ─── ⚠ WHAT THIS CONTROL DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT DOES NOT FILTER ANYTHING. It reports a timestamp; what that hides or reveals is the
//     caller's business. Two pieces use it and they cut differently;
//   - IT IS NOT REACHABLE CELL BY CELL. The band is a canvas, so a screen reader gets the slider
//     role, its bounds and its value — the month readout beside it is the accessible reading, and
//     the individual months are not announced;
//   - IT DOES NOT SAY WHAT A MONTH CONTAINS. Height is a count on a square-root scale, nothing more.
//     A peak month is taller, never labelled.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { UI_IG_CONTROLS } from '../copy.instagram';
import { monthYear } from './dates';
import { DATA } from './tokens';
import './timewheel.css';

/** Month key, for callers that bucket by month — `2024-03`. */
export const monthKey = (sec: number) => new Date(sec * 1000).toISOString().slice(0, 7);

export function TimeWheel({
  from,
  to,
  value,
  timestamps,
  onChange,
}: {
  from: number;
  to: number;
  value: number;
  /** Timestamps of ALL the points: they are what gives the band its relief. */
  timestamps: readonly number[];
  onChange: (v: number) => void;
}) {
  const t = UI_IG_CONTROLS;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);

  /** Monthly density, on a SQUARE-ROOT scale: without it one peak month flattens all the others. */
  const density = useMemo(() => {
    if (to <= from) return { bins: [] as number[], peak: 1 };
    const months = Math.max(1, Math.round((to - from) / (30.44 * 86_400)) + 1);
    const bins = new Array<number>(months).fill(0);
    for (const ts of timestamps) {
      const i = Math.floor(((ts - from) / (to - from)) * (months - 1));
      if (i >= 0 && i < months) bins[i] = (bins[i] ?? 0) + 1;
    }
    return { bins, peak: Math.max(1, ...bins) };
  }, [timestamps, from, to]);

  const frac = to > from ? (value - from) / (to - from) : 0;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (wrap === null || canvas === null) return;

    const draw = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx === null) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const n = density.bins.length;
      if (n === 0) return;
      const bw = w / n;
      const head = frac * w;

      // ⚠ THE TINTS ARE READ AT PAINT TIME, from the stylesheet. The prototype wrote a third cyan
      // (#7fc6d8) and a third vermilion (#ff4a2e) here — neighbours of the product's colours without
      // being them, which is the kind of drift you only notice by changing page.
      const cool = DATA.cyan();
      const stamp = DATA.orange();
      const muted = DATA.muted();

      for (let i = 0; i < n; i++) {
        const v = Math.sqrt((density.bins[i] ?? 0) / density.peak);
        const bh = Math.max(1, v * (h - 12));
        const x = i * bw;
        // Before the playhead: the logins' colour. After: dimmed. So the band ALSO says what is
        // revealed, without a second legend.
        ctx.globalAlpha = x + bw / 2 <= head ? 0.85 : 0.16;
        ctx.fillStyle = cool;
        ctx.fillRect(x, h - 8 - bh, Math.max(1, bw - 0.6), bh);
      }
      ctx.globalAlpha = 1;

      // Years.
      ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      let lastYear = '';
      for (let i = 0; i < n; i++) {
        const ts = from + ((to - from) * i) / Math.max(1, n - 1);
        const y = new Date(ts * 1000).getFullYear().toString();
        if (y !== lastYear && i * bw > 18) {
          lastYear = y;
          ctx.globalAlpha = 0.55;
          ctx.fillStyle = muted;
          ctx.fillRect(i * bw, h - 8, 1, 5);
          ctx.globalAlpha = 1;
          // Every other year when the band is dense: labels that collide read as one long smear.
          if (n < 40 || Number(y) % 2 === 0) ctx.fillText(y, i * bw, h - 0.5);
        }
      }

      // The playhead.
      ctx.strokeStyle = stamp;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(head, 2);
      ctx.lineTo(head, h - 8);
      ctx.stroke();
      ctx.fillStyle = stamp;
      ctx.beginPath();
      ctx.arc(head, 4, 3.4, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [density, frac, from, to]);

  const seek = (clientX: number) => {
    const wrap = wrapRef.current;
    if (wrap === null) return;
    const r = wrap.getBoundingClientRect();
    const f = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    onChange(Math.round(from + (to - from) * f));
  };

  const step = (dir: number) => {
    const oneMonth = 30.44 * 86_400;
    onChange(Math.max(from, Math.min(to, value + dir * oneMonth)));
  };

  return (
    <div class="tw">
      <div
        ref={wrapRef}
        class={`tw-band ${dragging ? 'dragging' : ''}`}
        role="slider"
        tabIndex={0}
        aria-valuemin={from}
        aria-valuemax={to}
        aria-valuenow={value}
        aria-valuetext={monthYear(value)}
        aria-label={t.wheelLabel}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          seek(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging) seek(e.clientX);
        }}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
          setDragging(false);
        }}
        // The mouse wheel does what its name promises: forward and back.
        onWheel={(e) => step(Math.sign(e.deltaY !== 0 ? e.deltaY : e.deltaX))}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          else if (e.key === 'ArrowLeft') step(-1);
          else if (e.key === 'Home') onChange(from);
          else if (e.key === 'End') onChange(to);
          else return;
          e.preventDefault();
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      <div class="tw-side">
        <button type="button" class="tw-step" onClick={() => step(-1)} aria-label={t.wheelPrev}>
          ←
        </button>
        <span class="tw-date tnum">{monthYear(value)}</span>
        <button type="button" class="tw-step" onClick={() => step(1)} aria-label={t.wheelNext}>
          →
        </button>
      </div>
    </div>
  );
}
