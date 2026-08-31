import Plate from "@/components/Plate";

type Item = { file: string; caption: string; alt: string };

/** 三组图版：喝法、馆子、器具。与时间轴无关，属于"这本书讲的到底是什么东西"的注解。 */
const GROUPS: { title: string; en: string; items: Item[] }[] = [
  {
    title: "喝法",
    en: "PREPARATIONS",
    items: [
      {
        file: "gallery/type-turkish.jpg",
        caption: "土耳其式：铜壶煮沸",
        alt: "长柄黄铜小壶在细沙炉上煮咖啡，泡沫将要溢出，旁边是一只小瓷杯和铜盘。",
      },
      {
        file: "gallery/type-espresso.jpg",
        caption: "意式浓缩",
        alt: "白色厚壁小瓷杯里的意式浓缩咖啡，表面浮着细密的褐色油脂泡沫，旁边散着深焙咖啡豆。",
      },
      {
        file: "gallery/type-pourover.jpg",
        caption: "手冲滴滤",
        alt: "玻璃分享壶上架着陶瓷滤杯，细嘴壶正往滤纸中央注水，蒸汽升起。",
      },
      {
        file: "gallery/type-milk.jpg",
        caption: "加奶：从贵妇的糖开始",
        alt: "宽口陶杯里的牛奶咖啡，奶泡表面有心形拉花，杯下垫着粗麻布。",
      },
      {
        file: "gallery/type-coldbrew.jpg",
        caption: "冷萃",
        alt: "高玻璃杯里深褐色的冷萃咖啡与冰块，旁边立着一只玻璃冷萃瓶。",
      },
      {
        file: "gallery/type-cherries.jpg",
        caption: "源头：树上的红果",
        alt: "竹筐里堆满红色咖啡果，一双手正把果子倒进筐中，背景是咖啡园的绿叶。",
      },
    ],
  },
  {
    title: "馆子",
    en: "COFFEEHOUSES",
    items: [
      {
        file: "gallery/house-ottoman.jpg",
        caption: "奥斯曼：软垫与铜托盘",
        alt: "铺着地毯的咖啡馆内，人们坐在低矮软垫长凳上，铜托盘上摆着小咖啡杯。",
      },
      {
        file: "gallery/house-vienna.jpg",
        caption: "维也纳：大理石桌与报纸",
        alt: "老咖啡馆内的大理石圆桌、藤编椅和黄铜衣帽架，桌上摊着几份报纸。",
      },
      {
        file: "gallery/house-modern.jpg",
        caption: "当代：吧台后面的机器",
        alt: "精品咖啡馆吧台，木质台面上有银色意式咖啡机和成排陶杯，后墙木架放着咖啡豆袋。",
      },
    ],
  },
  {
    title: "器具",
    en: "APPARATUS",
    items: [
      {
        file: "gallery/gear-flatlay.jpg",
        caption: "磨、壶、秤",
        alt: "俯拍平铺的手摇木质磨豆机、黄铜细嘴壶、小型电子秤和一小碟咖啡粉。",
      },
      {
        file: "gallery/gear-lever.jpg",
        caption: "杠杆式咖啡机",
        alt: "老式黄铜杠杆意式咖啡机的特写，可见压力表和木质手柄，机身有使用痕迹。",
      },
      {
        file: "gallery/gear-roaster.jpg",
        caption: "滚筒烘豆机",
        alt: "铸铁滚筒烘豆机旁堆着咖啡麻袋和一箩青绿生豆，工坊窗户透进侧光。",
      },
    ],
  },
];

/** 图版编号接着卷首图版与事件插图往后排，这里从 A 开始，避免和 PLATE / FIG. 撞号。 */
const LETTERS = "ABCDEFGHIJKL".split("");

/** 器物图版区：书里反复出现的喝法、馆子与器具，集中放一处。 */
export default function PlateGallery() {
  let i = 0;
  return (
    <section
      id="plates"
      className="mx-auto max-w-[1200px] scroll-mt-16 border-t border-rule px-6 py-16 md:pl-16"
    >
      <h2 className="lab-label">
        <span className="en">APPENDIX · PLATES</span> · <span className="zh">图版附录</span>
      </h2>
      <p className="mt-4 max-w-2xl text-[15px] leading-[1.85] text-ink-muted">
        {"书里反复出现的三样东西：怎么煮、在哪儿喝、用什么家伙。这一节与时间轴无关，只是把它们摊开看一遍。"}
      </p>

      {GROUPS.map((g) => (
        <div key={g.title} className="mt-10">
          <h3 className="lab-label flex items-center gap-2">
            <span aria-hidden className="inline-block h-px w-8 bg-gold" />
            <span className="en">{g.en}</span> · <span className="zh">{g.title}</span>
          </h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((it) => {
              const numeral = LETTERS[i++];
              return (
                <Plate
                  key={it.file}
                  file={it.file}
                  numeral={numeral}
                  caption={it.caption}
                  alt={it.alt}
                />
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
