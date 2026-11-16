import { useId } from "react";
import { Box, Cable, Cylinder, Face, IsoSvg, IsoText, line, makeFx, path, pts, thin, tone, type IllustrationProps, type V3 } from "./iso";

/** Open laptop wired to a breadboard and a small router. For the Community section. */
export function IsoCommunity({ className, title }: IllustrationProps) {
  const fx = makeFx(useId());

  // Keyboard: 10 x 4 keys on the laptop deck (z = 7).
  const keys: V3[][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 10; c++) {
      const x = 14 + c * 12.4;
      const y = 12 + r * 11;
      keys.push([[x, y, 7], [x + 10, y, 7], [x + 10, y + 8.6, 7], [x, y + 8.6, 7]]);
    }
  }

  // Breadboard hole rows (dashed lines read as rows of holes).
  const holeRows = [40, 46, 52, 58, 72, 78, 84, 90];

  return (
    <IsoSvg viewBox="-112 -136 470 368" className={className} title={title} fx={fx}>
      {/* Router, behind everything */}
      <Cylinder x={258} y={-52} z0={18} z1={78} r={2.4} />
      <Cylinder x={318} y={-52} z0={18} z1={70} r={2.4} />
      <Box at={[250, -60, 0]} size={[80, 44, 18]} rightFx={fx.hatch} />
      {[0, 1, 2, 3].map((i) => (
        <polyline key={i} points={pts([[262 + i * 9, -16, 5], [262 + i * 9, -16, 12]])} {...thin} />
      ))}
      <Face p={[[300, -16, 4], [318, -16, 4], [318, -16, 11], [300, -16, 11]]} fill={tone.right} />

      {/* Laptop screen (front face is the y = 0 plane) */}
      <Box at={[0, -6, 7]} size={[150, 6, 104]} rightFx={fx.hatch} />
      <Face p={[[9, 0, 16], [141, 0, 16], [141, 0, 103], [9, 0, 103]]} fill={tone.right} />
      <IsoText at={[18, 0, 92]} plane="left" size={8}>$ git clone club</IsoText>
      <IsoText at={[18, 0, 80]} plane="left" size={8}>$ npm run dev</IsoText>
      <IsoText at={[18, 0, 68]} plane="left" size={8} fill="var(--text-subtle)">ready on :3000</IsoText>
      <IsoText at={[18, 0, 56]} plane="left" size={8}>$</IsoText>
      <Face p={[[27, 0, 59.5], [32, 0, 59.5], [32, 0, 52.5], [27, 0, 52.5]]} fill="currentColor" stroke={false} />

      {/* Laptop base */}
      <Box at={[0, 0, 0]} size={[150, 104, 7]} leftFx={fx.dither} rightFx={fx.hatch} />
      {keys.map((k, i) => (
        <polygon key={i} points={pts(k)} {...thin} fill={tone.left} />
      ))}
      <polygon points={pts([[50, 62, 7], [100, 62, 7], [100, 94, 7], [50, 94, 7]])} {...thin} />

      {/* Breadboard */}
      <Box at={[215, 30, 0]} size={[120, 70, 8]} leftFx={fx.dither} rightFx={fx.hatch} />
      {holeRows.map((y) => (
        <path key={y} d={path([["M", [224, y, 8]], ["L", [326, y, 8]]])} {...thin} strokeDasharray="1.4 3.2" />
      ))}
      <path d={path([["M", [215, 65, 8]], ["L", [335, 65, 8]]])} {...thin} />

      {/* Chip straddling the channel, pins drawn on its faces */}
      <Box at={[262, 54, 8]} size={[36, 22, 6]} top={tone.light} rightFx={fx.hatch} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={path([["M", [266 + i * 7, 76, 12]], ["L", [266 + i * 7, 78, 8]]])} {...line} />
      ))}
      <path d={path([["M", [268, 59, 14]], ["L", [276, 59, 14]]])} {...line} stroke={tone.ink} />

      {/* Jumper wires on the board */}
      <Cable d={path([["M", [236, 40, 8]], ["C", [236, 40, 26], [250, 58, 26], [250, 58, 8]]])} width={3.4} />
      <Cable d={path([["M", [312, 46, 8]], ["C", [312, 46, 30], [318, 84, 30], [318, 84, 8]]])} width={3.4} />

      {/* Router -> breadboard */}
      <Cable d={path([["M", [309, -16, 7]], ["C", [309, 4, 0], [300, 14, 22], [300, 40, 8]]])} />

      {/* Laptop -> breadboard, lying on the desk, into a plug on the board's front face */}
      <Cable d={path([["M", [150, 56, 3]], ["C", [196, 56, 2], [176, 140, 2], [238, 132, 2]], ["L", [238, 108, 3]]])} />
      <Box at={[231, 100, 0]} size={[14, 8, 6]} rightFx={fx.hatch} />
    </IsoSvg>
  );
}
