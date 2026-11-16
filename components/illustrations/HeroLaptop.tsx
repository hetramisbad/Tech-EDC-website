"use client";

import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { laptopBounds, projectLaptop, type Frame, type Pose } from "./laptopModel";

/**
 * Home hero laptop: a live 3D MacBook-style model (laptopModel.ts), drawn as clear
 * white line art like the other illustrations (translucent faces, off-white outlines,
 * solid black keys and screen); lid sized like
 * Tech@NYU's hero TV. Like that TV, it is projected through a camera fixed at the
 * center of the viewport, so as the page scrolls its angle changes with its position
 * on screen (seen more from below as it rises under the navbar). Blank keys in a real
 * MacBook layout; E, D and C are the only labeled keys, lit by the backlight; the
 * Touch ID key is the power-button mark; the screen is plain black.
 * With reduced motion it stays at its resting angle.
 */

type Fit = { w: number; h: number; scale: number; offX: number; offY: number };

/** Fit the model into a w x h box (as if the box were centered in the viewport). */
function fitTo(w: number, h: number, vw: number, vh: number): Fit {
  let scale = 1;
  let b = laptopBounds({ cx: vw / 2, cy: vh / 2, vw, vh, scale });
  for (let i = 0; i < 3; i++) {
    scale *= Math.min((w * 0.94) / b.w, (h * 0.94) / b.h);
    b = laptopBounds({ cx: vw / 2, cy: vh / 2, vw, vh, scale });
  }
  // Model origin sits this far from the visual center of the drawing.
  return { w, h, scale, offX: vw / 2 - (b.x0 + b.x1) / 2, offY: vh / 2 - (b.y0 + b.y1) / 2 };
}

/** Frame for a box whose top-left is at (left, top) in the viewport. */
function frameAt(fit: Fit, left: number, top: number, vw: number, vh: number): Frame {
  const pose: Pose = { cx: left + fit.w / 2 + fit.offX, cy: top + fit.h / 2 + fit.offY, vw, vh, scale: fit.scale };
  return projectLaptop(pose, left, top);
}

// Server render / first paint: a nominal box centered in a 1440 x 900 viewport.
const SSR_FIT = fitTo(1000, 760, 1440, 900);
const SSR_FRAME = frameAt(SSR_FIT, 220, 70, 1440, 900);

export function HeroLaptop({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const backlight = `laptop-backlight-${uid}`;
  const [state, setState] = useState<{ fit: Fit; frame: Frame }>({ fit: SSR_FIT, frame: SSR_FRAME });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let fit: Fit | null = null;
    let raf = 0;

    const render = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (r.width < 1 || r.height < 1) return;
      if (!fit || fit.w !== r.width || fit.h !== r.height) fit = fitTo(r.width, r.height, vw, vh);
      // Reduced motion: always draw the resting angle (box centered in the viewport).
      const left = reduce.matches ? (vw - r.width) / 2 : r.left;
      const top = reduce.matches ? (vh - r.height) / 2 : r.top;
      const frame = frameAt(fit, left, top, vw, vh);
      setState({ fit, frame });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onResize = () => {
      fit = null;
      schedule();
    };

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    reduce.addEventListener("change", schedule);
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const { fit, frame } = state;
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${fit.w} ${fit.h}`}
      className={clsx("block overflow-visible", className)}
      aria-hidden="true"
      focusable="false"
      strokeLinejoin="round"
    >
      <defs>
        {/* Backlit legend: crisp letter plus a faint halo of light around it */}
        <filter id={backlight} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.05" result="halo" />
          <feMerge>
            <feMergeNode in="halo" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Chassis: lid, hinge, base (back-face culled, depth sorted) */}
      {frame.faces.map((f, i) => (
        <polygon key={i} points={f.d} fill={f.fill} stroke={f.stroke} strokeWidth="1.25" />
      ))}
      <polygon points={frame.display} fill="var(--laptop-screen)" stroke="var(--laptop-edge)" strokeWidth="0.9" />
      <path d={frame.scoop} fill="none" stroke="var(--laptop-edge)" strokeWidth="0.9" />
      <polygon points={frame.trackpad} fill="var(--laptop-metal)" stroke="var(--laptop-edge)" strokeWidth="0.9" />

      {/* Keyboard: solid black keycaps (base + top face) with a thin outline */}
      {frame.keys.map((k, i) => (
        <g key={i}>
          <polygon points={k.base} fill="var(--laptop-key)" stroke="var(--laptop-key-edge)" strokeWidth="0.6" />
          <polygon points={k.top} fill="var(--laptop-key-top)" />
        </g>
      ))}

      {/* E, D, C: black keys like the rest; the only labeled keys, lit by the backlight */}
      {frame.letters.map((k) => (
        <g key={k.label}>
          <polygon points={k.base} fill="var(--laptop-key)" stroke="var(--laptop-key-edge)" strokeWidth="0.6" />
          <polygon points={k.top} fill="var(--laptop-key-top)" />
          <text
            transform={k.transform}
            x="0.5"
            y="0.72"
            fontSize="0.62"
            fontWeight="600"
            textAnchor="middle"
            fill="var(--laptop-backlight)"
            filter={`url(#${backlight})`}
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {k.label}
          </text>
        </g>
      ))}

      {/* Touch ID key = the Tech@EDC power button */}
      <polygon points={frame.touch.base} fill="var(--laptop-key)" stroke="var(--laptop-key-edge)" strokeWidth="0.6" />
      <polygon points={frame.touch.top} fill="var(--laptop-key-top)" />
      <g fill="none" stroke="var(--laptop-mark)" strokeWidth="1.6" strokeLinecap="round">
        <path d={frame.touch.ring} />
        <path d={frame.touch.stem} />
      </g>
    </svg>
  );
}
