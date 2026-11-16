"""Screenshot proof for the QA report.

Usage (both servers running):
  python3 -m http.server 4173 -d out &
  python3 -m http.server 4174 -d reference/Tech-at-NYU &
  python3 -I qa/proof.py [--only full,states,mid,compare]

Writes qa/screenshots/final-*.png and qa/screenshots/compare-*.png.
"""
import argparse
import os
import sys

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

sys.path.insert(0, os.path.dirname(__file__))
from shoot import PREP_JS  # noqa: E402
from qa_config import SHOT_ROUTES  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("--base", default="http://localhost:4173")
ap.add_argument("--ref", default="http://localhost:4174")
ap.add_argument("--only", default="")
a = ap.parse_args()
BASE, REF = a.base.rstrip("/"), a.ref.rstrip("/")
ONLY = set(filter(None, a.only.split(",")))
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(OUT, exist_ok=True)
errors: list[str] = []


def path(name):
    return os.path.join(OUT, name)


def page_for(browser, width, height=900, rm="no-preference"):
    ctx = browser.new_context(viewport={"width": width, "height": height}, reduced_motion=rm)
    ctx.route("https://example.com/**", lambda r: r.fulfill(status=200, content_type="text/html", body="stub"))
    pg = ctx.new_page()
    pg.on("console", lambda m: errors.append(f"{pg.url}: {m.text}") if m.type == "error" else None)
    return ctx, pg


def load(pg, url, prep=True, full=False):
    pg.goto(url, wait_until="networkidle")
    pg.wait_for_timeout(900)
    if prep:
        pg.evaluate(PREP_JS, full)
        pg.wait_for_timeout(200)


def full_pages(browser):
    for width in (1440, 390):
        ctx, pg = page_for(browser, width, 900 if width == 1440 else 844)
        for name, route in SHOT_ROUTES.items():
            load(pg, BASE + route, full=True)
            pg.screenshot(path=path(f"final-{name}-{width}.png"), full_page=True)
            print("shot", name, width)
        ctx.close()


