import { network } from "@/content/network";
import { Section } from "./Section";
import { SmartLink } from "./SmartLink";

/**
 * Partner logo grid. OFF at launch: content/network.ts is empty, so this
 * renders nothing. Re-enable by adding entries and uncommenting the PARTNERS
 * block in app/page.tsx.
 */
export function NetworkGrid({ title = "Our Network" }: { title?: string }) {
  if (network.length === 0) return null;
  return (
    <Section id="network" eyebrow={title} align="center" space="tight" ariaLabel={title}>
      <ul className="grid grid-cols-2 overflow-hidden rounded-card border border-border sm:grid-cols-4 lg:grid-cols-7">
        {network.map((p) => (
          <li key={p.name} className="-mb-px -mr-px border-b border-r border-border">
            <SmartLink
              href={p.href}
              className="flex h-20 items-center justify-center px-6 opacity-70 grayscale transition-opacity duration-200 hover:opacity-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
              <img src={p.logo} alt={p.name} className="max-h-7 w-auto max-w-full" loading="lazy" />
            </SmartLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
