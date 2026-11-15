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
  discord: (
    <>
      <path d="M5.2 4.1C6.1 3.8 7 3.65 8 3.65s1.9.15 2.8.45c1.2 1.6 1.9 3.5 2 5.6-.9.9-2 1.5-3.1 1.8l-.6-1.1M5.2 4.1C4 5.7 3.3 7.6 3.2 9.7c.9.9 2 1.5 3.1 1.8l.6-1.1" />
      <path d="M5.6 10.2c1.6.7 3.2.7 4.8 0" />
      <circle cx="6.3" cy="7.9" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="9.7" cy="7.9" r="0.75" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="2" />
      <path d="M5.25 7v4M5.25 4.9v.1M7.75 11V7M7.75 8.6c0-1 .7-1.6 1.6-1.6s1.4.6 1.4 1.6V11" />
    </>
  ),
};
