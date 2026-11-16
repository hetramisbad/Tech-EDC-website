import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import type { ReactNode } from "react";
import { Button, Card, Eyebrow, IsoBuildCohort, IsoMentorship, JoinUs, PageHeader, Reveal, Section, Timeline } from "@/components";
import { programCopy as copy } from "@/content/pages";
import { CheckList, ContactLine, SplitSection } from "@/lib/page-ui";
import { getDetailProgram, getDetailPrograms } from "@/lib/programs";

// Only the slugs below exist; anything else is a 404 (required for static export).
export const dynamicParams = false;

export function generateStaticParams() {
  return getDetailPrograms().map((p) => ({ slug: p.slug }));
}

/** Header art per program (isometric line drawings from components/illustrations). */
const programArt: Record<string, ReactNode> = {
  "build-cohort": <IsoBuildCohort />,
  mentorship: <IsoMentorship />,
};

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = getDetailProgram(slug);
  if (!program) return {};
  return {
    title: program.name,
    description: program.summary,
    alternates: { canonical: program.href },
    openGraph: { title: `${program.name} · ${site.name}`, description: program.summary, url: program.href },
  };
}

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = getDetailProgram(slug);
  if (!program) notFound();

  const applyButton = (size: "md" | "lg") => (
    <Button href={program.applyHref} size={size} icon="arrow-up-right">
      {copy.applyCta}
    </Button>
  );

  const application = [
    { label: copy.application.labels.timeline, body: program.application.timeline },
    { label: copy.application.labels.process, body: program.application.process },
    { label: copy.application.labels.eligibility, body: program.application.eligibility },
  ];

  // Bands follow Tech@NYU's program pages: hero on the grid, then plain black
  // (Overview, Outcomes, Expectations), Timeline back on the grid, Application
  // plain, and Join Us on the grid again.
  return (
    <>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={program.name}
        intro={program.summary}
        media={programArt[program.slug]}
        className="lg:pb-28"
        actions={
          <>
            {applyButton("lg")}
            <Button href={site.links.discord} variant="secondary" size="lg">
              {copy.discordCta}
            </Button>
          </>
        }
      />

      <SplitSection id="overview" title={copy.overview.title} surface="plain">
        <div className="flex flex-col gap-5 text-lg text-fg-secondary">
          {program.overview.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </SplitSection>

      <Section
        id="outcomes"
        title={copy.outcomes.title}
        intro={copy.outcomes.intro(program.name)}
        align="center"
        surface="plain"
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {program.outcomes.map((o, i) => (
            <Reveal as="li" key={o.title} delay={i * 70}>
              <Card title={o.title}>{o.body}</Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        id="expectations"
        title={copy.expectations.title}
        intro={copy.expectations.intro}
        align="center"
        surface="plain"
      >
        <div className="mx-auto grid max-w-[880px] gap-4 md:grid-cols-2">
          <Card title={copy.expectations.requirements}>
            <div className="pt-1">
              <CheckList items={program.requirements} />
            </div>
          </Card>
          <Card title={copy.expectations.deliverables}>
            <div className="pt-1">
              <CheckList items={program.deliverables} />
            </div>
          </Card>
        </div>
      </Section>

      <Section id="timeline" title={copy.timeline.title} intro={copy.timeline.intro} align="center">
        <div className="mx-auto max-w-[680px]">
          <Timeline items={program.timeline} />
        </div>
      </Section>

      <Section
        id="application"
        title={copy.application.title}
        intro={copy.application.intro}
        align="center"
        surface="plain"
        size="narrow"
      >
        <dl className="border-t border-border">
          {application.map((item) => (
            <div key={item.label} className="grid gap-2 border-b border-border py-6 sm:grid-cols-[160px_1fr] sm:gap-8">
              <dt>
                <Eyebrow as="span" className="text-fg">
                  {item.label}
                </Eyebrow>
              </dt>
              <dd className="text-base text-fg-secondary">{item.body}</dd>
            </div>
          ))}
        </dl>
        <ContactLine prompt={copy.application.questions} email={site.email} action={applyButton("md")} />
      </Section>

      <JoinUs />
    </>
  );
}
