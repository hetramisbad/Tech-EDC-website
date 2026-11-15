import type { Metadata } from "next";
import type { ReactNode } from "react";
import { faq } from "@/content/faq";
import { programs } from "@/content/programs";
import { site } from "@/content/site";
import {
  Accordion,
  ArrowLink,
  Badge,
  Button,
  Card,
  Container,
  EmptyState,
  Eyebrow,
  Gallery,
  JoinUs,
  Logo,
  LogoMark,
  PageHeader,
  Panel,
  Placeholder,
  PostCard,
  Section,
  SocialLinks,
  TeamCard,
  Timeline,
} from "@/components";
import { AccentToggle } from "./AccentToggle";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Tech@EDC design tokens and shared components.",
  robots: { index: false, follow: false },
};

const colors: { token: string; tw: string; value: string; note: string }[] = [
  { token: "--bg", tw: "bg-bg", value: "#08090a", note: "Page background" },
  { token: "--surface", tw: "bg-surface", value: "#0f1011", note: "Cards, panels" },
  { token: "--surface-raised", tw: "bg-surface-raised", value: "#141516", note: "Hover, inset tiles" },
  { token: "--surface-hover", tw: "bg-surface-hover", value: "#191a1c", note: "Pressed / selected" },
  { token: "--border", tw: "border-border", value: "white / 8%", note: "Hairline on every panel" },
  { token: "--border-strong", tw: "border-border-strong", value: "white / 14%", note: "Controls, inputs" },
  { token: "--text", tw: "text-fg", value: "#f7f8f8", note: "Headings, body · 18.7:1" },
  { token: "--text-secondary", tw: "text-fg-secondary", value: "#d0d6e0", note: "Emphasized secondary · 13.6:1" },
  { token: "--text-muted", tw: "text-fg-muted", value: "#8a8f98", note: "Intros, captions · 6.1:1" },
  { token: "--text-subtle", tw: "text-fg-subtle", value: "#7c818a", note: "Meta, fig labels · 4.9:1" },
  { token: "--accent", tw: "text-accent", value: "#4c7fd6", note: "Focus, link hover, dot · 5.0:1" },
  { token: "--accent-brand", tw: "bg-accent-brand", value: "#1f4e9c", note: "Triton blue (unconfirmed), tiny fills only" },
];

const swatchBg: Record<string, string> = {
  "--bg": "bg-bg",
  "--surface": "bg-surface",
  "--surface-raised": "bg-surface-raised",
  "--surface-hover": "bg-surface-hover",
  "--border": "bg-border",
  "--border-strong": "bg-border-strong",
  "--text": "bg-fg",
  "--text-secondary": "bg-fg-secondary",
  "--text-muted": "bg-fg-muted",
  "--text-subtle": "bg-fg-subtle",
  "--accent": "bg-accent",
  "--accent-brand": "bg-accent-brand",
};

const typeScale: { cls: string; name: string; spec: string; sample: string }[] = [
  { cls: "text-display", name: "text-display", spec: "40→72px · 600 · -0.035em · 1.04", sample: "Build what you're curious about." },
  { cls: "text-h1", name: "text-h1", spec: "36→56px · 600 · -0.03em · 1.08", sample: "Programs for every builder" },
  { cls: "text-h2", name: "text-h2", spec: "28→40px · 600 · -0.025em · 1.12", sample: "Frequently asked questions" },
  { cls: "text-h3", name: "text-h3", spec: "20px · 560 · -0.015em · 1.3", sample: "Build Cohort" },
  { cls: "text-lg text-fg-muted", name: "text-lg", spec: "18px · 1.6 · intros and subheads", sample: site.description },
  { cls: "text-base text-fg-secondary", name: "text-base", spec: "16px · 1.6 · body", sample: "Teams take one project from idea to working demo with a mentor." },
  { cls: "text-sm text-fg-muted", name: "text-sm", spec: "14px · 1.5 · secondary copy, nav, buttons", sample: "Open to all Edmonds College students." },
  { cls: "text-xs text-fg-muted", name: "text-xs", spec: "13px · captions, meta, form labels", sample: "Applications close at the end of week 1." },
  { cls: "label-mono text-fg-muted", name: "label-mono", spec: "12px mono · uppercase · +0.08em", sample: "Fig 0.1 · Eyebrow" },
];

