# Tech@EDC website

Site for Tech@EDC, the technology club at Edmonds College (techatedc.org).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

### Wordmark font (one-time setup)

The top-left `tech@edc` wordmark uses **Satoshi Medium** (free from
[Fontshare](https://www.fontshare.com/fonts/satoshi), ITF Free Font License). The license
allows self-hosting it on our site but not redistributing it through a public repository,
so the font file is **not in this repo** (it is gitignored).

After cloning, download Satoshi from Fontshare, unzip it, and copy
`Fonts/WEB/fonts/Satoshi-Medium.woff2` into `public/fonts/`. Without it the wordmark falls
back to BDO Grotesk, and the browser logs one missing-file request.

## Deploy

`npm run build` produces a plain static site in `out/`. Upload the contents of `out/` to any static host (e.g. GoDaddy hosting `public_html`). No server is required. Build on a machine that has `public/fonts/Satoshi-Medium.woff2` (see above) so the font is uploaded with the site.

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
