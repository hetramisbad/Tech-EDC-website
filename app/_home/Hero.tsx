import { Button, Container, IsoHero } from "@/components";
import { site } from "@/content/site";
import { homeCopy } from "@/content/home";

/**
 * Centered hero (Tech@NYU layout): display headline, one-line subhead, the
 * hero visual, then a single Join Discord button. Sits on the page grid.
 * Visual: the `IsoHero` club workbench by default; a real club photo in a
 * frame once `homeCopy.hero.photo` is set. No video and no fake UI.
 * Sized so headline + art + button fit a 1440 x 900 first view.
 */
export function Hero() {
  const copy = homeCopy.hero;
  return (
    <section aria-labelledby="hero-title" className="pt-14 pb-20 sm:pt-16 sm:pb-24 lg:pt-14 lg:pb-28">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 id="hero-title" className="text-display text-fg">
            {site.tagline}
          </h1>
          <p className="mt-5 max-w-215 text-lg text-fg-muted sm:text-lead">{copy.subhead}</p>

          {copy.photo ? (
            <figure className="mt-10 w-full max-w-110 sm:mt-12">
              <div className="relative aspect-4/3 overflow-hidden rounded-panel border border-border-strong bg-surface-raised">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized anyway */}
                <img src={copy.photo.src} alt={copy.photo.alt} className="size-full object-cover" />
              </div>
            </figure>
          ) : (
            <div aria-hidden className="mt-8 w-full max-w-120 text-fg-secondary sm:mt-10 lg:max-w-165">
              <IsoHero className="w-full" />
            </div>
          )}

          <div className="mt-8 w-full sm:mt-10 sm:w-auto">
            <Button href={site.links.discord} size="lg" iconLeft="discord" className="w-full sm:w-auto">
              {copy.primaryCta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
