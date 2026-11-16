import { useId } from "react";
import clsx from "clsx";
import { DECK, DISPLAY, FRONT, HINGE, KEYS, LETTER_KEYS, LID, SCOOP, TOUCH_ID, TRACKPAD, VIEWBOX } from "./HeroLaptopShape";

/**
 * Home hero laptop: a MacBook-style laptop seen front-on, sized like Tech@NYU's hero
 * TV. Blank keys in a real MacBook layout (F row included); the Touch ID key is the
 * Tech@EDC power-button mark. The screen is plain black. E, D and C are the
 * only labeled keys, their letters lit by the backlight (the keys stay black). Generic on purpose: no notch, no brand marks.
 * Geometry is generated: edit scripts/gen-hero-laptop.py, not HeroLaptopShape.tsx.
 */
export function HeroLaptop({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const backlight = `laptop-backlight-${uid}`;


  return (
    <svg
      viewBox={VIEWBOX}
      className={clsx("block", className)}
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

      {/* Base: deck, front edge with thumb scoop */}
      <path d={FRONT} fill="var(--laptop-metal-shade)" stroke="var(--laptop-edge)" strokeWidth="2" />
      <path d={SCOOP} fill="none" stroke="var(--laptop-edge)" strokeWidth="1.5" />
      <polygon points={DECK} fill="var(--laptop-metal)" stroke="var(--laptop-edge)" strokeWidth="2" />
      <polygon points={TRACKPAD} fill="var(--laptop-metal-shade)" stroke="var(--laptop-edge)" strokeWidth="1.5" />

      {/* Keyboard: blank keycaps (base + top face). Stroke in the fill color rounds the corners. */}
      <g>
        {KEYS.map(([base, top], i) => (
          <g key={i}>
            <polygon points={base} fill="var(--laptop-key)" stroke="var(--laptop-key)" strokeWidth="1.2" />
            <polygon points={top} fill="var(--laptop-key-top)" />
          </g>
        ))}
        {/* E, D, C: black keys like the rest; the only labeled keys, lit by the keyboard backlight */}
        {LETTER_KEYS.map((k) => (
          <g key={k.label}>
            <polygon points={k.base} fill="var(--laptop-key)" stroke="var(--laptop-key)" strokeWidth="1.2" />
            <polygon points={k.top} fill="var(--laptop-key-top)" />
            <text
              transform={k.transform}
              x="0.5"
              y="0.69"
              fontSize="0.5"
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
        <polygon points={TOUCH_ID.base} fill="var(--laptop-key)" stroke="var(--laptop-key)" strokeWidth="1.2" />
        <polygon points={TOUCH_ID.top} fill="var(--laptop-key-top)" />
        <g fill="none" stroke="var(--laptop-mark)" strokeWidth="1.6" strokeLinecap="round">
          <path d={TOUCH_ID.ring} />
          <path d={TOUCH_ID.stem} />
        </g>
      </g>

      {/* Hinge + lid */}
      <rect {...HINGE} rx="3" fill="var(--laptop-key)" stroke="var(--laptop-key)" strokeWidth="2" />
      <rect {...LID} fill="var(--laptop-metal)" stroke="var(--laptop-edge)" strokeWidth="2" />
      <rect {...DISPLAY} fill="var(--laptop-screen)" stroke="var(--laptop-edge)" strokeWidth="1.5" />

    </svg>
  );
}
