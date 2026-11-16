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
 * focus the cover is removed block by block, spreading out from the point where the
 * cursor entered (the center for keyboard focus); on leave it fills back in,
 * starting from the point where the cursor left.
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

    /** Block grid with thresholds by distance from (ox, oy), in cover px.
     *  `fromOrigin`: blocks near the origin go first as `level` rises (reveal);
     *  otherwise they go first as `level` falls (refill starts there). */
    const layout = (ox: number, oy: number, fromOrigin: boolean) => {
      const w = cover.offsetWidth;
      const h = cover.offsetHeight;
      const cols = Math.max(1, Math.ceil(w / CELL));
      const rows = Math.max(1, Math.ceil(h / CELL));
      const far = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy)) || 1;
      cells = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const d = Math.hypot(x * CELL + CELL / 2 - ox, y * CELL + CELL / 2 - oy) / far;
          // Mostly by distance, with a little jitter so the front reads as pixels.
          const near = Math.min(0.999, Math.max(0.001, d * 0.82 + Math.random() * 0.18));
          cells.push({ x: x * CELL, y: y * CELL, t: fromOrigin ? near : 1 - near });
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

    /** Start revealing (t = 1) or refilling (t = 0) from a point in cover px. */
    const go = (t: number, ox: number, oy: number) => {
      // Re-seed the pattern from the new point only when settled; reversing
      // mid-dissolve keeps the current pattern so nothing jumps.
      if (level === 0 || level === 1) layout(ox, oy, t === 1);
      target = t;
      if (reduce.matches) {
        cancelAnimationFrame(raf);
        raf = 0;
        level = t;
        paint();
        return;
      }
      if (!raf && level !== target) {
        last = 0;
        raf = requestAnimationFrame(step);
      }
    };

    const at = (e: PointerEvent) => {
      const r = cover.getBoundingClientRect();
      return [Math.min(r.width, Math.max(0, e.clientX - r.left)), Math.min(r.height, Math.max(0, e.clientY - r.top))] as const;
    };
    const center = () => [cover.offsetWidth / 2, cover.offsetHeight / 2] as const;
    const onEnter = (e: PointerEvent) => go(1, ...at(e));
    const onLeave = (e: PointerEvent) => {
      if (!host.matches(":focus-visible")) go(0, ...at(e));
    };
    const onFocus = () => go(1, ...center());
    const onBlur = () => {
      if (!host.matches(":hover")) go(0, ...center());
    };
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("focus", onFocus);
    host.addEventListener("blur", onBlur);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("focus", onFocus);
      host.removeEventListener("blur", onBlur);
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
