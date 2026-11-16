import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Keyboard key hint in brackets, Tech@NYU style: `[P]` in mono, brackets
 * dimmer than the key. Decorative by default (aria-hidden); expose the
 * shortcut to assistive tech with `aria-keyshortcuts` on the control instead.
 */
export function Kbd({ children, className, decorative = true }: { children: ReactNode; className?: string; decorative?: boolean }) {
  return (
    <kbd
      aria-hidden={decorative || undefined}
      className={clsx(
        "inline-flex items-baseline font-mono text-[0.92em] leading-none font-normal text-fg-muted uppercase",
        "transition-colors duration-150",
        className,
      )}
    >
      <span className="opacity-60">[</span>
      <span className="px-[0.1em]">{children}</span>
      <span className="opacity-60">]</span>
    </kbd>
  );
}
