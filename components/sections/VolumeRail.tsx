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
    <div className="sticky top-0 z-30 border-b border-rule bg-plane/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:gap-4 xl:max-w-[84rem]">
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
                    "data-num block text-[10px] tracking-[0.2em] transition-colors",
                    isActive ? "text-accent" : "text-ink-muted group-hover:text-ink-2",
                  ].join(" ")}
                >
                  {ROMAN[v.n]}
                </span>
                <span
                  className={[
                    "mt-1 block h-[3px] rounded-full transition-all",
                    isActive
                      ? "bg-accent shadow-[0_0_8px_var(--accent)]"
                      : "bg-axis/60 group-hover:bg-axis",
                  ].join(" ")}
                />
              </a>
            );
          })}
        </div>

        <div className="flex shrink-0 items-baseline gap-2 sm:gap-3">
          <span className="hidden max-w-[13rem] truncate text-xs text-ink-2 sm:inline">
            {active ? `第${active.n}卷 · ${active.title}` : ""}
          </span>
          <span className="data-num text-base font-medium text-ink sm:text-lg">
            {yearLabel}
          </span>
          <span className="data-num w-10 text-right text-[11px] text-ink-muted">
            {String(Math.round((progress / total) * 100)).padStart(2, "0")}%
          </span>
        </div>
      </div>
    </div>
  );
}
