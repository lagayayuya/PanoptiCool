// « LA CONVERSATION » — the thread read back, from the very beginning.
//
// ————— What makes this view possible at all —————
//
// The engine keeps NO message text: it counts and it throws away. The thread is therefore re-read on
// demand, from the export's bytes, by the reader the shell holds open after the analysis. That
// separation is the reason every extractor can promise it retains no content — and it is why this
// component takes a `readThread` rather than a report.
//
// ————— Why a sliding window and not a plain scroll —————
//
// ⚠ A thread of 25 000 messages is 25 000 DOM nodes: the page freezes for seconds on opening, and
// every scroll costs. So a SLICE is rendered, and the thread grows in both directions when an edge is
// reached. It starts at the BEGINNING: that is what one comes here for — the grid and the table
// already say what is recent.
//
// ─── ⚠ WHAT THIS VIEW DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT DOES NOT SEARCH. Finding a sentence in a twelve-year thread is a real need and a different
//     component; a search box that only looked at the loaded slice would answer « not found » about
//     messages that are right there;
//   - IT DOES NOT MARK WHAT WAS READ, and keeps no position. Reopening starts at the beginning
//     again, which is honest for a view that holds nothing;
//   - ⚠ IT SHOWS NO REACTIONS AT ALL. The prototype did; the ported thread reader does not carry
//     them, because nothing else in this port reads one. They come back with the field, not before —
//     and their rules went with them rather than sitting here unused;
//   - IT PLAYS NO VOICE NOTE INLINE. A voice note opens in the viewer like any other media.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ReadThread, ResolveMedia, ThreadMessage } from '../../engine/instagram/connector';
import { UI_IG_READER } from '../copy.instagram';
import { formatInt, TAG } from '../format';
import type { ViewerItem } from './MediaViewer';
import { createMediaUrls, type MediaUrls } from './media-url';
import './conv-reader.css';

/** Messages rendered at once. The window slides; the thread is never all in the DOM. */
const PAGE = 200;

