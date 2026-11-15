import clsx from "clsx";
import type { ReactNode } from "react";
import { Container, type ContainerProps } from "./Container";
import { Eyebrow } from "./Eyebrow";

export type SectionProps = {
  /** Anchor id (e.g. "programs"). Scroll offset for the sticky navbar is handled globally. */
  id?: string;
  /** Small mono label above the title. */
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** One or two sentences under the title, muted. */
  intro?: ReactNode;
  /** Right side of the header on wide screens (e.g. an ArrowLink). */
  actions?: ReactNode;
  /** Header alignment. Default "left". */
  align?: "left" | "center";
  /** Heading level for the title. Default "h2". */
  titleAs?: "h1" | "h2" | "h3";
  /** Container width. Default "page". */
  size?: ContainerProps["size"];
  /** Draw a hairline above the section. Default false. */
  divider?: boolean;
  /** Override vertical padding: "default" | "tight" (half) | "none". */
  space?: "default" | "tight" | "none";
  className?: string;
  children?: ReactNode;
  /** Accessible name when there is no visible title. */
  ariaLabel?: string;
  /** Full-bleed content rendered below the container, edge to edge (e.g. <Gallery/>). */
  bleed?: ReactNode;
};

export function Section({
  id,
  eyebrow,
  title,
  intro,
  actions,
  align = "left",
  titleAs: Title = "h2",
  size = "page",
  divider = false,
  space = "default",
  className,
  children,
  ariaLabel,
  bleed,
}: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  const hasHeader = Boolean(eyebrow || title || intro || actions);
  const centered = align === "center";
  return (
    <section
      id={id}
      aria-labelledby={title && headingId ? headingId : undefined}
      aria-label={!title ? ariaLabel : undefined}
      className={clsx(
        space === "default" && "section-space",
        space === "tight" && "py-[calc(var(--section-space)/2)]",
        className,
      )}
    >
      <Container size={size}>
        {divider && <hr className="mb-[var(--section-space)]" />}
        {hasHeader && (
          <header
            className={clsx(
              "mb-10 flex flex-col gap-6 md:mb-14",
              centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
            )}
          >
            <div className={clsx("flex max-w-[640px] flex-col gap-4", centered && "items-center")}>
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              {title && (
                <Title id={headingId} className="text-h2 text-fg">
                  {title}
                </Title>
              )}
              {intro && <div className="text-lg text-fg-muted">{intro}</div>}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </header>
        )}
        {children}
      </Container>
      {bleed}
    </section>
  );
}

/** Top-of-page header for sub-pages (/team, /blog, /programs/*). Renders the page <h1>. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  actions,
  badge,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  /** Optional <Badge/> shown above the title. */
  badge?: ReactNode;
  className?: string;
}) {
  return (
    <header className={clsx("pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-28", className)}>
      <Container>
        <div className="flex max-w-[760px] flex-col items-start gap-5">
          {badge}
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-h1 text-fg">{title}</h1>
          {intro && <div className="text-lg text-fg-muted sm:text-[1.25rem] sm:leading-[1.55]">{intro}</div>}
          {actions && <div className="mt-3 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      </Container>
    </header>
  );
}
