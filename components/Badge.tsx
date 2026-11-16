import clsx from "clsx";
import type { ReactNode } from "react";
import { SmartLink } from "./SmartLink";

export type BadgeProps = {
  children: ReactNode;
  /** @deprecated v2: no-op. Status dots were removed (no meaningless dots). Kept so old call sites compile. */
  dot?: boolean;
  /** Makes the whole tag a link and adds a trailing arrow. */
  href?: string;
  className?: string;
};

/** Small bordered mono tag (dates, team jump links, short notices). Near-square, no dot. */
export function Badge({ children, dot: _dot, href, className }: BadgeProps) {
  void _dot;
  const cls = clsx(
    "group/badge inline-flex min-h-7 max-w-full items-center gap-2 rounded-control border border-border-strong px-2.5 py-1",
    "font-mono text-xs leading-snug text-fg-secondary",
    href && "transition-colors duration-150 hover:border-border-hover hover:text-fg",
    className,
  );
  const inner = (
    <>
      <span className="min-w-0">{children}</span>
      {href && (
        <span
          aria-hidden
          className="text-fg-subtle transition-[color,transform] duration-200 group-hover/badge:translate-x-0.5 group-hover/badge:text-fg"
        >
          →
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <SmartLink href={href} className={cls}>
        {inner}
      </SmartLink>
    );
  }
  return <span className={cls}>{inner}</span>;
}
