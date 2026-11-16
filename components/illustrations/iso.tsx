/*
  Isometric drawing kit for the Tech@EDC illustrations.

  One projection for every drawing (true isometric, 30 degrees):
    screenX = (x - y) * cos30,  screenY = (x + y) / 2 - z
  +x runs down-right, +y runs down-left, +z is up. Faces visible to the
  viewer are the top (+z), the "right" face (+x side) and the "left" face
  (+y side). Draw back-to-front (smaller x + y first).

  Faces are filled with opaque CSS-variable tones (globals.css: --iso-top,
  --iso-left, --iso-right, --iso-light) so hidden lines are occluded, and
  outlined in currentColor. Texture comes from three patterns: diagonal
  hatch, 50% dither and 25% dither.
*/
import type { ReactNode } from "react";

export type V3 = readonly [number, number, number];

const COS30 = Math.cos(Math.PI / 6);
const f = (n: number) => Math.round(n * 100) / 100;

/** Project a 3D point to 2D screen coordinates. */
export function P(x: number, y: number, z: number): [number, number] {
  return [f((x - y) * COS30), f((x + y) / 2 - z)];
}
const pp = (v: V3) => P(v[0], v[1], v[2]);

/** "x,y x,y ..." for <polygon>/<polyline>. */
export function pts(list: readonly V3[]) {
  return list.map((v) => pp(v).join(",")).join(" ");
}

type Cmd = readonly ["M" | "L", V3] | readonly ["C", V3, V3, V3] | readonly ["Q", V3, V3] | readonly ["Z"];

/** Build a path "d" from 3D commands. The projection is affine, so curves stay exact. */
export function path(cmds: readonly Cmd[]) {
  return cmds
    .map((c) => {
      if (c[0] === "Z") return "Z";
      const rest = (c.slice(1) as V3[]).map((v) => pp(v).join(" ")).join(" ");
      return `${c[0]}${rest}`;
    })
    .join(" ");
}

/** Shared line style. Outlines keep ~1.25px whatever size the art renders at. */
export const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};
export const thin = { ...line, strokeWidth: 0.9 };
export const dashed = { ...line, strokeWidth: 1, strokeDasharray: "3 4" };

export const tone = {
  top: "var(--iso-top)",
  left: "var(--iso-left)",
  right: "var(--iso-right)",
  light: "var(--iso-light)",
  ink: "var(--iso-ink)",
};

/** Pattern ids for one drawing instance. */
export type Fx = { hatch: string; dither: string; sparse: string; defs: ReactNode };

