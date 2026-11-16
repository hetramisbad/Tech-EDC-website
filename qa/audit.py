"""Static audits on the build output (out/) and source.

Usage: python3 -I qa/audit.py
  1. Removal audit: forbidden names in rendered text of every out/**/*.html,
     plus the RSC payload strings in out/**/*.txt (text nodes only).
  2. v2 direction audit on rendered HTML (fig labels, fake UI, emoji, dots, glow, purple).
  3. Token audit on app/, lib/, components/ (hex colors, arbitrary Tailwind values, inline colors).
Prints findings; exits 1 if the removal audit has hits.
"""
import glob
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "out")

TERMS = ["NYU", "New York", "Startup Week", "Y Combinator", "Sequoia", "Stripe", "Neo", "Notion",
         "Anthropic", "Figma", "Vercel", "Google", "Z Fellows", "Google Ventures", "Meta", "Adobe",
         "Microsoft", "Databricks", "Mbodi", "Nozomio", "OpenRoll", "Openroll", "Provenance", "Rubric AI"]


def visible_text(doc: str) -> str:
    doc = re.sub(r"<script\b.*?</script>", " ", doc, flags=re.S | re.I)
    doc = re.sub(r"<style\b.*?</style>", " ", doc, flags=re.S | re.I)
    doc = re.sub(r"<!--.*?-->", " ", doc, flags=re.S)
    # keep alt/title/aria-label/placeholder/content-of-meta values: they are user-facing too
    attrs = " ".join(m.group(2) for m in re.finditer(r'\b(alt|title|aria-label|placeholder)="([^"]*)"', doc))
    metas = " ".join(m.group(1) for m in re.finditer(r'<meta[^>]+content="([^"]*)"', doc))
    titles = " ".join(re.findall(r"<title>(.*?)</title>", doc, flags=re.S))
    body = re.sub(r"<[^>]+>", " ", doc)
    return html.unescape(" ".join([body, attrs, metas, titles]))


def word_hits(text: str, term: str):
    # whole-word, case-sensitive for short brand names (avoid "Neo" in "Neon", "Meta" in "Metadata")
    pat = re.compile(r"(?<![A-Za-z])" + re.escape(term) + r"(?![A-Za-z])")
    return [text[max(0, m.start() - 40): m.end() + 40].replace("\n", " ") for m in pat.finditer(text)]


def removal_audit():
    hits = []
    ambiguous = []
    for f in sorted(glob.glob(os.path.join(OUT, "**", "*.html"), recursive=True)):
        t = visible_text(open(f, encoding="utf-8", errors="ignore").read())
        for term in TERMS:
            for ctx in word_hits(t, term):
                hits.append((os.path.relpath(f, ROOT), term, ctx))
        # case-insensitive substrings worth a look
        for term in ("nyu", "neo", "meta", "google"):
            for m in re.finditer(term, t, flags=re.I):
                ctx = t[max(0, m.start() - 25): m.end() + 25].replace("\n", " ")
                if not any(w in ctx for w in TERMS):
                    ambiguous.append((os.path.relpath(f, ROOT), term, ctx.strip()))
    # RSC payloads (.txt): only string literals that look like rendered children
    for f in sorted(glob.glob(os.path.join(OUT, "**", "*.txt"), recursive=True)):
        raw = open(f, encoding="utf-8", errors="ignore").read()
        strings = re.findall(r'"children":"((?:[^"\\]|\\.)*)"', raw)
        strings += re.findall(r'"(?:alt|title|aria-label|content)":"((?:[^"\\]|\\.)*)"', raw)
        t = " ".join(strings)
        for term in TERMS:
            for ctx in word_hits(t, term):
                hits.append((os.path.relpath(f, ROOT), term, ctx))
    return hits, ambiguous


