# Status

Each agent keeps its own section current: Done / In progress / Blocked. Requests for other owners go under Requests.

## Lead
- Done: scaffold (Next 16 static export, Tailwind v4), content files with placeholder URLs, master plan copy in `docs/`, reference scrape in `reference/` (gitignored), `qa/shoot.py`.
- In progress: coordinating Design → Home + Pages → QA.

## Design
- **Done.** Tokens (`app/globals.css`), root layout, logo + favicon, 24 shared components (`components/`, barrel `@/components`), `/styleguide/` (noindex). `npm run build` and `npm run lint`: 0 errors, 0 warnings. Screenshots: `qa/screenshots/design-*.png`.
- **`<main>` lives in `app/layout.tsx`** as `<main id="content" tabIndex={-1}>`, between `<Navbar/>` and `<Footer/>`, with a skip link before them. **Pages must NOT render `<main>`**: return a fragment of `<PageHeader/>`/`<Section/>`s ending with `<JoinUs/>`. (Lead's placeholder `app/page.tsx` still has a `<main>`; Home replaces it.)
- **Accent:** Triton blue `--accent-brand: #1f4e9c` is **UNCONFIRMED** (edmonds.edu not fetchable, no published brand hex found). Too dark for text on black (2.5:1), so the on-dark tint `--accent: #4c7fd6` (5.0:1) is what focus rings, link hover and the badge dot use. Kill-switch: `<html data-accent="none">`, or open any page with `?accent=none` (persists; `?accent=blue` undoes). The toggle is also on `/styleguide/`.
- **Tokens → Tailwind:** `bg-bg bg-surface bg-surface-raised bg-surface-hover bg-overlay`, `border-border border-border-strong border-border-hover`, `text-fg text-fg-secondary text-fg-muted text-fg-subtle text-fg-inverse`, `text-accent bg-accent bg-accent-brand bg-accent-soft`, `text-danger text-success`; type `text-display text-h1 text-h2 text-h3 text-lg text-base text-sm text-xs text-label` + `label-mono`; radii `rounded-control`(8) `rounded-card`(12) `rounded-panel`(16) `rounded-full`; widths `max-w-page`(1200) `max-w-narrow`(880) `max-w-prose`(680); breakpoints `sm 600 / md 840 / lg 1080 / xl 1280 / 2xl 1440`. Utilities: `container-page`, `section-space`, `grain`, `visually-hidden`, `link`. **Tailwind default colors, font sizes and breakpoints are disabled** (e.g. `text-gray-400`, `text-3xl` produce nothing). Spacing uses Tailwind's default 4px scale.
- **Components:** Container, Section (+`bleed` for full-width children), PageHeader, Button, Badge, Card, Panel, Placeholder, ArrowLink, Eyebrow, Icon, SmartLink, Navbar, Footer, SocialLinks, Accordion, Gallery/Marquee, NewsletterForm, JoinUs, NetworkGrid, TeamCard, PostCard (+`formatDate`), Timeline, EmptyState, Prose, Reveal, Logo/LogoMark. Props are summarized at the bottom of `/styleguide/`.
- Known: on `/styleguide/` the browser logs 404s for `/team/`, `/blog/`, `/programs/*`, `/buildathon/`, `/blog/welcome-to-tech-at-edc/` because next/link prefetches routes that Pages has not built yet. These go away once those routes exist.
## Home

## Pages

## QA

## Requests
- Design → Lead: please confirm the Edmonds College brand blue hex if anyone has the college style guide; swap it into `--accent-brand` (and re-derive `--accent`) in `app/globals.css`, or tell Design.

## Questions for Lead
