"use client";

import { useEffect, useRef, useState } from "react";
import type { MapData, Place } from "@/lib/types";
import mapDataJson from "@/content/map.json";

const map = mapDataJson as unknown as MapData;

const MIN_K = 1;
const MAX_K = 6;

type View = { k: number; cx: number; cy: number };
const HOME: View = { k: 1, cx: map.width / 2, cy: map.height / 2 };

/** 放大后允许平移，但窗口不能拖出地图外 */
function clampView({ k, cx, cy }: View): View {
  k = Math.min(MAX_K, Math.max(MIN_K, k));
  const hw = map.width / (2 * k);
  const hh = map.height / (2 * k);
  return {
    k,
    cx: Math.min(map.width - hw, Math.max(hw, cx)),
    cy: Math.min(map.height - hh, Math.max(hh, cy)),
  };
}

type Props = {
  places: Place[];
  /** 当前事件所在地点，没有就保持上一个 */
  activePlaceId: string | null;
  /** 全书出场顺序的地点 id（去重后），路线就按这个顺序连 */
  routeOrder: string[];
  /** 已经读到的地点 id，是 routeOrder 的前缀 */
  visited: string[];
};

/**
 * 侧边小地图。陆地轮廓和所有坐标都在 tools/build-map.mjs 里投影好了，
 * 这里只是把预算好的路径和像素坐标画出来——客户端不需要 d3-geo。
 * 只画海岸线剪影和港口点，不画国界：现代国界描 17 世纪的故事是不诚实的。
 *
 * 缩放用 <g> 的 transform 做（view 里是"窗口中心 + 倍数"），
 * 这样 CSS 过渡能接上，按钮/滚轮/双击缩放都有动画。
 */
