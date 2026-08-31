"use client";

import { Fragment } from "react";
import eventsJson from "@/content/events.json";
import peopleJson from "@/content/people.json";
import placesJson from "@/content/places.json";
import volumesJson from "@/content/volumes.json";
import seriesJson from "@/content/series.json";
import { yearText, type ChapterNode, type Event, type Person, type Place, type Series, type Volume } from "@/lib/types";
import { useActiveId, useEventKeys, useReveal } from "@/lib/useActiveEvent";
import MiniMap from "@/components/viz/MiniMap";
import TimelineRail from "./TimelineRail";
import VolumeRail from "./VolumeRail";
import VolumeIntro from "./VolumeIntro";
import EventCard from "./EventCard";
import PeopleWall from "./PeopleWall";
import DataPanel from "./DataPanel";

const events = eventsJson as unknown as Event[];
const people = peopleJson as unknown as Person[];
const places = placesJson as unknown as Place[];
const volumes = volumesJson as unknown as Volume[];
const series = seriesJson as unknown as Series[];

// 下面这些都由静态 JSON 推出来，放模块作用域算一次就好；
// 也让传给 useActiveId 的 ids 保持同一个引用，避免每次渲染都重建 IntersectionObserver。
const ids = events.map((e) => e.id); // 文档顺序：每卷先旁注，再时间轴
const spine = events.filter((e) => !e.aside);
const spineIds = spine.map((e) => e.id); // j/k 的落点
const placeById = new Map(places.map((p) => [p.id, p]));

const routeOrder: string[] = [];
for (const e of events) {
  if (e.placeId && !routeOrder.includes(e.placeId)) routeOrder.push(e.placeId);
}

const counts: Record<number, number> = {};
for (const v of volumes) counts[v.n] = spine.filter((e) => e.volume === v.n).length;

/** 左侧导轨的 25 个节点 = 全书 25 章。第 18、25 章在本长卷里没有摘录，只画刻度不可点。 */
const TOTAL_CHAPTERS = 25;
const chapterNodes: ChapterNode[] = Array.from({ length: TOTAL_CHAPTERS }, (_, i) => {
  const n = i + 1;
  const first = spine.find((e) => e.chapter === n);
  return {
    n,
    id: first?.id ?? null,
    year: first ? yearText(first) : "",
    title: first?.title ?? "",
  };
});

/** 人物按 source.page 落在哪一卷的 pageRange 里分组 */
const peopleByVolume = new Map<number, Person[]>();
for (const p of people) {
  const v = volumes.find(
    (v) => p.source.page >= v.pageRange[0] && p.source.page <= v.pageRange[1],
  );
  if (!v) continue;
  const list = peopleByVolume.get(v.n) ?? [];
  list.push(p);
  peopleByVolume.set(v.n, list);
}

export default function Longform() {
  const activeId = useActiveId(ids);
  useReveal();
  useEventKeys(ids, activeId, spineIds);

  const activeIndex = Math.max(0, activeId ? ids.indexOf(activeId) : 0);
  const read = events.slice(0, activeIndex + 1);

  // 地图：当前地点取最近一条带地点的事件；还没读到任何地点时先停在故事的起点，
  // 免得开场时地图上一个亮点都没有
  const activePlaceId =
    [...read].reverse().find((e) => e.placeId)?.placeId ?? routeOrder[0] ?? null;
  const visited = routeOrder.filter((id) => read.some((e) => e.placeId === id));

  // 顶部年份只跟时间轴事件走，旁注（1820 年的咖啡因、1400 年的啤酒）不去动它
  const railEvent = [...read].reverse().find((e) => !e.aside) ?? spine[0];
  const activeVolume = events[activeIndex]?.volume ?? 1;
  const progress = read.filter((e) => !e.aside).length;

  // 左侧导轨：当前章跟着时间轴事件走，已读章 = 出现过的章号
  const activeChapter = railEvent?.chapter ?? 1;
  const readChapters = new Set(read.filter((e) => !e.aside).map((e) => e.chapter));

  return (
    <>
      <VolumeRail
        volumes={volumes}
        counts={counts}
        activeVolume={activeVolume}
        progress={progress}
        yearLabel={yearText(railEvent)}
      />

      <TimelineRail nodes={chapterNodes} activeChapter={activeChapter} read={readChapters} />

      {/* 内容区最大 1200px 居中（design-spec.md 四）；md 以上左侧留 64px 给时间轴导轨。
          地图列固定 280px，gap 32px，都是 8 的倍数。
          Hero / Coda / VolumeRail 用同一组宽度，左边距才不会一节一跳。 */}
      <div className="mx-auto max-w-[1200px] px-6 md:pl-16 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
        {/* 地图既是 sticky 元素本身，也是 grid item：中间再套一层 div 的话，
            窄屏上那层 div 只有地图那么高，sticky 立刻就滚出去了。
            桌面端要配 lg:self-start——grid item 默认 stretch 会把自己撑满整行，
            撑满了就没得"粘"了。
            1024px 以下 MiniMap 自己收成右下角悬浮按钮，这一列不占位置。 */}
        <div className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start">
          <MiniMap
            places={places}
            activePlaceId={activePlaceId}
            routeOrder={routeOrder}
            visited={visited}
          />
        </div>

        <main className="lg:col-start-1 lg:row-start-1">
          {volumes.map((v) => {
            const vSpine = spine.filter((e) => e.volume === v.n);
            return (
              <Fragment key={v.n}>
                <VolumeIntro
                  volume={v}
                  count={counts[v.n] ?? 0}
                  asides={events.filter((e) => e.volume === v.n && e.aside)}
                />
                <ol className="relative">
                  <span
                    aria-hidden
                    className="absolute top-4 bottom-4 left-[13px] w-px bg-rule sm:left-[17px]"
                  />
                  {vSpine.map((e) => (
                    <EventCard
                      key={e.id}
                      event={e}
                      place={e.placeId ? placeById.get(e.placeId) : undefined}
                      active={e.id === activeId}
                    />
                  ))}
                </ol>
                <PeopleWall people={peopleByVolume.get(v.n) ?? []} volumeTitle={v.title} />
                {v.n === volumes[volumes.length - 1].n && <DataPanel series={series} />}
              </Fragment>
            );
          })}
        </main>
      </div>
    </>
  );
}
