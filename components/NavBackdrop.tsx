"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export type NavSurface = "grid" | "plain";

/** Size of one dissolve block, in CSS px (matches the blocks in Tech@NYU's nav). */
const CELL = 8;
/** Dissolve duration in ms (~130-160ms on Tech@NYU). */
const DURATION = 160;

/**
 * Navbar background, Tech@NYU style. The bar always shows the same surface as the
 * section underneath it, so page content is cut off cleanly at its bottom edge:
 * - "grid": the page grid + grain, aligned with the fixed page background, so over
 *   the hero the bar looks transparent;
 * - "plain": the opaque near-black of `surface-plain` sections.
 * When the surface under the bar changes, it switches with a quick blocky pixel
 * dissolve (clustered noise, 8px blocks) drawn on a pixelated canvas.
 */
export function NavBackdrop({ surface }: { surface: NavSurface }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shown, setShown] = useState<NavSurface>(surface);
  const [animating, setAnimating] = useState(false);
  const thresholds = useRef<{ w: number; h: number; t: Float32Array } | null>(null);
  const current = useRef<NavSurface>(surface);

  useEffect(() => {
    if (surface === current.current) return;
    current.current = surface;
    const canvas = canvasRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvas || reduce) {
      setShown(surface); // instant switch
      return;
    }

    // One canvas pixel per block; CSS scales it up with crisp (pixelated) edges.
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.ceil(rect.width / CELL));
    const h = Math.max(1, Math.ceil(rect.height / CELL));
    if (!thresholds.current || thresholds.current.w !== w || thresholds.current.h !== h) {
      thresholds.current = { w, h, t: clusteredNoise(w, h) };
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setShown(surface);
      return;
    }
    const [r, g, b] = cssColor(getComputedStyle(canvas).getPropertyValue("--bg-plain").trim() || "#050506");
    const img = ctx.createImageData(w, h);
    const t = thresholds.current.t;
    const toPlain = surface === "plain";

    // Grid layer stays underneath; the canvas paints plain blocks over it.
    setShown("grid");
    setAnimating(true);
    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // toPlain: blocks with threshold < p turn plain. toGrid: they turn back to grid.
      for (let i = 0; i < t.length; i++) {
        const plain = toPlain ? t[i] < p : t[i] >= p;
        const o = i * 4;
        img.data[o] = r;
        img.data[o + 1] = g;
        img.data[o + 2] = b;
        img.data[o + 3] = plain ? 255 : 0;
      }
      ctx.putImageData(img, 0, 0);
      if (p < 1) raf = requestAnimationFrame(frame);
      else {
        setShown(surface);
        setAnimating(false);
        ctx.clearRect(0, 0, w, h);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [surface]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="nav-surface-grid absolute inset-0" />
      <div className={clsx("surface-plain absolute inset-0", shown === "plain" && !animating ? "opacity-100" : "opacity-0")} />
      <canvas ref={canvasRef} className={clsx("nav-dissolve absolute inset-0 size-full", !animating && "invisible")} />
    </div>
  );
}

/** Per-block thresholds in [0,1): smooth low-frequency noise plus fine jitter, so the
 *  dissolve spreads in irregular clusters instead of uniform static. */
function clusteredNoise(w: number, h: number): Float32Array {
  const S = 4; // coarse grid spacing, in blocks
  const cw = Math.ceil(w / S) + 2;
  const ch = Math.ceil(h / S) + 2;
  const coarse = new Float32Array(cw * ch).map(() => Math.random());
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
      const bb = coarse[y0 * cw + x0 + 1];
      const c = coarse[(y0 + 1) * cw + x0];
      const d = coarse[(y0 + 1) * cw + x0 + 1];
      const v = (a * (1 - fx) + bb * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
      out[y * w + x] = Math.min(0.999, 0.7 * v + 0.3 * Math.random());
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
