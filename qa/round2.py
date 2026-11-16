"""Round-2 QA probes: verifies the round-1 bug fixes (B3-B11) and hunts for new issues.

Usage (out/ served on 4173):
  python3 -I qa/round2.py [--base http://localhost:4173]

Prints PASS/FAIL/INFO lines and writes qa/round2-results.json.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

from playwright.sync_api import sync_playwright

sys.path.insert(0, os.path.dirname(__file__))
from qa_config import ROUTES  # noqa: E402

ap = argparse.ArgumentParser()
ap.add_argument("--base", default="http://localhost:4173")
a = ap.parse_args()
BASE = a.base.rstrip("/")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "round2-results.json")
R: list[dict] = []


def rec(bug, check, ok, ev=""):
    R.append({"bug": bug, "check": check, "ok": ok, "evidence": ev})
    tag = {True: "PASS", False: "FAIL", None: "INFO"}[ok]
    print(f"[{tag}] {bug:5} {check}  {ev}", flush=True)


def ctx_page(b, w, h=900):
    ctx = b.new_context(viewport={"width": w, "height": h})
    ctx.route("https://example.com/**", lambda r: r.fulfill(status=200, content_type="text/html", body="stub"))
    pg = ctx.new_page()
    errs = []
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    return ctx, pg, errs


def go(pg, path):
    pg.goto(BASE + path, wait_until="networkidle")
    pg.wait_for_timeout(600)


def box_of(pg, sel):
    return pg.evaluate("""(sel) => { const e = document.querySelector(sel); if (!e) return null;
        const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return {w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y + scrollY),
                display: cs.display, vis: cs.visibility}; }""", sel)


with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])

    # ---------------- B3: hero + community illustrations at all widths
    for w in (1440, 1080, 768, 390, 360):
        ctx, pg, errs = ctx_page(b, w, 900 if w >= 768 else 844)
        go(pg, "/")
        hero = box_of(pg, "section[aria-labelledby=hero-title] svg")
        comm = box_of(pg, "#community svg")
        btn = box_of(pg, "section[aria-labelledby=hero-title] a")
        rec("B3", f"/ @{w}: hero illustration renders", bool(hero and hero["w"] > 200 and hero["h"] > 100), json.dumps(hero))
        rec("B3", f"/ @{w}: community illustration renders", bool(comm and comm["w"] > 150 and comm["display"] != "none"), json.dumps(comm))
        if btn:
            rec("B3", f"/ @{w}: Join Discord bottom inside first viewport", None, f"button bottom={btn['y'] + btn['h']} viewport={pg.viewport_size['height']}")
        ctx.close()

    # ---------------- B4: focus after newsletter success
    ctx, pg, errs = ctx_page(b, 1440)
    go(pg, "/")
    f = pg.locator("#newsletter form")
    f.scroll_into_view_if_needed()
    f.locator("input[name=firstName]").fill("Ada")
    f.locator("input[name=lastName]").fill("Lovelace")
    f.locator("input[name=email]").fill("ada@example.com")
    f.locator("button[type=submit]").click()
    pg.wait_for_timeout(800)
    act = pg.evaluate("""() => { const e = document.activeElement; return {tag: e.tagName, role: e.getAttribute('role'),
        live: e.getAttribute('aria-live'), text: (e.innerText || '').slice(0, 80),
        outline: getComputedStyle(e).outlineStyle + ' ' + getComputedStyle(e).outlineWidth}; }""")
    rec("B4", "focus lands on success message after submit", act["role"] == "status", json.dumps(act))
    ctx.close()

    # ---------------- B5: /blog/ heading outline
    ctx, pg, errs = ctx_page(b, 1440)
    for path in ROUTES:
        go(pg, path)
        hs = pg.evaluate("""() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => [+h.tagName[1], h.innerText.trim().slice(0, 40)])""")
        skips = [f"{hs[i-1][0]}->{hs[i][0]} ({hs[i][1]})" for i in range(1, len(hs)) if hs[i][0] - hs[i - 1][0] > 1]
        bug = "B5" if path == "/blog/" else "new"
        rec(bug, f"{path} heading outline has no skipped levels", not skips and hs and hs[0][0] == 1, "; ".join(skips) or " > ".join(f"h{l}" for l, _ in hs[:8]))
    ctx.close()

    # ---------------- B7: card hover
    ctx, pg, errs = ctx_page(b, 1440)
    go(pg, "/")
    card = pg.locator("#programs li a").first
    card.scroll_into_view_if_needed()
    pg.mouse.move(2, 2)
    pg.wait_for_timeout(300)
    css = "e => { const c = getComputedStyle(e); return {border: c.borderTopColor, bg: c.backgroundColor, shadow: c.boxShadow}; }"
    before = card.evaluate(css)
    card.hover()
    pg.wait_for_timeout(500)
    after = card.evaluate(css)
    rec("B7", "program card hover changes border + background, no shadow",
        before["border"] != after["border"] and before["bg"] != after["bg"] and after["shadow"] in ("none", ""),
        f"before={before} after={after}")
    ctx.close()

    # ---------------- B9: navbar hint vs label colour
    ctx, pg, errs = ctx_page(b, 1440)
    go(pg, "/")
    # Spec since 15 Nov evening (Mark): label + key letter white, brackets grey. "Quieter" = the brackets.
    info = pg.evaluate("""() => { const a = document.querySelector('header nav ul a'); const k = a.querySelector('kbd span') || a.querySelector('kbd');
        const lum = c => { const m = c.match(/[\\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v/12.92 : ((v+.055)/1.055) ** 2.4; };
                           return (0.2126*f(m[0]) + 0.7152*f(m[1]) + 0.0722*f(m[2])) * (m.length > 3 ? m[3] : 1); };
        return {label: getComputedStyle(a).color, hint: k ? getComputedStyle(k).color : null, hintOpacity: k ? getComputedStyle(k).opacity : null,
                labelL: lum(getComputedStyle(a).color), hintL: k ? lum(getComputedStyle(k).color) : null, html: a.innerHTML.slice(0, 300)}; }""")
    rec("B9", "hint brackets quieter than label but visible (letter may match label)", info["hint"] is not None and info["hintL"] < info["labelL"], json.dumps({k: info[k] for k in ("label", "hint", "hintOpacity")}))
    ctx.close()

    # ---------------- B10: arrows. mailto/tel never show the new-tab arrow; any ↗ link opens a new tab
    for w in (1440, 390):
        ctx, pg, errs = ctx_page(b, w, 900 if w > 400 else 844)
        bad_proto, bad_newtab = [], []
        for path in ROUTES:
            go(pg, path)
            if w == 390:
                btn = pg.get_by_role("button", name="Open menu")
                if btn.count():
                    btn.click()
                    pg.wait_for_timeout(300)
            links = pg.evaluate("""() => [...document.querySelectorAll('a')].filter(a => a.offsetParent !== null || a.getClientRects().length)
                .map(a => ({href: a.getAttribute('href'), text: a.innerText.replace(/\\s+/g, ' ').trim(), target: a.target}))""")
            for l in links:
                h = l["href"] or ""
                if h.startswith(("mailto:", "tel:")) and "↗" in l["text"]:
                    bad_proto.append(f"{path} '{l['text']}'")
                if "↗" in l["text"] and l["target"] != "_blank":
                    bad_newtab.append(f"{path} '{l['text']}' -> {h}")
        rec("B10", f"@{w}: no mailto/tel link shows ↗", not bad_proto, "; ".join(sorted(set(bad_proto))))
        rec("B10", f"@{w}: every ↗ link opens a new tab", not bad_newtab, "; ".join(sorted(set(bad_newtab))))
        ctx.close()

    # ---------------- B11: /blog/ ends in Join Us, no Stay in the loop
    ctx, pg, errs = ctx_page(b, 1440)
    go(pg, "/blog/")
    txt = pg.inner_text("main")
    last = pg.evaluate("() => { const m = document.querySelector('main'); const s = [...m.children].filter(e => e.offsetHeight > 0); return s[s.length-1].id || s[s.length-1].outerHTML.slice(0, 120); }")
    subs = pg.locator("main a[href='#newsletter'], main a[href='/#newsletter']").count()
    rec("B11", "/blog/ has no 'Stay in the loop' row and ends with #newsletter",
        "Stay in the loop" not in txt and last == "newsletter" and subs == 0, f"last={last} subscribe-links={subs}")
    ctx.close()

    # ---------------- Lead's 15 Nov evening changes: navbar geometry vs Tech@NYU, hero, favicon, anchor
    NAV_JS = """() => { const R = e => e.getBoundingClientRect();
      const mark = document.querySelector('header [role=img]'); const nav = document.querySelector('header nav');
      const btns = [...document.querySelectorAll('header a, header button')].filter(e => e.getClientRects().length);
      const join = btns.reduce((m, e) => (!m || R(e).right > R(m).right) ? e : m, null);  // rightmost control
      const discord = btns.find(e => /Join Discord/.test(e.innerText)); const contact = btns.find(e => /^Contact$/.test(e.innerText.trim()));
      const link = document.querySelector('header nav ul a'); const kbd = link && link.querySelector('kbd');
      const sp = kbd ? [...kbd.querySelectorAll('span')] : [];
      return {markLeft: mark && R(mark).left, markLabel: mark && mark.getAttribute('aria-label'), navH: R(nav).height,
              joinRight: join && R(join).right, joinH: discord && R(discord).height, contactH: contact && R(contact).height,
              gap: contact && discord ? R(discord).left - R(contact).right : null,
              linkFs: link && getComputedStyle(link).fontSize, linkColor: link && getComputedStyle(link).color,
              bracket: sp[0] && getComputedStyle(sp[0]).color, letter: sp[1] && getComputedStyle(sp[1]).color,
              sw: document.documentElement.scrollWidth}; }"""
    for w, edge, right in ((1440, 24, 1416), (390, 16, 374), (360, 16, 344)):
        ctx, pg, errs = ctx_page(b, w, 900 if w > 400 else 844)
        go(pg, "/team/")
        n = pg.evaluate(NAV_JS)
        rec("nav2", f"@{w}: wordmark left edge = {edge}px (Tech@NYU)", abs(n["markLeft"] - edge) < 1, json.dumps(n))
        rec("nav2", f"@{w}: rightmost navbar control right edge = {right}px", abs(n["joinRight"] - right) < 1, f"{n['joinRight']}")
        rec("nav2", f"@{w}: bar height 68px (Tech@NYU 68 desktop / 72 mobile)", abs(n["navH"] - 68) < 0.5, f"{n['navH']}")
        rec("nav2", f"@{w}: no horizontal overflow", n["sw"] == w, f"scrollWidth={n['sw']}")
        if w == 1440:
            rec("nav2", "Contact + Join Discord 40px tall, 16px apart", n["joinH"] == 40 and n["contactH"] == 40 and abs(n["gap"] - 16) < 0.5, f"h={n['contactH']}/{n['joinH']} gap={n['gap']}")
            rec("nav2", "links 16px white mono; bracket grey, key letter white", n["linkFs"] == "16px" and n["linkColor"] == n["letter"] and n["bracket"] != n["letter"],
                f"fs={n['linkFs']} link={n['linkColor']} bracket={n['bracket']} letter={n['letter']}")
            rec("nav2", "wordmark exposes 'Tech@EDC' to assistive tech", n["markLabel"] == "Tech@EDC", str(n["markLabel"]))
        ctx.close()
    ctx, pg, errs = ctx_page(b, 1440)
    go(pg, "/team/")
    pg.locator("header nav").get_by_role("link", name=re.compile("Programs")).first.click()
    pg.wait_for_timeout(1500)
    top = pg.evaluate("(() => { const s = document.querySelector('#programs').getBoundingClientRect().top; const h = document.querySelector('header').getBoundingClientRect().bottom; return [s, h]; })()")
    rec("nav2", "Programs link from /team/: #programs top lands below the sticky bar", top[0] >= top[1] - 1, f"section top={top[0]:.0f} bar bottom={top[1]:.0f}")
    go(pg, "/")
    hero = pg.evaluate("""() => { const h = document.querySelector('h1'), s = h.nextElementSibling;
        const tw = e => { const r = document.createRange(); r.selectNodeContents(e); return r.getBoundingClientRect().width; };
        return {h1: h.innerText, h1w: tw(h), subw: tw(s), subColor: getComputedStyle(s).color, fg: getComputedStyle(h).color}; }""")
    rec("hero2", "headline 'Power on.' is visibly shorter than the subhead", hero["h1"].strip() == "Power on." and hero["h1w"] < hero["subw"] * 0.6, json.dumps(hero))
    rec("hero2", "subhead is white (text-fg)", hero["subColor"] == hero["fg"], f"{hero['subColor']} vs {hero['fg']}")
    icon = open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "out", "icon.svg")).read()
    rec("hero2", "favicon is the power glyph (arc + stem path)", "A8.4 8.4" in icon and "M12 2.6V11.4" in icon, f"{len(icon)} bytes")
    ctx.close()

    # ---------------- New: metadata per route
    ctx, pg, errs = ctx_page(b, 1440)
    titles = {}
    for path in ROUTES:
        go(pg, path)
        m = pg.evaluate("""() => { const q = s => { const e = document.querySelector(s); return e ? (e.content || e.href || e.getAttribute('href')) : null; };
            return {title: document.title, desc: q('meta[name=description]'), canon: q('link[rel=canonical]'),
                    ogTitle: q('meta[property="og:title"]'), ogDesc: q('meta[property="og:description"]'), ogUrl: q('meta[property="og:url"]'),
                    ogImage: q('meta[property="og:image"]'), twitter: q('meta[name="twitter:card"]'), icon: q('link[rel~=icon]'),
                    robots: q('meta[name=robots]'), lang: document.documentElement.lang}; }""")
        titles[path] = m["title"]
        need = ("title", "desc", "ogTitle", "ogDesc", "icon") + (() if (m["robots"] or "").startswith("noindex") else ("canon",))
        miss = [k for k in need if not m[k]]
        rec("meta", f"{path} title/description/canonical/OG/icon present", not miss, f"missing={miss} {json.dumps(m)}")
    dup = {t for t in titles.values() if list(titles.values()).count(t) > 1}
    rec("meta", "page titles are unique", not dup, f"dups={dup}")
    ctx.close()

    # ---------------- New: in-page anchors resolve; inline styles; console errors on every route at 390
    ctx, pg, errs = ctx_page(b, 1440)
    for path in ROUTES:
        go(pg, path)
        broken = pg.evaluate("""() => [...document.querySelectorAll('a[href*="#"]')].map(a => a.getAttribute('href'))
            .filter(h => h.startsWith('#') && h.length > 1).filter(h => !document.getElementById(decodeURIComponent(h.slice(1))))""")
        rec("anchor", f"{path} in-page #anchors resolve", not broken, f"broken={broken}")
        styled = pg.evaluate("""() => [...document.querySelectorAll('main [style]')].map(e => e.tagName.toLowerCase() + ': ' + e.getAttribute('style').slice(0, 80))""")
        rec("style", f"{path} inline style attributes in <main>", None, f"{len(styled)}: {sorted(set(styled))[:6]}")
    rec("console", "no console errors across routes @1440", not errs, "; ".join(errs[:5]))
    ctx.close()

    b.close()

json.dump(R, open(OUT, "w"), indent=1, ensure_ascii=False)
fails = [r for r in R if r["ok"] is False]
print(f"\n{sum(1 for r in R if r['ok'])} pass, {len(fails)} fail, {sum(1 for r in R if r['ok'] is None)} info")
sys.exit(1 if fails else 0)
