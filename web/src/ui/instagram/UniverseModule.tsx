// « 05 · LES FICHIERS » — every media of the export, laid out in space.
//
// The piece answers a question no table does: how much of this is there, and when. A spiral of a few
// hundred thumbnails says « two thousand and eleven was thin, two thousand and nineteen is a wall »
// before a single figure is read.
//
// ————— The layouts, and the three that were removed —————
//
// Two survive, and they go through ONE function returning both positions AND their labels. That is
// deliberate: labels placed anywhere other than the geometry eventually lie about it.
//
// Removed after trying them: the BRAIDED HELIX (three strands, one per source — on screen three
// helices of the same radius read as one slightly denser spiral, the phase offset being invisible in
// perspective); the CALENDAR WALL (legible, but it gave up what makes this piece worth having — one
// looked at a grid rather than a space, and a grid reads better flat); and the ACCOUNT COLUMNS.
//
// ─── ⚠ WHAT THIS PIECE DOES NOT DO ──────────────────────────────────────────────────────────────
//   - IT DOES NOT SHOW EVERYTHING. A sample is drawn, and the count is written under the slider —
//     past a thousand objects nothing can be told apart, and a scene that silently truncated would
//     read as a complete archive;
//   - IT DOES NOT DECODE A VOICE NOTE. The export keeps the file, not what was said; its glyph is a
//     drawn placeholder and never a waveform of real audio;
//   - IT DOES NOT KEEP A THUMBNAIL AFTER ITS SPRITE LEAVES. Textures are disposed with the entry, and
//     the object URLs behind them are revoked with the piece;
//   - ⚠ IT DOES NOT USE GSAP, whose licence is not OSI (ADR-0005). The eight tweens it provided are
//     in `tween.ts`, whose header states the two behaviours that differ.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { UniverseItem, UniverseKind, UniverseSource } from '../../engine/instagram/universe';
import { UI_IG_MESSAGES, UI_IG_SHELL, UI_IG_UNIVERSE } from '../copy.instagram';
import { formatInt } from '../format';
import { dayMonthYear, isVideoPath } from './dates';
import { FilterMenu, FilterOption } from './FilterMenu';
import { FullscreenToggle } from './FullscreenToggle';
import { matchesPrefix, matchesTimeTs, TIME_BUCKETS, type TimeBucket } from './filters';
import type { ModuleProps } from './InstagramPage';
import { MediaViewer, type ViewerItem } from './MediaViewer';
import { MoveStick, type MoveVec } from './MoveStick';
import { loadImageThumb, loadVideoPoster } from './media-thumb';
import { createMediaUrls } from './media-url';
import { DATA, hex, SURFACE } from './tokens';
import { easeInOutCubic, easeOutBack, type TweenHandle, tweenVec3 } from './tween';
import { isTyping } from './typing';
import { UniverseTable } from './UniverseTable';
import './universe.css';

/**
 * ⚠ THE TYPE TINTS ARE THE MESSAGES PIECE'S. A voice note must be the same colour from one piece to
 * the next, or the colour stops being a vocabulary and becomes decoration.
 */
export const KIND_COLOR: Record<UniverseKind, () => string> = {
  photo: DATA.cyan,
  video: DATA.violet,
  audio: DATA.green,
};

/**
 * ⚠ THE SOURCE TINTS DO NOT OVERLAP THE TYPE TINTS. Both axes read together in one scene, and two
 * identical sets would make them inseparable — `dm` shared EXACTLY the cyan of `photo`, which was the
 * product's only ΔE 0 collision. An amber family instead, stepped rather than three identities: the
 * neighbouring steps read as an ORDER, and the label is what names the item.
 */
const SOURCE_COLOR: Record<UniverseSource, () => string> = {
  dm: DATA.amber,
  story: DATA.orange,
  post: DATA.faint,
};

type Direction = 'any' | 'self' | 'others';
const DIRECTIONS = ['any', 'self', 'others'] as const;

/** Ceilings calibrated for fluidity with static textures. Past them, nothing is distinguishable. */
const SAMPLE_DEFAULT = 300;
const SAMPLE_MAX = 1000;

// The temporal spiral's geometry.
const TURNS = 9;
const RADIUS = 300;
const HEIGHT = 760;

export type Layout = 'spiral' | 'source';
type View = 'scene' | 'fichier';

const LAYOUTS = ['spiral', 'source'] as const;

const MOVE_KEYS = new Set([
  'z',
  'q',
  's',
  'd',
  'w',
  'a',
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
]);

interface LayoutLabel {
  text: string;
  color: string;
  pos: THREE.Vector3;
  size: number;
  back: number;
}

