import clsx from "clsx";
import type { ReactNode } from "react";
import { SmartLink } from "./SmartLink";

export type CardProps = {
  /** Makes the whole card one link (border brightens on hover, visible focus ring). Do not put other links inside. */
  href?: string;
  external?: boolean;
  /** @deprecated v2: no-op. "Fig 0.x" labels were dropped. Kept so old call sites compile. */
  fig?: ReactNode;
  title?: ReactNode;
  /** Heading level for the title. Default "h3". */
  titleAs?: "h2" | "h3" | "h4";
  /**
   * Visual slot at the bottom of the card, e.g. an isometric illustration
   * (`<IsoBuildCohort/>`) or a photo. Rendered flush: any border, radius or
   * background on the direct child is removed so there is no card-in-card.
   */
  media?: ReactNode;
  /** Bottom row, e.g. <ArrowLink/> (no href when the card itself is linked). */
  footer?: ReactNode;
  /** Padding preset. Default "md". */
  padding?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
};

const pad = { sm: "p-5", md: "p-6 sm:p-8", lg: "p-7 sm:p-10" };

/**
 * Square-cornered, hairline-bordered surface with grain (Tech@NYU program
 * card). Linked cards brighten their border (white 42%) and lift their
 * surface one step on hover; no glow, no shadow, no movement.
 */
export function Card({
  href,
  external,
  fig: _fig,
  title,
  titleAs: Title = "h3",
  media,
  footer,
  padding = "md",
  className,
  children,
}: CardProps) {
  void _fig;
  const cls = clsx(
    "group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface grain",
    href &&
      "transition-[border-color,background-color] duration-200 ease-out hover:border-border-emphasis hover:bg-surface-hover focus-visible:outline-offset-4",
    className,
  );
  const body = (
    <>
      <div className={clsx("flex flex-col gap-3", !media && "flex-1", pad[padding])}>
        {title && <Title className="text-h3 text-fg">{title}</Title>}
        {children && <div className="text-body-sm text-fg-muted sm:text-base">{children}</div>}
        {footer && <div className={clsx("pt-3", !media && "mt-auto")}>{footer}</div>}
      </div>
      {media && <div className="card-media mt-auto flex justify-center px-6 pb-6 sm:px-8 sm:pb-8">{media}</div>}
    </>
  );
  if (href) {
    return (
      <SmartLink href={href} external={external} className={cls}>
        {body}
      </SmartLink>
    );
  }
  return <div className={cls}>{body}</div>;
}

/** Large framed surface: hairline border, 6px radius, grain. No highlight line, no shadow. */
export function Panel({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={clsx("relative overflow-hidden rounded-panel border border-border bg-surface grain", className)}>
      {children}
    </div>
  );
}

/**
 * Stand-in for a missing photo: a plain dark tile with a hairline border and a
 * small mono caption. No stock imagery, no glow.
 */
export function Placeholder({
  caption,
  aspect = "16/10",
  className,
}: {
  caption?: ReactNode;
  /** CSS aspect-ratio, e.g. "4/3", "4/5", "1/1". Default "16/10". */
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      role={caption ? "img" : undefined}
      aria-label={typeof caption === "string" ? caption : undefined}
      aria-hidden={caption ? undefined : true}
      className={clsx("relative overflow-hidden rounded-sm border border-border bg-surface-raised grain", className)}
      style={{ aspectRatio: aspect }}
    >
      {caption && (
        <span className="label-mono absolute bottom-3 left-3 text-fg-subtle" aria-hidden>
          {caption}
        </span>
      )}
    </div>
  );
}
