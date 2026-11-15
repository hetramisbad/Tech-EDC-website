import {
  Accordion,
  ArrowLink,
  Button,
  Card,
  Container,
  Eyebrow,
  Gallery,
  JoinUs,
  // NetworkGrid,
  Reveal,
  Section,
  SocialLinks,
} from "@/components";
import { faq } from "@/content/faq";
import { programs } from "@/content/programs";
import { site } from "@/content/site";
import { homeCopy } from "@/content/home";
import { Hero } from "./_home/Hero";
import { ProgramArt } from "./_home/ProgramArt";

/*
  Home. Section order mirrors the reference layout:
  Hero → (Network, off) → Community → Programs → Events → FAQ → Connect → Join Us.
  The root layout supplies <Navbar/>, <main id="content"> and <Footer/>.
*/
export default function Home() {
  const { community, programs: programsCopy, events, faq: faqCopy, connect } = homeCopy;

  return (
    <>
      <Hero />

      {/* PARTNERS: uncomment when Tech@EDC has partners (add entries to content/network.ts) */}
      {/* <NetworkGrid /> */}

      <Reveal>
        <Section id="community" eyebrow={community.eyebrow} title={community.title} intro={<p>{community.intro}</p>}>
          <ul className="grid gap-4 md:grid-cols-3">
            {community.pillars.map((p) => (
              <li key={p.title}>
                <Card fig={p.label} title={p.title}>
                  {p.body}
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

      <Hairline />

      <Reveal>
        <Section id="programs" eyebrow={programsCopy.eyebrow} title={programsCopy.title} intro={<p>{programsCopy.intro}</p>}>
          <ul className="grid gap-4 md:grid-cols-3">
            {programs.map((p) => (
              <li key={p.slug} className="flex">
                <Card
                  href={p.href}
                  fig={p.fig}
                  title={p.name}
                  footer={<ArrowLink>{programsCopy.cta}</ArrowLink>}
                  media={<ProgramArt slug={p.slug} />}
                  className="w-full"
                >
                  {p.summary}
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

      <Hairline />

      <Reveal>
        <Section
          id="events"
          eyebrow={events.eyebrow}
          title={events.title}
          intro={<p>{events.intro}</p>}
          actions={
            <Button href={site.links.luma} external variant="secondary" icon="arrow-up-right">
              {events.cta}
            </Button>
          }
          bleed={<Gallery label={events.galleryLabel} placeholderCaptions={[...events.captions]} />}
        />
      </Reveal>

      <Hairline />

      <Reveal>
        <Section id="faq" ariaLabel={faqCopy.title}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="flex flex-col items-start gap-4">
              <Eyebrow>{faqCopy.eyebrow}</Eyebrow>
              <h2 id="faq-title" className="text-h2 text-fg">
                {faqCopy.title}
              </h2>
              <p className="text-lg text-fg-muted">{faqCopy.intro}</p>
              <p className="mt-2 hidden text-sm text-fg-muted lg:block">
                <StillHaveQuestions />
              </p>
            </div>
            <div>
              <Accordion items={faq} />
              <p className="mt-8 text-sm text-fg-muted lg:hidden">
                <StillHaveQuestions />
              </p>
            </div>
          </div>
        </Section>
      </Reveal>

      <Hairline />

      <Reveal>
        <Section id="connect" eyebrow={connect.eyebrow} title={connect.title} intro={<p>{connect.intro}</p>}>
          <SocialLinks variant="list" />
        </Section>
      </Reveal>

      <JoinUs />
    </>
  );
}

function StillHaveQuestions() {
  const { stillPrompt, stillLink } = homeCopy.faq;
  return (
    <>
      {stillPrompt}{" "}
      <a href={`mailto:${site.email}`} className="link">
        {stillLink}
      </a>
    </>
  );
}

/** Hairline between sections; sits midway in the gap formed by the two sections' padding. */
function Hairline() {
  return (
    <Container>
      <hr />
    </Container>
  );
}
