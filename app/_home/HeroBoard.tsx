import clsx from "clsx";
import type { ReactNode } from "react";
import { LogoMark, Panel } from "@/components";

/*
  Decorative "club dashboard" for the hero panel. Pure HTML/CSS built from
  design tokens; every project, name and date here is fictional and the whole
  thing is aria-hidden. It is a picture of what the club does, not a product.

  Responsive: sidebar from md, right rail from lg, label/assignee columns from
  sm. The frame has a fixed height per breakpoint and fades out at the bottom,
  so extra rows never stretch the hero.
*/

type Status = "planning" | "progress" | "review" | "shipped";

const groups: { status: Status; title: string; rows: Row[] }[] = [
  {
    status: "progress",
    title: "In progress",
    rows: [
      { id: "EDC-121", title: "Study room finder for campus", label: "Web", who: "AK", due: "Wk 7" },
      { id: "EDC-118", title: "Bus arrival display for the student lounge", label: "Hardware", who: "JM", due: "Wk 8" },
      { id: "EDC-116", title: "Event check-in app", label: "Mobile", who: "RS", due: "Wk 8" },
    ],
  },
  {
    status: "review",
    title: "In review",
    rows: [
      { id: "EDC-112", title: "Course planner with transfer paths", label: "Web", who: "LT", due: "Wk 6" },
      { id: "EDC-109", title: "Accessible campus map redesign", label: "Design", who: "NP", due: "Wk 6" },
    ],
  },
  {
    status: "shipped",
    title: "Shipped",
    rows: [
      { id: "EDC-104", title: "Study group matcher", label: "Web", who: "DV", due: "Wk 4" },
      { id: "EDC-101", title: "Club website, version one", label: "Design", who: "MC", due: "Wk 3" },
    ],
  },
];

type Row = { id: string; title: string; label: string; who: string; due: string };

const labelDot: Record<string, string> = {
  Web: "bg-fg-secondary",
  Mobile: "bg-fg-muted",
  Hardware: "bg-fg-subtle",
  Design: "bg-accent",
};

export function HeroBoard() {
  return (
    <Panel className="p-1.5 sm:p-2">
      <div
        aria-hidden
        className={clsx(
          "flex h-84 overflow-hidden rounded-card border border-border bg-bg select-none sm:h-110 lg:h-140",
          "[mask-image:linear-gradient(to_bottom,#000_72%,transparent)]",
        )}
      >
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="min-h-0 flex-1 overflow-hidden">
            {groups.map((g) => (
              <section key={g.title}>
                <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2 sm:px-5">
                  <StatusIcon status={g.status} />
                  <span className="text-xs font-medium text-fg-secondary">{g.title}</span>
                  <span className="text-xs text-fg-subtle">{g.rows.length}</span>
                </div>
                {g.rows.map((r) => (
                  <ProjectRow key={r.id} row={r} status={g.status} />
                ))}
              </section>
            ))}
          </div>
        </div>
        <RightRail />
      </div>
    </Panel>
  );
}

function Sidebar() {
  return (
    <div className="hidden w-52 shrink-0 flex-col gap-6 border-r border-border bg-surface px-3 py-4 md:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="flex size-5 items-center justify-center rounded-sm bg-fg text-fg-inverse">
          <LogoMark size={12} />
        </span>
        <span className="text-sm font-medium text-fg">Tech@EDC</span>
        <Chevron className="ml-auto text-fg-subtle" />
      </div>

      <nav className="flex flex-col gap-0.5">
        <NavItem icon={<GlyphInbox />} count="3">
          Inbox
        </NavItem>
        <NavItem icon={<GlyphTarget />}>My work</NavItem>
      </nav>

      <div className="flex flex-col gap-0.5">
        <span className="label-mono px-2 pb-1.5 text-fg-subtle">Programs</span>
        <NavItem icon={<Square tone="bg-fg-secondary" />} active>
          Build Cohort
        </NavItem>
        <NavItem icon={<Square tone="bg-fg-muted" />}>Mentorship</NavItem>
        <NavItem icon={<Square tone="bg-fg-subtle" />}>Buildathon</NavItem>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="label-mono px-2 pb-1.5 text-fg-subtle">Views</span>
        <NavItem icon={<GlyphGrid />}>Showcase</NavItem>
        <NavItem icon={<GlyphCalendar />}>Calendar</NavItem>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  children,
  active,
  count,
}: {
  icon: ReactNode;
  children: ReactNode;
  active?: boolean;
  count?: string;
}) {
  return (
    <div
      className={clsx(
        "flex h-7 items-center gap-2.5 rounded-sm px-2 text-xs",
        active ? "bg-surface-hover text-fg" : "text-fg-muted",
      )}
    >
      <span className="flex size-3.5 items-center justify-center">{icon}</span>
      <span className="truncate">{children}</span>
      {count && <span className="ml-auto text-fg-subtle">{count}</span>}
    </div>
  );
}

function TopBar() {
  return (
    <div className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-5">
      <span className="flex items-center gap-1.5 text-xs">
        <span className="hidden text-fg-muted sm:inline">Build Cohort</span>
        <span className="hidden text-fg-subtle sm:inline">/</span>
        <span className="font-medium text-fg">Projects</span>
      </span>
      <div className="ml-1 flex items-center gap-1">
        <Tab active>All</Tab>
        <Tab>Active</Tab>
        <span className="hidden sm:inline-flex">
          <Tab>Shipped</Tab>
        </span>
      </div>
      <span className="ml-auto flex h-6 items-center gap-1.5 rounded-sm border border-border px-2 text-xs text-fg-muted">
        <GlyphFilter />
        <span className="hidden sm:inline">Filter</span>
      </span>
    </div>
  );
}

