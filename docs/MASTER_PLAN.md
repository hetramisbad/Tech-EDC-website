# Tech@EDC Website Master Plan

Source of truth: https://claude.ai/artifact/6hptRnHmYiXmZuraDcdw7e (this file is a copy taken 15 Nov 2026; Lead keeps it in sync).

## Design direction v2 (Mark, 15 Nov, supersedes conflicting lines below)

**Tech@NYU is the MAIN inspiration. Linear is secondary** (only for restraint and polish). When the two disagree, follow Tech@NYU. Live Tech@NYU screenshots: `reference/live/*.jpg` (gitignored).

- **Font:** BDO Grotesk (self-hosted variable woff2 at `public/fonts/BDOGrotesk-VF.woff2`, weights 300–900, SIL OFL, license file beside it) for headings and body. Mono (`@fontsource-variable/geist-mono`) for the navbar, buttons, labels, form labels and small meta, mirroring Tech@NYU's mono UI text. Inter is removed.
- **Background:** a linear gradient plus an SVG noise filter (feTurbulence), overlaid with a grid of square cells ("cubes") like Tech@NYU: major lines every 40px (~8% white), faint minor lines every 10px (~3% white), centered origin. Fixed behind the page.
- **Avoid vibe-coded UI** (thefountaininstitute.com/blog/signs-vibe-coded-ui): no meaningless status dots (remove the badge dot, colored tag dots, pulsing dots), no decorative glow or radial bloom, no emoji, no purple/indigo gradients, no cards nested in cards, no multicolored side tabs, no neon. One accent used with intent.
- **No product demo.** This is a club, not a product: no fake app UI, dashboards, issue IDs, or SaaS framing anywhere.
- **Tech@NYU look:** centered hero (big headline, one-line subhead, Join Discord), mono navbar with `[P] Programs`-style bracket shortcuts, Contact as a bordered button, square or near-square corners (2–4px), 1px borders, centered section headings for Programs, isometric black-and-white line illustrations of hardware in Community, program cards and Join Us (our own original drawings), Events as photo columns flanking centered text, Join Us as form left / illustration right.
- Drop Linear-only devices: "Fig 0.x" labels, announcement pill, hover glow.

## Overview

