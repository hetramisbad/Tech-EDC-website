import { useId } from "react";
import { Box, Cylinder, Face, IsoSvg, line, makeFx, path, pts, thin, tone, type IllustrationProps } from "./iso";

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

/**
 * A shared workbench with stools around it and the club's projects on the
 * table: a small robot kit, an open sketchbook, sticky notes. For the
 * Community section.
 */
export function IsoCommunity({ className, title }: IllustrationProps) {
  const fx = makeFx(useId());

  const ink = { ...thin, stroke: tone.ink };

  const legs: [number, number][] = [
    [6, 6],
    [TW - 12, 6],
    [6, TD - 12],
    [TW - 12, TD - 12],
  ];

  return (
    <IsoSvg viewBox="-104 -81 320 263" className={className} title={title} fx={fx}>
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
