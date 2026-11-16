"use client";

import { useEffect, useRef } from "react";

export type NavSurface = "grid" | "plain";

/** Size of one dissolve block, in CSS px (matches the blocks in Tech@NYU's nav). */
const CELL = 8;
/** Full dissolve duration in ms (~130-160ms on Tech@NYU). */
const DURATION = 160;

/**
 * Navbar background, Tech@NYU style. The bar always shows the same surface as the
 * section underneath it, so page content is cut off cleanly at its bottom edge:
 * - "grid": the page grid + grain, aligned with the fixed page background, so over
 *   the hero the bar looks transparent;
 * - "plain": the opaque near-black of `surface-plain` sections.
 * When the surface under the bar changes, it switches with a quick blocky pixel
 * dissolve (clustered noise, 8px blocks) drawn on a pixelated canvas.
 *
 * Flicker-free by construction: one rAF loop owns all three layers. A single
 * `level` (0 = grid, 1 = plain) moves toward the target, and in the SAME frame the
 * loop redraws the canvas and sets the plain layer / canvas visibility directly on
 * the DOM. No React state is involved, so there is never a frame where a layer is
 * shown before its pixels are drawn, and reversing mid-dissolve just reverses.
 */
export function NavBackdrop({ surface }: { surface: NavSurface }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plainRef = useRef<HTMLDivElement>(null);
  const engine = useRef<Engine | null>(null);
  const initial = useRef(surface);

  useEffect(() => {
    const canvas = canvasRef.current;
    const plain = plainRef.current;
    if (!canvas || !plain) return;
    const e = createEngine(canvas, plain, initial.current === "plain" ? 1 : 0);
    engine.current = e;
    return () => {
      e.destroy();
      engine.current = null;
    };
  }, []);

  useEffect(() => {
    engine.current?.setTarget(surface === "plain" ? 1 : 0);
  }, [surface]);

  // Layer visibility is owned by the engine after mount (set directly on the DOM),
  // so these elements take no state-driven props that React could re-apply mid-dissolve.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="nav-surface-grid absolute inset-0" />
      <div ref={plainRef} className="surface-plain absolute inset-0 opacity-0" />
      <canvas ref={canvasRef} className="nav-dissolve invisible absolute inset-0 size-full" />
    </div>
  );
}

type Engine = { setTarget: (t: number) => void; destroy: () => void };

function createEngine(canvas: HTMLCanvasElement, plain: HTMLDivElement, initial: number): Engine {
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let level = initial;
  let target = initial;
  let raf = 0;
  let last = 0;
  let w = 0;
  let h = 0;
  let thr: ArrayLike<number> = [];
  let img: ImageData | null = null;
  const [r, g, b] = cssColor(getComputedStyle(canvas).getPropertyValue("--bg-plain").trim() || "#050506");

  /** Match the canvas to the bar size; only touches (and so clears) it when the size changed. */
  const ensureSize = () => {
    const rect = canvas.getBoundingClientRect();
    const nw = Math.max(1, Math.ceil(rect.width / CELL));
    const nh = Math.max(1, Math.ceil(rect.height / CELL));
    if (nw === w && nh === h && img) return;
    w = nw;
    h = nh;
    canvas.width = w;
    canvas.height = h;
    thr = clusteredNoise(w, h);
    img = ctx ? ctx.createImageData(w, h) : null;
    if (img) {
      for (let i = 0; i < w * h; i++) {
        img.data[i * 4] = r;
        img.data[i * 4 + 1] = g;
        img.data[i * 4 + 2] = b;
      }
    }
  };

  /** Draw the current level and set every layer for this frame, all at once. */
  const paint = () => {
    if (level <= 0 || level >= 1 || !ctx || !img) {
      // Settled (or no canvas support): CSS layers only. Inline styles override the
      // initial utility classes.
      plain.style.opacity = level >= 0.5 ? "1" : "0";
      canvas.style.visibility = "hidden";
      return;
    }
    for (let i = 0; i < thr.length; i++) img.data[i * 4 + 3] = thr[i] < level ? 255 : 0;
    ctx.putImageData(img, 0, 0);
    canvas.style.visibility = "visible";
    plain.style.opacity = "0";
  };

  const step = (now: number) => {
    const dt = last ? Math.min(50, now - last) : 16;
    last = now;
    const dir = Math.sign(target - level);
    level = Math.min(1, Math.max(0, level + (dir * dt) / DURATION));
    if ((dir > 0 && level >= target) || (dir < 0 && level <= target)) level = target;
    paint();
    if (level === target) {
      raf = 0;
      last = 0;
    } else {
      raf = requestAnimationFrame(step);
    }
  };

  const setTarget = (t: number) => {
    target = t;
    if (reduce.matches || !ctx) {
      cancelAnimationFrame(raf);
      raf = 0;
      level = t;
      paint();
      return;
    }
    if (level === target) {
      paint();
      return;
    }
    ensureSize();
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(step);
    }
  };

  const onResize = () => {
    w = 0; // re-measure on the next dissolve
  };
  window.addEventListener("resize", onResize);
  paint();

  return {
    setTarget,
    destroy: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    },
  };
}

/** Per-block thresholds in (0,1): smooth low-frequency noise plus fine jitter, so the
 *  dissolve spreads in irregular clusters instead of uniform static. */
function clusteredNoise(w: number, h: number): Float32Array {
  const S = 4; // coarse grid spacing, in blocks
  const cw = Math.ceil(w / S) + 2;
  const coarse = new Float32Array(cw * (Math.ceil(h / S) + 2)).map(() => Math.random());
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const gx = x / S;
      const gy = y / S;
      const x0 = Math.floor(gx);
      const y0 = Math.floor(gy);
      const fx = smooth(gx - x0);
      const fy = smooth(gy - y0);
      const a = coarse[y0 * cw + x0];
      const b = coarse[y0 * cw + x0 + 1];
      const c = coarse[(y0 + 1) * cw + x0];
      const d = coarse[(y0 + 1) * cw + x0 + 1];
      const v = (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
      out[y * w + x] = Math.min(0.995, Math.max(0.005, 0.7 * v + 0.3 * Math.random()));
    }
  }
  return out;
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function cssColor(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m.slice(0, 6);
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
