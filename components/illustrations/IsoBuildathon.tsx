import { useId } from "react";
import { Box, Cylinder, IsoSvg, IsoText, P, makeFx, path, pts, thin, tone, line, type IllustrationProps, type V3 } from "./iso";

const COS30 = Math.cos(Math.PI / 6);
const ell = (r: number) => [r * Math.SQRT2 * COS30, r * Math.SQRT2 * 0.5] as const;

/** An hourglass on a stack of circuit boards. For Buildathon (48 hours). */
export function IsoBuildathon({ className, title }: IllustrationProps) {
  const fx = makeFx(useId());

  // Board stack
  const b1: V3 = [0, 0, 0];
  const b2: V3 = [16, 14, 8];
  const b3: V3 = [32, 28, 16];
  const top = 24; // top of the third board

  // Hourglass, centred on (cx, cy)
  const cx = 92;
  const cy = 88;
  const half = 36; // half side of the frame plates
  const zb = top + 6; // glass bottom (on the lower plate)
  const zt = zb + 92; // glass top (under the upper plate)
  const zn = (zb + zt) / 2; // neck
  const R = 30;
  const rn = 3.5;

  const [bx, byb] = P(cx, cy, zb);
  const [, byt] = P(cx, cy, zt);
  const [, byn] = P(cx, cy, zn);
  const [rx, ry] = ell(R);
  const [nrx] = ell(rn);

  // Sand: lower pile up to zs1, upper remainder down from zs2
  const zs1 = zb + 20;
  const rs1 = R - (R - rn) * ((zs1 - zb) / (zn - zb));
  const [srx, sry] = ell(rs1);
  const [, bys1] = P(cx, cy, zs1);
  const zs2 = zn + 26;
  const rs2 = rn + (R - rn) * ((zs2 - zn) / (zt - zn));
  const [urx, ury] = ell(rs2);
  const [, bys2] = P(cx, cy, zs2);

  const glassOutline = `M${bx - rx} ${byb} L${bx - nrx} ${byn} L${bx - rx} ${byt} M${bx + rx} ${byb} L${bx + nrx} ${byn} L${bx + rx} ${byt}`;
  const lowerSand = `M${bx - srx} ${bys1} L${bx - rx} ${byb} A${rx} ${ry} 0 0 0 ${bx + rx} ${byb} L${bx + srx} ${bys1} A${srx} ${sry} 0 0 0 ${bx - srx} ${bys1} Z`;
  const upperSand = `M${bx - urx} ${bys2} L${bx - nrx} ${byn} L${bx + nrx} ${byn} L${bx + urx} ${bys2} A${urx} ${ury} 0 0 0 ${bx - urx} ${bys2} Z`;

  const posts: [number, number][] = [
    [cx - half + 5, cy - half + 5],
    [cx + half - 5, cy - half + 5],
    [cx - half + 5, cy + half - 5],
    [cx + half - 5, cy + half - 5],
  ];

  return (
    <IsoSvg viewBox="-162 -86 330 276" className={className} title={title} fx={fx}>
      {/* Boards */}
      <Box at={b1} size={[184, 176, 8]} leftFx={fx.dither} rightFx={fx.hatch} />
      <Box at={b2} size={[152, 148, 8]} rightFx={fx.hatch} />
      <Box at={b3} size={[120, 120, 8]} leftFx={fx.dither} rightFx={fx.hatch} />
      <IsoText at={[42, 148, 20]} plane="left" size={7.5}>48:00:00</IsoText>
      {[0, 1, 2].map((i) => (
        <polyline key={i} points={pts([[40 + i * 6, 36, top], [40 + i * 6, 46, top], [52 + i * 6, 58, top]])} {...thin} />
      ))}

      {/* Lower plate */}
      <Box at={[cx - half, cy - half, top]} size={[half * 2, half * 2, 6]} rightFx={fx.hatch} />

      {/* Back post, then the glass, then the side and front posts */}
      <Cylinder x={posts[0][0]} y={posts[0][1]} z0={zb} z1={zt} r={2.6} />
      <path d={upperSand} fill={tone.top} />
      <path d={upperSand} fill={fx.dither} />
      <path d={lowerSand} fill={tone.top} />
      <path d={lowerSand} fill={fx.dither} />
      <ellipse cx={bx} cy={bys1} rx={srx} ry={sry} {...thin} />
      <ellipse cx={bx} cy={bys2} rx={urx} ry={ury} {...thin} />
      <path d={path([["M", [cx, cy, zn]], ["L", [cx, cy, zs1 + 2]]])} {...thin} strokeDasharray="2 2.5" />
      <path d={`M${bx - rx} ${byb} A${rx} ${ry} 0 0 0 ${bx + rx} ${byb}`} {...line} />
      <path d={glassOutline} {...line} />
      {/* glint */}
      <path d={`M${bx - rx + 7} ${byt + 10} L${bx - nrx - 3} ${byn - 8}`} {...thin} opacity={0.6} />
      <Cylinder x={posts[1][0]} y={posts[1][1]} z0={zb} z1={zt} r={2.6} />
      <Cylinder x={posts[2][0]} y={posts[2][1]} z0={zb} z1={zt} r={2.6} />
      <Cylinder x={posts[3][0]} y={posts[3][1]} z0={zb} z1={zt} r={2.6} />

      {/* Upper plate */}
      <Box at={[cx - half, cy - half, zt]} size={[half * 2, half * 2, 6]} top={tone.light} rightFx={fx.hatch} />
    </IsoSvg>
  );
}
