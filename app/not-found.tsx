import type { Metadata } from "next";
import { Button, Container, Eyebrow, IsoNotFound } from "@/components";
import { notFoundCopy as copy } from "@/content/pages";

// Root not-found: rendered for notFound() and for every unmatched URL. In the
// static export it becomes out/404.html. Server Component only (it ships with
// every route), so no client UI here.
export const metadata: Metadata = {
  title: copy.title,
  description: copy.body,
  robots: { index: false, follow: false },
};

/** Centered on the page grid, no frame: unplugged-cable drawing, then the message. */
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="section-space">
      <Container size="narrow">
        <div className="flex flex-col items-center gap-5 text-center">
          <div aria-hidden className="mb-4 w-full max-w-[220px] text-fg-secondary sm:max-w-[260px]">
            <IsoNotFound />
          </div>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h1 id="not-found-title" className="text-h1 text-fg">
            {copy.title}
          </h1>
          <p className="max-w-[420px] text-lg text-fg-muted">{copy.body}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Button href="/" size="lg">
              {copy.home}
            </Button>
            <Button href="/blog/" variant="secondary" size="lg" icon="arrow-right">
              {copy.blog}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
