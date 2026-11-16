import clsx from "clsx";
import { site } from "@/content/site";

export type LogoProps = {
  /** Wordmark font size in px. Default 22. */
  size?: number;
  className?: string;
};

/**
 * Power-button glyph drawn to stand in for the "@" in the wordmark.
 * Sized in em so it scales with the surrounding text; the ring spans roughly
 * the cap height plus a little, like an "@", and the stroke matches a bold
 * weight. Single color (currentColor).
 */
export function PowerAt({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      // viewBox cropped to the ink (ring + stroke) so margins around it are exact.
      viewBox="2.15 1.15 19.7 20.7"
      // The viewBox hugs the ink exactly; let antialiased stroke edges paint past it
      // instead of being clipped flat (the ring's bottom was getting cut off).
      overflow="visible"
      className={clsx("inline-block h-[var(--at-h,0.78em)] w-auto shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.9"
      strokeLinecap="round"
    >
      {/* Ring broken at the top, then the vertical stroke through the gap. */}
      <path d="M16.6 6.2A8.4 8.4 0 1 1 7.4 6.2" />
      <path d="M12 2.6V11.4" />
    </svg>
  );
}

/** @deprecated The tile mark was removed (Mark, 15 Nov). Kept as an alias of `PowerAt` for old imports. */
export function LogoMark({ size = 24, title, className }: { size?: number; title?: string; className?: string }) {
  return (
    <span style={{ fontSize: size }} className="inline-flex leading-none">
      <PowerAt title={title} className={className} />
    </span>
  );
}

/**
 * Tech@EDC wordmark, Tech@NYU style: lowercase "tech@edc" in Satoshi Bold
 * (--font-wordmark; falls back to bold BDO Grotesk until Satoshi is available),
 * with the "@" drawn as a power-button glyph. The whole mark is one accessible
 * name ("Tech@EDC"); the parts are hidden from assistive tech.
 */
export function Logo({ size = 22, className }: LogoProps) {
  return (
    <span
      role="img"
      aria-label={site.name}
      className={clsx("inline-flex items-baseline font-bold leading-none tracking-[-0.03em] text-fg", className)}
      style={{ fontSize: size, fontFamily: "var(--font-wordmark)" }}
    >
      <span aria-hidden="true">tech</span>
      <PowerAt className="mr-[0.051em] ml-[0.064em]" />
      <span aria-hidden="true">edc</span>
    </span>
  );
}
