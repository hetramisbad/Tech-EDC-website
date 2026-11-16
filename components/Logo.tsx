import { useId } from "react";
import clsx from "clsx";
import { site } from "@/content/site";

export type LogoProps = {
  /** Show the "Tech@EDC" wordmark next to the mark. Default true. */
  wordmark?: boolean;
  /** Mark size in px. Default 24. */
  size?: number;
  className?: string;
  /** Accessible label for the mark when shown without a wordmark. */
  title?: string;
};

/**
 * Tech@EDC mark: a power-button glyph knocked out of a near-square tile.
 * Single color (currentColor). Decorative when the wordmark is shown.
 */
export function LogoMark({ size = 24, title, className }: { size?: number; title?: string; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const maskId = `logo-mask-${id}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={clsx("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect width="24" height="24" fill="#fff" />
          <g fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
            <path d="M15.375 8.728A5.25 5.25 0 1 1 8.625 8.728" />
            <path d="M12 6.5V12.25" />
          </g>
        </mask>
      </defs>
      <rect width="24" height="24" rx="4" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}

export function Logo({ wordmark = true, size = 24, className, title }: LogoProps) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5 text-fg", className)}>
      <LogoMark size={size} title={wordmark ? undefined : (title ?? site.name)} />
      {wordmark && (
        <span className="text-base font-bold leading-none tracking-tight">{site.name}</span>
      )}
    </span>
  );
}
