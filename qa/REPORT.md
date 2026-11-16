# QA report: Tech@EDC website

Round 1, 15 Nov 2026. Written by the QA agent; saved by Lead (the QA agent's write to this file was blocked).

## Verdict

Ready to ship after B1–B3. Nothing found breaks a click, a form, or keyboard navigation.

- `npm run build` and `npm run lint` clean.
- `python3 -I qa/e2e.py`: 484 / 484 checks pass on 9 routes at 1440, 768, 390 and 360 px. Zero console errors, zero failed requests or broken images, no horizontal overflow.
- Home section order matches Tech@NYU: Hero → (Network, hidden) → Community → Programs → Events → FAQ → Connect → Join Us → Footer.
- Removal audit: zero hits on public pages; `/styleguide/` mentioned "Tech@NYU" twice (B1).
- Lighthouse (home, mobile): Performance 75 on the uncompressed test server, 96–98 with compression; 100 desktop. Accessibility 100 everywhere except `/blog/` (98, B5).

## Section 1: test like a user (automated in `qa/e2e.py`)

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

## Feature parity

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

## Bugs (ranked, with owners)

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

## Placeholders still needed (`content/*`)

- Discord, Luma, Instagram, LinkedIn URLs (`example.com`); confirm `hello@techatedc.org`.
- Apply/sign-up links for Build Cohort, Mentorship, Buildathon.
- Newsletter endpoint (Luma subscriber list).
- Buildathon date and venue; program timeline weeks.
- Hero photo and event photos (`public/events/`).
- Team roster and photos.
- `site.announcement` is unused (kept for a future banner).

## Re-running

Serve `out/` on 4173 (and `reference/Tech-at-NYU` on 4174 for comparisons), then:
`python3 -I qa/e2e.py` (PASS/FAIL table, `--only <group>`), `python3 -I qa/audit.py` (name, v2 and token audits), `python3 -I qa/proof.py` (all screenshots).
