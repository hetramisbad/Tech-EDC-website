import { useId } from "react";
import { ScrollSettle } from "./ScrollSettle";
import {
  Box,
  Face,
  IsoSvg,
  makeFx,
  path,
  pts,
  thin,
  dashed,
  tone,
  type IllustrationProps,
  type V3,
} from "./iso";

/** Envelope: a thin slab with a flap drawn on top, optional stamp. */
function Envelope({
  at,
  size,
  fx,
  stamp = false,
}: {
  at: V3;
  size: readonly [number, number];
  fx: ReturnType<typeof makeFx>;
  stamp?: boolean;
}) {
  const [x, y, z] = at;
  const [w, d] = size;
  const t = z + 4;
  return (
    <g>
      <Box at={at} size={[w, d, 4]} top={tone.light} rightFx={fx.hatch} />
      {/* flap: from the back corners to the middle */}
      <polyline
        points={pts([
          [x, y, t],
          [x + w * 0.5, y + d * 0.56, t],
          [x + w, y, t],
        ])}
        {...thin}
        stroke={tone.ink}
      />
      <polyline
        points={pts([
          [x, y + d, t],
          [x + w * 0.36, y + d * 0.44, t],
        ])}
        {...thin}
        stroke={tone.ink}
      />
      <polyline
        points={pts([
          [x + w, y + d, t],
          [x + w * 0.64, y + d * 0.44, t],
        ])}
        {...thin}
        stroke={tone.ink}
      />
      {stamp && (
        <>
          <Face
            p={[
              [x + w - 26, y + 8, t],
              [x + w - 8, y + 8, t],
              [x + w - 8, y + 30, t],
              [x + w - 26, y + 30, t],
            ]}
            fill={tone.light}
            strokeColor={tone.ink}
          />
          <polygon
            points={pts([
              [x + w - 23, y + 11, t],
              [x + w - 11, y + 11, t],
              [x + w - 11, y + 27, t],
              [x + w - 23, y + 27, t],
            ])}
            {...thin}
            stroke={tone.ink}
            strokeDasharray="1.5 1.5"
          />
        </>
      )}
    </g>
  );
}

/** An envelope dropping into an open inbox tray. For Join Us / newsletter. */
export function IsoJoin({ className, title }: IllustrationProps) {
  const fx = makeFx(useId());
  const W = 176; // tray outer
  const D = 128;
  const H = 34;
  const k = 7; // wall thickness
  const f = 5; // floor thickness
  const lift = 96;
  const env: V3 = [24, 22, H + lift - 40];

  return (
    <IsoSvg
      viewBox="-130 -96 330 300"
      className={className}
      title={title}
      fx={fx}
    >
      {/* Floor (only the inside shows) */}
      <Box at={[0, 0, 0]} size={[W, D, f]} hide={["left", "right"]} />
      {/* Back wall and left wall: their inner faces are visible */}
      <Box at={[0, 0, 0]} size={[W, k, H]} leftFx={fx.hatch} />
      <Box at={[0, k, 0]} size={[k, D - k, H]} rightFx={fx.dither} />

      {/* Letters already in the tray */}
      <Box at={[22, 20, f]} size={[132, 90, 3]} top={tone.top} />
      <Envelope at={[18, 16, f + 3]} size={[136, 92]} fx={fx} />

      {/* Guides (fade out as the envelope lands) */}
      <ScrollSettle fade>
        {(
          [
            [env[0], env[1] + 96],
            [env[0] + 140, env[1] + 96],
            [env[0] + 140, env[1]],
          ] as const
        ).map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            d={path([
              ["M", [x, y, H + 10]],
              ["L", [x, y, env[2] - 6]],
            ])}
            {...dashed}
          />
        ))}
      </ScrollSettle>

      {/* The new envelope: drops onto the letters already in the tray as the drawing
          scrolls in (top of that stack is f + 3 + 4). */}
      <ScrollSettle drop={env[2] - (f + 7)}>
        <Envelope at={env} size={[140, 96]} fx={fx} stamp />
      </ScrollSettle>

      {/* Right wall and front wall: drawn after the envelope so they hide it once it is in the tray */}
      <Box at={[W - k, k, 0]} size={[k, D - 2 * k, H]} rightFx={fx.hatch} />
      <Box
        at={[0, D - k, 0]}
        size={[W, k, H]}
        leftFx={fx.dither}
        rightFx={fx.hatch}
      />
      {/* label slot on the front */}
      <polygon
        points={pts([
          [W * 0.36, D, H * 0.38],
          [W * 0.64, D, H * 0.38],
          [W * 0.64, D, H * 0.7],
          [W * 0.36, D, H * 0.7],
        ])}
        {...thin}
        fill={tone.right}
      />
    </IsoSvg>
  );
}
