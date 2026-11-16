import type { Metadata } from "next";
import clsx from "clsx";
import { site } from "@/content/site";
import { Container, EmptyState, JoinUs, PageHeader, PostCard, Reveal, Section } from "@/components";
import { getFeaturedPosts, getPostList, postHref } from "@/lib/blog";
import { blogCopy as copy } from "@/content/pages";

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

  // Outline: h1 (page) -> h2 (Featured, visually hidden; All posts, visible)
  // -> h3 (each PostCard title). The page ends directly in Join Us, whose
  // contact line carries the story pitch.
  return (
    <>
      <PageHeader title={copy.title} intro={copy.intro} />

      {posts.length === 0 ? (
        <Section ariaLabel={copy.all.title} space="none" className="pb-[var(--section-space)]">
          <EmptyState title={copy.empty.title}>{copy.empty.body}</EmptyState>
        </Section>
      ) : (
        <>
          {featured.length > 0 && (
            <section
              id="featured"
              aria-labelledby="featured-title"
              className={showArchive ? undefined : "pb-[var(--section-space)]"}
            >
              <Container>
                <h2 id="featured-title" className="visually-hidden">
                  {copy.featured.title}
                </h2>
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
              </Container>
            </section>
          )}

          {showArchive && (
            <Section
              id="all-posts"
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

      <JoinUs contactPrompt={copy.pitch} />
    </>
  );
}
