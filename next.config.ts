import type { NextConfig } from "next";

// Static export: `npm run build` writes plain HTML/CSS/JS to out/ that any host
// (GoDaddy, GitHub Pages, etc.) can serve. Do not add server-only features.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // /team -> /team/index.html, works on plain Apache hosts
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
