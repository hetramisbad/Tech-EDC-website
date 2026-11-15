import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { SmartLink } from "./SmartLink";
import { Icon, type IconName } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon after the label, e.g. "arrow-right" or "arrow-up-right". */
  icon?: IconName;
  /** Icon before the label. */
  iconLeft?: IconName;
  className?: string;
  children: ReactNode;
};

export type ButtonProps =
  | (Common & { href: string; external?: boolean; onClick?: () => void })
  | (Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">);

const base =
  "group/button relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-fg text-fg-inverse shadow-[inset_0_-1px_0_rgb(0_0_0/0.12)] hover:bg-white hover:shadow-[0_0_0_4px_rgb(255_255_255/0.08)]",
  secondary:
    "border border-border-strong bg-surface text-fg hover:border-border-hover hover:bg-surface-raised",
  ghost: "text-fg-muted hover:bg-surface-raised hover:text-fg",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 rounded-control px-3 text-[0.8125rem]",
  md: "h-10 rounded-control px-4 text-sm",
  lg: "h-12 rounded-[10px] px-5 text-base",
};

/**
 * Button. Renders an <a> when `href` is set (internal via next/link, http in a
 * new tab, mailto plain), otherwise a <button type="button">.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon, iconLeft, className, children } = props;
  const cls = clsx(base, variants[variant], sizes[size], className);
  const iconSize = size === "lg" ? 16 : 14;
  const content = (
    <>
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
      <SmartLink href={props.href} external={props.external} onClick={props.onClick} className={cls}>
        {content}
      </SmartLink>
    );
  }

  const { variant: _v, size: _s, icon: _i, iconLeft: _il, className: _c, children: _ch, href: _h, type, ...rest } = props;
  void _v; void _s; void _i; void _il; void _c; void _ch; void _h;
  return (
    <button type={type ?? "button"} className={cls} {...rest}>
      {content}
    </button>
  );
}
