"""Screenshot helper for agents.

Usage:
  python3 -I qa/shoot.py /team/ team-1440 --width 1440 --full
  python3 -I qa/shoot.py / home-390 --width 390 --full --base http://localhost:4173
  python3 -I qa/shoot.py / home-calm --reduced-motion       # freeze PhotoColumns

Saves to qa/screenshots/<name>.png and prints console errors seen on the page.

What it does before capturing (fixes blank full-page shots):
  1. waits for `networkidle`, then ~1s for React hydration;
  2. scrolls instantly through the whole page in viewport steps so every
     <Reveal> / lazy image fires, then waits for reveal transitions to finish;
  3. force-shows anything still marked data-reveal="pending";
  4. waits for `document.fonts.ready` and all <img> to decode;
  5. for --full: pins the fixed background layers (body::before/::after)
     to the full document height, so the gradient, noise and square grid
     draw behind the whole page, not just the first viewport.
"""
import argparse
import os
import sys

from playwright.sync_api import sync_playwright

PREP_JS = """async (full) => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const H = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  const step = Math.max(200, Math.floor(innerHeight * 0.6));
  for (let y = 0; y <= H(); y += step) { window.scrollTo({ top: y, behavior: 'instant' }); await sleep(60); }
  window.scrollTo({ top: H(), behavior: 'instant' }); await sleep(120);
  window.scrollTo({ top: 0, behavior: 'instant' });
  await sleep(700);  // reveal transitions
  document.querySelectorAll('[data-reveal="pending"]').forEach(e => { e.dataset.reveal = 'shown'; });
  await document.fonts.ready;
  await Promise.all([...document.images].map(i => i.decode ? i.decode().catch(() => {}) : null));
  if (full) {
    const s = document.createElement('style');
    s.id = 'qa-full-bg';
    s.textContent = `body::before, body::after { position: absolute !important; height: ${H()}px !important; bottom: auto !important; }
                     body::after { mask-image: none !important; }
                     body { position: relative; }`;
    document.head.appendChild(s);
  }
}"""


def shoot(page, out, full):
    page.evaluate(PREP_JS, full)
    page.wait_for_timeout(250)
    page.screenshot(path=out, full_page=full)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("name")
    ap.add_argument("--width", type=int, default=1440)
    ap.add_argument("--height", type=int, default=900)
    ap.add_argument("--full", action="store_true")
    ap.add_argument("--reduced-motion", action="store_true")
    ap.add_argument("--base", default="http://localhost:4173")
    ap.add_argument("--wait", type=int, default=1000, help="ms to wait after networkidle (hydration)")
    a = ap.parse_args()

    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, f"{a.name}.png")

    errors = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = b.new_context(viewport={"width": a.width, "height": a.height},
                            reduced_motion="reduce" if a.reduced_motion else "no-preference")
        pg = ctx.new_page()
        pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errors.append(str(e)))
        pg.goto(a.base.rstrip("/") + a.path, wait_until="networkidle")
        pg.wait_for_timeout(a.wait)
        shoot(pg, out, a.full)
        b.close()

    print(out)
    if errors:
        print("CONSOLE ERRORS:", *errors, sep="\n  ", file=sys.stderr)


if __name__ == "__main__":
    main()
