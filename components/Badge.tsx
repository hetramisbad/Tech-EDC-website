import clsx from "clsx";
import type { ReactNode } from "react";
import { SmartLink } from "./SmartLink";
import { Icon } from "./Icon";

export type BadgeProps = {
  children: ReactNode;
  /** Show the small accent dot (with a soft pulse). Default false. */
  dot?: boolean;
  /** Makes the whole pill a link and adds a trailing arrow. */
  href?: string;
  className?: string;
};

/** Pill badge, e.g. the announcement above the hero headline. */
export function Badge({ children, dot = false, href, className }: BadgeProps) {
  const cls = clsx(
    "group/badge inline-flex min-h-7 max-w-full items-center gap-2 rounded-[14px] border border-border-strong bg-surface/80 px-3 py-1 text-xs leading-snug font-medium text-fg-secondary",
    href && "transition-colors duration-150 hover:border-border-hover hover:text-fg",
    className,
  );
  const inner = (
    <>
      {dot && (
        <span aria-hidden className="relative flex size-1.5">
          <span className="absolute inset-0 rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
          <span className="relative size-1.5 rounded-full bg-accent" />
        </span>
      )}
      <span className="min-w-0">{children}</span>
      {href && (
        <Icon
          name="arrow-right"
          size={12}
          className="text-fg-muted transition-transform duration-200 group-hover/badge:translate-x-0.5"
        />
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
