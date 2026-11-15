import type { ReactNode } from "react";

/*
  Small monochrome line drawings for the program cards (our stand-in for the
  isometric illustrations on the reference site). Decorative, aria-hidden,
  currentColor only, framed like <Placeholder/> so they sit in the Card media
  slot. Hovering the card (a .group) brightens the lines slightly.
*/

function Frame({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="relative flex aspect-[16/10] items-center sm:aspect-[5/2] md:aspect-[16/10] justify-center overflow-hidden rounded-control border border-border bg-surface-raised"
    >
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,#000_25%,transparent_75%)]" />
      <div className="relative h-3/4 w-3/4 text-fg-subtle transition-colors duration-300 group-hover:text-fg-muted">
        {children}
      </div>
    </div>
  );
}

const svg = {
  viewBox: "0 0 240 150",
  width: "100%",
  height: "100%",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  preserveAspectRatio: "xMidYMid meet",
};

/** Build Cohort: a small team's stacked work, one card lifted and "shipped". */
function CohortArt() {
  return (
    <svg {...svg}>
      <rect x="62" y="44" width="116" height="78" rx="8" opacity="0.45" />
      <rect x="52" y="34" width="116" height="78" rx="8" opacity="0.7" fill="var(--surface-raised)" />
      <rect x="72" y="22" width="116" height="78" rx="8" fill="var(--surface-raised)" className="text-fg-muted" stroke="currentColor" />
      <path d="M86 42h44M86 54h70M86 66h58" />
      <circle cx="170" cy="42" r="6" />
      <path d="M167.4 42.2l1.8 1.8 3.4-3.6" />
      <path d="M86 84h24" strokeDasharray="2 3" />
      <circle cx="40" cy="128" r="5" opacity="0.7" />
      <circle cx="56" cy="128" r="5" opacity="0.7" />
      <circle cx="72" cy="128" r="5" opacity="0.7" />
      <path d="M200 128h-40" strokeDasharray="2 3" opacity="0.7" />
    </svg>
  );
}

/** Mentorship: two people, one conversation. */
function MentorshipArt() {
  return (
    <svg {...svg}>
      <circle cx="64" cy="64" r="16" />
      <path d="M38 112c3-15 13-24 26-24s23 9 26 24" />
      <circle cx="176" cy="64" r="16" />
      <path d="M150 112c3-15 13-24 26-24s23 9 26 24" />
      <path d="M92 50c18-16 38-16 56 0" strokeDasharray="3 4" />
      <rect x="100" y="18" width="40" height="20" rx="10" fill="var(--surface-raised)" />
      <circle cx="112" cy="28" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="120" cy="28" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="128" cy="28" r="1.4" fill="currentColor" stroke="none" />
      <path d="M30 130h180" opacity="0.4" />
    </svg>
  );
}

/** Buildathon: a 48-hour dial, three quarters gone. */
function BuildathonArt() {
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2 - Math.PI / 2;
    const r1 = i % 6 === 0 ? 46 : 50;
    const r2 = 55;
    return {
      x1: 120 + r1 * Math.cos(a),
      y1: 75 + r1 * Math.sin(a),
      x2: 120 + r2 * Math.cos(a),
      y2: 75 + r2 * Math.sin(a),
      done: i < 36,
    };
  });
  return (
    <svg {...svg}>
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1.toFixed(2)}
          y1={t.y1.toFixed(2)}
          x2={t.x2.toFixed(2)}
          y2={t.y2.toFixed(2)}
          opacity={t.done ? 0.35 : 1}
        />
      ))}
      <circle cx="120" cy="75" r="36" opacity="0.5" />
      <path d="M120 75V50M120 75l14 8" strokeWidth="1.5" />
      <circle cx="120" cy="75" r="2.5" fill="currentColor" stroke="none" />
      <text
        x="120"
        y="104"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        className="font-mono"
        fontSize="8"
        letterSpacing="1"
      >
        48H
      </text>
    </svg>
  );
}

const art: Record<string, () => ReactNode> = {
  "build-cohort": CohortArt,
  mentorship: MentorshipArt,
  buildathon: BuildathonArt,
};

export function ProgramArt({ slug }: { slug: string }) {
  const Art = art[slug];
  return <Frame>{Art ? <Art /> : null}</Frame>;
}
