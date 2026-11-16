// Programs shown on the home page and on /programs/* and /buildathon.
// Dates are PLACEHOLDERS until officers set the calendar.

export type Program = {
  slug: string;
  name: string;
  href: string;
  summary: string; // two sentences, used on the home card
  overview: string[];
  outcomes: { title: string; body: string }[];
  requirements: string[];
  deliverables: string[];
  timeline: { when: string; title: string; body: string }[];
  application: { timeline: string; process: string; eligibility: string };
  applyHref: string;
};

export const programs: Program[] = [
  {
    slug: "build-cohort",
    name: "Build Cohort",
    href: "/programs/build-cohort/",
    summary:
      "A quarter-long cohort where small teams design, build, and ship one real project with a mentor. Open to first-time builders and experienced students alike.",
    overview: [
      "Build Cohort is Tech@EDC's core program. Each quarter, a group of students splits into small teams that take one project from idea to working demo.",
      "Every team is paired with a mentor who reviews plans, unblocks problems, and pushes for quality. Beginners learn the fundamentals by doing; experienced students lead, review code, and take on harder technical scope.",
    ],
    outcomes: [
      {
        title: "Ship something real",
        body: "Finish the quarter with a deployed project you can show, link, and talk about.",
      },
      {
        title: "Learn with a mentor",
        body: "Weekly check-ins with a mentor who has built software before, plus code and design reviews.",
      },
      {
        title: "Work like a team",
        body: "Practice planning, splitting work, version control, and presenting, the habits that carry into any job.",
      },
    ],
    requirements: [
      "Enrolled at Edmonds College",
      "About 4 to 6 hours a week for the quarter",
      "Attend the weekly team session and the final showcase",
    ],
    deliverables: [
      "A short project plan by week 2",
      "A working demo at mid-quarter review",
      "A deployed project and a 5-minute showcase presentation",
    ],
    timeline: [
      { when: "Week 0", title: "Applications and matching", body: "Apply, then get matched into a team by interest and experience." },
      { when: "Week 1", title: "Kickoff", body: "Meet your team and mentor, pick a project, and set scope." },
      { when: "Weeks 2–4", title: "Build", body: "Weekly sessions, mentor check-ins, and steady progress." },
      { when: "Week 5", title: "Mid-quarter review", body: "Demo what works, get feedback, and adjust scope." },
      { when: "Weeks 6–9", title: "Finish", body: "Polish the project and prepare your demo." },
      { when: "Week 10", title: "Showcase", body: "Present to the club and guests, then celebrate." },
    ],
    application: {
      timeline: "Applications open at the start of each quarter and close at the end of week 1.",
      process: "A short form about your interests and experience, then a quick chat with an officer.",
      eligibility: "Open to all Edmonds College students. No prior experience needed; tell us what you want to learn.",
    },
    applyHref: "https://example.com/apply-build-cohort", // PLACEHOLDER
  },
  {
    slug: "mentorship",
    name: "Mentorship",
    href: "/programs/mentorship/",
    summary:
      "One-on-one pairing with someone working in tech for guidance on classes, projects, and careers. A low-pressure way to get honest answers about what comes next.",
    overview: [
      "Mentorship pairs students with professionals and experienced peers for regular one-on-one conversations across a quarter.",
      "Mentees set their own goals, whether that is choosing a transfer path, preparing for a first internship, or getting feedback on a side project.",
    ],
    outcomes: [
      { title: "Career clarity", body: "Understand the roles, paths, and skills that lead where you want to go." },
      { title: "Honest feedback", body: "Get your resume, portfolio, or project reviewed by someone who has hired or been hired." },
      { title: "A lasting connection", body: "Build a relationship with someone in the field you can keep learning from." },
    ],
    requirements: [
      "Enrolled at Edmonds College",
      "Meet with your mentor at least every other week",
      "Come to each meeting with a question or goal",
    ],
    deliverables: [
      "A short goals list at the first meeting",
      "A reflection at the end of the quarter",
    ],
    timeline: [
      { when: "Week 0", title: "Apply", body: "Tell us your goals and interests." },
      { when: "Weeks 1–2", title: "Matching", body: "Get paired with a mentor and schedule your first meeting." },
      { when: "Weeks 3–9", title: "Meet", body: "Regular one-on-ones focused on your goals." },
      { when: "Week 10", title: "Wrap-up", body: "Reflect on progress and decide whether to continue." },
    ],
    application: {
      timeline: "Applications open at the start of each quarter. Spots depend on mentor availability.",
      process: "A short form about your goals; we match based on interests and mentor capacity.",
      eligibility: "Open to all Edmonds College students.",
    },
    applyHref: "https://example.com/apply-mentorship", // PLACEHOLDER
  },
  {
    slug: "buildathon",
    name: "Buildathon",
    href: "/buildathon/",
    summary:
      "A 48-hour weekend hackathon where teams turn an idea into a working prototype. Food, workshops, and demos included; no experience required.",
    overview: [],
    outcomes: [],
    requirements: [],
    deliverables: [],
    timeline: [],
    application: { timeline: "", process: "", eligibility: "" },
    applyHref: "https://example.com/buildathon-signup", // PLACEHOLDER
  },
];
