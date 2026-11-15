import { programs, type Program } from "@/content/programs";

/**
 * Programs that use the shared /programs/[slug] template. Buildathon has its
 * own page (/buildathon) and is excluded, as is any entry without a body yet.
 */
export function getDetailPrograms(): Program[] {
  return programs.filter((p) => p.slug !== "buildathon" && p.overview.length > 0);
}

export function getDetailProgram(slug: string): Program | undefined {
  return getDetailPrograms().find((p) => p.slug === slug);
}
