import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { SmartLink } from "@/components";

// Element overrides for post bodies. Typography comes from <Prose/> (.prose in
// globals.css); here we only route links through SmartLink so external links
// open in a new tab and internal ones use next/link.
const components = {
  a: ({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) => (
    <SmartLink href={href} {...rest}>
      {children}
    </SmartLink>
  ),
  img: ({ alt = "", ...rest }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element -- static export, no image optimization
    <img alt={alt} loading="lazy" {...rest} />
  ),
};

/** Renders an MDX body at build time (React Server Component). JS expressions in MDX are blocked. */
export function PostBody({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
