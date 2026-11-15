import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/content/site";

// Placeholder layout from Lead. Design agent owns and replaces this file.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
