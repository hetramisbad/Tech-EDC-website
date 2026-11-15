import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Keyboard key hint, Linear-style: mono, muted, hairline border.
 * Decorative by default (aria-hidden); expose the shortcut to assistive tech
 * with `aria-keyshortcuts` on the control instead.
 */
export function Kbd({ children, className, decorative = true }: { children: ReactNode; className?: string; decorative?: boolean }) {
  return (
    <kbd
      aria-hidden={decorative || undefined}
      className={clsx(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] border border-border-strong bg-surface-raised/60 px-1 pt-px",
        "font-mono text-[10px] leading-none font-medium text-fg-subtle uppercase",
        "transition-colors duration-150",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
