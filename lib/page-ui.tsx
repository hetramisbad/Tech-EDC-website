// Small layout pieces shared by the Pages routes. Built only from Design's
// tokens and components; if Design wants these in components/, move them.

import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Container, Eyebrow, Icon } from "@/components";

/**
 * Two-column section (Tech@NYU "Overview"): heading on the left (sticky on
 * wide screens), content on the right. Same vertical rhythm as <Section/>.
 */
export function SplitSection({
  id,
  eyebrow,
  title,
  intro,
  surface = "grid",
  children,
}: {
  id: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** Same as <Section surface>: "grid" (default, transparent) or "plain" (opaque black band). */
  surface?: "grid" | "plain";
  children: ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={clsx("section-space", surface === "plain" && "surface-plain")}>
      <Container>
        <div className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <div className="flex flex-col gap-4 md:sticky md:top-[calc(var(--nav-height)+32px)] md:self-start">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2 id={headingId} className="text-h2 text-fg">
              {title}
            </h2>
            {intro && <p className="max-w-[440px] text-lg text-fg-muted">{intro}</p>}
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  );
}

/** Requirements / deliverables list: a plain check glyph, no badge or circle behind it. */
export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-fg-secondary sm:text-base">
          <span aria-hidden className="mt-[3px] shrink-0 text-fg-subtle sm:mt-1">
            <Icon name="check" size={14} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Centered closing block under a section (Tech@NYU program "Application"):
 * an optional button, then a mono prompt and the club email with ↗.
 */
export function ContactLine({ prompt, email, action }: { prompt: ReactNode; email: string; action?: ReactNode }) {
  return (
    <div className="mt-12 flex flex-col items-center gap-6 text-center">
      {action}
      <div className="flex flex-col items-center gap-1.5">
        <p className="label-mono text-fg-muted">{prompt}</p>
        <a
          href={`mailto:${email}`}
          className="group/mail inline-flex items-center gap-1 font-mono text-sm text-fg underline decoration-border-hover underline-offset-4 transition-colors hover:text-accent hover:decoration-current"
        >
          {email}
          <span aria-hidden className="transition-transform duration-200 group-hover/mail:-translate-y-px group-hover/mail:translate-x-px">
            ↗
          </span>
        </a>
      </div>
    </div>
  );
}

/** "← All posts" style back link in mono, like the reference. Arrow nudges left on hover. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/back label-mono inline-flex items-center gap-1.5 self-start text-fg-muted transition-colors duration-150 hover:text-fg"
    >
      <span aria-hidden className="transition-transform duration-200 ease-out group-hover/back:-translate-x-0.5">
        ←
      </span>
      <span>{children}</span>
    </Link>
  );
}
