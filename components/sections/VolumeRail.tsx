"use client";

import type { Volume } from "@/lib/types";

const ROMAN = ["", "I", "II", "III", "IV", "V"];

type Props = {
  volumes: Volume[];
  /** 每卷在时间轴上占多少条事件，用来给刻度分配宽度 */
  counts: Record<number, number>;
  activeVolume: number;
  /** 已读到的时间轴事件数 / 总数 */
  progress: number;
  yearLabel: string;
};

/**
 * 顶部 sticky 细进度条：五卷按事件条数分段，读到哪一段就填到哪里，
 * 右侧的年份跟着当前事件跳动。
 */
export default function VolumeRail({
  volumes,
  counts,
  activeVolume,
  progress,
  yearLabel,
}: Props) {
  const total = volumes.reduce((s, v) => s + (counts[v.n] ?? 0), 0) || 1;
  const active = volumes.find((v) => v.n === activeVolume);

  return (
    /* 规范禁止 backdrop-filter，这里用不透明纸色 + 1px 下边线压住底下滚过去的内容 */
    <div className="sticky top-0 z-40 border-b border-rule bg-plane">
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-6 py-2 md:pl-16">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {volumes.map((v) => {
            const n = counts[v.n] ?? 0;
            const isActive = v.n === activeVolume;
            return (
              <a
                key={v.n}
                href={`#volume-${v.n}`}
                title={`第${v.n}卷 ${v.title} · ${v.era}`}
                style={{ flexGrow: Math.max(n, 1) }}
                className="group min-w-0 shrink"
              >
                <span
                  className={[
                    "block font-mono text-[12px] tracking-[0.12em] transition-colors duration-200",
                    isActive ? "text-gold" : "text-ink-muted group-hover:text-ink",
                  ].join(" ")}
                >
                  {ROMAN[v.n]}
                </span>
                {/* 已读段落红褐，未读墨蓝 40%；规范禁止发光，所以这里没有 shadow */}
                <span
                  className={[
                    "mt-1 block h-0.5 transition-colors duration-200",
                    isActive ? "bg-accent" : "bg-axis group-hover:bg-data/60",
                  ].join(" ")}
                />
              </a>
            );
          })}
        </div>

        <div className="flex shrink-0 items-baseline gap-4">
          <span className="hidden max-w-[13rem] truncate text-[13px] text-ink-muted sm:inline">
            {active ? `第${active.n}卷 · ${active.title}` : ""}
          </span>
          <span className="data-num text-lg font-medium">{yearLabel}</span>
          <span className="data-num w-10 text-right text-[12px]">
            {String(Math.round((progress / total) * 100)).padStart(2, "0")}%
          </span>
        </div>
      </div>
    </div>
  );
}
