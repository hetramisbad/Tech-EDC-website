"""Screenshot helper for agents.

Usage:
  python3 -I qa/shoot.py /team/ team-1440 --width 1440 --full
  python3 -I qa/shoot.py / home-390 --width 390 --full --base http://localhost:4173

Saves to qa/screenshots/<name>.png and prints console errors seen on the page.
"""
import argparse
import os
import sys

from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument("path")
ap.add_argument("name")
ap.add_argument("--width", type=int, default=1440)
ap.add_argument("--height", type=int, default=900)
ap.add_argument("--full", action="store_true")
ap.add_argument("--base", default="http://localhost:4173")
ap.add_argument("--wait", type=int, default=600, help="ms to wait after load")
a = ap.parse_args()

out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, f"{a.name}.png")

errors = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
    pg = b.new_page(viewport={"width": a.width, "height": a.height})
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.goto(a.base.rstrip("/") + a.path, wait_until="networkidle")
    # Trigger scroll-reveal animations so full-page shots are not blank.
    pg.evaluate("""async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({top: y, behavior: 'instant'}); await new Promise(r => setTimeout(r, 40)); }
      window.scrollTo({top: 0, behavior: 'instant'});
    }""")
    pg.wait_for_timeout(a.wait)
    pg.screenshot(path=out, full_page=a.full)
    b.close()

print(out)
if errors:
    print("CONSOLE ERRORS:", *errors, sep="\n  ", file=sys.stderr)
