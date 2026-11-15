import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { Button, Container, Eyebrow, JoinUs, Prose, formatDate } from "@/components";
import { getAllPosts, getPost, postHref } from "@/lib/blog";
import { blogCopy as copy } from "@/lib/copy";
import { BackLink } from "@/lib/page-ui";
import { PostBody } from "./mdx";

// Only posts in content/blog exist; anything else is a 404 (required for static export).
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: { canonical: postHref(post.slug) },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: postHref(post.slug),
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <article className="pt-12 pb-[var(--section-space)] sm:pt-16 lg:pt-20">
        <Container size="prose">
          <header className="flex flex-col gap-5 border-b border-border pb-10 sm:pb-12">
            <BackLink href="/blog/">{copy.post.back}</BackLink>
            <Eyebrow as="div" className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-subtle sm:mt-10">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {[post.author, copy.post.readTime(post.readingMinutes)].filter(Boolean).map((item) => (
                <span key={item} className="inline-flex items-center gap-3">
                  <span aria-hidden className="size-1 rounded-full bg-border-strong" />
                  {item}
                </span>
              ))}
            </Eyebrow>
            <h1 className="text-h1 text-fg">{post.title}</h1>
            <p className="text-lg text-fg-muted">{post.summary}</p>
          </header>

          <Prose className="pt-10 sm:pt-12">
            <PostBody source={post.body} />
          </Prose>

          <footer className="mt-14 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <BackLink href="/blog/">{copy.post.back}</BackLink>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-fg-muted">{copy.post.endPrompt}</span>
              <Button href={site.links.discord} size="sm">
                {copy.post.discord}
              </Button>
            </div>
          </footer>
        </Container>
      </article>
      <JoinUs />
    </>
  );
}
