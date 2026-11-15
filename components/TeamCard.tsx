import clsx from "clsx";
import type { Member } from "@/content/team";
import { SmartLink } from "./SmartLink";

export type TeamCardProps = Member & { className?: string };

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Team member: square photo (or initials fallback), name, role, optional links. Accepts a `Member` from content/team.ts. */
export function TeamCard({ name, role, photo, links, className }: TeamCardProps) {
  return (
    <article className={clsx("flex flex-col gap-4", className)}>
      <div className="relative aspect-square overflow-hidden rounded-card border border-border bg-surface grain">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export
          <img src={photo} alt={`Portrait of ${name}`} loading="lazy" className="h-full w-full object-cover grayscale-[15%]" />
        ) : (
          <div aria-hidden className="flex h-full w-full items-center justify-center bg-[radial-gradient(100%_100%_at_50%_0%,var(--surface-hover),var(--surface))]">
            <span className="text-h2 text-fg-subtle">{initials(name)}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-medium text-fg">{name}</h3>
        <p className="text-sm text-fg-muted">{role}</p>
        {links && links.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <SmartLink href={l.href} className="text-xs text-fg-muted transition-colors hover:text-accent">
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
