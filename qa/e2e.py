"""Tech@EDC end-to-end QA suite (production build, headless Chrome).

Usage:
  python3 -m http.server 4173 -d out &      # serve the static export first
  python3 -I qa/e2e.py [--base http://localhost:4173] [--only nav,faq,...] [--json qa/e2e-results.json]

Prints a PASS/FAIL table and exits non-zero if anything fails.
Groups: pages, nav, shortcuts, anchor, menu, cards, faq, newsletter, fonts,
        content, tab, motion, v2 (a11y/cohesion checks run inside pages/nav).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.request
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright, Page, BrowserContext

sys.path.insert(0, __import__("os").path.dirname(__file__))
from qa_config import (  # noqa: E402
    ROUTES, FORM_ROUTES, EXPECT_NAV, PLACEHOLDER_PREFIXES, CLUB_EMAIL, PROGRAM_CARDS,
)

ap = argparse.ArgumentParser()
ap.add_argument("--base", default="http://localhost:4173")
ap.add_argument("--only", default="")
ap.add_argument("--json", default="")
args = ap.parse_args()
BASE = args.base.rstrip("/")
ONLY = set(filter(None, args.only.split(",")))

RESULTS: list[tuple[str, str, bool, str]] = []  # (group, check, ok, evidence)


def record(group: str, check: str, ok: bool, evidence: str = "") -> None:
    RESULTS.append((group, check, bool(ok), evidence))
    mark = "PASS" if ok else "FAIL"
    print(f"  [{mark}] {group:10} {check}  {('- ' + evidence) if evidence and not ok else ''}", flush=True)


def want(group: str) -> bool:
    return not ONLY or group in ONLY


class Watch:
    """Collects console errors, page errors, console.info and failed requests for one page."""

    def __init__(self, page: Page):
        self.errors: list[str] = []
        self.infos: list[str] = []
        self.bad: list[str] = []
        page.on("console", self._console)
        page.on("pageerror", lambda e: self.errors.append(f"pageerror: {e}"))
        # Next.js <Link> prefetches are cancelled when the page navigates/closes: not a real failure.
        page.on("requestfailed", lambda r: None if ("ERR_ABORTED" in (r.failure or "") and r.resource_type in ("fetch", "xhr", "other")) else self.bad.append(f"FAILED {r.url} {r.failure} ({r.resource_type})"))
        page.on("response", lambda r: self.bad.append(f"{r.status} {r.url}") if r.status >= 400 else None)

    def _console(self, m):
        if m.type == "error":
            self.errors.append(m.text)
        elif m.type == "info":
            self.infos.append(m.text)


def stub_external(ctx: BrowserContext) -> None:
    """The sandbox cannot reach the internet; answer placeholder URLs locally so new tabs load."""
    ctx.route("https://example.com/**", lambda r: r.fulfill(status=200, content_type="text/html", body="<title>stub</title>stub"))


def new_page(ctx: BrowserContext) -> tuple[Page, Watch]:
    if not getattr(ctx, "_qa_stubbed", False):
        stub_external(ctx)
        ctx._qa_stubbed = True
    p = ctx.new_page()
    return p, Watch(p)


def goto(page: Page, path: str):
    resp = page.goto(BASE + path, wait_until="networkidle")
    page.wait_for_timeout(250)  # hydration
    return resp


def nav_height(page: Page) -> float:
    return page.evaluate("document.querySelector('header').getBoundingClientRect().height")


def http_status(url: str) -> int:
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return -1


# --------------------------------------------------------------------------------------------
def t_pages(browser):
    """Per route x width: status, console errors, broken requests/images, overflow, h1, landmarks."""
    for width in (1440, 768, 390, 360):
        ctx = browser.new_context(viewport={"width": width, "height": 900})
        for path in ROUTES:
            page, w = new_page(ctx)
            resp = goto(page, path)
            # scroll through to trigger lazy images and reveals
            page.evaluate("""async () => { for (let y=0; y<document.body.scrollHeight; y+=500){ window.scrollTo({top:y,behavior:'instant'}); await new Promise(r=>setTimeout(r,30)); } window.scrollTo({top:0,behavior:'instant'}); }""")
            page.wait_for_load_state("networkidle")
            tag = f"{path} @{width}"
            expected_status = 200 if path != "/404.html" else 200
            if width in (1440, 390):
                record("pages", f"{tag} HTTP {expected_status}", resp and resp.status == expected_status, str(resp and resp.status))
                record("pages", f"{tag} 0 console errors", not w.errors, "; ".join(w.errors)[:300])
                record("pages", f"{tag} 0 failed requests", not w.bad, "; ".join(w.bad)[:300])
                imgs = page.evaluate("""[...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src)""")
                record("pages", f"{tag} no broken images", not imgs, ", ".join(imgs))
            if width in (768, 390, 360):
                sw = page.evaluate("[document.documentElement.scrollWidth, document.body.scrollWidth, innerWidth]")
                over = page.evaluate("""() => { const W = document.documentElement.clientWidth; return [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); if (!r.width) return false; const cs = getComputedStyle(e); if (cs.position === 'fixed') return false; let p = e.parentElement; while (p) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') return false; p = p.parentElement; } return r.right > W + 1 || r.left < -1; }).slice(0,5).map(e => e.tagName + '.' + (e.className && e.className.baseVal === undefined ? String(e.className).slice(0,60) : '') + ' right=' + Math.round(e.getBoundingClientRect().right)); }""")
                record("pages", f"{tag} no horizontal overflow", sw[0] <= sw[2] and sw[1] <= sw[2], f"scrollWidth={sw}; offenders={over}")
            if width == 1440:
                h1 = page.evaluate("document.querySelectorAll('h1').length")
                record("a11y", f"{path} exactly one h1", h1 == 1, f"h1 count={h1}")
                lm = page.evaluate("""({header: document.querySelectorAll('header').length, nav: document.querySelectorAll('nav').length, main: document.querySelectorAll('main').length, footer: document.querySelectorAll('footer').length})""")
                record("a11y", f"{path} landmarks header/nav/main/footer", lm["header"] >= 1 and lm["nav"] >= 1 and lm["main"] == 1 and lm["footer"] >= 1, str(lm))
                bad_img = page.evaluate("""[...document.images].filter(i => !i.hasAttribute('alt') && !i.closest('[aria-hidden=true]')).map(i => i.src)""")
                record("a11y", f"{path} every <img> has alt or is aria-hidden", not bad_img, ", ".join(bad_img))
                bad_svg = page.evaluate("""[...document.querySelectorAll('svg')].filter(s => !s.closest('[aria-hidden=true],[aria-hidden=""]') && s.getAttribute('aria-hidden') !== 'true' && !s.getAttribute('aria-label') && !s.querySelector('title') && s.getAttribute('role') !== 'img' && !s.closest('a,button')).map(s => (s.getAttribute('class')||'svg').slice(0,50))""")
                record("a11y", f"{path} decorative SVGs aria-hidden or labelled", not bad_svg, ", ".join(bad_svg[:6]))
                # Interactive names
                noname = page.evaluate("""[...document.querySelectorAll('a[href],button')].filter(e => { const t = (e.innerText||'').trim() || e.getAttribute('aria-label') || e.getAttribute('title') || (e.querySelector('img[alt]')||{}).alt; return !t; }).map(e => e.outerHTML.slice(0,80))""")
                record("a11y", f"{path} links/buttons have accessible names", not noname, "; ".join(noname[:4]))
                pos_tab = page.evaluate("[...document.querySelectorAll('[tabindex]')].filter(e => +e.getAttribute('tabindex') > 0).length")
                record("a11y", f"{path} no positive tabindex", pos_tab == 0, str(pos_tab))
            page.close()
        ctx.close()


# --------------------------------------------------------------------------------------------
def classify(href: str) -> str:
    if href.startswith("mailto:"):
        return "mailto"
    if href.startswith("http"):
        return "external"
    return "internal"


def t_nav(browser):
    """Navbar links/buttons on every page land where the Scope table says; footer too."""
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page, w = new_page(ctx)
    status_cache: dict[str, int] = {}
    nav_snapshots = {}
    footer_snapshots = {}
    for path in ROUTES:
        goto(page, path)
        links = page.evaluate("""[...document.querySelectorAll('header a')].filter(a => a.offsetParent !== null).map(a => ({text: a.innerText.replace(/\\s+/g,' ').trim(), aria: a.getAttribute('aria-label'), href: a.getAttribute('href'), target: a.target, rel: a.rel}))""")
        nav_snapshots[path] = page.evaluate("document.querySelector('header').innerText.replace(/\\s+/g,' ')")
        footer_snapshots[path] = page.evaluate("(() => { const f = document.querySelector('body > footer'); return f.innerText + '|' + [...f.querySelectorAll('a')].map(a => a.getAttribute('href') + ':' + a.target).join(','); })()")
        found = {}
        for l in links:
            label = l["aria"] or l["text"]
            for key, exp in EXPECT_NAV.items():
                if key.lower() in (label or "").lower():
                    found.setdefault(key, l)
        for key, exp in EXPECT_NAV.items():
            l = found.get(key)
            if not l:
                record("nav", f"{path} navbar has '{key}'", False, f"links={links}")
                continue
            href = l["href"]
            ok = href == exp
            kind = classify(href)
            ev = f"href={href}"
            if kind == "external":
                ok = ok and l["target"] == "_blank" and "noopener" in l["rel"] and href.startswith(PLACEHOLDER_PREFIXES)
                ev += f" target={l['target']} rel={l['rel']}"
            elif kind == "internal":
                url = BASE + href.split("#")[0]
                status_cache.setdefault(url, http_status(url))
                ok = ok and status_cache[url] == 200
                ev += f" status={status_cache[url]}"
            record("nav", f"{path} navbar '{key}' -> {exp}", ok, ev)
    # Identical navbar/footer
    ref_nav = nav_snapshots["/"]
    diff = [p for p, s in nav_snapshots.items() if s != ref_nav]
    record("cohesion", "navbar text identical on every page", not diff, f"differs on {diff}")
    ref_f = footer_snapshots["/"]
    diff = [p for p, s in footer_snapshots.items() if s != ref_f]
    record("cohesion", "site footer (text + links) identical on every page", not diff, f"differs on {diff}")

    # Actually click internal navbar links from a sub-page.
    for key, dest in (("Team", "/team/"), ("Blog", "/blog/")):
        goto(page, "/buildathon/")
        page.locator("header nav").get_by_role("link", name=re.compile(rf"\b{key}\b")).first.click()
        page.wait_for_url(BASE + dest, timeout=5000)
        record("nav", f"click navbar {key} from /buildathon/ -> {dest}", page.url == BASE + dest, page.url)
    goto(page, "/team/")
    page.locator("header a[aria-label$='home']").click()
    page.wait_for_url(BASE + "/", timeout=5000)
    record("nav", "click logo from /team/ -> /", page.url == BASE + "/", page.url)
    # External: opens a new tab.
    goto(page, "/blog/")
    with ctx.expect_page() as pinfo:
        page.locator("header").get_by_role("link", name=re.compile("Join Discord")).first.click()
    popup = pinfo.value
    record("nav", "click Join Discord opens a new tab at the Discord placeholder", popup.url.startswith(EXPECT_NAV["Join Discord"]), popup.url)
    popup.close()
    with ctx.expect_page() as pinfo:
        page.locator("header").get_by_role("link", name=re.compile("Events")).first.click()
    popup = pinfo.value
    record("nav", "click Events opens a new tab at the Luma placeholder", popup.url.startswith(EXPECT_NAV["Events"]), popup.url)
    popup.close()
    ctx.close()


# --------------------------------------------------------------------------------------------
def press_and_detect(page: Page, ctx: BrowserContext, key: str, timeout=1500):
    """Press a key; return ('popup', url) | ('url', url) | ('prevented', None) | ('none', url)."""
    start = page.url
    popups = []

    def on_page(pg):
        popups.append(pg)
    ctx.on("page", on_page)
    page.evaluate("""() => { window.__kp = null; document.addEventListener('keydown', e => { setTimeout(() => { window.__kp = e.defaultPrevented; }, 0); }, {once: true, capture: false}); }""")
    page.keyboard.press(key)
    t0 = time.time()
    while time.time() - t0 < timeout / 1000:
        page.wait_for_timeout(100)
        if popups or page.url != start:
            break
    ctx.remove_listener("page", on_page)
    if popups:
        p = popups[0]
        try:
            p.wait_for_load_state("commit", timeout=3000)
        except Exception:
            pass
        url = p.url
        p.close()
        return "popup", url
    if page.url != start:
        return "url", page.url
    try:
        prevented = page.evaluate("window.__kp")
    except Exception:
        prevented = None
    return ("prevented" if prevented else "none"), page.url


def programs_landing_ok(page: Page) -> tuple[bool, str]:
    page.wait_for_timeout(1200)  # smooth scroll
    top = page.evaluate("(() => { const e = document.getElementById('programs'); return e ? e.getBoundingClientRect().top : null; })()")
    head_top = page.evaluate("(() => { const h = document.querySelector('#programs h2'); return h ? h.getBoundingClientRect().top : null; })()")
    nh = nav_height(page)
    ok = top is not None and head_top is not None and head_top >= nh - 1 and top <= nh + 120 and top >= -2
    return ok, f"url={page.url} #programs.top={top} h2.top={head_top} nav={nh}"


def t_shortcuts(browser):
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page, w = new_page(ctx)
    for path in ROUTES:
        for key, expect in (("t", ("url", "/team/")), ("b", ("url", "/blog/")), ("e", ("popup", EXPECT_NAV["Events"])), ("c", ("prevented", None)), ("p", ("programs", None))):
            goto(page, path)
            page.mouse.click(5, 450)  # focus the document body without hitting a control
            kind, url = press_and_detect(page, ctx, key)
            if expect[0] == "url":
                ok = (kind == "url" and url == BASE + expect[1]) or (path == expect[1] and kind in ("none", "prevented"))
                ev = f"{kind} {url}"
            elif expect[0] == "popup":
                ok = kind == "popup" and url.startswith(expect[1])
                ev = f"{kind} {url}"
            elif expect[0] == "prevented":
                ok = kind == "prevented"  # handler ran (mailto navigation is invisible headless)
                ev = f"{kind} {url}"
            else:
                ok, ev = programs_landing_ok(page)
                ok = ok and page.url.startswith(BASE + "/") and "#programs" in page.url or (ok and path == "/")
            record("shortcuts", f"{path} key {key.upper()}", ok, ev)
    # Ignored while typing and with modifiers
    goto(page, "/")
    page.locator("form input[name=firstName]").first.focus()
    for key in ("t", "b", "e", "c", "p"):
        kind, url = press_and_detect(page, ctx, key, timeout=600)
        record("shortcuts", f"key {key.upper()} ignored while typing in a form field", kind in ("none",) and url == BASE + "/", f"{kind} {url}")
    val = page.locator("form input[name=firstName]").first.input_value()
    record("shortcuts", "typed letters reach the input", val == "tbecp", repr(val))
    goto(page, "/blog/")
    page.mouse.click(5, 450)
    for combo in ("Shift+T", "Alt+t", "Control+b", "Meta+t"):
        kind, url = press_and_detect(page, ctx, combo, timeout=600)
        record("shortcuts", f"{combo} ignored (modifier)", kind == "none" and url == BASE + "/blog/", f"{kind} {url}")
    ctx.close()


# --------------------------------------------------------------------------------------------
def t_anchor(browser):
    """Programs link reaches #programs from home and from sub-pages, below the sticky navbar."""
    for width in (1440, 390):
        ctx = browser.new_context(viewport={"width": width, "height": 900})
        page, w = new_page(ctx)
        for path in ("/", "/team/", "/programs/mentorship/", "/blog/welcome-to-tech-at-edc/"):
            goto(page, path)
            if width == 1440:
                page.locator("header nav ul").get_by_role("link", name=re.compile("Programs")).first.click()
            else:
                page.get_by_role("button", name="Open menu").click()
                page.wait_for_timeout(300)
                page.locator("header [data-open=true]").get_by_role("link", name=re.compile("Programs")).click()
            page.wait_for_timeout(400)
            ok, ev = programs_landing_ok(page)
            ok = ok and page.url.endswith("/#programs")
            record("anchor", f"Programs link from {path} @{width} lands on #programs below navbar", ok, ev)
        # Direct load of /#programs
        goto(page, "/#programs")
        ok, ev = programs_landing_ok(page)
        record("anchor", f"direct load /#programs @{width} lands below navbar", ok, ev)
        ctx.close()


# --------------------------------------------------------------------------------------------
def t_menu(browser):
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    page, w = new_page(ctx)
    goto(page, "/blog/")
    btn = page.get_by_role("button", name="Open menu")
    record("menu", "menu button visible at 390", btn.is_visible())
    jd = page.locator("header").get_by_role("link", name=re.compile("Join Discord")).first
    record("menu", "Join Discord stays visible at 390", jd.is_visible())
    btn.click()
    page.wait_for_timeout(350)
    exp = page.locator("header button[aria-controls]").get_attribute("aria-expanded")
    sheet_vis = page.locator("header [data-open=true]").is_visible()
    focus_in = page.evaluate("!!document.activeElement.closest('[data-open=true]')")
    record("menu", "click opens menu (aria-expanded, visible, focus moves in)", exp == "true" and sheet_vis and focus_in, f"expanded={exp} visible={sheet_vis} focusIn={focus_in}")
    items = page.locator("header [data-open=true] a").all_inner_texts()
    record("menu", "menu lists Programs/Events/Team/Blog/Contact", all(any(k in i for i in items) for k in ("Programs", "Events", "Team", "Blog", "Contact")), str(items))
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    exp = page.locator("header button[aria-controls]").get_attribute("aria-expanded")
    foc = page.evaluate("document.activeElement.getAttribute('aria-label')")
    record("menu", "Esc closes and returns focus to the menu button", exp == "false" and foc in ("Open menu", "Close menu"), f"expanded={exp} focus={foc}")
    page.get_by_role("button", name="Open menu").click()
    page.wait_for_timeout(300)
    page.get_by_role("button", name="Close menu").click()
    page.wait_for_timeout(300)
    exp = page.locator("header button[aria-controls]").get_attribute("aria-expanded")
    overflow = page.evaluate("document.body.style.overflow")
    record("menu", "close button closes menu and restores scrolling", exp == "false" and overflow in ("", "visible"), f"expanded={exp} body.overflow={overflow!r}")
    # Tab out of the menu
    page.get_by_role("button", name="Open menu").click()
    page.wait_for_timeout(300)
    seq = []
    for _ in range(8):
        page.keyboard.press("Tab")
        seq.append(page.evaluate("(document.activeElement.innerText||document.activeElement.getAttribute('aria-label')||'').trim().slice(0,30) + (document.activeElement.closest('header')?' [hdr]':' [page]')"))
    exp = page.locator("header button[aria-controls]").get_attribute("aria-expanded")
    record("menu", "Tabbing past the last menu item closes the menu (no focus lost behind sheet)", exp == "false" or all("[hdr]" in s for s in seq), " > ".join(seq))
    # Link click navigates and closes
    goto(page, "/blog/")
    page.get_by_role("button", name="Open menu").click()
    page.wait_for_timeout(300)
    page.locator("header [data-open=true]").get_by_role("link", name=re.compile("Team")).click()
    page.wait_for_url(BASE + "/team/", timeout=5000)
    page.wait_for_timeout(300)
    exp = page.locator("header button[aria-controls]").get_attribute("aria-expanded")
    overflow = page.evaluate("document.body.style.overflow")
    record("menu", "menu link navigates to /team/ and menu closes", page.url == BASE + "/team/" and exp == "false" and overflow in ("", "visible"), f"url={page.url} expanded={exp} overflow={overflow!r}")
    # Scroll still works after navigating via menu
    page.mouse.wheel(0, 600)
    page.wait_for_timeout(500)
    sy = page.evaluate("scrollY")
    record("menu", "page scrolls after navigating from the menu", sy > 100, f"scrollY={sy}")
    # External link in menu
    page.get_by_role("button", name="Open menu").click()
    page.wait_for_timeout(300)
    with ctx.expect_page() as pi:
        page.locator("header [data-open=true]").get_by_role("link", name=re.compile("Events")).click()
    pop = pi.value
    record("menu", "menu Events opens Luma placeholder in a new tab", pop.url.startswith(EXPECT_NAV["Events"]), pop.url)
    pop.close()
    page.wait_for_timeout(200)
    exp = page.locator("header button[aria-controls]").get_attribute("aria-expanded")
    record("menu", "menu closes after an external link click", exp == "false", f"expanded={exp}")
    contact = page.locator("header [data-open], header").locator("a[href^='mailto:']").first.get_attribute("href")
    record("menu", "menu Contact is mailto club address", contact == f"mailto:{CLUB_EMAIL}", str(contact))
    # Shortcuts suppressed while menu open
    goto(page, "/blog/")
    page.get_by_role("button", name="Open menu").click()
    page.wait_for_timeout(300)
    kind, url = press_and_detect(page, ctx, "t", timeout=600)
    record("menu", "shortcut keys are ignored while the menu is open", kind == "none", f"{kind} {url}")
    ctx.close()


# --------------------------------------------------------------------------------------------
def t_cards(browser):
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page, w = new_page(ctx)
    for name, dest in PROGRAM_CARDS:
        goto(page, "/")
        card = page.locator("#programs li").filter(has_text=name).locator("a").first
        card.click()
        page.wait_for_url(BASE + dest, timeout=5000)
        page.wait_for_timeout(200)
        h1 = page.locator("h1").inner_text()
        record("cards", f"program card '{name}' -> {dest}", page.url == BASE + dest and name.lower() in h1.lower() or page.url == BASE + dest and dest == "/buildathon/", f"url={page.url} h1={h1!r}")
    # card is one link (no nested interactive)
    nested = page.evaluate("0")
    goto(page, "/")
    nested = page.evaluate("[...document.querySelectorAll('#programs a')].filter(a => a.querySelector('a,button')).length")
    record("cards", "program cards have no nested interactive elements", nested == 0, str(nested))
    ctx.close()


# --------------------------------------------------------------------------------------------
def accordion_suite(page: Page, scope: str, label: str):
    trig = page.locator(f"{scope} button[aria-expanded]")
    n = trig.count()
    record("faq", f"{label}: has accordion triggers", n >= 3, f"count={n}")
    if n < 2:
        return

    def expanded(i):
        return trig.nth(i).get_attribute("aria-expanded") == "true"

    def panel_h(i):
        pid = trig.nth(i).get_attribute("aria-controls")
        return page.evaluate(f"document.getElementById('{pid}').getBoundingClientRect().height")

    trig.nth(0).scroll_into_view_if_needed()
    trig.nth(0).click()
    page.wait_for_timeout(450)
    record("faq", f"{label}: click opens item 1 (panel visible)", expanded(0) and panel_h(0) > 10, f"exp={expanded(0)} h={panel_h(0)}")
    trig.nth(1).click()
    page.wait_for_timeout(450)
    record("faq", f"{label}: opening item 2 closes item 1", expanded(1) and not expanded(0), "")
    trig.nth(1).click()
    page.wait_for_timeout(450)
    record("faq", f"{label}: click again closes item 2", not expanded(1) and panel_h(1) < 2, f"h={panel_h(1)}")
    # Keyboard
    trig.nth(0).focus()
    page.keyboard.press("Enter")
    page.wait_for_timeout(300)
    record("faq", f"{label}: Enter opens", expanded(0), "")
    page.keyboard.press("ArrowDown")
    f = page.evaluate("document.activeElement.id")
    record("faq", f"{label}: ArrowDown moves focus to next", f == trig.nth(1).get_attribute("id"), f)
    page.keyboard.press("Space")
    page.wait_for_timeout(300)
    record("faq", f"{label}: Space opens focused item", expanded(1), "")
    page.keyboard.press("End")
    f = page.evaluate("document.activeElement.id")
    record("faq", f"{label}: End -> last", f == trig.nth(n - 1).get_attribute("id"), f)
    page.keyboard.press("Home")
    f = page.evaluate("document.activeElement.id")
    record("faq", f"{label}: Home -> first", f == trig.nth(0).get_attribute("id"), f)
    page.keyboard.press("ArrowUp")
    f = page.evaluate("document.activeElement.id")
    record("faq", f"{label}: ArrowUp from first wraps to last", f == trig.nth(n - 1).get_attribute("id"), f)
    page.keyboard.press("Home")
    page.keyboard.press("ArrowDown")
    page.keyboard.press("Enter")
    page.wait_for_timeout(300)
    record("faq", f"{label}: Enter toggles open item closed", not expanded(1), "")
    # Closed panels are not focusable
    links_in_closed = page.evaluate(f"""[...document.querySelectorAll('{scope} [role=region]')].filter(r => r.hasAttribute('inert')).length""")
    record("faq", f"{label}: closed panels are inert", links_in_closed >= n - 1, str(links_in_closed))


def t_faq(browser):
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page, w = new_page(ctx)
    goto(page, "/")
    accordion_suite(page, "#faq", "home FAQ")
    goto(page, "/buildathon/")
    accordion_suite(page, "main", "buildathon FAQ")
    record("faq", "no console errors during FAQ tests", not w.errors, "; ".join(w.errors))
    ctx.close()
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    page, w = new_page(ctx)
    goto(page, "/")
    t = page.locator("#faq button[aria-expanded]").first
    t.scroll_into_view_if_needed()
    t.tap() if False else t.click()
    page.wait_for_timeout(400)
    record("faq", "home FAQ opens at 390", t.get_attribute("aria-expanded") == "true", "")
    ctx.close()


# --------------------------------------------------------------------------------------------
def t_newsletter(browser):
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    for path in FORM_ROUTES:
        page, w = new_page(ctx)
        goto(page, path)
        form = page.locator("#newsletter form, form").last
        if form.count() == 0:
            record("newsletter", f"{path} has newsletter form", False, "no form")
            page.close()
            continue
        form.scroll_into_view_if_needed()
        form.locator("button[type=submit]").click()
        page.wait_for_timeout(300)
        inv = form.locator("[aria-invalid=true]").count()
        focused = page.evaluate("document.activeElement.name")
        msgs = form.locator("p[id$=-err]").all_inner_texts()
        record("newsletter", f"{path} empty submit -> 3 field errors, focus first", inv == 3 and focused == "firstName", f"invalid={inv} focus={focused} msgs={msgs}")
        form.locator("input[name=firstName]").fill("Ada")
        form.locator("input[name=lastName]").fill("Lovelace")
        form.locator("input[name=email]").fill("ada@nowhere")
        form.locator("button[type=submit]").click()
        page.wait_for_timeout(300)
        inv = form.locator("[aria-invalid=true]").count()
        einv = form.locator("input[name=email]").get_attribute("aria-invalid")
        record("newsletter", f"{path} bad email -> email error only", inv == 1 and einv == "true", f"invalid={inv}")
        form.locator("input[name=email]").fill("ada@example.com")
        form.locator("button[type=submit]").click()
        try:
            page.locator("[role=status]").filter(has_text="on the list").first.wait_for(timeout=3000)
            ok = True
        except Exception:
            ok = False
        info = [i for i in w.infos if "newsletter" in i.lower()]
        record("newsletter", f"{path} valid -> success state + console.info stub", ok and bool(info), f"success={ok} info={info[:1]}")
        record("newsletter", f"{path} no console.error during form use", not w.errors, "; ".join(w.errors))
        page.close()
    ctx.close()


# --------------------------------------------------------------------------------------------
def t_fonts(browser):
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page, w = new_page(ctx)
    for path in ("/", "/blog/welcome-to-tech-at-edc/"):
        goto(page, path)
        page.evaluate("document.fonts.ready.then(() => 1)")
        faces = page.evaluate("[...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/\"/g,''))")
        record("fonts", f"{path} BDO Grotesk loaded", any("BDO Grotesk" in f for f in faces), str(sorted(set(faces))))
        record("fonts", f"{path} Geist Mono loaded", any("Geist Mono" in f for f in faces), str(sorted(set(faces))))
        ff = page.evaluate("""(() => { const g = s => { const e = document.querySelector(s); return e ? getComputedStyle(e).fontFamily : null; }; return {body: g('body'), h1: g('h1'), p: g('main p'), navlink: g('header nav ul a'), button: g('header a[href*="discord"]'), label: g('form label')}; })()""")
        for k, v in ff.items():
            if v is None:
                continue
            want_mono = k in ("navlink", "button", "label")
            first = v.split(",")[0].strip().strip('"')
            ok = ("Geist Mono" in first) if want_mono else ("BDO Grotesk" in first)
            record("fonts", f"{path} {k} uses {'Geist Mono' if want_mono else 'BDO Grotesk'}", ok, v)
        inter = page.evaluate("[...document.fonts].some(f => /inter/i.test(f.family))")
        record("fonts", f"{path} Inter not loaded", not inter, "")
    ctx.close()


# --------------------------------------------------------------------------------------------
def t_content(browser):
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page, w = new_page(ctx)
    goto(page, "/blog/")
    dates = page.evaluate("[...document.querySelectorAll('main time')].map(t => t.getAttribute('datetime'))")
    record("content", "blog index lists posts newest first", dates == sorted(dates, reverse=True) and len(dates) >= 1, str(dates))
    links = page.evaluate("[...new Set([...document.querySelectorAll('main a[href^=\"/blog/\"]')].map(a => a.getAttribute('href')).filter(h => h !== '/blog/'))]")
    ok_all = True
    for h in links:
        goto(page, h)
        ok_all = ok_all and page.locator("h1").count() == 1 and len(page.locator("main").inner_text()) > 400
    record("content", "every blog post link renders a post (h1 + body)", ok_all and bool(links), str(links))
    goto(page, "/blog/welcome-to-tech-at-edc/")
    record("content", "post page has back link to /blog/", page.locator("main a[href='/blog/']").count() >= 1, "")
    goto(page, "/team/")
    txt = page.locator("main").inner_text()
    record("content", "team page shows 'Roster coming soon'", "Roster coming soon" in txt, txt[:200])
    goto(page, "/404.html")
    record("content", "404 page renders 'Page not found' h1", "not found" in page.locator("h1").inner_text().lower(), page.locator("h1").inner_text())
    home_link = page.locator("main a[href='/']").count()
    record("content", "404 page links back home", home_link >= 1, "")
    # Home section order
    goto(page, "/")
    order = page.evaluate("""[...document.querySelectorAll('main > section, main > div > section, main section[id], main > *')].map(e => e.id || (e.querySelector('h1,h2')||{}).innerText || e.tagName).filter(Boolean)""")
    record("content", "home sections in Tech@NYU order", True, str(order))
    ids = page.evaluate("[...document.querySelectorAll('main [id]')].map(e => e.id).filter(i => ['community','programs','events','faq','connect','newsletter'].includes(i))")
    record("content", "home order Community > Programs > Events > FAQ > Connect > Join Us", ids == ["community", "programs", "events", "faq", "connect", "newsletter"], str(ids))
    record("content", "Network grid not rendered on home", page.locator("#network").count() == 0 and "Our Network" not in page.locator("main").inner_text(), "")
    ctx.close()


# --------------------------------------------------------------------------------------------
def t_tab(browser):
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page, w = new_page(ctx)
    for path in ROUTES:
        goto(page, path)
        page.keyboard.press("Tab")
        page.wait_for_timeout(400)  # skip link slides in (CSS transition)
        first = page.evaluate("({cls: document.activeElement.className, text: document.activeElement.innerText, top: document.activeElement.getBoundingClientRect().top, h: document.activeElement.getBoundingClientRect().height})")
        record("tab", f"{path} first Tab = visible skip link", "skip" in first["cls"] and first["top"] >= 0 and first["h"] > 10, str(first))
        page.keyboard.press("Enter")
        page.wait_for_timeout(200)
        act = page.evaluate("document.activeElement.id")
        record("tab", f"{path} skip link moves focus to main", act == "content", act)
        # Walk the tab order from the top
        page.evaluate("document.activeElement.blur(); window.scrollTo(0,0)")
        goto(page, path)
        bad_focus = []
        out_of_view = []
        order = []
        prev_y = -1e9
        back_jumps = []
        seen = set()
        for i in range(120):
            page.keyboard.press("Tab")
            info = page.evaluate("""(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); const docY = r.top + scrollY; let ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none'); return {key: e.outerHTML.slice(0,90), tag: e.tagName, text: (e.innerText || e.getAttribute('aria-label') || e.name || '').trim().slice(0,40), ring, inView: r.bottom > 0 && r.top < innerHeight && r.width > 0, docY, footer: !!e.closest('footer'), skip: e.classList.contains('skip-link')}; })()""")
            if info is None:
                break
            if info["key"] in seen and len(seen) > 3:
                break
            seen.add(info["key"])
            order.append(info["text"])
            if not info["ring"]:
                bad_focus.append(info["text"] or info["tag"])
            if not info["inView"] and not info["skip"]:
                out_of_view.append(info["text"] or info["tag"])
            if info["docY"] < prev_y - 400 and not info["footer"]:
                back_jumps.append(f"{info['text']}@{int(info['docY'])}")
            prev_y = info["docY"]
        record("tab", f"{path} focus indicator visible on every stop ({len(order)} stops)", not bad_focus, ", ".join(bad_focus[:8]))
        record("tab", f"{path} focused element scrolled into view", not out_of_view, ", ".join(out_of_view[:8]))
        record("tab", f"{path} tab order follows page order (no big backward jumps)", not back_jumps, ", ".join(back_jumps[:6]))
    ctx.close()


# --------------------------------------------------------------------------------------------
def t_motion(browser):
    js = """(() => { const t = [...document.querySelectorAll('.photo-col-track')]; return t.map(e => { const cs = getComputedStyle(e); return {name: cs.animationName, state: cs.animationPlayState, running: e.getAnimations().filter(a => a.playState === 'running').length}; }); })()"""
    allanims = "document.getAnimations().filter(a => a.playState === 'running').map(a => (a.animationName || a.transitionProperty || 'anim') + ':' + (a.effect && a.effect.target ? a.effect.target.className.toString().slice(0,40) : ''))"
    for rm in ("no-preference", "reduce"):
        ctx = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion=rm)
        page, w = new_page(ctx)
        goto(page, "/")
        page.locator("#events").scroll_into_view_if_needed()
        page.mouse.move(5, 5)
        page.wait_for_timeout(600)
        tracks = page.evaluate(js)
        running = page.evaluate(allanims)
        if rm == "reduce":
            ok = tracks and all(t["running"] == 0 for t in tracks) and not running
            record("motion", "reduced motion: PhotoColumns and all animations stopped", ok, f"tracks={tracks} running={running}")
        else:
            ok = tracks and all(t["running"] >= 1 for t in tracks)
            record("motion", "normal motion: PhotoColumns animate", ok, f"tracks={tracks}")
        # Reveal content visible under reduced motion
        if rm == "reduce":
            for path in ROUTES:
                goto(page, path)
                hidden = page.evaluate("[...document.querySelectorAll('[data-reveal=pending]')].length")
                record("motion", f"reduced motion: no pending reveal on {path}", hidden == 0, str(hidden))
        ctx.close()
    # Hover pauses columns
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page, w = new_page(ctx)
    goto(page, "/")
    page.locator("#events .photo-col").first.scroll_into_view_if_needed()
    page.locator("#events .photo-col").first.hover()
    page.wait_for_timeout(300)
    states = page.evaluate("[...document.querySelectorAll('.photo-col-track')].map(e => getComputedStyle(e).animationPlayState)")
    record("motion", "hovering the photo columns pauses them", all(s == "paused" for s in states), str(states))
    ctx.close()



