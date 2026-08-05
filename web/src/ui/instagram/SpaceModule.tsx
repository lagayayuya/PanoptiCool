// « 04 · LES INTERACTIONS » — the public accounts, as a crowd you can walk into.
//
// Structuring decisions, every one from a measurement or an arbitration:
//
//  · ONE instanced geometry, ONE draw call. The internal benchmark that settled it: the media
//    universe already runs a thousand sprites — so ≈1 000 draw calls — on the same machine. An
//    instanced crowd of a few hundred is therefore CHEAPER than what already works;
//  · Leg animation by PART ROTATION in the vertex shader, not by a vertex animation texture. A VAT
//    exists to replay a complex skinned deformation; it is oversized for a rigid swing, and it would
//    have to be baked, stored and loaded. Accepted consequence: the gait is a jointed figurine's;
//  · Size = interaction total, and the position encodes NOTHING. Distance-to-ego was exactly the
//    encoding judged unclear in the flat graph before it; carrying it into perspective, where
//    distances already lie, would have made it worse;
//  · The density slider serves LEGIBILITY, never performance. Saying otherwise would be lying about
//    the tool's limits.
//
// ─── ⚠ WHAT THIS PIECE DOES NOT DO ──────────────────────────────────────────────────────────────
//   - IT DOES NOT RANK ANYONE. Size counts the person's own public actions; it is not closeness, not
//     importance, and not affection. The learn panel says so before the crowd is read;
//   - IT DOES NOT SAY WHY. A blocked account and a muted one are states the export records; the
//     reason is nowhere in the data and is invented nowhere here;
//   - IT DOES NOT SHOW EVERYONE AT ONCE, past the density slider's setting. What is left out is
//     COUNTED and said — a crowd that silently truncates reads as a complete crowd.

import { createPortal } from 'preact/compat';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';
import type { AccountNode } from '../../engine/instagram/relations';
import { UI_IG_MESSAGES, UI_IG_QUERY, UI_IG_SHELL, UI_IG_SPACE } from '../copy.instagram';
import { formatInt } from '../format';
import { dayMonthYear } from './dates';
import { FilterMenu, FilterOption } from './FilterMenu';
import { FullscreenToggle } from './FullscreenToggle';
import { matchesPrefix, TIME_BUCKETS, type TimeBucket } from './filters';
import type { ModuleProps } from './InstagramPage';
import { MoveStick, type MoveVec } from './MoveStick';
import { usePortalHost } from './portal-host';
import {
  ACTION_CATS,
  type ActionCat,
  actionWeight,
  isVisible,
  LINK_OF_REL,
  LINK_STATUSES,
  LIST_STATUSES,
  type LinkStatus,
  type ListStatus,
  matchesStatus,
  queryPhrase,
  REL_COLOR,
  type Rel,
  relOf,
} from './relations-filters';
import { DATA, hex, SURFACE } from './tokens';
import { isTyping } from './typing';
import './espace.css';

/**
 * The plaza scales with the headcount: at a fixed radius, ninety figures are lost in the scenery and
 * seven hundred walk over each other. A constant density is what is wanted — so a radius in √N. The
 * camera and the fog follow.
 */
const AREA_PER_CHARACTER = 4.5;
const plazaFor = (n: number) =>
  Math.max(9, Math.sqrt((Math.max(n, 1) * AREA_PER_CHARACTER) / Math.PI));

/**
 * Opening framing: a little height, an almost horizontal gaze. High enough to take in the crowd,
 * flat enough that the figures stay STANDING silhouettes — seen from too high they become dots on a
 * plane again, and the third dimension stops earning its place.
 */
const START_PITCH = -0.17;
const startCamera = (plaza: number) => ({ y: plaza * 0.2 + 3.4, z: plaza * 1.05 + 6 });

const FLY_SPEED = 7;
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

/** The filter axis → the `Rel` whose colour the crowd wears. `all` has none: it is not a value. */
const LINK_REL: Record<Exclude<LinkStatus, 'all'>, Rel> = {
  mutual: 'mutual',
  following: 'following',
  follower: 'follower',
  no_follow: 'none',
};

const MAX_CHARACTERS = 1200;
const DENSITY_DEFAULT = 400;
/** Past this, nobody can be told apart — a threshold of legibility, not of computation. */
const _LEGIBILITY_LIMIT = 600;

/** Past this long with no interaction at all, an account is « dormant ». */
const DORMANT_YEARS = 5;
const YEAR_SEC = 365.25 * 86_400;

interface Agent {
  readonly account: AccountNode;
  readonly scale: number;
  readonly color: THREE.Color;
  /** Walk phase, so the crowd is not in step with itself. */
  readonly phase: number;
  readonly speed: number;
  /** Assigned place on the spiral — the wandering happens around it. */
  readonly home: { x: number; z: number };
  /** 0 = interacted with just now · 1 = dormant for a long time. */
  readonly dormancy: number;
  /** Targets reached. ⚠ It MUST change on every arrival — see the wander loop. */
  step: number;
  x: number;
  z: number;
  heading: number;
  tx: number;
  tz: number;
  /** 0 → 1, appearance on a filter change. */
  presence: number;
}

/** 0 = interacted with just now · 1 = dormant for `DORMANT_YEARS` or more. */
function dormancyOf(n: AccountNode, nowSec: number): number {
  if (n.lastTs === null) return 1;
  return Math.max(0, Math.min(1, (nowSec - n.lastTs) / (DORMANT_YEARS * YEAR_SEC)));
}

