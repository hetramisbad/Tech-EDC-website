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
    info = pg.evaluate("""() => { const a = document.querySelector('header nav ul a'); const k = a.querySelector('kbd, [data-kbd], span');
        const lum = c => { const m = c.match(/[\\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v/12.92 : ((v+.055)/1.055) ** 2.4; };
                           return (0.2126*f(m[0]) + 0.7152*f(m[1]) + 0.0722*f(m[2])) * (m.length > 3 ? m[3] : 1); };
        return {label: getComputedStyle(a).color, hint: k ? getComputedStyle(k).color : null, hintOpacity: k ? getComputedStyle(k).opacity : null,
                labelL: lum(getComputedStyle(a).color), hintL: k ? lum(getComputedStyle(k).color) : null, html: a.innerHTML.slice(0, 300)}; }""")
    rec("B9", "hint is quieter than label but visible", info["hint"] is not None and info["hintL"] < info["labelL"], json.dumps({k: info[k] for k in ("label", "hint", "hintOpacity")}))
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
        miss = [k for k in ("title", "desc", "canon", "ogTitle", "ogDesc", "icon") if not m[k]]
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
