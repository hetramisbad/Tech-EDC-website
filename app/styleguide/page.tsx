import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";
import { faq } from "@/content/faq";
import { programs } from "@/content/programs";
import { navItems, site } from "@/content/site";
import {
  Accordion,
  ArrowLink,
  Badge,
  Button,
  Card,
  EmptyState,
  Eyebrow,
  IsoBuildCohort,
  IsoBuildathon,
  IsoCommunity,
  IsoJoin,
  IsoMentorship,
  IsoNotFound,
  JoinUs,
  Kbd,
  Logo,
  LogoMark,
  NAV_SHORTCUTS,
  PageHeader,
  Panel,
  PhotoColumns,
  PostCard,
  Section,
  SocialLinks,
  TeamCard,
  Timeline,
  type IllustrationProps,
} from "@/components";
import { AccentToggle } from "./AccentToggle";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Tech@EDC design tokens and shared components.",
  robots: { index: false, follow: false },
};

const colors: { token: string; tw: string; value: string; note: string; swatch: string }[] = [
  { token: "--bg", tw: "bg-bg", value: "#09090a", note: "Page base (under the gradient)", swatch: "bg-bg" },
  { token: "--bg-plain", tw: "bg-bg-plain", value: "#050506", note: "Plain bands (surface-plain)", swatch: "bg-bg-plain" },
  { token: "--surface", tw: "bg-surface", value: "#121213", note: "Cards, panels", swatch: "bg-surface" },
  { token: "--surface-raised", tw: "bg-surface-raised", value: "#18181a", note: "Card hover, tiles", swatch: "bg-surface-raised" },
  { token: "--border", tw: "border-border", value: "white / 10%", note: "Hairline on every card", swatch: "bg-border" },
  { token: "--border-control", tw: "border-border-control", value: "white / 50%", note: "Secondary button outline", swatch: "bg-border-control" },
  { token: "--text", tw: "text-fg", value: "#f5f5f5", note: "Headings, body · 18.3:1", swatch: "bg-fg" },
  { token: "--text-secondary", tw: "text-fg-secondary", value: "#d4d4d4", note: "Nav links, art strokes · 13.4:1", swatch: "bg-fg-secondary" },
  { token: "--text-muted", tw: "text-fg-muted", value: "#a3a3a3", note: "Intros, card copy · 7.9:1", swatch: "bg-fg-muted" },
  { token: "--text-subtle", tw: "text-fg-subtle", value: "#868686", note: "Meta, key hints · 5.4:1", swatch: "bg-fg-subtle" },
  { token: "--accent", tw: "text-accent", value: "#3a8fb9", note: "Focus ring, link hover only · 5.5:1", swatch: "bg-accent" },
  { token: "--accent-brand", tw: "bg-accent-brand", value: "#004d71", note: "Edmonds College blue (reference)", swatch: "bg-accent-brand" },
];

const typeScale: { cls: string; name: string; spec: string; sample: string }[] = [
  { cls: "text-display", name: "text-display", spec: "BDO Grotesk · 44→72px · 700 · -0.035em · 1.02", sample: site.tagline },
  { cls: "text-h1", name: "text-h1", spec: "38→56px · 700 · -0.03em · 1.04", sample: "Build Cohort" },
  { cls: "text-h2", name: "text-h2", spec: "32→48px · 700 · -0.028em · 1.06", sample: "Programs" },
  { cls: "text-h3", name: "text-h3", spec: "20px · 650 · -0.012em · 1.25", sample: "Mentorship" },
  { cls: "text-lg text-fg-muted", name: "text-lg", spec: "18px · 1.55 · intros", sample: site.description },
  { cls: "text-base text-fg-secondary", name: "text-base", spec: "16px · 1.6 · body", sample: "Teams take one project from idea to working demo with a mentor." },
  { cls: "text-sm text-fg-muted", name: "text-sm", spec: "14px · 1.5 · secondary copy", sample: "Open to all Edmonds College students." },
  { cls: "label-mono text-fg-muted", name: "label-mono", spec: "Geist Mono · 13px · mixed case", sample: "First Name · Nov 15, 2026 · Program" },
  { cls: "font-mono text-sm text-fg-secondary", name: "font-mono", spec: "Geist Mono · nav, buttons, inputs", sample: "[P] Programs  [E] Events  [T] Team  [B] Blog" },
];

