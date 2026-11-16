# QA report: Tech@EDC website

## Round 2 (15 Nov 2026, QA agent, rebuilt after Lead's evening changes)

### Verdict: ship (after a 10-minute fix for N1)

Nothing blocks a student from using the site. Every click, form, shortcut and keyboard path works on all 9 routes at 1440/768/390/360. Ten of the eleven round-1 bugs are fixed. B10 (the arrows) is only partly fixed: 4 mailto links still show ↗. That is N1 below, and it is the only thing I would fix before upload. The rest are low or cosmetic.

- `npm run build`: clean (12 static pages). `npm run lint`: 0 problems.
- `qa/e2e.py`: **484 / 484 PASS**. The background check was updated for Mark's new direction: flat base + noise + even 40/10px grid, with no gradient and no mask.
- `qa/round2.py` (new; checks the fixes plus Lead's navbar/hero changes): **58 pass / 8 fail / 14 info**. The fails are N1 (×4), N3 (×3) and N4 (×1).
- `qa/audit.py`: removal audit **0 hits** in rendered HTML and RSC `.txt` payloads, v2 audit **0**, token audit 61 (details under N8).
- `qa/proof.py`: all `final-*` / `compare-*` shots regenerated on the new build. I opened and looked at every one.

### B1–B11 verification

| # | Result | Evidence |
| --- | --- | --- |
| B1 `/styleguide/` says "Tech@NYU" | **Fixed** | `grep -rIl "NYU\|New York" out/` finds nothing (HTML and `.txt`). `audit.py` removal audit: 0 hits |
| B2 `.htaccess` | **Fixed** (see N5 for hardening) | `out/.htaccess` is the same as `public/.htaccess`: ErrorDocument 404, deflate, expires, cache headers, all inside `IfModule`. Plain ASCII with LF endings. Apache is not installed here, so I reviewed it by hand |
| B3 hero art / Community art | **Fixed** | `IsoHero` renders at all widths: 660px wide at 1080+, 480 at 768, 358 at 390, 328 at 360. `IsoCommunity` (a workbench, no laptop) renders at 1440/1080/768/390/360 (`round2.py` B3). Hero CTA bottom: 864px at 1440x900, 862 at 1080x900, 860 at 1366x768 / 1280x800. Shots: `r2-hero-art-2x.png`, `r2-community-art-2x.png`, `final-home-hero-*x*.png`. The 6 Events tiles are still placeholders (waiting on Mark's photos) |
| B4 focus after newsletter success | **Fixed** | `activeElement` is the `role=status` / `aria-live=polite` div after submit. `final-newsletter-success-1440.png` |
| B5 `/blog/` heading order | **Fixed** | `/blog/` h1 > h2 > h3 > h2. All 9 routes have no skipped levels. Lighthouse a11y on `/blog/` is now 100 (was 98) |
| B6 accent toggle | Note only (no change) | As before |
| B7 card hover | **Fixed** | Border goes rgba(255,255,255,.10) → .42 and background #121213 → #1e1e20, with no shadow. `final-card-default.png` vs `final-card-hover.png` |
| B9 `[P]` hints | **Fixed / superseded** | Per Mark's new spec: label and key letter white #f5f5f5, brackets grey #868686. Brackets are visible but quieter. `r2-navbar-1440.png` |
| B10 ↗ only for new-tab links | **Not fixed (partial)** | Navbar, mobile menu and Join Us now show →. Still ↗ on 4 mailto links: see N1. `r2-b10-home-faq-mailto.png`, `r2-b10-program-contactline.png` |
| B11 `/blog/` redundant Subscribe row | **Fixed** | No "Stay in the loop" row. The last section in main is `#newsletter`. No `#newsletter` links |
| B8 one-off type sizes | **Fixed** | `text-lead` / `text-body-sm` / `text-meta` / `tracking-mono` are in use. The only `text-[…]` left are relative `em` sizes in Kbd and the styleguide |

### Lead's 15 Nov evening changes (verified)

| Change | Result |
| --- | --- |
| Background: flat near-black + noise + even grid, no gradient/mask | PASS (`e2e.py` v2 check; seen in every screenshot) |
| Navbar margins vs Tech@NYU scrape (4174) | PASS. Wordmark left edge 24px (1440) / 16px (390, 360). Rightmost control right edge 1416 / 374 / 344, same as the scrape |
| Contact + Join Discord 40px, gap 16px | PASS (40/40, gap 16.0) |
| Links 16px white mono, grey brackets, white key letter | PASS |
| Wordmark `role=img` "Tech@EDC" with power glyph "@" | PASS. The link name is "Tech@EDC home" |
| Bar height 68px | **FAIL by 1px: renders 69px** (N3) |
| `#programs` anchor below sticky bar | PASS. Section top lands at 84px, bar bottom at 69px, from `/team/` and in the e2e anchor group |
| Hero "Power on." shorter than subhead; subhead white | PASS (text widths 333 vs 899px; both #f5f5f5) |
| Favicon = power glyph | PASS (`out/icon.svg`) |

### Lighthouse (13.6, headless Chrome). Reports: `qa/lighthouse/r2/`

| Page / profile | Plain `http.server` (no gzip) | `serve` (gzip) |
| --- | --- | --- |
| `/` mobile | Perf **87 / 90** (2 runs), A11y 100, BP 100, SEO 100. FCP/LCP 2.9s, 1,245 KiB | Perf **97 / 97**, A11y 100, BP 100, SEO 100. LCP 0.9s, 327 KiB |
| `/` desktop | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| `/blog/` mobile | Perf 100, A11y 100, BP 100, SEO 100. LCP 1.4s, 954 KiB | Perf 98, A11y 100, BP 100, SEO 100. LCP 0.8s, 309 KiB |
| `/blog/` desktop | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

Home's mobile score depends on host compression. `out/index.html` is 397 KB raw: about 137 KB is inline SVG art, and the RSC payload in the page repeats it (46 KB gzipped). Make sure `mod_deflate` is actually on at GoDaddy (B2/N5). All CLS 0.

### New bugs (ranked)

| # | Sev | Owner | Route / width | Steps | Expected | Actual | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| N1 | Low (B10 leftover) | **Home** (`app/page.tsx:143`) + **Pages** (`lib/page-ui.tsx:80`, `ContactLine`) | `/` FAQ "Still have questions? Say hello."; `/programs/build-cohort/`, `/programs/mentorship/` "Questions about the program?"; `/buildathon/` "Something else on your mind?". All widths | Look at the email link under the FAQ / Application / Buildathon FAQ | → (mailto opens in the same tab; ↗ means new tab everywhere else) | Hard-coded `↗` on all 4. Fix: use `opensNewTab(href)` or `ArrowLink`. Home's link is also hand-rolled instead of a shared component, which is how it slipped through | `r2-b10-home-faq-mailto.png`, `r2-b10-program-contactline.png` |
| N2 | Low (copy) | **Lead** (`content/programs.ts:56-57, 93-94`) | `/programs/build-cohort/`, `/programs/mentorship/` Timeline, all widths | Read the timeline top to bottom | Steps in time order, no overlaps | Build Cohort lists "Weeks 2–8 Build" and then "Week 5 Mid-quarter review", which goes backwards in a dated list. Mentorship has "Week 2 Matching" and then "Weeks 2–9 Meet". Suggest Build "Weeks 2–9" with the review as a sub-note, or reorder | `r2-buildcohort-timeline.png` |
| N3 | Low | **Design** (`components/Navbar.tsx`, `<nav … border-b>`) | All routes, all widths | Measure `header nav` | 68px (spec and `--nav-height`) | 69px: the transparent `border-b` adds 1px. Anchors still clear it because scroll-padding is 68+16 | `r2-navbar-1440.png` |
| N4 | Low (SEO/share) | **Design** (`app/layout.tsx` metadata) / **Home** (`app/page.tsx`) | `/` | View source | canonical + og:image, like the sub-pages | Home has no `<link rel=canonical>`. No page has `og:image` (link previews in Discord/Instagram will be bare). Home og:title is just "Tech@EDC". No `robots.txt`/sitemap (optional) | n/a |
| N5 | Low (deploy hardening) | **Lead** (`public/.htaccess`) | GoDaddy/Apache | Review | Fails safe on any Apache | (a) `AddOutputFilterByType` comes from mod_filter in Apache 2.4. Wrap it in `<IfModule mod_filter.c>` too, or a host with deflate but no filter returns a 500. (b) Add `text/javascript` (newer Apache `mime.types` serve `.js` with it, so it wouldn't be compressed). (c) `/fonts/BDOGrotesk-VF.woff2` gets `immutable` for a year but has no hash in the name; rename it when the font changes. (d) `/styleguide/` ships in `out/` (noindex); exclude it from the upload if wanted | n/a |
| N6 | Cosmetic | **Design** (`components/Navbar.tsx`) | `/` at 390/360 | Load home on a phone | One clear CTA; Tech@NYU uses a 44px icon-only Discord button + 44px menu button | Navbar shows a full-text "Join Discord" (36px tall) and the hero shows a full-width "Join Discord" about 600px below. The same CTA appears twice in the first screen, and the touch targets are 36px vs NYU's 44px | `final-home-390.png`, `final-mobile-menu-open-390.png` |
| N7 | Cosmetic | **Design** (`components/Logo.tsx`) | All | Compare the navbar with the scrape | Wordmark weight/size close to Tech@NYU's | Ours is bold 26px BDO Grotesk at every width; NYU's is lighter and drops to about 21px on mobile, so ours reads heavier. A matter of taste; flagging for Mark | `r2-navbar-1440.png` |
| N8 | Info | Design / Pages | n/a | `qa/audit.py` token audit | No one-off values | 61 findings, almost all `max-w-[Npx]` layout widths (Section, JoinUs, EmptyState, Accordion, Footer, program/404 pages), Gallery tile sizes, `var(--…)` spacing, and Logo's `tracking-[-0.03em]` + inline `style={{fontSize}}`. No one-off colors or fonts outside the styleguide swatches and `themeColor`. Consider `max-w-*` tokens and a tracking token for the wordmark | `qa/audit-results.json` |

Not bugs (checked): no NYU/company names anywhere; no dots, glow, nested cards, emoji or fake product UI (e2e v2 + audit); 0 console errors and 0 failed requests on every route; every in-page `#anchor` resolves; page titles unique; favicon serves; the styled 404 renders; copy has no typos that I found.

### Tools changed this round (QA-owned)
- `qa/round2.py` (new): fix verification, navbar geometry vs Tech@NYU, hero/favicon, metadata, anchors, arrows. Writes `qa/round2-results.json`.
- `qa/e2e.py`: background check now expects flat + noise + 40/10px grid, with no gradient and no mask.
- `qa/proof.py`: new `mid` group (`final-home-hero-{768x900,860x900,1080x900,1280x800,1366x768}.png`, plus Community/Programs/Connect at 860 and 1080). The Events reduced-motion shot now uses a taller viewport; before, it stitched the off-screen skip link and a second navbar into the image.

---

## Round 1

Round 1, 15 Nov 2026. Written by the QA agent; saved by Lead (the QA agent's write to this file was blocked).

### Verdict

Ready to ship after B1–B3. Nothing found breaks a click, a form, or keyboard navigation.

- `npm run build` and `npm run lint` clean.
- `python3 -I qa/e2e.py`: 484 / 484 checks pass on 9 routes at 1440, 768, 390 and 360 px. Zero console errors, zero failed requests or broken images, no horizontal overflow.
- Home section order matches Tech@NYU: Hero → (Network, hidden) → Community → Programs → Events → FAQ → Connect → Join Us → Footer.
- Removal audit: zero hits on public pages; `/styleguide/` mentioned "Tech@NYU" twice (B1).
- Lighthouse (home, mobile): Performance 75 on the uncompressed test server, 96–98 with compression; 100 desktop. Accessibility 100 everywhere except `/blog/` (98, B5).

### Section 1: test like a user (automated in `qa/e2e.py`)

| Check | Result |
| --- | --- |
| HTTP 200, no console errors, no failed requests or broken images (9 routes, 1440 and 390) | PASS |
| Navbar on every page: internal links correct; Events and Join Discord open new tabs with `rel=noopener` to `content/site.ts` placeholders; Contact is mailto | PASS (63/63) |
| Shortcuts P/E/T/B/C on every page; ignored while typing, with modifiers, and with the mobile menu open | PASS |
| Programs link lands on `#programs` below the sticky navbar from home, sub-pages, mobile menu, and direct load | PASS |
| Mobile menu opens, closes (button, Esc, link), manages focus, restores scroll, navigates | PASS |
| Program cards open the right pages | PASS |
| FAQ (home, Buildathon): mouse, Enter, Space, arrows with wrap, Home, End | PASS |
| Newsletter on all 8 pages: empty → 3 errors, bad email → email error, valid → success + `console.info` stub, no `console.error` | PASS |
| BDO Grotesk and Geist Mono loaded and applied; Inter absent | PASS |
| Blog newest first; post renders; Team shows "Roster coming soon"; 404 renders | PASS |
| Tab order: skip link first, visible focus everywhere, logical order | PASS |
| One h1 per page; header/main/footer landmarks; alt text; decorative SVGs hidden | PASS |
| Reduced motion stops animation; photo columns pause on hover | PASS |
| v2 direction: no dots, glow, purple, nested cards; background is gradient + noise + 40/10 px grid | PASS |
| Navbar and footer identical on every page | PASS |
| Unknown URL shows our 404 | Host-dependent; `.htaccess` added (B2) |

### Feature parity

| Tech@NYU feature | Result | Note |
| --- | --- | --- |
| Navbar with `[P]` hints, bordered Contact | Pass | C works without a visible hint, like NYU |
| CRT hero video | Intentional difference | Centered headline and photo frame (empty until photos exist, B3) |
| Our Network logos | Pass | Component commented out; `content/network.ts` empty |
| Community blurb | Pass | Original copy and illustration |
| Tech Treks, Dev Team | Intentional difference | Merged into Build Cohort; no startup partners |
| Mentorship | Pass | |
| Buildathon page | Pass | Fuller than NYU's "Details Soon" page |
| New York Startup Week | Pass | Removed |
| Events blurb and photos | Pass (placeholders) | Six placeholder tiles |
| Events link to Luma | Pass | |
| FAQ accordion | Pass | NYU uses an animated gear selector; ours is an accordion as planned |
| Connect | Pass | |
| Newsletter | Pass | Stub until the Luma list exists |
| Team page | Pass | Empty state; filled path code-reviewed |
| Blog | Pass / Intentional | No category tabs, search, or picks sidebar |
| Program pages | Pass | Same section order; timeline is a list, application is open (not accordion) |
| Footer | Pass / Intentional | Adds nav links and socials |

### Bugs (ranked, with owners)

| # | Severity | Problem | Owner | Status |
| --- | --- | --- | --- | --- |
| B1 | High | `/styleguide/` renders "Tech@NYU" twice | Design | Open |
| B2 | High (hosting) | Unknown URLs need our 404; compression and caching needed for mobile performance | Lead | Fixed: `public/.htaccess` with ErrorDocument, deflate, caching |
| B3 | Medium | Hero's main visual is an empty "photos coming soon" frame; Events has 6 empty tiles | Home (interim visual), Mark (photos) | Open |
| B4 | Low | Focus drops to page top after newsletter success | Design | Open |
| B5 | Low | `/blog/` skips from h1 to h3 | Pages | Open |
| B6 | Low | `?accent=none` differs only in the focus ring | Lead | Tell Mark; no code change |
| B7 | Low | Program card hover barely visible | Design | Open |
| B8 | Low | One-off font sizes (15px, 13px, 20px lead), e.g. `app/_home/Hero.tsx:20` | Design + Home | Open |
| B9 | Cosmetic | Navbar `[P]` hints dimmer than NYU's | Design | Open |
| B10 | Cosmetic | Mobile menu Contact (mailto) shows ↗, which means "new tab" elsewhere | Design | Open |
| B11 | Cosmetic | `/blog/` "Stay in the loop" Subscribe button only scrolls to the form below it | Pages | Open |

### Placeholders still needed (`content/*`)

- Discord, Luma, Instagram, LinkedIn URLs (`example.com`); confirm `hello@techatedc.org`.
- Apply/sign-up links for Build Cohort, Mentorship, Buildathon.
- Newsletter endpoint (Luma subscriber list).
- Buildathon date and venue; program timeline weeks.
- Hero photo and event photos (`public/events/`).
- Team roster and photos.
- `site.announcement` is unused (kept for a future banner).

### Re-running

Serve `out/` on 4173 (and `reference/Tech-at-NYU` on 4174 for comparisons), then:
`python3 -I qa/e2e.py` (PASS/FAIL table, `--only <group>`), `python3 -I qa/audit.py` (name, v2 and token audits), `python3 -I qa/proof.py` (all screenshots).
