/**
 * 3D model + projection for the home hero laptop (see HeroLaptop.tsx).
 *
 * Model space is millimetres, roughly a 14" MacBook: x right, y up, z toward the
 * viewer; the deck's top surface is y = 0, centered on the origin. The whole model
 * is tilted toward the viewer (ELEV) so the keyboard is seen from above, then
 * projected with a perspective camera that sits at the CENTER OF THE VIEWPORT, like
 * Tech@NYU's hero TV. Because the camera stays put while the page scrolls, the
 * laptop's apparent angle changes with its position on screen: as it rises toward
 * the navbar you see it more from below, and it flattens as it leaves.
 */

export type Vec3 = [number, number, number];
export type Pt = [number, number];

// ---- Dimensions (mm) --------------------------------------------------------
const W = 312; // base width
const D = 221; // base depth
const T = 11; // base thickness
const LID_H = 214;
const LID_T = 5;
const LID_TILT = (20 * Math.PI) / 180; // lid leans back from vertical
const ELEV = (24 * Math.PI) / 180; // view elevation: tilt the model toward the viewer
/** Camera distance (CSS px) from the page plane: smaller = stronger perspective. */
export const FOCAL = 1500;

// Keyboard (MacBook ANSI: 14.5u x 6 rows, F row full height, Touch ID top right)
const KB_W = 0.85 * W;
const U = KB_W / 14.5;
const KB_Z0 = -D / 2 + 16; // back edge of the keyboard
const GAP = 0.17; // gap between keys (key units)
const KEY_H = 0.9; // keycap top height above the deck (mm)
const INSET = 0.06; // keycap top inset (key units)

const ROWS: (number | "touchid" | "arrows")[][] = [
  [1.5, ...Array(12).fill(1), "touchid"],
  [...Array(13).fill(1), 1.5],
  [1.5, ...Array(12).fill(1), 1],
  [1.75, ...Array(11).fill(1), 1.75],
  [2.25, ...Array(10).fill(1), 2.25],
  [1, 1, 1, 1.25, 5, 1.25, 1, "arrows"],
];
/** Labeled (backlit) keys at their real positions: [row, index in row]. */
const LETTERS: Record<string, string> = { "2,3": "E", "3,3": "D", "4,3": "C" };

type KeyRect = { x: number; z: number; w: number; d: number; label?: string; touch?: boolean };

function layoutKeys(): KeyRect[] {
  const keys: KeyRect[] = [];
  const x0 = -KB_W / 2;
  ROWS.forEach((row, r) => {
    let u = 0;
    row.forEach((k, i) => {
      const z = KB_Z0 + r * U;
      if (k === "touchid") {
        keys.push({ x: x0 + u * U, z, w: U, d: U, touch: true });
        u += 1;
      } else if (k === "arrows") {
        keys.push({ x: x0 + u * U, z: z + U / 2, w: U, d: U / 2 }); // left
        keys.push({ x: x0 + (u + 1) * U, z, w: U, d: U / 2 }); // up
        keys.push({ x: x0 + (u + 1) * U, z: z + U / 2, w: U, d: U / 2 }); // down
        keys.push({ x: x0 + (u + 2) * U, z: z + U / 2, w: U, d: U / 2 }); // right
        u += 3;
      } else {
        keys.push({ x: x0 + u * U, z, w: k * U, d: U, label: LETTERS[`${r},${i}`] });
        u += k;
      }
    });
  });
  return keys;
}
const KEYS = layoutKeys();

// ---- Geometry helpers -------------------------------------------------------
const cosE = Math.cos(ELEV);
const sinE = Math.sin(ELEV);
/** Model -> view-rotated model space (tilt about x so the deck faces up toward us). */
function rot([x, y, z]: Vec3): Vec3 {
  return [x, y * cosE - z * sinE, y * sinE + z * cosE];
}

