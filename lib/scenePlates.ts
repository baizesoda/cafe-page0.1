/**
 * 事件插图（design-spec.md 5.6 的图版规格，图注前缀用 FIG.）。
 * 按事件 id 挂图：只给书里画面感最强的那些事件配图，不是每条都配——
 * 时间轴的主体是文字，图是偶尔出现的插页。
 */
export type ScenePlate = { file: string; caption: string; alt: string };

export const SCENE_PLATES: Record<string, ScenePlate> = {
  "yemen-goats-insomnia": {
    file: "gallery/scene-yemen-goats.jpg",
    caption: "夜里不肯睡的羊群",
    alt: "月光下的也门山坡，一群山羊在灌木间走动，披长袍的牧人站在石墙边看着它们。",
  },
  "mecca-coffee-trial": {
    file: "gallery/scene-mecca-trial.jpg",
    caption: "麦加的宗教学者议事",
    alt: "铺着地毯的厅堂里一群戴头巾的学者围坐议事，中央地上放着一只小铜壶和几只咖啡杯。",
  },
  "constantinople-first-coffeehouses": {
    file: "gallery/scene-constantinople-house.jpg",
    caption: "金角湾边的咖啡馆",
    alt: "石砌拱门内的咖啡馆，客人盘腿坐在长凳上下棋闲谈，窗外是海湾与船桅。",
  },
  "vienna-siege-1683": {
    file: "gallery/scene-vienna-siege.jpg",
    caption: "城墙外的围城营地",
    alt: "晨雾中城墙外绵延的军队帐篷营地，远处是维也纳的尖塔轮廓。",
  },
  "coffee-sacks-spoils": {
    file: "gallery/scene-camel-feed.jpg",
    caption: "被当成饲料的战利品",
    alt: "废弃营地上散落着几百只鼓胀的麻袋，袋口漏出深色生咖啡豆，一个人蹲着抓起一把查看。",
  },
  "soliman-aga-audience": {
    file: "gallery/scene-versailles-envoy.jpg",
    caption: "奥斯曼使节的咖啡",
    alt: "铺地毯的厅内，穿长袍戴头巾的使节坐着，仆从用小铜壶给戴假发的法国贵族倒咖啡。",
  },
  "cafe-procope-opens": {
    file: "gallery/scene-procope.jpg",
    caption: "巴黎的文人咖啡馆",
    alt: "镜面墙与大理石小圆桌的咖啡馆，戴假发的文人围桌争论，侍者端着小咖啡杯穿行。",
  },
  "e-1723-martinique": {
    file: "gallery/scene-martinique.jpg",
    caption: "栽进火山土的树苗",
    alt: "热带山坡上，一名海军军官把一株小咖啡树苗栽进土里，几个人在旁边看着。",
  },
  "e-1808-chicory-substitute": {
    file: "gallery/scene-chicory.jpg",
    caption: "菊苣根做的代用咖啡",
    alt: "木桌上摊着切开烘烤过的菊苣根、一台手摇研磨机和几只装着深褐色粉末的粗陶罐。",
  },
  "e-1874-submarine-cable": {
    file: "gallery/scene-cable.jpg",
    caption: "电报房里的行情",
    alt: "电报房内报务员趴在桌上抄收电报，桌上是黄铜电报机和一叠电报纸，墙上挂着线路图。",
  },
  "e-1867-ceylon-leaf-rust": {
    file: "gallery/scene-ceylon-rust.jpg",
    caption: "叶背的橙色锈斑",
    alt: "咖啡树叶背面布满橙黄色锈斑，成片枯萎的树丛间有一名工人在查看叶子。",
  },
  "e-1888-lei-aurea": {
    file: "gallery/scene-brazil-plantation.jpg",
    caption: "红土坡上的咖啡垄",
    alt: "红土山坡上一望无际的咖啡树垄行，工人背着藤筐在垄间采摘，远处是庄园房舍。",
  },
};

/** 图版编号按上面的声明顺序固定下来，页面上就是 FIG. 1 一路数到 FIG. 12。 */
const ORDER = Object.keys(SCENE_PLATES);

export function scenePlate(eventId: string): (ScenePlate & { numeral: string }) | undefined {
  const p = SCENE_PLATES[eventId];
  if (!p) return undefined;
  return { ...p, numeral: String(ORDER.indexOf(eventId) + 1) };
}
