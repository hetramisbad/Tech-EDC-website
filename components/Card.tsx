import clsx from "clsx";
import type { ReactNode } from "react";
import { SmartLink } from "./SmartLink";
import { Eyebrow } from "./Eyebrow";

export type CardProps = {
  /** Makes the whole card one link with hover glow and visible focus ring. Do not put other links inside. */
  href?: string;
  external?: boolean;
  /** Editorial label shown top-left, e.g. "Fig 0.1". */
  fig?: ReactNode;
  title?: ReactNode;
  /** Heading level for the title. Default "h3". */
  titleAs?: "h2" | "h3" | "h4";
  /** Visual slot rendered at the bottom of the card (e.g. a <Placeholder/> or image). */
  media?: ReactNode;
  /** Bottom row, e.g. <ArrowLink/> (no href when the card itself is linked). */
  footer?: ReactNode;
  /** Padding preset. Default "md". */
  padding?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
};

const pad = { sm: "p-5", md: "p-6 sm:p-7", lg: "p-7 sm:p-9" };

/** Hairline-bordered surface panel; the main visual unit of the site. */
export function Card({
  href,
  external,
  fig,
  title,
  titleAs: Title = "h3",
  media,
  footer,
  padding = "md",
  className,
  children,
}: CardProps) {
  const cls = clsx(
    "group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface grain",
    "shadow-[var(--shadow-card)]",
    href &&
      "transition-[border-color,box-shadow,background-color] duration-200 ease-out hover:border-border-hover hover:bg-surface-raised hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-offset-4",
    className,
  );
  const body = (
    <>
      <div className={clsx("flex flex-1 flex-col gap-3", pad[padding])}>
        {fig && <Eyebrow as="span" className="mb-3 text-fg-subtle">{fig}</Eyebrow>}
        {title && <Title className="text-h3 text-fg">{title}</Title>}
        {children && <div className="text-sm leading-relaxed text-fg-muted sm:text-[0.9375rem]">{children}</div>}
        {footer && <div className="mt-auto pt-4">{footer}</div>}
      </div>
      {media && <div className="px-3 pb-3">{media}</div>}
    </>
  );
  if (href) {
    return (
      <SmartLink href={href} external={external} className={clsx(cls, "rounded-card")}>
        {body}
      </SmartLink>
    );
  }
  return <div className={cls}>{body}</div>;
}

/** Large rounded panel (hero visual, feature frames). Surface, hairline, grain, faint top highlight. */
export function Panel({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-panel border border-border bg-surface grain shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.16),transparent)]"
      />
      {children}
    </div>
  );
}

/**
 * Tasteful stand-in visual for missing photos/illustrations: a dark noise panel
 * with faint grid lines and a mono caption. No stock imagery.
 */
export function Placeholder({
  caption,
  aspect = "16/10",
  className,
}: {
  caption?: ReactNode;
  /** CSS aspect-ratio, e.g. "4/3", "1/1". Default "16/10". */
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      role={caption ? "img" : undefined}
      aria-label={typeof caption === "string" ? caption : undefined}
      aria-hidden={caption ? undefined : true}
      className={clsx(
        "relative overflow-hidden rounded-[10px] border border-border bg-surface-raised grain",
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgb(255_255_255/0.06),transparent_60%)]"
      />
      {caption && (
        <span className="label-mono absolute bottom-3 left-3 text-fg-subtle" aria-hidden>
          {caption}
        </span>
      )}
    </div>
  );
}
