"use client";

import type { ChapterNode } from "@/lib/types";
import { splitYear } from "@/lib/types";

type Props = {
  /** 全书 25 章，按章号升序；没有事件的章只画刻度不可点 */
  nodes: ChapterNode[];
  /** 当前读到的章号 */
  activeChapter: number;
  /** 已读到的章号集合 */
  read: Set<number>;
};

/**
 * 左侧垂直时间轴导轨（design-spec.md 5.1）。
 * 1px 墨蓝主轴串起全书 25 章，每章一个节点：已读实心红褐、未读空心、当前带同心环。
 * 进度、位置、全长三件事一眼可知——这是整页最强的"精密制图"符号。
 * 只在 md 以上出现；768px 以下由顶部的 VolumeRail 承担横向进度条的角色。
 */
export default function TimelineRail({ nodes, activeChapter, read }: Props) {
  return (
    <nav
      aria-label="全书章节导轨"
      className="pointer-events-none fixed top-1/2 left-0 z-30 hidden w-16 -translate-y-1/2 md:block"
    >
      {/* 主轴线：1px 墨蓝，透明度 50% */}
      <span
        aria-hidden
        className="absolute top-0 bottom-0 left-8 w-px bg-data/50"
      />
      <ol className="relative flex flex-col justify-between gap-4">
        {nodes.map((node) => {
          const isActive = node.n === activeChapter;
          const isRead = read.has(node.n);
          const dot = isActive
            ? "size-3 bg-accent shadow-[0_0_0_4px_var(--plane),0_0_0_5px_var(--accent)]"
            : isRead
              ? "size-2 bg-accent"
              : "size-2 border-[1.5px] border-axis bg-plane";
          return (
            <li key={node.n} className="relative flex h-2 items-center">
              {/* 刻度短线：节点左侧 6px */}
              <span
                aria-hidden
                className="absolute left-[18px] h-px w-1.5 bg-data/30"
              />
              {node.id ? (
                <a
                  href={`#${node.id}`}
                  className="rail-node pointer-events-auto absolute left-8 flex -translate-x-1/2 items-center outline-none"
                  aria-current={isActive || undefined}
                >
                  <span aria-hidden className={`spine-dot block rounded-full ${dot}`} />
                  <span className="rail-tip pointer-events-none absolute left-4 flex items-baseline gap-2 border border-rule bg-plane px-2 py-1 whitespace-nowrap">
                    {/* 年份里可能带中文（"年代不详（也门传说）"），中文部分字距必须归零 */}
                    <span className="data-num text-[11px]">
                      {splitYear(node.year)[0]}
                      {splitYear(node.year)[1] && (
                        <span className="zh">{splitYear(node.year)[1]}</span>
                      )}
                    </span>
                    <span className="text-[11px] text-ink">{node.title}</span>
                  </span>
                  <span className="sr-only">
                    第 {node.n} 章 {node.year} {node.title}
                  </span>
                </a>
              ) : (
                <span
                  aria-hidden
                  className={`absolute left-8 block -translate-x-1/2 rounded-full ${dot}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
