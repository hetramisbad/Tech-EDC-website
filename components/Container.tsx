import clsx from "clsx";
import type { ElementType, ReactNode } from "react";

export type ContainerProps = {
  /** "page" = 1200px (default), "narrow" = 880px, "prose" = 680px. Inset is always the responsive page inset. */
  size?: "page" | "narrow" | "prose";
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

const widths = {
  page: "",
  narrow: "[--container-max:var(--container-narrow)]",
  prose: "[--container-max:var(--container-prose)]",
};

export function Container({ size = "page", as: Tag = "div", className, children }: ContainerProps) {
  return <Tag className={clsx("container-page", widths[size], className)}>{children}</Tag>;
}
