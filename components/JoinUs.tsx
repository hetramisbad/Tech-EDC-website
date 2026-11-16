import type { ReactNode } from "react";
import { site } from "@/content/site";
import { Container } from "./Container";
import { NewsletterForm } from "./NewsletterForm";
import { IsoJoin } from "./illustrations/IsoJoin";

export type JoinUsProps = {
  title?: ReactNode;
  intro?: ReactNode;
  /** Short line above the contact email. */
  contactPrompt?: ReactNode;
  /** Art on the right from 1080px. Default <IsoJoin/>; pass `false` to hide. */
  illustration?: ReactNode | false;
};

/**
 * "Join Us" newsletter section, id="newsletter". Every page ends with this,
 * directly above the footer. Tech@NYU layout: heading + form on the left,
 * contact line below, illustration on the right. No enclosing card.
 */
export function JoinUs({
  title = "Join Us",
  intro = "A short email when programs open, events are announced, and projects ship. No spam, unsubscribe any time.",
  contactPrompt = "Questions, ideas, or want to help run something?",
  illustration,
}: JoinUsProps) {
  const art = illustration === undefined ? <IsoJoin /> : illustration;
  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="section-space">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div className="flex max-w-[520px] flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 id="newsletter-title" className="text-h2 text-fg">
                {title}
              </h2>
              {intro && <p className="text-base text-fg-muted sm:text-lg">{intro}</p>}
            </div>
            <NewsletterForm />
            <div className="flex flex-col gap-1.5">
              <p className="label-mono text-fg-muted">{contactPrompt}</p>
              <a
                href={`mailto:${site.email}`}
                className="group/mail inline-flex items-center gap-1 self-start font-mono text-sm text-fg underline decoration-border-hover underline-offset-4 transition-colors hover:text-accent hover:decoration-current"
              >
                {site.email}
                <span aria-hidden className="transition-transform duration-200 group-hover/mail:-translate-y-px group-hover/mail:translate-x-px">
                  ↗
                </span>
              </a>
            </div>
          </div>
          {art && (
            <div aria-hidden className="mx-auto hidden w-full max-w-[460px] text-fg-secondary lg:block">
              {art}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