const illustrations: { name: string; use: string; C: ComponentType<IllustrationProps> }[] = [
  { name: "IsoCommunity", use: "Community section", C: IsoCommunity },
  { name: "IsoBuildCohort", use: "Build Cohort card / page", C: IsoBuildCohort },
  { name: "IsoMentorship", use: "Mentorship card / page", C: IsoMentorship },
  { name: "IsoBuildathon", use: "Buildathon card / page", C: IsoBuildathon },
  { name: "IsoJoin", use: "Join Us (default art)", C: IsoJoin },
  { name: "IsoNotFound", use: "404 page", C: IsoNotFound },
];

const programArt: Record<string, ComponentType<IllustrationProps>> = {
  "build-cohort": IsoBuildCohort,
  mentorship: IsoMentorship,
  buildathon: IsoBuildathon,
};

function Demo({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 border-t border-border pt-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-mono text-sm text-fg">{title}</h3>
        {note && <p className="max-w-[720px] text-sm text-fg-muted">{note}</p>}
      </div>
      {children}
    </div>
  );
}

function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-[0.9em] text-fg-secondary">{children}</code>;
}

function AccentSample({ label }: { label: string }) {
  return (
    <Panel className="flex flex-col items-start gap-5 p-6 sm:p-8">
      <Eyebrow>{label}</Eyebrow>
      <p className="text-h3 text-fg">{site.tagline}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" href={site.links.discord}>
          Join Discord
        </Button>
        <span className="inline-flex h-9 items-center rounded-control border border-border-control px-3.5 font-mono text-[0.8125rem] text-fg shadow-[var(--focus-ring)]">
          Focus ring
        </span>
      </div>
      <p className="text-sm text-fg-muted">
        Link hover: <span className="text-accent underline underline-offset-4">{site.email}</span>
      </p>
    </Panel>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <PageHeader
        badge={<Badge>Internal · not indexed</Badge>}
        eyebrow="Tech@EDC design system · v2"
        title="Styleguide"
        intro="Tech@NYU is the main reference: near-black grid background, bold BDO Grotesk headings, mono UI text, square 1px-bordered cards, and our own isometric line drawings. One accent, used only for focus and link hover."
        actions={<AccentToggle />}
        media={<IsoCommunity />}
      />

      <Section
        id="background"
        eyebrow="Background"
        title="Gradient, grain, cubes"
        intro={
          <>
            Fixed behind every page: a near-black linear gradient (a ~3% Edmonds-blue tint at the very top), an SVG{" "}
            <Code>feTurbulence</Code> grain tile, and a square grid with 40px cells and faint 10px subdivisions, centered.
            It fades a little toward the bottom of the viewport. No animation.
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { k: "Default", d: "Section surface=\"grid\" (transparent). The hero and most sections.", cls: "" },
            { k: "surface-plain", d: "Section surface=\"plain\": opaque #050506 + grain, no grid. For dense bands, like Tech@NYU below its hero.", cls: "surface-plain" },
            { k: "surface-grid", d: "The grid on a single element that scrolls with it (e.g. a band inside a plain area).", cls: "surface-grid" },
          ].map((b) => (
            <div key={b.k} className={`flex min-h-[200px] flex-col justify-end gap-2 rounded-card border border-border p-5 ${b.cls}`}>
              <span className="font-mono text-sm text-fg">{b.k}</span>
              <span className="text-sm text-fg-muted">{b.d}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="plain-demo"
        surface="plain"
        align="center"
        eyebrow={'<Section surface="plain" align="center">'}
        title="Programs"
        intro="Centered headings for Programs and Events, on a plain band. This is what Home should use below the hero."
      />

      <Section
        id="accent"
        eyebrow="Accent"
        title="With and without Triton blue"
        intro={
          <>
            Blue appears only in focus rings and link hover. Toggle above, open any page with <Code>?accent=none</Code>, or set{" "}
            <Code>data-accent=&quot;none&quot;</Code> on any element.
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <AccentSample label="Accent: Triton blue" />
          <div data-accent="none">
            <AccentSample label='Accent: data-accent="none"' />
          </div>
        </div>
      </Section>

      <Section id="color" eyebrow="Color" title="Near-monochrome palette" intro="Tailwind's default palette is disabled. Use these utilities; contrast ratios are against --bg.">
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((c) => (
            <li key={c.token} className="flex items-center gap-4 border-t border-border py-4">
              <span className={`size-11 shrink-0 rounded-sm border border-border-strong ${c.swatch}`} />
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

      <Section
        id="type"
        eyebrow="Typography"
        title="BDO Grotesk + Geist Mono"
        intro={
          <>
            BDO Grotesk (variable 300–900, self-hosted, SIL OFL) for headings and body. Geist Mono for UI text: navbar, buttons,
            labels, form labels, key hints and meta. Default Tailwind text sizes are disabled; use the scale below.
          </>
        }
      >
        <div className="flex flex-col">
          {typeScale.map((t) => (
            <div key={t.name} className="grid gap-2 border-t border-border py-6 md:grid-cols-[240px_1fr] md:gap-8">
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
          <Demo title="Button" note="primary (white, square, mono) · secondary (drawn outline) · ghost. Sizes sm / md / lg. Tab to see the focus ring.">
            <div className="flex flex-wrap items-center gap-3">
              <Button href={site.links.discord} size="lg" iconLeft="discord">
                Join Discord
              </Button>
              <Button href="/#programs" variant="secondary" size="lg">
                Explore programs
              </Button>
              <Button variant="ghost" size="lg">
                Ghost
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary md</Button>
              <Button variant="secondary">Secondary md</Button>
              <Button size="sm">Primary sm</Button>
              <Button size="sm" variant="secondary" icon="arrow-up-right">
                Secondary sm
              </Button>
              <Button size="sm" variant="secondary" kbd="C">
                Contact
              </Button>
              <Button disabled>Disabled</Button>
            </div>
          </Demo>

          <Demo
            title="Navbar shortcuts · Kbd"
            note="Mono links with bracket hints, like the reference. Single keys work from anywhere: ignored while typing in a field, with Ctrl/Cmd/Alt/Shift held, or when the mobile menu or a dialog is open. Each link carries aria-keyshortcuts; the bracket hint is aria-hidden. Contact (C) shows no hint, matching the reference."
          >
            <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-3 font-mono text-sm text-fg-secondary">
              {navItems.map((item) => (
                <li key={item.label} className="flex items-baseline gap-1.5">
                  <Kbd className="text-fg-subtle">{NAV_SHORTCUTS[item.label]}</Kbd>
                  <span>{item.label}</span>
                  <span className="text-xs text-fg-subtle">
                    {item.href.startsWith("mailto:") ? "mailto" : item.external ? "new tab" : item.href}
                  </span>
                </li>
              ))}
            </ul>
          </Demo>

          <Demo title="Badge" note="Plain bordered mono tag. No dot (the old `dot` prop is a no-op). href adds an arrow.">
            <div className="flex flex-wrap items-center gap-3">
              <Badge href={site.announcement.href}>{site.announcement.text}</Badge>
              <Badge>Fri Jan 23 – Sun Jan 25</Badge>
              <Badge>Leadership</Badge>
            </div>
          </Demo>

          <Demo title="ArrowLink" note='Defaults to "Learn more". ↗ for external links, → for internal. Without href it renders a span, for use inside linked cards.'>
            <div className="flex flex-wrap items-center gap-8">
              <ArrowLink href="/programs/build-cohort/" />
              <ArrowLink href={site.links.luma}>See all events on Luma</ArrowLink>
              <p className="text-sm text-fg-muted">
                Inline copy link:{" "}
                <a className="link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
            </div>
          </Demo>

          <Demo title="Logo" note="Power-button mark on a near-square tile, currentColor. Also /brand/logo.svg and app/icon.svg (favicon).">
            <div className="flex flex-wrap items-center gap-8">
              <Logo />
              <LogoMark size={40} title="Tech@EDC" />
              <span className="text-fg-muted">
                <LogoMark size={24} />
              </span>
            </div>
          </Demo>
        </div>
      </Section>

      <Section
        id="cards"
        surface="plain"
        align="center"
        eyebrow="Cards"
        title="Program cards"
        intro="Square corners, 1px border, grain. A linked card is one link; its border brightens on hover. Media renders flush at the bottom: no frame inside the frame."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {programs.slice(0, 3).map((p) => {
            const Art = programArt[p.slug] ?? IsoBuildCohort;
            return (
              <Card key={p.slug} href={p.href} title={p.name} footer={<ArrowLink />} media={<Art className="w-full max-w-[300px] text-fg-secondary" />}>
                {p.summary}
              </Card>
            );
          })}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card title="Static card">No href: a plain surface for outcomes, requirements and similar content.</Card>
          <Panel className="flex flex-col justify-center gap-2 p-6 sm:p-8">
            <span className="font-mono text-sm text-fg">Panel</span>
            <span className="text-sm text-fg-muted">Larger framed surface (6px radius) for timelines and application details. Do not put Cards inside it.</span>
          </Panel>
        </div>
      </Section>

      <Section
        id="illustrations"
        eyebrow="Illustrations"
        title="Isometric line art"
        intro={
          <>
            Our own drawings, one projection and stroke weight. Stroke is <Code>currentColor</Code> (use <Code>text-fg-secondary</Code>
            ); face tones come from <Code>--iso-*</Code>. Decorative by default; pass <Code>title</Code> to expose one. Larger
            versions at <a className="link" href="/styleguide/illustrations/">/styleguide/illustrations/</a>.
          </>
        }
      >
        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {illustrations.map(({ name, use, C }) => (
            <li key={name} className="flex flex-col gap-4 border-t border-border pt-6">
              <div className="flex aspect-[4/3] items-center justify-center">
                <C className="max-h-full w-full max-w-[320px] text-fg-secondary" />
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-sm text-fg">{name}</span>
                <span className="text-xs text-fg-subtle">{use}</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="events-demo" eyebrow="PhotoColumns" title="Events layout" align="center" intro="Two columns drift in opposite directions, pause on hover, and stop under reduced motion. Placeholder tiles until real photos exist.">
        <PhotoColumns>
          <p className="max-w-[420px] text-lg text-fg-secondary">
            Workshops, build nights, speaker sessions and the Buildathon, open to every student at {site.college}.
          </p>
          <p className="max-w-[420px] text-base text-fg-muted">Children render centered between the columns.</p>
          <Button href={site.links.luma} variant="secondary" icon="arrow-up-right">
            See events on Luma
          </Button>
        </PhotoColumns>
      </Section>

      <Section id="accordion" eyebrow="Accordion" title="FAQ" intro="Click or press Enter/Space. Up/Down/Home/End move between questions." size="narrow">
        <Accordion items={faq} />
      </Section>

      <Section id="people" eyebrow="Content" title="Team, posts, timelines">
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
          <Demo title="Timeline" note="Dated steps for program pages and the Buildathon schedule. Square markers.">
            <Timeline items={programs[0].timeline} />
          </Demo>
          <Demo title="EmptyState" note='Used for "Roster coming soon" on /team.'>
            <EmptyState
              eyebrow="Team"
              title="Roster coming soon"
              actions={
                <Button href={site.links.discord} size="sm" variant="secondary">
                  Say hi on Discord
                </Button>
              }
            >
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
            The root layout renders the skip link, <Code>&lt;Navbar/&gt;</Code>, <Code>&lt;main id=&quot;content&quot;&gt;</Code> and{" "}
            <Code>&lt;Footer/&gt;</Code>. A page returns a fragment of sections and never renders its own <Code>&lt;main&gt;</Code>.
            Import everything from <Code>@/components</Code>; copy and URLs from <Code>@/content/*</Code>.
          </p>
          <pre className="overflow-x-auto rounded-card border border-border bg-surface p-5 font-mono text-xs leading-relaxed text-fg-secondary">{`export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Program" title="Build Cohort" intro="…"
        media={<IsoBuildCohort />}
        actions={<Button href={applyHref}>Apply</Button>} />
      <Section id="outcomes" title="Outcomes" surface="plain">
        <div className="grid gap-4 md:grid-cols-3">
          {outcomes.map(o => <Card key={o.title} title={o.title}>{o.body}</Card>)}
        </div>
      </Section>
      <JoinUs />   {/* every page ends with this */}
    </>
  );
}`}</pre>
          <ul className="flex flex-col gap-2">
            {[
              ["Section", "id, eyebrow, title, intro, actions, align (left | center), titleAs, size, divider, space, bleed, surface (grid | plain)"],
              ["PageHeader", "eyebrow, title (h1), intro, actions, badge, media (art at right), align (left | center)"],
              ["Container", 'size: "page" | "narrow" | "prose"'],
              ["Button", "variant, size, href, external, icon, iconLeft, kbd (shown as [K]); button when no href"],
              ["Card", "href, title, titleAs, media (rendered flush), footer, padding · fig: no-op"],
              ["Panel / Placeholder", "framed surface / caption + aspect stand-in tile"],
              ["Badge", "href · dot: no-op"],
              ["Kbd", "children (key) rendered as [K]; decorative, pair with aria-keyshortcuts"],
              ["ArrowLink", "href (omit inside linked cards), external, children"],
              ["Accordion", "items {q,a}[], multiple, defaultOpen, headingAs"],
              ["PhotoColumns", "children (centered text), images {src,alt}[], placeholderCaptions, label, duration"],
              ["Gallery", "images, label, placeholderCaptions, duration (horizontal marquee, legacy)"],
              ["Iso*", "className, title (IsoCommunity, IsoBuildCohort, IsoMentorship, IsoBuildathon, IsoJoin, IsoNotFound)"],
              ["NewsletterForm / JoinUs", "endpoint / title, intro, contactPrompt, illustration (default IsoJoin, false hides)"],
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

      <JoinUs />
    </>
  );
}
