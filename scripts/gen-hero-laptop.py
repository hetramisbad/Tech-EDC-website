"""Generate components/illustrations/HeroLaptopShape.tsx (the hero laptop's geometry).

The laptop is drawn front-on from slightly above, like the Tech@NYU hero TV.
The keyboard is a real MacBook (ANSI) layout in key units, laid out flat and
then projected onto the deck trapezoid with a perspective transform, so every
key foreshortens correctly. All keys are blank; the Touch ID key (top right)
carries the Tech@EDC power-button mark.

Run:  python3 scripts/gen-hero-laptop.py   (writes the TSX; no dependencies)
"""

from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "components/illustrations/HeroLaptopShape.tsx"

# ---- Frame (viewBox 0 0 1000 730) -----------------------------------------
VB_W, VB_H = 1000, 760
LID = dict(x0=180, y0=14, x1=820, y1=432, r=20)
DISPLAY = dict(x0=196, y0=30, x1=804, y1=404, r=8)
NOTCH = dict(w=86, h=16, r=7)
HINGE_Y0, HINGE_Y1 = 432, 446
# Deck trapezoid corners: back edge = lid width, front edge wider (closer to viewer).
D_TL, D_TR, D_BR, D_BL = (180, 446), (820, 446), (960, 724), (40, 724)
FRONT_H = 16  # visible front edge of the base

# ---- Homography from the unit square to the deck --------------------------
def solve(a, b):
    """Gaussian elimination for an 8x8 system."""
    n = len(b)
    m = [row[:] + [b[i]] for i, row in enumerate(a)]
    for c in range(n):
        p = max(range(c, n), key=lambda r: abs(m[r][c]))
        m[c], m[p] = m[p], m[c]
        for r in range(n):
            if r != c:
                f = m[r][c] / m[c][c]
                m[r] = [x - f * y for x, y in zip(m[r], m[c])]
    return [m[i][n] / m[i][i] for i in range(n)]

src = [(0, 0), (1, 0), (1, 1), (0, 1)]
dst = [D_TL, D_TR, D_BR, D_BL]
A, B = [], []
for (u, v), (x, y) in zip(src, dst):
    A.append([u, v, 1, 0, 0, 0, -u * x, -v * x]); B.append(x)
    A.append([0, 0, 0, u, v, 1, -u * y, -v * y]); B.append(y)
h = solve(A, B) + [1.0]

def proj(u, v):
    w = h[6] * u + h[7] * v + h[8]
    return ((h[0] * u + h[1] * v + h[2]) / w, (h[3] * u + h[4] * v + h[5]) / w)

def poly(pts):
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)

def quad(u0, v0, u1, v1):
    return poly([proj(u0, v0), proj(u1, v0), proj(u1, v1), proj(u0, v1)])

# ---- Keyboard layout (MacBook ANSI, 14.5u wide, 6 rows) --------------------
ROWS = [
    # function row (full height on current MacBooks); last key is Touch ID
    [1.5] + [1.0] * 12 + ["touchid"],
    [1.0] * 13 + [1.5],                      # ` 1-0 - = delete
    [1.5] + [1.0] * 12 + [1.0],              # tab q-] \
    [1.75] + [1.0] * 11 + [1.75],            # caps a-' return
    [2.25] + [1.0] * 10 + [2.25],            # shift z-/ shift
    [1.0, 1.0, 1.0, 1.25, 5.0, 1.25, 1.0, "arrows"],  # fn ctrl opt cmd space cmd opt arrows
]
KB_U0, KB_U1 = 0.075, 0.925   # keyboard spans 85% of the deck width
KB_V0, KB_V1 = 0.045, 0.575   # and a bit over the back half of its depth
UNIT_U = (KB_U1 - KB_U0) / 14.5
UNIT_V = (KB_V1 - KB_V0) / 6
GAP = 0.17  # gap between keys, in key units
LIFT = 0.06  # keycap top inset (key units), gives the caps a little depth

