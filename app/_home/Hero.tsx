import { Badge, Button, Container } from "@/components";
import { site } from "@/content/site";
import { homeCopy } from "@/content/home";
import { HeroBoard } from "./HeroBoard";

/** Linear-style hero: pill, display headline, muted subhead, CTAs, framed panel. */
export function Hero() {
  const { announcement, tagline, links } = site;
  const copy = homeCopy.hero;
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
      {/* Soft top light behind the headline; neutral, no accent fill. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-160 bg-[radial-gradient(60%_50%_at_30%_0%,rgb(255_255_255/0.06),transparent_70%)]"
      />
      <Container>
        <div className="flex max-w-narrow flex-col items-start gap-6">
          {announcement.text && (
            <Badge dot href={announcement.href}>
              {announcement.text}
            </Badge>
          )}
          <h1 id="hero-title" className="text-display text-fg">
            {tagline}
          </h1>
          <p className="max-w-prose text-lg text-fg-muted">{copy.subhead}</p>
          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button href={links.discord} size="lg" iconLeft="discord" className="w-full sm:w-auto">
              {copy.primaryCta}
            </Button>
            <Button href="#programs" size="lg" variant="secondary" icon="arrow-right" className="w-full sm:w-auto">
              {copy.secondaryCta}
            </Button>
          </div>
        </div>

        <div className="mt-14 sm:mt-16 lg:mt-20">
          <HeroBoard />
        </div>
      </Container>
    </section>
  );
}