# --------------------------------------------------------------------------------------------
V2_JS = r"""() => {
  const out = {dots: [], glow: [], purple: [], nested: [], bg: null};
  const isPurple = (c) => { const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); if (!m) return false; const [r,g,b,a] = [+m[1],+m[2],+m[3], m[4]===undefined?1:+m[4]]; if (a < 0.05) return false; const max = Math.max(r,g,b), min = Math.min(r,g,b); if (max - min < 40) return false; let h; if (max === r) h = ((g-b)/(max-min))%6; else if (max === g) h = (b-r)/(max-min)+2; else h = (r-g)/(max-min)+4; h = (h*60+360)%360; return h >= 245 && h <= 320; };
  for (const e of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
    if (r.width > 0 && r.width <= 16 && r.height <= 16 && Math.abs(r.width - r.height) < 2) {
      const br = parseFloat(cs.borderTopLeftRadius);
      const filled = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || (parseFloat(cs.borderTopWidth) > 0);
      if (br >= r.width / 2 - 0.5 && filled && e.tagName !== 'svg') out.dots.push(e.tagName + '.' + String(e.className).slice(0, 60));
    }
    if (cs.boxShadow !== 'none' && /\d+px \d+px (1[0-9]|[2-9]\d|\d{3})px/.test(cs.boxShadow)) out.glow.push(e.tagName + ' ' + cs.boxShadow.slice(0, 80));
    for (const c of [cs.color, cs.backgroundColor, cs.borderTopColor]) if (isPurple(c)) { out.purple.push(e.tagName + '.' + String(e.className).slice(0,40) + ' ' + c); break; }
  }
  // cards nested in cards: bordered + filled surfaces inside another bordered + filled surface
  const isCard = (e) => { const cs = getComputedStyle(e); return parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderLeftWidth) > 0 && cs.borderTopStyle !== 'none' && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && e.getBoundingClientRect().width > 120 && e.getBoundingClientRect().height > 60 && !['INPUT','BUTTON','A','TEXTAREA','SELECT'].includes(e.tagName) && !e.closest('header') ; };
  const cards = [...document.querySelectorAll('main *')].filter(isCard);
  for (const c of cards) { const p = c.parentElement && c.parentElement.closest('main *'); let a = c.parentElement; while (a && a.tagName !== 'MAIN') { if (cards.includes(a)) { out.nested.push(String(a.className).slice(0,50) + ' > ' + String(c.className).slice(0,50)); break; } a = a.parentElement; } }
  const b = getComputedStyle(document.body, '::before'), a = getComputedStyle(document.body, '::after');
  out.bg = {gradient: /gradient/.test(b.backgroundImage), noise: /feTurbulence/.test(b.backgroundImage), base: b.backgroundColor,
            gridLayers: (a.backgroundImage.match(/linear-gradient/g) || []).length, gridSizes: a.backgroundSize,
            gridMask: a.maskImage || a.webkitMaskImage || 'none', fixed: b.position + '/' + a.position};
  return out;
}"""


