import { splitYear, yearText, type Event, type Place } from "@/lib/types";

type Props = {
  event: Event;
  place?: Place;
  active: boolean;
};

/** 时间轴上的一条事件。年份、原书章节与页码都在卡片头部，方便随时翻回去核对。 */
export default function EventCard({ event: e, place, active }: Props) {
  const label = yearText(e);
  const [num, suffix] = splitYear(label);
  const longLabel = label.length > 6;

  return (
    <li
      id={e.id}
      data-active={active || undefined}
      className="relative scroll-mt-24 pb-8 pl-8 sm:pl-10"
    >
      {/* 轴上的圆点：已读实心红褐，未读空心。规范禁止缩放，所以当前点只换色不放大 */}
      <span
        aria-hidden
        className={[
          "spine-dot absolute top-4 left-[9px] size-2 rounded-full",
          "sm:left-[13px]",
          active ? "bg-accent" : "border-[1.5px] border-axis bg-plane",
        ].join(" ")}
        data-on={active || undefined}
      />

      <article
        className={[
          "regmarks reveal relative border bg-surface p-6 shadow-[var(--shadow-card)]",
          "transition-[border-color,box-shadow] duration-200 ease-out",
          "hover:border-accent hover:shadow-[var(--shadow-card-hover)]",
          active ? "border-accent" : "border-rule",
        ].join(" ")}
        data-on={active || undefined}
      >
        <header className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span
            className={[
              "data-num font-medium",
              longLabel ? "text-base" : "text-2xl",
            ].join(" ")}
          >
            {num}
            {suffix && <span className="zh ml-1 text-base">{suffix}</span>}
          </span>
          <span className="lab-label en">
            CH.{e.chapter} · P.{e.source.page}
          </span>
        </header>

        <h3 className="mt-2 font-display text-[19px] leading-snug font-semibold text-ink">
          {e.title}
        </h3>
        <p className="mt-2 text-[15px] leading-[1.85] text-ink">{e.summary}</p>

        {e.quote && (
          <blockquote className="mt-5 border-l-2 border-accent pl-4 text-sm leading-[1.85] text-ink-muted">
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
            <span key={t} className="border border-rule bg-plane px-2 py-px">
              {t}
            </span>
          ))}
          {e.approx && <span>年代为约值</span>}
        </footer>
      </article>
    </li>
  );
}