/** Create per-instance texture patterns (ids must be unique on the page). */
export function makeFx(rawId: string): Fx {
  const id = `iso${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  return {
    hatch: `url(#${id}h)`,
    dither: `url(#${id}d)`,
    sparse: `url(#${id}s)`,
    defs: (
      <defs>
        <pattern id={`${id}h`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <path d="M0 0.5H4" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
        </pattern>
        <pattern id={`${id}d`} width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="1" height="1" fill="currentColor" opacity="0.38" />
          <rect x="1" y="1" width="1" height="1" fill="currentColor" opacity="0.38" />
        </pattern>
        <pattern id={`${id}s`} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="1" height="1" fill="currentColor" opacity="0.4" />
        </pattern>
      </defs>
    ),
  };
}

/** A filled face with an optional texture and an outline. */
export function Face({
  p,
  fill = tone.top,
  fx,
  stroke = true,
  strokeColor,
}: {
  p: readonly V3[];
  fill?: string;
  fx?: string;
  stroke?: boolean;
  strokeColor?: string;
}) {
  const s = pts(p);
  return (
    <>
      <polygon points={s} fill={fill} />
      {fx && <polygon points={s} fill={fx} />}
      {stroke && <polygon points={s} {...line} stroke={strokeColor ?? "currentColor"} />}
    </>
  );
}

export type BoxProps = {
  at: V3;
  size: V3;
  top?: string;
  left?: string;
  right?: string;
  topFx?: string;
  leftFx?: string;
  rightFx?: string;
  /** Faces to skip, e.g. when another solid covers them. */
  hide?: ("top" | "left" | "right")[];
};

/** Axis-aligned box: x..x+w, y..y+d, z..z+h. */
export function Box({ at, size, top = tone.top, left = tone.left, right = tone.right, topFx, leftFx, rightFx, hide = [] }: BoxProps) {
  const [x, y, z] = at;
  const [w, d, h] = size;
  const t = z + h;
  return (
    <g>
      {!hide.includes("left") && (
        <Face p={[[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]]} fill={left} fx={leftFx} />
      )}
      {!hide.includes("right") && (
        <Face p={[[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]]} fill={right} fx={rightFx} />
      )}
      {!hide.includes("top") && <Face p={[[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]]} fill={top} fx={topFx} />}
    </g>
  );
}

/** Truncated pyramid (keycap): base w x d at z, top inset by `inset` at z + h, top shifted back by `lean`. */
export function Frustum({
  at,
  size,
  inset,
  lean = 0,
  top = tone.top,
  left = tone.left,
  right = tone.right,
  topFx,
  leftFx,
  rightFx,
}: BoxProps & { inset: number; lean?: number }) {
  const [x, y, z] = at;
  const [w, d, h] = size;
  const t = z + h;
  const i = inset;
  const tl: V3[] = [
    [x + i - lean, y + i - lean, t],
    [x + w - i - lean, y + i - lean, t],
    [x + w - i - lean, y + d - i - lean, t],
    [x + i - lean, y + d - i - lean, t],
  ];
  return (
    <g>
      <Face p={[[x, y + d, z], [x + w, y + d, z], tl[2], tl[3]]} fill={left} fx={leftFx} />
      <Face p={[[x + w, y, z], [x + w, y + d, z], tl[2], tl[1]]} fill={right} fx={rightFx} />
      <Face p={tl} fill={top} fx={topFx} />
    </g>
  );
}

/** Vertical cylinder centred on (x, y) from z0 to z1. */
export function Cylinder({
  x,
  y,
  z0,
  z1,
  r,
  top = tone.top,
  side = tone.left,
  sideFx,
  topFx,
}: {
  x: number;
  y: number;
  z0: number;
  z1: number;
  r: number;
  top?: string;
  side?: string;
  sideFx?: string;
  topFx?: string;
}) {
  const [bx, by] = P(x, y, z0);
  const [tx, ty] = P(x, y, z1);
  const rx = f(r * Math.SQRT2 * COS30);
  const ry = f(r * Math.SQRT2 * 0.5);
  const body = `M${bx - rx} ${by} A${rx} ${ry} 0 0 0 ${bx + rx} ${by} L${tx + rx} ${ty} L${tx - rx} ${ty} Z`;
  return (
    <g>
      <path d={body} fill={side} />
      {sideFx && <path d={body} fill={sideFx} />}
      <path d={`M${bx - rx} ${by} A${rx} ${ry} 0 0 0 ${bx + rx} ${by} M${bx - rx} ${by} L${tx - rx} ${ty} M${bx + rx} ${by} L${tx + rx} ${ty}`} {...line} />
      <ellipse cx={tx} cy={ty} rx={rx} ry={ry} fill={top} />
      {topFx && <ellipse cx={tx} cy={ty} rx={rx} ry={ry} fill={topFx} />}
      <ellipse cx={tx} cy={ty} rx={rx} ry={ry} {...line} />
    </g>
  );
}

/** Outlined tube (cable): a wide currentColor stroke with a dark core. */
export function Cable({ d, width = 5, core = tone.left }: { d: string; width?: number; core?: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="currentColor" strokeWidth={width} />
      <path d={d} stroke={core} strokeWidth={width - 2.4} />
    </g>
  );
}

/**
 * Text lying on an isometric plane. `plane`: "top" (reads along +x),
 * "left" (the +y face, reads along +x) or "right" (the +x face, reads along -y).
 */
export function IsoText({
  at,
  plane,
  children,
  size = 10,
  fill = "currentColor",
  weight = 500,
  anchor = "start",
}: {
  at: V3;
  plane: "top" | "left" | "right";
  children: ReactNode;
  size?: number;
  fill?: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
}) {
  const [sx, sy] = pp(at);
  const c = f(COS30);
  const m =
    plane === "top"
      ? `matrix(${c} 0.5 ${-c} 0.5 ${sx} ${sy})`
      : plane === "left"
        ? `matrix(${c} 0.5 0 1 ${sx} ${sy})`
        : `matrix(${c} -0.5 0 1 ${sx} ${sy})`;
  return (
    <text
      transform={m}
      fontSize={size}
      fill={fill}
      fontFamily="var(--font-mono)"
      fontWeight={weight}
      textAnchor={anchor}
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
}

export type IllustrationProps = {
  className?: string;
  /** Accessible name. Omit for decorative use (the default): the SVG is aria-hidden. */
  title?: string;
};

/** Root <svg> shared by every illustration. */
export function IsoSvg({
  viewBox,
  className,
  title,
  fx,
  children,
}: IllustrationProps & { viewBox: string; fx: Fx; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      style={{ overflow: "visible" }}
    >
      {title && <title>{title}</title>}
      {fx.defs}
      {children}
    </svg>
  );
}