/** Deterministic PRNG: two openings of the page give the same crowd. */
function seeded(i: number): number {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * ⚠ VOGEL SPIRAL (golden angle), replacing a uniform random draw — which was the cause of « they are
 * all bunched together and stuck to each other ».
 *
 * That was not a coding defect but a wrong choice of law: a uniform draw on a disc MECHANICALLY
 * produces clumps and voids — Poisson clumping — and the eye reads it as grouping. To obtain what the
 * eye expects, a regular spacing, one needs a low-discrepancy sequence, not randomness.
 *
 * The golden angle guarantees no point ever falls in line with another: it is the arrangement of
 * sunflower seeds, the most regular there is without a grid.
 */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
function vogel(i: number, n: number, radius: number): { x: number; z: number } {
  // √(i+0.5): equal spacing by AREA, otherwise the centre is overcrowded.
  const r = radius * Math.sqrt((i + 0.5) / n);
  const a = i * GOLDEN_ANGLE;
  return { x: Math.cos(a) * r, z: Math.sin(a) * r };
}

/** Wander radius around home — enough to live, not enough to bunch up. */
const WANDER_RADIUS = 1.4;

/**
 * A figure: torso, head, two legs, two arms. Each part is a box, and every vertex carries a `partId`
 * plus its joint's pivot, so the shader can rotate one without touching the rest.
 *
 * `partId`: 0 body · 1 left leg · 2 right leg · 3 left arm · 4 right arm
 */
function buildCharacterGeometry(): THREE.BufferGeometry {
  const parts: Array<{
    id: number;
    size: [number, number, number];
    pos: [number, number, number];
    pivotY: number;
  }> = [
    { id: 0, size: [0.44, 0.62, 0.26], pos: [0, 1.16, 0], pivotY: 0 },
    { id: 0, size: [0.3, 0.3, 0.3], pos: [0, 1.62, 0], pivotY: 0 },
    { id: 1, size: [0.17, 0.85, 0.19], pos: [-0.12, 0.42, 0], pivotY: 0.85 },
    { id: 2, size: [0.17, 0.85, 0.19], pos: [0.12, 0.42, 0], pivotY: 0.85 },
    { id: 3, size: [0.13, 0.55, 0.14], pos: [-0.29, 1.16, 0], pivotY: 1.44 },
    { id: 4, size: [0.13, 0.55, 0.14], pos: [0.29, 1.16, 0], pivotY: 1.44 },
  ];

  const geos: THREE.BufferGeometry[] = [];
  for (const p of parts) {
    const g = new THREE.BoxGeometry(...p.size);
    g.translate(...p.pos);
    const n = (g.attributes.position as THREE.BufferAttribute).count;
    g.setAttribute('partId', new THREE.BufferAttribute(new Float32Array(n).fill(p.id), 1));
    g.setAttribute('pivotY', new THREE.BufferAttribute(new Float32Array(n).fill(p.pivotY), 1));
    geos.push(g);
  }

  // Merged by hand: `BufferGeometryUtils` is not in the bundle, and three attributes to concatenate
  // do not justify putting it there.
  let totalVerts = 0;
  let totalIdx = 0;
  for (const g of geos) {
    totalVerts += (g.attributes.position as THREE.BufferAttribute).count;
    totalIdx += (g.index as THREE.BufferAttribute).count;
  }
  const position = new Float32Array(totalVerts * 3);
  const normal = new Float32Array(totalVerts * 3);
  const partId = new Float32Array(totalVerts);
  const pivotY = new Float32Array(totalVerts);
  const index = new Uint16Array(totalIdx);
  let vOff = 0;
  let iOff = 0;
  for (const g of geos) {
    const pa = g.attributes.position as THREE.BufferAttribute;
    const na = g.attributes.normal as THREE.BufferAttribute;
    position.set(pa.array as Float32Array, vOff * 3);
    normal.set(na.array as Float32Array, vOff * 3);
    partId.set((g.attributes.partId as THREE.BufferAttribute).array as Float32Array, vOff);
    pivotY.set((g.attributes.pivotY as THREE.BufferAttribute).array as Float32Array, vOff);
    const idx = (g.index as THREE.BufferAttribute).array;
    for (let i = 0; i < idx.length; i++) index[iOff + i] = (idx[i] as number) + vOff;
    vOff += pa.count;
    iOff += idx.length;
    g.dispose();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
  geo.setAttribute('partId', new THREE.BufferAttribute(partId, 1));
  geo.setAttribute('pivotY', new THREE.BufferAttribute(pivotY, 1));
  // ⚠ A WHITE `color` ATTRIBUTE, MANDATORY. `vertexColors: true` declares USE_COLOR and the shader
  // does `vColor *= color`. With no attribute, WebGL supplies the default (0,0,0) and the WHOLE crowd
  // comes out black — the instance colour multiplied by zero. White is neutral, so `instanceColor`
  // passes through intact.
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(totalVerts * 3).fill(1), 3));
  geo.setIndex(new THREE.BufferAttribute(index, 1));
  return geo;
}

/**
 * The material. The walk is grafted onto `MeshLambertMaterial` through `onBeforeCompile` rather than
 * written as a complete shader: thirty lines buy three.js's lighting and fog.
 */
function buildCharacterMaterial(): THREE.MeshLambertMaterial {
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         attribute float partId;
         attribute float pivotY;
         attribute float aPhase;
         attribute float aPresence;
         attribute float aGait;
         uniform float uTime;

         // Rotation of a part about the X axis through its joint.
         vec3 swing(vec3 p, float pivot, float angle) {
           float c = cos(angle), s = sin(angle);
           float y = p.y - pivot;
           return vec3(p.x, pivot + y * c - p.z * s, y * s + p.z * c);
         }`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         // aGait: per-instance cadence. 0 freezes the figure (hover), under 1 slows the dormant.
         float t = uTime * 6.0 * aGait + aPhase;
         // Legs in opposition, arms counter-swinging — the step's legibility rests on that
         // opposition far more than on its amplitude.
         if (partId > 0.5) {
           float dir = (partId == 1.0 || partId == 4.0) ? 1.0 : -1.0;
           float amp = (partId < 2.5) ? 0.55 : 0.34;
           transformed = swing(transformed, pivotY, sin(t) * amp * dir);
         }
         // The step's bounce: two footfalls per cycle.
         transformed.y += abs(sin(t)) * 0.045;
         // An arrival grows OUT OF THE GROUND rather than fading in — a figure rising from its feet
         // reads as someone arriving, not as an artefact.
         transformed.xyz *= aPresence;`,
      );
    mat.userData.shader = shader;
  };
  return mat;
}

const LABEL_VEC = new THREE.Vector3();
/** Hard ceiling: beyond it the text is noise even without overlap. */
const LABEL_BUDGET = 120;
/** The tint the dormant fade towards — the theme's outline, not a grey of its own. */
let dormantTint: THREE.Color | null = null;
const DORMANT_TINT = () => (dormantTint ??= new THREE.Color(SURFACE.line3()));

interface SceneState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  mesh: THREE.InstancedMesh;
  material: THREE.MeshLambertMaterial;
  agents: Agent[];
  keys: Set<string>;
  yaw: number;
  pitch: number;
  pos: THREE.Vector3;
  labels: HTMLCanvasElement;
  raycaster: THREE.Raycaster;
  plaza: number;
  /** Goes true on the first navigation gesture — freezes the automatic reframing. */
  moved: boolean;
  /** Who is currently frozen, so the gait attribute is rewritten only on a change. */
  frozenId: string | null;
  grid: THREE.GridHelper;
  ring: THREE.Mesh;
}

/**
 * Labels: every handle, without crowding.
 *
 * ⚠ THE TWO REQUIREMENTS CONTRADICT EACH OTHER, so it is settled by DE-COLLISION rather than by
 * truncation: everyone is projected, sorted nearest first, and a label is placed only if its
 * rectangle overlaps none already placed. The nearest win — they are what is being looked at. When
 * the crowd loosens, or one walks closer, the labels reappear by themselves: the density of TEXT
 * stays constant on screen while the number of figures varies.
 *
 * Sorting by depth also gives a STABLE order from frame to frame — sorting by index would make
 * labels flicker as soon as one figure crossed another.
 */
