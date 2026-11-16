import clsx from "clsx";
import { Placeholder } from "./Card";

export type GalleryImage = { src: string; alt: string };

export type GalleryProps = {
  /** Photos (e.g. from public/events/). Empty or omitted = placeholder tiles. */
  images?: GalleryImage[];
  /** Accessible name for the strip. Default "Event photos". */
  label?: string;
  /** Captions for placeholder tiles when there are no images. */
  placeholderCaptions?: string[];
  /** Seconds for one full loop. Default 60. */
  duration?: number;
  className?: string;
};

const defaultCaptions = ["Workshop", "Buildathon", "Demo night", "Speaker series", "Social", "Showcase"];

/**
 * Horizontally scrolling marquee of event photos. Pauses on hover/focus; static
 * (and scrollable) under prefers-reduced-motion. CSS only, no client JS.
 */
export function Gallery({
  images = [],
  label = "Event photos",
  placeholderCaptions = defaultCaptions,
  duration = 60,
  className,
}: GalleryProps) {
  const tiles =
    images.length > 0
      ? images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized anyway
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full rounded-sm border border-border object-cover"
          />
        ))
      : placeholderCaptions.map((c, i) => (
          <Placeholder key={`${c}-${i}`} caption={c} aspect="4/3" className="h-full w-full" />
        ));

  const tileCls = "h-[200px] w-[267px] shrink-0 sm:h-[240px] sm:w-[320px] lg:h-[280px] lg:w-[373px]";

  return (
    <div
      role="region"
      aria-label={label}
      className={clsx("marquee overflow-hidden", className)}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <ul className="marquee-track">
        {tiles.map((t, i) => (
          <li key={`a${i}`} className={tileCls}>
            {t}
          </li>
        ))}
        {tiles.map((t, i) => (
          <li key={`b${i}`} className={clsx(tileCls, "marquee-dup")} aria-hidden>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Alias: the marquee is the gallery. */
export const Marquee = Gallery;
