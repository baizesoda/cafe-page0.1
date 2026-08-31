type Props = {
  spanFrom: string;
  spanTo: string;
  counts: { events: number; people: number; places: number };
};

/** 开场：书名、一句话主张、年代跨度，以及这份长卷都放了些什么。 */
export default function Hero({ spanFrom, spanTo, counts }: Props) {
  return (
    <header className="mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-center px-4 py-20 xl:max-w-[84rem]">
      <p className="lab-label flex items-center gap-3">
        <span aria-hidden className="inline-block h-px w-10 bg-accent-2" />
        READING LOG · 个人阅读长卷
      </p>
      <h1 className="mt-6 font-display text-5xl leading-tight font-medium tracking-wide text-ink sm:text-7xl">
        全球上瘾
      </h1>
      <p className="mt-4 font-display text-xl text-ink-2 sm:text-3xl">咖啡如何搅动人类历史</p>

      {/* 中文正文一律写成字符串拼接：JSX 会把源码里的换行折成一个空格，
          中文里那个空格是看得见的脏东西。 */}
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2 sm:text-xl">
        {"一种让人清醒的黑色苦水，从也门的夜里出发，先被当成毒药和暴动的由头，" +
          "再变成欧洲的公共客厅、国王的税收、殖民地的作物，" +
          "最后成了可以在交易所里买空卖空、并且值得烧掉的东西。"}
      </p>

      <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm text-ink-2">
        <div>
          <dt className="lab-label">年代跨度</dt>
          <dd className="data-num mt-1.5 text-2xl font-medium text-ink">
            {spanFrom}–{spanTo}
          </dd>
        </div>
        <div>
          <dt className="lab-label">时间轴</dt>
          <dd className="mt-1.5 text-2xl font-medium text-ink">
            <span className="data-num">{counts.events}</span>
            <span className="ml-1 text-sm text-ink-2">条事件</span>
          </dd>
        </div>
        <div>
          <dt className="lab-label">人与地</dt>
          <dd className="mt-1.5 text-2xl font-medium text-ink">
            <span className="data-num">{counts.people}</span>
            <span className="mx-1 text-sm text-ink-2">人</span>
            <span className="data-num">{counts.places}</span>
            <span className="ml-1 text-sm text-ink-2">地</span>
          </dd>
        </div>
      </dl>

      <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-muted">
        每条事件都标了原书章节和页码（<span className="tabular-nums">p.xx</span>）
        {"，可以直接翻回去核对。第一、二卷逐章精读，第三至五卷只留里程碑。键盘 "}
        <kbd className="rounded border border-rule px-1">j</kbd> /{" "}
        <kbd className="rounded border border-rule px-1">k</kbd> 在事件之间跳转。
      </p>

      <div className="mt-12 max-w-2xl" aria-hidden>
        <div className="roast-strip h-1.5 w-full rounded-full opacity-80" />
        <div className="lab-label mt-2 flex justify-between">
          <span>生豆 / 也门</span>
          <span>深焙 / 圣保罗</span>
        </div>
      </div>

      <p className="lab-label mt-10" aria-hidden>
        ↓ SCROLL
      </p>
    </header>
  );
}
