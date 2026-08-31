export type Tag = "科学" | "政治" | "经济" | "文化" | "殖民";

export type Event = {
  id: string;
  year: number;
  yearLabel?: string;
  approx?: boolean;
  title: string;
  summary: string;
  quote?: string;
  placeId?: string;
  volume: VolumeNo;
  chapter: number;
  source: { page: number };
  tags?: Tag[];
  /** 旁注：书里离开时间线的背景/科学段落，挂在卷首，不占年份刻度。 */
  aside?: boolean;
};

export type Person = {
  id: string;
  name: string;
  originalName?: string;
  life?: string;
  role: string;
  blurb: string;
  source: { page: number };
};

export type Place = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  firstYear?: number;
};

export type VolumeNo = 1 | 2 | 3 | 4 | 5;

export type Volume = {
  n: VolumeNo;
  title: string;
  era: string;
  oneLiner: string;
  pageRange: [number, number];
  depth: "full" | "skeleton";
};

export type Series = {
  id: string;
  label: string;
  unit: string;
  points: {
    year: number;
    value: number;
    /** 书里这个数字的原话，用来回溯出处 */
    note?: string;
    /** true = 书里只给了倍数，由前一个数字推算，图上画成空心点 */
    derived?: boolean;
  }[];
  /** 有 derived 的点时必须写：说明哪些数字是推算的 */
  caveat?: string;
  source: { page: number };
};

/** 左侧导轨上的一章。id 为空表示这一章在本长卷里没有摘录事件，只画刻度不可点。 */
export type ChapterNode = {
  n: number;
  id: string | null;
  year: string;
  title: string;
};

/** 事件的显示年份：书里含糊时用 yearLabel。 */
export function yearText(e: Event): string {
  return e.yearLabel ?? String(e.year);
}

/**
 * 年份标签拆成「数字部分 / 中文尾巴」，例如 "1450 年前后" → ["1450", "年前后"]。
 * 数字要等宽 + 字距，中文尾巴必须字距归零，所以只能分开渲染。
 * 整条都没有数字（如"年代不详（也门传说）"）时数字位留空，全部当中文处理。
 */
export function splitYear(label: string): [string, string] {
  const m = /^([\d\s–-]+)(.*)$/.exec(label);
  if (!m) return ["", label];
  return [m[1].trim(), m[2].trim()];
}

/** 小地图：坐标已在 tools/build-map.mjs 里投影好，客户端不需要 d3-geo。 */
export type MapData = {
  width: number;
  height: number;
  landPath: string;
  points: Record<string, [number, number]>;
};
