import clsx from "clsx";

export type TimelineItem = { when: string; title: string; body?: string };

/** Dated vertical steps (program timelines, Buildathon schedule). */
export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={clsx("relative flex flex-col", className)}>
      {items.map((item, i) => (
        <li key={`${item.when}-${i}`} className="relative grid grid-cols-[20px_1fr] gap-x-5 pb-8 last:pb-0 sm:grid-cols-[140px_20px_1fr]">
          <p className="label-mono col-start-2 row-start-1 pb-1 text-fg-muted sm:col-start-1 sm:pt-[3px] sm:pb-0">{item.when}</p>
          <span aria-hidden className="relative col-start-1 row-span-2 row-start-1 flex justify-center sm:col-start-2">
            <span className="relative z-10 mt-1.5 size-2.5 border border-border-hover bg-bg" />
            {i < items.length - 1 && <span className="absolute top-4 -bottom-8 w-px bg-border" />}
          </span>
          <div className="col-start-2 flex flex-col gap-1 sm:col-start-3 sm:row-start-1">
            <h3 className="text-base font-medium text-fg">{item.title}</h3>
            {item.body && <p className="text-sm text-fg-muted">{item.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
