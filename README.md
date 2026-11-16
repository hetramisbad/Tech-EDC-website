# Tech@EDC website

Site for Tech@EDC, the technology club at Edmonds College (techatedc.org).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

## Deploy

`npm run build` produces a plain static site in `out/`. Upload the contents of `out/` to any static host (e.g. GoDaddy hosting `public_html`). No server is required.

## Editing content

Club officers can update the site without touching layout code:

| What | File |
| --- | --- |
| Links (Discord, Luma, socials), email, announcement badge | `content/site.ts` |
| Home page copy | `content/home.ts` |
| Sub-page labels and copy | `content/pages.ts` |
| Programs | `content/programs.ts` |
| FAQ | `content/faq.ts` |
| Team roster | `content/team.ts` (+ photos in `public/team/`) |
| Buildathon page | `content/buildathon.ts` |
| Blog posts | `content/blog/*.mdx` |
| Event photos | `public/events/` |
| Hero photo | `content/home.ts` (`hero.photo`) + file in `public/events/` |
| Partner logos (off at launch) | `content/network.ts`, then uncomment the PARTNERS block in `app/page.tsx` |

The project plan is in `docs/MASTER_PLAN.md`.