def states(browser):
    # Mobile menu open
    ctx, pg = page_for(browser, 390, 844)
    load(pg, BASE + "/")
    pg.get_by_role("button", name="Open menu").click()
    pg.wait_for_timeout(500)
    pg.screenshot(path=path("final-mobile-menu-open-390.png"))
    ctx.close()

    ctx, pg = page_for(browser, 1440, 900)
    # FAQ expanded (home + buildathon)
    load(pg, BASE + "/")
    t = pg.locator("#faq button[aria-expanded]").nth(1)
    t.click()
    pg.wait_for_timeout(500)
    pg.locator("#faq").screenshot(path=path("final-faq-expanded-1440.png"))
    load(pg, BASE + "/buildathon/")
    acc = pg.locator("main button[aria-expanded]").first
    acc.click()
    pg.wait_for_timeout(500)
    acc.evaluate("e => e.closest('section').scrollIntoView({block: 'center'})")
    pg.wait_for_timeout(200)
    pg.screenshot(path=path("final-buildathon-faq-expanded-1440.png"))

    # Newsletter states
    load(pg, BASE + "/")
    form = pg.locator("#newsletter form")
    form.locator("button[type=submit]").click()
    pg.wait_for_timeout(300)
    pg.locator("#newsletter").screenshot(path=path("final-newsletter-error-empty-1440.png"))
    form.locator("input[name=firstName]").fill("Ada")
    form.locator("input[name=lastName]").fill("Lovelace")
    form.locator("input[name=email]").fill("ada@nowhere")
    form.locator("button[type=submit]").click()
    pg.wait_for_timeout(300)
    pg.locator("#newsletter").screenshot(path=path("final-newsletter-error-email-1440.png"))
    form.locator("input[name=email]").fill("ada@example.com")
    form.locator("button[type=submit]").click()
    pg.locator("[role=status]").first.wait_for()
    pg.wait_for_timeout(200)
    pg.locator("#newsletter").screenshot(path=path("final-newsletter-success-1440.png"))

    # Hover / focus: primary button (hero Join Discord) and a program card
    load(pg, BASE + "/")
    hero_btn = pg.locator("section[aria-labelledby=hero-title] a").first
    box_clip = lambda el, pad=24: (lambda b: {"x": max(0, b["x"] - pad), "y": max(0, b["y"] - pad), "width": b["width"] + 2 * pad, "height": b["height"] + 2 * pad})(el.bounding_box())
    pg.mouse.move(5, 5)
    pg.wait_for_timeout(200)
    pg.screenshot(path=path("final-button-default.png"), clip=box_clip(hero_btn))
    hero_btn.hover()
    pg.wait_for_timeout(350)
    pg.screenshot(path=path("final-button-hover.png"), clip=box_clip(hero_btn))
    pg.mouse.move(5, 5)
    # keyboard focus: tab until the hero button is focused
    pg.evaluate("window.scrollTo(0,0)")
    pg.locator("body").focus()
    for _ in range(15):
        pg.keyboard.press("Tab")
        if pg.evaluate("document.activeElement.closest('section[aria-labelledby=hero-title]') !== null"):
            break
    pg.wait_for_timeout(300)
    pg.screenshot(path=path("final-button-focus.png"), clip=box_clip(hero_btn))

    card = pg.locator("#programs li a").first
    row = pg.locator("#programs ul").first
    row.evaluate("e => e.scrollIntoView({block: 'center'})")
    pg.mouse.move(5, 5)
    pg.wait_for_timeout(300)
    row.screenshot(path=path("final-card-default.png"))
    card.hover()
    pg.wait_for_timeout(400)
    row.screenshot(path=path("final-card-hover.png"))
    pg.mouse.move(5, 5)
    pg.locator("#programs h2").first.evaluate("e => { e.tabIndex = -1; e.focus(); e.removeAttribute('tabindex'); }")
    pg.keyboard.press("Tab")
    pg.wait_for_timeout(300)
    row.evaluate("e => e.scrollIntoView({block: 'center'})")
    pg.wait_for_timeout(200)
    pg.locator("#programs").screenshot(path=path("final-card-focus.png"))

    # Navbar shortcut hint hover + Contact
    load(pg, BASE + "/blog/")
    pg.locator("header nav ul a").nth(2).hover()
    pg.wait_for_timeout(200)
    pg.screenshot(path=path("final-navbar-1440.png"), clip={"x": 0, "y": 0, "width": 1440, "height": 80})

    # Hero accent vs none (focus the hero button so the accent is visible)
    for variant, q in (("accent", "?accent=blue"), ("noaccent", "?accent=none")):
        load(pg, BASE + "/" + q, prep=False)
        pg.locator("body").focus()
        for _ in range(15):
            pg.keyboard.press("Tab")
            if pg.evaluate("document.activeElement.closest('section[aria-labelledby=hero-title]') !== null"):
                break
        pg.wait_for_timeout(300)
        pg.screenshot(path=path(f"final-hero-{variant}-1440.png"))
    load(pg, BASE + "/?accent=blue", prep=False)  # reset stored preference
    ctx.close()

    # Reduced motion events band
    # Viewport taller than the band: element shots larger than the viewport get stitched and
    # pick up the off-screen skip link and a second copy of the sticky navbar.
    ctx, pg = page_for(browser, 1440, 1200, rm="reduce")
    load(pg, BASE + "/")
    pg.evaluate("document.querySelector('#events').scrollIntoView({block: 'center', behavior: 'instant'})")
    pg.wait_for_timeout(300)
    pg.locator("#events").screenshot(path=path("final-events-reduced-motion-1440.png"))
    ctx.close()
    # Mobile states
    ctx, pg = page_for(browser, 390, 844)
    load(pg, BASE + "/")
    pg.locator("#faq button[aria-expanded]").first.click()
    pg.wait_for_timeout(400)
    pg.locator("#faq").screenshot(path=path("final-faq-expanded-390.png"))
    form = pg.locator("#newsletter form")
    form.locator("button[type=submit]").click()
    pg.wait_for_timeout(300)
    pg.locator("#newsletter").screenshot(path=path("final-newsletter-error-390.png"))
    ctx.close()


# ------------------------------------------------------------------------------------------
def label_img(im, text):
    d = ImageDraw.Draw(im)
    try:
        f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
    except Exception:
        f = ImageFont.load_default()
    d.rectangle([0, 0, im.width, 48], fill=(255, 220, 0))
    d.text((16, 8), text, fill=(0, 0, 0), font=f)
    return im


