"use client";

import { Fragment } from "react";
import eventsJson from "@/content/events.json";
import peopleJson from "@/content/people.json";
import placesJson from "@/content/places.json";
import volumesJson from "@/content/volumes.json";
import seriesJson from "@/content/series.json";
import { yearText, type Event, type Person, type Place, type Series, type Volume } from "@/lib/types";
import { useActiveId, useEventKeys, useReveal } from "@/lib/useActiveEvent";
import MiniMap from "@/components/viz/MiniMap";
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

  return (
    <>
      <VolumeRail
        volumes={volumes}
        counts={counts}
        activeVolume={activeVolume}
        progress={progress}
        yearLabel={yearText(railEvent)}
      />

      {/* 84rem：xl 以上要同时放下交错的两列卡片和 300px 的地图列，
          6xl（72rem）会把卡片挤到 340px 左右，中文一行只剩二十个字。
          Hero / Coda / VolumeRail 用同一组宽度，左边距才不会一节一跳。 */}
      <div className="mx-auto max-w-6xl px-4 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 xl:max-w-[84rem]">
        {/* 地图既是 sticky 元素本身，也是 grid item：中间再套一层 div 的话，
            窄屏上那层 div 只有地图那么高，sticky 立刻就滚出去了。
            桌面端要配 lg:self-start——grid item 默认 stretch 会把自己撑满整行，
            撑满了就没得"粘"了。 */}
        <div
          className={[
            "sticky top-[2.6rem] z-20 -mx-4 border-b border-rule bg-plane/90 px-4 py-2 backdrop-blur",
            "lg:col-start-2 lg:row-start-1 lg:top-20 lg:mx-0 lg:self-start lg:border-0",
            "lg:bg-transparent lg:px-0 lg:backdrop-blur-none",
          ].join(" ")}
        >
          <div className="mx-auto max-w-[240px] lg:max-w-none">
            <MiniMap
              places={places}
              activePlaceId={activePlaceId}
              routeOrder={routeOrder}
              visited={visited}
            />
          </div>
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
                    className="absolute top-3 bottom-3 left-[13px] w-px bg-rule sm:left-[17px] xl:left-1/2"
                  />
                  {vSpine.map((e, i) => (
                    <EventCard
                      key={e.id}
                      event={e}
                      place={e.placeId ? placeById.get(e.placeId) : undefined}
                      active={e.id === activeId}
                      side={i % 2 === 0 ? "left" : "right"}
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
