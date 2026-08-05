// THE MEDIA VIEWER — one photo, video or voice note, centred, shared by the pieces that show media.
//
// ⚠ IT TAKES BYTES AND MAKES ITS OWN URL, where the prototype was handed a URL already made. Not a
// detail: an object URL is a document-lifetime handle, and a resolver that mints one per media leaks
// the whole export into memory over a browsing session. Here the URL lives exactly as long as the
// viewer showing it and is revoked on the way out — which is also why the resolver upstream is
// deliberately uncached (`connector.ts`).
//
// It is PORTALLED, so it escapes transformed ancestors — a 3D scene sets `transform` on its
// container, and a `position: fixed` child inside one is positioned against that container rather
// than the viewport.
//
// ─── ⚠ WHAT THIS COMPONENT DOES NOT DO ──────────────────────────────────────────────────────────
//   - IT DOES NOT BROWSE. One item, opened and closed. Stepping through a set is the caller's
//     business, and the callers do not agree on what « next » means;
//   - IT DOES NOT DECIDE WHAT A FILE IS. The kind is passed in — an export declares no media type,
//     so the extension is the only source and `dates.ts` holds that single rule;
//   - IT DOES NOT SURVIVE A HOST CHANGE INTACT. Entering or leaving native fullscreen moves the
//     portal, which remounts the subtree: a playing video restarts. That is the price of a
//     fullscreen round trip, and it is paid nowhere else;
//
// ⚠ THE DOWNLOAD BUTTON IS PART OF THE DESIGN, and removing it was mine to undo rather than to
// decide: « the file is already on their disk » is true of the ARCHIVE and useless of one media
// inside it, which is precisely what someone wants to keep. It writes only where the browser's own
// download flow puts it.

import { createPortal } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import type { ResolveMedia } from '../../engine/instagram/connector';
import { UI_IG_CONTROLS } from '../copy.instagram';
import { usePortalHost } from './portal-host';
import './media-viewer.css';

export type ViewerKind = 'photo' | 'video' | 'audio';

export interface ViewerItem {
  readonly path: string;
  readonly kind: ViewerKind;
  readonly title?: string;
  readonly subtitle?: string;
}

export function MediaViewer({
  item,
  media,
  onClose,
}: {
  item: ViewerItem;
  media: ResolveMedia;
  onClose: () => void;
}) {
  const t = UI_IG_CONTROLS;
  const host = usePortalHost();
  const [url, setUrl] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setUrl(null);
    setBroken(false);
    let alive = true;
    let made: string | null = null;
    void media(item.path).then((bytes) => {
      if (!alive) return;
      if (bytes === null) {
        setBroken(true);
        return;
      }
      // A fresh copy of the buffer: the resolver may return a view onto a larger one, and `Blob`
      // would then keep that whole buffer alive for as long as the URL exists.
      made = URL.createObjectURL(new Blob([bytes.slice().buffer]));
      setUrl(made);
    });
    return () => {
      alive = false;
      // ⚠ REVOKED HERE, and nowhere else. Without this every media ever opened stays in memory until
      // the tab closes — on an export with thousands of files, that is the whole archive.
      if (made !== null) URL.revokeObjectURL(made);
    };
  }, [item.path, media]);

  const download = () => {
    if (url === null) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = item.path.split('/').pop() ?? 'media';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (host === null) return null;

  return createPortal(
    /**
     * ⚠ THE CLOSING CLICK DOES NOT BUBBLE. The viewer can be opened from inside a panel: without
     * this barrier the same click closed the viewer AND the panel that opened it, sending you back
     * to the page in one gesture. A click outside the viewer must return you to what was behind it,
     * not sweep everything away.
     */
    // A backdrop, not a control: Escape and the ✕ below are the keyboard paths.
    // biome-ignore lint/a11y/noStaticElementInteractions: see above.
    // biome-ignore lint/a11y/useKeyWithClickEvents: see above.
    <div
      class="mv-backdrop"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      {/* The card only stops propagation.
          biome-ignore lint/a11y/noStaticElementInteractions: see above. */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: see above. */}
      <div class="mv-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" class="mv-close" onClick={onClose} aria-label={t.viewerClose}>
          ×
        </button>

        {/* A click on the stage, around the media, closes too — like the ✕ and the backdrop. */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: see above. */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: see above. */}
        <div
          class="mv-stage"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          {broken && <div class="mv-empty">{t.viewerMissing}</div>}
          {!broken && url === null && <div class="mv-empty mv-loading">{t.viewerLoading}</div>}
          {!broken && url !== null && item.kind === 'photo' && (
            <img src={url} alt={item.title ?? ''} onError={() => setBroken(true)} />
          )}
          {!broken && url !== null && item.kind === 'video' && (
            // biome-ignore lint/a11y/useMediaCaption: an export ships no caption track.
            <video
              src={url}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              onError={() => setBroken(true)}
            />
          )}
          {!broken && url !== null && item.kind === 'audio' && (
            // Keeps the player's own clicks off the closing stage behind it.
            // biome-ignore lint/a11y/noStaticElementInteractions: see above.
            // biome-ignore lint/a11y/useKeyWithClickEvents: see above.
            <div class="mv-audio" onClick={(e) => e.stopPropagation()}>
              <div class="mv-audio-orb" />
              {/* biome-ignore lint/a11y/useMediaCaption: same — a voice note carries no track. */}
              <audio src={url} controls autoPlay onError={() => setBroken(true)} />
            </div>
          )}
        </div>

        <div class="mv-bar">
          <div class="mv-meta">
            {item.title !== undefined && <span class="mv-title">{item.title}</span>}
            {item.subtitle !== undefined && <span class="mv-sub tnum">{item.subtitle}</span>}
          </div>
          <button
            type="button"
            class="mv-dl"
            onClick={download}
            disabled={url === null}
            title={t.viewerDownload}
          >
            ↓ {t.viewerDownload}
          </button>
        </div>
      </div>
    </div>,
    host,
  );
}