function Tab({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={clsx(
        "flex h-6 items-center rounded-sm px-2 text-xs",
        active ? "border border-border-strong bg-surface-raised text-fg" : "text-fg-muted",
      )}
    >
      {children}
    </span>
  );
}

function ProjectRow({ row, status }: { row: Row; status: Status }) {
  return (
    <div className="flex h-11 items-center gap-3 border-b border-border px-4 text-xs sm:px-5">
      <span className="label-mono w-16 shrink-0 text-fg-subtle">{row.id}</span>
      <StatusIcon status={status} />
      <span className={clsx("min-w-0 flex-1 truncate", status === "shipped" ? "text-fg-muted" : "text-fg-secondary")}>
        {row.title}
      </span>
      <span className="hidden h-5 shrink-0 items-center gap-1.5 rounded-full border border-border px-2 text-fg-muted sm:flex">
        <span className={clsx("size-1.5 rounded-full", labelDot[row.label] ?? "bg-fg-subtle")} />
        {row.label}
      </span>
      <span className="hidden w-10 shrink-0 text-right text-fg-subtle xl:inline">{row.due}</span>
      <Avatar initials={row.who} className="hidden sm:flex" />
    </div>
  );
}

function RightRail() {
  return (
    <div className="hidden w-64 shrink-0 flex-col gap-3 border-l border-border bg-surface p-4 lg:flex">
      <div className="flex flex-col gap-3 rounded-control border border-border bg-bg p-3.5">
        <div className="flex items-center justify-between">
          <span className="label-mono text-fg-subtle">Next up</span>
          <span className="flex items-center gap-1.5 text-xs text-fg-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            Thursday
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-fg">Workshop night</span>
          <span className="text-xs text-fg-muted">Intro to version control</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1">
            {["AK", "JM", "RS"].map((i) => (
              <Avatar key={i} initials={i} />
            ))}
            <span className="pl-1 text-xs text-fg-subtle">+9</span>
          </div>
          <span className="flex h-6 items-center rounded-sm bg-fg px-2.5 text-xs font-medium text-fg-inverse">RSVP</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 rounded-control border border-border bg-bg p-3.5">
        <div className="flex items-center justify-between">
          <span className="label-mono text-fg-subtle">Cohort</span>
          <span className="text-xs text-fg-muted">Week 6 of 10</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className={clsx("h-1.5 flex-1 rounded-full", i < 6 ? "bg-fg-muted" : "bg-border-strong")}
            />
          ))}
        </div>
        <div className="mt-1 flex flex-col gap-1.5 text-xs">
          <RailStat label="Teams" value="7" />
          <RailStat label="Demos ready" value="4" />
          <RailStat label="Showcase" value="Wk 10" />
        </div>
      </div>
    </div>
  );
}

function RailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-fg-muted">{label}</span>
      <span className="text-fg-secondary">{value}</span>
    </div>
  );
}

function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={clsx(
        "flex size-6 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-raised font-mono text-label leading-none tracking-normal text-fg-secondary",
        className,
      )}
    >
      {initials}
    </span>
  );
}

/* --- tiny glyphs (14px, currentColor) ---------------------------------- */

function StatusIcon({ status }: { status: Status }) {
  const tone = {
    planning: "text-fg-subtle",
    progress: "text-accent",
    review: "text-fg-secondary",
    shipped: "text-success",
  }[status];
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className={clsx("shrink-0", tone)} fill="none">
      {status === "planning" && (
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2.2" />
      )}
      {(status === "progress" || status === "review") && (
        <>
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d={status === "progress" ? "M7 3.5A3.5 3.5 0 0 1 7 10.5Z" : "M7 3.5A3.5 3.5 0 1 1 3.5 7H7Z"}
            fill="currentColor"
          />
        </>
      )}
      {status === "shipped" && (
        <>
          <circle cx="7" cy="7" r="6.25" fill="currentColor" />
          <path d="M4.4 7.2l1.8 1.8 3.4-3.6" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

function Square({ tone }: { tone: string }) {
  return <span className={clsx("size-2.5 rounded-xs", tone)} />;
}

const glyph = {
  width: 14,
  height: 14,
  viewBox: "0 0 14 14",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function GlyphInbox() {
  return (
    <svg {...glyph}>
      <path d="M2 8.5l1.6-5h6.8L12 8.5V11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
      <path d="M2 8.5h3l.8 1.5h2.4L9 8.5h3" />
    </svg>
  );
}
function GlyphTarget() {
  return (
    <svg {...glyph}>
      <circle cx="7" cy="7" r="5" />
      <circle cx="7" cy="7" r="1.8" />
    </svg>
  );
}
function GlyphGrid() {
  return (
    <svg {...glyph}>
      <rect x="2" y="2" width="4" height="4" rx="1" />
      <rect x="8" y="2" width="4" height="4" rx="1" />
      <rect x="2" y="8" width="4" height="4" rx="1" />
      <rect x="8" y="8" width="4" height="4" rx="1" />
    </svg>
  );
}
function GlyphCalendar() {
  return (
    <svg {...glyph}>
      <rect x="2" y="3" width="10" height="9" rx="1.5" />
      <path d="M2 6h10M5 1.75v2.5M9 1.75v2.5" />
    </svg>
  );
}
function GlyphFilter() {
  return (
    <svg {...glyph} width={12} height={12}>
      <path d="M2 3.5h10M4 7h6M6 10.5h2" />
    </svg>
  );
}
function Chevron({ className }: { className?: string }) {
  return (
    <svg {...glyph} width={12} height={12} className={className}>
      <path d="M4 5.5l3 3 3-3" />
    </svg>
  );
}
