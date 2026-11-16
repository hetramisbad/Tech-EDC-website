"""Shared QA expectations, taken from docs/MASTER_PLAN.md (Scope) and content/site.ts."""

ROUTES = [
    "/",
    "/programs/build-cohort/",
    "/programs/mentorship/",
    "/buildathon/",
    "/team/",
    "/blog/",
    "/blog/welcome-to-tech-at-edc/",
    "/404.html",
    "/styleguide/",
]

# Pages that end with the Join Us newsletter section (404 intentionally does not).
FORM_ROUTES = [r for r in ROUTES if r not in ("/404.html",)]

CLUB_EMAIL = "hello@techatedc.org"

# Navbar Scope table: label -> exact href.
EXPECT_NAV = {
    "home": "/",
    "Programs": "/#programs",
    "Events": "https://example.com/luma",
    "Team": "/team/",
    "Blog": "/blog/",
    "Contact": f"mailto:{CLUB_EMAIL}",
    "Join Discord": "https://example.com/discord",
}

PLACEHOLDER_PREFIXES = ("https://example.com/",)

PROGRAM_CARDS = [
    ("Build Cohort", "/programs/build-cohort/"),
    ("Mentorship", "/programs/mentorship/"),
    ("Buildathon", "/buildathon/"),
]

SHOT_ROUTES = {
    "home": "/",
    "build-cohort": "/programs/build-cohort/",
    "mentorship": "/programs/mentorship/",
    "buildathon": "/buildathon/",
    "team": "/team/",
    "blog": "/blog/",
    "post": "/blog/welcome-to-tech-at-edc/",
    "404": "/404.html",
    "styleguide": "/styleguide/",
}
