import type { Metadata } from "next";
import clsx from "clsx";
import { site } from "@/content/site";
import { Button, EmptyState, JoinUs, PageHeader, PostCard, Reveal, Section } from "@/components";
import { getFeaturedPosts, getPostList, postHref } from "@/lib/blog";
import { blogCopy as copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: copy.title,
  description: copy.intro,
  alternates: { canonical: "/blog/" },
  openGraph: { title: `${copy.title} · ${site.name}`, description: copy.intro, url: "/blog/" },
};

const featuredCols: Record<number, string> = { 1: "", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3" };

export default function BlogIndexPage() {
  const posts = getPostList();
  const featured = getFeaturedPosts();
  // While every post is featured the featured row already is the full list, so
  // the archive would only repeat the same cards. It appears once there is a
  // post outside the featured row.
  const showArchive = posts.length > featured.length;

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />

      {posts.length === 0 ? (
        <Section ariaLabel={copy.all.title} space="none">
          <EmptyState title={copy.empty.title}>{copy.empty.body}</EmptyState>
        </Section>
      ) : (
        <>
          {featured.length > 0 && (
            <Section id="featured" ariaLabel={copy.featured.title} space="none">
              <ul className={clsx("grid gap-4", featuredCols[featured.length])}>
                {featured.map((p) => (
                  <li key={p.slug}>
                    <PostCard
                      featured={featured.length === 1}
                      title={p.title}
                      date={p.date}
                      author={p.author}
                      summary={p.summary}
                      href={postHref(p.slug)}
                    />
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {showArchive && (
            <Section
              id="all-posts"
              eyebrow={copy.all.eyebrow}
              title={copy.all.title}
              actions={<p className="label-mono text-fg-subtle">{copy.all.count(posts.length)}</p>}
            >
              <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((p, i) => (
                  <Reveal as="li" key={p.slug} delay={(i % 3) * 70}>
                    <PostCard
                      title={p.title}
                      date={p.date}
                      author={p.author}
                      summary={p.summary}
                      href={postHref(p.slug)}
                    />
                  </Reveal>
                ))}
              </ol>
            </Section>
          )}
        </>
      )}

      <Section ariaLabel={copy.loop.title} space="none" className={showArchive ? undefined : "pt-[var(--section-space)]"}>
        <div className="flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-[560px] flex-col gap-2">
            <h2 className="text-h3 text-fg">{copy.loop.title}</h2>
            <p className="text-sm text-fg-muted sm:text-base">
              {copy.loop.body}{" "}
              {copy.loop.pitch}{" "}
              <a href={`mailto:${site.email}`} className="link whitespace-nowrap">
                {site.email}
              </a>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href="#newsletter" size="md" icon="arrow-right">
              {copy.loop.subscribe}
            </Button>
            <Button href={site.links.discord} variant="secondary" size="md">
              {copy.loop.discord}
            </Button>
          </div>
        </div>
      </Section>

      <JoinUs />
    </>
  );
}