function Demo({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-fg">{title}</h3>
        {note && <p className="text-xs text-fg-muted">{note}</p>}
      </div>
      {children}
    </div>
  );
}

function AccentSample({ label }: { label: string }) {
  return (
    <Panel className="flex flex-col items-start gap-5 p-6 sm:p-8">
      <Eyebrow>{label}</Eyebrow>
      <Badge dot href={site.announcement.href}>
        {site.announcement.text}
      </Badge>
      <p className="text-h3 text-fg">{site.tagline}</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm" href={site.links.discord}>
          Join Discord
        </Button>
        <span className="text-sm text-accent">Link hover color</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 items-center rounded-control px-3 text-xs text-fg-secondary shadow-[var(--focus-ring)]">
          Focus ring
        </span>
        <span aria-hidden className="size-2 rounded-full bg-accent" />
        <span className="text-xs text-fg-muted">Badge dot</span>
      </div>
    </Panel>
  );
}

export default function StyleguidePage() {
  const programCards = programs.slice(0, 3);
  return (
    <>
      <PageHeader
        badge={<Badge dot>Internal · not indexed</Badge>}
        eyebrow="Tech@EDC design system"
        title="Styleguide"
        intro="Tokens and shared components every page is built from. Dark, quiet and precise: near-black surfaces, hairlines, tight type, one quiet accent."
        actions={<AccentToggle />}
      />

      <Section id="accent" eyebrow="Accent" title="With and without Triton blue" intro={<>Blue only appears in focus rings, link hover and the badge dot. Toggle site-wide above, open any page with <code className="font-mono text-fg-secondary">?accent=none</code>, or set <code className="font-mono text-fg-secondary">data-accent=&quot;none&quot;</code> on any element.</>}>
        <div className="grid gap-4 md:grid-cols-2">
          <AccentSample label="Accent: Triton blue" />
          <div data-accent="none">
            <AccentSample label='Accent: data-accent="none"' />
          </div>
        </div>
      </Section>

      <Section id="color" eyebrow="Color" title="Near-monochrome palette" intro="Tailwind's default palette is disabled. Use these utilities; contrast ratios are against --bg.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((c) => (
            <li key={c.token} className="flex items-center gap-4 rounded-card border border-border bg-surface p-3">
              <span className={`size-12 shrink-0 rounded-control border border-border-strong ${swatchBg[c.token]}`} />
              <span className="flex min-w-0 flex-col">
                <span className="font-mono text-xs text-fg">{c.token}</span>
                <span className="font-mono text-xs text-fg-muted">
                  {c.tw} · {c.value}
                </span>
                <span className="truncate text-xs text-fg-subtle">{c.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="type" eyebrow="Typography" title="Inter, tightly tracked" intro="Inter Variable via @fontsource. Default Tailwind text sizes are disabled; use the scale below.">
        <div className="flex flex-col">
          {typeScale.map((t) => (
            <div key={t.name} className="grid gap-2 border-t border-border py-6 md:grid-cols-[220px_1fr] md:gap-8">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-fg">{t.name}</span>
                <span className="text-xs text-fg-subtle">{t.spec}</span>
              </div>
              <p className={t.cls}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="components" eyebrow="Components" title="Controls">
        <div className="flex flex-col gap-10">
          <Demo title="Button" note="primary (white on black) · secondary (bordered) · ghost. Sizes sm / md / lg. Tab to see the focus ring, hover for states.">
            <div className="flex flex-wrap items-center gap-3">
              <Button href={site.links.discord} size="lg">Join Discord</Button>
              <Button href="/#programs" variant="secondary" size="lg" icon="arrow-right">Explore programs</Button>
              <Button variant="ghost" size="lg">Ghost</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary md</Button>
              <Button variant="secondary">Secondary md</Button>
              <Button variant="ghost">Ghost md</Button>
              <Button size="sm">Primary sm</Button>
              <Button size="sm" variant="secondary" icon="arrow-up-right">Secondary sm</Button>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </Demo>

          <Demo title="Badge" note="Pill; optional accent dot (pulses unless reduced motion); href makes it a link with an arrow.">
            <div className="flex flex-wrap items-center gap-3">
              <Badge dot href={site.announcement.href}>{site.announcement.text}</Badge>
              <Badge dot>Next event Friday</Badge>
              <Badge>Beginner friendly</Badge>
            </div>
          </Demo>

          <Demo title="ArrowLink" note='Defaults to "Learn more". Without href it renders a span, for use inside linked cards.'>
            <div className="flex flex-wrap items-center gap-8">
              <ArrowLink href="/programs/build-cohort/" />
              <ArrowLink href={site.links.luma}>See all events on Luma</ArrowLink>
              <p className="text-sm text-fg-muted">
                Inline copy link: <a className="link" href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </div>
          </Demo>

          <Demo title="Logo" note="Power-button mark, currentColor. Also at /brand/logo.svg and app/icon.svg (favicon).">
            <div className="flex flex-wrap items-center gap-8">
              <Logo />
              <LogoMark size={40} title="Tech@EDC" />
              <span className="text-fg-muted"><LogoMark size={24} /></span>
            </div>
          </Demo>
        </div>
      </Section>

      <Section id="cards" eyebrow="Cards" title="Panels as the main visual unit" intro="Hairline border, 12px radius, faint grain. A linked card is a single link with hover glow; put no other links inside it.">
        <div className="grid gap-4 md:grid-cols-3">
          {programCards.map((p) => (
            <Card
              key={p.slug}
              href={p.href}
              fig={p.fig}
              title={p.name}
              footer={<ArrowLink />}
              media={<Placeholder caption={p.fig} aspect="16/10" />}
            >
              {p.summary}
            </Card>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card title="Static card" fig="Fig 1.0">
            No href: a plain surface for outcomes, requirements and similar content.
          </Card>
          <Panel className="p-3">
            <Placeholder caption="Panel + Placeholder · hero visual frame" aspect="21/9" />
          </Panel>
        </div>
      </Section>

      <Section id="accordion" eyebrow="Accordion" title="FAQ" intro="Click or press Enter/Space. Up/Down/Home/End move between questions." size="narrow">
        <Accordion items={faq} />
      </Section>

      <Section id="gallery" eyebrow="Gallery" title="Event marquee" intro="Scrolls slowly, pauses on hover, static under reduced motion. Placeholder tiles until real photos exist." bleed={<Gallery />} />

      <Section id="people" eyebrow="Content cards" title="Team, posts, timelines">
        <div className="flex flex-col gap-10">
          <Demo title="TeamCard" note="Photo or initials fallback. Sample people for illustration only.">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              <TeamCard name="Sample Officer" role="President" links={[{ label: "LinkedIn", href: site.links.linkedin }]} />
              <TeamCard name="Another Member" role="Events Lead" />
              <TeamCard name="Third Person" role="Design Lead" />
            </div>
          </Demo>
          <Demo title="PostCard" note="Whole card links. featured = larger layout for the /blog featured row.">
            <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
              <PostCard
                featured
                title="Welcome to Tech@EDC"
                date="2026-11-15"
                author="Tech@EDC Officers"
                summary="Who we are, what we are building this year, and how to get involved."
                href="/blog/welcome-to-tech-at-edc/"
              />
              <PostCard
                title="Welcome to Tech@EDC"
                date="2026-11-15"
                summary="Who we are, what we are building this year, and how to get involved."
                href="/blog/welcome-to-tech-at-edc/"
              />
            </div>
          </Demo>
          <Demo title="Timeline" note="Dated steps for program pages and the Buildathon schedule.">
            <Timeline items={programs[0].timeline} />
          </Demo>
          <Demo title="EmptyState" note='Used for "Roster coming soon" on /team.'>
            <EmptyState eyebrow="Team" title="Roster coming soon" actions={<Button href={site.links.discord} size="sm" variant="secondary">Say hi on Discord</Button>}>
              Officer profiles will appear here once the team is set for the year.
            </EmptyState>
          </Demo>
          <Demo title="SocialLinks" note='variant="list" for the Connect section, "icons" (default) in the footer.'>
            <SocialLinks variant="list" />
            <SocialLinks />
          </Demo>
        </div>
      </Section>

      <Section id="usage" eyebrow="Usage" title="How to build a page" size="narrow">
        <div className="flex flex-col gap-6 text-[0.9375rem] leading-relaxed text-fg-muted">
          <p>
            The root layout already renders the skip link, <code className="font-mono text-fg-secondary">&lt;Navbar/&gt;</code>,{" "}
            <code className="font-mono text-fg-secondary">&lt;main id=&quot;content&quot;&gt;</code> and{" "}
            <code className="font-mono text-fg-secondary">&lt;Footer/&gt;</code>. A page returns a fragment of sections and never
            renders its own <code className="font-mono text-fg-secondary">&lt;main&gt;</code>. Import everything from{" "}
            <code className="font-mono text-fg-secondary">@/components</code>; copy and URLs from{" "}
            <code className="font-mono text-fg-secondary">@/content/*</code>.
          </p>
          <pre className="overflow-x-auto rounded-card border border-border bg-surface p-5 font-mono text-xs leading-relaxed text-fg-secondary">{`export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Program" title="Build Cohort" intro="…" actions={<Button href={applyHref}>Apply</Button>} />
      <Section id="outcomes" title="Outcomes" intro="…">
        <div className="grid gap-4 md:grid-cols-3">
          {outcomes.map(o => <Card key={o.title} title={o.title}>{o.body}</Card>)}
        </div>
      </Section>
      <Section id="timeline" title="Timeline" divider><Timeline items={timeline} /></Section>
      <JoinUs />   {/* every page ends with this */}
    </>
  );
}`}</pre>
          <ul className="flex flex-col gap-2">
            {[
              ["Section", "id, eyebrow, title, intro, actions, align, titleAs, size, divider, space, bleed"],
              ["PageHeader", "eyebrow, title (h1), intro, actions, badge"],
              ["Container", 'size: "page" | "narrow" | "prose"'],
              ["Button", 'variant, size, href, external, icon, iconLeft (button when no href)'],
              ["Card", "href, fig, title, titleAs, media, footer, padding"],
              ["Panel / Placeholder", "large framed surface / caption + aspect stand-in visual"],
              ["Badge", "dot, href"],
              ["ArrowLink", "href (omit inside linked cards), external, children"],
              ["Accordion", "items {q,a}[], multiple, defaultOpen, headingAs"],
              ["Gallery", "images {src,alt}[], label, placeholderCaptions, duration"],
              ["NewsletterForm / JoinUs", "endpoint / title, intro"],
              ["TeamCard / PostCard", "Member fields / title, date, summary, href, author, featured"],
              ["Timeline / EmptyState / SocialLinks / Prose / Reveal", "items / eyebrow,title,actions / variant / children / delay"],
            ].map(([k, v]) => (
              <li key={k} className="grid gap-1 border-t border-border pt-2 sm:grid-cols-[220px_1fr]">
                <span className="font-mono text-xs text-fg">{k}</span>
                <span className="text-xs text-fg-muted">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Container>
        <hr />
      </Container>
      <JoinUs />
    </>
  );
}
