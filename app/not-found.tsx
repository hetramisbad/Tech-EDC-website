import type { Metadata } from "next";
import { Button, Container, Eyebrow, Panel } from "@/components";
import { notFoundCopy as copy } from "@/lib/copy";

// Root not-found: rendered for notFound() and for every unmatched URL. In the
// static export it becomes out/404.html. Server Component only (it ships with
// every route), so no client UI here.
export const metadata: Metadata = {
  title: copy.title,
  description: copy.body,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="section-space">
      <Container size="narrow">
        <Panel className="flex flex-col items-center gap-6 px-6 py-16 text-center sm:px-12 sm:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]"
          />
          <Eyebrow className="relative">{copy.title}</Eyebrow>
          <h1 id="not-found-title" className="relative text-display text-fg tabular-nums">
            404<span className="visually-hidden">: {copy.title}</span>
          </h1>
          <p className="relative max-w-[420px] text-lg text-fg-muted">{copy.body}</p>
          <div className="relative mt-2 flex flex-wrap justify-center gap-3">
            <Button href="/" size="lg">
              {copy.home}
            </Button>
            <Button href="/blog/" variant="secondary" size="lg" icon="arrow-right">
              {copy.blog}
            </Button>
          </div>
        </Panel>
      </Container>
    </section>
  );
}
