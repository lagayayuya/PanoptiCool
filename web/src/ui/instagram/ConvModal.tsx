// ONE THREAD, OPENED — its measures, its files, or the conversation itself.
//
// ⚠ THREE VIEWS OF ONE OBJECT, and they are not three screens. « La fiche » measures, « la
// conversation » shows, and the files sit inside the fiche because they ARE a measure: what you sent
// each other, made visible. The reader is separate because it is the only one that reads content.
//
// ⚠ THE THREAD IS READ ON DEMAND. Opening this panel must not pull twelve years off the archive
// before anyone has asked to read them — the fiche is built entirely from the report.
//
// ─── ⚠ WHAT THIS PANEL DOES NOT DO ──────────────────────────────────────────────────────────────
//   - IT DOES NOT SHOW WHO REACTED. The export gives the emoji and the count, never the author;
//   - IT DOES NOT NAME THE OTHER PERSON beyond the thread's own title — which is the platform's
//     label, not a name anyone chose to give this interface;
//   - IT KEEPS NOTHING. Closing it drops the read thread and revokes every media handle.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ReadThread, ResolveMedia } from '../../engine/instagram/connector';
import type { ConversationSummary } from '../../engine/instagram/conversations';
import type { UniverseItem, UniverseKind } from '../../engine/instagram/universe';
import { UI_IG_MESSAGES } from '../copy.instagram';
import { formatInt, TAG } from '../format';
import { ConvReader } from './ConvReader';
import { dayMonthYear, monthYear } from './dates';
import { MediaViewer, type ViewerItem } from './MediaViewer';
import { loadImageThumb, loadVideoPoster } from './media-thumb';
import { DATA } from './tokens';

type View = 'fiche' | 'fil';

const KIND_LABEL: Record<UniverseKind, () => string> = {
  photo: () => UI_IG_MESSAGES.panel.filePhotos,
  video: () => UI_IG_MESSAGES.panel.fileVideos,
  audio: () => UI_IG_MESSAGES.panel.fileAudio,
};

/** The short month a thumbnail is tagged with — « juin », not « juin 2024 ». */
const shortMonth = (sec: number) =>
  new Date(sec * 1000).toLocaleDateString(TAG, { month: 'short' });

/** Minutes as a reader thinks of them. */
function fmtMin(min: number): string {
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  return `${h} h ${String(Math.round(min % 60)).padStart(2, '0')}`;
}

function fmtHours(sec: number): string {
  const min = Math.round(sec / 60);
  return min < 60 ? `${min} min` : `${Math.round(min / 60)} h`;
}

/** Every month between two, gaps included — a silence must occupy width, not be skipped. */
function monthRange(fromTs: number, toTs: number): string[] {
  const out: string[] = [];
  const d = new Date(fromTs * 1000);
  d.setDate(1);
  const end = new Date(toTs * 1000);
  while (
    d.getFullYear() < end.getFullYear() ||
    (d.getFullYear() === end.getFullYear() && d.getMonth() <= end.getMonth())
  ) {
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    d.setMonth(d.getMonth() + 1);
  }
  return out;
}