function drawLabels(st: SceneState, enabled: boolean, hoveredId: string | null) {
  const cv = st.labels;
  const ctx = cv.getContext('2d');
  if (ctx === null) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cv.width, cv.height);
  // The hovered handle stays readable with labels off: it is an answer to a gesture.
  if (st.agents.length === 0 || (!enabled && hoveredId === null)) return;

  const dpr = cv.width / Math.max(cv.clientWidth, 1);
  ctx.scale(dpr, dpr);
  const w = cv.clientWidth;
  const h = cv.clientHeight;

  const v = LABEL_VEC;
  const placed: Array<[number, number, number, number]> = [];
  const candidates: Array<{ x: number; y: number; d: number; a: Agent }> = [];

  for (const a of st.agents) {
    if (a.presence < 0.85 && a.account.id !== hoveredId) continue;
    v.set(a.x, 2.05 * a.scale, a.z);
    const d = v.distanceTo(st.camera.position);
    v.project(st.camera);
    // Behind the camera.
    if (v.z > 1) continue;
    const x = (v.x * 0.5 + 0.5) * w;
    const y = (-v.y * 0.5 + 0.5) * h;
    if (x < -40 || x > w + 40 || y < -20 || y > h + 20) continue;
    candidates.push({ x, y, d, a });
  }
  // The hovered one goes FIRST: it must always get its place, even if neighbours give up theirs.
  candidates.sort((p, q) => {
    if (p.a.account.id === hoveredId) return -1;
    if (q.a.account.id === hoveredId) return 1;
    return p.d - q.d;
  });

  ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.textBaseline = 'middle';
  let shown = 0;
  for (const c of candidates) {
    const isHovered = c.a.account.id === hoveredId;
    if (!isHovered && (shown >= LABEL_BUDGET || !enabled)) break;
    const text = `@${c.a.account.id}`;
    const tw = ctx.measureText(text).width;
    const x0 = c.x - tw / 2 - 3;
    const y0 = c.y - 8;
    const x1 = x0 + tw + 6;
    const y1 = y0 + 16;
    let clash = false;
    for (const p of placed) {
      if (x0 < p[2] && x1 > p[0] && y0 < p[3] && y1 > p[1]) {
        clash = true;
        break;
      }
    }
    if (clash && !isHovered) continue;
    placed.push([x0, y0, x1, y1]);
    shown++;
    // Fading with distance: the far ones must dim, not vanish at a stroke.
    const alpha = isHovered ? 1 : Math.max(0.25, Math.min(1, 1 - (c.d - 8) / 60));
    ctx.globalAlpha = isHovered ? 0.92 : alpha * 0.55;
    ctx.fillStyle = SURFACE.bg();
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (isHovered) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = `#${c.a.color.getHexString()}`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x0 + 0.5, y0 + 0.5, x1 - x0 - 1, y1 - y0 - 1);
    }
    ctx.globalAlpha = alpha;
    // White for the hovered one: its colour stays on the border, but the TEXT has to stand out
    // against the other handles, which are themselves tinted.
    ctx.fillStyle = isHovered ? DATA.inkBright() : `#${c.a.color.getHexString()}`;
    ctx.fillText(text, c.x - tw / 2, c.y);
  }
  ctx.globalAlpha = 1;
}

