import { useId } from "react";
import { Box, Cable, Face, IsoSvg, makeFx, path, thin, dashed, tone, type IllustrationProps } from "./iso";

/** A plug pulled out of its socket, cable trailing off. For the 404 page. */
export function IsoNotFound({ className, title }: IllustrationProps) {
  const fx = makeFx(useId());

  // Socket block: the socket sits on its left (+y) face at y = 110.
  const sy = 110;
  // Plug body in front of it, prongs pointing back toward the socket.
  const py = 200;

  return (
    <IsoSvg viewBox="-112 -22 304 326" className={className} title={title} fx={fx}>
      {/* Socket block */}
      <Box at={[110, 0, 0]} size={[96, sy, 60]} leftFx={fx.dither} rightFx={fx.hatch} />
      <Face p={[[132, sy, 14], [184, sy, 14], [184, sy, 50], [132, sy, 50]]} fill={tone.right} />
      {/* two slots */}
      <Face p={[[146, sy, 26], [150, sy, 26], [150, sy, 40], [146, sy, 40]]} fill="currentColor" stroke={false} />
      <Face p={[[166, sy, 26], [170, sy, 26], [170, sy, 40], [166, sy, 40]]} fill="currentColor" stroke={false} />
      {/* vents on top */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={path([["M", [124 + i * 9, 14, 60]], ["L", [124 + i * 9, 60, 60]]])} {...thin} />
      ))}

      {/* Alignment guides between prongs and slots */}
      <path d={path([["M", [148, sy + 4, 33]], ["L", [148, py - 30, 33]]])} {...dashed} />
      <path d={path([["M", [168, sy + 4, 33]], ["L", [168, py - 30, 33]]])} {...dashed} />

      {/* Prongs (behind the plug body) */}
      <Box at={[146, py - 26, 31]} size={[4, 26, 4]} top={tone.light} rightFx={fx.hatch} />
      <Box at={[166, py - 26, 31]} size={[4, 26, 4]} top={tone.light} rightFx={fx.hatch} />

      {/* Plug body */}
      <Box at={[136, py, 16]} size={[44, 30, 34]} leftFx={fx.dither} rightFx={fx.hatch} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={path([["M", [142, py + 30, 22 + i * 10]], ["L", [174, py + 30, 22 + i * 10]]])} {...thin} />
      ))}
      {/* Strain relief */}
      <Box at={[150, py + 30, 26]} size={[16, 12, 14]} rightFx={fx.hatch} />

      {/* Cable trailing off to the front-left and down to the desk */}
      <Cable d={path([["M", [158, py + 42, 33]], ["C", [158, py + 72, 33], [170, py + 80, 0], [210, py + 80, 0]], ["C", [250, py + 80, 0], [270, py + 62, 0], [312, py + 70, 0]]])} width={6} core={tone.left} />
    </IsoSvg>
  );
}
