import { Button, Container, LogoMark } from "@/components";
import { site } from "@/content/site";
import { homeCopy } from "@/content/home";

/**
 * Centered hero (Tech@NYU layout): display headline, one-line subhead, a framed
 * event photo, then a single Join Discord button. Sits on the page grid.
 * No video and no fake UI: the frame shows a real club photo once
 * `homeCopy.hero.photo` is set, and an empty, captioned frame until then.
 */
export function Hero() {
  const copy = homeCopy.hero;
  return (
    <section aria-labelledby="hero-title" className="pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-20 lg:pb-28">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 id="hero-title" className="text-display text-fg">
            {site.tagline}
          </h1>
          <p className="mt-5 max-w-[860px] text-lg text-fg-muted sm:text-[1.25rem] sm:leading-[1.5]">{copy.subhead}</p>

          <figure className="mt-12 w-full max-w-[440px] sm:mt-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-border-strong bg-surface-raised grain">
              {copy.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized anyway
                <img src={copy.photo.src} alt={copy.photo.alt} className="size-full object-cover" />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-4 text-fg-subtle">
                  <LogoMark size={44} />
                  <span className="label-mono">{copy.photoPlaceholder}</span>
                </div>
              )}
            </div>
          </figure>

          <div className="mt-12 w-full sm:mt-14 sm:w-auto">
            <Button href={site.links.discord} size="lg" iconLeft="discord" className="w-full sm:w-auto">
              {copy.primaryCta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
