import Link from "next/link";
import { navItems, site } from "@/content/site";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { SmartLink } from "./SmartLink";
import { SocialLinks } from "./SocialLinks";

/** Minimal site footer: logo, short nav, socials, copyright. Rendered by the root layout. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-10 py-12 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <Link href="/" className="-m-1 flex self-start rounded-control p-1" aria-label={`${site.name} home`}>
              <Logo />
            </Link>
            <p className="max-w-[300px] text-sm text-fg-muted">The technology club at {site.college}.</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <SmartLink
                    href={item.href}
                    external={item.external}
                    className="text-sm text-fg-muted transition-colors duration-150 hover:text-fg"
                  >
                    {item.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col-reverse gap-6 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-subtle">
            © {year} {site.name}. All rights reserved.
          </p>
          <SocialLinks />
        </div>
      </Container>
    </footer>
  );
}
