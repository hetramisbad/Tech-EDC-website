"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import clsx from "clsx";
import { Icon } from "./Icon";

export type AccordionItem = { q: string; a: ReactNode };

export type AccordionProps = {
  items: AccordionItem[];
  /** Allow several panels open at once. Default false (opening one closes the others). */
  multiple?: boolean;
  /** Index open on first render. Default none. */
  defaultOpen?: number;
  /** Heading level wrapping each trigger. Default "h3". */
  headingAs?: "h2" | "h3" | "h4";
  className?: string;
};

/**
 * Accessible accordion (WAI-ARIA pattern). Triggers are buttons with
 * aria-expanded/aria-controls; Up/Down/Home/End move between triggers.
 */
export function Accordion({ items, multiple = false, defaultOpen, headingAs: H = "h3", className }: AccordionProps) {
  const base = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen !== undefined ? [defaultOpen] : []));
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(multiple ? prev : prev.has(i) ? [i] : []);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = items.length;
    const target =
      e.key === "ArrowDown" ? (i + 1) % n :
      e.key === "ArrowUp" ? (i - 1 + n) % n :
      e.key === "Home" ? 0 :
      e.key === "End" ? n - 1 : null;
    if (target === null) return;
    e.preventDefault();
    triggers.current[target]?.focus();
  };

  return (
    <div className={clsx("border-t border-border", className)}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const tid = `${base}-t${i}`;
        const pid = `${base}-p${i}`;
        return (
          <div key={tid} className="border-b border-border">
            <H className="m-0">
              <button
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                id={tid}
                type="button"
                aria-expanded={isOpen}
                aria-controls={pid}
                onClick={() => toggle(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium text-fg-secondary transition-colors duration-150 hover:text-fg aria-expanded:text-fg sm:text-[1.0625rem]"
              >
                <span>{item.q}</span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-fg-muted transition-colors group-hover:border-border-hover group-hover:text-fg">
                  <Icon name="plus" size={14} className="accordion-icon" />
                </span>
              </button>
            </H>
            <div id={pid} role="region" aria-labelledby={tid} className="accordion-panel" data-open={isOpen} inert={!isOpen}>
              <div>
                <div className="max-w-[640px] pb-6 pr-12 text-[0.9375rem] leading-relaxed text-fg-muted">{item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
