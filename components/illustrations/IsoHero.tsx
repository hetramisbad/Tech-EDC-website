import { useId } from "react";
import {
  Box,
  Cable,
  Cylinder,
  Face,
  Frustum,
  IsoSvg,
  IsoText,
  P,
  line,
  makeFx,
  path,
  pts,
  thin,
  tone,
  type IllustrationProps,
  type V3,
} from "./iso";

type Fx = ReturnType<typeof makeFx>;

const MAT_W = 440;
const MAT_D = 320;
const Z = 8; // top of the cutting mat

/** Loose keycap lying on the mat. */
function Keycap({ x, y, legend, light, fx }: { x: number; y: number; legend: string; light?: boolean; fx: Fx }) {
  const s = 38;
  return (
    <g>
      <Frustum
        at={[x, y, Z]}
        size={[s, s, 16]}
        inset={5}
        lean={2}
        top={light ? tone.light : tone.top}
        leftFx={fx.dither}
        rightFx={fx.hatch}
      />
      <IsoText at={[x + s / 2 - 2, y + s / 2 - 2, Z + 16]} plane="top" size={13} weight={600} anchor="middle" fill={light ? tone.ink : "currentColor"}>
        {legend}
      </IsoText>
    </g>
  );
}

/** Coffee mug: cylinder, dark coffee surface, handle on the +x side. */
function Mug({ x, y, fx }: { x: number; y: number; fx: Fx }) {
  const r = 22;
  const h = 50;
  const [cx, cy] = P(x, y, Z + h - 4);
  const rx = (r - 3) * Math.SQRT2 * Math.cos(Math.PI / 6);
  const ry = (r - 3) * Math.SQRT2 * 0.5;
  const handle = path([
    ["M", [x + r - 2, y, Z + h - 12]],
    ["C", [x + r + 20, y, Z + h - 12], [x + r + 20, y, Z + 12], [x + r - 2, y, Z + 12]],
  ]);
  return (
    <g>
      <Cylinder x={x} y={y} z0={Z} z1={Z + h} r={r} sideFx={fx.hatch} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={tone.right} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...thin} />
      <Cable d={handle} width={7} core={tone.left} />
      {/* steam */}
      <path d={path([["M", [x - 4, y, Z + h + 10]], ["C", [x - 12, y, Z + h + 22], [x + 4, y, Z + h + 30], [x - 4, y, Z + h + 44]]])} {...thin} opacity={0.55} />
      <path d={path([["M", [x + 8, y, Z + h + 8]], ["C", [x, y, Z + h + 18], [x + 14, y, Z + h + 26], [x + 6, y, Z + h + 38]]])} {...thin} opacity={0.4} />
    </g>
  );
}

/**
 * Club workbench: a laptop flashing a small single-board computer that is
 * wired to a breadboard, loose keycaps and a coffee mug, on a gridded
 * cutting mat. The home hero centerpiece.
 */
