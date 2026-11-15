// Blog content loader. Runs at build time only (Server Components,
// generateStaticParams, generateMetadata): reads content/blog/*.mdx with fs +
// gray-matter. The slug is the filename without ".mdx".
//
// Frontmatter (all strings unless noted):
//   title    required
//   date     required, "YYYY-MM-DD" (quoted or unquoted YAML both work)
//   summary  required, one sentence for cards and <meta description>
//   author   optional
//   featured optional boolean; featured posts show in the /blog featured row (max 3)

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  /** ISO "YYYY-MM-DD". */
  date: string;
  summary: string;
  author?: string;
  featured: boolean;
  /** Whole minutes, at ~225 words per minute, minimum 1. */
  readingMinutes: number;
};

export type Post = PostMeta & {
  /** MDX body with the frontmatter stripped. */
  body: string;
};

export const BLOG_DIR = path.join(process.cwd(), "content", "blog");
export const FEATURED_LIMIT = 3;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function toIsoDate(value: unknown, file: string): string {
  // Unquoted YAML dates arrive as Date objects; quoted ones as strings.
  const iso = value instanceof Date ? value.toISOString().slice(0, 10) : typeof value === "string" ? value.trim() : "";
  if (!DATE_RE.test(iso) || Number.isNaN(new Date(`${iso}T00:00:00Z`).getTime())) {
    throw new Error(`[blog] ${file}: "date" must be YYYY-MM-DD, got ${JSON.stringify(value)}`);
  }
  return iso;
}

function requireString(data: Record<string, unknown>, key: string, file: string): string {
  const v = data[key];
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`[blog] ${file}: frontmatter "${key}" is required`);
  }
  return v.trim();
}

function readingMinutes(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

function parseFile(file: string): Post {
  const slug = file.replace(/\.mdx$/, "");
  if (!SLUG_RE.test(slug)) {
    throw new Error(`[blog] ${file}: filename must be lowercase-kebab-case (it becomes the URL)`);
  }
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const author = typeof data.author === "string" && data.author.trim() ? data.author.trim() : undefined;
  return {
    slug,
    title: requireString(data, "title", file),
    date: toIsoDate(data.date, file),
    summary: requireString(data, "summary", file),
    author,
    featured: data.featured === true,
    readingMinutes: readingMinutes(content),
    body: content,
  };
}

function byNewest(a: PostMeta, b: PostMeta) {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  return a.title.localeCompare(b.title);
}

let cache: Post[] | null = null;

/** Every post, newest first (ties broken by title). Includes bodies. */
export function getAllPosts(): Post[] {
  if (cache) return cache;
  const files = fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx")) : [];
  cache = files.map(parseFile).sort(byNewest);
  return cache;
}

/** Card data for every post, newest first (no bodies). */
export function getPostList(): PostMeta[] {
  return getAllPosts().map(({ body: _body, ...meta }) => {
    void _body;
    return meta;
  });
}

/** Featured posts, newest first, at most FEATURED_LIMIT. */
export function getFeaturedPosts(): PostMeta[] {
  return getPostList()
    .filter((p) => p.featured)
    .slice(0, FEATURED_LIMIT);
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function postHref(slug: string) {
  return `/blog/${slug}/`;
}
