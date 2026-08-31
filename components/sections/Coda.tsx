/** 收尾：结语 + 书目 + 用途声明。 */
export default function Coda() {
  return (
    <footer className="mx-auto max-w-[1200px] border-t border-rule px-6 py-24 md:pl-16">
      <p className="lab-label en">CODA</p>
      <h2 className="mt-4 font-display text-4xl font-medium text-ink">读完之后</h2>
      {/* 中文正文写成字符串拼接：JSX 的换行会变成一个空格 */}
      <div className="mt-6 max-w-2xl space-y-4 text-[15px] leading-[1.85] text-ink">
        <p>
          {"雅各布写的其实不是一部饮品史。咖啡在这本书里始终是别的东西的载体：" +
            "先是宗教对清醒的争夺，然后是医生对身体的判决，接着是国王对税收的算计，" +
            "最后是交易所对预期的赌博。同一杯东西，在麦加是暴动的证据，" +
            "在伦敦是政党的据点，在柏林是宫廷医生的处方，在圣保罗是需要焚烧的库存。"}
        </p>
        <p>
          {"它也不是一条上升的曲线。禁令、垄断、封锁、锈病、投机、焚烧——" +
            "几乎每一次咖啡被推得更远，都是因为有人试图控制它而失败了。"}
        </p>
      </div>

      <dl className="mt-12 max-w-2xl space-y-3 text-sm text-ink-2">
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-ink-muted">原书</dt>
          <dd>
            {"海因里希·爱德华·雅各布《全球上瘾：咖啡如何搅动人类历史》，" +
              "广东人民出版社，2019。全 5 卷 25 章。"}
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-ink-muted">页码</dt>
          <dd>
            所有 <span className="tabular-nums">p.xx</span>
            {" 均为该电子版的 PDF 页序（共 310 页），与纸书页码可能有偏移。"}
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-ink-muted">摘要</dt>
          <dd>事件摘要是我自己的转述；引文为短引，只用来定位原文。</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-ink-muted">数据</dt>
          <dd>
            {"只录书中明确写出的数字。推算值（由“翻了十倍”这类表述折算）" +
              "在图上画成空心点并注明。"}
          </dd>
        </div>
      </dl>

      <p className="mt-10 text-xs text-ink-muted">
        本页仅供个人阅读记录，未公开部署。
      </p>
    </footer>
  );
}
