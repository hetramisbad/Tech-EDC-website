import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { Button, Card, Eyebrow, JoinUs, PageHeader, Panel, Reveal, Section, Timeline } from "@/components";
import { programCopy as copy } from "@/lib/copy";
import { CheckList, SplitSection } from "@/lib/page-ui";
import { getDetailProgram, getDetailPrograms } from "@/lib/programs";

// Only the slugs below exist; anything else is a 404 (required for static export).
export const dynamicParams = false;

export function generateStaticParams() {
  return getDetailPrograms().map((p) => ({ slug: p.slug }));
}

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

  return (
    <>
      <PageHeader
        eyebrow={`${program.fig} · ${copy.eyebrow}`}
        title={program.name}
        intro={program.summary}
        actions={
          <>
            {applyButton("lg")}
            <Button href={site.links.discord} variant="secondary" size="lg">
              {copy.discordCta}
            </Button>
          </>
        }
      />

      <SplitSection id="overview" eyebrow={copy.overview.eyebrow} title={copy.overview.title}>
        <div className="flex flex-col gap-5 text-lg text-fg-secondary">
          {program.overview.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </SplitSection>

      <Section
        id="outcomes"
        eyebrow={copy.outcomes.eyebrow}
        title={copy.outcomes.title}
        intro={copy.outcomes.intro(program.name)}
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {program.outcomes.map((o, i) => (
            <Reveal as="li" key={o.title} delay={i * 70}>
              <Card fig={String(i + 1).padStart(2, "0")} title={o.title}>
                {o.body}
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section
        id="expectations"
        eyebrow={copy.expectations.eyebrow}
        title={copy.expectations.title}
        intro={copy.expectations.intro}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card title={copy.expectations.requirements} padding="lg">
            <div className="pt-2">
              <CheckList items={program.requirements} />
            </div>
          </Card>
          <Card title={copy.expectations.deliverables} padding="lg">
            <div className="pt-2">
              <CheckList items={program.deliverables} />
            </div>
          </Card>
        </div>
      </Section>

      <SplitSection
        id="timeline"
        eyebrow={copy.timeline.eyebrow}
        title={copy.timeline.title}
        intro={copy.timeline.intro}
      >
        <Panel className="p-6 sm:p-8">
          <Timeline items={program.timeline} />
        </Panel>
      </SplitSection>

      <Section
        id="application"
        eyebrow={copy.application.eyebrow}
        title={copy.application.title}
        intro={copy.application.intro}
      >
        <Panel>
          <dl className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {application.map((item) => (
              <div key={item.label} className="flex flex-col gap-3 p-6 sm:p-8">
                <dt>
                  <Eyebrow as="span">{item.label}</Eyebrow>
                </dt>
                <dd className="text-base text-fg-secondary">{item.body}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-4 border-t border-border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <p className="text-sm text-fg-muted">
              {copy.application.questions}{" "}
              <a href={`mailto:${site.email}`} className="link whitespace-nowrap">
                {site.email}
              </a>
            </p>
            <div className="shrink-0">{applyButton("md")}</div>
          </div>
        </Panel>
      </Section>

      <JoinUs />
    </>
  );
}
