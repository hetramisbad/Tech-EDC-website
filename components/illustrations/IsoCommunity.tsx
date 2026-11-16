import { useId } from "react";
import { Box, Cylinder, Face, IsoSvg, line, makeFx, path, pts, thin, tone, type IllustrationProps, type V3 } from "./iso";

type Fx = ReturnType<typeof makeFx>;

const TW = 240; // table length (x)
const TD = 110; // table depth (y)
const TZ = 66; // table top height

/** Round stool: foot, post, seat. */
function Stool({ x, y, fx }: { x: number; y: number; fx: Fx }) {
  return (
    <g>
      <Cylinder x={x} y={y} z0={0} z1={3} r={11} />
      <Cylinder x={x} y={y} z0={3} z1={40} r={2.6} />
      <Cylinder x={x} y={y} z0={40} z1={47} r={16} sideFx={fx.hatch} />
    </g>
  );
}

/** Circle in a vertical plane y = const (a speaker cone), as a projected polygon. */
function circleOnLeftFace(cx: number, y: number, cz: number, r: number) {
  const out: V3[] = [];
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    out.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]);
  }
  return pts(out);
}

/**
 * A shared workbench with stools around it, a whiteboard on a stand behind,
 * and the club's projects on the table: a small robot kit, an open
 * sketchbook, a speaker. For the Community section.
 */
