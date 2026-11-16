import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geist-mono";
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
  themeColor: "#09090a",
  colorScheme: "dark",
};

/*
  Accent switch for comparing the site with and without Triton blue.
  `?accent=none` sets <html data-accent="none"> and remembers it;
  `?accent=blue` clears it. Runs before paint, so there is no flash.
*/
/*
  Keyboard focus scrolls instantly: CSS smooth scrolling also animates the
  scroll that brings a newly focused element into view, which lags behind
  Tab on long jumps. Tab switches it off; the next pointer press restores it
  (anchor clicks stay smooth). Explicit scrollIntoView({behavior}) calls are
  unaffected.
*/
const focusScrollScript = `(function(){var d=document.documentElement;document.addEventListener("keydown",function(e){if(e.key==="Tab")d.style.scrollBehavior="auto"},true);document.addEventListener("pointerdown",function(){d.style.scrollBehavior=""},true)})()`;

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
        <script dangerouslySetInnerHTML={{ __html: focusScrollScript }} />
        {/* BDO Grotesk (variable, SIL OFL) is self-hosted; @font-face lives in globals.css. */}
        <link rel="preload" href="/fonts/BDOGrotesk-VF.woff2" as="font" type="font/woff2" crossOrigin="" />
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
