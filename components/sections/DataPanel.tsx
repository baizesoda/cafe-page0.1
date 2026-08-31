import type { Series } from "@/lib/types";
import LineChart from "@/components/viz/LineChart";

/**
 * 全书唯一一处能画成图的可靠数字。书是叙事史，硬数据很少：
 * 凑不出可信的数就不画，不放"看起来像"的曲线。
 */
export default function DataPanel({ series }: { series: Series[] }) {
  if (!series.length) return null;
  return (
    <section className="reveal border-t border-rule py-12">
      <h3 className="lab-label">
        <span className="en">DATA</span> · <span className="zh">书里为数不多的硬数字</span>
      </h3>
      <div className="mt-6 space-y-8">
        {series.map((s) => (
          <div key={s.id}>
            <h4 className="mb-4 font-display text-[19px] font-semibold text-ink">{s.label}</h4>
            <LineChart series={s} />
          </div>
        ))}
      </div>
    </section>
  );
}
