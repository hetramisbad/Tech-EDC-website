import { useId } from "react";
import { Box, IsoSvg, IsoText, dashed, makeFx, path, pts, thin, tone, type IllustrationProps, type V3 } from "./iso";

const W = 70; // module footprint
const D = 56;
const H = 24;

/** One module: a block with a recessed label strip on top and connector teeth on its front faces. */
function Module({ at, light = false, fx, label }: { at: V3; light?: boolean; fx: ReturnType<typeof makeFx>; label?: string }) {
  const [x, y, z] = at;
  const t = z + H;
  const ink = light ? tone.ink : "currentColor";
  return (
    <g>
      <Box at={at} size={[W, D, H]} top={light ? tone.light : tone.top} leftFx={fx.dither} rightFx={fx.hatch} />
      {/* label strip */}
      <polygon points={pts([[x + 8, y + 8, t], [x + W - 8, y + 8, t], [x + W - 8, y + 22, t], [x + 8, y + 22, t]])} {...thin} stroke={ink} />
      {label && (
        <IsoText at={[x + 12, y + 15, t]} plane="top" size={7.5} fill={ink}>
          {label}
        </IsoText>
      )}
      {/* vents */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={path([["M", [x + 10 + i * 7, y + 32, t]], ["L", [x + 10 + i * 7, y + D - 10, t]]])} {...thin} stroke={ink} />
      ))}
      {/* connector teeth on the left (+y) face */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={path([["M", [x + 12 + i * 8.5, y + D, z + 6]], ["L", [x + 12 + i * 8.5, y + D, z + 14]]])} {...thin} />
      ))}
    </g>
  );
}

/** Modules being assembled on a board: three seated, one lowering into its slot. For Build Cohort. */
export function IsoBuildCohort({ className, title }: IllustrationProps) {
  const fx = makeFx(useId());
  const z0 = 7; // board top
  const slot: V3 = [128, 104, z0];
  const lift = 52;

  // PCB traces on the board top
  const traces: V3[][] = [
    [[8, 88, z0], [104, 88, z0], [112, 96, z0], [210, 96, z0]],
    [[8, 172, z0], [70, 172, z0], [76, 178, z0], [120, 178, z0]],
    [[108, 8, z0], [108, 76, z0], [114, 82, z0], [114, 96, z0]],
    [[210, 82, z0], [204, 82, z0], [204, 60, z0]],
  ];

  return (
    <IsoSvg viewBox="-172 -20 370 236" className={className} title={title} fx={fx}>
      {/* Board */}
      <Box at={[0, 0, 0]} size={[218, 184, z0]} leftFx={fx.dither} rightFx={fx.hatch} />
      {traces.map((tr, i) => (
        <polyline key={i} points={pts(tr)} {...thin} />
      ))}
      {[
        [200, 12],
        [200, 24],
        [10, 120],
      ].map(([x, y]) => (
        <polygon key={`${x}-${y}`} points={pts([[x, y, z0], [x + 8, y, z0], [x + 8, y + 6, z0], [x, y + 6, z0]])} fill="currentColor" stroke="none" />
      ))}

      {/* Empty slot, dashed */}
      <polygon points={pts([slot, [slot[0] + W, slot[1], z0], [slot[0] + W, slot[1] + D, z0], [slot[0], slot[1] + D, z0]])} {...dashed} />

      {/* Seated modules, back to front */}
      <Module at={[24, 18, z0]} fx={fx} label="api" />
      <Module at={[128, 18, z0]} fx={fx} label="ui" />
      <Module at={[24, 104, z0]} fx={fx} label="db" />

      {/* Guides from the lifted module down to its slot */}
      {(
        [
          [slot[0], slot[1] + D],
          [slot[0] + W, slot[1] + D],
          [slot[0] + W, slot[1]],
        ] as const
      ).map(([x, y]) => (
        <path key={`${x}-${y}`} d={path([["M", [x, y, z0 + 2]], ["L", [x, y, z0 + lift - 4]]])} {...dashed} />
      ))}

      {/* The module being placed */}
      <Module at={[slot[0], slot[1], z0 + lift]} light fx={fx} label="you" />
    </IsoSvg>
  );
}
