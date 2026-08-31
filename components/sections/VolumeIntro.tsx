import Plate from "@/components/Plate";
import { splitYear, yearText, type Event, type Volume } from "@/lib/types";

type Props = {
  volume: Volume;
  /** 时间轴事件条数（不含旁注） */
  count: number;
  /** 本卷的旁注：书里离开时间线的背景段落 */
  asides: Event[];
};

const ROMAN = ["", "I", "II", "III", "IV", "V"];

/** 每卷卷首图版（design-spec.md 5.6）。按卷号取，缺图就不渲染。 */
const PLATES: Record<number, { file: string; caption: string; alt: string }> = {
  1: {
    file: "plates/plate-01-yemen.jpg",
    caption: "也门山地的咖啡梯田",
    alt: "也门干旱山坡上层层石砌梯田，种着矮咖啡树，几只山羊在坡上，远处是赭石色群山。",
  },
  2: {
    file: "plates/plate-02-coffeehouse.jpg",
    caption: "十七世纪咖啡馆的内堂",
    alt: "光线昏暗的十七世纪咖啡馆内堂，长木桌上有一支蜡烛、一只铜壶和几只小杯，墙上贴着告示。",
  },
  3: {
    file: "plates/plate-03-voyage.jpg",
    caption: "甲板上被绑住的咖啡树苗",
    alt: "帆船甲板上一只玻璃罩里养着一株咖啡树苗，罩子用绳索绑在栏杆上，背景是海面。",
  },
  4: {
    file: "plates/plate-04-exchange.jpg",
    caption: "十九世纪交易所的行情板",
    alt: "十九世纪交易所一角，黑板上用粉笔写着行情，桌上有黄铜电报键和几本厚账簿。",
  },
  5: {
    file: "plates/plate-05-santos.jpg",
    caption: "1931 年，桑托斯港焚烧咖啡",
    alt: "露天场地上成堆的咖啡麻袋正在燃烧，浓烟升起，几个工人站在远处看。",
  },
};

/** 卷与卷之间的全屏过场，顺带放本卷的旁注。 */
export default function VolumeIntro({ volume: v, count, asides }: Props) {
  const plate = PLATES[v.n];
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
          <span>
            <span className="data-num">{count}</span> 条事件
            {v.depth === "full" ? "（精读）" : "（里程碑骨架）"}
          </span>
        </div>
      </div>

      {plate && (
        <div className="reveal mt-10 max-w-2xl">
          <Plate
            file={plate.file}
            numeral={ROMAN[v.n]}
            caption={plate.caption}
            alt={plate.alt}
          />
        </div>
      )}

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
                  <span className="lab-label en">CH.{a.chapter}</span>
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
