// Team roster for /team. EMPTY until officers send names and photos.
// When `teams` is empty, /team shows a "Roster coming soon" state.
// Photos go in public/team/<slug>.jpg (square, at least 400x400).

export type Member = {
  name: string;
  role: string;
  photo?: string; // e.g. "/team/jane-doe.jpg"; omit to show initials
  links?: { label: string; href: string }[];
};

export type Team = { name: string; members: Member[] };

export const teams: Team[] = [
  // Example shape (uncomment and edit):
  // {
  //   name: "Leadership",
  //   members: [{ name: "Jane Doe", role: "President", photo: "/team/jane-doe.jpg" }],
  // },
];
