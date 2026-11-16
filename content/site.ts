// Global site settings. Every external URL on the site comes from here.
// PLACEHOLDER values (example.com, hello@techatedc.org) must be replaced with
// real ones before launch. See docs/MASTER_PLAN.md "Still open".

export const site = {
  name: "Tech@EDC",
  college: "Edmonds College",
  domain: "techatedc.org",
  url: "https://techatedc.org",
  tagline: "Power on.", // hero headline; keep it shorter than the hero subhead
  description:
    "Tech@EDC is the technology club at Edmonds College: a place for builders, designers, and the tech-curious to learn by making things together.",
  email: "hello@techatedc.org", // PLACEHOLDER: confirm club inbox
  links: {
    discord: "https://example.com/discord", // PLACEHOLDER
    luma: "https://example.com/luma", // PLACEHOLDER: Luma calendar
    instagram: "https://example.com/instagram", // PLACEHOLDER
    linkedin: "https://example.com/linkedin", // PLACEHOLDER
  },
  newsletter: {
    // Will be Luma's subscriber list. Empty string = stub mode (log + succeed).
    endpoint: "",
  },
  announcement: {
    // Pill badge above the hero headline. Set `text` to "" to hide it.
    text: "Applications for Winter quarter open soon",
    href: "/#programs",
  },
} as const;

export type NavItem = { label: string; href: string; external?: boolean };

export const navItems: NavItem[] = [
  { label: "Programs", href: "/#programs" },
  { label: "Events", href: site.links.luma, external: true },
  { label: "Team", href: "/team/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: `mailto:${site.email}`, external: true },
];

export const socials = [
  { label: "Instagram", href: site.links.instagram, handle: "@techatedc" },
  { label: "Discord", href: site.links.discord, handle: "Tech@EDC server" },
  { label: "LinkedIn", href: site.links.linkedin, handle: "Tech@EDC" },
] as const;
