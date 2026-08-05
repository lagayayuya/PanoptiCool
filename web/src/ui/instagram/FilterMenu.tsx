// THE FILTER BAR'S TWO PRIMITIVES — a dropdown per axis, and an option inside it.
//
// ⚠ MENUS RATHER THAN ROWS OF PILLS, and the reason is legibility rather than fashion: five rows of
// chips, each topped by its explanatory sentence, was unreadable. Collapsed, each axis states its
// NAME and its CURRENT VALUE on one line, and the explanation lives in acting — tick another
// content and the count drops, which no sentence replaced.
//
// ⚠ AND THE SAME BAR SERVES TWO PIECES, deliberately. Conversations and interactions filter
// different things through the same grammar, so there is nothing to relearn on changing piece —
// and two bars that resemble each other and then diverge would be worse than one that is plain.
//
// ─── WHAT THESE PRIMITIVES DO NOT DO ────────────────────────────────────────────────────────────
//   - THEY HOLD NO PROSE. Labels and summaries are passed in, from the copy perimeter;
//   - THEY DO NOT KNOW WHETHER AN AXIS PARTITIONS. `multi` sets the ARIA role — `menuitemradio` or
//     `menuitemcheckbox` — because a screen reader must be told which it is, but the mutual
//     exclusion itself is the caller's state. A primitive enforcing it would decide for both pieces;
//   - THEY DO NOT TRAP FOCUS. The pop-up closes on Escape and on an outside click; arrow-key
//     navigation inside it is the browser's default over buttons, and nothing here improves on it.

import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

export function FilterMenu({
  label,
  summary,
  active,
  children,
}: {
  label: string;
  /** The axis's current value, shown collapsed — so the bar reads without being opened. */
  summary: string;
  active: boolean;
  children: ComponentChildren;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node) !== true) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // `mousedown`, not `click`: a click that starts inside the menu and ends outside — a drag on a
    // slider, a text selection — would otherwise close it mid-gesture.
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div class="fm" ref={ref}>
      <button
        type="button"
        class={`fm-btn ${active ? 'on' : ''} ${open ? 'open' : ''}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span class="fm-axis">{label}</span>
        <span class="fm-value">{summary}</span>
        <span class="fm-caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div class="fm-pop" role="menu">
          {children}
        </div>
      )}
    </div>
  );
}

export function FilterOption({
  multi,
  checked,
  count,
  color,
  disabled,
  onClick,
  children,
}: {
  /** `true` for an axis that combines, `false`/absent for one that partitions. Sets the ARIA role. */
  multi?: boolean;
  checked: boolean;
  count?: number | undefined;
  color?: string | undefined;
  disabled?: boolean;
  onClick: () => void;
  children: ComponentChildren;
}) {
  // `aria-checked` IS supported by the role this element carries — the rule reads the role
  // statically, and cannot resolve an expression.
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: the role is set below, dynamically.
    <button
      type="button"
      role={multi === true ? 'menuitemcheckbox' : 'menuitemradio'}
      aria-checked={checked}
      disabled={disabled === true}
      class={`fm-opt ${checked ? 'on' : ''} ${multi === true ? 'multi' : ''}`}
      onClick={onClick}
    >
      {/* The tint is the CONTENT TYPE's, so a colour means the same thing in the menu, on the
          thumbnails and in the counters. It is carried on the mark only when checked: an unchecked
          row of coloured boxes reads as a legend rather than as a choice. */}
      <span
        class="fm-mark"
        style={color !== undefined && checked ? { borderColor: color } : undefined}
      >
        {checked && <i style={color !== undefined ? { background: color } : undefined} />}
      </span>
      <span class="fm-opt-label">{children}</span>
      {count !== undefined && <span class="fm-opt-count tnum">{count}</span>}
    </button>
  );
}
