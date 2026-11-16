import clsx from "clsx";
import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

/** Bordered empty state, e.g. "Roster coming soon" on /team. */
export function EmptyState({
  eyebrow,
  title,
  children,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative flex flex-col items-center gap-3 overflow-hidden rounded-card border border-dashed border-border-strong bg-surface px-6 py-16 text-center grain",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-h3 text-fg">{title}</h2>
      {children && <div className="max-w-[460px] text-sm text-fg-muted sm:text-[0.9375rem]">{children}</div>}
      {actions && <div className="mt-4 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
