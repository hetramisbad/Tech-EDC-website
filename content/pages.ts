// Section labels and short connective copy for the sub-pages
// (/programs/*, /buildathon, /team, /blog, 404). Edit freely.

export const programCopy = {
  eyebrow: "Program",
  applyCta: "Apply now",
  discordCta: "Join Discord",
  overview: { title: "Overview" },
  outcomes: {
    title: "Outcomes",
    intro: (name: string) => `What you walk away with after a quarter of ${name}.`,
  },
  expectations: {
    title: "Expectations",
    intro: "What we ask of you, and what you will have to show for it.",
    requirements: "Requirements",
    deliverables: "Deliverables",
  },
  timeline: {
    title: "Timeline",
    intro: "How a quarter runs, from application to the last meeting.",
  },
  application: {
    title: "Application",
    intro: "Short, quick, and open to every Edmonds College student.",
    labels: { timeline: "Timeline", process: "Process", eligibility: "Eligibility" },
    questions: "Questions about the program?",
  },
} as const;

export const buildathonCopy = {
  eyebrow: "Hackathon",
  signupCta: "Sign up",
  discordCta: "Join Discord",
  factsLabel: "Event details",
  schedule: {
    title: "One weekend, start to demo",
    intro: "Times are a guide; the final schedule is posted on Discord the week before.",
  },
  rules: {
    title: "Ground rules",
    intro: "Short and simple, so the weekend stays fair and fun for everyone.",
  },
  faq: {
    title: "Questions, answered",
    stillPrompt: "Something else on your mind?",
  },
} as const;

export const teamCopy = {
  title: "Team",
  intro: "The students who plan the programs, run the events, and keep the Discord lively.",
  jumpLabel: "Jump to a team",
  empty: {
    title: "Roster coming soon",
    body: "Officer profiles will appear here once this year's team is set. Want to help run workshops, events, or the Buildathon? Say hi on Discord and tell us what you would like to work on.",
    cta: "Join Discord",
    email: "Email us",
  },
} as const;

export const blogCopy = {
  title: "Blog",
  intro: "Updates, project write-ups, and notes from the people building Tech@EDC.",
  featured: { title: "Featured" },
  all: { title: "All posts", count: (n: number) => `${n} ${n === 1 ? "post" : "posts"}` },
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
  eyebrow: "404",
  title: "Page not found",
  body: "The page you are looking for does not exist or has moved.",
  home: "Back to home",
  blog: "Read the blog",
} as const;
