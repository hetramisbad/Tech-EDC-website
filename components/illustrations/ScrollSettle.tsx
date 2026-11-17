"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-driven "falls into place" for the illustrations that show a piece hovering
 * over its spot with dashed guides (Build Cohort module, Join Us envelope).
 *
 * Progress p runs 0 -> 1 while the drawing scrolls up into view: 0 when its center
 * is at the bottom edge of the viewport, 1 once its center reaches ~55% of the
 * viewport height. It is scroll-linked (scrolling back up lifts the piece again).
 *
 * - <ScrollSettle drop={n}>: the piece, drawn at its RESTING (lifted) position, is
 *   moved down by `drop` SVG units as p goes to 1, with an ease-out so it lands softly.
 *   In this isometric projection lowering by n along z is exactly n units down on
 *   screen, so `drop` is the z distance to the seat.
 * - <ScrollSettle fade>: the dashed guides; they fade out as the piece lands.
 *
 * Server render / no JS / reduced motion: the original drawing (p = 0), unchanged.
 */
export function ScrollSettle({ drop = 0, fade = false, children }: { drop?: number; fade?: boolean; children: ReactNode }) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = ref.current;
    const svg = g?.ownerSVGElement;
    if (!g || !svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const apply = (p: number) => {
      if (drop) g.setAttribute("transform", `translate(0 ${(drop * easeOut(p)).toFixed(2)})`);
      if (fade) g.style.opacity = String(1 - smooth(Math.min(1, p * 1.15)));
    };
    const update = () => {
      raf = 0;
      if (reduce.matches) return apply(0);
      const r = svg.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      apply(clamp((vh - center) / (vh * 0.45)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduce.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduce.removeEventListener("change", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [drop, fade]);

  return <g ref={ref}>{children}</g>;
}

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (t: number) => t * t * (3 - 2 * t);
/** Ease-out cubic: quick at first, settling gently into the seat. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;
