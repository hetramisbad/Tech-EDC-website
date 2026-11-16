import { useId } from "react";
import { Box, Frustum, IsoSvg, IsoText, makeFx, path, tone, type IllustrationProps, type V3 } from "./iso";

/** Coiled cable between two points: a helix around a sagging centre line, as a smooth 3D polyline. */
function coil(a: V3, b: V3, turns: number, r: number, sag: number) {
  const n = turns * 18;
  const pts: V3[] = [];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  // unit side vector in the desk plane, perpendicular to the cable
  const sx = -dy / len;
  const sy = dx / len;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // straight lead-in/out at both ends
    const k = Math.min(1, Math.min(t, 1 - t) / 0.12);
    const cx = a[0] + dx * t;
    const cy = a[1] + dy * t;
    const cz = a[2] + (b[2] - a[2]) * t - sag * Math.sin(Math.PI * t);
    const ang = 2 * Math.PI * turns * t;
    pts.push([cx + sx * Math.cos(ang) * r * k, cy + sy * Math.cos(ang) * r * k, cz + Math.sin(ang) * r * k]);
  }
  return path([["M", pts[0]], ...pts.slice(1).map((p) => ["L", p] as const)]);
}

/** One key on a small pad: housing, then a keycap with a legend. */
function Key({ at, legend, light, fx }: { at: V3; legend: string; light?: boolean; fx: ReturnType<typeof makeFx> }) {
  const [x, y, z] = at;
  return (
    <g>
      <Box at={[x, y, z]} size={[84, 84, 12]} leftFx={fx.dither} rightFx={fx.hatch} />
      <Box at={[x + 14, y + 14, z + 12]} size={[56, 56, 4]} top={tone.right} />
      <Frustum
        at={[x + 12, y + 12, z + 16]}
        size={[60, 60, 24]}
        inset={8}
        lean={3}
        top={light ? tone.light : tone.top}
        leftFx={light ? fx.dither : undefined}
        rightFx={fx.hatch}
      />
      <IsoText at={[x + 39, y + 39, z + 40]} plane="top" size={20} weight={600} anchor="middle" fill={light ? tone.ink : "currentColor"}>
        {legend}
      </IsoText>
    </g>
  );
}

/** Two keys joined by a coiled cable: one asks, one answers. For Mentorship. */
export function IsoMentorship({ className, title }: IllustrationProps) {
  const fx = makeFx(useId());
  const cable = coil([84, 44, 5], [196, 20, 5], 7, 5, -2);
  return (
    <IsoSvg viewBox="-92 -66 348 240" className={className} title={title} fx={fx}>
      <Key at={[0, 0, 0]} legend="?" fx={fx} />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={cable} stroke="currentColor" strokeWidth={3.6} />
        <path d={cable} stroke={tone.left} strokeWidth={1.4} />
      </g>
      <Key at={[170, -24, 0]} legend="!" light fx={fx} />
    </IsoSvg>
  );
}