keys: list[tuple[float, float, float, float]] = []  # (x, y, w, h) in key units
touch: tuple[float, float, float, float] | None = None
# Letter keys called out in white, at their real positions (row, index in row):
# E = 4th key of the tab row, D = 4th of the caps row, C = 4th of the shift row.
LETTERS = {(2, 3): "E", (3, 3): "D", (4, 3): "C"}
letters: list[tuple[str, tuple[float, float, float, float]]] = []
for r, row in enumerate(ROWS):
    x = 0.0
    for idx, k in enumerate(row):
        if (r, idx) in LETTERS:
            letters.append((LETTERS[(r, idx)], (x, r, float(k), 1.0))); x += float(k)
            continue
        if k == "touchid":
            touch = (x, r, 1.0, 1.0); x += 1.0
        elif k == "arrows":
            keys.append((x, r + 0.5, 1.0, 0.5))          # left
            keys.append((x + 1, r, 1.0, 0.5))            # up
            keys.append((x + 1, r + 0.5, 1.0, 0.5))      # down
            keys.append((x + 2, r + 0.5, 1.0, 0.5))      # right
            x += 3.0
        else:
            keys.append((x, r, float(k), 1.0)); x += float(k)
    assert abs(x - 14.5) < 1e-9, (r, x)

def key_uv(x, y):
    return KB_U0 + x * UNIT_U, KB_V0 + y * UNIT_V

def key_polys(x, y, w, hgt):
    g = GAP / 2
    gy = g if hgt == 1.0 else g * 0.5
    base = quad(*key_uv(x + g, y + gy), *key_uv(x + w - g, y + hgt - gy))
    t = LIFT
    top = quad(*key_uv(x + g + t, y + gy + t * 0.4), *key_uv(x + w - g - t, y + hgt - gy - t * 1.4))
    return base, top

key_shapes = [key_polys(*k) for k in keys]
touch_base, touch_top = key_polys(*touch)

def letter_key(label, k):
    x, y, w, hgt = k
    base, top = key_polys(x, y, w, hgt)
    g, t = GAP / 2, LIFT
    # Affine frame of the key's top face (unit square -> projected face), for the label.
    p0 = proj(*key_uv(x + g + t, y + g + t * 0.4))
    p1 = proj(*key_uv(x + w - g - t, y + g + t * 0.4))
    p3 = proj(*key_uv(x + g + t, y + hgt - g - t * 1.4))
    m = (p1[0] - p0[0], p1[1] - p0[1], p3[0] - p0[0], p3[1] - p0[1], p0[0], p0[1])
    return label, base, top, "matrix(" + " ".join(f"{v:.3f}" for v in m) + ")"

letter_shapes = [letter_key(l, k) for l, k in letters]

# Power-button mark on the Touch ID key (same geometry as components/Logo.tsx PowerAt):
# ring of radius 8.4 around (12,12) opening at the top, plus a vertical stem; in a
# 24-unit box mapped onto the key's inner square.
tx, ty, _, _ = touch
def mark_pt(px, py):
    s = 0.52 / 24  # mark spans ~52% of the key
    cx, cy = tx + 0.5, ty + 0.47
    return proj(*key_uv(cx + (px - 12) * s, cy + (py - 12) * s))

a0, a1 = math.atan2(6.2 - 12, 16.6 - 12), math.atan2(6.2 - 12, 7.4 - 12)
ring = []
steps = 48
span = (a1 - a0) % (2 * math.pi)
for i in range(steps + 1):
    a = a0 + span * i / steps
    ring.append(mark_pt(12 + 8.4 * math.cos(a), 12 + 8.4 * math.sin(a)))
ring_d = "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in ring)
stem_a, stem_b = mark_pt(12, 2.6), mark_pt(12, 11.4)
stem_d = f"M{stem_a[0]:.2f},{stem_a[1]:.2f} L{stem_b[0]:.2f},{stem_b[1]:.2f}"

# ---- Trackpad ----------------------------------------------------------------
TP = quad(0.29, 0.625, 0.71, 0.965)

