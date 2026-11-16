import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { SmartLink } from "./SmartLink";
import { Icon, type IconName } from "./Icon";
import { Kbd } from "./Kbd";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon after the label, e.g. "arrow-right" or "arrow-up-right". */
  icon?: IconName;
  /** Icon before the label. */
  iconLeft?: IconName;
  /** Keyboard hint shown as `[K]` before the label. Pair with aria-keyshortcuts. */
  kbd?: string;
  /** Primary only: invert to an outline on hover (Tech@NYU hero CTA). Default true.
   *  The navbar's Join Discord passes false, as on Tech@NYU. */
  invertOnHover?: boolean;
  className?: string;
  children: ReactNode;
};

export type ButtonProps =
  | (Common & { href: string; external?: boolean; onClick?: () => void; "aria-keyshortcuts"?: string })
  | (Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">);

const base =
  "group/button relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-mono font-normal tracking-mono " +
  "transition-[background-color,border-color,color] duration-150 ease-out " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const variants: Record<ButtonVariant, string> = {
  /** White, square, mono label (Tech@NYU "Join Discord"). Hover inversion: see invertOnHover. */
  primary: "border border-fg bg-fg text-fg-inverse",
  /** Drawn outline, transparent fill (Tech@NYU "Contact"); fills white on hover. */
  secondary: "border border-fg bg-transparent text-fg hover:bg-fg hover:text-fg-inverse",
  ghost: "border border-transparent text-fg-muted hover:bg-white/[0.05] hover:text-fg",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 rounded-control px-3.5 text-meta",
  md: "h-10 rounded-control px-4 text-sm",
  lg: "h-12 rounded-control px-5 text-body-sm",
};

/**
 * Button. Renders an <a> when `href` is set (internal via next/link, http in a
 * new tab, mailto plain), otherwise a <button type="button">.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon, iconLeft, kbd, invertOnHover = true, className, children } = props;
  const cls = clsx(
    base,
    variants[variant],
    variant === "primary" && invertOnHover && "hover:bg-transparent hover:text-fg",
    sizes[size],
    className,
  );
  const iconSize = size === "lg" ? 16 : 14;
  const content = (
    <>
      {kbd && <Kbd>{kbd}</Kbd>}
      {iconLeft && <Icon name={iconLeft} size={iconSize} />}
      <span>{children}</span>
      {icon && (
        <Icon
          name={icon}
          size={iconSize}
          className="transition-transform duration-200 ease-out group-hover/button:translate-x-0.5"
        />
      )}
    </>
  );

  if (props.href !== undefined) {
    return (
      <SmartLink
        href={props.href}
        external={props.external}
        onClick={props.onClick}
        aria-keyshortcuts={props["aria-keyshortcuts"]}
        className={cls}
      >
        {content}
      </SmartLink>
    );
  }

  const { variant: _v, size: _s, icon: _i, iconLeft: _il, kbd: _k, invertOnHover: _inv, className: _c, children: _ch, href: _h, type, ...rest } = props;
  void _v; void _s; void _i; void _il; void _k; void _inv; void _c; void _ch; void _h;
  return (
    <button type={type ?? "button"} className={cls} {...rest}>
      {content}
    </button>
  );
}