export function IsoCommunity({ className, title }: IllustrationProps) {
  const fx = makeFx(useId());

  // Whiteboard: board whose front face is the plane y = wy, on two posts.
  const wy = -72;
  const wx0 = 24;
  const wx1 = 186;
  const wz0 = 88;
  const wz1 = 142;
  const ink = { ...thin, stroke: tone.ink };

  const legs: [number, number][] = [
    [6, 6],
    [TW - 12, 6],
    [6, TD - 12],
    [TW - 12, TD - 12],
  ];

  return (
    <IsoSvg viewBox="-130 -172 392 366" className={className} title={title} fx={fx}>
      {/* Whiteboard on a stand, behind everything */}
      {[wx0 + 6, wx1 - 10].map((x) => (
        <g key={x}>
          <Box at={[x - 2, wy - 22, 0]} size={[8, 40, 4]} rightFx={fx.hatch} />
          <Box at={[x, wy - 4, 4]} size={[4, 4, wz1 - 4]} />
        </g>
      ))}
      <Box at={[wx0, wy - 4, wz0]} size={[wx1 - wx0, 4, wz1 - wz0]} left={tone.light} rightFx={fx.hatch} />
      <Box at={[wx0 + 10, wy, wz0 - 4]} size={[wx1 - wx0 - 20, 6, 4]} />
      {/* a small plan sketched on the board: three boxes, two arrows, a wave, a cross */}
      {[wx0 + 14, wx0 + 62, wx0 + 110].map((x) => (
        <polygon key={x} points={pts([[x, wy, 134], [x + 28, wy, 134], [x + 28, wy, 118], [x, wy, 118]])} {...ink} />
      ))}
      {[wx0 + 42, wx0 + 90].map((x) => (
        <g key={x}>
          <path d={path([["M", [x, wy, 126]], ["L", [x + 20, wy, 126]]])} {...ink} />
          <path d={path([["M", [x + 15, wy, 129]], ["L", [x + 20, wy, 126]], ["L", [x + 15, wy, 123]]])} {...ink} />
        </g>
      ))}
      <path d={path([["M", [wx0 + 16, wy, 104]], ["C", [wx0 + 32, wy, 112], [wx0 + 48, wy, 94], [wx0 + 70, wy, 102]], ["C", [wx0 + 86, wy, 108], [wx0 + 98, wy, 96], [wx0 + 112, wy, 100]]])} {...ink} />
      <path d={path([["M", [wx0 + 124, wy, 108]], ["L", [wx0 + 140, wy, 96]], ["M", [wx0 + 124, wy, 96]], ["L", [wx0 + 140, wy, 108]]])} {...ink} />

      {/* Stools behind and at the left end (before the table) */}
      <Stool x={62} y={-30} fx={fx} />
      <Stool x={176} y={-30} fx={fx} />
      <Stool x={-32} y={56} fx={fx} />

      {/* Table: legs, then top */}
      {legs.map(([x, y]) => (
        <Box key={`${x}-${y}`} at={[x, y, 0]} size={[6, 6, TZ - 6]} rightFx={fx.hatch} />
      ))}
      <Box at={[0, 0, TZ - 6]} size={[TW, TD, 6]} leftFx={fx.dither} rightFx={fx.hatch} />

      {/* Robot kit: treads, chassis, head, antenna */}
      <Box at={[26, 18, TZ]} size={[52, 8, 10]} rightFx={fx.hatch} />
      <Box at={[32, 26, TZ + 2]} size={[40, 26, 12]} leftFx={fx.dither} rightFx={fx.hatch} />
      <Box at={[26, 52, TZ]} size={[52, 8, 10]} rightFx={fx.hatch} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={path([["M", [30 + i * 10, 60, TZ + 2]], ["L", [30 + i * 10, 60, TZ + 8]]])} {...thin} />
      ))}
      <Box at={[42, 30, TZ + 14]} size={[22, 18, 14]} top={tone.light} leftFx={fx.dither} rightFx={fx.hatch} />
      <Face p={[[46, 48, TZ + 24], [60, 48, TZ + 24], [60, 48, TZ + 19], [46, 48, TZ + 19]]} fill={tone.right} />
      <Cylinder x={58} y={36} z0={TZ + 28} z1={TZ + 46} r={1.2} />
      <Box at={[55.5, 33.5, TZ + 46]} size={[5, 5, 5]} top={tone.light} />

      {/* Open sketchbook and a pencil */}
      <Box at={[98, 30, TZ]} size={[44, 58, 3]} top={tone.light} />
      <Box at={[142, 30, TZ]} size={[44, 58, 3]} top={tone.light} />
      <path d={path([["M", [142, 30, TZ + 3]], ["L", [142, 88, TZ + 3]]])} {...line} stroke={tone.ink} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={path([["M", [104, 40 + i * 8, TZ + 3]], ["L", [136, 40 + i * 8, TZ + 3]]])} {...ink} opacity={0.55} />
      ))}
      <polygon points={pts([[150, 44, TZ + 3], [176, 44, TZ + 3], [176, 62, TZ + 3], [150, 62, TZ + 3]])} {...ink} />
      <polyline points={pts([[176, 52, TZ + 3], [182, 70, TZ + 3], [168, 80, TZ + 3]])} {...ink} />
      <polygon points={pts([[152, 68, TZ + 3], [158, 68, TZ + 3], [158, 74, TZ + 3], [152, 74, TZ + 3]])} {...ink} />
      <Box at={[112, 94, TZ]} size={[52, 4, 4]} top={tone.light} rightFx={fx.hatch} />
      <polygon points={pts([[164, 94, TZ], [172, 96, TZ + 2], [164, 98, TZ + 4]])} fill="currentColor" />

      {/* Speaker */}
      <Box at={[200, 22, TZ]} size={[30, 32, 46]} rightFx={fx.hatch} />
      <polygon points={circleOnLeftFace(215, 54, TZ + 17, 10)} {...thin} fill={tone.right} />
      <polygon points={circleOnLeftFace(215, 54, TZ + 17, 5)} {...thin} />
      <polygon points={circleOnLeftFace(215, 54, TZ + 36, 4.5)} {...thin} fill={tone.right} />

      {/* Sticky notes */}
      <Box at={[196, 74, TZ]} size={[16, 16, 1]} top={tone.light} />
      <Box at={[214, 82, TZ]} size={[16, 16, 1]} top={tone.light} />

      {/* Stools in front and at the right end */}
      <Stool x={70} y={146} fx={fx} />
      <Stool x={178} y={146} fx={fx} />
      <Stool x={274} y={58} fx={fx} />
    </IsoSvg>
  );
}
