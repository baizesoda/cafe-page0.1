import { yearText, type Event, type Place } from "@/lib/types";

type Props = {
  event: Event;
  place?: Place;
  active: boolean;
  /** 桌面端左右交错时，这张卡落在哪一列 */
  side: "left" | "right";
};

/** 时间轴上的一条事件。年份、原书章节与页码都在卡片头部，方便随时翻回去核对。 */
export default function EventCard({ event: e, place, active, side }: Props) {
  const label = yearText(e);
  const longLabel = label.length > 6;

  return (
    <li
      id={e.id}
      data-active={active || undefined}
      className="relative scroll-mt-24 pb-10 pl-9 sm:pl-11 xl:grid xl:grid-cols-2 xl:gap-x-14 xl:pl-0"
    >
      {/* 轴上的圆点 */}
      <span
        aria-hidden
        className={[
          "spine-dot absolute top-3 left-[9px] size-[9px] rounded-full ring-2 ring-plane",
          "sm:left-[13px] xl:left-1/2 xl:-ml-[4.5px]",
          active ? "bg-accent scale-125" : "bg-axis",
        ].join(" ")}
        data-on={active || undefined}
      />

      <article
        className={[
          "brackets reveal relative rounded-xl border bg-surface p-4 shadow-[0_1px_2px_var(--ring)] transition-[border-color,box-shadow] duration-300 hover:shadow-[0_12px_32px_-14px_var(--ring-strong)] sm:p-5",
          active
            ? "border-accent shadow-[0_12px_32px_-14px_var(--ring-strong)]"
            : "border-rule",
          side === "right" ? "xl:col-start-2" : "xl:col-start-1",
        ].join(" ")}
        data-on={active || undefined}
      >
        <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            className={[
              "data-num font-medium text-ink",
              longLabel ? "text-base" : "text-2xl",
            ].join(" ")}
          >
            {label}
          </span>
          <span className="lab-label">
            CH.{e.chapter} · P.{e.source.page}
          </span>
        </header>

        <h3 className="mt-1.5 text-lg leading-snug font-medium text-ink">{e.title}</h3>
        <p className="mt-2 leading-relaxed text-ink-2">{e.summary}</p>

        {e.quote && (
          <blockquote className="mt-3 border-l-2 border-accent-2 pl-3 text-sm leading-relaxed text-ink-2">
            {e.quote}
          </blockquote>
        )}

        <footer className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-ink-muted">
          {place && (
            <span className="flex items-center gap-1">
              <span
                aria-hidden
                className={[
                  "inline-block size-1.5 rounded-full",
                  active ? "bg-accent" : "bg-axis",
                ].join(" ")}
              />
              {place.name}
            </span>
          )}
          {e.tags?.map((t) => (
            <span key={t} className="rounded-sm border border-rule bg-plane px-1.5 py-px tracking-wide">
              {t}
            </span>
          ))}
          {e.approx && <span>年代为约值</span>}
        </footer>
      </article>
    </li>
  );
}
