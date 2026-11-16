"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";

/** Block size in CSS px (same 8px blocks as the navbar dissolve). */
const CELL = 8;
/** Full sweep duration in ms. */
const DURATION = 220;

/**
 * Pixel-dissolve hover for solid buttons (the navbar's dissolve, but directional).
 * Renders the button's "resting" face (solid white, dark label) as a layer over the
 * button, whose own styling is the hover face (outline, light label). On hover or
 * focus the cover is removed block by block in a diagonal sweep from the bottom-left
 * corner to the top-right; on leave it fills back in the same way.
 *
 * With reduced motion the cover shows / hides at once; without JS the button just
 * stays solid. Place it as the last child of a `relative` element.
 */
export function PixelCover({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cover = ref.current;
    const host = cover?.parentElement;
    if (!cover || !host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let level = 0; // 0 = fully covered (resting), 1 = fully uncovered (hover)
    let target = 0;
    let raf = 0;
    let last = 0;
    let cells: { x: number; y: number; t: number }[] = [];
    let size = "";

    const layout = () => {
      const w = cover.offsetWidth;
      const h = cover.offsetHeight;
      const key = `${w}x${h}`;
      if (key === size) return;
      size = key;
      const cols = Math.max(1, Math.ceil(w / CELL));
      const rows = Math.max(1, Math.ceil(h / CELL));
      cells = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Diagonal from bottom-left (0) to top-right (1), with a little jitter so
          // the front reads as pixels rather than a straight wipe.
          const along = (x / Math.max(1, cols - 1) + (rows - 1 - y) / Math.max(1, rows - 1)) / 2;
          const t = Math.min(0.999, Math.max(0.001, along * 0.82 + Math.random() * 0.18));
          cells.push({ x: x * CELL, y: y * CELL, t });
        }
      }
    };

    const paint = () => {
      if (level <= 0) {
        cover.style.clipPath = "";
        cover.style.visibility = "";
        return;
      }
      if (level >= 1) {
        cover.style.visibility = "hidden";
        return;
      }
      // Keep the blocks not yet swept away.
      let d = "";
      for (const c of cells) if (c.t >= level) d += `M${c.x} ${c.y}h${CELL}v${CELL}h-${CELL}z`;
      cover.style.visibility = "";
      cover.style.clipPath = d ? `path("${d}")` : "inset(50%)";
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
      } else raf = requestAnimationFrame(step);
    };

    const go = (t: number) => {
      target = t;
      if (reduce.matches) {
        cancelAnimationFrame(raf);
        raf = 0;
        level = t;
        paint();
        return;
      }
      layout();
      if (!raf && level !== target) {
        last = 0;
        raf = requestAnimationFrame(step);
      }
    };

    const on = () => go(1);
    const off = () => {
      if (!host.matches(":hover") && !host.matches(":focus-visible")) go(0);
    };
    host.addEventListener("pointerenter", on);
    host.addEventListener("pointerleave", off);
    host.addEventListener("focus", on);
    host.addEventListener("blur", off);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointerenter", on);
      host.removeEventListener("pointerleave", off);
      host.removeEventListener("focus", on);
      host.removeEventListener("blur", off);
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className={clsx(
        "pointer-events-none absolute -inset-px flex items-center justify-center rounded-[inherit]",
        className,
      )}
    >
      {children}
    </span>
  );
}