/** Deterministic scatter, so two openings of the page give the same sky. */
function jitter(seed: number, salt: number): number {
  const x = Math.sin(seed * 91.7 + salt * 13.1) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function spiralPos(frac: number, seed: number): THREE.Vector3 {
  const angle = frac * TURNS * Math.PI * 2 + jitter(seed, 1) * 0.12;
  const r = RADIUS + jitter(seed, 2) * 60;
  const y = (frac - 0.5) * HEIGHT + jitter(seed, 3) * 22;
  return new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r);
}

/** « By source »: three spherical clouds at the vertices of a triangle. */
const CLOUD_R = 620;
const CLOUD_CENTERS: Record<UniverseSource, [number, number, number]> = {
  dm: [0, 0, CLOUD_R],
  story: [-CLOUD_R * 0.866, 0, -CLOUD_R * 0.5],
  post: [CLOUD_R * 0.866, 0, -CLOUD_R * 0.5],
};

function sourcePos(source: UniverseSource, seed: number): THREE.Vector3 {
  const [cx, cy, cz] = CLOUD_CENTERS[source];
  const u = jitter(seed * 3.1, 1);
  const v = jitter(seed * 3.1, 2);
  const w = jitter(seed * 3.1, 3);
  const len = Math.sqrt(u * u + v * v + w * w) || 1;
  const rad = 60 + Math.abs(jitter(seed * 3.1, 4)) * 150;
  return new THREE.Vector3(cx + (u / len) * rad, cy + (v / len) * rad, cz + (w / len) * rad);
}

export function computeLayout(
  layout: Layout,
  items: readonly UniverseItem[],
  range: { from: number; to: number },
  sourceLabel: Record<UniverseSource, string>,
): { positions: THREE.Vector3[]; labels: LayoutLabel[] } {
  const { from, to } = range;
  const fracOf = (ts: number) => (to > from ? (ts - from) / (to - from) : 0.5);
  const labels: LayoutLabel[] = [];

  if (layout === 'spiral') {
    const positions = items.map((it, i) => spiralPos(fracOf(it.ts), i + (it.ts % 977)));
    // ⚠ THE YEARS ON ONE VERTICAL, outside the radius. They used to follow the spiral's angle:
    // scattered all around, often behind the mass, unreadable without turning the scene.
    const y0 = new Date(from * 1000).getFullYear() + 1;
    const y1 = new Date(to * 1000).getFullYear();
    for (let y = y0; y <= y1; y++) {
      const frac = fracOf(Date.UTC(y, 0, 1) / 1000);
      if (frac < 0 || frac > 1) continue;
      labels.push({
        text: String(y),
        color: 'rgba(233,231,225,0.72)',
        pos: new THREE.Vector3(RADIUS + 210, (frac - 0.5) * HEIGHT, 0),
        size: 30,
        back: 420,
      });
    }
    return { positions, labels };
  }

  const positions = items.map((it, i) => sourcePos(it.source, i + (it.ts % 977)));
  for (const src of ['dm', 'story', 'post'] as UniverseSource[]) {
    const [cx, , cz] = CLOUD_CENTERS[src];
    labels.push({
      text: sourceLabel[src],
      color: SOURCE_COLOR[src](),
      pos: new THREE.Vector3(cx, 300, cz),
      size: 34,
      back: 620,
    });
  }
  return { positions, labels };
}

/** A per-kind placeholder — a voice note has no frame to take, so it gets a drawn silhouette. */
function makePlaceholder(kind: UniverseKind): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 96;
  c.height = 96;
  const ctx = c.getContext('2d');
  if (ctx !== null) {
    ctx.fillStyle = SURFACE.panelHi();
    ctx.beginPath();
    ctx.arc(48, 48, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = KIND_COLOR[kind]();
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle;
    if (kind === 'audio') {
      for (let i = 0; i < 5; i++) {
        const h = [14, 30, 44, 26, 16][i] ?? 20;
        ctx.fillRect(28 + i * 9, 48 - h / 2, 5, h);
      }
    } else if (kind === 'video') {
      ctx.beginPath();
      ctx.moveTo(38, 30);
      ctx.lineTo(68, 48);
      ctx.lineTo(38, 66);
      ctx.closePath();
      ctx.fill();
    }
  }
  return new THREE.CanvasTexture(c);
}

