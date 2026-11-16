"use client";

import { useSyncExternalStore } from "react";
import clsx from "clsx";

const KEY = "tech-edc-accent";

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-accent"] });
  return () => obs.disconnect();
}
const getSnapshot = () => document.documentElement.getAttribute("data-accent") !== "none";
const getServerSnapshot = () => true;

/** Styleguide-only switch: toggles <html data-accent="none"> and remembers the choice. */
export function AccentToggle() {
  const on = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const set = (blue: boolean) => {
    const d = document.documentElement;
    if (blue) d.removeAttribute("data-accent");
    else d.setAttribute("data-accent", "none");
    try {
      localStorage.setItem(KEY, blue ? "blue" : "none");
    } catch {}
  };
  const opt = (active: boolean) =>
    clsx(
      "h-7 rounded-sm px-3 font-mono text-xs transition-colors",
      active ? "bg-fg text-fg-inverse" : "text-fg-muted hover:text-fg",
    );
  return (
    <div role="group" aria-label="Accent color" className="inline-flex items-center gap-1 rounded-control border border-border-strong p-1">
      <button type="button" aria-pressed={on} className={opt(on)} onClick={() => set(true)}>
        Triton blue
      </button>
      <button type="button" aria-pressed={!on} className={opt(!on)} onClick={() => set(false)}>
        No accent
      </button>
    </div>
  );
}
