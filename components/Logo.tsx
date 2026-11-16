import clsx from "clsx";
import { site } from "@/content/site";

export type LogoProps = {
  /** Wordmark font size in px. Default 26 (Tech@NYU's navbar wordmark size). */
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
      viewBox="0 0 24 24"
      className={clsx("inline-block h-[0.86em] w-[0.86em] shrink-0 align-[-0.1em]", className)}
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
 * Tech@EDC wordmark, Tech@NYU style: lowercase "tech@edc" in bold BDO Grotesk,
 * with the "@" drawn as a power-button glyph. The whole mark is one accessible
 * name ("Tech@EDC"); the parts are hidden from assistive tech.
 */
export function Logo({ size = 26, className }: LogoProps) {
  return (
    <span
      role="img"
      aria-label={site.name}
      className={clsx("inline-flex items-baseline font-sans font-bold leading-none tracking-[-0.03em] text-fg", className)}
      style={{ fontSize: size }}
    >
      <span aria-hidden="true">tech</span>
      <PowerAt className="mx-[0.04em]" />
      <span aria-hidden="true">edc</span>
    </span>
  );
}