/** A text label → sprite (years, cluster names). */
function textSprite(text: string, size: number, color: string): THREE.Sprite {
  const c = document.createElement('canvas');
  // Wide: a label followed by its count goes well past 256 px, and a narrow texture truncates the
  // text without saying so.
  c.width = 512;
  c.height = 96;
  const ctx = c.getContext('2d');
  if (ctx !== null) {
    ctx.font = `${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 48);
  }
  const mat = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c),
    transparent: true,
    depthWrite: false,
  });
  const sp = new THREE.Sprite(mat);
  sp.scale.set(size * 9, size * 1.7, 1);
  return sp;
}

interface SpriteEntry {
  sprite: THREE.Sprite;
  item: UniverseItem;
  ownTexture: THREE.Texture | null;
}

function disposeEntry(e: SpriteEntry): void {
  e.ownTexture?.dispose();
  e.sprite.material.dispose();
}

interface SceneState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  /**
   * ⚠ EVERYTHING THAT TURNS LIVES IN THIS GROUP — media and markers together. One node to rotate,
   * and the markers stay welded to what they name: a year that did not follow its stratum would end
   * up pointing at the wrong turn of the spiral.
   */
  content: THREE.Group;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  raycaster: THREE.Raycaster;
  entries: SpriteEntry[];
  labelSprites: THREE.Sprite[];
  keys: Set<string>;
  placeholders: Record<UniverseKind, THREE.CanvasTexture>;
  /** Camera tweens in flight, cancelled the moment the person takes over. */
  flights: TweenHandle[];
  /** The cloud's centre and size — what the walking speed and the fog are measured against. */
  frame: { center: THREE.Vector3; extent: number };
}

export function UniverseModule({ report, resolveMedia }: ModuleProps) {
  const t = UI_IG_UNIVERSE;
  const universe = report.universe;

  const frameRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<SceneState | null>(null);
  const stickRef = useRef<MoveVec>({ x: 0, z: 0 });

  const [layout, setLayout] = useState<Layout>('spiral');
  const [kind, setKind] = useState<UniverseKind | 'all'>('all');
  const [source, setSource] = useState<UniverseSource | 'all'>('all');
  const [direction, setDirection] = useState<Direction>('any');
  const [time, setTime] = useState<TimeBucket>('any');
  const [search, setSearch] = useState('');
  const [sampleSize, setSampleSize] = useState(SAMPLE_DEFAULT);
  const [page, setPage] = useState(0);
  const [view, setView] = useState<View>('scene');
  const [viewer, setViewer] = useState<ViewerItem | null>(null);
  const [primed, setPrimed] = useState(false);
  const [learn, setLearn] = useState(false);

  const urls = useMemo(() => createMediaUrls(resolveMedia ?? (async () => null)), [resolveMedia]);
  useEffect(() => () => urls.revokeAll(), [urls]);

  const items = useMemo(() => universe?.items ?? [], [universe]);
  const nowSec = useMemo(() => Math.max(0, ...items.map((i) => i.ts)), [items]);
  const range = useMemo(() => {
    const ts = items.map((i) => i.ts).filter((x) => x > 0);
    return { from: Math.min(...ts, nowSec), to: Math.max(...ts, nowSec) };
  }, [items, nowSec]);

  const matching = useMemo(
    () =>
      items.filter(
        (it) =>
          (kind === 'all' || it.kind === kind) &&
          (source === 'all' || it.source === source) &&
          (direction === 'any' ||
            (direction === 'self' ? it.bySelf === true : it.bySelf !== true)) &&
          matchesTimeTs(it.ts, time, nowSec) &&
          (search.trim() === '' || matchesPrefix(it.convTitle ?? '', search)),
      ),
    [items, kind, source, direction, time, nowSec, search],
  );

  /**
   * ⚠ BATCHES, NOT A TRUNCATION. At most `sampleSize` particles at a time, and each batch is a
   * sub-sample SPREAD ACROSS THE SELECTION (`i % numLots`) — so the spiral stays full whichever
   * batch one is on, and paging through them eventually shows everything. Slicing the first N would
   * show only the oldest media and draw a spiral that stops halfway, which is exactly what the
   * layout exists to contradict.
   */
  const numLots = Math.max(1, Math.ceil(matching.length / sampleSize));
  const lot = Math.min(page, numLots - 1);
  const sample = useMemo(() => {
    if (numLots === 1) return matching;
    return matching.filter((_, i) => i % numLots === lot);
  }, [matching, numLots, lot]);

  const filtersActive =
    kind !== 'all' || source !== 'all' || direction !== 'any' || time !== 'any' || search !== '';

  // ⚠ BACK TO THE FIRST BATCH when the selection changes. « Batch 4 of 2 » is clamped above, but
  // landing on a batch one did not ask for reads as an empty scene with no explanation.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the query's axes, not the derived list.
  useEffect(() => {
    setPage(0);
  }, [kind, source, direction, time, search, sampleSize]);

  // ——— The scene, built once ———
  // biome-ignore lint/correctness/useExhaustiveDependencies: builds the scene once, on purpose.
  useEffect(() => {
    const mount = mountRef.current;
    if (mount === null || stRef.current !== null) return;

    // ⚠ TRANSPARENT, and that is the whole background. The scene is drawn OVER the CSS gradient of
    // `.uni-canvas` — a halo at the centre, night at the edges. Painting an opaque clear colour, as
    // this port did, hid that gradient completely and left a flat rectangle.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // The fog's density FOLLOWS the cloud's extent (set on every layout change): fixed, it was tuned
    // for the spiral and erased the columns entirely, which are four times wider.
    scene.fog = new THREE.FogExp2(hex(SURFACE.bg()), 0.00055);
    const content = new THREE.Group();
    content.name = 'content';
    scene.add(content);
    const camera = new THREE.PerspectiveCamera(55, 1, 1, 6000);
    camera.position.set(0, 120, 1150);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 3000;
    controls.minDistance = 40;
    /**
     * ⚠ ORBIT ROTATION OFF, replaced below by a real LOOK — the same gesture as the crowd's scene.
     *
     * OrbitControls' drag turns the CAMERA AROUND A FIXED POINT: on screen it is the scene that
     * pivots, not the head that turns. Zoom stays with OrbitControls, which does what one expects of
     * it.
     */
    controls.enableRotate = false;

    stRef.current = {
      renderer,
      content,
      frame: { center: new THREE.Vector3(), extent: 800 },
      scene,
      camera,
      controls,
      raycaster: new THREE.Raycaster(),
      entries: [],
      labelSprites: [],
      keys: new Set<string>(),
      placeholders: {
        photo: makePlaceholder('photo'),
        video: makePlaceholder('video'),
        audio: makePlaceholder('audio'),
      },
      flights: [],
    };

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      // ⚠ THE STYLE IS UPDATED (no third argument). It used to be `false`, which left the CSS size
      // to a rule on the canvas itself; the canvas now sits inside `.uni-canvas` rather than being
      // it, so nothing sized it and it displayed at its BUFFER size — twice the frame on a 2× screen,
      // with the scene entirely outside the visible box.
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    return () => {
      ro.disconnect();
      const st = stRef.current;
      if (st !== null) {
        for (const e of st.entries) disposeEntry(e);
        for (const p of Object.values(st.placeholders)) p.dispose();
        for (const f of st.flights) f.cancel();
        st.controls.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      stRef.current = null;
    };
  }, []);

  // ——— Population: on a filter, sample or layout change ———
  useEffect(() => {
    const st = stRef.current;
    if (st === null) return;

    const { positions, labels } = computeLayout(layout, sample, range, {
      dm: t.sourceDm,
      story: t.sourceStory,
      post: t.sourcePost,
    });

    /**
     * Entries that survive KEEP their sprite and their texture: a media still in the selection must
     * move to its new place, not be destroyed and reloaded — reloading would flash the whole scene
     * on every notch of the slider.
     *
     * ⚠ A QUEUE PER PATH, NOT ONE ENTRY PER PATH. A `Map<path, entry>` assumes a path is unique, and
     * an export can carry the same URI on several messages — a forwarded clip, a voice note sent
     * twice. The map then collapsed N sprites into one: the other N−1 were never matched, never
     * moved and never removed. They stayed frozen at their old coordinates, out of `entries` and so
     * out of the raycast — a cluster of thumbnails in the middle of the scene that survived a
     * change of layout, ignored the filters and could not be clicked. That is the bug, and it was
     * one bug wearing three costumes.
     */
    const kept = new Map<string, SpriteEntry[]>();
    for (const e of st.entries) {
      const q = kept.get(e.item.path);
      if (q === undefined) kept.set(e.item.path, [e]);
      else q.push(e);
    }
    const next: SpriteEntry[] = [];

    sample.forEach((item, i) => {
      const to = positions[i] as THREE.Vector3;
      const queue = kept.get(item.path);
      const existing = queue?.pop();
      if (existing !== undefined) {
        if (queue !== undefined && queue.length === 0) kept.delete(item.path);
        next.push(existing);
        tweenVec3(existing.sprite.position, to, { durationMs: 1100, ease: easeInOutCubic });
        return;
      }

      const mat = new THREE.SpriteMaterial({
        map: st.placeholders[item.kind],
        transparent: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.copy(to);
      sprite.scale.set(0, 0, 1);
      st.content.add(sprite);
      const entry: SpriteEntry = { sprite, item, ownTexture: null };
      next.push(entry);

      // ⚠ THE ARRIVAL OVERSHOOTS AND SETTLES, staggered by index. It is what makes a sprite look
      // placed rather than teleported — and the stagger is capped, or the last of a thousand would
      // arrive two seconds after the first.
      const s = item.kind === 'audio' ? 26 : 34;
      tweenVec3(
        sprite.scale,
        { x: s, y: s, z: 1 },
        { durationMs: 600, delayMs: Math.min(i * 2, 800), ease: easeOutBack() },
      );

      // The thumbnail replaces the placeholder once it is decoded. A media that fails keeps its
      // glyph, which is honest: a black square would look like a black photo.
      if (item.kind !== 'audio') {
        void urls.url(item.path).then(async (url) => {
          if (url === null) return;
          try {
            const canvas = isVideoPath(item.path)
              ? await loadVideoPoster(url)
              : await loadImageThumb(url);
            if (!next.includes(entry)) return;
            const tex = new THREE.CanvasTexture(canvas);
            entry.ownTexture = tex;
            mat.map = tex;
            mat.needsUpdate = true;
          } catch {
            // Keeps the placeholder.
          }
        });
      }
    });

    // Whatever is left in `kept` has left the selection — every queue, not every key.
    for (const queue of kept.values()) {
      for (const e of queue) {
        st.content.remove(e.sprite);
        disposeEntry(e);
      }
    }
    st.entries = next;

    for (const sp of st.labelSprites) {
      st.content.remove(sp);
      sp.material.map?.dispose();
      sp.material.dispose();
    }
    /**
     * ⚠ THE CENTRE IS PUT BACK IN WORLD SPACE. The positions are LOCAL to the rotating group; left
     * local, the centre would drift with the rotation, and the walking speed and the framing with
     * it.
     */
    if (positions.length > 0) {
      const box = new THREE.Box3();
      for (const p of positions) box.expandByPoint(p);
      const center = box.getCenter(new THREE.Vector3()).applyMatrix4(st.content.matrixWorld);
      const size = box.getSize(new THREE.Vector3());
      const extent = Math.max(size.x, size.y, size.z, 1);
      st.frame = { center, extent };
      // The constant gives the spiral back its original density and adapts it to the rest: fixed at
      // 0.00055 it was tuned for a 790-unit spiral, and the 3 142-unit columns came out solid fog.
      if (st.scene.fog instanceof THREE.FogExp2) st.scene.fog.density = 0.43 / extent;
      st.camera.far = Math.max(6000, extent * 3);
      st.camera.updateProjectionMatrix();
    }

    st.labelSprites = labels.map((l) => {
      const sp = textSprite(l.text, l.size, l.color);
      sp.position.copy(l.pos);
      st.content.add(sp);
      return sp;
    });
  }, [sample, layout, range, urls, t]);

  // ——— The loop ———
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const st = stRef.current;
      const mount = mountRef.current;
      // Hidden behind the table, the container has no surface. The loop stays alive — it resumes on
      // the way back — but nothing is drawn.
      if (st === null || mount === null || mount.clientWidth === 0) return;
      // ⚠ CAPPED. A tab that comes back from the background hands over a delta of several seconds,
      // and an uncapped step would teleport the camera across the cloud.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Movement translates the camera AND its orbit target by the same vector, so turning by drag
      // stays available — which suits a scene one turns around an object, where « the space » is a
      // place one walks in.
      let mx = stickRef.current.x;
      let mz = stickRef.current.z;
      if (st.keys.has('z') || st.keys.has('w') || st.keys.has('arrowup')) mz -= 1;
      if (st.keys.has('s') || st.keys.has('arrowdown')) mz += 1;
      if (st.keys.has('q') || st.keys.has('a') || st.keys.has('arrowleft')) mx -= 1;
      if (st.keys.has('d') || st.keys.has('arrowright')) mx += 1;
      if (mx !== 0 || mz !== 0) {
        // The person has taken over: any camera flight in progress stops where it is rather than
        // fighting the gesture.
        for (const f of st.flights) f.cancel();
        st.flights = [];
        const forward = new THREE.Vector3();
        st.camera.getWorldDirection(forward);
        const right = new THREE.Vector3().crossVectors(forward, st.camera.up).normalize();
        /**
         * ⚠ THE STEP IS RELATIVE TO THE CLOUD AND TO THE FRAME'S DURATION, not a constant per
         * frame. It was 14 units per frame: 840 units a second on a 60 Hz screen and 1 680 on a
         * 120 Hz one — the same key crossing the scene twice as fast on a better display, and far
         * too fast to aim at anything either way.
         *
         * 0.35 means about three seconds to cross the scene end to end. At 1.1 it took one second,
         * which the prototype records as unusable.
         */
        const reach = Math.max(
          st.camera.position.distanceTo(st.frame.center),
          st.frame.extent * 0.45,
        );
        const step = reach * 0.35 * dt;
        const delta = new THREE.Vector3()
          .addScaledVector(forward, -mz * step)
          .addScaledVector(right, mx * step);
        st.camera.position.add(delta);
        st.controls.target.add(delta);
      }

      /**
       * ⚠ THE CONTENT TURNS, NOT THE CAMERA, and it never stops.
       *
       * `OrbitControls.autoRotate` orbits the CAMERA around its target, so it had to be cut the
       * moment one took the controls — losing the overall movement at the exact instant one enters
       * the scene. Turning the media themselves leaves the camera entirely to the person.
       *
       * One turn in two minutes. ⚠ AND IT DOES NOT FREEZE WHEN A MEDIA IS OPEN (yuya's decision):
       * the prototype stops it there, on the grounds that the media one has just gone to look at
       * would drift out of frame — but the viewer covers the scene while it is open, so what one
       * actually meets on closing it is a still image that starts moving again.
       */
      st.content.rotation.y -= 0.0524 * dt;

      st.controls.update();
      st.renderer.render(st.scene, st.camera);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ——— Keyboard ———
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const st = stRef.current;
      if (st === null || isTyping()) return;
      const k = e.key.toLowerCase();
      if (MOVE_KEYS.has(k)) {
        e.preventDefault();
        st.keys.add(k);
        setPrimed(true);
      }
    };
    const up = (e: KeyboardEvent) => stRef.current?.keys.delete(e.key.toLowerCase());
    const blur = () => stRef.current?.keys.clear();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  // ——— Picking ———
  useEffect(() => {
    const mount = mountRef.current;
    if (mount === null) return;
    let downAt: { x: number; y: number } | null = null;

    const onDown = (e: PointerEvent) => {
      downAt = { x: e.clientX, y: e.clientY };
      setPrimed(true);
    };
    const onUp = (e: PointerEvent) => {
      // A click/drag threshold: without it, turning the scene opened a media.
      if (downAt === null || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) {
        downAt = null;
        return;
      }
      downAt = null;
      const st = stRef.current;
      if (st === null) return;
      const rect = mount.getBoundingClientRect();
      st.raycaster.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1,
        ),
        st.camera,
      );
      const hit = st.raycaster.intersectObjects(
        st.entries.map((x) => x.sprite),
        false,
      )[0];
      if (hit === undefined) return;
      const entry = st.entries.find((x) => x.sprite === hit.object);
      if (entry === undefined) return;

      // The camera flies to the media rather than cutting to it: a cut loses where one was.
      for (const f of st.flights) f.cancel();
      // ⚠ THE WORLD POSITION, not the sprite's own. Positions are LOCAL to the rotating group, so
      // aiming at `sprite.position` sent the camera to where the media WAS before the scene turned.
      const p = entry.sprite.getWorldPosition(new THREE.Vector3());
      const back = new THREE.Vector3()
        .subVectors(st.camera.position, p)
        .normalize()
        .multiplyScalar(150);
      st.flights = [
        tweenVec3(st.camera.position, p.clone().add(back), {
          durationMs: 1000,
          ease: easeInOutCubic,
        }),
        tweenVec3(st.controls.target, p, { durationMs: 1000, ease: easeInOutCubic }),
      ];

      setViewer({
        path: entry.item.path,
        kind: entry.item.kind === 'audio' ? 'audio' : entry.item.kind,
        title: entry.item.convTitle ?? '',
        subtitle: entry.item.ts > 0 ? dayMonthYear(entry.item.ts) : '',
      });
    };
    /**
     * THE LOOK. The TARGET turns around the camera, not the other way round: the camera does not
     * move an inch, only the aimed direction changes. That is the difference between turning your
     * head and swivelling the room.
     */
    let look: { x: number; y: number } | null = null;
    const onLookDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      look = { x: e.clientX, y: e.clientY };
    };
    const onLookMove = (e: PointerEvent) => {
      const st = stRef.current;
      if (look === null || st === null) return;
      const dx = e.clientX - look.x;
      const dy = e.clientY - look.y;
      look = { x: e.clientX, y: e.clientY };
      const fwd = st.controls.target.clone().sub(st.camera.position);
      const sph = new THREE.Spherical().setFromVector3(fwd);
      sph.theta -= dx * 0.004;
      // Tight bounds at the zenith and the nadir: at phi 0 or π the aimed direction becomes
      // collinear with the vertical axis, the azimuth stops meaning anything, and the view rolls.
      sph.phi = Math.max(0.06, Math.min(Math.PI - 0.06, sph.phi + dy * 0.004));
      st.controls.target.copy(
        st.camera.position.clone().add(new THREE.Vector3().setFromSpherical(sph)),
      );
    };
    const onLookUp = () => {
      look = null;
    };

    mount.addEventListener('pointerdown', onDown);
    mount.addEventListener('pointerup', onUp);
    mount.addEventListener('pointerdown', onLookDown);
    window.addEventListener('pointermove', onLookMove);
    window.addEventListener('pointerup', onLookUp);
    return () => {
      mount.removeEventListener('pointerdown', onDown);
      mount.removeEventListener('pointerup', onUp);
      mount.removeEventListener('pointerdown', onLookDown);
      window.removeEventListener('pointermove', onLookMove);
      window.removeEventListener('pointerup', onLookUp);
    };
  }, []);

  if (universe === undefined) return null;

  const KIND_LABEL: Record<UniverseKind, string> = {
    photo: t.kindPhoto,
    video: t.kindVideo,
    audio: t.kindAudio,
  };
  const SOURCE_LABEL: Record<UniverseSource, string> = {
    dm: t.sourceDm,
    story: t.sourceStory,
    post: t.sourcePost,
  };
  const LAYOUT_LABEL: Record<Layout, string> = {
    spiral: t.layoutSpiral,
    source: t.layoutSource,
  };

  return (
    <div class="univers">
      <section class="kit-hero">
        <h1 class="kit-h1">{t.h1}</h1>
        <p class="kit-lede">{t.lede(formatInt(items.length))}</p>
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
              <span class="learn-k">{t.learnTimeK}</span>
              <span class="learn-p">{t.learnTimeP}</span>
            </div>
            <div>
              <span class="learn-k">{t.learnKindK}</span>
              <span class="learn-p">{t.learnKindP}</span>
            </div>
            <div>
              <span class="learn-k">{t.learnLimitK}</span>
              <span class="learn-p">{t.learnLimitP}</span>
            </div>
          </div>
        </div>
      )}

      <section class="card">
        <header class="kit-head">
          <span class="card-h">{t.countFiles(formatInt(items.length))}</span>
          <span class="kit-spacer" />
          {/* ⚠ THE HEADER CARRIES THE VIEW, not the layout. « Chronologie / Sources » was up here,
              which put a setting of the DRAWING where the other pieces put the choice between the
              drawing and the table — the two selectors traded places, and the page stopped having
              one grammar. The layout moved into the bar that caps the scene, beside the density.
              biome-ignore lint/a11y/useSemanticElements: `<fieldset>` groups FORM controls; this is
              a view switch, and `role="group"` with a label is the ARIA pattern for it. */}
          <div class="vw-tabs" role="group" aria-label={t.viewGroupLabel}>
            {(
              [
                ['scene', t.viewScene],
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

        <div class="rel-controls">
          <div class="filter-menus">
            <input
              class="fm-search"
              type="search"
              placeholder={t.searchPlaceholder}
              aria-label={t.searchLabel}
              value={search}
              onInput={(e) => setSearch(e.currentTarget.value)}
            />
            <FilterMenu
              label={t.filterKind}
              summary={kind === 'all' ? t.all : KIND_LABEL[kind]}
              active={kind !== 'all'}
            >
              <FilterOption checked={kind === 'all'} onClick={() => setKind('all')}>
                {t.all}
              </FilterOption>
              {(['photo', 'video', 'audio'] as const).map((k) => (
                <FilterOption
                  key={k}
                  checked={kind === k}
                  color={KIND_COLOR[k]()}
                  count={items.filter((i) => i.kind === k).length}
                  onClick={() => setKind(k)}
                >
                  {KIND_LABEL[k]}
                </FilterOption>
              ))}
            </FilterMenu>
            <FilterMenu
              label={t.filterSource}
              summary={source === 'all' ? t.all : SOURCE_LABEL[source]}
              active={source !== 'all' || direction !== 'any'}
            >
              <FilterOption checked={source === 'all'} onClick={() => setSource('all')}>
                {t.all}
              </FilterOption>
              {(['dm', 'story', 'post'] as const).map((s) => (
                <FilterOption
                  key={s}
                  checked={source === s}
                  color={SOURCE_COLOR[s]()}
                  count={items.filter((i) => i.source === s).length}
                  onClick={() => setSource(s)}
                >
                  {SOURCE_LABEL[s]}
                </FilterOption>
              ))}
              {/* ⚠ THE DIRECTION SITS UNDER THE SOURCE, after a separator — it is not an axis of its
                own (« received » alone describes nothing), and only MESSAGES really split: a story
                or a post is yours by construction. */}
              <div class="fm-sep" />
              {DIRECTIONS.map((d) => (
                <FilterOption key={d} checked={direction === d} onClick={() => setDirection(d)}>
                  {UI_IG_MESSAGES.directionLabels[d]}
                </FilterOption>
              ))}
            </FilterMenu>
            <FilterMenu
              label={t.filterTime}
              summary={UI_IG_MESSAGES.timeLabels[time]}
              active={time !== 'any'}
            >
              {TIME_BUCKETS.map((b) => (
                <FilterOption key={b} checked={time === b} onClick={() => setTime(b)}>
                  {UI_IG_MESSAGES.timeLabels[b]}
                </FilterOption>
              ))}
            </FilterMenu>
            {filtersActive && (
              <button
                type="button"
                class="query-reset"
                onClick={() => {
                  setKind('all');
                  setSource('all');
                  setDirection('any');
                  setTime('any');
                  setSearch('');
                }}
              >
                {t.reset}
              </button>
            )}
          </div>
        </div>

        {view === 'fichier' && (
          /* ⚠ IT GETS `matching`, NOT `sample`: the batch holds a 3D scene's frame rate; a list has
             no such ceiling, and the same truncated sample here would remove this view's only
             reason to exist. */
          <UniverseTable
            items={matching}
            media={resolveMedia ?? (async () => null)}
            onOpen={(it: UniverseItem) =>
              setViewer({ path: it.path, kind: it.kind, title: dayMonthYear(it.ts) })
            }
          />
        )}

        {/**
         * ⚠ THE SCENE STAYS MOUNTED when one switches to the table — only hidden. Unmounted, the
         * effect that builds it runs once and the WebGL canvas leaves with the old node: what comes
         * back is an empty frame. Same trap, same treatment as « Les interactions ».
         *
         * Hidden it costs nothing: the render loop bails as soon as the container has no surface.
         */}
        <div class={view === 'fichier' ? 'uni-hidden' : undefined}>
          <div class="vw-block">
            <div class="vw-bar">
              <FilterMenu label={t.layoutGroupLabel} summary={LAYOUT_LABEL[layout]} active={false}>
                {LAYOUTS.map((l) => (
                  <FilterOption key={l} checked={layout === l} onClick={() => setLayout(l)}>
                    {LAYOUT_LABEL[l]}
                  </FilterOption>
                ))}
              </FilterMenu>
              <label class="kit-slider tnum">
                {t.density} <b>{formatInt(sampleSize)}</b>
                <input
                  type="range"
                  min={50}
                  max={SAMPLE_MAX}
                  step={50}
                  value={sampleSize}
                  aria-label={t.density}
                  onInput={(e) => setSampleSize(Number(e.currentTarget.value))}
                />
              </label>
              {numLots > 1 && (
                <div class="vw-pager vw-bar-right">
                  <button
                    type="button"
                    class="vw-arrow"
                    disabled={lot === 0}
                    aria-label={t.lotPrev}
                    onClick={() => setPage(lot - 1)}
                  >
                    ←
                  </button>
                  {/* The number of BATCHES, not of remaining media: in front of an arrow the only
                      question is « how many times will I click? ». */}
                  <span class="vw-range tnum">{t.lot(formatInt(lot + 1), formatInt(numLots))}</span>
                  <button
                    type="button"
                    class="vw-arrow"
                    disabled={lot === numLots - 1}
                    aria-label={t.lotNext}
                    onClick={() => setPage(lot + 1)}
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            <div ref={frameRef} class="uni-stage">
              <div ref={mountRef} class="uni-canvas" onPointerDown={() => setPrimed(true)} />
              <FullscreenToggle targetRef={frameRef} label={t.frameLabel} />
              <MoveStick vecRef={stickRef} onEngage={() => setPrimed(true)} />
              {!primed && (
                <div class="nav-veil">
                  <p class="nav-veil-title">{t.veilTitle}</p>
                  {/* Two whole lists, never interleaved — the same switch as « Les interactions »,
                      which carries the full note. */}
                  <ul class="nav-veil-keys nav-veil-mouse">
                    {t.veilMouse.map((line) => (
                      <li key={line.join('')}>
                        {line.map((seg, i) =>
                          i % 2 === 1 ? <b key={seg}>{seg}</b> : <span key={seg}>{seg}</span>,
                        )}
                      </li>
                    ))}
                  </ul>
                  <ul class="nav-veil-keys nav-veil-touch">
                    {t.veilTouch.map((line) => (
                      <li key={line.join('')}>
                        {line.map((seg, i) =>
                          i % 2 === 1 ? <b key={seg}>{seg}</b> : <span key={seg}>{seg}</span>,
                        )}
                      </li>
                    ))}
                  </ul>
                  <p class="nav-veil-go nav-veil-mouse">{t.veilGoMouse}</p>
                  <p class="nav-veil-go nav-veil-touch">{t.veilGoTouch}</p>
                </div>
              )}
              {matching.length === 0 && <p class="uni-empty">{t.empty}</p>}
            </div>
          </div>
        </div>
      </section>

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
