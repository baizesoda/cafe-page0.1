import Plate from "@/components/Plate";

type Props = {
  spanFrom: string;
  spanTo: string;
  counts: { events: number; people: number; places: number };
};

/** 开场：书名、一句话主张、年代跨度，以及这份长卷都放了些什么。 */
export default function Hero({ spanFrom, spanTo, counts }: Props) {
  return (
    <header className="mx-auto flex min-h-[86vh] max-w-[1200px] flex-col justify-center px-6 py-24 md:pl-16">
      <p className="lab-label flex items-center gap-2">
        <span aria-hidden className="inline-block h-px w-8 bg-accent" />
        <span className="en">READING LOG</span> · <span className="zh">个人阅读长卷</span>
      </p>
      <h1 className="mt-6 font-display text-[56px] leading-[1.3] font-medium text-ink">
        全球上瘾
      </h1>
      <p className="mt-4 font-display text-2xl text-ink-2">咖啡如何搅动人类历史</p>

      {/* 中文正文一律写成字符串拼接：JSX 会把源码里的换行折成一个空格，
          中文里那个空格是看得见的脏东西。 */}
      <p className="mt-8 max-w-2xl text-xl leading-[1.9] text-ink">
        {"一种让人清醒的黑色苦水，从也门的夜里出发，先被当成毒药和暴动的由头，" +
          "再变成欧洲的公共客厅、国王的税收、殖民地的作物，" +
          "最后成了可以在交易所里买空卖空、并且值得烧掉的东西。"}
      </p>

      {/* 卷首图版：与正文同宽（max-w-2xl），不做全出血 */}
      <div className="mt-10 max-w-2xl">
        <Plate
          file="plates/plate-00-branch.jpg"
          numeral="0"
          caption="咖啡枝上的红果，与生豆、焙豆"
          alt="一枝挂着深红咖啡果的枝条摊在米色纸上，旁边分放着青绿生豆和深褐焙豆。"
          priority
        />
      </div>

      <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm text-ink-2">
        <div>
          <dt className="lab-label">年代跨度</dt>
          <dd className="data-num mt-2 text-2xl font-medium">
            {spanFrom}–{spanTo}
          </dd>
        </div>
        <div>
          <dt className="lab-label">时间轴</dt>
          <dd className="mt-2 text-2xl font-medium">
            <span className="data-num">{counts.events}</span>
            <span className="ml-2 text-sm text-ink-2">条事件</span>
          </dd>
        </div>
        <div>
          <dt className="lab-label">人与地</dt>
          <dd className="mt-2 text-2xl font-medium">
            <span className="data-num">{counts.people}</span>
            <span className="mx-2 text-sm text-ink-2">人</span>
            <span className="data-num">{counts.places}</span>
            <span className="ml-2 text-sm text-ink-2">地</span>
          </dd>
        </div>
      </dl>

      <p className="mt-8 max-w-2xl text-sm leading-[1.85] text-ink-muted">
        {"每条事件都标了原书章节，可以直接翻回去核对。五卷都是逐章精读。键盘 "}
        <kbd className="data-num border border-rule px-1">←</kbd> /{" "}
        <kbd className="data-num border border-rule px-1">→</kbd> 在事件之间跳转。
      </p>

      {/* 全书跨度尺：规范禁渐变，所以用 1px 刻度线画一把尺，而不是色带 */}
      <div className="mt-8 max-w-2xl" aria-hidden>
        <div className="relative h-4 border-b border-data/40">
          {Array.from({ length: 21 }, (_, i) => (
            <span
              key={i}
              className="absolute bottom-0 w-px bg-data/30"
              style={{ left: `${i * 5}%`, height: i % 5 === 0 ? "12px" : "6px" }}
            />
          ))}
        </div>
        <div className="lab-label mt-2 flex justify-between">
          <span>也门 · 生豆</span>
          <span>圣保罗 · 深焙</span>
        </div>
      </div>

      <p className="lab-label mt-8" aria-hidden>
        <span className="en">↓ SCROLL</span>
      </p>
    </header>
  );
}
