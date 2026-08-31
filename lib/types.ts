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

/** 事件的显示年份：书里含糊时用 yearLabel。 */
export function yearText(e: Event): string {
  return e.yearLabel ?? String(e.year);
}

/** 小地图：坐标已在 tools/build-map.mjs 里投影好，客户端不需要 d3-geo。 */
export type MapData = {
  width: number;
  height: number;
  landPath: string;
  points: Record<string, [number, number]>;
};