export default function MiniMap({ places, activePlaceId, routeOrder, visited }: Props) {
  const byId = new Map(places.map((p) => [p.id, p]));
  const visitedSet = new Set(visited);
  const active = activePlaceId ? byId.get(activePlaceId) : undefined;
  const activeXY = activePlaceId ? map.points[activePlaceId] : undefined;

  // 路线：按出场顺序两两相连。所有线段都画出来，只用透明度区分已走过/未走到，
  // 滚动时靠 CSS 过渡淡入（reduced-motion 下过渡被 globals.css 关掉）。
  // 走过的段落压到 0.28：读到第五卷时已经有二十多段跨大西洋的线，
  // 全都画满会变成一团毛线；刚走完的那一段留在 0.9，才看得出"现在在往哪走"。
  const hops = routeOrder.filter((id) => map.points[id]);
  const activeHop = activePlaceId ? hops.indexOf(activePlaceId) : -1;
  const segments: { key: string; d: string; opacity: number; width: number }[] = [];
  for (let i = 1; i < hops.length; i++) {
    const a = map.points[hops[i - 1]];
    const b = map.points[hops[i]];
    const shown = visitedSet.has(hops[i - 1]) && visitedSet.has(hops[i]);
    const current = i === activeHop;
    segments.push({
      key: `${hops[i - 1]}-${hops[i]}-${i}`,
      d: `M${a[0]},${a[1]}L${b[0]},${b[1]}`,
      opacity: current ? 0.9 : shown ? 0.28 : 0,
      width: current ? 2 : 1.5,
    });
  }

  const [view, setView] = useState<View>(HOME);
  const [dragging, setDragging] = useState(false);
  /** 面板本身的大小：侧栏小图 → 半屏 → 铺满。改的是窗口，不是里面的倍数 */
  const [size, setSize] = useState<"sm" | "md" | "lg">("sm");
  /** viewBox 单位 → 屏幕像素的换算系数：窗口变大时点和字才不会跟着放大 */
  const [unit, setUnit] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const lastPtr = useRef<{ x: number; y: number } | null>(null);

  /** 屏幕像素 → 地图原始坐标（缩放后窗口里的坐标） */
  const toMap = (clientX: number, clientY: number, v: View) => {
    const r = svgRef.current!.getBoundingClientRect();
    const w = map.width / v.k;
    const h = map.height / v.k;
    return {
      x: v.cx - w / 2 + ((clientX - r.left) / r.width) * w,
      y: v.cy - h / 2 + ((clientY - r.top) / r.height) * h,
    };
  };

  /** 以 (px, py) 为锚点缩放：锚点在原始坐标系里的位置保持不变；不传就绕窗口中心 */
  const zoomAt = (factor: number, px?: number, py?: number) =>
    setView((v) => {
      const k = Math.min(MAX_K, Math.max(MIN_K, v.k * factor));
      const ax = px ?? v.cx;
      const ay = py ?? v.cy;
      return clampView({
        k,
        cx: ax - (ax - v.cx) * (v.k / k),
        cy: ay - (ay - v.cy) * (v.k / k),
      });
    });

  // 滚轮缩放要 preventDefault 拦住页面滚动，React 的 onWheel 是 passive 的拦不住，得自己挂
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault();
      const p = toMap(ev.clientX, ev.clientY, view);
      zoomAt(ev.deltaY < 0 ? 1.25 : 0.8, p.x, p.y);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [view, size]);

  // 面板宽度变了就重算 u：svg 是 viewBox 缩放的，容器越宽 1 单位画出来越大，
  // 不补偿的话侧栏里合适的点径与字号，放大到 1200px 就成了三倍大
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const measure = () => {
      const w = svg.getBoundingClientRect().width;
      if (w > 0) setUnit(map.width / w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [size]);

  // 放大成浮层时：Esc 收回，并锁住背景滚动（否则滚轮会穿透到长卷上）
  useEffect(() => {
    if (size === "sm") return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setSize("sm");
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [size]);

  const k = view.k;
  const transform = `translate(${map.width / 2 - k * view.cx} ${map.height / 2 - k * view.cy}) scale(${k})`;

  const zoomBtn =
    "flex size-6 items-center justify-center rounded-full border border-rule bg-surface/90 text-xs leading-none text-ink-2 shadow-sm backdrop-blur transition-colors hover:text-ink disabled:opacity-40";

  const panel = (
    <figure className="relative rounded-lg border border-rule bg-surface p-3">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${map.width} ${map.height}`}
        className="map-viewport h-auto w-full select-none"
        data-dragging={dragging || undefined}
        role="img"
        aria-label={
          active ? `世界地图，当前地点：${active.name}` : "世界地图，咖啡传播路线"
        }
        onPointerDown={(ev) => {
          ev.currentTarget.setPointerCapture(ev.pointerId);
          lastPtr.current = { x: ev.clientX, y: ev.clientY };
          setDragging(true);
        }}
        onPointerMove={(ev) => {
          if (!lastPtr.current) return;
          const r = svgRef.current!.getBoundingClientRect();
          const dxPx = ev.clientX - lastPtr.current.x;
          const dyPx = ev.clientY - lastPtr.current.y;
          lastPtr.current = { x: ev.clientX, y: ev.clientY };
          setView((v) =>
            clampView({
              ...v,
              cx: v.cx - (dxPx / r.width) * (map.width / v.k),
              cy: v.cy - (dyPx / r.height) * (map.height / v.k),
            }),
          );
        }}
        onPointerUp={() => {
          lastPtr.current = null;
          setDragging(false);
        }}
        onPointerCancel={() => {
          lastPtr.current = null;
          setDragging(false);
        }}
        onDoubleClick={(ev) => {
          const p = toMap(ev.clientX, ev.clientY, view);
          zoomAt(1.8, p.x, p.y);
        }}
      >
        {/* 所有地理内容都在这一层里缩放；点径、线宽、字号除以 k 反向抵消，
            放大后标注保持原来的视觉尺寸 */}
        <g className="map-canvas" style={{ transform }}>
          <path d={map.landPath} fill="var(--land)" stroke="none" />

          <g strokeLinecap="round" fill="none">
            {segments.map((s) => (
              <path
                key={s.key}
                className="route-draw"
                d={s.d}
                stroke="var(--accent-2)"
                strokeWidth={(s.width * unit) / k}
                opacity={s.opacity}
              />
            ))}
          </g>

          <g>
            {places.map((p) => {
              const xy = map.points[p.id];
              if (!xy) return null;
              const isActive = p.id === activePlaceId;
              const seen = visitedSet.has(p.id);
              if (isActive) return null; // 当前点单独画在最上层
              return (
                <circle
                  key={p.id}
                  cx={xy[0]}
                  cy={xy[1]}
                  r={((seen ? 2.6 : 1.8) * unit) / k}
                  fill={seen ? "var(--accent-2)" : "var(--axis)"}
                  stroke="var(--surface)"
                  strokeWidth={seen ? (2 * unit) / k : 0}
                />
              );
            })}
          </g>

          {activeXY && active && (
            <g>
              {/* 呼吸圈 + 十字准线：一眼找到“现在在哪” */}
              <circle
                className="pulse-ring"
                cx={activeXY[0]}
                cy={activeXY[1]}
                r={(5 * unit) / k}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={(1 * unit) / k}
              />
              <g stroke="var(--accent)" strokeWidth={(0.6 * unit) / k} opacity={0.5}>
                <line x1={activeXY[0] - (9 * unit) / k} x2={activeXY[0] - (6 * unit) / k} y1={activeXY[1]} y2={activeXY[1]} />
                <line x1={activeXY[0] + (6 * unit) / k} x2={activeXY[0] + (9 * unit) / k} y1={activeXY[1]} y2={activeXY[1]} />
                <line x1={activeXY[0]} x2={activeXY[0]} y1={activeXY[1] - (9 * unit) / k} y2={activeXY[1] - (6 * unit) / k} />
                <line x1={activeXY[0]} x2={activeXY[0]} y1={activeXY[1] + (6 * unit) / k} y2={activeXY[1] + (9 * unit) / k} />
              </g>
              <circle
                cx={activeXY[0]}
                cy={activeXY[1]}
                r={(4.5 * unit) / k}
                fill="var(--accent)"
                stroke="var(--surface)"
                strokeWidth={(2 * unit) / k}
              />
              <text
                x={activeXY[0] + (activeXY[0] > map.width * 0.72 ? (-8 * unit) / k : (8 * unit) / k)}
                y={activeXY[1] + (3.5 * unit) / k}
                textAnchor={activeXY[0] > map.width * 0.72 ? "end" : "start"}
                fill="var(--ink)"
                fontSize={(10 * unit) / k}
                paintOrder="stroke"
                stroke="var(--surface)"
                strokeWidth={(3 * unit) / k}
                strokeLinejoin="round"
              >
                {active.name}
              </text>
            </g>
          )}
        </g>
      </svg>

      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {/* 窗口本身变大/变小：sm 侧栏 → md 半屏浮层 → lg 铺满 */}
        <button
          type="button"
          aria-label="放大地图窗口"
          title={size === "sm" ? "放大窗口" : "再放大"}
          className={zoomBtn}
          disabled={size === "lg"}
          onClick={() => setSize((s) => (s === "sm" ? "md" : "lg"))}
        >
          ⤢
        </button>
        <button
          type="button"
          aria-label="缩小地图窗口"
          title="缩小窗口"
          className={zoomBtn}
          disabled={size === "sm"}
          onClick={() => setSize((s) => (s === "lg" ? "md" : "sm"))}
        >
          ⤡
        </button>
        <span aria-hidden className="my-0.5 h-px bg-rule" />
        <button type="button" aria-label="放大地图内容" title="放大内容" className={zoomBtn} onClick={() => zoomAt(1.6)}>
          ＋
        </button>
        <button
          type="button"
          aria-label="缩小地图内容"
          title="缩小内容"
          className={zoomBtn}
          disabled={k <= MIN_K}
          onClick={() => zoomAt(1 / 1.6)}
        >
          －
        </button>
        {k > MIN_K && (
          <button type="button" aria-label="复位地图" title="复位" className={zoomBtn} onClick={() => setView(HOME)}>
            ⟲
          </button>
        )}
      </div>

      <figcaption className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-accent" aria-hidden />
          当前
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-accent-2" aria-hidden />
          已到达 <span className="data-num">{visited.length}/{places.length}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-axis" aria-hidden />
          未到达
        </span>
        <span className="lab-label w-full">
          {size === "sm" ? "⤢ 放大窗口" : "ESC 收回窗口"} · ZOOM ×{k.toFixed(1)} · 滚轮/双击缩放 · 拖拽平移
        </span>
      </figcaption>
      <p className="sr-only" aria-live="polite">
        {active ? `当前地点：${active.name}` : ""}
      </p>
    </figure>
  );

  if (size === "sm") return panel;

  // 放大后脱离侧栏，浮在长卷之上：点背景或按 Esc 收回
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-plane/80 p-4 backdrop-blur-sm"
      onClick={() => setSize("sm")}
    >
      <div
        className={size === "lg" ? "w-full max-w-[1200px]" : "w-full max-w-[760px]"}
        onClick={(ev) => ev.stopPropagation()}
      >
        {panel}
      </div>
    </div>
  );
}