export function IsoHero({ className, title }: IllustrationProps) {
  const fx = makeFx(useId());

  // Cutting-mat grid lines (every 40 units, inside a 12-unit margin)
  const matLines: string[] = [];
  for (let x = 52; x < MAT_W - 12; x += 40) matLines.push(path([["M", [x, 12, Z]], ["L", [x, MAT_D - 12, Z]]]));
  for (let y = 52; y < MAT_D - 12; y += 40) matLines.push(path([["M", [12, y, Z]], ["L", [MAT_W - 12, y, Z]]]));

  // Laptop keyboard: 10 x 4 keys
  const lx = 34;
  const ly = 34;
  const keys: V3[][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 10; c++) {
      const x = lx + 14 + c * 12.4;
      const y = ly + 12 + r * 11;
      keys.push([[x, y, Z + 7], [x + 10, y, Z + 7], [x + 10, y + 8.6, Z + 7], [x, y + 8.6, Z + 7]]);
    }
  }

  // Single-board computer
  const sx = 232;
  const sy = 40;
  const sz = Z + 6; // board top

  // Breadboard
  const bx = 258;
  const by = 172;
  const bz = Z + 8;

  return (
    <IsoSvg viewBox="-292 -112 688 508" className={className} title={title} fx={fx}>
      {/* Cutting mat */}
      <Box at={[0, 0, 0]} size={[MAT_W, MAT_D, Z]} leftFx={fx.dither} rightFx={fx.hatch} />
      <polygon points={pts([[12, 12, Z], [MAT_W - 12, 12, Z], [MAT_W - 12, MAT_D - 12, Z], [12, MAT_D - 12, Z]])} {...thin} opacity={0.6} />
      {matLines.map((d, i) => (
        <path key={i} d={d} {...thin} opacity={0.22} />
      ))}

      {/* Laptop screen */}
      <Box at={[lx, ly - 6, Z + 7]} size={[150, 6, 104]} rightFx={fx.hatch} />
      <Face p={[[lx + 9, ly, Z + 16], [lx + 141, ly, Z + 16], [lx + 141, ly, Z + 103], [lx + 9, ly, Z + 103]]} fill={tone.right} />
      <IsoText at={[lx + 18, ly, Z + 92]} plane="left" size={8}>~/buildathon</IsoText>
      <IsoText at={[lx + 18, ly, Z + 80]} plane="left" size={8}>$ make flash</IsoText>
      <IsoText at={[lx + 18, ly, Z + 68]} plane="left" size={8} fill="var(--text-subtle)">board online</IsoText>
      <IsoText at={[lx + 18, ly, Z + 56]} plane="left" size={8}>$</IsoText>
      <Face p={[[lx + 27, ly, Z + 59.5], [lx + 32, ly, Z + 59.5], [lx + 32, ly, Z + 52.5], [lx + 27, ly, Z + 52.5]]} fill="currentColor" stroke={false} />
      {/* Laptop base */}
      <Box at={[lx, ly, Z]} size={[150, 104, 7]} leftFx={fx.dither} rightFx={fx.hatch} />
      {keys.map((k, i) => (
        <polygon key={i} points={pts(k)} {...thin} fill={tone.left} />
      ))}
      <polygon points={pts([[lx + 50, ly + 62, Z + 7], [lx + 100, ly + 62, Z + 7], [lx + 100, ly + 94, Z + 7], [lx + 50, ly + 94, Z + 7]])} {...thin} />

      {/* Single-board computer */}
      <Box at={[sx, sy, Z]} size={[104, 72, 6]} leftFx={fx.dither} rightFx={fx.hatch} />
      {/* SoC and memory toward the back */}
      <Box at={[sx + 14, sy + 10, sz]} size={[28, 28, 4]} top={tone.light} rightFx={fx.hatch} />
      <path d={path([["M", [sx + 19, sy + 16, sz + 4]], ["L", [sx + 29, sy + 16, sz + 4]]])} {...line} stroke={tone.ink} />
      <Box at={[sx + 52, sy + 12, sz]} size={[16, 24, 3]} rightFx={fx.hatch} />
      {/* traces */}
      <polyline points={pts([[sx + 42, sy + 24, sz], [sx + 52, sy + 24, sz]])} {...thin} />
      <polyline points={pts([[sx + 28, sy + 38, sz], [sx + 28, sy + 48, sz], [sx + 66, sy + 48, sz]])} {...thin} />
      {/* GPIO header along the front-right edge */}
      <Box at={[sx + 38, sy + 58, sz]} size={[50, 8, 6]} rightFx={fx.hatch} />
      <path d={path([["M", [sx + 41, sy + 62, sz + 6]], ["L", [sx + 86, sy + 62, sz + 6]]])} {...thin} strokeDasharray="1.6 2.2" />
      {/* ports on the +x edge */}
      <Box at={[sx + 92, sy + 18, sz]} size={[16, 16, 11]} rightFx={fx.hatch} />
      <Box at={[sx + 92, sy + 42, sz]} size={[16, 16, 11]} rightFx={fx.hatch} />
      <Face p={[[sx + 108, sy + 21, sz + 3], [sx + 108, sy + 31, sz + 3], [sx + 108, sy + 31, sz + 8], [sx + 108, sy + 21, sz + 8]]} fill={tone.left} />
      <Face p={[[sx + 108, sy + 45, sz + 3], [sx + 108, sy + 55, sz + 3], [sx + 108, sy + 55, sz + 8], [sx + 108, sy + 45, sz + 8]]} fill={tone.left} />

      {/* Laptop -> SBC (USB), lying on the mat, into a plug on the SBC's front edge */}
      <Cable d={path([["M", [lx + 150, ly + 70, Z + 3]], ["C", [lx + 184, ly + 70, Z + 2], [214, 146, Z + 2], [250, 136, Z + 2]], ["L", [250, 120, Z + 3]]])} />
      <Box at={[243, sy + 72, Z]} size={[14, 8, 6]} rightFx={fx.hatch} />

      {/* Loose keycaps, drawn before the breadboard, which sits in front of them */}
      <Keycap x={114} y={200} legend="E" fx={fx} />
      <Keycap x={164} y={210} legend="D" light fx={fx} />
      <Keycap x={212} y={198} legend="C" fx={fx} />

      {/* Breadboard */}
      <Box at={[bx, by, Z]} size={[148, 84, 8]} leftFx={fx.dither} rightFx={fx.hatch} />
      {[by + 10, by + 17, by + 24, by + 31, by + 53, by + 60, by + 67, by + 74].map((y) => (
        <path key={y} d={path([["M", [bx + 10, y, bz]], ["L", [bx + 138, y, bz]]])} {...thin} strokeDasharray="1.4 3.2" />
      ))}
      <path d={path([["M", [bx, by + 42, bz]], ["L", [bx + 148, by + 42, bz]]])} {...thin} />
      {/* chip across the channel */}
      <Box at={[bx + 64, by + 30, bz]} size={[40, 24, 6]} top={tone.light} rightFx={fx.hatch} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={path([["M", [bx + 69 + i * 7.5, by + 54, bz + 4]], ["L", [bx + 69 + i * 7.5, by + 56, bz]]])} {...line} />
      ))}
      <path d={path([["M", [bx + 70, by + 36, bz + 6]], ["L", [bx + 80, by + 36, bz + 6]]])} {...line} stroke={tone.ink} />
      {/* a small upright component */}
      <Cylinder x={bx + 26} y={by + 64} z0={bz} z1={bz + 14} r={5} sideFx={fx.hatch} />

      {/* Jumper wires: GPIO header -> breadboard */}
      <Cable d={path([["M", [sx + 44, sy + 62, sz + 6]], ["C", [sx + 44, sy + 62, sz + 38], [bx + 16, by + 14, bz + 34], [bx + 16, by + 14, bz]]])} width={3.6} />
      <Cable d={path([["M", [sx + 62, sy + 62, sz + 6]], ["C", [sx + 62, sy + 62, sz + 46], [bx + 48, by + 24, bz + 40], [bx + 48, by + 24, bz]]])} width={3.6} />
      <Cable d={path([["M", [sx + 80, sy + 62, sz + 6]], ["C", [sx + 80, sy + 62, sz + 54], [bx + 122, by + 17, bz + 46], [bx + 122, by + 17, bz]]])} width={3.6} />


      {/* Mug, front-left */}
      <Mug x={54} y={196} fx={fx} />
    </IsoSvg>
  );
}
