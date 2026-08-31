import { yearText, type Event, type Volume } from "@/lib/types";

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
        <div className="flex items-baseline gap-3 text-ink-muted">
          <span className="data-num text-4xl tracking-widest text-accent">{ROMAN[v.n]}</span>
          <span className="lab-label">VOL.{v.n} · {v.era}</span>
        </div>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-wide text-ink sm:text-5xl">{v.title}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{v.oneLiner}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-muted">
          <span className="data-num">P.{v.pageRange[0]}–{v.pageRange[1]}</span>
          <span>
            <span className="data-num">{count}</span> 条事件
            {v.depth === "full" ? "（精读）" : "（里程碑骨架）"}
          </span>
        </div>
      </div>

      {asides.length > 0 && (
        <div className="reveal mt-10 max-w-2xl">
          <h3 className="lab-label">ASIDE · 题外话</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {asides.map((a) => (
              <article
                key={a.id}
                id={a.id}
                className="scroll-mt-24 rounded-lg border border-dashed border-rule bg-surface p-4"
              >
                <header className="flex flex-wrap items-baseline gap-x-2 text-[11px] text-ink-muted">
                  <span className="data-num text-ink-2">{yearText(a)}</span>
                  <span className="lab-label">CH.{a.chapter} · P.{a.source.page}</span>
                </header>
                <h4 className="mt-1 leading-snug font-medium text-ink">{a.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{a.summary}</p>
                {a.quote && (
                  <blockquote className="mt-2 border-l-2 border-accent-2 pl-2.5 text-xs leading-relaxed text-ink-2">
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
