"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { navItems, site, type NavItem } from "@/content/site";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Kbd } from "./Kbd";
import { SmartLink, isHttp } from "./SmartLink";

/**
 * Single-key navbar shortcuts (parity with techatnyu.org), keyed by nav label.
 * Lowercase key, no modifiers. Shown as <Kbd> hints on desktop.
 */
export const NAV_SHORTCUTS: Record<string, string> = {
  Programs: "p",
  Events: "e",
  Team: "t",
  Blog: "b",
  Contact: "c",
};

/** Label rendered as a secondary button at the right on desktop instead of a text link. */
const BUTTON_ITEM = "Contact";

function isTypingTarget(el: Element | null) {
  if (!el || !(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function dialogOpen() {
  return Boolean(document.querySelector('dialog[open], [role="dialog"][aria-modal="true"], [role="alertdialog"]'));
}

/**
 * Sticky translucent navbar. Links from `navItems` (content/site.ts).
 * Desktop: text links with key hints, then Contact (secondary) + Join Discord (primary).
 * Below 840px the links collapse into a disclosure menu; Join Discord stays visible.
 * Shortcuts: P Programs, E Events, T Team, B Blog, C Contact.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lastPath = useRef(pathname);

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  // Close on route change.
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      setOpen(false); // sync menu with navigation
    }
  }, [pathname]);

  // Hairline appears once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Esc closes; focus moves into the menu on open; close if viewport grows past the breakpoint.
  useEffect(() => {
    if (!open) return;
    const first = sheetRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
      }
    };
    const mq = window.matchMedia("(min-width: 840px)");
    const onMq = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  // Single-key shortcuts.
  useEffect(() => {
    const go = (item: NavItem) => {
      const { href } = item;
      if (href.startsWith("/#")) {
        const id = href.slice(2);
        const target = pathname === "/" ? document.getElementById(id) : null;
        if (target) {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
          history.replaceState(null, "", href);
        } else {
          router.push(href);
        }
      } else if (isHttp(href)) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else if (/^(mailto|tel):/i.test(href)) {
        window.location.href = href;
      } else {
        router.push(href);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || e.isComposing) return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (open || dialogOpen()) return;
      if (isTypingTarget(e.target as Element) || isTypingTarget(document.activeElement)) return;
      const key = e.key.toLowerCase();
      const item = navItems.find((n) => NAV_SHORTCUTS[n.label] === key);
      if (!item) return;
      e.preventDefault();
      go(item);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, pathname, router]);

  // Close when focus leaves the navbar entirely (keyboard users tabbing out).
  const onBlur = (e: React.FocusEvent) => {
    if (open && e.relatedTarget && !navRef.current?.contains(e.relatedTarget as Node)) close(false);
  };

  const linkItems = navItems.filter((n) => n.label !== BUTTON_ITEM);
  const buttonItem = navItems.find((n) => n.label === BUTTON_ITEM);
  const shortcut = (label: string) => NAV_SHORTCUTS[label]?.toUpperCase();

  return (
    <header className="sticky top-0 z-50">
      <nav
        ref={navRef}
        aria-label="Main"
        onBlur={onBlur}
        className={clsx(
          "relative border-b bg-overlay backdrop-blur-xl backdrop-saturate-150 transition-colors duration-200",
          scrolled || open ? "border-border" : "border-transparent",
        )}
      >
        <div className="container-page grid h-[var(--nav-height)] grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="-m-1 flex justify-self-start rounded-control p-1" aria-label={`${site.name} home`}>
            <Logo />
          </Link>

          <ul className="hidden items-center gap-0.5 md:flex">
            {linkItems.map((item) => {
              const k = shortcut(item.label);
              return (
                <li key={item.label}>
                  <SmartLink
                    href={item.href}
                    external={item.external}
                    aria-keyshortcuts={k}
                    aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                    className="group/nav inline-flex items-center gap-2 rounded-control px-2.5 py-2 text-sm text-fg-muted transition-colors duration-150 hover:text-fg aria-[current=page]:text-fg lg:px-3"
                  >
                    {k && <Kbd className="group-hover/nav:border-border-hover group-hover/nav:text-fg-muted">{k}</Kbd>}
                    <span>{item.label}</span>
                  </SmartLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 justify-self-end">
            {buttonItem && (
              // Wrapper controls visibility: Button's own `inline-flex` would beat a `hidden` class on it.
              <div className="hidden md:flex">
                <Button
                  href={buttonItem.href}
                  external={buttonItem.external}
                  variant="secondary"
                  size="sm"
                  kbd={shortcut(buttonItem.label)}
                  aria-keyshortcuts={shortcut(buttonItem.label)}
                >
                  {buttonItem.label}
                </Button>
              </div>
            )}
            <Button href={site.links.discord} size="sm" variant="primary">
              Join Discord
            </Button>
            <button
              ref={buttonRef}
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-control border border-border-strong text-fg transition-colors hover:bg-surface-raised md:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? "close" : "menu"} size={16} />
            </button>
          </div>
        </div>

        <div
          id={menuId}
          ref={sheetRef}
          data-open={open}
          className="nav-sheet absolute inset-x-0 top-full h-[calc(100dvh-var(--nav-height))] overflow-y-auto border-t border-border bg-bg md:hidden"
          inert={!open}
        >
          <ul className="container-page flex flex-col py-4">
            {navItems.map((item) => (
              <li key={item.label} className="border-b border-border">
                <SmartLink
                  href={item.href}
                  external={item.external}
                  onClick={() => close(false)}
                  aria-keyshortcuts={shortcut(item.label)}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  className="flex items-center justify-between py-4 text-lg font-medium text-fg-secondary transition-colors hover:text-fg aria-[current=page]:text-fg"
                >
                  <span>{item.label}</span>
                  <Icon name={item.external ? "arrow-up-right" : "arrow-right"} className="text-fg-subtle" />
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

function isCurrent(pathname: string, href: string) {
  if (!href.startsWith("/") || href.includes("#")) return false;
  const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);
  return norm(pathname).startsWith(norm(href)) && href !== "/";
}