def side_by_side(left: Image.Image, right: Image.Image, ltxt, rtxt, out, max_h=5200, width=1440):
    def prep(im):
        im = im.convert("RGB")
        if im.width != width:
            im = im.resize((width, int(im.height * width / im.width)))
        im = im.crop((0, 0, width, min(im.height, max_h)))
        canvas = Image.new("RGB", (width, im.height + 48), (40, 40, 40))
        canvas.paste(im, (0, 48))
        return canvas

    L = prep(left)
    label_img(L, ltxt)
    R = prep(right)
    label_img(R, rtxt)
    H = max(L.height, R.height)
    sheet = Image.new("RGB", (L.width + R.width + 24, H), (255, 220, 0))
    sheet.paste(L, (0, 0))
    sheet.paste(R, (L.width + 24, 0))
    sheet = sheet.resize((sheet.width // 2, sheet.height // 2))
    sheet.save(out)
    print("compare", out)


def compare(browser):
    ctx, pg = page_for(browser, 1440, 900)
    pairs = {
        "home": ("/", "/"),
        "program": ("/programs/dev-team/", "/programs/build-cohort/"),
        "team": ("/team/", "/team/"),
        "blog": ("/blog/", "/blog/"),
        "buildathon": ("/buildathon/", "/buildathon/"),
        "post": ("/blog/eng-lead-announcement/", "/blog/welcome-to-tech-at-edc/"),
    }
    for name, (ref_route, our_route) in pairs.items():
        pg.goto(REF + ref_route, wait_until="load")
        pg.wait_for_timeout(800)
        pg.screenshot(path="/tmp/qa_ref.png", full_page=True)
        load(pg, BASE + our_route, full=True)
        pg.screenshot(path="/tmp/qa_ours.png", full_page=True)
        side_by_side(Image.open("/tmp/qa_ref.png"), Image.open("/tmp/qa_ours.png"),
                     f"Tech@NYU scrape {ref_route}", f"Tech@EDC {our_route}", path(f"compare-{name}.png"))
    ctx.close()
    # Live Tech@NYU home screenshots vs ours at matching sections
    live = os.path.join(ROOT, "reference", "live")
    ctx, pg = page_for(browser, 1440, 900)
    load(pg, BASE + "/")
    shots = []
    for sel in ("section[aria-labelledby=hero-title]", "#community", "#programs", "#events", "#newsletter"):
        pg.locator(sel).first.scroll_into_view_if_needed()
        # scroll-padding-top already keeps the section below the sticky navbar
        pg.evaluate(f"document.querySelector('{sel}').scrollIntoView({{block: 'start', behavior: 'instant'}})")
        pg.wait_for_timeout(400)
        pg.screenshot(path=f"/tmp/qa_live_{len(shots)}.png")
        shots.append(f"/tmp/qa_live_{len(shots)}.png")
    ctx.close()
    refs = ["01-hero.jpg", "03-community.jpg", "04-programs.jpg", "06-events-columns.jpg", "07-join-us.jpg"]
    rows = []
    for r, o in zip(refs, shots):
        ri = Image.open(os.path.join(live, r)).convert("RGB").resize((960, 600))
        oi = Image.open(o).convert("RGB").resize((960, 600))
        row = Image.new("RGB", (960 * 2 + 16, 600), (255, 220, 0))
        row.paste(ri, (0, 0))
        row.paste(oi, (976, 0))
        rows.append(row)
    sheet = Image.new("RGB", (rows[0].width, 48 + len(rows) * 616), (255, 220, 0))
    d = ImageDraw.Draw(sheet)
    try:
        f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
    except Exception:
        f = ImageFont.load_default()
    d.text((16, 8), "Tech@NYU live (reference/live)", fill=(0, 0, 0), font=f)
    d.text((992, 8), "Tech@EDC (same section, 1440x900)", fill=(0, 0, 0), font=f)
    for i, row in enumerate(rows):
        sheet.paste(row, (0, 48 + i * 616))
    sheet.save(path("compare-home-live.png"))
    print("compare", path("compare-home-live.png"))


def mid_widths(browser):
    """First-view and section shots at in-between widths and common laptop viewports."""
    for w, h in ((768, 900), (860, 900), (1080, 900), (1280, 800), (1366, 768)):
        ctx, pg = page_for(browser, w, h)
        load(pg, BASE + "/")
        pg.screenshot(path=path(f"final-home-hero-{w}x{h}.png"))
        if w in (860, 1080):
            for sel, name in (("#community", "community"), ("#programs", "programs"), ("#connect", "connect")):
                pg.evaluate(f"document.querySelector('{sel}').scrollIntoView({{block: 'start', behavior: 'instant'}})")
                pg.wait_for_timeout(300)
                pg.screenshot(path=path(f"final-home-{name}-{w}.png"))
        print("mid", w, h)
        ctx.close()


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    for name, fn in (("full", full_pages), ("states", states), ("mid", mid_widths), ("compare", compare)):
        if not ONLY or name in ONLY:
            fn(browser)
    browser.close()

if errors:
    print("CONSOLE ERRORS:", *errors, sep="\n  ")
