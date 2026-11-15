import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { site } from "@/content/site";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary", title: site.name, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

/*
  Accent switch for comparing the site with and without Triton blue.
  `?accent=none` sets <html data-accent="none"> and remembers it;
  `?accent=blue` clears it. Runs before paint, so there is no flash.
*/
const accentScript = `(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get("accent"),k="tech-edc-accent";if(q==="none"||q==="blue"){localStorage.setItem(k,q)}var v=q||localStorage.getItem(k);if(v==="none"){d.setAttribute("data-accent","none")}}catch(e){}})()`;

/*
  Landmarks: this layout renders <Navbar/> (header), <main id="content"> and
  <Footer/>. Pages must NOT render their own <main>; return sections/fragments.
*/
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: accentScript }} />
      </head>
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
