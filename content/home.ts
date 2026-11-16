// Home page copy. Edit freely; layout lives in app/_home/.
// URLs come from content/site.ts; nothing in this file is an external link.

export type HomePhoto = { src: string; alt: string };

export const homeCopy = {
  hero: {
    // The display headline is `site.tagline` (content/site.ts).
    subhead: "The technology club at Edmonds College for builders, designers, and the tech-curious.",
    primaryCta: "Join Discord",
    /**
     * Event photo shown in the hero frame, e.g. { src: "/events/kickoff.jpg", alt: "Members at the fall kickoff" }
     * (put the file in public/events/). null = the IsoHero workbench illustration.
     */
    photo: null as HomePhoto | null,
  },
  community: {
    title: "Community",
    intro:
      "Tech@EDC is for Edmonds College students in every major: programmers, designers, artists, and anyone who wonders how things work. Come to a workshop, join a team, and leave having built something with friends.",
  },
  programs: {
    title: "Programs",
    intro: "Application-based programs each quarter to sharpen your skills, ship real work, and find your people.",
    cta: "Learn more",
  },
  events: {
    title: "Events",
    intro: [
      "Hands-on workshops, speaker nights, project demos, and a weekend Buildathon, all open to every Edmonds College student.",
      "No experience needed. Come on your own, and leave with people to build with.",
    ],
    cta: "See upcoming events",
    galleryLabel: "Past events (photos coming soon)",
    captions: ["Workshop night", "Project demos", "Buildathon", "Speaker night", "Study session", "Showcase"],
  },
  faq: {
    title: "FAQ",
    stillPrompt: "Still have questions? Say hello.",
  },
  connect: {
    title: "Connect",
    intro: "Announcements, photos, and project updates.",
  },
} as const;
