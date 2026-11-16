import clsx from "clsx";
import type { ReactNode } from "react";

/** Small mono label (mixed case) above headings, for dates and meta. */
export function Eyebrow({ children, className, as: Tag = "p" }: { children: ReactNode; className?: string; as?: "p" | "span" | "div" }) {
  return <Tag className={clsx("label-mono text-fg-muted", className)}>{children}</Tag>;
}
