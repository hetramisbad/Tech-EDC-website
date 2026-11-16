import type { Team } from "@/content/team";
import { site } from "@/content/site";
import { Badge, Button, Container, EmptyState, Section, TeamCard } from "@/components";
import { teamCopy as copy } from "@/content/pages";

function teamId(name: string) {
  return `team-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

/** Leadership first, then the rest in content order. Empty teams are dropped. */
function orderTeams(teams: Team[]) {
  const withMembers = teams.filter((t) => t.members.length > 0);
  const lead = withMembers.filter((t) => t.name.trim().toLowerCase() === "leadership");
  return [...lead, ...withMembers.filter((t) => !lead.includes(t))];
}

/** Roster body for /team. Renders the empty state when there is nobody to show. */
export function TeamRoster({ teams }: { teams: Team[] }) {
  const ordered = orderTeams(teams);

  if (ordered.length === 0) {
    return (
      <Section ariaLabel={copy.empty.title} space="none" size="narrow">
        <EmptyState
          title={copy.empty.title}
          className="py-20 sm:py-24"
          actions={
            <>
              <Button href={site.links.discord} size="md">
                {copy.empty.cta}
              </Button>
              <Button href={`mailto:${site.email}`} variant="secondary" size="md" iconLeft="mail">
                {copy.empty.email}
              </Button>
            </>
          }
        >
          {copy.empty.body}
        </EmptyState>
      </Section>
    );
  }

  return (
    <>
      {ordered.length > 1 && (
        <Container>
          <nav aria-label={copy.jumpLabel}>
            <ul className="flex flex-wrap justify-center gap-2">
              {ordered.map((t) => (
                <li key={t.name}>
                  <Badge href={`#${teamId(t.name)}`}>{t.name}</Badge>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      )}
      {ordered.map((t) => (
        <Section key={t.name} id={teamId(t.name)} title={t.name} space="tight">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {t.members.map((m) => (
              <li key={`${m.name}-${m.role}`}>
                <TeamCard {...m} />
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  );
}