const dayLabel = (sec: number) =>
  new Date(sec * 1000).toLocaleDateString(TAG, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
const timeLabel = (sec: number) =>
  new Date(sec * 1000).toLocaleTimeString(TAG, { hour: '2-digit', minute: '2-digit' });

/** One message's media, loaded when its bubble enters the viewport. */
function Bubble({
  m,
  urls,
  onOpen,
}: {
  m: ThreadMessage;
  urls: MediaUrls;
  onOpen: (v: ViewerItem) => void;
}) {
  const t = UI_IG_READER;
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<Record<string, string>>({});

  // ⚠ LOADED ON ENTERING THE VIEWPORT, not on mount. A slice of two hundred bubbles can carry
  // hundreds of media, and reading them all up front is the freeze this window exists to avoid.
  useEffect(() => {
    const el = ref.current;
    if (el === null || m.media.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      for (const item of m.media) {
        void urls.url(item.path).then((u) => {
          if (u !== null) setLoaded((prev) => ({ ...prev, [item.path]: u }));
        });
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [m.media, urls]);

  return (
    <div ref={ref} class="cr-bubble">
      {m.text !== '' && <span class="cr-text">{m.text}</span>}

      {m.media.map((item) => {
        const url = loaded[item.path];
        return (
          <button
            key={item.path}
            type="button"
            class="cr-media"
            onClick={() =>
              onOpen({
                path: item.path,
                kind: item.kind,
                title: m.ts > 0 ? dayLabel(m.ts) : t.mediaTitle,
                subtitle: m.sender,
              })
            }
          >
            {url === undefined ? (
              <span class="cr-media-ph" />
            ) : (
              <img src={url} alt="" loading="lazy" />
            )}
            {item.kind === 'video' && <span class="cr-play">▶</span>}
          </button>
        );
      })}

      {m.share !== null && (
        <a class="cr-share" href={m.share.link} target="_blank" rel="noreferrer noopener">
          {m.share.text !== '' ? m.share.text : m.share.link}
        </a>
      )}

      {m.callSeconds !== null && (
        <span class="cr-call tnum">{t.call(String(Math.round(m.callSeconds / 60)))}</span>
      )}
      {m.unsent && <span class="cr-unsent">{t.unsent}</span>}
    </div>
  );
}

export function ConvReader({
  threadId,
  selfName,
  readThread,
  resolveMedia,
  onOpenMedia,
}: {
  threadId: string;
  /** The account holder: they are what decides which side a bubble sits on. */
  selfName: string;
  readThread: ReadThread | undefined;
  resolveMedia: ResolveMedia | undefined;
  onOpenMedia: (v: ViewerItem) => void;
}) {
  const t = UI_IG_READER;
  const [messages, setMessages] = useState<readonly ThreadMessage[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(PAGE);
  const scrollRef = useRef<HTMLDivElement>(null);

  const urls = useMemo(() => createMediaUrls(resolveMedia ?? (async () => null)), [resolveMedia]);
  useEffect(() => () => urls.revokeAll(), [urls]);

  useEffect(() => {
    if (readThread === undefined) return;
    let alive = true;
    setMessages(null);
    setFailed(false);
    setStart(0);
    setEnd(PAGE);
    void readThread(threadId)
      .then((m) => {
        if (alive) setMessages(m);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [threadId, readThread]);

  const shown = useMemo(() => messages?.slice(start, end) ?? [], [messages, start, end]);

  if (readThread === undefined) return <p class="cr-empty">{t.unavailable}</p>;
  if (failed) return <p class="cr-empty">{t.failed}</p>;
  if (messages === null) return <p class="cr-empty">{t.loading}</p>;
  if (messages.length === 0) return <p class="cr-empty">{t.empty}</p>;

  const total = messages.length;
  let lastDay = '';

  return (
    <div class="cr">
      {/* ⚠ THE WINDOW IS STATED. A view that silently showed two hundred of twenty-five thousand
          would read as the whole thread — and this is the one piece where that mistake would let
          someone conclude « that is all there was ». */}
      <div class="cr-bar tnum">
        <span>
          {t.rangeLead} <b>{formatInt(start + 1)}</b> {t.rangeTo}{' '}
          <b>{formatInt(Math.min(end, total))}</b> {t.rangeOf} {formatInt(total)}
        </span>
        {/* ⚠ TWO BUTTONS, AND THEY JUMP — they are not the pager. Moving the window by a page is
            what the two loaders inside the scroll do, at the edge where the need appears; up here,
            a « plus ancien » next to « au début » offered two answers to one question. */}
        <div class="cr-jump">
          <button
            type="button"
            onClick={() => {
              setStart(0);
              setEnd(PAGE);
              scrollRef.current?.scrollTo({ top: 0 });
            }}
          >
            {t.toStart}
          </button>
          <button
            type="button"
            onClick={() => {
              setStart(Math.max(0, total - PAGE));
              setEnd(total);
              // After a jump to the end you land AT THE BOTTOM: arriving at the top of a slice that
              // finishes on the last message reads as having missed the end.
              requestAnimationFrame(() =>
                scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }),
              );
            }}
          >
            {t.toEnd}
          </button>
        </div>
      </div>

      <div ref={scrollRef} class="cr-scroll">
        {start > 0 && (
          <button type="button" class="cr-more" onClick={() => setStart(Math.max(0, start - PAGE))}>
            {t.loadPrev(formatInt(Math.min(PAGE, start)))}
          </button>
        )}

        {shown.map((m) => {
          const day = m.ts > 0 ? dayLabel(m.ts) : '';
          const newDay = day !== '' && day !== lastDay;
          if (newDay) lastDay = day;
          // The holder's own messages sit on the right. `selfName` comes from the conversations
          // report, which infers it — not from anything the person typed here.
          const mine = m.sender === selfName;
          return (
            <div key={m.index}>
              {newDay && <div class="cr-day">{day}</div>}
              <div class={`cr-row ${mine ? 'mine' : 'theirs'}`}>
                <Bubble m={m} urls={urls} onOpen={onOpenMedia} />
                <span class="cr-meta">
                  {!mine && <b>{m.sender.split(/\s+/)[0]}</b>}
                  {m.ts > 0 && <span class="tnum">{timeLabel(m.ts)}</span>}
                </span>
              </div>
            </div>
          );
        })}

        {end < total && (
          <button type="button" class="cr-more" onClick={() => setEnd(Math.min(total, end + PAGE))}>
            {t.loadNext(formatInt(Math.min(PAGE, total - end)))}
          </button>
        )}
      </div>
    </div>
  );
}