/** « 6 ans et 3 mois » — the span a relationship covers, not a pair of dates. */
function fmtSpan(fromTs: number, toTs: number): string {
  const months = Math.max(1, Math.round((toTs - fromTs) / (30.44 * 86_400)));
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mois`;
  return m === 0 ? `${y} ans` : `${y} ans et ${m} mois`;
}

export function ConvModal({
  conv,
  self,
  media,
  readThread,
  resolveMedia,
  onClose,
}: {
  conv: ConversationSummary;
  self: string;
  /** This thread's media, already indexed by the piece — the panel filters, it does not search. */
  media: readonly UniverseItem[];
  readThread: ReadThread | undefined;
  resolveMedia: ResolveMedia | undefined;
  onClose: () => void;
}) {
  const t = UI_IG_MESSAGES.panel;
  const [view, setView] = useState<View>('fiche');
  const [viewer, setViewer] = useState<ViewerItem | null>(null);
  const [kindFilter, setKindFilter] = useState<UniverseKind | null>(null);
  const sparkRef = useRef<HTMLCanvasElement>(null);
  const shownMedia = kindFilter === null ? media : media.filter((m) => m.kind === kindFilter);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // ⚠ THE MONTHS WITHOUT A MESSAGE TAKE THEIR WIDTH. Drawing only the months present would compress
  // a two-year silence into nothing and turn an interrupted thread into a continuous one.
  /**
   * ⚠ LARGEUR MESURÉE, jamais fixée. Elle valait 420 px en dur : dans une modale qui en fait
   * plus de 800, la frise restait tassée contre le bord gauche et les deux tiers droits du
   * bloc étaient vides — un graphique qui n'occupe pas sa boîte se lit comme une erreur de
   * rendu. Un `ResizeObserver` la redessine à chaque changement de largeur (ouverture,
   * rotation, plein écran).
   */
  useEffect(() => {
    const canvas = sparkRef.current;
    if (canvas === null || conv.monthly.length === 0) return;
    const host = canvas.parentElement;
    if (host === null) return;

    const draw = () => {
      const W = host.clientWidth;
      if (W === 0) return;
      const dpr = window.devicePixelRatio || 1;
      const H = 56;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      const ctx = canvas.getContext('2d');
      if (ctx === null) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const first = conv.monthly[0];
      const last = conv.monthly[conv.monthly.length - 1];
      if (first === undefined || last === undefined) return;
      const span = monthRange(
        new Date(`${first.ym}-01`).getTime() / 1000,
        new Date(`${last.ym}-01`).getTime() / 1000,
      );
      const idx = new Map(span.map((m, i) => [m, i]));
      const max = Math.max(1, ...conv.monthly.map((m) => m.count));
      const bw = W / span.length;
      ctx.fillStyle = conv.isGroup ? DATA.orange() : DATA.cyan();
      ctx.globalAlpha = 0.9;
      for (const m of conv.monthly) {
        const i = idx.get(m.ym);
        if (i === undefined) continue;
        const h = Math.max(2, (m.count / max) * (H - 4));
        ctx.fillRect(i * bw, H - h, Math.max(bw - 0.6, 1), h);
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(host);
    return () => ro.disconnect();
  }, [conv]);

  const pctSelf = conv.messages > 0 ? Math.round((conv.sentBySelf / conv.messages) * 100) : 0;
  const span =
    conv.firstTs !== null && conv.lastTs !== null ? fmtSpan(conv.firstTs, conv.lastTs) : '';
  const otherLabel = conv.isGroup ? UI_IG_MESSAGES.tablePeopleShort : conv.title;

  /**
   * ⚠ DIVERGING ROWS, not two columns of numbers. The middle is the axis and each side pulls its
   * own way; two columns asked for a mental subtraction to answer the only question posed.
   */
  const rows = useMemo(() => {
    const L = UI_IG_MESSAGES.contentLabels;
    const out = [
      { label: L.audio, self: conv.typesSelf.audio, other: conv.typesOthers.audio },
      { label: L.photos, self: conv.typesSelf.photos, other: conv.typesOthers.photos },
      { label: L.videos, self: conv.typesSelf.videos, other: conv.typesOthers.videos },
      { label: L.shares, self: conv.typesSelf.shares, other: conv.typesOthers.shares },
      { label: t.reactions, self: conv.reactionsGiven, other: conv.reactionsReceived },
    ];
    return out.filter((r) => r.self > 0 || r.other > 0);
  }, [conv, t]);
  const rowMax = Math.max(1, ...rows.map((r) => Math.max(r.self, r.other)));

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: a closing backdrop — Escape and the ✕ are
    // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard paths, both above.
    <div class="modal-backdrop" onClick={onClose}>
      {/* The card carries `role="dialog"`, so it is not a static element; its click only stops
          propagation so a click inside does not reach the closing backdrop.
          biome-ignore lint/a11y/useKeyWithClickEvents: see above. */}
      <div
        class="modal-card conv-modal"
        role="dialog"
        aria-modal="true"
        aria-label={conv.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" class="modal-close" aria-label={t.close} onClick={onClose}>
          ×
        </button>
        <div class="modal-id">
          <span class="modal-pseudo">{conv.title}</span>
        </div>
        <div class="conv-meta tnum">
          {t.meta(
            conv.isGroup ? t.kindGroup(formatInt(conv.participants)) : t.kindSolo,
            conv.firstTs === null ? '?' : monthYear(conv.firstTs),
            conv.lastTs === null ? '?' : monthYear(conv.lastTs),
          )}
        </div>

        <div class="cm-views">
          {(
            [
              ['fiche', t.viewFiche],
              ['fil', t.viewThread],
            ] as Array<[View, string]>
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              class={`cm-view ${view === v ? 'on' : ''}`}
              aria-pressed={view === v}
              onClick={() => setView(v)}
            >
              {label}
            </button>
          ))}
        </div>

        {view === 'fil' && (
          <ConvReader
            threadId={conv.id}
            selfName={self}
            readThread={readThread}
            resolveMedia={resolveMedia}
            onOpenMedia={setViewer}
          />
        )}

        {view === 'fiche' && (
          <>
            {conv.isGroup && conv.memberNames.length > 0 && (
              <div class="conv-members">
                {conv.memberNames.map((n) => (
                  <span key={n} class="member-chip">
                    {n}
                  </span>
                ))}
              </div>
            )}

            {/* ⚠ ONE FIGURE DOMINATES, the others surround it. The four values used to carry the
                same typographic weight: you could not tell which to read first, and « 0 min · 4
                appels » announced a null duration as though it were the notable fact. The message
                count is the measure of the relationship; the rest qualifies it. */}
            <div class="conv-hero">
              <div class="ch-main">
                <span class="ch-n tnum">{formatInt(conv.messages)}</span>
                <span class="ch-unit">{span === '' ? t.messages : t.messagesIn(span)}</span>
              </div>
              <div class="ch-side">
                {conv.medianReplySelfMin !== null && conv.medianReplyOtherMin !== null && (
                  <div class="ch-fact">
                    <span class="ch-fact-v tnum">
                      <b style={{ color: DATA.cyan() }}>{fmtMin(conv.medianReplySelfMin)}</b>
                      <span class="ch-vs">{t.versus}</span>
                      <b style={{ color: DATA.orange() }}>{fmtMin(conv.medianReplyOtherMin)}</b>
                    </span>
                    {/* The two medians side by side: apart, they had to be compared from memory. */}
                    <span class="ch-fact-k">{t.replyMedian}</span>
                  </div>
                )}
                {conv.types.calls > 0 && (
                  <div class="ch-fact">
                    <span class="ch-fact-v tnum">{formatInt(conv.types.calls)}</span>
                    <span class="ch-fact-k">
                      {/* The duration is announced only when the export gives one: « 0 min » made
                          instant calls of a missing measurement. */}
                      {conv.types.callSeconds > 0
                        ? t.calls(fmtHours(conv.types.callSeconds))
                        : t.callsNoDuration}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ⚠ THE BALANCE CARRIES ITS FIGURES INSIDE THE BAR. A ribbon topped by two legends made
                you travel between a colour and a name to answer the only question asked. */}
            <div class="balance">
              <span class="mini-h">{t.whoWrites}</span>
              <div
                class="balance-track"
                role="img"
                aria-label={`${t.you} ${pctSelf} %, ${otherLabel} ${100 - pctSelf} %`}
              >
                <div class="bal-side bal-self" style={{ width: `${pctSelf}%` }}>
                  <span class="bal-who">{t.you}</span>
                  <span class="bal-n tnum">
                    {formatInt(conv.sentBySelf)} · {pctSelf} %
                  </span>
                </div>
                <div class="bal-side bal-other" style={{ width: `${100 - pctSelf}%` }}>
                  <span class="bal-who">{otherLabel}</span>
                  <span class="bal-n tnum">
                    {formatInt(conv.received)} · {100 - pctSelf} %
                  </span>
                </div>
              </div>
            </div>

            {rows.length > 0 && (
              <div class="who-sends">
                <span class="mini-h">{t.whatSent}</span>
                <div class="ws-list">
                  {rows.map((r) => (
                    <div key={r.label} class="ws-row">
                      <span class="ws-label">{r.label}</span>
                      <span class="ws-n ws-n-self tnum">{formatInt(r.self)}</span>
                      <span class="ws-bar ws-bar-self">
                        <i
                          style={{
                            width: `${(r.self / rowMax) * 100}%`,
                            background: DATA.cyan(),
                          }}
                        />
                      </span>
                      <span class="ws-bar">
                        <i
                          style={{
                            width: `${(r.other / rowMax) * 100}%`,
                            background: DATA.orange(),
                          }}
                        />
                      </span>
                      <span class="ws-n tnum">{formatInt(r.other)}</span>
                    </div>
                  ))}
                </div>

                {media.length > 0 && (
                  <>
                    {/* ⚠ THE SELECTOR IS NAMED AND CARRIES ITS COUNTS: you see what you can ask for
                        and what it will give, before clicking. */}
                    <div class="ws-sheet-head">
                      <span class="ws-sheet-k">{t.seeFiles}</span>
                      <div class="ws-chips">
                        <button
                          type="button"
                          class={`ws-chip ${kindFilter === null ? 'on' : ''}`}
                          aria-pressed={kindFilter === null}
                          onClick={() => setKindFilter(null)}
                        >
                          {t.fileAll} <b class="tnum">{formatInt(media.length)}</b>
                        </button>
                        {(['photo', 'video', 'audio'] as UniverseKind[])
                          .map((k) => ({ k, n: media.filter((m) => m.kind === k).length }))
                          // A kind absent from the thread gets no chip: offering « videos 0 » is a
                          // command you already know returns nothing.
                          .filter(({ n }) => n > 0)
                          .map(({ k, n }) => (
                            <button
                              key={k}
                              type="button"
                              class={`ws-chip ${kindFilter === k ? 'on' : ''}`}
                              aria-pressed={kindFilter === k}
                              onClick={() => setKindFilter(k)}
                            >
                              {KIND_LABEL[k]()} <b class="tnum">{formatInt(n)}</b>
                            </button>
                          ))}
                      </div>
                    </div>
                    <ConvMediaPlate
                      items={shownMedia}
                      resolveMedia={resolveMedia}
                      onOpen={setViewer}
                    />
                  </>
                )}
              </div>
            )}

            {conv.monthly.length > 1 && (
              <div class="conv-spark">
                <span class="mini-h">
                  {t.rhythm(
                    conv.firstTs === null ? '' : dayMonthYear(conv.firstTs),
                    conv.lastTs === null ? '' : dayMonthYear(conv.lastTs),
                  )}
                </span>
                {/* A drawing, and every figure it summarises is written above it. */}
                <canvas ref={sparkRef} />
              </div>
            )}
          </>
        )}
      </div>

      {viewer !== null && (
        <MediaViewer
          item={viewer}
          media={resolveMedia ?? (async () => null)}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
}

/**
 * ————— THE THREAD'S PLATE —————
 *
 * ⚠ THE MONTH IS A THUMBNAIL TAG, not a section title, and the year is the only separator. Stacking
 * year → month → thumbnails gave two photos from June the same height as twenty, and a forty-media
 * thread unrolled a page of headings for three images. Same grammar as the media universe's plate.
 */
function ConvMediaPlate({
  items,
  resolveMedia,
  onOpen,
}: {
  items: readonly UniverseItem[];
  resolveMedia: ResolveMedia | undefined;
  onOpen: (v: ViewerItem) => void;
}) {
  const years = useMemo(() => {
    const out: Array<{ year: number; items: UniverseItem[] }> = [];
    for (const it of [...items].sort((a, b) => a.ts - b.ts)) {
      const y = new Date(it.ts * 1000).getFullYear();
      const last = out[out.length - 1];
      if (last !== undefined && last.year === y) last.items.push(it);
      else out.push({ year: y, items: [it] });
    }
    return out;
  }, [items]);

  if (items.length === 0) return <p class="cm-empty">{UI_IG_MESSAGES.panel.noFiles}</p>;

  return (
    <div class="conv-media">
      {years.map((yg) => (
        <div key={yg.year} class="cm-year">
          <div class="cm-year-label tnum">
            {yg.year}
            <span class="cm-year-n">{formatInt(yg.items.length)}</span>
          </div>
          <div class="cm-thumbs">
            {yg.items.map((it) => (
              <ConvThumb key={it.path} item={it} resolveMedia={resolveMedia} onOpen={onOpen} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** One thumbnail, decoded when it enters the viewport: a photo, a video's poster, or an audio orb. */
function ConvThumb({
  item,
  resolveMedia,
  onOpen,
}: {
  item: UniverseItem;
  resolveMedia: ResolveMedia | undefined;
  onOpen: (v: ViewerItem) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null || item.kind === 'audio' || resolveMedia === undefined) return;
    let alive = true;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        void (async () => {
          const bytes = await resolveMedia(item.path);
          if (bytes === null || !alive) return;
          // ⚠ THE URL IS REVOKED AS SOON AS THE CANVAS HOLDS THE PIXELS. A plate of two hundred
          // thumbnails that kept its handles would pin that much of the archive in memory.
          const url = URL.createObjectURL(new Blob([bytes.slice().buffer]));
          try {
            const canvas = isVideo ? await loadVideoPoster(url) : await loadImageThumb(url);
            if (alive) setThumb(canvas.toDataURL('image/jpeg', 0.7));
          } catch {
            // A media the browser cannot decode leaves the placeholder in place.
          } finally {
            URL.revokeObjectURL(url);
            if (alive) setSettled(true);
          }
        })();
      },
      { rootMargin: '120px' },
    );
    io.observe(el);
    return () => {
      alive = false;
      io.disconnect();
    };
  }, [item, resolveMedia]);

  const open = () =>
    onOpen({
      path: item.path,
      kind: item.kind,
      title: dayMonthYear(item.ts),
      subtitle: item.convTitle ?? '',
    });
  const title = `${KIND_LABEL[item.kind]()} · ${dayMonthYear(item.ts)}`;
  const isVideo = item.kind === 'video';

  if (item.kind === 'audio') {
    return (
      <button type="button" class="cm-thumb cm-audio" onClick={open} title={title}>
        <span class="cm-audio-orb" />
        <span class="cm-month-tag">{shortMonth(item.ts)}</span>
      </button>
    );
  }
  return (
    <button
      ref={ref}
      type="button"
      class={`cm-thumb ${isVideo ? 'cm-video' : ''}`}
      onClick={open}
      title={title}
    >
      {thumb === null ? (
        <span class={`cm-ph ${settled ? '' : 'loading'}`} />
      ) : (
        <img src={thumb} alt="" />
      )}
      {isVideo && thumb !== null && <span class="cm-play">▶</span>}
      <span class="cm-month-tag">{shortMonth(item.ts)}</span>
    </button>
  );
}