// Lid frame: hinge line at the deck's back edge; "up" leans back by `tilt`
// (LID_TILT at rest; smaller = more closed, see Pose.close).
const HINGE: Vec3 = [0, -1.5, -D / 2 + 3];
type LidFrame = { up: Vec3; n: Vec3 };
function lidFrame(tilt: number): LidFrame {
  return { up: [0, Math.cos(tilt), -Math.sin(tilt)], n: [0, Math.sin(tilt), Math.cos(tilt)] };
}
function lidPt(L: LidFrame, x: number, up: number, out: number): Vec3 {
  return [x + HINGE[0], HINGE[1] + L.up[1] * up + L.n[1] * out, HINGE[2] + L.up[2] * up + L.n[2] * out];
}

export type Face = { pts: Vec3[]; normal: Vec3; fill: string; stroke?: string; sw?: number; round?: boolean };

function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, fill: string, side: string): Face[] {
  const p = (x: number, y: number, z: number): Vec3 => [x, y, z];
  const s = "var(--laptop-edge)";
  return [
    { pts: [p(x0, y1, z0), p(x1, y1, z0), p(x1, y1, z1), p(x0, y1, z1)], normal: [0, 1, 0], fill, stroke: s }, // top
    { pts: [p(x0, y0, z1), p(x1, y0, z1), p(x1, y0, z0), p(x0, y0, z0)], normal: [0, -1, 0], fill: side, stroke: s }, // bottom
    { pts: [p(x0, y1, z1), p(x1, y1, z1), p(x1, y0, z1), p(x0, y0, z1)], normal: [0, 0, 1], fill: side, stroke: s }, // front
    { pts: [p(x1, y1, z0), p(x0, y1, z0), p(x0, y0, z0), p(x1, y0, z0)], normal: [0, 0, -1], fill: side, stroke: s }, // back
    { pts: [p(x0, y1, z0), p(x0, y1, z1), p(x0, y0, z1), p(x0, y0, z0)], normal: [-1, 0, 0], fill: side, stroke: s }, // left
    { pts: [p(x1, y1, z1), p(x1, y1, z0), p(x1, y0, z0), p(x1, y0, z1)], normal: [1, 0, 0], fill: side, stroke: s }, // right
  ];
}

/** Lid as a slab in its own tilted frame. */
function lidFaces(L: LidFrame): Face[] {
  const LID_N = L.n;
  const LID_UP = L.up;
  const x0 = -W / 2;
  const x1 = W / 2;
  const f = (pts: Vec3[], normal: Vec3, fill: string): Face => ({ pts, normal, fill, stroke: "var(--laptop-edge)" });
  const back = -LID_T;
  const neg = (v: Vec3): Vec3 => [-v[0], -v[1], -v[2]];
  return [
    f([lidPt(L, x0, LID_H, 0), lidPt(L, x1, LID_H, 0), lidPt(L, x1, 0, 0), lidPt(L, x0, 0, 0)], LID_N, "var(--laptop-metal)"), // front
    f([lidPt(L, x1, LID_H, back), lidPt(L, x0, LID_H, back), lidPt(L, x0, 0, back), lidPt(L, x1, 0, back)], neg(LID_N), "var(--laptop-metal)"), // back
    f([lidPt(L, x0, LID_H, back), lidPt(L, x1, LID_H, back), lidPt(L, x1, LID_H, 0), lidPt(L, x0, LID_H, 0)], LID_UP, "var(--laptop-metal-shade)"), // top edge
    f([lidPt(L, x0, LID_H, back), lidPt(L, x0, LID_H, 0), lidPt(L, x0, 0, 0), lidPt(L, x0, 0, back)], [-1, 0, 0], "var(--laptop-metal-shade)"),
    f([lidPt(L, x1, LID_H, 0), lidPt(L, x1, LID_H, back), lidPt(L, x1, 0, back), lidPt(L, x1, 0, 0)], [1, 0, 0], "var(--laptop-metal-shade)"),
  ];
}

