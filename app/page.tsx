import {
  Accordion,
  ArrowLink,
  Button,
  Card,
  IsoBuildCohort,
  IsoBuildathon,
  IsoCommunity,
  IsoMentorship,
  JoinUs,
  // NetworkGrid,
  PhotoColumns,
  Section,
  SocialLinks,
  type IllustrationProps,
} from "@/components";
import type { ComponentType } from "react";
import { faq } from "@/content/faq";
import { programs } from "@/content/programs";
import { site } from "@/content/site";
import { homeCopy } from "@/content/home";
import { Hero } from "./_home/Hero";

/** Isometric drawing at the bottom of each program card, by program slug. */
const programArt: Record<string, ComponentType<IllustrationProps>> = {
  "build-cohort": IsoBuildCohort,
  mentorship: IsoMentorship,
  buildathon: IsoBuildathon,
};

/*
  Home. Section order and layout follow Tech@NYU:
  Hero (grid) → (Network, off) → Community (plain) → Programs (plain, centered)
  → Events (grid, photo columns) → FAQ (plain) → Connect (grid) → Join Us (grid).
  The root layout supplies <Navbar/>, <main id="content"> and <Footer/>.
*/
export default function Home() {
  const { community, programs: programsCopy, events, faq: faqCopy, connect } = homeCopy;

  return (
    <>
      <Hero />

      {/* PARTNERS: uncomment when Tech@EDC has partners (add entries to content/network.ts) */}
      {/* <NetworkGrid /> */}

      {/* Community: text left, illustration right. */}
      <Section id="community" surface="plain" ariaLabel={community.title}>
        <div className="grid items-center gap-12 py-4 lg:min-h-[480px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div className="flex max-w-[520px] flex-col gap-5">
            <h2 className="text-h2 text-fg">{community.title}</h2>
            <p className="text-base text-fg-muted sm:text-lg">{community.intro}</p>
          </div>
          <div aria-hidden className="mx-auto w-full max-w-[400px] text-fg-secondary sm:max-w-[500px]">
            <IsoCommunity className="w-full" />
          </div>
        </div>
      </Section>

      {/* Programs: centered heading, three square-cornered cards with art flush at the bottom. */}
      <Section
        id="programs"
        surface="plain"
        align="center"
        title={programsCopy.title}
        intro={<p>{programsCopy.intro}</p>}
        className="pt-0!"
      >
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {programs.map((p) => {
            const Art = programArt[p.slug];
            return (
              <li key={p.slug} className="flex">
                <Card
                  href={p.href}
                  title={p.name}
                  footer={<ArrowLink>{programsCopy.cta}</ArrowLink>}
                  media={Art ? <Art className="w-full max-w-[300px] text-fg-secondary" /> : undefined}
                  className="w-full"
                >
                  {p.summary}
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Events: photo columns flanking centered text. */}
      <Section id="events" ariaLabel={events.title}>
        <PhotoColumns label={events.galleryLabel} placeholderCaptions={[...events.captions]}>
          <h2 className="text-h2 text-fg">{events.title}</h2>
          {events.intro.map((line) => (
            <p key={line} className="max-w-[440px] text-base text-fg-muted sm:text-lg">
              {line}
            </p>
          ))}
          <div className="mt-2">
            <Button href={site.links.luma} external variant="secondary" icon="arrow-up-right">
              {events.cta}
            </Button>
          </div>
        </PhotoColumns>
      </Section>

      {/* FAQ: title and contact left, accordion right. */}
      <Section id="faq" surface="plain" ariaLabel={faqCopy.title}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <h2 className="text-h2 text-fg">{faqCopy.title}</h2>
            <StillHaveQuestions className="hidden lg:flex" />
          </div>
          <div>
            <Accordion items={faq} />
            <StillHaveQuestions className="mt-10 lg:hidden" />
          </div>
        </div>
      </Section>

      {/* Connect: one bordered box, heading and icon links centered. */}
      <Section id="connect" ariaLabel={connect.title}>
        <div className="relative flex flex-col items-center gap-4 rounded-card border border-border bg-surface px-6 py-14 text-center grain sm:py-20 lg:max-w-[50%]">
          <h2 className="text-h2 text-fg">{connect.title}</h2>
          <p className="text-base text-fg-muted">{connect.intro}</p>
          <SocialLinks className="mt-4" />
        </div>
      </Section>

      <JoinUs />
    </>
  );
}

/** "Still have questions? Say hello." + the club email, as in Join Us. */
function StillHaveQuestions({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <p className="label-mono text-fg-muted">{homeCopy.faq.stillPrompt}</p>
      <a
        href={`mailto:${site.email}`}
        className="self-start font-mono text-sm text-fg underline decoration-border-hover underline-offset-4 transition-colors hover:text-accent hover:decoration-current"
      >
        {site.email} <span aria-hidden>↗</span>
      </a>
    </div>
  );
}
