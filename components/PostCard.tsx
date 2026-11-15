import clsx from "clsx";
import { Card } from "./Card";
import { ArrowLink } from "./ArrowLink";
import { Eyebrow } from "./Eyebrow";

export type PostCardProps = {
  title: string;
  /** ISO date "YYYY-MM-DD". Formatted as "Nov 15, 2026" (UTC, en-US) at build time. */
  date: string;
  summary: string;
  href: string;
  author?: string;
  /** Larger layout for the featured row on /blog. */
  featured?: boolean;
  className?: string;
};

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

/** Blog post card. The whole card is the link. */
export function PostCard({ title, date, summary, href, author, featured = false, className }: PostCardProps) {
  return (
    <Card href={href} padding={featured ? "lg" : "md"} className={clsx(className)} footer={<ArrowLink>Read post</ArrowLink>}>
      <div className="flex flex-col gap-3">
        <Eyebrow as="div" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-fg-subtle">
          <time dateTime={date}>{formatDate(date)}</time>
          {author && (
            <>
              <span aria-hidden className="size-1 rounded-full bg-border-strong" />
              <span>{author}</span>
            </>
          )}
        </Eyebrow>
        <h3 className={clsx("text-fg", featured ? "text-h2" : "text-h3")}>{title}</h3>
        <p className={clsx("text-fg-muted", featured ? "text-base sm:text-lg" : "text-sm sm:text-[0.9375rem]")}>{summary}</p>
      </div>
    </Card>
  );
}