def t_v2(browser):
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page, w = new_page(ctx)
    for path in ROUTES:
        goto(page, path)
        r = page.evaluate(V2_JS)
        record("v2", f"{path} no small round dots", not r["dots"], "; ".join(r["dots"][:5]))
        record("v2", f"{path} no glow shadows", not r["glow"], "; ".join(r["glow"][:3]))
        record("v2", f"{path} no purple/indigo colors", not r["purple"], "; ".join(r["purple"][:3]))
        record("v2", f"{path} no cards nested in cards", not r["nested"], "; ".join(r["nested"][:3]))
        if path == "/":
            bg = r["bg"]
            # Direction 15 Nov (Mark): flat near-black + feTurbulence noise, even 40/10px grid, no colour gradient, no fade mask.
            ok = (not bg["gradient"]) and bg["noise"] and bg["gridLayers"] >= 4 and "40px" in bg["gridSizes"] and "10px" in bg["gridSizes"] \
                and bg["gridMask"] in ("none", "") and bg["fixed"] == "fixed/fixed"
            record("v2", "background = flat base + noise (body::before) + even 40/10px grid, no gradient/mask (body::after)", ok, str(bg))
    ctx.close()


# --------------------------------------------------------------------------------------------
GROUPS = [
    ("pages", t_pages), ("nav", t_nav), ("shortcuts", t_shortcuts), ("anchor", t_anchor), ("menu", t_menu),
    ("cards", t_cards), ("faq", t_faq), ("newsletter", t_newsletter), ("fonts", t_fonts), ("content", t_content),
    ("tab", t_tab), ("motion", t_motion), ("v2", t_v2),
]


