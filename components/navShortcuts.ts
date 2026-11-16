/**
 * Single-key navbar shortcuts (parity with techatnyu.org), keyed by nav label.
 * Lowercase key, no modifiers. Shown as `[P]` bracket hints on desktop.
 * Lives outside Navbar.tsx ("use client") so Server Components can read it.
 */
export const NAV_SHORTCUTS: Record<string, string> = {
  Programs: "p",
  Events: "e",
  Team: "t",
  Blog: "b",
  Contact: "c",
};
