import type { Metadata } from "next";
import { site } from "@/content/site";
import { teams } from "@/content/team";
import { JoinUs, PageHeader } from "@/components";
import { teamCopy as copy } from "@/content/pages";
import { TeamRoster } from "./TeamRoster";

export const metadata: Metadata = {
  title: copy.title,
  description: `${copy.intro} Meet the people behind ${site.name}.`,
  alternates: { canonical: "/team/" },
  openGraph: { title: `${copy.title} · ${site.name}`, description: copy.intro, url: "/team/" },
};

export default function TeamPage() {
  return (
    <>
      <PageHeader title={copy.title} intro={copy.intro} align="center" />
      <TeamRoster teams={teams} />
      <JoinUs />
    </>
  );
}
