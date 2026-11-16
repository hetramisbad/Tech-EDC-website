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
  /**
   * Background. "grid" (default) = transparent, the page's grid + gradient
   * shows through. "plain" = opaque near-black band with grain and no grid,
   * like Tech@NYU's sections below the hero.
   */
  surface?: "grid" | "plain";
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
  surface = "grid",
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
        surface === "plain" && "surface-plain",
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
            <div className={clsx("flex flex-col gap-4", centered ? "max-w-[720px] items-center" : "max-w-[640px]")}>
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              {title && (
                <Title id={headingId} className="text-h2 text-fg">
                  {title}
                </Title>
              )}
              {intro && <div className={clsx("text-lg text-fg-muted", centered && "max-w-[560px]")}>{intro}</div>}
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

/**
 * Top-of-page header for sub-pages (/team, /blog, /programs/*). Renders the
 * page <h1>. Pass `media` (e.g. an isometric illustration) to get Tech@NYU's
 * program-hero layout: text left, art right from 1080px.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  actions,
  badge,
  media,
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  /** Optional <Badge/> shown above the title. */
  badge?: ReactNode;
  /** Illustration at the right on wide screens (hidden below 600px). Ignored when align="center". */
  media?: ReactNode;
  /** "left" (default) or "center" (Tech@NYU home-hero style). */
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  const text = (
    <div className={clsx("flex flex-col gap-5", centered ? "mx-auto max-w-[820px] items-center text-center" : "max-w-[760px] items-start")}>
      {badge}
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-h1 text-fg">{title}</h1>
      {intro && <div className="text-lg text-fg-muted sm:text-[1.25rem] sm:leading-[1.5]">{intro}</div>}
      {actions && <div className={clsx("mt-3 flex flex-wrap items-center gap-3", centered && "justify-center")}>{actions}</div>}
    </div>
  );
  return (
    <header className={clsx("pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-28", className)}>
      <Container>
        {media && !centered ? (
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            {text}
            <div aria-hidden className="mx-auto hidden w-full max-w-[460px] text-fg-secondary sm:block">
              {media}
            </div>
          </div>
        ) : (
          text
        )}
      </Container>
    </header>
  );
}