const DISPLAY_INSET = { side: 9, top: 9, bottom: 20 };
const displayQuad = (L: LidFrame): Vec3[] => [
  lidPt(L, -W / 2 + DISPLAY_INSET.side, LID_H - DISPLAY_INSET.top, 0.3),
  lidPt(L, W / 2 - DISPLAY_INSET.side, LID_H - DISPLAY_INSET.top, 0.3),
  lidPt(L, W / 2 - DISPLAY_INSET.side, DISPLAY_INSET.bottom, 0.3),
  lidPt(L, -W / 2 + DISPLAY_INSET.side, DISPLAY_INSET.bottom, 0.3),
];

// Hinge: a black bar along the back edge, between the deck and the lid.
// It sits on top of / just behind the deck's back edge (never inside the base), so it
// doesn't show through the see-through deck.
const HINGE_FACES = box(-W / 2 + 14, W / 2 - 14, 0, 3, -D / 2 - 5, -D / 2 + 1, "var(--laptop-key)", "var(--laptop-key)").map(
  (f) => ({ ...f, stroke: "var(--laptop-key)" }),
);
const BASE_FACES = box(-W / 2, W / 2, -T, 0, -D / 2, D / 2, "var(--laptop-metal)", "var(--laptop-metal-shade)");
const TRACKPAD: Vec3[] = [
  [-75, 0.15, D / 2 - 108],
  [75, 0.15, D / 2 - 108],
  [75, 0.15, D / 2 - 12],
  [-75, 0.15, D / 2 - 12],
];
// Thumb scoop: shallow notch in the front top edge.
const SCOOP: Vec3[] = Array.from({ length: 17 }, (_, i) => {
  const x = -32 + (64 * i) / 16;
  return [x, -3.2 * (1 - (x / 32) ** 2), D / 2 + 0.2];
});

function keyQuads(k: KeyRect) {
  const g = (GAP / 2) * U;
  const gz = k.d < U ? g * 0.5 : g;
  const base: Vec3[] = [
    [k.x + g, 0.2, k.z + gz],
    [k.x + k.w - g, 0.2, k.z + gz],
    [k.x + k.w - g, 0.2, k.z + k.d - gz],
    [k.x + g, 0.2, k.z + k.d - gz],
  ];
  const i = INSET * U;
  const top: Vec3[] = [
    [k.x + g + i, KEY_H, k.z + gz + i * 0.4],
    [k.x + k.w - g - i, KEY_H, k.z + gz + i * 0.4],
    [k.x + k.w - g - i, KEY_H, k.z + k.d - gz - i * 1.4],
    [k.x + g + i, KEY_H, k.z + k.d - gz - i * 1.4],
  ];
  return { base, top };
}

const KEY_QUADS = KEYS.map((k) => ({ ...keyQuads(k), label: k.label, touch: k.touch }));

// Power mark (same geometry as components/Logo.tsx PowerAt) on the Touch ID key top.
function powerMark(k: KeyRect): { ring: Vec3[]; stem: Vec3[] } {
  const s = (0.52 * U) / 24;
  const cx = k.x + k.w / 2;
  const cz = k.z + k.d * 0.47;
  const m = (px: number, py: number): Vec3 => [cx + (px - 12) * s, KEY_H + 0.05, cz + (py - 12) * s];
  const a0 = Math.atan2(6.2 - 12, 16.6 - 12);
  const a1 = Math.atan2(6.2 - 12, 7.4 - 12);
  const span = (a1 - a0 + 2 * Math.PI) % (2 * Math.PI);
  const ring = Array.from({ length: 41 }, (_, i) => {
    const a = a0 + (span * i) / 40;
    return m(12 + 8.4 * Math.cos(a), 12 + 8.4 * Math.sin(a));
  });
  return { ring, stem: [m(12, 2.6), m(12, 11.4)] };
}
const TOUCH = KEYS.find((k) => k.touch)!;
const POWER = powerMark(TOUCH);

// ---- Projection ---------------------------------------------------------------
export type Pose = {
  /** Laptop center on screen, in viewport px. */
  cx: number;
  cy: number;
  /** Viewport size (camera sits at its center). */
  vw: number;
  vh: number;
  /** px per mm. */
  scale: number;
  /** Extra lid closing (radians) on top of the resting angle; 0 = resting. */
  close?: number;
};

