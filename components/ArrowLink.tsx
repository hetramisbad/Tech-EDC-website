import clsx from "clsx";
import type { ReactNode } from "react";
import { SmartLink } from "./SmartLink";

export type ArrowLinkProps = {
  /** Omit inside a linked <Card/> to render a non-interactive span (avoids nested links). */
  href?: string;
  external?: boolean;
  children?: ReactNode;
  className?: string;
};

/** "Learn more →". Arrow nudges right on hover (also when its parent .group card is hovered). */
export function ArrowLink({ href, external, children = "Learn more", className }: ArrowLinkProps) {
  const cls = clsx(
    "group/arrow inline-flex items-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors duration-150",
    "hover:text-accent group-hover:text-fg",
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      <span
        aria-hidden
        className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover/arrow:translate-x-0.5"
      >
        →
      </span>
    </>
  );
  if (!href) return <span className={cls}>{inner}</span>;
  return (
    <SmartLink href={href} external={external} className={cls}>
      {inner}
    </SmartLink>
  );
}
