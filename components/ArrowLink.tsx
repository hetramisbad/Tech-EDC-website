import clsx from "clsx";
import type { ReactNode } from "react";
import { SmartLink, isHttp } from "./SmartLink";

export type ArrowLinkProps = {
  /** Omit inside a linked <Card/> to render a non-interactive span (avoids nested links). */
  href?: string;
  /** Shows ↗ instead of → (also automatic for http links). */
  external?: boolean;
  children?: ReactNode;
  className?: string;
};

/** "Learn more ↗" / "Learn more →". Arrow nudges on hover (also when its parent .group card is hovered). */
export function ArrowLink({ href, external, children = "Learn more", className }: ArrowLinkProps) {
  const out = external || (href ? isHttp(href) : false);
  const cls = clsx(
    "group/arrow inline-flex items-center gap-1 text-[0.9375rem] text-fg-muted transition-colors duration-150",
    "hover:text-accent group-hover:text-fg",
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      <span
        aria-hidden
        className={clsx(
          "transition-transform duration-200 ease-out",
          out
            ? "group-hover:-translate-y-px group-hover:translate-x-px group-hover/arrow:-translate-y-px group-hover/arrow:translate-x-px"
            : "group-hover:translate-x-0.5 group-hover/arrow:translate-x-0.5",
        )}
      >
        {out ? "↗" : "→"}
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
