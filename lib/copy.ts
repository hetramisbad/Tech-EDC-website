// Section labels and short connective copy for the sub-pages owned by Pages
// (/programs/*, /buildathon, /team, /blog, 404). Lives here because content/**
// is owned by Lead; see the Pages request in STATUS.md to move it into
// content/pages.ts. Program, Buildathon, team and post data still come from
// content/*. Nothing in this file is a URL.

export const programCopy = {
  eyebrow: "Program",
  applyCta: "Apply now",
  discordCta: "Join Discord",
  overview: { eyebrow: "01", title: "Overview" },
  outcomes: {
    eyebrow: "02",
    title: "Outcomes",
    intro: (name: string) => `What you walk away with after a quarter of ${name}.`,
  },
  expectations: {
    eyebrow: "03",
    title: "Expectations",
    intro: "What we ask of you, and what you will have to show for it at the end.",
    requirements: "Requirements",
    deliverables: "Deliverables",
  },
  timeline: {
    eyebrow: "04",
    title: "Timeline",
    intro: "How a quarter runs, from application to the last meeting.",
  },
  application: {
    eyebrow: "05",
    title: "Application",
    intro: "Short, quick, and open to every Edmonds College student.",
    labels: { timeline: "Timeline", process: "Process", eligibility: "Eligibility" },
    questions: "Questions about the program?",
  },
} as const;

export const buildathonCopy = {
  eyebrow: "Fig 0.3 · Hackathon",
  signupCta: "Sign up",
  discordCta: "Join Discord",
  factsLabel: "Event details",
  schedule: {
    eyebrow: "Schedule",
    title: "One weekend, start to demo",
    intro: "Times are a guide; the final schedule is posted on Discord the week before.",
    dayLabel: (i: number) => `Day ${String(i + 1).padStart(2, "0")}`,
  },
  rules: {
    eyebrow: "Rules",
    title: "Ground rules",
    intro: "Short and simple, so the weekend stays fair and fun for everyone.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered",
    stillPrompt: "Something else on your mind?",
  },
} as const;

export const teamCopy = {
  eyebrow: "Team",
  title: "Team",
  intro: "The students who plan the programs, run the events, and keep the Discord lively.",
  jumpLabel: "Jump to a team",
  empty: {
    eyebrow: "Roster",
    title: "Roster coming soon",
    body: "Officer profiles will appear here once this year's team is set. Want to help run workshops, events, or the Buildathon? Say hi on Discord and tell us what you would like to work on.",
    cta: "Join Discord",
    email: "Email us",
  },
} as const;

export const blogCopy = {
  eyebrow: "Blog",
  title: "Blog",
  intro: "Updates, project write-ups, and notes from the people building Tech@EDC.",
  featured: { eyebrow: "Featured", title: "Featured" },
  all: { eyebrow: "Archive", title: "All posts", count: (n: number) => `${n} ${n === 1 ? "post" : "posts"}` },
  empty: { title: "No posts yet", body: "The first posts are on their way. Join the newsletter below to hear when they land." },
  loop: {
    title: "Stay in the loop",
    body: "New posts land a few times a quarter. Get them by email, or follow along on Discord.",
    subscribe: "Subscribe",
    discord: "Join Discord",
    pitch: "Have a story or project to share?",
  },
  post: {
    back: "All posts",
    readTime: (m: number) => `${m} min read`,
    endPrompt: "Enjoyed this? Come build with us.",
    discord: "Join Discord",
  },
} as const;

export const notFoundCopy = {
  title: "Page not found",
  body: "The page you are looking for does not exist or has moved.",
  home: "Back to home",
  blog: "Read the blog",
} as const;
