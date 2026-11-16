import { Button, Container, HeroLaptop } from "@/components";
import { site } from "@/content/site";
import { homeCopy } from "@/content/home";

/**
 * Centered hero (Tech@NYU layout): display headline, one-line subhead, the
 * hero visual, then a single Join Discord button. Sits on the page grid.
 * Visual: the `HeroLaptop` (sized like Tech@NYU's hero TV) by default; a real club photo in a
 * frame once `homeCopy.hero.photo` is set. No video and no fake UI.
 * Sized so headline + art + button fit a 1440 x 900 first view.
 */
export function Hero() {
  const copy = homeCopy.hero;
  return (
    <section
      aria-labelledby="hero-title"
      // Viewport-locked like Tech@NYU: headline, art and button fill exactly the
      // visible screen below the sticky navbar. The art flexes to absorb the rest.
      className="flex h-[calc(100svh-var(--nav-height))] min-h-140 flex-col py-10 sm:py-12"
    >
      <Container className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col items-center text-center">
          <h1 id="hero-title" className="text-display text-fg">
            {site.tagline}
          </h1>
          <p className="mt-5 max-w-240 text-lg text-fg sm:text-lead">{copy.subhead}</p>

          {copy.photo ? (
            <figure className="mt-8 flex min-h-0 w-full flex-1 justify-center sm:mt-10">
              <div className="relative aspect-4/3 h-full max-w-full overflow-hidden rounded-panel border border-border-strong bg-surface-raised">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized anyway */}
                <img src={copy.photo.src} alt={copy.photo.alt} className="size-full object-cover" />
              </div>
            </figure>
          ) : (
            <div aria-hidden className="mt-8 flex min-h-0 w-full flex-1 items-center justify-center sm:mt-10">
              <HeroLaptop className="h-full max-h-125 w-full" />
            </div>
          )}

          <div className="mt-8 w-full shrink-0 sm:mt-10 sm:w-auto">
            <Button href={site.links.discord} size="lg" iconLeft="discord" className="w-full sm:w-auto">
              {copy.primaryCta}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