# ---- Base outline (deck top + front edge with the thumb scoop) -------------
deck = poly([D_TL, D_TR, D_BR, D_BL])
fx0, fx1, fy = D_BL[0], D_BR[0], D_BL[1]
scoop_w = 120
front = (
    f"M{fx0},{fy} L{fx1},{fy} "
    f"Q{fx1},{fy + FRONT_H} {fx1 - 18},{fy + FRONT_H} "
    f"L{fx0 + 18},{fy + FRONT_H} Q{fx0},{fy + FRONT_H} {fx0},{fy} Z"
)
cx = (fx0 + fx1) / 2
scoop = f"M{cx - scoop_w / 2},{fy} Q{cx},{fy + 12} {cx + scoop_w / 2},{fy}"

def rrect(d):
    return f'x="{d["x0"]}" y="{d["y0"]}" width="{d["x1"] - d["x0"]}" height="{d["y1"] - d["y0"]}" rx="{d["r"]}"'

nx0 = (DISPLAY["x0"] + DISPLAY["x1"]) / 2 - NOTCH["w"] / 2
notch = (
    f"M{nx0},{DISPLAY['y0']} L{nx0 + NOTCH['w']},{DISPLAY['y0']} "
    f"L{nx0 + NOTCH['w']},{DISPLAY['y0'] + NOTCH['h'] - NOTCH['r']} "
    f"Q{nx0 + NOTCH['w']},{DISPLAY['y0'] + NOTCH['h']} {nx0 + NOTCH['w'] - NOTCH['r']},{DISPLAY['y0'] + NOTCH['h']} "
    f"L{nx0 + NOTCH['r']},{DISPLAY['y0'] + NOTCH['h']} "
    f"Q{nx0},{DISPLAY['y0'] + NOTCH['h']} {nx0},{DISPLAY['y0'] + NOTCH['h'] - NOTCH['r']} Z"
)

letters_ts = ",\n".join(f'  {{ label: "{l}", base: "{b}", top: "{t}", transform: "{m}" }}' for l, b, t, m in letter_shapes)
keys_ts = ",\n".join(f'  ["{b}", "{t}"]' for b, t in key_shapes)

def obj(d):
    return "{ " + ", ".join(f"{k}: {v}" for k, v in d.items()) + " }"

lid = dict(x=LID["x0"], y=LID["y0"], width=LID["x1"] - LID["x0"], height=LID["y1"] - LID["y0"], rx=LID["r"])
disp = dict(x=DISPLAY["x0"], y=DISPLAY["y0"], width=DISPLAY["x1"] - DISPLAY["x0"], height=DISPLAY["y1"] - DISPLAY["y0"], rx=DISPLAY["r"])
hinge = dict(x=LID["x0"] + 6, y=HINGE_Y0, width=LID["x1"] - LID["x0"] - 12, height=HINGE_Y1 - HINGE_Y0)

OUT.write_text(f'''// GENERATED by scripts/gen-hero-laptop.py. Do not edit by hand; edit the script and re-run it.
// Geometry for the hero laptop (viewBox 0 0 {VB_W} {VB_H}): a MacBook-style laptop seen
// front-on from slightly above, with a projected ANSI MacBook keyboard (blank keys,
// full F row, Touch ID key carrying the power-button mark).

export const VIEWBOX = "0 0 {VB_W} {VB_H}";
export const LID = {obj(lid)};
export const DISPLAY = {obj(disp)};
export const HINGE = {obj(hinge)};
export const DECK = "{deck}";
export const FRONT = "{front}";
export const SCOOP = "{scoop}";
export const TRACKPAD = "{TP}";

/** Blank keycaps: [base polygon, top-face polygon]. */
export const KEYS: [string, string][] = [
{keys_ts},
];

/** Highlighted letter keys (E, D, C): label, base, top face, and an affine transform
 *  that maps a 0..1 unit square onto the key's top face (for drawing the letter). */
export const LETTER_KEYS: {{ label: string; base: string; top: string; transform: string }}[] = [
{letters_ts},
];

export const TOUCH_ID = {{ base: "{touch_base}", top: "{touch_top}", ring: "{ring_d}", stem: "{stem_d}" }};
''')
print(f"wrote {OUT} ({len(keys)} keys + Touch ID)")
