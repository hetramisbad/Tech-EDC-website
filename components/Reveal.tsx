"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

export type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** Delay in ms (stagger siblings by ~60–80ms). */
  delay?: number;
  className?: string;
};

/**
 * Fade-and-rise on scroll. Content is visible without JS and under reduced
 * motion; only elements that start below the fold are animated.
 */
export function Reveal({ children, as: Tag = "div", delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return; // already visible: no animation
    el.dataset.reveal = "pending";
    if (delay) el.style.transitionDelay = `${delay}ms`;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.reveal = "shown";
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
