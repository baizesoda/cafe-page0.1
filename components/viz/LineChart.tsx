import { scaleLinear, scaleLog } from "d3-scale";
import type { Series } from "@/lib/types";

const W = 580;
const H = 280;
// top 留 30 是给纵轴单位腾地方：单位写在 y=12，第一根刻度线落在 30，才不会叠在一起
const M = { top: 30, right: 30, bottom: 40, left: 66 };

const TICKS = [1e5, 1e6, 1e7, 1e8];

/** 中文短记数：15万 / 1500万 / 1亿 */
function cn(v: number): string {
  if (v >= 1e8) return `${v / 1e8}亿`;
  if (v >= 1e4) return `${v / 1e4}万`;
  return String(v);
}

/**
 * 单条折线，对数纵轴。用对数是因为这组数字跨了三个数量级（15万 → 5000万），
 * 线性轴会把前两个点压到贴底看不见。空心点表示书里只给了倍数、由前一个数字推算。
 */
export default function LineChart({ series: s }: { series: Series }) {
  const x = scaleLinear()
    .domain([s.points[0].year, s.points[s.points.length - 1].year])
    .range([M.left, W - M.right]);
  const y = scaleLog().domain([1e5, 1e8]).range([H - M.bottom, M.top]);

  const path = s.points.map((p, i) => `${i ? "L" : "M"}${x(p.year)},${y(p.value)}`).join("");
  const hasDerived = s.points.some((p) => p.derived);

  return (
    // 图宽封在 580（= viewBox 的原始宽度）：`w-full` 撑到主栏那么宽会把 2px 的线
    // 和 11px 的字一起放大 1.6 倍，线就不细了。
    <figure className="max-w-[580px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`${s.label}折线图，${s.points[0].year}–${s.points[s.points.length - 1].year}，纵轴为对数刻度`}>
        {/* 网格与纵轴刻度 */}
        {TICKS.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke="var(--rule)" strokeWidth={1} strokeDasharray="2 4" />
            <text x={M.left - 8} y={y(t) + 4} textAnchor="end" fontSize={11} className="data-num" fill="var(--ink-muted)">
              {cn(t)}
            </text>
          </g>
        ))}
        <line
          x1={M.left}
          x2={W - M.right}
          y1={H - M.bottom}
          y2={H - M.bottom}
          stroke="var(--axis)"
          strokeWidth={1}
        />

        <path d={`${path}L${x(s.points[s.points.length-1].year)},${H - M.bottom}L${x(s.points[0].year)},${H - M.bottom}Z`} fill="var(--accent)" opacity={0.08} />
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {s.points.map((p, i) => {
          const last = i === s.points.length - 1;
          return (
            <g key={p.year}>
              <title>{`${p.year}：${cn(p.value)}${s.unit}${p.derived ? "（推算）" : ""}${p.note ? ` — ${p.note}` : ""}`}</title>
              {/* 比标记本身大的命中区，方便悬停 */}
              <circle cx={x(p.year)} cy={y(p.value)} r={13} fill="transparent" />
              <circle
                cx={x(p.year)}
                cy={y(p.value)}
                r={5}
                fill={p.derived ? "var(--surface)" : "var(--accent)"}
                stroke={p.derived ? "var(--accent)" : "var(--surface)"}
                strokeWidth={2}
              />
              <text
                x={x(p.year) + (last ? -2 : 2)}
                y={y(p.value) - 12}
                textAnchor={last ? "end" : "start"}
                fontSize={11}
                className="data-num"
                fill="var(--ink-2)"
              >
                {cn(p.value)}
              </text>
              <text
                x={x(p.year)}
                y={H - M.bottom + 16}
                textAnchor="middle"
                fontSize={11}
                className="data-num"
                fill="var(--ink-muted)"
              >
                {p.year}
              </text>
            </g>
          );
        })}
        <text x={M.left - 8} y={12} textAnchor="end" fontSize={11} className="lab-label" fill="var(--ink-muted)">
          {s.unit}
        </text>
      </svg>

      <figcaption className="mt-2 space-y-2 text-[11px] text-ink-muted">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block size-2 rounded-full bg-accent" />
            书中明写的数字
          </span>
          {hasDerived && (
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block size-2 rounded-full border-2 border-accent bg-surface"
              />
              由倍数推算
            </span>
          )}
          <span className="data-num">LOG SCALE · P.{s.source.page}</span>
        </div>
        {s.caveat && <p className="max-w-2xl leading-relaxed">{s.caveat}</p>}
      </figcaption>

      <details className="mt-3 text-xs text-ink-2">
        <summary className="cursor-pointer text-ink-muted">数据表</summary>
        <table className="mt-2 w-full border-collapse text-left">
          <thead>
            <tr className="text-ink-muted">
              <th className="border-b border-rule py-1 pr-3 font-normal">年份</th>
              <th className="border-b border-rule py-1 pr-3 font-normal">{s.label}（{s.unit}）</th>
              <th className="border-b border-rule py-1 font-normal">出处</th>
            </tr>
          </thead>
          <tbody>
            {s.points.map((p) => (
              <tr key={p.year}>
                <td className="border-b border-rule py-1 pr-3 tabular-nums">{p.year}</td>
                <td className="border-b border-rule py-1 pr-3 tabular-nums">
                  {p.value.toLocaleString("zh-CN")}
                  {p.derived && " ※"}
                </td>
                <td className="border-b border-rule py-1 leading-relaxed">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
