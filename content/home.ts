// Home page copy. Edit freely; layout lives in app/_home/.
// URLs come from content/site.ts; nothing in this file is a link.

export const homeCopy = {
  hero: {
    subhead: "The technology club at Edmonds College for builders, designers, and the tech-curious.",
    primaryCta: "Join Discord",
    secondaryCta: "Explore programs",
  },
  community: {
    eyebrow: "Community",
    title: "A room full of people who make things.",
    intro:
      "Tech@EDC is for Edmonds College students in every major: programmers, designers, artists, and anyone who wonders how things work. Show up curious, leave having built something with friends.",
    pillars: [
      {
        label: "01",
        title: "Learn",
        body: "Hands-on workshops that start from zero and move fast, taught by students who were beginners not long ago.",
      },
      {
        label: "02",
        title: "Build",
        body: "Turn ideas into working projects with a team, a mentor, and a deadline that keeps everyone shipping.",
      },
      {
        label: "03",
        title: "Connect",
        body: "Meet classmates who share your interests and people already working in tech who are glad to help.",
      },
    ],
  },
  programs: {
    eyebrow: "Programs",
    title: "Programs",
    intro:
      "Each quarter we run application-based programs that help you sharpen your skills, ship real work, and find your people.",
    cta: "Learn more",
  },
  events: {
    eyebrow: "Events",
    title: "Workshops, talks, and nights spent building.",
    intro:
      "Hands-on workshops, speaker nights, project demos, and our weekend Buildathon, all open to every Edmonds College student at any experience level.",
    cta: "See upcoming events",
    galleryLabel: "Past events (photos coming soon)",
    captions: ["Workshop night", "Project demos", "Buildathon", "Speaker night", "Study session", "Showcase"],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    intro: "The short version: everyone is welcome, and you can start by saying hi on Discord.",
    stillPrompt: "Still have questions?",
    stillLink: "Say hello.",
  },
  connect: {
    eyebrow: "Connect",
    title: "Follow along",
    intro: "Announcements, photos, and project updates, wherever you already spend your time.",
  },
} as const;
