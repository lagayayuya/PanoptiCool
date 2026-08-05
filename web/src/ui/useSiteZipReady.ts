// Whether route B's archive can actually be downloaded from this page.
//
// ⚠ IT IS ASKED BECAUSE IT IS NOT ALWAYS THERE. The build refuses to write an amputated archive —
// one missing the geo databases would hand its downloader a dead map with no way to repair it after
// the fact (`integrations/site-zip.ts`) — and `astro dev` writes none at all, `astro:build:done`
// being a build hook. In both cases a download button would be a link to a 404, which is the one
// thing a page about trusting a tool cannot afford to offer.
//
// ⚠ ONE HOME FOR THE TWO CONSUMERS, and that is the whole reason this file exists. The setup
// tutorial is knowingly duplicated between `ui/v2/AiSection.tsx` and `ui/instagram/AnalyseModule.tsx`
// (yuya, 2026-08-03) — the two products do not share a report, and their AI pages do not share a
// render. What they DO share is what the commands are made of (`ai/install-help.ts`), and this
// question is of the same kind: not a rendering, a fact about the site. Wiring it into route B alone
// is exactly what happened first, and it left `/instagram` — the page whose readers need the archive
// most, since its export is the heavy one — still handing out the dead link.
//
// A `HEAD` costs no body, touches no export, and goes to this site's own origin.
//
// ─── WHAT THIS HOOK DOES NOT COVER ──────────────────────────────────────────────────────────────
//   - IT DOES NOT LOOK INSIDE. A zip that exists but is short of its geo databases answers `true`
//     here. The build is what refuses to write that file at all, and this hook trusts it — the check
//     on the CONTENT lives in `integrations/site-zip.ts`, where the content is;
//   - IT ASKS ONCE PER MOUNT, and never again. A build that happens while the page is open is not a
//     case anyone meets;
//   - IT SAYS NOTHING ABOUT WHY. `null` and `false` are all a page can know from here, which is why
//     the copy that renders the `false` states an absence and not a cause.

import { useEffect, useState } from 'preact/hooks';
import { SITE_ZIP_NAME } from '../ai/install-help';

/**
 * `null` until answered, and it is the state the download is SHOWN in: an offer withdrawn for a
 * fifth of a second on every visit reads as a bug rather than as care. Only an explicit `false`
 * hides it.
 *
 * @param active ask only while route B is on screen. Same rule the server probe follows: a request
 *   nobody asked for does not fire because a section scrolled into view.
 */
export function useSiteZipReady(active: boolean): boolean | null {
  const [ready, setReady] = useState<boolean | null>(null);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    void fetch(`/${SITE_ZIP_NAME}`, { method: 'HEAD' })
      .then((r) => {
        if (!cancelled) setReady(r.ok);
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active]);
  return ready;
}
