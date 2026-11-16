import type { Metadata } from "next";
import clsx from "clsx";
import { buildathon } from "@/content/buildathon";
import { site } from "@/content/site";
import { Accordion, Button, Card, Container, Eyebrow, IsoBuildathon, JoinUs, PageHeader, Reveal, Section } from "@/components";
import { buildathonCopy as copy } from "@/content/pages";
import { ContactLine, SplitSection } from "@/lib/page-ui";

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
  const signup = (size: "md" | "lg") => (
    <Button href={buildathon.signupHref} size={size} icon="arrow-up-right">
      {copy.signupCta}
    </Button>
  );

  // Bands: header on the grid; facts + schedule plain; rules on the grid;
  // FAQ plain; Join Us on the grid (same rhythm as the program pages).
  return (
    <>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={buildathon.tagline}
        intro={buildathon.intro}
        media={<IsoBuildathon />}
        className="lg:pb-28"
        actions={
          <>
            {signup("lg")}
            <Button href={site.links.discord} variant="secondary" size="lg">
              {copy.discordCta}
            </Button>
          </>
        }
      />

      <div className="surface-plain">
        {/* One hairline strip split into cells (no card per fact). */}
        <section aria-label={copy.factsLabel} className="pt-[var(--section-space)]">
          <Container>
            <dl className="grid grid-cols-1 border border-border min-[480px]:grid-cols-2 lg:grid-cols-4">
              {buildathon.facts.map((f, i) => (
                <div
                  key={f.label}
                  className={clsx(
                    "flex flex-col gap-2 border-border p-5 sm:p-6",
                    i > 0 && "border-t",
                    i === 1 && "min-[480px]:border-t-0 min-[480px]:border-l",
                    i === 3 && "min-[480px]:border-l",
                    i >= 2 && "lg:border-t-0 lg:border-l",
                  )}
                >
                  <dt>
                    <Eyebrow as="span">{f.label}</Eyebrow>
                  </dt>
                  <dd className="text-base font-medium text-fg sm:text-lg">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        <Section id="schedule" title={copy.schedule.title} intro={copy.schedule.intro} align="center">
          <ol className="grid gap-4 md:grid-cols-3">
            {buildathon.schedule.map((day, i) => (
              <Reveal as="li" key={day.day} delay={i * 70}>
                <Card title={day.day} titleAs="h3">
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
      </div>

      <SplitSection id="rules" title={copy.rules.title} intro={copy.rules.intro}>
        <ol className="flex flex-col border-t border-border">
          {buildathon.rules.map((rule, i) => (
            <li key={rule} className="grid grid-cols-[48px_1fr] gap-4 border-b border-border py-6 sm:grid-cols-[64px_1fr]">
              <span aria-hidden className="label-mono pt-1 text-fg-subtle">
                [{i + 1}]
              </span>
              <p className="text-base text-fg-secondary sm:text-lg">{rule}</p>
            </li>
          ))}
        </ol>
      </SplitSection>

      <Section id="faq" title={copy.faq.title} align="center" size="narrow" surface="plain">
        <div className="text-left">
          <Accordion items={buildathon.faq} />
        </div>
        <ContactLine prompt={copy.faq.stillPrompt} email={site.email} action={signup("md")} />
      </Section>

      <JoinUs />
    </>
  );
}
