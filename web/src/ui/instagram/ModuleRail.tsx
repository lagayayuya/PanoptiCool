// THE CONTENTS RAIL — six pieces, each with a state.
//
// ⚠ IT SHOWS THE COMPLETE STRUCTURE FROM THE FIRST SECOND, while the engine fills one piece at a
// time. That is the point: a rail that grew as reports landed would make the dossier look like it
// was being invented, and would hide from the reader that a piece they are waiting for exists at
// all. Six entries, always; what changes is whether each is reachable.
//
// The labels name the MATTER (« Les messages ») rather than the module (« Conversations ») — the
// « Instagram Shell v4 » mockup's decision. The IDs do not follow: they address the reports.
//
// ─── WHAT THIS COMPONENT DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT DOES NOT DECIDE WHAT IS READY. The states come from the page, which knows which reports
//     have landed. A rail that inspected reports itself would duplicate that logic in a second
//     place, and the two would disagree on the day one of them changed;
//   - IT SCROLLS ITSELF INTO VIEW ON NARROW SCREENS, and nothing else moves — see the effect.

import { useEffect, useRef } from 'preact/hooks';
import { UI_IG_RAIL } from '../copy.instagram';

export type ModuleStatus = 'ready' | 'loading' | 'soon';

export function ModuleRail({
  active,
  status,
  onSelect,
}: {
  active: string;
  status: Record<string, ModuleStatus>;
  onSelect: (id: string) => void;
}) {
  const navRef = useRef<HTMLElement>(null);

  /**
   * On a narrow screen the rail is a scrolling bar, and the OPEN piece has to come to its left
   * edge — otherwise opening the last entry leaves its button off-screen and the reader loses
   * where they are.
   *
   * ⚠ TWO THINGS THAT DID NOT WORK, measured on the prototype and worth keeping written down:
   *   - `scrollIntoView({ inline: 'start' })` does exactly this framing and did NOTHING here. The
   *     piece change also scrolls the page to the top, and that concurrent scroll cancels the
   *     smooth one before it lands;
   *   - `behavior: 'smooth'` on the direct assignment only took effect on the FIRST change; later
   *     ones left the bar where it was.
   * So: the position is set directly and instantly. It is chrome — nobody watches a contents bar
   * slide.
   */
  useEffect(() => {
    const nav = navRef.current;
    if (nav === null || nav.scrollWidth <= nav.clientWidth) return;
    const item = nav.querySelector<HTMLElement>('.ig-rail-item.is-active');
    if (item === null) return;
    const gutter = Number.parseFloat(getComputedStyle(nav).paddingLeft) || 0;
    nav.scrollLeft = Math.max(0, item.offsetLeft - gutter);
  }, [active]);

  return (
    <nav ref={navRef} class="ig-rail" aria-label={UI_IG_RAIL.title}>
      <span class="ig-rail-head">{UI_IG_RAIL.title}</span>
      {UI_IG_RAIL.items.map((it) => {
        const state = status[it.id] ?? 'soon';
        const ready = state === 'ready';
        return (
          <button
            key={it.id}
            type="button"
            class={`ig-rail-item ${it.id === active ? 'is-active' : ''}`}
            // `disabled` rather than a click that does nothing: a control that looks pressable and
            // is not is worse than one that says so, and a screen reader reads the state.
            disabled={!ready}
            aria-current={it.id === active ? 'page' : undefined}
            onClick={() => ready && onSelect(it.id)}
          >
            <span class="ig-rail-index">{it.index}</span>
            <span class="ig-rail-label">{it.label}</span>
            {state === 'loading' && (
              <span class="ig-rail-state is-loading">{UI_IG_RAIL.stateLoading}</span>
            )}
            {state === 'soon' && <span class="ig-rail-state">{UI_IG_RAIL.stateSoon}</span>}
          </button>
        );
      })}
      <span class="ig-rail-note">{UI_IG_RAIL.note}</span>
    </nav>
  );
}
