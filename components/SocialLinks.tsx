import clsx from "clsx";
import { socials } from "@/content/site";
import { Icon, type IconName } from "./Icon";
import { SmartLink } from "./SmartLink";

const icons: Record<string, IconName> = { Instagram: "instagram", Discord: "discord", LinkedIn: "linkedin" };

export type SocialLinksProps = {
  /** "icons" = square icon buttons (footer, compact); "list" = bordered rows with label + handle (Connect section). */
  variant?: "icons" | "list";
  className?: string;
};

/** Club socials from content/site.ts `socials`. */
export function SocialLinks({ variant = "icons", className }: SocialLinksProps) {
  if (variant === "list") {
    return (
      <ul className={clsx("grid gap-3 md:grid-cols-3", className)}>
        {socials.map((s) => (
          <li key={s.label}>
            <SmartLink
              href={s.href}
              className="group flex items-center gap-4 rounded-card border border-border bg-surface p-5 transition-[border-color,background-color] duration-200 hover:border-border-hover hover:bg-surface-raised"
            >
              <span className="flex size-10 items-center justify-center rounded-control border border-border-strong text-fg">
                <Icon name={icons[s.label] ?? "arrow-up-right"} size={18} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium text-fg">{s.label}</span>
                <span className="text-xs break-words text-fg-muted">{s.handle}</span>
              </span>
              <Icon
                name="arrow-up-right"
                className="ml-auto text-fg-subtle transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
              />
            </SmartLink>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={clsx("flex items-center gap-2", className)}>
      {socials.map((s) => (
        <li key={s.label}>
          <SmartLink
            href={s.href}
            aria-label={s.label}
            className="flex size-9 items-center justify-center rounded-control border border-border text-fg-muted transition-colors duration-150 hover:border-border-hover hover:text-fg"
          >
            <Icon name={icons[s.label] ?? "arrow-up-right"} size={16} />
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}
