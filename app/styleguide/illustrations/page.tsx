import type { Metadata } from "next";
import type { ComponentType } from "react";
import {
  Container,
  IsoBuildCohort,
  IsoBuildathon,
  IsoCommunity,
  IsoHero,
  IsoJoin,
  IsoMentorship,
  IsoNotFound,
  PageHeader,
  type IllustrationProps,
} from "@/components";

export const metadata: Metadata = {
  title: "Illustrations",
  description: "Tech@EDC isometric line illustrations.",
  robots: { index: false, follow: false },
};

const items: { name: string; C: ComponentType<IllustrationProps> }[] = [
  { name: "IsoHero", C: IsoHero },
  { name: "IsoCommunity", C: IsoCommunity },
  { name: "IsoBuildCohort", C: IsoBuildCohort },
  { name: "IsoMentorship", C: IsoMentorship },
  { name: "IsoBuildathon", C: IsoBuildathon },
  { name: "IsoJoin", C: IsoJoin },
  { name: "IsoNotFound", C: IsoNotFound },
];

/** Large renders of every illustration (QA + review). Linked from /styleguide/. */
export default function IllustrationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Styleguide"
        title="Illustrations"
        intro="Seven original isometric drawings at 480px (the hero at 720px). Same projection, stroke weight and face tones throughout. Import from @/components."
      />
      <Container className="grid gap-x-12 gap-y-20 pb-24 lg:grid-cols-2">
        {items.map(({ name, C }) => (
          <figure key={name} id={name} className={name === "IsoHero" ? "flex flex-col gap-4 border-t border-border pt-8 lg:col-span-2" : "flex flex-col gap-4 border-t border-border pt-8"}>
            <C className={name === "IsoHero" ? "w-[720px] max-w-full text-fg-secondary" : "w-[480px] max-w-full text-fg-secondary"} />
            <figcaption className="font-mono text-sm text-fg-muted">&lt;{name} /&gt;</figcaption>
          </figure>
        ))}
      </Container>
    </>
  );
}
