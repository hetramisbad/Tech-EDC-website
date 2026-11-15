import type { ReactNode } from "react";
import { site } from "@/content/site";
import { Container } from "./Container";
import { NewsletterForm } from "./NewsletterForm";
import { Panel } from "./Card";

export type JoinUsProps = {
  title?: ReactNode;
  intro?: ReactNode;
};

/**
 * "Join Us" newsletter section, id="newsletter". Every page ends with this,
 * directly above the footer.
 */
export function JoinUs({
  title = "Join Us",
  intro = "Get a short email when programs open, events are announced, and projects ship. No spam, unsubscribe any time.",
}: JoinUsProps) {
  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="section-space">
      <Container>
        <Panel className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="flex flex-col gap-4">
              <h2 id="newsletter-title" className="text-h2 text-fg">
                {title}
              </h2>
              <p className="text-base text-fg-muted sm:text-lg">{intro}</p>
            </div>
            <div className="flex flex-col gap-6">
              <NewsletterForm />
              <p className="border-t border-border pt-5 text-sm text-fg-muted">
                Have a question, an idea for a collaboration, or just want to say hi?{" "}
                <a href={`mailto:${site.email}`} className="link whitespace-nowrap">
                  {site.email}
                </a>
              </p>
            </div>
          </div>
        </Panel>
      </Container>
    </section>
  );
}