def v2_audit():
    findings = []
    emoji = re.compile("[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F000-\U0001F2FF]")
    for f in sorted(glob.glob(os.path.join(OUT, "**", "*.html"), recursive=True)):
        rel = os.path.relpath(f, ROOT)
        doc = open(f, encoding="utf-8", errors="ignore").read()
        t = visible_text(doc)
        for pat, label in ((r"\bFig\.? ?0", "Fig label"), (r"\bEDC-\d+", "issue ID"), (r"\bdashboard\b", "dashboard"),
                           (r"\bIn progress\b|\bBacklog\b|\bTodo\b", "fake status")):
            for m in re.finditer(pat, t, flags=re.I):
                findings.append((rel, label, t[max(0, m.start() - 30): m.end() + 30].strip()))
        for m in emoji.finditer(t):
            if m.group(0) in "↗→←✓✗":
                continue
            findings.append((rel, "emoji", repr(m.group(0))))
        body = re.sub(r"<script\b.*?</script>", " ", doc, flags=re.S)
        for m in re.finditer(r'class="([^"]*rounded-full[^"]*)"', body):
            findings.append((rel, "rounded-full", m.group(1)[:100]))
        for m in re.finditer(r'class="([^"]*\b(?:animate-pulse|animate-ping|shadow-glow|blur-3xl)\b[^"]*)"', body):
            findings.append((rel, "pulse/glow class", m.group(1)[:100]))
        for m in re.finditer(r"(purple|indigo|violet|fuchsia)-\d{2,3}", body):
            findings.append((rel, "purple/indigo class", m.group(0)))
    # Compiled CSS: glow shadows, purple hex, radial bloom
    for f in glob.glob(os.path.join(OUT, "_next", "static", "**", "*.css"), recursive=True):
        css = open(f, encoding="utf-8", errors="ignore").read()
        for m in re.finditer(r"box-shadow:[^;}]*\b0 0 (?:[1-9]\d+)px[^;}]*", css):
            findings.append((os.path.relpath(f, ROOT), "large blur box-shadow (glow?)", m.group(0)[:120]))
        for m in re.finditer(r"radial-gradient\([^)]*\)", css):
            findings.append((os.path.relpath(f, ROOT), "radial-gradient", m.group(0)[:120]))
    return findings


def token_audit():
    findings = []
    files = [p for d in ("app", "lib", "components") for p in glob.glob(os.path.join(ROOT, d, "**", "*.tsx"), recursive=True)]
    files += [p for d in ("app", "lib", "components") for p in glob.glob(os.path.join(ROOT, d, "**", "*.ts"), recursive=True)]
    for f in sorted(files):
        rel = os.path.relpath(f, ROOT)
        for i, line in enumerate(open(f, encoding="utf-8"), 1):
            s = line.strip()
            if s.startswith("//") or s.startswith("*") or s.startswith("/*"):
                continue
            for m in re.finditer(r"#[0-9a-fA-F]{3,8}\b", line):
                if re.search(r"(href|id)=|`#|\"#[a-z]", line) and not re.search(r"fill=|stroke=|color", line):
                    continue
                findings.append((rel, i, "hex color", m.group(0), s[:140]))
            for m in re.finditer(r"\b(?:[a-z-]+:)*(?:text|bg|border|shadow|from|to|via|fill|stroke|ring|outline|decoration)-\[[^\]]+\]", line):
                findings.append((rel, i, "arbitrary color/size value", m.group(0), s[:140]))
            for m in re.finditer(r"\b(?:[a-z-]+:)*(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|gap|gap-x|gap-y|w|h|max-w|min-h|min-w|max-h|leading|tracking|rounded|size|top|left|right|bottom|inset)-\[[^\]]+\]", line):
                findings.append((rel, i, "arbitrary spacing/size", m.group(0), s[:140]))
            for m in re.finditer(r"style=\{\{[^}]*(?:color|background)[^}]*\}\}", line):
                findings.append((rel, i, "inline style color", m.group(0), s[:140]))
            if re.search(r"https?://(?!www\.w3\.org)", line) and "content/" not in rel:
                findings.append((rel, i, "hard-coded URL", re.search(r"https?://\S+", line).group(0), s[:140]))
    return findings


if __name__ == "__main__":
    hits, amb = removal_audit()
    print(f"== Removal audit: {len(hits)} hit(s) in rendered text")
    for h in hits:
        print("  HIT", *h, sep=" | ")
    print(f"-- ambiguous substrings for review: {len(amb)}")
    for a in sorted(set(amb))[:40]:
        print("  ?", *a, sep=" | ")
    v2 = v2_audit()
    print(f"\n== v2 direction audit: {len(v2)} finding(s)")
    for f in v2:
        print("  ", *f, sep=" | ")
    tok = token_audit()
    print(f"\n== Token audit: {len(tok)} finding(s)")
    for f in tok:
        print("  ", *map(str, f), sep=" | ")
    json.dump({"removal": hits, "ambiguous": sorted(set(amb)), "v2": v2, "tokens": tok},
              open(os.path.join(ROOT, "qa", "audit-results.json"), "w"), indent=1)
    sys.exit(1 if hits else 0)