export type Frame = {
  faces: { d: string; fill: string; stroke?: string; sw?: number }[];
  display: string;
  trackpad: string;
  scoop: string;
  keys: { base: string; top: string }[];
  letters: { label: string; base: string; top: string; transform: string }[];
  touch: { base: string; top: string; ring: string; stem: string };
};

/** Model a 2D projector for a pose; returns points relative to (originX, originY). */
function projector(pose: Pose, originX: number, originY: number) {
  const { cx, cy, vw, vh, scale } = pose;
  const ox = cx - vw / 2;
  const oy = cy - vh / 2;
  const cam = (p: Vec3): Vec3 => {
    const [x, y, z] = rot(p);
    return [ox + x * scale, oy - y * scale, z * scale];
  };
  const proj = (p: Vec3): Pt => {
    const [X, Y, Z] = cam(p);
    const k = FOCAL / (FOCAL - Z);
    return [vw / 2 + X * k - originX, vh / 2 + Y * k - originY];
  };
  /** Back-face test in camera space (camera at (0, 0, FOCAL)). */
  const visible = (pts: Vec3[], n: Vec3) => {
    const c = pts.reduce<Vec3>((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length, a[2] + p[2] / pts.length], [0, 0, 0]);
    const [X, Y, Z] = cam(c);
    const [nx, ny, nz] = rot(n);
    const N: Vec3 = [nx, -ny, nz];
    return N[0] * -X + N[1] * -Y + N[2] * (FOCAL - Z) > 0;
  };
  const depth = (pts: Vec3[]) => pts.reduce((a, p) => a + cam(p)[2], 0) / pts.length;
  return { proj, visible, depth };
}

const fmt = (pts: Pt[]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

export function projectLaptop(pose: Pose, originX: number, originY: number): Frame {
  const { proj, visible, depth } = projector(pose, originX, originY);
  const poly = (pts: Vec3[]) => fmt(pts.map(proj));
  const path = (pts: Vec3[]) => "M" + pts.map(proj).map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L");

  // Lid first (farthest), then hinge, then base; each set back-face culled and depth sorted.
  const sorted = (fs: Face[]) =>
    fs.filter((f) => visible(f.pts, f.normal)).sort((a, b) => depth(a.pts) - depth(b.pts));
  const L = lidFrame(LID_TILT - (pose.close ?? 0));
  const faces = [...sorted(lidFaces(L)), ...sorted(HINGE_FACES), ...sorted(BASE_FACES)].map((f) => ({
    d: poly(f.pts),
    fill: f.fill,
    stroke: f.stroke,
  }));

  const keys: Frame["keys"] = [];
  const letters: Frame["letters"] = [];
  let touch: Frame["touch"] = { base: "", top: "", ring: "", stem: "" };
  for (const k of KEY_QUADS) {
    if (k.touch) {
      touch = { base: poly(k.base), top: poly(k.top), ring: path(POWER.ring), stem: path(POWER.stem) };
    } else if (k.label) {
      const [p0, p1, , p3] = k.top.map(proj);
      const m = [p1[0] - p0[0], p1[1] - p0[1], p3[0] - p0[0], p3[1] - p0[1], p0[0], p0[1]];
      letters.push({ label: k.label, base: poly(k.base), top: poly(k.top), transform: `matrix(${m.map((v) => v.toFixed(3)).join(" ")})` });
    } else {
      keys.push({ base: poly(k.base), top: poly(k.top) });
    }
  }

  return {
    faces,
    display: poly(displayQuad(L)),
    trackpad: poly(TRACKPAD),
    scoop: path(SCOOP),
    keys,
    letters,
    touch,
  };
}

/** Projected bounds of the whole laptop for a pose (for fitting it to its box). */
export function laptopBounds(pose: Pose) {
  const { proj } = projector(pose, 0, 0);
  const pts: Vec3[] = [...BASE_FACES.flatMap((f) => f.pts), ...lidFaces(lidFrame(LID_TILT)).flatMap((f) => f.pts)];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of pts) {
    const [x, y] = proj(p);
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