export function SpaceModule({ report }: ModuleProps) {
  const t = UI_IG_SPACE;
  const relations = report.relations;

  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<SceneState | null>(null);
  const stickRef = useRef<MoveVec>({ x: 0, z: 0 });
  /** The hover is read by the LOOP, not by the render: a ref avoids a re-render per mouse move. */
  const hoveredRef = useRef<string | null>(null);

  const [link, setLink] = useState<LinkStatus>('all');
  const [lists, setLists] = useState<ReadonlySet<ListStatus>>(new Set());
  const [time, setTime] = useState<TimeBucket>('any');
  const [search, setSearch] = useState('');
  const [density, setDensity] = useState(DENSITY_DEFAULT);
  const [selected, setSelected] = useState<AccountNode | null>(null);
  const [primed, setPrimed] = useState(false);
  const [learn, setLearn] = useState(false);
  const [view, setView] = useState<'espace' | 'fichier'>('espace');

  const nodes = useMemo(() => relations?.nodes ?? [], [relations]);
  const maxW = useMemo(() => Math.max(1, ...nodes.map(actionWeight)), [nodes]);

  /**
   * ⚠ THE REFERENCE INSTANT FOR DORMANCY IS THE LAST INTERACTION PRESENT IN THE EXPORT, not the
   * machine's clock. An export read two years later would otherwise make everyone dormant — which
   * would no longer describe the data but the wait.
   */
  const nowSec = useMemo(() => Math.max(0, ...nodes.map((n) => n.lastTs ?? 0)), [nodes]);

  /** The archive's span in years — the export carries it, never the clock. */
  const years = useMemo(() => {
    const first = Math.min(...nodes.map((x) => x.firstTs ?? Number.POSITIVE_INFINITY));
    const last = Math.max(...nodes.map((x) => x.lastTs ?? 0));
    if (!Number.isFinite(first) || last <= 0) return '—';
    return String(Math.max(1, Math.round((last - first) / 31_557_600)));
  }, [nodes]);

  /**
   * The link's direction, counted ON THE NODES rather than taken from the report's declared totals.
   * The four tiles have to be a PARTITION of the shown population: added up they must make the
   * headline count. Mixing the two sources gives four numbers whose sum does not land.
   */
  const split = useMemo(() => {
    let m = 0;
    let f = 0;
    let b = 0;
    let n = 0;
    for (const x of nodes) {
      if (x.follows && x.followed) m++;
      else if (x.followed) f++;
      else if (x.follows) b++;
      else n++;
    }
    return { m, f, b, n };
  }, [nodes]);

  const matching = useMemo(
    () =>
      nodes.filter((n) => isVisible(n, link, lists, time, nowSec) && matchesPrefix(n.id, search)),
    [nodes, link, lists, time, nowSec, search],
  );

  /**
   * ⚠ THE DENSITY SLIDER TAKES THE MOST INTERACTED-WITH, not a random sample: a crowd cut at random
   * would change identity at every notch, and the figure one was looking at would vanish for no
   * reason the person could see.
   */
  const sample = useMemo(() => {
    if (matching.length <= density) return matching;
    return [...matching].sort((a, b) => actionWeight(b) - actionWeight(a)).slice(0, density);
  }, [matching, density]);

  const filtersActive = search.trim() !== '' || link !== 'all' || lists.size > 0 || time !== 'any';

  // ——— The scene, built once ———
  // biome-ignore lint/correctness/useExhaustiveDependencies: builds the scene once, on purpose.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (wrap === null || stateRef.current !== null) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(hex(SURFACE.bg()), 1);
    renderer.domElement.className = 'esp-canvas';
    wrap.appendChild(renderer.domElement);

    // ⚠ ONE 2D canvas over the scene, not one sprite per figure. That was the cost identified at
    // framing: a text sprite each is a draw call and a texture each, so more expensive than the whole
    // crowd put together. Here: one projection pass and a single DOM element, whatever the headcount.
    const labelCanvas = document.createElement('canvas');
    labelCanvas.className = 'esp-labels';
    wrap.appendChild(labelCanvas);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(hex(SURFACE.bg()), 40, 120);
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 800);

    scene.add(new THREE.HemisphereLight(hex(DATA.inkBright()), hex(SURFACE.bg()), 2.4));
    const key = new THREE.DirectionalLight(hex(DATA.inkBright()), 1.3);
    key.position.set(24, 40, 18);
    scene.add(key);

    // The ground is a GRID, not a solid surface: the plaza has to read as a work surface, not as
    // scenery. Built at unit size and scaled by `plaza`, to avoid rebuilding geometry per headcount.
    const grid = new THREE.GridHelper(2, 40, hex(SURFACE.line3()), hex(SURFACE.line()));
    scene.add(grid);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.988, 1, 128),
      new THREE.MeshBasicMaterial({
        color: hex(SURFACE.line3()),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    scene.add(ring);

    const geo = buildCharacterGeometry();
    const material = buildCharacterMaterial();
    const mesh = new THREE.InstancedMesh(geo, material, MAX_CHARACTERS);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(MAX_CHARACTERS * 3),
      3,
    );
    geo.setAttribute(
      'aPhase',
      new THREE.InstancedBufferAttribute(new Float32Array(MAX_CHARACTERS), 1),
    );
    geo.setAttribute(
      'aPresence',
      new THREE.InstancedBufferAttribute(new Float32Array(MAX_CHARACTERS), 1),
    );
    geo.setAttribute(
      'aGait',
      new THREE.InstancedBufferAttribute(new Float32Array(MAX_CHARACTERS).fill(1), 1),
    );
    scene.add(mesh);

    stateRef.current = {
      renderer,
      scene,
      camera,
      mesh,
      material,
      agents: [],
      keys: new Set<string>(),
      yaw: 0,
      pitch: START_PITCH,
      pos: new THREE.Vector3(0, 8, 34),
      labels: labelCanvas,
      raycaster: new THREE.Raycaster(),
      plaza: plazaFor(0),
      moved: false,
      frozenId: null,
      grid,
      ring,
    };

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      const dpr = Math.min(window.devicePixelRatio, 2);
      labelCanvas.width = Math.round(w * dpr);
      labelCanvas.height = Math.round(h * dpr);
      labelCanvas.style.width = `${w}px`;
      labelCanvas.style.height = `${h}px`;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      renderer.dispose();
      geo.dispose();
      material.dispose();
      if (renderer.domElement.parentElement === wrap) wrap.removeChild(renderer.domElement);
      if (labelCanvas.parentElement === wrap) wrap.removeChild(labelCanvas);
      stateRef.current = null;
    };
  }, []);

  // ——— Population: on a filter or density change ———
  useEffect(() => {
    const st = stateRef.current;
    if (st === null) return;

    const plaza = plazaFor(sample.length);
    st.grid.scale.setScalar(plaza);
    st.ring.scale.setScalar(plaza);
    (st.scene.fog as THREE.Fog).near = plaza * 1.8;
    (st.scene.fog as THREE.Fog).far = plaza * 5;

    /**
     * ⚠ KEPT POSITIONS ARE RESCALED. « Switching filters changes the diameter and some figures end
     * up outside the circle » — the kept positions were expressed in the OLD plaza. Rescaling
     * preserves the relative arrangement, which is the only reason to keep them.
     *
     * Same cause for the second symptom: new figures were born in the NEW radius while the old ones
     * stayed packed in the smaller one; further from the camera, they looked smaller. Size never
     * depended on the circle — that was perspective.
     */
    const ratio = st.plaza > 0 ? plaza / st.plaza : 1;
    const previous = new Map(st.agents.map((a) => [a.account.id, a]));
    if (ratio !== 1) {
      for (const a of previous.values()) {
        a.x *= ratio;
        a.z *= ratio;
        a.tx *= ratio;
        a.tz *= ratio;
      }
    }

    // The spiral puts index 0 at the centre and the rest towards the edge (radius in √i). Sorting BY
    // RECENCY therefore gives « recent at the centre, dormant at the rim » without touching the
    // geometry, and without losing the regular spacing.
    const ordered = [...sample].sort((a, b) => (b.lastTs ?? 0) - (a.lastTs ?? 0));

    const agents: Agent[] = ordered.map((account, i) => {
      const kept = previous.get(account.id);
      const norm = Math.sqrt(actionWeight(account)) / Math.sqrt(maxW);
      const home = vogel(i, ordered.length, plaza - 1.2);
      const dorm = dormancyOf(account, nowSec);
      return {
        account,
        home,
        scale: 0.55 + norm * 1.15,
        // Dormancy PALES the link's colour without replacing it: « mutual » must still read on an
        // account gone quiet six years ago.
        color: new THREE.Color(REL_COLOR[relOf(account)]()).lerp(DORMANT_TINT(), dorm * 0.72),
        phase: seeded(i * 5.3 + 3) * Math.PI * 2,
        // The recent move faster, the dormant drag. The gap must stay a GRADIENT: freezing the
        // dormant would take them out of the crowd instead of leaving them in it.
        speed: (0.34 + seeded(i * 2.9 + 4) * 0.3) * (1 - dorm * 0.62),
        dormancy: dorm,
        step: kept?.step ?? Math.floor(seeded(i * 11.3) * 1000),
        x: kept?.x ?? home.x,
        z: kept?.z ?? home.z,
        heading: kept?.heading ?? seeded(i * 7.7 + 2) * Math.PI * 2,
        tx: home.x,
        tz: home.z,
        presence: kept?.presence ?? 0,
      };
    });
    st.plaza = plaza;
    st.agents = agents;
    st.mesh.count = agents.length;

    /**
     * ⚠ THE BOUNDING SPHERE IS SET BY HAND. `InstancedMesh.raycast` computes its own on the first
     * cast and then CACHES it: it would be frozen on the first render's state (count = 0, identity
     * matrices) and every later click would miss. The agents being bounded by the plaza, an explicit
     * sphere is both exact and free — where invalidating the cache would cost a walk of every
     * instance.
     */
    st.mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 2, 0), plaza + 8);

    // The framing re-lays itself as long as nothing has been touched: changing the density before
    // moving should reframe, having moved first must shift NOTHING under the feet of someone
    // exploring.
    if (!st.moved) {
      const c = startCamera(plaza);
      st.pos.set(0, c.y, c.z);
      st.yaw = 0;
      st.pitch = START_PITCH;
    }

    const colors = st.mesh.instanceColor as THREE.InstancedBufferAttribute;
    const phases = st.mesh.geometry.getAttribute('aPhase') as THREE.InstancedBufferAttribute;
    const gaits = st.mesh.geometry.getAttribute('aGait') as THREE.InstancedBufferAttribute;
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i] as Agent;
      colors.setXYZ(i, a.color.r, a.color.g, a.color.b);
      phases.setX(i, a.phase);
      // The step's cadence follows the speed: a dormant that drags must not trot.
      gaits.setX(i, 0.45 + (1 - a.dormancy) * 0.75);
    }
    colors.needsUpdate = true;
    phases.needsUpdate = true;
    gaits.needsUpdate = true;
  }, [sample, maxW, nowSec]);

  // ——— The loop ———
  useEffect(() => {
    let raf = 0;
    const dummy = new THREE.Object3D();
    let last = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const st = stateRef.current;
      const box = wrapRef.current;
      // Hidden container (the other view, or an unopened piece): keep the loop alive — it resumes on
      // return — but draw nothing.
      if (st === null || box === null || box.clientWidth === 0 || box.clientHeight === 0) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // ——— Navigation. ONE mode: the camera is always free. The mouse orients by DRAG — no pointer
      //     lock, which would make clicking a figure, the main interaction, nearly impossible. ———
      let mx = stickRef.current.x;
      let mz = stickRef.current.z;
      if (st.keys.has('z') || st.keys.has('w') || st.keys.has('arrowup')) mz -= 1;
      if (st.keys.has('s') || st.keys.has('arrowdown')) mz += 1;
      if (st.keys.has('q') || st.keys.has('a') || st.keys.has('arrowleft')) mx -= 1;
      if (st.keys.has('d') || st.keys.has('arrowright')) mx += 1;
      if (mx !== 0 || mz !== 0) {
        st.moved = true;
        // Moving follows the gaze, PITCH INCLUDED: aiming at someone and going forward descends
        // towards them. That is what replaced the up/down keys, removed.
        const cy = Math.cos(st.pitch);
        const forward = new THREE.Vector3(
          -Math.sin(st.yaw) * cy,
          Math.sin(st.pitch),
          -Math.cos(st.yaw) * cy,
        );
        // Strafing stays HORIZONTAL: tilting it with the gaze is nauseating.
        const right = new THREE.Vector3(Math.cos(st.yaw), 0, -Math.sin(st.yaw));
        const step = FLY_SPEED * dt;
        st.pos.addScaledVector(forward, -mz * step);
        st.pos.addScaledVector(right, mx * step);
        st.pos.y = Math.max(0.9, Math.min(st.plaza * 1.6 + 10, st.pos.y));
        const rad = Math.hypot(st.pos.x, st.pos.z);
        const bound = st.plaza + 14;
        if (rad > bound) {
          st.pos.x *= bound / rad;
          st.pos.z *= bound / rad;
        }
      }
      st.camera.position.copy(st.pos);
      st.camera.rotation.set(0, 0, 0);
      st.camera.rotateY(st.yaw);
      st.camera.rotateX(st.pitch);

      const hoveredId = hoveredRef.current;
      for (let i = 0; i < st.agents.length; i++) {
        const a = st.agents[i] as Agent;
        a.presence = Math.min(1, a.presence + dt * 1.8);

        // ⚠ THE HOVERED ONE STOPS AND TURNS TOWARDS YOU. That is what turns a crowd into people: a
        // figurine that keeps walking while you point at it stays an object; one that breaks off and
        // faces you answers.
        if (a.account.id === hoveredId) {
          const want = Math.atan2(st.camera.position.x - a.x, st.camera.position.z - a.z);
          let diff = want - a.heading;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          a.heading += diff * Math.min(1, dt * 8);
        } else {
          const dx = a.tx - a.x;
          const dz = a.tz - a.z;
          const d = Math.hypot(dx, dz);
          if (d < 0.3) {
            /**
             * ⚠ THE TARGET'S SEED DEPENDS ON A COUNTER THAT CHANGES ON EVERY ARRIVAL, never on a
             * shared clock. It used to depend on a TIME BUCKET (~7 s): between two buckets an agent
             * that had arrived drew exactly THE SAME target, was instantly « arrived » again, and
             * stayed parked until the bucket flipped — while its walk cycle kept turning. Hence
             * « they are marking time ». A shared clock also freezes everyone at once.
             */
            a.step++;
            const ang = seeded(i * 1.7 + a.step * 31.7) * Math.PI * 2;
            const rad = 0.35 + Math.sqrt(seeded(i * 5.1 + a.step * 13.3)) * WANDER_RADIUS;
            a.tx = a.home.x + Math.cos(ang) * rad;
            a.tz = a.home.z + Math.sin(ang) * rad;
          } else {
            a.x += (dx / d) * a.speed * dt;
            a.z += (dz / d) * a.speed * dt;
            const want = Math.atan2(dx, dz);
            let diff = want - a.heading;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            a.heading += diff * Math.min(1, dt * 3);
          }
        }
        dummy.position.set(a.x, 0, a.z);
        dummy.rotation.set(0, a.heading, 0);
        dummy.scale.setScalar(a.scale);
        dummy.updateMatrix();
        st.mesh.setMatrixAt(i, dummy.matrix);
      }
      st.mesh.instanceMatrix.needsUpdate = true;

      const pres = st.mesh.geometry.getAttribute('aPresence') as THREE.InstancedBufferAttribute;
      for (let i = 0; i < st.agents.length; i++) pres.setX(i, (st.agents[i] as Agent).presence);
      pres.needsUpdate = true;

      // The hovered one stops WALKING too. Written ONCE on a hover change, not every frame.
      if (hoveredId !== st.frozenId) {
        const gaits = st.mesh.geometry.getAttribute('aGait') as THREE.InstancedBufferAttribute;
        for (let i = 0; i < st.agents.length; i++) {
          const a = st.agents[i] as Agent;
          gaits.setX(i, a.account.id === hoveredId ? 0 : 0.45 + (1 - a.dormancy) * 0.75);
        }
        gaits.needsUpdate = true;
        st.frozenId = hoveredId;
      }

      const shader = st.material.userData.shader as
        | { uniforms: { uTime: { value: number } } }
        | undefined;
      if (shader !== undefined) shader.uniforms.uTime.value = now / 1000;

      st.renderer.render(st.scene, st.camera);
      drawLabels(st, true, hoveredId);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ——— Keyboard ———
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const st = stateRef.current;
      // ⚠ THE SEARCH FIELD HAS PRIORITY: without this guard, typing a handle walked the camera three
      // paces and wrote only the letters that are not movement keys.
      if (st === null || isTyping()) return;
      const k = e.key.toLowerCase();
      if (MOVE_KEYS.has(k)) {
        e.preventDefault();
        st.keys.add(k);
      }
    };
    const up = (e: KeyboardEvent) => stateRef.current?.keys.delete(e.key.toLowerCase());
    const blur = () => stateRef.current?.keys.clear();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  // ——— Pointer: hover and click ———
  useEffect(() => {
    const wrap = wrapRef.current;
    if (wrap === null) return;

    const pick = (e: PointerEvent): number | null => {
      const st = stateRef.current;
      if (st === null || st.agents.length === 0) return null;
      const rect = wrap.getBoundingClientRect();
      st.raycaster.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1,
        ),
        st.camera,
      );
      return st.raycaster.intersectObject(st.mesh, false)[0]?.instanceId ?? null;
    };

    let downAt: { x: number; y: number } | null = null;
    let lastAt: { x: number; y: number } | null = null;

    /**
     * ⚠ THE POINTER IS CAPTURED ONLY IF THE PRESS CAME FROM THE SCENE ITSELF.
     *
     * `setPointerCapture` used to run on any press reaching this container, controls included. And a
     * container that captures the pointer ALSO receives the `click` instead of the element actually
     * pressed: the fullscreen button therefore never got its own, and clicking it did nothing.
     *
     * The test is on the target's NATURE rather than on a list of classes, so any control added to
     * the scene later is protected without anyone thinking about it.
     */
    const onDown = (e: PointerEvent) => {
      const target = e.target;
      if (target !== wrap && !(target instanceof HTMLCanvasElement)) return;
      downAt = { x: e.clientX, y: e.clientY };
      lastAt = { x: e.clientX, y: e.clientY };
      wrap.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const st = stateRef.current;
      if (downAt !== null && lastAt !== null && st !== null) {
        st.yaw -= (e.clientX - lastAt.x) * 0.004;
        st.pitch = Math.max(-1.2, Math.min(0.6, st.pitch - (e.clientY - lastAt.y) * 0.004));
        lastAt = { x: e.clientX, y: e.clientY };
        return;
      }
      const id = pick(e);
      hoveredRef.current = id !== null && st !== null ? (st.agents[id]?.account.id ?? null) : null;
    };
    const onUp = (e: PointerEvent) => {
      // A click/drag threshold: without it, turning the view opened a card.
      if (downAt === null || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) {
        downAt = null;
        lastAt = null;
        return;
      }
      downAt = null;
      lastAt = null;
      const id = pick(e);
      const st = stateRef.current;
      const hit = id !== null ? st?.agents[id] : undefined;
      if (hit !== undefined) setSelected(hit.account);
    };
    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup', onUp);
    return () => {
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerup', onUp);
    };
  }, []);

  /**
   * The controls veil lifts on the FIRST real gesture, not on a click on « got it »: the person
   * learns the control by performing it.
   */
  useEffect(() => {
    if (primed) return;
    const wrap = wrapRef.current;
    if (wrap === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (!isTyping() && MOVE_KEYS.has(e.key.toLowerCase())) setPrimed(true);
    };
    const onDown = () => setPrimed(true);
    window.addEventListener('keydown', onKey);
    wrap.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      wrap.removeEventListener('pointerdown', onDown);
    };
  }, [primed]);

  if (relations === undefined) return null;

  const LINK_LABEL: Record<LinkStatus, string> = {
    all: t.linkAll,
    mutual: t.linkMutual,
    following: t.linkFollowing,
    follower: t.linkFollower,
    no_follow: t.linkNoFollow,
  };
  const LIST_LABEL: Record<ListStatus, string> = {
    blocked: t.listBlocked,
    pending_sent: t.listPending,
    close_friend: t.listCloseFriend,
    favorite: t.listFavorite,
    hide_story: t.listHideStory,
  };
  // ⚠ THE MESSAGES PIECE'S OWN LABELS, read rather than rewritten. The buckets are the same three
  // thresholds (`filters.ts`), and a second wording for them would mean « moins d'un an » here and
  // something slightly different there, describing one identical rule.
  const TIME_LABEL = UI_IG_MESSAGES.timeLabels;

  /** Puts the camera back where the piece opened. The camera is free, so someone who has walked
   *  away has no other way back. */
  const reframe = () => {
    const st = stateRef.current;
    if (st === null) return;
    const c = startCamera(st.plaza);
    st.pos.set(0, c.y, c.z);
    st.yaw = 0;
    st.pitch = START_PITCH;
    st.moved = false;
  };

  const toggleList = (s: ListStatus) =>
    setLists((prev) => {
      const next = new Set(prev);
      if (!next.delete(s)) next.add(s);
      return next;
    });

  return (
    <div class="espace">
      <section class="esp-hero">
        <h1 class="esp-h1">{t.h1(formatInt(nodes.length), years)}</h1>
        <p class="esp-lede">{t.lede}</p>
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
              <span class="learn-k">{t.learnPosK}</span>
              <span class="learn-p">{t.learnPosP}</span>
            </div>
            <div>
              <span class="learn-k">{t.learnSizeK}</span>
              <span class="learn-p">{t.learnSizeP}</span>
            </div>
            <div>
              <span class="learn-k">{t.learnDormK}</span>
              <span class="learn-p">{t.learnDormP}</span>
            </div>
          </div>
        </div>
      )}

      {/* ⚠ THE TILES SIT OUTSIDE THE CARD, as their own row. They describe the WHOLE population and
          are a partition of it; inside the card they would read as a property of the filtered
          selection, which is the one thing they are not. */}
      <div class="kit-tiles">
        {[
          [t.tileMutual, split.m],
          [t.tileFollowing, split.f],
          [t.tileFollower, split.b],
          [t.tileNone, split.n],
        ].map(([label, n]) => (
          <div key={label as string} class="kit-tile">
            <span class="kit-tile-v tnum">{formatInt(n as number)}</span>
            <span class="kit-tile-k">{label as string}</span>
          </div>
        ))}
      </div>

      <section class="card esp-card">
        <header class="kit-head">
          <span class="kit-count tnum">{t.countAccounts(formatInt(matching.length))}</span>
          {/* `role="status"`: the sentence changes as filters move, and a screen reader has to hear
              the new selection rather than discover it by re-reading the page. */}
          <span role="status" class="kit-sub">
            {queryPhrase(
              { link, lists, actions: new Set(), time, search },
              { link: LINK_LABEL, list: LIST_LABEL },
            )}
          </span>
          {filtersActive && (
            <button
              type="button"
              class="query-reset"
              onClick={() => {
                setSearch('');
                setLink('all');
                setLists(new Set());
                setTime('any');
              }}
            >
              {UI_IG_QUERY.reset}
            </button>
          )}
          <span class="kit-spacer" />
          {/* One query, two renderings. The switch is immediate because NOTHING else changes between
              them: same filters, same selection, same card. */}
          {/* biome-ignore lint/a11y/useSemanticElements: `<fieldset>` groups FORM controls; these are
              view switches, and `role="group"` with a label is the ARIA pattern for them. */}
          <div class="vw-tabs" role="group" aria-label={t.viewGroupLabel}>
            {(['espace', 'fichier'] as const).map((v) => (
              <button
                key={v}
                type="button"
                class={`vw-tab ${view === v ? 'on' : ''}`}
                aria-pressed={view === v}
                onClick={() => setView(v)}
              >
                {v === 'espace' ? t.viewSpace : t.viewFile}
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
            <FilterMenu label={t.filterLink} summary={LINK_LABEL[link]} active={link !== 'all'}>
              {LINK_STATUSES.map((st) => (
                <FilterOption
                  key={st}
                  checked={link === st}
                  color={st === 'all' ? undefined : REL_COLOR[LINK_REL[st]]()}
                  count={nodes.filter((n) => matchesStatus(n, st)).length}
                  onClick={() => setLink(st)}
                >
                  {LINK_LABEL[st]}
                </FilterOption>
              ))}
            </FilterMenu>
            <FilterMenu
              label={t.filterLists}
              summary={
                lists.size === 0
                  ? t.listsAll
                  : lists.size === 1
                    ? LIST_LABEL[[...lists][0] as ListStatus]
                    : t.listsChecked(String(lists.size))
              }
              active={lists.size > 0}
            >
              {LIST_STATUSES.map((st) => (
                <FilterOption
                  key={st}
                  multi
                  checked={lists.has(st)}
                  count={nodes.filter((n) => n.interactions[st] !== undefined).length}
                  onClick={() => toggleList(st)}
                >
                  {LIST_LABEL[st]}
                </FilterOption>
              ))}
            </FilterMenu>
            <FilterMenu label={t.filterTime} summary={TIME_LABEL[time]} active={time !== 'any'}>
              {TIME_BUCKETS.map((b) => (
                <FilterOption key={b} checked={time === b} onClick={() => setTime(b)}>
                  {TIME_LABEL[b]}
                </FilterOption>
              ))}
            </FilterMenu>
          </div>
        </div>

        {view === 'fichier' && (
          <AccountTable nodes={matching} nowSec={nowSec} onOpen={setSelected} labels={LINK_LABEL} />
        )}

        {/**
         * ⚠ THE SCENE STAYS MOUNTED when one switches to the table — only hidden.
         *
         * It used to be unmounted, and the effect that BUILDS it runs once: on the way back the
         * container came up empty, because the WebGL canvas had left with the old node. What was
         * left was a blue rectangle that no filter could revive, and only a page reload fixed it —
         * which is exactly what the maintainer met. The prototype carries the same note; I dropped
         * it in the port.
         *
         * Hidden, it costs nothing: the render loop stops as soon as the container has no surface.
         */}
        <div class={view === 'fichier' ? 'esp-hidden' : undefined}>
          {/* ⚠ WHAT IS LEFT OUT IS COUNTED AND SAID. A crowd silently truncated reads as the
                whole crowd, and the density slider is the one control whose effect is invisible
                without this line. It sits AGAINST the frame it talks about. */}
          {matching.length > sample.length && (
            <p class="esp-note">{t.hidden(formatInt(matching.length - sample.length))}</p>
          )}

          {/* ⚠ ONE BLOCK: the controls CAP the scene rather than floating in a row above it.
                Detached, one moved a slider at the top and watched an image change further down
                with nothing saying the two went together. Same bar as the heatmap's, so there is a
                single mechanic to learn on the page. */}
          <div class="vw-block">
            <div class="vw-bar">
              <label class="kit-slider">
                {t.density} <b class="tnum">{formatInt(density)}</b>
                <input
                  type="range"
                  min={20}
                  max={Math.max(20, Math.min(MAX_CHARACTERS, matching.length))}
                  step={10}
                  value={density}
                  aria-label={t.density}
                  onInput={(e) => setDensity(Number(e.currentTarget.value))}
                />
              </label>
              {/* Reframing is a control because the camera is free: someone who has walked away
                    has no other way back to the view the piece opened on. */}
              <button type="button" class="vw-btn vw-bar-right" onClick={reframe}>
                {t.reframe}
              </button>
            </div>

            <div ref={frameRef} class="esp-stage">
              <div ref={wrapRef} class="esp-wrap" />
              <FullscreenToggle targetRef={frameRef} label={t.frameLabel} />
              <MoveStick vecRef={stickRef} onEngage={() => setPrimed(true)} />
              {!primed && (
                <div class="nav-veil">
                  <p class="nav-veil-title">{t.veilTitle}</p>
                  {/* ⚠ TWO WHOLE LISTS, never interleaved, and the POINTER picks which one shows
                        — not the width: a wide tablet is driven by a finger, a narrow laptop by a
                        mouse. */}
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
              {/* ⚠ FOUR COLOURS AND NOTHING ELSE — the link partitions, so a colour per link is a
                    complete legend. Size and position are named here as what they are NOT, because
                    a crowd invites reading a meaning into both. */}
              <div class="esp-legend">
                <span>
                  <i style={{ background: REL_COLOR.mutual() }} /> {LINK_LABEL.mutual}
                </span>
                <span>
                  <i style={{ background: REL_COLOR.following() }} /> {LINK_LABEL.following}
                </span>
                <span>
                  <i style={{ background: REL_COLOR.follower() }} /> {LINK_LABEL.follower}
                </span>
                <span>
                  <i style={{ background: REL_COLOR.none() }} /> {LINK_LABEL.no_follow}
                </span>
                {lists.size > 0 && (
                  <span class="legend-lists">
                    + {[...lists].map((st) => LIST_LABEL[st]).join(' · ')}
                  </span>
                )}
                <span class="legend-hint">{t.legendHint}</span>
              </div>
              {matching.length === 0 && <p class="esp-empty">{t.empty}</p>}
            </div>
          </div>
        </div>
        {/* ⚠ WHAT THE EXPORT DOES NOT CONTAIN, said where the numbers are read. Every count here is
            the person's actions TOWARDS others; the reverse direction is simply not in the archive,
            and a page of counters that stayed silent about it would be read as symmetrical. */}
        <p class="kit-foot">{t.foot}</p>
      </section>

      {selected !== null && (
        <AccountModal account={selected} labels={LINK_LABEL} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/**
 * « EN DÉTAIL » — the same query, read as a table.
 *
 * ⚠ NOT A SECOND VIEW OF SECOND-CLASS DATA. It shows the same selection as the crowd, from the same
 * filters, and opens the same card: one question, two ways of looking. The space shows SCALE and
 * PRESENCE and can neither sort nor find — reaching someone there means spotting them by eye among
 * hundreds of walking silhouettes. So this brings sorting and access, not a soberer repeat.
 *
 * ⚠ AND « QUAND » IS A PERIOD, not just the last trace. « il y a 5 ans » did not say whether the
 * account had been frequented one evening or for six years, nor whether its 148 actions fitted in a
 * week. The track carries both ends on the shared axis: recent, old and long-running accounts tell
 * themselves apart without reading a single figure. The date stays, beside the track — it is what
 * one looks for when one is looking for a date.
 */
function LifeTrack({
  from,
  to,
  axis,
  color,
}: {
  from: number | null;
  to: number | null;
  axis: { from: number; to: number } | null;
  color: string;
}) {
  // ⚠ NO DATE MEANS AN EMPTY TRACK, never a full-width one: the absence of a date does not mean
  // « present throughout ». A one-day period keeps a 2 % floor so an isolated action stays visible.
  if (axis === null || from === null || to === null) {
    return <span class="fi-track empty" aria-hidden="true" />;
  }
  const span = axis.to - axis.from;
  const left = ((from - axis.from) / span) * 100;
  const width = Math.max(2, ((to - from) / span) * 100);
  return (
    <span class="fi-track" aria-hidden="true">
      <i
        style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%`, background: color }}
      />
    </span>
  );
}

/** « il y a 3 mois ». An absolute date would mean doing the arithmetic on every row. */
function agoLabel(lastTs: number | null, nowSec: number): string {
  const t = UI_IG_SPACE;
  if (lastTs === null) return t.tableNever;
  const d = (nowSec - lastTs) / 86_400;
  if (d < 1) return t.agoToday;
  if (d < 30) return t.agoDays(String(Math.round(d)));
  if (d < 365) return t.agoMonths(String(Math.round(d / 30)));
  const y = (nowSec - lastTs) / YEAR_SEC;
  return y < 2 ? t.agoOneYear : t.agoYears(String(Math.floor(y)));
}

type SortKey = 'actions' | 'pseudo' | 'last';

function AccountTable({
  nodes,
  nowSec,
  onOpen,
  labels,
}: {
  nodes: readonly AccountNode[];
  nowSec: number;
  onOpen: (n: AccountNode) => void;
  labels: Record<LinkStatus, string>;
}) {
  const t = UI_IG_SPACE;
  const [sort, setSort] = useState<SortKey>('actions');
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const dir = asc ? 1 : -1;
    return [...nodes].sort((a, b) => {
      if (sort === 'pseudo') return a.id.localeCompare(b.id) * (asc ? 1 : -1);
      if (sort === 'last') return ((a.lastTs ?? 0) - (b.lastTs ?? 0)) * dir;
      return (actionWeight(a) - actionWeight(b)) * dir;
    });
  }, [nodes, sort, asc]);

  /**
   * ⚠ THE SHARED AXIS IS COMPUTED ON WHAT THE FILTERS KEPT, not on the whole export. Filtering to
   * « seen this year » while keeping a ruler that runs from 2014 would crush every track into a dot
   * on the right, and the view would lose exactly what it is asked to show.
   */
  const axis = useMemo(() => {
    let from = Number.POSITIVE_INFINITY;
    let to = Number.NEGATIVE_INFINITY;
    for (const a of nodes) {
      if (a.firstTs !== null) from = Math.min(from, a.firstTs);
      if (a.lastTs !== null) to = Math.max(to, a.lastTs);
    }
    return Number.isFinite(from) && to > from ? { from, to } : null;
  }, [nodes]);

  /**
   * ⚠ `aria-pressed` AND NOT `aria-sort`, for the reason the threads' table states: each row here is
   * a BUTTON, and declaring an ARIA table would take that away from the only control that opens an
   * account. What a screen reader loses is the direction, which the arrow carries visually.
   */
  const head = (key: SortKey, label: string, cls: string) => (
    <button
      type="button"
      class={`fi-th fi-sortable ${cls} ${sort === key ? 'on' : ''}`}
      aria-pressed={sort === key}
      onClick={() => {
        if (sort === key) setAsc(!asc);
        else {
          setSort(key);
          setAsc(key === 'pseudo');
        }
      }}
    >
      {label}
      {/* Reserved space: without it the arrow shifts every other header by a notch on each click. */}
      <span class="fi-arrow">{sort === key ? (asc ? '▲' : '▼') : '·'}</span>
    </button>
  );

  return (
    <div class="fichier fi-solo">
      <div class="fi-main">
        <div class="fi-head fi-grid">
          {head('pseudo', t.tableWho, 'fi-c-name')}
          <span class="fi-th fi-c-link">{t.tableLink}</span>
          {/* The volume is NOT sortable: it is already the default order, and a clickable header
              that only confirms what you see invites a click with no effect. */}
          <span class="fi-th fi-c-act">{t.tableActions}</span>
          {head('last', t.tableLast, 'fi-c-when')}
        </div>

        <div class="fi-rows">
          {rows.length === 0 && <p class="fi-empty">{t.tableEmpty}</p>}
          {rows.map((n) => {
            const rel = relOf(n);
            return (
              // The WHOLE ROW is the button: a full-width target, and one tab stop per account in
              // the order shown. A handle a few characters wide, over hundreds of rows, is the kind
              // of detail that makes a table tiring without anyone being able to say why.
              <button
                key={n.id}
                type="button"
                class="fi-row fi-grid"
                // The follow link becomes the row's LEFT EDGE. As a pill in its own column it was
                // invisible unless looked at; at the edge, sorting shows its blocks at once.
                style={{ borderLeftColor: REL_COLOR[rel]() }}
                onClick={() => onOpen(n)}
              >
                <span class="fi-c-name fi-name">@{n.id}</span>
                <span class="fi-c-link fi-link" style={{ color: REL_COLOR[rel]() }}>
                  {labels[LINK_OF_REL[rel]]}
                </span>
                <span class="fi-c-act fi-act tnum">{formatInt(actionWeight(n))}</span>
                <span class="fi-c-when fi-when">
                  <LifeTrack from={n.firstTs} to={n.lastTs} axis={axis} color={REL_COLOR[rel]()} />
                  <span class="fi-when-ago tnum">{agoLabel(n.lastTs, nowSec)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p class="fi-legend">{t.tableLegend}</p>
      </div>
    </div>
  );
}

/**
 * THE OPENED ACCOUNT — everything the export holds about one relation, and the shape of it in time.
 *
 * ⚠ IT SHOWS WHAT WAS WRITTEN, and that is the demonstration rather than a decoration: the comments
 * you posted and the polls you answered are IN the archive, tied to an account, dated. A card that
 * only counted them would have made the piece's point weaker than the truth.
 *
 * ─── ⚠ WHAT THIS PANEL DOES NOT DO ──────────────────────────────────────────────────────────────
 *   - IT DOES NOT SAY WHAT THE OTHER ACCOUNT DID. Instagram hands over your own actions and your
 *     follower list, nothing coming the other way — written at the foot, because a page of counters
 *     that stayed silent about it would be read as symmetrical;
 *   - IT DOES NOT SHOW WHICH POLL OPTION WAS CHOSEN, nor the text of comments you LIKED. Neither is
 *     in the export, and the note under the breakdown says so where the gap would be noticed;
 *   - IT RANKS NOBODY. A count of actions is a count of actions: it is not a measure of closeness.
 */
function AccountModal({
  account,
  labels,
  onClose,
}: {
  account: AccountNode;
  labels: Record<LinkStatus, string>;
  onClose: () => void;
}) {
  const t = UI_IG_SPACE;
  // ⚠ PORTALLED, and the host is NOT always `document.body`. Native fullscreen renders only the
  // promoted element and its descendants: a card appended to the body is perfectly mounted, answers
  // the keyboard, and stays invisible — then appears all at once on leaving fullscreen, where it had
  // been waiting. Clicking a figure while fullscreen looked like it did nothing.
  const host = usePortalHost();
  const [expanded, setExpanded] = useState<ActionCat | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const rel = relOf(account);
  const badges = [
    account.interactions.close_friend !== undefined ? t.badgeCloseFriend : null,
    account.interactions.favorite !== undefined ? t.badgeFavorite : null,
    account.interactions.blocked !== undefined ? t.badgeBlocked : null,
    account.interactions.pending_sent !== undefined ? t.badgePending : null,
    account.interactions.hide_story !== undefined ? t.badgeHideStory : null,
  ].filter((b): b is string => b !== null);

  const actionRows = ACTION_CATS.filter((a) => account.interactions[a] !== undefined);
  const total = actionRows.reduce((sum, a) => sum + (account.interactions[a]?.count ?? 0), 0);

  // ⚠ ONLY THE DATED EVENTS reach the timeline: `timestamps` is a subset of `count`, and plotting an
  // undated action would mean inventing a moment for it.
  const events = useMemo(() => {
    const out: Array<{ ts: number; cat: ActionCat }> = [];
    for (const cat of actionRows) {
      for (const ts of account.interactions[cat]?.timestamps ?? []) out.push({ ts, cat });
    }
    return out.sort((a, b) => a.ts - b.ts);
  }, [account, actionRows]);
  const first = events[0]?.ts ?? null;
  const last = events[events.length - 1]?.ts ?? null;
  const span = first !== null && last !== null && last > first ? last - first : 1;

  if (host === null) return null;

  return createPortal(
    // biome-ignore lint/a11y/noStaticElementInteractions: a closing backdrop — Escape and the ✕ are
    // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard paths.
    <div class="modal-backdrop" onClick={onClose}>
      {/* The card carries `role="dialog"`, so it is not a static element; its click only stops
          propagation so a click inside does not reach the closing backdrop.
          biome-ignore lint/a11y/useKeyWithClickEvents: see above. */}
      <div
        class="modal-card rel-account-modal"
        role="dialog"
        aria-modal="true"
        aria-label={account.id}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" class="modal-close" aria-label={t.panelClose} onClick={onClose}>
          ×
        </button>
        <div class="modal-id">
          <span class="modal-pseudo">@{account.id}</span>
          {/* Which way the link goes, and since when it stopped moving: the two things one wants
              before reading any detail. */}
          <span class="rel-meta">
            <span class="rel-meta-link" style={{ color: REL_COLOR[rel]() }}>
              {labels[LINK_OF_REL[rel]]}
            </span>
            {account.lastTs !== null && <> · {t.panelLast(dayMonthYear(account.lastTs))}</>}
          </span>
        </div>

        {badges.length > 0 && (
          <div class="modal-badges">
            {badges.map((b) => (
              <span key={b} class="badge">
                <i />
                {b}
              </span>
            ))}
          </div>
        )}

        {total > 0 && (
          <div class="rel-total">
            <span class="rel-total-n">{formatInt(total)}</span>
            <span class="rel-total-k">{t.panelTotal}</span>
          </div>
        )}

        {actionRows.length > 0 && (
          <>
            <span class="mini-h modal-section-h">{t.panelActions}</span>
            <div class="modal-cats">
              {actionRows.map((cat) => {
                const details = account.content?.[cat] ?? [];
                const hasContent = details.length > 0;
                const isOpen = expanded === cat;
                return (
                  <div key={cat} class={`modal-cat-block ${hasContent ? 'expandable' : ''}`}>
                    {/* ⚠ ONLY A ROW THAT HAS SOMETHING TO SHOW IS A CONTROL. A chevron on a
                        category the export left empty promises a detail that does not exist. */}
                    <button
                      type="button"
                      class="modal-cat-row"
                      disabled={!hasContent}
                      aria-expanded={hasContent ? isOpen : undefined}
                      onClick={() => setExpanded(isOpen ? null : cat)}
                    >
                      <span class="mc-dot" />
                      <span class="mc-label">{t.actions[cat]}</span>
                      {hasContent && <span class="mc-chevron">{isOpen ? '▾' : '▸'}</span>}
                      <span class="mc-count tnum">
                        {formatInt(account.interactions[cat]?.count ?? 0)}
                      </span>
                    </button>
                    {hasContent && isOpen && (
                      <div class="mc-details">
                        {details.map((d) => (
                          <div key={`${d.text}-${d.ts ?? ''}`} class="mc-detail">
                            <span class="mc-detail-text">
                              {cat === 'comment' ? `« ${d.text} »` : d.text}
                            </span>
                            {d.ts !== null && (
                              <span class="mc-detail-date tnum">{dayMonthYear(d.ts)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {(account.content?.comment !== undefined || account.content?.poll !== undefined) && (
              <p class="rel-content-note">{t.panelContentNote}</p>
            )}
          </>
        )}

        {events.length > 0 && first !== null && (
          <div class="modal-timeline">
            <span class="mini-h">{t.panelTimeline}</span>
            <div class="tl-track">
              <div class="tl-dots">
                {events.map((e) => (
                  <span
                    key={`${e.ts}-${e.cat}`}
                    class="tl-dot"
                    style={{ left: `${((e.ts - first) / span) * 100}%` }}
                    title={`${t.actions[e.cat]} · ${dayMonthYear(e.ts)}`}
                  />
                ))}
              </div>
            </div>
            <div class="tl-labels tnum">
              <span>{dayMonthYear(first)}</span>
              <span>{last === null ? '' : dayMonthYear(last)}</span>
            </div>
          </div>
        )}

        <p class="modal-direction-note">{t.panelDirectionNote}</p>
      </div>
    </div>,
    host,
  );
}
