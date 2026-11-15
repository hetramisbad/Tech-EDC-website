// Small layout pieces shared by the Pages routes. Built only from Design's
// tokens and components; if Design wants these in components/, move them.

import Link from "next/link";
import type { ReactNode } from "react";
import { Container, Eyebrow, Icon } from "@/components";

/**
 * Two-column section: heading block on the left (sticky on wide screens),
 * content on the right. Same vertical rhythm as <Section/>.
 */
export function SplitSection({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className="section-space">
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

/** Checklist used for requirements / deliverables. */
export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm text-fg-secondary sm:text-base">
          <span
            aria-hidden
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-raised text-fg-muted sm:mt-1"
          >
            <Icon name="check" size={12} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** "← All posts" style back link. Arrow nudges left on hover. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group/back inline-flex items-center gap-1.5 self-start text-sm font-medium text-fg-muted transition-colors duration-150 hover:text-fg"
    >
      <span aria-hidden className="transition-transform duration-200 ease-out group-hover/back:-translate-x-0.5">
        ←
      </span>
      <span>{children}</span>
    </Link>
  );
}
