import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  /** Force new-tab behaviour. http(s) links open in a new tab automatically. */
  external?: boolean;
  children: ReactNode;
};

export function isHttp(href: string) {
  return /^https?:\/\//i.test(href);
}

/**
 * The one link primitive. Internal paths use next/link; http(s) URLs open in a
 * new tab with rel="noopener noreferrer"; mailto:/tel: are plain anchors.
 */
export function SmartLink({ href, external, children, ...rest }: SmartLinkProps) {
  const isProtocol = /^(mailto|tel):/i.test(href);
  if (isHttp(href) || (external && !isProtocol)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    );
  }
  if (isProtocol) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
