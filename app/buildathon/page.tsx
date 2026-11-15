import type { Metadata } from "next";
import { buildathon } from "@/content/buildathon";
import { site } from "@/content/site";
import { Accordion, Badge, Button, Card, Container, Eyebrow, JoinUs, PageHeader, Reveal, Section } from "@/components";
import { buildathonCopy as copy } from "@/lib/copy";
import { SplitSection } from "@/lib/page-ui";

export const metadata: Metadata = {
  title: buildathon.name,
  description: buildathon.intro,
  alternates: { canonical: "/buildathon/" },
  openGraph: { title: `${buildathon.name} · ${site.name}`, description: buildathon.tagline, url: "/buildathon/" },
};

/** Schedule rows are written "6:00 pm  Check-in" (two+ spaces between time and label). */
function splitItem(item: string) {
  const [time, ...rest] = item.split(/\s{2,}/);
  return rest.length ? { time, label: rest.join(" ") } : { time: "", label: item };
}

export default function BuildathonPage() {
  const when = buildathon.facts.find((f) => f.label === "When")?.value;
  const signup = (size: "md" | "lg") => (
    <Button href={buildathon.signupHref} size={size} icon="arrow-up-right">
      {copy.signupCta}
    </Button>
  );

  return (
    <>
      <PageHeader
        badge={when ? <Badge dot>{when}</Badge> : undefined}
        eyebrow={copy.eyebrow}
        title={buildathon.tagline}
        intro={buildathon.intro}
        actions={
          <>
            {signup("lg")}
            <Button href={site.links.discord} variant="secondary" size="lg">
              {copy.discordCta}
            </Button>
          </>
        }
      />

      <section aria-label={copy.factsLabel}>
        <Container>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {buildathon.facts.map((f) => (
              <div
                key={f.label}
                className="relative flex flex-col gap-2 overflow-hidden rounded-card border border-border bg-surface p-5 shadow-[var(--shadow-card)] grain sm:p-6"
              >
                <dt>
                  <Eyebrow as="span" className="text-fg-subtle">
                    {f.label}
                  </Eyebrow>
                </dt>
                <dd className="text-base font-medium text-fg sm:text-lg">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Section id="schedule" eyebrow={copy.schedule.eyebrow} title={copy.schedule.title} intro={copy.schedule.intro}>
        <ol className="grid gap-4 md:grid-cols-3">
          {buildathon.schedule.map((day, i) => (
            <Reveal as="li" key={day.day} delay={i * 70}>
              <Card fig={copy.schedule.dayLabel(i)} title={day.day} titleAs="h3">
                <ul className="mt-2 flex flex-col border-t border-border">
                  {day.items.map((raw) => {
                    const { time, label } = splitItem(raw);
                    return (
                      <li key={raw} className="flex items-baseline gap-4 border-b border-border py-3 last:border-b-0 last:pb-0">
                        <span className="label-mono w-20 shrink-0 text-fg-subtle">{time}</span>
                        <span className="text-fg-secondary">{label}</span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </Reveal>
          ))}
        </ol>
      </Section>

      <SplitSection id="rules" eyebrow={copy.rules.eyebrow} title={copy.rules.title} intro={copy.rules.intro}>
        <ol className="flex flex-col border-t border-border">
          {buildathon.rules.map((rule, i) => (
            <li key={rule} className="grid grid-cols-[48px_1fr] gap-4 border-b border-border py-6 sm:grid-cols-[64px_1fr]">
              <span aria-hidden className="label-mono pt-1 text-fg-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base text-fg-secondary sm:text-lg">{rule}</p>
            </li>
          ))}
        </ol>
      </SplitSection>

      <Section id="faq" eyebrow={copy.faq.eyebrow} title={copy.faq.title} size="narrow">
        <Accordion items={buildathon.faq} />
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-fg-muted">
            {copy.faq.stillPrompt}{" "}
            <a href={`mailto:${site.email}`} className="link whitespace-nowrap">
              {site.email}
            </a>
          </p>
          <div className="shrink-0">{signup("md")}</div>
        </div>
      </Section>

      <JoinUs />
    </>
  );
}