Tech@EDC is the technology club at Edmonds College. Its site is a feature-for-feature rebuild of [techatnyu.org](https://techatnyu.org/) with partner content removed and a visual language borrowed from [linear.app](https://linear.app/). This plan is the single source of truth for every agent working on it. Read it fully before writing code.

Decisions already made by Mark (do not reopen these):

- **Programs:** three at launch. Buildathon, Mentorship, and Build Cohort, one merged project-based cohort with a mentor (replaces NYU's separate Tech Treks and Dev Team). New York Startup Week is dropped.
- **Our Network logo grid:** not shown. Build it as a self-contained component, commented out or flagged off, so one line re-enables it when partners exist.
- **Secondary features:** Team page, Blog, Events via Luma, and Newsletter signup are all in scope.
- **Hero:** Linear-style (headline, subhead, CTA, bordered dark panel). No interactive CRT video.
- **Domain:** techatedc.org.

Rules for all content:

- Write original copy for Tech@EDC. Use NYU's site for structure and feature parity only; do not copy its text, photos, video, or logo.
- No company logos, no claims of partnership or sponsorship, no "works with startups" language anywhere.
- Every mention of NYU, New York, or NYU-specific links must be replaced or removed.

## Scope

One long home page plus sub-pages, all static content with one form.

### Navbar

Sticky, translucent dark bar. Left to right:

| Item | Target | Notes |
| --- | --- | --- |
| Logo | `/` | Power-button mark + "Tech@EDC" wordmark |
| Programs | `/#programs` | Smooth-scroll anchor on home |
| Events | External Luma calendar (`site.links.luma`) | Opens in new tab |
| Team | `/team` | |
| Blog | `/blog` | |
| Contact | `mailto:` club address (`site.email`) | |
| Join Discord (button) | Discord invite (`site.links.discord`) | Primary CTA, visually emphasized |

On mobile the links collapse into a menu; the Join Discord button stays visible.

### Home page sections, in order

1. **Hero.** Headline, one-line subhead, Join Discord CTA, and a bordered dark panel visual below (Linear pattern).
2. **Network slot.** `<NetworkGrid />` exists in code, commented out. Nothing renders.
3. **Community** (`#community`). Short statement of what the club is and who it is for.
4. **Programs** (`#programs`). Three cards, each with a name, two-sentence description, and Learn More link: Build Cohort, Mentorship, Buildathon.
5. **Events** (`#events`). Short blurb plus a photo gallery/marquee of past events and a link to Luma. Placeholders until real photos exist.
6. **FAQ** (`#faq`). Accordion with keyboard navigation. Five questions: who can join, how to apply, what programs exist, experience needed, how to stay updated. End with a "Still have questions?" mailto link.
7. **Connect** (`#connect`). Instagram, Discord, LinkedIn links.
8. **Join Us** (`#newsletter`). Newsletter form: first name, last name, email, Subscribe button. Contact prompt beneath.
9. **Footer.** Logo and copyright line.

### Sub-pages

| Route | Content |
| --- | --- |
| `/team` | Team grid grouped by team heading (Leadership first). Roster empty at launch: "Roster coming soon" empty state |
| `/blog` | Featured row above the full post list (newest first), then newsletter prompt |
| `/blog/[slug]` | Single post (MDX) |
| `/programs/build-cohort` | Program template |
| `/programs/mentorship` | Program template |
| `/buildathon` | 48-hour hackathon page: dates, schedule, rules, FAQ, sign-up link |
| `/404` | Styled not-found page |

Program page template (mirrors the scrape): Overview, Outcomes (three cards), Expectations (Requirements, Deliverables), Timeline (dated steps), Application (Timeline, Process, Eligibility), then the Join Us footer. Every page ends with the same Join Us newsletter section.

### Out of scope

User accounts, an admin dashboard, an in-site events calendar (Luma handles it), application forms hosted on the site (link out), and the 3D CRT hero.

## Feature parity

| Tech@NYU feature | Tech@EDC decision | Change |
| --- | --- | --- |
| Navbar: Programs, Events, Team, Blog, Contact (bordered button), Join Discord; single-key shortcuts P/E/T/B shown as [P] hints | Keep | Our links; Linear-style kbd hints, plus C for Contact |
| Interactive CRT hero video with keyboard controls | Replace | Linear-style hero |
| Our Network (14 company logos) | Hide | Modular component, off by default |
| Community blurb | Keep | Original copy |
| Tech Treks (beginner cohort) | Merge | Into Build Cohort |
| Dev Team (advanced cohort, startup clients) | Merge | Into Build Cohort; no startup clients |
| Mentorship | Keep | Original copy |
| Buildathon and its page | Keep | Our dates and rules |
| New York Startup Week (external site) | Remove | |
| Events blurb and photo gallery | Keep | Placeholders until we have photos |
| Events link to Luma | Keep | Our Luma calendar |
| FAQ accordion with up/down navigation | Keep | Answers rewritten for EDC |
| Connect: Instagram, Discord, LinkedIn | Keep | Our accounts |
| Newsletter form (first, last, email) | Keep | Stubbed until Luma list exists |
| Team page | Keep | Empty state until roster exists |
| Blog | Keep | Our posts |
| Per-program detail pages | Keep | Two program pages plus Buildathon |
| Footer with logo and copyright | Keep | "Tech@EDC" |

## Design system

Dark-first, quiet, and precise: Tech@NYU's layout wearing Linear's surface treatment. Both reference sites use a near-black base (NYU `#0d0d0d`, Linear `#08090a`).

| Token | Starting value | Use |
| --- | --- | --- |
| `--bg` | `#08090a` | Page background |
| `--surface` | `#0f1011` | Cards, panels, navbar fill |
| `--border` | `rgba(255,255,255,0.08)` | 1px hairlines on every panel |
| `--text` | `#f7f8f8` | Headings and body |
| `--text-muted` | `#8a8f98` | Secondary copy, captions |
| `--accent` | `#004d71` Edmonds College blue (sampled from edmonds.edu); on-dark tint `#3a8fb9` | Sparingly: focus rings, link hover, hero badge dot |
| `--radius` | `8px` controls, `12px` cards | |
| Font | Inter (variable, `@fontsource-variable/inter`), system fallback | Tight tracking on display sizes |

**Color.** Minimal and near-monochrome. Mark is unsure Triton blue looks good, so it is an accent of last resort: the primary button is white on black, and blue never fills a large area. Provide an easy switch (e.g. `data-accent="none"` on `<html>`) so Mark can compare a with-blue and a without-blue hero.

**Logo.** A simple power-button glyph (a ring broken at the top by a vertical stroke) inside a rounded square, our own single-color SVG. Used in navbar, footer, favicon.

**Breakpoints.** Match Tech@NYU's: 600, 840, 1080, 1280, 1440px, mobile-first.

**From NYU's CSS, keep:** Inter-family body type, a subtle grain texture on surfaces (make our own, e.g. SVG noise), a scrolling marquee for event photos, reduced-motion fallbacks.

Patterns from Linear:

- Large display headline, muted one-line subhead, single emphasized CTA.
- Rounded, hairline-bordered panels as the main visual unit instead of illustrations.
- Small pill badge above the hero headline ("Applications open" or next event).
- Editorial figure labels ("Fig 0.1") on program cards.
- Section pattern: bold heading, one or two sentences, a "Learn more →" link.
- Subtle motion only: fade-and-rise on scroll, soft hover glow on cards. Respect `prefers-reduced-motion`.

Shared components, built once: Navbar, Footer, Button, Card, Badge, Section, Accordion, Gallery, NewsletterForm, NetworkGrid (off), TeamCard, PostCard, Logo, Container.

Requirements: responsive from 360px to 1440px+, WCAG AA contrast, visible focus states, full keyboard access to menu, accordion, form.

## Architecture

Next.js 16 (App Router, `output: "export"`, `trailingSlash: true`), TypeScript, Tailwind CSS v4, MDX for blog posts. Work in GitHub (`hetramisbad/Tech-EDC-website`). Hosting will probably be GoDaddy, so the output in `out/` must be plain static files any host can serve, with no host-specific features, no API routes, no server actions, no `next/image` optimization (`images.unoptimized`).

Content lives in data files, never hard-coded in components:

| File | Holds |
| --- | --- |
| `content/site.ts` | Club name, tagline, contact email, Discord, Luma, social URLs, nav items |
| `content/programs.ts` | Program name, slug, summary, detail body |
| `content/faq.ts` | Question and answer pairs |
| `content/team.ts` | Teams and members (empty at launch) |
| `content/network.ts` | Partner name, logo, URL (empty array at launch) |
| `content/buildathon.ts` | Buildathon page content |
| `content/blog/*.mdx` | One file per post, frontmatter: title, date, author, summary, featured |
| `public/events/` | Gallery photos (placeholders at launch) |

Network slot: `NetworkGrid` reads `content/network.ts` and is imported in the home page behind a clearly labeled comment block (`{/* PARTNERS: uncomment when Tech@EDC has partners */}`). It must also render nothing when the array is empty.

Newsletter form: client-side validation, posts to the provider endpoint in `site.newsletter.endpoint`, shows success and error states. Endpoint is empty for now (Luma subscriber list later), so use a stub that `console.info`s the payload and resolves success.

All external URLs come from `content/site.ts`. Placeholders are `https://example.com/...`; list them in the hand-off report.

## Agent workstreams

| Agent | Owns | Delivers |
| --- | --- | --- |
| Lead | Repo setup, `next.config.ts`, `package.json`, `content/**`, `docs/**`, integration, git, final report | Scaffold, merged `main`, hand-off report |
| Design | `app/globals.css`, `app/layout.tsx`, `components/**`, `public/brand/**`, `app/icon.svg`, `app/styleguide/**` | Component library and `/styleguide` |
| Home | `app/page.tsx`, `app/_home/**` | `/` complete at every breakpoint |
| Pages | `app/team/**`, `app/blog/**`, `app/programs/**`, `app/buildathon/**`, `app/not-found.tsx`, `lib/**` | All sub-routes |
| QA | `qa/**` (scripts, report), screenshots outside the repo | QA report; writes no feature code |

Phases: (1) Foundation: Lead scaffold, Design system; Home and Pages start only once `/styleguide` renders. (2) Build: Home and Pages in parallel using only shared components and tokens. (3) Verify: QA runs the full checklist; bugs go to the owning agent; Lead integrates and re-runs QA until it passes.

Coordination rules:

- This document wins any disagreement. If it is wrong or silent, record the question in `STATUS.md` under "Questions for Lead" and make the most conservative choice.
- One owner per file. Need a change in someone else's file? Write the request in `STATUS.md` under that owner; do not edit it.
- No one-off styles. A new color, spacing value, or component variant goes through Design and into the tokens.
- Each agent keeps a short entry in `STATUS.md`: done, in progress, blocked.
- Before handing off, each agent runs `npm run build`, loads its own pages in headless Chrome, and saves screenshots. "It compiles" is not done.
- Agents do not run git commands. Lead commits.

## Quality control

Done only when QA has used the site in a real browser, compared it against techatnyu.org, and produced screenshots proving each feature works.

1. **Test like a user** at 1440, 768, 390px against the production build (`npx serve out` or `python3 -m http.server -d out`):
   every navbar link/button on every page; Programs anchor from home and sub-pages; mobile menu open/close/navigate; each Learn More; FAQ by mouse and keyboard; newsletter empty/bad/valid; gallery images load, no layout shift; blog index newest first and a post renders; team page renders (empty state); unknown URL → 404; tab order with visible focus; zero console errors.
2. **Compare against Tech@NYU**: walk the parity table row by row (Pass / Fail / Intentional difference); confirm home section order. Removal audit on `out/`: "NYU", "New York", "Startup Week", the 14 network companies (Y Combinator, Sequoia, Stripe, Neo, Notion, Anthropic, Figma, Vercel, Google, Z Fellows, Google Ventures, Meta, Adobe, Microsoft) and scrape partners (Databricks, Mbodi, Nozomio, OpenRoll). Zero hits in visible text is the only pass.
3. **Screenshot proof**: full-page every route at 1440 and 390; mobile menu open; FAQ expanded; newsletter error and success; hover and focus of primary button and a program card; side-by-side Tech@EDC home vs Tech@NYU home; hero with and without accent.
4. **One cohesive product**: identical navbar/footer everywhere; tokens only; matches `/styleguide`; Lighthouse Performance and Accessibility ≥ 90 on home if Lighthouse can run.

## Reference scrape

Capture of techatnyu.org from 10 Nov 2026 at `reference/Tech-at-NYU/` (gitignored; never committed or shipped). 12 pages, each `index.html` + `page.css`, compiled CSS in `assets/techatnyu.org/_next/static/css/`. Scripts were stripped, so interactive pieces are inert; check behavior on the live site. Use it to read structure, spacing, type scale, and breakpoints. Rebuild with our components; do not paste its CSS, text, images, or fonts.

## Still open (use placeholders)

Real URLs (Discord, Luma, Instagram, LinkedIn, contact email); Luma subscriber list; team roster and photos; event photos; whether Triton blue stays (compare with `?accent=none`); GoDaddy hosting details.
