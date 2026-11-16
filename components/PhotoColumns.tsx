import clsx from "clsx";
import type { ReactNode } from "react";
import { Placeholder } from "./Card";
import type { GalleryImage } from "./Gallery";

export type PhotoColumnsProps = {
  /** Centered copy between the columns (paragraphs, an ArrowLink, a Button...). */
  children?: ReactNode;
  /** Photos (e.g. from public/events/). Split alternately into the left and right column. Empty = placeholder tiles. */
  images?: GalleryImage[];
  /** Captions for placeholder tiles when there are no images. */
  placeholderCaptions?: string[];
  /** Accessible name for the photo region. Default "Event photos". */
  label?: string;
  /** Seconds for one full loop of a column. Default 70. */
  duration?: number;
  className?: string;
};

const defaultCaptions = ["Workshop", "Buildathon", "Demo night", "Speaker series", "Social", "Showcase", "Study jam", "Project night"];

type Tile = { key: string; node: (dup: boolean) => ReactNode };

function makeTiles(images: GalleryImage[], captions: string[]): Tile[] {
  if (images.length > 0) {
    return images.map((img, i) => ({
      key: `${img.src}-${i}`,
      node: (dup) => (
        // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized anyway
        <img
          src={img.src}
          alt={dup ? "" : img.alt}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full rounded-sm border border-border object-cover"
        />
      ),
    }));
  }
  return captions.map((c, i) => ({
    key: `${c}-${i}`,
    node: (dup) => (dup ? <Placeholder aspect="4/5" className="w-full" /> : <Placeholder caption={c} aspect="4/5" className="w-full" />),
  }));
}

/** Repeat a list until it has at least `n` items; repeats are marked so they are hidden from assistive tech. */
function fill(list: Tile[], n: number): (Tile & { repeat: boolean })[] {
  if (list.length === 0) return [];
  const out: (Tile & { repeat: boolean })[] = [];
  while (out.length < n) out.push(...list.map((t) => ({ ...t, repeat: out.length > 0 })));
  return out;
}

function Column({
  tiles,
  direction,
  label,
  className,
}: {
  tiles: (Tile & { repeat: boolean })[];
  direction: "up" | "down";
  label: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={clsx("photo-col", className)} data-direction={direction}>
      <ul className="photo-col-track">
        {tiles.map((t, i) => (
          <li key={`a-${t.key}-${i}`} aria-hidden={t.repeat || undefined}>
            {t.node(t.repeat)}
          </li>
        ))}
        {tiles.map((t, i) => (
          <li key={`b-${t.key}-${i}`} className="photo-col-dup" aria-hidden>
            {t.node(true)}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Events layout from Tech@NYU: two columns of tall photo tiles flanking
 * centered text, drifting vertically in opposite directions. CSS-only
 * animation; pauses on hover/focus; static under prefers-reduced-motion.
 * Below 840px: the text, then the two columns side by side as a static
 * 2 x 2 grid.
 */
export function PhotoColumns({
  children,
  images = [],
  placeholderCaptions = defaultCaptions,
  label = "Event photos",
  duration = 70,
  className,
}: PhotoColumnsProps) {
  const tiles = makeTiles(images, placeholderCaptions);
  const left = fill(tiles.filter((_, i) => i % 2 === 0), 4);
  const right = fill(tiles.filter((_, i) => i % 2 === 1), 4);

  return (
    <div
      className={clsx(
        "photo-columns grid grid-cols-2 gap-x-3 gap-y-10",
        "md:h-[680px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)] md:gap-8 lg:h-[760px] lg:gap-16",
        className,
      )}
      style={{ ["--columns-duration" as string]: `${duration}s` }}
    >
      <div className="col-span-2 flex flex-col items-center justify-center gap-5 text-center md:col-span-1 md:col-start-2 md:row-start-1">
        {children}
      </div>
      <Column tiles={left} direction="up" label={`${label} (1 of 2)`} className="md:col-start-1 md:row-start-1" />
      <Column tiles={right} direction="down" label={`${label} (2 of 2)`} className="md:col-start-3 md:row-start-1" />
    </div>
  );
}
