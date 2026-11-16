import clsx from "clsx";

export type IconName =
  | "arrow-right"
  | "arrow-up-right"
  | "menu"
  | "close"
  | "plus"
  | "chevron-down"
  | "mail"
  | "check"
  | "instagram"
  | "discord"
  | "linkedin";

/** Small, own-drawn line icons on a 16px grid. Decorative by default. */
export function Icon({
  name,
  size = 16,
  className,
  title,
}: {
  name: IconName;
  size?: number;
  className?: string;
  /** Pass a title only when the icon is the sole content of a control. */
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

const paths: Record<IconName, React.ReactNode> = {
  "arrow-right": <path d="M3 8h10M9 4l4 4-4 4" />,
  "arrow-up-right": <path d="M5 11l6-6M6 5h5v5" />,
  menu: <path d="M2.5 5.5h11M2.5 10.5h11" />,
  close: <path d="M4 4l8 8M12 4l-8 8" />,
  plus: <path d="M8 3v10M3 8h10" />,
  "chevron-down": <path d="M4 6l4 4 4-4" />,
  mail: (
    <>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="M2.5 4.5L8 9l5.5-4.5" />
    </>
  ),
  check: <path d="M3.5 8.5l3 3 6-7" />,
  instagram: (
    <>
      <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="3.25" />
      <circle cx="8" cy="8" r="2.6" />
      <circle cx="11.4" cy="4.6" r="0.4" fill="currentColor" stroke="none" />
    </>
  ),
  // Official Discord mark (Clyde), path data from simple-icons (CC0), per Discord's brand assets.
  // Drawn on a 24px grid, scaled to this 16px icon grid; filled, not stroked.
  discord: (
    <path transform="scale(0.6667)" fill="currentColor" stroke="none" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  ),
  linkedin: (
    <>
      <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="2" />
      <path d="M5.25 7v4M5.25 4.9v.1M7.75 11V7M7.75 8.6c0-1 .7-1.6 1.6-1.6s1.4.6 1.4 1.6V11" />
    </>
  ),
};
