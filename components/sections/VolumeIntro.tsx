import { splitYear, yearText, type Event, type Volume } from "@/lib/types";

type Props = {
  volume: Volume;
  /** 时间轴事件条数（不含旁注） */
  count: number;
  /** 本卷的旁注：书里离开时间线的背景段落 */
  asides: Event[];
};

const ROMAN = ["", "I", "II", "III", "IV", "V"];

/** 卷与卷之间的全屏过场，顺带放本卷的旁注。 */
export default function VolumeIntro({ volume: v, count, asides }: Props) {
  return (
    <section
      id={`volume-${v.n}`}
      className="flex min-h-[68vh] scroll-mt-16 flex-col justify-center border-t border-rule py-16"
    >
      <div className="reveal">
        {/* 章节起始标记：金褐罗马数字 + 下方 2px/40px 短横线，给开头一个"落锤感" */}
        <div className="flex items-baseline gap-4">
          <div>
            <span className="font-display text-[40px] leading-none text-gold">{ROMAN[v.n]}</span>
            <span aria-hidden className="chapter-rule mt-2" />
          </div>
          <span className="lab-label">
            <span className="en">VOL.{v.n}</span> · <span className="zh">{v.era}</span>
          </span>
        </div>
        <h2 className="mt-6 font-display text-5xl font-medium text-ink">{v.title}</h2>
        <p className="mt-4 max-w-2xl text-xl leading-[1.9] text-ink">{v.oneLiner}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-muted">
          <span className="data-num">P.{v.pageRange[0]}–{v.pageRange[1]}</span>
          <span>
            <span className="data-num">{count}</span> 条事件
            {v.depth === "full" ? "（精读）" : "（里程碑骨架）"}
          </span>
        </div>
      </div>

      {asides.length > 0 && (
        <div className="reveal mt-8">
          <h3 className="lab-label">
            <span className="en">ASIDE</span> · <span className="zh">题外话</span>
          </h3>
          {/* 三列铺满内容区（design-spec.md 5.3），gap 24px */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {asides.map((a) => (
              <article
                key={a.id}
                id={a.id}
                className="regmarks relative scroll-mt-24 border border-rule bg-surface p-8 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-accent hover:shadow-[var(--shadow-card-hover)]"
              >
                <header className="flex flex-wrap items-baseline gap-x-2">
                  <span className="data-num text-base font-medium">
                    {splitYear(yearText(a))[0]}
                    {splitYear(yearText(a))[1] && (
                      <span className="zh ml-1">{splitYear(yearText(a))[1]}</span>
                    )}
                  </span>
                  <span className="lab-label en">CH.{a.chapter} · P.{a.source.page}</span>
                </header>
                <h4 className="mt-2 font-display text-[19px] leading-snug font-semibold text-ink">
                  {a.title}
                </h4>
                <p className="mt-2 text-[15px] leading-[1.85] text-ink">{a.summary}</p>
                {a.quote && (
                  <blockquote className="mt-5 border-l-2 border-accent pl-4 text-sm leading-[1.85] text-ink-muted">
                    {a.quote}
                  </blockquote>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
