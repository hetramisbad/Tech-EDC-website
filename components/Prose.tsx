import clsx from "clsx";
import type { ReactNode } from "react";

/** Long-form typography for blog posts / MDX. Styles live in globals.css (.prose). */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("prose", className)}>{children}</div>;
}