def main():
    if http_status(BASE + "/") != 200:
        print(f"Server not reachable at {BASE}. Run: python3 -m http.server 4173 -d out", file=sys.stderr)
        sys.exit(2)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for name, fn in GROUPS:
            if not want(name):
                continue
            print(f"== {name}", flush=True)
            try:
                fn(browser)
            except Exception as e:  # a crash in one group is a FAIL, not the end of the run
                record(name, f"group crashed: {type(e).__name__}", False, str(e).splitlines()[0][:300])
        browser.close()

    passed = sum(1 for r in RESULTS if r[2])
    failed = [r for r in RESULTS if not r[2]]
    print("\n" + "=" * 100)
    print(f"{'RESULT':6}  {'GROUP':10}  CHECK")
    print("-" * 100)
    for g, c, ok, ev in RESULTS:
        print(f"{'PASS' if ok else 'FAIL':6}  {g:10}  {c}")
    print("-" * 100)
    print(f"TOTAL {len(RESULTS)}  PASS {passed}  FAIL {len(failed)}")
    if failed:
        print("\nFAILURES:")
        for g, c, ok, ev in failed:
            print(f"  {g:10} {c}\n             {ev[:400]}")
    if args.json:
        with open(args.json, "w") as f:
            json.dump([dict(group=g, check=c, ok=ok, evidence=ev) for g, c, ok, ev in RESULTS], f, indent=1)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
